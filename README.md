# uCss Framework

uCss is a modern, mobile-first, pure CSS framework designed for granular control, responsiveness, and flexibility. It leverages **CSS Variables** and **Container Queries** to provide a highly adaptable styling API without the need for complex build steps or JavaScript.

## Core Concepts

### 1. Variable-Driven API
Every component in uCss exposes a set of CSS variables (e.g., `--btn-bg`, `--g-cols`) that allow you to override styles at any level—globally, within a specific container, or inline on an element.

### 2. Container Queries
uCss uses container queries (`@container`) instead of media queries for layout components. This means components adapt based on the size of their *parent container*, not just the viewport, making them truly modular and portable.

*   **sm**: Small containers (default / mobile-first)
*   **md**: Medium containers (`669.99px` - `999.99px`)
*   **lg**: Large containers (`> 999.99px`)

### 3. Granular Control
You can control properties for specific breakpoints by appending `--sm`, `--md`, or `--lg` to the variable name (e.g., `--g-cols--lg`).

---

## Components & Utilities

### Grid (`.g`)
A powerful grid system based on `display: grid`.

**Class:** `.g`

**Key Properties:**
| Property | Variable | Description |
| :--- | :--- | :--- |
| Columns | `--g-cols` | Number of columns (default: `auto-fit`) |
| Gap | `--g-gap` | Gap between items |
| Column Gap | `--g-col-gap` | Specific column gap |
| Row Gap | `--g-row-gap` | Specific row gap |
| Align Items | `--g-ai` | `start`, `center`, `end`, `stretch` |
| Justify Content | `--g-jc` | `start`, `center`, `end`, `space-between` |

**Responsive Modifiers:**
*   Use `--g-cols--md`, `--g-cols--lg` to change columns at different widths.
*   Helper classes: `.g-1`, `.g-2`, `.g-3`, `.g-1-2` (1/3 - 2/3 split), etc.
*   Responsive helpers: `.g-2--lg` (2 cols on large), `.g-1--md` (1 col on medium).

#### Example: Responsive Grid
**Goal:** 2 columns on desktop, 1 column on tablet and mobile.

**Method 1: Utility Classes**
```html
<div class="g g-2--lg g-1--md">
  <div class="crd">Item 1</div>
  <div class="crd">Item 2</div>
  <div class="crd">Item 3</div>
  <div class="crd">Item 4</div>
</div>
```

**Method 2: CSS Variables**
```css
.my-grid {
  --g-cols--lg: 2;
  --g-cols--md: 1; /* Applies to md and smaller if not overridden */
}
```
```html
<div class="g my-grid">...</div>
```

---

### Flex (`.f`)
A flexible box layout system.

**Class:** `.f`

**Key Properties:**
| Property | Variable | Description |
| :--- | :--- | :--- |
| Direction | `--f-fd` | `row`, `column` |
| Wrap | `--f-fw` | `wrap`, `nowrap` |
| Gap | `--f-gap` | Gap between items |
| Align Items | `--f-ai` | `start`, `center`, `end`, `stretch` |
| Justify Content | `--f-jc` | `start`, `center`, `end`, `space-between` |

**Helper Classes:**
*   `.col`: Sets `flex-direction: column`
*   `.row`: Sets `flex-direction: row`
*   `.ai-c`, `.jc-c`, `.jc-sb`: Alignment utilities.

---

### Buttons (`.btn`)
Highly customizable buttons.

**Class:** `.btn`

**Key Properties:**
| Property | Variable | Description |
| :--- | :--- | :--- |
| Background | `--btn-bg` | Background color |
| Text Color | `--btn-color` | Text color |
| Padding | `--btn-p` | Padding (e.g., `.75em 1.5em`) |
| Radius | `--btn-rad` | Border radius |
| Font Size | `--btn-font-s` | Font size |

**Variants:**
*   `.primary`, `.secondary`, `.plain`, `.outlined`
*   `.dark`, `.light`
*   Sizes: `.sm`, `.lg`
*   Radius: `.sq` (square), `.rd` (round)

#### Example: Dark Button
**Goal:** Create a dark-themed button.

**Method 1: Variant Class**
```html
<button class="btn dark">Dark Button</button>
```

**Method 2: Custom Variables**
```html
<button class="btn" style="--btn-bg: #000; --btn-color: #fff;">
  Custom Dark Button
</button>
```

---

### Cards (`.crd`)
A versatile card component with slots for media, content, header, body, and footer.

**Class:** `.crd`

**Structure:**
```html
<article class="crd">
  <div class="crd__media">
    <img src="..." alt="...">
  </div>
  <div class="crd__content">
    <header class="crd__header">...</header>
    <div class="crd__body">...</div>
    <footer class="crd__footer">...</footer>
  </div>
</article>
```

**Key Properties:**
| Property | Variable | Description |
| :--- | :--- | :--- |
| Background | `--crd-bg` | Card background color |
| Padding | `--crd-p` | Padding for content |
| Gap | `--crd-gap` | Gap between elements |
| Media Ratio | `--crd-med-ar` | Aspect ratio of the media slot |

---

### Typography (`.t` & `.tx`)
**Headings (`.t`)**: For `h1` - `h4`.
*   **Sizes**: `.xxxl` down to `.xxxs`.
*   **Weights**: `.ub` (900), `.xb` (800), `.bd` (700), `.sb` (600), `.md` (500), `.rg` (400), `.lt` (300).
*   **Variables**: `--t-font-s`, `--t-fw`, `--t-color`.

**Text (`.tx`)**: For body text (`p`, `span`, etc.).
*   **Sizes**: `.xxl` down to `.xxxs`.
*   **Variables**: `--tx-font-s`, `--tx-color`, `--tx-line-h`.

---

### Section (`.s`)
A layout container for page sections.

**Class:** `.s`

**Inner Container:** `.sc` (Section Content) - limits max-width.

**Key Properties:**
| Property | Variable | Description |
| :--- | :--- | :--- |
| Padding Block | `--s-pb` | Vertical padding |
| Padding Inline | `--s-pi` | Horizontal padding |
| Background | `--s-bg` | Section background |
| Content Width | `--scc-max-w` | Max width of inner content |

**Width Helpers:**
*   `.s_h`: Header width (~64rem)
*   `.s_c`: Content width (~48rem)
*   `.s_cw`: Wide content (~56rem)

---

### Overlay (`.o`)
Utility for overlays, background images, or covering elements.

**Class:** `.o`

**Variants:**
*   `.l`: Light overlay
*   `.d`: Dark overlay
*   `.lt`: Light opacity
*   `.bd`: Bold (higher) opacity

**Key Properties:**
| Property | Variable | Description |
| :--- | :--- | :--- |
| Opacity | `--o-op` | Opacity of the element |
| Layer Color | `--o-l-bg` | Background color of the overlay layer |
| Layer Opacity | `--o-l-op` | Opacity of the overlay layer |

---

### Settings (`.set`)
Scopes theme variables for a section of the UI.

**Class:** `.set`

**Variants:** `.primary`, `.secondary`, `.dark`, `.light`.

**Usage:**
Wrapping a section in `<div class="set dark">...</div>` will automatically update text colors, headings, and links inside to be appropriate for a dark background.

---

## Installation

Import the CSS files from the `src/css` directory into your main stylesheet or build process.

```css
@import 'src/css/var.css';
@import 'src/css/set.css';
@import 'src/css/g.css';
@import 'src/css/f.css';
@import 'src/css/s.css';
@import 'src/css/crd.css';
@import 'src/css/btn.css';
@import 'src/css/t.css';
@import 'src/css/tx.css';
@import 'src/css/o.css';
/* ... other files ... */
```