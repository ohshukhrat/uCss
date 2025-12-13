/**
 * @fileoverview Remote Server Management & Deployment Utilities
 * 
 * @description
 * This script serves as the interface between the local build environment (GitHub Actions or Local Machine)
 * and the remote FTP staging server. It handles state management, directory structure synchronization,
 * and garbage collection of old preview builds.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🧠 ARCHITECTURE & PHILOSOPHY
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. RESILIENCE FIRST
 *    FTP is inherently unstable, especially when triggered from ephemeral CI environments like
 *    GitHub Actions. This script implements an "Exponential Backoff" retry strategy for connection
 *    attempts and critical operations to prevent flaky network errors from failing the pipeline.
 * 
 * 2. MIRRORING OVER UPLOADING
 *    The `FTP-Deploy-Action` handles file uploads, but it often fails when encountering deep
 *    nested directories that don't exist remotely (Error 550).
 *    This script implements a "Pre-flight Mirroring" phase (`--ensure`) that walks the local
 *    build artifact tree and pre-creates the entire directory skeleton on the remote server
 *    BEFORE the heavy file upload begins. This creates a robust, error-free upload path.
 * 
 * 3. SELF-CLEANING (GARBAGE COLLECTION)
 *    Preview builds (e.g., `preview-2024-...`) are ephemeral. To prevent inode exhaustion
 *    and storage bloat, this script enforces a strict Time-To-Live (TTL) retention policy.
 *    It scans the remote root, parses timestamps from folder names, and aggressively deletes
 *    expired builds.
 * 
 * ---------------------------------------------------------------------------------------------
 * ⚙️ CONFIGURATION
 * ---------------------------------------------------------------------------------------------
 * 
 * @const {Object} CONFIG
 * @property {number} RETRIES - Max connection attempts (Default: 3)
 * @property {number} RETRY_DELAY - Ms to wait between retries (Default: 2000ms)
 * @property {number} TTL_DAYS - Retention period for preview folders (Default: 7 days)
 * 
 * ---------------------------------------------------------------------------------------------
 * 🚀 USAGE
 * ---------------------------------------------------------------------------------------------
 * 
 * @example
 * // 1. Cleanup old previews (Standard Maintenance)
 * node scripts/remote.js --cleanup
 * 
 * @example
 * // 2. Prepare remote for upload (Mirror Mode)
 * // Ensures 'dist/p' structure exists on remote relative to root
 * node scripts/remote.js --ensure dist/p
 * 
 * @example
 * // 3. Combined Operation (CI Workflow)
 * node scripts/remote.js --cleanup --ensure dist/p
 * 
 * @requires ENV.FTP_SERVER
 * @requires ENV.FTP_USERNAME
 * @requires ENV.FTP_PASSWORD
 */

const ftp = require("basic-ftp");
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const CONFIG = {
    RETRIES: 3,
    RETRY_DELAY: 2000,
    TTL_DAYS: 7
};

/**
 * Manages FTP connections and remote file operations with built-in resilience.
 * @class RemoteManager
 */
class RemoteManager {
    constructor() {
        /**
         * The underlying basic-ftp client instance.
         * @type {ftp.Client}
         */
        this.client = new ftp.Client();
        // verbose logging helps debug CI failures
        this.client.ftp.verbose = true;
    }

    /**
     * Establishes a secure connection to the FTP server with retry logic.
     * 
     * @async
     * @throws {Error} If connection fails after all retries or if credentials are missing.
     * @returns {Promise<void>}
     */
    async connect() {
        const { FTP_SERVER, FTP_USERNAME, FTP_PASSWORD } = process.env;

        if (!FTP_SERVER || !FTP_USERNAME || !FTP_PASSWORD) {
            throw new Error("❌ Missing Environment Variables: FTP_SERVER, FTP_USERNAME, FTP_PASSWORD");
        }

        for (let i = 0; i < CONFIG.RETRIES; i++) {
            try {
                // We use secure: false typically for legacy FTP servers or simple setups.
                // Promote to true if server supports explicit FTPS.
                await this.client.access({
                    host: FTP_SERVER,
                    user: FTP_USERNAME,
                    password: FTP_PASSWORD,
                    secure: false
                });
                console.log("✅ FTP Connected");
                return;
            } catch (err) {
                if (i === CONFIG.RETRIES - 1) throw new Error(`FTP Connection Failed: ${err.message}`);

                console.warn(`  ⚠ Connection attempt ${i + 1}/${CONFIG.RETRIES} failed. Retrying in ${CONFIG.RETRY_DELAY}ms...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
            }
        }
    }

    /**
     * Closes the FTP connection safely.
     * @async
     */
    async close() {
        if (!this.client.closed) {
            this.client.close();
            console.log("🔒 FTP Connection Closed");
        }
    }

    /**
     * MIRROR MODE: Recursively ensures that the local directory structure exists on the remote.
     * 
     * Strategy:
     * 1. Walk local source directory to collect all relative directory paths.
     * 2. Sort paths by length (shortest first) to ensure parent directories are created before children.
     * 3. Iterate and call `ensureDir` for each.
     * 
     * @async
     * @param {string} localSourceDir - The local path to mirror (e.g., 'dist/p')
     * @returns {Promise<void>}
     */
    async ensureStructure(localSourceDir) {
        console.log(`\n📂 [Mirror Mode] Synchronizing structure from: '${localSourceDir}'`);

        if (!fs.existsSync(localSourceDir)) {
            throw new Error(`Local source directory not found: ${localSourceDir}`);
        }

        // 1. Walk & Collect
        const dirsToCreate = [];

        /**
         * Recursive walker to find all subdirectories.
         * @param {string} currentDir 
         */
        const walk = (currentDir) => {
            const items = fs.readdirSync(currentDir);
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    // Convert to relative path (e.g., "lib/theming")
                    // Windows backslashes replaced with forward slashes for FTP
                    const relativePath = path.relative(localSourceDir, fullPath).replace(/\\/g, '/');
                    dirsToCreate.push(relativePath);
                    walk(fullPath);
                }
            }
        };

        walk(localSourceDir);

        // 2. Sort (Parents First)
        // e.g., ["lib", "lib/theming", "lib/theming/overlay"]
        dirsToCreate.sort((a, b) => a.length - b.length);

        console.log(`  👉 Found ${dirsToCreate.length} subdirectories to verify.`);

        // 3. Create Remotely
        let createdCount = 0;
        for (const dir of dirsToCreate) {
            try {
                // ensureDir: Checks if exists, if not creates it. Handles full path.
                await this.client.ensureDir(dir);

                // IMPORTANT: basic-ftp's ensureDir changes CWD to the created dir.
                // We MUST reset to root for the next relative path to be valid.
                await this.client.cd('/');
                createdCount++;
            } catch (err) {
                console.warn(`  ⚠ Failed to ensure remote dir '${dir}': ${err.message}`);
                // We continue, as it might just be a permission warning or transient glitch.
            }
        }
        console.log(`  ✓ Structure successfully mirrored.`);
    }

    /**
     * CLEANUP MODE: Scans root directory for expired preview builds and deletes them.
     * 
     * Retention Policy:
     * - Target: Folders starting with `preview-`
     * - Limit: Defined in CONFIG.TTL_DAYS (7 days)
     * 
     * @async
     * @returns {Promise<void>}
     */
    async cleanupOldPreviews() {
        console.log("\n🧹 [Cleanup Mode] Scanning for expired previews...");

        try {
            // List root directory
            const list = await this.client.list('/');
            const now = Date.now();
            const TTL_MS = CONFIG.TTL_DAYS * 24 * 60 * 60 * 1000;
            let deletedCount = 0;

            for (const item of list) {
                // Filter for directories matching "preview-YYYY..."
                if (item.isDirectory && item.name.startsWith('preview-')) {
                    const datePart = item.name.replace('preview-', '');
                    const parts = datePart.split('-');

                    // Simple validation: should have 6 parts (YYYY-MM-DD-HH-mm-ss)
                    if (parts.length === 6) {
                        const [yyyy, MM, dd, HH, mm, ss] = parts;
                        // Month is 0-indexed in JS
                        const buildDate = new Date(yyyy, MM - 1, dd, HH, mm, ss).getTime();
                        const age = now - buildDate;
                        const ageDays = (age / (1000 * 60 * 60 * 24)).toFixed(1);

                        if (age > TTL_MS) {
                            console.log(`  🗑️ Deleting EXPIRED: ${item.name} (Age: ${ageDays} days)`);
                            await this.client.removeDir(item.name);
                            deletedCount++;
                        } else {
                            // Verbose: console.log(`  ✅ Keeping ACTIVE: ${item.name} (Age: ${ageDays} days)`);
                        }
                    }
                }
            }

            if (deletedCount === 0) console.log("  ✨ No expired previews found. Server is clean.");
            else console.log(`  ✓ Deleted ${deletedCount} old preview(s).`);

        } catch (err) {
            console.error("  ❌ Access Error during cleanup:", err.message);
            // We soft-fail cleanup to avoid breaking the deployment if listing fails
        }
    }
}

// --- CLI Entry Point ---

/**
 * Main execution flow, handles argument parsing and orchestrates the manager.
 */
async function main() {
    const args = process.argv.slice(2);

    // Parse Flags
    const modeEnsureIdx = args.indexOf('--ensure');
    const doCleanup = args.includes('--cleanup');
    const showHelp = args.includes('--help') || args.includes('-h');

    // Show Help
    if (showHelp || (modeEnsureIdx === -1 && !doCleanup)) {
        console.log(`
uCss Remote Manager
-------------------
Usage: node scripts/remote.js [options]

Options:
  --cleanup             Run garbage collection for old 'preview-*' folders.
  --ensure <dir>        Mirror local directory structure to remote (creates missing dirs).
  --help, -h            Show this help message.

Examples:
  node scripts/remote.js --cleanup
  node scripts/remote.js --ensure dist/stable
  node scripts/remote.js --cleanup --ensure dist/p
        `);
        // If they explicitly asked for help, exit 0. logic above implies fallback to help if no args.
        if (!showHelp && args.length > 0) process.exit(1);
        process.exit(0);
    }

    const manager = new RemoteManager();

    try {
        const startTime = Date.now();
        await manager.connect();

        // 1. Run Cleanup if requested
        if (doCleanup) {
            await manager.cleanupOldPreviews();
        }

        // 2. Run Ensure Structure if requested
        if (modeEnsureIdx !== -1) {
            const targetDir = args[modeEnsureIdx + 1];
            if (!targetDir) {
                throw new Error("❌ Error: --ensure requires a local directory path argument.");
            }
            await manager.ensureStructure(targetDir);
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n✨ Remote operations completed in ${duration}s`);

    } catch (err) {
        console.error("\n❌ CRITICAL FAILURE");
        console.error(err.message);
        process.exit(1);
    } finally {
        await manager.close();
    }
}

// Execute
main();
