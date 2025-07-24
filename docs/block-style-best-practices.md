# Best Practices for Gutenberg Block Style Parity

## 1. **File Organization & Naming Conventions**

```
/blocks/hero-section/
├── block.json          # Block metadata
├── index.js           # Block registration
├── edit.js            # Editor component
├── save.js            # Save function (or null for dynamic)
├── render.php         # Server-side rendering
├── style.scss         # Shared styles (editor + frontend)
├── editor.scss        # Editor-only styles
├── view.js            # Frontend-only JavaScript
└── utils.js           # Shared utilities
```

## 2. **Style Loading Strategy**

### A. Use Proper block.json Configuration
```json
{
  "editorScript": "file:./index.js",
  "editorStyle": "file:./editor.css",
  "style": "file:./style.css",
  "viewScript": "file:./view.js"
}
```

### B. Implement Style Dependencies
```php
// Ensure Tailwind/theme styles load first
wp_register_style(
    'my-block-style',
    $style_url,
    ['wp-block-library', 'theme-styles'], // Dependencies
    $version
);
```

## 3. **Attribute Synchronization**

### A. Use a Single Source of Truth
```javascript
// shared/attributes.js
export const colorAttributes = {
    backgroundColor: {
        type: 'string',
        default: '#ffffff'
    },
    textColor: {
        type: 'string',
        default: '#000000'
    }
};

// Use in both block.json and components
```

### B. Implement Attribute Validation
```php
function validate_block_attributes($attributes) {
    $validated = [];
    
    // Ensure required attributes exist
    $validated['backgroundColor'] = 
        sanitize_hex_color($attributes['backgroundColor'] ?? '#ffffff');
    
    $validated['fontSize'] = 
        in_array($attributes['fontSize'], ['small', 'medium', 'large']) 
        ? $attributes['fontSize'] 
        : 'medium';
    
    return $validated;
}
```

## 4. **Dynamic Block Pattern**

### A. Always Use Render Callbacks for Complex Blocks
```php
register_block_type('my-plugin/my-block', [
    'render_callback' => 'render_my_block',
    'attributes' => [
        // Define all attributes here
    ]
]);

function render_my_block($attributes, $content, $block) {
    // Validate and sanitize
    $attributes = validate_block_attributes($attributes);
    
    // Generate consistent output
    ob_start();
    include plugin_dir_path(__FILE__) . 'render.php';
    return ob_get_clean();
}
```

### B. Use Block Supports for Native Features
```json
{
  "supports": {
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  }
}
```

## 5. **CSS Architecture**

### A. Use CSS Custom Properties
```css
/* Base styles with CSS variables */
.wp-block-my-block {
    background-color: var(--block-bg-color, #ffffff);
    color: var(--block-text-color, #000000);
    padding: var(--block-padding, 2rem);
}

/* Responsive with CSS variables */
@media (min-width: 768px) {
    .wp-block-my-block {
        padding: var(--block-padding-md, 3rem);
    }
}
```

### B. Implement Specificity Management
```scss
// Use consistent selector patterns
.wp-block-my-block {
    // Block styles
    
    &__element {
        // Element styles
    }
    
    &--modifier {
        // Modifier styles
    }
}

// Editor-specific with proper specificity
.block-editor-block-list__block {
    &.wp-block-my-block {
        // Editor overrides
    }
}
```

## 6. **Testing & Debugging**

### A. Create a Test Page
```php
// Create test pattern with all block variations
register_block_pattern(
    'my-plugin/block-test',
    [
        'title' => 'Block Style Test',
        'content' => '<!-- wp:my-block {"variant":"1"} /-->
                     <!-- wp:my-block {"variant":"2"} /-->',
    ]
);
```

### B. Implement Debug Mode
```javascript
// Add debug info in development
if (process.env.NODE_ENV === 'development') {
    console.log('Block attributes:', attributes);
    console.log('Generated classes:', generatedClasses);
}
```

## 7. **Performance Optimization**

### A. Lazy Load Non-Critical Styles
```php
// Only load styles when block is used
add_filter('should_load_separate_core_block_assets', '__return_true');

// Conditional loading
add_action('enqueue_block_assets', function() {
    if (has_block('my-plugin/my-block')) {
        wp_enqueue_style('my-block-styles');
    }
});
```

### B. Minimize Inline Styles
```php
// Group inline styles
$inline_css = sprintf(
    '.wp-block-my-block-%s { %s }',
    esc_attr($block_id),
    esc_attr(generate_css_string($attributes))
);

wp_add_inline_style('my-block-style', $inline_css);
```

## 8. **Maintenance & Updates**

### A. Version Your Styles
```php
$style_version = filemtime(plugin_dir_path(__FILE__) . 'style.css');
wp_enqueue_style('my-block', $style_url, [], $style_version);
```

### B. Document Style Dependencies
```javascript
/**
 * Style dependencies:
 * - Requires Tailwind CSS v3.x
 * - Uses CSS Grid (IE11 not supported)
 * - Depends on theme color palette
 */
```

## Common Pitfalls to Avoid

1. **Don't use inline styles for responsive values** - Use CSS classes or custom properties
2. **Don't forget editor-specific resets** - Editor adds default margins/paddings
3. **Don't hardcode colors** - Use theme palette or customizable attributes
4. **Don't skip attribute validation** - Always sanitize on the server side
5. **Don't ignore block transforms** - Styles should work when switching block types

## Testing Checklist

- [ ] Styles match in editor and frontend
- [ ] Responsive breakpoints work correctly
- [ ] Dark mode compatibility (if applicable)
- [ ] RTL language support
- [ ] Print styles (if needed)
- [ ] Accessibility (contrast, focus states)
- [ ] Performance (style size, specificity)
- [ ] Cross-browser compatibility