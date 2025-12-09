/**
 * @fileoverview uCss Workspace Cleanup Utility
 * 
 * @description
 * This script is the "Garbage Collector" for the project. It provides granular control over
 * removing build artifacts without accidentally deleting something important (like your source code).
 * 
 * ---------------------------------------------------------------------------------------------
 * 🛡️ SAFETY MECHANISMS
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. SCOPED DELETION
 *    This script ONLY operates on specific paths:
 *    - `dist/` (The build output directory)
 *    - Root-level log files (`*.log`)
 *    - Root-level tarballs (`*.tgz`)
 *    - OS junk (`.DS_Store`, `thumbs.db`)
 *    It will NEVER touch `src/` or `server/`.
 * 
 * 2. THE "SAFE" MODE
 *    Running `npm run clean safe` is a special mode designed for developers who switch branches often.
 *    It deletes `dist/` but *PRESERVES* `dist/stable` and `dist/latest`.
 *    WHY? Because you might have a local valid build of the stable release that you don't want to rebuild
 *    every time you clean up a feature branch's preview files.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🎯 USAGE & TARGETS
 * ---------------------------------------------------------------------------------------------
 * 
 * @usage npm run clean [target] [subtarget]
 * 
 * @example
 * // 1. Full Nuclear Clean (Default)
 * // Deletes dist/, *.tgz, *.log. Resets repo to "just cloned" state (regarding artifacts).
 * npm run clean
 * 
 * @example
 * // 2. Clean Specific Release Channel
 * // Only deletes dist/latest/ (useful if you suspect a corrupt dev build)
 * npm run clean latest
 * 
 * @example
 * // 3. Clean Preview Builds
 * // Deletes all dist/preview-* folders from PR builds, keeping stable/latest intact.
 * npm run clean preview
 * 
 * @example
 * // 4. Safe Clean
 * // The "Smart" clean. Removes everything EXCEPT your main production builds.
 * npm run clean safe
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

    // Case 1: No args -> Full clean
    if (!mode) {
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

    // Fallback
    console.log(`Unknown clean target: ${mode}`);
    console.log('Available targets: (empty), dist, stable, latest, preview, safe');
}

main();
