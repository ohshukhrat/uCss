/**
 * @fileoverview Minifies CSS content by removing unnecessary whitespace and comments.
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
     * Minified CSS content.
     * 1. Removes comments.
     * 2. Collapses whitespace.
     * 3. Removes spaces around delimiters.
     */
    let minified = data
        // 1. Remove CSS comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // 2. Collapse whitespace to single space
        .replace(/\s+/g, ' ')
        // 3. Remove spaces around delimiters
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*>\s*/g, '>')
        // 4. Trim final result
        .trim();

    process.stdout.write(minified);
});
