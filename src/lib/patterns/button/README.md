# Button Pattern Submodule

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Patterns](../) > [Button](./)

**Modules**: [Config](../../config/) | [Base](../../base/) | [Layout](../../layout/) | [Theming](../../theming/) | [Typography](../../typography/) | [Patterns](../) | [Utilities](../../utilities/)

> **The Universal Trigger**. A highly configurable, interactive element pattern. Whether it's a link, a form submit, or a dashboard toggle, the `.btn` class handles it all with consistent sizing, states, and accessibility focus rings. It decouples implementation details (HTML tag) from user intent (Action).

---

## 📑 Contents

*   [🌟 Overview](#overview)
*   [🤯 Philosophy](#philosophy)
    *   [The "Button-ness" Abstraction](#the-button-ness-abstraction)
    *   [Skinning vs Structure](#skinning-vs-structure)
*   [🚀 Getting Started](#getting-started)
*   [📦 Installation & Stats](#installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#files-reference)
*   [🧠 Deep Dive](#deep-dive)
    *   [1. The Skin Engine (Colors)](#1-the-skin-engine-colors)
    *   [2. The Size Engine (Dimensions)](#2-the-size-engine-dimensions)
    *   [3. The Group Container (`.btns`)](#3-the-group-container-btns)
    *   [4. Icon Handling Logic](#4-icon-handling-logic)
    *   [5. State Management (Loading/Disabled)](#5-state-management-loadingdisabled)
*   [📍 Reference: Content Map](#reference-content-map)
    *   [Base Classes](#base-classes)
    *   [Skin Variants](#skin-variants)
    *   [Size Variants](#size-variants)
    *   [Shape Variants](#shape-variants)
    *   [Group Helpers](#group-helpers)
*   [💡 Best Practices & Customization](#best-practices--customization)
    *   [Buttons vs Links](#buttons-vs-links)
    *   [Accessibility First](#accessibility-first)
*   [🔧 For Developers](#for-developers)

---

## 🌟 Overview

The **Button Pattern** is likely the most used component in any UI. It is the primary mechanism for User Action.

### Top Features
1.  **Tag Agnostic**: Works purely on class names. Attach `.btn` to `<a>`, `<button>`, `<input type="submit">`, or even `<div>` (though please use semantic tags).
2.  **Auto Actions**: Hover, Focus, Active, and Disabled states are built-in and derived from CSS variables.
3.  **Icon Aware**: Any `<svg>` or `.icn` element placed inside a button is automatically sized to `1em` and colored to match the text.
4.  **Group Handling**: The `.btns` wrapper automatically handles spacing (gap) and wrapping for collections of actions.

> [!LIGHTBULB]
> **Did you know?**
> You can combine any skin with any size and any shape.
> `.btn.primary.lg.pill` works just as well as `.btn.outlined.sm.sq`. The system is combinatorial.

---

## 🤯 Philosophy

### The "Button-ness" Abstraction
In uCss, "Button-ness" is a set of visual and interactive traits:
*   Cursor: Pointer
*   User Select: None
*   Display: Inline-Flex (Centered)
*   Target Area: Min 44px (touch friendly)

We abstract these traits into the `.btn` class. This allows you to turn a standard Hyperlink (`<a href>`) into a Button visually, without breaking the semantic navigational meaning.

### Skinning vs Structure
We separate **Structure** (`base.css`) from **Skin** (`skins.css`).
*   **Structure**: Padding, Font Size, Border Radius, Flex alignment.
*   **Skin**: Background Color, Text Color, Border Color, Box Shadow.

This separation allows you to create a "Ghost Button" just by changing the Skin variables (`--btn-bg: transparent`), without re-declaring padding or alignment logic.

---

## 🚀 Getting Started

### The "Clicked" Moment
1.  Write `<button class="btn">Default</button>`.
    *   It renders with default primary color (`--p`) styling.
2.  Add `.plain`: `<button class="btn plain">Action</button>`.
    *   It turns transparent background.
    *   Turns subtle accent on hover.
3.  Add `.sm`: `<button class="btn sm">Secondary Action</button>`.
    *   It shrinks to "Small" size.

### Rollout in 5 Seconds
```html
<div class="btns c">
  <!-- Secondary Action -->
  <button class="btn secondary">Cancel</button>
  
  <!-- Primary Action -->
  <button class="btn primary shadow-m">Save Changes</button>
</div>
```

---

## 📦 Installation & Stats

### Bundle Stats

This Submodule is part of `patterns.css`.

| File | Full (Raw) | Clean | Min | Gzip | Brotli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`button/base.css`** | **7.0 KB** | **6.2 KB** | **5.4 KB** | **1.3 KB** | **1.2 KB** |
| **`button/skins.css`** | **9.3 KB** | **8.6 KB** | **7.8 KB** | **1.6 KB** | **1.3 KB** |
| **`button/sizes.css`** | **2.4 KB** | **2.0 KB** | **1.7 KB** | **0.5 KB** | **0.5 KB** |
| **`button/group.css`** | **2.9 KB** | **2.7 KB** | **2.3 KB** | **0.6 KB** | **0.5 KB** |

### HTML Snippets

#### Optimization Tip
```html
<link rel="preconnect" href="https://ucss.unqa.dev">
```

Since this is a nested module, it is included in `patterns.min.css`:
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/patterns.min.css">
```

---

## 📂 Files Reference

The `src/lib/patterns/button` directory contains specific partials.

| File | Description | Download |
| :--- | :--- | :--- |
| **`base.css`** | **Core**. Defines the `.btn` class, reset properties, focus rings, and transition timings. | [src](./base.css) |
| **`skins.css`** | **Colors**. Defines modifier classes like `.primary`, `.secondary`, `.outlined`, `.plain`. | [src](./skins.css) |
| **`sizes.css`** | **Dimensions**. Defines size modifiers like `.sm`, `.lg` and shape modifiers like `.pill`. | [src](./sizes.css) |
| **`group.css`** | **Layout**. Defines the `.btns` container for grouping buttons with gaps. | [src](./group.css) |

---

## 🧠 Deep Dive

### 1. The Skin Engine (Colors)
The Skin engine works by intercepting 3 variables:
1.  **`--btn-bg`**: Background Color.
2.  **`--btn-c`**:  Text/Icon Color.
3.  **`--btn-bc`**: Border Color (defaults to `--btn-bg`).

**The `.primary` Class:**
```css
.btn.primary {
  --btn-bg: var(--p);      /* Use Global Primary */
  --btn-c:  var(--on-p);   /* Use Global Contrast */
  /* Border color automatically matches bg */
}
```

**The `.outlined` Class:**
```css
.btn.outlined {
  --btn-bg: transparent;
  --btn-bc: currentColor; /* Matches text */
  /* It doesn't set color, so it inherits from context */
}
```
This is why you can combine them: `<button class="btn primary outlined">`.
Wait, primary sets color to white (usually). So `.primary.outlined` would be White Text on Transparent BG with White Border. Perfect for Dark backgrounds.

### 2. The Size Engine (Dimensions)
The Size engine manipulates:
1.  **`--btn-fs`**: Font Size.
2.  **`--btn-pd`**: Padding (Inline and Block).
3.  **`--btn-h`**: Min-Height.

| Size | Font Size | Padding |
| :--- | :--- | :--- |
| `.tiny` | `0.625rem` | `0.25em 0.5em` |
| `.sm` | `0.875rem` | `0.375em 0.75em` |
| `.md` | `1rem` | `0.5em 1em` |
| `.lg` | `1.25rem` | `0.625em 1.25em` |

Notice that padding uses `em`. This means if you manually override font-size, the padding scales proportionally automatically.

### 3. The Group Container (`.btns`)
Never just put two buttons next to each other.
Wrap them in `.btns`.
*   **Gap**: Automatically adds `var(--g-gap)` space between them.
*   **Wrap**: Wraps to a new line on small screens.
*   **Alignment**: `.btns.c` centers them. `.btns.e` aligns to end.
*   **Responsiveness**: `.btns.c--sm` centers ONLY on mobile (Layout shift pattern: Stacked centered buttons on mobile, Inline left buttons on desktop).

### 4. Icon Handling Logic
If you add an `<svg>` or `.icn` inside a `.btn`:
1.  It gets filled with `--btn-c` (text color).
2.  It gets sized to `1.25em`.
3.  It gets a small margin to separate it from text.

**Reversing order:**
Add `.rv` (Reverse) to the button.
```html
<button class="btn rv">
  Next <svg>...</svg>
</button>
```
The Flexbox `flex-direction` flips, placing the icon to the right of the text.

### 5. State Management (Loading/Disabled)

**Loading (`.is-loading`)**:
*   Sets `pointer-events: none`.
*   Sets cursor to `wait`.
*   Result: The button maintains its exact width/height (preventing layout shift) but shows a spinner.

**Disabled (`:disabled` or `.is-disabled`)**:
*   Sets `opacity: 0.64`.
*   Sets `cursor: normal`.
*   Removes hover effects.

---

## 📍 Reference: Content Map

### Base Classes

| Class | Styles | Semantics |
| :--- | :--- | :--- |
| **`.btn`** | Inline-Flex, Center, Pointer, Default Styles. | The atom. |
| **`.btn.full`** | `width: 100%`. | Full width button. |
| **`.btn.is-loading`** | Cursor Wait, Opacity reduced, Spinner. | Loading state. |
| **`.btn:disabled`** | Cursor Not-Allowed, Opacity reduced. | Disabled state. |

### Skin Variants

| Class | Description |
| :--- | :--- |
| **`.primary`** | Brand Color (`--p`). |
| **`.secondary`** | Dark / Gunmetal (`--d`). |
| **`.tertiary`** | Beige / Light (`--l`). |
| **`.accent`** | Brand Accent (`--a`). |
| **`.success`** | Green (`--scs`). |
| **`.danger` / `.error`** | Red (`--alr`). |
| **`.outlined`** | Transparent BG, Colored Border. |
| **`.subtle`** | Low contrast background (10% opacity). |
| **`.plain`** | No background, no border (Text Link style). |
| **`.dark`** | Force Dark Theme. |
| **`.light`** | Force Light Theme. |

### Size Variants

| Class | Scale | Use Case |
| :--- | :--- | :--- |
| **`.tiny`** | `0.625rem` | Table actions, tiny tags. |
| **`.xsm`** | `0.75rem` | Meta tags. |
| **`.sm`** | `0.875rem` | Dense UI, Toolbars. |
| **`.md`** | `1rem` | (Default) Standard actions. |
| **`.lg`** | `1.25rem` | Hero CTAs. |
| **`.xlg`** | `1.375rem` | Massive landing page buttons. |

### Shape Variants

| Class | Effect |
| :--- | :--- |
| **`.pill`** | High Border Radius (Capsule). |
| **`.sq`** | Square Radius (0). |
| **`.lt`** | Light Radius. |
| **`.bd`** | Bold Radius. |
| **`.rd`** | Round Radius (Circle) - use with icons only. |

### Group Helpers (`.btns`)

| Class | Description |
| :--- | :--- |
| **`.btns`** | Flex container with gap. |
| **`.btns.c`** | Center align (Justify Center). |
| **`.btns.e`** | End align (Justify End / Right). |
| **`.btns.s`** | Start align (Justify Start / Left). |
| **`.btns.sb`** | Space Between. |
| **`.btns.rv`** | Box Order Reverse (Right-to-Left visual). |
| **`.btns.il`** | Icon Left / Start (Icon on the left). |
| **`.btns.ir`** | Icon Right / End (Icon on the right). |
| **`.btns.col`** | Stack buttons vertically. |

---

## 💡 Best Practices & Customization

### Buttons vs Links
*   **Goes somewhere?** Use `<a>`.
*   **Does something?** Use `<button>`.
*   **Both?** Use `.btn` class on either.

uCss ensures they *look* identical, so you can choose the semantically correct tag without fighting standard browser styles.
```html
<a href="/login" class="btn primary">Login Page</a>
<button onclick="login()" class="btn primary">Login Action</button>
```

### Accessibility First
*   **Focus Rings**: uCss buttons have a strong, offset focus ring for keyboard users. Never remove `outline` unless you replace it.
*   **Contrast**: The `.primary` class automatically selects a high-contrast text color (`--on-p`) based on your config. If your Primary brand color is light yellow, ensure `--on-p` is dark.

### The "Floating Action Button" (FAB)
You can compose a FAB using only utilities:
```html
<button class="btn primary rd shadow-xl abs p-m" style="bottom: 2rem; right: 2rem">
   Add
</button>
```

---

## 🔧 For Developers

### Creating a "Mega Button"
If you need a marketing button that breaks the scale:
```css
.btn.mega {
  --btn-fs: 2.5rem;
  --btn-pd: 2em 4em;
  --btn-rad: 999px;
  --btn-shadow: 0 10px 40px rgba(var(--p-rgb), 0.5);
  font-weight: 900;
  letter-spacing: -0.05em;
}
```

### Integration with Frameworks
**React/Vue Component**:
```jsx
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => (
  <button className={`btn ${variant} ${size}`} {...props}>
    {children}
  </button>
);
```

---

**Navigation**: [uCss](../../../../) > [Source](../../../) > [Modules](../../) > [Patterns](../) > [Button](./)

**Modules**: [Config](../../config/) | [Base](../../base/) | [Layout](../../layout/) | [Theming](../../theming/) | [Typography](../../typography/) | [Patterns](../) | [Utilities](../../utilities/)

[Back to top](#)

**License**: MPL-2.0
**Copyright**: © 2025 Shukhrat (Alive 🜁) ⤻ UNQA

## 🗺️ Visual Map

```
src/lib/
├── config/                  # 1. CONFIGURATION (The Brain)
│   ├── root/                #    - Semantic Modules
│   │   ├── colors.css       #    - Palettes & Themes
│   │   ├── typography.css   #    - Fonts & Scales
│   │   ├── layout.css       #    - Radius & Spacing
│   │   └── patterns.css     #    - Component Vars
│   ├── adapters/            #    - CMS Adapters
│   │   ├── blocksy.css      #    - Blocksy Theme
│   │   └── gutenberg.css    #    - WordPress Block Editor
│   └── root.css             #    - Entry Point
│
├── base/                    # 2. BASE (The Foundation)
│   ├── html/                #    - HTML Engine
│   │   ├── reset.css        #    - Normalization
│   │   ├── typography.css   #    - Text Defaults
│   │   ├── flow.css         #    - Smart Flow Engine
│   │   ├── lists.css        #    - List Styles
│   │   ├── forms.css        #    - Input Styling
│   │   └── helpers.css      #    - HTML Utilities
│   └── html.css             #    - Entry Point
│
├── patterns/                # 3. PATTERNS (The Components)
│   ├── button/              #    - Atomic Component <== YOU ARE HERE
│   │   ├── base.css
│   │   └── group.css
│   ├── card/                #    - Card Component
│   │   ├── base.css
│   │   ├── content.css      #    - Slots & Padding
│   │   ├── media.css        #    - Full-bleed Media
│   │   └── subgrid.css      #    - Subgrid Support
│   ├── button.css           #    - Aggregator
│   ├── card.css             #    - Aggregator
│   ├── media.css            #    - Media Wrapper
│   ├── link.css             #    - Link Wrapper
│   └── patterns.css         #    - Entry Point
│
├── layout/                  # 4. LAYOUT (The Skeleton)
│   ├── grid/                #    - Grid Engine
│   │   ├── base.css         #    - Core Logic
│   │   ├── columns.css      #    - Presets
│   │   ├── subgrid.css      #    - Smart Grid
│   │   ├── recipes.css      #    - Smart Logic (.masonry .g-row)
│   │   └── item.css         #    - Child Logic
│   ├── flex/                #    - Flex Engine
│   │   ├── base.css         #    - Core Logic
│   │   ├── alignment.css    #    - Alignment Tools
│   │   ├── gaps.css         #    - Smart Gaps
│   │   └── item.css         #    - Child Logic
│   ├── container.css        #    - Container Queries (.c)
│   ├── flex.css             #    - Entry Point
│   ├── grid.css             #    - Entry Point
│   └── section.css          #    - Structural Layout
│
├── theming/                 # 5. THEMING (The Skin)
│   ├── set.css
│   └── overlay.css
│
├── typography/              # 6. TYPOGRAPHY (The Voice)
│   ├── title.css
│   ├── text.css
│   └── text-align.css
│
└── utilities/               # 7. UTILITIES (The Tools)
    ├── display.css
    ├── position.css
    ├── overflow.css
    ├── margin.css
    ├── padding.css
    ├── radius.css
    ├── size.css             #    - Size Utilities
    ├── blur.css
    └── utilities.css
```
