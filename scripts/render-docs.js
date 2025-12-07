#!/usr/bin/env node
const fs = require('fs');
const { marked } = require('marked');

// Read README from argument or default
const readmePath = process.argv[2] || 'README.md';
const markdown = fs.readFileSync(readmePath, 'utf8');

// Configure marked options
marked.setOptions({
    breaks: false,
    gfm: true,
    headerIds: true,
    mangle: false
});

// Parse and output HTML
const html = marked.parse(markdown);
process.stdout.write(html);
