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
    // Be careful with strings, but for a simple "dumb" minifier, 
    // we can assume standard CSS comment structure.
    // This regex matches /* ... */ lazily.
    let minified = data.replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. Collapse whitespace
    // We want to replace sequences of whitespace with a single space,
    // BUT we must be careful not to break strings or specific CSS syntax that might rely on newlines 
    // (though standard CSS is mostly whitespace-insensitive).
    // A safer approach for "preserving everything" is just to replace newlines with spaces 
    // and then collapse multiple spaces to one.

    minified = minified.replace(/\s+/g, ' ');

    // 3. Remove spaces around CSS delimiters for better compression
    // This is safe and preserves all CSS structure/nesting
    minified = minified.replace(/\s*{\s*/g, '{');
    minified = minified.replace(/\s*}\s*/g, '}');
    minified = minified.replace(/\s*;\s*/g, ';');
    minified = minified.replace(/\s*:\s*/g, ':');
    minified = minified.replace(/\s*,\s*/g, ',');
    minified = minified.replace(/\s*>\s*/g, '>');

    // Trim final result
    minified = minified.trim();

    process.stdout.write(minified);
});
