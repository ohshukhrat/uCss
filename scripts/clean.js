/**
 * @fileoverview uCss Workspace Cleanup Utility
 * 
 * @description
 * The "Janitor". Keeps your workspace pristine.
 * Unlike `rm -rf`, this is context-aware and safe.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🧹 MODES
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. DEFAULT (`npm run clean` / `npm run wipe`)
 *    - Action: Nukes `dist/`.
 *    - Follow-up: Rebuilds FULL SUITE (via `npm run build:full`).
 *    - Goal: "Reset to a working state".
 * 
 * 2. ALL / NUKE (`npm run clean:all` / `npm run clean:nuke`)
 *    - Action: Nukes `dist/`.
 *    - Follow-up: NONE. Leaves directory empty.
 *    - Goal: "Kill it with fire".
 * 
 * 3. SAFE (`npm run clean:safe`)
 *    - Action: Deletes `dist/` content EXCEPT `stable` and `latest`.
 *    - Goal: "Clear disk space (previews) without breaking my local dev server".
 * 
 * 4. TARGETED (`npm run clean [target]`)
 *    - Action: Deletes specifically `dist/[target]`.
 *    - Example: `npm run clean preview` (deletes all previews), `npm run clean stable`.
 * 
 * ---------------------------------------------------------------------------------------------
 * 💻 EXAMPLES
 * ---------------------------------------------------------------------------------------------
 * 
 * @example
 * npm run clean          # Reset project (Clean + Build Full)
 * npm run clean:nuke     # Empty dist (No rebuild)
 * npm run clean preview  # Delete all previews
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const ARGS = process.argv.slice(2); // Get arguments passed to the script

/**
 * Recursively deletes a file or directory if it exists.
 * @param {string} targetPath - Absolute path to delete
 * @returns {void}
 */
function remove(targetPath) {
    if (fs.existsSync(targetPath)) {
        console.log(`Deleting: ${path.relative(PROJECT_ROOT, targetPath)}`);
        fs.rmSync(targetPath, { recursive: true, force: true });
    }
}

/**
 * Scans a directory and deletes files matching a regular expression.
 * Used for cleaning patterns like preview-* or *.tgz.
 * @param {string} dir - Directory to scan
 * @param {RegExp} regex - Pattern to match files/folders for deletion
 * @returns {void}
 */
function removePattern(dir, regex) {
    if (!fs.existsSync(dir)) return;
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            if (regex.test(file)) {
                remove(path.join(dir, file));
            }
        }
    } catch (e) {
        console.error(`Error scanning ${dir}:`, e.message);
    }
}

/**
 * Main execution logic.
 * Routes based on command line arguments.
 */
function main() {
    const mode = ARGS[0]; // e.g., 'dist', 'stable', 'preview'
    const subMode = ARGS[1]; // e.g., 'latest'

    console.log(`\n🧹 Clean mode: ${mode || 'DEFAULT (Reset)'} ${subMode || ''}`);

    // Cleanup Root Artifacts (Done slightly in all modes for hygiene)
    // Only strictly remove them in full/nuke/default modes? No, good to keep root clean always.
    const cleanRootArtifacts = () => {
        removePattern(PROJECT_ROOT, /\.tgz$/);
        removePattern(PROJECT_ROOT, /\.log$/);
        removePattern(PROJECT_ROOT, /^thumbs\.db$/i);
        removePattern(PROJECT_ROOT, /^\.DS_Store$/);
    };

    // Case 1: NUKE / ALL -> Delete dist, NO REBUILD
    if (mode === 'all' || mode === 'nuke') {
        console.log('🔥 Nuking dist folder...');
        remove(DIST_DIR);
        cleanRootArtifacts();
        return;
    }

    // Case 2: SAFE -> Delete everything except stable & latest
    if (mode === 'safe') {
        console.log('🛡️  Safe cleaning...');
        if (fs.existsSync(DIST_DIR)) {
            const files = fs.readdirSync(DIST_DIR);
            for (const file of files) {
                if (file !== 'stable' && file !== 'latest') {
                    remove(path.join(DIST_DIR, file));
                }
            }
        }
        cleanRootArtifacts();
        return;
    }

    // Case 3: PREVIEW -> Delete dist/preview-*
    if (mode === 'preview') {
        console.log('🗑️  Cleaning previews...');
        if (fs.existsSync(DIST_DIR)) {
            removePattern(DIST_DIR, /^preview-/);
        }
        return;
    }

    // Case 4: SPECIFIC TARGET -> Delete dist/[target]
    if (mode && mode !== 'dist' && mode !== 'wipe') {
        // e.g. 'stable', 'latest', 'p', 'v'
        const customTarget = path.join(DIST_DIR, mode);
        if (fs.existsSync(customTarget)) {
            remove(customTarget);
        } else {
            console.log(`Target not found: ${mode}. Nothing to delete.`);
        }
        return;
    }

    // Case 5: DEFAULT / WIPE -> Delete dist, THEN REBUILD
    // If no args, or 'dist', or 'wipe' -> standard reset
    console.log('✨ Performing Full Reset...');
    remove(DIST_DIR);
    cleanRootArtifacts();

    console.log('🏗️  Triggering Full Rebuild...');
    spawnSync('npm', ['run', 'build:full'], { stdio: 'inherit' });

    // Since we are inside the script, we can trigger the rebuild explicitly here,
    // OR we can rely on package.json to chain it "node clean.js && npm run build".
    // The requirement said "Default (npm run clean): Remove dist, then trigger npm run build:full (Local Only)."
    // If we handle it in package.json, we don't need to spawn here.
    // BUT the requirement implementation plan for package.json says: '"clean": "node scripts/clean.js && npm run build:full"'
    // So this script just needs to exit after cleaning.
    // Wait, the user prompt implementation plan says:
    // "Default (npm run clean): Remove dist, then trigger npm run build:full (Local Only)."
    // My plan for package.json handles the trigger. So I just clean here.

    // However, if the user runs `node scripts/clean.js` directly, it won't rebuild. 
    // That is fine, `npm run clean` is the interface.
}

main();
