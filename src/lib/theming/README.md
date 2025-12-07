# Theming Module

**Navigation**: [uCss](../../../README.md) > [Source](../../README.md) > [Modules](../README.md) > [Theming](./) 

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](./) | [Typography](../typography/) | [Components](../components/) | [Utilities](../utilities/)

> **The Paint**. Manages color palettes, dark/light modes, and contextual overrides using CSS Custom Properties and Intercepted cascades.

---

## 📑 Page Contents
*   [Installation](#-installation)
*   [Set (`.set`)](#1-set-set)
*   [Overlay (`.o`)](#2-overlay-o)

---

## Theming Module

The **Theming Module** manages the visual layer of the framework. It handles color scopes, contextual theming, and overlays. It allows you to nest themes (e.g., a dark section inside a light page) just by applying a single class, with all children inheriting the correct colors automatically.

### Philosophy: The Cascade as a Feature
In modern web dev, "Cascading" is often treated as a bug to be avoided (hence Styled Components). In uCss, we embrace it.
*   **How it works**: We define high-level variables like `--t` (Title color) and `--bg` (Background).
*   **The Interception**: When you add `.set.dark`, we interrupt the cascade and redefine those variables for that specific DOM branch.
*   **The Result**: You write generic components (Cards, Buttons) that just read `var(--t)`. They don't care if they are in Dark Mode, Light Mode, or "Christmas Mode". They just render the current truth.

## 📦 Installation

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`theming`** | [src](https://ucss.unqa.dev/stable/lib/theming.css) • [clean](https://ucss.unqa.dev/stable/lib/theming.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming.css) • [clean](https://ucss.unqa.dev/latest/lib/theming.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming.min.css) |

### Individual Files

| File | Description | Stable | Latest |
| :--- | :--- | :--- | :--- |
| `set.css` | Contextual Themes (`.set`) | [src](https://ucss.unqa.dev/stable/lib/theming/set.css) • [clean](https://ucss.unqa.dev/stable/lib/theming/set.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming/set.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming/set.css) • [clean](https://ucss.unqa.dev/latest/lib/theming/set.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming/set.min.css) |
| `overlay.css` | Absolute Overlays (`.o`) | [src](https://ucss.unqa.dev/stable/lib/theming/overlay.css) • [clean](https://ucss.unqa.dev/stable/lib/theming/overlay.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming/overlay.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming/overlay.css) • [clean](https://ucss.unqa.dev/latest/lib/theming/overlay.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming/overlay.min.css) |

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`theming`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming.min.css">` |
| `set.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming/set.min.css">` |
| `overlay.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming/overlay.min.css">` |

---

## 1. Set (`.set`)
Contextual theming engine. Defines local scopes that override global color variables.

### Features
*   **Scoped inheritance**: Changes `--tx` (text), `--t` (headings), and `--bg` (background) for the element and all its children.
*   **Nestable**: You can put a `primary` button inside a `dark` card inside a `light` section, and everything just works.
*   **Link Handling**: Automatically adjusts link colors (`.lnk`) to be visible against the new background.

### Deep Dive: Infinite Nesting
Because we use variables, you can nest themes infinitely.
1.  **Level 1**: `<body class="set light">` (Global is Light)
2.  **Level 2**: `<section class="set dark">` (This stripe is Dark)
3.  **Level 3**: `<div class="card set light">` (This card inside the dark stripe is Light again)
4.  **Level 4**: `<button class="btn primary">` (This button uses the Primary brand color)

At every level, the text colors, link colors, and background colors resolve correctly without you writing complex selectors like `.dark .light .card`.

### Presets

| Class | Description | Variables Modified |
| :--- | :--- | :--- |
| `.set.primary` | Brand Primary | Sets background to subtle Primary color, text to dark. |
| `.set.secondary` | Brand Secondary | Sets background to subtle Secondary color, text to dark. |
| `.set.dark` | Dark Theme | Sets background to Black/Dark Grey, text to White/Light. |
| `.set.light` | Light Theme | Sets background to White, text to Dark. |

### Usage Examples

#### Dark Section
All text inside this section will automatically become light/white.
```html
<section class="s set dark">
  <h2 class="t">I am White</h2>
  <p class="tx">I am Light Grey</p>
</section>
```

#### Nested Cards
A Primary card inside a Dark section.
```html
<section class="set dark">
  <!-- This card pops with the Primary brand color -->
  <div class="crd set primary">
     <h3 class="t">Highlighted Content</h3>
  </div>
</section>
```

---

## 2. Overlay (`.o`)
A utility for creating absolute positioning layers, typically used for background images with text overlays or decorative elements.

### Features
*   **Absolute Fill**: Defaults to `inset: 0` and `width/height: 100%`.
*   **Smart Media**: Direct `img` or `video` children are automatically forced to `object-fit: cover`.
*   **Tint Layers**: Includes a `::after` pseudo-element to add color tints or gradients over the image, ensuring text readability.

### Class Reference

| Class | Function |
| :--- | :--- |
| `.o` | Base overlay (Absolute, z-index managed). |
| `.o.l` | Light tint (White overlay). |
| `.o.d` | Dark tint (Black overlay). |
| `.o.grd` | Gradient tint. |
| `.o.bd` | Bold opacity (0.64). |
| `.o.lt` | Light opacity (0.24). |

### Usage Examples

#### Hero Background with Dark Tint
A classic hero pattern: Image background + Dark Overlay + White Text.
```html
<section class="s set dark">
  <!-- The Content Layer (Relative) -->
  <div class="s__c">
     <h1 class="t">Welcome</h1>
  </div>

  <!-- The Background Layer -->
  <figure class="o d bd">
    <img src="hero.jpg" alt="Background">
  </figure>
</section>
```

#### Gradient Card Cover
```html
<div class="crd set dark">
  <div class="crd__body">
    <h3 class="t">Card Title</h3>
  </div>
  <figure class="o grd">
    <img src="thumb.jpg" alt="Thumbnail">
  </figure>
</div>
```
