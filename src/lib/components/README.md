# Components Module

**Navigation**: [uCss](../../../README.md) > [Source](../../README.md) > [Modules](../README.md) > [Components](./) 

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Components](./) | [Utilities](../utilities/)

> **The UI Toolkit**. A set of un-opinionated, composite building blocks (Cards, Buttons, Media) designed for maximum reusability.

---

## 📑 Page Contents
*   [Installation](#-installation)
*   [Card (`.crd`)](#1-card-crd)
*   [Button (`.btn`)](#2-button-btn)
*   [Media (`.med`)](#3-media-med)
*   [Link Wrapper (`.lnk`)](#4-link-wrapper-lnk)

---

## Components Module

The **Components Module** contains the core UI building blocks of the framework. These components are designed to be composite, flexible, and heavily reliant on **Container Queries** to ensure they look perfect in any context (e.g., a Card in a sidebar vs. a Card in a main grid).

### Philosophy: Composition Over Configuration
We don't provide a "Profile Card Component" or a "Product Card Component". We provide a **Card Shell** and **Utility Blocks**.
*   **The Old Way**: You search the docs for `.card-profile-horizontal`.
*   **The uCss Way**: You build it. `<article class="crd f row">`.
    *   Want it horizontal? Add `f row`.
    *   Want a round picture? Add `.rad.rd` to the image.
    *   Want the text centered? Add `.ta-c`.
This makes the framework infinitely scalable without bloating the codebase with specific variations.

## 📦 Installation

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`components`** | [src](https://ucss.unqa.dev/stable/lib/components.css) • [clean](https://ucss.unqa.dev/stable/lib/components.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components.min.css) | [src](https://ucss.unqa.dev/latest/lib/components.css) • [clean](https://ucss.unqa.dev/latest/lib/components.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components.min.css) |

### Individual Files

| File | Description | Stable | Latest |
| :--- | :--- | :--- | :--- |
| `button.css` | Buttons (`.btn`) | [src](https://ucss.unqa.dev/stable/lib/components/button.css) • [clean](https://ucss.unqa.dev/stable/lib/components/button.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components/button.min.css) | [src](https://ucss.unqa.dev/latest/lib/components/button.css) • [clean](https://ucss.unqa.dev/latest/lib/components/button.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components/button.min.css) |
| `card.css` | Cards (`.crd`) | [src](https://ucss.unqa.dev/stable/lib/components/card.css) • [clean](https://ucss.unqa.dev/stable/lib/components/card.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components/card.min.css) | [src](https://ucss.unqa.dev/latest/lib/components/card.css) • [clean](https://ucss.unqa.dev/latest/lib/components/card.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components/card.min.css) |
| `media.css` | Media (`.med`) | [src](https://ucss.unqa.dev/stable/lib/components/media.css) • [clean](https://ucss.unqa.dev/stable/lib/components/media.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components/media.min.css) | [src](https://ucss.unqa.dev/latest/lib/components/media.css) • [clean](https://ucss.unqa.dev/latest/lib/components/media.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components/media.min.css) |
| `link.css` | Link Wrapper (`.lnk`) | [src](https://ucss.unqa.dev/stable/lib/components/link.css) • [clean](https://ucss.unqa.dev/stable/lib/components/link.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components/link.min.css) | [src](https://ucss.unqa.dev/latest/lib/components/link.css) • [clean](https://ucss.unqa.dev/latest/lib/components/link.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components/link.min.css) |

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`all components`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/components.min.css">` |
| `button.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/components/button.min.css">` |
| `card.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/components/card.min.css">` |
| `media.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/components/media.min.css">` |
| `link.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/components/link.min.css">` |

---

## 1. Card (`.crd`)
The flagship component. A flexible, composite shell that serves as the foundation for posts, profiles, product listings, and more.

### Slot Theory (BEM Structure)
The Card is not just a div (or li, or article inside li); it is a grid-ready shell. We use BEM-like naming (`__`) to define **Slots**.
*   **`.crd` (The Shell)**: The parent. It handles the "Box Model" stuff: Background, Border, Shadow, Radius. It does *not* handle internal padding, if there is .crd__content inside it.
*   **`.crd__media` (The Edge)**: A full-bleed slot. It ignores padding. Use this for cover images or videos.
*   **`.crd__content` (The Body)**: The padded interface. This is where your heading, link, text, and meta lives.
    *   **`.crd__header`**, **`.crd__body`**, **`.crd__footer`**: These aren't just semantic decorations. When you use `.crd.sg` (Subgrid), these slots allow you to align headers across *multiple different cards* in a grid.

### Modifiers
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
    <img src="product.jpg" alt="Product Name">
  </figure>
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

## 2. Button (`.btn`)
A robust button utility that supports variants, sizes, and icon integration.

### Classes
*   **Base**: `.btn` (Reset, pointer, Flex centered).
*   **Variants**: `.btn.primary` (default colors), `.btn.secondary` (subtle), `.btn.plain` (ghost), `.btn.outlined` (border only), `.btn.dark`, `.btn.light`.
*   **Sizes**: `.btn.sm` (Small), `.btn.md` (Medium - default), `.btn.lg` (Large), `.btn.xlg`, `.btn.tiny`.
*   **Radius**: `.btn.sq` (Square), `.btn.rd` (Pill), `.btn.lt` (Light radius).
*   **State**: `.btn.is-loading` (Cursor wait), `.btn.is-disabled` (Opacity reduced).

### Grouping (`.btns`)
A container to organize multiple buttons. Handles spacing and wrapping automatically.
```html
<div class="btns">
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

---

## 3. Media (`.med`)
A wrapper for `img` or `video` elements to handle aspect ratios and responsive behaviors consistently.

### Modifiers
*   **Aspect Ratio**: `.ar-1` (Square), `.ar-16-9` (Video), `.ar-4-3`, `.ar-2-3` (Portrait).
*   **Radius**: `.rd` (Circle), `.sq` (Square corner), `.lt`, `.bd`.

### Usage Examples

#### User Avatar
```html
<figure class="med rd ar-1" style="width: 64px;">
  <img src="user.jpg" alt="Top G">
</figure>
```

#### Video Embed Wrapper
```html
<figure class="med ar-16-9">
  <iframe src="..."></iframe>
</figure>
```

---

## 4. Link Wrapper (`.lnk`)
A specialized utility for the "Clickable Card" pattern.

### The Problem
You want an entire card to be clickable, but wrapping a `<div>` in an `<a>` is not ideal for semantics (and illegal if the card contains other interactive elements like buttons).

### The Solution (`.lnk`)
1.  Apply `.lnk` to the container (e.g., the Card).
2.  Place your main link inside (e.g., in the title).
3.  The `.lnk` class sets position relative on the container and creates a `::after` pseudo-element on the **first link** it finds, stretching it to cover the specific `.lnk` container. It also handles focus outlines and a full-size click overlay mechanism for cards.

### Usage Example

```html
<!-- The user acts as if they clicked the whole card, but semantically they clicked the H3 link -->
<article class="crd lnk">
  <div class="crd__content">
    <h3 class="t">
      <!-- This link's hit area is stretched to cover the entire card with default z-index of 3 -->
      <a href="/post/1">Read Article</a>
    </h3>
    <p>Excerpt...</p>
    
    <!-- This button sits z-index higher, so it remains clickable separately -->
    <button class="btn sm" style="z-index: 4; position: relative;">Save</button>
  </div>
  <figure class="crd__media">
    <img src="thumb.jpg" alt="">
  </figure>
</article>
```
