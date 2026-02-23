#!/bin/bash
# Lighthouse Audit Script for Karsaaz QR
# Requires: npm install -g lighthouse
# Requires: Google Chrome installed
# Usage: bash scripts/lighthouse-audit.sh

set -e

echo "=== Karsaaz QR - Lighthouse Audit ==="
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "Lighthouse not found. Installing globally..."
    npm install -g lighthouse
fi

BASE_URL="http://localhost:3000"
OUTPUT_DIR="./lighthouse-reports"
mkdir -p "$OUTPUT_DIR"

declare -A PAGES=(
    ["home"]="/"
    ["login"]="/login"
    ["signup"]="/signup"
    ["pricing"]="/pricing"
    ["checkout"]="/checkout"
)

for name in "${!PAGES[@]}"; do
    url="${BASE_URL}${PAGES[$name]}"
    outfile="${OUTPUT_DIR}/lighthouse-${name}.html"

    echo "Auditing: $url"
    lighthouse "$url" \
        --output=html \
        --output-path="$outfile" \
        --chrome-flags="--headless --no-sandbox" \
        --only-categories=performance,accessibility,best-practices,seo \
        2>/dev/null || echo "  Warning: audit for $name may have issues"

    echo "  Report saved: $outfile"
done

echo ""
echo "=== Audit Complete ==="
echo "Reports are in $OUTPUT_DIR. Open the .html files in a browser to view."
