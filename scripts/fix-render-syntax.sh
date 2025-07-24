#!/bin/bash

# Script to fix escaped syntax errors in render.php files
# This prevents the recurring \! and <\!-- syntax errors

echo "Fixing escaped syntax errors in render.php files..."

# Find all render.php files in build/blocks directory
find "./build/blocks" -name "render.php" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Fix escaped exclamation marks
    sed -i 's/\\!/!/g' "$file"
    
    # Fix escaped HTML comments
    sed -i 's/<\\!--/<!--/g' "$file"
    
    # Add proper newline at end of file if missing
    if [ -n "$(tail -c1 "$file")" ]; then
        echo "" >> "$file"
    fi
done

echo "✅ All render.php files have been fixed!"

# Verify no escaped syntax remains
echo "Checking for remaining issues..."
remaining_issues=$(find "./build/blocks" -name "render.php" -exec grep -l "\\\\!" {} \; 2>/dev/null | wc -l)

if [ "$remaining_issues" -eq 0 ]; then
    echo "✅ No syntax errors found!"
else
    echo "⚠️  Still found $remaining_issues files with issues"
    find "./build/blocks" -name "render.php" -exec grep -l "\\\\!" {} \;
fi