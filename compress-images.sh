#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# compress-images.sh
# Reads originals from ./images/, writes compressed copies to ./images_compressed/
# mirroring the exact same subfolder structure. Originals are never touched.
#
# Run from your repo root:
#   chmod +x compress-images.sh
#   ./compress-images.sh
#
# What it does:
#   • Mirrors ./images/ → ./images_compressed/ keeping identical subfolder paths
#   • Resizes every image so its longest side is ≤ 400px
#     (plenty for 74px thumbnails, even at 2× retina)
#   • Compresses JPEGs to quality 72, WEBPs to quality 72, PNGs to quality 85
#   • Copies GIFs as-is (they're animations — compressing breaks them)
#   • Skips files already under 30 KB (copies them as-is instead)
#   • Skips files that already exist in images_compressed/ (re-run safe)
#   • Prints a before/after size summary when done
#
# Requirements: ImageMagick  →  brew install imagemagick
# ─────────────────────────────────────────────────────────────────────────────

set -e

SRC_DIR="./images"
OUT_DIR="./images_compressed"
MAX_DIM=400
JPEG_QUALITY=72
WEBP_QUALITY=72
PNG_QUALITY=85
SKIP_UNDER_KB=30

if ! command -v magick &> /dev/null; then
  echo "❌  ImageMagick not found."
  echo "    Install it with:  brew install imagemagick"
  exit 1
fi

if [ ! -d "$SRC_DIR" ]; then
  echo "❌  No ./images directory found. Run this from your repo root."
  exit 1
fi

echo "🗜   Compressing images from $SRC_DIR → $OUT_DIR ..."
echo "    (Originals in $SRC_DIR are not touched)"
echo ""

SKIPPED=0
PROCESSED=0
COPIED=0
BEFORE_BYTES=0
AFTER_BYTES=0

# ── Helper: mirror path from ./images/ into ./images_compressed/ ──────────────
out_path() {
  local src_file="$1"
  echo "${OUT_DIR}${src_file#$SRC_DIR}"
}

# ── Process one file ──────────────────────────────────────────────────────────
process_file() {
  local src="$1"
  local type="$2"   # jpeg | webp | png | gif
  local dest
  dest=$(out_path "$src")

  # Create destination subfolder if needed
  mkdir -p "$(dirname "$dest")"

  # Skip if output already exists (re-run safe)
  if [ -f "$dest" ]; then
    return
  fi

  local size_kb
  size_kb=$(du -k "$src" | cut -f1)
  BEFORE_BYTES=$((BEFORE_BYTES + size_kb))

  # GIFs and tiny files — copy as-is, no re-encoding
  if [ "$type" = "gif" ] || [ "$size_kb" -lt "$SKIP_UNDER_KB" ]; then
    cp "$src" "$dest"
    local after_kb
    after_kb=$(du -k "$dest" | cut -f1)
    AFTER_BYTES=$((AFTER_BYTES + after_kb))
    ((COPIED++)) || true
    return
  fi

  # Compress based on type
  case "$type" in
    jpeg)
      magick "$src" \
        -resize "${MAX_DIM}x${MAX_DIM}>" \
        -sampling-factor 4:2:0 \
        -strip \
        -quality $JPEG_QUALITY \
        -interlace Plane \
        -colorspace sRGB \
        "$dest"
      ;;
    webp)
      magick "$src" \
        -resize "${MAX_DIM}x${MAX_DIM}>" \
        -strip \
        -quality $WEBP_QUALITY \
        "$dest"
      ;;
    png)
      magick "$src" \
        -resize "${MAX_DIM}x${MAX_DIM}>" \
        -strip \
        -quality $PNG_QUALITY \
        "$dest"
      ;;
  esac

  local after_kb
  after_kb=$(du -k "$dest" | cut -f1)
  AFTER_BYTES=$((AFTER_BYTES + after_kb))
  ((PROCESSED++)) || true
}

# ── Walk source tree ──────────────────────────────────────────────────────────

while IFS= read -r -d '' f; do process_file "$f" jpeg; done \
  < <(/usr/bin/find "$SRC_DIR" \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

while IFS= read -r -d '' f; do process_file "$f" webp; done \
  < <(/usr/bin/find "$SRC_DIR" -iname "*.webp" -print0)

while IFS= read -r -d '' f; do process_file "$f" png; done \
  < <(/usr/bin/find "$SRC_DIR" -iname "*.png" -print0)

while IFS= read -r -d '' f; do process_file "$f" gif; done \
  < <(/usr/bin/find "$SRC_DIR" -iname "*.gif" -print0)

# ── Summary ───────────────────────────────────────────────────────────────────
echo "✅  Done!"
echo "   Compressed  : $PROCESSED files"
echo "   Copied as-is: $COPIED files (GIFs + already-small files)"
echo "   Before      : ~${BEFORE_BYTES} KB"
echo "   After       : ~${AFTER_BYTES} KB"
if [ "$BEFORE_BYTES" -gt 0 ]; then
  SAVED=$((BEFORE_BYTES - AFTER_BYTES))
  echo "   Saved       : ~${SAVED} KB"
fi
echo ""
echo "   Originals untouched in : $SRC_DIR"
echo "   Compressed copies in   : $OUT_DIR"
echo ""
echo "   photomap.html already points at $OUT_DIR — no other changes needed."
