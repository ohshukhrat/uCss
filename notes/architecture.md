# uCss Architecture

## Folder Structure (New 7-Layer Model)

The framework is organized into 7 standardized layers, moving from configuration to specific patterns.

```
src/lib/
├── config/                  # 1. CONFIGURATION (The Brain)
│   ├── root/                #    - Semantic Modules
│   │   ├── colors.css       #    - Palettes & Themes
│   │   ├── typography.css   #    - Fonts & Scales
│   │   ├── layout.css       #    - Radius & Spacing
│   │   ├── patterns.css     #    - Component Vars
│   │   └── blocksy/         #    - Theme Bridge & Map
│   ├── blocksy.css          #    - Theme Adapter
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
├── layout/                  # 3. LAYOUT (The Skeleton)
│   ├── grid/                #    - Grid Engine
│   │   ├── base.css         #    - Core Logic
│   │   ├── columns.css      #    - Presets
│   │   ├── subgrid.css      #    - Smart Grid
│   │   ├── recipes.css      #    - Smart Logic (.masonry .g-row)
│   │   └── item/            #    - Child Logic
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
├── theming/                 # 4. THEMING (The Skin)
│   └── ...
│
├── typography/              # 5. TYPOGRAPHY (The Voice)
│   └── text.css
│
├── patterns/                # 6. PATTERNS (The Components)
│   ├── button/              #    - Atomic Component
│   │   ├── base.css
│   │   ├── skins.css
│   │   └── sizes.css
│   ├── card.css
│   └── patterns.css         #    - Entry Point
│
└── utilities/               # 7. UTILITIES (The Tools)
    └── ...
```

## Layers Description

1.  **Config**: Pure definition. No selectors. defines `--vars` that drive the system.
2.  **Base**: Global resets and element defaults (`html`, `body`, `p`).
3.  **Layout**: Macro layout systems (`.g`, `.flex`).
4.  **Theming**: Visual styles not tied to components (Design Tokens).
5.  **Typography**: Text utility classes (`.h1`, `.text-l`).
6.  **Patterns**: Complex UI components (`.btn`, `.card`).
7.  **Utilities**: Single-purpose helper classes (`.m-0`, `.hidden`).

## Key Principles

*   **Aggregators**: Root files (e.g., `lib/patterns.css`) act as aggregators, importing partials.
*   **Direct Imports**: Modules avoid intermediate `index.css` imports for performance and clarity.
*   **Partials**: Large modules are split into semantic partials (e.g., `button/skins.css`).

