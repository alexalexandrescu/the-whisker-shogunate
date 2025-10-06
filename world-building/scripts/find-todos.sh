#!/bin/bash

# find-todos.sh
# Finds all [To Be Determined] placeholders and incomplete checklist items
# in world-building documentation

echo "================================================"
echo "World-Building TODO Finder"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Count totals
tbd_count=0
unchecked_count=0
zero_percent_count=0

# Find [To Be Determined] placeholders
echo -e "${YELLOW}[To Be Determined] Placeholders:${NC}"
echo "------------------------------------------------"

while IFS= read -r file; do
    if grep -q "\[To Be Determined\]" "$file"; then
        echo -e "${RED}$file:${NC}"
        grep -n "\[To Be Determined\]" "$file" | head -5
        count=$(grep -c "\[To Be Determined\]" "$file")
        echo "  → $count placeholder(s) found"
        echo ""
        tbd_count=$((tbd_count + count))
    fi
done < <(find ../world-building -name "*.md" -type f ! -name "README.md" ! -name "INDEX.md" ! -name "TEMPLATES.md")

echo -e "${GREEN}Total [To Be Determined] placeholders: $tbd_count${NC}"
echo ""
echo ""

# Find unchecked checklist items (excluding templates)
echo -e "${YELLOW}Unchecked Checklist Items:${NC}"
echo "------------------------------------------------"

while IFS= read -r file; do
    if grep -q "- \[ \]" "$file"; then
        echo -e "${RED}$file:${NC}"
        grep -n "- \[ \]" "$file" | head -5
        count=$(grep -c "- \[ \]" "$file")
        echo "  → $count unchecked item(s)"
        echo ""
        unchecked_count=$((unchecked_count + count))
    fi
done < <(find ../world-building -name "*.md" -type f ! -name "README.md" ! -name "INDEX.md" ! -name "TEMPLATES.md")

echo -e "${GREEN}Total unchecked items: $unchecked_count${NC}"
echo ""
echo ""

# Find 0% completion files in INDEX.md
echo -e "${YELLOW}Not Started (0% completion):${NC}"
echo "------------------------------------------------"

if [ -f "../INDEX.md" ]; then
    zero_percent=$(grep "| 0% |" ../INDEX.md | wc -l)
    grep "| 0% |" ../INDEX.md | head -10
    echo ""
    echo -e "${GREEN}Total 0% completion entries: $zero_percent${NC}"
else
    echo "INDEX.md not found"
fi

echo ""
echo "================================================"
echo "Summary"
echo "================================================"
echo "[To Be Determined] placeholders: $tbd_count"
echo "Unchecked checklist items: $unchecked_count"
echo "Not started (0%) topics: ${zero_percent:-0}"
echo ""
echo "Run this script regularly to track remaining work!"
echo "================================================"
