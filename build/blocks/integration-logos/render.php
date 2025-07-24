<?php
/**
 * integration-logos Block - Enhanced Server-side render template
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
$wrapper_data = prepare_block_wrapper($attributes, 'integration-logos-block');

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
    
    <div class="integration-logos-content">
        <?php
        // Extract attributes
        $layout = $attributes['layout'] ?? 'simple-grid';
        $logos = $attributes['logos'] ?? [];
        $columns = intval($attributes['columns'] ?? 4);
        $logo_size = $attributes['logoSize'] ?? 'medium';
        $show_title = (bool) ($attributes['showTitle'] ?? false);
        $show_description = (bool) ($attributes['showDescription'] ?? false);
        $show_categories = (bool) ($attributes['showCategories'] ?? false);
        $enable_links = (bool) ($attributes['enableLinks'] ?? true);
        $hover_effect = $attributes['hoverEffect'] ?? 'lift';
        $logo_filter = $attributes['logoFilter'] ?? 'none';
        $alignment = $attributes['alignment'] ?? 'center';
        $spacing = $attributes['spacing'] ?? 'normal';
        $background_color = $attributes['backgroundColor'] ?? 'transparent';
        $border_style = $attributes['borderStyle'] ?? 'none';
        $aspect_ratio = $attributes['aspectRatio'] ?? 'auto';
        $grayscale_default = (bool) ($attributes['grayscaleDefault'] ?? false);
        $color_on_hover = (bool) ($attributes['colorOnHover'] ?? true);
        $uniform_size = (bool) ($attributes['uniformSize'] ?? true);
        $max_logo_height = intval($attributes['maxLogoHeight'] ?? 80);
        $enable_category_filter = (bool) ($attributes['enableCategoryFilter'] ?? false);

        // If no logos are provided, add some default examples
        if (empty($logos)) {
            $logos = [
                [
                    'id' => 1,
                    'image' => '',
                    'alt' => 'Slack',
                    'title' => 'Slack',
                    'link' => 'https://slack.com',
                    'category' => 'communication',
                    'description' => 'Team communication platform',
                    'openInNewTab' => true
                ],
                [
                    'id' => 2,
                    'image' => '',
                    'alt' => 'Google Workspace',
                    'title' => 'Google Workspace',
                    'link' => 'https://workspace.google.com',
                    'category' => 'productivity',
                    'description' => 'Business productivity suite',
                    'openInNewTab' => true
                ],
                [
                    'id' => 3,
                    'image' => '',
                    'alt' => 'Microsoft Teams',
                    'title' => 'Microsoft Teams',
                    'link' => 'https://teams.microsoft.com',
                    'category' => 'communication',
                    'description' => 'Collaboration hub',
                    'openInNewTab' => true
                ],
                [
                    'id' => 4,
                    'image' => '',
                    'alt' => 'Salesforce',
                    'title' => 'Salesforce',
                    'link' => 'https://salesforce.com',
                    'category' => 'crm',
                    'description' => 'Customer relationship management',
                    'openInNewTab' => true
                ],
                [
                    'id' => 5,
                    'image' => '',
                    'alt' => 'HubSpot',
                    'title' => 'HubSpot',
                    'link' => 'https://hubspot.com',
                    'category' => 'crm',
                    'description' => 'Inbound marketing platform',
                    'openInNewTab' => true
                ],
                [
                    'id' => 6,
                    'image' => '',
                    'alt' => 'Zoom',
                    'title' => 'Zoom',
                    'link' => 'https://zoom.us',
                    'category' => 'communication',
                    'description' => 'Video conferencing solution',
                    'openInNewTab' => true
                ]
            ];
        }

        if (empty($logos)) :
        ?>
            <div class="no-logos text-center py-12">
                <div class="text-6xl mb-4 opacity-50">🔗</div>
                <p class="text-lg opacity-75">No integration logos configured.</p>
            </div>
        <?php
        else :
            // Get unique categories for filter
            $categories = [];
            if ($enable_category_filter) {
                foreach ($logos as $logo) {
                    if (isset($logo['category']) && !in_array($logo['category'], $categories)) {
                        $categories[] = $logo['category'];
                    }
                }
            }

            // Determine grid classes
            $grid_classes = 'grid gap-8 ';
            switch ($columns) {
                case 2:
                    $grid_classes .= 'grid-cols-1 sm:grid-cols-2';
                    break;
                case 3:
                    $grid_classes .= 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
                    break;
                case 4:
                    $grid_classes .= 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
                    break;
                case 5:
                    $grid_classes .= 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
                    break;
                case 6:
                    $grid_classes .= 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6';
                    break;
                default:
                    $grid_classes .= 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
            }

            // Logo size classes
            $size_classes = '';
            switch ($logo_size) {
                case 'small':
                    $size_classes = 'h-12';
                    break;
                case 'medium':
                    $size_classes = 'h-16';
                    break;
                case 'large':
                    $size_classes = 'h-20';
                    break;
                default:
                    $size_classes = 'h-16';
            }

            // Spacing classes
            $spacing_classes = '';
            switch ($spacing) {
                case 'tight':
                    $spacing_classes = 'gap-4';
                    break;
                case 'normal':
                    $spacing_classes = 'gap-8';
                    break;
                case 'loose':
                    $spacing_classes = 'gap-12';
                    break;
                default:
                    $spacing_classes = 'gap-8';
            }

            $grid_classes = str_replace('gap-8', $spacing_classes, $grid_classes);
        ?>
            <?php if ($enable_category_filter && !empty($categories)) : ?>
                <div class="category-filters flex flex-wrap justify-center gap-4 mb-12">
                    <button class="filter-btn active px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-full transition-colors" data-category="all">
                        All
                    </button>
                    <?php foreach ($categories as $category) : ?>
                        <button class="filter-btn px-4 py-2 text-sm font-medium filter-button rounded-full transition-colors" data-category="<?php echo esc_attr($category); ?>">
                            <?php echo esc_html(ucfirst($category)); ?>
                        </button>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <div class="logos-grid <?php echo esc_attr($grid_classes); ?>">
                <?php foreach ($logos as $logo) : 
                    if (!is_array($logo)) continue;
                    
                    $logo_id = $logo['id'] ?? 'logo-' . rand();
                    $logo_image = $logo['image'] ?? '';
                    $logo_alt = $logo['alt'] ?? 'Integration Logo';
                    $logo_title = $logo['title'] ?? '';
                    $logo_link = $logo['link'] ?? '';
                    $logo_category = $logo['category'] ?? '';
                    $logo_description = $logo['description'] ?? '';
                    $open_in_new_tab = (bool) ($logo['openInNewTab'] ?? true);
                    
                    // Logo item classes
                    $item_classes = 'logo-item flex flex-col items-center justify-center p-6 transition-all duration-300 ';
                    
                    // Background styling
                    if ($background_color !== 'transparent') {
                        $item_classes .= 'bg-white ';
                    }
                    
                    // Border styling
                    if ($border_style === 'solid') {
                        $item_classes .= 'border border-gray-200 rounded-lg ';
                    } elseif ($border_style === 'shadow') {
                        $item_classes .= 'shadow-md hover:shadow-lg rounded-lg ';
                    }
                    
                    // Hover effects
                    if ($hover_effect === 'lift') {
                        $item_classes .= 'hover:-translate-y-1 ';
                    } elseif ($hover_effect === 'scale') {
                        $item_classes .= 'hover:scale-105 ';
                    }
                    
                    // Image filter classes
                    $image_classes = 'logo-image transition-all duration-300 ' . $size_classes . ' w-auto object-contain ';
                    if ($grayscale_default) {
                        $image_classes .= 'grayscale ';
                        if ($color_on_hover) {
                            $image_classes .= 'hover:grayscale-0 ';
                        }
                    }
                    
                    if ($uniform_size) {
                        $image_classes .= 'max-w-full ';
                    }
                ?>
                    <div class="<?php echo esc_attr($item_classes); ?>" 
                         data-logo-id="<?php echo esc_attr($logo_id); ?>"
                         data-category="<?php echo esc_attr($logo_category); ?>">
                        
                        <?php if ($enable_links && $logo_link) : ?>
                            <a href="<?php echo esc_url($logo_link); ?>" 
                               <?php echo $open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>
                               class="flex flex-col items-center justify-center <?php echo $alignment === 'center' ? 'text-center' : ''; ?>">
                        <?php endif; ?>
                        
                        <div class="logo-image-container mb-3">
                            <?php if ($logo_image) : ?>
                                <img src="<?php echo esc_url($logo_image); ?>" 
                                     alt="<?php echo esc_attr($logo_alt); ?>" 
                                     class="<?php echo esc_attr($image_classes); ?>"
                                     style="max-height: <?php echo esc_attr($max_logo_height); ?>px;">
                            <?php else : ?>
                                <div class="logo-placeholder logo-placeholder-bg rounded-lg <?php echo esc_attr($size_classes); ?> flex items-center justify-center opacity-75 font-semibold px-4">
                                    <?php echo esc_html($logo_title ?: 'Logo'); ?>
                                </div>
                            <?php endif; ?>
                        </div>

                        <?php if ($show_title && $logo_title) : ?>
                            <h3 class="logo-title font-semibold text-gray-900 text-sm mb-1">
                                <?php echo esc_html($logo_title); ?>
                            </h3>
                        <?php endif; ?>

                        <?php if ($show_description && $logo_description) : ?>
                            <p class="logo-description text-xs text-gray-600 text-center">
                                <?php echo esc_html($logo_description); ?>
                            </p>
                        <?php endif; ?>

                        <?php if ($show_categories && $logo_category) : ?>
                            <span class="logo-category text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mt-2">
                                <?php echo esc_html(ucfirst($logo_category)); ?>
                            </span>
                        <?php endif; ?>

                        <?php if ($enable_links && $logo_link) : ?>
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>

            <?php if ($enable_category_filter) : ?>
                <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const filterBtns = document.querySelectorAll('.filter-btn');
                    const logoItems = document.querySelectorAll('.logo-item');
                    
                    filterBtns.forEach(btn => {
                        btn.addEventListener('click', function() {
                            const category = this.dataset.category;
                            
                            // Update active button
                            filterBtns.forEach(b => b.classList.remove('active', 'bg-blue-100', 'text-blue-800'));
                            filterBtns.forEach(b => b.classList.add('bg-gray-100', 'text-gray-700'));
                            this.classList.add('active', 'bg-blue-100', 'text-blue-800');
                            this.classList.remove('bg-gray-100', 'text-gray-700');
                            
                            // Filter logos
                            logoItems.forEach(item => {
                                if (category === 'all' || item.dataset.category === category) {
                                    item.style.display = 'flex';
                                } else {
                                    item.style.display = 'none';
                                }
                            });
                        });
                    });
                });
                </script>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</div>
