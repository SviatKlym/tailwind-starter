<?php
/**
 * Block Class Generator - PHP version of visual-controls.js
 * Ensures perfect parity between editor and frontend classes
 * 
 * @package TailwindStarter
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Generate Tailwind classes from settings (PHP version of generateTailwindClasses)
 * 
 * @param array $settings Block settings
 * @param string $device Device breakpoint
 * @return string Generated classes
 */
function generate_tailwind_classes($settings, $device = 'base') {
    if (!is_array($settings)) {
        return '';
    }
    
    $classes = [];
    $prefix = $device !== 'base' ? $device . ':' : '';
    
    $spacing_values = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40];
    
    // Spacing classes
    if (isset($settings['spacing'][$device]) && is_array($settings['spacing'][$device])) {
        $spacing = $settings['spacing'][$device];
        if (!empty($spacing['top']) && $spacing['top'] > 0) {
            $classes[] = $prefix . 'pt-' . intval($spacing['top']);
        }
        if (!empty($spacing['right']) && $spacing['right'] > 0) {
            $classes[] = $prefix . 'pr-' . intval($spacing['right']);
        }
        if (!empty($spacing['bottom']) && $spacing['bottom'] > 0) {
            $classes[] = $prefix . 'pb-' . intval($spacing['bottom']);
        }
        if (!empty($spacing['left']) && $spacing['left'] > 0) {
            $classes[] = $prefix . 'pl-' . intval($spacing['left']);
        }
    }
    
    // Margin classes
    if (isset($settings['margins'][$device]) && is_array($settings['margins'][$device])) {
        $margins = $settings['margins'][$device];
        if (!empty($margins['top']) && $margins['top'] > 0) {
            $classes[] = $prefix . 'mt-' . intval($margins['top']);
        }
        if (!empty($margins['right']) && $margins['right'] > 0) {
            $classes[] = $prefix . 'mr-' . intval($margins['right']);
        }
        if (!empty($margins['bottom']) && $margins['bottom'] > 0) {
            $classes[] = $prefix . 'mb-' . intval($margins['bottom']);
        }
        if (!empty($margins['left']) && $margins['left'] > 0) {
            $classes[] = $prefix . 'ml-' . intval($margins['left']);
        }
    }
    
    // Block spacing patterns
    $has_individual_spacing = isset($settings['spacing'][$device]) && 
        is_array($settings['spacing'][$device]) && 
        array_filter($settings['spacing'][$device], function($val) { return $val > 0; });
    
    $has_individual_margins = isset($settings['margins'][$device]) && 
        is_array($settings['margins'][$device]) && 
        array_filter($settings['margins'][$device], function($val) { return $val > 0; });
    
    if (isset($settings['blockSpacing'][$device]) && !$has_individual_spacing && !$has_individual_margins) {
        $block_spacing = $settings['blockSpacing'][$device];
        if (!empty($block_spacing['variation'])) {
            $variation = $block_spacing['variation'];
            $spacing_patterns = [
                'compact' => [
                    'section' => $prefix . 'mb-6',
                    'padding' => $prefix . 'p-4'
                ],
                'generous' => [
                    'section' => $prefix . 'mb-12',
                    'padding' => $prefix . 'p-6'
                ],
                'balanced' => [
                    'section' => $prefix . 'mb-10',
                    'padding' => $prefix . 'p-5'
                ],
                'rhythmic' => [
                    'section' => $prefix . 'mb-16',
                    'padding' => $prefix . 'p-4'
                ]
            ];
            
            if (isset($spacing_patterns[$variation])) {
                $pattern = $spacing_patterns[$variation];
                $classes[] = $pattern['section'];
                $classes[] = $pattern['padding'];
            }
        }
    }
    
    // Typography classes
    if (isset($settings['typography'][$device]) && is_array($settings['typography'][$device])) {
        $typography = $settings['typography'][$device];
        $typo_props = ['fontSize', 'fontWeight', 'textAlign', 'lineHeight', 'letterSpacing', 'textTransform', 'fontSmoothing'];
        
        foreach ($typo_props as $prop) {
            if (!empty($typography[$prop])) {
                $classes[] = $prefix . $typography[$prop];
            }
        }
    }
    
    // Layout classes
    if (isset($settings['layout'][$device]) && is_array($settings['layout'][$device])) {
        $layout = $settings['layout'][$device];
        $layout_props = ['width', 'height', 'gap', 'justifyContent', 'alignItems', 'position', 'zIndex', 'display', 'gridCols', 'gridRows'];
        
        foreach ($layout_props as $prop) {
            if (!empty($layout[$prop])) {
                $classes[] = $prefix . $layout[$prop];
            }
        }
    }
    
    // Effects classes
    if (isset($settings['effects'][$device]) && is_array($settings['effects'][$device])) {
        $effects = $settings['effects'][$device];
        
        // Basic effects
        $basic_effects = ['shadow', 'borderRadius', 'borderWidth', 'borderStyle', 'borderColor'];
        foreach ($basic_effects as $prop) {
            if (!empty($effects[$prop])) {
                $classes[] = $prefix . $effects[$prop];
            }
        }
        
        // Hover effects and transitions
        $hover_props = ['hoverScale', 'hoverShadow', 'hoverOpacity', 'hoverRotate', 'hoverBgColor'];
        $has_hover_effects = false;
        foreach ($hover_props as $prop) {
            if (!empty($effects[$prop])) {
                $classes[] = $prefix . $effects[$prop];
                $has_hover_effects = true;
            }
        }
        
        if ($has_hover_effects) {
            $classes[] = $prefix . 'transition-all';
        }
        
        // Animations and transitions
        $animation_props = ['entranceAnimation', 'scrollAnimation', 'transitionDuration', 'transitionEasing'];
        foreach ($animation_props as $prop) {
            if (!empty($effects[$prop])) {
                $classes[] = $prefix . $effects[$prop];
            }
        }
    }
    
    // Gradients
    if (isset($settings['gradients'][$device]) && is_array($settings['gradients'][$device])) {
        $gradients = $settings['gradients'][$device];
        $gradient_props = ['type', 'fromColor', 'toColor', 'opacity'];
        
        foreach ($gradient_props as $prop) {
            if (!empty($gradients[$prop])) {
                $classes[] = $prefix . $gradients[$prop];
            }
        }
    }
    
    return implode(' ', array_filter(array_unique($classes)));
}

/**
 * Generate all classes for all devices (PHP version of generateAllClasses)
 * 
 * @param array $settings Block settings
 * @return string All generated classes
 */
function generate_all_classes($settings) {
    if (!is_array($settings)) {
        $settings = [];
    }
    
    // Apply default settings if empty to ensure proper styling
    if (empty($settings) || (!isset($settings['spacing']) && !isset($settings['blockSpacing']))) {
        $settings = array_merge([
            'blockSpacing' => [
                'base' => [
                    'variation' => 'balanced'  // This provides default mb-10 p-5 classes
                ]
            ],
            'backgroundColor' => $settings['backgroundColor'] ?? '',
            'textColor' => $settings['textColor'] ?? ''
        ], $settings);
    }
    
    $all_classes = [];
    
    // Base classes
    $base_classes = generate_tailwind_classes($settings, 'base');
    if ($base_classes) {
        $all_classes[] = $base_classes;
    }
    
    // Responsive classes
    $breakpoints = ['sm', 'md', 'lg', 'xl'];
    foreach ($breakpoints as $device) {
        $device_classes = generate_tailwind_classes($settings, $device);
        if ($device_classes) {
            $all_classes[] = $device_classes;
        }
    }
    
    // Global colors
    if (!empty($settings['backgroundColor'])) {
        $all_classes[] = esc_attr($settings['backgroundColor']);
    }
    
    if (!empty($settings['textColor'])) {
        $all_classes[] = esc_attr($settings['textColor']);
    }
    
    return implode(' ', array_filter($all_classes));
}

/**
 * Enhanced block wrapper preparation with perfect class parity
 * 
 * @param array $attributes Block attributes  
 * @param string $block_name Block identifier
 * @return array Wrapper data with classes and styles
 */
function prepare_enhanced_block_wrapper($attributes, $block_name = '') {
    // Get visual settings (legacy support)
    $visual_settings = $attributes['visualSettings'] ?? [];
    
    // Get settings (new visual controls system)
    $settings = $attributes['settings'] ?? [];
    
    // Generate classes from new settings system
    $settings_classes = generate_all_classes($settings);
    
    // Generate classes from legacy visual settings
    $visual_classes = generate_visual_classes($visual_settings);
    
    // Generate inline styles
    $visual_styles = generate_visual_styles($visual_settings);
    
    // Combine all classes
    $all_classes = array_filter([
        $block_name,
        $settings_classes,
        $visual_classes,
        $attributes['className'] ?? '',
        $settings['backgroundColor'] ?? '',
        $settings['textColor'] ?? ''
    ]);
    
    return [
        'classes' => implode(' ', $all_classes),
        'styles' => $visual_styles
    ];
}

/**
 * Debug function to compare editor vs frontend classes
 * Only works in WP_DEBUG mode
 */
function debug_block_classes($attributes, $block_name = '') {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
        return;
    }
    
    $settings = $attributes['settings'] ?? [];
    $generated_classes = generate_all_classes($settings);
    
    error_log("=== Block Class Debug: $block_name ===");
    error_log("Settings: " . print_r($settings, true));
    error_log("Generated Classes: $generated_classes");
    error_log("All Attributes: " . print_r($attributes, true));
    error_log("===========================");
}