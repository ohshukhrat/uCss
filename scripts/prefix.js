/**
 * @fileoverview CSS Prefixing Utility
 * 
 * @description
 * A robust Regex-based tool to encapsulate CSS by prefixing classes and variables.
 * Essential for the "Prefixed" build channel (`/p/`).
 * 
 * ---------------------------------------------------------------------------------------------
 * 🛡️ STRATEGY
 * ---------------------------------------------------------------------------------------------
 * 
 * 1. MASKING
 *    - First, we identify and "hide" all strings (`"..."`, `'...'`) and comments (`/ * ... * /`).
 *    - This prevents accidental replacement of content inside strings or comments.
 * 
 * 2. VARIABLE PREFIXING (`--var` -> `--prefix -var`)
 *    - Replaces all CSS custom properties.
 *    - EXCLUDES: standard uCss globals like `--theme -* `, `--block -* `, `--editor -* `.
 * 
 * 3. CLASS PREFIXING (`.class` -> `.prefix - class`)
 *    - Replaces all class selectors.
 *    - EXCLUDES: standard WordPress/Gutenberg classes (`.wp -* `, `.block -* `).
 * 
 * 4. UNMASKING
 *    - Restores the original strings and comments.
 * 
 * ---------------------------------------------------------------------------------------------
 * 🔧 EXPORTS
 * ---------------------------------------------------------------------------------------------
 * @exports prefixCss
 * 
 * @param {string} css - The raw CSS content.
 * @param {'p'|'c'|'v'} mode - Mode: 'p' (all), 'c' (classes), 'v' (variables).
 * @param {string} prefix - The prefix string (e.g., 'unqa', 'ucss').
 * @returns {string} The prefixed CSS.
 */
function prefixCss(css, mode = 'p', prefix = 'ucss') {
    // 0. Normalization
    const p = prefix.endsWith('-') ? prefix : `${prefix}-`;
    const classPrefix = `.${p}`;
    const varPrefix = `--${p}`;

    // 1. Masking (preserve strings and comments)
    const store = [];
    const maskToken = (content) => {
        store.push(content);
        return `___MASK_${store.length - 1}___`;
    };

    let safeCss = css
        // Mask Comments /* ... */
        .replace(/\/\*[\s\S]*?\*\//g, maskToken)
        // Mask Strings "..." or '...'
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, maskToken);

    // 2. Variable Prefixing
    // Matches: --variable-name
    // Excludes: --theme-*, --u-*, --ucss-* --wp-*, --block-*, --editor-* (and exact matches)
    if (mode === 'p' || mode === 'v') {
        safeCss = safeCss.replace(/--(?!(theme|u|ucss|wp|block|editor)(?:-|$))([\w-]+)/g, (match, restricted, varName) => {
            // If we somehow matched a restricted one incorrectly, safely return (though regex shouldn't)
            return `${varPrefix}${varName}`;
        });
    }

    // 3. Class Prefixing
    // Matches: .classname
    // Excludes: .wp-*, .block-*, .editor-* (and exact matches)
    if (mode === 'p' || mode === 'c') {
        safeCss = safeCss.replace(/\.([a-zA-Z_][\w-]*)/g, (match, className) => {
            // Check for exclusions
            if (/^(wp|block|editor)(?:-|$)/.test(className)) {
                return match;
            }
            return `${classPrefix}${className}`;
        });
    }

    // 4. Unmasking
    return safeCss.replace(/___MASK_(\d+)___/g, (_, id) => store[Number(id)]);
}

module.exports = { prefixCss };
