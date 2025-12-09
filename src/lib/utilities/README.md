# Utilities Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Utilities](./) 

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](../theming/) | [Typography](../typography/) | [Components](../components/) | [Utilities](./)

> **Logical Utilities**. High-impact helper classes including Spacing (`.mg`, `.pd`), Radius (`.rad`), Blur (`.blr`), and Visibility. Built strictly with **Logical Properties** (Start/End) where applicable to ensure RTL-readiness out of the box.

---

## 📑 Page Contents
*   [Installation](#-installation)
*   [Margin (`.mg`)](#1-margin-mg)
*   [Padding (`.pd`)](#2-padding-pd)
*   [Radius (`.rad`)](#3-radius-rad)
*   [Blur (`.blr`)](#4-blur-blr)
*   [Visibility](#5-visibility)

---

## Utilities Module

The **Utilities Module** provides low-level, high-impact helper classes for spacing (margin/padding) and border radius. These utilities are designed with responsiveness at their core, leveraging **Container Queries** and **CSS Logical Properties** to ensure your layout adapts fluidly to any context.

### Philosophy: Logical vs Physical
We mostly use **Logical Properties** (start/end) instead of **Physical Properties** (left/right).
*   **Why?**: To support internationalization (i18n) and RTL (Right-to-Left) languages like Arabic or Hebrew out of the box.
*   **The Translation**:
    *   `margin-left` -> `margin-inline-start` (`.mgis`)
    *   `margin-right` -> `margin-inline-end` (`.mgie`)
    *   `margin-top` -> `margin-block-start` (`.mgbs`)
    *   `margin-bottom` -> `margin-block-end` (`.mgbe`)

### 🧠 Thinking in Utilities
1.  **Utilities are Exceptions**: If you are using `.pd-m` on every single card in your app, you are doing it wrong. You should be customizing the `.crd` class (or `--crd-p` variable). Utilities are for *one-off* adjustments.
2.  **Logical is Future-Proof**: Train your brain to think in "Start/End" instead of "Left/Right". It makes your layouts resilient to writing mode changes (e.g., vertical text or RTL).
3.  **Use `.auto` for Layout Power**: `.mgis.auto` isn't just margin; it's a powerful layout tool in Flexbox to push elements apart.

### Best Practices: When to use Utilities?
*   **Use `.mg-` / `.pd-`** for one-off adjustments (e.g., "This specific button needs to be pushed away from the text").
*   **Do NOT use them** for building core component structures. If every card in your app needs `padding: 2rem`, put that in your CSS class (`.crd { padding: 2rem }`), don't add `.pd-m` to every HTML element.

## 📦 Installation

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`utilities`** | [src](https://ucss.unqa.dev/stable/lib/utilities.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities.min.css) |

### Individual Files

| File | Description | Stable | Latest |
| :--- | :--- | :--- | :--- |
| `margin.css` | External spacing (`.mg`) | [src](https://ucss.unqa.dev/stable/lib/utilities/margin.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/margin.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/margin.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/margin.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/margin.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/margin.min.css) |
| `padding.css` | Internal spacing (`.pd`) | [src](https://ucss.unqa.dev/stable/lib/utilities/padding.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/padding.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/padding.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/padding.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/padding.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/padding.min.css) |
| `radius.css` | Border radius (`.rad`) | [src](https://ucss.unqa.dev/stable/lib/utilities/radius.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/radius.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/radius.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/radius.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/radius.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/radius.min.css) |


> [!TIP]
> **Encapsulation**: uCss supports automatic prefixing (e.g., `.u-btn`). See [Encapsulation & Prefixing](../../../README.md#encapsulation--prefixing-new) for build instructions.

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`utilities`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/utilities.min.css">` |
| `margin.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/utilities/margin.min.css">` |
| `padding.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/utilities/padding.min.css">` |
| `radius.css` | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/utilities/radius.min.css">` |

---

## 1. Margin (`.mg`)
Responsive, logical-property based external spacing.

### Features
*   **Logical Directions**: Uses `block` (top/bottom) and `inline` (left/right) to support modern writing modes.
*   **Responsive Variables**: All margin classes are backed by variables that can be overridden at specific breakpoints (`--mg--sm`, `--mg--md`, `--mg--lg`).
*   **Auto Alignment**: Built-in support for `margin: auto` centering.

### Class Reference

| Class | Property | Direction (LTR) | Fallback Chain |
| :--- | :--- | :--- | :--- |
| `.mg` | `margin` | All | `--mg` |
| `.mgb` | `margin-block` | Top & Bottom | `--mgb` → `--mg` |
| `.mgbs` | `margin-block-start` | Top | `--mgbs` → `--mgb` → `--mg` |
| `.mgbe` | `margin-block-end` | Bottom | `--mgbe` → `--mgb` → `--mg` |
| `.mgi` | `margin-inline` | Left & Right | `--mgi` → `--mg` |
| `.mgis` | `margin-inline-start` | Left | `--mgis` → `--mgi` → `--mg` |
| `.mgie` | `margin-inline-end` | Right | `--mgie` → `--mgi` → `--mg` |

### Modifiers
*   **`.auto`**: Sets the margin to `auto`. Can be combined with directional classes.
    *   `.mg.auto`: `margin: auto` (Centering block elements).
    *   `.mgis.auto`: `margin-inline-start: auto` (Push to right in flex row).

### Usage Examples

#### Centering a Card
```html
<div class="card mg auto">
  Centered Content
</div>
```

#### Flexbox Alignment (Push)
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

---

## 2. Padding (`.pd`)
Fluid, responsive internal spacing with massive `clamp()` ranges.

### Features
*   **Fluid Typography Scaling**: Padding values use `clamp()` to scale smoothly from mobile to desktop sizes.
*   **Preset Sizes**: A comprehensive scale from `xxs` to `xxxl` ensures consistent spacing rhythm.
*   **Percentage-Based Inline**: Inline padding (left/right) uses percentages (`3%`, `5%`, `7%`) for large presets (`l`, `xl`, `xxl`) to maintain safe zones on wide screens.

### Preset Scale

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

### Class Reference
Follows the same logical direction naming as Margins (`.pdb`, `.pdi`, `.pdbs`, etc.).

### Usage Examples

#### Standard Section Padding
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

#### Responsive Override (CSS)
```css
.custom-box {
  /* Default: Scale M */
  --pd: var(--pd-m); 
  
  /* Large Containers: Jump to Scale XL */
  --pd--lg: var(--pd-xl);
}
```

---

## 3. Radius (`.rad`)
Border radius utilities for consistent corner rounding.

### Features
*   **Directional Control**: Target specific corners (`-tl`, `-tr`, `-bl`, `-br`) or sides (`-t`, `-b`).
*   **Preset Sizing**: `em`-based sizes ensure radius scales with font-size, keeping proportions perfect.

### Preset Scale

| Size | Class | Value |
| :--- | :--- | :--- |
| **sq** | `.rad.sq` | `0` (Square) |
| **xs** | `.rad.xs` | `0.25em` |
| **s** | `.rad.s` | `0.375em` |
| **m** | `.rad.m` | `0.625em` |
| **l** | `.rad.l` | `1em` |
| **xl** | `.rad.xl` | `1.5em` |
| **rd** | `.rad.rd` | `640em` (Pill / Circle) |

### Class Reference

| Class | Property | Target |
| :--- | :--- | :--- |
| `.rad` | `border-radius` | All corners |
| `.rad-t` | `border-top-*-radius` | Top Left & Top Right |
| `.rad-b` | `border-bottom-*-radius` | Bottom Left & Bottom Right |
| `.rad-tl` | `border-top-left-radius` | Top Left |
| `.rad-tr` | `border-top-right-radius` | Top Right |
| `.rad-bl` | `border-bottom-left-radius` | Bottom Left |
| `.rad-br` | `border-bottom-right-radius` | Bottom Right |

### Usage Examples

#### Standard Card
```html
<div class="card rad m">
   Rounded corners (0.625em).
</div>
```

#### Pill Button
```html
<button class="btn rad rd">
   Pill Shape
</button>
```

#### Card with Image Header
Only rounding the top corners to match the card, leaving bottom square to attach to content.
```html
<div class="card rad l">
  <img src="post.jpg" class="rad-t l rad-b sq" alt="Header">
  <div class="content">
    Text...
  </div>
</div>
```

---

## 4. Blur (`.blr`)
Backdrop blur utilities.

### Preset Scale

| Size | Class | Value |
| :--- | :--- | :--- |
| **s** | `.blr--s` | `0.125rem` |
| **m** | `.blr` | `0.25rem` |
| **l** | `.blr--l` | `0.5rem` |
| **xl** | `.blr--xl` | `1rem` |
| **xxl** | `.blr--xxl` | `2rem` |

### Usage Examples

#### Glassmorphism Card
```html
<div class="card s set dark blr--xl" style="--set-bg: hsl(0 0% 10% / 0.5);">
  Blurred background content.
</div>
```

---

## 5. Visibility
Utilities for hiding elements.

| Class | Description |
| :--- | :--- |
| `.hide`, `.hidden` | Hides the element (`display: none`, `opacity: 0`). |

> **Note**: In the editor context, these elements remain strictly visible (reduced opacity) for editing purposes.

