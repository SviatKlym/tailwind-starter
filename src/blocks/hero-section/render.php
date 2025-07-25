<?php
/**
 * Hero Section Block - Server-side render template
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Extract attributes with defaults
$headline = $attributes['headline'] ?? 'Build Something Amazing';
$subheadline = $attributes['subheadline'] ?? 'Join thousands of customers who trust our platform to grow their business faster and more efficiently.';
$primary_cta = $attributes['primaryCTA'] ?? ['text' => 'Get Started Free', 'url' => '#', 'style' => 'primary'];
$secondary_cta = $attributes['secondaryCTA'] ?? ['text' => 'Watch Demo', 'url' => '#', 'style' => 'secondary'];
$show_secondary_cta = $attributes['showSecondaryCTA'] ?? true;
$background_image = $attributes['backgroundImage'] ?? null;
$hero_image = $attributes['heroImage'] ?? null;
$layout = $attributes['layout'] ?? 'centered';
$title_font_size = $attributes['titleFontSize'] ?? 'text-4xl md:text-6xl';
$title_font_weight = $attributes['titleFontWeight'] ?? 'font-bold';
$subtitle_font_size = $attributes['subtitleFontSize'] ?? 'text-xl md:text-2xl';
$title_margin_bottom = $attributes['titleMarginBottom'] ?? 'mb-6';
$subtitle_margin_bottom = $attributes['subtitleMarginBottom'] ?? 'mb-8';
$content_max_width = $attributes['contentMaxWidth'] ?? 'max-w-3xl';
$content_alignment = $attributes['contentAlignment'] ?? 'text-center';
$padding = $attributes['padding'] ?? ['top' => 'large', 'bottom' => 'large'];

// Generate padding class like the editor
if (!function_exists('get_padding_class')) {
    function get_padding_class($size) {
        $padding_map = [
            'small' => 'py-8 sm:py-12',
            'medium' => 'py-12 sm:py-16', 
            'large' => 'py-16 sm:py-24',
            'xlarge' => 'py-24 sm:py-32'
        ];
        return $padding_map[$size] ?? $padding_map['large'];
    }
}

$content_padding = get_padding_class($padding['top']);
$button_spacing = $attributes['buttonSpacing'] ?? 'space-x-4';
$primary_button_style = $attributes['primaryButtonStyle'] ?? [];
$secondary_button_style = $attributes['secondaryButtonStyle'] ?? [];
$animation_duration = $attributes['animationDuration'] ?? 'duration-200';
$hover_effects = $attributes['hoverEffects'] ?? true;
$settings = $attributes['settings'] ?? [];

// Generate classes from settings (simplified)
$settings_classes = '';
if (!empty($settings)) {
    // Basic classes from settings
    $settings_classes = $settings['backgroundColor'] ?? '';
    $settings_classes .= ' ' . ($settings['textColor'] ?? '');
    
    // Add spacing if available
    if (isset($settings['spacing']['base'])) {
        $spacing = $settings['spacing']['base'];
        if (!empty($spacing['top'])) $settings_classes .= ' pt-' . $spacing['top'];
        if (!empty($spacing['right'])) $settings_classes .= ' pr-' . $spacing['right'];
        if (!empty($spacing['bottom'])) $settings_classes .= ' pb-' . $spacing['bottom'];
        if (!empty($spacing['left'])) $settings_classes .= ' pl-' . $spacing['left'];
    }
}

$block_classes = "hero-section hero-section--{$layout} {$settings_classes}";

// Render optimized image helper
if (!function_exists('render_hero_image')) {
    function render_hero_image($image) {
        if (empty($image['url'])) return '';
        
        $placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5QzlDQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPgo=';
        
        return '<img src="' . esc_url($placeholder) . '" 
                     data-lazy-src="' . esc_url($image['url']) . '" 
                     alt="" 
                     class="hero-background-image w-full h-full object-cover" />';
    }
}

?>

<?php
// Render different layouts based on layout attribute
switch ($layout) {
    case 'split':
        ?>
        <section class="<?php echo esc_attr(trim($block_classes)); ?>">
            <div class="<?php echo esc_attr($content_padding); ?> relative">
                <div class="container mx-auto px-4">
                    <div class="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <?php if (!empty($headline)): ?>
                                <h1 class="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                                    <?php echo wp_kses_post($headline); ?>
                                </h1>
                            <?php endif; ?>

                            <?php if (!empty($subheadline)): ?>
                                <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                                    <?php echo wp_kses_post($subheadline); ?>
                                </p>
                            <?php endif; ?>

                            <div class="flex flex-col sm:flex-row gap-4">
                                <?php if (!empty($primary_cta['text']) && !empty($primary_cta['url'])): ?>
                                    <a href="<?php echo esc_url($primary_cta['url']); ?>"
                                       class="btn btn-primary btn-lg px-8 py-4">
                                        <?php echo esc_html($primary_cta['text']); ?>
                                    </a>
                                <?php endif; ?>

                                <?php if ($show_secondary_cta && !empty($secondary_cta['text']) && !empty($secondary_cta['url'])): ?>
                                    <a href="<?php echo esc_url($secondary_cta['url']); ?>"
                                       class="btn btn-outline btn-lg px-8 py-4">
                                        <?php echo esc_html($secondary_cta['text']); ?>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="lg:text-right">
                            <?php if (!empty($hero_image['url'])): ?>
                                <img src="<?php echo esc_url($hero_image['url']); ?>" 
                                     alt="<?php echo esc_attr($hero_image['alt'] ?? ''); ?>" 
                                     class="w-full max-w-lg ml-auto rounded-lg shadow-2xl" />
                            <?php else: ?>
                                <div class="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                                    <span class="text-gray-500">Hero Image Placeholder</span>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php
        break;

    case 'minimal':
        ?>
        <section class="<?php echo esc_attr(trim($block_classes)); ?>">
            <div class="<?php echo esc_attr($content_padding); ?> text-center">
                <div class="container mx-auto px-4">
                    <div class="max-w-2xl mx-auto">
                        <?php if (!empty($headline)): ?>
                            <h1 class="text-3xl sm:text-4xl font-bold mb-4">
                                <?php echo wp_kses_post($headline); ?>
                            </h1>
                        <?php endif; ?>

                        <?php if (!empty($subheadline)): ?>
                            <p class="text-lg text-gray-600 mb-6">
                                <?php echo wp_kses_post($subheadline); ?>
                            </p>
                        <?php endif; ?>

                        <?php if (!empty($primary_cta['text']) && !empty($primary_cta['url'])): ?>
                            <a href="<?php echo esc_url($primary_cta['url']); ?>"
                               class="btn btn-primary px-6 py-3">
                                <?php echo esc_html($primary_cta['text']); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </section>
        <?php
        break;

    default: // centered layout
        ?>
        <section class="<?php echo esc_attr(trim($block_classes)); ?>">
            <div class="<?php echo esc_attr($content_padding); ?> relative">
                <?php if (!empty($background_image['url'])): ?>
                    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" 
                         style="background-image: url(<?php echo esc_url($background_image['url']); ?>); opacity: 0.1;"></div>
                <?php endif; ?>
                
                <div class="relative container mx-auto px-4 text-center">
                    <div class="max-w-4xl mx-auto">
                        <?php if (!empty($headline)): ?>
                            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                <?php echo wp_kses_post($headline); ?>
                            </h1>
                        <?php endif; ?>

                        <?php if (!empty($subheadline)): ?>
                            <p class="text-lg sm:text-xl opacity-75 mb-8 leading-relaxed max-w-3xl mx-auto">
                                <?php echo wp_kses_post($subheadline); ?>
                            </p>
                        <?php endif; ?>

                        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <?php if (!empty($primary_cta['text']) && !empty($primary_cta['url'])): ?>
                                <a href="<?php echo esc_url($primary_cta['url']); ?>"
                                   class="btn-primary px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center">
                                    <?php echo esc_html($primary_cta['text']); ?>
                                </a>
                            <?php endif; ?>

                            <?php if ($show_secondary_cta && !empty($secondary_cta['text']) && !empty($secondary_cta['url'])): ?>
                                <a href="<?php echo esc_url($secondary_cta['url']); ?>"
                                   class="btn-outline px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center">
                                    <?php echo esc_html($secondary_cta['text']); ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php
        break;
}
?>