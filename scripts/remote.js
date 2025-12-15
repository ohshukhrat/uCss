/**
 * @fileoverview Remote Server Management & Deployment Utilities
 * 
 * @description
 * This script serves as the interface between the local build environment (GitHub Actions or Local Machine)
 * and the remote FTP staging server.
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
        this.client = new ftp.Client();
        this.client.ftp.verbose = true;
    }

    async connect() {
        const { FTP_SERVER, FTP_USERNAME, FTP_PASSWORD } = process.env;

        if (!FTP_SERVER || !FTP_USERNAME || !FTP_PASSWORD) {
            throw new Error("❌ Missing Environment Variables: FTP_SERVER, FTP_USERNAME, FTP_PASSWORD");
        }

        for (let i = 0; i < CONFIG.RETRIES; i++) {
            try {
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

    async close() {
        if (!this.client.closed) {
            this.client.close();
            console.log("🔒 FTP Connection Closed");
        }
    }

    async ensureStructure(localSourceDir, remoteTargetRoot = '/') {
        console.log(`\n📂 [Mirror Mode] Synchronizing structure from: '${localSourceDir}' to '${remoteTargetRoot}'`);

        if (!fs.existsSync(localSourceDir)) {
            throw new Error(`Local source directory not found: ${localSourceDir}`);
        }

        const dirsToCreate = [];
        const walk = (currentDir) => {
            const items = fs.readdirSync(currentDir);
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    const relativePath = path.relative(localSourceDir, fullPath).replace(/\\/g, '/');
                    dirsToCreate.push(relativePath);
                    walk(fullPath);
                }
            }
        };

        walk(localSourceDir);
        dirsToCreate.sort((a, b) => a.length - b.length);

        if (remoteTargetRoot !== '/' && remoteTargetRoot !== '.') {
            await this.client.ensureDir(remoteTargetRoot);
        }

        for (const dir of dirsToCreate) {
            let remoteDir = path.posix.join(remoteTargetRoot, dir);

            // Fix: If deploying to root, avoid absolute path starting with / if server dislikes it.
            // "MKD /lib" -> Permission denied. "MKD lib" -> Success.
            if (remoteTargetRoot === '/') {
                remoteDir = dir;
            }

            try {
                await this.client.ensureDir(remoteDir);
                await this.client.cd('/');
            } catch (err) {
                console.warn(`  ⚠ Failed to ensure remote dir '${remoteDir}': ${err.message}`);
            }
        }
    }

    async uploadFromDir(localDir, remoteDir = '/') {
        console.log(`\n🚀 [Upload Mode] Uploading '${localDir}' -> '${remoteDir}'`);
        await this.ensureStructure(localDir, remoteDir);
        console.log(`  👉 Starting transfer...`);
        try {
            await this.client.uploadFromDir(localDir, remoteDir);
            console.log(`  ✓ Upload complete.`);
        } catch (err) {
            throw new Error(`Upload Failed: ${err.message}`);
        }
    }

    async uploadFile(localPath, remoteDir = '/') {
        const fileName = path.basename(localPath);
        console.log(`\n📄 [Upload File] Uploading '${fileName}' -> '${remoteDir}'`);
        try {
            // ensureDir might change CWD, so let's be safe
            if (remoteDir !== '/') await this.client.ensureDir(remoteDir);

            // uploadFrom uploads specific file to CWD + name? or full path?
            // basic-ftp uploadFrom(localPath, remoteName)
            const remotePath = path.posix.join(remoteDir, fileName);
            await this.client.uploadFrom(localPath, remotePath);
            console.log(`  ✓ Uploaded ${fileName}`);
        } catch (err) {
            throw new Error(`File Upload Failed: ${err.message}`);
        }
    }

    async wipe(mode) {
        console.log(`\n🧨 [Wipe Mode] Starting wipe: ${mode.toUpperCase()}...`);

        try {
            const list = await this.client.list('/');
            let deletionList = [];

            if (mode === 'all' || mode === 'nuke') {
                // DELETE EVERYTHING
                deletionList = list.map(i => i.name);
            } else if (mode === 'stable') {
                // DELETE STABLE ONLY
                deletionList = list.filter(i => i.name === 'stable').map(i => i.name);
            } else if (mode === 'preview') {
                // DELETE PREVIEWS ONLY
                deletionList = list.filter(i => i.name.startsWith('preview-')).map(i => i.name);
            } else if (mode === 'safe') {
                // SAFE: Keep stable, latest
                const keep = new Set(['stable', 'latest']);
                // Note: user logic for 'clean safe' was "everything except stable and latest".
                // Does this mean we DELETE 'p', 'v'? Yes.
                deletionList = list.filter(i => !keep.has(i.name)).map(i => i.name);
            } else if (mode === 'default' || mode === 'wipe') {
                // DEFAULT (npm run remote wipe):
                // Logic: "npm run clean"
                // Clean logic: "Delete dist, then rebuild".
                // Clean all logic: "Delete dist".
                // The implementation plan says:
                // "wipe: Alias for clean (Local)."
                // "remote:wipe ... Defaults to cleaning remote similar to how clean cleans local."
                // Clean local: Deletes dist.
                // So Remote Wipe Default -> Delete EVERYTHING same as nuke?

                // WAIT. User said: 
                // "npm run clean should do general cleanup, and then delete /dist/" -> Local
                // "npm run remote wipe - deletes everything and rebuilds" -> implies nuke.
                // BUT "npm run remote wipe safe should do full cleanup and delete everything except /stable and /latest"

                // Let's assume 'default' wipe for remote is AGGRESSIVE like local 'clean' which deletes dist.
                // So delete everything?
                // Or delete everything but root files?
                // User said "npm run remote wipe - deletes everything and rebuilds".
                // So it essentially nukes content.
                // NOTE: We probably want to keep .htaccess maybe? 
                // "npm run remote wipe SAFE" keeps stable/latest.
                // "npm run remote wipe" -> deletes everything.
                deletionList = list.map(i => i.name);
            }

            // Always Exclude '.' and '..'
            // Also, handle root files protection?
            // "npm run remote wipe ... deletes everything"
            // If we delete .htaccess, website goes down down.
            // But rebuild/deploy will restore it.

            deletionList = deletionList.filter(name => name !== '.' && name !== '..');

            if (deletionList.length === 0) {
                console.log("  ✨ Nothing to wipe.");
                return;
            }

            console.log(`  Targeting ${deletionList.length} items for deletion:`);
            console.log(`  [ ${deletionList.slice(0, 5).join(', ')}${deletionList.length > 5 ? '...' : ''} ]`);

            for (const name of deletionList) {
                try {
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
            const list = await this.client.list('/');
            const now = Date.now();
            const TTL_MS = CONFIG.TTL_DAYS * 24 * 60 * 60 * 1000;
            let deletedCount = 0;

            for (const item of list) {
                if (item.isDirectory && item.name.startsWith('preview-')) {
                    const datePart = item.name.replace('preview-', '');
                    const parts = datePart.split('-');
                    if (parts.length === 6) {
                        const [yyyy, MM, dd, HH, mm, ss] = parts;
                        const buildDate = new Date(yyyy, MM - 1, dd, HH, mm, ss).getTime();

                        if ((now - buildDate) > TTL_MS) {
                            console.log(`  🗑️ Deleting EXPIRED: ${item.name}`);
                            await this.client.removeDir(item.name);
                            deletedCount++;
                        }
                    }
                }
            }
            if (deletedCount === 0) console.log("  ✨ Server is clean.");
            else console.log(`  ✓ Deleted ${deletedCount} old preview(s).`);

        } catch (err) {
            console.error("  ❌ Access Error during cleanup:", err.message);
        }
    }

    async bootstrapRoot(localDir, force = false) {
        console.log(`\n🌱 [Bootstrap Mode] Checking remote root... ${force ? '(FORCE)' : ''}`);
        try {
            if (!force) {
                const list = await this.client.list('/');
                const hasIndex = list.some(f => f.name === 'index.html');
                const hasHtaccess = list.some(f => f.name === '.htaccess');
                const hasStable = list.some(f => f.name === 'stable');

                // User Rule: Only bootstrap if no root files AND no stable folder.
                if ((hasIndex && hasHtaccess) || hasStable) {
                    console.log("  ✅ Root populated (Index, .htaccess, or Stable folder detected). Skipping bootstrap.");
                    return;
                }
            } else {
                console.log("  ⚠️ Force Mode active: Overwriting root files.");
            }

            console.log("  👉 Bootstrapping root files...");

            // Fix: Include u.* files (css, min, br, gz) in bootstrap as requested by user.
            const localFiles = fs.readdirSync(localDir);
            const filesToUpload = localFiles.filter(f => {
                return f === 'index.html' ||
                    f === '.htaccess' ||
                    (f.startsWith('u.') && (f.endsWith('.css') || f.endsWith('.br') || f.endsWith('.gz')));
            });

            for (const file of filesToUpload) {
                const localPath = path.join(localDir, file);
                if (fs.existsSync(localPath)) {
                    await this.client.uploadFrom(localPath, file);
                    console.log(`  ✓ Uploaded: ${file}`);
                }
            }
        } catch (err) {
            console.error(`  ❌ Bootstrap failed: ${err.message}`);
        }
    }
}

async function main() {
    const args = process.argv.slice(2);

    const modeEnsureIdx = args.indexOf('--ensure');
    const modeUploadIdx = args.indexOf('--upload');
    const modeUploadFileIdx = args.indexOf('--upload-file');
    const modeWipeIdx = args.indexOf('--wipe');
    const modeBootstrapIdx = args.indexOf('--bootstrap');
    const doCleanup = args.includes('--cleanup');
    const showHelp = args.includes('--help') || args.includes('-h');

    if (showHelp || (modeEnsureIdx === -1 && modeUploadIdx === -1 && modeUploadFileIdx === -1 && modeWipeIdx === -1 && modeBootstrapIdx === -1 && !doCleanup)) {
        console.log(`
uCss Remote Manager
-------------------
Usage: node scripts/remote.js [options]

Options:
  --cleanup                Run garbage collection.
  --wipe [mode]            Wipe remote. modes: all, safe, preview, stable.
  --ensure <dir>           Mirror structure.
  --upload <local> <rem>   Upload dir.
  --upload-file <loc> <r>  Upload file.
  --bootstrap <local>      Conditional root file upload.
        `);
        if (!showHelp && args.length > 0) process.exit(1);
        process.exit(0);
    }

    const manager = new RemoteManager();

    try {
        const startTime = Date.now();
        await manager.connect();

        if (modeWipeIdx !== -1) {
            let wipeMode = args[modeWipeIdx + 1];
            if (!wipeMode || wipeMode.startsWith('-')) wipeMode = 'default';
            await manager.wipe(wipeMode);
        }

        if (doCleanup) await manager.cleanupOldPreviews();

        if (modeEnsureIdx !== -1) {
            await manager.ensureStructure(args[modeEnsureIdx + 1]);
        }

        if (modeBootstrapIdx !== -1) {
            await manager.bootstrapRoot(args[modeBootstrapIdx + 1], args.includes('--force'));
        }

        if (modeUploadIdx !== -1) {
            const localDir = args[modeUploadIdx + 1];
            let remoteDir = args[modeUploadIdx + 2];
            if (!remoteDir || remoteDir.startsWith('-')) remoteDir = '/';
            await manager.uploadFromDir(localDir, remoteDir);
        }

        if (modeUploadFileIdx !== -1) {
            const localFile = args[modeUploadFileIdx + 1];
            let remoteDir = args[modeUploadFileIdx + 2];
            if (!remoteDir || remoteDir.startsWith('-')) remoteDir = '/';
            await manager.uploadFile(localFile, remoteDir);
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

main();
