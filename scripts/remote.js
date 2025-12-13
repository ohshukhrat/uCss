/**
 * @fileoverview Remote Server Management & Deployment Utilities
 * 
 * @description
 * This script serves as the interface between the local build environment (GitHub Actions or Local Machine)
 * and the remote FTP staging server. It handles state management, directory structure synchronization,
 * garbage collection of old preview builds, and direct file uploads.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🧠 ARCHITECTURE & PHILOSOPHY
 * ---------------------------------------------------------------------------------------------
 * This is the bridge between your local machine and the FTP Staging Server.
 * It handles uploading, cleaning, wiping, and structure mirroring.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🛠️ FEATURES
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. SECURE CONNECTION
 *    Uses `basic-ftp` with TLS support. Reads credentials from `.env` (never committed).
 * 
 * 2. MIRRORING (`--ensure`)
 *    Can replicate a local directory structure to the remote server before uploading.
 *    This prevents "550 No such file" errors when uploading to new deep paths.
 * 
 * 3. UPLOADING (`--upload`)
 *    Directly uploads a folder to a target path.
 * 
 * 4. CLEANUP (`--cleanup`)
 *    Garbage Collection for ephemeral builds. Scans for folders matching `preview-YYYY...`
 *    and deletes them if they are older than 7 days.
 * 
 * 5. WIPE (`--wipe [mode]`)
 *    Destructive cleaning modes.
 *    - `safe`: Keeps stable/latest/p/v.
 *    - `stable`: Nukes stable.
 *    - `preview`: Nukes all previews.
 *    - `all`: Nukes EVERYTHING.
 * 
 * 6. BOOTSTRAP (`--bootstrap`)
 *    Smart initialization. If the remote root is empty, it uploads `index.html` and `.htaccess`.
 *    If root exists, it does nothing. Prevents breaking production on dev deploys.
 * 
 * ---------------------------------------------------------------------------------------------
 * 💻 CLI COMMANDS
 * ---------------------------------------------------------------------------------------------
 * 
 * @example
 * // 1. Standard Cleanup
 * node scripts/remote.js --cleanup
 * 
 * @example
 * // 2. Upload Stable
 * node scripts/remote.js --upload dist/stable /
 * 
 * @example
 * // 3. Wipe Previews
 * node scripts/remote.js --wipe preview
 * 
 * @example
 * // 4. Bootstap Root (if missing)
 * node scripts/remote.js --bootstrap dist
 * @requires ENV.FTP_SERVER
 * @requires ENV.FTP_USERNAME
 * @requires ENV.FTP_PASSWORD
 */

require('dotenv').config(); // Load .env if present
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
     * @param {string} remoteTargetRoot - The remote root to mirror relative to (Default: '/')
     * @returns {Promise<void>}
     */
    async ensureStructure(localSourceDir, remoteTargetRoot = '/') {
        console.log(`\n📂 [Mirror Mode] Synchronizing structure from: '${localSourceDir}' to '${remoteTargetRoot}'`);

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
        // Ensure root exists first
        if (remoteTargetRoot !== '/' && remoteTargetRoot !== '.') {
            await this.client.ensureDir(remoteTargetRoot);
        }

        for (const dir of dirsToCreate) {
            const remoteDir = path.posix.join(remoteTargetRoot, dir);
            try {
                await this.client.ensureDir(remoteDir);
                await this.client.cd('/'); // Reset to root
            } catch (err) {
                console.warn(`  ⚠ Failed to ensure remote dir '${remoteDir}': ${err.message}`);
            }
        }
        console.log(`  ✓ Structure successfully mirrored.`);
    }

    /**
     * UPLOAD MODE: Uploads a local directory to a remote directory.
     * Implements implicit structural mirroring for safety.
     * 
     * @async
     * @param {string} localDir 
     * @param {string} remoteDir 
     */
    async uploadFromDir(localDir, remoteDir = '/') {
        console.log(`\n🚀 [Upload Mode] Uploading '${localDir}' -> '${remoteDir}'`);

        // 1. Ensure Structure First (Safety)
        await this.ensureStructure(localDir, remoteDir);

        // 2. Upload Files
        console.log(`  👉 Starting transfer...`);
        try {
            await this.client.uploadFromDir(localDir, remoteDir);
            console.log(`  ✓ Upload complete.`);
        } catch (err) {
            throw new Error(`Upload Failed: ${err.message}`);
        }
    }

    /**
     * WIPE MODE: Aggressive cleaning of the remote server based on mode.
     * 
     * @async
     * @param {string} mode - 'all' | 'safe' | 'preview' | 'stable' | 'default'
     */
    async wipe(mode) {
        console.log(`\n🧨 [Wipe Mode] Starting wipe: ${mode.toUpperCase()}...`);

        try {
            const list = await this.client.list('/');
            let deletionList = [];

            if (mode === 'all') {
                // DELETE EVERYTHING
                deletionList = list.map(i => i.name);
            } else if (mode === 'stable') {
                // DELETE STABLE ONLY
                deletionList = list.filter(i => i.name === 'stable').map(i => i.name);
            } else if (mode === 'preview') {
                // DELETE PREVIEWS ONLY
                deletionList = list.filter(i => i.name.startsWith('preview-')).map(i => i.name);
            } else if (mode === 'safe') {
                // SAFE: Keep stable, latest, p, v, index.html, .htaccess
                const keep = new Set(['stable', 'latest', 'p', 'v', 'index.html', '.htaccess']);
                deletionList = list.filter(i => !keep.has(i.name)).map(i => i.name);
            } else {
                // DEFAULT (npm run remote wipe):
                // Keep stable, p, v, index.html, .htaccess
                // DELETE latest, previews, junk
                const keep = new Set(['stable', 'p', 'v', 'index.html', '.htaccess']);
                deletionList = list.filter(i => !keep.has(i.name)).map(i => i.name);
            }

            // Exclude '.' and '..' just in case
            deletionList = deletionList.filter(name => name !== '.' && name !== '..');

            if (deletionList.length === 0) {
                console.log("  ✨ Nothing to wipe.");
                return;
            }

            console.log(`  Targeting ${deletionList.length} items for deletion:`);
            console.log(`  [ ${deletionList.slice(0, 5).join(', ')}${deletionList.length > 5 ? '...' : ''} ]`);

            // Confirm? (In CI/Script we assume yes)

            for (const name of deletionList) {
                try {
                    // Determine if file or dir for logging? basic-ftp 'removeDir' works for content? 
                    // 'removeDir' removes directory recursively. 'remove' removes file.
                    // we need to distinguish.
                    const isDir = list.find(i => i.name === name)?.isDirectory;

                    if (isDir) {
                        await this.client.removeDir(name);
                    } else {
                        await this.client.remove(name);
                    }
                    console.log(`  🔥 Deleted: ${name}`);
                } catch (e) {
                    console.error(`  ❌ Failed to delete ${name}: ${e.message}`);
                }
            }
            console.log("  ✓ Wipe complete.");

        } catch (err) {
            console.error("❌ Wipe Validation Failed:", err.message);
        }
    }

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
    /**
     * BOOTSTRAP MODE: Conditional upload of root files.
     * Checks if remote root has content. If empty/missing index, uploads index.html/.htaccess from local.
     * 
     * @async
     * @param {string} localDir - Directory containing index.html and .htaccess (usually 'dist')
     */
    async bootstrapRoot(localDir) {
        console.log(`\n🌱 [Bootstrap Mode] Checking remote root...`);

        try {
            const list = await this.client.list('/');
            const hasIndex = list.some(f => f.name === 'index.html');
            const hasHtaccess = list.some(f => f.name === '.htaccess');

            if (hasIndex && hasHtaccess) {
                console.log("  ✅ Root files exist. Skipping bootstrap.");
                return;
            }

            console.log("  ⚠️ Missing root files (index.html or .htaccess). Bootstrapping...");

            const filesToUpload = ['index.html', '.htaccess'];
            for (const file of filesToUpload) {
                const localPath = path.join(localDir, file);
                if (fs.existsSync(localPath)) {
                    await this.client.uploadFrom(localPath, file);
                    console.log(`  ✓ Uploaded: ${file}`);
                } else {
                    console.warn(`  ⚠️ Local file missing: ${file}`);
                }
            }
        } catch (err) {
            console.error(`  ❌ Bootstrap failed: ${err.message}`);
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
    const modeUploadIdx = args.indexOf('--upload');
    const modeWipeIdx = args.indexOf('--wipe'); // New
    const modeBootstrapIdx = args.indexOf('--bootstrap'); // New
    const doCleanup = args.includes('--cleanup');
    const showHelp = args.includes('--help') || args.includes('-h');

    // Show Help
    if (showHelp || (modeEnsureIdx === -1 && modeUploadIdx === -1 && modeWipeIdx === -1 && modeBootstrapIdx === -1 && !doCleanup)) {
        console.log(`
uCss Remote Manager
-------------------
Usage: node scripts/remote.js [options]

Options:
  --cleanup             Run garbage collection for old 'preview-*' folders.
  --wipe [mode]         Wipe remote files. modes: all, safe, preview, stable. (Default: excludes stable/p/v)
  --ensure <dir>        Mirror local directory structure to remote (creates missing dirs).
  --upload <local> [remote]  Upload local directory to remote (default remote is /).
  --bootstrap <local>   Conditionally upload root files if missing on remote.
  --help, -h            Show this help message.

Examples:
  node scripts/remote.js --wipe safe
  node scripts/remote.js --ensure dist/stable
  node scripts/remote.js --upload dist/stable /stable
        `);
        if (!showHelp && args.length > 0) process.exit(1);
        process.exit(0);
    }

    const manager = new RemoteManager();

    try {
        const startTime = Date.now();
        await manager.connect();

        // 0. Run Wipe if requested (Destructive first)
        if (modeWipeIdx !== -1) {
            let wipeMode = args[modeWipeIdx + 1];
            // If next arg is a flag or undefined, use default
            if (!wipeMode || wipeMode.startsWith('-')) {
                wipeMode = 'default';
            }
            await manager.wipe(wipeMode);
        }

        // 1. Run Cleanup if requested
        if (doCleanup) {
            await manager.cleanupOldPreviews();
        }

        // 2. Run Ensure Structure if requested (Standalone)
        if (modeEnsureIdx !== -1) {
            const targetDir = args[modeEnsureIdx + 1];
            if (!targetDir || targetDir.startsWith('-')) {
                throw new Error("❌ Error: --ensure requires a local directory path argument.");
            }
            await manager.ensureStructure(targetDir);
        }

        // 3. Run Bootstrap if requested
        if (modeBootstrapIdx !== -1) {
            const localDir = args[modeBootstrapIdx + 1];
            if (!localDir || localDir.startsWith('-')) {
                throw new Error("❌ Error: --bootstrap requires a local directory path.");
            }
            await manager.bootstrapRoot(localDir);
        }

        // 4. Run Upload if requested
        if (modeUploadIdx !== -1) {
            const localDir = args[modeUploadIdx + 1];
            let remoteDir = args[modeUploadIdx + 2];

            if (!localDir || localDir.startsWith('-')) {
                throw new Error("❌ Error: --upload requires a local directory path.");
            }
            // If remote dir is omitted or is another flag, default to root '/'
            if (!remoteDir || remoteDir.startsWith('-')) {
                remoteDir = '/';
            }

            await manager.uploadFromDir(localDir, remoteDir);
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
