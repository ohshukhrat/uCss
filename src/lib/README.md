# Modules Library

**Navigation**: [uCss](../../) > [Source](../) > [Modules](./) 

**Modules**: [Config](./config/) | [Base](./base/) | [Layout](./layout/) | [Theming](./theming/) | [Typography](./typography/) | [Components](./components/) | [Utilities](./utilities/)

> **Modular by Design**. uCss is composed of loosely coupled, independent modules. Use the full framework for maximum power, or cherry-pick individual folders (like `Layout` or `Typography`) to build your own lightweight custom stack.

---

## 📑 Page Contents
*   [Overview](#modules-overview)
*   [The Modules Table](#the-modules)
*   [Installation & Bundle Stats](#-installation-bundle-stats)
*   [Production vs Source](#-production-vs-source-why-use-dist-)
*   [Understanding the Bundles](#-understanding-the-bundles)
*   [How to use parts?](#how-to-use-parts-)
*   [Single Flat Files Reference](#-single-flat-files-reference)

---

## Modules Overview

uCss is designed as a **modular framework**. While the `u.min.css` bundle contains everything, you don't have to use it. The source code is organized into distinct **modules** library (`/src/lib/*`), each serving a specific purpose.

This architecture allows you to:
1.  **Understand** the codebase better by isolating concerns.
2.  **Compose** your own lighter builds by cherry-picking only what you need.
3.  **Maintain** your project easier by using semantic folders.

### 🧠 Thinking in Architecture
1.  **Cherry Pick**: You don't need everything. Building a simple landing page? Maybe you just need `Typography` and `Layout`. Leave the rest.
2.  **Strict Dependencies**: We designed the graph to be one-way. `Layout` never knows about `Components`. This means you can rip out `Components` and your grid won't break.
3.  **Source is Truth**: The `/src/lib` folder is the source of truth. If you are ever confused about what a class does, open the CSS file. It is heavily commented and readable. Better yet, copy the file to your project and make it yours.

### Philosophy: Strict Independence
We enforce a strict dependency graph:
*   **Upward Dependency**: `components` depend on `layout`, `layout` takes values from `config`.
*   **No Circularity**: `base` never knows about `components`. `layout` never imports `utilities`.
*   **Self-Contained**: Each folder in `src/lib` is effectively its own mini-package. This is why you can safely import `@unqa/ucss/layout` without dragging in button styles.

## The Modules

| Module | Directory | Description | Connections |
| :--- | :--- | :--- | :--- |
| **Config** | [`/config`](./config/) | **(Optional)**: CSS Variables, design tokens, and global settings. Provides the defaults, but components will work without it using internal fallbacks. | General, Typography, Layout, Components, Theming |
| **Base** | [`/base`](./base/) | Resets and normalizations. Handles clearing default content spacing (`.cs`) and clear lists (`.cl`). | None |
| **Typography** | [`/typography`](./typography/) | Fluid type scales for Headings (`.t`) and Body text (`.tx`), plus alignment (`.ta`). | Base, Config |
| **Layout** | [`/layout`](./layout/) | Structural engines: Grid (`.g`), Flex (`.f`), and Section (`.s`). | Config, Components |
| **Components** | [`/components`](./components/) | Interactive UI blocks: Cards (`.crd`), Buttons (`.btn`), Media (`.med`), Links (`.lnk`). | Layout, Typography, Theming, Config |
| **Theming** | [`/theming`](./theming/) | Visual layers: Contextual themes (`.set`), Overlays (`.o`). | Config |
| **Utilities** | [`/utilities`](./utilities/) | Helper classes: Margin (`.mg`), Padding (`.pd`), Radius (`.rad`). | None |

## 📦 Installation & Bundle Stats
All modules are available individually or as a single bundle.

| File | Full | Clean | Min | Gzip | Brotli | Download |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`u.css` (Full)** | ~165KB | ~147KB | ~126KB | ~18.4KB | ~14.3KB | [src](https://ucss.unqa.dev/stable/u.css) • [clean](https://ucss.unqa.dev/stable/u.clean.css) • [min](https://ucss.unqa.dev/stable/u.min.css) |
| **`config.css`** | ~21KB | ~12KB | ~11KB | ~2.5KB | ~2.1KB | [src](https://ucss.unqa.dev/stable/lib/config.css) • [clean](https://ucss.unqa.dev/stable/lib/config.clean.css) • [min](https://ucss.unqa.dev/stable/lib/config.min.css) |
| **`base.css`** | ~2.1KB | ~1.3KB | ~0.9KB | ~0.3KB | ~0.3KB | [src](https://ucss.unqa.dev/stable/lib/base.css) • [clean](https://ucss.unqa.dev/stable/lib/base.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base.min.css) |
| **`layout.css`** | ~70KB | ~67KB | ~57KB | ~7.1KB | ~5.2KB | [src](https://ucss.unqa.dev/stable/lib/layout.css) • [clean](https://ucss.unqa.dev/stable/lib/layout.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout.min.css) |
| **`typography.css`** | ~15KB | ~10KB | ~8.6KB | ~1.6KB | ~1.3KB | [src](https://ucss.unqa.dev/stable/lib/typography.css) • [clean](https://ucss.unqa.dev/stable/lib/typography.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography.min.css) |
| **`components.css`** | ~50KB | ~45KB | ~40KB | ~6.5KB | ~5.6KB | [src](https://ucss.unqa.dev/stable/lib/components.css) • [clean](https://ucss.unqa.dev/stable/lib/components.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components.min.css) |
| **`theming.css`** | ~17KB | ~15.6KB | ~14KB | ~3.3KB | ~2.8KB | [src](https://ucss.unqa.dev/stable/lib/theming.css) • [clean](https://ucss.unqa.dev/stable/lib/theming.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming.min.css) |
| **`utilities.css`** | ~10KB | ~7.3KB | ~6.2KB | ~1.1KB | ~0.9KB | [src](https://ucss.unqa.dev/stable/lib/utilities.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities.min.css) |


> [!TIP]
> **Encapsulation**: uCss supports automatic prefixing (e.g., `.u-btn`). See [Encapsulation & Prefixing](../../README.md#encapsulation--prefixing-new) for build instructions.

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`u.css` (Full)** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/u.min.css">` |
| **`config.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config.min.css">` |
| **`base.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/base.min.css">` |
| **`layout.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout.min.css">` |
| **`typography.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/typography.min.css">` |
| **`components.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/components.min.css">` |
| **`theming.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming.min.css">` |
| **`utilities.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/utilities.min.css">` |

---

## 🧩 Understanding the Bundles

### 1. The "Kitchen Sink" (`u.css`)
*   **What it is**: The entire framework in one file.
*   **When to use**: You want to prototype quickly or you are using >80% of the framework features.
*   **Pros**: One HTTP request. No complexity.
*   **Cons**: Heavier initial load if you only need a few buttons.

### 2. The Module Approach
*   **What it is**: Importing only specific folders (e.g., `layout.css` + `local.css`).
*   **When to use**: You are building a landing page that needs a Grid but custom branding, or a blog that needs Typography but no interactive Components.
*   **Pros**: Extremely small footprint. Tighter control.
*   **Cons**: Multiple HTTP requests (though HTTP/2 mitigates this).

---

## ⚡ Production vs Source: Why use `/dist`?

You might notice that project has both `/src/lib` and generic `{dist}/lib` links. The generic links (e.g., `lib/layout.min.css`) point to our **Distribution** build.

### The "Great Build" Pipeline
We don't just copy files. Our `dist` assets go through a rigorous optimization pipeline to ensure maximum performance and compatibility:

1. **Combining**: We combine cascade of @import declared multiple files into a single file bundles to reduce HTTP requests.
2. **Minification**: We strip all whitespace and comments using our own custom soft minification script.
3. **Compression**:
    *   **Gzip**: Standard compression, widely supported (~7x smaller).
    *   **Brotli**: Next-gen compression, best for modern browsers (~9x smaller).
4. **Stable vs Latest**:
    *   `/stable`: Locked to the current major version. Safe for production.
    *   `/latest`: Bleeding edge. Good for testing new features.

> **Recommendation**: Always use the **Minified** (`.min.css`) versions in production. Use **Source** (`/src/`) only if you are developing locally and need to debug line numbers.

---

## How to use parts?

If you want to build a super-lightweight version of uCss without components (e.g., for a pure content site), you can import only the specific modules you need.

**Example: A Minimal Layout System**
You want the Grid system and Section wrappers, but you have your own buttons and card styles.

```css
/* 1. Configuration (Required for variables) */
@import url('https://ucss.unqa.dev/latest/lib/config/root.css');

/* 2. Base (Recommended for resets) */
@import url('https://ucss.unqa.dev/latest/lib/base.css');

/* 3. Layout (The core grid/flex engines) */
@import url('https://ucss.unqa.dev/latest/lib/layout.css');

/* Now write your own custom CSS... */
```

**Example: Just Typography**
You just want the fluid typography scales.

```css
/* 1. Configuration (Typography variables rely on this) */
@import url('https://ucss.unqa.dev/latest/lib/config/root.css');

/* 2. Typography Module */
@import url('https://ucss.unqa.dev/latest/lib/typography.css');
```

> **Note**: Almost every module depends on `config/root.css` because that is where the CSS variables (e.g., `--gap`, `--p`, `--font-s`) are defined. Always include Config first.

---

## 📄 Single Flat Files Reference
For granular control, you can import specific single-file bundles. All individual files are available in `.min.css` (recommended), `.clean.css`, and `.css` (source with map).

| Module | File | Description | Stable Link (Minified) |
| :--- | :--- | :--- | :--- |
| **Config** | `config/root.css` | Root Variables (Colors, Fonts) | [link](https://ucss.unqa.dev/stable/lib/config/root.min.css) |
| **Base** | `base.css` | Resets & Normalizers | [link](https://ucss.unqa.dev/stable/lib/base.min.css) |
| **Layout** | `layout/section.css` | Section (`.s`) Container | [link](https://ucss.unqa.dev/stable/lib/layout/section.min.css) |
| | `layout/grid.css` | Grid (`.g`) System | [link](https://ucss.unqa.dev/stable/lib/layout/grid.min.css) |
| | `layout/flex.css` | Flex (`.f`) Utilities | [link](https://ucss.unqa.dev/stable/lib/layout/flex.min.css) |
| **Typography** | `typography/title.css` | Headings (`.t`) | [link](https://ucss.unqa.dev/stable/lib/typography/title.min.css) |
| | `typography/text.css` | Body Text (`.tx`) | [link](https://ucss.unqa.dev/stable/lib/typography/text.min.css) |
| **Components** | `components/button.css` | Buttons (`.btn`) | [link](https://ucss.unqa.dev/stable/lib/components/button.min.css) |
| | `components/card.css` | Cards (`.crd`) | [link](https://ucss.unqa.dev/stable/lib/components/card.min.css) |
| | `components/media.css` | Media (`.med`) | [link](https://ucss.unqa.dev/stable/lib/components/media.min.css) |
| | `components/link.css` | Link Wrapper (`.lnk`) | [link](https://ucss.unqa.dev/stable/lib/components/link.min.css) |
| **Theming** | `theming/set.css` | Contextual Sets (`.set`) | [link](https://ucss.unqa.dev/stable/lib/theming/set.min.css) |
| | `theming/overlay.css` | Overlays (`.o`) | [link](https://ucss.unqa.dev/stable/lib/theming/overlay.min.css) |
| **Utilities** | `utilities/padding.css` | Padding (`.pd`) | [link](https://ucss.unqa.dev/stable/lib/utilities/padding.min.css) |
| | `utilities/margin.css` | Margin (`.mg`) | [link](https://ucss.unqa.dev/stable/lib/utilities/margin.min.css) |
| | `utilities/radius.css` | Radius (`.rad`) | [link](https://ucss.unqa.dev/stable/lib/utilities/radius.min.css) |
| | `utilities/blur.css` | Blur (`.blur`) | [link](https://ucss.unqa.dev/stable/lib/utilities/blur.min.css) |
| | `utilities/shadow.css` | Shadow (`.shd`) | [link](https://ucss.unqa.dev/stable/lib/utilities/shadow.min.css) |

