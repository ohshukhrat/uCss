# uCss Framework

**uCss** is a modern, mobile-first, **pure CSS framework** designed for granular control, responsiveness, and flexibility. It leverages **CSS Variables** and **Container Queries** to provide a highly adaptable styling API without the need for complex build steps, JavaScript runtimes, or utility-class bloat.

## 🚀 Key Features

*   **Variable-Driven API**: Every component exposes CSS variables (e.g., `--btn-bg`, `--g-cols`) for instant overrides inline or in CSS.
*   **Container Queries Layouts**: Components like cards or grids adapt based on their *parent container size*, not the viewport, making them truly portable and modular.
*   **Zero JavaScript**: strict pure CSS implementation, no build steps required for usage.
*   **Granular Control**: Modify specific properties for specific breakpoints using structured variable suffixes (e.g., `--gap--md`).
*   **Advanced Fallbacks**: All variables resolve to "Pretty Out-of-the-Box" defaults (using `clamp()` for responsiveness) if undefined, ensuring layouts look great immediately.
*   **Themeable defaults**: `root.css` holds the global fallback values. Change one variable there (e.g., `--p`) to instantly re-theme the entire application.
*   **Mobile-First**: All utilities start from mobile defaults and expand upwards.

> [!CAUTION]
> **Container Query Gotcha**
> Do not apply `@container` context to an element that is *itself* a grid item or part of a complex layout unless necessary. Setting `container-type` on a grid item can sometimes break implicit grid auto-sizing (`auto-fit`) because the container needs definite dimensions to resolve its queries.
>
> **Safety Mechanism**: The framework automatically skips container deployment on critical parents (like `.g`) to prevent layout breakage.

> [!NOTE]
> **Compatibility**
> uCss is tested and fully compatible with **WordPress**, specifically the **Greenlight Builder** and **Blocksy Theme**.



---

## 📦 Installation & Usage

You can use uCss by including the compiled CSS files in your project.

### 1. CDN / Remote Access
We provide always-up-to-date builds hosted on our edge servers:

*   **Production (Stable)**: Use for live applications.
    ```html
    <link rel="stylesheet" href="https://ucss.unqa.dev/stable/u.min.css">
    <link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/root.css">
    ```

*   **Development (Latest)**: Contains the absolute latest changes from the `dev` branch.
    ```html
    <link rel="stylesheet" href="https://ucss.unqa.dev/latest/u.min.css">
    <link rel="stylesheet" href="https://ucss.unqa.dev/latest/lib/root.css">
    ```

### 2. Manual / Local
Clone the repository or download the `dist` folder.
1.  Copy `root.css` to your project and customize your colors/fonts.
2.  Import `u.min.css` after your root configuration.

---

## 🎨 Configuration (root.css)
The heart of uCss is `root.css`. This file defines your design tokens. **Do not edit u.css directly.** Instead, override variables in your own CSS or modifying your copy of `root.css`.

```css
:root {
  /* Brand Colors */
  --p:  hsl(43 83% 62%);  /* Primary */
  --a:  hsl(44 100% 50%); /* Accent */
  --d:  hsl(0 0% 8%);     /* Dark Base */
  --l:  hsl(0 0% 96%);    /* Light Base */

  /* Typography */
  --t-font-s: 1.125rem;   /* Base Heading Size */
  --tx-font-s: 1rem;      /* Base Body Size */
  
  /* Spacing */
  --gap: 1rem;
}
```

> [!IMPORTANT]
> **Variable Inheritance & BEM Strategy**
> Since uCss relies heavily on CSS variables, **values cascade down to children**. This is a powerful feature for theming entire sections (e.g., setting `--tx-color` on a container colors all text inside), but it can cause issues if you nest identical components.
>
> *   **The Risk**: If you set `--btn-bg: blue` on a parent, *every* button inside that parent will inherit blue unless explicitly overridden.
> *   **The Solution**: When building complex UIs, we strongly recommend combining uCss with **BEM** (Block Element Modifier). Create a specific class for your component and scope your variable overrides within that class using nested selectors.

```css
/* Recommended Approach: Component Context */
.my-card {
  /* Define variables LOCALLY for this context */
  --btn-bg: #333;
  
  /* Pinpoint children to avoid accidental leaks */
  &__submit-btn {
    --btn-bg: var(--p);
  }
}
```

---

## 🧩 Components & Utilities

### Layout

### Layout components

#### **Grid (`.g`)**
A robust, auto-responsive grid system powered by `display: grid`.
*   **Auto-Fit by Default**: `.g` uses `repeat(auto-fit, minmax(var(--g-min), 1fr))` to naturally flow items.
*   **Smart Clamps**: Gaps use `clamp()` logic to scale from mobile to desktop automatically.
*   **Subgrid Support**: Use `.sg` (Row Subgrid) or `.sgc` (Column Subgrid) to align nested children to the parent grid tracks.
*   **Properties**:
    *   `--g-cols`: Force fixed columns (e.g., `3`). Overrides auto-fit.
    *   `--g-min`: Minimum item width for auto-fit (default `256px`).
    *   `--g-gap`: Grid gap.
    *   `--g-rows-template`, `--g-cols-template`: Full template control.
*   **Responsive Modifiers**: Suffixes `--sm`, `--md`, `--lg` apply to almost all properties (e.g., `--g-cols--md`).
*   **Item Control**:
    *   `--gi-col`, `--gi-row`: Span control (e.g., `span 2`).
    *   `--gi-as`, `--gi-js`: Alignment/Justification self.

```html
<!-- Responsive auto-fit grid with 300px min items -->
<div class="g" style="--g-min: 300px"> ... </div>

<!-- Fixed 12-col grid for complex layouts -->
<div class="g" style="--g-cols: 12; --g-gap: 2rem">
  <div style="--gi-col: span 8">Main</div>
  <div style="--gi-col: span 4">Sidebar</div>
</div>
```

#### **Flex (`.f` / `.col` / `.row`)**
Flexible box layout with gap intelligence.
*   **Direction**: `.row` (default, use for explicit child flex-direction statement), `.col` (column).
*   **Gap Clamps**: `--f-gap` scales responsively.
*   **Wrapping**: `.wrap`, `.nowrap`.
*   **Alignment Helpers**:
    *   `.ai-c` (align-items: center), `.jc-sb` (justify-content: space-between), `.jc-c` (center).
*   **Child Props**:
    *   `--fc-grow`, `--fc-shrink`, `--fc-basis`: Standard flex controls.
    *   `.mi-a` (margin-inline: auto) for pushing items (like `margin-left: auto`).
*   **Responsive**: Suffixes supported (e.g., `.col--md` switches to column on medium screens).

#### **Section (`.s`)**
The root structural component for page sections, offering intelligent max-width constraints and padding.
*   **Structure**: `.s` (Outer Wrapper) -> `.sc` (Constraint Wrapper) -> `.scc` (Content Item).
    *   *Note*: Direct children of `.s` are automatically treated as `.sc` if standard semantic tags aren't used, but explicit `.sc` is recommended for complex constraints.
*   **Padding**: `--s-pb` controls vertical padding with fluid `clamp()` values. Use `.pb--s` or `.pb--xs` for tighter spacing.
*   **Content Widths**:
    *   `.s__c` (Content: 48rem), `.s__cw` (Content Wide: 56rem).
    *   `.s__h` (Header: 64rem), `.s__hw` (Header Wide: 72rem).
    *   `.s__f` (Full Width).
*   **Backgrounds**: `--s-bg` handles section background color.

```html
<section class="s set primary">
  <!-- Constrained Content -->
  <div class="s_c ta-c">
     <h2>Header</h2>
  </div>
</section>
```

### Typography

#### **Headings (`.t`)**
Semantic-agnostic typography customization.
*   **Usage**: Applied to `h1`-`h6` or any element meant to look like a heading.
*   **Auto-Scale**: Uses massive `clamp()` ranges to scale typography smoothly from mobile to desktop (e.g., `3.5rem` down to `2.5rem` for `.t--m`).
*   **Vars**:
    *   `--t-font-s`: Font size.
    *   `--t-font-w`: Font weight (800 default).
    *   `--t-lh`: Line height.
*   **Classes**:
    *   Sizes: `.xxxl` ... `.xxxs`.
    *   Weights: `.ub` (900), `.bd` (700), `.rg` (400), `.lt` (300).
    *   Line-Height: `.lh--s`, `.lh--xl`.

#### **Text (`.tx`)**
Body text utilities with intelligent defaults.
*   **Usage**: Paragraphs, spans, labels.
*   **Smart Defaults**: `400` weight, `1.5` line-height, optimized for readability.
*   **Classes**: `.bd`, `.lt` (weights), `.up` (uppercase).
*   **Responsive**: `.tx--lg` (larger text on desktop).

#### **Text Align (`.ta`)**
Responsive text alignment.
*   **Classes**: `.ta-c` (center), `.ta-s` (start), `.ta-e` (end).
*   **Responsive**: `.ta-c--md` (center only on medium screens).

#### **Content Reset (`.cs`)**
The "Content Section" wrapper.
*   **Goal**: Wraps raw HTML content (like from a CMS) to enforce rhythm.
*   **Spacing**: Adds `margin-block` to direct children `h*`, `p`, `ul` to create consistent vertical flow.
*   **Helper**: `.csc` (Content Slot Context) enables deeper nesting rhythm control.

### UI Components

#### **Buttons (`.btn`)**
A complete button system with built-in states and variants.
*   **Base**: Flexbox-centered, cursor-pointer, no-wrap, auto-icon spacing.
*   **Variants**:
    *   `.primary`: Uses `--p` (primary) background.
    *   `.secondary`: Uses `--sp-lt` (light primary transparent) background.
    *   `.outlined`: Transparent background, current color border.
    *   `.plain`: No background/border, just hover effects.
*   **Sizes**: `.sm`, `.md` (default), `.lg`, `.xlg`, `.tiny`.
*   **States**: Handles `:hover`, `:focus-visible` (outline offset), `:active` (scale down), `:disabled`, `.is-loading`.
*   **Grouping**: `.btns` container automatically wraps and spaces buttons. Use `.btns.c` (center), `.btns.e` (end), or `.btns.f` (full width) to align multiple buttons.

#### **Cards (`.crd`)**
The ultimate composable container for nested layouts.
*   **Architecture**:
    *   **Shell (`.crd`)**: The structural wrapper. Handles background, border, shadow, and **padding**.
    *   **Media (`.crd__media`)**: Full-bleed media area (ignores padding).
    *   **Content (`.crd__content`)**: The padded inner wrapper for text/body.
*   **Container Query Powered**: A `.crd` can be set to change its layout (`row` vs `column`) and padding based on *its* width, not the screen.
*   **Subgrid integration**: Use `.crd.sg` to opt-into subgrid. The card formatting context will respect the parent grid's rows/tracks.
*   **Slots**: `.crd__header`, `.crd__body`, `.crd__footer` for semantic spacing structure inside content.
*   **Interactive**: Ready properties to handle card transform applied on hover (`--crd-tf`).

#### **Media (`.med`)**
Responsive media wrapper (figure with img or video inside).
*   **Aspect Ratios**: `.ar-1` (Square), `.ar-16-9` (Video), `.ar-4-3`.
*   **Behavior**: Enforces `object-fit: cover` on images/videos inside.
*   **Radius**: `.med.rd` (circle), `.med.bd` (bold radius).
*   **Container Aware**: Sizing limits (`max-inline-size`) respond to parent context.

#### **Link Wrapper (`.lnk`)**
Clickable area expansion.
*   **Behavior**: Takes the first `<a>` tag inside it and expands its clickable area (using pseudo-elements) to cover the entire `.lnk` container.
*   **Use Case**: Making entire Cards or list items clickable without wrapping them in an `<a>` tag (which is invalid HTML for block content).

### Spacing & Decor

#### **Margin (`.mg`)**
Responsive direction-aware spacing.
*   **Directions**:
    *   `.mgb` (Block Start/Top), `.mgbe` (Block End/Bottom).
    *   `.mgis` (Inline Start/Left), `.mgie` (Inline End/Right).
*   **Auto**: `.mg.auto`, `.mgis.auto` (useful for left-aligning items in flex rows).
*   **Responsive**: Suffixes `--sm`, `--md`, `--lg` allow changing margins based on container size.

#### **Padding (`.pd`)**
Responsive internal spacing with massive clamp ranges.
*   **Presets**:
    *   `.xxxl` (huge ~8rem spacing) down to `.xxs` (tiny).
    *   All presets use `clamp()` to shrink on mobile and grow on desktop automatically.
*   **Directions**: Same as margin (`.pdb`, `.pdi`, etc.).
*   **Fluidity**: Padding scales with the viewport width automatically, maintaining perfect "breathing room" at any device size.

#### **Overlay (`.o`)**
Absolute positioning overlays.
*   **Classes**: `.o.d` (dark color), `.o.l` (light color), `.o.lt` (lite .24 opacity), `.o.bd` (bold .64 opacity).
*   **Z-Index**: Manages stacking context automatically (`-1` to `-3` depending on depth).

#### **Radius (`.rad`)**
Border radius utilities.
*   **Vars**: `--rad` (base radius).
*   **Classes**: `.rad.sq` (square), `.rad.rd` (round/pill), `.rad.lg` (large).
*   **Directions**: `.rad-t` (top only), `.rad-bl` (bottom-left only).

#### **Settings / Theme (`.set`)**
Contextual theming wrapper.
*   **Behavior**: Scopes colors and typography for a specific section (e.g., a dark sidebar).
*   **Classes**: `.set.dark` (dark bg, light text), `.set.primary` (brand bg).
*   **Auto-Adapt**: Automatically adjusts headings (`h1`-`h6`), links, and text colors inside.

---

### Real World Example
Below is a semantic HTML example of a "Blog" section, demonstrating the use of `.s` (Section), `.g` (Grid), `.crd` (Card), and responsive utilities.

```html
<!-- Main Section: Section wrapper, Center content, Primary Theme -->
<section class="s cs set primary scc-as-c alignfull">
    <!-- constrained content area wrapper -->
    <div class="col s_hn ta-c">
        <h2>Our Blog</h2>
        <p class="tx st">We obsess over the details so you don’t have to.</p>
    </div>

    <!-- Grid: 1 col on mobile, auto-fit on desktop -->
    <div class="blog__body g-1--sm g">
        <!-- Semantic List for grid items -->
        <ul class="cl sg sgc gap">
            
            <!-- Item 1: Card inside Link -->
            <li class="lnk sg sgc">
                <article class="sg crd">
                    <div class="crd__content sg">
                        <h3 class="crd__header">
                             Blog Post 1
                        </h3>
                        <p class="crd__footer">Blog post description.</p>
                    </div>
                </article>
            </li>

            <!-- Item 2 -->
            <li class="lnk sg sgc">
                <article class="sg crd">
                    <div class="crd__content sg">
                        <h3 class="crd__header">
                           Blog Post 2
                        </h3>
                        <p class="crd__footer">Blog post description.</p>
                    </div>
                </article>
            </li>
        </ul>

        <!-- Item 3: Newsletter Form -->
        <div class="crd">
            <div class="crd__content">
                <div class="crd__header">
                    <h3 class="t xxxs">Join our Newsletter</h3>
                    <p>Get the latest insights and updates.</p>
                </div>
                <!-- Newsletter Form -->
                <div class="crd__body">
                   <form>
                      <input type="email" placeholder="Your email">
                      <button>Subscribe</button>
                   </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Calls to Action -->
    <div class="btns f row jc-sb e">
        <button class="btn" role="button">
            <span>Book a call</span>
        </button>
        <a class="btn secondary" href="/blog/">Read our blog</a>
    </div>

</section>
```

### Customization Strategy
Here is how you would manage the layout above using a single BEM parent class (`.blog__body`) to control grid columns, spacing, and subgrid behaviors for children. This keeps your HTML clean and your logic centralized.

```css
.blog__body {
  /* Customize Cards inside this section */
  --crd-h: auto;
  --crd-bg: var(--theme-palette-color-7);

  /* Define Grid Layout */
  --g-rows-template: auto auto;
  --g-cols--sm: 1;
  --g-cols--lg: 3;
  --g-cols--md: 2;
  --g-min: 8rem;
  
  /* Default Row Span */
  --gi-row: span 2;

  /* Target the list container */
  > ul {
    --crd-gap: .75rem;
    --gi-col--lg: 1 / 3;
    --gi-col--md: 1 / 3;
    --gi-row--sm: span 4;
  }

  /* Specific List Items */
  > ul > li:nth-of-type(1) {
      --gi-col--lg: 1 / 2;
      --gi-col--md: 1 / 2;
  }
  > ul > li:nth-of-type(2) {
      --gi-col--lg: 2 / 3;
      --gi-col--md: 2 / 3;
  }

  /* Subgrid Spans for Card Children */
  > ul > li h3 {
    --sgi-row: span 1;
  }
  > ul > li p {
    --sgi-row: span 2;
  }

  /* Newsletter Box (the div next to the ul) */
  > div {
    --gi-col--lg: auto;
    --gi-col--md: span 2;
  }
}
```

---

## 🛠️ Development & Workflow

If you are contributing to uCss or modifying the core framework, here is how the system works.

### Directory Structure
*   **`src/css/`**: The source modules. Each component (e.g., `btn.css`) is a separate file.
*   **`dist/`**: The compiled output. **Do not edit files here.**
    *   `u.css`: Concatenated full build.
    *   `u.min.css`: Minified production build.
    *   `lib/root.css`: The configuration file.

### Build System
The project is built using a custom Bash script and Node.js custom minifier.
```bash
npm run build
# OR
./build.sh
```

### Deployment Strategy
Our CI/CD pipeline (GitHub Actions) automatically handles deployments based on branches:

| Branch | Output URL | Purpose |
| :--- | :--- | :--- |
| **`main`** | `.../stable/` | **Production**. Stable releases. |
| **`dev`** | `.../latest/` | **Development**. Latest bleeding-edge code. |
| **Other** | `.../preview/TIMESTAMP/` | **Preview**. Feature branches/PRs. |

**Local Development**:
We have a git `pre-push` hook installed. When you push to any branch, your local environment will automatically run `./build.sh` to ensure your `dist/` folder matches what you are pushing.

---

## 🤝 Contributing
1.  Make changes in `src/css`.
2.  Run `npm run build` to verify standard compliance.
3.  Push to `dev` branch.