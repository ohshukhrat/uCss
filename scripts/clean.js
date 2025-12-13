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
 * 1. DEFAULT (`npm run clean`)
 *    - Action: Nukes `dist/`.
 *    - Follow-up: Rebuilds `stable` + `latest` + `p` + `v` (via `npm run build:full`).
 *    - Goal: "Reset to a working state".
 * 
 * 2. ALL / NUKE (`npm run clean:all`)
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
 *    - Example: `npm run clean my-test-build`.
 * 
 * ---------------------------------------------------------------------------------------------
 * 💻 EXAMPLES
 * ---------------------------------------------------------------------------------------------
 * 
 * @example
 * npm run clean          # Reset project
 * npm run clean:nuke     # Empty dist
 * npm run clean preview  # Delete all previews
 */

const fs = require('fs');
const path = require('path');

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

    console.log(`Clean mode: ${mode || 'FULL PROJECT'} ${subMode || ''}`);

    // Case 1: No args OR 'all' -> Full clean
    if (!mode || mode === 'all') {
        console.log('Cleaning all artifacts...');
        remove(DIST_DIR);
        removePattern(PROJECT_ROOT, /\.tgz$/);
        removePattern(PROJECT_ROOT, /\.log$/);
        removePattern(PROJECT_ROOT, /^thumbs\.db$/i);
        removePattern(PROJECT_ROOT, /^\.DS_Store$/);
        return;
    }

    // Case 2: Specific targets
    if (mode === 'dist') {
        if (subMode === 'latest') {
            remove(path.join(DIST_DIR, 'latest'));
        } else {
            remove(DIST_DIR);
        }
        return;
    }

    if (mode === 'stable') {
        remove(path.join(DIST_DIR, 'stable'));
        return;
    }

    if (mode === 'latest') {
        remove(path.join(DIST_DIR, 'latest'));
        return;
    }

    if (mode === 'preview') {
        // Delete dist/preview-*
        if (fs.existsSync(DIST_DIR)) {
            removePattern(DIST_DIR, /^preview-/);
        }
        return;
    }

    if (mode === 'safe') {
        // Delete everything in dist/ EXCEPT stable and latest
        if (fs.existsSync(DIST_DIR)) {
            const files = fs.readdirSync(DIST_DIR);
            for (const file of files) {
                if (file !== 'stable' && file !== 'latest') {
                    remove(path.join(DIST_DIR, file));
                }
            }
        }
        // Also clean root artifacts
        removePattern(PROJECT_ROOT, /\.tgz$/);
        removePattern(PROJECT_ROOT, /\.log$/);
        removePattern(PROJECT_ROOT, /^thumbs\.db$/i);
        removePattern(PROJECT_ROOT, /^\.DS_Store$/);
        return;
    }

    // Fallback / Custom Target
    // If user runs `npm run clean my-folder`, we assume they want to delete `dist/my-folder`
    const customTarget = path.join(DIST_DIR, mode);
    if (fs.existsSync(customTarget)) {
        remove(customTarget);
        return;
    }

    console.log(`Unknown clean target: ${mode}`);
    console.log('Available targets: (empty), dist, stable, latest, preview, safe, [custom-folder]');
}

main();
