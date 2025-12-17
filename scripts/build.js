/**
 * @fileoverview uCss Build System Core
 * 
 * @description
 * The compiler. Converts `src/` -> `dist/`.
 * Handles bundling, inlining, minification, documentation generation, and file prefixing.
 * 
 * ---------------------------------------------------------------------------------------------
 * ⚡ BUILD MODES
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. FULL / ALL (`node build.js full` | `                                                                                                                                                                                                                                                                                                                                                                              node build.js all`)
 *    - Builds everything: `latest` -> `p` -> `v` -> `stable`.
 *    - `all` mode explicitly includes `c` (only classes prefixed version) as well.
 * 
 * 2. CHANNEL (`node build.js stable` | `latest`)
 *    - Builds standard distribution for that channel.
 * 
 * 3. PREVIEW (`node build.js preview`)
 *    - Generates a timestamped build `dist/preview-YYYY...`.
 * 
 * 4. PREFIXED (`node build.js p` | `v`)
 *    - `p` (Prefixed): Adds `.u-` to classes and `--u-` to vars.
 *    - `v` (Variables): Adds `--u-` to vars only.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🧩 FEATURES
 * ---------------------------------------------------------------------------------------------
 * 
 * - **Regex Bundler**: Fast, zero-dep recursive `@import` handling.
 * - **Auto-Doc**: Generates `index.html` documentation for every module from READMEs.
 * - **Smart Verification**: Checks artifact sizes to ensure no empty files are shipped.
 * - **Git Aware**: Can build from git history if `--source` is provided.
 * 
 * ---------------------------------------------------------------------------------------------
 * 💻 USAGE
 * ---------------------------------------------------------------------------------------------
 * 
 * @example
 * node scripts/build.js all
 * node scripts/build.js latest p
 * node scripts/build.js stable
 */

const fs = require('fs').promises;
const { existsSync, createReadStream, createWriteStream, rmSync, statSync } = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const { prefixCss } = require('./prefix');
const { buildDocs } = require('./index');

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

    // --- FULL/ALL BUILD WORKFLOW ---
    if (args.includes('full') || args.includes('all')) {
        const isAll = args.includes('all');
        console.log(`🚀 Starting ${isAll ? 'ALL' : 'FULL'} build...`);

        const steps = [
            { id: 'latest', args: ['latest'] },
            { id: 'prefixed', args: ['p'] },
            { id: 'variables', args: ['v'] },
            { id: 'stable', args: ['stable'] }
        ];

        if (isAll) {
            steps.splice(2, 0, { id: 'clean-ver', args: ['c'] }); // Insert 'c' after 'p' or wherever appropriate behaviorally
        }

        for (const step of steps) {
            console.log(`\n👉 Task: ${step.id}`);
            const res = spawnSync('node', ['scripts/build.js', ...step.args], { stdio: 'inherit', cwd: PROJECT_ROOT });
            if (res.status !== 0) {
                console.error(`❌ Sub-build failed: ${step.id}`);
                process.exit(1);
            }
        }
        console.log(`\n✨ All ${isAll ? 'all' : 'full'} build tasks completed!`);
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
    // 3. Static Assets (.htaccess) - Only for Stable/Latest (Root controllers)
    tasks.push(async () => {
        if (outputDirName === 'stable' || outputDirName === 'latest') {
            try {
                const src = path.join(PROJECT_ROOT, 'server/.htaccess.template');
                // Copy to Dist Root (for reference)
                await fs.copyFile(src, path.join(DIST_ROOT, '.htaccess'));
                // Copy to Output Dir (for deployment bootstrap)
                await fs.copyFile(src, path.join(outputDir, '.htaccess'));
            } catch (e) { }
        }
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
    // 6. Documentation Generator
    tasks.push(async () => {
        await buildDocs({
            outputDir,
            outputDirName,
            sourceRef,
            validMode,
            prefixString
        });
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

    // 7.1 Manifest Generation (Dist Specific)
    // Generates a manifest ONLY for the files we are shipping in this channel
    console.log('Generating Channel Manifest...');
    const maniArgs = ['scripts/manifest.js', '--scan', outputDir, '--out', path.join(outputDir, 'manifest.json')];
    const maniRes = spawnSync('node', maniArgs, { stdio: 'inherit', cwd: PROJECT_ROOT });

    if (maniRes.status === 0) {
        console.log(`  ✓ Manifest generated for ${outputDirName}`);

        // If stable or latest is taking over root, we also want a manifest for the ROOT of the domain.
        // But strictly speaking, ucss.unqa.dev/manifest.json should probably represent the STABLE build.
        if (outputDirName === 'stable' || outputDirName === 'latest') {
            await fs.copyFile(path.join(outputDir, 'manifest.json'), path.join(DIST_ROOT, 'manifest.json'));
        }
    } else {
        console.warn('  ⚠️ Manifest generation failed.');
    }

    // 7.5 Create Zip Archive (For root downloads)
    // Generates dist/latest.zip or dist/stable.zip
    if (outputDirName === 'latest' || outputDirName === 'stable') {
        console.log(`\n📦 Creating Zip Archive: ${outputDirName}.zip ...`);
        const zipName = `${outputDirName}.zip`;
        const zipPath = path.join(DIST_ROOT, zipName);

        // Try native zip first (Faster on Linux)
        let success = false;
        if (process.platform !== 'win32') {
            try {
                // cd into outputDir and zip everything to ../zipName
                const res = spawnSync('zip', ['-r', '-q', zipPath, '.'], { cwd: outputDir });
                if (res.status === 0) {
                    success = true;
                    console.log(`  ✓ Native zip created at dist/${zipName}`);
                }
            } catch (e) { console.warn('  ! Native zip failed, falling back to adm-zip.'); }
        }

        // Fallback to adm-zip
        if (!success) {
            try {
                const AdmZip = require('adm-zip');
                const zip = new AdmZip();
                zip.addLocalFolder(outputDir);
                zip.writeZip(zipPath);
                console.log(`  ✓ adm-zip created at dist/${zipName}`);
            } catch (e) {
                console.error(`  ❌ Zip generation failed: ${e.message}`);
                console.log('  (Make sure "adm-zip" is installed if you are on Windows or lack "zip" command)');
            }
        }
    }

    // 8. Root Mirroring (Mirror u.* to dist/ root)
    // Ensures https://ucss.unqa.dev/u.min.css works.
    // Logic:
    // - If building STABLE: Always mirror.
    // - If building LATEST: Mirror ONLY if stable doesn't exist (bootstrap empty root).
    const mirrorToRoot = async (sourceDir) => {
        console.log(`\n🪞 Mirroring core files from ${sourceDir} to root...`);
        try {
            const files = await fs.readdir(sourceDir);
            for (const file of files) {
                // Copy u.css, u.min.css, u.clean.css AND their compressed versions (.gz, .br)
                if (file.startsWith('u.') && (file.endsWith('.css') || file.endsWith('.css.gz') || file.endsWith('.css.br'))) {
                    await fs.copyFile(path.join(sourceDir, file), path.join(DIST_ROOT, file));
                    console.log(`   + ${file}`);
                }
            }
        } catch (e) {
            console.error(`   ! Mirroring failed: ${e.message}`);
        }
    };

    let shouldMirror = false;
    let mirrorSource = '';

    if (outputDirName === 'stable') {
        shouldMirror = true;
        mirrorSource = outputDir;
    } else if (outputDirName === 'latest') {
        // Check if root stable exists
        const stableDir = path.join(DIST_ROOT, 'stable');
        if (!existsSync(stableDir)) {
            console.log('⚠️ Stable build not found. Fallback: Populating root from Latest.');
            shouldMirror = true;
            mirrorSource = outputDir;
        }
    }

    if (shouldMirror && mirrorSource) {
        await mirrorToRoot(mirrorSource);
    }
    console.log('🎉 Build complete!');
    spawnSync('npm', ['audit', '--json'], { stdio: 'ignore' });
}

main().catch(e => { console.error('Build failed:', e); process.exit(1); });
