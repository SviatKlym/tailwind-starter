<?php
/**
 * Recent Posts Block - Minimal Server-side render template
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

// Extract basic attributes with defaults
$posts_per_page = intval($attributes['postsPerPage'] ?? 6);
$columns = intval($attributes['columns'] ?? 3);
$show_featured_image = $attributes['showFeaturedImage'] ?? true;
$show_excerpt = $attributes['showExcerpt'] ?? true;
$show_author = $attributes['showAuthor'] ?? true;
$show_date = $attributes['showDate'] ?? true;
$excerpt_length = intval($attributes['excerptLength'] ?? 150);
$section_title = $attributes['sectionTitle'] ?? 'Latest Posts';
$no_posts_message = $attributes['noPostsMessage'] ?? 'No posts found.';

// Simple query
$query_args = array(
    'post_type' => 'post',
    'post_status' => 'publish',
    'posts_per_page' => $posts_per_page,
    'orderby' => 'date',
    'order' => 'DESC'
);

$query = new WP_Query($query_args);

if (!$query->have_posts()) {
    wp_reset_postdata();
    ?>
    <div class="recent-posts-block no-posts text-center py-8">
        <p class="text-gray-500"><?php echo esc_html($no_posts_message); ?></p>
    </div>
    <?php
    return;
}

// Grid classes
$grid_class = 'grid gap-6 grid-cols-1';
if ($columns == 2) {
    $grid_class = 'grid gap-6 grid-cols-1 md:grid-cols-2';
} elseif ($columns == 3) {
    $grid_class = 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
} elseif ($columns == 4) {
    $grid_class = 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
}
?>

<div class="recent-posts-block">
    <?php if ($section_title): ?>
        <div class="section-header text-center mb-8">
            <h2 class="section-title text-3xl font-bold mb-2">
                <?php echo esc_html($section_title); ?>
            </h2>
        </div>
    <?php endif; ?>
    
    <div class="<?php echo esc_attr($grid_class); ?>">
        <?php while ($query->have_posts()): $query->the_post(); ?>
            <article class="post-card bg-white rounded-lg shadow-md overflow-hidden">
                <?php if ($show_featured_image && has_post_thumbnail()): ?>
                    <div class="post-thumbnail">
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('medium', array('class' => 'w-full h-48 object-cover')); ?>
                        </a>
                    </div>
                <?php endif; ?>
                
                <div class="post-content p-6">
                    <h3 class="post-title text-xl font-semibold mb-3">
                        <a href="<?php the_permalink(); ?>" class="text-gray-900 hover:text-blue-600">
                            <?php the_title(); ?>
                        </a>
                    </h3>
                    
                    <?php if ($show_excerpt): ?>
                        <div class="post-excerpt text-gray-600 mb-4">
                            <?php echo esc_html(wp_trim_words(get_the_excerpt(), ceil($excerpt_length / 7), '...')); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="post-meta flex justify-between items-center text-sm text-gray-500 mb-4">
                        <?php if ($show_author): ?>
                            <span class="post-author">By <?php the_author(); ?></span>
                        <?php endif; ?>
                        <?php if ($show_date): ?>
                            <time class="post-date"><?php the_date(); ?></time>
                        <?php endif; ?>
                    </div>
                    
                    <a href="<?php the_permalink(); ?>" class="text-blue-600 hover:text-blue-800 font-medium">
                        Read More →
                    </a>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</div>

<?php wp_reset_postdata(); ?>