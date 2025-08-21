#!/bin/bash

# Documentation Link Validation Script
# Validates all internal and external links in the documentation

set -e

echo "🔍 Starting documentation link validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_FILES=0
TOTAL_LINKS=0
BROKEN_LINKS=0
WARNINGS=0

# Create temporary directory for results
TEMP_DIR=$(mktemp -d)
RESULTS_FILE="$TEMP_DIR/link_results.txt"
BROKEN_LINKS_FILE="$TEMP_DIR/broken_links.txt"

echo "📁 Scanning documentation directory..."

# Find all markdown files
DOCS_DIR="./documentation"
if [ ! -d "$DOCS_DIR" ]; then
    echo -e "${RED}❌ Documentation directory not found: $DOCS_DIR${NC}"
    exit 1
fi

# Find all markdown files
MD_FILES=$(find "$DOCS_DIR" -name "*.md" -type f)

if [ -z "$MD_FILES" ]; then
    echo -e "${RED}❌ No markdown files found in $DOCS_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}📊 Found $(echo "$MD_FILES" | wc -l) markdown files${NC}"

# Function to validate internal links
validate_internal_links() {
    local file="$1"
    local file_dir=$(dirname "$file")
    
    echo "  🔗 Checking internal links in $(basename "$file")"
    
    # Extract markdown links [text](link)
    grep -oE '\[([^\]]*)\]\(([^)]*)\)' "$file" | while read -r link; do
        # Extract the URL part
        url=$(echo "$link" | sed -E 's/.*\]\(([^)]*)\).*/\1/')
        
        # Skip external URLs (http/https)
        if [[ "$url" =~ ^https?:// ]]; then
            continue
        fi
        
        # Skip email links
        if [[ "$url" =~ ^mailto: ]]; then
            continue
        fi
        
        # Handle relative paths
        if [[ "$url" =~ ^\.\. ]]; then
            # Parent directory reference
            target_path="$file_dir/$url"
        elif [[ "$url" =~ ^\. ]]; then
            # Current directory reference
            target_path="$file_dir/$url"
        elif [[ "$url" =~ ^/ ]]; then
            # Absolute path (relative to project root)
            target_path=".$url"
        else
            # Relative to current file directory
            target_path="$file_dir/$url"
        fi
        
        # Extract anchor if present
        if [[ "$target_path" == *"#"* ]]; then
            file_path="${target_path%#*}"
            anchor="${target_path#*#}"
        else
            file_path="$target_path"
            anchor=""
        fi
        
        # Resolve the path
        file_path=$(realpath -m "$file_path" 2>/dev/null || echo "$file_path")
        
        # Check if file exists
        if [ ! -f "$file_path" ]; then
            echo -e "${RED}    ❌ Broken link: $url (file not found: $file_path)${NC}" | tee -a "$BROKEN_LINKS_FILE"
            ((BROKEN_LINKS++))
            continue
        fi
        
        # Check anchor if present
        if [ -n "$anchor" ]; then
            # Convert anchor to expected header format
            expected_header=$(echo "$anchor" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
            
            # Check if header exists in target file
            if ! grep -q "^#.*" "$file_path" | sed 's/^#* //' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g' | grep -q "^$expected_header$"; then
                echo -e "${YELLOW}    ⚠️  Anchor may be missing: $url (anchor: #$anchor)${NC}" | tee -a "$RESULTS_FILE"
                ((WARNINGS++))
            fi
        fi
        
        ((TOTAL_LINKS++))
    done
}

# Function to validate external links
validate_external_links() {
    local file="$1"
    
    echo "  🌐 Checking external links in $(basename "$file")"
    
    # Extract external URLs
    grep -oE 'https?://[^)]+(\.md|\.html|[^)]*[^.md][^.html])[^)]*' "$file" | while read -r url; do
        # Clean up the URL
        clean_url=$(echo "$url" | sed 's/[,;.]$//')
        
        # Test the URL with curl (with timeout)
        if ! curl -s --head --max-time 10 --fail "$clean_url" > /dev/null 2>&1; then
            echo -e "${RED}    ❌ Broken external link: $clean_url${NC}" | tee -a "$BROKEN_LINKS_FILE"
            ((BROKEN_LINKS++))
        fi
        
        ((TOTAL_LINKS++))
    done
}

# Main validation loop
while IFS= read -r file; do
    ((TOTAL_FILES++))
    echo -e "${BLUE}🔍 Validating: $file${NC}"
    
    validate_internal_links "$file"
    
    # Only check external links if requested (can be slow)
    if [ "$1" == "--check-external" ]; then
        validate_external_links "$file"
    fi
    
done <<< "$MD_FILES"

# Generate summary report
echo ""
echo "📋 VALIDATION SUMMARY"
echo "===================="
echo -e "Files checked: ${BLUE}$TOTAL_FILES${NC}"
echo -e "Links validated: ${BLUE}$TOTAL_LINKS${NC}"
echo -e "Broken links: ${RED}$BROKEN_LINKS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"

if [ $BROKEN_LINKS -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ BROKEN LINKS FOUND:${NC}"
    if [ -f "$BROKEN_LINKS_FILE" ]; then
        cat "$BROKEN_LINKS_FILE"
    fi
    echo ""
    echo "Please fix the broken links before proceeding."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Some warnings were found. Please review the output above.${NC}"
    exit 0
else
    echo ""
    echo -e "${GREEN}✅ All links are valid!${NC}"
    exit 0
fi

# Cleanup
rm -rf "$TEMP_DIR"