/**
 * @fileoverview Cleans CSS content by removing comments and excessive whitespace.
 * Reads from stdin and writes to stdout.
 */

const fs = require('fs');

// Read from stdin
let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    data += chunk;
});

process.stdin.on('end', function () {
    if (!data) {
        return;
    }

    /**
     * Cleaned CSS content.
     * 1. Removes comments.
     * 2. Collapses excessive newlines.
     * 3. Trims line endings.
     */
    let cleaned = data
        // 1. Remove CSS comments /* ... */
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // 2. Remove multiple empty lines (max 1 empty line)
        .replace(/(\n\s*){3,}/g, '\n\n')
        // 3. Trim trailing whitespace on lines
        .replace(/[ \t]+$/gm, '')
        // 4. Ensure file ends with newline
        .trim() + '\n';

    process.stdout.write(cleaned);
});
