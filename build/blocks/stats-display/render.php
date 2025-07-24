<?php
/**
 * Stats Display Block - Enhanced Server-side render template
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
$layout = $attributes['layout'] ?? 'counter-animation';
$stats = isset($attributes['stats']) && is_array($attributes['stats']) ? $attributes['stats'] : [];
$columns = intval($attributes['columns'] ?? 4);
$show_icons = (bool) ($attributes['showIcons'] ?? true);
$show_descriptions = (bool) ($attributes['showDescriptions'] ?? true);
$enable_animations = (bool) ($attributes['enableAnimations'] ?? true);
$animation_trigger = $attributes['animationTrigger'] ?? 'scroll';
$number_size = $attributes['numberSize'] ?? 'large';
$alignment = $attributes['alignment'] ?? 'center';
$section_title = $attributes['sectionTitle'] ?? '';
$section_subtitle = $attributes['sectionSubtitle'] ?? '';
$show_section_header = (bool) ($attributes['showSectionHeader'] ?? false);
$highlighted_stat = $attributes['highlightedStat'] ?? '';
$card_style = $attributes['cardStyle'] ?? 'clean';

// Enhanced stats with real-time data integration
$enhanced_stats = [];
foreach ($stats as $stat) {
    // Ensure each stat is an array
    if (!is_array($stat)) {
        continue;
    }
    
    $enhanced_stat = $stat;
    
    // Check if this is a dynamic stat that should pull from real-time data
    $stat_id = $stat['id'] ?? '';
    
    switch ($stat_id) {
        case 'user-count':
        case 'total-users':
        case 'registered-users':
            $user_count = count_users();
            $enhanced_stat['number'] = number_format($user_count['total_users'] ?? 0);
            $enhanced_stat['realtime'] = true;
            break;
            
        case 'post-count':
        case 'total-posts':
        case 'published-posts':
            $post_count = wp_count_posts('post');
            $enhanced_stat['number'] = number_format($post_count->publish ?? 0);
            $enhanced_stat['realtime'] = true;
            break;
            
        case 'comment-count':
        case 'total-comments':
            $comment_count = wp_count_comments();
            $enhanced_stat['number'] = number_format($comment_count->approved ?? 0);
            $enhanced_stat['realtime'] = true;
            break;
            
        case 'page-views':
        case 'total-views':
            $page_views = get_option('site_total_views', 0);
            if ($page_views > 0) {
                $enhanced_stat['number'] = number_format($page_views);
                $enhanced_stat['realtime'] = true;
            }
            break;
            
        default:
            $enhanced_stat['realtime'] = false;
            break;
    }
    
    $enhanced_stats[] = $enhanced_stat;
}

// Handle empty stats
if (empty($enhanced_stats)) {
    echo '<div class="stats-display-block no-stats text-center py-8">';
    echo '<p class="text-gray-500">No statistics to display.</p>';
    echo '</div>';
    return;
}

// Prepare block wrapper with visual controls integration
$wrapper_data = prepare_block_wrapper($attributes, 'stats-display-block layout-' . esc_attr($layout) . ' text-' . esc_attr($alignment));

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
    case 5:
        $grid_classes .= 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
        break;
    default:
        $grid_classes .= 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
}

// Number size classes
$number_classes = 'stat-number font-bold ';
switch ($number_size) {
    case 'small':
        $number_classes .= 'text-2xl';
        break;
    case 'medium':
        $number_classes .= 'text-3xl md:text-4xl';
        break;
    case 'large':
        $number_classes .= 'text-4xl md:text-5xl lg:text-6xl';
        break;
    case 'xlarge':
        $number_classes .= 'text-5xl md:text-6xl lg:text-7xl';
        break;
    default:
        $number_classes .= 'text-4xl md:text-5xl lg:text-6xl';
}

?>

<div class="<?php echo esc_attr($wrapper_data['classes']); ?>" 
     <?php echo $wrapper_data['styles'] ? 'style="' . esc_attr($wrapper_data['styles']) . '"' : ''; ?>>
    
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-12">
            <?php if ($section_title): ?>
                <h2 class="section-title text-3xl font-bold mb-4">
                    <?php echo esc_html($section_title); ?>
                </h2>
            <?php endif; ?>
            <?php if ($section_subtitle): ?>
                <p class="section-subtitle text-gray-600 text-lg max-w-3xl mx-auto">
                    <?php echo esc_html($section_subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="stats-grid <?php echo esc_attr($grid_classes); ?>">
        <?php foreach ($enhanced_stats as $index => $stat): ?>
            <?php 
            $is_highlighted = ($highlighted_stat === ($stat['id'] ?? ''));
            $card_classes = 'stat-card transition-all duration-300 ';
            
            // Apply card styling
            switch ($card_style) {
                case 'elevated':
                    $card_classes .= 'bg-white rounded-lg shadow-lg hover:shadow-xl p-6';
                    break;
                case 'bordered':
                    $card_classes .= 'bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 p-6';
                    break;
                case 'minimal':
                    $card_classes .= 'p-6';
                    break;
                case 'gradient':
                    $card_classes .= 'bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md hover:shadow-lg p-6';
                    break;
                default:
                    $card_classes .= 'bg-white rounded-lg p-6';
            }
            
            if ($is_highlighted) {
                $card_classes .= ' ring-2 ring-blue-500 bg-blue-50 relative overflow-hidden';
            }
            
            // Apply color theme
            $color_theme = $stat['color'] ?? 'blue';
            $color_classes = [
                'blue' => 'text-blue-600',
                'green' => 'text-green-600',
                'purple' => 'text-purple-600',
                'red' => 'text-red-600',
                'orange' => 'text-orange-600',
                'gray' => 'text-gray-600'
            ];
            $stat_color_class = $color_classes[$color_theme] ?? $color_classes['blue'];
            ?>
            
            <div class="<?php echo esc_attr($card_classes); ?>" 
                 data-stat-id="<?php echo esc_attr($stat['id'] ?? ''); ?>"
                 data-realtime="<?php echo ($stat['realtime'] ?? false) ? 'true' : 'false'; ?>">
                
                <?php if ($is_highlighted): ?>
                    <div class="absolute top-0 right-0 w-16 h-16 opacity-10">
                        <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                <?php endif; ?>
                
                <?php if ($show_icons && !empty($stat['icon'])): ?>
                    <div class="stat-icon mb-4 flex justify-center">
                        <?php if (filter_var($stat['icon'], FILTER_VALIDATE_URL)): ?>
                            <img src="<?php echo esc_url($stat['icon']); ?>" 
                                 alt="<?php echo esc_attr($stat['label'] ?? ''); ?>" 
                                 class="w-12 h-12 object-contain">
                        <?php else: ?>
                            <div class="icon-emoji text-4xl <?php echo esc_attr($stat_color_class); ?>">
                                <?php echo esc_html($stat['icon']); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
                
                <div class="stat-content text-center">
                    <div class="<?php echo esc_attr($number_classes . ' ' . $stat_color_class); ?>">
                        <?php echo format_animated_number($stat, $enable_animations); ?>
                    </div>
                    
                    <div class="stat-label text-lg font-semibold text-gray-900 mt-2 mb-2">
                        <?php echo esc_html($stat['label'] ?? ''); ?>
                    </div>
                    
                    <?php if ($show_descriptions && !empty($stat['description'])): ?>
                        <div class="stat-description text-gray-600 text-sm leading-relaxed">
                            <?php echo esc_html($stat['description']); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (isset($stat['realtime']) && $stat['realtime']): ?>
                        <div class="realtime-indicator mt-3">
                            <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                <span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                                Live Data
                            </span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    
    <?php if ($enable_animations): ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const animateCounters = function() {
                const counters = document.querySelectorAll('[data-animate="true"]');
                
                const observerOptions = {
                    threshold: 0.5,
                    rootMargin: '0px 0px -100px 0px'
                };
                
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                            const target = parseFloat(entry.target.dataset.target);
                            const duration = parseInt(entry.target.dataset.duration) || 2000;
                            const numberElement = entry.target.querySelector('.animated-number-value');
                            
                            if (numberElement) {
                                animateValue(numberElement, 0, target, duration);
                                entry.target.classList.add('animated');
                            }
                        }
                    });
                }, observerOptions);
                
                counters.forEach(counter => {
                    observer.observe(counter);
                });
            };
            
            const animateValue = function(element, start, end, duration) {
                const startTime = performance.now();
                const originalText = element.textContent;
                const hasCommas = originalText.includes(',');
                
                const animate = function(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function (ease-out cubic)
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = start + (end - start) * easeOut;
                    
                    if (hasCommas) {
                        element.textContent = Math.floor(current).toLocaleString();
                    } else {
                        element.textContent = Math.floor(current);
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        element.textContent = originalText;
                    }
                };
                
                requestAnimationFrame(animate);
            };
            
            <?php if ($animation_trigger === 'scroll'): ?>
            animateCounters();
            <?php else: ?>
            setTimeout(animateCounters, 500);
            <?php endif; ?>
        });
        </script>
    <?php endif; ?>
</div>