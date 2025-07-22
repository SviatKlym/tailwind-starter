# WordPress Gutenberg Block Optimization Implementation Guide

## Overview

This guide outlines the step-by-step process to refactor your WordPress Gutenberg blocks from ~600-800KB bundles to under 100KB while maintaining full functionality.

## Phase 1: Setup Preset System (Week 1)

### 1.1 Install Preset System
```bash
# Copy the preset files to your theme
mkdir -p src/presets/{styles,scripts}
# Files already created:
# - src/presets/index.js
# - src/presets/styles/animations.css
# - src/presets/styles/components.css
# - src/presets/scripts/accessibility.js
# - src/presets/scripts/intersection-observer.js
```

### 1.2 Update Theme Functions (functions.php)
```php
// Add to your theme's functions.php
function enqueue_block_preset_system() {
    wp_enqueue_script(
        'block-presets',
        get_template_directory_uri() . '/src/presets/index.js',
        [],
        filemtime(get_template_directory() . '/src/presets/index.js'),
        true
    );
    
    wp_enqueue_script(
        'block-asset-manager',
        get_template_directory_uri() . '/src/utils/asset-loading.js',
        ['block-presets'],
        filemtime(get_template_directory() . '/src/utils/asset-loading.js'),
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_block_preset_system');
add_action('enqueue_block_editor_assets', 'enqueue_block_preset_system');
```

### 1.3 Update Tailwind Config
```javascript
// tailwind.config.js - Add custom utilities
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,php}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideInUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ]
}
```

## Phase 2: Refactor Blocks (Week 2-3)

### 2.1 Prioritize Block Refactoring

**High Priority (Largest Impact):**
1. video-section (819 lines SCSS, 752 lines JS)
2. newsletter-signup (742 lines SCSS, 689 lines JS)  
3. testimonial-showcase (554 lines SCSS, 656 lines JS)

**Medium Priority:**
4. before-after (598 lines SCSS, 360 lines JS)
5. recent-posts (573 lines SCSS)
6. stats-display (frontend animations)

**Low Priority:**
7. Other blocks with smaller bundles

### 2.2 Block Refactoring Process

For each block, follow this process:

#### Step 1: Update block.json
```json
{
  "name": "tailwind-starter/block-name",
  "presets": ["intersection-observer", "animations", "accessibility"],
  "assets": {
    "priority": "normal"
  }
}
```

#### Step 2: Convert SCSS to Tailwind
```scss
// Before (SCSS)
.block-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    
    @media (min-width: 768px) {
        padding: 4rem 2rem;
    }
}

.block-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    }
}
```

```jsx
// After (Tailwind classes)
<div className="block-container-wide py-8 md:py-16">
    <div className="block-card hover-lift hover:shadow-xl">
        {/* Content */}
    </div>
</div>
```

#### Step 3: Minimize JavaScript
```javascript
// Before: 656 lines of custom code
// After: Use shared utilities + 50-80 lines of block-specific logic

document.addEventListener('blockPresetsReady', function(e) {
    if (e.detail.blockName !== 'your-block-name') return;
    
    const blocks = document.querySelectorAll('.wp-block-tailwind-starter-your-block-name');
    blocks.forEach(initYourBlock);
});

function initYourBlock(block) {
    // Use shared utilities instead of custom implementations
    window.BlockIntersectionObserver.animateOnScroll(
        block.querySelectorAll('.animate-item'),
        'animate-fade-in'
    );
    
    // Only block-specific logic here
    const specificFeature = block.querySelector('.specific-element');
    if (specificFeature) {
        // Minimal block-specific code
    }
}
```

### 2.3 Asset Registration

Register each refactored block:

```javascript
// In your main JS file
window.BlockAssetManager.registerBlockAssets('your-block-name', {
    presets: ['animations', 'intersection-observer'],
    scripts: ['/path/to/your-block/frontend.js'],
    styles: ['/path/to/your-block/minimal-styles.css'],
    priority: 'normal'
});
```

## Phase 3: Testing & Optimization (Week 4)

### 3.1 Performance Testing

**Bundle Size Verification:**
```bash
# Measure bundle sizes
du -sh src/blocks/*/style.scss  # Before
du -sh src/blocks/*/style.css   # After

# JavaScript file sizes
wc -l src/blocks/*/frontend.js  # Before/After comparison
```

**Web Performance Testing:**
- Use Chrome DevTools Network tab
- Measure First Contentful Paint (FCP)
- Check Cumulative Layout Shift (CLS)
- Verify Time to Interactive (TTI)

### 3.2 Browser Testing

Test across:
- Chrome (latest)
- Firefox (latest) 
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 3.3 Accessibility Testing

```javascript
// Test screen reader announcements
window.BlockAccessibility.announceToScreenReader('Test message');

// Test keyboard navigation
// Tab through all interactive elements
// Test arrow key navigation where applicable
```

## Phase 4: Production Deployment

### 4.1 Pre-deployment Checklist

- [ ] All blocks load correctly in editor
- [ ] All blocks render correctly on frontend  
- [ ] Bundle sizes are under 100KB per block
- [ ] No JavaScript errors in console
- [ ] Accessibility features working
- [ ] Mobile responsiveness maintained
- [ ] Performance metrics improved

### 4.2 Gradual Rollout Strategy

1. **Stage 1:** Deploy 2-3 low-risk blocks
2. **Stage 2:** Deploy high-impact blocks (video, testimonial)
3. **Stage 3:** Deploy remaining blocks
4. **Stage 4:** Remove old SCSS files and unused JavaScript

### 4.3 Monitoring

After deployment, monitor:
- Page load times
- JavaScript errors
- User interaction metrics
- Accessibility compliance

## Expected Results

### Performance Improvements

| Metric | Before | After | Improvement |
|--------|---------|--------|-------------|
| CSS Bundle | 5,500+ lines | ~500 lines | 90% reduction |
| JS Bundle | 15,000+ lines | ~2,000 lines | 87% reduction |
| Total Size | 600-800KB | 50-100KB | 85% reduction |
| Load Time | 3-5s | 1-2s | 60% improvement |
| LCP | 4-6s | 2-3s | 50% improvement |

### Code Quality Improvements

- **Maintainability:** Shared utilities reduce duplication
- **Consistency:** Standardized patterns across blocks
- **Accessibility:** Centralized accessibility features
- **Performance:** Optimized loading strategies
- **Testing:** Smaller, focused components easier to test

## Troubleshooting

### Common Issues

**Issue:** Block doesn't load presets
**Solution:** Check console for preset loading errors, verify file paths

**Issue:** Animations not working
**Solution:** Ensure animations preset is loaded and reduce-motion is respected

**Issue:** Touch gestures not working
**Solution:** Verify touch-gestures preset loads only on touch devices

**Issue:** Accessibility features missing
**Solution:** Ensure accessibility preset loads first in dependency chain

### Debug Tools

```javascript
// Check loaded assets
console.log(window.BlockAssetManager.getMetrics());

// Test intersection observer
window.BlockIntersectionObserver.observe(element, entry => {
    console.log('Element intersected:', entry);
});

// Test accessibility announcements
window.BlockAccessibility.announceToScreenReader('Debug message');
```

## Maintenance

### Regular Tasks

- **Monthly:** Review bundle sizes and performance metrics
- **Quarterly:** Update Tailwind CSS and optimize utility usage
- **As needed:** Add new shared utilities to presets when patterns emerge

### Future Enhancements

- Add more animation presets
- Create block template system
- Implement advanced lazy loading
- Add performance monitoring hooks