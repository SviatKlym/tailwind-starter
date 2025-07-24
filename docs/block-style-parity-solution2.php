<?php
/**
 * Solution 2: Dynamic Block with Consistent Attribute Handling
 * Uses render callback to ensure exact parity between editor and frontend
 */

// 1. Convert to fully dynamic block (remove save function)
// index.js
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => null, // Return null for dynamic blocks
});

// 2. Create a shared attribute-to-class converter
// utils/block-class-generator.js
export function generateBlockClasses(attributes) {
    const classes = ['wp-block-tailwind-starter-hero-section'];
    
    // Layout classes
    if (attributes.layout) {
        classes.push(`hero-layout-${attributes.layout}`);
    }
    
    // Spacing classes
    if (attributes.padding?.top) {
        classes.push(`pt-${attributes.padding.top}`);
    }
    if (attributes.padding?.bottom) {
        classes.push(`pb-${attributes.padding.bottom}`);
    }
    
    // Typography classes
    if (attributes.titleFontSize) {
        classes.push(attributes.titleFontSize);
    }
    if (attributes.titleFontWeight) {
        classes.push(attributes.titleFontWeight);
    }
    
    // Background and text colors
    if (attributes.backgroundColor) {
        classes.push(attributes.backgroundColor);
    }
    if (attributes.textColor) {
        classes.push(attributes.textColor);
    }
    
    // Responsive classes
    if (attributes.contentAlignment) {
        classes.push(attributes.contentAlignment);
    }
    
    return classes.filter(Boolean).join(' ');
}

// 3. Use the same class generator in both edit.js and render.php
// edit.js
import { generateBlockClasses } from '../../utils/block-class-generator';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({
        className: generateBlockClasses(attributes),
        style: generateInlineStyles(attributes)
    });
    
    return (
        <div {...blockProps}>
            <div className="hero-content">
                {/* Editor preview content */}
            </div>
        </div>
    );
}

// 4. PHP version of the class generator
// inc/block-class-generator.php
function generate_block_classes($attributes) {
    $classes = ['wp-block-tailwind-starter-hero-section'];
    
    // Layout classes
    if (!empty($attributes['layout'])) {
        $classes[] = 'hero-layout-' . esc_attr($attributes['layout']);
    }
    
    // Spacing classes
    if (!empty($attributes['padding']['top'])) {
        $classes[] = 'pt-' . esc_attr($attributes['padding']['top']);
    }
    if (!empty($attributes['padding']['bottom'])) {
        $classes[] = 'pb-' . esc_attr($attributes['padding']['bottom']);
    }
    
    // Typography classes
    if (!empty($attributes['titleFontSize'])) {
        $classes[] = esc_attr($attributes['titleFontSize']);
    }
    if (!empty($attributes['titleFontWeight'])) {
        $classes[] = esc_attr($attributes['titleFontWeight']);
    }
    
    // Colors
    if (!empty($attributes['backgroundColor'])) {
        $classes[] = esc_attr($attributes['backgroundColor']);
    }
    if (!empty($attributes['textColor'])) {
        $classes[] = esc_attr($attributes['textColor']);
    }
    
    // Alignment
    if (!empty($attributes['contentAlignment'])) {
        $classes[] = esc_attr($attributes['contentAlignment']);
    }
    
    return implode(' ', array_filter($classes));
}

// 5. Render.php using the same logic
<?php
// render.php
require_once get_template_directory() . '/inc/block-class-generator.php';

$block_classes = generate_block_classes($attributes);
$inline_styles = generate_inline_styles($attributes);
?>

<div class="<?php echo esc_attr($block_classes); ?>" 
     <?php echo $inline_styles ? 'style="' . esc_attr($inline_styles) . '"' : ''; ?>>
    <div class="hero-content">
        <?php if (!empty($attributes['headline'])): ?>
            <h1 class="hero-title <?php echo esc_attr($attributes['titleFontSize'] . ' ' . $attributes['titleFontWeight']); ?>">
                <?php echo esc_html($attributes['headline']); ?>
            </h1>
        <?php endif; ?>
        
        <?php if (!empty($attributes['subheadline'])): ?>
            <p class="hero-subtitle <?php echo esc_attr($attributes['subtitleFontSize']); ?>">
                <?php echo esc_html($attributes['subheadline']); ?>
            </p>
        <?php endif; ?>
    </div>
</div>

// 6. Ensure attributes are properly passed
register_block_type($block_json_file, [
    'render_callback' => function($attributes, $content, $block) {
        // Merge default attributes with saved attributes
        $defaults = $block->block_type->attributes;
        $attributes = wp_parse_args($attributes, array_map(function($attr) {
            return $attr['default'] ?? null;
        }, $defaults));
        
        // Render with complete attributes
        ob_start();
        include get_theme_file_path('build/blocks/hero-section/render.php');
        return ob_get_clean();
    }
]);