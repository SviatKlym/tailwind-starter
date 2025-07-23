# InspectorTabs Implementation Guide

This guide shows how to implement the new InspectorTabs system across all blocks in your project.

## Step 1: Import the Component

Add this import to your block's edit.js file:

```javascript
import { InspectorTabs } from '../../components/InspectorTabs.js'
```

## Step 2: Replace InspectorControls Structure

### Before (Current Structure)
```jsx
<InspectorControls>
  <PanelBody title="Block Settings">
    {/* Block-specific controls */}
  </PanelBody>
  
  <PanelBody title="Visual Design">
    <UltimateControlTabs
      spacing={settings.spacing}
      // ... other visual controls
    />
  </PanelBody>
  
  <PanelBody title="Other Settings">
    {/* More controls */}
  </PanelBody>
</InspectorControls>
```

### After (New Structure)
```jsx
<InspectorControls>
  <InspectorTabs
    variant="horizontal"
    blockControls={
      <>
        <PanelBody title="🔧 Block Settings" initialOpen={true}>
          {/* Block-specific controls */}
        </PanelBody>
        
        <PanelBody title="Content Options" initialOpen={false}>
          {/* More controls */}
        </PanelBody>
      </>
    }
    
    generalControls={
      <>
        <PanelBody title="📱 Responsive Design" initialOpen={true}>
          <UltimateDeviceSelector
            activeDevice={activeDevice}
            onChange={(device) => setAttributes({ activeDevice: device })}
          />
        </PanelBody>
        
        <UltimateControlTabs
          spacing={settings.spacing}
          onSpacingChange={(spacing) => setAttributes({
            settings: { ...settings, spacing }
          })}
          blockSpacing={settings.blockSpacing || {}}
          onBlockSpacingChange={(blockSpacing) => setAttributes({
            settings: { ...settings, blockSpacing }
          })}
          // ... other visual controls
          device={activeDevice}
        />
      </>
    }
  />
</InspectorControls>
```

## Step 3: Categorize Your Controls

### Block Controls Tab 🔧
- Content settings (titles, descriptions, buttons)
- Layout options specific to the block
- Block-specific toggles and selectors
- Features unique to this block type
- Typography specific to the block
- Animation and interaction settings

### Visual Design Tab 🎨
- Device selector
- UltimateControlTabs (spacing, colors, typography, effects)
- Visual styling that applies universally
- Responsive design controls
- Global color and gradient systems

### Advanced Controls Tab ⚙️ (Optional)
- Performance settings
- Custom CSS classes
- Accessibility options
- Technical configurations

## Block-by-Block Implementation Checklist

### ✅ High Priority Blocks
- [ ] feature-grid
- [ ] hero-section  
- [ ] hero-with-cta
- [ ] testimonial-showcase
- [ ] stats-display
- [ ] pricing-table

### ✅ Medium Priority Blocks
- [ ] cta-section
- [ ] faq-accordion
- [ ] team-members
- [ ] integration-logos
- [ ] newsletter-signup
- [ ] recent-posts

### ✅ Lower Priority Blocks
- [ ] before-after
- [ ] content-slider
- [ ] process-steps
- [ ] social-proof
- [ ] video-section

## Template for Block Implementation

```jsx
import React from 'react'
import { 
  useBlockProps, 
  InspectorControls,
  // ... other imports
} from '@wordpress/block-editor'
import { 
  PanelBody,
  // ... other component imports
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { 
  UltimateDeviceSelector,
  UltimateControlTabs,
  generateAllClasses
} from '../../utils/visual-controls.js'
import { InspectorTabs } from '../../components/InspectorTabs.js'

export default function Edit({ attributes, setAttributes }) {
  const { settings = {}, activeDevice = 'base', /* other attributes */ } = attributes

  // Block-specific controls
  const blockControls = (
    <>
      <PanelBody title={__('🔧 Block Settings', 'tailwind-starter')} initialOpen={true}>
        {/* Your block-specific controls here */}
      </PanelBody>
      
      <PanelBody title={__('Content Options', 'tailwind-starter')} initialOpen={false}>
        {/* Content-related controls */}
      </PanelBody>
    </>
  )

  // General visual controls  
  const generalControls = (
    <>
      <PanelBody title={__('📱 Responsive Design', 'tailwind-starter')} initialOpen={true}>
        <UltimateDeviceSelector
          activeDevice={activeDevice}
          onChange={(device) => setAttributes({ activeDevice: device })}
        />
      </PanelBody>

      <UltimateControlTabs
        spacing={settings.spacing || {}}
        onSpacingChange={(spacing) => setAttributes({
          settings: { ...settings, spacing }
        })}
        
        margins={settings.margins || {}}
        onMarginsChange={(margins) => setAttributes({
          settings: { ...settings, margins }
        })}
        
        blockSpacing={settings.blockSpacing || {}}
        onBlockSpacingChange={(blockSpacing) => setAttributes({
          settings: { ...settings, blockSpacing }  
        })}
        
        background={settings.backgroundColor}
        onBackgroundChange={(backgroundColor) => setAttributes({
          settings: { ...settings, backgroundColor }
        })}
        
        textColor={settings.textColor}
        onTextColorChange={(textColor) => setAttributes({
          settings: { ...settings, textColor }
        })}
        
        gradients={settings.gradients || {}}
        onGradientsChange={(gradients) => setAttributes({
          settings: { ...settings, gradients }
        })}
        
        typography={settings.typography || {}}
        onTypographyChange={(typography) => setAttributes({
          settings: { ...settings, typography }
        })}
        
        layout={settings.layout || {}}
        onLayoutChange={(layout) => setAttributes({
          settings: { ...settings, layout }
        })}
        
        effects={settings.effects || {}}
        onEffectsChange={(effects) => setAttributes({
          settings: { ...settings, effects }
        })}
        
        device={activeDevice}
        onPresetApply={(presetKey) => {
          // Handle preset application
        }}
      />
    </>
  )

  // Advanced controls (optional)
  const advancedControls = (
    <>
      <PanelBody title={__('Performance', 'tailwind-starter')} initialOpen={true}>
        {/* Performance-related settings */}
      </PanelBody>
      
      <PanelBody title={__('Custom CSS', 'tailwind-starter')} initialOpen={false}>
        {/* Custom CSS and advanced options */}
      </PanelBody>
    </>
  )

  const blockProps = useBlockProps({
    className: generateAllClasses(settings)
  })

  return (
    <>
      <InspectorControls>
        <InspectorTabs
          variant="horizontal"
          blockControls={blockControls}
          generalControls={generalControls}
          advancedControls={advancedControls}
          initialTab="block"
        />
      </InspectorControls>

      {/* Your block content here */}
      <div {...blockProps}>
        {/* Block rendering */}
      </div>
    </>
  )
}
```

## Quick Migration Steps

1. **Add Import**: Add `InspectorTabs` import to your block
2. **Wrap Existing**: Wrap existing PanelBody components in appropriate tab sections
3. **Move Visual Controls**: Move `UltimateControlTabs` to `generalControls`
4. **Add Device Selector**: Include device selector in general controls
5. **Test**: Verify all controls work correctly

## Common Issues & Solutions

### Issue: "blockSpacing is not a function" Error
**Solution**: Ensure all blocks have the blockSpacing props:
```jsx
blockSpacing={settings.blockSpacing || {}}
onBlockSpacingChange={(blockSpacing) => setAttributes({
  settings: { ...settings, blockSpacing }
})}
```

### Issue: Controls Not Appearing
**Solution**: Check that controls are wrapped in `<>` fragments and properly nested within tab sections.

### Issue: Device Selector Not Working
**Solution**: Ensure `activeDevice` is included in attributes and passed to UltimateControlTabs.

## Testing Checklist

For each implemented block:
- [ ] Block tab shows block-specific controls
- [ ] General tab shows visual design controls  
- [ ] Device selector works correctly
- [ ] Spacing patterns work without errors
- [ ] All visual controls function properly
- [ ] Block renders correctly in editor and frontend

## Build and Deploy

After implementing tabs in all blocks:

```bash
npm run build
```

Check for any build errors and test each block in the Gutenberg editor.

This systematic approach ensures consistent implementation across all blocks while maintaining the separation between block-specific and general visual controls.