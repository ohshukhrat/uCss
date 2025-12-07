const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipe = promisify(pipeline);

const targetDir = process.argv[2];

if (!targetDir) {
    console.error('Usage: node scripts/compress.js <directory>');
    process.exit(1);
}

// File extensions to compress
const EXTENSIONS = ['.css', '.js', '.html', '.svg', '.json', '.xml'];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            // Check extension
            if (EXTENSIONS.includes(path.extname(fullPath))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

async function compressFile(filePath) {
    const source = fs.createReadStream(filePath);

    // 1. Gzip
    const gzip = zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });
    const gzDest = fs.createWriteStream(filePath + '.gz');
    await pipe(source, gzip, gzDest);

    // 2. Brotli
    const sourceBr = fs.createReadStream(filePath); // Need fresh stream
    const brotli = zlib.createBrotliCompress({
        params: {
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
            [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
        }
    });
    const brDest = fs.createWriteStream(filePath + '.br');
    await pipe(sourceBr, brotli, brDest);

    // Calculate stats for logging
    const originalSize = fs.statSync(filePath).size;
    const gzSize = fs.statSync(filePath + '.gz').size;
    const brSize = fs.statSync(filePath + '.br').size;

    const fileName = path.relative(targetDir, filePath);
    console.log(`  ✓ ${fileName}: ${originalSize} -> gz:${gzSize} br:${brSize}`);
}

async function main() {
    console.log(`Compressing files in: ${targetDir}`);
    const files = getAllFiles(targetDir);

    for (const file of files) {
        try {
            await compressFile(file);
        } catch (err) {
            console.error(`  ❌ Error compressing ${file}:`, err);
        }
    }
    console.log('Compression complete.');
}

main();
