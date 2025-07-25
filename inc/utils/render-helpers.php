<?php
/**
 * Render Helper Functions for Dynamic Blocks
 * 
 * @package TailwindStarter
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Generate CSS classes from visual settings
 * 
 * @param array $visual_settings Visual settings from block attributes
 * @return string Generated CSS classes
 */
function generate_visual_classes($visual_settings = []) {
    if (empty($visual_settings)) {
        return '';
    }
    
    $classes = [];
    $devices = ['base', 'sm', 'md', 'lg', 'xl'];
    $spacing_values = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40];
    
    foreach ($devices as $device) {
        $prefix = $device !== 'base' ? $device . ':' : '';
        
        // Spacing (padding) classes
        if (isset($visual_settings['spacing'][$device])) {
            $spacing = $visual_settings['spacing'][$device];
            foreach (['top', 'right', 'bottom', 'left'] as $side) {
                $value = $spacing[$side] ?? 0;
                if ($value > 0) {
                    $side_prefix = ['top' => 'pt', 'right' => 'pr', 'bottom' => 'pb', 'left' => 'pl'][$side];
                    $classes[] = $prefix . $side_prefix . '-' . $spacing_values[$value];
                }
            }
        }
        
        // Margin classes
        if (isset($visual_settings['margins'][$device])) {
            $margins = $visual_settings['margins'][$device];
            foreach (['top', 'right', 'bottom', 'left'] as $side) {
                $value = $margins[$side] ?? 0;
                if ($value > 0) {
                    $side_prefix = ['top' => 'mt', 'right' => 'mr', 'bottom' => 'mb', 'left' => 'ml'][$side];
                    $classes[] = $prefix . $side_prefix . '-' . $spacing_values[$value];
                }
            }
        }
        
        // Block spacing patterns
        if (isset($visual_settings['blockSpacing'][$device]['variation'])) {
            $variation = $visual_settings['blockSpacing'][$device]['variation'];
            $spacing_patterns = [
                'compact' => ['section' => 'mb-6', 'padding' => 'p-4'],
                'generous' => ['section' => 'mb-12', 'padding' => 'p-6'],
                'balanced' => ['section' => 'mb-10', 'padding' => 'p-5'],
                'rhythmic' => ['section' => 'mb-16', 'padding' => 'p-4']
            ];
            
            if (!empty($variation) && isset($spacing_patterns[$variation])) {
                $pattern = $spacing_patterns[$variation];
                $classes[] = $prefix . $pattern['section'];
                $classes[] = $prefix . $pattern['padding'];
            }
        }
        
        // Typography classes
        if (isset($visual_settings['typography'][$device])) {
            $typo = $visual_settings['typography'][$device];
            foreach (['fontSize', 'fontWeight', 'textAlign', 'lineHeight', 'letterSpacing', 'textTransform', 'fontSmoothing'] as $prop) {
                if (!empty($typo[$prop])) {
                    $classes[] = $prefix . $typo[$prop];
                }
            }
        }
        
        // Layout classes
        if (isset($visual_settings['layout'][$device])) {
            $layout = $visual_settings['layout'][$device];
            foreach (['width', 'height', 'gap', 'justifyContent', 'alignItems', 'position', 'zIndex', 'display', 'gridCols', 'gridRows'] as $prop) {
                if (!empty($layout[$prop])) {
                    $classes[] = $prefix . $layout[$prop];
                }
            }
        }
        
        // Effects classes
        if (isset($visual_settings['effects'][$device])) {
            $effects = $visual_settings['effects'][$device];
            
            // Basic effects
            foreach (['shadow', 'borderRadius', 'borderWidth', 'borderStyle', 'borderColor'] as $prop) {
                if (!empty($effects[$prop])) {
                    $classes[] = $prefix . $effects[$prop];
                }
            }
            
            // Hover effects and transitions
            if (!empty($effects['hoverScale']) || !empty($effects['hoverShadow']) || !empty($effects['hoverOpacity']) || !empty($effects['hoverRotate']) || !empty($effects['hoverBgColor'])) {
                $classes[] = $prefix . 'transition-all';
                
                foreach (['hoverScale', 'hoverShadow', 'hoverOpacity', 'hoverRotate', 'hoverBgColor'] as $prop) {
                    if (!empty($effects[$prop])) {
                        $classes[] = $prefix . $effects[$prop];
                    }
                }
            }
            
            // Animations and transitions
            foreach (['entranceAnimation', 'scrollAnimation', 'transitionDuration', 'transitionEasing'] as $prop) {
                if (!empty($effects[$prop])) {
                    $classes[] = $prefix . $effects[$prop];
                }
            }
        }
        
        // Gradients
        if (isset($visual_settings['gradients'][$device])) {
            $gradients = $visual_settings['gradients'][$device];
            foreach (['type', 'fromColor', 'toColor', 'opacity'] as $prop) {
                if (!empty($gradients[$prop])) {
                    $classes[] = $prefix . $gradients[$prop];
                }
            }
        }
    }
    
    // Background and text colors (global)
    if (!empty($visual_settings['backgroundColor'])) {
        $classes[] = $visual_settings['backgroundColor'];
    }
    
    if (!empty($visual_settings['textColor'])) {
        $classes[] = $visual_settings['textColor'];
    }
    
    return implode(' ', array_filter(array_unique($classes)));
}

/**
 * Generate inline styles from visual settings
 * 
 * @param array $visual_settings Visual settings from block attributes
 * @return string Generated inline styles
 */
function generate_visual_styles($visual_settings = []) {
    if (empty($visual_settings)) {
        return '';
    }
    
    $styles = [];
    $devices = ['base', 'sm', 'md', 'lg', 'xl'];
    
    foreach ($devices as $device) {
        if (isset($visual_settings['layout'][$device])) {
            $layout = $visual_settings['layout'][$device];
            
            // Custom dimensions (only apply for base device to avoid conflicts)
            if ($device === 'base') {
                if (!empty($layout['customMaxWidth'])) {
                    $styles[] = 'max-width: ' . esc_attr($layout['customMaxWidth']);
                }
                if (!empty($layout['customMinWidth'])) {
                    $styles[] = 'min-width: ' . esc_attr($layout['customMinWidth']);
                }
                if (!empty($layout['customHeight'])) {
                    $styles[] = 'height: ' . esc_attr($layout['customHeight']);
                }
                if (!empty($layout['customMaxHeight'])) {
                    $styles[] = 'max-height: ' . esc_attr($layout['customMaxHeight']);
                }
                if (!empty($layout['customMinHeight'])) {
                    $styles[] = 'min-height: ' . esc_attr($layout['customMinHeight']);
                }
            }
        }
    }
    
    return empty($styles) ? '' : implode('; ', $styles) . ';';
}

/**
 * Enhanced wrapper function for block rendering
 * 
 * @param array $attributes Block attributes
 * @param string $additional_classes Additional CSS classes
 * @return array ['classes' => string, 'styles' => string]
 */
function prepare_block_wrapper($attributes, $additional_classes = '') {
    // Include the enhanced class generator
    require_once get_template_directory() . '/inc/utils/block-class-generator.php';
    
    // Use the enhanced wrapper that matches editor classes
    $wrapper_data = prepare_enhanced_block_wrapper($attributes, $additional_classes);
    
    // Debug in development
    if (defined('WP_DEBUG') && WP_DEBUG) {
        debug_block_classes($attributes, $additional_classes);
    }
    
    return $wrapper_data;
}

/**
 * Render star rating component
 * 
 * @param int $rating Rating value
 * @param int $max_rating Maximum rating value
 * @return string HTML output
 */
function render_star_rating($rating, $max_rating = 5) {
    $output = '<div class="star-rating flex items-center">';
    for ($i = 1; $i <= $max_rating; $i++) {
        if ($i <= $rating) {
            $output .= '<svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">';
            $output .= '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
            $output .= '</svg>';
        } else {
            $output .= '<svg class="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">';
            $output .= '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
            $output .= '</svg>';
        }
    }
    $output .= '</div>';
    return $output;
}

/**
 * Format numbers with animations
 * 
 * @param array $item Item data
 * @param bool $enable_animations Whether animations are enabled
 * @return string Formatted number with animation attributes
 */
function format_animated_number($item, $enable_animations = true) {
    $number = $item['number'] ?? '0';
    $prefix = $item['prefix'] ?? '';
    $suffix = $item['suffix'] ?? '';
    
    // Extract numeric value for animation
    $numeric_value = preg_replace('/[^0-9.]/', '', $number);
    
    $data_attrs = '';
    if ($enable_animations) {
        $data_attrs = sprintf(
            'data-animate="true" data-target="%s" data-duration="%d"',
            esc_attr($numeric_value),
            esc_attr($item['animationDuration'] ?? 2000)
        );
    }
    
    return sprintf(
        '<span class="animated-number-wrapper" %s>%s<span class="counter-value">%s</span>%s</span>',
        $data_attrs,
        esc_html($prefix),
        esc_html($number),
        esc_html($suffix)
    );
}

/**
 * Sanitize and prepare block attributes
 * 
 * @param array $attributes Raw block attributes
 * @return array Sanitized attributes
 */
function sanitize_block_attributes($attributes) {
    if (!is_array($attributes)) {
        return [];
    }
    
    $sanitized = [];
    
    foreach ($attributes as $key => $value) {
        if (is_string($value)) {
            $sanitized[$key] = sanitize_text_field($value);
        } elseif (is_array($value)) {
            // Recursively sanitize nested arrays
            $sanitized[$key] = sanitize_block_attributes($value);
        } elseif (is_bool($value)) {
            $sanitized[$key] = (bool) $value;
        } elseif (is_numeric($value)) {
            $sanitized[$key] = is_float($value) ? (float) $value : (int) $value;
        } elseif (is_null($value)) {
            $sanitized[$key] = null;
        } else {
            // For other types (objects, etc.), keep as-is but be careful
            $sanitized[$key] = $value;
        }
    }
    
    return $sanitized;
}

/**
 * Generate performance configuration for blocks
 * 
 * @param string $block_name Block name identifier
 * @param array $config Configuration options
 * @return array Performance configuration
 */
function generate_performance_config($block_name, $config = []) {
    $defaults = [
        'lazyLoading' => [
            'enabled' => false,
            'rootMargin' => '100px'
        ],
        'scrollAnimations' => [
            'enabled' => false,
            'type' => 'fadeIn',
            'duration' => '0.5s'
        ],
        'analytics' => [
            'enabled' => false,
            'trackViews' => false,
            'trackClicks' => false,
            'viewData' => []
        ]
    ];
    
    return wp_parse_args($config, $defaults);
}

/**
 * Generate data attributes from performance config
 * 
 * @param array $performance_config Performance configuration
 * @return string HTML data attributes
 */
function generate_data_attributes($performance_config) {
    $attributes = [];
    
    // Lazy loading attributes
    if (!empty($performance_config['lazyLoading']['enabled'])) {
        $attributes[] = 'data-lazy-load="true"';
        $attributes[] = 'data-lazy-margin="' . esc_attr($performance_config['lazyLoading']['rootMargin']) . '"';
    }
    
    // Scroll animation attributes
    if (!empty($performance_config['scrollAnimations']['enabled'])) {
        $attributes[] = 'data-scroll-animate="true"';
        $attributes[] = 'data-animation-type="' . esc_attr($performance_config['scrollAnimations']['type']) . '"';
        $attributes[] = 'data-animation-duration="' . esc_attr($performance_config['scrollAnimations']['duration']) . '"';
    }
    
    // Analytics attributes
    if (!empty($performance_config['analytics']['enabled'])) {
        if (!empty($performance_config['analytics']['trackViews'])) {
            $attributes[] = 'data-track-views="true"';
        }
        if (!empty($performance_config['analytics']['trackClicks'])) {
            $attributes[] = 'data-track-clicks="true"';
        }
        if (!empty($performance_config['analytics']['viewData'])) {
            $attributes[] = 'data-view-data=\'' . json_encode($performance_config['analytics']['viewData']) . '\'';
        }
    }
    
    return implode(' ', $attributes);
}