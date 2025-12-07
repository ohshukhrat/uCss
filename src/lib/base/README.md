# Base Module

**Navigation**: [uCss](../../../README.md) > [Source](../../README.md) > [Modules](../README.md) > [Base](./) 

**Modules**: [Config](../config/) | [Base](./) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Components](../components/) | [Utilities](../utilities/)

> **The Foundation**. Provides a surgical reset and tools for managing the "Content vs App" dichotomy.

---

## 📑 Page Contents
*   [Installation](#-installation)
*   [Content Spacing (`.cs` / `.csc`)](#1-content-spacing-cs--csc)
*   [Clear List (`.cl`)](#2-clear-list-cl)

---

## Base Module

The **Base Module** provides the foundational resets and normalizations. Unlike aggressive resets that strip everything (like traditional Eric Meyer resets), this module is surgical—it normalizes behavior while offering tools to manage "Content vs. App" spacing logic.

### Philosophy of Reset
We believe that `<h1>` tags should look like headings by default, and `<ul>` tags should have bullets by default.
*   **The Problem with "Nuke" Resets**: If you do `* { margin: 0; padding: 0 }`, you forcing yourself to write extra CSS just to make a blog post look readable.
*   **The uCss Approach**: We leave browser defaults alone where they make sense (typography scale, list styles). We only "reset" things that cause layout headaches (like `H1-H6` and `P` margins, and only if you apply .cs to a parent element).
*   **Opt-In Resets**: If you *do* want a stripped list (for a nav menu, or a grid of articles), you apply `.cl` (Clear List). You opt-in to the reset, rather than opting-out of the defaults.

## 📦 Installation

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`base`** | [src](https://ucss.unqa.dev/stable/lib/base.css) • [clean](https://ucss.unqa.dev/stable/lib/base.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base.min.css) | [src](https://ucss.unqa.dev/latest/lib/base.css) • [clean](https://ucss.unqa.dev/latest/lib/base.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base.min.css) |

### Individual Files

| File | Description | Stable | Latest |
| :--- | :--- | :--- | :--- |
| `clear.css` | Resets & Spacing Logic | [src](https://ucss.unqa.dev/stable/lib/base/clear.css) • [clean](https://ucss.unqa.dev/stable/lib/base/clear.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base/clear.min.css) | [src](https://ucss.unqa.dev/latest/lib/base/clear.css) • [clean](https://ucss.unqa.dev/latest/lib/base/clear.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base/clear.min.css) |

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`base`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/base.min.css">` |
| `clear.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/base/clear.min.css">` |

---

## 1. Content Spacing (`.cs` / `.csc`)
One of the hardest parts of CSS is managing margins on typography. You often end up with "double margins" or fighting specificity.

### App vs Content Mode
*   **Default Browser Behavior**: By default, browsers, CMSs (like WordPress), and standard resets *apply* margins to `h1`, `p`, `ul`, etc. This creates the "white space" you see in a raw HTML page.
*   **The Problem**: In a custom web app (like a dashboard), these default margins fight against your layout.
*   **The Solution (`.cs`)**: The `.cs` class **REMOVES** all default margins from its children. It creates a blank canvas.
*   **The Re-Application (`.csc`)**: The `.csc` class **RE-APPLIES** those margins.

### Logic Summary
1.  **Wrapper**: `<section class=".cs">` -> Margins are GONE. Use this for your layout shell.
2.  **Inner Content**: `<div class=".csc">` -> Margins are BACK. Use this for the inner blog post text.

### Classes

| Class | Name | Behavior |
| :--- | :--- | :--- |
| `.cs` | **Content Spacing (Reset)** | **Removes** default top/bottom margins from children (`p`, `h1-h6`, `ul`, `li`). Use this on the container to strip browser/CMS styles. |
| `.csc` | **Content Spacing Child (Restore)** | **Re-applies** standard vertical rhythm. Use this inside a `.cs` container to wrap text content. |
| `.cnt` | **Contents** | `display: contents` utility. |

### Usage Examples

#### WordPress / CMS Integration
In a WordPress template, you often can't control the HTML output of `the_content()`. It spits out paragraphs with margins.
*   We wrap the *whole section* in `.cs` to ensure our outer layout (grids, gaps) controls the spacing.
*   We wrap the *content div* in `.csc` to give the text back its readability.

```html
<!-- 1. Outer Shell: .cs STRIPS margins so we can control layout with .gap-xl -->
<section class="cs f col gap-xl">
    
    <!-- Header: No random margins interfering here -->
    <header>
        <h1>Custom Page Title</h1>
    </header>

    <!-- 2. Inner Content: .csc RESTORES margins for readability -->
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

## 2. Clear List (`.cl`)
A utility to strip default list styling, useful for navigation menus, icon lists, or grid layouts where `<ul>` is used for semantics but not visuals.

### Features
*   Removes `list-style-type` (bullets/numbers).
*   Removes `padding-inline` (indentation).
*   Removes `margin-block`.

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
