# Core Block Enhancements

## Overview

This system extends WordPress core blocks with advanced visual controls, providing users with professional design options without requiring coding knowledge. It integrates our Visual Controls System with all major Gutenberg blocks.

## Enhanced Blocks

### 1. Heading Block (`core/heading`)

**Enhanced Features:**
- Responsive typography controls (H1-H6)
- Custom color palettes
- Advanced spacing controls
- Text alignment options
- Device-specific styling

**Available Presets:**
- **H1 Hero** - Large, centered hero headings (text-5xl, bold)
- **H1 Page** - Standard page titles (text-4xl, bold, left-aligned)
- **H2 Section** - Section headers (text-3xl, semibold)
- **H3 Subsection** - Subsection headers (text-2xl, semibold)
- **Accent Heading** - Highlighted headings with background
- **Minimal Heading** - Subtle, smaller headings

**Usage Examples:**
```html
<!-- Hero Heading -->
<h1 class="text-5xl font-bold text-center pt-8 pb-8">Your Amazing Product</h1>

<!-- Section Heading with Accent -->
<h2 class="text-3xl font-semibold bg-blue-50 text-blue-900 p-4 text-center">Why Choose Us</h2>
```

### 2. Paragraph Block (`core/paragraph`)

**Enhanced Features:**
- Lead paragraph styling
- Small text for captions/disclaimers
- Highlight backgrounds
- Custom typography scales
- Quote-style formatting

**Available Presets:**
- **Body Text** - Standard paragraph text
- **Lead Paragraph** - Larger, prominent text (text-xl)
- **Small Text** - Captions and disclaimers (text-sm)
- **Caption Text** - Image captions (text-xs, centered)
- **Highlight Text** - Important text with background
- **Quote Style** - Italic text with quote styling

**Usage Examples:**
```html
<!-- Lead Paragraph -->
<p class="text-xl pb-6 text-gray-800">Transform your business with our innovative solutions...</p>

<!-- Highlighted Text -->
<p class="bg-yellow-50 text-yellow-900 p-4 font-medium">Important: This offer expires soon!</p>
```

### 3. Button Block (`core/button`)

**Enhanced Features:**
- Multiple button styles (primary, secondary, ghost)
- Size variations (small, medium, large)
- Hover animations
- Custom spacing and colors
- CTA-specific styling

**Available Presets:**
- **Primary Button** - Main action buttons (blue background)
- **Secondary Button** - Alternative actions (outlined)
- **Ghost Button** - Subtle text-only buttons
- **Large Button** - Prominent call-to-action buttons
- **Small Button** - Compact buttons for tight spaces
- **CTA Button** - Special call-to-action styling (green, bold)

**Usage Examples:**
```html
<!-- Primary CTA Button -->
<div class="wp-block-button">
  <a class="wp-block-button__link bg-blue-600 text-white px-6 py-3 text-base font-medium">Get Started</a>
</div>

<!-- Large CTA Button -->
<div class="wp-block-button">
  <a class="wp-block-button__link bg-green-600 text-white px-8 py-4 text-xl font-bold">Start Free Trial</a>
</div>
```

### 4. Image Block (`core/image`)

**Enhanced Features:**
- Responsive image sizing
- Border radius controls
- Shadow and border styling
- Background containers
- Caption styling

**Available Presets:**
- **Hero Image** - Large, impactful images
- **Content Image** - Standard content images with subtle shadows
- **Rounded Image** - Circular images for profiles
- **Featured Image** - Images with card-like containers
- **Thumbnail** - Small, compact images
- **Gallery Image** - Images optimized for galleries

### 5. Group Block (`core/group`)

**Enhanced Features:**
- Background color controls
- Padding variations
- Border radius options
- Container width controls
- Card-like styling

**Available Presets:**
- **Section Container** - Main content sections
- **Content Card** - Card-style containers with shadows
- **Highlight Section** - Accent background sections
- **Sidebar Widget** - Compact sidebar containers
- **Full Width** - Edge-to-edge sections
- **Minimal Container** - Clean, minimal styling

### 6. List Block (`core/list`)

**Enhanced Features:**
- Custom bullet styles
- Checklist formatting
- Feature list styling
- Inline horizontal lists
- Navigation-style lists

**Available Presets:**
- **Bullet List** - Standard bulleted lists
- **Numbered List** - Ordered lists with custom styling
- **Checklist** - Lists with checkmark icons
- **Feature List** - Highlighted feature lists
- **Inline List** - Horizontal tag-style lists
- **Navigation List** - Link-style navigation lists

### 7. Quote Block (`core/quote`)

**Enhanced Features:**
- Blockquote styling
- Pull quote formatting
- Testimonial containers
- Attribution styling
- Background accents

**Available Presets:**
- **Blockquote** - Traditional blockquote styling
- **Pullquote** - Large, centered quotes
- **Testimonial** - Customer testimonial styling
- **Accent Quote** - Highlighted quotes with colored backgrounds
- **Minimal Quote** - Clean, subtle quote styling
- **Featured Quote** - Bold, prominent quotes

### 8. Spacer Block (`core/spacer`)

**Enhanced Features:**
- Preset spacing sizes
- Responsive spacing adjustments
- Visual indicators in editor

**Available Presets:**
- **Small Spacer** - 20px spacing
- **Medium Spacer** - 40px spacing
- **Large Spacer** - 80px spacing
- **Section Break** - 96px spacing for major sections
- **Content Spacer** - 32px for content separation
- **Tight Spacer** - 8px for minimal spacing

### 9. Separator Block (`core/separator`)

**Enhanced Features:**
- Multiple line styles
- Custom colors
- Decorative variations
- Width controls

**Available Presets:**
- **Default Separator** - Standard horizontal line
- **Thick Separator** - Bold, prominent separators
- **Accent Separator** - Colored separator lines
- **Subtle Separator** - Light, minimal separators
- **Section Separator** - Spacious section dividers
- **Decorative Separator** - Ornamental separators with icons

## Visual Controls System

Each enhanced block includes:

### 📱 Responsive Design Panel
- **Device Selector**: Control styles for Mobile, Tablet, Desktop, Large screens
- **Base-first approach**: Start with "All" devices, then customize for specific breakpoints
- **Live preview**: See changes instantly in the editor

### 🎨 Visual Design Studio
- **Quick Presets**: One-click professional styling
- **Spacing Controls**: Padding adjustments for all sides
- **Color Palettes**: 
  - Neutral colors (whites, grays, blacks)
  - Vibrant colors (blues, greens, reds, etc.)
  - Subtle colors (light backgrounds)
- **Typography Controls**:
  - Font sizes (XS to 5XL)
  - Font weights (Light to Bold)
  - Text alignment (Left, Center, Right)

### 🚀 Advanced Panel
- **Generated Classes**: View all Tailwind classes applied
- **Class Preview**: Debug and understand styling
- **Device Indicators**: Visual feedback for active breakpoint

## Technical Implementation

### Block Filters
The system uses WordPress block filters to extend core blocks:

```javascript
// Add visual attributes
addFilter('blocks.registerBlockType', 'tailwind-starter/add-visual-attributes', addVisualAttributes)

// Add visual controls to editor
addFilter('editor.BlockEdit', 'tailwind-starter/add-visual-controls', addVisualControls)

// Add classes to saved content
addFilter('blocks.getSaveElement', 'tailwind-starter/add-visual-classes', addVisualClassesToSave)
```

### Attribute Structure
Each enhanced block gets these additional attributes:

```json
{
  "visualSettings": {
    "type": "object",
    "default": {
      "spacing": {
        "base": { "top": 0, "right": 0, "bottom": 0, "left": 0 }
      },
      "typography": {
        "base": { "fontSize": "", "fontWeight": "", "textAlign": "" }
      },
      "backgroundColor": "",
      "textColor": ""
    }
  },
  "activeDevice": {
    "type": "string",
    "default": "base"
  }
}
```

### Class Generation
The system generates responsive Tailwind classes:

```javascript
// Base classes
pt-4 pb-4 text-2xl font-bold text-center bg-blue-50 text-blue-900

// With responsive prefixes
pt-4 pb-4 md:pt-6 md:pb-6 lg:pt-8 lg:pb-8 text-2xl font-bold text-center
```

## Usage Guidelines

### Best Practices

1. **Start with Presets**: Use presets as starting points, then customize
2. **Mobile-First**: Design for "All" devices first, then add breakpoint-specific styles
3. **Consistent Spacing**: Use the built-in spacing scale for consistency
4. **Color Harmony**: Stick to the provided color palettes for brand consistency
5. **Typography Hierarchy**: Maintain clear heading hierarchy with appropriate sizes

### Performance Considerations

- Classes are only added when settings differ from defaults
- Responsive classes are only generated when needed
- CSS is optimized and minified in production
- No JavaScript is loaded on the frontend

### Accessibility

- Focus states are enhanced for keyboard navigation
- Color contrast is maintained in all presets
- Semantic HTML structure is preserved
- Screen reader compatibility is maintained

## Customization

### Adding Custom Presets

Add custom presets to the `block-specific-controls.js` file:

```javascript
export const HEADING_PRESETS = {
  // ... existing presets
  custom_style: {
    spacing: { base: { top: 6, right: 4, bottom: 6, left: 4 } },
    typography: { base: { fontSize: 'text-3xl', fontWeight: 'font-black', textAlign: 'text-center' } },
    backgroundColor: 'bg-purple-100',
    textColor: 'text-purple-900'
  }
}
```

### Extending Color Palettes

Modify the color palettes in `visual-controls.js`:

```javascript
const colorPalettes = {
  brand: {
    name: '🎨 Brand Colors',
    colors: [
      { name: 'Brand Primary', value: 'brand-primary', hex: '#your-color' },
      // ... more brand colors
    ]
  }
}
```

### Custom CSS

Add custom styles in `core-blocks.css`:

```css
.wp-block-heading.preset-custom-style {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Troubleshooting

### Common Issues

1. **Controls not appearing**: Check that the block type is in `ENHANCED_BLOCKS` array
2. **Classes not applying**: Verify Tailwind CSS is properly compiled and loaded
3. **Responsive not working**: Ensure breakpoint classes are generated correctly
4. **Presets not loading**: Check that preset objects are properly exported

### Debug Mode

Enable debug mode in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check browser console for enhancement initialization:
```
🎨 Core block enhancements initialized
```

### Performance Monitoring

Monitor generated classes in the Advanced panel of each block to ensure optimal CSS output.

## Future Enhancements

- **Animation Controls**: Add entrance and hover animations
- **Advanced Layouts**: Grid and flexbox controls for Group blocks
- **Custom Fonts**: Integration with Google Fonts
- **Design Tokens**: Centralized design system management
- **Block Patterns**: Pre-designed block combinations
- **Export/Import**: Share settings between sites

## Support

For issues or feature requests, refer to the theme documentation or contact the development team.