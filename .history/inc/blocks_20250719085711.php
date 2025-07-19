<?php

function get_custom_block_categories() {
    return [
        'tailwind-starter' => __('Tailwind Starter', 'tailwind-starter'),
        'tailwind-starter-hero' => __('Hero Sections', 'tailwind-starter'),
        'tailwind-starter-content' => __('Content Blocks', 'tailwind-starter'),
        'tailwind-starter-layout' => __('Layout Blocks', 'tailwind-starter'),
        'tailwind-starter-interactive' => __('Interactive Elements', 'tailwind-starter'),
    ];
}

function my_tailwind_starter_block_categories($categories) {
    $custom_categories = [
        [
            'slug' => 'tailwind-starter',
            'title' => __('Tailwind Starter', 'tailwind-starter'),
            'icon' => 'layout',
        ],
        [
            'slug' => 'tailwind-starter-hero',
            'title' => __('Hero Sections', 'tailwind-starter'),
            'icon' => 'cover-image',
        ],
        [
            'slug' => 'tailwind-starter-content',
            'title' => __('Content Blocks', 'tailwind-starter'),
            'icon' => 'text-page',
        ],
        [
            'slug' => 'tailwind-starter-layout',
            'title' => __('Layout Blocks', 'tailwind-starter'),
            'icon' => 'grid-view',
        ],
        [
            'slug' => 'tailwind-starter-interactive',
            'title' => __('Interactive Elements', 'tailwind-starter'),
            'icon' => 'button',
        ],
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
        register_block_pattern(
            'tailwind-starter/hero-with-cta',
            [
                'title' => __('Hero with CTA', 'tailwind-starter'),
                'description' => __('A hero section with call-to-action button', 'tailwind-starter'),
                'categories' => ['tailwind-starter'],
                'content' => '<!-- wp:tailwind-starter/hero-block --><!-- /wp:tailwind-starter/hero-block -->',
            ]
        );
    }
}
add_action('init', 'my_tailwind_starter_register_block_patterns');