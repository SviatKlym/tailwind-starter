<?php
/**
 * Feature Grid Block - Enhanced Server-side render template
 * 
 * @param array    $attributes Block attributes
 * @param string   $content    Block default content
 * @param WP_Block $block      Block instance
 * 
 * @package TailwindStarter
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include the block class generator and render helpers
if (!function_exists('generate_all_classes')) {
    require_once get_template_directory() . '/inc/utils/block-class-generator.php';
}
if (!function_exists('generate_visual_classes')) {
    require_once get_template_directory() . '/inc/utils/render-helpers.php';
}

// Ensure attributes is an array
$attributes = is_array($attributes) ? $attributes : [];

// Sanitize attributes
$attributes = sanitize_block_attributes($attributes);

// Generate all classes using the full visual controls system
$visual_settings = $attributes['visualSettings'] ?? [];
$settings = $attributes['settings'] ?? [];

// Use the enhanced block wrapper for perfect class generation
$wrapper_data = prepare_enhanced_block_wrapper($attributes, 'feature-grid');
$all_classes = $wrapper_data['classes'];
$inline_styles = $wrapper_data['styles'];

// Extract typography classes for text elements
$typography_classes = '';
$text_color_class = '';
$text_align_class = '';

if (!empty($settings)) {
    if (isset($settings['typography']['base'])) {
        $typography = $settings['typography']['base'];
        if (!empty($typography['fontSize'])) $typography_classes .= ' ' . $typography['fontSize'];
        if (!empty($typography['fontWeight'])) $typography_classes .= ' ' . $typography['fontWeight'];
        if (!empty($typography['lineHeight'])) $typography_classes .= ' ' . $typography['lineHeight'];
        if (!empty($typography['letterSpacing'])) $typography_classes .= ' ' . $typography['letterSpacing'];
        if (!empty($typography['textTransform'])) $typography_classes .= ' ' . $typography['textTransform'];
        if (!empty($typography['textAlign'])) $text_align_class = $typography['textAlign'];
    }
    
    if (!empty($settings['textColor'])) {
        $text_color_class = $settings['textColor'];
    }
}

// Extract layout classes for content containers
$layout_classes = '';
if (!empty($settings)) {
    if (isset($settings['layout']['base'])) {
        $layout = $settings['layout']['base'];
        if (!empty($layout['display'])) $layout_classes .= ' ' . $layout['display'];
        if (!empty($layout['gap'])) $layout_classes .= ' ' . $layout['gap'];
        if (!empty($layout['justifyContent'])) $layout_classes .= ' ' . $layout['justifyContent'];
        if (!empty($layout['alignItems'])) $layout_classes .= ' ' . $layout['alignItems'];
        if (!empty($layout['gridCols'])) $layout_classes .= ' ' . $layout['gridCols'];
        if (!empty($layout['gridRows'])) $layout_classes .= ' ' . $layout['gridRows'];
    }
}

$layout_classes = trim($layout_classes);

// Generate dynamic classes for text elements
$heading_classes = trim("text-3xl font-bold mb-4" . (!empty($typography_classes) || !empty($text_color_class) || !empty($text_align_class) ? " {$typography_classes} {$text_color_class} {$text_align_class}" : ""));
$paragraph_classes = trim("text-lg opacity-75 max-w-3xl mx-auto" . (!empty($text_color_class) || !empty($text_align_class) ? " {$text_color_class} {$text_align_class}" : ""));

// Extract block-specific attributes
$layout = is_string($attributes['layout'] ?? '') ? $attributes['layout'] : 'grid';
$features = isset($attributes['features']) && is_array($attributes['features']) ? $attributes['features'] : [];
$columns = intval($attributes['columns'] ?? 3);
$showSectionHeader = (bool) ($attributes['showSectionHeader'] ?? false);
$sectionTitle = $attributes['sectionTitle'] ?? '';
$sectionSubtitle = $attributes['sectionSubtitle'] ?? '';

// Combine base classes
$base_classes = "feature-grid feature-grid--{$layout}";
$block_classes = trim("{$base_classes} {$all_classes}");

// Determine grid columns classes
$grid_classes = 'grid gap-8 ';
switch ($columns) {
    case 1:
        $grid_classes .= 'grid-cols-1';
        break;
    case 2:
        $grid_classes .= 'grid-cols-1 md:grid-cols-2';
        break;
    case 3:
        $grid_classes .= 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        break;
    case 4:
        $grid_classes .= 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
        break;
    default:
        $grid_classes .= 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
}

?>

<div class="<?php echo esc_attr(trim($block_classes)); ?>" 
     <?php echo $inline_styles ? 'style="' . esc_attr($inline_styles) . '"' : ''; ?>>
    
    <?php if ($showSectionHeader && ($sectionTitle || $sectionSubtitle)): ?>
        <div class="section-header text-center mb-12">
            <?php if ($sectionTitle): ?>
                <h2 class="<?php echo esc_attr($heading_classes); ?>">
                    <?php echo esc_html($sectionTitle); ?>
                </h2>
            <?php endif; ?>
            <?php if ($sectionSubtitle): ?>
                <p class="<?php echo esc_attr($paragraph_classes); ?>">
                    <?php echo esc_html($sectionSubtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <?php if (empty($features)): ?>
        <div class="no-features text-center py-12">
            <div class="text-6xl mb-4 opacity-50">✨</div>
            <p class="text-lg opacity-75">No features configured.</p>
        </div>
    <?php else: ?>
        <div class="features-grid <?php echo esc_attr($grid_classes . ' ' . $layout_classes); ?>">
            <?php foreach ($features as $index => $feature): ?>
                <?php if (!is_array($feature)) continue; ?>
                
                <div class="feature-item p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <?php if (!empty($feature['icon'])): ?>
                        <div class="feature-icon text-4xl mb-4">
                            <?php echo wp_kses_post($feature['icon']); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (!empty($feature['title'])): ?>
                        <h3 class="feature-title text-xl font-semibold mb-3 <?php echo esc_attr($text_color_class . ' ' . $text_align_class); ?>">
                            <?php echo esc_html($feature['title']); ?>
                        </h3>
                    <?php endif; ?>
                    
                    <?php if (!empty($feature['description'])): ?>
                        <p class="feature-description text-gray-600 leading-relaxed <?php echo esc_attr($text_color_class . ' ' . $text_align_class); ?>">
                            <?php echo wp_kses_post($feature['description']); ?>
                        </p>
                    <?php endif; ?>
                    
                    <?php if (!empty($feature['link']['url']) && !empty($feature['link']['text'])): ?>
                        <div class="feature-link mt-4">
                            <a href="<?php echo esc_url($feature['link']['url']); ?>" 
                               class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                <?php echo esc_html($feature['link']['text']); ?> →
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>