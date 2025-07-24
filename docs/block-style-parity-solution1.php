<?php
/**
 * Solution 1: Proper Style Registration & Loading
 * Ensures both editor and frontend styles are correctly enqueued
 */

// 1. Update block.json to properly reference styles
{
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",     // Editor-specific styles
  "style": "file:./style-index.css",      // Shared editor/frontend styles
  "viewScript": "file:./view.js",         // Frontend-only script
  "render": "file:./render.php"           // Dynamic rendering
}

// 2. Create a proper style structure
// style-index.css (shared styles)
.wp-block-tailwind-starter-hero-section {
  /* Base styles that apply to both editor and frontend */
  position: relative;
  overflow: hidden;
}

.wp-block-tailwind-starter-hero-section .hero-content {
  /* Content styles */
  padding: var(--hero-padding-top, 4rem) var(--hero-padding-right, 2rem) 
           var(--hero-padding-bottom, 4rem) var(--hero-padding-left, 2rem);
}

// index.css (editor-only styles)
.wp-block-tailwind-starter-hero-section {
  /* Editor-specific overrides */
  min-height: 300px; /* Ensure visibility in editor */
}

.block-editor-block-list__block .wp-block-tailwind-starter-hero-section {
  /* Reset editor margins */
  margin-top: 0;
  margin-bottom: 0;
}

// 3. Ensure proper style enqueueing in PHP
add_action('init', function() {
    // Get block metadata
    $block_json_file = get_theme_file_path('build/blocks/hero-section/block.json');
    $metadata = wp_json_file_decode($block_json_file, ['associative' => true]);
    
    // Register block with proper style handling
    register_block_type($block_json_file, [
        'render_callback' => function($attributes, $content, $block) {
            // Ensure styles are loaded on frontend
            if (!is_admin()) {
                wp_enqueue_style(
                    'tailwind-starter-hero-section-style',
                    get_theme_file_uri('build/blocks/hero-section/style-index.css'),
                    [],
                    filemtime(get_theme_file_path('build/blocks/hero-section/style-index.css'))
                );
            }
            
            // Render block
            ob_start();
            include get_theme_file_path('build/blocks/hero-section/render.php');
            return ob_get_clean();
        }
    ]);
});

// 4. Add inline styles for dynamic attributes
function generate_hero_inline_styles($attributes) {
    $styles = [];
    
    // Convert attributes to CSS variables
    if (isset($attributes['padding'])) {
        $padding = $attributes['padding'];
        $styles[] = sprintf(
            '--hero-padding-top: %s; --hero-padding-bottom: %s;',
            esc_attr($padding['top'] ?? '4rem'),
            esc_attr($padding['bottom'] ?? '4rem')
        );
    }
    
    if (isset($attributes['backgroundColor'])) {
        $styles[] = sprintf(
            'background-color: %s;',
            esc_attr($attributes['backgroundColor'])
        );
    }
    
    return !empty($styles) ? 'style="' . implode(' ', $styles) . '"' : '';
}