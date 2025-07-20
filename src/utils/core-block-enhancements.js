import { addFilter } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment, createElement } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'
import { 
  UltimateDeviceSelector,
  UltimateControlTabs,
  generateTailwindClasses,
  generateAllClasses,
  generateAllInlineStyles
} from './visual-controls.js'
import { getBlockPresets } from './block-specific-controls.js'

// Core block names that we want to enhance
const ENHANCED_BLOCKS = [
  'core/heading',
  'core/paragraph', 
  'core/button',
  'core/image',
  'core/columns',
  'core/group',
  'core/list',
  'core/quote',
  'core/spacer',
  'core/separator'
]

/**
 * Add visual enhancement attributes to core blocks
 */
function addVisualAttributes(settings, name) {
  if (!ENHANCED_BLOCKS.includes(name)) {
    return settings
  }

  console.log(`📝 Adding visual attributes to ${name}`)

  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      visualSettings: {
        type: 'object',
        default: {
          spacing: {
            base: { top: 0, right: 0, bottom: 0, left: 0 },
            sm: { top: 0, right: 0, bottom: 0, left: 0 },
            md: { top: 0, right: 0, bottom: 0, left: 0 },
            lg: { top: 0, right: 0, bottom: 0, left: 0 },
            xl: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          typography: {
            base: { fontSize: '', fontWeight: '', textAlign: '' },
            sm: { fontSize: '', fontWeight: '', textAlign: '' },
            md: { fontSize: '', fontWeight: '', textAlign: '' },
            lg: { fontSize: '', fontWeight: '', textAlign: '' },
            xl: { fontSize: '', fontWeight: '', textAlign: '' }
          },
          layout: {
            base: { 
              width: '', 
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: ''
            },
            sm: { 
              width: '', 
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: ''
            },
            md: { 
              width: '', 
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: ''
            },
            lg: { 
              width: '', 
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: ''
            },
            xl: { 
              width: '', 
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: ''
            }
          },
          backgroundColor: '',
          textColor: ''
        }
      },
      activeDevice: {
        type: 'string',
        default: 'base'
      }
    }
  }
}

/**
 * Add visual controls to block editor using Higher Order Component
 */
const withVisualControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    const { name, attributes, setAttributes } = props
    
    // Only add to enhanced blocks
    if (!ENHANCED_BLOCKS.includes(name)) {
      return createElement(BlockEdit, props)
    }

    console.log(`🎨 Adding visual controls panel to ${name}`)

    const { visualSettings = {}, activeDevice = 'base' } = attributes

    // Get block-specific presets
    const presets = getBlockPresets(name)

    const handlePresetApply = (presetName) => {
      const preset = presets[presetName]
      if (preset) {
        setAttributes({ visualSettings: preset })
      }
    }

    // Generate classes for all devices
    const allClasses = generateAllClasses(visualSettings)
    const inlineStyles = generateAllInlineStyles(visualSettings)

    // Generate preview classes (just base for editor)
    const previewClasses = generateTailwindClasses(visualSettings, 'base')

    return createElement(Fragment, null,
      // Original block edit component
      createElement(BlockEdit, props),
      
      // Add our visual controls as additional inspector controls
      createElement(InspectorControls, null,
        createElement(PanelBody, {
          title: __('📱 Visual Design Controls', 'tailwind-starter'),
          initialOpen: false,
          className: 'tailwind-visual-controls-panel'
        },
          createElement(UltimateDeviceSelector, {
            activeDevice: activeDevice,
            onChange: (device) => setAttributes({ activeDevice: device })
          }),
          
          createElement('div', {
            style: { 
              background: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '8px', 
              padding: '12px', 
              margin: '12px 0',
              fontSize: '12px',
              color: '#1e40af'
            }
          },
            createElement('strong', null, '💡 Pro Tip: '),
            'Use these controls to add professional styling to this block!'
          ),
          
          createElement(UltimateControlTabs, {
            spacing: visualSettings.spacing || {},
            onSpacingChange: (spacing) => setAttributes({
              visualSettings: { ...visualSettings, spacing }
            }),
            background: visualSettings.backgroundColor,
            onBackgroundChange: (backgroundColor) => setAttributes({
              visualSettings: { ...visualSettings, backgroundColor }
            }),
            textColor: visualSettings.textColor,
            onTextColorChange: (textColor) => setAttributes({
              visualSettings: { ...visualSettings, textColor }
            }),
            typography: visualSettings.typography || {},
            onTypographyChange: (typography) => setAttributes({
              visualSettings: { ...visualSettings, typography }
            }),
            layout: visualSettings.layout || {},
            onLayoutChange: (layout) => setAttributes({
              visualSettings: { ...visualSettings, layout }
            }),
            device: activeDevice,
            presets: presets,
            onPresetApply: handlePresetApply
          }),

          createElement('div', {
            style: {
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '11px',
              marginTop: '16px'
            }
          },
            createElement('strong', null, '🔧 Generated Output: '),
            createElement('br'),
            allClasses && createElement('div', { style: { marginBottom: '8px' } },
              createElement('strong', { style: { fontSize: '10px', color: '#374151' } }, 'Classes: '),
              createElement('code', {
                style: { wordBreak: 'break-all', fontSize: '10px', color: '#6b7280' }
              }, allClasses)
            ),
            Object.keys(inlineStyles).length > 0 && createElement('div', null,
              createElement('strong', { style: { fontSize: '10px', color: '#374151' } }, 'Inline Styles: '),
              createElement('code', {
                style: { wordBreak: 'break-all', fontSize: '10px', color: '#6b7280' }
              }, JSON.stringify(inlineStyles, null, 2))
            ),
            !allClasses && Object.keys(inlineStyles).length === 0 && createElement('code', {
              style: { fontSize: '10px', color: '#6b7280' }
            }, 'No styles applied')
          )
        )
      )
    )
  }
}, 'withVisualControls')

/**
 * Add visual classes and inline styles to the block wrapper
 */
function addVisualClasses(BlockListBlock) {
  return (props) => {
    const { name, attributes } = props
    
    if (!ENHANCED_BLOCKS.includes(name)) {
      return createElement(BlockListBlock, props)
    }

    const { visualSettings = {} } = attributes
    const allClasses = generateAllClasses(visualSettings)
    const inlineStyles = generateAllInlineStyles(visualSettings)
    
    const newProps = {
      ...props,
      className: `${props.className || ''} ${allClasses || ''}`.trim(),
      style: {
        ...(props.style || {}),
        ...inlineStyles
      }
    }
    
    return createElement(BlockListBlock, newProps)
  }
}

/**
 * Add visual classes and inline styles to saved content
 */
function addVisualClassesToSave(element, blockType, attributes) {
  if (!ENHANCED_BLOCKS.includes(blockType.name)) {
    return element
  }

  const { visualSettings = {} } = attributes
  const allClasses = generateAllClasses(visualSettings)
  const inlineStyles = generateAllInlineStyles(visualSettings)
  
  if ((allClasses || Object.keys(inlineStyles).length > 0) && element && element.props) {
    const existingClassName = element.props.className || ''
    const newClassName = `${existingClassName} ${allClasses || ''}`.trim()
    
    return {
      ...element,
      props: {
        ...element.props,
        className: newClassName,
        style: {
          ...(element.props.style || {}),
          ...inlineStyles
        }
      }
    }
  }
  
  return element
}

/**
 * Initialize core block enhancements - simple, direct approach
 */
export function initCoreBlockEnhancements() {
  console.log('🎨 Setting up visual controls for core blocks...')
  
  // 1. Add visual attributes to blocks
  addFilter(
    'blocks.registerBlockType',
    'tailwind-starter/visual-attributes',
    addVisualAttributes
  )
  
  // 2. Add visual controls to editor using HOC
  addFilter(
    'editor.BlockEdit',
    'tailwind-starter/visual-controls',
    withVisualControls
  )
  
  // 3. Add classes to block wrapper in editor
  addFilter(
    'editor.BlockListBlock',
    'tailwind-starter/visual-wrapper',
    addVisualClasses
  )
  
  // 4. Add classes to saved content
  addFilter(
    'blocks.getSaveElement',
    'tailwind-starter/visual-save',
    addVisualClassesToSave
  )
  
  console.log('✅ Visual controls ready for:', ENHANCED_BLOCKS.join(', '))
}

export default initCoreBlockEnhancements