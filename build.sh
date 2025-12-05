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
ESBUILD="./node_modules/.bin/esbuild"
if [ -f "$ESBUILD" ]; then
    $ESBUILD src/css/root.css --minify --target=chrome90 --outfile=dist/lib/root.min.css
elif command -v npx &> /dev/null; then
    npx -y esbuild src/css/root.css --minify --target=chrome90 --outfile=dist/lib/root.min.css
else
    echo "Error: esbuild not found. Please run 'npm install -D esbuild'."
    exit 1
fi

# Gzip root.min.css -> root.min.css.gz
echo "Gzipping root.min.css..."
gzip -9 -k -f dist/lib/root.min.css

# --- FILE 3: Minified (u.min.css) ---
echo "Minifying u.css..."
if [ -f "$ESBUILD" ]; then
    $ESBUILD dist/u.css --minify --target=chrome90 --outfile=dist/u.min.css
else
    npx -y esbuild dist/u.css --minify --target=chrome90 --outfile=dist/u.min.css
fi

# --- FILE 4: Gzipped (u.min.css.gz) ---
echo "Gzipping u.min.css..."
gzip -9 -k -f dist/u.min.css

echo "Build complete."
ls -lh dist/u.css dist/u.min.css dist/u.min.css.gz dist/lib/root.css dist/lib/root.min.css dist/lib/root.min.css.gz
