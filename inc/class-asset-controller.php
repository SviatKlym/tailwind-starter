<?php
namespace Gutenberg_Tailwind_Starter;

defined( 'ABSPATH' ) || exit;

class AssetController {
    protected string $blocks_dir;
    protected string $build_dir;

    public function __construct( string $blocks_dir ) {
        $this->blocks_dir = untrailingslashit( $blocks_dir );
        $this->build_dir = $this->blocks_dir . '/build/blocks';
        
        // Initialize hooks
        add_action( 'init', [ $this, 'register_all' ], 20 );
    }

    public function register_all(): void {
        // Register blocks from the build/blocks directory (preferred)
        if ( is_dir( $this->build_dir ) ) {
            foreach ( glob( $this->build_dir . '/*', GLOB_ONLYDIR ) as $dir ) {
                $block_name = basename( $dir );
                $json = $dir . '/block.json';

                if ( file_exists( $json ) ) {
                    $this->register_block_with_render_callback( $dir, $block_name );
                }
            }
        } else {
            // Only register from src/blocks if build directory doesn't exist
            $src_blocks_dir = $this->blocks_dir . '/src/blocks';
            if ( is_dir( $src_blocks_dir ) ) {
                foreach ( glob( $src_blocks_dir . '/*', GLOB_ONLYDIR ) as $dir ) {
                    $block_name = basename( $dir );
                    $json = $dir . '/block.json';

                    if ( file_exists( $json ) ) {
                        $this->register_block_with_render_callback( $dir, $block_name );
                    }
                }
            }
        }
        
        // Log registration info in debug mode
        if ( WP_DEBUG ) {
            $this->log_registration_info();
        }
    }

    private function register_block_with_render_callback( string $dir, string $block_name ): void {
        // Check if render file exists
        $render_file = $dir . '/render.php';
        $alt_render_files = [
            $dir . '/render-' . $block_name . '.php',
            $dir . '/render-' . str_replace( '-', '', $block_name ) . '.php'
        ];

        $render_callback = null;
        $render_file_found = null;

        // Check for main render file
        if ( file_exists( $render_file ) ) {
            $render_file_found = $render_file;
        } else {
            // Check alternative naming patterns
            foreach ( $alt_render_files as $alt_file ) {
                if ( file_exists( $alt_file ) ) {
                    $render_file_found = $alt_file;
                    break;
                }
            }
        }

        // Include render file and set callback if found
        if ( $render_file_found ) {
            require_once $render_file_found;
            
            // Determine function name based on block name
            $function_name = 'render_' . str_replace( '-', '_', $block_name ) . '_block';
            
            if ( function_exists( $function_name ) ) {
                $render_callback = $function_name;
            }
        }

        // Register block with or without render callback
        if ( $render_callback ) {
            register_block_type( $dir, [
                'render_callback' => $render_callback
            ] );
        } else {
            register_block_type( $dir );
        }
        
        // Log successful registration
        if ( WP_DEBUG ) {
            $block_json = json_decode( file_get_contents( $dir . '/block.json' ), true );
            $block_type = $block_json['name'] ?? 'unknown';
            error_log( "AssetController: Registered block '{$block_type}' from {$dir}" );
        }
    }

    /**
     * Get all registered blocks information
     */
    public function get_registered_blocks(): array {
        $blocks = [];
        
        // Check build directory first
        $dir_to_check = is_dir( $this->build_dir ) ? $this->build_dir : $this->blocks_dir . '/src/blocks';
        
        if ( is_dir( $dir_to_check ) ) {
            foreach ( glob( $dir_to_check . '/*', GLOB_ONLYDIR ) as $dir ) {
                $block_name = basename( $dir );
                $json_file = $dir . '/block.json';
                
                if ( file_exists( $json_file ) ) {
                    $block_data = json_decode( file_get_contents( $json_file ), true );
                    
                    if ( $block_data && isset( $block_data['name'] ) ) {
                        $blocks[ $block_name ] = [
                            'name' => $block_data['name'],
                            'title' => $block_data['title'] ?? '',
                            'category' => $block_data['category'] ?? 'common',
                            'path' => $dir,
                            'has_render_file' => $this->has_render_file( $dir, $block_name ),
                            'data' => $block_data
                        ];
                    }
                }
            }
        }
        
        return $blocks;
    }

    /**
     * Check if a block has a render file
     */
    private function has_render_file( string $dir, string $block_name ): bool {
        $render_files = [
            $dir . '/render.php',
            $dir . '/render-' . $block_name . '.php',
            $dir . '/render-' . str_replace( '-', '', $block_name ) . '.php'
        ];
        
        foreach ( $render_files as $file ) {
            if ( file_exists( $file ) ) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get blocks by category
     */
    public function get_blocks_by_category( string $category ): array {
        $blocks = $this->get_registered_blocks();
        
        return array_filter( $blocks, function( $block ) use ( $category ) {
            return $block['category'] === $category;
        });
    }

    /**
     * Get block count
     */
    public function get_block_count(): int {
        return count( $this->get_registered_blocks() );
    }

    /**
     * Check if a block exists
     */
    public function block_exists( string $block_name ): bool {
        $blocks = $this->get_registered_blocks();
        return isset( $blocks[ $block_name ] );
    }

    /**
     * Get used categories
     */
    public function get_used_categories(): array {
        $blocks = $this->get_registered_blocks();
        $categories = array_column( $blocks, 'category' );
        
        return array_unique( $categories );
    }

    /**
     * Log registration information
     */
    private function log_registration_info(): void {
        $blocks = $this->get_registered_blocks();
        
        error_log( "AssetController: Found " . count( $blocks ) . " blocks" );
        error_log( "AssetController: Using directory: " . ( is_dir( $this->build_dir ) ? $this->build_dir : $this->blocks_dir . '/src/blocks' ) );
        
        $categories = $this->get_used_categories();
        error_log( "AssetController: Categories in use: " . implode( ', ', $categories ) );
    }
}