<?php
/**
 * Testimonial Showcase Block - Server-side render template
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

// Helper function to render star rating
if (!function_exists('render_star_rating')) {
    function render_star_rating($rating, $max_rating = 5) {
        $output = '<div class="star-rating flex items-center">';
        for ($i = 1; $i <= $max_rating; $i++) {
            if ($i <= $rating) {
                $output .= '<svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">';
                $output .= '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
                $output .= '</svg>';
            } else {
                $output .= '<svg class="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">';
                $output .= '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
                $output .= '</svg>';
            }
        }
        $output .= '</div>';
        return $output;
    }
}

// Extract and set default values
$layout = $attributes['layout'] ?? 'cards-grid';
$testimonials = $attributes['testimonials'] ?? [];
$columns = $attributes['columns'] ?? 3;
$show_ratings = $attributes['showRatings'] ?? true;
$show_company = $attributes['showCompany'] ?? true;
$show_avatars = $attributes['showAvatars'] ?? true;
$show_quotes = $attributes['showQuotes'] ?? true;
$animation_type = $attributes['animationType'] ?? 'fade';
$section_title = $attributes['sectionTitle'] ?? 'What Our Customers Say';
$section_subtitle = $attributes['sectionSubtitle'] ?? 'Trusted by thousands of satisfied customers worldwide';
$show_section_header = $attributes['showSectionHeader'] ?? true;
$settings = $attributes['settings'] ?? [];

// Future enhancement: Check if we should fetch testimonials from database
// For now, we'll use the static testimonials from attributes
// In future versions, this could integrate with custom post types or external APIs

// Handle empty testimonials
if (empty($testimonials)) {
    echo '<div class="testimonial-showcase-block no-testimonials text-center py-8">';
    echo '<p class="text-gray-500">No testimonials available.</p>';
    echo '</div>';
    return;
}

// Generate CSS classes from settings
$wrapper_classes = ['testimonial-showcase-block', 'layout-' . esc_attr($layout)];
if (isset($settings['backgroundColor'])) {
    $wrapper_classes[] = esc_attr($settings['backgroundColor']);
}
if (isset($settings['textColor'])) {
    $wrapper_classes[] = esc_attr($settings['textColor']);
}

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

<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>">
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-12">
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
    
    <?php if ($layout === 'cards-grid'): ?>
        <div class="testimonials-grid <?php echo esc_attr($grid_classes); ?>">
            <?php foreach ($testimonials as $testimonial): ?>
                <div class="testimonial-card bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <?php if ($show_quotes): ?>
                        <div class="quote-icon mb-4">
                            <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35L8.945 4.5c-.214.146-.428.2-.642.28-.213.117-.393.231-.6.313-.744.351-1.174.834-1.501 1.371-.164.283-.258.746-.421 1.07-.108.215-.177.344-.277.572-.197.45-.299.884-.299 1.394zm7 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35L15.945 4.5c-.214.146-.428.2-.642.28-.213.117-.393.231-.6.313-.744.351-1.174.834-1.501 1.371-.164.283-.258.746-.421 1.07-.108.215-.177.344-.277.572-.197.45-.299.884-.299 1.394z"/>
                            </svg>
                        </div>
                    <?php endif; ?>
                    
                    <div class="testimonial-content mb-6">
                        <p class="text-gray-700 leading-relaxed">
                            <?php echo esc_html($testimonial['content'] ?? ''); ?>
                        </p>
                    </div>
                    
                    <?php if ($show_ratings && isset($testimonial['rating'])): ?>
                        <div class="testimonial-rating mb-4">
                            <?php echo render_star_rating($testimonial['rating']); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="testimonial-author flex items-center">
                        <?php if ($show_avatars && !empty($testimonial['avatar'])): ?>
                            <div class="author-avatar mr-4">
                                <img src="<?php echo esc_url($testimonial['avatar']); ?>" 
                                     alt="<?php echo esc_attr($testimonial['authorName'] ?? ''); ?>"
                                     class="w-12 h-12 rounded-full object-cover">
                            </div>
                        <?php else: ?>
                            <div class="author-avatar-placeholder mr-4">
                                <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </div>
                            </div>
                        <?php endif; ?>
                        
                        <div class="author-info">
                            <div class="author-name font-semibold text-gray-900">
                                <?php echo esc_html($testimonial['authorName'] ?? ''); ?>
                            </div>
                            <?php if ($show_company && (!empty($testimonial['authorTitle']) || !empty($testimonial['authorCompany']))): ?>
                                <div class="author-details text-sm text-gray-500">
                                    <?php if (!empty($testimonial['authorTitle'])): ?>
                                        <?php echo esc_html($testimonial['authorTitle']); ?>
                                        <?php if (!empty($testimonial['authorCompany'])): ?>
                                            at 
                                        <?php endif; ?>
                                    <?php endif; ?>
                                    <?php if (!empty($testimonial['authorCompany'])): ?>
                                        <?php echo esc_html($testimonial['authorCompany']); ?>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
    <?php elseif ($layout === 'testimonial-carousel'): ?>
        <!-- Carousel layout - could be enhanced with JavaScript for functionality -->
        <div class="testimonials-carousel relative">
            <div class="carousel-container overflow-hidden">
                <div class="carousel-track flex transition-transform duration-500">
                    <?php foreach ($testimonials as $index => $testimonial): ?>
                        <div class="carousel-slide flex-none w-full <?php echo $index === 0 ? 'active' : ''; ?>">
                            <div class="testimonial-card text-center max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
                                <?php if ($show_quotes): ?>
                                    <div class="quote-icon mb-6">
                                        <svg class="w-12 h-12 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35L8.945 4.5c-.214.146-.428.2-.642.28-.213.117-.393.231-.6.313-.744.351-1.174.834-1.501 1.371-.164.283-.258.746-.421 1.07-.108.215-.177.344-.277.572-.197.45-.299.884-.299 1.394zm7 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35L15.945 4.5c-.214.146-.428.2-.642.28-.213.117-.393.231-.6.313-.744.351-1.174.834-1.501 1.371-.164.283-.258.746-.421 1.07-.108.215-.177.344-.277.572-.197.45-.299.884-.299 1.394z"/>
                                        </svg>
                                    </div>
                                <?php endif; ?>
                                
                                <blockquote class="text-xl text-gray-700 leading-relaxed mb-6">
                                    "<?php echo esc_html($testimonial['content'] ?? ''); ?>"
                                </blockquote>
                                
                                <?php if ($show_ratings && isset($testimonial['rating'])): ?>
                                    <div class="testimonial-rating mb-6 flex justify-center">
                                        <?php echo render_star_rating($testimonial['rating']); ?>
                                    </div>
                                <?php endif; ?>
                                
                                <div class="testimonial-author">
                                    <?php if ($show_avatars && !empty($testimonial['avatar'])): ?>
                                        <img src="<?php echo esc_url($testimonial['avatar']); ?>" 
                                             alt="<?php echo esc_attr($testimonial['authorName'] ?? ''); ?>"
                                             class="w-16 h-16 rounded-full mx-auto mb-4 object-cover">
                                    <?php endif; ?>
                                    
                                    <div class="author-name font-semibold text-gray-900 text-lg">
                                        <?php echo esc_html($testimonial['authorName'] ?? ''); ?>
                                    </div>
                                    <?php if ($show_company && (!empty($testimonial['authorTitle']) || !empty($testimonial['authorCompany']))): ?>
                                        <div class="author-details text-gray-500">
                                            <?php if (!empty($testimonial['authorTitle'])): ?>
                                                <?php echo esc_html($testimonial['authorTitle']); ?>
                                                <?php if (!empty($testimonial['authorCompany'])): ?>
                                                    at 
                                                <?php endif; ?>
                                            <?php endif; ?>
                                            <?php if (!empty($testimonial['authorCompany'])): ?>
                                                <?php echo esc_html($testimonial['authorCompany']); ?>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- Carousel controls - requires JavaScript for functionality -->
            <button class="carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>
            <button class="carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    <?php endif; ?>
</div>