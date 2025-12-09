/**
 * @fileoverview Remote Preview Cleanup Logic
 * 
 * @description
 * This script is the "Garbage Collector" for our staging server.
 * When we deploy Pull Requests or Feature Branches, we create timestamped preview folders
 * (e.g. `preview-2023-10-27-14-00-00`). If left unchecked, these folders accumulate and waste
 * storage/inodes on the FTP server.
 * 
 * ---------------------------------------------------------------------------------------------
 * ⚙️ RETENTION POLICY (7 DAYS)
 * ---------------------------------------------------------------------------------------------
 * 
 * We enforce a strict 7-day Time-To-Live (TTL) for preview builds.
 * 1. Connect to FTP.
 * 2. List all directories starting with `preview-`.
 * 3. Parse the timestamp from the folder name.
 * 4. Compare with `Date.now()`.
 * 5. If > 7 days old, DELETE.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🛡️ RESILIENCE STRATEGY
 * ---------------------------------------------------------------------------------------------
 * 
 * FTP is notoriously flaky, especially from CI environments. To prevent transient network
 * glitches from marking the build as "Failed", we implement:
 * 
 * 1. RETRIES: Connection attempts are retried 3 times with a 2-second backoff.
 * 2. SOFT FAIL: If the script ultimately fails (after retries), we `process.exit(0)` instead of 1.
 *    WHY? Because cleaning up old previews is a "nice to have", not a critical path.
 *    We don't want to block a valid deployment just because the cleanup script couldn't connect.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🚀 USAGE
 * ---------------------------------------------------------------------------------------------
 * 
 * @usage node scripts/cleanup-remote.js
 * 
 * @requires ENV.FTP_SERVER
 * @requires ENV.FTP_USERNAME
 * @requires ENV.FTP_PASSWORD
 * 
 * @note This script is typically run by GitHub Actions in `.github/workflows/deploy.yml`
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
        const MAX_RETRIES = 3;
        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                await client.access({
                    host: SERVER,
                    user: USER,
                    password: PASS,
                    secure: false
                });
                break; // Success
            } catch (err) {
                if (i === MAX_RETRIES - 1) throw err;
                console.log(`  ⚠ Connection failed, retrying (${i + 1}/${MAX_RETRIES})...`);
                await new Promise(r => setTimeout(r, 2000));
            }
        }

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
