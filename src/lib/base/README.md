# Base Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Base](./) 

**Modules**: [Config](../config/) | [Base](./) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Components](../components/) | [Utilities](../utilities/)

> **The Surgical Reset**. A lightweight foundation that normalizes browser inconsistencies without nuking useful defaults. Features the unique **Smart Flow** engine (`html.css`) for effortless vertical rhythm and the **Content Controller** (`content.css`) to seamlessly manage "App Layouts" vs "Article Content".

---

## 📑 Page Contents
*   [Installation](#-installation)
*   [Smart Flow (`html.css`)](#1-smart-flow-htmlcss)
*   [Content Controller (`.cs` / `.csc`)](#2-content-controller-cs--csc)
*   [Clear List (`.cl`)](#3-clear-list-cl)

---

## Base Module

The **Base Module** provides the foundational resets and normalizations. Unlike aggressive resets that strip everything (like traditional Eric Meyer resets), this module is surgical—it normalizes behavior while offering sophisticated tools to manage "Content vs. App" spacing logic.

### Philosophy of Reset: "Smart Flow"
We believe that `<p>` tags should have bottom margins and `<h1>` tags should have top margins *by default*, because that's how legibility works.
*   **The Engine (`html.css`)**: We moved the "Smart Flow" logic directly into the global scope. "Naked" HTML elements (`p`, `h1`, `ul`) now have intelligent spacing relationships (e.g., using "Lobotomized Owl" style adjacent sibling selectors) powered by variables.
*   **The Controller (`content.css`)**: We introduce a "Controller" file that simply *toggles* these variables on or off depending on the context (`.cs` vs `.csc`).

### 🧠 Thinking in Resets
1.  **App vs Content**: Web apps need "Resets" (no margins) for precise layouts. Blog posts need "Typography" (rich margins) for reading. uCss handles both.
2.  **The `.cs` Pattern**: If you are building a layout (columns, cards), wrap it in `.cs` (App Mode). This sets all flow variables to `0`, effectively neutralizing the Smart Flow engine.
3.  **The `.csc` Restore**: If you drop a blog post inside that layout, wrap it in `.csc` (Content Mode) to restore the flow variables. The engine wakes up and spacing returns.

## 📦 Installation

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`base`** | [src](https://ucss.unqa.dev/stable/lib/base.css) • [clean](https://ucss.unqa.dev/stable/lib/base.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base.min.css) | [src](https://ucss.unqa.dev/latest/lib/base.css) • [clean](https://ucss.unqa.dev/latest/lib/base.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base.min.css) |

### Individual Files

| File | Description | Stable | Latest |
| :--- | :--- | :--- | :--- |
| `html.css` | **Engine**. Global Reset & Smart Flow Logic | [src](https://ucss.unqa.dev/stable/lib/base/html.css) • [clean](https://ucss.unqa.dev/stable/lib/base/html.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base/html.min.css) | [src](https://ucss.unqa.dev/latest/lib/base/html.css) • [clean](https://ucss.unqa.dev/latest/lib/base/html.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base/html.min.css) |
| `content.css` | **Controller**. App Mode / Content Mode | [src](https://ucss.unqa.dev/stable/lib/base/content.css) • [clean](https://ucss.unqa.dev/stable/lib/base/content.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base/content.min.css) | [src](https://ucss.unqa.dev/latest/lib/base/content.css) • [clean](https://ucss.unqa.dev/latest/lib/base/content.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base/content.min.css) |


> [!TIP]
> **Encapsulation**: uCss supports automatic prefixing (e.g., `.u-btn`). See [Encapsulation & Prefixing](../../../README.md#encapsulation--prefixing-new) for build instructions.

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`base`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/base.min.css">` |
| `content.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/base/content.min.css">` |

---

## 1. Smart Flow (`html.css`)
This is the invisible engine of uCss. It ensures that standard HTML elements stack with perfect vertical rhythm without you adding any classes.

### How it Works
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

---

## 2. Content Controller (`.cs` / `.csc`)
One of the hardest parts of CSS is managing margins on typography. You often end up with "double margins" or fighting specificity. `content.css` helps you control the Smart Flow variables.

### App vs Content Mode
*   **Default Browser Behavior**: Margins are everywhere.
*   **The Problem**: In a custom web app (like a dashboard), these default margins fight against your layout.
*   **The Solution (`.cs`)**: The `.cs` class sets all flow variables (`--p-flow`, `--t-flow-s`, etc.) to **0**. The Smart Flow engine is still running, but it's adding "0px" of margin.
*   **The Re-Application (`.csc`)**: The `.csc` class restores those variables to their defaults from `root.css`.

### Logic Summary
1.  **Wrapper**: `<section class=".cs">` (App Mode) -> Variables are `0`. Use this for your layout shell.
2.  **Inner Content**: `<div class=".csc">` (Content Mode) -> Variables are `1em`. Use this for the inner blog post text.

### Classes

| Class | Name | Behavior |
| :--- | :--- | :--- |
| `.cs` | **Content Spacing (Reset)** | **Kills** flow variables. Effectively removes default margins from children. Use on containers. |
| `.csc` | **Content Spacing Child (Restore)** | **Restores** flow variables. Re-activates vertical rhythm. Use inside `.cs` |
| `.cnt` | **Contents** | `display: contents` utility. |

### Usage Examples

#### App Shell + Blog Post
```html
<!-- 1. Outer Shell: .cs sets flow vars to 0. We control layout with GRID/FLEX gaps. -->
<section class="cs f col gap-xl">
    
    <!-- Header: No random margins interfering here -->
    <header>
        <h1>Custom Page Title</h1>
    </header>

    <!-- 2. Inner Content: .csc restores flow vars for readability -->
    <div class="csc">
        <!-- Everything here will have nice vertical rhythm again -->
        <p>This is paragraph text from the CMS.</p>
        <ul>
            <li>List item</li>
        </ul>
        <p>More text.</p>
    </div>
    
</section>
```

---

## 3. Clear List (`.cl`)
A utility to strip default list styling, useful for navigation menus or grids.

### Features
*   Removes `list-style-type`.
*   Removes `padding-inline`.
*   Sets `--list-flow: 0` (integrates with Smart Flow).

### Usage Examples

#### Navigation Menu
```html
<nav>
  <!-- Clean semantic list without bullets or indent -->
  <ul class="cl f row gap-m">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```
