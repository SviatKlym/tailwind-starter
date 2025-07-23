import React from 'react'
import { 
  useBlockProps, 
  InspectorControls,
  RichText 
} from '@wordpress/block-editor'
import { 
  TextControl,
  TextareaControl,
  ToggleControl,
  SelectControl,
  RangeControl,
  PanelBody
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

// Import our new tabbed interface
import { BlockInspectorTabs } from './BlockInspectorTabs'
import { UltimateControlTabs, UltimateDeviceSelector } from '../utils/visual-controls'

/**
 * Example block demonstrating the new tabbed inspector interface
 */
export default function ExampleBlockEdit({ attributes, setAttributes }) {
  const {
    title,
    content,
    buttonText,
    buttonUrl,
    showButton,
    columns,
    enableAnalytics,
    customClass,
    settings = {}
  } = attributes

  const [device, setDevice] = React.useState('base')

  const blockProps = useBlockProps({
    className: `example-block ${customClass || ''}`.trim()
  })

  return (
    <>
      <InspectorControls>
        <BlockInspectorTabs
          variant="horizontal" // Change to "vertical" or "icons" as needed
          
          generalControls={
            <>
              {/* Device Selector for Responsive Controls */}
              <UltimateDeviceSelector
                activeDevice={device}
                onChange={setDevice}
              />
              
              {/* Visual Controls (Spacing, Colors, Typography, etc.) */}
              <UltimateControlTabs
                device={device}
                
                // Spacing Controls
                spacing={settings.spacing}
                onSpacingChange={(spacing) => setAttributes({
                  settings: { ...settings, spacing }
                })}
                
                margins={settings.margins}
                onMarginsChange={(margins) => setAttributes({
                  settings: { ...settings, margins }
                })}
                
                blockSpacing={settings.blockSpacing}
                onBlockSpacingChange={(blockSpacing) => setAttributes({
                  settings: { ...settings, blockSpacing }
                })}
                
                // Colors
                background={settings.backgroundColor}
                onBackgroundChange={(backgroundColor) => setAttributes({
                  settings: { ...settings, backgroundColor }
                })}
                
                textColor={settings.textColor}
                onTextColorChange={(textColor) => setAttributes({
                  settings: { ...settings, textColor }
                })}
                
                gradients={settings.gradients}
                onGradientsChange={(gradients) => setAttributes({
                  settings: { ...settings, gradients }
                })}
                
                // Typography
                typography={settings.typography}
                onTypographyChange={(typography) => setAttributes({
                  settings: { ...settings, typography }
                })}
                
                // Layout
                layout={settings.layout}
                onLayoutChange={(layout) => setAttributes({
                  settings: { ...settings, layout }
                })}
                
                // Effects
                effects={settings.effects}
                onEffectsChange={(effects) => setAttributes({
                  settings: { ...settings, effects }
                })}
                
                // Presets
                onPresetApply={(presetKey) => {
                  // Apply preset logic here
                  console.log('Applying preset:', presetKey)
                }}
              />
            </>
          }
          
          blockControls={
            <>
              <PanelBody title={__('Content Settings', 'tailwind-starter')} initialOpen={true}>
                <TextControl
                  label={__('Block Title', 'tailwind-starter')}
                  value={title}
                  onChange={(title) => setAttributes({ title })}
                  help={__('Enter the main title for this block', 'tailwind-starter')}
                />
                
                <TextareaControl
                  label={__('Content', 'tailwind-starter')}
                  value={content}
                  onChange={(content) => setAttributes({ content })}
                  help={__('Add your main content text', 'tailwind-starter')}
                  rows={4}
                />
              </PanelBody>

              <PanelBody title={__('Button Settings', 'tailwind-starter')} initialOpen={false}>
                <ToggleControl
                  label={__('Show Button', 'tailwind-starter')}
                  checked={showButton}
                  onChange={(showButton) => setAttributes({ showButton })}
                />
                
                {showButton && (
                  <>
                    <TextControl
                      label={__('Button Text', 'tailwind-starter')}
                      value={buttonText}
                      onChange={(buttonText) => setAttributes({ buttonText })}
                      placeholder={__('Click here', 'tailwind-starter')}
                    />
                    
                    <TextControl
                      label={__('Button URL', 'tailwind-starter')}
                      value={buttonUrl}
                      onChange={(buttonUrl) => setAttributes({ buttonUrl })}
                      placeholder="https://"
                      type="url"
                    />
                  </>
                )}
              </PanelBody>

              <PanelBody title={__('Layout Options', 'tailwind-starter')} initialOpen={false}>
                <RangeControl
                  label={__('Columns', 'tailwind-starter')}
                  value={columns}
                  onChange={(columns) => setAttributes({ columns })}
                  min={1}
                  max={4}
                  help={__('Number of columns to display content in', 'tailwind-starter')}
                />
              </PanelBody>
            </>
          }
          
          advancedControls={
            <>
              <PanelBody title={__('Performance', 'tailwind-starter')} initialOpen={true}>
                <ToggleControl
                  label={__('Enable Analytics Tracking', 'tailwind-starter')}
                  checked={enableAnalytics}
                  onChange={(enableAnalytics) => setAttributes({ enableAnalytics })}
                  help={__('Track user interactions with this block', 'tailwind-starter')}
                />
              </PanelBody>

              <PanelBody title={__('Custom CSS', 'tailwind-starter')} initialOpen={false}>
                <TextControl
                  label={__('Additional CSS Class', 'tailwind-starter')}
                  value={customClass}
                  onChange={(customClass) => setAttributes({ customClass })}
                  help={__('Add custom CSS classes for advanced styling', 'tailwind-starter')}
                />
              </PanelBody>

              <PanelBody title={__('Accessibility', 'tailwind-starter')} initialOpen={false}>
                <SelectControl
                  label={__('ARIA Role', 'tailwind-starter')}
                  value={settings.ariaRole || ''}
                  options={[
                    { label: __('Default', 'tailwind-starter'), value: '' },
                    { label: __('Section', 'tailwind-starter'), value: 'section' },
                    { label: __('Article', 'tailwind-starter'), value: 'article' },
                    { label: __('Aside', 'tailwind-starter'), value: 'aside' },
                    { label: __('Main', 'tailwind-starter'), value: 'main' }
                  ]}
                  onChange={(ariaRole) => setAttributes({
                    settings: { ...settings, ariaRole }
                  })}
                  help={__('Set semantic role for screen readers', 'tailwind-starter')}
                />
              </PanelBody>
            </>
          }
        />
      </InspectorControls>

      {/* Block Content */}
      <div {...blockProps}>
        <div className={`example-block-content grid grid-cols-${columns} gap-4`}>
          <div className="content-area">
            <RichText
              tagName="h2"
              className="block-title"
              value={title}
              onChange={(title) => setAttributes({ title })}
              placeholder={__('Enter title...', 'tailwind-starter')}
            />
            
            <RichText
              tagName="p"
              className="block-content"
              value={content}
              onChange={(content) => setAttributes({ content })}
              placeholder={__('Enter content...', 'tailwind-starter')}
            />
            
            {showButton && buttonText && (
              <a 
                href={buttonUrl || '#'} 
                className="block-button bg-blue-600 text-white px-4 py-2 rounded inline-block mt-4"
              >
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}