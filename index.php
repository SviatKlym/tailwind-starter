<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-gray-50 text-gray-900'); ?>>
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex-shrink-0">
                    <?php if (has_custom_logo()) : ?>
                        <?php the_custom_logo(); ?>
                    <?php else : ?>
                        <h1 class="text-xl font-bold text-primary-600">
                            <a href="<?php echo esc_url(home_url('/')); ?>">
                                <?php bloginfo('name'); ?>
                            </a>
                        </h1>
                    <?php endif; ?>
                </div>
                <nav class="hidden md:block">
                    <?php
                    wp_nav_menu([
                        'theme_location' => 'primary',
                        'menu_class' => 'flex space-x-8',
                        'container' => false,
                    ]);
                    ?>
                </nav>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <?php
        if (have_posts()) :
            while (have_posts()) : the_post();
                ?>
                <article class="mb-8 bg-white rounded-lg shadow-sm p-6">
                    <header class="mb-4">
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">
                            <a href="<?php the_permalink(); ?>" class="hover:text-primary-600">
                                <?php the_title(); ?>
                            </a>
                        </h2>
                        <div class="text-sm text-gray-500">
                            <?php echo get_the_date(); ?> by <?php the_author(); ?>
                        </div>
                    </header>
                    <div class="prose prose-lg max-w-none">
                        <?php the_content(); ?>
                    </div>
                </article>
                <?php
            endwhile;
        endif;
        ?>
    </main>

    <footer class="bg-gray-800 text-white mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p class="text-center text-gray-400">
                © <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.
            </p>
        </div>
    </footer>

    <?php wp_footer(); ?>
</body>
</html>