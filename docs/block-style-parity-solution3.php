<?php
/**
 * Solution 3: CSS Custom Properties & Data Attributes
 * Uses CSS variables and data attributes for perfect style synchronization
 */

// 1. Store style values as CSS custom properties
// edit.js
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    // Generate CSS variables from attributes
    const cssVars = {
        '--hero-bg-color': attributes.backgroundColor || '#ffffff',
        '--hero-text-color': attributes.textColor || '#000000',
        '--hero-title-size': attributes.titleFontSize || '3rem',
        '--hero-title-weight': attributes.titleFontWeight || '700',
        '--hero-subtitle-size': attributes.subtitleFontSize || '1.25rem',
        '--hero-padding-top': attributes.padding?.top || '4rem',
        '--hero-padding-bottom': attributes.padding?.bottom || '4rem',
        '--hero-content-max-width': attributes.contentMaxWidth || '1200px',
        '--hero-title-margin': attributes.titleMarginBottom || '1.5rem',
        '--hero-subtitle-margin': attributes.subtitleMarginBottom || '2rem',
    };
    
    // Generate data attributes for responsive values
    const dataAttributes = {
        'data-layout': attributes.layout,
        'data-alignment': attributes.contentAlignment,
        'data-has-bg-image': attributes.backgroundImage ? 'true' : 'false',
        'data-hover-effects': attributes.hoverEffects ? 'true' : 'false',
    };
    
    const blockProps = useBlockProps({
        style: cssVars,
        ...dataAttributes,
        className: 'wp-block-hero-section'
    });
    
    return (
        <div {...blockProps}>
            {/* Editor content */}
        </div>
    );
}

// 2. Unified CSS that uses custom properties
// style-index.css
.wp-block-tailwind-starter-hero-section {
    /* Use CSS custom properties for all customizable values */
    background-color: var(--hero-bg-color);
    color: var(--hero-text-color);
    padding-top: var(--hero-padding-top);
    padding-bottom: var(--hero-padding-bottom);
    position: relative;
    overflow: hidden;
}

.wp-block-tailwind-starter-hero-section .hero-content {
    max-width: var(--hero-content-max-width);
    margin: 0 auto;
    padding: 0 1rem;
}

.wp-block-tailwind-starter-hero-section .hero-title {
    font-size: var(--hero-title-size);
    font-weight: var(--hero-title-weight);
    margin-bottom: var(--hero-title-margin);
    line-height: 1.2;
}

.wp-block-tailwind-starter-hero-section .hero-subtitle {
    font-size: var(--hero-subtitle-size);
    margin-bottom: var(--hero-subtitle-margin);
    opacity: 0.9;
}

/* Layout variations using data attributes */
.wp-block-tailwind-starter-hero-section[data-layout="centered"] {
    text-align: center;
}

.wp-block-tailwind-starter-hero-section[data-layout="split"] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .wp-block-tailwind-starter-hero-section[data-layout="split"] {
        grid-template-columns: 1fr;
        text-align: center;
    }
}

/* Hover effects controlled by data attribute */
.wp-block-tailwind-starter-hero-section[data-hover-effects="true"] .hero-button {
    transition: all 0.3s ease;
}

.wp-block-tailwind-starter-hero-section[data-hover-effects="true"] .hero-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

// 3. PHP render function using the same approach
// render.php
<?php
// Generate CSS variables
$css_vars = [
    '--hero-bg-color' => $attributes['backgroundColor'] ?? '#ffffff',
    '--hero-text-color' => $attributes['textColor'] ?? '#000000',
    '--hero-title-size' => $attributes['titleFontSize'] ?? '3rem',
    '--hero-title-weight' => $attributes['titleFontWeight'] ?? '700',
    '--hero-subtitle-size' => $attributes['subtitleFontSize'] ?? '1.25rem',
    '--hero-padding-top' => $attributes['padding']['top'] ?? '4rem',
    '--hero-padding-bottom' => $attributes['padding']['bottom'] ?? '4rem',
    '--hero-content-max-width' => $attributes['contentMaxWidth'] ?? '1200px',
    '--hero-title-margin' => $attributes['titleMarginBottom'] ?? '1.5rem',
    '--hero-subtitle-margin' => $attributes['subtitleMarginBottom'] ?? '2rem',
];

$style_string = '';
foreach ($css_vars as $var => $value) {
    $style_string .= sprintf('%s: %s; ', $var, esc_attr($value));
}

// Generate data attributes
$data_attrs = [
    'data-layout' => esc_attr($attributes['layout'] ?? 'centered'),
    'data-alignment' => esc_attr($attributes['contentAlignment'] ?? 'center'),
    'data-has-bg-image' => !empty($attributes['backgroundImage']) ? 'true' : 'false',
    'data-hover-effects' => !empty($attributes['hoverEffects']) ? 'true' : 'false',
];

$data_string = '';
foreach ($data_attrs as $attr => $value) {
    $data_string .= sprintf('%s="%s" ', $attr, $value);
}
?>

<div class="wp-block-tailwind-starter-hero-section" 
     style="<?php echo esc_attr($style_string); ?>"
     <?php echo $data_string; ?>>
    
    <?php if (!empty($attributes['backgroundImage'])): ?>
        <div class="hero-background" style="background-image: url('<?php echo esc_url($attributes['backgroundImage']['url']); ?>')"></div>
    <?php endif; ?>
    
    <div class="hero-content">
        <?php if (!empty($attributes['headline'])): ?>
            <h1 class="hero-title">
                <?php echo esc_html($attributes['headline']); ?>
            </h1>
        <?php endif; ?>
        
        <?php if (!empty($attributes['subheadline'])): ?>
            <p class="hero-subtitle">
                <?php echo esc_html($attributes['subheadline']); ?>
            </p>
        <?php endif; ?>
        
        <?php if (!empty($attributes['primaryCTA'])): ?>
            <div class="hero-buttons">
                <a href="<?php echo esc_url($attributes['primaryCTA']['url']); ?>" 
                   class="hero-button hero-button-primary">
                    <?php echo esc_html($attributes['primaryCTA']['text']); ?>
                </a>
                
                <?php if ($attributes['showSecondaryCTA'] && !empty($attributes['secondaryCTA'])): ?>
                    <a href="<?php echo esc_url($attributes['secondaryCTA']['url']); ?>" 
                       class="hero-button hero-button-secondary">
                        <?php echo esc_html($attributes['secondaryCTA']['text']); ?>
                    </a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

// 4. Helper function to ensure consistent value formatting
function format_css_value($value, $type = 'size') {
    if (empty($value)) return null;
    
    switch ($type) {
        case 'size':
            // Ensure numeric values have units
            if (is_numeric($value)) {
                return $value . 'px';
            }
            return $value;
            
        case 'color':
            // Validate color values
            if (strpos($value, '#') === 0 || strpos($value, 'rgb') === 0) {
                return $value;
            }
            // Convert Tailwind classes to actual colors if needed
            return convert_tailwind_to_hex($value);
            
        case 'weight':
            // Normalize font weights
            $weights = [
                'normal' => '400',
                'medium' => '500',
                'semibold' => '600',
                'bold' => '700',
                'extrabold' => '800',
            ];
            return $weights[$value] ?? $value;
            
        default:
            return $value;
    }
}