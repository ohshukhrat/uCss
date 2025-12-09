# Config Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Config](./) 

**Modules**: [Config](./) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Components](../components/) | [Utilities](../utilities/)

> **The Central Nervous System**. Defines the global design tokens—Colors, Typography, and Spacing. While strictly optional (as all modules have built-in fallbacks), this file mirrors those values, allowing you to define your entire theme from scratch by overriding them.

---

## 📑 Page Contents
*   [Installation & Stats](#-installation-bundle-stats)
*   [Deep Dive: How It Works](#deep-dive-how-it-works)
*   [Reference: Content Map](#reference-content-map)
*   [Best Practices](#best-practices-customization)

---

## Configuration Module

The **Configuration Module** contains the central nervous system of the framework: **CSS Variables**. This is where all design tokens (colors, typography scales, spacing tokens, layout defaults) are defined.

### 🧠 Thinking in Tokens
1.  **Variables are the API**: This is the most important concept in uCss. You don't "compile" a theme; you "set" a variable.
2.  **Scope Matters**: Variables cascade. If you set `--p: red` on `<body>`, everything is red. If you set it on `.my-card`, only that card is red. Use this power to create contextual themes without extra CSS.
3.  **Short is Good**: We use `--p` (Primary) instead of `--theme-color-primary-500`. Why? Because you will type it 100 times a day. Typing speed matters.

## 📦 Installation & Bundle Stats

| File | Full | Clean | Min | Gzip | Brotli | Download |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`config.css`** | ~21KB | ~12KB | ~11KB | ~2.5KB | ~2.1KB | [src](https://ucss.unqa.dev/stable/lib/config.css) • [clean](https://ucss.unqa.dev/stable/lib/config.clean.css) • [min](https://ucss.unqa.dev/stable/lib/config.min.css) |
| **`root.css`** | ~21KB | ~12KB | ~11KB | ~2.5KB | ~2.1KB | [src](https://ucss.unqa.dev/stable/lib/config/root.css) • [clean](https://ucss.unqa.dev/stable/lib/config/root.clean.css) • [min](https://ucss.unqa.dev/stable/lib/config/root.min.css) |

> **Important Note**: This file is **NOT included** in the default `u.min.css` bundle. The framework components have built-in fallbacks. You only need to include `root.css` if you want to **override** the default design tokens globally without writing your own CSS.

> **Tip**: You can copy only specific parts of this file to override default tokens in your own CSS :root declaration. You do not need to copy the entire file.

### Connection Strategies

#### 1. The "Theme Bridge" (WordPress / CMS)
Best for WordPress sites using themes like Blocksy.
*   **Method**: `root.css` (or `config.css`) inherits variables defined by the theme.
*   **Code**:
    ```html
    <!-- Add this to your <head> -->
    <link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config.min.css">
    ```
    *Or specific file:*
    ```html
    <link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config/root.min.css">
    ```

#### 2. The "Overrider" (Manual / Self-Host)
Best for custom builds or non-CMS sites where you want full control.
*   **Method**: Host the file locally and edit the variables.
*   **Code**:
    ```html
    <!-- Download src/lib/config/root.css and link it locally -->
    <link rel="stylesheet" href="/css/root.css">
    ```

### Individual Files
> **Note**: `src/lib/config.css` is a concatenation of logical groups. It creates a single HTTP request for all your tokens and configurations. In most cases, you only need `src/lib/config/root.css` file.

---

## Deep Dive: How it Works

### 1. Structure (Sections & Groups)
The `root.css` file is not a random list of variables. It is generated from the project folder structure.
*   **Sections** (e.g., `General`, `Layout`): Correspond to the top-level directories in `src/lib/`.
*   **Groups** (e.g., `Palette`, `Typography`): Correspond to individual CSS files within those directories.
*   **Benefit**: This makes `root.css` "Self-Documenting". If you are looking for card variables, you scroll to the "Components" section.

### 2. The Color System & Naming
uCss uses **Short Variables** mapped to **Bridge Variables** mapped to **Fallbacks**.

#### Variable Logic
```css
/* --[Short Name]: var(--[Bridge Name], [Fallback Value]); */
--p: var(--theme-palette-color-1, hsl(43 83% 62%));
```
*   **`--p` (Primary)**: The variable you use in your app. Short, easy to type.
*   **`--theme-palette-color-1`**: The "Bridge". This is the variable name used by the **Blocksy** WordPress theme. If Blocksy is present, uCss automagically adopts its Primary color.
*   **`hsl(...)`**: The default fallback if no theme is present.

#### Naming Convention
We favor concise, logical abbreviations over verbose names to keep CSS payloads small and developer typing speed high.
*   `--bg` (Background) instead of `--background-color`
*   `--tx` (Text) instead of `--text-color`
*   `--mg` (Margin) instead of `--margin`
*   `--pd` (Padding) instead of `--padding`
*   `--rad` (Radius) instead of `--border-radius`

## Reference: Content Map

### 1. General & Colors
Defines the palette and core global values.

#### Brand Palette
| Variable | Description | Default Value | Fallback |
| :--- | :--- | :--- | :--- |
| **`--p`** | **Primary** | `hsl(43 83% 62%)` (#eec14c) | `var(--theme-palette-color-1)` |
| **`--a`** | **Accent** | `hsl(44 100% 50%)` (#ffb900) | `var(--theme-palette-color-2)` |
| `p-h`,`p-s`,`p-l` | Primary HSL components | - | - |
| `a-h`,`a-s`,`a-l` | Accent HSL components | - | - |

#### Base Palette (Dark/Light)
| Variable | Description | Default Value | Fallback |
| :--- | :--- | :--- | :--- |
| **`--d`** | **Dark** Base | `hsl(0 0% 8%)` (#141414) | `var(--theme-palette-color-3)` |
| `--d-bd` | Dark **Bold** (Darker) | `hsl(0 0% 4%)` | `var(--theme-palette-color-4)` |
| `--d-lt` | Dark **Lite** (Lighter) | `hsl(0 0% 12%)` | `var(--theme-palette-color-5)` |
| **`--l`** | **Light** Base | `hsl(0 0% 96%)` (#f5f5f5) | `var(--theme-palette-color-7)` |
| `--l-bd` | Light **Bold** (Whiter) | `hsl(0 0% 100%)` | `var(--theme-palette-color-8)` |
| `--l-lt` | Light **Lite** (Darker) | `hsl(0 0% 93%)` | `var(--theme-palette-color-6)` |

#### Contextual Surfaces
| Variable | Description | Mapped To |
| :--- | :--- | :--- |
| **`--bg`** | Page Background | `var(--l)` (Light Base) |
| **`--srf`** | Surface / Panel | `var(--l-lt)` (Light Lite) |
| **`--crd`** | Card Background | `var(--l-bd)` (Light Bold) |
| **`--tx`** | Body Text | `var(--d)` (Dark Base) |
| **`--t`** | Headings / Titles | `var(--d-bd)` (Dark Bold) |

#### Contrast Colors ("On" Colors)
Text colors guaranteed to be readable on their respective backgrounds.
| Background | Variable | Value |
| :--- | :--- | :--- |
| On Primary | `--on-p` | `var(--d)` |
| On Accent | `--on-a` | `var(--d-bd)` |
| On Dark | `--on-d` | `var(--l)` |
| On Light | `--on-l` | `var(--d)` |
| On Surface | `--on-srf` | `var(--t)` |

#### Secondary & Tertiary
| Variable | Description | Default Value | Fallback |
| :--- | :--- | :--- | :--- |
| **`--sec`** | **Secondary** | `hsl(200 19% 18%)` (Gunmetal) | `var(--theme-palette-color-23)` |
| **`--ter`** | **Tertiary** | `hsl(40 33% 93%)` (Sand) | `var(--theme-palette-color-24)` |

#### Semantic / Notification
| Variable | Description | Default Value | Fallback |
| :--- | :--- | :--- | :--- |
| **`--scs`** | **Success** | `hsl(137 65% 34%)` (#1E8E3E) | `var(--theme-palette-color-13)` |
| **`--alr`** | **Alert** | `hsl(4 71% 50%)` (#D93025) | `var(--theme-palette-color-14)` |
| **`--inf`** | **Info** | `hsl(214 82% 51%)` (#1A73E8) | `var(--theme-palette-color-15)` |
| **`--tip`** | **Tip** | `hsl(287 65% 40%)` (#8E24AA) | `var(--theme-palette-color-16)` |
| **`--ntf`** | **Notify** | `var(--p)` (Primary) | `var(--theme-palette-color-37)` |

---

### 2. Animation & FX
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

### 5. Components & Utilities
Component-specific defaults.

| Component | Variable | Description |
| :--- | :--- | :--- |
| **Button** | `--btn-rad` | Border Radius (`4em` / Pill) |
| | `--btn-bg` | Background (`--p`) |
| **Card** | `--crd-rad` | Border Radius (`0.5rem`) |
| | `--crd-bg` | Background (`--crd` / White) |
| **Utilities** | `--rad` | Base Radius (`0.5em`) |
| | `--gap` | Base Gap (`1.5rem`) |

---

## Best Practices & Customization

### The Power of Variables (Performance)
uCss relies 100% on CSS Custom Properties. This means:
*   **Zero Runtime**: There is no JavaScript to execute.
*   **Instant Paint**: Valid changes happen at the compositor level.
*   **Scope isolation**: You can override a variable for just one section (e.g., `<div style="--p: blue;">`) without affecting the rest of the site.

### Customization Guide
To customize the framework, you simply override these variables in your own CSS **after** loading uCss. You do not need to edit the source files.

### Example: Branding
```css
:root {
    /* Change Brand Colors */
    --p: #ff5722; /* Orange Primary */
    --a: #2196f3; /* Blue Accent */

    /* Tighter Radius */
    --rad: 2px;
    --btn-rad: 2px;

    /* Wider Content */
    --sc-max-w: 1600px;
}
```

### Example: Typography Scale
Adjusting the base headings to be larger on mobile.
```css
:root {
   /* Override the Medium heading clamp */
   --t-fs--m: clamp(3rem, 4vw, 4.5rem); 
}
```
