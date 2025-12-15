# Theming Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Theming](./)

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](./) | [Typography](../typography/) | [Patterns](../patterns/) | [Utilities](../utilities/)

> **Contextual Scoping**. A revolutionary logic for handling Dark Mode, Brand Themes, and Alerts. Instead of manually overriding colors with high-specificity selectors, the Theming module uses **Variable Interception** (`.set`). This allows for infinite nesting of themes (Dark inside Light inside Dark) with zero code duplication and perfect semantic integrity.

---

## 📑 Contents

*   [🌟 Overview](#overview)
*   [🤯 Philosophy](#philosophy)
    *   [Inversion of Control](#inversion-of-control)
    *   [The "Scope" vs "Global" Debate](#the-scope-vs-global-debate)
*   [🚀 Getting Started](#getting-started)
*   [📦 Installation & Stats](#installation--stats)
    *   [Bundle Stats](#bundle-stats)
    *   [Direct Links](#direct-links)
    *   [HTML Snippets](#html-snippets)
*   [📂 Files Reference](#files-reference)
*   [🧠 Deep Dive](#deep-dive)
    *   [1. The 'Set' Engine (Variable Interception)](#1-the-set-engine-variable-interception)
    *   [2. Infinite Nesting Logic](#2-infinite-nesting-logic)
    *   [3. The Overlay Architecture (`.o`)](#3-the-overlay-architecture-o)
*   [📍 Reference: Content Map](#reference-content-map)
    *   [Standard Sets](#standard-sets)
    *   [Functional Sets](#functional-sets)
    *   [Set Variables (Hooks)](#set-variables-hooks)
    *   [Overlay Classes](#overlay-classes)
*   [💡 Best Practices & Customization](#best-practices--customization)
    *   [Creating Semantic Sets](#creating-semantic-sets)
    *   [The "Christmas Theme" Example](#the-christmas-theme-example)
*   [🔧 For Developers](#for-developers)

---

## 🌟 Overview

The **Theming Module** is the visual layer of uCss. It decouples "Component Definition" from "Color Definition".
It answers the question: "How do I make this specific card look like an Error Message without writing a `.card-error` class?"

`.set` handles color scopes, contextual theming, and overlays. It allows you to nest themes (e.g., a dark section inside a light page) just by applying a single class, with all children inheriting the correct colors automatically.

### Top Features
1.  **Scope-Based Themes**: A "Dark Mode" isn't a global switch on the `<body>`. It's a scope (`.set.dark`). You can apply it to just a Sidebar, or a Card, or the whole page.
2.  **Universal Hooks**: Every component in uCss (Typos, Buttons, Cards) listens to universal variables like `--t` (Title Color), `--tx` (Text Color), and `--bg` (Background Color). The Theming module simply *sets* these variables. If you want to make a custom theme, or override current set, you just need to update those 3-4 variables.
3.  **Functional Contexts**: Need a "Success Message"? Just use `.set.success`. It automatically sets backgrounds to green, text to dark green, and headings to forest green.
4.  **Scopes are Nested**: You can put a `.set.light` card inside a `.set.dark` section. It works perfectly.
5.  **Bulletproof Overlays**: The `.o` utility creates perfect image overlays (gradients, dark modes) that sit *behind* text but *above* images.

> [!LIGHTBULB]
> **Why do we call it "Set"?**
> Because you are "Setting" the context and it is a **"Set"** of variables. You are setting the rules for everything inside that element.

---

## 🤯 Philosophy

### Inversion of Control
In old CSS, we wrote:
```css
/* Bad: The Card knows about the Theme */
.card { background: white; color: black; }
.dark-mode .card { background: black; color: white; }
```
This spirals out of control when you add "Brand Mode", "Holiday Mode", "Accent Mode". You have to update every component for every theme.

**uCss inverts the dependency:**
1.  **The Component** says: "I will color my title with `var(--set-h)`."
2.  **The Theme** says: "Index `.set.dark`, `var(--set-h)` is White."

This means components **never know what theme they are in**. They just consume the variables provided by their nearest ancestor. This is "Inversion of Control" for CSS.

### The "Scope" vs "Global" Debate
Most frameworks have a Global Dark Mode. uCss has **Scoped** Dark Mode.
You can have a Light Page with a Dark Header. And inside that Dark Header, a Light Card. And inside that Light Card, a Dark Button.
Infinite nesting works because CSS Variables cascade naturally.

---

## 🚀 Getting Started

### The "Clicked" Moment
1.  Create a section: `<section class="s set primary">`.
2.  Put a heading inside: `<h1>I am white</h1>`.
3.  Put a card inside: `<article class="crd">`.
4.  Notice the card automatically picked up the brand colors?
5.  Now change `primary` to `dark`. The exact same HTML is now a perfect Dark Mode section.

### Rollout in 5 Seconds
1.  **Load the module**: `theming.min.css`.
2.  **Set the Page Tone**: Adds `<body class="set light">`.
3.  **Create a Dark Hero**: `<header class="s set dark">`.

---

## 📦 Installation & Stats

### Bundle Stats

| File | Full (Raw) | Clean | Min | Gzip | Brotli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`theming.css`** | **19 KB** | **17 KB** | **15 KB** | **3.8 KB** | **3.2 KB** |
| `set.css` | 16 KB | 15 KB | 13 KB | 2.7 KB | 2.3 KB |
| `overlay.css` | 3.5 KB | 2.5 KB | 2.1 KB | 0.7 KB | 0.6 KB |

### Direct Links

| Module | Full Source | Clean Source | Minified (Prod) |
| :--- | :--- | :--- | :--- |
| **Theming** | [theming.css](https://ucss.unqa.dev/stable/lib/theming.css) | [theming.clean.css](https://ucss.unqa.dev/stable/lib/theming.clean.css) | [theming.min.css](https://ucss.unqa.dev/stable/lib/theming.min.css) |

### HTML Snippets

#### Standard
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming.min.css">
```

#### Prefixed (`/p/`)
```html
<link rel="stylesheet" href="https://ucss.unqa.dev/p/lib/theming.min.css">
```

---

## 📂 Files Reference

| File | Description | Download |
| :--- | :--- | :--- |
| **`set.css`** | **Engine**. The Contextual Theming Logic. Defines providing scopes like `.set.primary` which re-map the global variables to local values. This is where 90% of the magic happens. | [src](https://ucss.unqa.dev/stable/lib/theming/set.css) |
| **`overlay.css`** | **Visuals**. Utilities for overlays (`.o`). Absolute positioned layers for covering background images or creating modals. | [src](https://ucss.unqa.dev/stable/lib/theming/overlay.css) |

---

## 🧠 Deep Dive

### The 'Set' Engine (`.set` Variable Interception)
The "Set" system is an **Inheritance Interceptor**. It works by redefining the **Base Palette Tokens** at a new scope root.

#### The Pattern
1.  **Scope**: Applying `.set` creates a new stacking context and defines standardized variable hooks (`--set-bg`, `--set-c`, `--set-h`).
2.  **Intercept**: Global elements like `h1`, `p`, or `.crd` are programmed to listen to these hooks *before* falling back to global values.
    ```css
    h1 { color: var(--set-h, var(--t)); }
    ```
3.  **Result**: When you change the hook (`--set-h`), every child component updates automatically.

**The Code Pattern**:
```css
/* set.css pseudo-code */
.set.dark {
  /* 1. Define Local Values */
  --set-bg: var(--d);      /* Background is Dark */
  --set-tx: var(--l);      /* Text is Light */
  --set-h:  var(--white);  /* Headings are White */
  
  /* 2. Bind to Global Hooks */
  background-color: var(--set-bg);
  color: var(--set-tx);
  
  /* 3. Re-cast Component Vars */
  --btn-bg: var(--set-tx); /* Buttons become Light on Dark */
  --input-bg: rgba(255,255,255, 0.1); 
}
```
Any child that uses `color: var(--tx)` might not change, but children using semantic variables will now resolve to these new definitions.

#### Infinite Nesting Logic
Because overrides are handled via variables, themes stack naturally.

*   **Global**: Light Mode
    *   **Section**: Dark Mode (`.set.dark` sets `--bg: black`)
        *   **Card**: Light Mode (`.set.light` sets `--bg: white`)
            *   **Button**: Primary (`.set.primary` or just `.btn.primary`)

```html
<div class="set light">
   <!-- I am Light -->
   <div class="set dark">
      <!-- I am Dark -->
      <div class="set light">
         <!-- I am Light (Inception!) -->
      </div>
   </div>
</div>
```
It would be impossible with standard CSS selectors unless you write complex overrides (`.light .dark .light`). With Variables, it's free. The browser handles the cascade for us.

`.set` allows for complex layouts with simple CSS selectors like `set.dark`.


##### Dark Section
All text inside this section will automatically become light/white.
```html
<section class="s set dark">
  <h2 class="t">I am White</h2>
  <p class="tx">I am Light Grey</p>
</section>
```

##### Nested Cards
A Primary card inside a Dark section.
```html
<section class="set dark">
  <!-- This card pops with the Primary brand color -->
  <div class="crd set primary">
     <h3 class="t">Highlighted Content</h3>
  </div>
</section>

### The Overlay Architecture (`.o`)
The `.o` class is a specialized absolute container designed for **Hero Headers** and **Card Media**.
*   **Structure**:
    ```html
    <figure class="o">
        <img src="..." alt="...">
        <!-- ::after pseudo-element covers this image -->
        <figcaption class="o__content">Text on top</figcaption>
    </figure>
    ```
*   **Layering**:
    1.  Figure (Container)
    2.  `img` (Z-index 0)
    3.  `::after` (Z-index 1) -> The Tint/Gradient
    4.  `.o__content` (Z-index 2) -> The Text

This guarantees readability. You never have to worry about "Is this image too bright for white text?" because the overlay (`.o.d`) ensures contrast.

#### Overlay Variables
Override these CSS variables to customize specific overlay instances.

| Variable | Description | Default |
| :--- | :--- | :--- |
| **`--o-op`** | Opacity | `1` |
| **`--o-z`** | Z-Index | `auto` |
| **`--o-ar`** | Aspect Ratio | `auto` |
| **`--o-min-w`** | Min Width | `0` |
| **`--o-img-obj-fit`** | Image Fit | `cover` |

#### Classes Map

| Class | Function |
| :--- | :--- |
| `.o` | Base overlay (Absolute, z-index managed). |
| `.o.l` | Light tint (White overlay). |
| `.o.d` | Dark tint (Black overlay). |
| `.o.grd` | Gradient tint. |
| `.o.bd` | Bold opacity (0.64). |
| `.o.lt` | Light opacity (0.24). |
| `.o.no` | Invisible opacity (0). |

### Usage Examples

#### Hero Background with Dark Tint
A classic hero pattern: Image background + Dark Overlay + White Text.
```html
<section class="s set dark">
  <!-- The Content Layer (Relative) -->
  <div class="s__c">
     <h1 class="t">Welcome</h1>
  </div>

  <!-- The Background Layer -->
  <figure class="o d bd">
    <img src="hero.jpg" alt="Background">
  </figure>
</section>
```

#### Gradient Card Cover
```html
<div class="crd set dark">
  <div class="crd__body">
    <h3 class="t">Card Title</h3>
  </div>
  <figure class="o grd">
    <img src="thumb.jpg" alt="Thumbnail">
  </figure>
</div>
```

---

## 📍 Reference: Content Map

### Standard Sets
These sets are for general UI layout.

| Class | Appearance | Use Case |
| :--- | :--- | :--- |
| **`.set.light`** | White Bg, Dark Text | Default UI state. Cards, Main Areas. |
| **`.set.dark`** | Black Bg, Light Text | Footers, Dark Sidebars, Night Mode. |
| **`.set.primary`** | Brand Bg, Contrast Text | Hero sections, Call to Actions. |
| **`.set.secondary`** | Sec Brand Bg | Feature Headers. |
| **`.set.alt`** | Gray/Off-White | Zebra striping sections. |
| **`.set.surface`** | Paper/Card Bg | Elevated surfaces, Modals. |

### Functional Sets
These sets convey meaning (State).

| Class | Appearance | Use Case |
| :--- | :--- | :--- |
| **`.set.success`** | Light Green Bg, Dark Green Text | Success toasts, valid form groups. |
| **`.set.error` / `.alert`** | Light Red Bg, Dark Red Text | Error alerts, destructive zones. |
| **`.set.warning`** | Light Orange Bg | Warnings. |
| **`.set.info`** | Light Blue Bg | Information tips. |
| **`.set.spotlight`** | Yellow Bg | Highlighting a specific item. |

### Set Variables (Hooks)
These are the variables that Sets manipulate.

| Variable | Description |
| :--- | :--- |
| **`--set-bg`** | Background color for the current scope. |
| **`--set-h`** | Heading color (h1-h6). |
| **`--set-tx`** | Body text color. |
| **`--set-bd`** | Border color. |

#####. Deep Dive: Presets Map
Pre-configured themes included in `set.css`.

| Class | Description | Variables Modified |
| :--- | :--- | :--- |
| `.set.primary` | Brand Primary | Sets background to subtle Primary color, text to alt (text, dark by default). |
| `.set.accent` | Brand Accent | Sets background to subtle Accent color, text to alt (text, dark by default). |
| `.set.secondary` | Brand Secondary | Sets background to subtle Secondary color, text to light. |
| `.set.tertiary` | Brand Tertiary | Sets background to subtle Tertiary color, text to dark. |
| | | |
| `.set.dark` | Dark Theme | Sets background to Black/Dark Grey, text to White/Light. |
| `.set.light` | Light Theme | Sets background to White, text to Dark. |
| `.set.alt` | Alternative Theme | Sets background to Alternative (Dark: Darker, Light: Lighter), text inversed. |
| `.set.surface` | Surface Theme | Sets background to Surface (Light Shaded White by default), text to alt (text, dark by default). |
| `.set.card` | Card Theme | Sets background to Card (White by default), text to alt (text, dark by default). |
| | | |
| `.set.success` | Functional Green | Sets background to Green, background to tint blurred Green, text to alt (text, dark by default), title to Green. |
| `.set.alert` / `.set.error` | Functional Red | Sets background to Red, background to tint blurred Red, text to alt (text, dark by default), title to Red. |
| `.set.info` | Functional Blue | Sets background to Blue, background to tint blurred Blue, text to alt (text, dark by default), title to Blue. |
| `.set.tip` | Functional Purple | Sets background to Purple, background to tint blurred Purple, text to alt (text, dark by default), title to Purple. |
| `.set.notification` | Functional Yellow | Sets background to Yellow, background to tint blurred Yellow, text to alt (text, dark by default), title to Yellow. |
| | | |
| `.set.border` | Utilities | Sets border color to current text color. |

### Overlay Classes (`.o`)

| Class | Description | Value |
| :--- | :--- | :--- |
| **`.o`** | Base Overlay. | relative/absolute logic only. |
| **`.o.d`** | Dark Overlay. | `rgba(0,0,0, 0.5)` |
| **`.o.l`** | Light Overlay. | `rgba(255,255,255, 0.5)` |
| **`.o.grd`** | Gradient. | Vertical Brand Gradient. |
| **`.o.lt`** | Light Opacity. | `0.24` opacity. |
| **`.o.bd`** | Bold Opacity. | `0.64` opacity. |

---

## 💡 Best Practices & Customization

### Creating Semantic Sets
You can create a "Christmas Theme" easily. You don't need to write new selectors for Buttons or Cards. You just define the Set.
```css
/* Defines a new custom set */
.set.christmas {
  --set-bg: #c00; /* Red Background */
  --set-h: #fff;  /* White Headings */
  --set-tx: #efe; /* Off-white text */
  --btn-bg: #0f0; /* Green Buttons! */
  --btn-tx: #000;
}
```
Now `<div class="set christmas">` works instantly with all uCss patterns. Buttons turn green, text turns white.

### The "Christmas Theme" Example
```html
<section class="s set christmas ta-c">
   <h1>Merry Christmas</h1>
   <button class="btn">Click me</button> <!-- Turns Green automatically -->
</section>
```

---

## 🔧 For Developers

*   **Mapping Strategy**: If you add a new component, bind its colors to `--set-*` variables, not `--p` or `--black`.
*   **Performance**: Sets are extremely performant because they rely on native browser variable cascading. No JS event listeners are involved.
*   **Accessibility**: When creating custom sets, ALWAYS verify contrast ratios. uCss defaults are accessible, but custom overrides might not be.

---

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Theming](./) 

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
│   ├── button/              #    - Atomic Component
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
├── theming/                 # 5. THEMING (The Skin) <== YOU ARE HERE
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
