# Utilities Module

The **Utilities Module** provides low-level, high-impact helper classes for spacing (margin/padding) and border radius. These utilities are designed with responsiveness at their core, leveraging **Container Queries** and **CSS Logical Properties** to ensure your layout adapts fluidly to any context.

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
