/**
 * @fileoverview Recursively bundles CSS files by resolving @import statements.
 * Prevents circular dependencies and ensures checks for missing files.
 */

const fs = require('fs');
const path = require('path');

// Arguments: node bundle.js <entryFile>
const entryFile = process.argv[2];

if (!entryFile) {
    console.error('Usage: node bundle.js <entryFile>');
    process.exit(1);
}

// Helper to determine actual path
const projectRoot = path.resolve(__dirname, '..');

/**
 * Resolves an import path relative to the current file or project root.
 * Enforces that resolved paths must be within the project root.
 * @param {string} importPath - The path found in @import "..."
 * @param {string} currentDir - The directory of the file currently being processed
 * @returns {string} The absolute resolved file path
 * @throws {Error} If path is outside project root
 */
function resolvePath(importPath, currentDir) {
    let resolved;
    if (importPath.startsWith('lib/')) {
        // "lib/" -> "src/lib/" relative to project root
        resolved = path.join(projectRoot, 'src', importPath);
    } else {
        // relative to current file
        resolved = path.resolve(currentDir, importPath);
    }

    if (!resolved.startsWith(projectRoot)) {
        throw new Error(`Security Exception: Access denied for path outside project root: ${resolved}`);
    }

    return resolved;
}

/**
 * Main bundling function.
 * @param {string} filePath - Absolute path to the entry file
 * @returns {string} Bundled CSS content
 */
function bundleEntry(filePath) {
    const stack = new Set();
    const visited = new Set();

    /**
     * Internal recursive bundler.
     * @param {string} currentPath - Current file path being processed
     * @returns {string} Processed content
     */
    function _innerBundle(currentPath) {
        if (stack.has(currentPath)) {
            return `/* Cycle detected: ${path.relative(projectRoot, currentPath)} */`;
        }

        // Circular dependency check (stack)
        stack.add(currentPath);

        let content;
        try {
            content = fs.readFileSync(currentPath, 'utf8');
        } catch (e) {
            process.stderr.write(`Error reading ${currentPath}: ${e.message}\n`);
            return `/* Error reading ${path.relative(projectRoot, currentPath)} */`;
        }

        const currentDir = path.dirname(currentPath);
        // Regex to match @import "path"; or @import 'path';
        const importRegex = /@import\s+['"]([^'"]+)['"];/g;

        const replaced = content.replace(importRegex, (match, importPath) => {
            let resolvedPath;
            try {
                resolvedPath = resolvePath(importPath, currentDir);
            } catch (err) {
                process.stderr.write(`Security Warning: ${err.message}\n`);
                return `/* Invalid import: ${importPath} */`;
            }

            if (!fs.existsSync(resolvedPath)) {
                process.stderr.write(`Warning: Import not found: ${importPath} (resolved: ${resolvedPath})\n`);
                return `/* Missing import: ${importPath} */`;
            }
            return _innerBundle(resolvedPath);
        });

        stack.delete(currentPath);
        return replaced;
    }

    return _innerBundle(filePath);
}

try {
    const absPath = path.resolve(process.cwd(), entryFile);
    const output = bundleEntry(absPath);
    process.stdout.write(output);
} catch (err) {
    console.error("Bundling failed:", err);
    process.exit(1);
}
