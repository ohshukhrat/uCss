/**
 * @fileoverview Enhanced Manifest Generator
 * 
 * @description
 * Generates a "Gold Standard" project manifest.
 * Includes:
 * - Full project structure map
 * - SHA-256 content hashes for integrity
 * - Git context (Branch, Commit)
 * - File classification and summary statistics
 * 
 * EXCLUDES:
 * - node_modules
 * - .git
 * - notes/private
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'manifest.json');
const PACKAGE_JSON = require('../package.json');

const EXCLUDED_DIRS = new Set(['node_modules', '.git']);
const EXCLUDED_FILES = new Set(['.DS_Store', '.env', 'manifest.json', 'package-lock.json']);
const EXCLUDED_PATHS = new Set(['notes/private']);

// --- Helpers ---

function getGitInfo() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' }).toString().trim();
        const commit = execSync('git rev-parse HEAD', { stdio: 'pipe' }).toString().trim();
        const status = execSync('git status --porcelain', { stdio: 'pipe' }).toString().trim();
        return {
            branch,
            commit,
            isDirty: status.length > 0
        };
    } catch (e) {
        return { branch: 'unknown', commit: 'unknown', isDirty: false };
    }
}

function getFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// --- Main Logic ---

const manifest = {
    meta: {
        project: PACKAGE_JSON.name,
        version: PACKAGE_JSON.version,
        timestamp: new Date().toISOString(),
        generated_by: "uCss Build System",
        git: getGitInfo(),
        stats: {
            totalFiles: 0,
            totalSize: 0,
            totalSizeHuman: "",
            extensions: {}
        }
    },
    files: {},
    structure: {}
};

function scanDir(dirPath, structureNode) {
    const items = fs.readdirSync(dirPath).sort(); // Sort for consistent order

    for (const item of items) {
        if (EXCLUDED_FILES.has(item)) continue;

        const fullPath = path.join(dirPath, item);
        const relPath = path.relative(PROJECT_ROOT, fullPath);

        // Check for specific excluded paths
        const normalizedRelPath = relPath.split(path.sep).join('/');
        if (EXCLUDED_PATHS.has(normalizedRelPath)) continue;

        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            if (EXCLUDED_DIRS.has(item)) continue;
            structureNode[item] = {};
            scanDir(fullPath, structureNode[item]);
            // Prune empty directories from structure if needed, but keeping for fidelity
        } else {
            structureNode[item] = null;

            // Metadata gathering
            const ext = path.extname(item).toLowerCase() || '(no-ext)';
            const hash = getFileHash(fullPath);

            // Update Stats
            manifest.meta.stats.totalFiles++;
            manifest.meta.stats.totalSize += stats.size;
            manifest.meta.stats.extensions[ext] = (manifest.meta.stats.extensions[ext] || 0) + 1;

            manifest.files[normalizedRelPath] = {
                size: stats.size,
                mtime: stats.mtime.toISOString(),
                hash: `sha256-${hash}`,
                ext: ext
            };
        }
    }
}

console.log(`🔍 Scanning project: ${PROJECT_ROOT}`);
console.log(`   Git: ${manifest.meta.git.branch} (${manifest.meta.git.commit.substring(0, 7)})`);

const start = Date.now();
try {
    scanDir(PROJECT_ROOT, manifest.structure);

    // Finalize Stats
    manifest.meta.stats.totalSizeHuman = formatBytes(manifest.meta.stats.totalSize);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

    const duration = Date.now() - start;
    console.log(`✅ Manifest generated in ${duration}ms`);
    console.log(`   Files: ${manifest.meta.stats.totalFiles}`);
    console.log(`   Size: ${manifest.meta.stats.totalSizeHuman}`);
    console.log(`   Path: ${OUTPUT_FILE}`);
} catch (error) {
    console.error('❌ Error generating manifest:', error);
    process.exit(1);
}
