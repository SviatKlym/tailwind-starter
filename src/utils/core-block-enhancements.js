import { addFilter } from '@wordpress/hooks'
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import { PanelBody, ToggleControl, RangeControl, SelectControl, Button, __experimentalVStack as VStack } from '@wordpress/components'
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
import { LazyControlWrapper, LazyTabPanel, useDebouncedValue } from './lazy-controls.js'
import { SimpleInspectorTabs } from '../components/InspectorTabs.js'

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

// Image-specific enhancements for mobile support and WebP
const IMAGE_ENHANCEMENTS = {
  mobileImage: {
    type: 'object',
    default: null
  },
  webpSupport: {
    type: 'boolean',
    default: true
  },
  responsiveBreakpoint: {
    type: 'string',
    default: 'md'
  }
}

// Spacer-specific responsive enhancements
const SPACER_ENHANCEMENTS = {
  responsiveHeight: {
    type: 'object',
    default: {
      base: 50,
      sm: 50,
      md: 50,
      lg: 50,
      xl: 50
    }
  }
}

/**
 * Add visual enhancement attributes to core blocks
 */
function addVisualAttributes(settings, name) {
  if (!ENHANCED_BLOCKS.includes(name)) {
    return settings
  }

  console.log(`📝 Adding visual attributes to ${name}`)

  let additionalAttributes = {}

  // Add image-specific enhancements
  if (name === 'core/image') {
    additionalAttributes = { ...additionalAttributes, ...IMAGE_ENHANCEMENTS }
  }

  // Add spacer-specific enhancements
  if (name === 'core/spacer') {
    additionalAttributes = { ...additionalAttributes, ...SPACER_ENHANCEMENTS }
  }

  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      ...additionalAttributes,
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
          margins: {
            base: { top: 0, right: 0, bottom: 0, left: 0 },
            sm: { top: 0, right: 0, bottom: 0, left: 0 },
            md: { top: 0, right: 0, bottom: 0, left: 0 },
            lg: { top: 0, right: 0, bottom: 0, left: 0 },
            xl: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          blockSpacing: {
            base: { variation: '' },
            sm: { variation: '' },
            md: { variation: '' },
            lg: { variation: '' },
            xl: { variation: '' }
          },
          typography: {
            base: {
              fontSize: '', fontWeight: '', textAlign: '',
              lineHeight: '', letterSpacing: '', textTransform: '', fontSmoothing: ''
            },
            sm: {
              fontSize: '', fontWeight: '', textAlign: '',
              lineHeight: '', letterSpacing: '', textTransform: '', fontSmoothing: ''
            },
            md: {
              fontSize: '', fontWeight: '', textAlign: '',
              lineHeight: '', letterSpacing: '', textTransform: '', fontSmoothing: ''
            },
            lg: {
              fontSize: '', fontWeight: '', textAlign: '',
              lineHeight: '', letterSpacing: '', textTransform: '', fontSmoothing: ''
            },
            xl: {
              fontSize: '', fontWeight: '', textAlign: '',
              lineHeight: '', letterSpacing: '', textTransform: '', fontSmoothing: ''
            }
          },
          layout: {
            base: {
              width: '',
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: '',
              gap: '',
              justifyContent: '',
              alignItems: '',
              position: '',
              zIndex: '',
              display: '',
              gridCols: '',
              gridRows: ''
            },
            sm: {
              width: '',
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: '',
              gap: '',
              justifyContent: '',
              alignItems: '',
              position: '',
              zIndex: '',
              display: '',
              gridCols: '',
              gridRows: ''
            },
            md: {
              width: '',
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: '',
              gap: '',
              justifyContent: '',
              alignItems: '',
              position: '',
              zIndex: '',
              display: '',
              gridCols: '',
              gridRows: ''
            },
            lg: {
              width: '',
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: '',
              gap: '',
              justifyContent: '',
              alignItems: '',
              position: '',
              zIndex: '',
              display: '',
              gridCols: '',
              gridRows: ''
            },
            xl: {
              width: '',
              height: '',
              customMaxWidth: '',
              customMinWidth: '',
              customHeight: '',
              customMaxHeight: '',
              customMinHeight: '',
              gap: '',
              justifyContent: '',
              alignItems: '',
              position: '',
              zIndex: '',
              display: '',
              gridCols: '',
              gridRows: ''
            }
          },
          effects: {
            base: {
              shadow: '',
              borderRadius: '',
              borderWidth: '',
              borderStyle: '',
              borderColor: '',
              hoverScale: '',
              hoverShadow: '',
              hoverOpacity: '',
              hoverRotate: '',
              hoverBgColor: '',
              entranceAnimation: '',
              scrollAnimation: '',
              transitionDuration: '',
              transitionEasing: ''
            },
            sm: {
              shadow: '',
              borderRadius: '',
              borderWidth: '',
              borderStyle: '',
              borderColor: '',
              hoverScale: '',
              hoverShadow: '',
              hoverOpacity: '',
              hoverRotate: '',
              hoverBgColor: '',
              entranceAnimation: '',
              scrollAnimation: '',
              transitionDuration: '',
              transitionEasing: ''
            },
            md: {
              shadow: '',
              borderRadius: '',
              borderWidth: '',
              borderStyle: '',
              borderColor: '',
              hoverScale: '',
              hoverShadow: '',
              hoverOpacity: '',
              hoverRotate: '',
              hoverBgColor: '',
              entranceAnimation: '',
              scrollAnimation: '',
              transitionDuration: '',
              transitionEasing: ''
            },
            lg: {
              shadow: '',
              borderRadius: '',
              borderWidth: '',
              borderStyle: '',
              borderColor: '',
              hoverScale: '',
              hoverShadow: '',
              hoverOpacity: '',
              hoverRotate: '',
              hoverBgColor: '',
              entranceAnimation: '',
              scrollAnimation: '',
              transitionDuration: '',
              transitionEasing: ''
            },
            xl: {
              shadow: '',
              borderRadius: '',
              borderWidth: '',
              borderStyle: '',
              borderColor: '',
              hoverScale: '',
              hoverShadow: '',
              hoverOpacity: '',
              hoverRotate: '',
              hoverBgColor: '',
              entranceAnimation: '',
              scrollAnimation: '',
              transitionDuration: '',
              transitionEasing: ''
            }
          },
          gradients: {
            base: {
              type: '',
              direction: '',
              fromColor: '',
              toColor: '',
              opacity: ''
            },
            sm: {
              type: '',
              direction: '',
              fromColor: '',
              toColor: '',
              opacity: ''
            },
            md: {
              type: '',
              direction: '',
              fromColor: '',
              toColor: '',
              opacity: ''
            },
            lg: {
              type: '',
              direction: '',
              fromColor: '',
              toColor: '',
              opacity: ''
            },
            xl: {
              type: '',
              direction: '',
              fromColor: '',
              toColor: '',
              opacity: ''
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

    const {
      visualSettings = {},
      activeDevice = 'base',
      mobileImage,
      webpSupport = true,
      responsiveBreakpoint = 'md',
      responsiveHeight = { base: 50, sm: 50, md: 50, lg: 50, xl: 50 }
    } = attributes

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

    // Block-specific controls (for Block tab)
    const blockControls = createElement(Fragment, null,

      // Image-specific enhancements
      name === 'core/image' && createElement(PanelBody, {
        title: __('📱 Enhanced Image Controls', 'tailwind-starter'),
        initialOpen: false
      },
        createElement(VStack, { spacing: 4 },
          createElement(ToggleControl, {
            label: __('WebP Support', 'tailwind-starter'),
            checked: webpSupport,
            onChange: (value) => setAttributes({ webpSupport: value }),
            help: __('Enable modern WebP format for better performance', 'tailwind-starter')
          }),

          createElement(SelectControl, {
            label: __('Mobile Breakpoint', 'tailwind-starter'),
            value: responsiveBreakpoint,
            options: [
              { label: 'Small (640px+)', value: 'sm' },
              { label: 'Medium (768px+)', value: 'md' },
              { label: 'Large (1024px+)', value: 'lg' }
            ],
            onChange: (value) => setAttributes({ responsiveBreakpoint: value }),
            help: __('Switch to mobile image at this breakpoint', 'tailwind-starter')
          }),

          createElement(MediaUploadCheck, null,
            createElement(MediaUpload, {
              onSelect: (media) => setAttributes({ mobileImage: media }),
              allowedTypes: ['image'],
              value: mobileImage?.id,
              render: ({ open }) => createElement(Button, {
                onClick: open,
                variant: 'secondary',
                className: 'enhanced-image-button'
              }, mobileImage ? __('Replace Mobile Image', 'tailwind-starter') : __('Set Mobile Image', 'tailwind-starter'))
            })
          ),

          mobileImage && createElement('div', {
            className: 'enhanced-image-preview-container'
          },
            createElement('img', {
              src: mobileImage.url,
              alt: mobileImage.alt || '',
              className: 'enhanced-image-preview'
            }),
            createElement('p', {
              className: 'enhanced-image-label'
            }, `📱 Mobile: ${mobileImage.alt || 'Mobile image'}`)
          )
        )
      ),

      // Spacer-specific enhancements  
      name === 'core/spacer' && createElement(PanelBody, {
        title: __('📐 Responsive Spacing Controls', 'tailwind-starter'),
        initialOpen: true,
        className: 'spacer-controls-panel'
      },
        // Hide the default ToolsPanel component with more specific CSS
        createElement('style', null, `
          .interface-interface-skeleton__sidebar [data-wp-component="ToolsPanel"],
          .block-editor-block-inspector [data-wp-component="ToolsPanel"],
          .spacer-controls-panel + * [data-wp-component="ToolsPanel"],
          div[data-wp-component="ToolsPanel"] {
            display: none !important;
          }
          .spacer-controls-panel {
            border: 2px solid #0073aa;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 16px;
          }
          .spacer-height-control {
            padding: 16px 0;
          }
          .spacer-height-control label {
            font-weight: 600;
            color: #1e1e1e;
            margin-bottom: 8px;
            display: block;
          }
        `),

        createElement(UltimateDeviceSelector, {
          activeDevice: activeDevice,
          onChange: (device) => setAttributes({ activeDevice: device })
        }),

        createElement('div', {
          className: 'spacer-height-control'
        },
          createElement('label', null, `Height for ${activeDevice === 'base' ? 'All Devices' : activeDevice.toUpperCase()}`),

          createElement(RangeControl, {
            value: responsiveHeight[activeDevice] || 50,
            onChange: (value) => {
              const newHeight = {
                ...responsiveHeight,
                [activeDevice]: value
              }
              setAttributes({ responsiveHeight: newHeight })
              
              // Force update the element height immediately with better selector
              setTimeout(() => {
                const spacerElements = document.querySelectorAll('.wp-block-spacer')
                spacerElements.forEach(spacerElement => {
                  if (spacerElement.closest('.block-editor-block-list__block.is-selected')) {
                    spacerElement.style.setProperty('height', `${value}px`, 'important')
                    spacerElement.style.setProperty('min-height', `${value}px`, 'important')
                  }
                })
              }, 50)
            },
            min: 10,
            max: 500,
            step: 5,
            help: `${responsiveHeight[activeDevice] || 50}px height`
          })
        ),

        createElement('div', {
          className: 'spacer-preview-container'
        },
          createElement('strong', null, '💡 Responsive Preview:'),
          createElement('div', {
            className: 'spacer-preview-values'
          },
            Object.entries(responsiveHeight).map(([device, height]) =>
              createElement('div', {
                key: device,
                style: { 
                  padding: '4px 8px',
                  backgroundColor: device === activeDevice ? '#0073aa' : '#f0f0f0',
                  color: device === activeDevice ? 'white' : '#333',
                  margin: '2px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }
              }, `${device.toUpperCase()}: ${height}px`)
            )
          )
        )
      )
    )

    // Design controls (for Design tab) - Fully integrated with visual-controls.js system
    const designControls = createElement(Fragment, null,
      createElement(PanelBody, {
        title: __('📱 Visual Design Controls', 'tailwind-starter'),
        initialOpen: true,
        className: 'tailwind-visual-controls-panel'
      },
        createElement(UltimateDeviceSelector, {
          activeDevice: activeDevice,
          onChange: (device) => setAttributes({ activeDevice: device })
        }),

        createElement('div', {
          className: 'visual-controls-tip'
        },
          createElement('strong', null, '💡 Pro Tip: '),
          'Use these responsive controls to add professional styling!'
        ),

        createElement(LazyControlWrapper, {
          componentName: 'VisualControlTabs',
          height: '500px'
        },
          createElement(UltimateControlTabs, {
            spacing: visualSettings.spacing || {},
            onSpacingChange: (spacing) => setAttributes({
              visualSettings: { ...visualSettings, spacing }
            }),
            margins: visualSettings.margins || {},
            onMarginsChange: (margins) => setAttributes({
              visualSettings: { ...visualSettings, margins }
            }),
            blockSpacing: visualSettings.blockSpacing || {},
            onBlockSpacingChange: (blockSpacing) => setAttributes({
              visualSettings: { ...visualSettings, blockSpacing }
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
            effects: visualSettings.effects || {},
            onEffectsChange: (effects) => setAttributes({
              visualSettings: { ...visualSettings, effects }
            }),
            gradients: visualSettings.gradients || {},
            onGradientsChange: (gradients) => setAttributes({
              visualSettings: { ...visualSettings, gradients }
            }),
            device: activeDevice,
            presets: presets,
            onPresetApply: handlePresetApply,
            onResetAll: () => {
              setAttributes({
                visualSettings: {
                  spacing: {
                    base: { top: 0, right: 0, bottom: 0, left: 0 },
                    sm: { top: 0, right: 0, bottom: 0, left: 0 },
                    md: { top: 0, right: 0, bottom: 0, left: 0 },
                    lg: { top: 0, right: 0, bottom: 0, left: 0 },
                    xl: { top: 0, right: 0, bottom: 0, left: 0 }
                  },
                  margins: {
                    base: { top: 0, right: 0, bottom: 0, left: 0 },
                    sm: { top: 0, right: 0, bottom: 0, left: 0 },
                    md: { top: 0, right: 0, bottom: 0, left: 0 },
                    lg: { top: 0, right: 0, bottom: 0, left: 0 },
                    xl: { top: 0, right: 0, bottom: 0, left: 0 }
                  },
                  blockSpacing: {},
                  typography: {},
                  layout: {},
                  effects: {},
                  gradients: {},
                  backgroundColor: '',
                  textColor: ''
                }
              })
            }
          })
        ),

        createElement('div', {
          className: 'visual-controls-output'
        },
          createElement('strong', null, '🔧 Generated Output: '),
          createElement('br'),
          allClasses && createElement('div', { className: 'output-classes' },
            createElement('strong', null, 'Classes: '),
            createElement('code', null, allClasses)
          ),
          Object.keys(inlineStyles).length > 0 && createElement('div', { className: 'output-styles' },
            createElement('strong', null, 'Inline Styles: '),
            createElement('code', null, JSON.stringify(inlineStyles, null, 2))
          ),
          !allClasses && Object.keys(inlineStyles).length === 0 && createElement('code', {
            className: 'output-empty'
          }, 'No styles applied')
        )
      )
    )


    return createElement(Fragment, null,
      // Original block edit component
      createElement(BlockEdit, props),

      // Add SimpleInspectorTabs structure
      createElement(InspectorControls, null,
        createElement(SimpleInspectorTabs, {
          blockControls: blockControls,
          generalControls: designControls
        })
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

    const {
      visualSettings = {},
      responsiveHeight = { base: 50, sm: 50, md: 50, lg: 50, xl: 50 }
    } = attributes

    const allClasses = generateAllClasses(visualSettings)
    const inlineStyles = generateAllInlineStyles(visualSettings)

    // Add responsive height styles for spacer blocks using inline styles for better reliability
    let additionalClasses = ''
    let spacerInlineStyles = {}
    if (name === 'core/spacer') {
      // Use inline styles for height to ensure they are applied
      const baseHeight = responsiveHeight.base || 50
      spacerInlineStyles = {
        height: `${baseHeight}px`,
        minHeight: `${baseHeight}px`,
        display: 'block',
        backgroundColor: '#f0f0f0',
        border: '1px dashed #ccc',
        position: 'relative'
      }
      
      // Add a visual indicator for the spacer
      if (typeof window !== 'undefined') {
        spacerInlineStyles['&::after'] = {
          content: `"Spacer: ${baseHeight}px"`,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '12px',
          color: '#666',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '2px 6px',
          borderRadius: '3px'
        }
      }
      
      // Also add Tailwind classes as backup and responsive styles
      const spacerClasses = Object.entries(responsiveHeight)
        .map(([device, height]) => {
          const prefix = device === 'base' ? '' : `${device}:`
          return `${prefix}h-[${height}px] ${prefix}min-h-[${height}px]`
        })
        .join(' ')
      additionalClasses = spacerClasses
    }

    const newProps = {
      ...props,
      className: `${props.className || ''} ${allClasses || ''} ${additionalClasses}`.trim(),
      style: {
        ...(props.style || {}),
        ...inlineStyles,
        ...spacerInlineStyles
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

  const {
    visualSettings = {},
    responsiveHeight = { base: 50, sm: 50, md: 50, lg: 50, xl: 50 }
  } = attributes

  const allClasses = generateAllClasses(visualSettings)
  const inlineStyles = generateAllInlineStyles(visualSettings)

  // Add responsive height styles for spacer blocks using inline styles for better reliability
  let additionalClasses = ''
  let spacerInlineStyles = {}
  if (blockType.name === 'core/spacer') {
    // Use inline styles for height to ensure they are applied
    const baseHeight = responsiveHeight.base || 50
    spacerInlineStyles = {
      height: `${baseHeight}px !important`,
      minHeight: `${baseHeight}px !important`,
      display: 'block !important'
    }
    
    // Also add Tailwind classes as backup and responsive styles
    const spacerClasses = Object.entries(responsiveHeight)
      .map(([device, height]) => {
        const prefix = device === 'base' ? '' : `${device}:`
        return `${prefix}h-[${height}px] ${prefix}min-h-[${height}px]`
      })
      .join(' ')
    additionalClasses = spacerClasses
  }

  if ((allClasses || additionalClasses || Object.keys(inlineStyles).length > 0 || Object.keys(spacerInlineStyles).length > 0) && element && element.props) {
    const existingClassName = element.props.className || ''
    const newClassName = `${existingClassName} ${allClasses || ''} ${additionalClasses}`.trim()

    return {
      ...element,
      props: {
        ...element.props,
        className: newClassName,
        style: {
          ...(element.props.style || {}),
          ...inlineStyles,
          ...spacerInlineStyles
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