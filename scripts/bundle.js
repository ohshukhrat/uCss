const fs = require('fs');
const path = require('path');

// Arguments: node bundle.js <entryFile> [sourceRef]
// sourceRef is optional, used for git show if needed (but we will focus on fs for now as per build.sh changes)
// Note: The original build.sh handled 'git show' for historical versions. 
// To keep it simple and consistent with the request "Move the 'resolve imports' logic out of Bash",
// we should probably support reading from FS. 
// If the user needs git support in the future, we can add it, but for now `build.sh` passed file paths.

const entryFile = process.argv[2];

if (!entryFile) {
    console.error('Usage: node bundle.js <entryFile>');
    process.exit(1);
}

// Helper to determine actual path
const projectRoot = path.resolve(__dirname, '..');

// We need a function to read content. 
// If we want to support the "source ref" logic from build.sh (reading from git),
// we might need to pass that or just rely on file system if the user only runs this locally.
// The previous bash script did: `read_source` which checked `$SOURCE_REF`.
// If we want to fully replace the logic, we should probably just stick to FS for simplicity first 
// unless the user strictly relies on the git-reading capability in this specific refactor.
// Given the user instruction "Move the 'resolve imports' logic out of Bash", 
// and the context of "Automate Local Dist Rebuild", local FS is the priority.
// However, `build.sh` logic for `read_source` was smart.
// For this step, I will implement FS reading. 

function resolvePath(importPath, currentDir) {
    if (importPath.startsWith('lib/')) {
        // "lib/" -> "src/lib/" relative to project root
        return path.join(projectRoot, 'src', importPath);
    } else {
        // relative to current file
        return path.resolve(currentDir, importPath);
    }
}

const processedFiles = new Set();

function bundle(filePath) {
    // Avoid circular dependency loops
    if (processedFiles.has(filePath)) {
        return `/* Loop detected: ${path.relative(projectRoot, filePath)} */`;
    }
    processedFiles.add(filePath);

    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        console.error(`Error reading ${filePath}: ${e.message}`);
        return `/* Error reading ${path.relative(projectRoot, filePath)} */`;
    }

    const currentDir = path.dirname(filePath);

    // Regex to match @import "path";
    // Supporting both single and double quotes
    const importRegex = /@import\s+['"]([^'"]+)['"];/g;

    return content.replace(importRegex, (match, importPath) => {
        const resolvedPath = resolvePath(importPath, currentDir);

        // Check if file exists to be safe
        if (!fs.existsSync(resolvedPath)) {
            console.error(`Warning: Import not found: ${importPath} (resolved: ${resolvedPath})`);
            return `/* Missing import: ${importPath} */`;
        }

        // Recursively bundle
        // We temporarily remove from processedFiles to allow diamond dependencies? 
        // No, CSS doesn't really do diamond deps the same way, but usually you don't want to double-include.
        // If file A imports B and C, and B imports C, C should probably only be included once?
        // In standard CSS, it would be included twice. 
        // But for a utility framework, maybe we want deduplication?
        // The previous bash script didn't deduplicate at all across the tree, only strictly tree-walked.
        // It processed each file. If A imports B, and C imports B, B appears twice if A and C are both entered.
        // Wait, the bash script was:
        // iterate matches. if module (has imports), recurse. if leaf, print.
        // It basically inlined everything.
        // Standard CSS @import inlining behavior: Include it where it is. 
        // So we will NOT deduplicate to preserve behavior. 
        // We only track `processedFiles` to prevent infinite recursion (A -> B -> A).

        const result = bundle(resolvedPath);

        // After finishing a branch, we should perhaps remove it from processedFiles 
        // if we want to allow it to be imported again elsewhere?
        // "Cycles" are bad, but "Multiple inclusions" are valid in CSS (though inefficient).
        // Let's stick to preventing cycles.
        // To allow re-inclusion, we need to remove from Set after return?
        // Actually, if we want to allow A->B and C->B, we MUST remove B from Set after A finishes?
        // No, `processedFiles` tracks the *current recursion stack*.

        return result;
    });
}

// Wrapper to manage recursion stack correctly
function bundleEntry(filePath) {
    const stack = new Set();

    function _innerBundle(currentPath) {
        if (stack.has(currentPath)) {
            return `/* Cycle detected: ${path.relative(projectRoot, currentPath)} */`;
        }
        stack.add(currentPath);

        let content;
        try {
            content = fs.readFileSync(currentPath, 'utf8');
        } catch (e) {
            process.stderr.write(`Error reading ${currentPath}: ${e.message}\n`);
            return `/* Error reading ${path.relative(projectRoot, currentPath)} */`;
        }

        const currentDir = path.dirname(currentPath);
        const importRegex = /@import\s+['"]([^'"]+)['"];/g;

        const replaced = content.replace(importRegex, (match, importPath) => {
            const resolvedPath = resolvePath(importPath, currentDir);
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
    const output = bundleEntry(path.resolve(process.cwd(), entryFile));
    process.stdout.write(output);
} catch (err) {
    console.error("Bundling failed:", err);
    process.exit(1);
}
