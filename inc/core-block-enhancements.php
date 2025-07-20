<?php
/**
 * Core Block Enhancements
 * 
 * This file handles the registration and enqueueing of core block enhancements
 * that add visual controls to existing WordPress blocks.
 */

namespace TailwindStarter\CoreBlocks;

class CoreBlockEnhancements {
    
    private string $build_dir;
    
    public function __construct() {
        $this->build_dir = get_template_directory() . '/build';
        add_action('init', [$this, 'init']);
    }
    
    /**
     * Initialize core block enhancements
     */
    public function init(): void {
        // Only load in admin/editor
        if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST)) {
            add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
        }
        
        // Add frontend styles
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_assets']);
        add_action('enqueue_block_assets', [$this, 'enqueue_block_assets']);
    }
    
    /**
     * Enqueue editor assets for core block enhancements
     */
    public function enqueue_editor_assets(): void {
        // Use the core-enhancements block built by wp-scripts
        $core_enhancements_js = $this->build_dir . '/blocks/core-enhancements/index.js';
        $core_enhancements_css = $this->build_dir . '/blocks/core-enhancements/index.css';
        
        // Enqueue core block enhancements JavaScript
        if (file_exists($core_enhancements_js)) {
            $asset_file = $this->build_dir . '/blocks/core-enhancements/index.asset.php';
            $asset_data = file_exists($asset_file) ? include $asset_file : [
                'dependencies' => [
                    'wp-blocks',
                    'wp-element', 
                    'wp-block-editor',
                    'wp-components',
                    'wp-i18n',
                    'wp-hooks',
                    'wp-data'
                ],
                'version' => filemtime($core_enhancements_js)
            ];
            
            wp_enqueue_script(
                'tailwind-starter-core-enhancements',
                get_template_directory_uri() . '/build/blocks/core-enhancements/index.js',
                $asset_data['dependencies'],
                $asset_data['version'],
                true
            );
            
            // Localize script with theme data
            wp_localize_script('tailwind-starter-core-enhancements', 'tailwindStarterCoreBlocks', [
                'nonce' => wp_create_nonce('tailwind_starter_core_blocks'),
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'themeUrl' => get_template_directory_uri(),
                'isDevMode' => defined('WP_DEBUG') && WP_DEBUG
            ]);
        }
        
        // Enqueue core block enhancements CSS
        if (file_exists($core_enhancements_css)) {
            wp_enqueue_style(
                'tailwind-starter-core-enhancements',
                get_template_directory_uri() . '/build/blocks/core-enhancements/index.css',
                ['wp-edit-blocks'],
                filemtime($core_enhancements_css)
            );
        }
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets(): void {
        // Enqueue frontend styles for enhanced blocks
        $frontend_css = $this->build_dir . '/core-blocks-frontend.css';
        
        if (file_exists($frontend_css)) {
            wp_enqueue_style(
                'tailwind-starter-core-blocks-frontend',
                $this->get_asset_url('core-blocks-frontend.css'),
                [],
                filemtime($frontend_css)
            );
        }
    }
    
    /**
     * Enqueue block assets (both editor and frontend)
     */
    public function enqueue_block_assets(): void {
        // Add custom CSS for enhanced blocks that works on both editor and frontend
        $custom_css = "
        /* Core Block Enhancements */
        .wp-block[data-classes] {
            transition: all 0.2s ease;
        }
        
        /* Visual indicators for enhanced blocks */
        .block-editor-block-list__block[data-type^='core/'] .wp-block {
            position: relative;
        }
        
        /* Enhanced heading styles */
        .wp-block-heading.has-visual-controls {
            position: relative;
        }
        
        /* Enhanced paragraph styles */
        .wp-block-paragraph.has-visual-controls {
            position: relative;
        }
        
        /* Enhanced button styles */
        .wp-block-button .wp-block-button__link.has-visual-controls {
            position: relative;
            transition: all 0.2s ease;
        }
        
        /* Enhanced group styles */
        .wp-block-group.has-visual-controls {
            position: relative;
        }
        
        /* Enhanced list styles */
        .wp-block-list.has-visual-controls {
            position: relative;
        }
        
        /* Enhanced quote styles */
        .wp-block-quote.has-visual-controls {
            position: relative;
        }
        
        /* Enhanced image styles */
        .wp-block-image.has-visual-controls {
            position: relative;
        }
        
        /* Enhanced spacer styles */
        .wp-block-spacer.has-visual-controls {
            position: relative;
        }
        
        /* Enhanced separator styles */
        .wp-block-separator.has-visual-controls {
            position: relative;
        }
        ";
        
        wp_add_inline_style('wp-block-library', $custom_css);
    }
    
    /**
     * Get asset URL with proper handling for build vs source files
     */
    private function get_asset_url(string $filename): string {
        $build_file = $this->build_dir . '/' . $filename;
        $src_file = get_template_directory() . '/src/' . $filename;
        
        if (file_exists($build_file)) {
            return get_template_directory_uri() . '/build/' . $filename;
        } elseif (file_exists($src_file)) {
            return get_template_directory_uri() . '/src/' . $filename;
        }
        
        return '';
    }
    
    /**
     * Check if core block enhancements are enabled
     */
    public function are_enhancements_enabled(): bool {
        return apply_filters('tailwind_starter_core_block_enhancements_enabled', true);
    }
    
    /**
     * Get list of enhanced block types
     */
    public function get_enhanced_blocks(): array {
        return apply_filters('tailwind_starter_enhanced_blocks', [
            'core/heading',
            'core/paragraph', 
            'core/button',
            'core/image',
            'core/columns',
            'core/group',
            'core/list',
            'core/quote',
            'core/spacer',
            'core/separator'
        ]);
    }
    
    /**
     * Add block pattern support for enhanced blocks
     */
    public function register_block_patterns(): void {
        // Register enhanced heading patterns
        register_block_pattern('tailwind-starter/enhanced-hero-heading', [
            'title' => __('Enhanced Hero Heading', 'tailwind-starter'),
            'description' => __('Large, centered heading with visual controls', 'tailwind-starter'),
            'content' => '<!-- wp:heading {"level":1,"visualSettings":{"spacing":{"base":{"top":8,"right":0,"bottom":8,"left":0}},"typography":{"base":{"fontSize":"text-5xl","fontWeight":"font-bold","textAlign":"text-center"}},"backgroundColor":"","textColor":"text-gray-900"},"activeDevice":"base"} -->
            <h1 class="wp-block-heading pt-8 pb-8 text-5xl font-bold text-center text-gray-900">Your Amazing Headline</h1>
            <!-- /wp:heading -->',
            'categories' => ['text'],
            'keywords' => ['heading', 'hero', 'title']
        ]);
        
        // Register enhanced button patterns
        register_block_pattern('tailwind-starter/enhanced-cta-button', [
            'title' => __('Enhanced CTA Button', 'tailwind-starter'),
            'description' => __('Call-to-action button with visual controls', 'tailwind-starter'),
            'content' => '<!-- wp:button {"visualSettings":{"spacing":{"base":{"top":4,"right":8,"bottom":4,"left":8}},"typography":{"base":{"fontSize":"text-xl","fontWeight":"font-bold","textAlign":"text-center"}},"backgroundColor":"bg-green-600","textColor":"text-white"},"activeDevice":"base"} -->
            <div class="wp-block-button pt-4 pr-8 pb-4 pl-8 text-xl font-bold text-center bg-green-600 text-white"><a class="wp-block-button__link">Get Started Today</a></div>
            <!-- /wp:button -->',
            'categories' => ['buttons'],
            'keywords' => ['button', 'cta', 'action']
        ]);
    }
}

// Initialize core block enhancements
function init_core_block_enhancements(): void {
    new CoreBlockEnhancements();
}

// Hook into WordPress initialization - RE-ENABLED FOR SIMPLE TEST
add_action('after_setup_theme', __NAMESPACE__ . '\\init_core_block_enhancements');