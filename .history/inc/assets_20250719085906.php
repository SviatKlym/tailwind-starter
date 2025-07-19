<?php

function my_tailwind_starter_enqueue_assets() {
    if (wp_get_environment_type() === 'development') {
        wp_enqueue_style(
            'tailwind-starter-dev',
            'http://localhost:5173/src/style.css',
            [],
            '1.0.0'
        );
        wp_enqueue_script(
            'tailwind-starter-vite',
            'http://localhost:5173/@vite/client',
            [],
            '1.0.0',
            true
        );
    } else {
        $css_file = get_template_directory() . '/build/main.css';
        wp_enqueue_style(
            'tailwind-starter-style',
            get_template_directory_uri() . '/build/main.css',
            [],
            file_exists($css_file) ? filemtime($css_file) : '1.0.0'
        );
    }
}
add_action('wp_enqueue_scripts', 'my_tailwind_starter_enqueue_assets');

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