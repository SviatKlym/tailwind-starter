<?php

function my_tailwind_starter_image_sizes() {
    add_image_size('hero-image', 1920, 1080, true);
    add_image_size('card-image', 400, 300, true);
    add_image_size('featured-image', 800, 600, true);
}
add_action('after_setup_theme', 'my_tailwind_starter_image_sizes');