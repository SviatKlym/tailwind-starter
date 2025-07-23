# Tailwind Starter Block Patterns Guide

## Quick Start

### Using Block Patterns in the Editor

1. **Open the Block Inserter** - Click the "+" button in the editor
2. **Click on "Patterns"** tab
3. **Browse Categories**:
   - **Heroes** - Hero sections with various layouts
   - **Features** - Feature grids and showcases
   - **Testimonials** - Customer testimonials and reviews
   - **Pricing** - Pricing tables and plans
   - **Call to Action** - CTA sections
   - **Full Pages** - Complete page layouts

4. **Click to Insert** any pattern into your page

## Available Patterns

### Hero Patterns
- **Hero with Features** - Hero section + feature grid
- **Hero with CTA** - Built into the hero-with-cta block

### Feature Patterns
- **Process with Video** - Step-by-step process + video explainer
- **Blog Section** - Recent posts + newsletter signup

### Complete Page Patterns
- **Landing Page** - Full landing page with all sections
- **About Page** - Complete about us layout
- **Services Page** - Showcase your services

## Building Custom Pages

### Method 1: Using Individual Blocks
```
1. Insert Hero Section block
2. Add Feature Grid block
3. Add Testimonial Showcase
4. Add Pricing Table
5. Add CTA Section
```

### Method 2: Using Patterns
```
1. Insert "Landing Page" pattern
2. Customize each section
3. Remove/add sections as needed
```

### Method 3: Mix and Match
```
1. Start with a pattern
2. Add individual blocks
3. Create your unique layout
```

## Customization Tips

### Colors and Styling
- Each block has visual controls for colors
- Use consistent color scheme across blocks
- Leverage Tailwind classes in Additional CSS

### Content
- Click on any text to edit
- Upload your own images
- Customize icons and buttons

### Layout
- Use Group blocks to create sections
- Add spacing with Spacer blocks
- Use Columns for side-by-side content

## Example Page Structures

### Homepage
```
Hero with CTA
↓
Integration Logos
↓
Feature Grid (6 features)
↓
Before/After Comparison
↓
Testimonial Showcase
↓
Stats Display
↓
Pricing Table
↓
FAQ Accordion
↓
Newsletter Signup
```

### About Page
```
Hero Section (gradient bg)
↓
Stats Display (company stats)
↓
Process Steps (timeline)
↓
Team Members
↓
Testimonials
↓
CTA Section
```

### Services Page
```
Hero Section
↓
Feature Grid (services)
↓
Process Steps
↓
Before/After
↓
Pricing Table
↓
FAQ
↓
CTA Section
```

## Pro Tips

1. **Reusable Blocks**: Save customized sections as Reusable Blocks
2. **Global Styles**: Use theme.json for consistent styling
3. **Responsive Design**: All blocks are mobile-responsive
4. **Performance**: Blocks are optimized for speed

## Creating Your Own Patterns

1. Build your layout in the editor
2. Select all blocks (Ctrl/Cmd + A)
3. Copy the blocks
4. Add to `class-block-patterns.php`:

```php
register_block_pattern(
    'tailwind-starter/your-pattern',
    [
        'title'       => __( 'Your Pattern Name', 'tailwind-starter' ),
        'description' => __( 'Pattern description', 'tailwind-starter' ),
        'categories'  => [ 'tailwind-starter-pages' ],
        'content'     => 'PASTE YOUR BLOCKS HERE'
    ]
);
```

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Quick insert blocks
- `/` - Quick block search
- `Tab` - Navigate between blocks
- `Shift + Tab` - Navigate backwards

## Need Help?

- Check individual block documentation
- Use the WordPress Editor help
- Experiment with different combinations
- Start with patterns, then customize