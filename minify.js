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

    // 3. Optional: Remove spaces around common delimiters to save a bit more space
    // while still being safe. 
    // { } ; , : >
    // This is "dumb" minification, so we might skip this if we want to be 100% sure about "preserving structure".
    // However, the user said "removing only unnecessary whitespaces (we can keep one whitespace if it helps)".
    // So collapsing to single space is safe and requested.
    // Let's just trim the result.
    minified = minified.trim();

    process.stdout.write(minified);
});
