#!/usr/bin/env node
/**
 * Fix Block Class Parity Script
 * Ensures all save.js files generate the same classes as edit.js files
 */

const fs = require('fs');
const path = require('path');

const BLOCKS_DIR = './src/blocks';

function fixSaveFile(filePath) {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already imports generateAllClasses
    if (content.includes('generateAllClasses')) {
        console.log('  ✅ Already has generateAllClasses');
        return;
    }
    
    // Add import if missing
    if (!content.includes("import { generateAllClasses }")) {
        const importLine = `import { generateAllClasses } from '../../utils/visual-controls.js'`;
        
        // Find last import line
        const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
        const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
        const insertPoint = content.indexOf('\n', lastImportIndex) + 1;
        
        content = content.slice(0, insertPoint) + importLine + '\n' + content.slice(insertPoint);
        console.log('  ✅ Added generateAllClasses import');
    }
    
    // Fix className generation
    const classNameRegex = /className:\s*`([^`]*)`/g;
    let match;
    let hasChanges = false;
    
    while ((match = classNameRegex.exec(content)) !== null) {
        const originalClassName = match[1];
        
        // Skip if already includes allClasses
        if (originalClassName.includes('${allClasses}')) {
            continue;
        }
        
        // Add allClasses to className
        const newClassName = `${originalClassName} \${allClasses}`;
        content = content.replace(match[0], `className: \`${newClassName}\``);
        hasChanges = true;
        console.log(`  ✅ Updated className: ${originalClassName.substring(0, 30)}...`);
    }
    
    // Add allClasses generation before useBlockProps.save
    if (!content.includes('generateAllClasses(settings')) {
        const blockPropsIndex = content.indexOf('useBlockProps.save');
        if (blockPropsIndex !== -1) {
            const insertPoint = content.lastIndexOf('\n', blockPropsIndex);
            const allClassesCode = `
  // Generate the same classes as the editor
  const allClasses = generateAllClasses(settings || {})
`;
            content = content.slice(0, insertPoint) + allClassesCode + content.slice(insertPoint);
            hasChanges = true;
            console.log('  ✅ Added allClasses generation');
        }
    }
    
    if (hasChanges) {
        fs.writeFileSync(filePath, content);
        console.log('  💾 File updated');
    } else {
        console.log('  ℹ️ No changes needed');
    }
}

function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item === 'save.js') {
            fixSaveFile(fullPath);
        }
    }
}

console.log('🔧 Fixing block class parity...\n');
processDirectory(BLOCKS_DIR);
console.log('\n✅ Block class parity fix complete!');

console.log('\n📝 Next steps:');
console.log('1. Run npm run build to compile changes');
console.log('2. Clear any WordPress caches');
console.log('3. Test blocks in editor and frontend');
console.log('4. Use WP_DEBUG=true to see class debug info');