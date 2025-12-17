/**
 * @fileoverview uCss Documentation Generator
 * 
 * @description
 * Handles the generation of HTML documentation from Markdown files.
 * Includes injection of core UI elements like the Theme Switcher and Back to Top button.
 */

const fs = require('fs').promises;
const { existsSync } = require('fs');
const path = require('path');
const { marked } = require('marked');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DIST_ROOT = path.join(PROJECT_ROOT, 'dist');

/**
 * Helper to get git hash or timestamp
 */
function getBuildHash() {
    try {
        const res = execSync('git rev-parse --short HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        return res || Date.now().toString(36);
    } catch (e) { return Date.now().toString(36); }
}

/**
 * Applies prefixing to HTML content (classes and inline styles).
 * @param {string} html
 * @param {string} validMode - 'p', 'c', or 'v'
 * @param {string} prefixString - e.g. 'u'
 */
const prefixHtml = (html, validMode, prefixString) => {
    if (!validMode) return html;

    let processed = html;
    const p = (prefixString.endsWith('-') ? prefixString : `${prefixString}-`);

    // 1. Class Prefixing (for 'p' or 'c' modes)
    if (validMode === 'p' || validMode === 'c') {
        processed = processed.replace(/class="([^"]*)"/g, (match, classList) => {
            const classes = classList.split(/\s+/).filter(Boolean);
            const prefixed = classes.map(cls => {
                // Exclude standard WP/Block classes
                if (/^(wp|block|editor)(?:-|$)/.test(cls)) return cls;
                return `${p}${cls}`;
            });
            return `class="${prefixed.join(' ')}"`;
        });
    }

    // 2. Inline Style Variable Prefixing (for 'p' or 'v' modes)
    if (validMode === 'p' || validMode === 'v') {
        processed = processed.replace(/style="([^"]*)"/g, (match, styleContent) => {
            const paramPrefix = `--${p}`;
            const replacedStyle = styleContent.replace(/--(?!(theme|u|ucss|wp|block|editor)(?:-|$))([\w-]+)/g, (m, restricted, varName) => {
                return `${paramPrefix}${varName}`;
            });
            return `style="${replacedStyle}"`;
        });
    }

    return processed;
};

/**
 * Reads file content from local disk or git history.
 * @param {string} filePath
 * @param {string} [sourceRef]
 */
async function readFile(filePath, sourceRef) {
    if (sourceRef) {
        const relPath = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
        try {
            return execSync(`git show "${sourceRef}:${relPath}"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        } catch (e) { return ''; }
    } else {
        try { return await fs.readFile(filePath, 'utf8'); } catch (e) { return ''; }
    }
}

/**
 * Main Documentation Builder Function
 * 
 * @param {object} config
 * @param {string} config.outputDir - Full path to output directory
 * @param {string} config.outputDirName - Name of output directory (e.g. 'latest', 'stable')
 * @param {string} config.sourceRef - Git ref if building from history
 * @param {string} config.validMode - Prefix mode ('p', 'c', 'v') or null
 * @param {string} config.prefixString - Prefix string (e.g. 'u')
 */
async function buildDocs({ outputDir, outputDirName, sourceRef, validMode, prefixString }) {
    try {
        console.log('Generating documentation...');

        const generateHtml = async (mdPath, outPath, title) => {
            try {
                // Log detailed progress
                // console.log(`Processing: ${path.basename(mdPath)}`);

                const md = await readFile(mdPath, sourceRef);
                if (!md) {
                    console.warn(`Warning: skipped Markdown file (empty): ${mdPath}`);
                    return;
                }

                // CONFIG: Render Markdown
                const renderer = {
                    heading({ tokens, depth }) {
                        const text = this.parser.parseInline(tokens);
                        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
                        return `<h${depth} id="${id}">${text}</h${depth}>`;
                    },
                    link({ href, title, tokens }) {
                        const text = this.parser.parseInline(tokens);
                        let hrefStr = String(href);

                        // 1. Point README links to directory root (index.html)
                        hrefStr = hrefStr.replace(/\/README\.md(?=$|#|\?)/, '/');
                        hrefStr = hrefStr.replace(/^README\.md(?=$|#|\?)/, './');

                        // 2. Rebase 'src/' links for Root README
                        if (mdPath === path.join(PROJECT_ROOT, 'README.md')) {
                            if (hrefStr.startsWith('./src/') || hrefStr.startsWith('src/')) {
                                hrefStr = hrefStr.replace(/^(\.\/)?src\//, `./${outputDirName}/`);
                            }
                        }

                        return `<a href="${hrefStr}"${title ? ` title="${title}"` : ''}>${text}</a>`;
                    }
                };
                marked.use({ renderer });

                let htmlContent;
                try {
                    htmlContent = marked.parse(md, { gfm: true, breaks: false });
                } catch (e) {
                    console.error(`Error parsing markdown for ${mdPath}:`, e);
                    return;
                }

                htmlContent = htmlContent.replace(/<table>/g, '<div class="ofx"><table>').replace(/<\/table>/g, '</table></div>');

                const isRootEntry = (path.resolve(outPath) === path.resolve(DIST_ROOT, 'index.html'));
                let cdnBase = 'stable';

                if (isRootEntry) {
                    if (outputDirName === 'latest' && !existsSync(path.join(DIST_ROOT, 'stable'))) {
                        cdnBase = 'latest';
                    } else {
                        cdnBase = 'stable';
                    }
                } else {
                    if (outputDirName.startsWith('preview')) cdnBase = outputDirName;
                    else if (outputDirName === 'latest') cdnBase = 'latest';
                    else if (['p', 'c', 'v'].includes(outputDirName)) cdnBase = outputDirName;
                    else cdnBase = 'stable';
                }

                if (cdnBase !== 'stable') {
                    htmlContent = htmlContent.replace(/ucss\.unqa\.dev\/stable/g, `ucss.unqa.dev/${cdnBase}`);
                }

                const cssUrl = (path) => `https://ucss.unqa.dev/${path}`;
                const buildHash = getBuildHash();

                const coreCss = isRootEntry
                    ? cssUrl(`u.min.css?v=${buildHash}`)
                    : cssUrl(`${cdnBase}/u.min.css?v=${buildHash}`);

                const configCss = cssUrl(`${cdnBase}/lib/config.min.css?v=${buildHash}`);

                const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="uCss - Modern, mobile-first, pure CSS framework with zero dependencies">
    <title>${title}</title>
    <link rel="preconnect" href="https://ucss.unqa.dev">
    <link rel="stylesheet" href="${configCss}">
    <link rel="stylesheet" href="${coreCss}">
    <style>
        /* Documentation specific overrides */
        .s { min-height: 100vh; }
    </style>
</head>
<body class="un set base">
    <script>try{if(localStorage.getItem('u-theme')==='alt'){document.body.classList.remove('base');document.body.classList.add('alt')}}catch(e){}</script>
    <section class="s" style="--sc-max-w: 56rem; --scc-gap: .75rem;">
        <div class="sf"><div>${htmlContent}</div></div>
    </section>

    <!-- Theme Toggle -->
    <button onclick="const b=document.body;b.classList.toggle('base');b.classList.toggle('alt');const t=b.classList.contains('alt')?'alt':'base';try{localStorage.setItem('u-theme',t)}catch(e){}" class="btn subtle icn blr rd" style="position: fixed; bottom: 2rem; left: 2rem; z-index: 999; --btn-c: var(--tx);">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    </button>
    
    <!-- Back To Top -->
    <button id="backToTop" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="btn subtle icn blr rd" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 999; --btn-c: var(--tx); opacity: 0; pointer-events: none; transition: opacity 0.3s, transform 0.3s; transform: translateY(10px);">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
    </button>
    <script>
        (function(){
            const b = document.getElementById('backToTop');
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                const scrollingUp = currentScrollY < lastScrollY;
                const belowFold = currentScrollY > window.innerHeight;
                
                if (scrollingUp && belowFold) {
                    b.style.opacity = '1';
                    b.style.pointerEvents = 'auto';
                    b.style.transform = 'translateY(0)';
                } else {
                    b.style.opacity = '0';
                    b.style.pointerEvents = 'none';
                    b.style.transform = 'translateY(10px)';
                }
                
                lastScrollY = currentScrollY;
            }, {passive: true});
        })();
    </script>
</body>
</html>`;

                if (validMode) {
                    await fs.writeFile(outPath, prefixHtml(template, validMode, prefixString));
                } else {
                    await fs.writeFile(outPath, template);
                }
            } catch (innerErr) {
                console.error(`generateHtml failed for ${outPath}:`, innerErr);
                // Don't throw here to allow other files to proceed, or throw?
                // Let's re-throw so we know something went wrong
                throw innerErr;
            }
        };

        const docTasks = [];

        if (existsSync(path.join(PROJECT_ROOT, 'README.md'))) {
            docTasks.push(generateHtml(path.join(PROJECT_ROOT, 'README.md'), path.join(outputDir, 'index.html'), 'uCss Documentation - Root'));

            if (outputDirName === 'stable' || outputDirName === 'latest') {
                docTasks.push(generateHtml(path.join(PROJECT_ROOT, 'README.md'), path.join(DIST_ROOT, 'index.html'), 'uCss Documentation - Root'));
            }
        }

        let readmes = [];
        if (sourceRef) {
            readmes = execSync(`git ls-tree -r --name-only "${sourceRef}:src/"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
                .split('\n').filter(f => f.endsWith('README.md')).map(f => path.join(SRC_DIR, f));
        } else {
            async function getReadmes(dir) {
                let results = [];
                const entries = await fs.readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const f = path.join(dir, entry.name);
                    if (entry.isDirectory()) results = results.concat(await getReadmes(f));
                    else if (entry.name === 'README.md') results.push(f);
                }
                return results;
            }
            readmes = await getReadmes(SRC_DIR);
        }

        docTasks.push(...readmes.map(async readme => {
            const relDir = path.relative(SRC_DIR, path.dirname(readme));
            const targetDir = path.join(outputDir, relDir);
            await fs.mkdir(targetDir, { recursive: true });
            await generateHtml(readme, path.join(targetDir, 'index.html'), `uCss Documentation - ${relDir || 'Root'}`);
        }));

        await Promise.all(docTasks);
        console.log('  ✓ Documentation generated');
    } catch (error) {
        console.error('buildDocs failed:', error);
        throw error;
    }
}

module.exports = { buildDocs };
