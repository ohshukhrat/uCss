# [uCss](../../) / [Modules](../) / [Base](./)

**Documentation**: [Get Started](../../) | [Modules](../) | [Config](../config/) | [Base](./) | [Layout](../layout/) | [Typography](../typography/) | [Components](../components/) | [Theming](../theming/) | [Utilities](../utilities/)

---

## 📑 Page Contents
*   [Installation](#-installation)
*   [Content Spacing (`.cs` / `.csc`)](#1-content-spacing-cs--csc)
*   [Clear List (`.cl`)](#2-clear-list-cl)

---

## Base Module

The **Base Module** provides the foundational resets and normalizations. Unlike aggressive resets that strip everything (like traditional Eric Meyer resets), this module is surgical—it normalizes behavior while offering tools to manage "Content vs. App" spacing logic.

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
One of the hardest parts of CSS is managing margins on typography.
*   **App Mode**: In a web app/UI, you usually want `margin: 0` on everything (`h1`, `p`, etc) so you can control spacing explicitly with utility classes.
*   **Content Mode**: In a blog post or CMS content, you want default vertical rhythm between paragraphs and lists.

The Base module handles this with the `.cs` (Content Spacing) class.

### Classes

| Class | Name | Behavior |
| :--- | :--- | :--- |
| `.cs` | **Content Spacing** | Surrounds a block of raw HTML content (like from WordPress). It **adds** default top/bottom margins to children (`p`, `h1-h6`, `ul`, `li`). |
| `.csc` | **Content Spacing Child** | A helper to re-apply spacing spacing if it was lost in a nested context, or to adjust spacing for specific nested elements. |
| `.cnt` | **Contents** | `display: contents` utility to remove a wrapper from the accessibility tree/layout. |

### Usage Examples

#### Template Content
Without `.cs`, in WordPress all paragraphs and headings would have default margin (framework default). Adding `.cs` gives design elements zero margin, and padding so we can style them exactly how we want. We can use `.csc` to reapply spacing if it was lost in a nested context, or to adjust spacing for specific nested elements.
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
