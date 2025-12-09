/**
 * @fileoverview Local Development Watcher
 * 
 * @description
 * This script turns the passive build system into an active dev environment.
 * It monitors the `src/` directory for any file changes and triggers a rebuild of `dist/stable`.
 * 
 * ---------------------------------------------------------------------------------------------
 * ⚙️ TECHNICAL IMPLEMENTATION
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. DEBOUNCING (THE 300MS RULE)
 *    Editors often save files in chunks or trigger multiple OS events for a single "Save".
 *    Without debouncing, a single `Ctrl+S` could trigger 3 builds in 10ms.
 *    We wait for 300ms of silence before triggering the build to act as a "buffer".
 * 
 * 2. PROCESS ISOLATION (SPAWN vs IMPORT)
 *    We do NOT import `build.js` directly. Instead, we `spawn` it as a separate child process.
 *    WHY?
 *    - Memory Leaks: Requiring and re-running a script in the same Node process can leak memory.
 *    - Crash Safety: If `build.js` crashes (syntax error), we don't want the watcher to die.
 *      The child dies, the watcher logs the error, and keeps watching.
 *    - Clean Environment: Each build starts with a fresh V8 context.
 * 
 * 3. ATOMICITY
 *    We use an `isBuilding` mutex flag. If a build is currently running, new build requests
 *    are ignored until the current one finishes.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🚀 USAGE
 * ---------------------------------------------------------------------------------------------
 * 
 * @usage npm run watch
 * 
 * @example
 * // Terminal 1
 * npm run watch
 * 
 * // Terminal 2
 * npm start (or your http server)
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

/**
 * Debounce function to limit the frequency of build triggers.
 * Delays function execution until after 'wait' milliseconds have elapsed
 * since the last call. Prevents rapid-fire rebuilds during multi-file saves.
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait before executing
 * @returns {Function} Debounced version of the input function
 * @example
 * const debouncedBuild = debounce(build, 300);
 * debouncedBuild(); // Waits 300ms before executing
 */
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/** @type {boolean} Flag to prevent concurrent builds */
let isBuilding = false;

/**
 * Triggers a build by spawning the build.js script as a child process.
 * Prevents concurrent builds using the isBuilding flag. Clears console
 * and provides timestamped feedback to the developer.
 * @returns {void}
 */
function build() {
    if (isBuilding) return;
    isBuilding = true;
    console.clear();
    console.log(`\nChanges detected. Rebuilding... (${new Date().toLocaleTimeString()})\n`);

    const child = spawn('node', ['scripts/build.js'], { stdio: 'inherit' });

    child.on('close', (code) => {
        isBuilding = false;
        if (code === 0) {
            console.log('\nWaiting for changes...\n');
        } else {
            console.error('\nBuild failed.\n');
        }
    });
}

const debouncedBuild = debounce(build, 300); // 300ms debounce

console.log(`Watching ${SRC_DIR} for changes...`);
build(); // Initial build

fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && !filename.endsWith('~') && !filename.startsWith('.')) {
        debouncedBuild();
    }
});
