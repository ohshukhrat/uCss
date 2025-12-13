/**
 * @fileoverview Static Asset Compression Utility
 * 
 * @description
 * The "Zipper". Generates Brotli and Gzip variants of assets.
 * Crucial for high-performance production delivery.
 * 
 * ---------------------------------------------------------------------------------------------
 * ⚙️ ALGORITHMS
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. BROTLI (`.br`)
 *    - Level: BROTLI_MAX_QUALITY (11).
 *    - Speed: Slowest to compress, Fastest to decompress. Smallest file size.
 *    - Use Case: Modern Browsers (Chrome, Firefox, Edge).
 * 
 * 2. GZIP (`.gz`)
 *    - Level: Z_BEST_COMPRESSION (9).
 *    - Speed: Fast.
 *    - Use Case: Compatibility (Older clients, some proxies).
 * 
 * ---------------------------------------------------------------------------------------------
 * 🧠 CONCURRENCY PATTERN
 * ---------------------------------------------------------------------------------------------
 * 
 * Compressing 1000 files at once would crash the OS (EMFILE).
 * We use a **Worker Pool** limited by CPU cores (`os.cpus().length`).
 * - Workers = Core Count.
 * - Queue = All files.
 * - As one worker finishes, it grabs the next file.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🚀 USAGE
 * ---------------------------------------------------------------------------------------------
 * 
 * @example
 * // Usually called automatically by build.js
 * node scripts/compress.js dist/latest
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
const os = require('os');
const MAX_CONCURRENCY = os.cpus().length;

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
 * @param {string} dirPath - The directory to search
 * @param {string[]} [arrayOfFiles=[]] - Internal accumulator for recursion
 * @returns {string[]} Array of absolute file paths that match EXTENSIONS
 * @example
 * const files = getAllFiles('./dist/latest');
 * // Returns: ['/abs/path/dist/latest/u.css', '/abs/path/dist/latest/u.min.css', ...]
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
 * Compresses a single file using Gzip and Brotli compression algorithms.
 * Creates two output files: filename.gz and filename.br
 * @param {string} filePath - Absolute path to the file to compress
 * @returns {Promise<void>}
 * @throws {Error} If compression fails for either algorithm
 * @example
 * await compressFile('/path/to/dist/u.min.css');
 * // Creates: /path/to/dist/u.min.css.gz and /path/to/dist/u.min.css.br
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
 * Main execution function. Manages concurrent compression operations
 * using a worker pool pattern to avoid EMFILE (too many open files) errors.
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Logs errors but continues processing remaining files
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
