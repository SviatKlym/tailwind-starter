<?php

function my_tailwind_starter_setup() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('wp-block-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
    add_theme_support('align-wide');
    add_theme_support('custom-spacing');
    add_theme_support('custom-units');
    add_theme_support('link-color');
    add_theme_support('border');
    add_theme_support('appearance-tools');
    add_theme_support('html5', ['comment-list', 'comment-form', 'search-form', 'gallery', 'caption']);
    add_theme_support('automatic-feed-links');
    add_theme_support('custom-background');
    add_theme_support('custom-header');
    add_theme_support('post-formats', ['aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat']);
    add_editor_style('build/style.css');
    
    register_nav_menus([
        'primary' => __('Primary Navigation', 'tailwind-starter'),
        'footer' => __('Footer Navigation', 'tailwind-starter'),
        'mobile' => __('Mobile Navigation', 'tailwind-starter'),
    ]);
    
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('align-wide');
    
    add_theme_support('editor-color-palette', [
        [
            'name' => __('Primary', 'tailwind-starter'),
            'slug' => 'primary',
            'color' => '#0ea5e9',
        ],
        [
            'name' => __('Secondary', 'tailwind-starter'),
            'slug' => 'secondary',
            'color' => '#ec4899',
        ],
        [
            'name' => __('Dark Gray', 'tailwind-starter'),
            'slug' => 'dark-gray',
            'color' => '#111827',
        ],
        [
            'name' => __('Light Gray', 'tailwind-starter'),
            'slug' => 'light-gray',
            'color' => '#f9fafb',
        ],
    ]);
    
    add_theme_support('editor-font-sizes', [
        [
            'name' => __('Small', 'tailwind-starter'),
            'size' => 12,
            'slug' => 'small'
        ],
        [
            'name' => __('Regular', 'tailwind-starter'),
            'size' => 16,
            'slug' => 'regular'
        ],
        [
            'name' => __('Large', 'tailwind-starter'),
            'size' => 20,
            'slug' => 'large'
        ],
        [
            'name' => __('Huge', 'tailwind-starter'),
            'size' => 24,
            'slug' => 'huge'
        ]
    ]);
}
add_action('after_setup_theme', 'my_tailwind_starter_setup');

function my_tailwind_starter_excerpt_length($length) {
    return 25;
}
add_filter('excerpt_length', 'my_tailwind_starter_excerpt_length');