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

# --- FILE 1: Full Readable Source (u.css) ---
echo "Building $OUTPUT_DIR/u.css..."
{
    read_source src/css/clear.css
    read_source src/css/s.css
    read_source src/css/set.css
    read_source src/css/t.css
    read_source src/css/tx.css
    read_source src/css/ta.css
    read_source src/css/med.css
    read_source src/css/o.css
    read_source src/css/mg.css
    read_source src/css/pd.css
    read_source src/css/rad.css
    read_source src/css/lnk.css
    read_source src/css/crd.css
    read_source src/css/btn.css
    read_source src/css/f.css
    read_source src/css/g.css
} > "$OUTPUT_DIR/u.css"

# --- FILE 2: root.css (Standalone) ---
echo "Copying src/css/root.css to $OUTPUT_DIR/lib/root.css..."
read_source src/css/root.css > "$OUTPUT_DIR/lib/root.css"

# Minify root.css -> root.min.css
echo "Minifying root.css..."
read_source src/css/root.css | node minify.js > "$OUTPUT_DIR/lib/root.min.css"

# Gzip root.min.css -> root.min.css.gz
# --- FILE 3: Minified (u.min.css) ---
echo "Minifying u.css..."
cat "$OUTPUT_DIR/u.css" | node minify.js > "$OUTPUT_DIR/u.min.css"

# Gzip ALL .css files in dist recursively
echo "Gzipping all .css files in dist..."
find "$OUTPUT_DIR" -type f -name "*.css" -exec gzip -9 -k -f {} +

echo "Build complete."
ls -lh "$OUTPUT_DIR/u.css" "$OUTPUT_DIR/u.min.css" "$OUTPUT_DIR/lib/root.css" "$OUTPUT_DIR/lib/root.min.css"
