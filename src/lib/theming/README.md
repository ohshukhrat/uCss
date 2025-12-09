# Theming Module

**Navigation**: [uCss](../../../) > [Source](../../) > [Modules](../) > [Theming](./) 

**Modules**: [Config](../config/) | [Base](../base/) | [Layout](../layout/) | [Theming](./) | [Typography](../typography/) | [Components](../components/) | [Utilities](../utilities/)

> **The Paint**. Manages color palettes, dark/light modes, and contextual overrides using CSS Custom Properties and Intercepted cascades.

---

## 📑 Page Contents
*   [Installation & Stats](#-installation-bundle-stats)
*   [Deep Dive: How It Works](#deep-dive-how-it-works)
*   [Reference: Sets (`.set`)](#reference-sets-set)
*   [Reference: Overlays (`.o`)](#reference-overlays-o)

---

## Theming Module

The **Theming Module** manages the visual layer of the framework. It handles color scopes, contextual theming, and overlays. It allows you to nest themes (e.g., a dark section inside a light page) just by applying a single class, with all children inheriting the correct colors automatically.

### Philosophy: The Cascade as a Feature
In modern web dev, "Cascading" is often treated as a bug to be avoided (hence Styled Components). In uCss, we embrace it.
*   **How it works**: We define high-level variables like `--t` (Title color) and `--bg` (Background).
*   **The Interception**: When you add `.set.dark`, we interrupt the cascade and redefine those variables for that specific DOM branch.
*   **The Result**: You write generic components (Cards, Buttons) that just read `var(--t)`. They don't care if they are in Dark Mode, Light Mode, or "Christmas Mode". They just render the current truth.

### 🧠 Thinking in Theming
1.  **Don't Paint Elements**: Avoid `color: white` on a card. Instead, apply a *theme context* (`.set.dark`) to the parent section. The card will inherit the correct colors naturally.
2.  **Scopes are Nested**: You can put a `.set.light` card inside a `.set.dark` section. It works perfectly.
3.  **Variables as Hooks**: Every component in uCss is just listening for a set of variables (`--bg`, `--t`, `--tx`). If you want to make a custom theme, you just need to update those 3-4 variables.

## 📦 Installation & Bundle Stats

| File | Full | Clean | Min | Gzip | Brotli | Download |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`theming.css`** | ~17KB | ~15KB | ~14KB | ~3.3KB | ~2.8KB | [src](https://ucss.unqa.dev/stable/lib/theming.css) • [clean](https://ucss.unqa.dev/stable/lib/theming.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming.min.css) |
| **`set.css`** | ~14KB | ~13KB | ~12KB | ~1.9KB | ~1.6KB | [src](https://ucss.unqa.dev/stable/lib/theming/set.css) • [clean](https://ucss.unqa.dev/stable/lib/theming/set.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming/set.min.css) |
| **`overlay.css`** | ~3.2KB | ~2.3KB | ~1.9KB | ~0.6KB | ~0.5KB | [src](https://ucss.unqa.dev/stable/lib/theming/overlay.css) • [clean](https://ucss.unqa.dev/stable/lib/theming/overlay.clean.css) • [min](https://ucss.unqa.dev/stable/lib/theming/overlay.min.css) |

### HTML Copy & Paste
| File | HTML Snippet (Stable) |
| :--- | :--- |
| **`theming.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming.min.css">`|
| **`set.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming/set.min.css">` |
| **`overlay.css`** | `<link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/theming/overlay.min.css">` |

---

## Deep Dive: How it Works

### 1. The Set Engine (`.set`)
The "Set" system is an **Inheritance Interceptor**. Instead of writing CSS selectors for every possible combination of colors, we use locally scoped variables.

#### The Pattern
1.  **Scope**: Applying `.set` creates a new stacking context and defines standardized variable hooks (`--set-bg`, `--set-c`, `--set-h`).
2.  **Intercept**: Global elements like `h1`, `p`, or `.crd` are programmed to listen to these hooks *before* falling back to global values.
    ```css
    h1 { color: var(--set-h, var(--t)); }
    ```
3.  **Result**: When you change the hook (`--set-h`), every child component updates automatically.

### 2. Infinite Nesting
Because overrides are handled via variables, themes stack naturally.
*   **Global**: Light Mode
    *   **Section**: Dark Mode (`.set.dark` sets `--bg: black`)
        *   **Card**: Light Mode (`.set.light` sets `--bg: white`)
            *   **Button**: Primary (`.set.primary` or just `.btn.primary`)

This allows for complex layouts without complex CSS selectors like `.dark-section .card .light-button`.

---

## Reference: Sets (`.set`)
Apply these classes to a container to re-theme everything inside it.

### 1. The Interface (Variables)
These are the hooks you can set manually if you want to create a custom theme on the fly without a new class.

| Variable | Description | Affects |
| :--- | :--- | :--- |
| **`--set-bg`** | Background Color | Container background, Card backgrounds |
| **`--set-c`** | Text Color | `p`, `span`, body text |
| **`--set-h`** | Heading Color | `h1` - `h6` |
| **`--set-lnk`** | Link Color | `a` (initial state) |
| **`--set-a`** | Accent / Hover | `a:hover`, interactive elements |

### 2. Presets Map
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

### Usage Examples

#### Dark Section
All text inside this section will automatically become light/white.
```html
<section class="s set dark">
  <h2 class="t">I am White</h2>
  <p class="tx">I am Light Grey</p>
</section>
```

#### Nested Cards
A Primary card inside a Dark section.
```html
<section class="set dark">
  <!-- This card pops with the Primary brand color -->
  <div class="crd set primary">
     <h3 class="t">Highlighted Content</h3>
  </div>
</section>
```

---

## Reference: Overlays (`.o`)
Absolute positioning utility for covers and backgrounds.

### 1. The Interface (Variables)
Override these CSS variables to customize specific overlay instances.

| Variable | Description | Default |
| :--- | :--- | :--- |
| **`--o-op`** | Opacity | `1` |
| **`--o-z`** | Z-Index | `auto` |
| **`--o-ar`** | Aspect Ratio | `auto` |
| **`--o-min-w`** | Min Width | `0` |
| **`--o-img-obj-fit`** | Image Fit | `cover` |

### 2. Class Map

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
