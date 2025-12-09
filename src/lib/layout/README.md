# Layout Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Layout](./) 

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](./) | [Theming](../theming/) | [Typography](../typography/) | [Components](../components/) | [Utilities](../utilities/)

> **Context-Aware Layouts**. A powerful engine built on **Container Queries**. Includes a fluid Section (`.s`) wrapper, a variable-based Flexbox (`.f`) toolkit, and an Auto-Fit Grid (`.g`) system. Highly customizable and controllable per container size and property, it adapts layout based on *available space*, not viewport width.

---

## 📑 Page Contents
*   [Installation & Bundle Stats](#-installation-bundle-stats)
*   [Section (`.s`)](#1-section-s)
*   [Grid (`.g`)](#2-grid-g)
*   [Flex (`.f`)](#3-flex-f)

---

## Layout Module

The **Layout Module** provides the structural foundation for your application. It includes a robust **Grid** system, a comprehensive **Flexbox** utility, and a powerful **Section** component that handles container widths and spacing automatically. All layouts are fully responsive, leveraging container queries to adapt to their parent context rather than just the viewport.

### Philosophy: The Container is King
We heavily suppress the use of `@media` queries in favor of `@container` queries.
*   **Why?**: Media queries make assumptions about the "Fold". They assume if the screen is 1200px, you have 1200px of space. But what if your component is in a sidebar split?
*   **The Result**: A `.g-3` (3-column grid) will naturally collapse to 2 or 1 column *if the container it is in gets too small*, regardless of the window width. You don't have to manage this manually.

### 🧠 Thinking in Layout
1.  **Don't micromanage pixels**: Trust the `auto-fit` algorithms.
2.  **Parent Controls Children**: In uCss, the parent (Grid/Flex) usually dictates the child's width. The child just exists.
3.  **Implicit over Explicit**: Use `.g` (auto) first. Only reach for `.g-3` (fixed) if you absolutely need rigid columns.

### Choosing the Right Tool
*   **Use Grid (`.g`) when**: You want a 2D layout (rows AND columns). You want strict alignment. You want items to wrap onto new lines automatically with equal width.
*   **Use Flex (`.f`) when**: You want a 1D layout (a row OR a column). You have content of varying sizes (like a navbar with a logo and links).
*   **Use Section (`.s`) when**: You are defining the root wrapper of a page stripe.

## 📦 Installation & Bundle Stats

| File | Full | Clean | Min | Gzip | Brotli | Download |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`layout.css`** | ~70KB | ~67KB | ~57KB | ~7.1KB | ~5.2KB | [src](https://ucss.unqa.dev/stable/lib/layout.css) • [clean](https://ucss.unqa.dev/stable/lib/layout.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout.min.css) |
| **`grid.css`** | ~36KB | ~35KB | ~29KB | ~3.8KB | ~2.8KB | [src](https://ucss.unqa.dev/stable/lib/layout/grid.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/grid.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/grid.min.css) |
| **`flex.css`** | ~26KB | ~25KB | ~21KB | ~2.4KB | ~1.9KB | [src](https://ucss.unqa.dev/stable/lib/layout/flex.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/flex.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/flex.min.css) |
| **`section.css`** | ~8.1KB | ~7.0KB | ~6.1KB | ~1.4KB | ~1.1KB | [src](https://ucss.unqa.dev/stable/lib/layout/section.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/section.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/section.min.css) |


> [!TIP]
> **Encapsulation**: uCss supports automatic prefixing (e.g., `.u-btn`). See [Encapsulation & Prefixing](../../../README.md#encapsulation--prefixing-new) for build instructions.

### HTML Copy & Paste

| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`layout.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout.min.css">` |
| **`grid.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout/grid.min.css">` |
| **`flex.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout/flex.min.css">` |
| **`section.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout/section.min.css">` |

---

## 1. Section (`.s`)
The foundational building block for page structures. It manages:
1.  **Vertical Padding**: Fluid `clamp()` padding (top/bottom) that scales with screen size.
2.  **Horizontal Constraints**: Keeps content within a max-width (default `1366px`) while maintaining safe edges (default `5%`).
3.  **Structure**: `.s` (Outer) -> `.sc` (Container) -> `.scc` (Child). If you omit the container, direct children are automatically treated as containers (exceptions: '.o', 'figure', 'img', 'style').

### Modifiers

| Class | Description |
| :--- | :--- |
| `.s` | Base section. |
| `.s__w` | Wide (.s > *) .sc container (1440px). |
| `.s__xw` | Extra wide (.s > *) .sc container (1600px). |
| `.s__uw` | Ultra wide (.s > *) .sc container (1920px). |
| `.s__f` | Full width (.s > *) .sc container (100%). |
| `.s__h` | Header medium width (.s > * > *) .scc container (64rem). |
| `.s__hw` | Header wide (.s > * > *) .scc container (72rem). |
| `.s__hn` | Header narrow (.s > * > *) .scc container (56rem). |
| `.s__c` | Content medium width (.s > * > *) .scc container (48rem - blog posts). |
| `.s__cw` | Content wide (.s > * > *) .scc container (56rem). |
| `.s__cn` | Content narrow (.s > * > *) .scc container (40rem). |
| `.pb--s`, `.pb--xs` | Reduced vertical padding. |
| `.gap--s`, `.gap--xs` | Reduced gap. |

### Reference: Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `--s-bg` | `--set-bg` | Background color. |
| `--s-pb` | `clamp(...)` | Vertical padding (start/end). |
| `--s-pi` | `5%` | Horizontal padding (start/end). |
| `--sc-max-w` | `1366px` | Max width of the inner container `.sc`. |
| `--s-gap` | `clamp(...)` | Gap between direct children of `.s`. |
| `--sc-gap` | `clamp(...)` | Gap between direct children of `.s > *` (.sc). |
| `--scc-gap` | `clamp(...)` | Gap between direct children of `.s > * > *` (.scc). |

### Usage Examples

#### Standard Section
```html
<section class="s">
  <!-- Content is automatically centered and constrained -->
  <div>
    <h2 class="t">Section Title</h2>
    <div class="g g-3">
      <!-- Grid Items -->
    </div>
  </div>
</section>
```

#### Full Width Background, Constrained Content
```html
<section class="s set dark">
  <div class="sc">
    <h2 class="t">I am inside the max-width</h2>
  </div>
</section>
```

---

## 2. Grid (`.g`)
A powerful, responsive grid system. Defaults to **Auto-Fit**, meaning columns naturally stretch to fill space.

### Features
*   **Auto-Fit**: Defined by minimum sizes (e.g., `256px`), not fixed columns. Items wrap automatically.
*   **Fixed Columns**: Override auto-fit with `.g-1`, `.g-2`, `.g-3`, `.g-4`, `.g-1-2`, `.g-2-1`, `.g-3-2`, `.g-2-3`.
*   **Smart Grid**: Support for subgrids (`.sg` for rows, `.sgc` for columns).

### Fixed Column Classes
Classes like `.g-2` or `.g-3` can take responsive suffixes (`--lg`, `--md`, `--sm`).

| Class | Columns |
| :--- | :--- |
| `.g-1` | 1 Column |
| `.g-2` | 2 Columns |
| `.g-3` | 3 Columns |
| `.g-4` | 4 Columns |
| `.g-1-2` | 1/3 + 2/3 Split |
| `.g-2-1` | 2/3 + 1/3 Split |
| `.g-2-3` | 2/5 + 3/5 Split |
| `.g-3-2` | 3/5 + 2/5 Split |

### Reference: Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `--g-cols-template` | repeat(var(--g-cols), minmax(var(--g-min), 1fr))` | Default grid-template-columns value. |
| `--g-cols` | `auto-fit` | Number of columns (or `auto-fit`). |
| `--g-min` | `256px` | Minimum item width for auto-fit calculations. |
| `--g-gap` | `clamp(...)` | Gap between grid items. |
| `--gi-col` | `auto` | Column span for a child item (e.g., `span 2`). |
| `--gi-row` | `auto` | Row span for a child item. |

### Usage Examples

#### Auto-Responsive Card Grid
No media queries needed. Cards will be at least `256px` wide, filling the row.
```html
<div class="g">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

#### Feature Layout (2 Columns on Large Parent (Desktop), 1 Column on Medium and Small Parents (Tablet and Mobile))
```html
<div class="g g-1--smd g-2--lg">
  <div class="text">Left</div>
  <div class="image">Right</div>
</div>
```

---

## 3. Flex (`.f`)
A comprehensive flexbox utility toolkit.

### Class Reference

| Class | Property | Value |
| :--- | :--- | :--- |
| `.f`, `.row` | `display: flex` | Row direction (default). |
| `.col` | `display: flex` | Column direction. |
| `.wrap`, `.nowrap` | `flex-wrap` | Wrap control. |
| `.ai-c`, `.ai-s`, `.ai-e` | `align-items` | Center, Start, End. |
| `.jc-c`, `.jc-s`, `.jc-e`, `.jc-sb` | `justify-content` | Center, Start, End, Space Between. |
| `.gap`, `.gap--s`, `.gap--xs` | `gap` | Fluid gap presets. |

### Responsive Suffixes
All flex classes support `--sm`, `--md`, and `--lg` (e.g., `.col--sm`).

### Reference: Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `--f-d` | `flex` | Display type (flex). |
| `--f-fd` | `row` | Flex direction. |
| `--f-gap` | `clamp(...)` | Gap between items. |
| `--f-ai` | `stretch` | Align items (cross axis). |
| `--f-jc` | `flex-start` | Justify content (main axis). |
| `--fc-grow` | `0` | Child grow factor. |

### Usage Examples

#### Navbar
Row layout with space-between.
```html
<nav class="f row jc-sb ai-c">
  <div class="logo">Logo</div>
  <div class="links f gap-m">
    <a href="#">Home</a>
    <a href="#">About</a>
  </div>
</nav>
```

#### Media Object (Stack on Mobile, Row on Desktop)
```html
<div class="f col row--md gap-m ai-c">
  <img src="avatar.jpg" alt="User">
  <div>
    <h3 class="t">User Name</h3>
    <p class="tx">Bio text...</p>
  </div>
</div>
```
