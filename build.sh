#!/bin/bash

# Default values
TARGET_DIR=""
SOURCE_REF=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --source)
      SOURCE_REF="$2"
      shift 2
      ;;
    *)
      if [ -z "$TARGET_DIR" ]; then
        TARGET_DIR="$1"
      fi
      shift
      ;;
  esac
done

# Function to read file content (either from filesystem or git)
read_source() {
  local FILE_PATH="$1"
  if [ -n "$SOURCE_REF" ]; then
    git show "$SOURCE_REF:$FILE_PATH"
  else
    cat "$FILE_PATH"
  fi
}

# Determine target directory if not provided
if [ -z "$TARGET_DIR" ]; then
  if [ -n "$SOURCE_REF" ]; then
    # If source is explicitly provided, verify if it looks like main/stable
    if [[ "$SOURCE_REF" == "main" || "$SOURCE_REF" == "origin/main" ]]; then
       BRANCH="main"
    elif [[ "$SOURCE_REF" == "dev" || "$SOURCE_REF" == "origin/dev" ]]; then
       BRANCH="dev"
    else
       BRANCH="unknown"
    fi
  else
    # Auto-detect current git branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
  fi

  if [ "$BRANCH" == "main" ]; then
    TARGET_DIR="stable"
  elif [ "$BRANCH" == "dev" ]; then
    TARGET_DIR="latest"
  elif [ -n "$SOURCE_REF" ]; then
     # Use the ref name as target if not main/dev
     # Clean ref name for directory usage (substitute / with -)
     CLEAN_REF=$(echo "$SOURCE_REF" | sed 's/\//-/g')
     TARGET_DIR="preview/$CLEAN_REF" 
  else
    # Format: preview/YYYY-MM-DD-HH-MM
    TIMESTAMP=$(date +"%Y-%m-%d-%H-%M")
    TARGET_DIR="preview/$TIMESTAMP"
  fi
fi

# Define full output path
OUTPUT_DIR="dist/$TARGET_DIR"
echo "Targeting: $OUTPUT_DIR"
if [ -n "$SOURCE_REF" ]; then
    echo "Reading source from: $SOURCE_REF"
else
    echo "Reading source from: Local filesystem"
fi

# Clean previous build
echo "Cleaning $OUTPUT_DIR..."
rm -rf "$OUTPUT_DIR"

# Create output directories
mkdir -p "$OUTPUT_DIR/lib"

# Copy server files to dist root (only on first build or if missing)
DIST_ROOT="dist/"
if [ ! -f "$DIST_ROOT/.htaccess" ]; then
  echo "Copying server configuration files to dist root..."
  cp server/.htaccess.template "$DIST_ROOT/.htaccess"
  echo "  ✓ Copied .htaccess to dist root"
fi




# --- FILE 1: Full Recursive Bundle (u.css) ---
echo "Building $OUTPUT_DIR/u.css..."
{
  node scripts/bundle.js "src/u.css"
} > "$OUTPUT_DIR/u.css"

# --- FILE 2: Clean u.css (No Comments, Preserved Formatting) ---
echo "Cleaning u.css..."
cat "$OUTPUT_DIR/u.css" | node scripts/clean.js > "$OUTPUT_DIR/u.clean.css"

# --- FILE 3: Minify u.css ---
echo "Minifying u.css..."
cat "$OUTPUT_DIR/u.clean.css" | node scripts/minify.js > "$OUTPUT_DIR/u.min.css"


# --- FILE 4: Modular Builds from src/lib ---
echo "Building modular lib files..."

# Ensure we have the list of consolidation files in src/lib
if [ -z "$SOURCE_REF" ]; then
    MODULE_FILES=$(ls src/lib/*.css 2>/dev/null)
else
    # Only files in src/lib root that end in .css
    MODULE_FILES=$(git ls-tree --name-only "$SOURCE_REF:src/lib/" | grep "\.css$" | sed 's/^/src\/lib\//')
fi

for mod_file in $MODULE_FILES; do
    MOD_NAME=$(basename "$mod_file" .css)
    
    # Skip if not proper module structure (e.g. index.css if it existed)
    # We expect src/lib/components.css to map to src/lib/components/ directory
    
    TARGET_LIB_FILE="$OUTPUT_DIR/lib/$MOD_NAME.css"
    TARGET_LIB_DIR="$OUTPUT_DIR/lib/$MOD_NAME"
    
    mkdir -p "$TARGET_LIB_DIR"

    # 1. Build Bundle (resolve imports from this module file)
    echo "  - Bundle: $MOD_NAME.css"
    {
       node scripts/bundle.js "$mod_file"
    } > "$TARGET_LIB_FILE"
    
    # Clean Bundle
    cat "$TARGET_LIB_FILE" | node scripts/clean.js > "${TARGET_LIB_FILE%.css}.clean.css"
    
    # Minify Bundle (from clean source)
    cat "${TARGET_LIB_FILE%.css}.clean.css" | node scripts/minify.js > "${TARGET_LIB_FILE%.css}.min.css"
    
    # 2. Copy and minify individual files
    # We look into src/lib/$MOD_NAME/ for leaf files
    SRC_SUBDIR="src/lib/$MOD_NAME"
    
    if [ -z "$SOURCE_REF" ]; then
        if [ -d "$SRC_SUBDIR" ]; then
             INDIVIDUAL_FILES=$(ls "$SRC_SUBDIR"/*.css 2>/dev/null)
        else
             INDIVIDUAL_FILES=""
        fi
    else
        INDIVIDUAL_FILES=$(git ls-tree -r --name-only "$SOURCE_REF" | grep "^$SRC_SUBDIR/.*\.css$")
    fi
    
    for leaf in $INDIVIDUAL_FILES; do
        filename=$(basename "$leaf")
        read_source "$leaf" > "$TARGET_LIB_DIR/$filename"
        read_source "$leaf" | node scripts/clean.js > "$TARGET_LIB_DIR/${filename%.css}.clean.css"
        read_source "$leaf" | node scripts/clean.js | node scripts/minify.js > "$TARGET_LIB_DIR/${filename%.css}.min.css"
    done
done

# --- FILE 5: Generate index.html (Documentation from README) ---
echo "Generating index.html from README.md..."
INDEX_FILE="$OUTPUT_DIR/index.html"

# Pre-render markdown to HTML using our custom renderer
README_HTML=$(node scripts/render-docs.js README.md 2>/dev/null || echo "<p>Error rendering documentation</p>")

cat <<'EOF' > "$INDEX_FILE"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="uCss - Modern, mobile-first, pure CSS framework with zero dependencies">
    <title>uCss Documentation</title>
    <link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config.css">
    <link rel="stylesheet" href="https://ucss.unqa.dev/stable/u.min.css">
    <style>
        /* Minimal doc-specific styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: var(--tx);
        }
        
        /* Code styling */
        code {
            background: var(--srf);
            padding: 0.2em 0.4em;
            border-radius: 0.375rem;
            font-family: ui-monospace, "SF Mono", Monaco, "Cascadia Code", monospace;
            font-size: 0.875em;
        }
        
        pre {
            background: var(--srf);
            padding: 1rem;
            overflow-x: auto;
            border-radius: 0.375rem;
            border: 1px solid var(--out);
        }
        
        pre code {
            background: none;
            padding: 0;
            font-size: 0.875rem;
        }
        
        /* Table styling */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        
        th, td {
            border: 1px solid var(--out);
            padding: 0.5rem 1rem;
            text-align: left;
        }
        
        th {
            background: var(--srf);
            font-weight: 600;
        }
        
        /* Alert boxes (GitHub-style) */
        .alert {
            padding: 1rem;
            margin: 1rem 0;
            border-left: 4px solid;
            border-radius: 0.375rem;
        }
        
        .alert strong {
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .alert-note {
            background: var(--sp-lt);
            border-color: var(--out);
        }
        
        .alert-tip {
            background: var(--sp);
            border-color: var(--out);
        }
        
        .alert-important {
            background: var(--sp-bd);
            border-color: var(--out);
        }
        
        .alert-warning {
            background: var(--alr);
            border-color: var(--out);
        }
        
        .alert-caution {
            background: var(--alr);
            border-color: var(--out);
        }
        
        /* Links */
        a {
            color: var(--t);
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        /* Horizontal rules */
        hr {
            border: none;
            border-top: 1px solid var(--out);
            margin: 2rem 0;
        }
    </style>
</head>
<body>
    <section class="s" style="--sc-max-w: 48rem; --scc-gap: .75rem;">
        <div class="sc">
          <div>
EOF

# Append the pre-rendered HTML content
echo "$README_HTML" >> "$INDEX_FILE"

cat <<'EOF' >> "$INDEX_FILE"
          </div>
        </div>
    </section>
</body>
</html>
EOF


# --- Generate root index.html (same as variants, README-based) ---
echo "Generating root index.html from README.md..."
ROOT_INDEX="dist/index.html"

# Use same README HTML generation
cat <<'EOF' > "$ROOT_INDEX"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="uCss - Modern, mobile-first, pure CSS framework with zero dependencies">
    <title>uCss Documentation</title>
    <link rel="stylesheet" href="https://ucss.unqa.dev/stable/lib/config.css">
    <link rel="stylesheet" href="https://ucss.unqa.dev/stable/u.min.css">
    <style>
        /* Minimal doc-specific styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: var(--tx);
        }
        
        /* Code styling */
        code {
            background: var(--srf);
            padding: 0.2em 0.4em;
            border-radius: 0.375rem;
            font-family: ui-monospace, "SF Mono", Monaco, "Cascadia Code", monospace;
            font-size: 0.875em;
        }
        
        pre {
            background: var(--srf);
            padding: 1rem;
            overflow-x: auto;
            border-radius: 0.375rem;
            border: 1px solid var(--out);
        }
        
        pre code {
            background: none;
            padding: 0;
            font-size: 0.875rem;
        }
        
        /* Table styling */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        
        th, td {
            border: 1px solid var(--out);
            padding: 0.5rem 1rem;
            text-align: left;
        }
        
        th {
            background: var(--srf);
            font-weight: 600;
        }
        
        /* Alert boxes (GitHub-style) */
        .alert {
            padding: 1rem;
            margin: 1rem 0;
            border-left: 4px solid;
            border-radius: 0.375rem;
        }
        
        .alert strong {
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .alert-note {
            background: var(--sp-lt);
            border-color: var(--out);
        }
        
        .alert-tip {
            background: var(--sp);
            border-color: var(--out);
        }
        
        .alert-important {
            background: var(--sp-bd);
            border-color: var(--out);
        }
        
        .alert-warning {
            background: var(--alr);
            border-color: var(--out);
        }
        
        .alert-caution {
            background: var(--alr);
            border-color: var(--out);
        }
        
        /* Links */
        a {
            color: var(--t);
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        /* Horizontal rules */
        hr {
            border: none;
            border-top: 1px solid var(--out);
            margin: 2rem 0;
        }
    </style>
</head>
<body>
    <section class="s" style="--sc-max-w: 48rem; --scc-gap: .75rem;">
        <div class="sc">
          <div>
EOF

# Append the pre-rendered HTML content (same as variant)
echo "$README_HTML" >> "$ROOT_INDEX"

cat <<'EOF' >> "$ROOT_INDEX"
          </div>
        </div>
    </section>
</body>
</html>
EOF

echo "  ✓ Root index.html generated"



# --- BUILD VERIFICATION ---
echo "Verifying build outputs..."

verify_file() {
  local file="$1"
  local min_size="$2"
  
  if [ ! -f "$file" ]; then
    echo "❌ ERROR: $file was not generated"
    exit 1
  fi
  
  local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
  if [ "$size" -lt "$min_size" ]; then
    echo "❌ ERROR: $file is suspiciously small (${size} bytes, expected >${min_size})"
    exit 1
  fi
  
  echo "  ✓ $file (${size} bytes)"
}

# Verify critical files
verify_file "$OUTPUT_DIR/u.css" 5000
verify_file "$OUTPUT_DIR/u.min.css" 3000
verify_file "$OUTPUT_DIR/index.html" 1000
verify_file "$OUTPUT_DIR/lib/components.min.css" 500
verify_file "$OUTPUT_DIR/lib/layout.min.css" 500

echo "✅ Build verification passed"

# Gzip ALL .css files in dist recursively
echo "Gzipping all .css files in dist..."
find "$OUTPUT_DIR" -type f -name "*.css" -exec gzip -9 -k -f {} +

# Brotli compress ALL .css files (better compression than gzip)
echo "Brotli compressing all .css files in dist..."
if command -v brotli &> /dev/null; then
  find "$OUTPUT_DIR" -type f -name "*.css" -exec brotli -q 11 -k -f {} \;
  echo "  ✓ Brotli compression complete"
else
  echo "  ⚠ Brotli not installed, skipping .br generation"
fi

echo "🎉 Build complete!"
ls -lh "$OUTPUT_DIR/u.css" "$OUTPUT_DIR/lib/"
