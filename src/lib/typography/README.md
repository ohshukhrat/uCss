# Typography Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Typography](./)

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](./) | [Patterns](../patterns/) | [Utilities](../utilities/)
> **Fluid Typography**. A system where semantics (`h1`) and style (`.t`) are decoupled. Features smooth `clamp()`-based scaling for both Headings (`.t`) and Body Text (`.tx`), covering a massive range (from `xxl` down to `xxs+`) to ensure perfect readability on every device.

---

## 📑 Contents

*   [🌟 Overview](#overview)
*   [🤯 Philosophy](#philosophy)
    *   [The Death of Breakpoints](#the-death-of-breakpoints)
    *   [Semantics First, Visuals Second](#semantics-first-visuals-second)
*   [🚀 Getting Started](#getting-started)
*   [📦 Installation & Stats](#installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [Direct Links](#direct-links)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#files-reference)
*   [🧠 Deep Dive](#deep-dive)
    *   [1. Fluid Scaling Mathematics (`clamp`)](#1-fluid-scaling-mathematics-clamp)
    *   [2. The Title System (`.t`)](#2-the-title-system-t)
    *   [3. The Text System (`.tx`)](#3-the-text-system-tx)
*   [📍 Reference: Content Map](#reference-content-map)
    *   [Title Sizes (`.t`)](#title-sizes-t)
    *   [Text Sizes (`.tx`)](#text-sizes-tx)
    *   [Font Weights](#font-weights)
    *   [Alignment (`.ta`)](#alignment-ta)
    *   [Line Heights](#line-heights)
*   [💡 Best Practices & Customization](#best-practices--customization)
    *   [Binding to Semantics](#binding-to-semantics)
    *   [Responsive Alignment](#responsive-alignment)
    *   [The "Hero" Header Pattern](#the-hero-header-pattern)
*   [🔧 For Developers](#for-developers)

---

## 🌟 Overview

The **Typography Module** handles the size, weight, line-height, and alignment of text.
It separates **Headings** (`.t`, Title) from **Body Copy** (`.tx`, Text) to allow for distinct font-family and scaling logic.

### Top Features
1.  **Fluid Scaling**: A `.t--xl` isn't `4rem`. It's `clamp(3rem, 1.5vw + 2.6rem, 4rem)`. It truly scales linearly with the viewport width.
2.  **Container Aware Alignment**: `.ta-c--lg` centers text only when the *container* is large, not when the screen is large.
3.  **Decoupled Weights**: Use `.xb` (Extra Bold) or `.lt` (Light) independent of the heading level.
4.  **Semantic Mapping**: You can make a `<span class="t--h1">` look like an H1, or an `<h1 class="t--h4">` look like an H4. Note: uCss separates *semantics* (HTML tag) from *visuals* (Classes).

> [!LIGHTBULB]
> **Why separate `.t` and `.tx`?**
> Because Titles usually have tight line-heights (1.1 - 1.25) and display fonts. Body text needs looser line-heights (1.5 - 1.6) and readable serif/sans fonts. Separating them allows global tuning.

---

## 🤯 Philosophy

> **Computed Fluidity**. `typography.css` is a typesetting engine that abandons static pixel values for fluid mathematics. Using `clamp()` functions, typography in uCss scales smoothly between a minimum viewport size and a maximum viewport size, ensuring perfect legibility on any device without media query "jumps".

### The Death of Breakpoints
Traditional frameworks use "breakpoints".
*   Mobile: 16px.
*   Tablet: 18px.
*   Desktop: 20px.

This causes:
1.  **Jumps**: As you resize, the text snaps awkwardly.
2.  **Orphans**: A perfectly wrapped headline on 1000px might break into an orphan word on 999px.

**uCss Fluidity**:
We define a start point (2.5rem at 320px) and an end point (3.5rem at 1366px container width). The browser calculates the perfect pixel value for every single pixel in between.

### Semantics First, Visuals Second
Don't abuse `<h1>` just to get big text. Use `<p class="t--xxl">`.
Don't abuse `<h6>` just to get small text. Use `<p class="t--xs">`.
Keep your document outline (H1 -> H2 -> H3) clean for screen readers and SEO, and use uCss classes to style them to match your design.

---

## 🚀 Getting Started

### The "Clicked" Moment
1.  Type `<h1>Hello World</h1>`. It sizes itself based on defaults.
2.  Add class `.t--xxxl`. Watch it become massive.
3.  Add class `.ta-c`. It centers.
4.  Add class `.up`. It becomes UPPERCASE.
5.  Resize the window. Watch it shrink smoothly, maintaining proportionality.

### Rollout in 5 Seconds
1.  **Load the module**: `typography.min.css`.
2.  **Style a Hero**: `<h1 class="t t--xxxl ta-c lh--xs">Big Title</h1>`.
3.  **Style a Caption**: `<p class="tx tx--s ta-c--md lt">Small centered light text</p>`.

---

## 📦 Installation & Stats

### Bundle Stats

| File | Full (Raw) | Clean | Min | Gzip | Brotli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`typography.css` (Aggregator)** | **14 KB** | **9.5 KB** | **7.7 KB** | **2.7 KB** | **2.1 KB** |
| `title.css` | 6.1 KB | 4.3 KB | 3.4 KB | 0.9 KB | 0.8 KB |
| `text.css` | 5.9 KB | 4.2 KB | 3.4 KB | 0.9 KB | 0.8 KB |
| `text-align.css` | 1.8 KB | 1.1 KB | 0.9 KB | 0.3 KB | 0.2 KB |

### Direct Links

| Module | Full Source | Clean Source | Minified (Prod) |
| :--- | :--- | :--- | :--- |
| **Typography** | [typography.css](https://ucss.unqa.dev/stable/lib/typography.css) | [typography.clean.css](https://ucss.unqa.dev/stable/lib/typography.clean.css) | [typography.min.css](https://ucss.unqa.dev/stable/lib/typography.min.css) |

### HTML Snippets

#### Standard
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/typography.min.css">
```

#### Prefixed (`/p/`)
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/p/lib/typography.min.css">
```

---

## 📂 Files Reference

| File | Description | Download |
| :--- | :--- | :--- |
| **`title.css`** | **Headings**. The `.t` class system. Handles `h1`-`h6` sizing logic and weight modifiers. Sets `font-family: var(--title-font)`. | [src](https://ucss.unqa.dev/stable/lib/typography/title.css) |
| **`text.css`** | **Body**. The `.tx` class system. Handles paragraphs, captions, and generic text sizing. Sets `font-family: var(--text-font)`. | [src](https://ucss.unqa.dev/stable/lib/typography/text.css) |
| **`text-align.css`** | **Alignment**. The `.ta` class system. Handles responsive alignment (`start`, `center`, `end`). | [src](https://ucss.unqa.dev/stable/lib/typography/text-align.css) |

---

## 🧠 Deep Dive

### 1. Fluid Scaling Mathematics (`clamp`)
The formula looks like this: `clamp(MIN, SLOPE + INTERCEPT, MAX)`.
*   **MIN**: The font size on a 320px screen (e.g., 2rem).
*   **MAX**: The font size on a 1366px screen (e.g., 4rem).
*   **SLOPE**: The rate of growth (e.g., 5vw).

**Example**:
`clamp(2rem, 5vw + 1rem, 4rem)`
*   At 320px viewport: `5vw` is small. Result -> `2rem`.
*   At 800px viewport: `5vw` is bigger. Result -> `3rem`.
*   At 1920px viewport: `5vw` is huge. Result -> `4rem` (Capped).

uCss creates a hierarchy of these scales so that XXS text grows slowly, but XXXL text grows rapidly.

### 2. The Title System (`.t`)
The `.t` class essentially "activates" the Title Variable System on an element.
*   **Variables**: It exposes `--t-fs` (Size), `--t-fw` (Weight), `--t-lh` (Line Height).
*   **Base Styles**: It applies `font-family: var(--title-font)` and reset margins.
*   **Modifiers**: Classes like `.xxl` then update the `--t-fs` variable to a specific fluid value.

### 3. The Text System (`.tx`)
The `.tx` system works identically to `.t`, but for body copy.
*   **Variables**: `--tx-fs`, `--tx-fw`, `--tx-lh`.
*   **Base Styles**: It applies `font-family: var(--text-font)`.
*   **Defaults**: Uses a generous line-height (`1.5`) for readability, whereas Title uses a tight one (`1.25`).

---

## 📍 Reference: Content Map

### Title Sizes (`.t`)

| Class | Variable | Min Size | Max Size | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **`.t--xxxl`** | `--t-fs--xxxl` | `3.5rem` | `6rem` | Hero Titles |
| **`.t--xxl`** | `--t-fs--xxl` | `3rem` | `5rem` | Page Titles |
| **`.t--xl`** | `--t-fs--xl` | `2.5rem` | `4rem` | Section Headers |
| **`.t--l`** | `--t-fs--l` | `2rem` | `3rem` | Card Titles |
| **`.t--m`** | `--t-fs--m` | `1.75rem` | `2.5rem` | Subtitles |
| **`.t--s`** | `--t-fs--s` | `1.5rem` | `2rem` | Widget Headers |
| **`.t--xs`** | `--t-fs--xs` | `1.25rem` | `1.5rem` | Meta labels |

### Text Sizes (`.tx`)

| Class | Variable | Min Size | Max Size | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **`.tx--xxl`** | `--tx-fs--xxl` | `1.5rem` | `1.75rem` | Lead Paragraphs |
| **`.tx--xl`** | `--tx-fs--xl` | `1.375rem` | `1.5rem` | Intro Text |
| **`.tx--l`** | `--tx-fs--l` | `1.25rem` | `1.375rem` | Article Body (Large) |
| **`.tx--m`** | `--tx-fs--m` | `1.125rem` | `1.25rem` | Default Body |
| **`.tx--s`** | `--tx-fs--s` | `1rem` | `1.125rem` | UI Text / Captions |

### Font Weights
*Applies to both `.t` and `.tx`*

| Class | Name | Weight |
| :--- | :--- | :--- |
| **`.ub`, `.hl`** | Ultra Bold / Headline | `900` |
| **`.xb`, `.tb`** | Extra Bold / Title Bold | `800` |
| **`.bd`** | Bold | `700` |
| **`.sb`** | Semi Bold | `600` |
| **`.md`** | Medium | `500` |
| **`.rg`** | Regular | `400` |
| **`.lt`** | Light | `300` |

### Alignment (`.ta`)

| Class | Logic | Responsive Modifiers |
| :--- | :--- | :--- |
| **`.ta`** | Base Toggle | |
| **`.ta-s`** | Start (Left) | `.ta-s--sm`, `.ta-s--md`, `.ta-s--lg` |
| **`.ta-c`** | Center | `.ta-c--sm`, `.ta-c--md`, `.ta-c--lg` |
| **`.ta-e`** | End (Right) | `.ta-e--sm`, `.ta-e--md`, `.ta-e--lg` |
| **`.ta-j`** | Justify | |

### Line Heights

| Class | Value | Usage |
| :--- | :--- | :--- |
| **`.lh--xs`** | `1` | Headings / Tiles. Tight packing. |
| **`.lh--s`** | `1.125` | Tight text. |
| **`.lh--m`** | `1.25` | Default Title LH. |
| **`.lh--l`** | `1.375` | Relaxed. |
| **`.lh--xl`** | `1.5` | Default Body LH. Max readability. |

---

## 💡 Best Practices & Customization

### Binding to Semantics
Don't write `<h2 class="t--xl">` everywhere.
If your design system says H2s should always be XL, configure it in your theme:
```css
:root {
  /* Re-bind the H2 variable to the XL sizing variable */
  --h2-fs: var(--t-fs--xl);
}
```
Now `<h2 class="t">` is automatically XL.
Only use the classes (`.t--xl`) for **exceptions** (e.g., a specific marketing hero title that deviates from the system).

### Responsive Alignment
A common pattern is "Center on mobile, Left on desktop".
```html
<h1 class="t ta-c ta-s--lg">
    I am Center on small screens, Left on large screens.
</h1>
```
This reads: "Align Center by default. Align (Start) Left when container is Large."

### The "Hero" Header Pattern
For giant marketing headers, you often want:
1.  Massive Size (`.t--xxxl`)
2.  Tight Line Height (`.lh--xs`)
3.  Heavy styling (`.up` uppercase, `.hl` headline weight)

```html
<h1 class="t t--xxxl lh--xs up hl ta-c">
   The Future is Fluid
</h1>
```

---

## 🔧 For Developers

*   **Custom Fonts**: To change the font family, override `--title-font` and `--text-font`.
    ```css
    :root {
       --title-font: 'Outfit', sans-serif;
       --text-font: 'Inter', sans-serif;
    }
    ```
*   **Extending Sizes**: If you need a `.massive` class:
    ```css
    .t.massive {
      --t-fs: 10rem; /* Static override */
      --t-lh: 1;
    }
    ```
    Just set the variable; the `.t` class handles the application.

---

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Typography](./) 

[Back to top](#)

**License**: MPL-2.0
**Copyright**: © 2025 Shukhrat (Alive 🜁) ⤻ UNQA

## 🗺️ Visual Map

```
src/lib/
├── config/                  # 1. CONFIGURATION (The Brain)
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
├── typography/              # 6. TYPOGRAPHY (The Voice) <== YOU ARE HERE
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
