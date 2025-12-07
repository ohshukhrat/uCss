#!/usr/bin/env node

/**
 * @fileoverview Renders a Markdown file to HTML using 'marked'.
 * Reads file path from arguments and writes HTML to stdout.
 */

const fs = require('fs');
const { marked } = require('marked');

// Read README from argument or default
const readmePath = process.argv[2] || 'README.md';

let markdown;
try {
    markdown = fs.readFileSync(readmePath, 'utf8');
} catch (e) {
    console.error(`Error reading ${readmePath}: ${e.message}`);
    process.exit(1);
}

// Configure marked options
marked.setOptions({
    breaks: false,
    gfm: true
});

// Parse and output HTML
const html = marked.parse(markdown);
process.stdout.write(html);
