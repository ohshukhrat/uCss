# Flex Submodule

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Layout](../) > [Flex](./)

**Modules**: [Config](../../config/) | [Base](../../base/) | [Layout](../) | [Theming](../../theming/) | [Typography](../../typography/) | [Patterns](../../patterns/) | [Utilities](../../utilities/)

> **Smart Flexbox Utilities**. A responsive, gap-aware flexbox system that simplifies 1-dimensional layouts. Handles direction, wrapping, alignment, and responsiveness without the verbosity.

---

## 📑 Contents

*   [🌟 Overview](#-overview)
*   [🤯 Philosophy](#-philosophy)
*   [🚀 Getting Started](#-getting-started)
*   [📦 Installation & Stats](#-installation--stats)
*   [📂 Files Reference](#-files-reference)
*   [📍 Reference: Content Map](#-reference-content-map)
    *   [Base Classes](#base-classes)
    *   [Item Modifiers](#item-modifiers)
    *   [Alignment](#alignment)
*   [💡 Best Practices](#-best-practices)

---

## 🌟 Overview

The **Flex** module handles **1-Dimensional** layouts (Row OR Column). While Grid handles the macro page structure, Flex is perfect for micro-components like Navbars, Media Objects, and Button Groups.

### Top Features
1.  **Fluid Gaps**: Like Grid, Flex gaps (`.gap`) use `clamp()` to scale automatically.
2.  **Direction-Agnostic**: Shift from Row to Column responsively (`.col--sm`).
3.  **Smart Wrapping**: Utilities to control wrapping behavior.

---

## 🤯 Philosophy

Standard Flexbox is great, but verbose. `display: flex; flex-direction: column; align-items: center; gap: 1rem;` is a lot of typing.
uCss compresses this to `.f.col.ai-c.gap`.

---

## 🚀 Getting Started

```html
<!-- Navbar -->
<nav class="f row ai-c gap-xl">
  <div class="logo">Logo</div>
  <div class="links f row gap">
    <a href="#">Home</a>
    <a href="#">About</a>
  </div>
</nav>

<!-- Stack on Mobile, Row on Desktop -->
<div class="f col row--md gap">
  <div>Item 1 (Top / Left)</div>
  <div>Item 2 (Bottom / Right)</div>
</div>
```

---

## 📦 Installation & Stats

This Submodule is part of `layout.css`.

| File | Description |
| :--- | :--- |
| **`flex/base.css`** | Core `.f` class and direction utilities. |
| **`flex/gaps.css`** | Fluid gap system (shared logic with Grid). |
| **`flex/item.css`** | Child properties (grow, shrink, basis, order). |
| **`flex/alignment.css`** | Alignment utilities (`.ai-*`, `.jc-*`). |

---

## 📂 Files Reference

The `src/lib/layout/flex` directory contains specific partials.

| File | Description |
| :--- | :--- |
| **`base.css`** | **Engine**. Sets `display: flex`. |
| **`gaps.css`** | **Spacing**. `gap` utilities using `var(--f-gap)`. |
| **`item.css`** | **Children**. `.fi-grow`, `.fi-shrink`. |
| **`alignment.css`** | **Placement**. `justify-content` and `align-items`. |

---

## 📍 Reference: Content Map

### Base Classes

| Class | Description |
| :--- | :--- |
| **`.f`** | Initialize Flexbox. |
| **`.f.row`** | `flex-direction: row` (Default). |
| **`.f.col`** | `flex-direction: column`. |
| **`.wrap`** | `flex-wrap: wrap`. |
| **`.nowrap`** | `flex-wrap: nowrap`. |

### Item Modifiers

| Class | Variable | Description |
| :--- | :--- | :--- |
| **`.grow-1`** | `--fi-grow: 1` | Allow item to grow. |
| **`.shrink-0`** | `--fi-shrink: 0` | Prevent item from shrinking. |
| **`.basis-auto`** | `--fi-basis: auto` | Auto basis. |
| **`.o-1`** | `--fi-order: 1` | Order of the item. |

### Alignment

| Class | Property | Value |
| :--- | :--- | :--- |
| **`.ai-c`** | `align-items` | `center` |
| **`.ai-s`** | `align-items` | `flex-start` |
| **`.ai-e`** | `align-items` | `flex-end` |
| **`.ai-st`** | `align-items` | `stretch` |
| **`.jc-sb`** | `justify-content` | `space-between` |
| **`.jc-c`** | `justify-content` | `center` |
| **`.jc-e`** | `justify-content` | `flex-end` |

---

## 💡 Best Practices

*   Use **Flex** for 1D lists (Navbars, Tag lists).
*   Use **Grid** (`.g`) for 2D layouts (Photo galleries, Dashboard grids) or when you need strict column alignment.
*   Combine them: A Card can be a Grid Item, but the content inside the Card is Flex.

---

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Layout](../) > [Flex](./)

[Back to top](#)
