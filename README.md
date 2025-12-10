# uCss Framework

**Navigation**: [uCss](./) > [Source](./src/) > [Modules](./src/lib/) 

**Modules**: [Config](./src/lib/config/) | [Base](./src/lib/base/) | [Layout](./src/lib/layout/) | [Theming](./src/lib/theming/) | [Typography](./src/lib/typography/) | [Components](./src/lib/components/) | [Utilities](./src/lib/utilities/)

> **The Container-First CSS Framework**. uCss is a modern, 10KB lightweight framework designed to solve component portability. It leverages **Container Queries** and **CSS Variables** to create resilient UI components that adapt to their *context*, not just the screen size. No build step required.

---

## 📑 Page Contents
*   [Why uCss?](#-why-ucss)
*   [Thinking in uCss](#-thinking-in-ucss-philosophy)
*   [The Ecosystem](#-the-ecosystem)
*   [Installation & Usage](#-installation--usage)
*   [Configuration](#-configuration-optional)
*   [Documentation & Modules](#-documentation--modules)
*   [See it in Action](#-see-it-in-action)

---

**uCss** is a modern, mobile-first, **pure CSS framework** designed for granular control, responsiveness, and flexibility. It leverages **CSS Variables** and **Container Queries** to provide a highly adaptable styling API without the need for complex build steps, JavaScript runtimes, or utility-class bloat.

## 🌟 Why uCss?

**uCss** is not just another CSS framework. It is a **system** designed to solve the "Component Portability" crisis.

### 1. The "Component Portability" Crisis (vs Tailwind)
*   **Problem**: In frameworks like **Tailwind**, you write `w-1/2 md:w-1/4`. If you move that component to a sidebar, it breaks because `md` refers to the *screen*, not the sidebar.
*   **Solution**: **uCss** uses **Container Queries**. You write `.g` (Grid). It automatically detects if it's in a sidebar or a main area and adjusts itself. No modifiers needed.

### 2. The "Classless-ish" API
We hate class bloat. Instead of `text-lg font-bold text-center text-blue-500 p-4 rounded-xl shadow-lg`, uCss relies on **HTML Semantics** and **CSS Variables**.
*   **Tailwind**: `<button class="bg-blue-500 text-white px-4 py-2 rounded">`
*   **uCss**: `<button class="btn primary">` (Then customize with `--btn-bg: blue` if needed).

### 3. Zero Build Step Required
uCss is written in pure, highly-optimized CSS. You can drop the CDN link in your `<head>` and start building. No `npm install`, no `postcss.config.js`, no 5-minute compile times.
*   **Dev**: Use `/src/` for debugging.
*   **Prod**: Use `/dist/u.min.css` (~100KB Minified, ~15KB Gzipped).

### 4. Variable-First Architecture
We expose **CSS Variables** as our public API.
*   Want a different primary color? `:root { --p: #ff0000; }`
*   Want tighter spacing in just one section? `.my-section { --s-gap: 1rem; }`
*   The entire framework cascades these values instantly.

---

### 🚀 More Features

*   **Granular Control**: Modify specific properties for specific breakpoints using structured variable suffixes (e.g., `--gap--md`).
*   **Advanced Fallbacks**: All variables resolve to "Pretty Out-of-the-Box" defaults (using `clamp()` for responsiveness) if undefined, ensuring layouts look great immediately.
*   **Themeable defaults**: We developed and included a `root.css` file that already holds all properties with their global fallback values. Change one variable there (e.g., `--p`) to instantly re-theme the entire application, comment what you don't need to reduce the bundle size.
*   **Mobile-First**: All utilities start from mobile defaults and expand upwards.
*   **Responsive**: All components and layouts are responsive by default.
*   **Logical Properties**: All styles use logical properties (e.g., `margin-inline` instead of `margin-left` and `margin-right`).
*   **Compatibility**: uCss is tested and fully compatible with **WordPress**, specifically the **Greenlight Builder** and **Blocksy Theme**.


> [!CAUTION]
> **Container Query Gotcha**:
> Do not apply `@container` context to an element that is *itself* a grid item or part of a complex layout unless necessary. Setting `container-type` on a grid item can sometimes break implicit grid auto-sizing (`auto-fit`) because the container needs definite dimensions to resolve its queries.
>
> **Safety Mechanism**: The framework automatically skips container deployment on critical parents (like `.g`) to prevent layout breakage.

> [!NOTE]
> **Compatibility**:
> uCss is tested and fully compatible with **WordPress**, specifically the **Greenlight Builder** and **Blocksy Theme**.

---

## 🧠 Thinking in uCss (Philosophy)
uCss is not just a collection of classes; it is a system that demands a slight shift in mindset. If you fight it, it will feel restrictive. If you embrace it, it feels like a superpower.

### 1. The Container is King (Context > Viewport)
Stop thinking about "Mobile Screen" vs "Desktop Screen". Think about **Available Space**.
*   **The Old Way**: "At 768px screen width, make this card horizontal."
*   **The uCss Way**: "If this card has > 600px of space, make it horizontal."
This means you can drop the *same* card component into a narrow sidebar or a wide main area, and it fits perfectly in both. You don't write overrides for the sidebar; the component effectively "self-heals" based on its container.

### 2. Semantics ≠ Visuals (Decoupling)
In standard CSS, `<h1>` usually means "Big Text". In uCss, `<h1>` means "Top Level Heading". The two are unrelated.
*   **HTML controls Meaning**: Use `<button>`, `<nav>`, `<h1>` for accessibility and SEO.
*   **Classes control Look**: Use `.btn`, `.f`, `.t` for style.
This allows you to have a marketing tagline that looks like a massive headline (`<p class="t xxxl">`) without ruining your document outline, or a sidebar heading that is semantically important but visually tiny (`<h2 class="t xxs">`).

### 3. Composition (LEGOs > Monoliths)
We don't provide a "Profile Card" component. We provide primitives (`Card Shell`, `Media Wrapper`, `Flexbox`, `Radius`) that you compose.
*   **Don't Search**: "Do they have a horizontal profile card class?"
*   **Do Build**: `<article class="crd f row ai-c gap-m">`
    *   `.crd`: The box.
    *   `.f.row`: The layout.
    *   `.ai-c`: The alignment.
    *   `.gap-m`: The spacing.
You are constructing UI from atoms. This reduces the need to memorize thousands of specific component names.

### 4. Variables are the API
If you find yourself writing `!important` or complex CSS selectors to override a color, you are fighting the framework.
*   **The Wrong Way**: `.my-card h3 { color: red; }`
*   **The Right Way**: `.my-card { --t: red; }`
uCss components are "listening" for variables. If you change the signal (`--t` for title color), the component updates itself. This is how theming (`.set.dark`) works—it just changes the signals.


---

## 🌍 The Ecosystem

uCss is modular by design. You can use the full framework or just the parts you need.

| Module | What it does |
| :--- | :--- |
| **[Layout](./src/lib/layout/)** | **The Core Engine**. Grid (`.g`), Flex (`.f`), and Section (`.s`). Powered by Container Queries. |
| **[Components](./src/lib/components/)** | **Interaction**. Cards (`.crd`), Buttons (`.btn`), and Media (`.med`). |
| **[Typography](./src/lib/typography/)** | **Fluid Text**. Headings (`.t`) and body text (`.tx`) that scale automatically. |
| **[Theming](./src/lib/theming/)** | **Context**. Dark mode, brand themes (`.set`), and overlays (`.o`). |
| **[Utilities](./src/lib/utilities/)** | **Polish**. Margins (`.mg`) and Padding (`.pd`) with logical properties. |
| **[Config](./src/lib/config/)** | **Control Center**. The CSS variables that drive the system. |

> 👉 **Explore the source**: Check out the [Source Map](./src/).

---

## 📦 Installation & Usage

### 1. Quick Start (CDN)
The easiest way to use uCss is via our edge CDN.

#### **Full Framework**
Includes everything.
| Env | URL | Size (Min / Gz / Br) |
| :--- | :--- | :--- |
| **Stable** | `https://ucss.unqa.dev/stable/u.min.css` | 101KB / 14.8KB / 11.4KB |
| **Latest** | `https://ucss.unqa.dev/latest/u.min.css` | 101KB / 14.8KB / 11.4KB |

```html
<!-- 1. Configuration (Optional) -- copy, configure and enqueue this file to your project for customizing defaults -->
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config/root.css">

<!-- 2. Framework -->
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/u.min.css">
```

### 2. Installation (NPM)
You can install uCss via npm for use in build systems or JavaScript projects.

```bash
npm install @unqa/ucss
```

**Usage in CSS:**
```css
/* Imports the full stable framework */
@import '@unqa/ucss';

/* Or import specific modules */
@import '@unqa/ucss/base';
@import '@unqa/ucss/layout';
@import '@unqa/ucss/components';
```

**Usage in JavaScript/Bundlers (Vite, Webpack, etc):**
```javascript
import '@unqa/ucss'; // Imports dist/stable/u.min.css
```

### 3. Modular Imports
If you don't need the full framework, you can import specific modules. See the **Documentation** section below for direct links to every module.

### 4. Manual / Local Installation
1.  Clone the repository or download the `dist` folder.
2.  Copy `lib/config/root.css` to your project and update with your colors/fonts.
3.  Import `u.min.css` or specific modules from `dist/lib/` locally.

> [!TIP]
> **Server Configuration**:
> If you are hosting uCss yourself, we provide an optimized `.htaccess` template in the `dist/` folder. This ensures your server serves the pre-compressed `.gz` (Gzip) and `.br` (Brotli) files with the correct headers for maximum performance.

### 5. File Types Explanation
We provide three variations for every file:

*   **`*.css`** (138KB): Full source with extensive JSDoc-like comments. Best for debugging or learning the codebase.
*   **`*.clean.css`** (120KB): Cleaned source. Comments removed but formatting preserved. Ideal for local development if you don't need minification.
*   **`*.min.css`** (101KB / 15KB Gzip / 11KB Brotli): Minified and optimized for production. Use this for live sites.

---

## 🎨 Configuration (Optional)
uCss is built to work out-of-the-box. Every component has a "graceful fallback".
*   **Default Behavior**: If you don't define any variables, uCss uses its internal defaults (e.g., sensible greys, system fonts).
*   **Customization**: You *can* include `root.css` (found in `src/lib/config/root.css`) to override these defaults globally. This file is **not required**, but it is the recommended way to manage your design tokens.

**Example `root.css`:**

```css
:root {
  /* ==========================================================================
     SECTION: GENERAL / CONFIGURATION
     Mapping: src/lib/config & src/lib/theming
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

  /**
   * @group Configuration: Animation
   */
  --trans-d: 0.32s;

  /* ==========================================================================
     SECTION: TYPOGRAPHY
     Mapping: src/lib/typography
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
     Mapping: src/lib/layout
     ========================================================================== */
  
  /**
   * @group Layout: Section
   */
  --sc-max-w: 1366px; /* Scaffold Max Width */
  --s-gap: clamp(2rem, 3.059vw + 1.388rem, 4rem);

  /* ==========================================================================
     SECTION: COMPONENTS
     Mapping: src/lib/components
     ========================================================================== */

  /**
   * @group Components: Button (button.css)
   */
   --btn-fs: 1.125rem;
   --btn-rad: 4em;
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

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`base`** | [src](https://ucss.unqa.dev/stable/lib/base.css) • [clean](https://ucss.unqa.dev/stable/lib/base.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base.min.css) | [src](https://ucss.unqa.dev/latest/lib/base.css) • [clean](https://ucss.unqa.dev/latest/lib/base.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base.min.css) | 2.1KB / 1.3KB / 0.9KB / 0.3KB / 0.3KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`base`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/base.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `content.css` | [src](https://ucss.unqa.dev/stable/lib/base/content.css) • [clean](https://ucss.unqa.dev/stable/lib/base/content.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base/content.min.css) | [src](https://ucss.unqa.dev/latest/lib/base/content.css) • [clean](https://ucss.unqa.dev/latest/lib/base/content.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base/content.min.css) | 2.1KB / 1.3KB / 0.9KB / 0.3KB / 0.3KB | **Content Controller**. Toggles flow variables ("App Mode" `.cs` vs "Content Mode" `.csc`). |
| `html.css` | [src](https://ucss.unqa.dev/stable/lib/base/html.css) • [clean](https://ucss.unqa.dev/stable/lib/base/html.clean.css) • [min](https://ucss.unqa.dev/stable/lib/base/html.min.css) | [src](https://ucss.unqa.dev/latest/lib/base/html.css) • [clean](https://ucss.unqa.dev/latest/lib/base/html.clean.css) • [min](https://ucss.unqa.dev/latest/lib/base/html.min.css) | 8KB / 6KB / 4KB / 1KB / 1KB | **Smart Flow Engine**. Global Reset + Smart vertical rhythm using `* + *` logic. |

---

### 2. Layout
Structural components for page building.

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`layout`** | [src](https://ucss.unqa.dev/stable/lib/layout.css) • [clean](https://ucss.unqa.dev/stable/lib/layout.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout.css) • [clean](https://ucss.unqa.dev/latest/lib/layout.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout.min.css) | 69KB / 65KB / 55KB / 6.9KB / 5.0KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`layout`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/layout.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `section.css` | [src](https://ucss.unqa.dev/stable/lib/layout/section.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/section.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/section.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/section.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/section.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/section.min.css) | 7.8KB / 6.7KB / 5.9KB / 1.3KB / 1.1KB | Root sections (`.s`) |
| `grid.css` | [src](https://ucss.unqa.dev/stable/lib/layout/grid.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/grid.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/grid.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/grid.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/grid.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/grid.min.css) | 35KB / 34KB / 29KB / 3.7KB / 2.7KB | CSS Grid system (`.g`) |
| `flex.css` | [src](https://ucss.unqa.dev/stable/lib/layout/flex.css) • [clean](https://ucss.unqa.dev/stable/lib/layout/flex.clean.css) • [min](https://ucss.unqa.dev/stable/lib/layout/flex.min.css) | [src](https://ucss.unqa.dev/latest/lib/layout/flex.css) • [clean](https://ucss.unqa.dev/latest/lib/layout/flex.clean.css) • [min](https://ucss.unqa.dev/latest/lib/layout/flex.min.css) | 26KB / 24KB / 21KB / 2.4KB / 1.9KB | Flexbox utilities (`.f`) |

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

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`typography`** | [src](https://ucss.unqa.dev/stable/lib/typography.css) • [clean](https://ucss.unqa.dev/stable/lib/typography.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography.css) • [clean](https://ucss.unqa.dev/latest/lib/typography.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography.min.css) | 15KB / 10KB / 8.4KB / 1.6KB / 1.3KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`typography`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/typography.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title.css` | [src](https://ucss.unqa.dev/stable/lib/typography/title.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/title.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/title.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/title.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/title.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/title.min.css) | 6.1KB / 4.2KB / 3.4KB / 0.8KB / 0.7KB | Title (`.t`) |
| `text.css` | [src](https://ucss.unqa.dev/stable/lib/typography/text.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/text.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/text.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/text.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/text.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/text.min.css) | 6.4KB / 4.6KB / 3.8KB / 0.8KB / 0.7KB | Text (`.tx`) |
| `text-align.css` | [src](https://ucss.unqa.dev/stable/lib/typography/text-align.css) • [clean](https://ucss.unqa.dev/stable/lib/typography/text-align.clean.css) • [min](https://ucss.unqa.dev/stable/lib/typography/text-align.min.css) | [src](https://ucss.unqa.dev/latest/lib/typography/text-align.css) • [clean](https://ucss.unqa.dev/latest/lib/typography/text-align.clean.css) • [min](https://ucss.unqa.dev/latest/lib/typography/text-align.min.css) | 2.1KB / 1.4KB / 1.2KB / 0.3KB / 0.3KB | Text alignment utilities (`.ta`) |

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

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`components`** | [src](https://ucss.unqa.dev/stable/lib/components.css) • [clean](https://ucss.unqa.dev/stable/lib/components.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components.min.css) | [src](https://ucss.unqa.dev/latest/lib/components.css) • [clean](https://ucss.unqa.dev/latest/lib/components.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components.min.css) | 36KB / 32KB / 27KB / 4.8KB / 4.1KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`components`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/components.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `button.css` | [src](https://ucss.unqa.dev/stable/lib/components/button.css) • [clean](https://ucss.unqa.dev/stable/lib/components/button.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components/button.min.css) | [src](https://ucss.unqa.dev/latest/lib/components/button.css) • [clean](https://ucss.unqa.dev/latest/lib/components/button.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components/button.min.css) | 15KB / 13KB / 11KB / 2.3KB / 2.0KB | `.btn` |
| `card.css` | [src](https://ucss.unqa.dev/stable/lib/components/card.css) • [clean](https://ucss.unqa.dev/stable/lib/components/card.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components/card.min.css) | [src](https://ucss.unqa.dev/latest/lib/components/card.css) • [clean](https://ucss.unqa.dev/latest/lib/components/card.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components/card.min.css) | 17KB / 15KB / 13KB / 2.3KB / 2.0KB | `.crd` |
| `media.css` | [src](https://ucss.unqa.dev/stable/lib/components/media.css) • [clean](https://ucss.unqa.dev/stable/lib/components/media.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components/media.min.css) | [src](https://ucss.unqa.dev/latest/lib/components/media.css) • [clean](https://ucss.unqa.dev/latest/lib/components/media.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components/media.min.css) | 3.6KB / 3.0KB / 2.4KB / 0.7KB / 0.6KB | `.med` |
| `link.css` | [src](https://ucss.unqa.dev/stable/lib/components/link.css) • [clean](https://ucss.unqa.dev/stable/lib/components/link.clean.css) • [min](https://ucss.unqa.dev/stable/lib/components/link.min.css) | [src](https://ucss.unqa.dev/latest/lib/components/link.css) • [clean](https://ucss.unqa.dev/latest/lib/components/link.clean.css) • [min](https://ucss.unqa.dev/latest/lib/components/link.min.css) | 1.1KB / 0.6KB / 0.5KB / 0.3KB / 0.2KB | `.lnk` |

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

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`theming`** | [src](https://ucss.unqa.dev/stable/lib/theming.css) • [clean](https://ucss.unqa.dev/stable/lib/theming.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming.css) • [clean](https://ucss.unqa.dev/latest/lib/theming.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming.min.css) | 6.8KB / 5.2KB / 4.4KB / 1.0KB / 0.9KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`theming`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `set.css` | [src](https://ucss.unqa.dev/stable/lib/theming/set.css) • [clean](https://ucss.unqa.dev/stable/lib/theming/set.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming/set.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming/set.css) • [clean](https://ucss.unqa.dev/latest/lib/theming/set.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming/set.min.css) | 3.7KB / 2.9KB / 2.5KB / 0.5KB / 0.5KB | Contextual themes |
| `overlay.css` | [src](https://ucss.unqa.dev/stable/lib/theming/overlay.css) • [clean](https://ucss.unqa.dev/stable/lib/theming/overlay.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming/overlay.min.css) | [src](https://ucss.unqa.dev/latest/lib/theming/overlay.css) • [clean](https://ucss.unqa.dev/latest/lib/theming/overlay.clean.css) • [min](https://ucss.unqa.dev/latest/lib/theming/overlay.min.css) | 3.1KB / 2.2KB / 1.9KB / 0.6KB / 0.5KB | Absolute overlays |

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

| Bundle | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) |
| :--- | :--- | :--- | :--- |
| **`utilities`** | [src](https://ucss.unqa.dev/stable/lib/utilities.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities.min.css) | 9.5KB / 6.4KB / 5.4KB / 0.9KB / 0.7KB |

| Bundle | HTML Snippet (Stable) |
| :--- | :--- |
| **`utilities`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/utilities.min.css">` |

| File | Stable | Latest | Size (Raw / Clean / Min / Gz / Br) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `margin.css` | [src](https://ucss.unqa.dev/stable/lib/utilities/margin.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/margin.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/margin.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/margin.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/margin.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/margin.min.css) | 2.9KB / 2.0KB / 1.7KB / 0.3KB / 0.2KB | `.mg` |
| `padding.css` | [src](https://ucss.unqa.dev/stable/lib/utilities/padding.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/padding.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/padding.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/padding.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/padding.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/padding.min.css) | 4.8KB / 3.4KB / 2.8KB / 0.5KB / 0.4KB | `.pd` |
| `radius.css` | [src](https://ucss.unqa.dev/stable/lib/utilities/radius.css) • [clean](https://ucss.unqa.dev/stable/lib/utilities/radius.clean.css) • [min](https://ucss.unqa.dev/stable/lib/utilities/radius.min.css) | [src](https://ucss.unqa.dev/latest/lib/utilities/radius.css) • [clean](https://ucss.unqa.dev/latest/lib/utilities/radius.clean.css) • [min](https://ucss.unqa.dev/latest/lib/utilities/radius.min.css) | 1.8KB / 1.1KB / 0.9KB / 0.3KB / 0.2KB | `.rad` |

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

## 🏛️ See it in Action
Below is real, semantic HTML example of a "Blog" section. Notice how we use `.s` for structure, `.g` for layout, and `.crd` for content, all controlled by CSS variables.

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

### Build Processes (`scripts/build.js`)
The project uses a consolidated Node.js build system (`scripts/build.js`) which orchestrates the entire process. This script handles bundling, cleaning, minifying, verifying, and generating documentation.

1.  **Bundling**: Recursively resolves `@import` statements to create flat files, removing build-time dependencies.
2.  **Cleaning**: Removes comments and redundant whitespace while preserving CSS nesting and structure.
3.  **Minifying**: Compresses CSS logic for production.
4.  **Verification**: The build script strictly verifies output file sizes to prevent "empty builds" or broken releases.
5.  **Compression**: Automatically generates `.gz` (Gzip) and `.br` (Brotli) versions of all CSS files (`scripts/compress.js`) for maximum performance on CDN.
6.  **Documentation**: Statically renders this `README.md` into `dist/index.html`, creating a self-hosted documentation site.

```bash
# Standard Build (Auto-detects branch for target)
npm run build

# Watch Mode (Rebuilds on change)
npm run watch

# Force specific targets
npm run build stable   # Builds to dist/stable
npm run build latest   # Builds to dist/latest
npm run build preview  # Builds to dist/preview-YYYY-MM-DD-HH-mm-ss
npm run build my-test  # Builds to dist/my-test (custom safe names allowed)

# Full Release Build (Latest + Prefixed + Stable)
npm run build full     # Builds /dist/latest/, /dist/p/, and /dist/stable/ in sequence


# Encapsulation & Prefixing (New)
uCss supports automatic prefixing for variables and classes, useful for avoiding conflicts or for branding.

# 1. Prefix All (Classes & Vars)
npm run build p           # Builds to dist/p/ (Prefix: .u-..., --u-...)
npm run build p myprefix  # Builds to dist/p/ (Prefix: .myprefix-..., --myprefix-...)

# 2. Prefix Classes Only
npm run build c           # Builds to dist/c/ (Prefix: .u-...)

# 3. Prefix Variables Only
npm run build v           # Builds to dist/v/ (Prefix: --u-...)

# 4. Custom Target + Prefix
npm run build custom-folder p unqa  # Builds to dist/custom-folder/ with "unqa" prefix
```

### Encapsulation Logic
The prefixer uses a robust Regex logic (masking strings/comments first) and intelligently **excludes** core namespaces to prevent breakage:
- **Excluded Classes**: `.wp-*`, `.block-*`, `.editor-*` (WordPress compatibility).
- **Excluded Variables**: `--theme-*`, `--wp-*`, `--block-*`.


### Maintenance
You can clean up build artifacts using the `clean` script.

```bash
# Clean everything (dist/ + logs + temp files)
npm run clean

# Clean everything EXCEPT stable and latest
npm run clean safe

# Clean specific targets
npm run clean dist         # Delete dist/ folder
npm run clean stable       # Delete only dist/stable
npm run clean latest       # Delete only dist/latest
npm run clean preview      # Delete all dist/preview-* folders
```

### Deployment Strategy
Our CI/CD pipeline (GitHub Actions) automatically deploys based on branch push:

| Branch | Output URL | Configuration |
| :--- | :--- | :--- |
| Branch | Output URL | Configuration |
| :--- | :--- | :--- |
| **`main`** | `.../stable/`, `.../p/` & `.../v/` | **Production**. Stable (root) + Encapsulated (`/p/`) + Variables Only (`/v/`). |
| **`dev`** | `.../latest/` | **Development**. Bleeding-edge code. |
| **`*`** (Other) | `.../preview-.../` | **Preview**. Timestamped deployments (e.g., `preview-2025-12-08...`). Auto-deleted after 7 days. |

---

## 🤝 Contributing
1.  Make changes in `src/lib`.
2.  Run `npm run build` locally to verify imports, bundling, and header generation.
3.  Check `dist/stable/u.min.css` to confirm your changes are present and correct.
4.  Push to `dev` branch.