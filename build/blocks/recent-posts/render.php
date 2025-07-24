<?php
/**
 * recent-posts Block - Enhanced Server-side render template
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
$wrapper_data = prepare_block_wrapper($attributes, 'recent-posts-block');

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
                <p class="section-subtitle text-lg max-w-3xl mx-auto opacity-75">
                    <?php echo esc_html($section_subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="recent-posts-content">
        <?php
        // Extract additional attributes
        $posts_per_page = intval($attributes['postsPerPage'] ?? 6);
        $columns = intval($attributes['columns'] ?? 3);
        $categories = $attributes['categories'] ?? [];
        $tags = $attributes['tags'] ?? [];
        $show_featured_image = (bool) ($attributes['showFeaturedImage'] ?? true);
        $show_excerpt = (bool) ($attributes['showExcerpt'] ?? true);
        $show_author = (bool) ($attributes['showAuthor'] ?? true);
        $show_date = (bool) ($attributes['showDate'] ?? true);
        $show_categories = (bool) ($attributes['showCategories'] ?? true);
        $show_read_more = (bool) ($attributes['showReadMore'] ?? true);
        $exclude_current = (bool) ($attributes['excludeCurrentPost'] ?? true);
        $order_by = $attributes['orderBy'] ?? 'date';
        $order = $attributes['order'] ?? 'desc';
        $card_style = $attributes['cardStyle'] ?? 'elevated';
        $hover_effect = $attributes['hoverEffect'] ?? 'lift';
        $text_alignment = $attributes['textAlignment'] ?? 'left';
        $excerpt_length = intval($attributes['excerptLength'] ?? 150);
        $read_more_text = $attributes['readMoreText'] ?? 'Read More';
        $no_posts_message = $attributes['noPostsMessage'] ?? 'No posts found.';

        // Build query arguments
        $query_args = [
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => $posts_per_page,
            'orderby' => $order_by,
            'order' => $order,
            'ignore_sticky_posts' => true,
        ];

        // Exclude current post if on single post page
        if ($exclude_current && is_single()) {
            $query_args['post__not_in'] = [get_the_ID()];
        }

        // Add category filter
        if (!empty($categories)) {
            $query_args['category__in'] = array_map('intval', $categories);
        }

        // Add tag filter
        if (!empty($tags)) {
            $query_args['tag__in'] = array_map('intval', $tags);
        }

        // Execute query
        $recent_posts = new WP_Query($query_args);

        if ($recent_posts->have_posts()) :
            // Determine grid classes
            $grid_classes = 'grid gap-6 ';
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
            $card_classes = 'post-card h-full flex flex-col transition-all duration-300 ';
            switch ($card_style) {
                case 'elevated':
                    $card_classes .= 'rounded-lg shadow-md hover:shadow-lg';
                    break;
                case 'bordered':
                    $card_classes .= 'rounded-lg border-2 hover:border-opacity-60';
                    break;
                case 'minimal':
                    $card_classes .= '';
                    break;
                case 'gradient':
                    $card_classes .= 'rounded-lg shadow-sm hover:shadow-md';
                    break;
                default:
                    $card_classes .= 'rounded-lg shadow-md hover:shadow-lg';
            }

            // Add hover effects
            if ($hover_effect === 'lift') {
                $card_classes .= ' hover:-translate-y-2';
            } elseif ($hover_effect === 'scale') {
                $card_classes .= ' hover:scale-105';
            }
        ?>
            <div class="<?php echo esc_attr($grid_classes); ?>">
                <?php while ($recent_posts->have_posts()) : $recent_posts->the_post(); ?>
                    <article class="<?php echo esc_attr($card_classes); ?>">
                        <?php if ($show_featured_image && has_post_thumbnail()) : ?>
                            <div class="post-thumbnail">
                                <a href="<?php the_permalink(); ?>" class="block overflow-hidden rounded-t-lg">
                                    <?php the_post_thumbnail('large', [
                                        'class' => 'w-full h-48 object-cover transition-transform duration-300 hover:scale-110'
                                    ]); ?>
                                </a>
                            </div>
                        <?php endif; ?>

                        <div class="post-content p-6 flex-1 flex flex-col">
                            <?php if ($show_categories) : ?>
                                <div class="post-categories mb-3">
                                    <?php 
                                    $categories = get_the_category();
                                    if (!empty($categories)) :
                                        foreach ($categories as $category) :
                                    ?>
                                        <span class="inline-block px-2 py-1 text-xs font-medium rounded-full mr-2" style="background-color: currentColor; opacity: 0.1; color: currentColor;">
                                            <?php echo esc_html($category->name); ?>
                                        </span>
                                    <?php 
                                        endforeach;
                                    endif; 
                                    ?>
                                </div>
                            <?php endif; ?>

                            <h3 class="post-title text-xl font-bold mb-3 text-<?php echo esc_attr($text_alignment); ?>">
                                <a href="<?php the_permalink(); ?>" class="hover:opacity-80 transition-colors" style="color: currentColor;">
                                    <?php the_title(); ?>
                                </a>
                            </h3>

                            <?php if ($show_excerpt) : ?>
                                <div class="post-excerpt mb-4 flex-1 text-<?php echo esc_attr($text_alignment); ?>" style="opacity: 0.75;">
                                    <?php 
                                    $excerpt = get_the_excerpt();
                                    if (strlen($excerpt) > $excerpt_length) {
                                        $excerpt = substr($excerpt, 0, $excerpt_length) . '...';
                                    }
                                    echo esc_html($excerpt);
                                    ?>
                                </div>
                            <?php endif; ?>

                            <div class="post-meta flex items-center justify-between text-sm mt-auto" style="opacity: 0.6;">
                                <div class="meta-left flex items-center space-x-4">
                                    <?php if ($show_author) : ?>
                                        <span class="post-author flex items-center">
                                            <?php echo get_avatar(get_the_author_meta('ID'), 24, '', '', ['class' => 'w-6 h-6 rounded-full mr-2']); ?>
                                            <?php the_author(); ?>
                                        </span>
                                    <?php endif; ?>

                                    <?php if ($show_date) : ?>
                                        <time class="post-date" datetime="<?php echo get_the_date('c'); ?>">
                                            <?php echo get_the_date(); ?>
                                        </time>
                                    <?php endif; ?>
                                </div>

                                <?php if ($show_read_more) : ?>
                                    <a href="<?php the_permalink(); ?>" class="read-more-link font-medium transition-colors hover:opacity-80" style="color: currentColor;">
                                        <?php echo esc_html($read_more_text); ?> →
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>
        <?php 
        else : 
        ?>
            <div class="no-posts text-center py-12">
                <div class="text-6xl mb-4" style="opacity: 0.4;">📝</div>
                <p class="text-lg" style="opacity: 0.5;"><?php echo esc_html($no_posts_message); ?></p>
            </div>
        <?php 
        endif;
        
        // Reset post data
        wp_reset_postdata();
        ?>
    </div>
</div>
