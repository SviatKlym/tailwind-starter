<?php
/**
 * team-members Block - Enhanced Server-side render template
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
$wrapper_data = prepare_block_wrapper($attributes, 'team-members-block');

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
    
    <div class="team-members-content">
        <?php
        // Extract attributes
        $layout = $attributes['layout'] ?? 'grid-cards';
        $members = $attributes['members'] ?? [];
        $columns = intval($attributes['columns'] ?? 3);
        $show_social = (bool) ($attributes['showSocialLinks'] ?? true);
        $show_bio = (bool) ($attributes['showBio'] ?? true);
        $show_contact = (bool) ($attributes['showContactInfo'] ?? false);
        $show_skills = (bool) ($attributes['showSkills'] ?? false);
        $show_department = (bool) ($attributes['showDepartment'] ?? true);
        $card_style = $attributes['cardStyle'] ?? 'elevated';
        $image_style = $attributes['imageStyle'] ?? 'rounded';

        if (empty($members)) :
        ?>
            <div class="no-members text-center py-12">
                <div class="text-6xl mb-4 opacity-50">👥</div>
                <p class="text-lg opacity-75">No team members to display.</p>
            </div>
        <?php
        else :
            // Determine grid classes
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

            // Card styling classes
            $card_classes = 'team-member-card transition-all duration-300 ';
            switch ($card_style) {
                case 'elevated':
                    $card_classes .= 'rounded-xl shadow-lg hover:shadow-xl p-6';
                    break;
                case 'bordered':
                    $card_classes .= 'rounded-xl border-2 hover:border-opacity-60 p-6';
                    break;
                case 'minimal':
                    $card_classes .= 'p-6';
                    break;
                case 'gradient':
                    $card_classes .= 'rounded-xl shadow-md hover:shadow-lg p-6';
                    break;
                default:
                    $card_classes .= 'rounded-xl shadow-lg hover:shadow-xl p-6';
            }
        ?>
            <div class="<?php echo esc_attr($grid_classes); ?>">
                <?php foreach ($members as $member) : 
                    if (!is_array($member)) continue;
                    
                    $member_id = $member['id'] ?? 'member-' . rand();
                    $name = $member['name'] ?? '';
                    $title = $member['title'] ?? '';
                    $department = $member['department'] ?? '';
                    $bio = $member['bio'] ?? '';
                    $image_url = $member['imageUrl'] ?? '';
                    $image_alt = $member['imageAlt'] ?? $name;
                    $email = $member['email'] ?? '';
                    $phone = $member['phone'] ?? '';
                    $social_links = $member['socialLinks'] ?? [];
                    $is_featured = (bool) ($member['featured'] ?? false);
                    $skills = $member['skills'] ?? [];
                    $location = $member['location'] ?? '';
                    
                    $final_card_classes = $card_classes;
                    if ($is_featured) {
                        $final_card_classes .= ' ring-2 relative featured-badge';
                    }
                ?>
                    <div class="<?php echo esc_attr($final_card_classes); ?>" data-member-id="<?php echo esc_attr($member_id); ?>">
                        
                        <?php if ($is_featured) : ?>
                            <div class="absolute -top-2 -right-2">
                                <span class="inline-flex items-center px-3 py-1 text-xs font-bold featured-badge rounded-full">
                                    ⭐ Featured
                                </span>
                            </div>
                        <?php endif; ?>

                        <div class="text-center">
                            <?php if ($image_url) : ?>
                                <div class="member-image mb-6">
                                    <?php 
                                    $image_classes = 'mx-auto object-cover ';
                                    switch ($image_style) {
                                        case 'rounded':
                                            $image_classes .= 'w-32 h-32 rounded-2xl';
                                            break;
                                        case 'circular':
                                            $image_classes .= 'w-32 h-32 rounded-full';
                                            break;
                                        case 'square':
                                            $image_classes .= 'w-32 h-32 rounded-lg';
                                            break;
                                        default:
                                            $image_classes .= 'w-32 h-32 rounded-2xl';
                                    }
                                    ?>
                                    <img src="<?php echo esc_url($image_url); ?>" 
                                         alt="<?php echo esc_attr($image_alt); ?>" 
                                         class="<?php echo esc_attr($image_classes); ?>">
                                </div>
                            <?php endif; ?>

                            <div class="member-info">
                                <h3 class="member-name text-xl font-bold mb-1">
                                    <?php echo esc_html($name); ?>
                                </h3>

                                <?php if ($title) : ?>
                                    <p class="member-title text-lg font-medium mb-2" style="color: currentColor; opacity: 0.8;">
                                        <?php echo esc_html($title); ?>
                                    </p>
                                <?php endif; ?>

                                <?php if ($show_department && $department) : ?>
                                    <p class="member-department text-sm opacity-75 mb-4">
                                        <?php echo esc_html($department); ?>
                                    </p>
                                <?php endif; ?>

                                <?php if ($location) : ?>
                                    <p class="member-location text-sm opacity-75 mb-4 flex items-center justify-center">
                                        <span class="mr-1">📍</span>
                                        <?php echo esc_html($location); ?>
                                    </p>
                                <?php endif; ?>

                                <?php if ($show_bio && $bio) : ?>
                                    <p class="member-bio text-sm leading-relaxed mb-4">
                                        <?php echo esc_html($bio); ?>
                                    </p>
                                <?php endif; ?>

                                <?php if ($show_skills && !empty($skills)) : ?>
                                    <div class="member-skills mb-4">
                                        <div class="flex flex-wrap gap-2 justify-center">
                                            <?php foreach ($skills as $skill) : ?>
                                                <span class="px-2 py-1 text-xs font-medium skill-tag opacity-75 rounded-full">
                                                    <?php echo esc_html($skill); ?>
                                                </span>
                                            <?php endforeach; ?>
                                        </div>
                                    </div>
                                <?php endif; ?>

                                <?php if ($show_contact && ($email || $phone)) : ?>
                                    <div class="member-contact text-sm opacity-75 mb-4">
                                        <?php if ($email) : ?>
                                            <div class="contact-item mb-1">
                                                <a href="mailto:<?php echo esc_attr($email); ?>" 
                                                   class="hover:opacity-80 transition-colors" style="color: currentColor;">
                                                    📧 <?php echo esc_html($email); ?>
                                                </a>
                                            </div>
                                        <?php endif; ?>
                                        <?php if ($phone) : ?>
                                            <div class="contact-item">
                                                <a href="tel:<?php echo esc_attr($phone); ?>" 
                                                   class="hover:opacity-80 transition-colors" style="color: currentColor;">
                                                    📞 <?php echo esc_html($phone); ?>
                                                </a>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>

                                <?php if ($show_social && !empty($social_links)) : ?>
                                    <div class="member-social flex justify-center space-x-4">
                                        <?php if (!empty($social_links['linkedin'])) : ?>
                                            <a href="<?php echo esc_url($social_links['linkedin']); ?>" 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               class="transition-colors" style="color: currentColor; opacity: 0.8;">
                                                <span class="sr-only">LinkedIn</span>
                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                                </svg>
                                            </a>
                                        <?php endif; ?>

                                        <?php if (!empty($social_links['twitter'])) : ?>
                                            <a href="<?php echo esc_url($social_links['twitter']); ?>" 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               class="transition-colors" style="color: currentColor; opacity: 0.8;">
                                                <span class="sr-only">Twitter</span>
                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                                </svg>
                                            </a>
                                        <?php endif; ?>

                                        <?php if (!empty($social_links['github'])) : ?>
                                            <a href="<?php echo esc_url($social_links['github']); ?>" 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               class="transition-colors" style="color: currentColor; opacity: 0.8;">
                                                <span class="sr-only">GitHub</span>
                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                </svg>
                                            </a>
                                        <?php endif; ?>

                                        <?php if (!empty($social_links['website'])) : ?>
                                            <a href="<?php echo esc_url($social_links['website']); ?>" 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               class="transition-colors" style="color: currentColor; opacity: 0.8;">
                                                <span class="sr-only">Website</span>
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                                </svg>
                                            </a>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>
