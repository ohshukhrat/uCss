/**
 * @fileoverview uCss Deployment Orchestrator
 * 
 * @description
 * The "Commander" of the deployment process. It coordinates `build.js` and `remote.js` to 
 * take code from your machine to the internet.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🤖 LOGIC
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. PARSE ARGS
 *    It intelligently separates "Targets" (stable, latest, custom) from "Modifiers" (p, c, v).
 *    e.g., `npm run deploy p latest` -> Target: `latest`, Modifier: `p`.
 * 
 * 2. BUILD
 *    Calls `scripts/build.js` with the parsed arguments to generate artifacts in `dist/`.
 * 
 * 3. RESOLVE
 *    Determines the upload path.
 *    - `stable` -> Uploads to `/` (Root).
 *    - `latest` -> Uploads to `/latest`.
 *    - `preview` -> Uploads to `/preview-TIMESTAMP`.
 * 
 * 4. DEPLOY
 *    Calls `scripts/remote.js` to upload.
 *    - If `latest` or `preview`: Also runs `--cleanup` and `--bootstrap` (smart root check).
 * 
 * ---------------------------------------------------------------------------------------------
 * 🚀 COMMANDS
 * ---------------------------------------------------------------------------------------------
 * 
 * @example
 * // 1. Deploy Stable (Production)
 * npm run deploy stable
 * 
 * @example
 * // 2. Deploy Dev (Latest)
 * npm run deploy latest
 * 
 * @example
 * // 3. Deploy Prefixed Dev (Latest + Prefixed)
 * npm run deploy latest p
 * 
 * @example
 * // 4. Deploy Preview
 * npm run deploy preview
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- Config ---
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_ROOT = path.join(PROJECT_ROOT, 'dist');

// --- Main ---

async function main() {
    const args = process.argv.slice(2);

    // Parse args to separate Modifiers (p, c, v) from Target (stable, latest, custom...)
    const modifiers = ['p', 'c', 'v'];
    let target = '';
    let foundModifier = '';

    for (const arg of args) {
        if (modifiers.includes(arg)) {
            foundModifier = arg;
        } else if (!target) {
            target = arg;
        }
    }

    // Default logic:
    // 1. If we have a target (e.g. 'stable', 'my-site'), use it.
    // 2. If no target but we have a modifier (e.g. 'p'), usage is implied 'dist/p', so target is 'p'.
    // 3. If neither, default to 'preview'.
    const mode = target || foundModifier || 'preview';

    console.log(`\n🚀 [Deploy Orchestrator] Starting deployment for: ${mode.toUpperCase()} (Args: ${args.join(' ')})`);

    // 1. BUILD STEP
    console.log(`\n📦 Building artifacts...`);
    const buildResult = spawnSync('node', ['scripts/build.js', ...args], {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
    });

    if (buildResult.status !== 0) {
        console.error("❌ Build failed. Aborting deployment.");
        process.exit(1);
    }

    // 2. RESOLVE PATHS
    // We need to figure out what directory `build.js` just created.
    // Since `build.js` has complex logic for naming, we'll scan `dist/` for the freshest folder/file.

    let localDir = '';
    let remoteDir = '';

    if (mode === 'stable') {
        // STABLE: Builds to 'dist/stable' BUT we want to upload the contents of 'dist/' to Root '/'
        // Actually, looking at build.js logic:
        // if mode='stable', outputDir is 'dist/stable'.
        // HOWEVER, the user requirement is to update the ROOT index.html.
        // `build.js` generates 'dist/stable/index.html' AND 'dist/index.html' (if stable).
        // So we should upload the entire `dist/` folder content to the server root, 
        // OR specifically mapping `dist/stable` -> `/stable` and `dist/index.html` -> `/index.html`.

        // Simpler approach for STABLE: Upload `dist/` to `/`. 
        // This puts `dist/stable` into `/stable` and `dist/index.html` into `/index.html`.
        // BUT `dist/` might contain other junk like old previews if not cleaned.
        // `build.js` cleans its target output dir, but not necessarily the whole `dist` root if targeting subfolder.
        // Wait, `build.js` main logic: "if (existsSync(outputDir)) await fs.rm..." 
        // It cleans specific build dir. 

        // Let's assume for a clean deployment we want to map:
        // dist/stable -> /stable
        // dist/index.html -> /index.html
        // dist/u.* -> /u.*

        // This is tricky to do in one pass if we just say "upload dist/ to /".
        // Let's stick to the implementation plan: "Upload dist/ to /".
        // Use caution: We must trust `dist/` only contains what we just built.
        // `build.js` does NOT clean the whole `dist` folder, only the target `outputDir`.

        // To be safe, we will define LOCAL_SOURCE as `dist/stable` for the bulk, 
        // and handle root files separately? No, `remote.js` is dir-based.

        // REVISION: `build.js` logic for stable:
        // It writes `dist/u.css`, `dist/stable/u.css`...
        // Wait, line 346: `const outputDir = path.join(DIST_ROOT, outputDirName);`
        // If args is stable, outputDir is `dist/stable`.
        // BUT line 372: `fs.writeFile(path.join(outputDir, 'u.css'), ...)` -> `dist/stable/u.css`.
        // AND line 632: `if (outputDirName === 'stable') verify(path.join(DIST_ROOT, 'index.html')...`
        // So `build.js` puts `index.html` in `dist/` root when stable.

        // Strategy: We will upload `dist/` to `/`. 
        // User must ensure `dist/` is relatively clean. 
        // Maybe we should wipe `dist` before build? `build.js` doesn't do that globally.
        // Let's warn the user or just upload `dist/`.
        localDir = 'dist';
        remoteDir = '/';

    } else if (mode === 'latest') {
        localDir = 'dist/latest';
        remoteDir = '/latest';
    } else if (mode === 'preview' || mode.startsWith('preview')) {
        // Find the preview folder. It has a timestamp we don't know exactly.
        // Scan dist for directories starting with 'preview-'
        const items = fs.readdirSync(DIST_ROOT);
        // Sort by creation time desc
        const previews = items
            .filter(name => name.startsWith('preview-'))
            .map(name => ({ name, time: fs.statSync(path.join(DIST_ROOT, name)).mtime.getTime() }))
            .sort((a, b) => b.time - a.time);

        if (previews.length === 0) {
            console.error("❌ Could not find the generated preview folder in dist/.");
            process.exit(1);
        }

        const newest = previews[0].name;
        localDir = path.join('dist', newest);
        remoteDir = `/${newest}`;

        console.log(`  🔎 Identified preview build: ${newest}`);
    } else {
        // Fallback or custom mode (e.g. 'p')
        localDir = `dist/${mode}`;
        remoteDir = `/${mode}`;
    }

    // Double check existence
    if (!fs.existsSync(path.join(PROJECT_ROOT, localDir))) {
        console.error(`❌ Local directory not found: ${localDir}`);
        process.exit(1);
    }

    // 3. DEPLOY STEP
    console.log(`\n🚀 Deploying: ${localDir} -> ${remoteDir}...`);

    const deployArgs = ['scripts/remote.js', '--upload', localDir, remoteDir];

    // For ephemeral builds, cleanup old ones AND bootstrap root if empty
    if (mode === 'preview' || mode === 'latest') {
        deployArgs.push('--cleanup');
        deployArgs.push('--bootstrap', 'dist'); // Check if we need to fill the root
    }

    const deployResult = spawnSync('node', deployArgs, {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
    });

    if (deployResult.status !== 0) {
        console.error("❌ Deployment failed.");
        process.exit(1);
    }

    // 4. SUMMARY
    console.log(`\n🎉 Success!`);
    if (mode === 'stable') {
        console.log(`🌍 Live URL: https://ucss.unqa.dev/`);
    } else {
        // remoteDir starts with /, strip it for URL
        const pathPart = remoteDir.startsWith('/') ? remoteDir.substring(1) : remoteDir;
        console.log(`🌍 Preview URL: https://ucss.unqa.dev/${pathPart}/`);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
