<?php
/**
 * social-proof Block - Enhanced Server-side render template
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

// Prepare block wrapper with visual controls integration
$wrapper_data = prepare_block_wrapper($attributes, 'social-proof-block');

// Extract block-specific attributes
$layout = $attributes['layout'] ?? 'default';
$show_section_header = $attributes['showSectionHeader'] ?? false;
$section_title = $attributes['sectionTitle'] ?? '';
$section_subtitle = $attributes['sectionSubtitle'] ?? '';

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
                <p class="section-subtitle text-lg max-w-3xl mx-auto">
                    <?php echo esc_html($section_subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="social-proof-content">
        <?php
        // Extract attributes
        $layout = $attributes['layout'] ?? 'testimonial-carousel';
        $testimonials = $attributes['testimonials'] ?? [];
        $logos = $attributes['logos'] ?? [];
        $trust_badges = $attributes['trustBadges'] ?? [];
        $show_ratings = (bool) ($attributes['showRatings'] ?? true);
        $show_avatars = (bool) ($attributes['showAvatars'] ?? true);
        $autoplay = (bool) ($attributes['autoplay'] ?? true);
        $autoplay_speed = intval($attributes['autoplaySpeed'] ?? 5000);

        // Render testimonials section
        if (!empty($testimonials)) :
        ?>
            <div class="testimonials-section mb-16">
                <div class="testimonials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <?php foreach ($testimonials as $testimonial) : 
                        if (!is_array($testimonial)) continue;
                        
                        $testimonial_id = $testimonial['id'] ?? 'testimonial-' . rand();
                        $name = $testimonial['name'] ?? '';
                        $position = $testimonial['position'] ?? '';
                        $company = $testimonial['company'] ?? '';
                        $content = $testimonial['content'] ?? '';
                        $rating = intval($testimonial['rating'] ?? 5);
                        $avatar = $testimonial['avatar'] ?? null;
                    ?>
                        <div class="testimonial-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8" data-testimonial-id="<?php echo esc_attr($testimonial_id); ?>">
                            
                            <?php if ($show_ratings && $rating > 0) : ?>
                                <div class="rating mb-4">
                                    <div class="flex space-x-1">
                                        <?php for ($i = 1; $i <= 5; $i++) : ?>
                                            <svg class="w-5 h-5 <?php echo $i <= $rating ? 'text-yellow-400' : 'text-gray-300'; ?>" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        <?php endfor; ?>
                                    </div>
                                </div>
                            <?php endif; ?>

                            <blockquote class="text-lg leading-relaxed mb-6">
                                "<?php echo esc_html($content); ?>"
                            </blockquote>

                            <div class="testimonial-author flex items-center">
                                <?php if ($show_avatars && $avatar) : ?>
                                    <div class="avatar mr-4">
                                        <img src="<?php echo esc_url($avatar); ?>" 
                                             alt="<?php echo esc_attr($name); ?>" 
                                             class="w-12 h-12 rounded-full object-cover">
                                    </div>
                                <?php elseif ($show_avatars) : ?>
                                    <div class="avatar mr-4">
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-current to-current opacity-75 flex items-center justify-center font-bold text-lg">
                                            <?php echo esc_html(substr($name, 0, 1)); ?>
                                        </div>
                                    </div>
                                <?php endif; ?>

                                <div class="author-info">
                                    <div class="author-name font-semibold">
                                        <?php echo esc_html($name); ?>
                                    </div>
                                    <?php if ($position || $company) : ?>
                                        <div class="author-position text-sm opacity-75">
                                            <?php 
                                            $position_text = [];
                                            if ($position) $position_text[] = $position;
                                            if ($company) $position_text[] = $company;
                                            echo esc_html(implode(', ', $position_text));
                                            ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!empty($logos)) : ?>
            <div class="logos-section mb-16">
                <div class="text-center mb-8">
                    <p class="opacity-75">Trusted by industry leaders</p>
                </div>
                <div class="logos-grid flex flex-wrap justify-center items-center gap-8 lg:gap-12">
                    <?php foreach ($logos as $logo) : 
                        if (!is_array($logo)) continue;
                        
                        $logo_id = $logo['id'] ?? 'logo-' . rand();
                        $logo_name = $logo['name'] ?? '';
                        $logo_image = $logo['image'] ?? null;
                        $logo_url = $logo['url'] ?? '#';
                    ?>
                        <div class="logo-item transition-all duration-300 hover:scale-110" data-logo-id="<?php echo esc_attr($logo_id); ?>">
                            <?php if ($logo_url !== '#') : ?>
                                <a href="<?php echo esc_url($logo_url); ?>" target="_blank" rel="noopener noreferrer">
                            <?php endif; ?>
                            
                            <?php if ($logo_image) : ?>
                                <img src="<?php echo esc_url($logo_image); ?>" 
                                     alt="<?php echo esc_attr($logo_name); ?>" 
                                     class="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity">
                            <?php else : ?>
                                <div class="logo-placeholder logo-placeholder-bg rounded-lg px-6 py-3 opacity-75 font-semibold">
                                    <?php echo esc_html($logo_name); ?>
                                </div>
                            <?php endif; ?>
                            
                            <?php if ($logo_url !== '#') : ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!empty($trust_badges)) : ?>
            <div class="trust-badges-section">
                <div class="badges-grid flex flex-wrap justify-center gap-8">
                    <?php foreach ($trust_badges as $badge) : 
                        if (!is_array($badge)) continue;
                        
                        $badge_id = $badge['id'] ?? 'badge-' . rand();
                        $badge_name = $badge['name'] ?? '';
                        $badge_description = $badge['description'] ?? '';
                        $badge_icon = $badge['icon'] ?? 'check';
                        
                        // Icon mapping
                        $icon_html = '';
                        switch ($badge_icon) {
                            case 'shield':
                                $icon_html = '<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>';
                                break;
                            case 'check':
                                $icon_html = '<svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
                                break;
                            case 'star':
                                $icon_html = '<svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>';
                                break;
                            default:
                                $icon_html = '<svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
                        }
                    ?>
                        <div class="trust-badge flex items-center space-x-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow px-6 py-4" data-badge-id="<?php echo esc_attr($badge_id); ?>">
                            <div class="badge-icon">
                                <?php echo $icon_html; ?>
                            </div>
                            <div class="badge-content">
                                <div class="badge-name font-semibold">
                                    <?php echo esc_html($badge_name); ?>
                                </div>
                                <?php if ($badge_description) : ?>
                                    <div class="badge-description text-sm opacity-75">
                                        <?php echo esc_html($badge_description); ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <?php if (empty($testimonials) && empty($logos) && empty($trust_badges)) : ?>
            <div class="no-content text-center py-12">
                <div class="text-6xl mb-4 opacity-50">⭐</div>
                <p class="text-lg opacity-75">No social proof content configured.</p>
            </div>
        <?php endif; ?>
    </div>
</div>
