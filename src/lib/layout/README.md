# Layout Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Layout](./)

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](./) | [Theming](../theming/) | [Typography](../typography/) | [Patterns](../patterns/) | [Utilities](../utilities/)

> **Context-Aware Layouts**. The Layout module is the structural backbone of uCss. It discards the obsolete "12-column global grid" for a modern, component-driven approach powered by **Container Queries**, **Fluid Spacing**, and **Implicit Grids**. It ensures your components look perfect whether they are on a 4K screen or squeezed into a 300px sidebar.

---

## 📑 Contents

*   [🌟 Overview](#-overview)
*   [🤯 Philosophy](#-philosophy)
    *   [Viewport vs Container](#viewport-vs-container)
    *   [Implicit vs Explicit](#implicit-vs-explicit)
    *   [The Death of Media Queries](#the-death-of-media-queries)
*   [🚀 Getting Started](#-getting-started)
    *   [The "Clicked" Moment](#the-clicked-moment)
    *   [Rollout in 5 Seconds](#rollout-in-5-seconds)
*   [📦 Installation & Stats](#-installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [Direct Links](#direct-links)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#-files-reference)
*   [🧠 Deep Dive](#-deep-dive)
    *   [1. The Logic of Container Queries](#1-the-logic-of-container-queries)
    *   [2. Section Architecture (`.s`)](#2-section-architecture-s)
    *   [3. Implicit Auto-Fit Grids (`.g`)](#3-implicit-auto-fit-grids-g)
    *   [4. The Flex System (`.f`)](#4-the-flex-system-f)
    *   [5. Variable API (Advanced)](#5-variable-api-advanced)
*   [📍 Reference: Content Map](#-reference-content-map)
    *   [Section Classes (`.s`)](#section-classes-s)
    *   [Grid Classes (`.g`)](#grid-classes-g)
    *   [Flex Classes (`.f`)](#flex-classes-f)
    *   [Alignment Cheatsheet](#alignment-cheatsheet)
    *   [Spacing Scale](#spacing-scale)
*   [💡 Best Practices & Customization](#-best-practices--customization)
    *   [Grid vs Flex: The Golden Rule](#grid-vs-flex-the-golden-rule)
    *   [Real World Examples](#real-world-examples)
*   [🔧 For Developers](#-for-developers)

---

## 🌟 Overview

The **Layout Module** provides three core primitives that cover 99% of web layout needs.

1.  **Section (`.s`)**: The outer wrapper. Handles max-widths, background inheritance, and vertical padding.
2.  **Grid (`.g`)**: The 2D layout engine. Handles columns, rows, and heavy lifting.
3.  **Flex (`.f`)**: The 1D layout engine. Handles alignment, bars, and stacking.

### Top Features
1.  **Container Query Native**: Every `.g` and `.f` element sets its parent as a container. Children can also query the parent's size to adjust their behavior.
2.  **Zero-Config Auto-Fit**: The `.g` class automatically calculates how many columns fit based on the item's minimum width (`--g-min`, 256px by default).
3.  **Fluid Spacing Engine**: All gaps (`--g-gap`, `--f-gap`) use `clamp()` functions. Layouts breathe on desktop and tighten on mobile automatically.
4.  **Subgrid Support**: Use `.sg` to align grandchildren to the main grid, enabling complex layouts like card headers aligning across different cards.

> [!LIGHTBULB]
> **Why `auto-fit`?**
> Traditional grids force you to write `.col-12 .col-md-6 .col-lg-4`.
> uCss grids just need `<div class="g">`. The browser does the math.

---

## 🤯 Philosophy

### Viewport vs Container
*   **Viewport Thinking (Old)**: "I am on a phone, so this card should be full width."
*   **Container Thinking (New)**: "I have less than 400px of space, so this card should be full width."

This distinction is crucial. It means you can put a "Mobile Layout" card inside a "Desktop Sidebar" and it works perfectly without code duplication. It decouples the Component from the Page.

### Implicit vs Explicit
*   **Explicit**: You define every row and column manually. (Good for Art Direction).
*   **Implicit**: You define the *constraints* (min-width, gap) and let the browser generate the rows/cols. (Good for Application UI).

uCss defaults to **Implicit**, but allows Explicit overrides (`.g-3`) when you absolutely need them.

### The Death of Media Queries
Media queries are Global State. They are hard to maintain.
Container Queries are Local State. They are easy to maintain.
uCss aims to reduce your Media Query usage by 90%.

---

## 🚀 Getting Started

### The "Clicked" Moment
1.  Create a grid: `<div class="g">`.
2.  Add 5 items.
3.  Resize the window.
4.  Notice how they flow from 5 columns -> 4 -> 3 -> 2 -> 1 automatically.
5.  Now override it: `<div class="g" style="--g-min: 100px">`.
6.  Notice they pack in tighter. You are controlling the *constraint*, not the column count.

### You Can Literally Rollout in 1 Minnute
1.  **Load**: `layout.min.css`.
2.  **Structure**:
    ```html
    <section class="s cs">
      <div class="g gap-xl">
         <!-- Your content flows here -->
         <div>Item 1</div>
         <div>Item 2</div>
      </div>
    </section>
    ```

Done!

---

## 📦 Installation & Stats

### Bundle Stats

| File | Full (Raw) | Clean | Min | Gzip | Brotli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`layout.css` (Aggregator)** | **~70 KB** | **~67 KB** | **~57 KB** | **~7.0 KB** | **~5.2 KB** |
| `grid.css` | 36 KB | 35 KB | 29 KB | 3.8 KB | 2.8 KB |
| `flex.css` | 26 KB | 25 KB | 21 KB | 2.4 KB | 1.9 KB |
| `section.css` | 8 KB | 7 KB | 6 KB | 1.4 KB | 1.1 KB |

### Direct Links

| Module | Full Source | Clean Source | Minified (Prod) |
| :--- | :--- | :--- | :--- |
| **Layout** | [layout.css](https://ucss.unqa.dev/stable/lib/layout.css) | [layout.clean.css](https://ucss.unqa.dev/stable/lib/layout.clean.css) | [layout.min.css](https://ucss.unqa.dev/stable/lib/layout.min.css) |

### HTML Snippets

#### Standard
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout.min.css">
```

#### Prefixed (`/p/`)
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/p/lib/layout.min.css">
```

---

## 📂 Files Reference

| File | Description | Download |
| :--- | :--- | :--- |
| **`section.css`** | **Page Wrapper**. `.s` handles the root constraints, background inheritance, and vertical padding. | [src](https://ucss.unqa.dev/stable/lib/layout/section.css) |
| **`grid/base.css`** | **Grid Engine**. The core logic for `.g` and `auto-fit`. | [src](https://ucss.unqa.dev/stable/lib/layout/grid/base.css) |
| **`grid/columns.css`** | **Explicit Cols**. Classes like `.g-1` to `.g-12` that override auto-fit. | [src](https://ucss.unqa.dev/stable/lib/layout/grid/columns.css) |
| **`grid/subgrid.css`** | **Subgrid**. `.sg`, `.sgc` to accept parent tracks. | [src](https://ucss.unqa.dev/stable/lib/layout/grid/subgrid.css) |
| **`flex.css`** | **Flexbox**. `.f` toolkit for 1D arrays and alignment. | [src](https://ucss.unqa.dev/stable/lib/layout/flex.css) |

---

## 🧠 Deep Dive

### 1. The Logic of Container Queries
We use `container-type: inline-size` on `.g` and `.f` parents `.g{ :has(& > & {container-type: inline-size;})}`.
This allows us to leverage **Container Query Units** (`cqw`) internally if needed, but primarily it enables children to query the parent.

**Implementation**:
```css
.g, .f {
    :where(:has(> &)) {
        container-type: inline-size;
        container-name: layout;
    }
}
```
*   **Safety**: We do *not* apply this indiscriminately. It is opt-in via these layout classes.
*   **Recursion**: Be careful nesting generic containers. uCss handles standard nesting gracefully.

### 2. Section Architecture (`.s`)
The `.s` class employs a "Smart Wrapper" technique.
*   **Background**: Inherited from `.set` (Theming).
*   **Constraint**: It looks for a direct child.
    *   `> *` (Direct Child) gets `max-width: var(--sc-max-w)`.
    *   This centers content while allowing the Section background to span full-width.
*   **(*Vertical*) Padding**: `padding-block: var(--s-pb)`. This variable scales with viewport size.

### 3. Implicit Auto-Fit Grids (`.g`)
The Core Formula:
```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--g-min)), 1fr));
```
*   **`auto-fit`**: Create as many columns as possible.
*   **`minmax(...)`**: Each column must be at least `--g-min` wide.
*   **`1fr`**: If there is leftover space, share it equally.

### 4. The Flex System (`.f`)
While Grid handles structure, Flex handles *flow*.
The `.f` class enables flexbox.
It sets `gap: var(--f-gap)`.
It defaults to `flex-wrap: wrap` on small containers (Safety First).

### 5. Variable API (Advanced)

uCss exposes a powerful Variable API that allows you to control layout behavior without writing new CSS classes.
This is called "Configuration over Implementation".

#### The Cascade of Truth
The variables follow a strict specificity chain:
`Interactive (@media/@container)` -> `Local Override (style="")` -> `System Default`

#### Common Variables

**Container Control**:
*   `--g-cols`: Number of columns for explicit grids (e.g., `3`).
*   `--g-min`: Minimum item width for auto-fit (e.g., `300px`).
*   `--g-gap`: Gap size (e.g., `2rem`).

**Item Control** (Applied to children):
*   `--gi-col`: Column span (e.g., `span 2`).
*   `--gi-row`: Row span.
*   `--fi-grow`: Flex grow factor (e.g., `1`).
*   `--fi-shrink`: Flex shrink factor.

**Responsive Chaining**:
Almost every variable has responsive counterparts:
*   `--g-cols` (Default)
*   `--g-cols--sm` (Small Containers)
*   `--g-cols--md` (Medium Containers)
*   `--g-cols--lg` (Large Containers)

**Example**:
```html
<!-- 
  Logic: 
  Default: 4 Columns
  Small Container: 2 Columns
  Tiny Container: 1 Column
-->
<div class="g" style="--g-cols: 4; --g-cols--md: 2; --g-cols--sm: 1">
  <!-- Items -->
</div>
```

---

## 📍 Reference: Content Map

### 1. Section (`.s`)
The foundational building block for page structures. It manages:
1.  **Vertical Padding**: Fluid `clamp()` padding (top/bottom) that scales with screen size.
2.  **Horizontal Constraints**: Keeps content within a max-width (default `1366px`) while maintaining safe edges (default `5%`).
3.  **Structure**: `.s` (Outer) -> `.sc` (Container) -> `.scc` (Child). If you omit the container, direct children are automatically treated as containers (exceptions: '.o', 'figure', 'img', 'style').

#### Modifiers

| Class | Description |
| :--- | :--- |
| `.s` | **Section** outer wrapper. 100% width. Fluid vertical padding. |
| `.s__w` | Wide inner (.s > *) **Container**  (1440px). |
| `.s__xw` | Extra wide inner (.s > *) **Container** (1600px). |
| `.s__uw` | Ultra wide inner (.s > *) **Container** (1920px). |
| `.s__f` | Full width inner (.s > *) **Container** (100%). |
| `.s__c` | Inner container **Content** (.s > * > *) with medium width  (48rem - blog posts). |
| `.s__cw` | Inner container **Content** (.s > * > *) with wide width (56rem). |
| `.s__cn` | Inner container **Content** (.s > * > *) with narrow width (40rem). |
| `.s__h` | Inner container **Header** (.s > * > *) content with medium width  (64rem). |
| `.s__hw` | Inner container **Header** (.s > * > *) content with wide width (72rem). |
| `.s__hn` | Inner container **Header** (.s > * > *) content with narrow width (56rem). |
| `.pb--s`, `.pb--xs` | Reduced vertical padding. |
| `.gap--s`, `.gap--xs` | Reduced gap. |

#### Reference: Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `--s-bg` | `--set-bg` | Background color. |
| `--s-pb` | `clamp(...)` | Vertical padding (start/end). |
| `--s-pi` | `5%` | Horizontal padding (start/end). |
| `--sc-max-w` | `1366px` | Max width of the inner container `.sc`. |
| `--s-gap` | `clamp(...)` | Gap between direct children of `.s`. |
| `--sc-gap` | `clamp(...)` | Gap between direct children of `.s > *` (.sc). |
| `--scc-gap` | `clamp(...)` | Gap between direct children of `.s > * > *` (.scc). |

#### Usage Examples

##### Standard Section
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

##### Full Width Background, Constrained Content
```html
<section class="s set dark">
  <div class="sc">
    <h2 class="t">I am inside the max-width</h2>
  </div>
</section>
```

### Grid Classes (`.g`)
A powerful, responsive grid system. Defaults to **Auto-Fit**, meaning columns naturally stretch to fill space.

#### Features
*   **Auto-Fit**: Defined by minimum sizes (e.g., `256px`), not fixed columns. Items wrap automatically.
*   **Fixed Columns**: Override auto-fit with `.g-1`, `.g-2`, `.g-3`, `.g-4`, `.g-1-2`, `.g-2-1`, `.g-3-2`, `.g-2-3`.
*   **Smart Grid**: Support for subgrids (`.sg` for rows, `.sgc` for columns).
*   **Adaptive**: Gap scales with viewport size.

#### Responsive Column Classes
Classes like `.g-2` or `.g-3` can take responsive suffixes (`--lg`, `--md`, `--sm`).

| Class | Name | Behavior |
| :--- | :--- | :--- |
| **`.g`** | **Grid** | Auto-fit grid. |
| **`.g-1`** | **1 Col** | Force 1 column. |
| **`.g-2`** | **2 Cols (Predefined Behavior)** | Force 2 columns on large containers. |
| **`.g-3`** | **3 Cols (Predefined Behavior)** | Force 3 columns on large containers. |
| **`.g-4`** | **4 Cols (Predefined Behavior)** | Force 4 columns on large and 2 on medium containers. |
| **`.g-12`** | **12 Cols (Predefined Behavior)** | Force 12 columns on large and 6 on medium containers (Complex layouts). |
| **`.g-1-2`** | **1/3 - 2/3** | Asymmetrical layout. |
| **`.g-2-1`** | **2/3 - 1/3** | Asymmetrical layout. |
| **`.g-2--md`** | **2 Cols (Medium)** | Force 2 columns on medium containers only. |
| **`.g-2--lg`** | **2 Cols (Large)** | Force 2 columns on large containers. |
| **`.g-2--sm`** | **2 Cols (Small)** | Force 2 columns on small containers. |
| **`.g-2--smd`** | **2 Cols (Small AND Medium)** | Force 2 columns on small and medium containers. |
| **`.g-3--mdl`** | **3 Cols (Medium AND Large)** | Force 3 columns on medium and large containers. |

#### Reference: Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `--g-cols-template` | repeat(var(--g-cols), minmax(var(--g-min), 1fr))` | Default grid-template-columns value. |
| `--g-cols` | `auto-fit` | Number of columns (or `auto-fit`). |
| `--g-min` | `256px` | Minimum item width for auto-fit calculations. |
| `--g-gap` | `clamp(...)` | Gap between grid items. |
| `--gi-col` | `auto` | Column span for a child item (e.g., `span 2`). |
| `--gi-row` | `auto` | Row span for a child item. |

#### Usage Examples

##### Auto-Responsive Card Grid
No media queries needed. Cards will be at least `256px` wide, filling the row.
```html
<div class="g">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

### Flex Classes (`.f`)
A comprehensive flexbox utility toolkit.

| Class | Name | Behavior |
| :--- | :--- | :--- |
| **`.f`** | **Flex** (Row) | `display: flex`. Default `row`. |
| **`.col`** | **Column** | `flex-direction: column`. |
| **`.row`** | **Row** | `flex-direction: row`. |
| **`.wrap`** | **Wrap** | `flex-wrap: wrap`. |
| **`.nowrap`** | **No Wrap** | `flex-wrap: nowrap`. |

#### Alignment Cheatsheet
*Works on both Grid and Flex parents*

| Class | CSS Property | Value | Visual Meaning |
| :--- | :--- | :--- | :--- |
| **`.ai-c`** | `align-items` | `center` | Center Vertical (in Row) |
| **`.ai-s`** | `align-items` | `start` | Top (in Row) |
| **`.ai-e`** | `align-items` | `end` | Bottom (in Row) |
| **`.ai-st`** | `align-items` | `stretch` | Stretch to fill Height |
| **`.jc-c`** | `justify-content` | `center` | Center Horizontal (in Row) |
| **`.jc-sb`** | `justify-content` | `space-between` | Push to Edges |
| **`.jc-sa`** | `justify-content` | `space-around` | Equal Distr. |
| **`.jc-e`** | `justify-content` | `end` | Right Align |
| **`.as-c`** | `align-self` | `center` | Center *Self* |
| **`.as-s`** | `align-self` | `start` | Top *Self* |
| **`.as-e`** | `align-self` | `end` | Bottom *Self* |

#### Spacing Scale
*Used for gaps (`.gap-*`)*

| Mod | Variable | Default | Logic |
| :--- | :--- | :--- | :--- |
| **`--xxs`** | `--g-gap--xxs` | `2px` | Hairline |
| **`--xs`** | `--g-gap--xs` | `0.25rem` | Tiny |
| **`--s`** | `--g-gap--s` | `0.5rem` | Tight |
| **Default** | `--g-gap` | `1.5rem` | Standard |
| **`--l`** | `--g-gap--l` | `2.5rem` | Loose |
| **`--xl`** | `--g-gap--xl` | `4rem` | Airy |
| **`--xxl`** | `--g-gap--xxl` | `8rem` | Massive |

#### Reference: Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `--f-d` | `flex` | Display type (flex). |
| `--f-fd` | `row` | Flex direction. |
| `--f-gap` | `clamp(...)` | Gap between items. |
| `--f-ai` | `stretch` | Align items (cross axis). |
| `--f-jc` | `flex-start` | Justify content (main axis). |
| `--fi-grow` | `0` | Child grow factor. |
| `--fi-shrink` | `1` | Child shrink factor. |
| `--fi-basis` | `auto` | Child basis. |
| `--fi-o` | `0` | Child order. |

#### Responsive Suffixes
All flex variables and classes support `--sm`, `--md`, and `--lg` (e.g., `.col--sm`, `.col--md`, `.col--lg`, `--f-gap--sm`, `--f-gap--md`, `--f-gap--lg`).

#### Usage Examples

##### Navbar
Row layout with space-between.
```html
<nav class="row jc-sb ai-c">
  <div class="logo">Logo</div>
  <div class="links f gap-m">
    <a href="#">Home</a>
    <a href="#">About</a>
  </div>
</nav>
```

##### Media Object (Stack on Mobile, Row on Desktop)
```html
<div class="f col row--mdl gap-m ai-c">
  <img src="avatar.jpg" alt="User">
  <div>
    <h3 class="t">User Name</h3>
    <p class="tx">Bio text...</p>
  </div>
</div>
```

---

## 💡 Best Practices & Customization

### Grid vs Flex: The Golden Rule
*   **Use Grid (`.g`)** when you want items to be **Columns**. You care about the *width* and *placement* of items (2D).
*   **Use Flex (`.f`)** when you want items to be a **Stream**. You care about the *flow* and *alignment* of items (1D).

**Example**:
*   A Gallery of images: **Grid**.
*   A Navigation Bar: **Flex**.
*   A Media Object (Image + Text side-by-side): **Flex** (usually) or **Grid** (if strict sizing needed).

### Real World Examples

#### The Dashboard Shell (Holy Grail)
```html
<div class="g g-12 min-h-screen">
  <!-- Sidebar: 3 cols -->
  <aside style="grid-column: span 3" class="bg-dark">
      <nav class="f col gap-m">...</nav>
  </aside>

  <!-- Main: 9 cols -->
  <main style="grid-column: span 9" class="pd-l">
      <h1>Dashboard</h1>
      
      <!-- Stats Row: Auto-Fit -->
      <div class="g gap-m">
         <div class="card">Stat 1</div>
         <div class="card">Stat 2</div>
         <div class="card">Stat 3</div>
      </div>
  </main>
</div>
```

#### The "Split Hero"
```html
<section class="s">
    <div class="g g-2-1 gap-xl ai-c">
        <!-- Content Side (66%) -->
        <div class="f col gap-m">
            <h1 class="t xl">Headline</h1>
            <p class="tx l">Subhead</p>
        </div>
        <!-- Image Side (33%) -->
        <div class="f jc-c">
            <img src="hero.png">
        </div>
    </div>
</section>
```

---

## 🔧 For Developers

*   **Subgrid Note**: `.sg` (Subgrid) only works in browsers that support it (Firefox, Chrome 117+, Safari 16+). uCss does *not* provide a polyfill for subgrid as it would require heavy JS.
*   **Variables**:
    *   `--g-min`: Control auto-fit threshold. (Default: ~250px)
    *   `--g-gap`: Control standard grid gap. (Default: Clamp)
    *   `--f-gap`: Control standard flex gap. (Default: Clamp)
    *   `--sc-max-w`: Section Box Width. (Default: ~1200px)

---

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Layout](./) 

[Back to top](#)
