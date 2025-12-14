# Patterns Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Patterns](./)

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Patterns](./) | [Utilities](../utilities/)

> **Interface Primitives**. The Patterns module contains the visual building blocks of uCss. Unlike traditional frameworks that ship rigid components (like a specific "Navbar" or "Jumbotron"), uCss Patterns provide flexible **Primitives**—Shells, Actions, and Wrappers—that you compose to build *any* UI element.

---

## 📑 Contents

*   [🌟 Overview](#-overview)
*   [🤯 Philosophy](#-philosophy)
    *   [Patterns vs Components](#patterns-vs-components)
    *   [The Slot Architecture](#the-slot-architecture)
*   [🚀 Getting Started](#-getting-started)
*   [📦 Installation & Stats](#-installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [Direct Links](#direct-links)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#-files-reference)
*   [🧠 Deep Dive](#-deep-dive)
    *   [1. Slot Theory (Cards)](#1-slot-theory-cards)
    *   [2. The Action System (Buttons)](#2-the-action-system-buttons)
    *   [3. Safe Media Wrappers](#3-safe-media-wrappers)
    *   [4. The Clickable Shell (`.lnk`)](#4-the-clickable-shell-lnk)
*   [📍 Reference: Content Map](#-reference-content-map)
    *   [Card (`.crd`)](#card-pattern-crd)
    *   [Button (`.btn`)](#button-pattern-btn)
    *   [Media (`.med`)](#media-pattern-med)
    *   [Link Wrapper (`.lnk`)](#link-wrapper-lnk)
*   [💡 Best Practices & Customization](#-best-practices--customization)
    *   [Composition over Configuration](#composition-over-configuration)
    *   [Real World Examples](#real-world-examples)
*   [🔧 For Developers](#-for-developers)

---

## 🌟 Overview

The **Patterns Module** provides the "Organs" of your application.
If Layout is the Skeleton, Patterns are the Organs.

### Top Features
1.  **Subgrid-Ready Cards**: The `.crd` (eg. ul.cl > li > article.crd ) shell can optionally align its internal slots (Header, Body, Footer) to a parent Grid.
2.  **Unbreakable Aspect Ratios**: The `.med` (eg. figure.med > img) wrapper prevents "Cumulative Layout Shift" (CLS) by reserving space for images before they load.
3.  **Semantic Link Wrapping**: The `.lnk` utility (eg. ul.cl > li.lnk h3 > a::after ) allows you to make an entire complex card clickable without nesting 50 `<div>`s inside an `<a>` tag (which is invalid HTML for block elements).
4.  **Skinnable**: Cards are skinnable with the `.set` utility, that automatically adapt to your Theme (`.set.dark` -> Card turns white/black automagically).

> [!LIGHTBULB]
> **Why "Patterns"?**
> We call them patterns because they represent repeating behaviors. A "User Card", "Product Card", and "News Card" are all just implementations of the **Card Pattern**.

---

## 🤯 Philosophy

### Patterns vs Components
*   **Component**: "A Product Card with a Buy Button". (Specific)
*   **Pattern**: "A Container with slots for media and data". (Abstract)

uCss ships Patterns. You build Components.
This means you never have to fight the framework to make a "Product Card" look different. You just compose the atoms differently.

### The Slot Architecture
We avoid the "Padding Trap".
If you put padding on the card container, you can't have a full-bleed image.
If you don't put padding on the card container, your text hits the edge.
**Solution**: The Card Shell (`.crd`) handles the "Box" (Border, Shadow, Radius). The Content Slot (`.crd__content`: .crd > div.crd__content) handles the Padding. The Media Slot (`.crd__media`: .crd > figure.crd__media) handles the Image.

---

## 🚀 Getting Started

### The "Clicked" Moment
1.  Create a card: `<article class="crd">`.
2.  Add content: `<div class="crd__content"><p>Text</p></div>`.
3.  Add a hero image: `<figure class="crd__media ar-16-9"><img ...></figure>` (by default, it will have `order: -1` on it, so it will be the first child, but semantically it should be the last).
4.  Notice how the image goes edge-to-edge (clean) but the text has breathing room? That logic is baked in.

---

## 📦 Installation & Stats

### Bundle Stats

| File | Full (Raw) | Clean | Min | Gzip | Brotli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`patterns.css`** | **~50 KB** | **~45 KB** | **~40 KB** | **~6.5 KB** | **~5.6 KB** |
| `button.css` | 24 KB | 22 KB | 20 KB | 3.4 KB | 3.0 KB |
| `card.css` | 21 KB | 19 KB | 16 KB | 2.9 KB | 2.4 KB |
| `media.css` | 3.7 KB | 3.0 KB | 2.5 KB | 0.7 KB | 0.6 KB |

### Direct Links

| Module | Full Source | Clean Source | Minified (Prod) |
| :--- | :--- | :--- | :--- |
| **Patterns** | [patterns.css](https://ucss.unqa.dev/stable/lib/patterns.css) | [patterns.clean.css](https://ucss.unqa.dev/stable/lib/patterns.clean.css) | [patterns.min.css](https://ucss.unqa.dev/stable/lib/patterns.min.css) |

### HTML Snippets

#### Standard
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/patterns.min.css">
```

#### Prefixed (`/p/`)
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/p/lib/patterns.min.css">
```

---

## 📂 Files Reference

| File | Description | Download |
| :--- | :--- | :--- |
| **`card.css`** | **The Shell**. Flexible container that handles "The Box Model" (shadows, borders, backgrounds) and "Slots" (Media, Content, Header). | [src](https://ucss.unqa.dev/stable/lib/patterns/card.css) |
| **`button.css`** | **The Action**. [See Button Submodule](./button/README.md). A complete interactive ecosystem. | [src](https://ucss.unqa.dev/stable/lib/patterns/button.css) |
| **`media.css`** | **The Visual**. Wrapper for `img`/`video` that enforces aspect ratios and object-fit to prevent layout shifts. | [src](https://ucss.unqa.dev/stable/lib/patterns/media.css) |
| **`link.css`** | **The Interaction**. `.lnk` wrapper. Uses a pseudo-element technique to stretch a nested link over its parent container. | [src](https://ucss.unqa.dev/stable/lib/patterns/link.css) |

---

## 🧠 Deep Dive

### 1. Card (`.crd`)  (Cards BEM-like Structure)
The flagship component. A flexible, composite shell that serves as the foundation for posts, profiles, product listings, and more.

There is *No JavaScript*. This is pure CSS composition.


#### Slot Theory (BEM Structure)
The Card (`.crd`) is designed around "Slots".
The Card is not just a div (or li, or article inside li); it is a grid-ready shell. We use BEM-like naming (`__`) to define **Slots**.
*   **`.crd` (The Shell)**: The parent. It handles the "Box Model" stuff: Background, Border, Shadow, Radius. It does *not* handle internal padding, if there is .crd__content inside it.
*   **`.crd__media` (The Edge)**: A full-bleed slot. This slot ignores the card's padding. It goes edge-to-edge, and has `order: -1` by default. Perfect for cover images at the top of a card.
*   **`.crd__content` (The Body)**: This is where your heading, link, text, and meta data live. This slot adds the standard card padding (`--crd-p`).
    *   **`.crd__header`** (Card Title), **`.crd__body`** (Card Content / Meta Data), **`.crd__footer`** (Card Meta Data / CTA): These aren't just semantic decorations. When you use `.crd.sg` (Subgrid), these slots allow you to align headers across *multiple different cards* in a grid.

#### Modifiers
*   **Smart Grid**: `.crd.sg`, `.crd.sgc` allows content to align to a subgrid.
*   **Contextual**: `.crd.set.dark` (inherits from Theming module).

### Usage Examples


#### Standard Product Card
Uses semantic header/body/footer structure. Container queries automatically adjust layout if this card is in a small sidebar vs. a wide main area.
```html
<article class="crd">
  <!-- Content Slot -->
  <div class="crd__content">
    <header class="crd__header">
      <h3 class="t">Product Title</h3>
      <span class="badge">New</span>
    </header>
    
    <div class="crd__body">
      <p>Description of the product goes here.</p>
    </div>

    <footer class="crd__footer f row jc-sb ai-c">
      <span class="price">$99.00</span>
      <button class="btn primary sm">Add to Cart</button>
    </footer>
  </div>

  <!-- Media Slot -->
  <figure class="crd__media">
    <!-- SVGs are also supported and automatically sized -->
    <img src="product.jpg" alt="Product Name">
  </figure>
</article>
```

#### Subgrid Card (`.crd.sg`)
When using `.sg` or `.sgc` on a card, it removes the default padding from the `.crd` shell and delegates it to the internal slots. This allows you to align headers/bodies across multiple cards using CSS Grid.
```html
<article class="crd sg">
 ...
</article>
```

#### Profile Card (Horizontal)
Using utility classes to force a horizontal layout if needed.
```html
<article class="crd f row ai-c gap-m">
  <div class="crd__media rd" style="--med-size: 80px;">
    <img src="avatar.jpg" alt="User Avatar">
  </div>
  <div class="crd__content">
    <h3 class="t">Jane Doe</h3>
    <p class="tx">Software Engineer</p>
  </div>
</article>
```

---

### 2. Button (`.btn`)
The Action System. A robust visual button utility that supports variants, sizes, and icon integration.

Buttons are composed of 4 layers:
1.  **Base**: `.btn` (Structure, cursor, centering).
2.  **Skin**: `.primary`, `.secondary` (Colors).
3.  **Size**: `.sm`, `.lg` (Dimensions).
4.  **Radius**: `.sq`, `.rd`, `.lt`, `.bd` (Corners).

This combinatorial system allows for `2 (types) x 8 (skins) x 7 (sizes) x 4 (radiuses) = 448` unique button styles out of the box, all sharing the same DNA.

#### Grouping (`.btns`)
A container to organize multiple buttons. Handles spacing and wrapping automatically.

| Class | Alignment |
| :--- | :--- |
| `.btns.c` | Center |
| `.btns.s` | Start |
| `.btns.e` | End |

> Responsive suffixes: `.c--sm`, `.c--md`, `.c--lg`, etc.

```html
<div class="btns c--md">
  <button class="btn primary">Submit</button>
  <button class="btn plain" style="--btn-color: var(--alr);">Cancel</button>
</div>
```

### Usage Examples

#### Icon Link Button
SVG icons inside `.btn` are automatically sized and colored.
```html
<a href="#" class="btn secondary sm">
  <span>Settings</span>
  <svg class="icn">...</svg>
</a>
```

#### Full Width Button
```html
<button class="btn primary full">
  Sign In
</button>
```

### 3. Safe Media Wrappers (`.med`)
A wrapper for `img` or `video` elements to handle aspect ratios and responsive behaviors consistently.

Browsers don't know the height of an image until it downloads. This causes the page to "jump" (CLS).
The `.med` wrapper fixes this by applying a default `aspect-ratio` to the container *before* the image loads.
The image inside is set to `object-fit: cover; position: absolute; size: 100%`.
This guarantees rock-solid layouts even on slow connections.

#### Modifiers
*   **Aspect Ratio**: `.ar-1` (Square), `.ar-16-9` (Video), `.ar-4-3`, `.ar-2-3` (Portrait).
*   **Radius**: `.rd` (Circle), `.sq` (Square corner), `.lt`, `.bd`.

### 4. The Clickable Shell (`.lnk`)
The "Card Link" problem: You want the whole card to be clickable, but you have buttons inside it.
If you wrap the card in `<a>`, the nested buttons break validation.
**Solution**:
1.  Add `.lnk` to the Card (`.crd.lnk`).
2.  Add a standard link inside the title: `<h3><a href="...">Title</a></h3>`.
3.  The `.lnk` class finds that `<a>` and expands its `::after` pseudo-element to cover the *relative parent* (the card).
4.  Z-Index magic ensures real buttons inside the card sit *above* the pseudo-link, so they remain independently clickable.

---

## 📍 Reference: Content Map

### Card Pattern (`.crd`)

| Class | Variable | Default | Description |
| :--- | :--- | :--- | :--- |
| **Shell** | | | |
| **`.crd`** | `--crd-bg` | `--set-bg` | Card Background. |
| | `--crd-rad` | `0.25rem` | Border Radius. |
| | `--crd-shadow` | `0 1px 3px...`| Box Shadow. |
| **Slots** | | | |
| **`.crd__media`** | `--crd-med-ar` | `1.91/1` | Media Aspect Ratio. |
| **`.crd__content`**| `--crd-p` | `1.25rem` | Content Padding. |
| **`.crd__header`** | | | Header Slot. |
| **`.crd__footer`** | | | Footer Slot. |

#### Variables & Theme
The Card shell exposes several CSS variables for easy theming without writing new CSS classes.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--crd-bg` | `--crd` or `hsl(0 0% 100%)` | Background color. |
| `--crd-rad` | `--rad` or `.5rem` | Border radius. |
| `--crd-p` | `1.25rem 1.25rem` | Padding magnitude (inline & block). |
| `--crd-gap` | `clamp(...)` | Gap between direct children (if flex/grid). |
| `--crd-shd` | `--shd` (Shadow map) | Box shadow. |
| `--crd-bw` | `0` | Border width. |
| `--crd-bc` | `currentColor` | Border color. |

### Button Pattern (`.btn`)

| Class | Description |
| :--- | :--- |
| **`.btn`** | Base Button. |
| **`.primary`** | Uses Brand Primary color. |
| **`.secondary`** | Uses Brand Secondary color. |
| **`.outlined`** | Transparent background, colored border. |
| **`.plain`** | Transparent background, colored text. |
| **`.sm`** | Small size (compact). |
| **`.lg`** | Large size (hero). |
| **`.xl`** | Extra Large size. |
| **`.tiny`** | Tiny utility button. |
| **`.is-loading`** | Shows spinner, hides text. |

#### Variables & Theme
Buttons are highly customizable via CSS variables.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--btn-bg` | `--p` (Primary) | Background color. |
| `--btn-c` | `--on-p` (On Primary) | Text color. |
| `--btn-bc` | `--btn-bg` | Border color. |
| `--btn-fs` | `1.125rem` | Font size. |
| `--btn-p` | `.625em 1.325em` | Padding. |
| `--btn-rad` | `4em` | Border radius. |
| `--btn-gap` | `clamp(...)` | Gap between icon and text. |

#### Button Classes Usage Explained
*   **Base**: `.btn` (Reset, pointer, Flex centered).
*   **Variants**: `.btn.primary` (default colors), `.btn.secondary` (brand dark), `.btn.tertiary` (brand light), `.btn.plain` (transparent background), `.btn.outlined` (border only), `.btn.subtle` (semi-transparent background), `.btn.alt` (alternative to current theme), `.btn.dark` (always dark), `.btn.light` (always light).
*   **Sizes**: `.btn.xsm` (Extra Small), `.btn.sm` (Small), `.btn.md` (Medium - default), `.btn.lg` (Large), `.btn.xlg` (Extra Large), `.btn.tiny`, `.btn.pill` (Almost no padding).
*   **Radius**: `.btn.sq` (Square), `.btn.rd` (Circle), `.btn.lt` (Lite radius), `.btn.bd` (Bold radius).
*   **Shadow**: `.btn.shd` (Shadow), `.btn.shd-hover` (Shadow on hover).
*   **State**: `.btn.is-loading` (Cursor wait), `.btn.is-disabled` (Opacity reduced).

### Media Pattern (`.med`)

| Class | Description | Ratio |
| :--- | :--- | :--- |
| **`.med`** | Media Container | |
| **`.ar-1`** | Square | 1:1 |
| **`.ar-16-9`** | Video / Hero | 16:9 |
| **`.ar-4-3`** | Photo | 4:3 |
| **`.ar-2-1`** | Panorama | 2:1 |
| **`.rd`** | Round | 50% (Circle) |
| **`.sq`** | Square Radius | 0px |

#### Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `--med-ar` | `auto` | Aspect ratio (e.g., `16/9`). |
| `--med-obj-f` | `cover` | Object fit behavior. |
| `--med-bg` | `transparent` | Background color. |
| `--med-border-r` | `0` | Border radius. |

### Link Wrapper (`.lnk`)

| Class | Logic |
| :--- | :--- |
| **`.lnk`** | Looks for the *first* `<a>` tag inside itself, and stretches a pseudo-element `::after` to cover the entire container. |

---

## 💡 Best Practices & Customization

### Composition over Configuration
Don't create a `.product-card` class.
Compose it using Patterns + Utilities.
*   **Bad**:
    ```css
    .product-card { padding: 20px; border-radius: 8px; box-shadow: ... }
    ```
*   **Good**:
    ```html
    <article class="crd p-m shadow-lg rad-m">...</article>
    ```

### Real World Examples

#### 1. Clickable Article Teaser
```html
<article class="crd lnk">
    <div class="crd__content">
        <h2 class="t m">
            <a href="/post/1">My Great Post</a>
     </h2>
     <p class="tx s">A short excerpt...</p>
  </div>
  <figure class="crd__media ar-16-9">
    <img src="post.jpg" alt="Post">
  </figure>
</article>
```

#### 2. Media Object (The "Tweet" Layout)
Using Card + Layout together.
```html
<div class="crd f row ai-s gap-s p-s">
   <figure class="med rd ar-1" style="--med-w: 48px">
      <img src="avatar.jpg">
   </figure>
   <div class="f col">
      <h3 class="t s">User Name</h3>
      <p>This is the content of the tweet.</p>
   </div>
</div>
```

---

## 🔧 For Developers

*   **Subgrid integration**: You can use `.crd.sg` to opt-into subgrid. The card formatting context will respect the parent grid's rows/tracks.
*   **Variables**:
    *   Buttons use `--btn-bg`, `--btn-c` (color), `--btn-bd` (border).
    *   Cards use `--crd-bg`, `--crd-rad`.

---

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Patterns](./) 

[Back to top](#)

**License**: MPL-2.0
**Copyright**: © 2025 Alive 🜁
