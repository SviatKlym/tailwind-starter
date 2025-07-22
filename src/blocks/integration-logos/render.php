<?php
/**
 * Integration Logos Block - Server-side render template
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
$layout = $attributes['layout'] ?? 'simple-grid';
$logos = $attributes['logos'] ?? [];
$columns = $attributes['columns'] ?? 4;
$logo_size = $attributes['logoSize'] ?? 'medium';
$show_title = $attributes['showTitle'] ?? false;
$show_description = $attributes['showDescription'] ?? false;
$filter_by_category = $attributes['filterByCategory'] ?? false;
$enable_hover_effects = $attributes['enableHoverEffects'] ?? true;
$grayscale_mode = $attributes['grayscaleMode'] ?? 'default';
$link_behavior = $attributes['linkBehavior'] ?? 'new_tab';
$show_tooltip = $attributes['showTooltip'] ?? false;
$section_title = $attributes['sectionTitle'] ?? 'Our Partners & Integrations';
$section_subtitle = $attributes['sectionSubtitle'] ?? 'Trusted by leading companies worldwide';
$show_section_header = $attributes['showSectionHeader'] ?? true;
$enable_lazy_loading = $attributes['enableLazyLoading'] ?? true;
$settings = $attributes['settings'] ?? [];

// Dynamic logo enhancements
$enhanced_logos = [];
$categories = [];

// Process and enhance each logo
foreach ($logos as $logo) {
    $enhanced_logo = $logo;
    
    // Check for dynamic logo sources (e.g., from partnerships database)
    $logo_id = $logo['id'] ?? '';
    
    // Get dynamic data from database if available
    $dynamic_logo_data = get_option('partner_logo_' . $logo_id, null);
    if ($dynamic_logo_data) {
        $enhanced_logo = array_merge($enhanced_logo, $dynamic_logo_data);
        $enhanced_logo['dynamic'] = true;
    }
    
    // Optimize image URLs with CDN if available
    if (!empty($enhanced_logo['image'])) {
        $enhanced_logo['optimized_image'] = optimize_logo_url($enhanced_logo['image']);
        $enhanced_logo['webp_image'] = convert_to_webp($enhanced_logo['image']);
    }
    
    // Add category to categories list for filtering
    $category = $enhanced_logo['category'] ?? 'general';
    if (!in_array($category, $categories)) {
        $categories[] = $category;
    }
    
    // Check partnership status
    $partnership_status = get_partnership_status($logo_id);
    $enhanced_logo['partnership_status'] = $partnership_status;
    $enhanced_logo['is_active_partner'] = $partnership_status === 'active';
    
    // Add click tracking if needed
    if (!empty($enhanced_logo['link'])) {
        $enhanced_logo['tracked_link'] = add_tracking_params($enhanced_logo['link'], $logo_id);
    }
    
    // Generate proper alt text if missing
    if (empty($enhanced_logo['alt'])) {
        $enhanced_logo['alt'] = ($enhanced_logo['title'] ?? 'Partner') . ' logo';
    }
    
    $enhanced_logos[] = $enhanced_logo;
}

// Sort logos - active partners first, then by category
usort($enhanced_logos, function($a, $b) {
    $a_active = $a['is_active_partner'] ?? false;
    $b_active = $b['is_active_partner'] ?? false;
    
    if ($a_active && !$b_active) return -1;
    if (!$a_active && $b_active) return 1;
    
    return strcmp($a['category'] ?? '', $b['category'] ?? '');
});

// Helper functions
function optimize_logo_url($image_url) {
    // This would integrate with a CDN service
    $cdn_base = get_option('logo_cdn_base', '');
    if ($cdn_base && strpos($image_url, 'http') === 0) {
        // Convert to CDN URL with optimization parameters
        return $cdn_base . '?url=' . urlencode($image_url) . '&w=200&h=100&f=auto&q=80';
    }
    return $image_url;
}

function convert_to_webp($image_url) {
    // This would convert images to WebP format
    if (strpos($image_url, '.webp') !== false) {
        return $image_url;
    }
    return str_replace(['.jpg', '.jpeg', '.png'], '.webp', $image_url);
}

function get_partnership_status($logo_id) {
    // This would check a partnerships database
    $partnership_statuses = get_option('partnership_statuses', []);
    return $partnership_statuses[$logo_id] ?? 'inactive';
}

function add_tracking_params($url, $logo_id) {
    // Add UTM parameters for analytics
    $separator = strpos($url, '?') !== false ? '&' : '?';
    return $url . $separator . 'utm_source=website&utm_medium=logo&utm_campaign=partnerships&logo_id=' . $logo_id;
}

// Handle empty logos
if (empty($enhanced_logos)) {
    echo '<div class="integration-logos-block no-logos text-center py-8">';
    echo '<p class="text-gray-500">No partner logos to display.</p>';
    echo '</div>';
    return;
}

// Generate CSS classes from settings
$wrapper_classes = ['integration-logos-block', 'layout-' . esc_attr($layout)];
if (isset($settings['backgroundColor'])) {
    $wrapper_classes[] = esc_attr($settings['backgroundColor']);
}
if (isset($settings['textColor'])) {
    $wrapper_classes[] = esc_attr($settings['textColor']);
}

// Determine grid columns classes
$grid_classes = 'grid gap-8 items-center ';
switch ($columns) {
    case 2:
        $grid_classes .= 'grid-cols-2';
        break;
    case 3:
        $grid_classes .= 'grid-cols-2 md:grid-cols-3';
        break;
    case 4:
        $grid_classes .= 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
        break;
    case 5:
        $grid_classes .= 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
        break;
    case 6:
        $grid_classes .= 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
        break;
    default:
        $grid_classes .= 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
}

// Logo size classes
$size_classes = '';
switch ($logo_size) {
    case 'small':
        $size_classes = 'h-8 max-w-24';
        break;
    case 'medium':
        $size_classes = 'h-12 max-w-32';
        break;
    case 'large':
        $size_classes = 'h-16 max-w-40';
        break;
    case 'xlarge':
        $size_classes = 'h-20 max-w-48';
        break;
    default:
        $size_classes = 'h-12 max-w-32';
}

// Grayscale classes
$grayscale_classes = '';
switch ($grayscale_mode) {
    case 'always':
        $grayscale_classes = 'filter grayscale';
        break;
    case 'hover':
        $grayscale_classes = 'filter grayscale hover:grayscale-0 transition-all duration-300';
        break;
    case 'never':
        $grayscale_classes = '';
        break;
    default:
        $grayscale_classes = 'filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300';
}
?>

<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>">
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-12">
            <?php if ($section_title): ?>
                <h2 class="section-title text-2xl md:text-3xl font-bold mb-4">
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
    
    <?php if ($filter_by_category && count($categories) > 1): ?>
        <div class="category-filters flex justify-center mb-8">
            <div class="filter-buttons flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                <button class="filter-btn active px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm transition-all duration-200" 
                        data-category="all">
                    All
                </button>
                <?php foreach ($categories as $category): ?>
                    <button class="filter-btn px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200" 
                            data-category="<?php echo esc_attr($category); ?>">
                        <?php echo esc_html(ucwords(str_replace('_', ' ', $category))); ?>
                    </button>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>
    
    <div class="logos-grid <?php echo esc_attr($grid_classes); ?>">
        <?php foreach ($enhanced_logos as $logo): ?>
            <?php
            $logo_classes = 'logo-item flex items-center justify-center p-4 ';
            if ($enable_hover_effects) {
                $logo_classes .= 'hover:scale-105 transition-transform duration-300 ';
            }
            
            $has_link = !empty($logo['link']);
            $link_url = $has_link ? ($logo['tracked_link'] ?? $logo['link']) : '#';
            $link_target = ($link_behavior === 'new_tab') ? '_blank' : '_self';
            $link_rel = ($link_behavior === 'new_tab') ? 'noopener noreferrer' : '';
            
            $is_active_partner = $logo['is_active_partner'] ?? false;
            ?>
            
            <div class="<?php echo esc_attr($logo_classes); ?>" 
                 data-category="<?php echo esc_attr($logo['category'] ?? 'general'); ?>"
                 data-partner-status="<?php echo esc_attr($logo['partnership_status'] ?? 'inactive'); ?>"
                 <?php if ($show_tooltip && !empty($logo['title'])): ?>
                     title="<?php echo esc_attr($logo['title']); ?>"
                 <?php endif; ?>>
                
                <?php if ($is_active_partner): ?>
                    <div class="active-partner-indicator absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                <?php endif; ?>
                
                <?php if ($has_link): ?>
                    <a href="<?php echo esc_url($link_url); ?>" 
                       target="<?php echo esc_attr($link_target); ?>"
                       <?php if ($link_rel): ?>rel="<?php echo esc_attr($link_rel); ?>"<?php endif; ?>
                       class="logo-link block w-full h-full flex items-center justify-center"
                       onclick="trackLogoClick('<?php echo esc_js($logo['id'] ?? ''); ?>', '<?php echo esc_js($logo['title'] ?? ''); ?>')">
                <?php endif; ?>
                
                <?php if (!empty($logo['image'])): ?>
                    <picture class="logo-picture">
                        <!-- WebP version for modern browsers -->
                        <?php if (!empty($logo['webp_image'])): ?>
                            <source srcset="<?php echo esc_url($logo['webp_image']); ?>" type="image/webp">
                        <?php endif; ?>
                        
                        <!-- Fallback image -->
                        <img src="<?php echo esc_url($logo['optimized_image'] ?? $logo['image']); ?>" 
                             alt="<?php echo esc_attr($logo['alt'] ?? ''); ?>"
                             class="logo-image <?php echo esc_attr($size_classes . ' ' . $grayscale_classes); ?> object-contain"
                             <?php if ($enable_lazy_loading): ?>loading="lazy"<?php endif; ?>
                             <?php if (!empty($logo['title'])): ?>title="<?php echo esc_attr($logo['title']); ?>"<?php endif; ?>>
                    </picture>
                <?php else: ?>
                    <!-- Fallback for missing images -->
                    <div class="logo-placeholder <?php echo esc_attr($size_classes); ?> bg-gray-200 rounded flex items-center justify-center">
                        <span class="text-gray-500 text-sm font-medium">
                            <?php echo esc_html($logo['title'] ?? 'Logo'); ?>
                        </span>
                    </div>
                <?php endif; ?>
                
                <?php if ($has_link): ?>
                    </a>
                <?php endif; ?>
                
                <?php if ($show_title && !empty($logo['title'])): ?>
                    <div class="logo-title text-center mt-2 text-sm font-medium text-gray-700">
                        <?php echo esc_html($logo['title']); ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($show_description && !empty($logo['description'])): ?>
                    <div class="logo-description text-center mt-1 text-xs text-gray-500">
                        <?php echo esc_html($logo['description']); ?>
                    </div>
                <?php endif; ?>
                
                <?php if (isset($logo['dynamic']) && $logo['dynamic']): ?>
                    <div class="dynamic-indicator absolute bottom-1 right-1">
                        <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Dynamic content"></span>
                    </div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
    
    <?php if ($filter_by_category): ?>
        <div class="filter-empty-state text-center py-8 hidden">
            <div class="text-gray-400 text-lg mb-2">🔍</div>
            <p class="text-gray-500">No logos found in this category.</p>
        </div>
    <?php endif; ?>
    
    <script>
    // Logo click tracking
    function trackLogoClick(logoId, logoTitle) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'logo_click', {
                'logo_id': logoId,
                'logo_title': logoTitle,
                'event_category': 'partnerships'
            });
        }
        
        // Custom tracking
        if (typeof trackCustomEvent !== 'undefined') {
            trackCustomEvent('logo_click', {
                logo_id: logoId,
                logo_title: logoTitle
            });
        }
    }
    
    <?php if ($filter_by_category && count($categories) > 1): ?>
    // Category filtering functionality
    document.addEventListener('DOMContentLoaded', function() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const logoItems = document.querySelectorAll('.logo-item');
        const emptyState = document.querySelector('.filter-empty-state');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // Update active button
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-white', 'shadow-sm');
                    b.classList.add('text-gray-600');
                });
                this.classList.add('active', 'bg-white', 'shadow-sm');
                this.classList.remove('text-gray-600');
                
                // Filter logos
                let visibleCount = 0;
                logoItems.forEach(item => {
                    const itemCategory = item.dataset.category;
                    const shouldShow = category === 'all' || itemCategory === category;
                    
                    if (shouldShow) {
                        item.style.display = 'flex';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Show/hide empty state
                if (emptyState) {
                    if (visibleCount === 0) {
                        emptyState.classList.remove('hidden');
                    } else {
                        emptyState.classList.add('hidden');
                    }
                }
            });
        });
    });
    <?php endif; ?>
    </script>
</div> 