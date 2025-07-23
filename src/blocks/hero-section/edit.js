import React from 'react'
import { 
  useBlockProps, 
  RichText, 
  InspectorControls,
  MediaUpload,
  MediaUploadCheck
} from '@wordpress/block-editor'
import { 
  PanelBody, 
  SelectControl,
  TextControl,
  ToggleControl,
  Button,
  ButtonGroup,
  __experimentalVStack as VStack
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { 
  UltimateDeviceSelector,
  UltimateControlTabs,
  generateAllClasses,
  generateTailwindClasses
} from '../../utils/visual-controls.js'
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js'

export default function Edit({ attributes, setAttributes }) {
  const {
    layout,
    headline,
    subheadline,
    primaryCTA,
    secondaryCTA,
    showSecondaryCTA,
    backgroundImage,
    backgroundColor,
    textColor,
    heroImage,
    showTrustBar,
    trustLogos,
    trustText,
    padding,
    titleFontSize,
    titleFontWeight,
    subtitleFontSize,
    titleMarginBottom,
    subtitleMarginBottom,
    contentMaxWidth,
    contentAlignment,
    contentPadding,
    buttonSpacing,
    primaryButtonStyle,
    secondaryButtonStyle,
    animationDuration,
    hoverEffects,
    settings,
    activeDevice
  } = attributes

  // Enhanced preset styles for hero sections
  const presets = {
    classic: {
      spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
      typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
      backgroundColor: 'bg-white',
      textColor: 'text-gray-900'
    },
    modern: {
      spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
      typography: { base: { fontSize: 'text-3xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
      backgroundColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    minimal: {
      spacing: { base: { top: 6, right: 4, bottom: 6, left: 4 } },
      typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-normal', textAlign: 'text-left' } },
      backgroundColor: 'bg-gray-50',
      textColor: 'text-gray-900'
    },
    bold: {
      spacing: { base: { top: 16, right: 8, bottom: 16, left: 8 } },
      typography: { base: { fontSize: 'text-4xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
      backgroundColor: 'bg-black',
      textColor: 'text-white'
    },
    gradient: {
      spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
      typography: { base: { fontSize: 'text-3xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
      backgroundColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
      textColor: 'text-white'
    },
    soft: {
      spacing: { base: { top: 8, right: 6, bottom: 8, left: 6 } },
      typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-medium', textAlign: 'text-center' } },
      backgroundColor: 'bg-blue-50',
      textColor: 'text-blue-900'
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
  const previewClasses = generateAllClasses(settings || {})

  const blockProps = useBlockProps({
    className: `hero-section hero-section--${layout} ${backgroundColor} ${textColor} ${previewClasses}`,
    'data-classes': previewClasses,
    'data-all-classes': allClasses
  })

  const layoutOptions = [
    { label: 'Centered', value: 'centered' },
    { label: 'Split Layout', value: 'split' },
    { label: 'Minimal', value: 'minimal' },
    { label: 'With Background', value: 'background' }
  ]

  const paddingOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'Extra Large', value: 'xlarge' }
  ]

  const colorOptions = [
    { label: 'White', value: 'bg-white' },
    { label: 'Gray 50', value: 'bg-gray-50' },
    { label: 'Blue 50', value: 'bg-blue-50' },
    { label: 'Blue 600', value: 'bg-blue-600' },
    { label: 'Gray 900', value: 'bg-gray-900' }
  ]

  const textColorOptions = [
    { label: 'Gray 900', value: 'text-gray-900' },
    { label: 'Gray 700', value: 'text-gray-700' },
    { label: 'White', value: 'text-white' },
    { label: 'Blue 600', value: 'text-blue-600' }
  ]

  const getPaddingClass = (size) => {
    const paddingMap = {
      small: 'py-8 sm:py-12',
      medium: 'py-12 sm:py-16',
      large: 'py-16 sm:py-24',
      xlarge: 'py-24 sm:py-32'
    }
    return paddingMap[size] || paddingMap.large
  }

  const updateCTA = (type, field, value) => {
    const cta = type === 'primary' ? primaryCTA : secondaryCTA
    const newCTA = { ...cta, [field]: value }
    
    if (type === 'primary') {
      setAttributes({ primaryCTA: newCTA })
    } else {
      setAttributes({ secondaryCTA: newCTA })
    }
  }

  const renderCenteredLayout = () => (
    <div className={`${getPaddingClass(padding.top)} relative`}>
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage.url})`,
            opacity: 0.1 
          }}
        />
      )}
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <RichText
            tagName="h1"
            value={headline}
            onChange={(value) => setAttributes({ headline: value })}
            placeholder={__('Enter headline...', 'tailwind-starter')}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          />
          <RichText
            tagName="p"
            value={subheadline}
            onChange={(value) => setAttributes({ subheadline: value })}
            placeholder={__('Enter subheadline...', 'tailwind-starter')}
            className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn btn-primary btn-lg px-8 py-4">
              {primaryCTA.text}
            </button>
            {showSecondaryCTA && (
              <button className="btn btn-secondary btn-lg px-8 py-4">
                {secondaryCTA.text}
              </button>
            )}
          </div>
        </div>
        
        {showTrustBar && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-6">{trustText}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {trustLogos.length > 0 ? (
                trustLogos.map((logo, index) => (
                  <img 
                    key={index}
                    src={logo.url} 
                    alt={logo.alt}
                    className="h-8 grayscale"
                  />
                ))
              ) : (
                <div className="text-gray-400 text-sm">Add trust logos in the sidebar</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSplitLayout = () => (
    <div className={`${getPaddingClass(padding.top)} relative`}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <RichText
              tagName="h1"
              value={headline}
              onChange={(value) => setAttributes({ headline: value })}
              placeholder={__('Enter headline...', 'tailwind-starter')}
              className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            />
            <RichText
              tagName="p"
              value={subheadline}
              onChange={(value) => setAttributes({ subheadline: value })}
              placeholder={__('Enter subheadline...', 'tailwind-starter')}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn btn-primary btn-lg px-8 py-4">
                {primaryCTA.text}
              </button>
              {showSecondaryCTA && (
                <button className="btn btn-outline btn-lg px-8 py-4">
                  {secondaryCTA.text}
                </button>
              )}
            </div>
          </div>
          <div className="lg:text-right">
            {heroImage ? (
              <img 
                src={heroImage.url} 
                alt={heroImage.alt}
                className="w-full max-w-lg ml-auto rounded-lg shadow-2xl"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <span className="text-gray-500">Hero Image Placeholder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderLayout = () => {
    switch (layout) {
      case 'split':
        return renderSplitLayout()
      case 'minimal':
        return (
          <div className={`${getPaddingClass(padding.top)} text-center`}>
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <RichText
                  tagName="h1"
                  value={headline}
                  onChange={(value) => setAttributes({ headline: value })}
                  placeholder={__('Enter headline...', 'tailwind-starter')}
                  className="text-3xl sm:text-4xl font-bold mb-4"
                />
                <RichText
                  tagName="p"
                  value={subheadline}
                  onChange={(value) => setAttributes({ subheadline: value })}
                  placeholder={__('Enter subheadline...', 'tailwind-starter')}
                  className="text-lg text-gray-600 mb-6"
                />
                <button className="btn btn-primary px-6 py-3">
                  {primaryCTA.text}
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return renderCenteredLayout()
    }
  }

  // Block-specific controls
  const blockControls = (
    <>
      <PanelBody title={__('Layout Settings', 'tailwind-starter')} initialOpen={true}>
        <VStack spacing={4}>
          <SelectControl
            label={__('Layout Type', 'tailwind-starter')}
            value={layout}
            options={layoutOptions}
            onChange={(value) => setAttributes({ layout: value })}
          />
          
          <SelectControl
            label={__('Padding Size', 'tailwind-starter')}
            value={padding.top}
            options={paddingOptions}
            onChange={(value) => setAttributes({ 
              padding: { ...padding, top: value, bottom: value }
            })}
          />
        </VStack>
      </PanelBody>

      <PanelBody title={__('Call to Action Buttons', 'tailwind-starter')} initialOpen={false}>
        <VStack spacing={4}>
          <TextControl
            label={__('Primary CTA Text', 'tailwind-starter')}
            value={primaryCTA.text}
            onChange={(value) => updateCTA('primary', 'text', value)}
          />
          
          <TextControl
            label={__('Primary CTA URL', 'tailwind-starter')}
            value={primaryCTA.url}
            onChange={(value) => updateCTA('primary', 'url', value)}
          />
          
          <ToggleControl
            label={__('Show Secondary CTA', 'tailwind-starter')}
            checked={showSecondaryCTA}
            onChange={(value) => setAttributes({ showSecondaryCTA: value })}
          />
          
          {showSecondaryCTA && (
            <>
              <TextControl
                label={__('Secondary CTA Text', 'tailwind-starter')}
                value={secondaryCTA.text}
                onChange={(value) => updateCTA('secondary', 'text', value)}
              />
              
              <TextControl
                label={__('Secondary CTA URL', 'tailwind-starter')}
                value={secondaryCTA.url}
                onChange={(value) => updateCTA('secondary', 'url', value)}
              />
            </>
          )}
        </VStack>
      </PanelBody>

      {(layout === 'split' || layout === 'background') && (
        <PanelBody title={__('Images', 'tailwind-starter')} initialOpen={false}>
          <VStack spacing={4}>
            {layout === 'split' && (
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => setAttributes({ heroImage: media })}
                  allowedTypes={['image']}
                  value={heroImage?.id}
                  render={({ open }) => (
                    <Button 
                      onClick={open}
                      variant="secondary"
                    >
                      {heroImage ? __('Replace Hero Image', 'tailwind-starter') : __('Select Hero Image', 'tailwind-starter')}
                    </Button>
                  )}
                />
              </MediaUploadCheck>
            )}
            
            {layout === 'background' && (
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => setAttributes({ backgroundImage: media })}
                  allowedTypes={['image']}
                  value={backgroundImage?.id}
                  render={({ open }) => (
                    <Button 
                      onClick={open}
                      variant="secondary"
                    >
                      {backgroundImage ? __('Replace Background Image', 'tailwind-starter') : __('Select Background Image', 'tailwind-starter')}
                    </Button>
                  )}
                />
              </MediaUploadCheck>
            )}
          </VStack>
        </PanelBody>
      )}

      <PanelBody title={__('Trust Bar', 'tailwind-starter')} initialOpen={false}>
        <ToggleControl
          label={__('Show Trust Bar', 'tailwind-starter')}
          checked={showTrustBar}
          onChange={(value) => setAttributes({ showTrustBar: value })}
        />
        
        {showTrustBar && (
          <TextControl
            label={__('Trust Text', 'tailwind-starter')}
            value={trustText}
            onChange={(value) => setAttributes({ trustText: value })}
          />
        )}
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
        presets={presets}
        onPresetApply={handlePresetApply}
      />

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
    </>
  )

  return (
    <>
      <InspectorControls>
        <SimpleInspectorTabs
          variant="horizontal"
          blockControls={blockControls}
          generalControls={generalControls}
          initialTab="block"
        />
      </InspectorControls>

      <div {...blockProps}>
        <div 
          className={`hero-section-container transition-all duration-300 ${previewClasses}`}
          style={{ 
            position: 'relative',
            border: '2px dashed #e5e7eb',
            borderRadius: '8px'
          }}
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
          
          {renderLayout()}
        </div>
      </div>
    </>
  )
}