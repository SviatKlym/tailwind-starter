import React from 'react'
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor'
import { PanelBody, TextControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { 
  UltimateDeviceSelector,
  UltimateControlTabs,
  generateTailwindClasses,
  generateAllClasses
} from '../../utils/visual-controls.js'

export default function Edit({ attributes, setAttributes }) {
  const { 
    title, 
    content, 
    buttonText, 
    buttonUrl, 
    settings,
    activeDevice
  } = attributes

  const blockProps = useBlockProps()

  // Enhanced preset styles
  const presets = {
    card: {
      spacing: { base: { top: 6, right: 6, bottom: 6, left: 6 } },
      typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
      backgroundColor: 'bg-white',
      textColor: 'text-gray-900'
    },
    hero: {
      spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
      typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
      backgroundColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    minimal: {
      spacing: { base: { top: 3, right: 3, bottom: 3, left: 3 } },
      typography: { base: { fontSize: 'text-sm', fontWeight: 'font-light', textAlign: 'text-left' } },
      backgroundColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    },
    bold: {
      spacing: { base: { top: 8, right: 8, bottom: 8, left: 8 } },
      typography: { base: { fontSize: 'text-xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
      backgroundColor: 'bg-black',
      textColor: 'text-white'
    },
    feature: {
      spacing: { base: { top: 6, right: 6, bottom: 6, left: 6 } },
      typography: { base: { fontSize: 'text-lg', fontWeight: 'font-medium', textAlign: 'text-left' } },
      backgroundColor: 'bg-green-50',
      textColor: 'text-green-900'
    },
    quote: {
      spacing: { base: { top: 6, right: 8, bottom: 6, left: 8 } },
      typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-center' } },
      backgroundColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    }
  }

  const handlePresetApply = (presetName) => {
    const preset = presets[presetName]
    if (preset) {
      setAttributes({ settings: preset })
    }
  }

  // Generate classes for all devices
  const allClasses = generateAllClasses(settings)

  // Generate preview classes (just base for editor)
  const previewClasses = generateTailwindClasses(settings, 'base')

  return (
    <>
      <InspectorControls>
        {/* Device Selector */}
        <PanelBody title={__('📱 Responsive Design', 'tailwind-starter')} initialOpen={true}>
          <UltimateDeviceSelector
            activeDevice={activeDevice}
            onChange={(device) => setAttributes({ activeDevice: device })}
          />
          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '8px', 
            padding: '12px', 
            margin: '12px 0',
            fontSize: '12px',
            color: '#1e40af'
          }}>
            <strong>💡 Pro Tip:</strong> Start with "All" devices for your base design, then customize for mobile/tablet as needed!
          </div>
        </PanelBody>

        {/* Content Settings */}
        <PanelBody title={__('📝 Content', 'tailwind-starter')} initialOpen={false}>
          <TextControl
            label={__('Button Link', 'tailwind-starter')}
            value={buttonUrl}
            onChange={(value) => setAttributes({ buttonUrl: value })}
            placeholder="https://example.com"
            help={__('Where should the button go?', 'tailwind-starter')}
          />
        </PanelBody>

        {/* Ultimate Visual Controls */}
        <PanelBody title={__('🎨 Visual Design Studio', 'tailwind-starter')} initialOpen={true}>
          <UltimateControlTabs
            spacing={settings.spacing || {}}
            onSpacingChange={(spacing) => setAttributes({
              settings: { ...settings, spacing }
            })}
            background={settings.backgroundColor}
            onBackgroundChange={(backgroundColor) => setAttributes({
              settings: { ...settings, backgroundColor }
            })}
            textColor={settings.textColor}
            onTextColorChange={(textColor) => setAttributes({
              settings: { ...settings, textColor }
            })}
            typography={settings.typography || {}}
            onTypographyChange={(typography) => setAttributes({
              settings: { ...settings, typography }
            })}
            device={activeDevice}
            presets={presets}
            onPresetApply={handlePresetApply}
          />
        </PanelBody>

        {/* Advanced Info */}
        <PanelBody title={__('🚀 Advanced', 'tailwind-starter')} initialOpen={false}>
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '12px'
          }}>
            <strong>💎 Generated Classes:</strong>
            <br />
            <code style={{ wordBreak: 'break-all', fontSize: '10px' }}>
              {allClasses || 'No custom styles yet'}
            </code>
          </div>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div 
          className={`visual-block rounded-lg transition-all duration-300 ${previewClasses}`}
          style={{ 
            minHeight: '140px',
            position: 'relative',
            border: '2px dashed #e5e7eb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          data-classes={previewClasses}
          data-all-classes={allClasses}
        >
          {/* Device indicator */}
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            background: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '9px',
            fontWeight: '600',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {activeDevice === 'base' ? '🖥️ ALL' : `📱 ${activeDevice.toUpperCase()}`}
          </div>

          <RichText
            tagName="h2"
            value={title}
            onChange={(value) => setAttributes({ title: value })}
            placeholder={__('Enter your title...', 'tailwind-starter')}
            className="mb-3"
            style={{ outline: 'none' }}
          />
          
          <RichText
            tagName="p"
            value={content}
            onChange={(value) => setAttributes({ content: value })}
            placeholder={__('Enter your content...', 'tailwind-starter')}
            className="mb-4 leading-relaxed"
            style={{ outline: 'none' }}
          />
          
          <RichText
            tagName="span"
            value={buttonText}
            onChange={(value) => setAttributes({ buttonText: value })}
            placeholder={__('Button text...', 'tailwind-starter')}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium text-sm cursor-pointer"
            style={{ outline: 'none' }}
          />
        </div>
      </div>
    </>
  )
}