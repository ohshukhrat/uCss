# Source Code

**Navigation**: [uCss](../) > [Source](./) > [Modules](./lib/)

**Modules**: [Config](./lib/config/) | [Base](./lib/base/) | [Layout](./lib/layout/) | [Theming](./lib/theming/) | [Typography](./lib/typography/) | [Patterns](./lib/patterns/) | [Utilities](./lib/utilities/)

> **The Development Hub**. This directory contains the *raw*, uncompiled source code of the uCss framework. It is the workspace for contributors and advanced users who want to understand the inner workings of the system.

---

## 📑 Contents

*   [🌟 Overview](#-overview)
*   [🏗️ Architecture & Logic](#-architecture--logic)
    *   [The 7-Layer Model](#the-7-layer-model)
    *   [The Manifest strategy](#the-manifest-strategy)
    *   [Variable-First Design](#variable-first-design)
*   [📦 Modules Reference](#-modules-reference)
*   [🛠️ Build System Deep Dive](#-build-system-deep-dive)
    *   [Build Scripts](#build-scripts)
    *   [Optimization Pipeline](#optimization-pipeline)
    *   [Encapsulation Logic](#encapsulation-logic)
*   [🤝 Contribution Guide](#-contribution-guide)
    *   [Coding Standards](#coding-standards)
    *   [Formatting](#formatting)
    *   [Naming Conventions](#naming-conventions)
*   [🧠 Deep Dive: How it works](#-deep-dive-how-it-works)
*   [📍 File Map](#-file-map)
*   [🔧 Maintainer Notes](#-maintainer-notes)

---

## 📖 Architecture & Developer Guide

Welcome to the **uCss Source Code**. While the [Overview](../) introduces *what* uCss is, this document explains *how* it works and *why* it is built this way. This guide is intended for developers who want to understand the framework's internal logic, customize it deeply, or contribute to its source.

### The Philosophy: "Context is Everything"
Most CSS frameworks rely on **Media Queries** (screen size) to determine layout. uCss relies on **Container Queries** (context size).
*   **Old Way**: "If the screen is 768px wide, make this card 50% width."
*   **uCss Way**: "If I am inside a sidebar (small container), stack vertical. If I am in a main content area (wide container), go horizontal."

This shift makes components **truly portable**. You can place a Card, a Form, or a Grid anywhere—in a modal, a sidebar, or a hero section—and it will adapt to its *immediate parent* without you writing a single extra line of CSS.

---

## 🏗️ Core Pillars

### 1. Variables as the Public API
In uCss, CSS Variables (Custom Properties) are not just for colors; they are the **primary interface** for controlling the framework.

*   **Global Scope (`root.css`)**: Defines the defaults.
    ```css
    :root { --p: hsl(43 100% 50%); /* Global Primary */ }
    ```
*   **Component Scope**: Components read these globals but can be overridden locally.
    ```css
    .btn { background: var(--btn-bg, var(--p)); }
    ```
*   **Cascade Injection**: You can theme a specific section by redefining variables on a parent.
    ```html
    <div style="--p: blue;">
       <button class="btn primary">I am Blue</button>
    </div>
    ```

### 2. The "Smart" Cascade
We organize our CSS to leverage the natural cascade rather than fighting it with `!important` or high specificity.
1.  **Config**: Sets the baseline.
2.  **Base**: Resets browser/cms quirks.
3.  **Layout**: Establishes the flow (Grid/Flex).
4.  **Components**: Adds visual style.
5.  **Utilities**: Overrides specific properties (highest specificity in practice due to proximity/class chaining).

### 3. Logical Properties
uCss is **Internationalization-Ready** out of the box. We strictly use [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties).
*   Left/Right → `inline-start` / `inline-end`
*   Top/Bottom → `block-start` / `block-end`
*   Width/Height → `inline-size` / `block-size`

This means if you switch `dir="rtl"` on the `<html>` tag, the entire layout (margins, paddings, text-aligns, borders) flips automatically.

---

## 📂 Source Map

The `src/` directory represents the **Development Environment**.

```text
src/
├── README.md           # This Architecture Guide
├── u.css               # The Manifest (orchestrates imports)
└── lib/                # The Modular Source Code
    ├── config/         # THE BRAIN: Design tokens, colors, scales
    ├── base/           # THE FOUNDATION: HTML Resets & Normalizers
    ├── layout/         # THE SKELETON: Grid, Flex, Section
    ├── typography/     # THE VOICE: Fluid type scales
    ├── patterns/     # THE BODY: UI Elements (Cards, Buttons)
    ├── theming/        # THE SKIN: Contextual themes, overlays
    └── utilities/      # THE TOOLS: Spacing helpers
```

### `src` vs `dist`

The `dist/` (eg. `stable/`) folder contains flat, minified, and production-ready code, while `src/` is for managing the source code. This approach is built for **human readability** and **modularity**. 

Every file in both folders corresponds to a specific logical unit of the framework.

#### Development vs Production
*   **`src/`**: Contains raw source files with heavy comments and individual `@import` statements:
    *   **Modular**: Hundreds of small, focused files (e.g., `button/skins.css`).
    *   **Documented**: Heavy JSDoc-style comments explaining *why* things are done.
    *   **Import-based**: Uses `@import` to aggregate functionality.
    *   **Raw**: No compilation artifacts.
*   **`dist/`**: Generated by the build system.
    *   **Bundle**: All imports resolved into flat files.
    *   **Clean**: Comments removed, nesting flattened (optional).
    *   **Min**: Minified, Gzipped, and Brotli-compressed.

---

## 🏗️ Architecture & Logic

uCss is architected around a **7-Layer Model** that moves from pure configuration to specific utilities. This structure ensures that dependencies flow in one direction: **downwards**.

### The 7-Layer Model

| Layer | Directory | Responsibility | Dependency Rule |
| :--- | :--- | :--- | :--- |
| **1. Config** | `lib/config/` | **The Brain**. Defines *values* (Variables) only. No selectors. | Can only act as root. |
| **2. Base** | `lib/base/` | **The Foundation**. HTML resets, flow engine (`html.css`). | Depends on Config. |
| **3. Patterns** | `lib/patterns/` | **The Organs**. Complex Components (`.btn`, `.crd`). | Depends on Config, Layout, Typo. |
| **4. Layout** | `lib/layout/` | **The Skeleton**. Macro structures (`.g`, `.s`, `.f`). | Depends on Config, Base. |
| **5. Theming** | `lib/theming/` | **The Skin**. Contextual appearance (`.set`, `.o`). | Depends on Config. |
| **6. Typography** | `lib/typography/` | **The Voice**. Text styles (`.t`, `.tx`). | Depends on Config. |
| **7. Utilities** | `lib/utilities/` | **The Tools**. Micro-tweaks (`.mg`, `.pd`). | Depends on Config. |

### The Manifest Strategy
The file `src/u.css` acts as the **Manifest**. It contains *zero* CSS selectors. Its only job is to orchestrate the import order of the modules.

```css
/* src/u.css */
@import 'lib/config/root.css';    /* 1. Load Variables (Optional, and not included in bundle) */
@import 'lib/base.css';           /* 2. Reset HTML */
@import 'lib/patterns.css';       /* 3. Load Components */
@import 'lib/layout.css';         /* 4. Build Layouts */
@import 'lib/theming.css';        /* 5. Apply Themes */
@import 'lib/typography.css';     /* 6. Set Type */
@import 'lib/utilities.css';      /* 7. Allow Overrides */
```

**Why this order matters**:
1.  **Config First**: Variables must be defined before they are used by anything else.
2.  **Base Second**: Normalizing the environment prevents layout bugs later.
3.  **Utilities Last**: Utilities often use `!important` or high-spec chains to force overrides, so they must come last in the cascade.

### Variable-First Design
Our architecture is "Variable-First". This means the **API** of a component is its variables, not just its class name.

*   **Class**: `.btn` (Triggers the visual appearance).
*   **Variable**: `--btn-bg` (Configures the appearance).

This separation allows for powerful *Contextual Theming*. A `.btn.alt` inside a `.set.dark` container can automatically change its logic by simply inheriting different variable values, without needing a modifier classes and custom css overrides.

---

## 📦 Modules Reference

A detailed breakdown of the `lib/` directory contents.

### 1. Config (`lib/config`)
*   **`root/`**: The standard variable definitions.
    *   `colors.css`: PALETTE definitions (`--p`, `--a`, `--bg`).
    *   `typography.css`: SCALES for text (`--t-fs-xl`).
    *   `layout.css`: SPACING and sizing (`--gap`, `--sc-max-w`).
*   **`blocksy.css` / `gutenberg.css`**: Compatibility layers for WordPress themes.
*   **`root.css`**: The aggregator that exposes these as `:root` variables.

### 2. Base (`lib/base`)
*   **`reset.css`**: Aggressive CSS reset (strips margins/padding from everything).
*   **`html.css`**: The "Smart Flow" engine. It adds `margin-block-start` to elements *only* if they follow another element (`* + *`).
*   **`content.css`**: Controller for the Flow engine. Includes `.cs` (Clean Stack - removes flow) and `.csc` (Content Stack - forces flow).

### 3. Patterns (`lib/patterns`)
*   **`button.css`**: Button system with sizes, skins, and states.
*   **`card.css`**: The main container component. Container-query aware.
*   **`media.css`**: Aspect-ratio wrappers for `img`/`video`.
*   **`link.css`**: The clickable-area expander (`.lnk`).

### 4. Layout (`lib/layout`)
*   **`grid/`**: The auto-responsive grid system.
    *   `base.css`: The core `.g` class logic.
    *   `columns.css`: Explicit column overrides (`--g-cols`).
    *   `subgrid.css`: Logic for nested grids (`.sg`).
*   **`flex.css`**: Flexbox utility wrapper (`.f`).
*   **`section.css`**: The page root structural element (`.s`).

### 5. Theming (`lib/theming`)
*   **`set.css`**: Contextual theme scopes (`.set`).
*   **`overlay.css`**: Absolute positioned layers (`.o`).

### 6. Typography (`lib/typography`)
*   **`title.css`**: Headings (`.t`).
*   **`text.css`**: Body text (`.tx`).
*   **`text-align.css`**: Alignment utilities (`.ta`).

### 7. Utilities (`lib/utilities`)
*   **`margin.css` / `padding.css`**: Spacing helpers (`.mg`, `.pd`).
*   **`radius.css`**: Radius helpers (`.rad`).

---

## 🛠️ Build System Deep Dive

Our build system is custom-written in Node.js to handle the specific needs of a pure-CSS framework. It lives in `scripts/`.

### Build Scripts
*   **`build.js`**: The main orchestrator. usage: `npm run build [target]`.
*   **`bundle.js`**: Recursive resolver. Finds `@import` lines, reads the file, reads *its* imports, and flattens them into a single string.
*   **`clean.js`**: Sanitizer. Removes JSDoc comments (`/** ... */`) but keeps copyright headers. Removes extra newlines.
*   **`minify.js`**: Compressor. Removes all whitespace, shortens color codes, flattens newlines.
*   **`prefix.js`**: Encapsulator. Logic to prefix all classes with `.u-` and variables with `--u-` for the `dist/p/` build.
*   **`compress.js`**: Gzip/Brotli generator. Creates `.gz` and `.br` variants for every output file.
*   **`stats.js`**: Reporter. Calculates file sizes and logs them to the console after build.

### Optimization Pipeline
When you run `npm run build`, the following happens:
1.  **Resolve**: `src/u.css` is read. Imports are recursively traced.
2.  **Flatten**: Content is merged into memory.
3.  **Process**:
    *   **Prefixing**: If target is `p`, regex replaces `.class` -> `.u-class`.
    *   **Cleaning**: Comments stripped.
4.  **Write**: `dist/target/u.clean.css` is written.
5.  **Minify**: Content is compressed.
6.  **Write**: `dist/target/u.min.css` is written.
7.  **Compress**: `gzip` and `brotli` binaries are generated.
8.  **Report**: Final sizes are printed.

### Encapsulation Logic
The prefixing logic (`scripts/prefix.js`) is sophisticated. It knows how to:
*   **Skip Vendor Classes**: It won't prefix `.wp-block`, `.is-style-*`, or standard HTML tags.
*   **Skip Keyframes**: It intelligently handles `@keyframes` naming.
*   **Handle Chains**: It correctly prefixes chained classes (e.g. `.btn.primary` -> `.u-btn.u-primary`).

---

### 📦 Deployment Stats
The entire framework is surprisingly lightweight thanks to our optimization pipeline.

📥 **Offline Usage**: You can also [download the full stable release (.zip)](https://ucss.unqa.dev/stable.zip) containing all compiled assets.

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

> **Note**: These stats are for the **Full Framework**. If you cherry-pick modules or even single files (see [Modules](./lib/)), it is significantly smaller.

---

## 🤝 Contribution Guide

We welcome contributions! If you want to improve uCss, please follow these standards.

### Coding Standards
1.  **CSS Variables**: ALWAYS use variables for values. Never hardcode colors or magic numbers in components.
    *   *Bad*: `padding: 20px;`
    *   *Good*: `padding: var(--gap);`
2.  **Logical Properties**: ALWAYS use logical properties.
    *   *Bad*: `margin-left`, `border-top`
    *   *Good*: `margin-inline-start`, `border-block-start`
3.  **BEM-ish**: Use block-element-modifier syntax but keep it short.
    *   Block: `.crd`
    *   Element: `.crd__body`
    *   Modifier: `.crd.dark` (chained), you can add `.crd--dark` as fallback (for parent container lookup modifiers use suffix like `--sm` variant).

### Formatting
*   **Indentation**: 2 Spaces.
*   **Selectors**: One selector per line.
*   **Grouping**: Group properties logically (Layout -> Box Model -> Visual -> Misc).

### Naming Conventions
*   **Variables**: Kebab-case (`--my-var`).
*   **Classes**: lowercase (`.btn`).
*   **Files**: lowercase, kebab-case (`button-group.css`).

> [!TIP]
> **Comment your code**:
> We use JSDoc-style comments in CSS.
> ```css
> /**
>  * @section Button
>  * @description The main interaction element.
>  */
> ```

---

## 🧠 Deep Dive: How it works

### The "Smart Flow" Engine (`html.css`)
How do we get perfect vertical rhythm without margins?
We use the lobotomized owl selector's successor: `* + *`.
```css
/* Simplified Logic */
.flow > * + * {
  margin-block-start: var(--flow-space, 1em);
}
```
This means "Every element that follows another element gets top margin".
*   First element? No margin (flush with container top).
*   Last element? No bottom margin (flush with container bottom).
This makes nesting components predictable.

### The "Switchboard" (`root.css`)
The `root.css` file is effectively a switchboard. It maps "Semantic Intent" (e.g., "I want a Primary Color") to "Raw Value" (e.g., "Blue").
All components connect to the switchboard, not the value.
If you pull the main plug (change `--p` in root), all the lights (buttons, links, active states) change color instantly.

---

## 📍 File Map

A quick lookup for where things live.

| Feature | Directory |
| :--- | :--- |
| **Grid System** | `src/lib/layout/grid/` |
| **Flexbox** | `src/lib/layout/flex.css` |
| **Buttons** | `src/lib/patterns/button/` |
| **Typography** | `src/lib/typography/` |
| **Global Vars** | `src/lib/config/root/` |
| **Mixins** | *None* (We use composition) |

---

## 📦 Module Reference

### [Config](./lib/config/) (`root.css`)
The single source of truth. Contains **Design Tokens** for:
*   **Palette**: `--p` (Primary), `--a` (Accent), `--bg`, `--srf`.
*   **Typography**: `--t-fs-*` (Heading sizes), `--tx-fs-*` (Body sizes).
*   **Layout**: `--sc-max-w` (Max width), `--gap`.

### [Base](./lib/base/)
*   **`html.css`**: The Engine. Resets browser defaults and implements "Smart Flow" logic (`* + *`) to provide natural vertical rhythm for naked HTML elements using CSS variables.
*   **`content.css`**: The Controller. Provides `.cs` (App Mode) to kill flow variables for layouts, and `.csc` (Content Mode) to restore them for prose. Also includes `.cl` (Clear List).

### [Layout](./lib/layout/)
*   **`section.css` (`.s`)**: The root container. Handles responsive padding and max-width constraints (`1366px` default).
*   **`grid.css` (`.g`)**: Auto-fit grids using `minmax()`. No "12 column" mental overhead unless you strictly need it.
*   **`flex.css` (`.f`)**: Modern flexbox utilities with variable-based keys.

### [Typography](./lib/typography/)
*   **`title.css` (`.t`)**: Fluid headings. Scales from mobile to desktop using `clamp()`.
*   **`text.css` (`.tx`)**: Body copy with optimal line-heights.

### [Patterns](./lib/patterns/)
*   **`card.css` (`.crd`)**: The "do everything" box. Composite architecture (`media`, `content`, `header`, `body`, `footer`).
*   **`button.css` (`.btn`)**: Interaction elements.
*   **`media.css` (`.med`)**: Aspect-ratio keepers.
*   **`link.css` (`.lnk`)**: The "Clickable Card" pattern solver.

### [Theming](./lib/theming/)
*   **`set.css` (`.set`)**: Contextual scopes. `.set.dark` inverts colors for that section and all its children.
*   **`overlay.css` (`.o`)**: Absolute positioning for background images/gradients.

### [Utilities](./lib/utilities/)
*   **`margin` (`.mg`)** / **`padding` (`.pd`)**: Spacing helpers using logical properties.
*   **`radius` (`.rad`)**: Consistent corner rounding.

---

## 🛠️ Maintainer Workflow

If you are contributing to uCss, here is how the magic happens.

### 1. The Build System
We use a **Node.js-based build system** (`scripts/build.js`) instead of a complex bundler like Webpack or Vite. Why? Because we only output CSS.
*   **Bundling**: Recursively resolves `@import` matching `src/lib`.
*   **Minification**: Regex-based optimized stripper. simpler and faster than cssnano for this specific architecture.
*   **Documentation**: Generates this static site from the Markdown files.

### 2. Commands
*   **`npm run build`**: Builds `src/` -> `dist/stable/` (or `latest` depending on branch).
*   **`npm run build full`**: Builds all release channels (`latest`, `prefixed`, `stable`) sequentially.
*   **`./build.sh`**: Legacy shell wrapper (optional).

### 3. Release Channels
*   **Stable (`/stable/`)**: Production-ready. Use this for live sites. Automatically deployed from `main`.
*   **Latest (`/latest/`)**: Testing/Beta. Automatically deployed from `dev`.

### ⚡ The "Great Build" Pipeline
We don't just copy files. Our `dist` assets go through a rigorous optimization pipeline to ensure maximum performance and compatibility:

1.  **Combining**: We flatten the cascade of `@import` statements into single-file bundles (like `u.css` or `layout.css`) to reduce HTTP requests.
2.  **Minification**: We strip all whitespace, comments, and redundant tokens using our own custom soft-minification script.
3.  **Compression**:
    *   **Gzip**: Standard compression, widely supported (~7x smaller).
    *   **Brotli**: Next-gen compression, best for modern browsers (~9x smaller).
4.  **Stable vs Latest**:
    *   `/stable`: Locked to the current major version. Safe for production.
    *   `/latest`: Bleeding edge. Good for testing new features.

---

## 🚀 Integration Snippets

For production usage, use the **Stable** channel.

### Optimization Tip (Preconnect)
Speed up connection time to our CDN:
```html
<link rel="preconnect" href="https://ucss.unqa.dev">
```

### Full Framework
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/u.min.css">
<!-- Optional: Config Override -->
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config/root.css">
```

### Module-Only Import
If you *only* want the Grid system:
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout/grid.min.css">
```

---

## 🔧 Maintainer Notes

*   **JSDoc**: The build script parses JSDoc headers to generate parts of the README/Docs. Keep them accurate.
*   **Versioning**: We follow semantic versioning. Breaking changes (renaming a class) require a MAJOR version bump.
*   **Tests**: Currently, we rely on visual regression testing via the `site/` folder (local dev environment).

---

**Navigation**: [uCss](../) > [Source](./) > [Modules](./lib/)

[Back to top](#toc)

**License**: MPL-2.0
**Copyright**: © 2025 Alive 🜁
