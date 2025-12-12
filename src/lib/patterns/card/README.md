# Card Pattern

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Patterns](../) > [Card](./)

**Modules**: [Config](../../config/) | [Base](../../base/) | [Layout](../../layout/) | [Theming](../../theming/) | [Typography](../../typography/) | [Patterns](../) | [Utilities](../../utilities/)

> **The Universal Container**. A layout-agnostic, composable card component that adapts to its container's grid and supports subgrid alignment.

---

## 📑 Contents

*   [🌟 Overview](#-overview)
*   [🤯 Features](#-features)
*   [🚀 Usage](#-usage)
*   [📦 Files Reference](#-files-reference)
*   [📍 Content Map](#-content-map)

---

## 🌟 Overview

The **Card** (`.crd`) is the primary "Holder" of content in uCss. Unlike traditional frameworks that give you a rigid card structure, uCss cards are shells that handle:
1.  **Background & Surface**: Inherits or sets surface colors.
2.  **Padding**: Manages internal spacing consistently.
3.  **Layout Context**: Integration with Grid/Flex.

---

## 🤯 Features

### 1. Subgrid Aware (`.crd.sg`)
Cards can be transparent to the grid. By adding `.sg`, to the card's `.crd >.crd__content > *` internals (Header, Body, Footer) can align directly to the parent grid's tracks, creating "Holy Grail" layouts where headers of adjacent cards are always the same height.

### 2. Media Handling
The `.crd__media` element allows for full-bleed images that ignore the card's padding, perfect for cover images.

### 3. Interactive Transforms
Cards come with predefined transform variables. Adjust `--crd-tf` on hover to create lift effects.

---

## 🚀 Usage

```html
<!-- Basic Card -->
<article class="crd">
  <div class="crd__content">
    <h3 class="crd__header">Card Title</h3>
    <p class="crd__body">Some interesting content here.</p>
    <footer class="crd__footer">Read More</footer>
  </div>
</article>

<!-- Card with Cover Image -->
<article class="crd">
  <figure class="crd__media med ar-16-9">
    <img src="cover.jpg" alt="Cover">
  </figure>
  <div class="crd__content">
    <h3>Title</h3>
  </div>
</article>
```

---

## 📦 Files Reference

The `src/lib/patterns/card` directory contains:

| File | Description |
| :--- | :--- |
| **`base.css`** | The shell (`.crd`). Backgrounds, radius, shadows. |
| **`content.css`** | Inner wrapper (`.crd__content`). Handles padding. |
| **`media.css`** | Full-bleed media (`.crd__media`). |
| **`subgrid.css`** | Subgrid logic (`.crd.sg`). |

---

## 📍 Content Map

| Class | Description |
| :--- | :--- |
| **`.crd`** | Main wrapper. |
| **`.crd__content`** | Padded inner content area. |
| **`.crd__media`** | Media container (removes padding). |
| **`.crd__header`** | Slot for header. |
| **`.crd__body`** | Slot for body. |
| **`.crd__footer`** | Slot for footer. |
| **`.crd.sg`** | Enable subgrid rows. |

---

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Patterns](../) > [Card](./)

[Back to top](#)
