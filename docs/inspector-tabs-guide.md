# Inspector Tabs UI Guide

A lightweight, scalable tabbed interface system for Gutenberg block inspectors that clearly separates block-specific controls from general visual controls.

## Core Design Principles

- **Lightweight**: Minimal CSS footprint (~2KB gzipped)
- **Scalable**: Easy to add new tabs and extend functionality
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Responsive**: Adapts to different screen sizes

---

## Tab Structure

### Core Tabs (Always Available)
- **🎯 Block Controls** - Block-specific functionality and content settings
- **⚙️ General Controls** - Visual styling, spacing, colors, typography

### Optional Tabs
- **🔧 Advanced Settings** - Technical configurations and performance options
- **Custom Tabs** - Project-specific controls as needed

---

## Layout Variations

### Variation 1: Horizontal Tabs (Default)

**Description**: Traditional horizontal tab layout at the top, similar to browser tabs.

**UX Rationale**: 
- Familiar pattern reduces cognitive load
- Maximizes vertical space for controls
- Works well in narrow inspector panels
- Mobile-friendly with equal-width distribution

**Implementation**:
```jsx
import { InspectorTabs } from '../components/InspectorTabs'

<InspectorTabs
  variant="horizontal"
  blockControls={
    <>
      <TextControl label="Title" value={title} onChange={setTitle} />
      <TextareaControl label="Content" value={content} onChange={setContent} />
    </>
  }
  generalControls={
    <UltimateControlTabs
      spacing={settings.spacing}
      onSpacingChange={handleSpacingChange}
      // ... other visual controls
    />
  }
/>
```

**Tailwind Classes**:
```html
<!-- Tab Container -->
<div class="inspector-tabs inspector-tabs--horizontal">
  <!-- Tab Navigation -->
  <div class="flex bg-slate-100 rounded-md p-0.5 mb-4 border border-slate-300">
    <button class="flex-1 px-3 py-2 text-xs font-semibold rounded text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all">
      🎯 Block
    </button>
    <button class="flex-1 px-3 py-2 text-xs font-semibold rounded bg-indigo-600 text-white shadow-sm">
      ⚙️ General
    </button>
  </div>
  
  <!-- Tab Content -->
  <div class="animate-fade-in">
    <!-- Controls content -->
  </div>
</div>
```

---

### Variation 2: Vertical Tabs

**Description**: Left-aligned vertical navigation creating a sidebar effect.

**UX Rationale**:
- Reduces cursor travel with consistent left positioning
- Shows all available tabs simultaneously
- Better for complex blocks with many controls
- Utilizes horizontal space effectively

**Implementation**:
```jsx
<InspectorTabs
  variant="vertical"
  blockControls={blockControlsContent}
  generalControls={generalControlsContent}
  advancedControls={advancedControlsContent}
/>
```

**Tailwind Classes**:
```html
<!-- Tab Container -->
<div class="inspector-tabs inspector-tabs--vertical flex gap-3">
  <!-- Tab Navigation (Sidebar) -->
  <div class="flex flex-col w-24 bg-slate-100 rounded-md p-1 border border-slate-300 h-fit gap-0.5">
    <button class="w-full px-2 py-2 text-xs font-semibold rounded text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all text-left flex items-center gap-1">
      🎯 Block
    </button>
    <button class="w-full px-2 py-2 text-xs font-semibold rounded bg-indigo-600 text-white shadow-sm flex items-center gap-1">
      ⚙️ General
    </button>
  </div>
  
  <!-- Tab Content -->
  <div class="flex-1 min-w-0">
    <!-- Controls content -->
  </div>
</div>
```

---

### Variation 3: Icon-Only Tabs

**Description**: Compact icon-only navigation with tooltips for space efficiency.

**UX Rationale**:
- Maximizes content space with minimal navigation footprint
- Icons enable faster recognition than text
- Tooltips provide context without cluttering UI
- Touch-friendly with larger tap targets

**Implementation**:
```jsx
<InspectorTabs
  variant="icons"
  blockControls={blockControlsContent}
  generalControls={generalControlsContent}
/>
```

**Tailwind Classes**:
```html
<!-- Tab Container -->
<div class="inspector-tabs inspector-tabs--icons">
  <!-- Tab Navigation (Icons) -->
  <div class="flex justify-center bg-slate-100 rounded-lg p-1 mb-4 border border-slate-300 gap-0.5">
    <button 
      class="w-9 h-9 rounded text-base text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 hover:scale-110 transition-all flex items-center justify-center"
      title="Block Controls"
    >
      🎯
    </button>
    <button 
      class="w-9 h-9 rounded text-base bg-indigo-600 text-white scale-110 shadow-lg flex items-center justify-center"
      title="General Controls"
    >
      ⚙️
    </button>
  </div>
  
  <!-- Tab Content -->
  <div class="animate-fade-in-up">
    <!-- Controls content -->
  </div>
</div>
```

---

## Usage Examples

### Basic Implementation

```jsx
import { InspectorControls } from '@wordpress/block-editor'
import { InspectorTabs } from '../components/InspectorTabs'
import { UltimateControlTabs } from '../utils/visual-controls'

export default function Edit({ attributes, setAttributes }) {
  const { title, content, settings = {} } = attributes

  return (
    <>
      <InspectorControls>
        <InspectorTabs
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
                rows={4}
              />
            </>
          }
          
          generalControls={
            <UltimateControlTabs
              spacing={settings.spacing}
              onSpacingChange={(spacing) => setAttributes({
                settings: { ...settings, spacing }
              })}
              blockSpacing={settings.blockSpacing}
              onBlockSpacingChange={(blockSpacing) => setAttributes({
                settings: { ...settings, blockSpacing }
              })}
              // ... other visual controls
            />
          }
        />
      </InspectorControls>
      
      {/* Block content */}
      <div>Your block content here</div>
    </>
  )
}
```

### With Custom Tabs

```jsx
<InspectorTabs
  variant="horizontal"
  blockControls={blockControlsContent}
  generalControls={generalControlsContent}
  customTabs={[
    {
      name: 'animations',
      title: '✨ Animations',
      icon: '✨',
      content: (
        <>
          <ToggleControl label="Enable Animations" />
          <SelectControl label="Animation Type" />
        </>
      )
    }
  ]}
/>
```

### Simple Version (Minimal)

```jsx
import { SimpleInspectorTabs } from '../components/InspectorTabs'

<SimpleInspectorTabs
  blockControls={<YourBlockControls />}
  generalControls={<YourGeneralControls />}
/>
```

---

## Responsive Behavior

### Mobile Adaptations
- **Horizontal**: Maintains layout, text may truncate
- **Vertical**: Converts to horizontal on small screens
- **Icons**: Remains consistent across all screen sizes

### Tablet Considerations
- All variants work well on tablet interfaces
- Touch targets are optimized for finger navigation
- Icon variant provides best touch experience

---

## Styling Customization

### CSS Custom Properties
```css
.inspector-tabs {
  --tab-primary: #your-brand-color;
  --tab-primary-hover: #your-hover-color;
  --tab-secondary: #your-background-color;
  --tab-border: #your-border-color;
  --tab-radius: 8px; /* Adjust border radius */
}
```

### Theme Integration
```jsx
// Pass theme colors as props
<InspectorTabs
  variant="horizontal"
  style={{
    '--tab-primary': '#your-primary-color',
    '--tab-secondary': '#your-secondary-color'
  }}
/>
```

---

## Performance Optimization

### Lazy Loading
```jsx
// Only render active tab content
const renderTabContent = (activeTab) => {
  switch (activeTab) {
    case 'block':
      return <LazyBlockControls />
    case 'general':
      return <LazyGeneralControls />
    default:
      return null
  }
}
```

### Memoization
```jsx
const MemoizedInspectorTabs = React.memo(InspectorTabs, 
  (prevProps, nextProps) => {
    return prevProps.variant === nextProps.variant &&
           prevProps.activeTab === nextProps.activeTab
  }
)
```

---

## Accessibility Features

- **Keyboard Navigation**: Arrow keys navigate between tabs
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators
- **High Contrast**: Supports system high contrast modes

---

## Best Practices

1. **Consistent Grouping**: Always put visual controls in General tab
2. **Clear Separation**: Block-specific functionality stays in Block tab
3. **Progressive Disclosure**: Use Advanced tab for technical settings
4. **Icon Clarity**: Use universally understood icons
5. **Performance**: Lazy load tab content when possible
6. **Testing**: Test all variants on different screen sizes

---

## Migration Guide

### From Existing Controls
```jsx
// Before (scattered controls)
<InspectorControls>
  <PanelBody title="Block Settings">
    <TextControl />
  </PanelBody>
  <PanelBody title="Visual Settings">
    <UltimateControlTabs />
  </PanelBody>
</InspectorControls>

// After (organized tabs)
<InspectorControls>
  <InspectorTabs
    blockControls={<TextControl />}
    generalControls={<UltimateControlTabs />}
  />
</InspectorControls>
```

This tabbed interface system provides a clean, scalable solution for organizing block inspector controls while maintaining excellent user experience and performance.