<?php

// Include the Asset Controller class
require_once get_template_directory() . '/inc/BlocksAssetController.php';

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
    
    // Add theme support for selective refresh for widgets
    add_theme_support('customize-selective-refresh-widgets');
    
    // Add support for full and wide align images
    add_theme_support('align-wide');
    
    // Add support for editor color palette
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
    
    // Add support for editor font sizes
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

function my_tailwind_starter_enqueue_assets() {
    if (wp_get_environment_type() === 'development') {
        // Development: use Vite dev server
        wp_enqueue_style(
            'my-tailwind-starter-dev',
            'http://localhost:5173/src/style.css',
            [],
            '1.0.0'
        );
        wp_enqueue_script(
            'my-tailwind-starter-vite',
            'http://localhost:5173/@vite/client',
            [],
            '1.0.0',
            true
        );
    } else {
        // Production: use built assets
        $css_file = get_template_directory() . '/build/style.css';
        wp_enqueue_style(
            'my-tailwind-starter-style',
            get_template_directory_uri() . '/build/style.css',
            [],
            file_exists($css_file) ? filemtime($css_file) : '1.0.0'
        );
    }
}
add_action('wp_enqueue_scripts', 'my_tailwind_starter_enqueue_assets');

// Initialize Asset Controller
function my_tailwind_starter_init_asset_controller() {
    global $asset_controller;
    $asset_controller = new Gutenberg_Tailwind_Starter\BlocksAssetController( get_template_directory() );
}
add_action('init', 'my_tailwind_starter_init_asset_controller', 5);

// Block editor assets are now handled by AssetController class

// Helper function to get AssetController instance
function get_asset_controller() {
    global $asset_controller;
    return $asset_controller;
}

// Helper function to get custom block categories
function get_custom_block_categories() {
    return [
        'tailwind-starter' => __('Tailwind Starter', 'tailwind-starter'),
        'tailwind-starter-hero' => __('Hero Sections', 'tailwind-starter'),
        'tailwind-starter-content' => __('Content Blocks', 'tailwind-starter'),
        'tailwind-starter-layout' => __('Layout Blocks', 'tailwind-starter'),
        'tailwind-starter-interactive' => __('Interactive Elements', 'tailwind-starter'),
    ];
}

// Add custom post types support
function my_tailwind_starter_custom_post_types() {
    // Add custom post types here if needed
}
add_action('init', 'my_tailwind_starter_custom_post_types');

// Add image sizes
function my_tailwind_starter_image_sizes() {
    add_image_size('hero-image', 1920, 1080, true);
    add_image_size('card-image', 400, 300, true);
    add_image_size('featured-image', 800, 600, true);
}
add_action('after_setup_theme', 'my_tailwind_starter_image_sizes');

// Customize excerpt length
function my_tailwind_starter_excerpt_length($length) {
    return 25;
}
add_filter('excerpt_length', 'my_tailwind_starter_excerpt_length');

// Add block categories
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
    
    // Add custom categories at the beginning
    return array_merge($custom_categories, $categories);
}
add_filter('block_categories_all', 'my_tailwind_starter_block_categories');

// Remove default block patterns
function my_tailwind_starter_remove_default_patterns() {
    remove_theme_support('core-block-patterns');
}
add_action('after_setup_theme', 'my_tailwind_starter_remove_default_patterns');

// Add custom block patterns
function my_tailwind_starter_register_block_patterns() {
    if (function_exists('register_block_pattern')) {
        register_block_pattern(
            'tailwind-starter/hero-with-cta',
            [
                'title' => __('Hero with CTA', 'tailwind-starter'),
                'description' => __('A hero section with call-to-action button', 'tailwind-starter'),
                'categories' => ['tailwind-starter'],
                'content' => '<!-- wp:my-tailwind-starter/hero-block --><!-- /wp:my-tailwind-starter/hero-block -->',
            ]
        );
    }
}
add_action('init', 'my_tailwind_starter_register_block_patterns');

// Security enhancements
function my_tailwind_starter_security_headers() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
    }
}
add_action('send_headers', 'my_tailwind_starter_security_headers');

// Remove version from scripts and styles
function my_tailwind_starter_remove_version($src) {
    if (strpos($src, 'ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}
add_filter('style_loader_src', 'my_tailwind_starter_remove_version');
add_filter('script_loader_src', 'my_tailwind_starter_remove_version');

// Disable emoji support
function my_tailwind_starter_disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
}
add_action('init', 'my_tailwind_starter_disable_emojis');