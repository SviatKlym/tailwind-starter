<?php

function get_custom_block_categories() {
    return [
        'tailwind-starter' => __('Tailwind Starter', 'tailwind-starter'),
    ];
}

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
add_filter('block_categories_all', 'my_tailwind_starter_block_categories', 5);

function my_tailwind_starter_remove_default_patterns() {
    remove_theme_support('core-block-patterns');
}
add_action('after_setup_theme', 'my_tailwind_starter_remove_default_patterns');

function my_tailwind_starter_register_block_patterns() {
    if (function_exists('register_block_pattern')) {
        // Hero pattern with the existing hero block
        register_block_pattern(
            'tailwind-starter/hero-section',
            [
                'title' => __('Hero Section', 'tailwind-starter'),
                'description' => __('Hero banner with background image and CTA', 'tailwind-starter'),
                'categories' => ['tailwind-starter'],
                'content' => '<!-- wp:tailwind-starter/hero-block --><!-- /wp:tailwind-starter/hero-block -->',
            ]
        );
        
        // Main visual builder patterns
        register_block_pattern(
            'tailwind-starter/visual-card',
            [
                'title' => __('Visual Card', 'tailwind-starter'),
                'description' => __('Clean card layout with visual styling controls', 'tailwind-starter'),
                'categories' => ['tailwind-starter'],
                'content' => '<!-- wp:tailwind-starter/visual-block {"settings":{"spacing":{"base":{"top":6,"right":6,"bottom":6,"left":6}},"typography":{"base":{"fontSize":"text-base","fontWeight":"font-normal","textAlign":"text-left"}},"backgroundColor":"bg-white","textColor":"text-gray-900"}} --><!-- /wp:tailwind-starter/visual-block -->',
            ]
        );
        
        register_block_pattern(
            'tailwind-starter/visual-hero',
            [
                'title' => __('Visual Hero', 'tailwind-starter'),
                'description' => __('Bold hero section with visual controls', 'tailwind-starter'),
                'categories' => ['tailwind-starter'],
                'content' => '<!-- wp:tailwind-starter/visual-block {"settings":{"spacing":{"base":{"top":12,"right":6,"bottom":12,"left":6}},"typography":{"base":{"fontSize":"text-2xl","fontWeight":"font-bold","textAlign":"text-center"}},"backgroundColor":"bg-blue-600","textColor":"text-white"}} --><!-- /wp:tailwind-starter/visual-block -->',
            ]
        );
        
        register_block_pattern(
            'tailwind-starter/visual-feature',
            [
                'title' => __('Visual Feature', 'tailwind-starter'),
                'description' => __('Feature highlight with visual styling', 'tailwind-starter'),
                'categories' => ['tailwind-starter'],
                'content' => '<!-- wp:tailwind-starter/visual-block {"settings":{"spacing":{"base":{"top":6,"right":6,"bottom":6,"left":6}},"typography":{"base":{"fontSize":"text-lg","fontWeight":"font-medium","textAlign":"text-left"}},"backgroundColor":"bg-green-50","textColor":"text-green-900"}} --><!-- /wp:tailwind-starter/visual-block -->',
            ]
        );
    }
}
add_action('init', 'my_tailwind_starter_register_block_patterns');

// Enqueue editor styles including visual controls CSS
function my_tailwind_starter_editor_assets() {
    // Enqueue main Tailwind CSS for editor
    $css_file = get_template_directory() . '/build/main.css';
    if (file_exists($css_file)) {
        wp_enqueue_style(
            'tailwind-starter-editor-style',
            get_template_directory_uri() . '/build/main.css',
            [],
            filemtime($css_file)
        );
    }
    
    // Enqueue the visual controls CSS for dynamic classes in editor
    $visual_controls_css = get_template_directory() . '/src/visual-controls.css';
    if (file_exists($visual_controls_css)) {
        wp_enqueue_style(
            'tailwind-starter-visual-controls-editor',
            get_template_directory_uri() . '/src/visual-controls.css',
            ['tailwind-starter-editor-style'],
            filemtime($visual_controls_css)
        );
    }
}
add_action('enqueue_block_editor_assets', 'my_tailwind_starter_editor_assets');