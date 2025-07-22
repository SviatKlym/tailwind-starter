# Custom Gutenberg Blocks Library
## SaaS/Service Website Block Collection

This library provides custom Gutenberg blocks designed specifically for SaaS and service-based websites. Each block solves common content patterns while providing flexible variations and maintaining consistent design standards.

---

| Block | Purpose | Variations | Benefit |
|-------|---------|------------|---------|
| heroWithCta | Create compelling hero sections with headlines, descriptions, and prominent call-to-action buttons. | — Centered Layout (single CTA, centered text)<br>— Split Layout (content left, visual right)<br>— Video Background (autoplay video with overlay)<br>— Multi-CTA (primary + secondary buttons) | Eliminates complex CSS alignment and ensures consistent hero section styling while allowing non-technical users to update key messaging. |
| featureGrid | Display product features in structured grid layouts with icons and descriptions. | — Three Column Grid (icon, title, description)<br>— Card Style (bordered containers with hover effects)<br>— Icon Left (horizontal layout with left-aligned icons)<br>— Minimal List (simple vertical stack) | Replaces tedious HTML/CSS grid construction with drag-and-drop feature management and automatic responsive behavior. |
| pricingTable | Present pricing plans with features, highlighting, and call-to-action buttons. | — Three Tier Standard (basic, popular, premium)<br>— Toggle Pricing (monthly/annual switch)<br>— Feature Comparison (detailed feature lists)<br>— Simple Cards (minimal design without features) | Eliminates complex table markup and ensures consistent pricing presentation while enabling easy plan updates without developer intervention. |
| socialProof | Showcase customer testimonials, reviews, or trust indicators in various layouts. | — Testimonial Carousel (rotating customer quotes)<br>— Logo Grid (customer/partner logos)<br>— Review Cards (star ratings with quotes)<br>— Trust Badges (security/compliance indicators) | Standardizes social proof presentation and makes it simple to add/remove testimonials without touching code or worrying about layout consistency. |
| processSteps | Display step-by-step processes or workflows with numbering and descriptions. | — Horizontal Timeline (left-to-right flow)<br>— Vertical Steps (numbered list format)<br>— Icon Steps (visual icons for each step)<br>— Minimal Numbers (clean numbered progression) | Converts complex CSS step layouts into simple content management while maintaining visual consistency across different process explanations. |
| statsDisplay | Present key metrics, numbers, or achievements in visually prominent format. | — Counter Animation (numbers animate on scroll)<br>— Icon Stats (metrics with representative icons)<br>— Simple Grid (clean number presentation)<br>— Highlighted Single (one major statistic) | Eliminates custom JavaScript for number animations and ensures consistent metric presentation across different pages and sections. |
| faqAccordion | Create expandable FAQ sections with clean question/answer formatting. | — Simple Accordion (basic expand/collapse)<br>— Categorized FAQ (grouped by topic)<br>— Search Enabled (live search functionality)<br>— Icon Accordion (questions with icons) | Replaces complex JavaScript accordion code with user-friendly content management while ensuring accessibility and consistent behavior. |
| ctaSection | Design focused call-to-action sections with headlines, descriptions, and buttons. | — Centered CTA (single focus point)<br>— Split CTA (content + visual element)<br>— Banner Style (full-width background)<br>— Button Group (multiple action options) | Streamlines creation of conversion-focused sections while maintaining design consistency and eliminating custom CSS for different CTA styles. |
| contentSlider | Display multiple content pieces in rotating carousel format with navigation controls. | — Image Slider (photos with captions)<br>— Content Cards (text + image combinations)<br>— Testimonial Slider (rotating customer quotes)<br>— Feature Showcase (product highlights rotation) | Eliminates complex JavaScript slider implementation while providing consistent navigation behavior and responsive design across all slider types. |
| recentPosts | Automatically display the latest blog posts with customizable layouts and filtering. | — Grid Layout (card-style post previews)<br>— List View (minimal post titles and dates)<br>— Featured Post (one large + smaller posts)<br>— Category Filter (posts from specific categories) | Automates blog content display without custom PHP queries while ensuring fresh content appears consistently across site pages. |
| teamMembers | Showcase team members with photos, titles, and bio information in organized layouts. | — Grid Cards (photo, name, title, bio)<br>— List Format (horizontal photo + text)<br>— Minimal Display (photo and name only)<br>— Social Links (integrated social media icons) | Replaces manual HTML team pages with structured data entry while maintaining consistent styling and easy team updates. |
| integrationLogos | Display partner, integration, or certification logos in organized grids with optional links. | — Simple Grid (uniform logo sizing)<br>— Carousel Scroll (horizontal scrolling logos)<br>— Categorized Display (grouped by type)<br>— Hover Effects (logo animations on hover) | Standardizes logo presentation and eliminates manual image sizing while making partnership updates simple for non-technical users. |
| beforeAfter | Show comparison between two states with interactive slider or toggle functionality. | — Slider Comparison (draggable divider)<br>— Toggle Switch (click to switch views)<br>— Side by Side (static comparison)<br>— Overlay Fade (smooth transition effect) | Eliminates complex JavaScript comparison tools while providing engaging visual comparisons that enhance product demonstration effectiveness. |
| videoSection | Embed videos with customizable players, thumbnails, and surrounding content. | — Background Video (autoplay with content overlay)<br>— Featured Video (prominent player with description)<br>— Video Grid (multiple video thumbnails)<br>— Popup Player (modal video playback) | Simplifies video embedding while ensuring consistent player styling and optimal loading performance across different video use cases. |
| newsletterSignup | Create email subscription forms with various layouts and integration options. | — Inline Form (simple email + button)<br>— Modal Popup (triggered by scroll or time)<br>— Sidebar Widget (compact vertical form)<br>— Full Section (prominent subscription area) | Standardizes email capture across site while integrating with popular email services and maintaining consistent conversion-focused design. |
| alertBanner | Display important notifications, announcements, or promotional messages. | — Top Banner (site-wide notification bar)<br>— Inline Alert (contextual page messages)<br>— Dismissible Notice (closeable announcements)<br>— Countdown Banner (time-sensitive promotions) | Provides quick announcement capability without code deployment while ensuring consistent messaging design and user experience. |
| resourceGrid | Showcase downloadable resources, tools, or content offers in organized layouts. | — Download Cards (resource preview + download)<br>— Tool Directory (external link resources)<br>— Content Library (categorized resources)<br>— Featured Resources (highlighted top resources) | Streamlines resource presentation and tracking while maintaining consistent download experience and easy resource management. |

---

## Implementation Notes

### Priority Development Order
1. **heroWithCta** - Essential for landing pages
2. **pricingTable** - Critical for SaaS conversions  
3. **featureGrid** - Common across all analyzed sites
4. **socialProof** - High conversion impact
5. **ctaSection** - Versatile conversion tool

### Design Considerations
- All blocks should include responsive design by default
- Maintain consistent spacing and typography systems
- Include accessibility features (ARIA labels, keyboard navigation)
- Provide color and typography customization options
- Ensure fast loading with optimized assets

### Technical Requirements
- Compatible with WordPress 6.0+
- Built with modern JavaScript (ES6+)
- Use last installed Tailwind library and classes
- For Slider Use Swiper.
- Follows WordPress coding standards
- Includes proper sanitization and validation
- Use our custom core blocks enhanced if it need and our custom controls

---

## Implementation Status & Technical Guide

### ✅ Completed Blocks (5/16)
1. **heroWithCta** - ✅ COMPLETE
2. **pricingTable** - ✅ COMPLETE  
3. **featureGrid-enhanced** - ✅ COMPLETE
4. **socialProof** - ✅ COMPLETE
5. **ctaSection** - ✅ COMPLETE

### 🔧 Technical Implementation Details

#### Block Architecture
All custom blocks follow this standardized structure:
```
/src/blocks/[block-name]/
├── block.json           # Block metadata and attributes
├── edit.js             # React editor component
├── save.js             # Frontend output component
├── index.js            # Block registration
└── style.scss          # Block-specific styles
```

#### Essential Block Components
1. **UltimateControlTabs Integration**
   - All blocks use `/src/utils/visual-controls.js` for advanced styling controls
   - Required props: `spacing`, `margins`, `background`, `textColor`, `gradients`, `typography`, `layout`, `effects`
   - Each prop needs corresponding `onChange` callback
   - Example implementation:
   ```javascript
   <UltimateControlTabs
     spacing={settings.spacing || {}}
     onSpacingChange={(spacing) => setAttributes({
       settings: { ...settings, spacing }
     })}
     // ... all other required props
   />
   ```

2. **Device-Responsive Settings**
   - All blocks include `activeDevice` attribute for responsive design
   - Use `UltimateDeviceSelector` component
   - Settings structure: `{ base: {}, mobile: {}, tablet: {} }`

3. **Class Generation System**
   - Import: `generateAllClasses`, `generateTailwindClasses` from visual-controls.js
   - All blocks generate responsive Tailwind classes
   - Preview uses base classes, full output includes all devices

#### Block Registration Pattern
```javascript
// /src/index.js - Add new blocks here
import './blocks/[new-block-name]'
```

#### Required Attribute Structure
Every block must include these base attributes:
```json
{
  "settings": {
    "type": "object",
    "default": {
      "spacing": { "base": { "top": 8, "right": 4, "bottom": 8, "left": 4 } },
      "margins": { "base": { "top": 0, "right": 0, "bottom": 0, "left": 0 } },
      "typography": { "base": { "fontSize": "text-lg", "fontWeight": "font-normal", "textAlign": "text-center" } },
      "backgroundColor": "bg-white",
      "textColor": "text-gray-900",
      "gradients": {},
      "layout": {},
      "effects": {}
    }
  },
  "activeDevice": {
    "type": "string", 
    "default": "base"
  }
}
```

#### UI/UX Standards Implemented
- **Visual Design Studio Styling**: All blocks use preset-grid layouts for controls
- **Preset Button System**: Layout selectors use visual cards instead of dropdowns
- **Emoji Icons**: Enhanced labels with contextual emojis for better UX
- **Responsive Design Indicators**: Device badges show current editing context
- **Generated Output Panels**: Display live Tailwind classes for debugging

#### Common Issues & Solutions
1. **"T is not a function" errors**: Replace WordPress Button components with div elements in editor previews
2. **"a is not a function" errors**: Ensure all UltimateControlTabs props have proper onChange callbacks
3. **Missing import extensions**: Add `.js` to all local imports
4. **Undefined settings**: Provide complete default settings structure in block.json

#### Visual Controls System
- Located: `/src/utils/visual-controls.js` (2,389 lines)
- Provides: UltimateControlTabs, UltimateDeviceSelector, class generation functions
- CSS Classes: `.preset-grid`, `.preset-button` for Visual Design Studio styling
- Performance: Includes debouncing and performance monitoring

### 🎯 Future Development Guide
When creating new blocks:
1. Copy structure from existing completed block (e.g., pricingTable)
2. Update block.json with specific attributes
3. Implement UltimateControlTabs with ALL required props
4. Add to /src/index.js registration
5. Use Visual Design Studio styling patterns for controls
6. Test with device selector and class generation

---

*This block library is designed to accelerate SaaS and service website development while maintaining high design standards and user experience consistency.*