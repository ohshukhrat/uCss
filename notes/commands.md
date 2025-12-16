# uCss Command Reference

This document provides an **exhaustive** list of every available command, variation, and scenario for the uCss build system.

---

## 🏗️ Build Commands (`npm run build`)

The build system (`scripts/build.js`) converts `src/` into `dist/`.

### Core Build Modes

| Command | Target | Description | Artifacts |
| :--- | :--- | :--- | :--- |
| `npm run build` | **Smart Default** | Builds based on Git Branch. <br>• Main -> `stable`<br>• Dev -> `latest`<br>• Other -> `preview-TIMESTAMP` | `dist/[target]/*` |
| `npm run build:full` | **Full Suite** | Builds **EVERYTHING**. Used by CI/CD. <br>Order: `latest` -> `p` -> `v` -> `stable`. | `dist/stable`, `dist/latest`, `dist/p`, `dist/v` |
| `npm run build:all` | **Full Suite + Clean** | Alias for `build:full` but also explicitly includes `c` (clean/class-only) build. | Same as above + `dist/c` |
| `npm run build:stable` | `stable` | Production release. Mirrors to root (`dist/u.min.css`). | `dist/stable/*`, `dist/u.*` |
| `npm run build:latest` | `latest` | Development channel (`/latest`). | `dist/latest/*` |
| `npm run build:preview` | `preview-TIMESTAMP` | Snapshot for Pull Requests. | `dist/preview-202X-.../*` |

### Modifiers (Mix & Match)

You can append these to any build command context (except `full`/`all` which run them automatically).

| Modifier | Flag | Description | Example |
| :--- | :--- | :--- | :--- |
| **Prefixed** | `p` | Adds `.u-` prefix to all classes and `--u-` prefix to all variables. | `npm run build latest p` |
| **Variables Only** | `v` | Adds `--u-` prefix to framework variables. | `npm run build stable v` |
| **Classes Only** | `c` | Adds `.u-` prefix to all framework classes. | `npm run build preview c` |
| **Custom Prefix** | `[string]` | **Custom Namespace**. Uses `[string]-` instead of `u-`. | `npm run build p myapp` -> `.myapp-btn` |

---

## 🧹 Cleanup Commands (`npm run clean` / `npm run wipe`)

The janitor (`scripts/clean.js`) keeps the `dist/` directory standardized.

| Command | Description | Behavior |
| :--- | :--- | :--- |
| `npm run clean` | **Reset Project (Recommended)** | 1. Deletes `dist/`.<br>2. **Triggers Local Build Full** (`npm run build:full`).<br>Use this to fix "weird" build issues. |
| `npm run wipe` | **Alias** | Same as `npm run clean`. |
| `npm run clean:all` | **Nuke Local** | Totally deletes `dist/`. **NO REBUILD**. |
| `npm run clean:nuke` | **Nuke Local (Alias)** | Same as `clean:all`. |
| `npm run clean:safe` | **Disk Saver** | Deletes all `preview-*` and misc folders.<br>**KEEPS**: `stable` and `latest`. |
| `npm run clean preview` | **Preview Cleaner** | Deletes only `dist/preview-*` folders. |
| `npm run clean stable` | **Targeted Cleaner** | Deletes only `dist/stable`. |

---

## 🚀 Deployment Commands (`npm run deploy`)

The orchestrator (`scripts/deploy.js`) handles Build + Upload.

### Standard Deployments

| Command | Target Env | Remote Path | Notes |
| :--- | :--- | :--- | :--- |
| `npm run deploy` | **Smart Default** | `/` or `/latest/` | **Auto-detects branch**. <br>• Main -> `stable`<br>• Dev -> `latest`<br>• Other -> `preview` |
| `npm run deploy:stable` | **Production** | `/` | Explicit production deploy. |
| `npm run deploy:latest` | **Development** | `/latest/` | Updates the rolling dev channel. |
| `npm run deploy:preview`| **Snapshot** | `/preview-TIMESTAMP/` | Creates a permanent unique URL for testing. |

### Partial & Complex Deployments

| Scenario | Command | Outcome |
| :--- | :--- | :--- |
| **Deploy Prefixed** | `npm run deploy p` | Builds `p` -> Uploads to `/p/`. |
| **Deploy Variables** | `npm run deploy v` | Builds `v` -> Uploads to `/v/`. |
| **Deploy Prefixed Dev** | `npm run deploy latest p` | Builds `latest` in **Prefixed** mode -> Uploads to `/latest/`. |
| **Deploy Custom Name** | `npm run deploy latest custom-name` | Builds `latest` with custom output -> Uploads to `/custom-name/`. |

---

## 🧪 Remote Management (`npm run remote`)

Direct commands for the FTP server (`scripts/remote.js`). No local building involved.

### 🗑️ Remote Wipe (Destructive)

**Note:** `npm run remote` is a shortcut for `npm run remote:wipe` (Default Cleanup).

| Command | Mode | Deletes | Keeps |
| :--- | :--- | :--- | :--- |
| `npm run remote:wipe` | **Default / Clean** | **EVERYTHING**. Then **DEPLOYS ALL**. | Symmetric to `local clean`. Wipes remote -> Repopulates with full suite. |
| `npm run remote:wipe:safe`| **Safe** | `p`, `v`, previews | `stable`, `latest`. |
| `npm run remote:wipe:all` | **NUKE** | **EVERYTHING** | **NOTHING**. Empty server. |
| `npm run remote:wipe:preview`| **Previews** | `preview-*` only | Everything else. |
| `npm run remote:wipe:stable`| **Production** | `/stable` folder | Everything else. |

---

## 🔄 Composite / Macro Commands

These commands combine multiple steps and include **Safety Confirmation Prompts** (`y/n`).

| Command | Actions | Description |
| :--- | :--- | :--- |
| `npm run nuke` | `clean:nuke` + `remote:wipe:all` | **TOTAL DESTRUTION**. Deletes `dist/` locally and `/` remotely. Asks for confirmation. |
| `npm run rebuild` | `clean` + `deploy:all` | 1. Cleans Local<br>2. Builds Full<br>3. Deploys **EVERYTHING** (`stable`, `latest`, `p`, `v`).<br>Asks for confirmation. |
| `npm run reprod` | `build:stable` + `build:p` + `build:v` + `deploy...` | Rebuilds and Deploys ALL Production artifacts (`stable`, `p`, `v`). Asks for confirmation. |
| `npm run redev` | `build:latest` + `deploy:latest` | Rebuilds and Deploys the Development channel (`latest`). Asks for confirmation. |

---

## 📦 NPM Publishing

Instructions for publishing `@unqa/ucss` to the NPM registry.

### Prerequisites
- **Account**: You must have an NPM account and be a member of the `@unqa` organization.
- **Login**: Run `npm login` in your terminal once.

### Workflow

1. **Update Version**: Open `package.json` and bump the version number (e.g., `0.0.1` -> `0.0.2`).
   - Or use: `npm version patch` / `minor` / `major`.

2. **Build Production**: Ensure you are shipping the latest stable code.
   - `npm run build:stable`

3. **Publish**:
   ```bash
   npm publish --access public
   ```

4. **Verify**: Check [npmjs.com/package/@unqa/ucss](https://www.npmjs.com/package/@unqa/ucss).
