/**
 * @fileoverview Main build script for uCss. Replaces build.sh.
 * Handles bundling, minification, documentation generation, and verification.
 * 
 * @description This script orchestrates the complete build process:
 * 1. Parses command-line arguments for source ref and target directory
 * 2. Bundles CSS files by resolving @import statements recursively
 * 3. Generates cleaned and minified versions of all CSS
 * 4. Creates modular builds for each lib/ module
 * 5. Renders README.md files to static HTML documentation
 * 6. Verifies build outputs meet minimum size requirements
 * 7. Compresses all outputs with Gzip and Brotli
 * 8. Runs security audit
 * 
 * @example
 * // Build from current working directory to 'latest' folder
 * node scripts/build.js latest
 * 
 * @example
 * // Build from specific git ref to custom output
 * node scripts/build.js --source main stable
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const { marked } = require('marked'); // Ensure 'marked' is installed

// --- Configuration ---
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DIST_ROOT = path.join(PROJECT_ROOT, 'dist');


// --- Helper Functions ---

/**
 * Execute a shell command and return stdout as string.
 * @param {string} cmd - Shell command to execute
 * @param {object} [options={}] - Options to pass to execSync
 * @returns {string} Trimmed stdout from command, or empty string on error
 * @example
 * const branch = exec('git rev-parse --abbrev-ref HEAD');
 */
function exec(cmd, options = {}) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], ...options }).trim();
    } catch (e) {
        return '';
    }
}

/**
 * Read file content, either from local FS or via git show if a source ref is provided.
 * @param {string} filePath - Absolute path to the file to read
 * @param {string} [sourceRef] - Optional git reference (branch, tag, commit) to read from
 * @returns {string} File contents, or empty string if file doesn't exist or read fails
 * @example
 * // Read from local filesystem
 * const css = readFile('/path/to/file.css');
 * 
 * @example
 * // Read from git ref
 * const css = readFile('/path/to/file.css', 'main');
 */
function readFile(filePath, sourceRef) {
    if (sourceRef) {
        // filePath is absolute, we need relative to project root for git show
        const relPath = path.relative(PROJECT_ROOT, filePath);
        // git show REF:path
        // Note: git expects forward slashes even on Windows usually, but we'll see.
        const gitPath = relPath.replace(/\\/g, '/');
        try {
            return execSync(`git show "${sourceRef}:${gitPath}"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        } catch (e) {
            console.error(`Error reading ${gitPath} from ${sourceRef}`);
            return '';
        }
    } else {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
        return '';
    }
}

/**
 * Minify CSS content by removing comments, collapsing whitespace, and removing
 * spaces around delimiters. Ported from legacy minify.js and clean.js scripts.
 * @param {string} css - CSS content to minify
 * @returns {string} Minified CSS suitable for production
 * @example
 * const minified = minifyCss('.btn { padding: 1rem; }');
 * // Returns: '.btn{padding:1rem;}'
 */
function minifyCss(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Collapse whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around delimiters
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*>\s*/g, '>')
        .trim();
}

/**
 * Clean CSS content by removing comments, limiting consecutive empty lines,
 * and trimming trailing whitespace. Ported from legacy clean.js script.
 * Preserves formatting and readability unlike minification.
 * @param {string} css - CSS content to clean
 * @returns {string} Cleaned CSS with preserved formatting
 * @example
 * const cleaned = cleanCss(cssWithComments);
 */
function cleanCss(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/(\n\s*){3,}/g, '\n\n')  // Max 1 empty line
        .replace(/[ \t]+$/gm, '')         // Trim trailing space
        .trim() + '\n';
}

/**
 * Recursively bundle CSS files by resolving @import statements.
 * Ported from legacy bundle.js script. Handles both lib/ absolute imports
 * and relative imports. Detects circular dependencies.
 * @param {string} entryFile - Absolute path to the entry CSS file
 * @param {string} [sourceRef] - Optional git reference to read files from
 * @returns {string} Bundled CSS content with all imports resolved
 * @throws Will not throw, but returns error comments for circular deps or missing files
 * @example
 * const bundled = bundleCss('/path/to/src/u.css');
 */
function bundleCss(entryFile, sourceRef) {
    const stack = new Set();
    const visited = new Set(); // To avoid processing same file multiple times? No, bundle.js didn't use this.

    function _bundle(currentPath) {
        if (stack.has(currentPath)) {
            return `/* Cycle detected: ${path.relative(PROJECT_ROOT, currentPath)} */`;
        }
        stack.add(currentPath);

        let content = readFile(currentPath, sourceRef);
        if (!content) {
            return `/* Missing or empty: ${path.relative(PROJECT_ROOT, currentPath)} */`;
        }

        const currentDir = path.dirname(currentPath);
        const importRegex = /@import\s+['"]([^'"]+)['"];/g;

        const replaced = content.replace(importRegex, (match, importPath) => {
            let resolvedPath;
            if (importPath.startsWith('lib/')) {
                resolvedPath = path.join(SRC_DIR, importPath);
            } else {
                resolvedPath = path.resolve(currentDir, importPath);
            }
            return _bundle(resolvedPath);
        });

        stack.delete(currentPath);
        return replaced;
    }

    return _bundle(entryFile);
}

// --- Main Execution ---

/**
 * Main build orchestration function.
 * Parses arguments, determines output directory, builds CSS bundles,
 * generates documentation, verifies outputs, and triggers compression.
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Exits process with code 1 on verification failure
 */
async function main() {
    // 1. Parse Arguments
    const args = process.argv.slice(2);
    let sourceRef = '';
    let targetDirArg = '';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--source') {
            sourceRef = args[i + 1];
            i++;
        } else {
            targetDirArg = args[i];
        }
    }

    // 2. Determine Target Directory
    let outputDirName = '';
    if (targetDirArg) {
        // User provided logic
        // If implied by branch
        // For simplicity, we stick to the logic: if arg provided, use it as sub-folder unless it's main/stable logic
        // But the bash script was complex here. Let's simplify: 
        // If targetDirArg is provided, use it.
        // Wait, bash script logic:
        // if no target_dir:
        //    if source_ref: check branch names or use ref name
        //    else: check current branch

        outputDirName = targetDirArg; // Fallback? 
    }

    // Replicating Bash Logic precisely
    if (!outputDirName) {
        let branch = 'unknown';
        if (sourceRef) {
            if (sourceRef === 'main' || sourceRef === 'origin/main') branch = 'main';
            else if (sourceRef === 'dev' || sourceRef === 'origin/dev') branch = 'dev';
            else {
                // Use ref name (cleaned)
                outputDirName = `preview/${sourceRef.replace(/\//g, '-')}`;
            }
        } else {
            branch = exec('git rev-parse --abbrev-ref HEAD') || 'unknown';
        }

        if (!outputDirName) {
            if (branch === 'main') outputDirName = 'stable';
            else if (branch === 'dev') outputDirName = 'latest';
            else {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16); // YYYY-MM-DD-THH-MM
                outputDirName = `preview/${sourceRef ? sourceRef.replace(/\//g, '-') : timestamp}`;
            }
        }
    }

    const outputDir = path.join(DIST_ROOT, outputDirName);
    console.log(`Targeting: ${outputDir}`);
    console.log(`Reading source from: ${sourceRef || 'Local filesystem'}`);

    // 3. Clean and Prepare
    if (fs.existsSync(outputDir)) {
        console.log(`Cleaning ${outputDirName}...`);
        fs.rmSync(outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(path.join(outputDir, 'lib'), { recursive: true });

    // 4. Server Files (.htaccess)
    const htaccessSrc = path.join(PROJECT_ROOT, 'server/.htaccess.template');
    if (fs.existsSync(htaccessSrc)) {
        fs.copyFileSync(htaccessSrc, path.join(DIST_ROOT, '.htaccess'));
        console.log('  ✓ updated .htaccess');
    }

    // 5. Build u.css
    console.log(`Building ${outputDirName}/u.css...`);
    const uCssPath = path.join(SRC_DIR, 'u.css');
    const uCssContent = bundleCss(uCssPath, sourceRef);

    fs.writeFileSync(path.join(outputDir, 'u.css'), uCssContent);
    fs.writeFileSync(path.join(outputDir, 'u.clean.css'), cleanCss(uCssContent));
    fs.writeFileSync(path.join(outputDir, 'u.min.css'), minifyCss(uCssContent));

    // 6. Modular Builds
    console.log('Building modular lib files...');
    // Find all .css files in src/lib (non-recursive for top level modules)
    // We need to list files using git or fs
    let libFiles = [];
    if (sourceRef) {
        const out = exec(`git ls-tree --name-only "${sourceRef}:src/lib/"`);
        libFiles = out.split('\n').filter(f => f.endsWith('.css')).map(f => path.join(SRC_DIR, 'lib', f));
    } else {
        const libDir = path.join(SRC_DIR, 'lib');
        if (fs.existsSync(libDir)) {
            libFiles = fs.readdirSync(libDir).filter(f => f.endsWith('.css')).map(f => path.join(libDir, f));
        }
    }

    for (const libFile of libFiles) {
        const modName = path.basename(libFile, '.css');
        const targetLibDir = path.join(outputDir, 'lib', modName);
        fs.mkdirSync(targetLibDir, { recursive: true });

        // Bundle main module file
        console.log(`  - Bundle: ${modName}.css`);
        const modContent = bundleCss(libFile, sourceRef);
        const targetLibFile = path.join(outputDir, 'lib', `${modName}.css`);

        fs.writeFileSync(targetLibFile, modContent);
        fs.writeFileSync(path.join(outputDir, 'lib', `${modName}.clean.css`), cleanCss(modContent));
        fs.writeFileSync(path.join(outputDir, 'lib', `${modName}.min.css`), minifyCss(modContent));

        // Copy individual files in src/lib/{modName}
        // Need to list them
        const subDirRel = `src/lib/${modName}`;
        const subDirPath = path.join(PROJECT_ROOT, subDirRel);

        let individualFiles = [];
        if (sourceRef) {
            const out = exec(`git ls-tree -r --name-only "${sourceRef}"`);
            // filter for lines starting with subDirRel
            individualFiles = out.split('\n').filter(line => line.startsWith(subDirRel) && line.endsWith('.css'))
                .map(line => path.join(PROJECT_ROOT, line));
        } else {
            if (fs.existsSync(subDirPath)) {
                individualFiles = fs.readdirSync(subDirPath).filter(f => f.endsWith('.css'))
                    .map(f => path.join(subDirPath, f));
            }
        }

        for (const leaf of individualFiles) {
            const filename = path.basename(leaf);
            const content = readFile(leaf, sourceRef);
            fs.writeFileSync(path.join(targetLibDir, filename), content);
            fs.writeFileSync(path.join(targetLibDir, filename.replace('.css', '.clean.css')), cleanCss(content));
            fs.writeFileSync(path.join(targetLibDir, filename.replace('.css', '.min.css')), minifyCss(content));
        }
    }

    // 7. Docs Generation
    console.log('Generating documentation...');

    function generateHtml(mdPath, outPath, title) {
        const md = readFile(mdPath, sourceRef);
        if (!md) return;

        let htmlContent = '';
        try {
            // marked is sync
            // Custom renderer for heading IDs
            const renderer = {
                heading(text, depth) {
                    try {
                        const escapedText = String(text).replace(/<[^>]*>/g, '').toLowerCase().replace(/[^\w]+/g, '-');
                        return `<h${depth} id="${escapedText}">${text}</h${depth}>`;
                    } catch (e) {
                        console.error('Heading Error:', e.message, 'Text:', text);
                        return `<h${depth}>${text}</h${depth}>`;
                    }
                },
                link(href, title, text) {
                    try {
                        const hrefStr = String(href);
                        // Fix Root -> src/ links to point to the correct output dir (e.g. "stable/")
                        if (mdPath === path.join(PROJECT_ROOT, 'README.md')) {
                            if (hrefStr.startsWith('./src/') || hrefStr.startsWith('src/')) {
                                const newHref = hrefStr.replace(/^(\.\/)?src\//, `./${outputDirName}/`);
                                return `<a href="${newHref}"${title ? ` title="${title}"` : ''}>${text}</a>`;
                            }
                        }
                        return `<a href="${hrefStr}"${title ? ` title="${title}"` : ''}>${text}</a>`;
                    } catch (e) {
                        return `<a href="${href}">${text}</a>`;
                    }
                }
            };
            marked.use({ renderer });
            htmlContent = marked.parse(md, { gfm: true, breaks: false });
        } catch (e) {
            console.error(`Error parsing markdown for ${mdPath}: ${e.message}`);
            return;
        }

        const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="uCss - Modern, mobile-first, pure CSS framework with zero dependencies">
    <title>${title}</title>
    <link rel="stylesheet" href="${path.relative(path.dirname(outPath), path.join(outputDir, 'lib/config.css'))}">
    <link rel="stylesheet" href="${path.relative(path.dirname(outPath), path.join(outputDir, 'u.min.css'))}">
    <style>
        /* Minimal doc-specific styles */
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; line-height: 1.5; color: var(--tx); }
        code { background: var(--srf); padding: 0.2em 0.4em; border-radius: 0.375rem; font-family: ui-monospace, monospace; font-size: 0.875em; }
        pre { background: var(--srf); padding: 1rem; overflow-x: auto; border-radius: 0.375rem; border: 1px solid var(--out); }
        pre code { background: none; padding: 0; font-size: 0.875rem; }
        table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        th, td { border: 1px solid var(--out); padding: 0.5rem 1rem; text-align: left; }
        th { background: var(--srf); font-weight: 600; }
        .alert { padding: 1rem; margin: 1rem 0; border-left: 4px solid; border-radius: 0.375rem; }
        .alert strong { display: block; margin-bottom: 0.5rem; }
        .alert-note { background: var(--sp-lt); border-color: var(--out); }
        .alert-tip { background: var(--sp); border-color: var(--out); }
        .alert-important { background: var(--sp-bd); border-color: var(--out); }
        .alert-warning { background: var(--alr); border-color: var(--out); }
        .alert-caution { background: var(--alr); border-color: var(--out); }
        a { color: var(--t); text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: none; border-top: 1px solid var(--out); margin: 2rem 0; }
    </style>
</head>
<body>
    <section class="s" style="--sc-max-w: 48rem; --scc-gap: .75rem;">
        <div class="sc">
          <div>
${htmlContent}
          </div>
        </div>
    </section>
</body>
</html>`;
        fs.writeFileSync(outPath, template);
        console.log(`  - Docs: ${path.relative(DIST_ROOT, outPath)}`);
    }

    // Root README
    if (fs.existsSync(path.join(PROJECT_ROOT, 'README.md'))) {
        generateHtml(path.join(PROJECT_ROOT, 'README.md'), path.join(DIST_ROOT, 'index.html'), 'uCss Documentation');
    }

    // Recursive READMEs
    // Find all README.md in src
    let readmes = [];
    if (sourceRef) {
        readmes = exec(`git ls-tree -r --name-only "${sourceRef}:src/"`).split('\n').filter(f => f.endsWith('README.md')).map(f => path.join(SRC_DIR, f));
    } else {
        // Recursive search for local FS
        function getReadmes(dir) {
            let results = [];
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                const f = path.join(dir, file);
                const stat = fs.statSync(f);
                if (stat.isDirectory()) results = results.concat(getReadmes(f));
                else if (file === 'README.md') results.push(f);
            });
            return results;
        }
        readmes = getReadmes(SRC_DIR);
    }

    readmes.forEach(readme => {
        const dir = path.dirname(readme);
        const relDir = path.relative(SRC_DIR, dir); // e.g. "lib" or "lib/components"
        // If relDir is empty, it's src/README.md -> dist/{outputDir}/index.html
        // Wait, bash script mapped src/README.md to dist/$TARGET/index.html? 
        // Logic: "src/lib" -> "lib". "src" -> "".
        // target_dir = OUTPUT_DIR / rel_dir

        const targetDir = path.join(outputDir, relDir);
        fs.mkdirSync(targetDir, { recursive: true });
        generateHtml(readme, path.join(targetDir, 'index.html'), `uCss Documentation - ${relDir || 'Root'}`);
    });

    console.log('  ✓ Root index.html generated');

    // 8. Verification
    console.log('Verifying build outputs...');
    const verify = (file, minSize) => {
        if (!fs.existsSync(file)) {
            console.error(`❌ ERROR: ${path.relative(PROJECT_ROOT, file)} was not generated`);
            process.exit(1);
        }
        const size = fs.statSync(file).size;
        if (size < minSize) {
            console.error(`❌ ERROR: ${path.relative(PROJECT_ROOT, file)} is dangerously small (${size}b < ${minSize}b)`);
            process.exit(1);
        }
        console.log(`  ✓ ${path.relative(outputDir, file)} (${size} bytes)`);
    };

    verify(path.join(outputDir, 'u.css'), 5000);
    verify(path.join(outputDir, 'u.min.css'), 3000);
    if (fs.existsSync(path.join(PROJECT_ROOT, 'README.md'))) {
        verify(path.join(DIST_ROOT, 'index.html'), 1000);
    }
    verify(path.join(outputDir, 'lib/components.min.css'), 500);
    verify(path.join(outputDir, 'lib/layout.min.css'), 500);

    console.log('✅ Build verification passed');

    // 9. Compression
    console.log('Compressing build artifacts...');
    try {
        // Spawn compress.js
        spawnSync('node', ['scripts/compress.js', outputDir], { stdio: 'inherit' });
    } catch (e) {
        console.error('Compression failed');
    }

    console.log('🎉 Build complete!');

    // Non-blocking security audit
    console.log('Running security check (background)...');
    try {
        const audit = spawnSync('npm', ['audit', '--json'], { encoding: 'utf8' });
        if (audit.status !== 0) {
            console.log('  ⚠ NPM Audit found issues. Run "npm audit" for details.');
        } else {
            console.log('  ✓ NPM Audit passed.');
        }
    } catch (e) { }

}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
