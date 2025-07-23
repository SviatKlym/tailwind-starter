<?php
/**
 * Recent Posts Block - Server-side render template
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
$layout = $attributes['layout'] ?? 'grid-layout';
$posts_per_page = $attributes['postsPerPage'] ?? 6;
$columns = $attributes['columns'] ?? 3;
$categories = $attributes['categories'] ?? [];
$tags = $attributes['tags'] ?? [];
$order_by = $attributes['orderBy'] ?? 'date';
$order = $attributes['order'] ?? 'desc';
$exclude_current = $attributes['excludeCurrentPost'] ?? true;
$show_featured_image = $attributes['showFeaturedImage'] ?? true;
$show_excerpt = $attributes['showExcerpt'] ?? true;
$show_author = $attributes['showAuthor'] ?? true;
$show_date = $attributes['showDate'] ?? true;
$show_categories = $attributes['showCategories'] ?? true;
$excerpt_length = $attributes['excerptLength'] ?? 150;
$section_title = $attributes['sectionTitle'] ?? 'Latest Posts';
$section_subtitle = $attributes['sectionSubtitle'] ?? 'Stay updated with our latest articles and insights';
$show_section_header = $attributes['showSectionHeader'] ?? true;
$read_more_text = $attributes['readMoreText'] ?? 'Read More';
$no_posts_message = $attributes['noPostsMessage'] ?? 'No posts found.';
$settings = $attributes['settings'] ?? [];

// Build optimized WP Query arguments
$query_args = [
    'post_type' => 'post',
    'post_status' => 'publish',
    'posts_per_page' => $posts_per_page,
    'orderby' => $order_by,
    'order' => $order,
    'no_found_rows' => true, // Performance: Skip pagination count
    'update_post_meta_cache' => false, // Performance: Skip meta cache
    'meta_query' => []
];

// Exclude current post if viewing a single post
if ($exclude_current && is_single()) {
    $query_args['post__not_in'] = [get_the_ID()];
}

// Filter by categories
if (!empty($categories)) {
    $query_args['category__in'] = $categories;
}

// Filter by tags
if (!empty($tags)) {
    $query_args['tag__in'] = $tags;
}

// Create transient cache key for performance
$cache_key = 'recent_posts_block_' . md5(serialize($query_args));
$posts_data = get_transient($cache_key);

if (false === $posts_data) {
    $query = new WP_Query($query_args);
    $posts_data = $query->posts;
    // Cache for 5 minutes
    set_transient($cache_key, $posts_data, 5 * MINUTE_IN_SECONDS);
    wp_reset_postdata();
}

// Handle empty results
if (empty($posts_data)) {
    ?>
    <div class="recent-posts-block no-posts text-center py-8">
        <p class="text-gray-500"><?php echo esc_html($no_posts_message); ?></p>
    </div>
    <?php
    return;
}

// Generate CSS classes from settings
$wrapper_classes = ['recent-posts-block', 'layout-' . esc_attr($layout)];
if (isset($settings['backgroundColor'])) {
    $wrapper_classes[] = esc_attr($settings['backgroundColor']);
}
if (isset($settings['textColor'])) {
    $wrapper_classes[] = esc_attr($settings['textColor']);
}

// Determine grid columns classes with proper sanitization
$columns = intval($columns); // Ensure it's an integer
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

// Ensure $grid_classes is properly sanitized
$grid_classes = trim($grid_classes);
?>

<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>">
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-8">
            <?php if ($section_title): ?>
                <h2 class="section-title text-3xl font-bold mb-2">
                    <?php echo esc_html($section_title); ?>
                </h2>
            <?php endif; ?>
            <?php if ($section_subtitle): ?>
                <p class="section-subtitle text-gray-600 text-lg">
                    <?php echo esc_html($section_subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="posts-grid <?php echo esc_attr($grid_classes); ?>">
        <?php foreach ($posts_data as $post): ?>
            <article class="post-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <?php if ($show_featured_image && has_post_thumbnail($post->ID)): ?>
                    <div class="post-thumbnail">
                        <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" class="block">
                            <?php echo get_the_post_thumbnail($post->ID, 'medium', [
                                'class' => 'w-full h-48 object-cover',
                                'loading' => 'lazy'
                            ]); ?>
                        </a>
                    </div>
                <?php endif; ?>
                
                <div class="post-content p-6">
                    <?php if ($show_categories): ?>
                        <div class="post-categories mb-3">
                            <?php 
                            $post_categories = get_the_category($post->ID);
                            if ($post_categories) {
                                foreach ($post_categories as $category) {
                                    echo '<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">';
                                    echo esc_html($category->name);
                                    echo '</span>';
                                }
                            }
                            ?>
                        </div>
                    <?php endif; ?>
                    
                    <h3 class="post-title text-xl font-semibold mb-3">
                        <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" 
                           class="text-gray-900 hover:text-blue-600 transition-colors duration-200">
                            <?php echo esc_html(get_the_title($post->ID)); ?>
                        </a>
                    </h3>
                    
                    <?php if ($show_excerpt): ?>
                        <div class="post-excerpt text-gray-600 mb-4 leading-relaxed">
                            <?php 
                            $excerpt = get_the_excerpt($post->ID);
                            $trimmed_excerpt = wp_trim_words($excerpt, ceil($excerpt_length / 7), '...');
                            echo esc_html($trimmed_excerpt);
                            ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="post-meta flex justify-between items-center text-sm text-gray-500 mb-4">
                        <div class="meta-left">
                            <?php if ($show_author): ?>
                                <span class="post-author">
                                    By <?php echo esc_html(get_the_author_meta('display_name', $post->post_author)); ?>
                                </span>
                            <?php endif; ?>
                        </div>
                        <div class="meta-right">
                            <?php if ($show_date): ?>
                                <time class="post-date" datetime="<?php echo esc_attr(get_the_date('c', $post->ID)); ?>">
                                    <?php echo esc_html(get_the_date('', $post->ID)); ?>
                                </time>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" 
                       class="read-more-link inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                        <?php echo esc_html($read_more_text); ?>
                        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </article>
        <?php endforeach; ?>
    </div>
</div>