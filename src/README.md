# uCss Source Architecture

The `src` directory contains the raw, uncompiled code of uCss. This is where the development happens.

## Structure Overview

```text
.../
├── u.css           # The main entry point (Manifest)
└── lib/            # The core library modules
    ├── config/     # Global variables (The Brain)
    ├── base/       # Resets & Normalization
    ├── layout/     # Grid, Flex, Section engines
    ├── typography/ # Fluid Type Scales
    ├── components/ # UI Elements (Cards, Buttons, etc.)
    ├── theming/    # Theme Sets & Visual Layers
    └── utilities/  # Helper classes
```

## The Manifesto (`u.css`)

The `u.css` file is the **root manifest**. It doesn't contain CSS logic itself; instead, it orchestrates the `import` order of all modules to ensure correct cascading layers.

1.  **Configuration** comes first (variables).
2.  **Base** styles set the ground rules.
3.  **Layout** & **Typography** build the structure.
4.  **Components** introduce complex UI patterns.
5.  **Utilities** provide granular control overrides.

## Development Philosophy

### 1. Variables as the Source of Truth
We don't hardcode values in `components` or `layout`. Everything has fallbacks and references a CSS Variable defined in `lib/config/root.css`. This makes the framework entirely themeable at runtime.

### 2. Container Queries First
We avoid `@media (min-width: ...)` wherever possible.
*   **Cards** adapt to their *container* width.
*   **Grids** use `minmax()` logic.
*   **Typography** uses `clamp()` for fluid scaling.
This ensures components are truly portable—drop a Card in a sidebar or a main hero section, and it "just works."

### 3. Logical Properties
We use `margin-inline-start` instead of `margin-left` and `block-size` instead of `height`. This prepares uCss for RTL (Right-to-Left) languages and writing modes out of the box.

## How to use the source?

If you want to modify uCss or build it yourself:

1.  **Direct Import**: You can `@import` files directly from `src/` in your own build process if you use PostCSS/LightningCSS.
2.  **Modify Variables**: Edit `src/lib/config/root.css` to change the entire look and feel (radius, primary colors, spacing scales).
3.  **Build**: Run `npm run build` (or `./build.sh`) to generate the production-ready files in `dist/`.
