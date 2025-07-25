<?php
/**
 * CTA Section Block - Enhanced Server-side render template
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
$wrapper_data = prepare_enhanced_block_wrapper($attributes, 'cta-section');
$all_classes = $wrapper_data['classes'];
$inline_styles = $wrapper_data['styles'];

// Extract typography classes for text elements
$typography_classes = '';
$text_color_class = '';
$text_align_class = '';

if (!empty($settings)) {
    // Extract typography settings for base device
    if (isset($settings['typography']['base'])) {
        $typography = $settings['typography']['base'];
        if (!empty($typography['fontSize'])) $typography_classes .= ' ' . $typography['fontSize'];
        if (!empty($typography['fontWeight'])) $typography_classes .= ' ' . $typography['fontWeight'];
        if (!empty($typography['lineHeight'])) $typography_classes .= ' ' . $typography['lineHeight'];
        if (!empty($typography['letterSpacing'])) $typography_classes .= ' ' . $typography['letterSpacing'];
        if (!empty($typography['textTransform'])) $typography_classes .= ' ' . $typography['textTransform'];
        if (!empty($typography['textAlign'])) $text_align_class = $typography['textAlign'];
    }
    
    // Extract text color
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

// Generate dynamic classes for text elements only when visual controls are applied
$heading_classes = trim("text-3xl font-bold mb-4" . (!empty($typography_classes) || !empty($text_color_class) || !empty($text_align_class) ? " {$typography_classes} {$text_color_class} {$text_align_class}" : ""));
$paragraph_classes = trim("text-lg opacity-75 max-w-3xl mx-auto" . (!empty($text_color_class) || !empty($text_align_class) ? " {$text_color_class} {$text_align_class}" : ""));

// Extract block-specific attributes
$layout = is_string($attributes['layout'] ?? '') ? $attributes['layout'] : 'centered';
$headline = $attributes['headline'] ?? 'Ready to Get Started?';
$description = $attributes['description'] ?? 'Join thousands of satisfied customers who have transformed their business with our solution.';
$primaryButton = $attributes['primaryButton'] ?? ['text' => 'Get Started', 'url' => '#'];
$secondaryButton = $attributes['secondaryButton'] ?? ['text' => 'Learn More', 'url' => '#'];
$showSecondaryButton = (bool) ($attributes['showSecondaryButton'] ?? false);
$backgroundColor = $attributes['backgroundColor'] ?? '';
$backgroundImage = $attributes['backgroundImage'] ?? null;
$hasOverlay = (bool) ($attributes['hasOverlay'] ?? false);
$overlayOpacity = intval($attributes['overlayOpacity'] ?? 50);
$textColor = $attributes['textColor'] ?? '';
$alignment = $attributes['alignment'] ?? 'center';
$showSectionHeader = (bool) ($attributes['showSectionHeader'] ?? false);
$sectionTitle = $attributes['sectionTitle'] ?? '';
$sectionSubtitle = $attributes['sectionSubtitle'] ?? '';

// Combine base classes with visual control classes
$base_classes = "cta-section cta-section--{$layout}";
$block_classes = trim("{$base_classes} {$all_classes}");

// Build background styles
$background_styles = '';
if (!empty($backgroundColor)) {
    $background_styles .= "background-color: {$backgroundColor};";
}
if (!empty($backgroundImage['url'])) {
    $background_styles .= "background-image: url('{$backgroundImage['url']}'); background-size: cover; background-position: center;";
}

// Combine with inline styles
$combined_styles = trim($background_styles . ' ' . $inline_styles);

?>

<div class="<?php echo esc_attr(trim($block_classes)); ?>" 
     <?php echo $combined_styles ? 'style="' . esc_attr($combined_styles) . '"' : ''; ?>>
    
    <?php if ($hasOverlay && !empty($backgroundImage['url'])): ?>
        <div class="absolute inset-0 bg-black" style="opacity: <?php echo esc_attr($overlayOpacity / 100); ?>"></div>
    <?php endif; ?>
    
    <div class="relative container mx-auto px-4 py-16 sm:py-24 text-<?php echo esc_attr($alignment); ?>">
        
        <?php if ($showSectionHeader && ($sectionTitle || $sectionSubtitle)): ?>
            <div class="section-header text-center mb-12 <?php echo esc_attr($layout_classes); ?>">
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
        
        <div class="cta-content max-w-4xl mx-auto <?php echo esc_attr($layout_classes); ?>">
            <?php if (!empty($headline)): ?>
                <h1 class="cta-headline text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight <?php echo esc_attr($text_color_class . ' ' . $text_align_class); ?>">
                    <?php echo wp_kses_post($headline); ?>
                </h1>
            <?php endif; ?>
            
            <?php if (!empty($description)): ?>
                <p class="cta-description text-xl mb-8 opacity-90 max-w-2xl mx-auto <?php echo esc_attr($text_color_class . ' ' . $text_align_class); ?>">
                    <?php echo wp_kses_post($description); ?>
                </p>
            <?php endif; ?>
            
            <div class="cta-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
                <?php if (!empty($primaryButton['text']) && !empty($primaryButton['url'])): ?>
                    <a href="<?php echo esc_url($primaryButton['url']); ?>"
                       class="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105">
                        <?php echo esc_html($primaryButton['text']); ?>
                    </a>
                <?php endif; ?>
                
                <?php if ($showSecondaryButton && !empty($secondaryButton['text']) && !empty($secondaryButton['url'])): ?>
                    <a href="<?php echo esc_url($secondaryButton['url']); ?>"
                       class="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200">
                        <?php echo esc_html($secondaryButton['text']); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>