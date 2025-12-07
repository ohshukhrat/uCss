/**
 * @fileoverview Script to compress static assets using Gzip and Brotli.
 * Scans a directory recursively and compresses matching files in parallel.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipe = promisify(pipeline);

/**
 * Maximum number of concurrent compression operations.
 * Kept low to avoid 'EMFILE' (too many open files) errors on some systems.
 * @type {number}
 */
const MAX_CONCURRENCY = 8;

/**
 * File extensions to process.
 * @type {string[]}
 */
const EXTENSIONS = ['.css', '.js', '.html', '.svg', '.json', '.xml'];

// Get target directory from command line arguments
const targetDir = process.argv[2];

if (!targetDir) {
    console.error('Usage: node scripts/compress.js <directory>');
    process.exit(1);
}

/**
 * Recursively gets all files in a directory that match specific extensions.
 * @param {string} dirPath - The directory to search.
 * @param {string[]} [arrayOfFiles] - accumulator.
 * @returns {string[]} List of absolute file paths.
 */
function getAllFiles(dirPath, arrayOfFiles) {
    let files = [];
    try {
        files = fs.readdirSync(dirPath);
    } catch (e) {
        console.error(`Error reading directory ${dirPath}:`, e.message);
        return arrayOfFiles || [];
    }

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (EXTENSIONS.includes(path.extname(fullPath))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

/**
 * Compresses a single file using Gzip and Brotli.
 * @param {string} filePath - Path to the file to compress.
 * @returns {Promise<void>}
 */
async function compressFile(filePath) {
    const originalSize = fs.statSync(filePath).size;

    // 1. Gzip Compression
    try {
        const source = fs.createReadStream(filePath);
        const gzip = zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });
        const gzDest = fs.createWriteStream(filePath + '.gz');
        await pipe(source, gzip, gzDest);
    } catch (err) {
        throw new Error(`Gzip failed for ${filePath}: ${err.message}`);
    }

    // 2. Brotli Compression
    try {
        const sourceBr = fs.createReadStream(filePath);
        const brotli = zlib.createBrotliCompress({
            params: {
                [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            }
        });
        const brDest = fs.createWriteStream(filePath + '.br');
        await pipe(sourceBr, brotli, brDest);
    } catch (err) {
        throw new Error(`Brotli failed for ${filePath}: ${err.message}`);
    }

    // Stats
    const gzSize = fs.statSync(filePath + '.gz').size;
    const brSize = fs.statSync(filePath + '.br').size;
    const fileName = path.relative(targetDir, filePath);

    console.log(`  ✓ ${fileName}: ${originalSize}b -> gz:${gzSize}b br:${brSize}b`);
}

/**
 * Main execution function.
 * Manages the worker queue for concurrency.
 */
async function main() {
    console.log(`Compressing files in: ${targetDir}`);
    const files = getAllFiles(targetDir);

    // Concurrency control
    let active = 0;
    let index = 0;

    const results = [];

    // Worker function
    const next = async () => {
        if (index >= files.length) return;

        const i = index++;
        const file = files[i];

        try {
            await compressFile(file);
        } catch (err) {
            console.error(`  ❌ Error compressing ${file}:`, err.message);
        }

        // Process next
        await next();
    };

    // Start initial workers
    const workers = [];
    for (let i = 0; i < Math.min(MAX_CONCURRENCY, files.length); i++) {
        workers.push(next());
    }

    await Promise.all(workers);
    console.log('Compression complete.');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
