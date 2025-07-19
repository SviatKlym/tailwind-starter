# Gutenberg Block Development Guide

## Overview

This starter uses a custom **AssetController** system for automatic block registration and management. Blocks are built with **wp-scripts**, **Tailwind CSS v4**, and follow WordPress block development best practices.

## Directory Structure

```
src/blocks/
├── block-name/
│   ├── block.json         # Block configuration
│   ├── index.js          # Block registration
│   ├── edit.js           # Editor component
│   ├── save.js           # Frontend component
│   ├── style.css         # Frontend styles
│   └── editor.css        # Editor-only styles

build/blocks/             # Compiled output
├── block-name/
│   ├── block.json        # Copied config
│   ├── index.js          # Compiled JS
│   ├── index.css         # Editor styles
│   ├── style-index.css   # Frontend styles
│   └── index.asset.php   # Dependencies
```

## AssetController System

The `AssetController` class (`inc/class-asset-controller.php`) automatically:

- **Discovers blocks** from `/build/blocks/` directory
- **Registers blocks** with WordPress using `register_block_type()`
- **Handles render callbacks** (looks for `render.php` files)
- **Manages dependencies** via `.asset.php` files
- **Logs registration info** in debug mode

### Key Features

```php
// Auto-discovery and registration
public function register_all(): void {
    foreach (glob($this->build_dir . '/*', GLOB_ONLYDIR) as $dir) {
        $this->register_block_with_render_callback($dir, basename($dir));
    }
}

// Optional server-side rendering
private function register_block_with_render_callback(string $dir, string $block_name): void {
    $render_file = $dir . '/render.php';
    if (file_exists($render_file)) {
        $render_callback = 'render_' . str_replace('-', '_', $block_name) . '_block';
    }
}
```

### Utility Methods

```php
$controller = new AssetController($blocks_dir);

// Get all registered blocks
$blocks = $controller->get_registered_blocks();

// Check if block exists
$exists = $controller->block_exists('hero-section');

// Get blocks by category
$saas_blocks = $controller->get_blocks_by_category('tailwind-starter');

// Get block count
$count = $controller->get_block_count();
```

## Creating a New Block

### 1. Create Block Structure

```bash
mkdir src/blocks/my-block
cd src/blocks/my-block
```

### 2. Create `block.json`

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "tailwind-starter/my-block",
  "version": "1.0.0",
  "title": "My Block",
  "category": "tailwind-starter",
  "icon": "admin-customizer",
  "description": "Description of my block",
  "keywords": ["tailwind", "custom"],
  "supports": {
    "html": false,
    "align": ["wide", "full"]
  },
  "attributes": {
    "title": {
      "type": "string",
      "default": "Default Title"
    }
  },
  "textdomain": "tailwind-starter",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./editor.css",
  "style": "file:./style.css"
}
```

**Critical:** The `"editorScript": "file:./index.js"` field is required for wp-scripts to compile the block.

### 3. Create `index.js`

```javascript
import { registerBlockType } from '@wordpress/blocks'
import Edit from './edit.js'
import Save from './save.js'
import metadata from './block.json'
import './style.css'
import './editor.css'

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
})
```

**Important:** CSS imports are required for wp-scripts to extract and build CSS files.

### 4. Create `edit.js` (Editor Component)

```javascript
import { __ } from '@wordpress/i18n'
import { useBlockProps, RichText } from '@wordpress/block-editor'

export default function Edit({ attributes, setAttributes }) {
  const { title } = attributes
  const blockProps = useBlockProps({
    className: 'p-6 bg-white border border-gray-200 rounded-lg'
  })

  return (
    <div {...blockProps}>
      <RichText
        tagName="h2"
        className="text-2xl font-bold text-gray-900"
        value={title}
        onChange={(value) => setAttributes({ title: value })}
        placeholder={__('Enter title...', 'tailwind-starter')}
      />
    </div>
  )
}
```

### 5. Create `save.js` (Frontend Component)

```javascript
import { useBlockProps, RichText } from '@wordpress/block-editor'

export default function Save({ attributes }) {
  const { title } = attributes
  const blockProps = useBlockProps.save({
    className: 'p-6 bg-white border border-gray-200 rounded-lg'
  })

  return (
    <div {...blockProps}>
      <RichText.Content
        tagName="h2"
        className="text-2xl font-bold text-gray-900"
        value={title}
      />
    </div>
  )
}
```

### 6. Create CSS Files

**`style.css`** (Frontend styles):
```css
.wp-block-tailwind-starter-my-block {
  /* Frontend-only styles */
  margin-bottom: 2rem;
}
```

**`editor.css`** (Editor styles):
```css
.wp-block-tailwind-starter-my-block {
  /* Editor-specific styles */
  border: 2px dashed #e5e7eb;
}
```

### 7. Build the Block

```bash
npm run build
```

This compiles your block and the **AssetController** automatically registers it.

## Server-Side Rendering (Optional)

For dynamic content, create a `render.php` file:

```php
<?php
// src/blocks/my-block/render.php

function render_my_block_block($attributes, $content, $block) {
    $title = $attributes['title'] ?? 'Default Title';
    
    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => 'p-6 bg-white border border-gray-200 rounded-lg'
    ]);
    
    return sprintf(
        '<div %1$s><h2 class="text-2xl font-bold text-gray-900">%2$s</h2></div>',
        $wrapper_attributes,
        esc_html($title)
    );
}
```

The AssetController automatically detects this file and sets up the render callback.

## Advanced Patterns

### Inspector Controls

```javascript
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components'

export default function Edit({ attributes, setAttributes }) {
  const { layout, showIcon } = attributes
  
  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Layout Settings', 'tailwind-starter')}>
          <SelectControl
            label={__('Layout', 'tailwind-starter')}
            value={layout}
            options={[
              { label: 'Card', value: 'card' },
              { label: 'Minimal', value: 'minimal' }
            ]}
            onChange={(value) => setAttributes({ layout: value })}
          />
          <ToggleControl
            label={__('Show Icon', 'tailwind-starter')}
            checked={showIcon}
            onChange={(value) => setAttributes({ showIcon: value })}
          />
        </PanelBody>
      </InspectorControls>
      
      {/* Block content */}
    </>
  )
}
```

### Dynamic Attributes

```json
{
  "attributes": {
    "items": {
      "type": "array",
      "default": []
    },
    "layout": {
      "type": "string",
      "default": "grid",
      "enum": ["grid", "list", "masonry"]
    },
    "columns": {
      "type": "number",
      "default": 3,
      "minimum": 1,
      "maximum": 6
    }
  }
}
```

### Responsive Controls

```javascript
const DEVICE_SIZES = {
  base: { label: 'Mobile', icon: 'smartphone' },
  md: { label: 'Tablet', icon: 'tablet' },
  lg: { label: 'Desktop', icon: 'desktop' }
}

function ResponsiveControl({ attribute, value, onChange }) {
  const [activeDevice, setActiveDevice] = useState('base')
  
  return (
    <div className="responsive-control">
      <div className="device-tabs">
        {Object.entries(DEVICE_SIZES).map(([device, config]) => (
          <button
            key={device}
            className={`device-tab ${activeDevice === device ? 'active' : ''}`}
            onClick={() => setActiveDevice(device)}
          >
            <Dashicon icon={config.icon} />
            {config.label}
          </button>
        ))}
      </div>
      <RangeControl
        label={attribute}
        value={value[activeDevice] || 0}
        onChange={(newValue) => onChange({
          ...value,
          [activeDevice]: newValue
        })}
        min={0}
        max={12}
      />
    </div>
  )
}
```

## Debugging

### Enable Debug Mode

Add to `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

### Check Registration

The AssetController logs registration info:
```
AssetController: Found 3 blocks
AssetController: Using directory: /path/to/build/blocks
AssetController: Categories in use: tailwind-starter
AssetController: Registered block 'tailwind-starter/hero-section' from /path/to/build/blocks/hero-section
```

### Common Issues

1. **Block not appearing**: Check `editorScript` field in `block.json`
2. **CSS not loading**: Ensure CSS imports in `index.js`
3. **Build errors**: Check for syntax errors in React components
4. **Wrong category**: Verify category is registered in `inc/blocks.php`

## Build Commands

```bash
# Build all blocks
npm run build

# Watch for changes (development)
npm run start

# Build only blocks
npm run blocks:build

# Build only theme CSS
npm run theme:build
```

## Testing Blocks

1. **Editor Testing**: Open WordPress admin → Posts → Add New
2. **Frontend Testing**: View published post on frontend
3. **Responsive Testing**: Test on different screen sizes
4. **Performance**: Use browser dev tools to check bundle size

## Block Categories

Blocks use the `tailwind-starter` category, registered in `inc/blocks.php`:

```php
function my_tailwind_starter_block_categories($categories) {
    $custom_categories = [
        [
            'slug' => 'tailwind-starter',
            'title' => __('Tailwind Starter', 'tailwind-starter'),
            'icon' => 'layout',
        ]
    ];
    
    return array_merge($custom_categories, $categories);
}
```

## Next Steps

1. Create blocks following this structure
2. Use AssetController utilities for block management
3. Implement server-side rendering for dynamic content
4. Add comprehensive testing for all blocks
5. Consider block variations for complex layouts

The AssetController handles all the heavy lifting - just focus on creating great block experiences!