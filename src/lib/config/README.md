# Config Module

**Navigation**: [uCss](../../../README.md) > [Source](../../README.md) > [Modules](../README.md) > [Config](./) 

**Modules**: [Config](./) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Components](../components/) | [Utilities](../utilities/)

> **The Central Nervous System**. Defines the CSS Variables for the entire system: colors, typography scales, spacing tokens, and layout presets.

---

## 📑 Page Contents
*   [Installation](#-installation)
*   [Structure](#structure)
*   [Customization](#customization)

---

## Configuration Module

The **Configuration Module** contains the central nervous system of the framework: **CSS Variables**. This is where all design tokens (colors, typography scales, spacing presets, layout defaults) are defined.

## 📦 Installation

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`root.css`** | [src](https://ucss.unqa.dev/stable/lib/config/root.css) | [src](https://ucss.unqa.dev/latest/lib/config/root.css) |

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`root.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config/root.css">` |

> **Note**: This file is typically not included automatically if you just use the main `u.min.css` bundle. If you are building a custom bundle, you can use this file to override default tokens. Although it is **not required** as all other modules already have fallbacks built-in.

> **Tip**: You can copy only specific parts of this file to override default tokens in your own CSS :root declaration. You do not need to copy the entire file.

---

## Structure
The `root.css` file is organized by **Section** and **Group**, mirroring the project folder structure.

### 1. General & Theming
Defines the palette and core global values.
*   `--p`, `--a`: Primary and Accent colors.
*   `--d`, `--l`: Dark and Light base colors.
*   `--bg`, `--srf`: Background and Surface colors.
*   `--on-*`: Contrast-safe text colors for each background type.
*   `--trans-*`: Global animation durations.

### 2. Typography
Defines the fluid type scales.
*   `--t-fs-*`: Heading font sizes (`xxxl` to `xxxs`).
*   `--tx-fs-*`: Body font sizes (`xxl` to `xxxs`).
*   `--*-lh`: Line heights.
*   `--*-fw`: Font weights.

### 3. Layout
Defines the grid capability and section bounds.
*   `--sc-max-w`: The maximum width of the standard content container (default `1366px`).
*   `--s-gap`, `--g-gap`: Default gaps for sections and grids.
*   `--g-min`: The minimum column width for auto-fit grids (default `256px`).

### 4. Components
Defines specific tokens for Cards, Buttons, etc.
*   `--btn-*`: Button radius, padding, font sizes.
*   `--crd-*`: Card background, radius, padding.

### 5. Utilities
Defines utility presets.
*   `--rad`: Base radius.
*   `--gap`: Base gap.

---

## Customization
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
