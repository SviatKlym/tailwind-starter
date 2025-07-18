<?php
$title = $attributes['title'] ?? 'Hello World';
$content = $attributes['content'] ?? 'This is a sample block with Tailwind CSS styling.';
$button_text = $attributes['buttonText'] ?? 'Learn More';
$button_url = $attributes['buttonUrl'] ?? '';
$background_color = $attributes['backgroundColor'] ?? 'bg-white';
$text_color = $attributes['textColor'] ?? 'text-gray-900';

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="card <?php echo esc_attr($background_color . ' ' . $text_color); ?> max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-4"><?php echo wp_kses_post($title); ?></h2>
        <p class="text-lg mb-6 leading-relaxed"><?php echo wp_kses_post($content); ?></p>
        <?php if ($button_text && $button_url): ?>
            <a 
                href="<?php echo esc_url($button_url); ?>" 
                class="btn-primary"
                role="button"
                aria-label="<?php echo esc_attr($button_text); ?>"
            >
                <?php echo wp_kses_post($button_text); ?>
            </a>
        <?php endif; ?>
    </div>
</div>