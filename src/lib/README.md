# uCss Modules

uCss is designed as a **modular framework**. While the `u.min.css` bundle contains everything, you don't have to use it. The source code is organized into distinct **modules** library (`/src/lib/*`), each serving a specific purpose.

This architecture allows you to:
1.  **Understand** the codebase better by isolating concerns.
2.  **Compose** your own lighter builds by cherry-picking only what you need.
3.  **Maintain** your project easier by using semantic folders.

## The Modules

| Module | Directory | Description | Connections |
| :--- | :--- | :--- | :--- |
| **Config** | [`/config`](./config/) | **(Optional :root declarations)**: CSS Variables, design tokens, and global settings. When enqueued, it behaves as the "Brain" of the framework. | General, Typography, Layout, Components, Theming |
| **Base** | [`/base`](./base/) | Resets and normalizations. Handles clearing default content spacing (`.cs`) and clear lists (`.cl`). | None |
| **Typography** | [`/typography`](./typography/) | Fluid type scales for Headings (`.t`) and Body text (`.tx`), plus alignment (`.ta`). | Base, Config |
| **Layout** | [`/layout`](./layout/) | Structural engines: Grid (`.g`), Flex (`.f`), and Section (`.s`). | Config, Components |
| **Components** | [`/components`](./components/) | Interactive UI blocks: Cards (`.crd`), Buttons (`.btn`), Media (`.med`), Links (`.lnk`). | Layout, Typography, Theming, Config |
| **Theming** | [`/theming`](./theming/) | Visual layers: Contextual themes (`.set`), Overlays (`.o`). | Config |
| **Utilities** | [`/utilities`](./utilities/) | Helper classes: Margin (`.mg`), Padding (`.pd`), Radius (`.rad`). | None |

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
