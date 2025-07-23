<?php
/**
 * Social Proof Block - Server-side render template
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
if (!function_exists('render_social_proof_stars')) {
    function render_social_proof_stars($rating, $max_rating = 5) {
        $output = '<div class="star-rating flex items-center justify-center">';
        for ($i = 1; $i <= $max_rating; $i++) {
            if ($i <= $rating) {
                $output .= '<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">';
                $output .= '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
                $output .= '</svg>';
            } else {
                $output .= '<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">';
                $output .= '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
                $output .= '</svg>';
            }
        }
        $output .= '</div>';
        return $output;
    }
}

// Helper function to render trust indicator
if (!function_exists('render_trust_indicator')) {
    function render_trust_indicator($indicator) {
        $output = '<div class="trust-indicator text-center p-4">';
        
        if (!empty($indicator['icon'])) {
            $output .= '<div class="indicator-icon text-2xl mb-2">' . esc_html($indicator['icon']) . '</div>';
        }
        
        $output .= '<div class="indicator-count text-xl font-bold text-blue-600 mb-1">';
        $output .= esc_html($indicator['count'] ?? '0');
        $output .= '</div>';
        
        $output .= '<div class="indicator-label text-sm text-gray-600">';
        $output .= esc_html($indicator['label'] ?? '');
        $output .= '</div>';
        
        if (isset($indicator['dynamic']) && $indicator['dynamic']) {
            $output .= '<div class="dynamic-indicator mt-1">';
            $output .= '<span class="inline-flex items-center px-1 py-0.5 text-xs bg-green-100 text-green-800 rounded">';
            $output .= '<span class="w-1 h-1 bg-green-400 rounded-full mr-1 animate-pulse"></span>Live';
            $output .= '</span></div>';
        }
        
        $output .= '</div>';
        return $output;
    }
}

// Extract and set default values
$layout = $attributes['layout'] ?? 'testimonial-carousel';
$testimonials = $attributes['testimonials'] ?? [];
$show_ratings = $attributes['showRatings'] ?? true;
$show_company_logos = $attributes['showCompanyLogos'] ?? true;
$show_verified_badges = $attributes['showVerifiedBadges'] ?? true;
$enable_social_links = $attributes['enableSocialLinks'] ?? true;
$auto_rotate = $attributes['autoRotate'] ?? true;
$rotation_speed = $attributes['rotationSpeed'] ?? 5000;
$trust_indicators = $attributes['trustIndicators'] ?? [];
$social_media_count = $attributes['socialMediaCount'] ?? [];
$review_aggregation = $attributes['reviewAggregation'] ?? [];
$section_title = $attributes['sectionTitle'] ?? 'Trusted by Thousands';
$section_subtitle = $attributes['sectionSubtitle'] ?? 'Join our growing community of satisfied customers';
$show_section_header = $attributes['showSectionHeader'] ?? true;
$settings = $attributes['settings'] ?? [];

// Enhanced social proof with dynamic data sources
$enhanced_testimonials = [];
$social_stats = [];
$trust_stats = [];

// Aggregate testimonials from multiple sources
foreach ($testimonials as $testimonial) {
    $enhanced_testimonial = $testimonial;
    
    // Check for dynamic testimonial sources
    $source = $testimonial['source'] ?? 'manual';
    
    switch ($source) {
        case 'google_reviews':
            // Future: Integrate with Google My Business API
            $enhanced_testimonial['platform'] = 'Google';
            $enhanced_testimonial['platform_icon'] = '🔍';
            break;
            
        case 'facebook_reviews':
            // Future: Integrate with Facebook Graph API
            $enhanced_testimonial['platform'] = 'Facebook';
            $enhanced_testimonial['platform_icon'] = '📘';
            break;
            
        case 'twitter_mentions':
            // Future: Integrate with Twitter API
            $enhanced_testimonial['platform'] = 'Twitter';
            $enhanced_testimonial['platform_icon'] = '🐦';
            break;
            
        case 'wordpress_comments':
            // Get recent positive comments from WordPress
            $enhanced_testimonial['platform'] = 'Website';
            $enhanced_testimonial['platform_icon'] = '💬';
            break;
            
        default:
            $enhanced_testimonial['platform'] = 'Customer';
            $enhanced_testimonial['platform_icon'] = '⭐';
            break;
    }
    
    $enhanced_testimonials[] = $enhanced_testimonial;
}

// Get dynamic social media statistics
$social_stats = [
    'followers' => get_option('social_followers_count', 0),
    'reviews' => get_option('total_reviews_count', 0),
    'customers' => get_option('total_customers_count', 0),
    'satisfaction' => get_option('customer_satisfaction_rate', 0)
];

// Get dynamic trust indicators
$trust_indicators_dynamic = [
    'users_count' => wp_count_posts('user')->publish ?? 0,
    'posts_count' => wp_count_posts('post')->publish ?? 0,
    'comments_count' => wp_count_comments()->approved ?? 0,
    'newsletter_subscribers' => count(get_option('newsletter_subscribers', []))
];

// Merge dynamic data with static trust indicators
foreach ($trust_indicators as &$indicator) {
    $indicator_id = $indicator['id'] ?? '';
    
    switch ($indicator_id) {
        case 'total_users':
            $indicator['count'] = number_format($trust_indicators_dynamic['users_count']);
            $indicator['dynamic'] = true;
            break;
        case 'happy_customers':
            $indicator['count'] = number_format($social_stats['customers']);
            $indicator['dynamic'] = true;
            break;
        case 'total_reviews':
            $indicator['count'] = number_format($social_stats['reviews']);
            $indicator['dynamic'] = true;
            break;
        case 'newsletter_subs':
            $indicator['count'] = number_format($trust_indicators_dynamic['newsletter_subscribers']);
            $indicator['dynamic'] = true;
            break;
    }
}

// Handle empty content
if (empty($enhanced_testimonials) && empty($trust_indicators)) {
    echo '<div class="social-proof-block no-content text-center py-8">';
    echo '<p class="text-gray-500">No social proof content to display.</p>';
    echo '</div>';
    return;
}

// Generate CSS classes from settings
$wrapper_classes = ['social-proof-block', 'layout-' . esc_attr($layout)];
if (isset($settings['backgroundColor'])) {
    $wrapper_classes[] = esc_attr($settings['backgroundColor']);
}
if (isset($settings['textColor'])) {
    $wrapper_classes[] = esc_attr($settings['textColor']);
}
?>

<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>">
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-8">
            <?php if ($section_title): ?>
                <h2 class="section-title text-2xl md:text-3xl font-bold mb-3">
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
    
    <?php if ($layout === 'testimonial-carousel' && !empty($enhanced_testimonials)): ?>
        <div class="testimonials-carousel relative mb-8" data-auto-rotate="<?php echo $auto_rotate ? 'true' : 'false'; ?>" data-rotation-speed="<?php echo esc_attr($rotation_speed); ?>">
            <div class="carousel-container overflow-hidden">
                <div class="carousel-track flex transition-transform duration-500">
                    <?php foreach ($enhanced_testimonials as $index => $testimonial): ?>
                        <div class="carousel-slide flex-none w-full <?php echo $index === 0 ? 'active' : ''; ?>">
                            <div class="testimonial-card bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                                <?php if ($show_ratings && isset($testimonial['rating'])): ?>
                                    <div class="testimonial-rating mb-4">
                                        <?php echo render_social_proof_stars($testimonial['rating']); ?>
                                    </div>
                                <?php endif; ?>
                                
                                <blockquote class="testimonial-content text-lg text-gray-700 leading-relaxed mb-6 text-center">
                                    "<?php echo esc_html($testimonial['content'] ?? ''); ?>"
                                </blockquote>
                                
                                <div class="testimonial-author flex items-center justify-center">
                                    <?php if (!empty($testimonial['avatar'])): ?>
                                        <img src="<?php echo esc_url($testimonial['avatar']); ?>" 
                                             alt="<?php echo esc_attr($testimonial['name'] ?? ''); ?>"
                                             class="w-12 h-12 rounded-full mr-4 object-cover">
                                    <?php endif; ?>
                                    
                                    <div class="author-info text-center">
                                        <div class="author-name font-semibold text-gray-900">
                                            <?php echo esc_html($testimonial['name'] ?? ''); ?>
                                        </div>
                                        <div class="author-details text-sm text-gray-600">
                                            <?php if (!empty($testimonial['position'])): ?>
                                                <?php echo esc_html($testimonial['position']); ?>
                                                <?php if (!empty($testimonial['company'])): ?>
                                                    at <?php echo esc_html($testimonial['company']); ?>
                                                <?php endif; ?>
                                            <?php endif; ?>
                                        </div>
                                        
                                        <?php if (!empty($testimonial['platform'])): ?>
                                            <div class="platform-info text-xs text-gray-500 mt-1 flex items-center justify-center">
                                                <span class="mr-1"><?php echo $testimonial['platform_icon']; ?></span>
                                                via <?php echo esc_html($testimonial['platform']); ?>
                                            </div>
                                        <?php endif; ?>
                                        
                                        <?php if ($show_verified_badges && ($testimonial['verified'] ?? false)): ?>
                                            <div class="verified-badge mt-2">
                                                <span class="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                                    </svg>
                                                    Verified Customer
                                                </span>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <?php if (count($enhanced_testimonials) > 1): ?>
                <button class="carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <button class="carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                
                <div class="carousel-indicators flex justify-center mt-6 space-x-2">
                    <?php foreach ($enhanced_testimonials as $index => $testimonial): ?>
                        <button class="indicator w-2 h-2 rounded-full <?php echo $index === 0 ? 'bg-blue-500' : 'bg-gray-300'; ?>" 
                                data-slide="<?php echo $index; ?>"></button>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
        
    <?php elseif ($layout === 'trust-indicators' && !empty($trust_indicators)): ?>
        <div class="trust-indicators grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <?php foreach ($trust_indicators as $indicator): ?>
                <?php echo render_trust_indicator($indicator); ?>
            <?php endforeach; ?>
        </div>
        
    <?php elseif ($layout === 'combined' && (!empty($enhanced_testimonials) || !empty($trust_indicators))): ?>
        <!-- Trust indicators first -->
        <?php if (!empty($trust_indicators)): ?>
            <div class="trust-indicators grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <?php foreach ($trust_indicators as $indicator): ?>
                    <?php echo render_trust_indicator($indicator); ?>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <!-- Featured testimonial -->
        <?php if (!empty($enhanced_testimonials)): ?>
            <div class="featured-testimonial">
                <?php $featured_testimonial = $enhanced_testimonials[0]; ?>
                <div class="testimonial-card bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto">
                    <?php if ($show_ratings && isset($featured_testimonial['rating'])): ?>
                        <div class="testimonial-rating mb-6 flex justify-center">
                            <?php echo render_social_proof_stars($featured_testimonial['rating']); ?>
                        </div>
                    <?php endif; ?>
                    
                    <blockquote class="testimonial-content text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 text-center">
                        "<?php echo esc_html($featured_testimonial['content'] ?? ''); ?>"
                    </blockquote>
                    
                    <div class="testimonial-author flex items-center justify-center">
                        <?php if (!empty($featured_testimonial['avatar'])): ?>
                            <img src="<?php echo esc_url($featured_testimonial['avatar']); ?>" 
                                 alt="<?php echo esc_attr($featured_testimonial['name'] ?? ''); ?>"
                                 class="w-16 h-16 rounded-full mr-6 object-cover">
                        <?php endif; ?>
                        
                        <div class="author-info">
                            <div class="author-name text-lg font-semibold text-gray-900">
                                <?php echo esc_html($featured_testimonial['name'] ?? ''); ?>
                            </div>
                            <div class="author-details text-gray-600">
                                <?php if (!empty($featured_testimonial['position'])): ?>
                                    <?php echo esc_html($featured_testimonial['position']); ?>
                                    <?php if (!empty($featured_testimonial['company'])): ?>
                                        at <?php echo esc_html($featured_testimonial['company']); ?>
                                    <?php endif; ?>
                                <?php endif; ?>
                            </div>
                            
                            <?php if (!empty($featured_testimonial['platform'])): ?>
                                <div class="platform-info text-sm text-gray-500 mt-1 flex items-center">
                                    <span class="mr-1"><?php echo $featured_testimonial['platform_icon']; ?></span>
                                    via <?php echo esc_html($featured_testimonial['platform']); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    <?php endif; ?>
    
    <?php if ($enable_social_links && !empty($social_media_count)): ?>
        <div class="social-media-proof mt-8 text-center">
            <p class="text-gray-600 mb-4">Follow us on social media</p>
            <div class="social-links flex justify-center space-x-6">
                <?php foreach ($social_media_count as $platform => $count): ?>
                    <div class="social-stat text-center">
                        <div class="platform-count text-lg font-bold text-blue-600"><?php echo esc_html($count); ?></div>
                        <div class="platform-name text-sm text-gray-600"><?php echo esc_html(ucfirst($platform)); ?></div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>
    
    <?php if ($auto_rotate && count($enhanced_testimonials) > 1): ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('[data-auto-rotate="true"]');
            if (!carousel) return;
            
            const track = carousel.querySelector('.carousel-track');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const indicators = carousel.querySelectorAll('.indicator');
            const prevBtn = carousel.querySelector('.carousel-prev');
            const nextBtn = carousel.querySelector('.carousel-next');
            
            let currentSlide = 0;
            const totalSlides = slides.length;
            const rotationSpeed = parseInt(carousel.dataset.rotationSpeed) || 5000;
            let autoRotateInterval;
            
            function goToSlide(index) {
                currentSlide = index;
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
                
                // Update indicators
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('bg-blue-500', i === currentSlide);
                    indicator.classList.toggle('bg-gray-300', i !== currentSlide);
                });
            }
            
            function nextSlide() {
                goToSlide((currentSlide + 1) % totalSlides);
            }
            
            function prevSlide() {
                goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
            }
            
            function startAutoRotate() {
                autoRotateInterval = setInterval(nextSlide, rotationSpeed);
            }
            
            function stopAutoRotate() {
                clearInterval(autoRotateInterval);
            }
            
            // Event listeners
            if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoRotate(); nextSlide(); startAutoRotate(); });
            if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoRotate(); prevSlide(); startAutoRotate(); });
            
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    stopAutoRotate();
                    goToSlide(index);
                    startAutoRotate();
                });
            });
            
            // Start auto-rotation
            startAutoRotate();
            
            // Pause on hover
            carousel.addEventListener('mouseenter', stopAutoRotate);
            carousel.addEventListener('mouseleave', startAutoRotate);
        });
        </script>
    <?php endif; ?>
</div>