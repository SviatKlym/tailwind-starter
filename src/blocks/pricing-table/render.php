<?php
/**
 * pricing-table Block - Enhanced Server-side render template
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
$wrapper_data = prepare_enhanced_block_wrapper($attributes, 'pricing-table');
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
$layout = is_string($attributes['layout'] ?? '') ? $attributes['layout'] : 'three-tier';
$show_section_header = $attributes['showSectionHeader'] ?? false;
$section_title = $attributes['sectionTitle'] ?? '';
$section_subtitle = $attributes['sectionSubtitle'] ?? '';

// Combine base classes with visual control classes
$base_classes = "pricing-table pricing-table--{$layout}";
$block_classes = trim("{$base_classes} {$all_classes}");

?>

<div class="<?php echo esc_attr(trim($block_classes)); ?>" 
     <?php echo $inline_styles ? 'style="' . esc_attr($inline_styles) . '"' : ''; ?>>
    
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-12">
            <?php if ($section_title): ?>
                <h2 class="<?php echo esc_attr($heading_classes); ?>">
                    <?php echo esc_html($section_title); ?>
                </h2>
            <?php endif; ?>
            <?php if ($section_subtitle): ?>
                <p class="<?php echo esc_attr($paragraph_classes); ?>">
                    <?php echo esc_html($section_subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="pricing-table-content">
        <?php
        // Extract attributes
        $layout = $attributes['layout'] ?? 'three-tier';
        $plans = $attributes['plans'] ?? [];
        $show_toggle = (bool) ($attributes['showToggle'] ?? false);
        $toggle_label1 = $attributes['toggleLabel1'] ?? 'Monthly';
        $toggle_label2 = $attributes['toggleLabel2'] ?? 'Annual';
        $current_toggle = $attributes['currentToggle'] ?? 'monthly';

        if (empty($plans)) :
        ?>
            <div class="no-plans text-center py-12">
                <div class="text-6xl mb-4 opacity-50">💰</div>
                <p class="text-lg opacity-75">No pricing plans configured.</p>
            </div>
        <?php
        else :
            // Determine grid classes based on number of plans
            $plan_count = count($plans);
            $grid_classes = 'grid gap-8 ';
            if ($plan_count === 1) {
                $grid_classes .= 'grid-cols-1 max-w-md mx-auto';
            } elseif ($plan_count === 2) {
                $grid_classes .= 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
            } else {
                $grid_classes .= 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
            }
        ?>
            <?php if ($show_toggle) : ?>
                <div class="billing-toggle flex justify-center mb-12" data-toggle-pricing>
                    <div class="relative bg-gray-100 rounded-lg p-1">
                        <div class="flex space-x-1">
                            <button class="<?php echo $current_toggle === 'monthly' ? 'toggle-active bg-white text-blue-600 shadow' : 'text-gray-600'; ?> px-4 py-2 text-sm font-medium rounded-md transition-all" data-period="monthly">
                                <?php echo esc_html($toggle_label1); ?>
                            </button>
                            <button class="<?php echo $current_toggle === 'annual' ? 'toggle-active bg-white text-blue-600 shadow' : 'text-gray-600'; ?> px-4 py-2 text-sm font-medium rounded-md transition-all" data-period="annual">
                                <?php echo esc_html($toggle_label2); ?>
                                <span class="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Save 20%</span>
                            </button>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <div class="<?php echo esc_attr($grid_classes . ' ' . $layout_classes); ?>">
                <?php foreach ($plans as $plan) : 
                    if (!is_array($plan)) continue;
                    
                    $plan_id = $plan['id'] ?? 'plan-' . rand();
                    $name = $plan['name'] ?? '';
                    $description = $plan['description'] ?? '';
                    $monthly_price = $plan['monthlyPrice'] ?? '0';
                    $annual_price = $plan['annualPrice'] ?? '0';
                    $currency = $plan['currency'] ?? '$';
                    $period = $plan['period'] ?? 'month';
                    $is_popular = (bool) ($plan['isPopular'] ?? false);
                    $features = $plan['features'] ?? [];
                    $cta_text = $plan['ctaText'] ?? 'Get Started';
                    $cta_url = $plan['ctaUrl'] ?? '#';
                    
                    // Determine price to display
                    $display_price = $current_toggle === 'annual' ? $annual_price : $monthly_price;
                    $display_period = $current_toggle === 'annual' ? 'year' : $period;
                    
                    // Card classes
                    $card_classes = 'pricing-card relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 ';
                    if ($is_popular) {
                        $card_classes .= 'ring-2 ring-blue-500 scale-105 bg-gradient-to-b from-blue-50 to-white';
                    }
                ?>
                    <div class="<?php echo esc_attr($card_classes); ?>" data-plan-id="<?php echo esc_attr($plan_id); ?>">
                        
                        <?php if ($is_popular) : ?>
                            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span class="inline-flex items-center px-4 py-2 text-sm font-bold popular-badge rounded-full">
                                    ⭐ Most Popular
                                </span>
                            </div>
                        <?php endif; ?>

                        <div class="text-center">
                            <h3 class="plan-name text-2xl font-bold text-gray-900 mb-2">
                                <?php echo esc_html($name); ?>
                            </h3>
                            
                            <?php if ($description) : ?>
                                <p class="plan-description text-gray-600 mb-6">
                                    <?php echo esc_html($description); ?>
                                </p>
                            <?php endif; ?>

                            <div class="pricing mb-8">
                                <div class="price-display">
                                    <span class="currency text-2xl font-semibold text-gray-900">
                                        <?php echo esc_html($currency); ?>
                                    </span>
                                    <span class="price text-5xl font-bold text-gray-900" 
                                          data-monthly-price="<?php echo esc_attr($monthly_price); ?>" 
                                          data-annual-price="<?php echo esc_attr($annual_price); ?>">
                                        <?php echo esc_html($display_price); ?>
                                    </span>
                                    <span class="period text-lg text-gray-600" 
                                          data-monthly-period="<?php echo esc_attr($period); ?>" 
                                          data-annual-period="year">
                                        /<?php echo esc_html($display_period); ?>
                                    </span>
                                </div>
                                
                                <?php if ($show_toggle && $current_toggle === 'annual') : ?>
                                    <p class="savings text-sm text-green-600 mt-2">
                                        Save <?php echo esc_html($currency . ($monthly_price * 12 - $annual_price)); ?> per year
                                    </p>
                                <?php endif; ?>
                            </div>

                            <div class="cta-button mb-8">
                                <a href="<?php echo esc_url($cta_url); ?>" 
                                   class="<?php echo $is_popular ? 'btn-primary' : 'btn-secondary'; ?> inline-block w-full px-6 py-3 text-lg font-semibold rounded-lg transition-colors">
                                    <?php echo esc_html($cta_text); ?>
                                </a>
                            </div>

                            <?php if (!empty($features)) : ?>
                                <div class="features text-left">
                                    <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                                        What's included:
                                    </h4>
                                    <ul class="space-y-3">
                                        <?php foreach ($features as $feature) : ?>
                                            <li class="flex items-start">
                                                <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                                </svg>
                                                <span class="text-gray-700">
                                                    <?php echo esc_html($feature); ?>
                                                </span>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <?php if ($show_toggle) : ?>
                <div class="toggle-disclaimer text-center mt-8">
                    <p class="text-sm text-gray-500">
                        All plans include a 14-day free trial. No credit card required.
                    </p>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</div>
