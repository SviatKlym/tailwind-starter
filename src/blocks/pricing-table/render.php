<?php
/**
 * Pricing Table Block - Server-side render template
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

// Extract and set default values
$layout = $attributes['layout'] ?? 'three-tier';
$plans = $attributes['plans'] ?? [];
$show_toggle = $attributes['showToggle'] ?? false;
$toggle_label1 = $attributes['toggleLabel1'] ?? 'Monthly';
$toggle_label2 = $attributes['toggleLabel2'] ?? 'Annual';
$current_toggle = $attributes['currentToggle'] ?? 'monthly';
$highlight_popular = $attributes['highlightPopular'] ?? true;
$show_comparison = $attributes['showComparison'] ?? false;
$currency_symbol = $attributes['currencySymbol'] ?? '$';
$enable_discounts = $attributes['enableDiscounts'] ?? false;
$discount_percentage = $attributes['discountPercentage'] ?? 20;
$section_title = $attributes['sectionTitle'] ?? 'Choose Your Plan';
$section_subtitle = $attributes['sectionSubtitle'] ?? 'Select the perfect plan for your needs';
$show_section_header = $attributes['showSectionHeader'] ?? true;
$settings = $attributes['settings'] ?? [];

// Dynamic pricing enhancements
$user_currency = get_user_currency(); // Custom function to detect user currency
$exchange_rates = get_exchange_rates(); // Custom function to get current rates
$current_user_id = get_current_user_id();
$user_subscriptions = get_user_subscriptions($current_user_id); // Check existing subscriptions

// Enhanced plans with dynamic pricing
$enhanced_plans = [];
foreach ($plans as $plan) {
    $enhanced_plan = $plan;
    
    // Apply dynamic pricing based on user location, subscription status, etc.
    $plan_id = $plan['id'] ?? '';
    
    // Check for database-stored pricing overrides
    $db_pricing = get_option('dynamic_pricing_' . $plan_id, null);
    if ($db_pricing) {
        $enhanced_plan['monthlyPrice'] = $db_pricing['monthly'] ?? $plan['monthlyPrice'];
        $enhanced_plan['annualPrice'] = $db_pricing['annual'] ?? $plan['annualPrice'];
        $enhanced_plan['dynamic_pricing'] = true;
    }
    
    // Apply currency conversion if needed
    if ($user_currency !== 'USD' && isset($exchange_rates[$user_currency])) {
        $rate = $exchange_rates[$user_currency];
        $enhanced_plan['monthlyPrice'] = round(floatval($enhanced_plan['monthlyPrice']) * $rate, 2);
        $enhanced_plan['annualPrice'] = round(floatval($enhanced_plan['annualPrice']) * $rate, 2);
        $enhanced_plan['currency'] = get_currency_symbol($user_currency);
        $enhanced_plan['converted'] = true;
    } else {
        $enhanced_plan['currency'] = $currency_symbol;
        $enhanced_plan['converted'] = false;
    }
    
    // Apply discounts for existing customers
    if (!empty($user_subscriptions) && $enable_discounts) {
        $enhanced_plan['monthlyPrice'] = round($enhanced_plan['monthlyPrice'] * (1 - $discount_percentage / 100), 2);
        $enhanced_plan['annualPrice'] = round($enhanced_plan['annualPrice'] * (1 - $discount_percentage / 100), 2);
        $enhanced_plan['has_discount'] = true;
        $enhanced_plan['discount_percentage'] = $discount_percentage;
    }
    
    // Calculate savings for annual plans
    $monthly_yearly_total = $enhanced_plan['monthlyPrice'] * 12;
    $annual_savings = $monthly_yearly_total - $enhanced_plan['annualPrice'];
    $enhanced_plan['annual_savings'] = $annual_savings;
    $enhanced_plan['savings_percentage'] = $monthly_yearly_total > 0 ? round(($annual_savings / $monthly_yearly_total) * 100) : 0;
    
    // Check if user already has this plan
    $enhanced_plan['user_has_plan'] = in_array($plan_id, array_column($user_subscriptions, 'plan_id'));
    
    // Add trial information if applicable
    $trial_days = get_option('trial_days_' . $plan_id, 0);
    if ($trial_days > 0) {
        $enhanced_plan['trial_days'] = $trial_days;
        $enhanced_plan['has_trial'] = true;
    }
    
    $enhanced_plans[] = $enhanced_plan;
}

// Helper functions
function get_user_currency() {
    // This would typically use GeoIP or user preferences
    // For now, return USD as default
    return get_option('site_default_currency', 'USD');
}

function get_exchange_rates() {
    // This would fetch from an API like exchangerate-api.com
    // For now, return cached rates
    return get_transient('currency_rates') ?: [
        'EUR' => 0.85,
        'GBP' => 0.73,
        'CAD' => 1.25,
        'AUD' => 1.35
    ];
}

function get_currency_symbol($currency) {
    $symbols = [
        'USD' => '$',
        'EUR' => '€',
        'GBP' => '£',
        'CAD' => 'C$',
        'AUD' => 'A$'
    ];
    return $symbols[$currency] ?? '$';
}

function get_user_subscriptions($user_id) {
    // This would query your subscription/membership database
    // For now, return empty array
    return [];
}

// Handle empty plans
if (empty($enhanced_plans)) {
    echo '<div class="pricing-table-block no-plans text-center py-8">';
    echo '<p class="text-gray-500">No pricing plans available.</p>';
    echo '</div>';
    return;
}

// Generate CSS classes from settings
$wrapper_classes = ['pricing-table-block', 'layout-' . esc_attr($layout)];
if (isset($settings['backgroundColor'])) {
    $wrapper_classes[] = esc_attr($settings['backgroundColor']);
}
if (isset($settings['textColor'])) {
    $wrapper_classes[] = esc_attr($settings['textColor']);
}

// Helper function to format price
function format_price($price, $currency, $period = '') {
    $formatted_price = number_format($price, 2);
    $period_text = $period ? '/' . $period : '';
    return $currency . $formatted_price . $period_text;
}

// Helper function to render feature list
function render_features($features) {
    if (empty($features)) return '';
    
    $output = '<ul class="plan-features space-y-3 mb-8">';
    foreach ($features as $feature) {
        $output .= '<li class="flex items-start">';
        $output .= '<svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">';
        $output .= '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>';
        $output .= '</svg>';
        $output .= '<span class="text-gray-600">' . esc_html($feature) . '</span>';
        $output .= '</li>';
    }
    $output .= '</ul>';
    return $output;
}
?>

<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>">
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-8">
            <?php if ($section_title): ?>
                <h2 class="section-title text-3xl font-bold mb-4">
                    <?php echo esc_html($section_title); ?>
                </h2>
            <?php endif; ?>
            <?php if ($section_subtitle): ?>
                <p class="section-subtitle text-gray-600 text-lg max-w-2xl mx-auto">
                    <?php echo esc_html($section_subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <?php if ($show_toggle): ?>
        <div class="pricing-toggle flex justify-center mb-8">
            <div class="toggle-switch bg-gray-100 p-1 rounded-lg flex">
                <button class="toggle-btn active px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm transition-all duration-200" 
                        data-period="monthly">
                    <?php echo esc_html($toggle_label1); ?>
                </button>
                <button class="toggle-btn px-4 py-2 rounded-md text-sm font-medium text-gray-600 transition-all duration-200" 
                        data-period="annual">
                    <?php echo esc_html($toggle_label2); ?>
                    <?php if ($enable_discounts): ?>
                        <span class="ml-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Save <?php echo esc_html($discount_percentage); ?>%
                        </span>
                    <?php endif; ?>
                </button>
            </div>
        </div>
    <?php endif; ?>
    
    <div class="pricing-plans grid gap-8 <?php echo count($enhanced_plans) === 1 ? 'grid-cols-1 max-w-md mx-auto' : (count($enhanced_plans) === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'); ?>">
        <?php foreach ($enhanced_plans as $plan): ?>
            <?php 
            $is_popular = $plan['isPopular'] ?? false;
            $user_has_plan = $plan['user_has_plan'] ?? false;
            $has_trial = $plan['has_trial'] ?? false;
            
            $card_classes = 'pricing-plan relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ';
            if ($is_popular && $highlight_popular) {
                $card_classes .= 'ring-2 ring-blue-500 scale-105 ';
            }
            if ($user_has_plan) {
                $card_classes .= 'opacity-75 ';
            }
            ?>
            
            <div class="<?php echo esc_attr($card_classes); ?>" data-plan-id="<?php echo esc_attr($plan['id'] ?? ''); ?>">
                <?php if ($is_popular && $highlight_popular): ?>
                    <div class="popular-badge absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            Most Popular
                        </span>
                    </div>
                <?php endif; ?>
                
                <?php if ($user_has_plan): ?>
                    <div class="current-plan-badge absolute top-4 right-4">
                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Current Plan
                        </span>
                    </div>
                <?php endif; ?>
                
                <div class="plan-header p-8 pb-6">
                    <h3 class="plan-name text-xl font-bold text-gray-900 mb-2">
                        <?php echo esc_html($plan['name'] ?? ''); ?>
                    </h3>
                    
                    <p class="plan-description text-gray-600 mb-6">
                        <?php echo esc_html($plan['description'] ?? ''); ?>
                    </p>
                    
                    <div class="plan-pricing">
                        <div class="price-display">
                            <span class="monthly-price <?php echo $current_toggle === 'annual' ? 'hidden' : ''; ?>">
                                <span class="price-amount text-4xl font-bold text-gray-900">
                                    <?php echo format_price($plan['monthlyPrice'], $plan['currency']); ?>
                                </span>
                                <span class="price-period text-gray-600">/month</span>
                            </span>
                            
                            <span class="annual-price <?php echo $current_toggle === 'monthly' ? 'hidden' : ''; ?>">
                                <span class="price-amount text-4xl font-bold text-gray-900">
                                    <?php echo format_price($plan['annualPrice'], $plan['currency']); ?>
                                </span>
                                <span class="price-period text-gray-600">/year</span>
                            </span>
                        </div>
                        
                        <?php if ($show_toggle && isset($plan['annual_savings']) && $plan['annual_savings'] > 0): ?>
                            <div class="savings-info annual-only text-sm text-green-600 mt-2 <?php echo $current_toggle === 'monthly' ? 'hidden' : ''; ?>">
                                Save <?php echo esc_html($plan['currency'] . number_format($plan['annual_savings'], 2)); ?> 
                                (<?php echo esc_html($plan['savings_percentage']); ?>%) per year
                            </div>
                        <?php endif; ?>
                        
                        <?php if (isset($plan['has_discount']) && $plan['has_discount']): ?>
                            <div class="discount-info text-sm text-orange-600 mt-2">
                                🎉 <?php echo esc_html($plan['discount_percentage']); ?>% existing customer discount applied!
                            </div>
                        <?php endif; ?>
                        
                        <?php if (isset($plan['converted']) && $plan['converted']): ?>
                            <div class="currency-info text-xs text-gray-500 mt-2">
                                Converted from USD
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="plan-features px-8">
                    <?php echo render_features($plan['features'] ?? []); ?>
                </div>
                
                <div class="plan-footer p-8 pt-0">
                    <?php if ($has_trial): ?>
                        <div class="trial-info bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 text-sm text-center">
                            🎁 <?php echo esc_html($plan['trial_days']); ?>-day free trial included
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($user_has_plan): ?>
                        <button class="cta-button w-full bg-gray-300 text-gray-600 py-3 px-6 rounded-lg font-semibold cursor-not-allowed" disabled>
                            Current Plan
                        </button>
                    <?php else: ?>
                        <a href="<?php echo esc_url($plan['ctaUrl'] ?? '#'); ?>" 
                           class="cta-button block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 <?php echo $is_popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'; ?>"
                           data-plan="<?php echo esc_attr($plan['id'] ?? ''); ?>"
                           data-price-monthly="<?php echo esc_attr($plan['monthlyPrice']); ?>"
                           data-price-annual="<?php echo esc_attr($plan['annualPrice']); ?>">
                            <?php echo esc_html($plan['ctaText'] ?? 'Get Started'); ?>
                        </a>
                    <?php endif; ?>
                    
                    <?php if (!empty($plan['ctaSubtext'])): ?>
                        <p class="cta-subtext text-xs text-gray-500 text-center mt-2">
                            <?php echo esc_html($plan['ctaSubtext']); ?>
                        </p>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    
    <?php if ($show_comparison): ?>
        <div class="pricing-comparison mt-12">
            <div class="text-center mb-6">
                <button class="comparison-toggle bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    Compare All Features
                </button>
            </div>
            
            <div class="comparison-table hidden bg-white rounded-lg shadow-lg overflow-hidden">
                <!-- Comparison table would be generated here -->
                <div class="p-6 text-center text-gray-600">
                    Detailed feature comparison table available on request.
                </div>
            </div>
        </div>
    <?php endif; ?>
    
    <?php if ($show_toggle): ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const toggleBtns = document.querySelectorAll('.toggle-btn');
            const monthlyPrices = document.querySelectorAll('.monthly-price');
            const annualPrices = document.querySelectorAll('.annual-price');
            const savingsInfo = document.querySelectorAll('.savings-info');
            const annualOnly = document.querySelectorAll('.annual-only');
            
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const period = this.dataset.period;
                    
                    // Update toggle buttons
                    toggleBtns.forEach(b => {
                        b.classList.remove('active', 'bg-white', 'shadow-sm');
                        b.classList.add('text-gray-600');
                    });
                    this.classList.add('active', 'bg-white', 'shadow-sm');
                    this.classList.remove('text-gray-600');
                    
                    // Show/hide pricing
                    if (period === 'monthly') {
                        monthlyPrices.forEach(el => el.classList.remove('hidden'));
                        annualPrices.forEach(el => el.classList.add('hidden'));
                        annualOnly.forEach(el => el.classList.add('hidden'));
                    } else {
                        monthlyPrices.forEach(el => el.classList.add('hidden'));
                        annualPrices.forEach(el => el.classList.remove('hidden'));
                        annualOnly.forEach(el => el.classList.remove('hidden'));
                    }
                });
            });
            
            // Comparison table toggle
            const comparisonToggle = document.querySelector('.comparison-toggle');
            const comparisonTable = document.querySelector('.comparison-table');
            
            if (comparisonToggle && comparisonTable) {
                comparisonToggle.addEventListener('click', function() {
                    comparisonTable.classList.toggle('hidden');
                    this.textContent = comparisonTable.classList.contains('hidden') 
                        ? 'Compare All Features' 
                        : 'Hide Comparison';
                });
            }
        });
        </script>
    <?php endif; ?>
</div> 