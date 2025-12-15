# Base Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Base](./)

**Modules**: [Config](../config/) | [Base](./) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Patterns](../patterns/) | [Utilities](../utilities/)

> **The Surgical Reset**. A powerful normalization engine that creates a "Smart Flow" environment. Unlike traditional resets that just strip styles to zero, the Base module establishes a sophisticated system for **Vertical Rhythm** that works automatically using Lobotomized Owl selectors (`* + *`) and CSS Variables.

---

## 📑 Contents

*   [🌟 Overview](#overview)
*   [🤯 Philosophy](#philosophy)
    *   [Beyond "Resetting"](#beyond-resetting)
    *   [The "Flow" Concept](#the-flow-concept)
*   [🚀 Getting Started](#getting-started)
*   [📦 Installation & Stats](#installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [Direct Links](#direct-links)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#files-reference)
*   [🧠 Deep Dive](#deep-dive)
    *   [The Smart Flow Engine (`* + *`)](#the-smart-flow-engine---)
    *   [Flow Controllers (`.s` vs `.sf`)](#flow-controllers-s-vs-sf)
    *   [Focus & Accessibility](#focus--accessibility)
*   [📍 Reference: Content Map](#reference-content-map)
    *   [Flow Variables](#flow-variables)
    *   [Flow Classes](#flow-classes)
    *   [Tag Logic Table](#tag-logic-table)
*   [💡 Best Practices & Customization](#best-practices--customization)
    *   [App Mode vs Content Mode](#app-mode-vs-content-mode)
    *   [Customizing Rhythm](#customizing-rhythm)
*   [🔧 For Developers](#for-developers)

---

## 🌟 Overview

The **Base Module** is the foundation that ensures your HTML looks good "naked".
It handles normalization, accessibility, and content flow.

### Top Features
1.  **Smart Flow Engine**: Margins are injected *between* elements automatically using `margin-block-start`. You rarely need utility classes for spacing in text content.
2.  **Context Switching**: Easily toggle between "App Mode" (No automatic margins) and "Content Mode" (Automatic margins) with a single class.
3.  **Semantic Mapping**: HTML tags (`h1`, `p`, `small`) are bound to Configuration variables. Change the config, and the base elements update.
4.  **A11y First**: Strong, high-contrast focus rings for keyboard navigation by default.

> [!LIGHTBULB]
> **Why `margin-block-start`?**
> We use Logical Properties (`block-start` instead of `top`) so that if you change your site's language direction (e.g., Vertical Japanese), the spacing remains logically correct up-down or right-left automatically.

---

## 🤯 Philosophy

### Beyond "Resetting"
Traditional resets (like Eric Meyer's reset) strip everything to zero.
`h1 { font-size: 100%; margin: 0; }`
This is great for consistency, but terrible for productivity. You immediately have to re-declare styles for every H1.
uCss takes a "Normalize + Enhance" approach. We strip the *inconsistent* browser defaults, but we *add back* a consistent, variable-driven baseline.

### The "Flow" Concept
In the uCss philosophy, **Vertical Rhythm** is the default state of content.
*   **Without uCss**: You manually calculate and add margin-bottom to every paragraph.
*   **With uCss**: The system assumes everything flows vertically and needs space, unless you tell it otherwise.

---

## 🚀 Getting Started

### The "Clicked" Moment
Create a raw HTML file with no classes:
```html
<article>
  <h1>My Journey</h1>
  <p>It started on a Tuesday.</p>
  <blockquote>"Code is Poetry"</blockquote>
  <p>Then I wrote some more.</p>
</article>
```
With uCss Base, this renders perfectly.
*   Space between `h1` and `p`.
*   Space between `p` and `blockquote`.
*   Space within the blockquote.
All without a single utility class.

### Rollout in 5 Seconds
1.  **Include**: `<link ... base.min.css>`.
2.  **Reset**: Add `<body class="s">` (Sets global default to "Section" / App Mode).
3.  **Enable**: Add `<main class="sf">` (Sets main content to "Start Flow" / Article Mode).

---

## 📦 Installation & Stats

### Bundle Stats

| File | Full (Raw) | Clean | Min | Gzip | Brotli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`base.css` (Aggregator)** | **19 KB** | **17 KB** | **14 KB** | **3.7 KB** | **3.2 KB** |
| `html.css` | 19 KB | 17 KB | 14 KB | 3.7 KB | 3.2 KB |
| `reset.css` | - | - | - | - | - |
| `typography.css` | - | - | - | - | - |

### Direct Links

| Module | Full Source | Clean Source | Minified (Prod) |
| :--- | :--- | :--- | :--- |
| **html.css** | [html.css](https://ucss.unqa.dev/stable/lib/base/html.css) | [html.clean.css](https://ucss.unqa.dev/stable/lib/base/html.clean.css) | [html.min.css](https://ucss.unqa.dev/stable/lib/base/html.min.css) |

### HTML Snippets

#### Standard
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/base.min.css">
```

#### Prefixed (`/p/`)
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/p/lib/base.min.css">
```

#### Only Variables (`/v/`)
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/v/lib/base.min.css">
```


---

## 📂 Files Reference

| File | Description |
| :--- | :--- |
| **`html.css`** | The **Controller**. Imports all partials below. Use this file to load the module. |
| **`flow.css`** | The **Engine**. Contains the Lobotomized Owl (`* + *`) selectors and the `.s` (design *section*) / `.sf` (*smart flow*) logic. |
| **`reset.css`** | The **Normalizer**. Sets `box-sizing: border-box`, standardizes input fonts, removes default margins. |
| **`typography.css`** | The **Binder**. Maps semantic tags (`h1`-`h6`, `small`, `code`) to Config variables. |
| **`lists.css`** | The **Cleaner**. specific logic for `ul` and `ol` spacing and markers. |
| **`forms.css`** | The **Basics**. Minimal styling for `input` and `textarea` to make them usable (standardized font, box model). |
| **`media.css`** | The **Media**. Sets `img`, `video` to `max-width: 100%` and `height: auto` to prevent layout blowouts. |

---

## 🧠 Deep Dive
The `html.css` is the invisible engine of uCss. It ensures that standard HTML elements stack with perfect vertical rhythm without you adding any classes.

### The Smart Flow Engine (`* + *`)
Instead of `p { margin-bottom: 1em }`, we use **Adjacent Sibling Selectors** (`* + *`) and **Variables**.

```css
/* "Smart Flow" Logic (Simplified) */

/* 1. Paragraphs following paragraphs get standard flow */
p + p { margin-top: var(--p-flow, 1em); }

/* 2. Headlines get more space BEFORE them... */
* + h2 { margin-top: var(--t-flow-s, 1.5em); }

/* 3. ...and less space AFTER them (to hug the text) */
h2 + p { margin-top: var(--t-flow-e, 0.5em); }
```

This means:
*   First child elements have **0 top margin** (perfect alignment with container).
*   Last child elements have **0 bottom margin** (perfect container sizing).
*   Everything in between flows naturally.

**How it works**:
1.  **`*` (Universal)**: Select everything...
2.  **`+ *` (Adjacent Sibling)**: ...that comes immediately after another element.
3.  **Result**: The *first* child gets no margin (flush top). Every subsequent child gets a top margin.

**Why this is genius**:
*   It respects the container. If you have a card with padding, the first text element inside sits right at the top of the padding.
*   It collapses cleanly.

### Flow Controllers (`.s` vs `.sf`)
These classes are technically "Variable Re-definers".

**`.s` (Design *Section*)**
*   Used for: Layouts, Grids, Dashboards, Toolbars.
*   Logic: Sets `--p-flow` (and others) to `0`.
*   Result: Elements stack with 0px space. You must use utility classes (`gap`, `mgb`) to inspect spacing.

**`.sf` (*Smart Flow*)**
*   Used for: Articles, Docs, Blog Posts, Bios inside a `.s` (Section).
*   Logic: Resets `--p-flow` to `0.75em`, `--h-flow` to `1em`, etc.
*   Result: Elements space themselves out naturally based on text size.

### Focus & Accessibility
We remove the default browser outline (`outline: none`) ONLY to replace it immediately with a better one.
```css
:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
}
```
*   **Variable Driven**: You can change `--focus-ring-color` globally or locally (e.g., distinct focus color on a dark background).
*   **Keyboard Only**: We mainly target `:focus-visible` so mouse users aren't annoyed by clicking buttons and seeing rings, but tab-users get clear indicators.

---

## 📍 Reference: Content Map

### Flow Variables (`flow.css`)
These control the `* + *` spacing.

| Variable | Default Value | Context |
| :--- | :--- | :--- |
| **`--p-flow`** | `0.75em` | Standard text flow (paragraph to paragraph). |
| **`--el-flow`** | `1.25em` | Element flow (text to list, text to table). |
| **`--t-flow-s`** | `1em` | Title Start. Space *before* a heading. |
| **--t-flow-e`** | `0.375em` | Title End. Space *after* a heading (Heading to Text). |
| **`--li-flow`** | `0.5em` | List Item flow (space between `<li>`). |

### Flow Classes

| Class | Name | Behavior |
| :--- | :--- | :--- |
| **`.s`** | **Section** | Kills flow. Use for structures. |
| **`.sf`** | **Smart Flow** | Enables smart flow. Use for copy. |
| **`.cl`** | **Clear List** | Removes bullets/numbers from `ul`/`ol`. |

### Tag Logic Table

| Tag | Bound Variable |
| :--- | :--- |
| `h1` | `--t-fs--s` (via `--h-fs`) |
| `h2` | `--t-fs--xs` |
| `h3` | `--t-fs--xxs` |
| `p` | `--tx-fs--s` |
| `small`| `--tx-fs--xs` |
| `code` | `--mono-font` |
| `pre` | `--mono-font` + `--d-lt` (Always dark lite) |

---

## 💡 Best Practices & Customization

### App (Design) Mode vs Content (Smart Flow) Mode
A common architecture pattern in uCss:
```html
<!-- Outer Shell: App Mode (.s) -->
<div class="s">
    
    <!-- Header: App Mode (Manual spacing) -->
    <header class="f row jc-sb">...</header>

    <!-- Main Content: Content Mode (.sf) -->
    <main class="sf article-body">
        <h1>Title</h1>
        <p>Text...</p>
    </main>
</div>
```
Use `.s` for the layout, `.sf` for the content.

### Customizing Rhythm
Sometimes you want a "Relaxed" read mode.
```css
.long-form-article {
    /* Increase spacing locally */
    --p-flow: 1.5em; 
    --t-flow-s: 3em; 
}
```
Apply this class to your `<article>` and the entire document rhythm expands loosely.

---

## 🔧 For Developers

*   **Specificty Hack**: `html.css` uses specificty-leveling tricks (like `:where()`) to ensure that your Utility classes (`.mgb-0`) always win against the automatic Flow margins.
*   **Debugging**: If an element isn't spacing correctly, inspect the `margin-block-start`. If it's `0`, check if you are accidentally inside a `.s` container.

---

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Base](./) 

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
├── base/                    # 2. BASE (The Foundation) <== YOU ARE HERE
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
