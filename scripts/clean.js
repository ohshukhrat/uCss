/**
 * @fileoverview cleanup utility for uCss project.
 * Handles deletion of build artifacts and temporary files.
 * 
 * @description Provides granular control over workspace cleanup:
 * - Full clean: Deletes dist/ and project artifacts (logs, tgz)
 * - Target clean: Deletes specific build outputs (dist, stable, latest, preview)
 * 
 * @usage npm run clean [target] [subtarget]
 * @example
 * npm run clean             # Deletes dist/, *.tgz, *.log
 * npm run clean dist        # Deletes dist/ only
 * npm run clean stable      # Deletes dist/stable/
 * npm run clean latest      # Deletes dist/latest/
 * npm run clean preview     # Deletes all dist/preview-* directories
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

    // Fallback
    console.log(`Unknown clean target: ${mode}`);
    console.log('Available targets: (empty), dist, stable, latest, preview');
}

main();
