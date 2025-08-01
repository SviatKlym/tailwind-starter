import React from 'react'
import { 
  useBlockProps, 
  RichText, 
  InspectorControls
} from '@wordpress/block-editor'
import { 
  PanelBody, 
  SelectControl,
  RangeControl,
  ToggleControl,
  Button,
  TextControl,
  TextareaControl,
  __experimentalVStack as VStack
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { plus, trash } from '@wordpress/icons'
import { 
  UltimateDeviceSelector,
  UltimateControlTabs,
  generateAllClasses, generateTailwindClasses
} from '../../utils/visual-controls.js'
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js'

export default function Edit({ attributes, setAttributes }) {
  const {
    features,
    columns,
    iconStyle,
    alignment,
    layout,
    backgroundColor,
    sectionTitle,
    sectionSubtitle,
    showSection,
    padding,
    gridGap,
    showImages,
    showTitles,
    showDescriptions,
    showButtons,
    cardStyle,
    imageStyle,
    titleFontSize,
    titleFontWeight,
    titleColor,
    titleHoverColor,
    titleMarginBottom,
    descriptionColor,
    descriptionMarginBottom,
    cardBackground,
    cardBorder,
    cardShadow,
    cardHoverShadow,
    cardPadding,
    buttonStyle,
    sectionHeaderStyle,
    highlightStyle,
    animationSpeed,
    hoverEffects,
		settings = {},
    activeDevice
  } = attributes

  // Enhanced preset styles for feature grids
  const presets = {
    modern: {
      spacing: { base: { top: 6, right: 6, bottom: 6, left: 6 } },
      typography: { base: { fontSize: 'text-lg', fontWeight: 'font-medium', textAlign: 'text-center' } },
      backgroundColor: 'bg-white',
      textColor: 'text-gray-900'
    },
    card: {
      spacing: { base: { top: 8, right: 6, bottom: 8, left: 6 } },
      typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-center' } },
      backgroundColor: 'bg-gray-50',
      textColor: 'text-gray-800'
    },
    highlight: {
      spacing: { base: { top: 8, right: 8, bottom: 8, left: 8 } },
      typography: { base: { fontSize: 'text-lg', fontWeight: 'font-semibold', textAlign: 'text-center' } },
      backgroundColor: 'bg-blue-50',
      textColor: 'text-blue-900'
    },
    minimal: {
      spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
      typography: { base: { fontSize: 'text-sm', fontWeight: 'font-normal', textAlign: 'text-left' } },
      backgroundColor: 'bg-white',
      textColor: 'text-gray-700'
    },
    bold: {
      spacing: { base: { top: 10, right: 8, bottom: 10, left: 8 } },
      typography: { base: { fontSize: 'text-xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
      backgroundColor: 'bg-gray-900',
      textColor: 'text-white'
    },
    soft: {
      spacing: { base: { top: 6, right: 6, bottom: 6, left: 6 } },
      typography: { base: { fontSize: 'text-base', fontWeight: 'font-medium', textAlign: 'text-center' } },
      backgroundColor: 'bg-green-50',
      textColor: 'text-green-900'
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
    className: `feature-grid feature-grid--${layout} ${previewClasses}`,
    'data-classes': previewClasses,
    'data-all-classes': allClasses
  })

  const columnOptions = [
    { label: '1 Column', value: 1 },
    { label: '2 Columns', value: 2 },
    { label: '3 Columns', value: 3 },
    { label: '4 Columns', value: 4 }
  ]

  const iconStyleOptions = [
    { label: 'Emoji', value: 'emoji' },
    { label: 'Circle Background', value: 'circle' },
    { label: 'Square Background', value: 'square' },
    { label: 'Minimal', value: 'minimal' }
  ]

  const alignmentOptions = [
    { label: 'Center', value: 'center' },
    { label: 'Left', value: 'left' }
  ]

  const layoutOptions = [
    { label: 'Card Style', value: 'card' },
    { label: 'Minimal', value: 'minimal' },
    { label: 'List Style', value: 'list' }
  ]

  const backgroundOptions = [
    { label: 'White', value: 'bg-white' },
    { label: 'Gray 50', value: 'bg-gray-50' },
    { label: 'Blue 50', value: 'bg-blue-50' }
  ]

  const paddingOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ]

  const getPaddingClass = (size) => {
    const paddingMap = {
      small: 'py-8',
      medium: 'py-12',
      large: 'py-16'
    }
    return paddingMap[size] || paddingMap.large
  }

  const getGridClass = () => {
    const gridMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
    return gridMap[columns] || gridMap[3]
  }

  const addFeature = () => {
    const newFeature = {
      id: Date.now().toString(),
      icon: '✨',
      title: 'New Feature',
      description: 'Describe your amazing feature here.'
    }
    setAttributes({ features: [...features, newFeature] })
  }

  const updateFeature = (index, field, value) => {
    const updatedFeatures = features.map((feature, i) => 
      i === index ? { ...feature, [field]: value } : feature
    )
    setAttributes({ features: updatedFeatures })
  }

  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index)
    setAttributes({ features: updatedFeatures })
  }

  const renderIcon = (icon, index) => {
    const iconClasses = {
      emoji: 'text-4xl mb-4',
      circle: 'w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto',
      square: 'w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4 mx-auto',
      minimal: 'text-2xl text-blue-600 mb-4'
    }

    if (iconStyle === 'emoji') {
      return <div className={iconClasses.emoji}>{icon}</div>
    }

    return (
      <div className={iconClasses[iconStyle]}>
        {icon}
      </div>
    )
  }

  const renderFeature = (feature, index) => {
    const textAlignment = alignment === 'center' ? 'text-center' : 'text-left'
    
    if (layout === 'list') {
      return (
        <div key={feature.id} className="flex items-start space-x-4 p-6">
          <div className="flex-shrink-0">
            {renderIcon(feature.icon, index)}
          </div>
          <div className="flex-1">
            <TextControl
              value={feature.title}
              onChange={(value) => updateFeature(index, 'title', value)}
              placeholder={__('Feature title...', 'tailwind-starter')}
              className="text-lg font-semibold mb-2"
            />
            <TextareaControl
              value={feature.description}
              onChange={(value) => updateFeature(index, 'description', value)}
              placeholder={__('Feature description...', 'tailwind-starter')}
              className="text-gray-600"
            />
          </div>
          <Button
            icon={trash}
            onClick={() => removeFeature(index)}
            className="text-red-600 hover:text-red-700"
            isDestructive
          />
        </div>
      )
    }

    const cardClasses = layout === 'card' 
      ? 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'
      : 'p-6'

    return (
      <div key={feature.id} className={`${cardClasses} ${textAlignment} relative group`}>
        <Button
          icon={trash}
          onClick={() => removeFeature(index)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
          isDestructive
          size="small"
        />
        
        <div className={alignment === 'center' ? 'flex justify-center' : ''}>
          {renderIcon(feature.icon, index)}
        </div>
        
        <TextControl
          value={feature.title}
          onChange={(value) => updateFeature(index, 'title', value)}
          placeholder={__('Feature title...', 'tailwind-starter')}
          className="text-lg font-semibold mb-2 border-none shadow-none"
        />
        
        <TextareaControl
          value={feature.description}
          onChange={(value) => updateFeature(index, 'description', value)}
          placeholder={__('Feature description...', 'tailwind-starter')}
          className="text-gray-600 border-none shadow-none"
        />
        
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <TextControl
            label={__('Icon (emoji or text)', 'tailwind-starter')}
            value={feature.icon}
            onChange={(value) => updateFeature(index, 'icon', value)}
            className="text-sm"
          />
        </div>
      </div>
    )
  }

  // Block-specific controls
  const blockControls = (
    <>
      <PanelBody title={__('Layout Settings', 'tailwind-starter')} initialOpen={true}>
        <VStack spacing={4}>
          <RangeControl
            label={__('Columns', 'tailwind-starter')}
            value={columns}
            onChange={(value) => setAttributes({ columns: value })}
            min={1}
            max={4}
          />
          
          <SelectControl
            label={__('Layout Style', 'tailwind-starter')}
            value={layout}
            options={layoutOptions}
            onChange={(value) => setAttributes({ layout: value })}
          />
          
          <SelectControl
            label={__('Icon Style', 'tailwind-starter')}
            value={iconStyle}
            options={iconStyleOptions}
            onChange={(value) => setAttributes({ iconStyle: value })}
          />
          
          <SelectControl
            label={__('Alignment', 'tailwind-starter')}
            value={alignment}
            options={alignmentOptions}
            onChange={(value) => setAttributes({ alignment: value })}
          />
          
        </VStack>
      </PanelBody>

      <PanelBody title={__('Section Header', 'tailwind-starter')} initialOpen={false}>
        <VStack spacing={4}>
          <ToggleControl
            label={__('Show Section Header', 'tailwind-starter')}
            checked={showSection}
            onChange={(value) => setAttributes({ showSection: value })}
          />
          
          {showSection && (
            <>
              <TextControl
                label={__('Section Title', 'tailwind-starter')}
                value={sectionTitle}
                onChange={(value) => setAttributes({ sectionTitle: value })}
              />
              
              <TextareaControl
                label={__('Section Subtitle', 'tailwind-starter')}
                value={sectionSubtitle}
                onChange={(value) => setAttributes({ sectionSubtitle: value })}
              />
            </>
          )}
        </VStack>
      </PanelBody>


      <PanelBody title={__('Features', 'tailwind-starter')} initialOpen={false}>
        <Button
          icon={plus}
          onClick={addFeature}
          variant="secondary"
          className="mb-4"
        >
          {__('Add Feature', 'tailwind-starter')}
        </Button>
        
        <p className="text-sm text-gray-600">
          {__('Click on features below to edit them, or use the controls above to change the layout.', 'tailwind-starter')}
        </p>
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
        spacing={settings?.spacing || {}}
        onSpacingChange={(spacing) => setAttributes({
          settings: { ...(settings || {}), spacing }
        })}
        margins={settings?.margins || {}}
        onMarginsChange={(margins) => setAttributes({
          settings: { ...(settings || {}), margins }
        })}
        blockSpacing={settings?.blockSpacing || {}}
        onBlockSpacingChange={(blockSpacing) => setAttributes({
          settings: { ...(settings || {}), blockSpacing }
        })}
        background={settings?.backgroundColor}
        onBackgroundChange={(backgroundColor) => setAttributes({
          settings: { ...(settings || {}), backgroundColor }
        })}
        textColor={settings?.textColor}
        onTextColorChange={(textColor) => setAttributes({
          settings: { ...(settings || {}), textColor }
        })}
        gradients={settings?.gradients || {}}
        onGradientsChange={(gradients) => setAttributes({
          settings: { ...(settings || {}), gradients }
        })}
        typography={settings?.typography || {}}
        onTypographyChange={(typography) => setAttributes({
          settings: { ...(settings || {}), typography }
        })}
        layout={settings?.layout || {}}
        onLayoutChange={(layout) => setAttributes({
          settings: { ...(settings || {}), layout }
        })}
        effects={settings?.effects || {}}
        onEffectsChange={(effects) => setAttributes({
          settings: { ...(settings || {}), effects }
        })}
        device={activeDevice}
        presets={presets}
        onPresetApply={handlePresetApply}
        onResetAll={() => {
          setAttributes({ 
            settings: {
              spacing: {},
              margins: {},
              blockSpacing: {},
              typography: {},
              layout: {},
              effects: {},
              gradients: {},
              backgroundColor: '',
              textColor: ''
            }
          })
        }}
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
          className={`feature-grid-container transition-all duration-300 ${previewClasses} ${getPaddingClass(padding)}`}
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
          
          <div className="container mx-auto px-4">
            {showSection && (
              <div className="text-center mb-12">
                <RichText
                  tagName="h2"
                  value={sectionTitle}
                  onChange={(value) => setAttributes({ sectionTitle: value })}
                  placeholder={__('Section title...', 'tailwind-starter')}
                  className="text-3xl font-bold mb-4"
                />
                <RichText
                  tagName="p"
                  value={sectionSubtitle}
                  onChange={(value) => setAttributes({ sectionSubtitle: value })}
                  placeholder={__('Section subtitle...', 'tailwind-starter')}
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                />
              </div>
            )}
            
            <div className={`grid ${getGridClass()} gap-8`}>
              {features.map((feature, index) => renderFeature(feature, index))}
            </div>
            
            <div className="mt-8 text-center">
              <Button
                icon={plus}
                onClick={addFeature}
                variant="primary"
              >
                {__('Add Feature', 'tailwind-starter')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}