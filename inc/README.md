# AssetController Class

The `AssetController` class automatically discovers and registers all WordPress blocks from the build directory with support for render callbacks and fallback to source directory.

## Features

- **Automatic Block Discovery**: Scans build/blocks directory first, falls back to src/blocks
- **Render Callback Support**: Automatically includes render files and sets up callbacks
- **Flexible Naming**: Supports multiple render file naming patterns
- **WordPress Integration**: Proper block registration with WordPress core
- **Debug Support**: Detailed logging in debug mode
- **Namespaced**: Uses `Gutenberg_Tailwind_Starter` namespace

## How It Works

1. **Priority Discovery**: Checks `/build/blocks/` first, then `/src/blocks/` as fallback
2. **Block Registration**: Automatically registers blocks with `register_block_type()`
3. **Render Callbacks**: Looks for render files and sets up PHP callbacks:
   - `render.php` (primary)
   - `render-{block-name}.php` (alternative)
   - `render-{blocknamenodashe}.php` (alternative)
4. **Function Mapping**: Maps render files to functions like `render_block_name_block()`

## Usage

The AssetController is automatically initialized in `functions.php`:

```php
// AssetController is initialized automatically
$asset_controller = new Gutenberg_Tailwind_Starter\AssetController( get_template_directory() );

// Access the instance
$controller = get_asset_controller();

// Get all registered blocks
$blocks = $controller->get_registered_blocks();

// Check if a block exists
if ( $controller->block_exists( 'example-block' ) ) {
    // Block is registered
}

// Get blocks by category
$hero_blocks = $controller->get_blocks_by_category( 'tailwind-starter-hero' );

// Get block count
$count = $controller->get_block_count();
```

## Block Structure

Each block should be in its own directory within `/build/blocks/` or `/src/blocks/`:

```
build/blocks/                # Primary location (built assets)
├── example-block/
│   ├── block.json          # Required - Block metadata
│   ├── index.js            # Compiled editor script
│   ├── view.js             # Compiled frontend script
│   ├── style.css           # Frontend styles
│   ├── editor.css          # Editor styles
│   ├── index.asset.php     # WordPress dependencies
│   ├── view.asset.php      # View dependencies
│   └── render.php          # Optional - PHP render callback
└── hero-block/
    ├── block.json
    ├── index.js
    └── render.php

src/blocks/                  # Fallback location (source files)
├── example-block/
│   ├── block.json
│   ├── index.js
│   ├── edit.js
│   ├── save.js
│   └── render.php
```

## Render Callbacks

For server-side rendering, create render files:

```php
// render.php or render-example-block.php
<?php
function render_example_block_block( $attributes, $content, $block ) {
    $title = $attributes['title'] ?? 'Default Title';
    
    return sprintf(
        '<div class="example-block">
            <h2>%s</h2>
            <div class="content">%s</div>
        </div>',
        esc_html( $title ),
        $content
    );
}
```

## Build Process

The build process is now properly coordinated:

```bash
# Clean build and compile everything
npm run build

# Build only blocks
npm run blocks:build

# Development mode
npm run blocks:dev
```

**Build Process Flow:**
1. `rm -rf build` - Clean build directory
2. `vite build` - Build theme assets (CSS, JS) to `build/`
3. `wp-scripts build` - Build blocks to `build/blocks/`

## Categories

Blocks are organized into custom categories:

- `tailwind-starter` - General Tailwind Starter blocks
- `tailwind-starter-hero` - Hero sections
- `tailwind-starter-content` - Content blocks
- `tailwind-starter-layout` - Layout blocks
- `tailwind-starter-interactive` - Interactive elements

## Debug Mode

Enable `WP_DEBUG` to see detailed logging:

```php
// In wp-config.php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
```

This will log block registration info to debug.log.