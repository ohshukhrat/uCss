# Typography Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Typography](./) 

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](./) | [Components](../components/) | [Utilities](../utilities/)

> **Fluid Typography**. A system where semantics (`h1`) and style (`.t`) are decoupled. Features smooth `clamp()`-based scaling for both Headings (`.t`) and Body Text (`.tx`), covering a massive range (from `xxl` down to `xxs+`) to ensure perfect readability on every device.

---

## 📑 Page Contents
*   [Installation](#-installation)
*   [Title (`.t`)](#1-title-t)
*   [Text (`.tx`)](#2-text-tx)
*   [Text Align (`.ta`)](#3-text-align-ta)

---

## Typography Module

The **Typography Module** provides a comprehensive, responsive type system. It separates "semantic HTML tags" from "visual styles", allowing any element to look like a heading or body text. It relies heavily on **fluid typography** (`clamp()`) to ensure text scales perfectly from mobile to ultra-wide displays without requiring a dozen breakpoints.

### Philosophy: Semantic Decoupling
In traditional CSS, `<h1>` means "Big Text". In uCss, `<h1>` means "Top Level Heading".
*   **The visual style** is controlled by the `.t` (Title) class.
*   **The semantics** are controlled by the HTML tag.
This means you can have a visually small `<h1>` (for a minor page) or a visually huge `<p>` (for a marketing slogan) without hurting SEO or Accessibility.

### 🧠 Thinking in Typography
1.  **Clamp is King**: Stop writing `@media (min-width: 768px) { font-size: ... }`. Our variables use `clamp()`. They are small on mobile and big on desktop *automatically*.
2.  **Tag Agnosticism**: Never assume an `<h2>` has a size. An `<h2>` is just a semantic node. You must give it a `.t` class to give it a visual hierarchy.
3.  **Readability**: We default to `1.5` line-height for body text (`.tx`). Don't tight-pack text unless it's a headline (`.t`).

## 📦 Installation

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`typography`** | [src](https://ucss.unqa.dev/stable/lib/typography.css) • [clean](https://ucss.unqa.dev/stable/lib/typography.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography.css) • [clean](https://ucss.unqa.dev/latest/lib/typography.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography.min.css) |

### Individual Files

| File | Description | Stable | Latest |
| :--- | :--- | :--- | :--- |
| `title.css` | Headings (`.t`) | [src](https://ucss.unqa.dev/stable/lib/typography/title.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/title.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/title.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/title.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/title.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/title.min.css) |
| `text.css` | Body Text (`.tx`) | [src](https://ucss.unqa.dev/stable/lib/typography/text.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/text.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/text.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/text.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/text.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/text.min.css) |
| `text-align.css` | Alignment (`.ta`) | [src](https://ucss.unqa.dev/stable/lib/typography/text-align.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/text-align.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/text-align.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/text-align.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/text-align.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/text-align.min.css) |


> [!TIP]
> **Encapsulation**: uCss supports automatic prefixing (e.g., `.u-btn`). See [Encapsulation & Prefixing](../../../README.md#encapsulation--prefixing-new) for build instructions.

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`typography`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/typography.min.css">` |
| `title.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/typography/title.min.css">` |
| `text.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/typography/text.min.css">` |
| `text-align.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/typography/text-align.min.css">` |

---

## 1. Title (`.t`)
Structural headings and display text.

### Features
*   **Fluid Scaling**: All sizes use `clamp()` logic. A `.t` heading is smaller on mobile and automatically grows on desktop.
*   **Tag Agnostic**: Use `.t` on `<div>`, `<span>`, or `p` to give them heading styling without affecting SEO semantics.
*   **Smart Defaults**: Default weight is **800** (Extra Bold) for strong visual hierarchy.

### The Mathematics of Clamp
We use `clamp(min, val, max)` to generate fluid sizes.
*   **Min**: The size on a narrow mobile phone (e.g., `2.5rem` for Medium).
*   **Max**: The size on a wide desktop monitor (e.g., `3.5rem`).
*   **Val**: A calculated slope (e.g., `1.5vh + 1rem`) that scales linearly between them.
This removes the "step effect" where font size jumps suddenly at a breakpoint. It is always the perfect size for the container width.

### Sizes

| Size | Class | Clamp Logic (Mobile -> Desktop) |
| :--- | :--- | :--- |
| **xxxl** | `.t.xxxl`, `.t--3xl` | `3.5rem` → `5rem` |
| **xxl** | `.t.xxl`, `.t--2xl` | `3.25rem` → `4.5rem` |
| **xl** | `.t.xl` | `3rem` → `4rem` |
| **l** | `.t.l` | `2.75rem` → `3.75rem` |
| **m** | `.t.m` (Default) | `2.5rem` → `3.5rem` |
| **s** | `.t.s` | `2.25rem` → `3rem` |
| **xs** | `.t.xs` | `2rem` → `2.5rem` |
| **xxs** | `.t.xxs`, `.t--2xs` | `1.75rem` → `2.25rem` |
| **xxxs** | `.t.xxxs`, `.t--3xs` | `1.5rem` → `2rem` |

### Weights & Styles

| Class | Appearance | Weight |
| :--- | :--- | :--- |
| `.ub`, `.hl` | Ultra-Bold (Headline) | 900 |
| `.xb` | Extra-Bold | 800 |
| `.bd` | Bold | 700 |
| `.sb` | Semi-Bold | 600 |
| `.md` | Medium | 500 |
| `.rg` | Regular | 400 |
| `.lt` | Light | 300 |
| `.up` | UPPERCASE | - |

### Usage Examples

#### Standard H1
```html
<!-- Uses default Medium size (2.5rem-3.5rem) and 800 weight -->
<h1 class="t">Page Title</h1>
```

#### Hero Section Display
```html
<!-- Massive 3.5rem-5rem text, uppercase, 900 weight -->
<h1 class="t xxxl hl">
  We Build the Future
</h1>
```

#### Semantic Decoupling
Styling a visual "heading" that is semantically just a subtitle.
```html
<h2 class="t l">Our Benefits</h2>
<!-- Looks like a heading (h3 size), but is a paragraph -->
<p class="t s lt">Why choose us?</p>
```

---

## 2. Text (`.tx`)
Body copy, captions, and standard reading text.

### Features
*   **Readability First**: Default line-height is `1.5` and weight is `400`.
*   **Separate Scale**: The `.tx` size scale is much smaller and granular than `.t`, designed for long-form reading.

### Sizes

| Suffix | Class | Clamp Logic (Mobile -> Desktop) |
| :--- | :--- | :--- |
| **xxl** | `.tx.xxl`, `.tx--2xl` | `1.5rem` → `1.75rem` |
| **xl** | `.tx.xl` | `1.375rem` → `1.5rem` |
| **l** | `.tx.l` | `1.25rem` → `1.375rem` |
| **m** | `.tx.m` (Default) | `1.125rem` → `1.25rem` |
| **s** | `.tx.s` | `1rem` → `1.125rem` |
| **xs** | `.tx.xs` | `0.875rem` → `1rem` |
| **xxs** | `.tx.xxs` | `0.75rem` → `0.875rem` |
| **xxxs** | `.tx.xxxs` | `0.625rem` → `0.75rem` |

### Weights
Supports the same weights as specificed in **Title** (`.bd`, `.sb`, `.md`, `.rg`, `.lt`).

### Usage Examples

#### Long Form Article
```html
<article>
  <!-- Lead paragraph: Larger size -->
  <p class="tx l">
    This is an introduction paragraph that needs more emphasis.
  </p>
  
  <!-- Standard body text -->
  <p class="tx">
     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </p>
  
  <!-- Small metadata -->
  <span class="tx xs lt">Posted on Dec 7th</span>
</article>
```

---

## 3. Text Align (`.ta`)
Responsive text alignment utilities using container queries.

### Class Reference

| Class | Property | Value |
| :--- | :--- | :--- |
| `.ta-s` | `text-align` | `start` (Left in LTR) |
| `.ta-c` | `text-align` | `center` |
| `.ta-e` | `text-align` | `end` (Right in LTR) |

### Responsive Modifiers
All alignment classes support `--sm`, `--md`, and `--lg` suffixes to apply styles only at specific container widths.

*   `--sm`: Small containers (< 670px)
*   `--md`: Medium containers (670px - 1000px)
*   `--lg`: Large containers (> 1000px)

### Usage Examples

#### Responsive Card
Text is centered on mobile (default), but left-aligned on desktop (`.ta-s--lg`).
```html
<div class="card ta-c ta-s--lg">
  <h2 class="t m">Feature Name</h2>
  <p class="tx">Description text explaining the feature.</p>
</div>
```

#### Toolbar
Right-aligned actions on desktop, centered on mobile.
```html
<div class="toolbar ta-c ta-e--md">
    <button>Settings</button>
    <button>Logout</button>
</div>
```
