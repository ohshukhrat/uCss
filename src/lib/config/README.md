# Config Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Config](./)

**Modules**: [Config](./) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Patterns](../patterns/) | [Utilities](../utilities/)

> **The Central Nervous System**. This module defines the "DNA" of your design system. It contains no CSS selectors, only **CSS Variables** (Custom Properties) that drive the rest of the framework. It replaces "Magic Numbers" with semantic tokens.

---

## 📑 Contents

*   [🌟 Overview](#overview)
*   [🤯 Philosophy](#philosophy)
    *   [The End of Magic Numbers](#the-end-of-magic-numbers)
    *   [The Three-Tier Architecture](#the-three-tier-architecture)
*   [🚀 Getting Started](#getting-started)
*   [📦 Installation & Stats](#installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [Direct Links](#direct-links)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#files-reference)
*   [🧠 Deep Dive](#deep-dive)
    *   [The HSL Logic](#the-hsl-logic)
    *   [The Fluid Equation (Clamp)](#the-fluid-equation-clamp)
*   [📍 Variable Dictionary (Reference)](#variable-dictionary-reference)
    *   [Colors (Core)](#colors-core)
    *   [Typography](#typography)
    *   [Layout & Spacing](#layout--spacing)
*   [💡 Best Practices & Theming](#best-practices--theming)
*   [🔧 For Developers](#for-developers)

---

## 🌟 Overview

The **Config Module** is the single source of truth for your design system.
If `base` is the foundation and `layout` is the skeleton, `config` is the **Genetic Code**.

### Top Features
1.  **Deconstructed HSL Colors**: We split colors into Hue, Saturation, and Lightness (`--p-h`, `--p-s`, `--p-l`) to allow for dynamic opacity and mixing without JavaScript.
2.  **Fluid Typography & Spacing**: We don't use fixed `px` values. We use `clamp()` equations that scale mathematically from a "Minimum Viewport" to a "Maximum Viewport".
3.  **Semantic Mapping**: Variables are mapped to *intent* (e.g. `--alr` for Alert), not *appearance* (Red).
4.  **Zero-Runtime Theming**: Change a variable in the DOM, and the theme updates instantly via the native browser cascade.

> [!LIGHTBULB]
> **Why separate `config`?**
> By isolating Design Tokens from the structural CSS, we allow you to completely "reskin" the framework by loading a single different CSS file, without downloading the layout logic again.

---

## 🤯 Philosophy

### The End of Magic Numbers
In legacy CSS, you see this:
```css
.card { padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
```
`24px`, `8px`, `0.1`... these are **Magic Numbers**. They are hardcoded, disconnected, and hard to maintain. If you want to change "padding" globally, you have to find/replace 500 instances.

In component-driven systems (like uCss), we use **Tokens**:
```css
.card { padding: var(--sp-m); border-radius: var(--rad); box-shadow: var(--shadow-1); }
```
Now, `config/root/utilities.css` defines `--sp-m`. Change it once, update everywhere.

### The Three-Tier Architecture
We organize variables into three layers of abstraction:
1.  **Primitive (Tier 1)**: Raw values.
    *   `--p: #eec14c;` (Primary)
2.  **Element (Tier 2)**: Intent.
    *   `--btn-bg: var(--p);`
3.  **Component (Tier 3)**: Context.
    *   `.btn {background-color: var(--button-background, var(--btn-bg, var(--p, #eec14c)));}`

For styling components uCss primarily uses Primitive colors exposed to **Tier 2 (Element)** variables (`--btn-bg`, `--btn-c`), mapped to **Tier 3 (Component)** with graceful fallbacks inside the components.

---

## 🚀 Getting Started

### How to Theme
The fastest way to customize uCss is to create a local `style.css` (or `<style>` block) that overrides the defaults defined in this module.

1.  **Identify the variable**: Look at the "Variable Dictionary" below.
2.  **Override in `:root`**:
    ```css
    :root {
        /* Change Primary Brand Color to Purple */
        --p-h: 270;
        --p-s: 100%;
        --p-l: 50%;

        /* Make everything square */
        --rad: 0px;

        /* Increase base font size */
        --tx-fs: 1.125rem;
    }
    ```

> [!TIP]
> **Pro Tip**: You can scope these!
> ```css
> .marketing-section {
>     --p-h: 10; /* Change primary to Red ONLY inside this section */
> }
> ```

---

## 📦 Installation & Stats

### Bundle Stats

| File | Full (Raw) | Clean | Min | Gzip | Brotli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`root.css` (Aggregator)** | **26 KB** | **18 KB** | **15 KB** | **3.3 KB** | **2.8 KB** |
| `colors.css` | 7.9 KB | 5.7 KB | 4.9 KB | 1.0 KB | 0.8 KB |
| `typography.css` | 1.8 KB | 1.3 KB | 1.1 KB | 0.3 KB | 0.3 KB |
| `layout.css` | 2.0 KB | 1.4 KB | 1.2 KB | 0.4 KB | 0.3 KB |
| `utilities.css` | 1.2 KB | 0.8 KB | 0.7 KB | 0.3 KB | 0.2 KB |

### Direct Links

| Module | Full Source | Clean Source | Minified (Prod) |
| :--- | :--- | :--- | :--- |
| **Root (All)** | [root.css](https://ucss.unqa.dev/stable/lib/config/root.css) | [root.clean.css](https://ucss.unqa.dev/stable/lib/config/root.clean.css) | [root.min.css](https://ucss.unqa.dev/stable/lib/config/root.min.css) |
| **Colors** | [colors.css](https://ucss.unqa.dev/stable/lib/config/root/colors.css) | [colors.clean.css](https://ucss.unqa.dev/stable/lib/config/root/colors.clean.css) | [colors.min.css](https://ucss.unqa.dev/stable/lib/config/root/colors.min.css) |
| **Typography** | [typography.css](https://ucss.unqa.dev/stable/lib/config/root/typography.css) | [typography.clean.css](https://ucss.unqa.dev/stable/lib/config/root/typography.clean.css) | [typography.min.css](https://ucss.unqa.dev/stable/lib/config/root/typography.min.css) |

### HTML Snippets

#### Optimization Tip
```html
<link rel="preconnect" href="https://ucss.unqa.dev">
```

#### Standard
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config/root.min.css">
```

#### Prefixed (`/p/`)
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/p/lib/config/root.min.css">
```

---

## 📂 Files Reference

The `lib/config/root/` directory contains the core definitions.

| File | Description | Key Variables |
| :--- | :--- | :--- |
| **`colors.css`** | Defines all HSL values. Includes semantic mapping (Success, Error, Info) and Brand colors. | `--p`, `--a`, `--bg`, `--srf`, `--tx` |
| **`typography.css`** | Defines scale fluids. Uses `clamp()` to interpolate font-sizes between 320px and 1400px viewports. | `--t-fs-*`, `--tx-fs-*`, `--tx-lh`, `--t-fw` |
| **`layout.css`** | Defines structural constants. Max widths, grid gaps, section paddings. | `--sc-max-w`, `--g-gap`, `--s-gap`, `--s-pb` |
| **`patterns.css`** | Defines component-specific defaults (like button radius) that *inherit* from global values but can be partially overridden. | `--btn-rad`, `--crd-bg` |
| **`base.css`** | Defines generic baseline vars usually used by `base/` module. | `--antialiased`, `--selection-bg` |
| **`utilities.css`** | Defines spacer units. | `--sp-*` (Space) |

---

## 🧠 Deep Dive

### The HSL Logic
We use a specific pattern to enable "Opacity Modifiers" on CSS Variables.
Standard Method (Bad):
```css
--p: #0000ff;
/* Cannot change opacity of --p dynamically */
```
Our Method (Good):
```css
:root {
  --p-h: 240;
  --p-s: 100%;
  --p-l: 50%;
  --p: hsl(var(--p-h) var(--p-s) var(--p-l));
}

.transparent-btn {
  /* We can now inject opacity without JS */
  background: hsl(var(--p-h) var(--p-s) var(--p-l) / 0.5);
}
```
This is why you see `*-h`, `*-s`, `*-l` variables. They are the atomic parts of the color.

### The Fluid Equation (Clamp)
We use the standard Linear Interpolation equation `y = mx + b` implemented via `clamp()`.
Formula: `clamp(MIN_SIZE, Y_INTERCEPT + SLOPE * VW, MAX_SIZE)`

Example (`--t-fs--m`):
`clamp(2.5rem, 1.53vw + 2.194rem, 3.5rem)`
*   **At 320px screen**: Font is `2.5rem`.
*   **At 1400px screen**: Font is `3.5rem`.
*   **In between**: It scales linearly based on viewport width (`vw`).

This ensures typography is *always* perfectly sized for the device, without a single Media Query breakpoint.

---

## 📍 Variable Dictionary (Reference)

Here is a comprehensive list of the variables you can override.

### Colors (Core)
*Located in `colors.css`*
| Variable | Description | Default |
| :--- | :--- | :--- |
| **`--p`** | Primary. Brand Color. | Gold / Custom |
| **`--a`** | Accent. Secondary / Highlight. | Bright Orange |
| **`--d`** | Dark. Used for "Dark Mode" backgrounds and "Light Mode" text. | `hsl(0 0% 10%)` |
| **`--l`** | Light. Used for "Light Mode" backgrounds and "Dark Mode" text. | `hsl(0 0% 98%)` |
| **`--scs`** | Success. Positive actions (Green). | `hsl(140 ...)` |
| **`--alr`** | Alert. Errors / Danger (Red). | `hsl(0 ...)` |
| **`--inf`** | Info. Nuance / Help (Blue). | `hsl(210 ...)` |
| **`--bg`** | Background. The current canvas color. | (Context Aware) |
| **`--srf`** | Surface. Cards / elevated areas. | (Context Aware) |
| **`--bd`** | Border. Default border color. | (Translucent) |

### Typography
*Located in `typography.css`*
| Variable | Description |
| :--- | :--- |
| **`--t-fs-*`** | Title Font Size. mod: `xxxl, xxl, xl, lg, md, sm, xs`. |
| **`--tx-fs-*`** | Text Font Size. mod: `lg, md, sm`. |
| **`--t-fw`** | Title Font Weight. Default `700`. |
| **`--tx-lh`** | Text Line Height. Default `1.5`. |
| **`--t-lh`** | Title Line Height. Default `1.25`. |

### Layout & Spacing
*Located in `layout.css`, `utilities.css`*
| Variable | Description |
| :--- | :--- |
| **`--sc-max-w`** | Scaffold Max Width. Default `1366px`. |
| **`--sc-p`** | Scaffold Padding (Horizontal). Default `5%`. |
| **`--s-gap`** | Section Gap (Vertical). Scales `2rem` -> `4rem`. |
| **`--g-gap`** | Grid Gap. Default `3rem`. |
| **`--g-min`** | Grid Item Min Width (for auto-fit). |
| **`--sp-*`** | Spacing Units. mod: `xxxl ... xxs`. |
| **`--rad`** | Global Radius. Default `0.25rem`. |

---

## 💡 Best Practices & Theming

### 1. Don't edit files, Override Variables
Never open `lib/config/root/colors.css` and change the code.
Instead, in your project's main stylesheet:
```css
:root {
  --p-h: 210; /* My brand is Blue */
}
```
This keeps your uCss files clean and upgradable.

### 2. Contextual Theming
You can use variables to create "Themes" without new classes.
```css
/* Create a "Cyberpunk" theme class */
.theme-cyberpunk {
  --p: #f0f; /* Neon Pink */
  --bg: #000; /* Black */
  --rad: 0px; /* Sharp corners */
  --tx-font-fam: 'Courier New', monospace;
}
```
Now apply `<body class="theme-cyberpunk">` and the whole site re-skins.

#### Extra example: Typography Scale
Adjusting the base headings to be larger on mobile.
```css
:root {
   /* Override the Medium heading clamp */
   --t-fs--m: clamp(3rem, 4vw, 4.5rem); 
}
```

### 3. Binding Custom Components
When building your own components, always consume framework variables:
```css
.my-widget {
  background: var(--srf); /* Use Surface color */
  border-radius: var(--rad); /* Use Global Radius */
  padding: var(--sp-m); /* Use Medium Spacing */
}
```
This ensures your widgets look consistent with the rest of the site.

---

## The Config System overhaul

### 1. Structure (Sections & Groups)
The `root.css` file is not a random list of variables. It is generated from the project folder structure.
*   **Files** (e.g., `Base`, `Layout`, `Patterns`): Correspond to the top-level directories in `src/lib/`.
*   **Group Name** (e.g., `Core Palette & Colors`, `Semantic & Extended Palette`): Correspond to the CSS semantic group name.
*   **Group Level** (e.g., `Base`, `Advanced`, `Pro`): Correspond to the framework customization level.
*   **Benefit**: This makes `config/root` self-documenting. If you are looking for card variables, you go to root/patterns.css.

> [!TIP]
> **Encapsulation**: uCss supports automatic prefixing (e.g., `.u-btn` and/or `--u-btn-bg`).

### 2. Deep Dive: How it Works
uCss uses **Short Variables** mapped to **Bridge Variables** mapped to **Fallbacks**. We also split colors into H/S/L channels to support alpha transparency.

#### Variable Logic
```css
/* 1. Define Channels for Alpha Support */
--p-h: 43;
--p-s: 83%;
--p-l: 62%;

/* 2. Define the Variable (Short -> Bridge -> Fallback) */
/* --[Short]: var(--[Bridge, fallback]); */
 --t: var(--alt-bd, hsl(0 0% 4%));
```

*   **`--t` (Title)**: The variable you use in your app. Short, easy to type.
*   **`--alt-bd`**: The "Bridge". This is the variable name mapped to your context-aware Dark / Light definitions. If config/{bridge}.css is present in project, uCss automatically adopts to its definitions.
*   **`hsl(...)`**: The default fallback if no theme is present. On core palette, we use the split H/S/L channels so we can also generate `--op` (Overlay Primary) with opacity: `hsl(... / .64)`.

#### Naming Convention
We favor concise, logical abbreviations over verbose names to keep CSS payloads small and developer typing speed high.
*   `--bg` (Background) instead of `--background-color`
*   `--tx` (Text) instead of `--text-color`
*   `--mg` (Margin) instead of `--margin`
*   `--pd` (Padding) instead of `--padding`
*   `--rad` (Radius) instead of `--border-radius`

## Reference: Content Map

### 1. Colors
Defines the palette and core global values.

#### Core Palette & Colors: Brand
| Variable | Description | Default Value | Fallback |
| :--- | :--- | :--- | :--- |
| **`--p`** | **Primary** | `hsl(43 83% 62%)` (#eec14c) | `var(--theme-palette-color-1)` |
| **`--a`** | **Accent** | `hsl(44 100% 50%)` (#ffb900) | `var(--theme-palette-color-2)` |
| `p-h`,`p-s`,`p-l` | Primary HSL components | - | - |
| `a-h`,`a-s`,`a-l` | Accent HSL components | - | - |

#### Core Palette & Colors: Neutrals (Dark/Light)
| Variable | Description | Default Value | Fallback |
| :--- | :--- | :--- | :--- |
| **`--d`** | **Dark** Base | `hsl(0 0% 8%)` (#141414) | `var(--theme-palette-color-3)` |
| `--d-bd` | Dark **Bold** (Darker) | `hsl(0 0% 4%)` | `var(--theme-palette-color-4)` |
| `--d-lt` | Dark **Lite** (Lighter) | `hsl(0 0% 12%)` | `var(--theme-palette-color-5)` |
| **`--l`** | **Light** Base | `hsl(0 0% 96%)` (#f5f5f5) | `var(--theme-palette-color-7)` |
| `--l-bd` | Light **Bold** (Whiter) | `hsl(0 0% 100%)` | `var(--theme-palette-color-8)` |
| `--l-lt` | Light **Lite** (Darker) | `hsl(0 0% 93%)` | `var(--theme-palette-color-6)` |

#### Core Palette & Colors: Contextual Surfaces
| Variable | Description | Mapped To |
| :--- | :--- | :--- |
| **`--bg`** | Page Background | `var(--l)` (Light Base) |
| **`--srf`** | Surface / Panel | `var(--l-lt)` (Light Lite) |
| **`--crd`** | Card Background | `var(--l-bd)` (Light Bold) |
| **`--tx`** | Body Text | `var(--d)` (Dark Base) |
| **`--t`** | Headings / Titles | `var(--d-bd)` (Dark Bold) |

#### Detailed Contextual Colors: Contrast Colors ("On" Colors)
Text colors guaranteed to be readable on their respective backgrounds.
| Background | Variable | Value |
| :--- | :--- | :--- |
| On Primary | `--on-p` | `var(--d)` |
| On Accent | `--on-a` | `var(--d-bd)` |
| On Dark | `--on-d` | `var(--l)` |
| On Light | `--on-l` | `var(--d)` |
| On Surface | `--on-srf` | `var(--t)` |

#### Semantic & Extended Palette: Secondary & Tertiary
| Variable | Description | Default Value | Fallback |
| :--- | :--- | :--- | :--- |
| **`--sec`** | **Secondary** | `hsl(200 19% 18%)` (Gunmetal) | `var(--theme-palette-color-23)` |
| **`--ter`** | **Tertiary** | `hsl(40 33% 93%)` (Sand) | `var(--theme-palette-color-24)` |

#### Semantic & Extended Palette: Notifications
| Variable | Description | Default Value | Fallback |
| :--- | :--- | :--- | :--- |
| **`--scs`** | **Success** | `hsl(137 65% 34%)` (#1E8E3E) | `var(--theme-palette-color-13)` |
| **`--alr`** | **Alert** | `hsl(4 71% 50%)` (#D93025) | `var(--theme-palette-color-14)` |
| **`--inf`** | **Info** | `hsl(214 82% 51%)` (#1A73E8) | `var(--theme-palette-color-15)` |
| **`--tip`** | **Tip** | `hsl(287 65% 40%)` (#8E24AA) | `var(--theme-palette-color-16)` |
| **`--ntf`** | **Notify** | `var(--p)` (Primary) | `var(--theme-palette-color-37)` |

---

### 2. Base: Animation, Transform & FX
Shared visual properties.

| Category | Variable | Value |
| :--- | :--- | :--- |
| **Animation** | `--trans` | `0.32s ease-in-out` |
| | `--trans-hover` | `0.16s ease-in-out` |
| **Shadow** | `--shd` | Default Box Shadow |
| | `--shd--m` | `0 0.25em 2em -0.5em` |
| | `--shd-c` | Shadow Color (`hsl(0 0% 8% / .32)`) |
| **Blur** | `--blr` | `0.25rem` (Medium) |
| **Transform** | `--tf-scale` | `1.125` (12.5% growth) |

---

### 3. Typography
Fluid typography scales using `clamp()`.

| Category | Variables | Range (Mobile -> Desktop) |
| :--- | :--- | :--- |
| **Headings** | `--t-fs--xxxl` ... `--t-fs--xxxs` | `3.5rem` -> `5rem` (3XL) |
| **Body** | `--tx-fs--xxl` ... `--tx-fs--xxxs` | `1.5rem` -> `1.75rem` (2XL) |
| **Properties** | `--t-fw`, `--tx-fw` | Font Weights (800, 400) |
| | `--t-lh`, `--tx-lh` | Line Heights (1.25, 1.5) |

---

### 4. Layout
Grid and Section defaults.

| Variable | Description | Value |
| :--- | :--- | :--- |
| **`--sc-max-w`** | Content Max Width | `1366px` |
| **`--s-gap`** | Section Gap | Fluid: `2rem` -> `4rem` |
| **`--g-gap`** | Grid Gap | Fluid: `1.75rem` -> `3rem` |
| **`--g-min`** | Grid Min Column | `256px` |

---

### 5. Utilities: Flow Spacing (Vertical Rhythm)
Variables that control the "Smart Flow" logic defined in `html.css`.

| Variable | Description | Value |
| :--- | :--- | :--- |
| **`--flow-s`** | **Standard** Flow | `1em` (Paragraphs, List containers) |
| **`--flow-xs`** | **Tight** Flow | `0.5em` (List items, Text-Heading connection) |
| **`--flow-l`** | **Loose** Flow | `1.5em` (Heading top margin) |
| **`--p-flow`** | Paragraph Gap | `var(--flow-s)` |
| **`--list-flow`** | List Gap | `var(--flow-s)` |

---

### 6. Patterns
Component-specific defaults.

| Pattern | Variable | Description |
| :--- | :--- | :--- |
| **Button** | `--btn-rad` | Border Radius (`4em` / Pill) |
| | `--btn-bg` | Background (`--p`) |
| **Card** | `--crd-rad` | Border Radius (`0.5rem`) |
| | `--crd-bg` | Background (`--crd` / White) |

---

## 🔧 For Developers

*   **Prefixing**: If you run `npm run build v`, all these variables become `--u-p`, `--u-bg`, etc. Your overrides must match (`--u-p: ...`).
*   **Performance**: CSS Variables are computed at runtime but are very fast. However, heavy use of `calc()` inside variables (like our fluid typography) can have a micro-cost on layout thrashing if abused. We optimize by keeping the formulas static in the config.

---

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Config](./)

[Back to top](#)

**License**: MPL-2.0
**Copyright**: © 2025 Shukhrat (Alive 🜁) ⤻ UNQA

## 🗺️ Visual Map

```
src/lib/
├── config/                  # 1. CONFIGURATION (The Brain) <== YOU ARE HERE
│   ├── root/                #    - Semantic Modules
│   │   ├── colors.css       #    - Palettes & Themes
│   │   ├── typography.css   #    - Fonts & Scales
│   │   ├── layout.css       #    - Radius & Spacing
│   │   └── patterns.css     #    - Component Vars
│   ├── adapters/            #    - CMS Adapters
│   │   ├── blocksy.css      #    - Blocksy Theme
│   │   └── gutenberg.css    #    - WordPress Block Editor
│   └── root.css             #    - Entry Point
│
├── base/                    # 2. BASE (The Foundation)
│   ├── html/                #    - HTML Engine
│   │   ├── reset.css        #    - Normalization
│   │   ├── typography.css   #    - Text Defaults
│   │   ├── flow.css         #    - Smart Flow Engine
│   │   ├── lists.css        #    - List Styles
│   │   ├── forms.css        #    - Input Styling
│   │   └── helpers.css      #    - HTML Utilities
│   └── html.css             #    - Entry Point
│
├── patterns/                # 3. PATTERNS (The Components)
│   ├── button/              #    - Atomic Component
│   │   ├── base.css
│   │   └── group.css
│   ├── card/                #    - Card Component
│   │   ├── base.css
│   │   ├── content.css      #    - Slots & Padding
│   │   ├── media.css        #    - Full-bleed Media
│   │   └── subgrid.css      #    - Subgrid Support
│   ├── button.css           #    - Aggregator
│   ├── card.css             #    - Aggregator
│   ├── media.css            #    - Media Wrapper
│   ├── link.css             #    - Link Wrapper
│   └── patterns.css         #    - Entry Point
│
├── layout/                  # 4. LAYOUT (The Skeleton)
│   ├── grid/                #    - Grid Engine
│   │   ├── base.css         #    - Core Logic
│   │   ├── columns.css      #    - Presets
│   │   ├── subgrid.css      #    - Smart Grid
│   │   ├── recipes.css      #    - Smart Logic (.masonry .g-row)
│   │   └── item.css         #    - Child Logic
│   ├── flex/                #    - Flex Engine
│   │   ├── base.css         #    - Core Logic
│   │   ├── alignment.css    #    - Alignment Tools
│   │   ├── gaps.css         #    - Smart Gaps
│   │   └── item.css         #    - Child Logic
│   ├── container.css        #    - Container Queries (.c)
│   ├── flex.css             #    - Entry Point
│   ├── grid.css             #    - Entry Point
│   └── section.css          #    - Structural Layout
│
├── theming/                 # 5. THEMING (The Skin)
│   ├── set.css
│   └── overlay.css
│
├── typography/              # 6. TYPOGRAPHY (The Voice)
│   ├── title.css
│   ├── text.css
│   └── text-align.css
│
└── utilities/               # 7. UTILITIES (The Tools)
    ├── display.css
    ├── position.css
    ├── overflow.css
    ├── margin.css
    ├── padding.css
    ├── radius.css
    ├── size.css             #    - Size Utilities
    ├── blur.css
    └── utilities.css
```
