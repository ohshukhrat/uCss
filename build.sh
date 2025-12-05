#!/bin/bash

# Determine target directory
TARGET_DIR=""

if [ -n "$1" ]; then
  # Use provided argument
  TARGET_DIR="$1"
else
  # Auto-detect git branch
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
  
  if [ "$BRANCH" == "main" ]; then
    TARGET_DIR="stable"
  elif [ "$BRANCH" == "dev" ]; then
    TARGET_DIR="latest"
  else
    # Format: preview/YYYY-MM-DD-HH-MM
    TIMESTAMP=$(date +"%Y-%m-%d-%H-%M")
    TARGET_DIR="preview/$TIMESTAMP"
  fi
fi

# Define full output path
OUTPUT_DIR="dist/$TARGET_DIR"
echo "Targeting: $OUTPUT_DIR"

# Create output directories
mkdir -p "$OUTPUT_DIR/lib"

# --- FILE 1: Full Readable Source (u.css) ---
echo "Building $OUTPUT_DIR/u.css..."
cat src/css/clear.css \
    src/css/s.css \
    src/css/set.css \
    src/css/t.css \
    src/css/tx.css \
    src/css/ta.css \
    src/css/med.css \
    src/css/o.css \
    src/css/mg.css \
    src/css/pd.css \
    src/css/rad.css \
    src/css/lnk.css \
    src/css/crd.css \
    src/css/btn.css \
    src/css/f.css \
    src/css/g.css > "$OUTPUT_DIR/u.css"

# --- FILE 2: root.css (Standalone) ---
echo "Copying src/css/root.css to $OUTPUT_DIR/lib/root.css..."
cp src/css/root.css "$OUTPUT_DIR/lib/root.css"

# Minify root.css -> root.min.css
echo "Minifying root.css..."
cat src/css/root.css | node minify.js > "$OUTPUT_DIR/lib/root.min.css"

# Gzip root.min.css -> root.min.css.gz
# --- FILE 3: Minified (u.min.css) ---
echo "Minifying u.css..."
cat "$OUTPUT_DIR/u.css" | node minify.js > "$OUTPUT_DIR/u.min.css"

# Gzip ALL .css files in dist recursively
echo "Gzipping all .css files in dist..."
find dist -type f -name "*.css" -exec gzip -9 -k -f {} +

echo "Build complete."
ls -lh "$OUTPUT_DIR/u.css" "$OUTPUT_DIR/u.min.css" "$OUTPUT_DIR/lib/root.css" "$OUTPUT_DIR/lib/root.min.css"
