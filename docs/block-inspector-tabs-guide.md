# Block Inspector Tabs UI Guide

This guide provides three distinct tabbed interface variations for separating global (shared) controls from block-specific controls in Gutenberg block inspectors.

## Tab Structure

All variations include these three core tabs:

- **⚙️ General Controls** - Global styling and layout options (spacing, colors, typography, effects)
- **🎯 Block Controls** - Block-specific functionality and content settings
- **🔧 Advanced Settings** - Technical configurations, performance, and accessibility options

---

## Variation 1: Horizontal Tabs at Top (Default)

### Description
Traditional horizontal tab layout positioned at the top of the inspector panel, similar to browser tabs or standard UI patterns.

### Implementation

```jsx
import { BlockInspectorTabs } from '../components/BlockInspectorTabs'

// In your block's edit component
<BlockInspectorTabs
  variant="horizontal"
  generalControls={
    <UltimateControlTabs
      spacing={spacing}
      onSpacingChange={setSpacing}
      // ... other visual controls
    />
  }
  blockControls={
    <>
      <TextControl
        label="Block Title"
        value={title}
        onChange={setTitle}
      />
      {/* Block-specific controls */}
    </>
  }
  advancedControls={
    <>
      <ToggleControl
        label="Enable Analytics"
        checked={enableAnalytics}
        onChange={setEnableAnalytics}
      />
      {/* Advanced settings */}
    </>
  }
/>
```

### CSS Classes (Tailwind Implementation)
```html
<!-- Tab Container -->
<div class="w-full border-b border-gray-200">
  <!-- Tab Navigation -->
  <div class="flex bg-gray-50 rounded-t-lg p-1 mb-4 border border-gray-200 border-b-0 shadow-sm">
    <button class="flex-1 px-4 py-3 rounded-md text-sm font-semibold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
      ⚙️ General
    </button>
    <button class="flex-1 px-4 py-3 rounded-md text-sm font-semibold bg-indigo-600 text-white shadow-md transform -translate-y-0.5">
      🎯 Block
    </button>
    <button class="flex-1 px-4 py-3 rounded-md text-sm font-semibold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
      🔧 Advanced
    </button>
  </div>
  
  <!-- Tab Content -->
  <div class="px-1 animate-fade-in">
    <!-- Content goes here -->
  </div>
</div>
```

### UX Rationale
- **Familiar Pattern**: Users expect horizontal tabs at the top, reducing cognitive load
- **Space Efficient**: Maximizes vertical space for content within the narrow inspector panel
- **Clear Hierarchy**: Active tab is visually elevated, making current context obvious
- **Mobile Friendly**: Works well on smaller screens with equal-width flex distribution

---

## Variation 2: Vertical Tabs on Left

### Description
Left-aligned vertical tab navigation that creates a sidebar effect, similar to settings panels in desktop applications.

### Implementation

```jsx
<BlockInspectorTabs
  variant="vertical"
  generalControls={/* Same as above */}
  blockControls={/* Same as above */}
  advancedControls={/* Same as above */}
/>
```

### CSS Classes (Tailwind Implementation)
```html
<!-- Tab Container -->
<div class="flex gap-4 w-full min-h-96">
  <!-- Tab Navigation (Sidebar) -->
  <div class="flex flex-col w-32 bg-gray-50 rounded-lg p-2 border border-gray-200 h-fit gap-1">
    <button class="w-full px-4 py-3 rounded-md text-xs font-semibold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5 transition-all duration-200 text-left flex items-center gap-2">
      ⚙️ General
    </button>
    <button class="w-full px-4 py-3 rounded-md text-xs font-semibold bg-indigo-600 text-white shadow-md transform translate-x-1 flex items-center gap-2">
      🎯 Block
    </button>
    <button class="w-full px-4 py-3 rounded-md text-xs font-semibold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5 transition-all duration-200 text-left flex items-center gap-2">
      🔧 Advanced
    </button>
  </div>
  
  <!-- Tab Content -->
  <div class="flex-1 p-2 bg-white rounded-lg border border-gray-200 animate-slide-in-right">
    <!-- Content goes here -->
  </div>
</div>
```

### UX Rationale
- **Reduced Cursor Travel**: Tabs remain in consistent left position, minimizing mouse movement
- **Persistent Navigation**: All tabs visible simultaneously, showing available options
- **Content Focus**: Main content area is clearly defined and separate from navigation
- **Desktop Optimized**: Leverages horizontal space effectively in wider inspector panels

---

## Variation 3: Icon-Only Compact Tabs

### Description
Minimalist approach using only icons with tooltips, creating maximum space for content while maintaining clear navigation.

### Implementation

```jsx
<BlockInspectorTabs
  variant="icons"
  generalControls={/* Same as above */}
  blockControls={/* Same as above */}
  advancedControls={/* Same as above */}
/>
```

### CSS Classes (Tailwind Implementation)
```html
<!-- Tab Container -->
<div class="w-full">
  <!-- Tab Navigation (Icon Only) -->
  <div class="flex justify-center bg-gray-50 rounded-xl p-1.5 mb-5 border border-gray-200 gap-1 shadow-md">
    <button 
      class="w-12 h-12 rounded-lg text-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-110 hover:rotate-1 transition-all duration-300 flex items-center justify-center"
      title="General Controls"
    >
      ⚙️
    </button>
    <button 
      class="w-12 h-12 rounded-lg text-lg bg-indigo-600 text-white scale-115 shadow-lg shadow-indigo-600/40 flex items-center justify-center"
      title="Block Controls"
    >
      🎯
    </button>
    <button 
      class="w-12 h-12 rounded-lg text-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-110 hover:rotate-1 transition-all duration-300 flex items-center justify-center"
      title="Advanced Settings"
    >
      🔧
    </button>
  </div>
  
  <!-- Tab Content -->
  <div class="p-2 animate-fade-in-up">
    <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
      <span class="text-lg">🎯</span>
      <span class="text-sm font-semibold text-gray-700">Block-Specific Controls</span>
    </div>
    <!-- Content goes here -->
  </div>
</div>
```

### UX Rationale
- **Maximum Content Space**: Minimal navigation footprint allows more room for controls
- **Speed Recognition**: Icons enable faster tab identification than reading text
- **Playful Interactions**: Subtle animations (rotation, scaling) provide delightful feedback
- **Universal Understanding**: Emoji icons transcend language barriers
- **Touch Friendly**: Larger touch targets (48px) work well on tablets and touch screens

---

## Usage Examples

### Basic Implementation in Block Edit Component

```jsx
import { InspectorControls } from '@wordpress/block-editor'
import { BlockInspectorTabs } from '../components/BlockInspectorTabs'
import { UltimateControlTabs } from '../utils/visual-controls'

export default function Edit({ attributes, setAttributes }) {
  const { title, content, settings } = attributes

  return (
    <>
      <InspectorControls>
        <BlockInspectorTabs
          variant="horizontal" // or "vertical" or "icons"
          
          generalControls={
            <UltimateControlTabs
              spacing={settings?.spacing}
              onSpacingChange={(spacing) => setAttributes({
                settings: { ...settings, spacing }
              })}
              background={settings?.backgroundColor}
              onBackgroundChange={(backgroundColor) => setAttributes({
                settings: { ...settings, backgroundColor }
              })}
              // ... other visual controls
            />
          }
          
          blockControls={
            <>
              <TextControl
                label="Block Title"
                value={title}
                onChange={(title) => setAttributes({ title })}
              />
              <TextareaControl
                label="Content"
                value={content}
                onChange={(content) => setAttributes({ content })}
              />
              {/* Add more block-specific controls */}
            </>
          }
          
          advancedControls={
            <>
              <ToggleControl
                label="Enable Performance Monitoring"
                checked={settings?.performanceMonitoring}
                onChange={(performanceMonitoring) => setAttributes({
                  settings: { ...settings, performanceMonitoring }
                })}
              />
              <TextControl
                label="Custom CSS Class"
                value={settings?.customClass}
                onChange={(customClass) => setAttributes({
                  settings: { ...settings, customClass }
                })}
              />
            </>
          }
        />
      </InspectorControls>
      
      {/* Block content */}
      <div>Your block content here</div>
    </>
  )
}
```

### Dynamic Variant Selection

```jsx
// Allow users to choose their preferred tab style
const [tabVariant, setTabVariant] = useState('horizontal')

// In your settings or preferences
<SelectControl
  label="Inspector Tab Style"
  value={tabVariant}
  options={[
    { label: 'Horizontal Tabs', value: 'horizontal' },
    { label: 'Vertical Tabs', value: 'vertical' },
    { label: 'Icon Tabs', value: 'icons' }
  ]}
  onChange={setTabVariant}
/>

// Use the selected variant
<BlockInspectorTabs variant={tabVariant} {...props} />
```

---

## Customization Options

### Adding More Tabs

```jsx
// Extend the base component to add custom tabs
const CustomBlockInspectorTabs = ({ customControls, ...props }) => {
  const tabs = [
    { name: 'general', title: '⚙️ General' },
    { name: 'block', title: '🎯 Block' },
    { name: 'custom', title: '🎨 Custom' }, // New tab
    { name: 'advanced', title: '🔧 Advanced' }
  ]
  
  // Handle the custom tab in your switch statement
  // case 'custom': return customControls
}
```

### Theme Integration

```jsx
// Adapt colors to match your theme
const themeColors = {
  primary: '#your-brand-color',
  secondary: '#your-secondary-color',
  background: '#your-background-color'
}

// Apply via CSS custom properties or styled-components
<BlockInspectorTabs 
  style={{
    '--tab-primary-color': themeColors.primary,
    '--tab-background-color': themeColors.background
  }}
/>
```

---

## Best Practices

1. **Consistent Grouping**: Always place visual controls (spacing, colors, typography) in General tab
2. **Clear Separation**: Block-specific functionality should never appear in General tab
3. **Progressive Disclosure**: Put advanced/technical settings in Advanced tab to avoid overwhelming users
4. **Icon Clarity**: Use universally understood icons for icon-only variant
5. **Responsive Design**: Test all variants on different screen sizes
6. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
7. **Performance**: Lazy load tab content to improve initial render time

This tabbed interface system provides flexibility while maintaining consistency across your block ecosystem.