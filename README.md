# uCss: The Container-First CSS Framework

**Navigation**: [uCss](./) > [Source](./src/) > [Modules](./src/lib/)

**Modules**: [Config](./src/lib/config/) | [Base](./src/lib/base/) | [Layout](./src/lib/layout/) | [Theming](./src/lib/theming/) | [Typography](./src/lib/typography/) | [Patterns](./src/lib/patterns/) | [Utilities](./src/lib/utilities/)

> **The logical evolution of CSS**. uCss is a modern, 15KB lightweight framework designed to solve exactly one problem: **Component Portability**. It leverages **Container Queries** and **CSS Variables** to create resilient UI components that adapt to their *context*, not just the screen size. No build step required.

---

## 📑 Contents

*   [🌟 Overview](#-overview)
    *   [The "Un-Framework" Concept](#the-un-framework-concept)
    *   [Top Features](#top-features)
*   [🤯 Philosophy: The 4 Pillars](#-philosophy-the-4-pillars)
    *   [1. Context is King](#1-context-is-king-container--media)
    *   [2. Variables are the API](#2-variables-are-the-api)
    *   [3. Implicit by Default](#3-implicit-by-default)
    *   [4. Composition over Inheritance](#4-composition-over-inheritance)
*   [🚀 Getting Started](#-getting-started)
    *   [The "Clicked" Moment](#the-clicked-moment)
    *   [A 5-Minute Tutorial](#a-5-minute-tutorial)
*   [📦 Installation & Files Stats](#-installation--files-stats)
    *   [Stats Table](#stats-table)
    *   [Direct Links](#direct-links-table)
    *   [HTML Snippets](#html-snippets)
*   [📂 Full Files Reference](#-full-files-reference)
*   [🧠 Deep Dive](#-deep-dive)
    *   [Logic & Architecture: The 7 Layers](#logic--architecture-the-7-layers)
    *   [Under the Hood: How it Works](#under-the-hood-how-it-works)
    *   [Naming Convention: The "Smart BEM"](#naming-convention-the-smart-bem)
*   [📍 Reference](#-reference)
    *   [Comparison Matrix: uCss vs The World](#comparison-matrix-ucss-vs-the-world)
    *   [The Glossary](#the-glossary)
*   [💡 Best Practices & Customization](#-best-practices--customization)
    *   [Anti-Patterns (What NOT to do)](#anti-patterns-what-not-to-do)
    *   [Migration Guide](#migration-guide)
    *   [A Day in the Life](#a-day-in-the-life-developer-story)
*   [🔧 For Developers](#-for-developers)
    *   [Contribution](#contribution)
    *   [Build System](#build-system)

---

## 🌟 Overview

**uCss** is not just another CSS framework. It is a reaction to the last decade of web development.

We went from **Semantic CSS** (Zen Garden) to **Bootstrap** (Component Monoliths) to **Tailwind** (Utility Soup).
uCss represents the next step: **Context-Aware Semantics**.

It is a modern, mobile-first, **pure CSS framework** designed for granular control, responsiveness, and flexibility. It leverages **CSS Variables** and **Container Queries** to provide a highly adaptable styling API without the need for complex build steps, JavaScript runtimes, or utility-class bloat.

### The "Un-Framework" Concept
Most frameworks try to do too much. They ship with accordions, carousels, date-pickers, and massive JavaScript blobs.
uCss strips it all back.
*   **No JavaScript**: We don't touch your DOM.
*   **No Build Step**: Works raw in the browser.
*   **No Opinionated UI**: We give you the "Organs" (Cards, Buttons, Inputs), you build the "Body".

### Top Features

1.  **Container Queries Core**: Components respond to their *container's width*, not the viewport. A card looks perfect whether it's in a sidebar or the main content area.
2.  **Variable-First API**: Modify a single CSS variable (e.g., `--p: blue`) and watch it cascade through specific scopes or the entire application instantly.
3.  **Zero Build Step**: No `npm install`, no `PostCSS` config mess. Just a `<link>` tag and you are production-ready.
4.  **Semantic & Accessible**: Encourages standard HTML tags (`<nav>`, `<button>`) enhanced by classes, rather than `div` soup.
5.  **Smart Flow Engine**: Our `html.css` module handles vertical rhythm automatically using `* + *` selectors, so you stop writing `margin-bottom` everywhere.
6.  **Themeable & Scoped**: Apply dark mode (`.set.dark`) or brand themes to any section of your page, and nested components adapt automatically.

> [!LIGHTBULB]
> **Who is this for?**
> Developers who are tired of "Utility Soup" (Tailwind) but find BEM too verbose. uCss sits in the "Goldilocks Zone": Semantic components with utility-power when you need it.

---

## 🤯 Philosophy: The 4 Pillars

uCss is built on four unshakable pillars. Understanding these is the key to unlocking the framework's power.

### 1. Context is King (Container > Media)
Stop thinking about "Mobile Screen" vs "Desktop Screen". Think about **Available Space**.
*   **The Old Way**: "At 768px screen width, make this card horizontal."
*   **The uCss Way**: "If this card has > 600px of space, make it horizontal."

This helps component portability. You can drop the *same* card component into a narrow sidebar or a wide main area, and it fits perfectly in both. You don't write overrides for the sidebar; the component effectively "self-heals" based on its container.

### 2. Variables are the API
If you find yourself writing `!important` or complex CSS selectors to override a color, you are fighting the framework.
*   **The Wrong Way**: `.my-card h3 { color: red; }`
*   **The Right Way**: `.my-card { --t: red; }`

uCss components are "listening" for variables. If you change the signal (`--t` for title color), the component updates itself. This is how theming (`.set.dark`) works—it just changes the signals.

### 3. Implicit by Default
We believe the browser is smarter than you.
*   **Explicit**: `grid-template-columns: 1fr 1fr 1fr;` (You assume 3 columns fits).
*   **Implicit**: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));` (You let the browser decide).

uCss layouts (`.g`) are implicit. They define the *constraints* (min-width, gap) and let the browser calculate the optimal number of columns. This makes your layouts unbreakable.

### 4. Composition over Inheritance
We don't provide a "Profile Card" component. We provide primitives (`Card Shell`, `Media Wrapper`, `Flexbox`, `Radius`) that you compose.
*   **Don't Search**: "Do they have a horizontal profile card class?"
*   **Do Build**: `<article class="crd f row ai-c gap-m">`
    *   `.crd`: The box.
    *   `.f.row`: The layout.
    *   `.ai-c`: The alignment.
    *   `.gap-m`: The spacing.
You are constructing UI from atoms. This reduces the need to maintain thousands of specific component names.

### 5. Semantics ≠ Visuals (Decoupling)
In standard CSS, `<h1>` usually means "Big Text". In uCss, `<h1>` means "Top Level Heading". The two are unrelated.
*   **HTML controls Meaning**: Use `<button>`, `<nav>`, `<h1>` for accessibility and SEO.
*   **Classes control Look**: Use `.btn`, `.f`, `.t` for style.
This allows you to have a marketing tagline that looks like a massive headline (`<p class="t xxxl">`) without ruining your document outline, or a sidebar heading that is semantically important but visually tiny (`<h2 class="t xxs">`).

### 6. Responsive Suffixes
Every class in this module supports standard suffix modifiers.
*   `--sm`: Small container (Mobile) (0 <= 669.99px)
*   `--md`: Medium container (Tablet) (669.99px <= 999.99px)
*   `--lg`: Large container (Desktop) (999.99px <)

Example: `.dn--sm` -> `display: none` ONLY in small containers.

> [!CAUTION]
> **Container Query Gotcha**:
> Do not apply `@container` context to an element that is *itself* a grid item or part of a complex layout unless necessary. Setting `container-type` on a grid item can sometimes break implicit grid auto-sizing (`auto-fit`) because the container needs definite dimensions to resolve its queries.
>
> **Safety Mechanism**: The framework automatically skips container deployment on critical parents (like `.g`, `.sg`, `.sgc`) to prevent layout breakage.

---

## 🚀 Getting Started

### The "Clicked" Moment
It happens when you add `.set.dark` to a Section (`<section class="s set dark">`) and suddenly:
1.  The background turns dark.
2.  The text turns light.
3.  If you apply `.set.light` to the inner element, it reverts the inner element to light mode.
4.  Nested descendants inherit the theme.
All without writing a single line of CSS override. That is when it clicks: **This isn't CSS; this is a System.**

### A 5-Minute Tutorial

**Goal**: Build a Responsive Hero Section.

1.  **Paste the Link**:
    Add the CDN link to your `<head>`.
    
2.  **Create the Container**:
    ```html
    <section class="s">
       <!-- .s: Section Wrapper (Fluid Padding) -->
    </section>
    ```

3.  **Add the Grid**:
    ```html
    <div class="g g-2-1 gap-xl ai-c">
       <!-- .g: Grid -->
       <!-- .g-2-1: 66% Left, 33% Right -->
       <!-- .gap-xl: Big gap -->
       <!-- .ai-c: Vertically Center -->
    </div>
    ```

4.  **Add Content (Left)**:
    ```html
    <div class="f col gap-m">
       <h1 class="t xxl">Welcome to Future</h1>
       <p class="tx l">This is a lead text.</p>
       <div class="btns">
           <button class="btn primary lg">Get Started</button>
           <button class="btn outlined lg">Docs</button>
       </div>
    </div>
    ```

5.  **Add Image (Right)**:
    ```html
    <figure class="med rad-l">
       <img src="hero.jpg" alt="Hero">
    </figure>
    ```

**Result**: A fully responsive, dark-mode ready hero section in ~15 lines of HTML.

---

## 📦 Installation & Files Stats

We provide multiple bundles to suit your needs. From the "Full Framework" to specific "Micro-Modules".

### Stats Table

| File | Full (Raw) | Clean | Min | Gzip (Min) | Brotli (Min) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`u.css` (Complete)** | **166 KB** | **147 KB** | **123 KB** | **21 KB** | **16.5 KB** |
| `base.css` | 16 KB | 13 KB | 11 KB | 3.1 KB | 2.7 KB |
| `patterns.css` | 29 KB | 26 KB | 22 KB | 3.8 KB | 3.1 KB |
| `layout.css` | 71 KB | 68 KB | 56 KB | 7.0 KB | 5.1 KB |
| `theming.css` | 17 KB | 15 KB | 14 KB | 2.5 KB | 2.1 KB |
| `typography.css` | 16 KB | 12 KB | 10 KB | 1.8 KB | 1.5 KB |
| `utilities.css` | 15 KB | 11 KB | 10 KB | 1.7 KB | 1.4 KB |

> [!NOTE]
> **Clean vs Min**: `*.clean.css` has comments removed but keeps indentation (good for dev). `*.min.css` is compressed (production).

### Direct Links Table

| Module | Full Source | Clean Source | Minified (Prod) | Docs |
| :--- | :--- | :--- | :--- | :--- |
| **Full Framework** | [u.css](https://ucss.unqa.dev/stable/u.css) | [u.clean.css](https://ucss.unqa.dev/stable/u.clean.css) | [u.min.css](https://ucss.unqa.dev/stable/u.min.css) | [Root Docs](./) |
| **Base** | [base.css](https://ucss.unqa.dev/stable/lib/base.css) | [base.clean.css](https://ucss.unqa.dev/stable/lib/base.clean.css) | [base.min.css](https://ucss.unqa.dev/stable/lib/base.min.css) | [Docs](./src/lib/base/) |
| **Patterns** | [patterns.css](https://ucss.unqa.dev/stable/lib/patterns.css) | [patterns.clean.css](https://ucss.unqa.dev/stable/lib/patterns.clean.css) | [patterns.min.css](https://ucss.unqa.dev/stable/lib/patterns.min.css) | [Docs](./src/lib/patterns/) |
| **Layout** | [layout.css](https://ucss.unqa.dev/stable/lib/layout.css) | [layout.clean.css](https://ucss.unqa.dev/stable/lib/layout.clean.css) | [layout.min.css](https://ucss.unqa.dev/stable/lib/layout.min.css) | [Docs](./src/lib/layout/) |
| **Theming** | [theming.css](https://ucss.unqa.dev/stable/lib/theming.css) | [theming.clean.css](https://ucss.unqa.dev/stable/lib/theming.clean.css) | [theming.min.css](https://ucss.unqa.dev/stable/lib/theming.min.css) | [Docs](./src/lib/theming/) |
| **Typography** | [typography.css](https://ucss.unqa.dev/stable/lib/typography.css) | [typography.clean.css](https://ucss.unqa.dev/stable/lib/typography.clean.css) | [typography.min.css](https://ucss.unqa.dev/stable/lib/typography.min.css) | [Docs](./src/lib/typography/) |
| **Utilities** | [utilities.css](https://ucss.unqa.dev/stable/lib/utilities.css) | [utilities.clean.css](https://ucss.unqa.dev/stable/lib/utilities.clean.css) | [utilities.min.css](https://ucss.unqa.dev/stable/lib/utilities.min.css) | [Docs](./src/lib/utilities/) |

### HTML Snippets

#### 1. Standard (Recommended)
This uses the standard namespace. Drop this in your `<head>`.

```html
<!-- Recommended: Full Framework -->
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/u.min.css">

<!-- Optional: Our Pre-configured Variables set (Load this BEFORE u.min.css if possible) -->
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config/root.css">
```

#### 2. Prefixed `/p/` (Collision Safe)
Useful if you are mixing uCss with another framework (like Bootstrap or Tailwind). All classes are prefixed with `.u-` (e.g., `.u-btn`, `.u-g`) and variables with `--u-`.

```html
<!-- Prefixed Version -->
<link rel="stylesheet" href="https://ucss.unqa.dev/p/u.min.css">
```

#### 3. Variable-Safe `/v/` (Vars Prefix Only)
Classes remain standard (`.btn`, `.g`), but CSS Variables are namespaced (`--u-p`, `--u-gap`). Good if you have variable name conflicts but want clean HTML.

```html
<!-- Vars-Prefix Version -->
<link rel="stylesheet" href="https://ucss.unqa.dev/v/u.min.css">
```

---

## 📦 Advanced Usage

### 1. Installation (NPM)
You can install uCss via npm for use in build systems or JavaScript projects.

```bash
npm install @unqa/ucss
```

**Usage in CSS:**
```css
/* Imports the full stable framework */
@import '@unqa/ucss';

/* Or import specific modules */
@import '@unqa/ucss/base';
@import '@unqa/ucss/layout';
@import '@unqa/ucss/components';
```

**Usage in JavaScript/Bundlers (Vite, Webpack, etc):**
```javascript
import '@unqa/ucss'; // Imports dist/stable/u.min.css
```

### 2. Modular Imports
If you don't need the full framework, you can import specific modules. See the **Documentation** section below for direct links to every module.

### 3. Manual / Local Installation
1.  Clone the repository or download the `dist` folder.
2.  Copy `lib/config/root.css` to your project and update with your colors/fonts.
3.  Import `u.min.css` or specific modules from `dist/lib/` locally.

> [!TIP]
> **Server Configuration**:
> If you are hosting uCss yourself, we provide an optimized `.htaccess` template in the `dist/` folder. This ensures your server serves the pre-compressed `.gz` (Gzip) and `.br` (Brotli) files with the correct headers for maximum performance.

---

## 🎨 Configuration (Optional)
uCss is built to work out-of-the-box. Every component has a "graceful fallback".
*   **Default Behavior**: If you don't define any variables, uCss uses its internal defaults (e.g., sensible greys, system fonts).
*   **Customization**: You *can* include `config.css` or `root.css` (found in `https://ucss.unqa.dev/stable/lib/config/root.css`) to override these defaults globally. This file is **not required**, but it is the recommended way to manage your design tokens.

**Example `root.css`:**

```css
:root {
  /**
   * @group Theming: Palette
   */
  --p:  hsl(43 83% 62%);  /* Primary */
  --a:  hsl(44 100% 50%); /* Accent */
  
  /**
   * @group Theming: Backgrounds
   */
  --bg:  hsl(0 0% 96%);   /* Main Background */
  --srf: hsl(0 0% 92%);   /* Surface (Cards) */

  /**
   * @group Configuration: Animation
   */
  --trans-d: 0.32s;

  /**
   * @group Typography: Headings (title.css)
   */
  --t-fs--m: clamp(2.5rem, 1.53vw + 2.194rem, 3.5rem);

  /**
   * @group Typography: Body (text.css)
   */
  --tx-fs--m: clamp(1.125rem, 0.191vw + 1.087rem, 1.25rem);
  
  /**
   * @group Layout: Section
   */
  --sc-max-w: 1366px; /* Scaffold Max Width */
  --s-gap: clamp(2rem, 3.059vw + 1.388rem, 4rem);


  /**
   * @group Components: Button (button.css)
   */
   --btn-fs: 1.125rem;
   --btn-rad: 4em;
}
```

> [!IMPORTANT]
> **Variable Inheritance & BEM Strategy**
> Since uCss relies heavily on CSS variables, **values cascade down to children**.
> *   **The Risk**: If you set `--btn-bg: blue` on a parent, *every* button inside that parent will inherit blue unless explicitly overridden.
> *   **The Solution**: Use **BEM** (Block Element Modifier). Create a specific class for your component and scope your variable overrides within that class.

```css
/* Recommended Approach: Component Context */
.my-card {
  --btn-bg: #333; /* Local override */
  
  &__submit-btn {
    --btn-bg: var(--p); /* Targeted override */
  }
}
```

---


## 📂 Modules Reference

Detailed breakdown of every file in the framework.

| Module | File | Description |
| :--- | :--- | :--- |
| **Base** | `html.css` | **Smart Flow Engine**. The heart of vertical rhythm. Handles spacing recursively. |
| **Base** | `reset.css` | Aggressive normalization of default browser styles. |
| **Base** | `content.css` | Controller for "Content Mode" (`.csc`) vs "App Mode" (`.cs`). |
| **Patterns** | `media.css` | Media wrappers (`figure`) ensuring responsive images/video. |
| **Patterns** | `link.css` | Turns current container into clickable are with focus state using first `<a>` tag. |
| **Patterns** | `button.css` | Feature-rich buttons with loading states, sizes, and skins. |
| **Patterns** | `card.css` | Layout-agnostic cards that adapt to their container grid. |
| **Layout** | `grid.css` | **Auto-Responsive Grid**. No media queries needed. Uses `auto-fit` & `minmax`. |
| **Layout** | `section.css` | Root structural elements. Handles max-widths and edge padding. |
| **Layout** | `flex.css` | Flexbox utilities with gap support (`.f.row`, `.f.col`). |
| **Theming** | `set.css` | Contextual themes (`.set.dark`). Changes semantic variables for children. |
| **Theming** | `overlay.css` | Absolute positioned overlays for modals, cards, etc. |
| **Typography** | `title.css` | Heading styles (`.t`) decoupled from tags (`h1`-`h6`). |
| **Typography** | `text.css` | Body text styles (`.tx`) for paragraphs and spans. |
| **Utilities** | `margin.css` | `.mg` classes. Logical properties (`mgb` = margin-bottom). |
| **Utilities** | `padding.css` | `.pd` classes. Fluid clamp-based padding. |
| **Utilities** | `radius.css` | Border radius utilities (`.rad`). |

> [!INFO]
> You can mix and match these files locally. For example, if you just want the **Grid** system, you can pull `grid.css` and use it standalone!

---

## 🧠 Deep Dive

### Logic & Architecture: The 7 Layers

uCss follows a **7-Layer Architecture** (Config -> Base -> Layout -> Theming -> Typography -> Patterns -> Utilities). This is known as the "Onion Model".

1.  **Config**: The "Brain". Pure variables. No CSS output. Defines the DNA (Colors, Spacing, Typography scales).
2.  **Base**: The "Foundation". HTML tag resets. Sets up the "Smart Flow" environment where elements space themselves automatically.
3.  **Layout**: The "Skeleton". Macro structures (`.s`, `.g`). Covers the page structure and large grid systems.
4.  **Theming**: The "Skin". Contextual colors and modes. Handles light/dark switching and brand themes.
5.  **Typography**: The "Voice". Fluid text. Decouples semantics from visuals.
6.  **Patterns**: The "Organs". Complex CSS components (`.btn`, `.crd`). These are the reusable UI bits.
7.  **Utilities**: The "Tools". Micro-adjustments. High specificity overrides for when you need a "little more margin".

### Under the Hood: How it Works

uCss creates a **Reactive Style Graph** in the browser.
Most frameworks are static maps: Class X = Property Y.
uCss is a dynamic graph: Variable X -> Calculation Y -> Property Z.

**Example**: Spacing.
`--g-gap` is not `20px`. It is `clamp(1rem, 5vw, 2rem)`.
When you use `.gap`, it references this variable.
Therefore, *all* gaps in your application breathe with the viewport.

### Naming Convention: The "Smart BEM"

We use a compressed, logical BEM-like syntax.
BEM (Block Element Modifier) is great but verbose (`.block__element--modifier`).
uCss compresses this:

*   **Block**: `.crd` (Card), `.btn` (Button). *ALWAYS* 3-4 letters.
*   **Element**: `.crd__header` (Double underscore). Standard BEM.
*   **Modifier**: `.btn.primary` (Chained class). *Or* `--primary`.
    *   *Why use Chained?* Because it increases specificity slightly (good for overrides) and reads naturally (`btn primary`).
*   **Helpers**: `.ta-c` (Text Align Center), `.ai-c` (Align Items Center). Two letters, hyphen, value.

---

## 📍 Reference

### Comparison Matrix: uCss vs The World

| Feature | **uCss** | Tailwind CSS | Bootstrap |
| :--- | :--- | :--- | :--- |
| **Paradigm** | Context-First (Hybrid) | Utility-First | Component-First |
| **Build Step** | Optional (Zero) | Required (PostCSS) | Optional (Sass) |
| **Responsiveness** | **Container Queries** | Media Queries | Media Queries |
| **Class Strategy** | Semantic + Utility | Utility Soup | Semantic Classes |
| **Logic** | CSS Variables | Compiler Logic | Sass Logic |
| **Bundle Size** | 21KB (Gzip) / 16.5KB (Brotli) | ~5KB (Gzip, Purged) | ~20KB (Gzip) |
| **Dark Mode** | `.set.dark` (Scopeable) | `dark:` (Global) | Data Attributes |
| **HTML Cleanliness** | ⭐⭐⭐⭐⭐ (Clean) | ⭐ (Class Soup) | ⭐⭐⭐ (Moderate) |

### The Glossary

*   **Smart Flow**: The system (`* + *`) that adds top margins to elements to create vertical rhythm.
*   **Set**: A group of variables (Theme) applied to a scope.
*   **Pattern**: A reusable component structure (Card, Button).
*   **Utility**: A single-purpose class (Margin, Padding).

---

## 💡 Best Practices & Customization

### Anti-Patterns (What NOT to do)

1.  **Don't build everything with Utilities**.
    *   *Bad*: `<div class="p-m rad-m shadow-m flex row...">`
    *   *Good*: `<article class="crd">`
    *   *Why?* You lose the ability to update all cards at once.

2.  **Don't hardcode pixel values**.
    *   *Bad*: `width: 640px`
    *   *Good*: `width: 40rem` or `.s_cn`
    *   *Why?* Pixels don't scale with user font settings (Accessibility).

3.  **Don't fight the Cascade**.
    *   *Bad*: `.btn { color: red !important }`
    *   *Good*: `.btn { --btn-c: red }`
    *   *Why?* `!important` breaks the theming engine.

### Migration Guide

**From Bootstrap**:
*   Replace `.container` with `.s`.
*   Replace `.row` / `.col-md-6` with `.g` / `.g-2`.
*   Replace `.btn-primary` with `.btn.primary`.

**From Tailwind**:
*   Stop writing `hover:bg-blue-500`. Start using `.btn` which handles states.
*   Stop writing `w-1/2 md:w-1/3`. Start using `.g` which fits content auto-magically.

## 📚 Detailed Documentatio

### 1. Base
Core resets and normalizers.

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`base`** | [src](https://ucss.unqa.dev/stable/lib/base.css) • [clean](https://ucss.unqa.dev/stable/lib/base.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base.min.css) | [src](https://ucss.unqa.dev/latest/lib/base.css) • [clean](https://ucss.unqa.dev/latest/lib/base.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base.min.css) | 2.1KB / 1.3KB / 0.9KB / 0.3KB / 0.3KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`base`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/base.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `html.css` | [src](https://ucss.unqa.dev/stable/lib/base/html.css) • [clean](https://ucss.unqa.dev/stable/lib/base/html.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base/html.min.css) | [src](https://ucss.unqa.dev/latest/lib/base/html.css) • [clean](https://ucss.unqa.dev/latest/lib/base/html.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base/html.min.css) | 8KB / 6KB / 4KB / 1KB / 1KB | **Smart Flow Engine**. Global Reset + Smart vertical rhythm using `* + *` logic. |

---

### 2. Layout
Structural components for page building.

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`layout`** | [src](https://ucss.unqa.dev/stable/lib/layout.css) • [clean](https://ucss.unqa.dev/stable/lib/layout.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout.css) • [clean](https://ucss.unqa.dev/latest/lib/layout.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout.min.css) | 69KB / 65KB / 55KB / 6.9KB / 5.0KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`layout`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `section.css` | [src](https://ucss.unqa.dev/stable/lib/layout/section.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/section.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/section.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/section.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/section.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/section.min.css) | 7.8KB / 6.7KB / 5.9KB / 1.3KB / 1.1KB | Root sections (`.s`) |
| `grid.css` | [src](https://ucss.unqa.dev/stable/lib/layout/grid.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/grid.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/grid.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/grid.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/grid.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/grid.min.css) | 35KB / 34KB / 29KB / 3.7KB / 2.7KB | CSS Grid system (`.g`) |
| `flex.css` | [src](https://ucss.unqa.dev/stable/lib/layout/flex.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/flex.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/flex.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/flex.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/flex.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/flex.min.css) | 26KB / 24KB / 21KB / 2.4KB / 1.9KB | Flexbox utilities (`.f`) |

#### **Section (`.s`)**
The root structural component for page sections, offering intelligent max-width constraints and padding.
*   **Structure**: `.s` (Outer Wrapper) -> `.sc` (Constraint Wrapper) -> `.scc` (Content Item).
    *   *Note*: Direct children of `.s` are automatically treated as `.sc` if standard semantic tags aren't used, same for `.sc` - it treats its direct children as `.scc`.
*   **Padding**: `--s-pb` controls vertical padding with fluid `clamp()` values. Use `.pb--s` or `.pb--xs` for tighter spacing; `--s-pi` controls horizontal padding with defaults set to 5%. 
*   **Content Widths**:
    *   `.s > *` defaults to 1366px for max-width of inner section container with 5% padding on each side.
    *   `.s__c` (Content: 48rem), `.s__cw` (Content Wide: 56rem).
    *   `.s__h` (Header: 64rem), `.s__hw` (Header Wide: 72rem).
    *   `.s__f` (Full Width), `.s__cn` (Narrow: 40rem).
    *   `.s__w` (Wide: 1440px), `.s__xw` (Extra Wide: 1600px), `.s__uw` (Ultra Wide: 1920px).
*   **Backgrounds**: `--s-bg` handles section background color.

```html
<section class="s set primary">
  <!-- Constrained Content -->
  <div class="s_c ta-c">
     <h2>Header</h2>
  </div>
</section>
```

#### **Grid (`.g`)**
A robust, auto-responsive grid system powered by `display: grid`.
*   **Auto-Fit by Default**: `.g` uses `repeat(auto-fit, minmax(var(--g-min), 1fr))` to naturally flow items.
*   **Smart Clamps**: Gaps use `clamp()` logic to scale from mobile to desktop automatically.
*   **Subgrid Support**: Use `.sg` (Row Subgrid) or `.sgc` (Column Subgrid) to align nested children to the parent grid tracks.
*   **Properties**:
    *   `--g-cols`: Force fixed columns (e.g., `3`). Overrides auto-fit.
    *   `--g-min`: Minimum item width for auto-fit (default `256px`).
    *   `--g-gap`: Grid gap.
    *   `--g-rows-template`, `--g-cols-template`: Full template control.
*   **Responsive Modifiers**: Suffixes `--sm`, `--md`, `--lg` apply to almost all properties (e.g., `--g-cols--md`).
*   **Item Control**:
    *   `--gi-col`, `--gi-row`: Span control (e.g., `span 2`).
    *   `--gi-as`, `--gi-js`: Alignment/Justification self.

```html
<!-- Responsive auto-fit grid with 300px min items -->
<div class="g" style="--g-min: 300px"> ... </div>

<!-- Fixed 12-col grid for complex layouts -->
<div class="g" style="--g-cols: 12; --g-gap: 2rem">
  <div style="--gi-col: span 8">Main</div>
  <div style="--gi-col: span 4">Sidebar</div>
</div>
```

#### **Flex (`.f` / `.col` / `.row`)**
Flexible box layout with gap intelligence.
*   **Direction**: `.row` (default, can be used for explicit nested child flex-direction reset), `.col` (column).
*   **Gap with Clamps**: `--f-gap` scales responsively.
*   **Wrapping**: `.wrap`, `.nowrap`.
*   **Alignment Helpers**:
    *   `.ai-c` (align-items: center), `.jc-sb` (justify-content: space-between), `.jc-c` (center).
*   **Child Props**:
    *   `--fc-grow`, `--fc-shrink`, `--fc-basis`: Standard flex controls.
    *   `.mi-a` (margin-inline: auto) for pushing items (like `margin-left: auto`).
*   **Responsive**: Suffixes supported (e.g., `.col--md` switches to column on medium screens).

---

### 3. Typography
Title, text, and alignment.

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`typography`** | [src](https://ucss.unqa.dev/stable/lib/typography.css) • [clean](https://ucss.unqa.dev/stable/lib/typography.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography.css) • [clean](https://ucss.unqa.dev/latest/lib/typography.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography.min.css) | 15KB / 10KB / 8.4KB / 1.6KB / 1.3KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`typography`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/typography.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title.css` | [src](https://ucss.unqa.dev/stable/lib/typography/title.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/title.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/title.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/title.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/title.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/title.min.css) | 6.1KB / 4.2KB / 3.4KB / 0.8KB / 0.7KB | Title (`.t`) |
| `text.css` | [src](https://ucss.unqa.dev/stable/lib/typography/text.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/text.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/text.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/text.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/text.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/text.min.css) | 6.4KB / 4.6KB / 3.8KB / 0.8KB / 0.7KB | Text (`.tx`) |
| `text-align.css` | [src](https://ucss.unqa.dev/stable/lib/typography/text-align.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/text-align.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/text-align.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/text-align.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/text-align.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/text-align.min.css) | 2.1KB / 1.4KB / 1.2KB / 0.3KB / 0.3KB | Text alignment utilities (`.ta`) |

#### **Title (`.t`)**
Semantic-agnostic typography customization.
*   **Usage**: Applied to `h1`-`h6` or any element meant to look like a heading / title.
*   **Auto-Scale**: Uses massive `clamp()` ranges to scale typography smoothly from mobile to desktop (e.g., `3.5rem` down to `2.5rem` for `.t--m`).
*   **Vars**:
    *   `--t-font-s / --t-fs`: Font size.
    *   `--t-font-w / --t-fw`: Font weight (800 default).
    *   `--t-line-h / --t-lh`: Line height.
*   **Classes**:
    *   Sizes: `.xxxl` ... `.xxxs`. (also `.t--xxxl` ... `.t--xxxs`)
    *   Weights: `.ub` (900), `.bd` (700), `.rg` (400), `.lt` (300).
    *   Line-Height: `.lh--s`, `.lh--xl`.
    *   Styles: `.up` (uppercase), `.hl` (Ultra-bold + Uppercase for Headlines).

#### **Text (`.tx`)**
Body text utilities with intelligent defaults.
*   **Usage**: Paragraphs, spans, labels.
*   **Smart Defaults**: `400` weight, `1.5` line-height, optimized for readability.
*   **Classes**: `.bd`, `.lt` (weights), `.up` (uppercase).
*   **Responsive**: `.tx--lg` (larger text on desktop).

#### **Text Align (`.ta`)**
Responsive text alignment.
*   **Classes**: `.ta-c` (center), `.ta-s` (start), `.ta-e` (end).
*   **Responsive**: `.ta-c--md` (center only on medium screens).

---

### 4. Patterns
UI Elements and interactive patterns.

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`patterns`** | [src](https://ucss.unqa.dev/stable/lib/patterns.css) • [clean](https://ucss.unqa.dev/stable/lib/patterns.clean.css) • [min](https://ucss.unqa.dev/stable/lib/patterns.min.css) | [src](https://ucss.unqa.dev/latest/lib/patterns.css) • [clean](https://ucss.unqa.dev/latest/lib/patterns.clean.css) • [min](https://ucss.unqa.dev/latest/lib/patterns.min.css) | 36KB / 32KB / 27KB / 4.8KB / 4.1KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`patterns`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/patterns.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `button.css` | [src](https://ucss.unqa.dev/stable/lib/patterns/button.css) • [clean](https://ucss.unqa.dev/stable/lib/patterns/button.clean.css) • [min](https://ucss.unqa.dev/stable/lib/patterns/button.min.css) | [src](https://ucss.unqa.dev/latest/lib/patterns/button.css) • [clean](https://ucss.unqa.dev/latest/lib/patterns/button.clean.css) • [min](https://ucss.unqa.dev/latest/lib/patterns/button.min.css) | 15KB / 13KB / 11KB / 2.3KB / 2.0KB | `.btn` |
| `card.css` | [src](https://ucss.unqa.dev/stable/lib/patterns/card.css) • [clean](https://ucss.unqa.dev/stable/lib/patterns/card.clean.css) • [min](https://ucss.unqa.dev/stable/lib/patterns/card.min.css) | [src](https://ucss.unqa.dev/latest/lib/patterns/card.css) • [clean](https://ucss.unqa.dev/latest/lib/patterns/card.clean.css) • [min](https://ucss.unqa.dev/latest/lib/patterns/card.min.css) | 17KB / 15KB / 13KB / 2.3KB / 2.0KB | `.crd` |
| `media.css` | [src](https://ucss.unqa.dev/stable/lib/patterns/media.css) • [clean](https://ucss.unqa.dev/stable/lib/patterns/media.clean.css) • [min](https://ucss.unqa.dev/stable/lib/patterns/media.min.css) | [src](https://ucss.unqa.dev/latest/lib/patterns/media.css) • [clean](https://ucss.unqa.dev/latest/lib/patterns/media.clean.css) • [min](https://ucss.unqa.dev/latest/lib/patterns/media.min.css) | 3.6KB / 3.0KB / 2.4KB / 0.7KB / 0.6KB | `.med` |
| `link.css` | [src](https://ucss.unqa.dev/stable/lib/patterns/link.css) • [clean](https://ucss.unqa.dev/stable/lib/patterns/link.clean.css) • [min](https://ucss.unqa.dev/stable/lib/patterns/link.min.css) | [src](https://ucss.unqa.dev/latest/lib/patterns/link.css) • [clean](https://ucss.unqa.dev/latest/lib/patterns/link.clean.css) • [min](https://ucss.unqa.dev/latest/lib/patterns/link.min.css) | 1.1KB / 0.6KB / 0.5KB / 0.3KB / 0.2KB | `.lnk` |

#### **Buttons (`.btn`)**
A complete button system with built-in states and variants.
*   **Base**: Flexbox-centered, cursor-pointer, no-wrap, auto-icon spacing.
*   **Variants**:
    *   `.primary`: Uses `--p` (primary) background.
    *   `.secondary`: Uses `--sp-lt` (light primary transparent) background.
    *   `.outlined`: Transparent background, current color border.
    *   `.plain`: No background/border, just hover effects.
*   **Sizes**: `.sm`, `.md` (default), `.lg`, `.xlg`, `.tiny`.
*   **States**: Handles `:hover`, `:focus-visible` (outline offset), `:active` (scale down), `:disabled`, `.is-loading`.
*   **Grouping**: `.btns` container automatically wraps and spaces buttons. Use `.btns.c` (center), `.btns.e` (end), or `.btns.f` (full width) to align multiple buttons.

#### **Cards (`.crd`)**
The ultimate composable container for nested layouts.
*   **Architecture**:
    *   **Shell (`.crd`)**: The structural wrapper. Handles background, border, shadow, and **padding**.
    *   **Media (`.crd__media`)**: Full-bleed media area (ignores padding).
    *   **Content (`.crd__content`)**: The padded inner wrapper for text/body.
*   **Container Query Powered**: A `.crd` could be configured to change its layout (`row` vs `column`) and padding based on *its* width, not the screen.
*   **Subgrid integration**: Use `.crd.sg` to opt-into subgrid. The card formatting context will respect the parent grid's rows/tracks.
*   **Slots**: `.crd__header`, `.crd__body`, `.crd__footer` for semantic spacing structure inside content.
*   **Interactive**: Ready properties to handle card transform applied on hover (`--crd-tf`).

#### **Media (`.med`)**
Responsive media wrapper (figure with img or video inside).
*   **Aspect Ratios**: `.ar-1` (Square), `.ar-16-9` (Video), `.ar-4-3`.
*   **Behavior**: Enforces `object-fit: cover` on images/videos inside.
*   **Radius**: `.med.rd` (circle), `.med.bd` (bold radius).
*   **Container Aware**: Sizing limits (`max-inline-size`) respond to parent context.

#### **Link Wrapper (`.lnk`)**
Clickable area expansion.
*   **Behavior**: Takes the first `<a>` tag inside it and expands its clickable area (using pseudo-elements) to cover the entire `.lnk` container.
*   **Use Case**: Making entire Cards or list items clickable without wrapping them in an `<a>` tag (which is invalid HTML for block content).

---

### 5. Theming
Themes, overlays, and contextual settings.

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`theming`** | [src](https://ucss.unqa.dev/stable/lib/theming.css) • [clean](https://ucss.unqa.dev/stable/lib/theming.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming.css) • [clean](https://ucss.unqa.dev/latest/lib/theming.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming.min.css) | 6.8KB / 5.2KB / 4.4KB / 1.0KB / 0.9KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`theming`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `set.css` | [src](https://ucss.unqa.dev/stable/lib/theming/set.css) • [clean](https://ucss.unqa.dev/stable/lib/theming/set.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming/set.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming/set.css) • [clean](https://ucss.unqa.dev/latest/lib/theming/set.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming/set.min.css) | 3.7KB / 2.9KB / 2.5KB / 0.5KB / 0.5KB | Contextual themes |
| `overlay.css` | [src](https://ucss.unqa.dev/stable/lib/theming/overlay.css) • [clean](https://ucss.unqa.dev/stable/lib/theming/overlay.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming/overlay.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming/overlay.css) • [clean](https://ucss.unqa.dev/latest/lib/theming/overlay.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming/overlay.min.css) | 3.1KB / 2.2KB / 1.9KB / 0.6KB / 0.5KB | Absolute overlays |

#### **Settings / Theme (`.set`)**
Contextual theming wrapper.
*   **Behavior**: Scopes colors and typography for a specific section (e.g., a dark sidebar).
*   **Classes**: `.set.dark` (dark bg, light text), `.set.primary` (brand bg).
*   **Auto-Adapt**: Automatically adjusts headings (`h1`-`h6`), links, and text colors inside.

#### **Overlay (`.o`)**
Absolute positioning overlays.
*   **Classes**: `.o.d` (dark color), `.o.l` (light color), `.o.lt` (lite .24 opacity), `.o.bd` (bold .64 opacity).
*   **Z-Index**: Manages stacking context automatically (`-1` to `-3` depending on depth).

---

### 6. Utilities
Helper classes for spacing and decoration.

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`utilities`** | [src](https://ucss.unqa.dev/stable/lib/utilities.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities.min.css) | 9.5KB / 6.4KB / 5.4KB / 0.9KB / 0.7KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`utilities`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/utilities.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `margin.css` | [src](https://ucss.unqa.dev/stable/lib/utilities/margin.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/margin.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/margin.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/margin.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/margin.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/margin.min.css) | 2.9KB / 2.0KB / 1.7KB / 0.3KB / 0.2KB | `.mg` |
| `padding.css` | [src](https://ucss.unqa.dev/stable/lib/utilities/padding.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/padding.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/padding.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/padding.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/padding.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/padding.min.css) | 4.8KB / 3.4KB / 2.8KB / 0.5KB / 0.4KB | `.pd` |
| `radius.css` | [src](https://ucss.unqa.dev/stable/lib/utilities/radius.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/radius.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/radius.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/radius.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/radius.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/radius.min.css) | 1.8KB / 1.1KB / 0.9KB / 0.3KB / 0.2KB | `.rad` |

#### **Margin (`.mg`)**
Responsive direction-aware spacing.
*   **Directions**:
    *   `.mgb` (Block Start/Top), `.mgbe` (Block End/Bottom).
    *   `.mgis` (Inline Start/Left), `.mgie` (Inline End/Right).
*   **Auto**: `.mg.auto`, `.mgis.auto` (useful for left-aligning items in flex rows).
*   **Responsive**: Suffixes `--sm`, `--md`, `--lg` allow changing margins based on container size.

#### **Padding (`.pd`)**
Responsive internal spacing with massive clamp ranges.
*   **Presets**:
    *   `.xxxl` (huge ~8rem spacing) down to `.xxs` (tiny).
    *   All presets use `clamp()` to shrink on mobile and grow on desktop automatically.
*   **Directions**: Same as margin (`.pdb`, `.pdi`, etc.).
*   **Fluidity**: Padding scales with the viewport width automatically, maintaining perfect "breathing room" at any device size.

#### **Radius (`.rad`)**
Border radius utilities.
*   **Vars**: `--rad` (base radius).
*   **Classes**: `.rad.sq` (square), `.rad.rd` (round/pill), `.rad.lg` (large).
*   **Directions**: `.rad-t` (top only), `.rad-bl` (bottom-left only).

---

## 🏛️ See it in Action
Below is real, semantic HTML example of a "Blog" section. Notice how we use `.s` for structure, `.g` for layout, and `.crd` for content, all controlled by CSS variables.

```html
<!-- Main Section: Section wrapper, Center content, Primary Theme -->
<section class="s cs set primary scc-as-c alignfull">
    <!-- constrained content area wrapper -->
    <div class="col s_hn ta-c">
        <h2>Our Blog</h2>
        <p class="tx st">We obsess over the details so you don’t have to.</p>
    </div>

    <!-- Grid: 1 col on mobile, auto-fit on desktop -->
    <div class="blog__body g-1--sm g">
        <!-- Semantic List for grid items -->
        <ul class="cl sg sgc gap">
            
            <!-- Item 1: Card inside Link -->
            <li class="lnk sg sgc">
                <article class="sg crd">
                    <div class="crd__content sg">
                        <h3 class="crd__header">
                             Blog Post 1
                        </h3>
                        <p class="crd__footer">Blog post description.</p>
                    </div>
                </article>
            </li>

            <!-- Item 2 -->
            <li class="lnk sg sgc">
                <article class="sg crd">
                    <div class="crd__content sg">
                        <h3 class="crd__header">
                           Blog Post 2
                        </h3>
                        <p class="crd__footer">Blog post description.</p>
                    </div>
                </article>
            </li>
        </ul>

        <!-- Item 3: Newsletter Form -->
        <div class="crd">
            <div class="crd__content">
                <div class="crd__header">
                    <h3 class="t xxxs">Join our Newsletter</h3>
                    <p>Get the latest insights and updates.</p>
                </div>
                <!-- Newsletter Form -->
                <div class="crd__body">
                   <form>
                      <input type="email" placeholder="Your email">
                      <button>Subscribe</button>
                   </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Calls to Action -->
    <div class="btns f row jc-sb e">
        <button class="btn" role="button">
            <span>Book a call</span>
        </button>
        <a class="btn secondary" href="/blog/">Read our blog</a>
    </div>

</section>
```

### Customization Strategy
Here is how you would manage the layout above using a single BEM parent class (`.blog__body`) to control grid columns, spacing, and subgrid behaviors for children. This keeps your HTML clean and your logic centralized.

```css
.blog__body {
  /* Customize Cards inside this section */
  --crd-h: auto;
  --crd-bg: var(--theme-palette-color-7);

  /* Define Grid Layout */
  --g-rows-template: auto auto;
  --g-cols--sm: 1;
  --g-cols--lg: 3;
  --g-cols--md: 2;
  --g-min: 8rem;
  
  /* Default Row Span */
  --gi-row: span 2;

  /* Target the list container */
  > ul {
    --crd-gap: .75rem;
    --gi-col--lg: 1 / 3;
    --gi-col--md: 1 / 3;
    --gi-row--sm: span 4;
  }

  /* Specific List Items */
  > ul > li:nth-of-type(1) {
      --gi-col--lg: 1 / 2;
      --gi-col--md: 1 / 2;
  }
  > ul > li:nth-of-type(2) {
      --gi-col--lg: 2 / 3;
      --gi-col--md: 2 / 3;
  }

  /* Subgrid Spans for Card Children */
  > ul > li h3 {
    --sgi-row: span 1;
  }
  > ul > li p {
    --sgi-row: span 2;
  }

  /* Newsletter Box (the div next to the ul) */
  > div {
    --gi-col--lg: auto;
    --gi-col--md: span 2;
  }
}
```

---

## 🛠️ Development & Workflow
If you are contributing to uCss or modifying the core framework, here is an in-depth look at the build system.

### Directory Structure
*   **`src/lib/`**: The source modules (base, components, config, layout, theming, typography, utilities).
*   **`src/u.css`**: Main framework entry point.
*   **`scripts/`**: Node.js build scripts.
*   **`dist/`**: Compiled output (Stable/Latest). **Do not edit.**

### Build Processes (`scripts/build.js`)
The project uses a consolidated Node.js build system (`scripts/build.js`) which orchestrates the entire process. This script handles bundling, cleaning, minifying, verifying, and generating documentation.

1.  **Bundling**: Recursively resolves `@import` statements to create flat files, removing build-time dependencies.
2.  **Cleaning**: Removes comments and redundant whitespace while preserving CSS nesting and structure.
3.  **Minifying**: Compresses CSS logic for production.
4.  **Verification**: The build script strictly verifies output file sizes to prevent "empty builds" or broken releases.
5.  **Compression**: Automatically generates `.gz` (Gzip) and `.br` (Brotli) versions of all CSS files (`scripts/compress.js`) for maximum performance on CDN.
6.  **Documentation**: Statically renders this `README.md` into `dist/index.html`, creating a self-hosted documentation site.

```bash
# Standard Build (Auto-detects branch for target)
npm run build

# Watch Mode (Rebuilds on change)
npm run watch

# Force specific targets
npm run build stable   # Builds to dist/stable
npm run build latest   # Builds to dist/latest
npm run build preview  # Builds to dist/preview-YYYY-MM-DD-HH-mm-ss
npm run build my-test  # Builds to dist/my-test (custom safe names allowed)

# Full Release Build (Latest + Prefixed + Stable)
npm run build full     # Builds /dist/latest/, /dist/p/, and /dist/stable/ in sequence


# Encapsulation & Prefixing (New)
uCss supports automatic prefixing for variables and classes, useful for avoiding conflicts or for branding.

# 1. Prefix All (Classes & Vars)
npm run build p           # Builds to dist/p/ (Prefix: .u-..., --u-...)
npm run build p myprefix  # Builds to dist/p/ (Prefix: .myprefix-..., --myprefix-...)

# 2. Prefix Classes Only
npm run build c           # Builds to dist/c/ (Prefix: .u-...)

# 3. Prefix Variables Only
npm run build v           # Builds to dist/v/ (Prefix: --u-...)

# 4. Custom Target + Prefix
npm run build custom-folder p unqa  # Builds to dist/custom-folder/ with "unqa" prefix
```

### Encapsulation Logic
The prefixer uses a robust Regex logic (masking strings/comments first) and intelligently **excludes** core namespaces to prevent breakage:
- **Excluded Classes**: `.wp-*`, `.block-*`, `.editor-*` (WordPress compatibility).
- **Excluded Variables**: `--theme-*`, `--wp-*`, `--block-*`.


### Maintenance
You can clean up build artifacts using the `clean` script.

```bash
# Clean everything (dist/ + logs + temp files)
npm run clean

# Clean everything EXCEPT stable and latest
npm run clean safe

# Clean specific targets
npm run clean dist         # Delete dist/ folder
npm run clean stable       # Delete only dist/stable
npm run clean latest       # Delete only dist/latest
npm run clean preview      # Delete all dist/preview-* folders
```

### Deployment Strategy
Our CI/CD pipeline (GitHub Actions) automatically deploys based on branch push:

| Branch | Output URL | Configuration |
| :--- | :--- | :--- |
| Branch | Output URL | Configuration |
| :--- | :--- | :--- |
| **`main`** | `.../stable/`, `.../p/` & `.../v/` | **Production**. Stable (root) + Encapsulated (`/p/`) + Variables Only (`/v/`). |
| **`dev`** | `.../latest/` | **Development**. Bleeding-edge code. |
| **`*`** (Other) | `.../preview-.../` | **Preview**. Timestamped deployments (e.g., `preview-2025-12-08...`). Auto-deleted after 7 days. |

---

## 🤝 Contributing
1.  Make changes in `src/lib`.
2.  Run `npm run build full` locally to verify imports, bundling, and header generation.
3.  Check `dist/stable/u.min.css` to confirm your changes are present and correct.
4.  Push to `dev` branch.

---

**Navigation**: [uCss](./) > [Source](./src/) > [Modules](./src/lib/)

[Back to top](#)