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

# --- HELPER FUNCTION: Recursively Resolve Imports ---
# Warning: This is a simple implementation. It only handles 2 levels of depth perfectly 
# as per our project structure (u.css -> lib/foo.css -> foo/bar.css).
# For fully generic recursive flattening, a more complex script (Node.js) would be better.
# But bash is requested/preferred in current context. Let's make it work for our specific structure.

resolve_imports() {
    local parent_file="$1"
    local base_dir="$2" # Base directory relative to project root to look for imports, if relative
    
    # Get imports
    if [ -n "$SOURCE_REF" ]; then
         if ! git show "$SOURCE_REF:$parent_file" >/dev/null 2>&1; then return; fi
         local imports=$(git show "$SOURCE_REF:$parent_file" | grep '@import' | sed -E 's/@import "([^"]+)";/\1/')
    else
         if [ ! -f "$parent_file" ]; then return; fi
         local imports=$(grep '@import' "$parent_file" | sed -E 's/@import "([^"]+)";/\1/')
    fi

    for import in $imports; do
        # If imports start with "lib/", it is from root (src/lib)
        # If imports are relative (e.g. "button.css"), it is from base_dir/
        
        local full_path=""
        if [[ "$import" == lib/* ]]; then
             full_path="src/$import"
        else
             full_path="$base_dir/$import"
        fi
        
        # Recurse? 
        # For our structure, we just need to check if THIS file has imports.
        # If it has imports, we resolve them. If not, we print the file content.
        
        # Check for imports in this child file
        local has_imports="false"
        if [ -n "$SOURCE_REF" ]; then
             if git show "$SOURCE_REF:$full_path" | grep -q '@import'; then has_imports="true"; fi
        else
             if grep -q '@import' "$full_path"; then has_imports="true"; fi
        fi
        
        if [ "$has_imports" == "true" ]; then
             # It's a module file (like lib/components.css), recurse
             # New base dir is dir of full_path
             local new_base=$(dirname "$full_path")
             resolve_imports "$full_path" "$new_base"
        else
             # It's a leaf file (like components/button.css), print it
             read_source "$full_path"
             echo ""
        fi
    done
}


# --- FILE 1: Full Recursive Bundle (u.css) ---
echo "Building $OUTPUT_DIR/u.css..."
{
  resolve_imports "src/u.css" "src"
} > "$OUTPUT_DIR/u.css"

# --- FILE 2: Minify u.css ---
echo "Minifying u.css..."
cat "$OUTPUT_DIR/u.css" | node minify.js > "$OUTPUT_DIR/u.min.css"


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
       resolve_imports "$mod_file" "src/lib"
    } > "$TARGET_LIB_FILE"
    
    # Minify Bundle
    cat "$TARGET_LIB_FILE" | node minify.js > "${TARGET_LIB_FILE%.css}.min.css"
    
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
        read_source "$leaf" | node minify.js > "$TARGET_LIB_DIR/${filename%.css}.min.css"
    done
done

# --- FILE 5: Generate index.html (Documentation from README) ---
echo "Generating index.html from README.md..."
INDEX_FILE="$OUTPUT_DIR/index.html"
cat <<EOF > "$INDEX_FILE"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>uCss Documentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">
    <style>
        body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }
        @media (max-width: 767px) {
            body {
                padding: 15px;
            }
        }
    </style>
</head>
<body class="markdown-body">
    <div id="content"></div>
    <script id="raw-markdown" type="text/markdown">
EOF

# Append README content
read_source "README.md" >> "$INDEX_FILE"

cat <<EOF >> "$INDEX_FILE"
    </script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        const markdown = document.getElementById('raw-markdown').textContent;
        document.getElementById('content').innerHTML = marked.parse(markdown);
    </script>
</body>
</html>
EOF


# Gzip ALL .css files in dist recursively
echo "Gzipping all .css files in dist..."
find "$OUTPUT_DIR" -type f -name "*.css" -exec gzip -9 -k -f {} +

echo "Build complete."
ls -lh "$OUTPUT_DIR/u.css" "$OUTPUT_DIR/lib/"
