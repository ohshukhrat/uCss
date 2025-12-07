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

    // 1. Remove CSS comments /* ... */
    // Using simple regex as previously discussed - sufficient for this project's style
    let cleaned = data.replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. Remove multiple empty lines
    // Replace 3 or more newlines with 2 (leaving one empty line gap max)
    cleaned = cleaned.replace(/(\n\s*){3,}/g, '\n\n');

    // 3. Trim trailing whitespace on lines
    cleaned = cleaned.replace(/[ \t]+$/gm, '');

    // 4. Ensure file ends with newline
    cleaned = cleaned.trim() + '\n';

    process.stdout.write(cleaned);
});
