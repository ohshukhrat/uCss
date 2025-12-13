# uCss Command Reference

A complete list of all available NPM scripts in the `package.json` file.

## 🏗️ Build

| Command | Description | Artifacts |
| :--- | :--- | :--- |
| `npm run build` | **Production Build**. Default alias for `build:stable`. | `dist/stable/*`, `dist/u.*` |
| `npm run build:full` | **Full CI Build**. Builds every channel sequentially. | `dist/stable`, `dist/latest`, `dist/p`, `dist/v` |
| `npm run build:stable` | Builds the stable release channel. | `dist/stable/*` |
| `npm run build:latest` | Builds the development (`dev`) channel. | `dist/latest/*` |
| `npm run build:preview` | Creates a timestamped snapshot for PRs. | `dist/preview-YYYY-MM-DD.../*` |
| `npm run build:prefixed`| Builds the Prefixed version (`.u-btn`). | `dist/p/*` |
| `npm run build:v` | Builds Variable-Namespace version (`--u-var`). | `dist/v/*` |
| `npm run build:c` | Builds Clean version (rarely used). | `dist/c/*` |

## 🚀 Deployment

| Command | Description | Remote Target |
| :--- | :--- | :--- |
| `npm run deploy` | Default alias for `deploy:stable` (Production). | `/` (Root) |
| `npm run deploy:stable` | **Deploy Production**. Builds stable and overwrites root. | `/` (Root) |
| `npm run deploy:latest` | **Deploy Dev**. Builds latest and updates dev channel. checks/bootstraps root if needed. | `/latest/` |
| `npm run deploy:preview`| **Deploy Snapshot**. Builds and deploys unique preview. | `/preview-TIMESTAMP/` |
| `npm run deploy p latest` | **Flexible Deploy**. Deploys Prefixed (`p`) build of `latest`. | `/latest/` |
| `npm run deploy stable c` | **Flexible Deploy**. Deploys Clean (`c`) build of `stable`. | `/` |

## 🧹 Maintenance (Local)

| Command | Description | Behavior |
| :--- | :--- | :--- |
| `npm run clean` | **Reset Project**. The robust default clean. | Deletes `dist/` -> **Rebuilds** full project. |
| `npm run clean:all` | **Local Nuke**. Total deletion. | Deletes `dist/` content. **No Rebuild**. |
| `npm run clean:nuke` | Alias for `clean:all`. | same as above. |
| `npm run clean:safe` | **Smart Clean**. Preserves production builds. | Deletes everything inside `dist/` **EXCEPT** `stable` & `latest`. |
| `npm run clean:preview` | Garbage collects local previews. | Deletes `dist/preview-*`. |
| `npm run clean <folder>`| **Custom Clean**. | Deletes `dist/<folder>`. |

## 🧪 Remote Management

| Command | Description | Behavior |
| :--- | :--- | :--- |
| `npm run remote:cleanup`| **Garbage Collector**. | Deletes remote `preview-*` folders older than 7 days. |
| `npm run remote:wipe` | **Standard Wipe**. Cleans up dev junk. | Deletes `latest` and `preview-*`. **KEEPS** `stable`, `p`, `v`, `index.html`. |
| `npm run remote:wipe:all`| **Remote Nuke**. Total Server Wipe. | Deletes **EVERYTHING** on the remote server. |
| `npm run remote:nuke` | Alias for `remote:wipe:all`. | same as above. |
| `npm run remote:wipe:safe`| **Safe Wipe**. | Keeps `stable`, `latest`, `p`, `v`, `index.html`. Only deletes previews. |
| `npm run remote:wipe:stable`| **Kill Stable**. | Deletes `/stable` folder. |

## ☢️ Nuclear

| Command | Description | Behavior |
| :--- | :--- | :--- |
| `npm run nuke` | **Total System Wipe**. | Runs `clean:nuke` (Local) + `remote:nuke` (Remote). |

## 🛠️ Utils

| Command | Description |
| :--- | :--- |
| `npm run watch` | Watches `src/` for changes and rebuilds `latest`. |
| `npm run security` | Runs `npm audit`. |
