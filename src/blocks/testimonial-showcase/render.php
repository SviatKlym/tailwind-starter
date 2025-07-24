<?php
/**
 * Testimonial Showcase Block - Enhanced Server-side render template
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
$layout = $attributes['layout'] ?? 'grid';
$testimonials = isset($attributes['testimonials']) && is_array($attributes['testimonials']) ? $attributes['testimonials'] : [];
$columns = intval($attributes['columns'] ?? 3);
$show_ratings = (bool) ($attributes['showRatings'] ?? true);
$show_author_images = (bool) ($attributes['showAuthorImages'] ?? true);
$show_company = (bool) ($attributes['showCompany'] ?? true);
$show_location = (bool) ($attributes['showLocation'] ?? false);
$show_date = (bool) ($attributes['showDate'] ?? false);
$show_verified_badge = (bool) ($attributes['showVerifiedBadge'] ?? false);
$card_style = $attributes['cardStyle'] ?? 'clean';
$quote_style = $attributes['quoteStyle'] ?? 'standard';
$rating_style = $attributes['ratingStyle'] ?? 'stars';
$text_alignment = $attributes['textAlignment'] ?? 'left';
$section_title = $attributes['sectionTitle'] ?? '';
$section_subtitle = $attributes['sectionSubtitle'] ?? '';
$show_section_header = (bool) ($attributes['showSectionHeader'] ?? false);
$auto_rotate = (bool) ($attributes['autoRotate'] ?? false);
$rotation_speed = intval($attributes['rotationSpeed'] ?? 5000);

// Prepare block wrapper with visual controls integration
$wrapper_data = prepare_block_wrapper($attributes, 'testimonial-showcase-block');

// Handle empty testimonials
if (empty($testimonials)) {
    echo '<div class="' . esc_attr($wrapper_data['classes']) . ' no-testimonials text-center py-8">';
    echo '<p class="opacity-75">No testimonials to display.</p>';
    echo '</div>';
    return;
}

// Update wrapper classes
$wrapper_data['classes'] .= ' layout-' . esc_attr($layout) . ' text-' . esc_attr($text_alignment);

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

<div class="<?php echo esc_attr($wrapper_data['classes']); ?>" 
     <?php echo $wrapper_data['styles'] ? 'style="' . esc_attr($wrapper_data['styles']) . '"' : ''; ?>
     <?php echo $auto_rotate ? 'data-auto-rotate="true" data-rotation-speed="' . esc_attr($rotation_speed) . '"' : ''; ?>>
    
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-12">
            <?php if ($section_title): ?>
                <h2 class="section-title text-3xl font-bold mb-4">
                    <?php echo esc_html($section_title); ?>
                </h2>
            <?php endif; ?>
            <?php if ($section_subtitle): ?>
                <p class="section-subtitle text-lg max-w-3xl mx-auto opacity-75">
                    <?php echo esc_html($section_subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="testimonials-grid <?php echo esc_attr($grid_classes); ?>">
        <?php foreach ($testimonials as $index => $testimonial): ?>
            <?php 
            // Ensure each testimonial is an array
            if (!is_array($testimonial)) {
                continue;
            }
            
            $card_classes = 'testimonial-card transition-all duration-300 ';
            
            // Apply card styling
            switch ($card_style) {
                case 'elevated':
                    $card_classes .= 'testimonial-card-elevated rounded-lg shadow-lg hover:shadow-xl p-6';
                    break;
                case 'bordered':
                    $card_classes .= 'testimonial-card-bordered rounded-lg border-2 p-6';
                    break;
                case 'minimal':
                    $card_classes .= 'p-6';
                    break;
                case 'gradient':
                    $card_classes .= 'testimonial-card-gradient rounded-lg shadow-md hover:shadow-lg p-6';
                    break;
                default:
                    $card_classes .= 'rounded-lg shadow-md hover:shadow-lg p-6';
            }
            
            $testimonial_id = $testimonial['id'] ?? 'testimonial-' . $index;
            $rating = intval($testimonial['rating'] ?? 5);
            $is_featured = (bool) ($testimonial['featured'] ?? false);
            $is_verified = (bool) ($testimonial['verified'] ?? false);
            
            if ($is_featured) {
                $card_classes .= ' featured-badge ring-2 relative';
            }
            ?>
            
            <div class="<?php echo esc_attr($card_classes); ?>" 
                 data-testimonial-id="<?php echo esc_attr($testimonial_id); ?>">
                
                <?php if ($is_featured): ?>
                    <div class="absolute -top-2 -right-2">
                        <span class="featured-badge inline-flex items-center px-2 py-1 text-xs font-bold rounded-full">
                            ⭐ Featured
                        </span>
                    </div>
                <?php endif; ?>
                
                <?php if ($show_ratings && $rating > 0): ?>
                    <div class="testimonial-rating mb-4">
                        <?php echo render_star_rating($rating); ?>
                    </div>
                <?php endif; ?>
                
                <div class="testimonial-content mb-6">
                    <?php if ($quote_style === 'blockquote'): ?>
                        <blockquote class="text-lg italic leading-relaxed opacity-85">
                            "<?php echo esc_html($testimonial['content'] ?? ''); ?>"
                        </blockquote>
                    <?php else: ?>
                        <div class="text-lg leading-relaxed opacity-85">
                            "<?php echo esc_html($testimonial['content'] ?? ''); ?>"
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="testimonial-author flex items-center">
                    <?php if ($show_author_images && !empty($testimonial['authorImage']) && is_array($testimonial['authorImage'])): ?>
                        <div class="author-image mr-4">
                            <img src="<?php echo esc_url($testimonial['authorImage']['url'] ?? ''); ?>" 
                                 alt="<?php echo esc_attr($testimonial['authorName'] ?? ''); ?>" 
                                 class="w-12 h-12 rounded-full object-cover">
                        </div>
                    <?php endif; ?>
                    
                    <div class="author-details">
                        <div class="author-name font-semibold flex items-center">
                            <?php echo esc_html($testimonial['authorName'] ?? ''); ?>
                            <?php if ($show_verified_badge && $is_verified): ?>
                                <span class="ml-2" title="Verified Customer" style="color: currentColor; opacity: 0.8;">
                                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </span>
                            <?php endif; ?>
                        </div>
                        
                        <?php if ($show_company && !empty($testimonial['company'])): ?>
                            <div class="author-company text-sm opacity-75">
                                <?php echo esc_html($testimonial['company']); ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($show_location && !empty($testimonial['location'])): ?>
                            <div class="author-location text-sm opacity-60">
                                📍 <?php echo esc_html($testimonial['location']); ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($show_date && !empty($testimonial['date'])): ?>
                            <div class="testimonial-date text-sm opacity-60">
                                <?php echo esc_html(date('M j, Y', strtotime($testimonial['date']))); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    
    <?php if ($auto_rotate): ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.querySelector('[data-auto-rotate="true"]');
            if (!container) return;
            
            const testimonials = container.querySelectorAll('.testimonial-card');
            const rotationSpeed = parseInt(container.dataset.rotationSpeed) || 5000;
            let currentIndex = 0;
            
            // Auto-rotation for testimonials
            const rotateTestimonials = function() {
                testimonials.forEach((testimonial, index) => {
                    if (index === currentIndex) {
                        testimonial.style.opacity = '1';
                        testimonial.style.transform = 'scale(1.02)';
                    } else {
                        testimonial.style.opacity = '0.7';
                        testimonial.style.transform = 'scale(1)';
                    }
                });
                
                currentIndex = (currentIndex + 1) % testimonials.length;
                setTimeout(rotateTestimonials, rotationSpeed);
            };
            
            setTimeout(rotateTestimonials, 1000);
        });
        </script>
    <?php endif; ?>
</div>