/**
 * @fileoverview Remote cleanup script for uCss preview builds.
 * Connects to the FTP server and removes preview directories older than 7 days.
 * 
 * @description This script is intended to be run in a CI/CD environment (GitHub Actions).
 * It uses the 'basic-ftp' library to list directories in the server root, identifies
 * folders matching the 'preview-YYYY-MM-DD-HH-mm-ss' pattern, parses their timestamps,
 * and deletes them if they exceed the retention policy (7 days).
 * 
 * @requires basic-ftp
 * @requires process.env.FTP_SERVER
 * @requires process.env.FTP_USERNAME
 * @requires process.env.FTP_PASSWORD
 * 
 * @usage node scripts/cleanup-remote.js
 * @note This script is typically run by GitHub Actions or other CI runners, not locally.
 */

const ftp = require("basic-ftp");

/**
 * Main execution function.
 * Establishes FTP connection, performs retention check, and deletes old folders.
 * @async
 * @returns {Promise<void>}
 */
async function main() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    const SERVER = process.env.FTP_SERVER;
    const USER = process.env.FTP_USERNAME;
    const PASS = process.env.FTP_PASSWORD;

    if (!SERVER || !USER || !PASS) {
        console.error("❌ Missing FTP credentials (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)");
        process.exit(1);
    }

    try {
        await client.access({
            host: SERVER,
            user: USER,
            password: PASS,
            secure: false // Set to true if FTPS is supported/required
        });

        console.log("📂 Listing directories...");
        const list = await client.list('/'); // Root directory, adjust if needed

        const now = Date.now();
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

        for (const item of list) {
            // Check if item is a directory and matches preview pattern
            if (item.isDirectory && item.name.startsWith('preview-')) {
                // Name format: preview-YYYY-MM-DD-HH-mm-ss
                const datePart = item.name.replace('preview-', '');
                const parts = datePart.split('-');

                // Parse date parts
                if (parts.length === 6) {
                    const [yyyy, MM, dd, HH, mm, ss] = parts;
                    // Note: Month is 0-indexed in JS Date constructor
                    const buildDate = new Date(yyyy, MM - 1, dd, HH, mm, ss).getTime();
                    const age = now - buildDate;

                    const ageDays = (age / (1000 * 60 * 60 * 24)).toFixed(1);

                    if (age > SEVEN_DAYS_MS) {
                        console.log(`🗑️ Deleting old preview: ${item.name} (Age: ${ageDays} days)`);
                        await client.removeDir(item.name);
                    } else {
                        console.log(`✅ Keeping: ${item.name} (Age: ${ageDays} days)`);
                    }
                }
            }
        }

    } catch (err) {
        console.error("❌ FTP Error:", err);
        // Do not exit with error code to prevent breaking the build pipeline on cleanup failure
        // Just log the error.
        process.exit(0);
    } finally {
        client.close();
    }
}

main();
