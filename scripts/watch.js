/**
 * @fileoverview Watch mode for uCss development.
 * Monitors src/ directory for changes and triggers automatic rebuilds.
 * 
 * @description Uses Node's fs.watch with recursive monitoring to detect changes
 * in source files. Implements debouncing to prevent excessive rebuilds during
 * rapid file saves. Rebuilds are triggered via child process spawn to isolate
 * build errors from the watch process.
 * 
 * @usage npm run watch
 * @example node scripts/watch.js
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
