# [uCss](../../../) / [Hub](../../) / [Base](./)

**Documentation**: [Overview](../../../) | [Hub](../../) | [Config](../config/) | [Base](./) | [Layout](../layout/) | [Typography](../typography/) | [Components](../components/) | [Theming](../theming/) | [Utilities](../utilities/)

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
*   **App Mode (Default)**: In a dashboard or web app, you are building a layout. You don't want the paragraph inside a card to push the card height open unexpectedly with its default margin. You want tight control.
*   **Content Mode (`.cs`)**: In a CMS area (like this documentation), you just want to write HTML. You *need* vertical rhythm. You want the `h2` to have `margin-top` and the `p` to have `margin-bottom`.

The Base module handles this dichotomy with the `.cs` (Content Spacing) class.

### Classes

| Class | Name | Behavior |
| :--- | :--- | :--- |
| `.cs` | **Content Spacing** | Surrounds a block of raw HTML content (like from WordPress). It **removes** default top/bottom margins from children (`p`, `h1-h6`, `ul`, `li`). |
| `.csc` | **Content Spacing Child** | A helper to re-apply spacing if it was lost in a nested context, or to adjust spacing for specific nested elements. |
| `.cnt` | **Contents** | `display: contents` utility to remove a wrapper from the accessibility tree/layout. |

### Usage Examples

#### Template Content
Without `.cs`, in browser, WordPress and most CMSes all paragraphs and headings would have default margin (framework default). Adding `.cs` gives design elements zero margin, and padding so we can style them exactly how we want. We can use `.csc` to reapply spacing if it was lost in a nested context, or to adjust spacing for specific nested elements.
```html
<!-- App Mode -->
<article class="s cs">
  <header>
    <div class="col gap-s">
        <h1>My Story</h1>
        <p>Excerpt...</p>
    </div>
  </header>
<!-- Content Mode -->
  <div class="csc">
    <h2>Here we go</h2>
    <p>Paragraph one.</p>
    <ul>
       <li>List item</li>
    </ul>
    <p>Paragraph two.</p>
  </div>
</article>
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
