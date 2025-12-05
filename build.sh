#!/bin/bash

# Create output directories
mkdir -p dist/lib

# --- FILE 1: Full Readable Source (u.css) ---
echo "Building dist/u.css..."
cat src/css/clear.css \
    src/css/s.css \
    src/css/set.css \
    src/css/t.css \
    src/css/tx.css \
    src/css/ta.css \
    src/css/med.css \
    src/css/o.css \
    src/css/m.css \
    src/css/p.css \
    src/css/rad.css \
    src/css/lnk.css \
    src/css/crd.css \
    src/css/btn.css \
    src/css/f.css \
    src/css/g.css > dist/u.css

# --- FILE 2: root.css (Standalone) ---
echo "Copying src/css/root.css to dist/lib/root.css..."
cp src/css/root.css dist/lib/root.css

# Minify root.css -> root.min.css
echo "Minifying root.css..."
cat src/css/root.css | node minify.js > dist/lib/root.min.css

# Gzip root.min.css -> root.min.css.gz
# --- FILE 3: Minified (u.min.css) ---
echo "Minifying u.css..."
cat dist/u.css | node minify.js > dist/u.min.css

# Gzip ALL .css files in dist recursively
echo "Gzipping all .css files in dist..."
find dist -type f -name "*.css" -exec gzip -9 -k -f {} +

echo "Build complete."
ls -lh dist/u.css dist/u.min.css dist/u.min.css.gz dist/lib/root.css dist/lib/root.min.css dist/lib/root.min.css.gz
