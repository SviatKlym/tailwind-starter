<?php

function my_tailwind_starter_enqueue_assets() {
    // Enqueue main theme CSS (Tailwind compiled)  
    $theme_css_file = get_template_directory() . '/build/main.css';
    wp_enqueue_style(
        'tailwind-starter-theme',
        get_template_directory_uri() . '/build/main.css',
        [],
        file_exists($theme_css_file) ? filemtime($theme_css_file) : '1.0.0'
    );
    
    // Enqueue frontend animations script (from source, not built)
    $frontend_animations_file = get_template_directory() . '/src/frontend-animations.js';
    if (file_exists($frontend_animations_file)) {
        wp_enqueue_script(
            'tailwind-starter-animations',
            get_template_directory_uri() . '/src/frontend-animations.js',
            [],
            filemtime($frontend_animations_file),
            true // Load in footer
        );
    }
    
    // Debug: Log what files are being loaded (remove in production)
    if (WP_DEBUG) {
        error_log('Theme CSS: ' . (file_exists($theme_css_file) ? 'EXISTS' : 'MISSING'));
        error_log('Frontend Animations: ' . (file_exists($frontend_animations_file) ? 'EXISTS' : 'MISSING'));
    }
}
add_action('wp_enqueue_scripts', 'my_tailwind_starter_enqueue_assets');

// Enqueue editor styles
function my_tailwind_starter_editor_styles() {
    // Add editor styles for proper alignment
    add_editor_style('build/main.css');
    add_editor_style('src/editor-alignment-fix.css');
}
add_action('after_setup_theme', 'my_tailwind_starter_editor_styles');

// Fix alignment in editor with inline styles
function my_tailwind_starter_block_editor_assets() {
    wp_enqueue_style(
        'tailwind-starter-editor-alignment',
        get_template_directory_uri() . '/src/editor-alignment-fix.css',
        array('wp-edit-blocks'),
        filemtime(get_template_directory() . '/src/editor-alignment-fix.css')
    );
    
    // Add inline styles to fix the immediate issue
    $inline_css = '
        /* Fix alignfull blocks shifting to the right */
        .wp-block[data-align="full"] {
            margin-left: 0 !important;
            margin-right: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: none !important;
            position: relative !important;
        }
        
        /* Override body .alignfull that causes shifting */
        body .alignfull {
            left: 0 !important;
            right: 0 !important;
        }
        
        /* Ensure proper centering for content inside full width blocks */
        .wp-block[data-align="full"] > * {
            margin-left: auto;
            margin-right: auto;
        }
        
        /* Fix editor wrapper constraints */
        .editor-styles-wrapper .wp-block[data-align="full"] {
            width: 100% !important;
            left: 0 !important;
            transform: none !important;
        }
    ';
    
    wp_add_inline_style('tailwind-starter-editor-alignment', $inline_css);
}
add_action('enqueue_block_editor_assets', 'my_tailwind_starter_block_editor_assets');

function my_tailwind_starter_init_asset_controller() {
    global $asset_controller;
    $asset_controller = new Gutenberg_Tailwind_Starter\AssetController( get_template_directory() );
}
add_action('init', 'my_tailwind_starter_init_asset_controller', 10);

function get_asset_controller() {
    global $asset_controller;
    return $asset_controller;
}

function my_tailwind_starter_remove_version($src) {
    if (strpos($src, 'ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}
add_filter('style_loader_src', 'my_tailwind_starter_remove_version');
add_filter('script_loader_src', 'my_tailwind_starter_remove_version');