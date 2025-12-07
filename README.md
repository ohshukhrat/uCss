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
> **Container Query Gotcha**:
> Do not apply `@container` context to an element that is *itself* a grid item or part of a complex layout unless necessary. Setting `container-type` on a grid item can sometimes break implicit grid auto-sizing (`auto-fit`) because the container needs definite dimensions to resolve its queries.
>
> **Safety Mechanism**: The framework automatically skips container deployment on critical parents (like `.g`) to prevent layout breakage.

> [!NOTE]
> **Compatibility**:
> uCss is tested and fully compatible with **WordPress**, specifically the **Greenlight Builder** and **Blocksy Theme**.

---

## 📦 Installation & Usage

### 1. Quick Start (CDN)
The easiest way to use uCss is via our edge CDN.

#### **Full Framework**
Includes everything.
| Env | URL |
| :--- | :--- |
| **Stable** | `https://ucss.unqa.dev/stable/u.min.css` |
| **Latest** | `https://ucss.unqa.dev/latest/u.min.css` |

```html
<!-- 1. Configuration (Optional) -- copy, configure and enqueue this file to your project for customizing defaults -->
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config.css">

<!-- 2. Framework -->
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/u.min.css">
```

### 2. Modular Imports
If you don't need the full framework, you can import specific modules. See the **Documentation** section below for direct links to every module.

### 3. Manual / Local Installation
1.  Clone the repository or download the `dist` folder.
2.  Copy `lib/config/root.css` to your project and update with your colors/fonts.
3.  Import `u.min.css` or specific modules from `dist/lib/` locally.

> [!TIP]
> **Server Configuration**:
> If you are hosting uCss yourself, we provide an optimized `.htaccess` template in the `dist/` folder. This ensures your server serves the pre-compressed `.gz` (Gzip) and `.br` (Brotli) files with the correct headers for maximum performance.

### 4. File Types Explanation
We provide three variations for every file:

*   **`*.css`**: Full source with extensive JSDoc-like comments. Best for debugging or learning the codebase.
*   **`*.clean.css`**: Cleaned source. Comments removed but formatting preserved. Ideal for local development if you don't need minification.
*   **`*.min.css`**: Minified and optimized for production. Use this for live sites.

---

## 🎨 Configuration
The heart of uCss is `root.css` (found in `src/lib/config/root.css`). This file defines your design tokens and is organized by project structure (General, Typography, Layout, Components). **Do not edit u.css directly.**

```css
:root {
  /* ==========================================================================
     SECTION: GENERAL / CONFIGURATION
     ========================================================================== */

  /**
   * @group Theming: Palette
   */
  --p:  hsl(43 83% 62%);  /* Primary */
  --a:  hsl(44 100% 50%); /* Accent */
  
  /**
   * @group Theming: Backgrounds
   */
  --bg:  hsl(0 0% 96%);   /* Main Background */
  --srf: hsl(0 0% 92%);   /* Surface (Cards) */

  /* ==========================================================================
     SECTION: TYPOGRAPHY
     ========================================================================== */

  /**
   * @group Typography: Headings (title.css)
   */
  --t-fs--m: clamp(2.5rem, 1.53vw + 2.194rem, 3.5rem);

  /**
   * @group Typography: Body (text.css)
   */
  --tx-fs--m: clamp(1.125rem, 0.191vw + 1.087rem, 1.25rem);
  
  /* ==========================================================================
     SECTION: LAYOUT
     ========================================================================== */
  
  /**
   * @group Layout: Section
   */
  --sc-max-w: 1366px; /* Scaffold Max Width */
  --s-gap: clamp(2rem, 3.059vw + 1.388rem, 4rem);
}
```

> [!IMPORTANT]
> **Variable Inheritance & BEM Strategy**
> Since uCss relies heavily on CSS variables, **values cascade down to children**.
> *   **The Risk**: If you set `--btn-bg: blue` on a parent, *every* button inside that parent will inherit blue unless explicitly overridden.
> *   **The Solution**: Use **BEM** (Block Element Modifier). Create a specific class for your component and scope your variable overrides within that class.

```css
/* Recommended Approach: Component Context */
.my-card {
  --btn-bg: #333; /* Local override */
  
  &__submit-btn {
    --btn-bg: var(--p); /* Targeted override */
  }
}
```

---

## 📚 Documentation & Modules

### 1. Base
Core resets and normalizers.

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`base.min.css`** | [Link](https://ucss.unqa.dev/stable/lib/base.min.css) | [Link](https://ucss.unqa.dev/latest/lib/base.min.css) |

| File | Stable | Latest | Description |
| :--- | :--- | :--- | :--- |
| `clear.css` | [Link](https://ucss.unqa.dev/stable/lib/base/clear.min.css) | [Link](https://ucss.unqa.dev/latest/lib/base/clear.min.css) | **Global Reset**. Removes default spacing from headings/lists (`.cl`) and normalizes content spacing (`.cs`). |

---

### 2. Layout
Structural components for page building.

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`layout.min.css`** | [Link](https://ucss.unqa.dev/stable/lib/layout.min.css) | [Link](https://ucss.unqa.dev/latest/lib/layout.min.css) |

| File | Stable | Latest | Description |
| :--- | :--- | :--- | :--- |
| `section.css` | [Link](https://ucss.unqa.dev/stable/lib/layout/section.min.css) | [Link](https://ucss.unqa.dev/latest/lib/layout/section.min.css) | Root sections (`.s`) |
| `grid.css` | [Link](https://ucss.unqa.dev/stable/lib/layout/grid.min.css) | [Link](https://ucss.unqa.dev/latest/lib/layout/grid.min.css) | CSS Grid system (`.g`) |
| `flex.css` | [Link](https://ucss.unqa.dev/stable/lib/layout/flex.min.css) | [Link](https://ucss.unqa.dev/latest/lib/layout/flex.min.css) | Flexbox utilities (`.f`) |

#### **Section (`.s`)**
The root structural component for page sections, offering intelligent max-width constraints and padding.
*   **Structure**: `.s` (Outer Wrapper) -> `.sc` (Constraint Wrapper) -> `.scc` (Content Item).
    *   *Note*: Direct children of `.s` are automatically treated as `.sc` if standard semantic tags aren't used, same for `.sc` - it treats its direct children as `.scc`.
*   **Padding**: `--s-pb` controls vertical padding with fluid `clamp()` values. Use `.pb--s` or `.pb--xs` for tighter spacing; `--s-pi` controls horizontal padding with defaults set to 5%. 
*   **Content Widths**:
    *   `.s > *` defaults to 1366px for max-width of inner section container with 5% padding on each side.
    *   `.s__c` (Content: 48rem), `.s__cw` (Content Wide: 56rem).
    *   `.s__h` (Header: 64rem), `.s__hw` (Header Wide: 72rem).
    *   `.s__f` (Full Width), `.s__cn` (Narrow: 40rem).
    *   `.s__w` (Wide: 1440px), `.s__xw` (Extra Wide: 1600px), `.s__uw` (Ultra Wide: 1920px).
*   **Backgrounds**: `--s-bg` handles section background color.

```html
<section class="s set primary">
  <!-- Constrained Content -->
  <div class="s_c ta-c">
     <h2>Header</h2>
  </div>
</section>
```

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
*   **Direction**: `.row` (default, can be used for explicit nested child flex-direction reset), `.col` (column).
*   **Gap with Clamps**: `--f-gap` scales responsively.
*   **Wrapping**: `.wrap`, `.nowrap`.
*   **Alignment Helpers**:
    *   `.ai-c` (align-items: center), `.jc-sb` (justify-content: space-between), `.jc-c` (center).
*   **Child Props**:
    *   `--fc-grow`, `--fc-shrink`, `--fc-basis`: Standard flex controls.
    *   `.mi-a` (margin-inline: auto) for pushing items (like `margin-left: auto`).
*   **Responsive**: Suffixes supported (e.g., `.col--md` switches to column on medium screens).

---

### 3. Typography
Title, text, and alignment.

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`typography.min.css`** | [Link](https://ucss.unqa.dev/stable/lib/typography.min.css) | [Link](https://ucss.unqa.dev/latest/lib/typography.min.css) |

| File | Stable | Latest | Description |
| :--- | :--- | :--- | :--- |
| `title.css` | [Link](https://ucss.unqa.dev/stable/lib/typography/title.min.css) | [Link](https://ucss.unqa.dev/latest/lib/typography/title.min.css) | Title (`.t`) |
| `text.css` | [Link](https://ucss.unqa.dev/stable/lib/typography/text.min.css) | [Link](https://ucss.unqa.dev/latest/lib/typography/text.min.css) | Text (`.tx`) |
| `text-align.css` | [Link](https://ucss.unqa.dev/stable/lib/typography/text-align.min.css) | [Link](https://ucss.unqa.dev/latest/lib/typography/text-align.min.css) | Text alignment utilities (`.ta`) |

#### **Title (`.t`)**
Semantic-agnostic typography customization.
*   **Usage**: Applied to `h1`-`h6` or any element meant to look like a heading / title.
*   **Auto-Scale**: Uses massive `clamp()` ranges to scale typography smoothly from mobile to desktop (e.g., `3.5rem` down to `2.5rem` for `.t--m`).
*   **Vars**:
    *   `--t-font-s / --t-fs`: Font size.
    *   `--t-font-w / --t-fw`: Font weight (800 default).
    *   `--t-line-h / --t-lh`: Line height.
*   **Classes**:
    *   Sizes: `.xxxl` ... `.xxxs`. (also `.t--xxxl` ... `.t--xxxs`)
    *   Weights: `.ub` (900), `.bd` (700), `.rg` (400), `.lt` (300).
    *   Line-Height: `.lh--s`, `.lh--xl`.
    *   Styles: `.up` (uppercase), `.hl` (Ultra-bold + Uppercase for Headlines).

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

---

### 4. Components
UI Elements and interactive patterns.

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`components.min.css`** | [Link](https://ucss.unqa.dev/stable/lib/components.min.css) | [Link](https://ucss.unqa.dev/latest/lib/components.min.css) |

| File | Stable | Latest | Description |
| :--- | :--- | :--- | :--- |
| `button.css` | [Link](https://ucss.unqa.dev/stable/lib/components/button.min.css) | [Link](https://ucss.unqa.dev/latest/lib/components/button.min.css) | `.btn` |
| `card.css` | [Link](https://ucss.unqa.dev/stable/lib/components/card.min.css) | [Link](https://ucss.unqa.dev/latest/lib/components/card.min.css) | `.crd` |
| `media.css` | [Link](https://ucss.unqa.dev/stable/lib/components/media.min.css) | [Link](https://ucss.unqa.dev/latest/lib/components/media.min.css) | `.med` |
| `link.css` | [Link](https://ucss.unqa.dev/stable/lib/components/link.min.css) | [Link](https://ucss.unqa.dev/latest/lib/components/link.min.css) | `.lnk` |

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
*   **Container Query Powered**: A `.crd` could be configured to change its layout (`row` vs `column`) and padding based on *its* width, not the screen.
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

---

### 5. Theming
Themes, overlays, and contextual settings.

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`theming.min.css`** | [Link](https://ucss.unqa.dev/stable/lib/theming.min.css) | [Link](https://ucss.unqa.dev/latest/lib/theming.min.css) |

| File | Stable | Latest | Description |
| :--- | :--- | :--- | :--- |
| `set.css` | [Link](https://ucss.unqa.dev/stable/lib/theming/set.min.css) | [Link](https://ucss.unqa.dev/latest/lib/theming/set.min.css) | Contextual themes |
| `overlay.css` | [Link](https://ucss.unqa.dev/stable/lib/theming/overlay.min.css) | [Link](https://ucss.unqa.dev/latest/lib/theming/overlay.min.css) | Absolute overlays |

#### **Settings / Theme (`.set`)**
Contextual theming wrapper.
*   **Behavior**: Scopes colors and typography for a specific section (e.g., a dark sidebar).
*   **Classes**: `.set.dark` (dark bg, light text), `.set.primary` (brand bg).
*   **Auto-Adapt**: Automatically adjusts headings (`h1`-`h6`), links, and text colors inside.

#### **Overlay (`.o`)**
Absolute positioning overlays.
*   **Classes**: `.o.d` (dark color), `.o.l` (light color), `.o.lt` (lite .24 opacity), `.o.bd` (bold .64 opacity).
*   **Z-Index**: Manages stacking context automatically (`-1` to `-3` depending on depth).

---

### 6. Utilities
Helper classes for spacing and decoration.

| Bundle | Stable | Latest |
| :--- | :--- | :--- |
| **`utilities.min.css`** | [Link](https://ucss.unqa.dev/stable/lib/utilities.min.css) | [Link](https://ucss.unqa.dev/latest/lib/utilities.min.css) |

| File | Stable | Latest | Description |
| :--- | :--- | :--- | :--- |
| `margin.css` | [Link](https://ucss.unqa.dev/stable/lib/utilities/margin.min.css) | [Link](https://ucss.unqa.dev/latest/lib/utilities/margin.min.css) | `.mg` |
| `padding.css` | [Link](https://ucss.unqa.dev/stable/lib/utilities/padding.min.css) | [Link](https://ucss.unqa.dev/latest/lib/utilities/padding.min.css) | `.pd` |
| `radius.css` | [Link](https://ucss.unqa.dev/stable/lib/utilities/radius.min.css) | [Link](https://ucss.unqa.dev/latest/lib/utilities/radius.min.css) | `.rad` |

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

#### **Radius (`.rad`)**
Border radius utilities.
*   **Vars**: `--rad` (base radius).
*   **Classes**: `.rad.sq` (square), `.rad.rd` (round/pill), `.rad.lg` (large).
*   **Directions**: `.rad-t` (top only), `.rad-bl` (bottom-left only).

---

## 🏛️ Real World Example
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
If you are contributing to uCss or modifying the core framework, here is an in-depth look at the build system.

### Directory Structure
*   **`src/lib/`**: The source modules (base, components, config, layout, theming, typography, utilities).
*   **`src/u.css`**: Main framework entry point.
*   **`scripts/`**: Node.js build scripts.
*   **`dist/`**: Compiled output (Stable/Latest). **Do not edit.**

### Build Processes (`build.sh`)
The project uses a robust Bash script (`build.sh`) that orchestrates the entire process:

1.  **Bundling** (`scripts/bundle.js`): Recursively resolves `@import` statements to create flat files, removing build-time dependencies.
2.  **Cleaning** (`scripts/clean.js`): Removes comments and redundant whitespace while preserving CSS nesting and structure.
3.  **Minifying** (`scripts/minify.js`): Compresses CSS logic for production.
4.  **Verification**: The build script strictly verifies output file sizes to prevent "empty builds" or broken releases.
5.  **Compression**: Automatically generates `.gz` (Gzip) and `.br` (Brotli) versions of all CSS files for maximum performance on CDN.
6.  **Documentation**: Statically renders this `README.md` into `dist/index.html` using `scripts/render-docs.js`, creating a self-hosted documentation site.

```bash
# Standard Build (Detects branch)
./build.sh

# Force specific target
./build.sh --source main
```

### Deployment Strategy
Our CI/CD pipeline (GitHub Actions) automatically deploys based on branch push:

| Branch | Output URL | Configuration |
| :--- | :--- | :--- |
| **`main`** | `.../stable/` | **Production**. Stable releases. Verified builds. |
| **`dev`** | `.../latest/` | **Development**. Bleeding-edge code. |

---

## 🤝 Contributing
1.  Make changes in `src/lib`.
2.  Run `./build.sh` locally to verify imports, bundling, and header generation.
3.  Check `dist/stable/u.min.css` to confirm your changes are present and correct.
4.  Push to `dev` branch.