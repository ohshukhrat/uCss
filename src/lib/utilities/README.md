# Utilities Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Utilities](./)

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Patterns](../patterns/) | [Utilities](./)

> **Atomic Overrides**. A collection of single-purpose logic classes for tweaking Layouts and Patterns. While Patterns provide the "Default State", Utilities provide the "Exception State". uCss utilities are strictly **Logical Property** based (Block/Inline) to ensure future-proof internationalization support.

---

## 📑 Contents

*   [🌟 Overview](#-overview)
*   [🤯 Philosophy](#-philosophy)
    *   [The "Exception" Rule](#the-exception-rule)
    *   [Logical Space](#logical-space)
*   [🚀 Getting Started](#-getting-started)
*   [📦 Installation & Stats](#-installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [Direct Links](#direct-links)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#-files-reference)
*   [🧠 Deep Dive](#-deep-dive)
    *   [1. Logical Properties (The End of Top/Left)](#1-logical-properties-the-end-of-top-left)
    *   [2. The Fallback Chain (Contextual Spacing)](#2-the-fallback-chain-contextual-spacing)
    *   [3. Responsive Suffixes](#3-responsive-suffixes)
*   [📍 Reference: Content Map](#-reference-content-map)
    *   [Padding (`.pd`)](#padding-pd)
    *   [Margin (`.mg`)](#margin-mg)
    *   [Radius (`.rad`)](#radius-rad)
    *   [Position & Display](#position--display)
    *   [Blur & Misc](#blur--misc)
*   [💡 Best Practices & Customization](#-best-practices--customization)
    *   [When to use Styles vs Utilities](#when-to-use-styles-vs-utilities)
*   [🔧 For Developers](#-for-developers)

---

## 🌟 Overview

The **Utilities Module** is the final layer of the stack. It has the highest specificity (mostly) and is used to fine-tune layouts.

### Top Features
1.  **Logical Naming**: `.pdbs` (Padding Block Start) instead of `.pt` (Padding Top). If you switch the document to `dir="rtl"`, your padding stays on the "start" side correctly (e.g. Right in Arabic).
2.  **Responsive Suffixes**: You can apply margin only on mobile `.mg--sm`, or only on desktop `.mg--lg`.
3.  **Variable-Backed**: `.rad-l` isn't `8px`. It's `var(--rad-l, 0.75em)`. Change the variable, change the utility everywhere.
4.  **Fluid Presets**: `.pd.xl` uses a clamp function (`3rem` to `4rem`). It acts like a "Standard Layout Padding" utility that works on any screen size.

> [!LIGHTBULB]
> **Why `block-start`?**
> In default English writing mode, `block-start` is Top. But in Vertical Japanese writing mode, `block-start` is Right. Logical properties align with the *content flow*, not the physical screen.

---

## 🤯 Philosophy

### The "Exception" Rule
If you find yourself using `.pd-l` on *every single card*, that is not an exception. That is a rule. You should update your Card Pattern (`--crd-p`).
Utilities should be used for one-offs.
*   "This specific card needs more space."
*   "This specific image needs to be round."

### Logical Space
We believe that describing "Left" and "Right" in CSS is legacy thinking.
*   **Inline Axis**: The direction text flows (Left -> Right in EN).
*   **Block Axis**: The direction paragraphs stack (Top -> Bottom in EN).
uCss enforces this mental model to ensure your app is ready for global distribution from day one.

---

## 🚀 Getting Started

### The "Clicked" Moment
1.  You have a `<div class="crd">`.
2.  It looks too tight against the header.
3.  Add `.mgbs-xl` (Margin Block Start Extra Large).
4.  Instant breathing room.
5.  On mobile, it's too much. Change it to `.mgbs-s .mgbs-xl--lg`.
6.  Now it's small on mobile, large on desktop.

### Rollout in 5 Seconds
1.  **Load the module**: `utilities.min.css`.
2.  **Add Radius**: `<img class="rad-l" src="...">`.
3.  **Hide on Mobile**: `<div class="dn--sm">`.
4.  **Blur Background**: `<div class="abs o blr-m"></div>`.

---

## 📦 Installation & Stats

### Bundle Stats

| File | Full (Raw) | Clean | Min | Gzip | Brotli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`utilities.css`** | **~15 KB** | **~13 KB** | **~12 KB** | **~2.2 KB** | **~1.8 KB** |
| `padding.css` | 5.5 KB | 4.5 KB | 3.8 KB | 0.7 KB | 0.6 KB |
| `margin.css` | 5.5 KB | 4.5 KB | 3.8 KB | 0.7 KB | 0.6 KB |
| `radius.css` | 1.9 KB | 1.5 KB | 1.2 KB | 0.3 KB | 0.2 KB |
| `misc.css` | 2 KB | 1.8 KB | 1.5 KB | 0.4 KB | 0.3 KB |

### Direct Links

| Module | Full Source | Clean Source | Minified (Prod) |
| :--- | :--- | :--- | :--- |
| **Utilities** | [utilities.css](https://ucss.unqa.dev/stable/lib/utilities.css) | [utilities.clean.css](https://ucss.unqa.dev/stable/lib/utilities.clean.css) | [utilities.min.css](https://ucss.unqa.dev/stable/lib/utilities.min.css) |

### HTML Snippets

#### Standard
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/utilities.min.css">
```

#### Prefixed (`/p/`)
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/p/lib/utilities.min.css">
```

---

## 📂 Files Reference

| File | Description | Download |
| :--- | :--- | :--- |
| **`padding.css`** | **Padding**. Logical spacing inside elements. `.pd` (all), `.pdb` (block/vertical), `.pdi` (inline/horizontal). | [src](https://ucss.unqa.dev/stable/lib/utilities/padding.css) |
| **`margin.css`** | **Margin**. Logical spacing outside elements. `.mg` (all), `.mgb` (block/vertical), `.mgi` (inline/horizontal). | [src](https://ucss.unqa.dev/stable/lib/utilities/margin.css) |
| **`radius.css`** | **Border Radius**. `.rad` (all), `.rad-t` (top corners), `.rad-tl` (top-left). | [src](https://ucss.unqa.dev/stable/lib/utilities/radius.css) |
| **`blur.css`** | **Filters**. `.blr` (blur). Useful for backdrops. | [src](https://ucss.unqa.dev/stable/lib/utilities/blur.css) |
| **`misc.css`** | **Helpers**. Display (`.dn`), Position (`.abs`), Visual (`.ovf-h`), Visibility (`.vis-hidden`). | [src](https://ucss.unqa.dev/stable/lib/utilities/misc.css) |

---

## 🧠 Deep Dive

### 1. Logical Properties (The End of Top/Left)
*   **Block Axis**: The direction text flows (usually Top-to-Bottom).
*   **Inline Axis**: The direction sentences flow (usually Left-to-Right).

Mapping Table (LTR):
*   `block-start` = Top
*   `block-end` = Bottom
*   `inline-start` = Left
*   `inline-end` = Right

Mapping Table (RTL - Arabic):
*   `block-start` = Top
*   `block-end` = Bottom
*   `inline-start` = Right
*   `inline-end` = Left

uCss utilities automatically adapt.

### 2. The Fallback Chain (Contextual Spacing)
We use CSS Variables to allow broad overrides.
Code: `padding-block-start: var(--pdbs, var(--pdb, var(--pd)))`.

**What does this mean?**
1.  **Level 1**: Define `--pd: 2rem`. (All sides get 2rem).
2.  **Level 2**: Define `--pdb: 4rem`. (Top/Bottom become 4rem, Left/Right stay 2rem).
3.  **Level 3**: Define `--pdbs: 1rem`. (Top becomes 1rem, Bottom stays 4rem, Left/Right stay 2rem).

This allows you to set "My Spacing" on a component level and have it intelligently cascade to all sides unless specifically overridden.

### 3. Responsive Suffixes
Every class in this module supports standard suffix modifiers.
*   `--sm`: Mobile only (0 - 640px)
*   `--md`: Tablet only (640px - 1024px)
*   `--lg`: Desktop only (1024px+)

Example: `.dn--sm` -> `display: none` ONLY on small screens.

---

## 📍 Reference: Content Map

### Padding (`.pd`)
Fluid, responsive internal spacing with massive `clamp()` ranges.


#### Features
*   **Fluid Typography Scaling**: Padding values use `clamp()` to scale smoothly from mobile to desktop sizes.
*   **Preset Sizes**: A comprehensive scale from `xxs` to `xxxl` ensures consistent spacing rhythm.
*   **Percentage-Based Inline**: Inline padding (left/right) uses percentages (`3%`, `5%`, `7%`) for large presets (`l`, `xl`, `xxl`) to maintain safe zones on wide screens.

### Class Reference
Follows the logical direction naming (`.pdb`, `.pdi`, `.pdbs`, etc.).

| Class | Property | Direction |
| :--- | :--- | :--- |
| **`.pd`** | `padding` | All |
| **`.pdb`** | `padding-block` | Top + Bottom |
| **`.pdi`** | `padding-inline` | Left + Right |
| **`.pdbs`** | `padding-block-start` | Top |
| **`.pdbe`** | `padding-block-end` | Bottom |
| **`.pdis`** | `padding-inline-start` | Left |
| **`.pdie`** | `padding-inline-end` | Right |

#### Preset Scale

| Size | Suffix | Block Value (approx) | Inline Value |
| :--- | :--- | :--- | :--- |
| **xxxl** | `.pdb.xxxl` | `6rem` - `8rem` | (Block only) |
| **xxl** | `.pdi.xxl` | `4rem` - `6rem` | `7%` |
| **xl** | `.pd.xl` | `3rem` - `4rem` | `5%` |
| **l** | `.pd.l` | `2.5rem` - `3rem` | `3%` |
| **m** | `.pd.m` | `2rem` - `2.5rem` | Fluid |
| **s** | `.pd.s` | `1.5rem` - `2rem` | Fluid |
| **xs** | `.pd.xs` | `1.25rem` - `1.5rem` | Fluid |
| **xxs** | `.pd.xxs` | `1rem` - `1.25rem` | Fluid |

#### Usage Examples

##### Standard Section Padding
Applying responsive vertical padding (`.pdb`) and consistent horizontal safe-zones (`.pdi`).
```html
<!-- Vertically: XL (3-4rem), Horizontally: L (3%) -->
<section class="pdb xl pdi l">
  <h2>Section Title</h2>
  <p>Content...</p>
</section>
```

#### Card with Tight Spacing
```html
<article class="card pd s">
  Small consistent padding (1.5rem - 2rem) around content.
</article>
```

##### Responsive Override (CSS)
```css
.custom-box {
  /* Default: Scale M */
  --pd: var(--pd-m); 
  
  /* Large Containers: Jump to Scale XL */
  --pd--lg: var(--pd-xl);
}
```

### Margin (`.mg`)
Responsive, logical-property based external spacing.

### Features
*   **Logical Directions**: Uses `block` (top/bottom) and `inline` (left/right) to support modern writing modes.
*   **Responsive Variables**: All margin classes are backed by variables that can be overridden at specific breakpoints (`--mg--sm`, `--mg--md`, `--mg--lg`).
*   **Auto Alignment**: Built-in support for `margin: auto` centering.

| Class | Property | Direction |
| :--- | :--- | :--- |
| **`.mg`** | `margin` | All |
| **`.mgb`** | `margin-block` | Top + Bottom |
| **`.mgi`** | `margin-inline` | Left + Right |
| **`.mgbs`** | `margin-block-start` | Top |
| **`.mgbe`** | `margin-block-end` | Bottom |
| **`.mgis`** | `margin-inline-start` | Left |
| **`.mgie`** | `margin-inline-end` | Right |
| **`.mg-auto`**| `margin` | Auto (Center) |

#### Modifiers
*   **`.auto`**: Sets the margin to `auto`. Can be combined with directional classes.
    *   `.mg.auto`: `margin: auto` (Centering block elements).
    *   `.mgis.auto`: `margin-inline-start: auto` (Push to right in flex row).

#### Usage Examples

##### Centering a Card
```html
<div class="card mg auto">
  Centered Content
</div>
```

##### Flexbox Alignment (Push)
Using margin-auto logic to push a button to the far right of a flex container.
```html
<div class="f row ai-c">
  <div class="logo">Logo</div>
  <!-- Usage: .mgis.auto pushes this element to the end -->
  <button class="btn mgis auto">Login</button>
</div>
```

#### Responsive Adjustments (CSS)
Changing margin based on container size without adding new classes.
```css
.hero-section {
  --mgb: 2rem; /* Default bottom margin */
  --mgb--lg: 5rem; /* Large screens: 5rem bottom margin */
}
```

### Radius (`.rad`)
Border radius utilities for consistent corner rounding.

#### Features
*   **Directional Control**: Target specific corners (`-tl`, `-tr`, `-bl`, `-br`) or sides (`-t`, `-b`).
*   **Preset Sizing**: `em`-based sizes ensure radius scales with font-size, keeping proportions perfect.

| Class | Property | Target |
| :--- | :--- | :--- |
| **`.rad`** | `border-radius` | All |
| **`.rad-t`** | | Top Left + Right |
| **`.rad-b`** | | Bottom Left + Right |
| **`.rad-l`** | | Left Top + Bottom |
| **`.rad-r`** | | Right Top + Bottom |
| **`.rad-tl`** | | Top Left |
| **`.rad-tr`** | | Top Right |
| **`.rad-bl`** | | Bottom Left |
| **`.rad-br`** | | Bottom Right |

**Sizes**:
*   `.sq` (0px)
*   `.s` (Small)
*   `.m` (Medium)
*   `.l` (Large)
*   `.rd` (Round/Pill - 9999px)

#### Usage Examples

##### Standard Card
```html
<div class="card rad m">
   Rounded corners (0.625em).
</div>
```

##### Pill Button
```html
<button class="btn rad rd">
   Pill Shape
</button>
```

##### Card with Image Header
Only rounding the top corners to match the card, leaving bottom square to attach to content.
```html
<div class="card rad l">
  <img src="post.jpg" class="rad-t l rad-b sq" alt="Header">
  <div class="content">
    Text...
  </div>
</div>
```

### Position & Display

| Class | Value | Use Case |
| :--- | :--- | :--- |
| **`.abs`** | `absolute` | Overlays, badges. |
| **`.rel`** | `relative` | Container for absolute items. |
| **`.fxd`** | `fixed` | Sticky headers, Modals. |
| **`.stk`** | `sticky` | Sidebars. |
| **`.dn`** | `display: none` | Hiding things. |
| **`.db`** | `display: block` | Resetting inline items. |
| **`.dib`** | `display: inline-block` | Buttons. |
| **`.f`** | `display: flex` | [See Layout](../layout/). |
| **`.g`** | `display: grid` | [See Layout](../layout/). |

### Blur & Misc (`.blr`)
Backdrop blur utilities.

| Class | Effect |
| :--- | :--- |
| **`.blr-s`** | Mild Blur (Backdrop) |
| **`.blr-m`** | Medium Blur |
| **`.ovf-h`** | `overflow: hidden` |
| **`.vis-hidden`** | `visibility: hidden` (Persist layout space). |

#### Usage Examples

##### Glassmorphism Card
```html
<div class="card s set dark blr--xl" style="--set-bg: hsl(0 0% 10% / 0.5);">
  Blurred background content.
</div>
```

---

### Visibility
Utilities for hiding elements.

| Class | Description |
| :--- | :--- |
| `.hide`, `.hidden` | Hides the element (`display: none`, `opacity: 0`). |

> **Note**: In the editor context, these elements remain strictly visible (reduced opacity) for editing purposes.

---

## 💡 Best Practices & Customization

### When to use Styles vs Utilities
*   **Persistent Style**: If every "Product Card" has `2rem` padding, write it in `patterns/product-card.css`.
*   **One-off Tweak**: If *this specific* Product Card needs `4rem` padding because it's a "Featured Item", use `<div class="p-card pd-xl">`.

Do not build your entire site using only utilities (unless you are prototyping). It leads to "Class Soup": `<div class="pd-m mgb-s rad-l shadow-s bg-white flex row...">`.

---

## 🔧 For Developers

*   **Extending Sizes**: If you need a `.mega` padding:
    ```css
    .pd.mega {
      --pd: 10rem;
    }
    ```
    Add this to your theme CSS, and it works with `.pd`, `.pdb`, `.pdi`, etc. automatically.

---

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Utilities](./) 

[Back to top](#)
