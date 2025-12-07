# Layout Module

The **Layout Module** provides the structural foundation for your application. It includes a robust **Grid** system, a comprehensive **Flexbox** utility, and a powerful **Section** component that handles container widths and spacing automatically. All layouts are fully responsive, leveraging container queries to adapt to their parent context rather than just the viewport.

## 📦 Installation

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`layout`** | [src](https://ucss.unqa.dev/stable/lib/layout.css) • [clean](https://ucss.unqa.dev/stable/lib/layout.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout.css) • [clean](https://ucss.unqa.dev/latest/lib/layout.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout.min.css) |

### Individual Files

| File | Description | Stable | Latest |
| :--- | :--- | :--- | :--- |
| `section.css` | Root Sections (`.s`) | [src](https://ucss.unqa.dev/stable/lib/layout/section.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/section.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/section.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/section.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/section.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/section.min.css) |
| `grid.css` | Grid System (`.g`) | [src](https://ucss.unqa.dev/stable/lib/layout/grid.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/grid.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/grid.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/grid.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/grid.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/grid.min.css) |
| `flex.css` | Flex Utilities (`.f`) | [src](https://ucss.unqa.dev/stable/lib/layout/flex.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/flex.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/flex.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/flex.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/flex.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/flex.min.css) |

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
| `.s__w` | Wide .sc container (1440px). |
| `.s__xw` | Extra wide .sc container (1600px). |
| `.s__uw` | Ultra wide .sc container (1920px). |
| `.s__f` | Full width .sc container (100%). |
| `.s__h` | Header medium width .scc container (64rem). |
| `.s__hw` | Header wide .scc container (72rem). |
| `.s__hn` | Header narrow .scc container (56rem). |
| `.s__c` | Content medium width .scc container (48rem - blog posts). |
| `.s__cw` | Content wide .scc container (56rem). |
| `.s__cn` | Content narrow .scc container (40rem). |
| `.pb--s`, `.pb--xs` | Reduced vertical padding. |
| `.gap--s`, `.gap--xs` | Reduced gap. |

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
