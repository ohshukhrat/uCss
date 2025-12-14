# Grid Submodule

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Layout](../) > [Grid](./)

**Modules**: [Config](../../config/) | [Base](../../base/) | [Layout](../) | [Theming](../../theming/) | [Typography](../../typography/) | [Patterns](../../patterns/) | [Utilities](../../utilities/)

> **Implicit 2D Layouts**. A smart, responsive grid engine that uses `auto-fit` and `minmax()` to automatically arrange content without requiring manual column classes for every item. Includes powerful **Subgrid** capabilities for aligning deeply nested content across different parent containers.

---

## 📑 Contents

*   [🌟 Overview](#-overview)
*   [🤯 Philosophy](#-philosophy)
    *   [The Death of the 12-Column Grid](#the-death-of-the-12-column-grid)
    *   [Implicit Resilience](#implicit-resilience)
*   [🚀 Getting Started](#-getting-started)
*   [📦 Installation & Stats](#-installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#-files-reference)
*   [🧠 Deep Dive](#-deep-dive)
    *   [1. The Auto-Fit Algorithm](#1-the-auto-fit-algorithm)
    *   [2. Subgrid Magic (`.sg`)](#2-subgrid-magic-sg)
    *   [3. Asymmetrical Grids (`.g-2-1`)](#3-asymmetrical-grids-g-2-1)
    *   [4. Density Engine (`dense`)](#4-density-engine-dense)
*   [📍 Reference: Content Map](#-reference-content-map)
    *   [Base Classes](#base-classes)
    *   [Column Presets](#column-presets)
    *   [Gap Presets](#gap-presets)
    *   [Subgrid Modifiers](#subgrid-modifiers)
    *   [Item Modifiers](#item-modifiers)
*   [💡 Best Practices & Customization](#-best-practices--customization)
    *   [Aligning Card Headers (Holy Grail)](#aligning-card-headers-holy-grail)
    *   [Masonry-Style Layouts](#masonry-style-layouts)
*   [🔧 For Developers](#-for-developers)

---

## 🌟 Overview

The **Grid Submodule** is the heavy lifter of the Layout module. It handles 2-Dimensional layouts (Rows AND Columns).

### Top Features
1.  **Zero-Config Responsiveness**: Just `.g`. Items wrap automatically based on their minimum width (`--g-min`). No media queries needed.
2.  **Fractional Layouts**: Easily create `.g-2-1` (2/3 + 1/3) layouts for sidebars or dashboards.
3.  **Subgrid Support**: `.sg` allows children (like Cards) to participate in the parent grid's tracks, ensuring alignment of internal elements across siblings.
4.  **Fluid Gaps**: Gaps use `clamp()` logic. They shrink on mobile and grow on desktop automatically.

> [!LIGHTBULB]
> **Implicit vs Explicit**
> Explicit: "I want 3 columns."
> Implicit: "I want columns at least 300px wide."
> uCss defaults to **Implicit** because it is more robust against content changes.

---

## 🤯 Philosophy

### The Death of the 12-Column Grid
We don't want to calculate `100% / 12 * 4` anymore. That logic belongs to 2013 (Bootstrap 3).
*   **Old Way**: `<div class="col-xs-12 col-md-6 col-lg-4">`.
*   **uCss Way**: `<div class="g" style="--g-min: 300px">`.

The uCss approach declares the *intent* (needs 300px space) rather than the *implementation* (takes up 4 columns).

### Implicit Resilience
Implicit grids are resilient.
If you have a 3-column explicit grid and add a 4th item, it breaks or looks weird.
If you have an implicit grid, it just wraps to a new row.
This "Fail-Safe" nature makes uCss grids perfect for CMS content where you don't know how many items an editor will upload.

---

## 🚀 Getting Started

### The "Clicked" Moment (Mobile First)
1.  `<div class="g">`.
2.  `<div>Item 1</div>`
3.  `<div>Item 2</div>`
4.  `<div>Item 3</div>`
5.  It's a 3-column layout on Desktop.
6.  Resize window. It becomes 2-column. Then 1-column.
7.  **Zero** media queries were written.

### You can rollout full fledged grid system literally in 5 seconds
```html
<div class="g gap-xl">
  <div class="card">1</div>
  <div class="card">2</div>
  <div class="card">3</div>
</div>
```

---

## 📦 Installation & Stats

### Bundle Stats

This Submodule is part of `layout.css`.

| File | Size (Raw) | Description |
| :--- | :--- | :--- |
| **`grid/base.css`** | **~2 KB** | Core Auto-Fit logic. |
| **`grid/columns.css`** | **~3 KB** | Explicit column overrides (`.g-1`...). |
| **`grid/gaps.css`** | **~14 KB** | Fluid gap system. |
| **`grid/subgrid.css`** | **~5 KB** | Nesting alignment logic. |
| **`grid/alignment.css`** | **~4 KB** | Alignment utilities. |

### HTML Snippets

Since this is a nested module, it is included in `layout.min.css`:
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout.min.css">
```

---

## 📂 Files Reference

The `src/lib/layout/grid` directory contains specific partials.

| File | Description | Download |
| :--- | :--- | :--- |
| **`base.css`** | **Engine**. The `.g` class and the `auto-fit` math. Defines `--g-min` defaults. | [src](./base.css) |
| **`columns.css`** | **Explicit**. Overrides for fixed columns (`.g-2`, `.g-3`) and fractional layouts (`.g-2-1`). | [src](./columns.css) |
| **`subgrid.css`** | **Nesting**. The `.sg` class which sets `grid-template-rows: subgrid`. | [src](./subgrid.css) |
| **`gaps.css`** | **Spacing**. Extensive gap presets using `clamp()`. | [src](./gaps.css) |
| **`alignment.css`** | **Placement**. Utilities for `align-items`, `justify-items` specific to grid contexts. | [src](./alignment.css) |

---

## 🧠 Deep Dive

### 1. The Auto-Fit Algorithm
The magic formula:
`grid-template-columns: repeat(var(--cols, auto-fit), minmax(var(--g-min), 1fr))`

1.  **`auto-fit`**: Detects available space.
2.  **`minmax`**: Enforces a floor.
    *   If container is 1024px and `--g-min` is 256px -> 4 columns.
    *   If container is 512px and `--g-min` is 256px -> 2 columns.
3.  **`1fr`**: Distribution. If there is 1100px space (4 * 250 = 1000), the extra 100px is distributed equally (25px per column).

### 2. Subgrid Magic (`.sg`)
Subgrid is the most important CSS feature of the decade.
Problem: You have a row of Cards. Card A has a short title. Card B has a long title. The "Body" text of Card A starts higher up than Card B. It looks messy.
Solution:
1.  Parent Grid defines rows: `grid-template-rows: auto 1fr auto` (eg. `--g-rows-template: auto 1fr auto`).
2.  Child Card adopts rows: `grid-row: span 3; display: grid; grid-template-rows: subgrid` (eg. `.sg` + `--gi-row: span 3`).
3.  Now, the "Header" of Card A and Card B share the *same* Grid Track. The tallest header dictates the height for *both*.

### 3. Asymmetrical Grids (`.g-2-1`)
Sometimes you don't want equal columns.
`.g-2-1` creates a layout where the first column is `2fr` and the second is `1fr`.
*   **Smart Collapse**: Unlike simple `2fr 1fr`, we wrap this in a `@container` query (or media query fallback). If the space is too small, it reverts to `1fr` (stacked).

### 4. Density Engine (`dense`)
By default, CSS Grid leaves holes if an item is too big to fit the remaining space in a row.
Adding `.g--dense` enables `grid-auto-flow: dense`.
The browser will attempt to backfill those holes with smaller items that come later in the DOM.
great for photo galleries.

---

## 📍 Reference: Content Map

### Base Classes

| Class | Variable | Description |
| :--- | :--- | :--- |
| **`.g`** | `--g-min` | Standard Auto-Fit Grid. Default min 256px. |
| **`.g--dense`** | | Enable Dense packing. |
| **`.g--inline`** | | `display: inline-grid`. |

### Column Presets

| Class | Meaning | Use Case |
| :--- | :--- | :--- |
| **`.g-1`** | Force 1 Column. | Mobile overrides, Stacking. |
| **`.g-2`** | Force 2 Columns. | Comparison views. |
| **`.g-3`** | Force 3 Columns. | Pricing tables. |
| **`.g-4`** | Force 4 Columns. | Galleries. |
| **`.g-12`** | Force 12 Columns. | Complex dashboard layouts. |
| **`.g-1-2`** | 1/3 Left, 2/3 Right. | Sidebar Left. |
| **`.g-2-1`** | 2/3 Left, 1/3 Right. | Sidebar Right. |

### Gap Presets

| Class | Description |
| :--- | :--- |
| **`.gap`** | default fluid gap. |
| **`.gap--sm`** | Small Gap. |
| **`.gap--xs`** | Extra Small Gap. |
| **`.gap--xxs`** | Tiny Gap (2px). |
| **`.gap--l`** | Large Gap. |
| **`.gap--xl`** | Extra Large Gap. |
| **`.row-gap--*`** | Only vertical gap. |
| **`.col-gap--*`** | Only horizontal gap. |
| **`.gap-0`** | Remove all gaps. |

### Subgrid Modifiers

| Class | Description |
| :--- | :--- |
| **`.sg`** | **Row Subgrid**. Child rows align to parent rows. |
| **`.sgc`** | **Col Subgrid**. Child cols align to parent cols. |

### Item Modifiers

| Class | Effect |
| :--- | :--- |
| **`.sp-2`** | `grid-column: span 2`. |
| **`.sp-3`** | `grid-column: span 3`. |
| **`.sp-full`** | `grid-column: 1 / -1`. (Full Width). |
| **`.rsp-2`** | `grid-row: span 2`. |

---

## 💡 Best Practices & Customization

### Aligning Card Headers (Holy Grail)
To make all card headers the same height across a row:
```html
<div class="g" style="--g-auto-rows: auto 1fr auto">
   <!-- Card 1 -->
   <article class="crd sg rsp-3">
      <header class="rsp-1">...</header> <!-- Row 1 -->
      <div class="rsp-1">...</div>      <!-- Row 2 -->
      <footer>...</footer> <!-- Row 3 -->
   </article>
   <!-- Card 2 -->
   <article class="crd sg rsp-3"></article>
</div>
```
Use `grid-row: span 3` to tell the card to span 3 rows of the parent, and `.sg` to tell its children to inhabit those rows.

### Masonry-Style Layouts
You can achieve a Masonry-like look (strict Masonry requires JS or future CSS spec) using Dense:
```html
<div class="g g-4 dense">
   <img src="1.jpg">
   <img src="2.jpg" class="span-2 row-span-2"> <!-- Big Image -->
   <img src="3.jpg">
   <img src="4.jpg"> <!-- Will backfill if space exists -->
</div>
```

---

## 🔧 For Developers

### Extending Columns
To add `.g-5`:
```css
.g-5 {
  --g-cols: 5;
  --g-min: 0px; /* Optional: remove min width to force fit */
}
```

### Customizing Min-Width
You can change the break point of any grid locally:
```html
<!-- Breaks at 100px instead of 256px -->
<div class="g" style="--g-min: 100px">...</div>
```

---

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Layout](../) > [Grid](./)

**Modules**: [Config](../../config/) | [Base](../../base/) | [Layout](../) | [Theming](../../theming/) | [Typography](../../typography/) | [Patterns](../../patterns/) | [Utilities](../../utilities/)

[Back to top](#)

**License**: MPL-2.0
**Copyright**: © 2025 Alive 🜁
