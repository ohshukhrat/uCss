/**
 * @fileoverview uCss Deployment Orchestrator
 * 
 * @description
 * The "Commander" of the deployment process. It coordinates `build.js` and `remote.js` to 
 * take code from your machine to the internet.
 */

const { spawnSync, execSync } = require('child_process');

function exec(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e) { return ''; }
}
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
    let foundModifiers = [];

    for (const arg of args) {
        if (modifiers.includes(arg)) {
            foundModifiers.push(arg);
        } else {
            // If it's not a known modifier, assume it's a target.
            // "Last Wins" strategy allows user args to override package.json defaults.
            // e.g. "npm run deploy latest" -> args: ["stable", "latest"] -> target: "latest"
            target = arg;
        }
    }

    // Determine Mode/Target
    // Examples:
    // deploy stable -> target: stable
    // deploy latest -> target: latest
    // deploy p -> target: p (implicit)
    // deploy custom -> target: custom

    // Default Target Logic (Smart Defaults via Git Branch)
    if (!target && foundModifiers.length === 0) {
        console.log("🤔 No target specified. Detecting git branch...");
        const branch = exec('git rev-parse --abbrev-ref HEAD');

        if (branch === 'main') {
            target = 'stable';
            console.log("  👉 On 'main' branch. Defaulting to: STABLE");
        } else if (branch === 'dev') {
            target = 'latest';
            console.log("  👉 On 'dev' branch. Defaulting to: LATEST");
        } else {
            target = 'preview';
            console.log(`  👉 On '${branch}' branch. Defaulting to: PREVIEW`);
        }
    } else if (!target && foundModifiers.length > 0) {
        target = foundModifiers[0];
    }

    console.log(`\n🚀 [Deploy Orchestrator] Starting deployment for: ${target.toUpperCase()} (Args: ${args.join(' ')})`);

    // 1. BUILD STEP
    // We assume the user MIGHT want to build before deploy.
    // The requirement implies "rebuild" command does "clean + deploy".
    // "deploy" command itself might just deploy existing?
    // User said: "npm run deploy should deploy /p/, /v/ and /stable/" 
    // And "npm run deploy stable should deploy only /stable/".
    // Usually deploy implies "take what is built and ship it".
    // IF we want "build & deploy", we use "rebuild" or chain them.
    // BUT `deploy.js` historically ran build.
    // Let's KEEP running build to be safe/consistent with previous behavior, unless flag is passed?
    // Requirement for "reprod" says: "npm run reprod, should rebuild /p/, /v/ and /stable/ on local and remote"
    // This implies `reprod` chains build + deploy.
    // DOES `deploy` imply build?
    // "npm run deploy should deploy /p/, /v/ and /stable/ -it should also deploy redeploy root index.html"
    // It doesn't explicitly say "build".
    // However, existing `deploy.js` DOES build. Removing it might break workflow if user relies on "npm run deploy" doing it all.
    // Let's Keep Build step for now to be safe. "The orchestrator handles Build + Upload".

    console.log(`\n📦 Building artifacts...`);

    // Fix: Explicitly pass the resolved target and modifiers to build.js.
    // This avoids issues where conflicting arguments (e.g. 'stable' from 'npm run deploy' alias vs 'latest' from user) caused build mismatches.
    // We want to build exactly what we decided to deploy.
    const buildArgs = ['scripts/build.js', target, ...foundModifiers];

    const buildResult = spawnSync('node', buildArgs, {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
    });

    if (buildResult.status !== 0) {
        console.error("❌ Build failed. Aborting deployment.");
        process.exit(1);
    }

    // 2. RESOLVE PATHS
    // We need to figure out what directory `build.js` just created.

    let localDir = '';
    let remoteDir = '';
    let isStable = false;

    if (target === 'stable') {
        // STABLE: Builds to 'dist/stable'
        // Target Remote: '/stable' (Cornerstone)
        localDir = 'dist/stable';
        remoteDir = '/stable';
        isStable = true;
    } else if (target === 'latest') {
        localDir = 'dist/latest';
        remoteDir = '/latest';
    } else if (target.startsWith('preview')) {
        // Find the preview folder.
        const items = fs.readdirSync(DIST_ROOT);
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
        // Custom / Modifier Targets (e.g. 'p', 'v', 'my-client')
        // build.js creates `dist/target`
        localDir = `dist/${target}`;
        remoteDir = `/${target}`;
    }

    // Double check existence
    const localPath = path.join(PROJECT_ROOT, localDir);
    if (!fs.existsSync(localPath)) {
        console.error(`❌ Local directory not found: ${localDir}`);
        process.exit(1);
    }

    // 3. DEPLOY STEP
    // Note: If remoteDir is '/', we often mean "Upload content of localDir TO root", not "Upload localDir AS root".
    // `remote.js` upload usage: `--upload local remote`
    // If remote is '/', basic-ftp uploadFromDir(local, '/') uploads contents of local INTO /.
    // Correct.

    console.log(`\n🚀 Deploying: ${localDir} -> ${remoteDir}...`);

    const deployArgs = ['scripts/remote.js', '--upload', localDir, remoteDir];

    // For ephemeral builds, cleanup old ones
    if (target === 'latest' || target.startsWith('preview')) {
        deployArgs.push('--cleanup');
    }

    // Attempt to bootstrap root if deploying Latest (User Rule: Latest takes over if empty & no stable)
    if (target === 'latest') {
        deployArgs.push('--bootstrap', DIST_ROOT);
    }

    // 4. BOOTSTRAP / REFRESH ROOT
    // User Requirement: "npm run deploy ... should also redeploy root index.html, htacess"

    const deployResult = spawnSync('node', deployArgs, {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
    });

    if (deployResult.status !== 0) {
        console.error("❌ Deployment failed.");
        process.exit(1);
    }

    // 3.5 UPLOAD ZIP (If exists)
    // Upload dist/latest.zip -> /latest.zip
    const zipPath = path.join(DIST_ROOT, `${target}.zip`);
    if (fs.existsSync(zipPath)) {
        console.log(`\n📦 Uploading Zip Archive: ${target}.zip ...`);
        const zipArgs = ['scripts/remote.js', '--upload-file', zipPath, '/'];
        const zipResult = spawnSync('node', zipArgs, { stdio: 'inherit', cwd: PROJECT_ROOT });
        if (zipResult.status === 0) console.log(`  ✓ Zip uploaded.`);
        else console.warn(`  ⚠️ Zip upload failed.`);
    }

    // 5. POST-DEPLOY ROOT REFRESH (If Stable)
    if (isStable) {
        console.log(`\n🔄 Refreshing Root Files (Stable as Cornerstone)...`);
        // Force update root with files from DIST_ROOT (which contains stable mirrors)
        spawnSync('node', ['scripts/remote.js', '--bootstrap', DIST_ROOT, '--force'], {
            stdio: 'inherit', cwd: PROJECT_ROOT
        });
    }

    // 6. SUMMARY
    console.log(`\n🎉 Success!`);
    if (isStable) {
        console.log(`🌍 Live URL: https://ucss.unqa.dev/`);
    } else {
        const pathPart = remoteDir.startsWith('/') ? remoteDir.substring(1) : remoteDir;
        console.log(`🌍 Preview URL: https://ucss.unqa.dev/${pathPart}/`);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
