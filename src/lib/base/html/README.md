# HTML Base Submodule

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Base](../) > [HTML](./)

**Modules**: [Config](../../config/) | [Base](../) | [Layout](../../layout/) | [Theming](../../theming/) | [Typography](../../typography/) | [Patterns](../../patterns/) | [Utilities](../../utilities/)

> **The Semantic Skeleton**. A classless CSS engine that makes raw HTML look beautiful by default. It handles vertical rhythm ("Smart Flow"), typographic hierarchy, and interactive states without a single class name.

---

## 📑 Contents
*   [🌟 Overview](#-overview)
*   [🚀 Philosophy](#-philosophy-intro)
*   [⚡ How to Get Started](#-how-to-get-started)
*   [📦 Installation & Stats](#-installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#-files-reference)
*   [🧠 Deep Dive](#-deep-dive)
    *   [1. The Smart Flow Engine](#1-the-smart-flow-engine)
    *   [2. Classless Typography](#2-classless-typography)
    *   [3. App Mode (.s) vs Content Mode (.sf)](#3-app-mode-s-vs-content-mode-sf)
*   [📍 Reference: Content Map](#-reference-content-map)
    *   [Elements](#elements)
    *   [Flow Controllers](#flow-controllers)
    *   [List Helpers](#list-helpers)
*   [💡 Best Practices & Customization](#-best-practices--customization)
    *   [CMS Integration](#cms-integration)
*   [🔧 For Developers](#-for-developers)

---

## 🌟 Overview

The **HTML Submodule** is the "Reset + Normalize + Typography" layer.

### Top Features
1.  **Smart Flow**: Automatically adds space between paragraphs, but *different* space between a Paragraph and a Heading.
2.  **Semantic Binding**: `<h1>` is automatically Bold and sized fluidly via `--t-fs`.
3.  **Focus Rings**: All interactive elements (`<a>`, `<input>`, `<button>`) get accessible focus rings by default.
4.  **List Markers**: Bullets and Numbers inherit the brand color (`--p`).

---

## 🚀 Philosophy: Intro

### What is it about?
Most frameworks require you to add classes to everything.
`<h1 class="text-3xl font-bold mb-4">`.
uCss believes **HTML is UI**.
You should be able to dump a raw Markdown file into a page, and it should look perfect.

### The Flow Algorithm
We use a lobotomized owl selector (`* + *`) strategy, but smarter.
*   **P + P**: Standard flow (`0.75em`).
*   **P + H2**: Heading flow (`1em`). (More space before a new section).

---

## ⚡ How to Get Started

### The "Clicked" Moment
1.  Create a `<div class="sf">` (Start Flow).
2.  Paste 5000 words of unstyled HTML.
3.  Load the page.
4.  It reads like a Medium article. Perfect rhythm.

### Rollout in 5 Seconds
```html
<article class="sf">
  <h1>My Post</h1>
  <p>Intro...</p>
  <ul>
    <li>Point 1</li>
    <li>Point 2</li>
  </ul>
</article>
```

---

## 📦 Installation & Stats

### Bundle Stats

| File | Size |
| :--- | :--- |
| **`flow.css`** | ~2KB |
| **`typography.css`** | ~4KB |
| **`reset.css`** | ~1KB |
| **`lists.css`** | ~1KB |

### HTML Snippets

See [Base Module](../) for installation. This submodule is included in `base.css`.

---

## 📂 Files Reference

| File | Description | Download |
| :--- | :--- | :--- |
| **`reset.css`** | **Normalization**. Focus rings and box sizing. | [src](./reset.css) |
| **`flow.css`** | **Rhythm**. The Smart Flow engine logic. | [src](./flow.css) |
| **`typography.css`** | **Type**. Default styles for H1-H6, P, Blockquote. | [src](./typography.css) |
| **`lists.css`** | **Markers**. Styling for UL/OL/DL. | [src](./lists.css) |

---

## 🧠 Deep Dive

### 1. The Smart Flow Engine
The engine watches the *relationships* between elements.
It doesn't just say `margin-bottom: 20px`.
It says: "If a Paragraph is followed by a List, add Space. If a Heading is followed by a Paragraph, add less Space."

### 2. Classless Typography
We map standard HTML tags to our variable system.
*   `<h1>` -> `--t-fs--s` (Small Title).
*   `<h2>` -> `--t-fs--xs` (Extra Small Title).
*   `<small>` -> `0.875em`.
*   `<code>` -> `font-family: monospace`.

### 3. App Mode (.s) vs Content Mode (.sf)
*   **Start Flow (`.sf`)**: Used for *Content* (Blog posts, Legal pages). Turning this ON enables vertical margins.
*   **Stop Flow (`.s`)**: Used for *Apps* (Dashboards, Navbars). Turning this ON (or default) removes vertical margins so you can control layout with Flexbox/Grid explicitly.

---

## 📍 Reference: Content Map

### Elements

| Tag | Default | Variable |
| :--- | :--- | :--- |
| `<h1>` | 2.625rem (Fluid) | `--h-fs` |
| `<p>` | 65ch width | `--flow-max-width` |
| `<a>` | Underlined | `--link` |
| `<blockquote>` | Border Left | `--bq-bd-c` |
| `<hr>` | 1px Line | `--hr-c` |

### Flow Controllers

| Class | Name | Behavior |
| :--- | :--- | :--- |
| `.sf` | **Start Flow** | Enables vertical rhythm. |
| `.s` | **Stop Flow** | Disables vertical rhythm (sets vars to 0). |

### List Helpers

| Class | Description |
| :--- | :--- |
| `.cl` | **Clear List**. Removes bullets and padding. |

---

## 💡 Best Practices & Customization

### CMS Integration
If you are using WordPress or a headless CMS:
1.  Wrap the output `the_content()` in `.sf` (Smart Flow).
    ```html
    <div class="content sf">
      {post.body}
    </div>
    ```
2.  That's it. You don't need to touch the HTML.

### Overriding Global Headings
If you want ALL H1s to be Massive:
```css
:root {
  --h1-fs: var(--t-fs--xxl);
}
```

---

## 🔧 For Developers

### Debugging Flow
If spacing looks wrong:
1.  Inspect the element.
2.  Check `margin-block-start`.
3.  If it's `0`, check if you are inside a `.s` container.
4.  If it's huge, check if you accidentally nested `.sf`.

---

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Base](../) > [HTML](./)

**Modules**: [Config](../../config/) | [Base](../) | [Layout](../../layout/) | [Theming](../../theming/) | [Typography](../../typography/) | [Patterns](../../patterns/) | [Utilities](../../utilities/)

[Back to top](#)

**License**: MPL-2.0
**Copyright**: © 2025 Alive 🜁
