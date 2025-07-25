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
$layout = $attributes['layout'] ?? 'centered';
$title_font_size = $attributes['titleFontSize'] ?? 'text-4xl md:text-6xl';
$title_font_weight = $attributes['titleFontWeight'] ?? 'font-bold';
$subtitle_font_size = $attributes['subtitleFontSize'] ?? 'text-xl md:text-2xl';
$title_margin_bottom = $attributes['titleMarginBottom'] ?? 'mb-6';
$subtitle_margin_bottom = $attributes['subtitleMarginBottom'] ?? 'mb-8';
$content_max_width = $attributes['contentMaxWidth'] ?? 'max-w-3xl';
$content_alignment = $attributes['contentAlignment'] ?? 'text-center';
$content_padding = $attributes['contentPadding'] ?? 'px-4 py-24';
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
            <?php if (!empty($background_image['url'])): ?>
                <div class="hero-background absolute inset-0 overflow-hidden">
                    <?php echo render_hero_image($background_image); ?>
                </div>
            <?php endif; ?>
            
            <div class="hero-content relative z-10 container mx-auto <?php echo esc_attr($content_padding); ?>">
                <div class="grid md:grid-cols-2 gap-8 items-center">
                    <!-- Content Column -->
                    <div>
                        <?php if (!empty($headline)): ?>
                            <h1 class="hero-title <?php echo esc_attr($title_font_size); ?> <?php echo esc_attr($title_font_weight); ?> <?php echo esc_attr($title_margin_bottom); ?>"
                                data-animate="title">
                                <?php echo wp_kses_post($headline); ?>
                            </h1>
                        <?php endif; ?>

                        <?php if (!empty($subheadline)): ?>
                            <h2 class="hero-subtitle <?php echo esc_attr($subtitle_font_size); ?> <?php echo esc_attr($subtitle_margin_bottom); ?> opacity-75"
                                data-animate="subtitle"
                                data-animate-delay="200">
                                <?php echo wp_kses_post($subheadline); ?>
                            </h2>
                        <?php endif; ?>

                        <div class="hero-ctas <?php echo esc_attr($button_spacing); ?>">
                            <?php if (!empty($primary_cta['text']) && !empty($primary_cta['url'])): ?>
                                <a href="<?php echo esc_url($primary_cta['url']); ?>"
                                   class="hero-cta-primary btn-primary inline-flex items-center <?php echo esc_attr($primary_button_style['padding'] ?? 'px-8 py-4'); ?> <?php echo esc_attr($primary_button_style['fontSize'] ?? 'text-lg'); ?> <?php echo esc_attr($primary_button_style['fontWeight'] ?? 'font-semibold'); ?> <?php echo esc_attr($primary_button_style['borderRadius'] ?? 'rounded-lg'); ?> transition-all <?php echo esc_attr($animation_duration); ?> <?php echo $hover_effects ? 'hover:scale-105' : ''; ?> focus:outline-none focus:ring-4 focus:ring-opacity-50"
                                   data-animate="cta"
                                   data-animate-delay="400"
                                   data-track-click="primary-cta">
                                    <span><?php echo esc_html($primary_cta['text']); ?></span>
                                    <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            <?php endif; ?>

                            <?php if ($show_secondary_cta && !empty($secondary_cta['text']) && !empty($secondary_cta['url'])): ?>
                                <a href="<?php echo esc_url($secondary_cta['url']); ?>"
                                   class="hero-cta-secondary btn-outline inline-flex items-center <?php echo esc_attr($secondary_button_style['padding'] ?? 'px-8 py-4'); ?> <?php echo esc_attr($secondary_button_style['fontSize'] ?? 'text-lg'); ?> <?php echo esc_attr($secondary_button_style['fontWeight'] ?? 'font-semibold'); ?> <?php echo esc_attr($secondary_button_style['borderRadius'] ?? 'rounded-lg'); ?> transition-all <?php echo esc_attr($animation_duration); ?> focus:outline-none focus:ring-4 focus:ring-opacity-50"
                                   data-animate="cta"
                                   data-animate-delay="500"
                                   data-track-click="secondary-cta">
                                    <span><?php echo esc_html($secondary_cta['text']); ?></span>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <!-- Image Column -->
                    <div class="relative">
                        <div class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <span class="text-gray-500">Hero Image Placeholder</span>
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
            <?php if (!empty($background_image['url'])): ?>
                <div class="hero-background absolute inset-0 overflow-hidden">
                    <?php echo render_hero_image($background_image); ?>
                </div>
            <?php endif; ?>
            
            <div class="<?php echo esc_attr($content_padding); ?> text-center">
                <div class="container mx-auto px-4">
                    <div class="max-w-2xl mx-auto">
                        <?php if (!empty($headline)): ?>
                            <h1 class="text-3xl sm:text-4xl font-bold mb-4"
                                data-animate="title">
                                <?php echo wp_kses_post($headline); ?>
                            </h1>
                        <?php endif; ?>

                        <?php if (!empty($subheadline)): ?>
                            <p class="text-lg text-gray-600 mb-6"
                               data-animate="subtitle"
                               data-animate-delay="200">
                                <?php echo wp_kses_post($subheadline); ?>
                            </p>
                        <?php endif; ?>

                        <?php if (!empty($primary_cta['text']) && !empty($primary_cta['url'])): ?>
                            <a href="<?php echo esc_url($primary_cta['url']); ?>"
                               class="btn btn-primary px-6 py-3"
                               data-animate="cta"
                               data-animate-delay="400"
                               data-track-click="primary-cta">
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
            
            <?php if (!empty($background_image['url'])): ?>
                <div class="hero-background absolute inset-0 overflow-hidden">
                    <?php echo render_hero_image($background_image); ?>
                </div>
            <?php endif; ?>

            <!-- Content -->
            <div class="hero-content relative z-10 container mx-auto <?php echo esc_attr($content_padding); ?> <?php echo esc_attr($content_alignment); ?>">
                
                <?php if (!empty($headline)): ?>
                    <h1 class="hero-title <?php echo esc_attr($title_font_size); ?> <?php echo esc_attr($title_font_weight); ?> <?php echo esc_attr($title_margin_bottom); ?>"
                        data-animate="title">
                        <?php echo wp_kses_post($headline); ?>
                    </h1>
                <?php endif; ?>

                <?php if (!empty($subheadline)): ?>
                    <h2 class="hero-subtitle <?php echo esc_attr($subtitle_font_size); ?> <?php echo esc_attr($subtitle_margin_bottom); ?> <?php echo esc_attr($content_max_width); ?> mx-auto opacity-75"
                        data-animate="subtitle"
                        data-animate-delay="200">
                        <?php echo wp_kses_post($subheadline); ?>
                    </h2>
                <?php endif; ?>

                <div class="hero-ctas <?php echo esc_attr($button_spacing); ?>">
                    <?php if (!empty($primary_cta['text']) && !empty($primary_cta['url'])): ?>
                        <a href="<?php echo esc_url($primary_cta['url']); ?>"
                           class="hero-cta-primary btn-primary inline-flex items-center <?php echo esc_attr($primary_button_style['padding'] ?? 'px-8 py-4'); ?> <?php echo esc_attr($primary_button_style['fontSize'] ?? 'text-lg'); ?> <?php echo esc_attr($primary_button_style['fontWeight'] ?? 'font-semibold'); ?> <?php echo esc_attr($primary_button_style['borderRadius'] ?? 'rounded-lg'); ?> transition-all <?php echo esc_attr($animation_duration); ?> <?php echo $hover_effects ? 'hover:scale-105' : ''; ?> focus:outline-none focus:ring-4 focus:ring-opacity-50"
                           data-animate="cta"
                           data-animate-delay="400"
                           data-track-click="primary-cta">
                            <span><?php echo esc_html($primary_cta['text']); ?></span>
                            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    <?php endif; ?>

                    <?php if ($show_secondary_cta && !empty($secondary_cta['text']) && !empty($secondary_cta['url'])): ?>
                        <a href="<?php echo esc_url($secondary_cta['url']); ?>"
                           class="hero-cta-secondary btn-outline inline-flex items-center <?php echo esc_attr($secondary_button_style['padding'] ?? 'px-8 py-4'); ?> <?php echo esc_attr($secondary_button_style['fontSize'] ?? 'text-lg'); ?> <?php echo esc_attr($secondary_button_style['fontWeight'] ?? 'font-semibold'); ?> <?php echo esc_attr($secondary_button_style['borderRadius'] ?? 'rounded-lg'); ?> transition-all <?php echo esc_attr($animation_duration); ?> focus:outline-none focus:ring-4 focus:ring-opacity-50"
                           data-animate="cta"
                           data-animate-delay="500"
                           data-track-click="secondary-cta">
                            <span><?php echo esc_html($secondary_cta['text']); ?></span>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </section>
        <?php
        break;
}
?>