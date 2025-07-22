<?php
/**
 * Team Members Block - Server-side render template
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
$layout = $attributes['layout'] ?? 'grid-cards';
$members = $attributes['members'] ?? [];
$columns = $attributes['columns'] ?? 3;
$show_bio = $attributes['showBio'] ?? true;
$show_social_links = $attributes['showSocialLinks'] ?? true;
$show_contact_info = $attributes['showContactInfo'] ?? false;
$show_skills = $attributes['showSkills'] ?? false;
$show_location = $attributes['showLocation'] ?? false;
$show_department = $attributes['showDepartment'] ?? false;
$filter_by_department = $attributes['filterByDepartment'] ?? false;
$card_style = $attributes['cardStyle'] ?? 'elevated';
$image_style = $attributes['imageStyle'] ?? 'circle';
$hover_effect = $attributes['hoverEffect'] ?? 'lift';
$text_alignment = $attributes['textAlignment'] ?? 'center';
$section_title = $attributes['sectionTitle'] ?? 'Meet Our Team';
$section_subtitle = $attributes['sectionSubtitle'] ?? 'The talented individuals who make our success possible';
$show_section_header = $attributes['showSectionHeader'] ?? true;
$featured_first = $attributes['featuredFirst'] ?? true;
$show_join_date = $attributes['showJoinDate'] ?? false;
$settings = $attributes['settings'] ?? [];

// Filter and sort team members
$filtered_members = $members;

// Sort: featured members first if enabled
if ($featured_first) {
    usort($filtered_members, function($a, $b) {
        $a_featured = $a['featured'] ?? false;
        $b_featured = $b['featured'] ?? false;
        
        if ($a_featured && !$b_featured) return -1;
        if (!$a_featured && $b_featured) return 1;
        return 0;
    });
}

// Get unique departments for filtering
$departments = [];
if ($filter_by_department) {
    foreach ($filtered_members as $member) {
        $dept = $member['department'] ?? 'General';
        if (!in_array($dept, $departments)) {
            $departments[] = $dept;
        }
    }
}

// Handle empty members
if (empty($filtered_members)) {
    echo '<div class="team-members-block no-members text-center py-8">';
    echo '<p class="text-gray-500">No team members to display.</p>';
    echo '</div>';
    return;
}

// Generate CSS classes from settings
$wrapper_classes = ['team-members-block', 'layout-' . esc_attr($layout), 'text-' . esc_attr($text_alignment)];
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
    case 5:
        $grid_classes .= 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
        break;
    default:
        $grid_classes .= 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
}

// Helper function to render social links
function render_social_links($social_links) {
    if (empty($social_links)) return '';
    
    $output = '<div class="social-links flex justify-center space-x-3 mt-4">';
    
    $social_icons = [
        'linkedin' => '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        'twitter' => '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
        'github' => '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        'website' => '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>'
    ];
    
    foreach ($social_links as $platform => $url) {
        if (!empty($url)) {
            $icon = $social_icons[$platform] ?? $social_icons['website'];
            $output .= '<a href="' . esc_url($url) . '" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-blue-600 transition-colors duration-200" aria-label="' . ucfirst($platform) . '">';
            $output .= $icon;
            $output .= '</a>';
        }
    }
    
    $output .= '</div>';
    return $output;
}

// Helper function to render skills
function render_skills($skills) {
    if (empty($skills)) return '';
    
    $output = '<div class="member-skills mt-4">';
    $output .= '<div class="skills-list flex flex-wrap justify-center gap-2">';
    
    foreach ($skills as $skill) {
        $output .= '<span class="skill-tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">';
        $output .= esc_html($skill);
        $output .= '</span>';
    }
    
    $output .= '</div></div>';
    return $output;
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
    
    <?php if ($filter_by_department && count($departments) > 1): ?>
        <div class="department-filters text-center mb-8">
            <div class="inline-flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <button class="filter-btn active px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm" data-department="all">
                    All Departments
                </button>
                <?php foreach ($departments as $department): ?>
                    <button class="filter-btn px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900" data-department="<?php echo esc_attr($department); ?>">
                        <?php echo esc_html($department); ?>
                    </button>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>
    
    <div class="team-members-grid <?php echo esc_attr($grid_classes); ?>">
        <?php foreach ($filtered_members as $member): ?>
            <div class="member-card <?php echo esc_attr($card_style); ?>-card bg-white rounded-lg <?php echo $card_style === 'elevated' ? 'shadow-lg hover:shadow-xl' : 'border border-gray-200'; ?> overflow-hidden transition-all duration-300 <?php echo esc_attr($hover_effect); ?>-hover" data-department="<?php echo esc_attr($member['department'] ?? 'General'); ?>" data-featured="<?php echo ($member['featured'] ?? false) ? 'true' : 'false'; ?>">
                
                <?php if ($member['featured'] ?? false): ?>
                    <div class="featured-badge absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                        Featured
                    </div>
                <?php endif; ?>
                
                <div class="member-image-container relative">
                    <?php if (!empty($member['imageUrl'])): ?>
                        <img 
                            src="<?php echo esc_url($member['imageUrl']); ?>" 
                            alt="<?php echo esc_attr($member['imageAlt'] ?? $member['name'] ?? ''); ?>"
                            class="member-image w-full h-64 object-cover <?php echo $image_style === 'circle' ? 'rounded-full w-32 h-32 mx-auto mt-6' : 'rounded-t-lg'; ?>"
                            loading="lazy"
                        >
                    <?php else: ?>
                        <div class="member-image-placeholder <?php echo $image_style === 'circle' ? 'w-32 h-32 rounded-full mx-auto mt-6' : 'w-full h-64'; ?> bg-gray-200 flex items-center justify-center">
                            <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="member-content p-6">
                    <div class="member-header">
                        <h3 class="member-name text-xl font-bold text-gray-900 mb-1">
                            <?php echo esc_html($member['name'] ?? ''); ?>
                        </h3>
                        
                        <div class="member-title text-blue-600 font-medium mb-2">
                            <?php echo esc_html($member['title'] ?? ''); ?>
                        </div>
                        
                        <?php if ($show_department && !empty($member['department'])): ?>
                            <div class="member-department text-sm text-gray-500 mb-3">
                                <?php echo esc_html($member['department']); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <?php if ($show_bio && !empty($member['bio'])): ?>
                        <div class="member-bio text-gray-600 leading-relaxed mb-4">
                            <?php echo esc_html($member['bio']); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($show_skills && !empty($member['skills'])): ?>
                        <?php echo render_skills($member['skills']); ?>
                    <?php endif; ?>
                    
                    <?php if ($show_location && !empty($member['location'])): ?>
                        <div class="member-location text-sm text-gray-500 mt-3 flex items-center justify-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <?php echo esc_html($member['location']); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($show_join_date && !empty($member['joinDate'])): ?>
                        <div class="member-join-date text-sm text-gray-500 mt-2 text-center">
                            Joined <?php echo esc_html(date('F Y', strtotime($member['joinDate']))); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($show_contact_info && (!empty($member['email']) || !empty($member['phone']))): ?>
                        <div class="member-contact mt-4 pt-4 border-t border-gray-100">
                            <?php if (!empty($member['email'])): ?>
                                <div class="contact-email text-sm">
                                    <a href="mailto:<?php echo esc_attr($member['email']); ?>" class="text-blue-600 hover:text-blue-800 flex items-center justify-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                        <?php echo esc_html($member['email']); ?>
                                    </a>
                                </div>
                            <?php endif; ?>
                            
                            <?php if (!empty($member['phone'])): ?>
                                <div class="contact-phone text-sm mt-1">
                                    <a href="tel:<?php echo esc_attr($member['phone']); ?>" class="text-blue-600 hover:text-blue-800 flex items-center justify-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                        <?php echo esc_html($member['phone']); ?>
                                    </a>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($show_social_links && !empty($member['socialLinks'])): ?>
                        <?php echo render_social_links($member['socialLinks']); ?>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    
    <?php if ($filter_by_department): ?>
        <div class="department-empty-state text-center py-8 hidden">
            <div class="text-gray-400 text-lg mb-2">👥</div>
            <p class="text-gray-500">No team members found in this department.</p>
        </div>
    <?php endif; ?>
</div> 