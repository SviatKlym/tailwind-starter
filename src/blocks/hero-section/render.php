<?php
/**
 * Hero Section Block - Dynamic Server-side render template
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

// Include render helpers
require_once get_template_directory() . '/inc/utils/render-helpers.php';

// Ensure attributes is an array
$attributes = is_array($attributes) ? $attributes : [];

// Sanitize attributes
$attributes = sanitize_block_attributes($attributes);

// Extract and set default values with type checking
$headline = $attributes['headline'] ?? '';
$subheadline = $attributes['subheadline'] ?? '';
$primary_cta = isset($attributes['primaryCTA']) && is_array($attributes['primaryCTA']) ? $attributes['primaryCTA'] : [];
$secondary_cta = isset($attributes['secondaryCTA']) && is_array($attributes['secondaryCTA']) ? $attributes['secondaryCTA'] : [];
$show_secondary_cta = (bool) ($attributes['showSecondaryCTA'] ?? false);
$background_image = isset($attributes['backgroundImage']) && is_array($attributes['backgroundImage']) ? $attributes['backgroundImage'] : [];
$background_color = $attributes['backgroundColor'] ?? '';
$text_color = $attributes['textColor'] ?? '';
$hero_image = isset($attributes['heroImage']) && is_array($attributes['heroImage']) ? $attributes['heroImage'] : [];
$layout = $attributes['layout'] ?? 'centered';
$padding = $attributes['padding'] ?? '';
$title_font_size = $attributes['titleFontSize'] ?? 'text-4xl md:text-6xl';
$title_font_weight = $attributes['titleFontWeight'] ?? 'font-bold';
$subtitle_font_size = $attributes['subtitleFontSize'] ?? 'text-xl md:text-2xl';
$title_margin_bottom = $attributes['titleMarginBottom'] ?? 'mb-6';
$subtitle_margin_bottom = $attributes['subtitleMarginBottom'] ?? 'mb-8';
$content_max_width = $attributes['contentMaxWidth'] ?? 'max-w-3xl';
$content_alignment = $attributes['contentAlignment'] ?? 'text-center';
$content_padding = $attributes['contentPadding'] ?? 'px-4 py-24';
$button_spacing = $attributes['buttonSpacing'] ?? 'space-x-4';
$primary_button_style = isset($attributes['primaryButtonStyle']) && is_array($attributes['primaryButtonStyle']) ? $attributes['primaryButtonStyle'] : [];
$secondary_button_style = isset($attributes['secondaryButtonStyle']) && is_array($attributes['secondaryButtonStyle']) ? $attributes['secondaryButtonStyle'] : [];
$animation_duration = $attributes['animationDuration'] ?? 'duration-200';
$hover_effects = (bool) ($attributes['hoverEffects'] ?? false);
$settings = isset($attributes['settings']) && is_array($attributes['settings']) ? $attributes['settings'] : [];
$overlay_opacity = intval($attributes['overlayOpacity'] ?? 0);

// Prepare block wrapper with visual controls integration
$wrapper_data = prepare_block_wrapper($attributes, 'hero-section hero-section--' . esc_attr($layout));

// Generate performance config
$performance_config = generate_performance_config('hero-section', [
    'lazyLoading' => [
        'enabled' => !empty($background_image['url']),
        'rootMargin' => '100px'
    ],
    'scrollAnimations' => [
        'enabled' => true,
        'type' => 'fadeInUp',
        'duration' => '0.8s'
    ],
    'analytics' => [
        'enabled' => true,
        'trackViews' => true,
        'trackClicks' => !empty($primary_cta['text']) || !empty($secondary_cta['text']),
        'viewData' => ['section' => 'hero', 'layout' => $layout]
    ]
]);

// Function to render optimized image
function render_optimized_image($image, $alt = '') {
    if (empty($image['url'])) return '';
    
    $webp_url = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $image['url']);
    $placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5QzlDQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPgo=';
    
    ob_start(); ?>
    <picture>
        <source srcset="" type="image/webp" data-lazy-srcset="<?php echo esc_url($webp_url); ?>" />
        <img
            src="<?php echo esc_url($placeholder); ?>"
            alt="<?php echo esc_attr($alt); ?>"
            class="hero-background-image w-full h-full object-cover"
            data-lazy-src="<?php echo esc_url($image['url']); ?>"
        />
    </picture>
    <?php return ob_get_clean();
}

?>

<section class="<?php echo esc_attr($wrapper_data['classes']); ?>" 
         <?php echo $wrapper_data['styles'] ? 'style="' . esc_attr($wrapper_data['styles']) . '"' : ''; ?>
         <?php echo generate_data_attributes($performance_config); ?>>
    
    <?php if (!empty($background_image['url'])): ?>
        <div class="hero-background absolute inset-0 overflow-hidden">
            <?php echo render_optimized_image($background_image, ''); ?>
            <?php if ($overlay_opacity > 0): ?>
                <div class="hero-overlay absolute inset-0 bg-black" 
                     style="opacity: <?php echo esc_attr($overlay_opacity / 100); ?>"></div>
            <?php endif; ?>
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

    <?php if (!empty($hero_image['url']) && $layout === 'split'): ?>
        <div class="hero-image-container">
            <?php echo render_optimized_image($hero_image, $hero_image['alt'] ?? ''); ?>
        </div>
    <?php endif; ?>
</section>