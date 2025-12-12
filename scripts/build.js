/**
 * @fileoverview uCss Build System Core
 * 
 * @description
 * This script is the "compiler" for the uCss framework. Unlike modern web projects that rely on 
 * heavy bundlers like Webpack, Vite, or Parcel, uCss uses this bespoke procedural build script.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🧠 ARCHITECTURE & PHILOSOPHY
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. ZERO DEPENDENCIES (ALMOST)
 *    uCss is designed to be a lightweight, zero-dependency CSS framework. adhering to this,
 *    its build system only depends on 'marked' (for generating docs) and 'basic-ftp' (for deploy).
 *    We do not use PostCSS, Sass, Less, or any other preprocessors.
 * 
 * 2. REGEX OVER AST
 *    Why do we parse CSS with Regex instead of a proper Abstract Syntax Tree (AST) parser like postcss?
 *    - Speed: For simple import inlining and minification, Regex is orders of magnitude faster.
 *    - Simplicity: The uCss syntax is strict. We don't need to support every edge case of CSS, only
 *      what we write in `src/`. This allows us to write a 10-line minifier instead of a 10k-line parser.
 * 
 * 3. ASYNC PARALLELISM
 *    Node.js is single-threaded but has non-blocking I/O. We leverage this heavily.
 *    - File Reads: All reads are async `fs.readFile`.
 *    - Processing: Independent modules (base, components, layout) are built in parallel `Promise.all`.
 *    - Docs: All 20+ markdown files are rendered to HTML concurrently.
 * 
 * 4. THE "LIB" PATTERN
 *    The `src/lib/` directory contains isolated modules. This script treats each folder in `lib/` as
 *    a standalone package. It builds `lib/components` into `dist/lib/components.css` automatically.
 *    This means adding a new module requires ZERO configuration. Just create the folder, and it builds.
 * 
 * ---------------------------------------------------------------------------------------------
 * ⚙️ HOW IT WORKS (THE RECURSIVE BUNDLER)
 * ---------------------------------------------------------------------------------------------
 * 
 * The heart of this script is `bundleCss()`.
 * 1. It takes an entry file (e.g., `src/u.css`).
 * 2. It scans for `@import "..."`.
 * 3. It recursively resolves that file.
 * 4. If it finds a cycle (A imports B imports A), it halts and warns.
 * 5. It replaces the `@import` line with the actual file content.
 * 
 * ---------------------------------------------------------------------------------------------
 * 📦 OUTPUT ARTIFACTS
 * ---------------------------------------------------------------------------------------------
 * 
 * For every input file (e.g. `components.css`), we generate THREE outputs:
 * 1. `components.css`: The "Bundle". All imports inlined, but comments and formatting preserved.
 *    USE CASE: Dev inspection, debugging.
 * 
 * 2. `components.clean.css`: The "Clean". Comments removed, excessive whitespace stripped, but still readable.
 *    USE CASE: Production where you might want to read the source code in DevTools.
 * 
 * 3. `components.min.css`: The "Min". Aggressively compacted. No spaces, no newlines.
 *    USE CASE: Production.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🚀 USAGE EXAMPLES
 * ---------------------------------------------------------------------------------------------
 * 
 * @example
 * // 1. Build for Production (infers 'stable' if on main branch, 'latest' if on dev)
 * node scripts/build.js
 * 
 * @example
 * // 2. Force a specific build target (e.g. for testing 'latest' locally)
 * node scripts/build.js latest
 * 
 * @example
 * // 3. Build a Preview (Timestamped)
 * // Useful for CI/CD to generate unique preview URLs for Pull Requests
 * node scripts/build.js preview
 * 
 * @example
 * // 4. Build from Git History (CI/CD Magic)
 * // This is powerful. It allows building the site as it looked 10 commits ago without checking out.
 * // We use `git show` under the hood to read file contents from the git object database.
 * node scripts/build.js --source origin/main stable
 */

const fs = require('fs').promises;
const { existsSync, createReadStream, createWriteStream, rmSync, statSync } = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const { marked } = require('marked');
const { prefixCss } = require('./prefix');

// --- Configuration ---
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DIST_ROOT = path.join(PROJECT_ROOT, 'dist');


// --- Helper Functions ---

/**
 * Executes a shell command synchronously.
 * Used for quick git checks where the overhead of spawning a new async process is unnecessary.
 * @param {string} cmd - Command to run
 * @returns {string} Stdout
 */
function exec(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e) { return ''; }
}

/**
 * Reads file content from local disk or git history.
 * @param {string} filePath - Absolute path
 * @param {string} [sourceRef] - Git ref (e.g. 'main', 'HEAD')
 */
async function readFile(filePath, sourceRef) {
    if (sourceRef) {
        const relPath = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
        try {
            return execSync(`git show "${sourceRef}:${relPath}"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        } catch (e) { return ''; }
    } else {
        try { return await fs.readFile(filePath, 'utf8'); } catch (e) { return ''; }
    }
}

/**
 * Aggressive CSS Minifier.
 * Strips comments, collapses whitespace, removes optional syntax (semicolons, units where 0).
 * 
 * STRATEGY:
 * 1. Strip comments (/ * ... * /) first to avoid matching content inside them.
 * 2. Convert all whitespace series to a single space.
 * 3. Remove space around structural characters `{ } ; : , >`.
 *    e.g. `body { color: red; }` -> `body{color:red;}`
 * 
 * @param {string} css - Raw CSS content
 * @returns {string} Highly compressed CSS
 */
function minifyCss(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*>\s*/g, '>')
        .trim();
}

/**
 * Gentle CSS Cleaner.
 * Just removes comments and excessive vertical whitespace. Keeps indentation/formatting.
 * 
 * PURPOSE:
 * Provides a version of the CSS that is "Production Ready" (no comments/bloat) 
 * but still "Human Readable" for debugging in browser DevTools.
 * 
 * @param {string} css - Raw CSS content
 * @returns {string} Cleaned CSS
 */
function cleanCss(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(\n\s*){3,}/g, '\n\n')
        .replace(/[ \t]+$/gm, '')
        .trim() + '\n';
}

/**
 * THE RECURSIVE BUNDLER
 * 
 * This function handles the "Context-Aware" bundling of CSS files.
 * Unlike simple concatenators, it respects the precise location of the `@import ` statement.
 * 
 * ALGORITHM:
 * 1. Read file content.
 * 2. Scan for `@import ` tokens using Regex. 
 *    - Note: We use a regex dealing with comments to ignore commented-out imports.
 * 3. For each import found:
 *    - Resolve the path (handling `lib / ` aliases to project root).
 *    - RECURSE: Call `bundleCss` on that path.
 * 4. Await all recursive calls (Promise.all) for maximum parallelism.
 * 5. Splice the bundles back into the original content, replacing the `@import ` line.
 * 
 * CYCLE DETECTION:
 * We maintain a `stack` Set of currently processing files. If we encounter a file
 * that is already in the stack, we identify a circular dependency (A -> B -> A)
 * and break the cycle by returning a comment instead of infinite recursion.
 * 
 * @param {string} entryFile - Absolute path to the .css file to bundle
 * @param {string} [sourceRef] - Optional git ref (e.g. 'main'). If present, reads from git history.
 * @returns {Promise<string>} The fully bundled CSS content with all imports inlined.
 */
async function bundleCss(entryFile, sourceRef) {
    const stack = new Set();

    async function _bundle(currentPath) {
        if (stack.has(currentPath)) return `/* Cycle: ${path.basename(currentPath)} */`;
        stack.add(currentPath);

        let content = await readFile(currentPath, sourceRef);
        if (!content) {
            stack.delete(currentPath);
            return `/* Missing: ${path.basename(currentPath)} */`;
        }

        const currentDir = path.dirname(currentPath);
        const tokenRegex = /(\/\*[\s\S]*?\*\/)|(@import\s+['"]([^'"]+)['"];)/g;
        let match;
        const replacements = [];

        while ((match = tokenRegex.exec(content)) !== null) {
            const [fullMatch, comment, _, importPath] = match;
            if (comment) continue;

            let resolvedPath;
            if (importPath.startsWith('lib/')) {
                resolvedPath = path.join(SRC_DIR, importPath);
            } else {
                resolvedPath = path.resolve(currentDir, importPath);
            }

            replacements.push({
                start: match.index,
                end: match.index + fullMatch.length,
                promise: _bundle(resolvedPath)
            });
        }

        if (replacements.length > 0) {
            const results = await Promise.all(replacements.map(r => r.promise));
            for (let i = replacements.length - 1; i >= 0; i--) {
                const { start, end } = replacements[i];
                content = content.substring(0, start) + results[i] + content.substring(end);
            }
        }

        stack.delete(currentPath);
        return content;
    }

    return _bundle(entryFile);
}


// --- Main Pipeline ---

async function main() {
    const args = process.argv.slice(2);

    // --- FULL BUILD WORKFLOW ---
    if (args.includes('full')) {
        console.log('🚀 Starting FULL build (latest, stable, p)...');
        // We use spawnSync to run the builds sequentially so they don't race
        const steps = [
            { id: 'latest', args: ['latest'] },
            { id: 'prefixed', args: ['p'] },
            { id: 'variables', args: ['v'] },
            { id: 'stable', args: ['stable'] }
        ];

        for (const step of steps) {
            console.log(`\n👉 Task: ${step.id}`);
            const res = spawnSync('node', ['scripts/build.js', ...step.args], { stdio: 'inherit', cwd: PROJECT_ROOT });
            if (res.status !== 0) {
                console.error(`❌ Sub-build failed: ${step.id}`);
                process.exit(1);
            }
        }
        console.log('\n✨ All full build tasks completed!');
        return;
    }

    let sourceRef = '';
    let targetDirArg = '';

    // --- Argument Parsing for Prefixing ---
    let prefixMode = null; // 'p', 'c', 'v'
    let prefixString = null;

    // Scan for arguments
    const cleanedArgs = [];
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--source') {
            sourceRef = args[i + 1]; i++;
        } else if (['p', 'c', 'v'].includes(arg)) {
            prefixMode = arg;
            // Check if next arg is a custom prefix (not a flag, not a known keyword)
            const nextArg = args[i + 1];
            if (nextArg && !nextArg.startsWith('-') && !['preview', 'stable', 'latest', 'p', 'c', 'v'].includes(nextArg)) {
                prefixString = nextArg;
                i++;
            }
        } else {
            cleanedArgs.push(arg);
        }
    }
    // Repopulate args for directory logic
    targetDirArg = cleanedArgs[0] || '';

    // Apply Defaults
    const modeMap = { p: 'p', c: 'c', v: 'v' };
    const validMode = modeMap[prefixMode];

    // Default prefixes if mode is active but no string provided
    if (validMode && !prefixString) {
        prefixString = 'u';
    }

    // 1. Resolve Output Directory
    let outputDirName = targetDirArg;

    // Auto-detect directory from mode if not specified
    if (!outputDirName && validMode) {
        outputDirName = validMode;
    }

    if (!outputDirName) {
        let branch = 'unknown';
        if (sourceRef) {
            if (sourceRef.includes('main')) branch = 'main';
            else if (sourceRef.includes('dev')) branch = 'dev';
            else outputDirName = `preview/${sourceRef.replace(/[\/]/g, '-')}`;
        } else {
            branch = exec('git rev-parse --abbrev-ref HEAD') || 'unknown';
        }

        if (!outputDirName) {
            if (branch === 'main') outputDirName = 'stable';
            else if (branch === 'dev') outputDirName = 'latest';
            else {
                const now = new Date();
                const ts = now.toISOString().replace(/[:\.]/g, '-').slice(0, 19);
                outputDirName = `preview-${ts}`;
            }
        }
    } else if (outputDirName === 'preview') {
        const now = new Date();
        const ts = now.toISOString().replace(/[:\.]/g, '-').slice(0, 19);
        outputDirName = `preview-${ts}`;
    }

    const outputDir = path.join(DIST_ROOT, outputDirName);
    console.log(`Targeting: ${outputDir}`);
    console.log(`Reading source from: ${sourceRef || 'Local filesystem'}`);
    if (validMode) {
        console.log(`Prefix Mode: ${validMode.toUpperCase()} | Prefix: "${prefixString}"`);
    }

    // 2. Cleanup & Init
    if (existsSync(outputDir)) await fs.rm(outputDir, { recursive: true, force: true });
    await fs.mkdir(path.join(outputDir, 'lib'), { recursive: true });

    const tasks = [];

    // 3. Static Assets (.htaccess)
    tasks.push(async () => {
        try { await fs.copyFile(path.join(PROJECT_ROOT, 'server/.htaccess.template'), path.join(DIST_ROOT, '.htaccess')); } catch (e) { }
    });

    // 4. Core Build (u.css)
    tasks.push(async () => {
        console.log(`Building u.css...`);
        let content = await bundleCss(path.join(SRC_DIR, 'u.css'), sourceRef);

        if (validMode) content = prefixCss(content, validMode, prefixString);

        await Promise.all([
            fs.writeFile(path.join(outputDir, 'u.css'), content),
            fs.writeFile(path.join(outputDir, 'u.clean.css'), cleanCss(content)),
            fs.writeFile(path.join(outputDir, 'u.min.css'), minifyCss(content))
        ]);
    });

    // 5. Modular Builds (lib/*.css)
    tasks.push(async () => {
        console.log('Scanning modules...');
        let libFiles = [];
        if (sourceRef) {
            libFiles = exec(`git ls - tree--name - only "${sourceRef}:src/lib/"`)
                .split('\n').filter(f => f.endsWith('.css')).map(f => path.join(SRC_DIR, 'lib', f));
        } else {
            try {
                const files = await fs.readdir(path.join(SRC_DIR, 'lib'));
                libFiles = files.filter(f => f.endsWith('.css')).map(f => path.join(SRC_DIR, 'lib', f));
            } catch (e) { }
        }

        await Promise.all(libFiles.map(async (libFile) => {
            const modName = path.basename(libFile, '.css');
            const targetLibDir = path.join(outputDir, 'lib', modName);
            await fs.mkdir(targetLibDir, { recursive: true });

            // Bundle Module Root
            let content = await bundleCss(libFile, sourceRef);

            if (validMode) content = prefixCss(content, validMode, prefixString);

            const baseName = path.join(outputDir, 'lib', modName);
            await Promise.all([
                fs.writeFile(`${baseName}.css`, content),
                fs.writeFile(`${baseName}.clean.css`, cleanCss(content)),
                fs.writeFile(`${baseName}.min.css`, minifyCss(content))
            ]);

            // Copy Sub-files (Individual component files)
            const subDirRel = `src/lib/${modName}`;
            // ... (Logic to copy indiv files same as before) ...
            // Simplified for brevity in JSDoc update task, but retaining logic
            // Helper: Recursive file walker
            async function getFiles(dir) {
                const dirents = await fs.readdir(dir, { withFileTypes: true });
                const files = await Promise.all(dirents.map((dirent) => {
                    const res = path.resolve(dir, dirent.name);
                    return dirent.isDirectory() ? getFiles(res) : res;
                }));
                return Array.prototype.concat(...files).filter(f => f.endsWith('.css') && path.basename(f) !== 'index.css');
            }

            let individualFiles = [];
            if (sourceRef) {
                individualFiles = exec(`git ls-tree -r --name-only "${sourceRef}"`)
                    .split('\n')
                    .filter(l => l.startsWith(subDirRel) && l.endsWith('.css'))
                    .map(l => path.join(PROJECT_ROOT, l));
            } else {
                const subDirPath = path.join(PROJECT_ROOT, subDirRel);
                if (existsSync(subDirPath)) {
                    individualFiles = await getFiles(subDirPath);
                }
            }

            await Promise.all(individualFiles.map(async leaf => {
                // Calculate relative path from module root to leaf to preserve structure
                // e.g. leaf = .../src/lib/patterns/button/skins.css
                // subDirRel = src/lib/patterns
                // rel = button/skins.css
                const subDirPath = path.join(PROJECT_ROOT, subDirRel);
                const rel = path.relative(subDirPath, leaf);

                const leafTarget = path.join(targetLibDir, rel);
                const leafDir = path.dirname(leafTarget);

                if (!existsSync(leafDir)) {
                    await fs.mkdir(leafDir, { recursive: true });
                }

                let raw = await bundleCss(leaf, sourceRef);

                if (validMode) raw = prefixCss(raw, validMode, prefixString);

                await fs.writeFile(leafTarget, raw);
                await fs.writeFile(leafTarget.replace('.css', '.clean.css'), cleanCss(raw));
                await fs.writeFile(leafTarget.replace('.css', '.min.css'), minifyCss(raw));
            }));
            console.log(`  ✓ Built module: ${modName} `);
        }));
    });

    // 6. Documentation Generator
    tasks.push(async () => {
        console.log('Generating documentation...');

        /**
         * Converts Markdown to a complete HTML page with uCss styling.
         * 
         * PIPELINE:
         * 1. Read Markdown file.
         * 2. Configure `marked` renderer to:
         *    - Add IDs to headings for deep linking.
         *    - Rewrite links: 
         *      - `README.md` -> `index.html` (for web navigation).
         *      - `src` relative paths -> `dist` relative paths (so links work in built site).
         * 3. Wrap rendered HTML in a template with:
         *    - `< link > ` tags to valid CSS paths.
         *    - Standard meta tags.
         * 4. Write to `dist` as `.html`.
         */
        const generateHtml = async (mdPath, outPath, title) => {
            const md = await readFile(mdPath, sourceRef);
            if (!md) return;

            // CONFIG: Render Markdown
            const renderer = {
                heading({ tokens, depth }) {
                    const text = this.parser.parseInline(tokens);
                    // Match marked default slugger: replace non-word chars with dash
                    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                    return `<h${depth} id="${id}">${text}</h${depth}>`;
                },
                link({ href, title, tokens }) {
                    const text = this.parser.parseInline(tokens);
                    let hrefStr = String(href);

                    // 1. Point README links to directory root (index.html)
                    // e.g. "foo/README.md" -> "foo/"
                    hrefStr = hrefStr.replace(/\/README\.md(?=$|#|\?)/, '/');
                    hrefStr = hrefStr.replace(/^README\.md(?=$|#|\?)/, './');

                    // 2. Rebase 'src/' links for Root README to point to current output dir
                    // e.g. "src/lib/components/" -> "./stable/lib/components/"
                    if (mdPath === path.join(PROJECT_ROOT, 'README.md')) {
                        if (hrefStr.startsWith('./src/') || hrefStr.startsWith('src/')) {
                            hrefStr = hrefStr.replace(/^(\.\/)?src\//, `./${outputDirName}/`);
                        }
                    }

                    return `<a href="${hrefStr}"${title ? ` title="${title}"` : ''}>${text}</a>`;
                }
            };
            marked.use({ renderer });

            let htmlContent;
            try { htmlContent = marked.parse(md, { gfm: true, breaks: false }); } catch (e) { return; }

            // Wrap tables for scrollability
            htmlContent = htmlContent.replace(/<table>/g, '<div class="of-x"><table>').replace(/<\/table>/g, '</table></div>');

            // Dynamic CDN Replacement in Content
            // Replaces "ucss.unqa.dev/stable" with "ucss.unqa.dev/[current-build]" in the text
            // checking if outputDirName is 'p' or 'latest' or 'preview*'.
            const cdnSegment = outputDirName.startsWith('preview') ? outputDirName : (['p', 'latest'].includes(outputDirName) ? outputDirName : 'stable');
            if (cdnSegment !== 'stable') {
                htmlContent = htmlContent.replace(/ucss\.unqa\.dev\/stable/g, `ucss.unqa.dev/${cdnSegment}`);
            }

            // TEMPLATE: Minimal HTML wrapper
            const relRoot = path.relative(path.dirname(outPath), outputDir);
            // Calculated path to CSS assets
            const configPath = path.join(relRoot, 'lib/config.css');
            const corePath = path.join(relRoot, 'u.min.css');

            const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="uCss - Modern, mobile-first, pure CSS framework with zero dependencies">
    <title>${title}</title>
    <link rel="stylesheet" href="https://ucss.unqa.dev/${cdnSegment === 'stable' ? 'stable' : cdnSegment}/lib/config.css">
    <link rel="stylesheet" href="https://ucss.unqa.dev/${cdnSegment === 'stable' ? 'stable' : cdnSegment}/u.min.css">
    <style>
        /* Documentation specific overrides */
        .s { min-height: 100vh; }
    </style>
</head>
<body>
    <section class="s set dark" style="--sc-max-w: 48rem; --scc-gap: .75rem;">
        <div class="sf"><div>${htmlContent}</div></div>
    </section>

    <!-- Theme Toggle -->
    <button onclick="const s = document.querySelector('.s'); s.classList.toggle('dark'); s.classList.toggle('light');" class="btn subtle icn blr rd" style="position: fixed; bottom: 2rem; left: 2rem; z-index: 999; --btn-c: var(--tx);">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    </button>
</body>
</html>`;
            await fs.writeFile(outPath, template);
        };

        const docTasks = [];
        // Root README -> dist/index.html
        // Root README -> dist/[target]/index.html (Self-contained)
        if (existsSync(path.join(PROJECT_ROOT, 'README.md'))) {
            docTasks.push(generateHtml(path.join(PROJECT_ROOT, 'README.md'), path.join(outputDir, 'index.html'), 'uCss Documentation - Root'));

            // Only update root dist/index.html if we are building stable
            if (outputDirName === 'stable') {
                docTasks.push(generateHtml(path.join(PROJECT_ROOT, 'README.md'), path.join(DIST_ROOT, 'index.html'), 'uCss Documentation - Root'));
            }
        }

        // Subproject READMEs -> dist/lib/*/index.html
        let readmes = [];
        if (sourceRef) {
            readmes = exec(`git ls-tree -r --name-only "${sourceRef}:src/"`)
                .split('\n').filter(f => f.endsWith('README.md')).map(f => path.join(SRC_DIR, f));
        } else {
            async function getReadmes(dir) {
                let results = [];
                const entries = await fs.readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const f = path.join(dir, entry.name);
                    if (entry.isDirectory()) results = results.concat(await getReadmes(f));
                    else if (entry.name === 'README.md') results.push(f);
                }
                return results;
            }
            readmes = await getReadmes(SRC_DIR);
        }

        docTasks.push(...readmes.map(async readme => {
            const relDir = path.relative(SRC_DIR, path.dirname(readme));
            const targetDir = path.join(outputDir, relDir);
            await fs.mkdir(targetDir, { recursive: true });
            await generateHtml(readme, path.join(targetDir, 'index.html'), `uCss Documentation - ${relDir || 'Root'}`);
        }));

        await Promise.all(docTasks);
        console.log('  ✓ Documentation generated');
    });

    // Run All Tasks
    await Promise.all(tasks.map(t => t()));

    // 7. Verify & Compress
    console.log('Verifying & Compressing...');
    try {
        const verify = (f, min) => {
            if (!existsSync(f)) throw new Error(`Missing ${f}`);
            if (statSync(f).size < min) throw new Error(`Empty ${f}`);
            console.log(`  ✓ Checked ${path.relative(outputDir, f)}`);
        };
        verify(path.join(outputDir, 'u.css'), 5000);
        verify(path.join(outputDir, 'u.min.css'), 3000);
        if (existsSync(path.join(PROJECT_ROOT, 'README.md'))) {
            verify(path.join(outputDir, 'index.html'), 1000);
            if (outputDirName === 'stable') verify(path.join(DIST_ROOT, 'index.html'), 1000);
        }
        verify(path.join(outputDir, 'lib/patterns.min.css'), 500);
    } catch (e) {
        console.error(`❌ Verification Failed: ${e.message}`);
        process.exit(1);
    }

    spawnSync('node', ['scripts/compress.js', outputDir], { stdio: 'inherit' });
    console.log('🎉 Build complete!');
    spawnSync('npm', ['audit', '--json'], { stdio: 'ignore' });
}

main().catch(e => { console.error('Build failed:', e); process.exit(1); });
