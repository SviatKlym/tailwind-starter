import React, { useState } from 'react'
import { 
  PanelBody, 
  Button,
  ButtonGroup,
  RangeControl,
  ToggleControl,
  SelectControl,
  TabPanel,
  Tooltip,
  TextControl,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalText as Text,
  Card,
  CardBody,
  Flex,
  FlexItem
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

// Enhanced CSS for the ultimate visual controls
const ultimateControlsCSS = `
.ultimate-visual-controls {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Device Selector - Enhanced */
.device-selector {
  display: flex;
  gap: 3px;
  margin: 12px 0;
  padding: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.device-btn {
  flex: 1;
  min-height: 40px;
  border: none;
  background: rgba(255,255,255,0.1);
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.device-btn:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.device-btn.active {
  background: #ffffff;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.device-icon {
  font-size: 16px;
  margin-bottom: 2px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

/* Enhanced Control Tabs */
.ultimate-control-tabs {
  margin: 16px 0;
}

.ultimate-control-tabs .components-tab-panel__tabs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  margin-bottom: 20px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.ultimate-control-tabs .components-tab-panel__tabs-item {
  padding: 12px 8px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ultimate-control-tabs .components-tab-panel__tabs-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.ultimate-control-tabs .components-tab-panel__tabs-item.is-active {
  background: #6366f1;
  color: white;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Spacing Grid - Enhanced */
.spacing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
  padding: 16px;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #e1e5e9;
}

.spacing-control-item {
  text-align: center;
}

.spacing-control-item label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spacing-value-display {
  background: #6366f1;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  margin-top: 4px;
  display: inline-block;
  min-width: 40px;
}

/* Enhanced Color Palette */
.color-palette-section {
  margin: 16px 0;
}

.color-palette-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  margin: 12px 0;
  padding: 12px;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #e1e5e9;
  overflow: auto;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.color-swatch:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  z-index: 10;
}

.color-swatch.selected {
  border-color: #6366f1;
  transform: scale(1.1);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

.color-swatch.selected::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(0,0,0,0.7);
  animation: checkmark 0.3s ease;
}

@keyframes checkmark {
  0% { transform: scale(0) rotate(180deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* Typography Preview - Enhanced */
.typography-preview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  margin: 12px 0;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.typography-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
}

.typography-preview-text {
  position: relative;
  z-index: 1;
}

/* Enhanced Button Grids */
.enhanced-button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 12px 0;
}

.enhanced-style-button {
  padding: 12px 8px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.enhanced-style-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: all 0.5s;
}

.enhanced-style-button:hover::before {
  left: 100%;
}

.enhanced-style-button:hover {
  border-color: #6366f1;
  background: #f8faff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
}

.enhanced-style-button.selected {
  border-color: #6366f1;
  background: #6366f1;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

/* Preset Grid - Enhanced */
.preset-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 16px 0;
}

.preset-button {
  padding: 16px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.preset-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preset-button:hover::before {
  opacity: 1;
}

.preset-button:hover {
  border-color: #6366f1;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
}

.preset-button-icon {
  font-size: 24px;
  margin-bottom: 4px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.preset-button-label {
  position: relative;
  z-index: 1;
}

/* Section Headers - Enhanced */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 12px 0;
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
  padding: 8px 0;
  border-bottom: 2px solid #e2e8f0;
}

.section-header-icon {
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

/* Animations */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-slide-in {
  animation: slideIn 0.3s ease;
}

.animate-pulse {
  animation: pulse 2s infinite;
}
`

// Add enhanced CSS
if (typeof document !== 'undefined' && !document.getElementById('ultimate-visual-controls-css')) {
  const style = document.createElement('style')
  style.id = 'ultimate-visual-controls-css'
  style.textContent = ultimateControlsCSS
  document.head.appendChild(style)
}

// Enhanced Device Selector
export const UltimateDeviceSelector = ({ activeDevice, onChange }) => {
  const devices = [
    { id: 'base', icon: '🖥️', label: 'All', desc: 'All Devices' },
    { id: 'sm', icon: '📱', label: 'SM', desc: 'Mobile 640px+' },
    { id: 'md', icon: '📱', label: 'MD', desc: 'Tablet 768px+' },
    { id: 'lg', icon: '💻', label: 'LG', desc: 'Desktop 1024px+' },
    { id: 'xl', icon: '🖥️', label: 'XL', desc: 'Large 1280px+' }
  ]

  return (
    <div className="device-selector animate-slide-in">
      {devices.map(device => (
        <Tooltip key={device.id} text={device.desc}>
          <button
            className={`device-btn ${activeDevice === device.id ? 'active' : ''}`}
            onClick={() => onChange(device.id)}
          >
            <div className="device-icon">{device.icon}</div>
            <div>{device.label}</div>
          </button>
        </Tooltip>
      ))}
    </div>
  )
}

// Enhanced Spacing Control
export const UltimateSpacingControl = ({ value = {}, onChange, device = 'base' }) => {
  const spacingValues = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40]
  const currentSpacing = value[device] || { top: 0, right: 0, bottom: 0, left: 0 }

  const updateSpacing = (side, index) => {
    const newValue = {
      ...value,
      [device]: {
        ...currentSpacing,
        [side]: index
      }
    }
    onChange(newValue)
  }

  return (
    <div className="animate-slide-in">
      <div className="section-header">
        <span className="section-header-icon">📏</span>
        {__('Spacing (Padding)', 'tailwind-starter')}
      </div>
      <div className="spacing-grid">
        {['top', 'right', 'bottom', 'left'].map(side => (
          <div key={side} className="spacing-control-item">
            <label>{side.charAt(0).toUpperCase() + side.slice(1)}</label>
            <RangeControl
              value={currentSpacing[side]}
              onChange={(newValue) => updateSpacing(side, newValue)}
              min={0}
              max={spacingValues.length - 1}
              step={1}
              withInputField={false}
            />
            <div className="spacing-value-display">
              {spacingValues[currentSpacing[side]]}px
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Enhanced Color Picker
export const UltimateColorPicker = ({ 
  label, 
  value, 
  onChange, 
  type = 'background'
}) => {
  const colorPalettes = {
    neutral: {
      name: '⚪ Neutrals',
      colors: [
        { name: 'White', value: 'white', hex: '#ffffff' },
        { name: 'Gray 50', value: 'gray-50', hex: '#f9fafb' },
        { name: 'Gray 100', value: 'gray-100', hex: '#f3f4f6' },
        { name: 'Gray 200', value: 'gray-200', hex: '#e5e7eb' },
        { name: 'Gray 500', value: 'gray-500', hex: '#6b7280' },
        { name: 'Gray 700', value: 'gray-700', hex: '#374151' },
        { name: 'Gray 900', value: 'gray-900', hex: '#111827' },
        { name: 'Black', value: 'black', hex: '#000000' }
      ]
    },
    vibrant: {
      name: '🌈 Vibrant',
      colors: [
        { name: 'Blue 500', value: 'blue-500', hex: '#3b82f6' },
        { name: 'Green 500', value: 'green-500', hex: '#22c55e' },
        { name: 'Red 500', value: 'red-500', hex: '#ef4444' },
        { name: 'Purple 600', value: 'purple-600', hex: '#9333ea' },
        { name: 'Orange 500', value: 'orange-500', hex: '#f97316' },
        { name: 'Yellow 400', value: 'yellow-400', hex: '#facc15' },
        { name: 'Pink 500', value: 'pink-500', hex: '#ec4899' },
        { name: 'Indigo 600', value: 'indigo-600', hex: '#4f46e5' }
      ]
    },
    subtle: {
      name: '🌸 Subtle',
      colors: [
        { name: 'Blue 50', value: 'blue-50', hex: '#eff6ff' },
        { name: 'Green 50', value: 'green-50', hex: '#f0fdf4' },
        { name: 'Red 50', value: 'red-50', hex: '#fef2f2' },
        { name: 'Purple 50', value: 'purple-50', hex: '#faf5ff' },
        { name: 'Orange 50', value: 'orange-50', hex: '#fff7ed' },
        { name: 'Yellow 50', value: 'yellow-50', hex: '#fefce8' },
        { name: 'Pink 50', value: 'pink-50', hex: '#fdf2f8' },
        { name: 'Indigo 50', value: 'indigo-50', hex: '#eef2ff' }
      ]
    }
  }

  const prefix = type === 'background' ? 'bg' : 'text'
  const currentValue = value?.replace(`${prefix}-`, '') || ''

  return (
    <div className="color-palette-section animate-slide-in">
      <div className="section-header">
        <span className="section-header-icon">
          {type === 'background' ? '🎨' : '✏️'}
        </span>
        {label}
      </div>
      {Object.entries(colorPalettes).map(([paletteKey, palette]) => (
        <div key={paletteKey}>
          <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#64748b' }}>
            {palette.name}
          </Text>
          <div className="color-palette-grid">
            {palette.colors.map(color => {
              const isSelected = currentValue === color.value
              return (
                <Tooltip key={color.value} text={color.name}>
                  <div
                    className={`color-swatch ${isSelected ? 'selected' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => onChange(`${prefix}-${color.value}`)}
                  />
                </Tooltip>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// Enhanced Typography Control
export const UltimateTypographyControl = ({ value = {}, onChange, device = 'base' }) => {
  const currentTypo = value[device] || {}

  const fontSizes = [
    { name: 'XS', class: 'text-xs', preview: '12px' },
    { name: 'SM', class: 'text-sm', preview: '14px' },
    { name: 'Base', class: 'text-base', preview: '16px' },
    { name: 'LG', class: 'text-lg', preview: '18px' },
    { name: 'XL', class: 'text-xl', preview: '20px' },
    { name: '2XL', class: 'text-2xl', preview: '24px' },
    { name: '3XL', class: 'text-3xl', preview: '30px' },
    { name: '4XL', class: 'text-4xl', preview: '36px' },
    { name: '5XL', class: 'text-5xl', preview: '48px' }
  ]

  const fontWeights = [
    { name: 'Light', class: 'font-light', weight: '300' },
    { name: 'Normal', class: 'font-normal', weight: '400' },
    { name: 'Medium', class: 'font-medium', weight: '500' },
    { name: 'Bold', class: 'font-bold', weight: '700' }
  ]

  const textAligns = [
    { name: 'Left', class: 'text-left', icon: '⬅️' },
    { name: 'Center', class: 'text-center', icon: '↔️' },
    { name: 'Right', class: 'text-right', icon: '➡️' }
  ]

  const updateTypography = (property, newValue) => {
    onChange({
      ...value,
      [device]: {
        ...currentTypo,
        [property]: newValue
      }
    })
  }

  return (
    <div className="animate-slide-in">
      <div className="section-header">
        <span className="section-header-icon">✏️</span>
        {__('Typography', 'tailwind-starter')}
      </div>
      
      <div 
        className="typography-preview"
        style={{
          fontSize: fontSizes.find(f => f.class === currentTypo.fontSize)?.preview || '16px',
          fontWeight: fontWeights.find(w => w.class === currentTypo.fontWeight)?.weight || '400',
          textAlign: currentTypo.textAlign?.replace('text-', '') || 'left'
        }}
      >
        <div className="typography-preview-text">
          The quick brown fox jumps over the lazy dog
        </div>
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Font Size
      </Text>
      <div className="enhanced-button-grid">
        {fontSizes.slice(0, 6).map(size => (
          <button
            key={size.class}
            className={`enhanced-style-button ${currentTypo.fontSize === size.class ? 'selected' : ''}`}
            onClick={() => updateTypography('fontSize', size.class)}
          >
            {size.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Font Weight
      </Text>
      <div className="enhanced-button-grid">
        {fontWeights.map(weight => (
          <button
            key={weight.class}
            className={`enhanced-style-button ${currentTypo.fontWeight === weight.class ? 'selected' : ''}`}
            onClick={() => updateTypography('fontWeight', weight.class)}
          >
            {weight.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Text Alignment
      </Text>
      <div className="enhanced-button-grid">
        {textAligns.map(align => (
          <button
            key={align.class}
            className={`enhanced-style-button ${currentTypo.textAlign === align.class ? 'selected' : ''}`}
            onClick={() => updateTypography('textAlign', align.class)}
          >
            {align.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

// Ultimate Layout Control
export const UltimateLayoutControl = ({ value = {}, onChange, device = 'base' }) => {
  const deviceLayout = value[device] || {}
  
  const quickWidthOptions = [
    { name: '25%', class: 'w-1/4' },
    { name: '33%', class: 'w-1/3' },
    { name: '50%', class: 'w-1/2' },
    { name: '75%', class: 'w-3/4' },
    { name: '100%', class: 'w-full' },
    { name: 'Auto', class: 'w-auto' }
  ]
  
  const quickHeightOptions = [
    { name: 'Auto', class: 'h-auto' },
    { name: 'Full', class: 'h-full' },
    { name: 'Screen', class: 'h-screen' },
    { name: 'Fit', class: 'h-fit' }
  ]
  
  const maxWidthOptions = [
    { name: 'None', class: 'max-w-none' },
    { name: 'SM', class: 'max-w-sm' },
    { name: 'MD', class: 'max-w-md' },
    { name: 'LG', class: 'max-w-lg' },
    { name: 'XL', class: 'max-w-xl' },
    { name: '4XL', class: 'max-w-4xl' }
  ]
  
  const updateLayout = (property, newValue) => {
    onChange({
      ...value, 
      [device]: {
        ...deviceLayout,
        [property]: newValue
      }
    })
  }
  
  // Helper function to generate custom class
  const generateCustomClass = (prefix, value) => {
    if (!value) return ''
    // Check if it's already a Tailwind class (starts with prefix-)
    if (value.startsWith(`${prefix}-`)) return value
    // Generate arbitrary value class: w-[600px], h-[70vh], etc.
    return `${prefix}-[${value}]`
  }
  
  return (
    <div className="animate-slide-in">
      {/* Width Section */}
      <div className="section-header">
        <span className="section-header-icon">📐</span>
        {__('Width', 'tailwind-starter')}
      </div>
      
      {/* Quick Width Options */}
      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Quick Options
      </Text>
      <div className="enhanced-button-grid">
        {quickWidthOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceLayout.width === option.class ? 'selected' : ''}`}
            onClick={() => updateLayout('width', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>
      
      {/* Custom Width Input */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Custom Width
      </Text>
      <TextControl
        placeholder="e.g. 600px, 70vw, 20rem"
        value={deviceLayout.customWidth || ''}
        onChange={(customValue) => {
          updateLayout('customWidth', customValue)
        }}
        help="Enter custom values like 600px, 70vw, 20rem"
      />
      
      {/* Max Width - Custom Only */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Max Width
      </Text>
      <TextControl
        placeholder="e.g. 800px, 90vw"
        value={deviceLayout.customMaxWidth || ''}
        onChange={(customValue) => {
          updateLayout('customMaxWidth', customValue)
        }}
        help="Custom max-width"
      />
      
      {/* Min Width - Custom Only */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Min Width
      </Text>
      <TextControl
        placeholder="e.g. 200px, 20vw"
        value={deviceLayout.customMinWidth || ''}
        onChange={(customValue) => {
          updateLayout('customMinWidth', customValue)
        }}
        help="Custom min-width"
      />
      
      {/* Height Section */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">📏</span>
        {__('Height', 'tailwind-starter')}
      </div>
      
      {/* Quick Height Options */}
      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Quick Options
      </Text>
      <div className="enhanced-button-grid">
        {quickHeightOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceLayout.height === option.class ? 'selected' : ''}`}
            onClick={() => updateLayout('height', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>
      
      {/* Custom Height Input */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Custom Height
      </Text>
      <TextControl
        placeholder="e.g. 400px, 70vh, 25rem"
        value={deviceLayout.customHeight || ''}
        onChange={(customValue) => {
          updateLayout('customHeight', customValue)
        }}
        help="Enter custom values like 400px, 70vh, 25rem"
      />
      
      {/* Max Height - Custom Only */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Max Height
      </Text>
      <TextControl
        placeholder="e.g. 500px, 80vh"
        value={deviceLayout.customMaxHeight || ''}
        onChange={(customValue) => {
          updateLayout('customMaxHeight', customValue)
        }}
        help="Custom max-height"
      />
      
      {/* Min Height - Custom Only */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Min Height
      </Text>
      <TextControl
        placeholder="e.g. 200px, 50vh"
        value={deviceLayout.customMinHeight || ''}
        onChange={(customValue) => {
          updateLayout('customMinHeight', customValue)
        }}
        help="Custom min-height"
      />
    </div>
  )
}

// Ultimate Control Tabs
export const UltimateControlTabs = ({ 
  spacing, 
  onSpacingChange,
  background,
  onBackgroundChange,
  textColor,
  onTextColorChange,
  typography,
  onTypographyChange,
  layout,
  onLayoutChange,
  device,
  presets,
  onPresetApply
}) => {
  const tabs = [
    {
      name: 'presets',
      title: '⚡',
      label: 'Quick',
      className: 'tab-presets'
    },
    {
      name: 'spacing', 
      title: '📏',
      label: 'Space',
      className: 'tab-spacing'
    },
    {
      name: 'layout',
      title: '📐',
      label: 'Layout',
      className: 'tab-layout'
    },
    {
      name: 'colors',
      title: '🎨',
      label: 'Colors',
      className: 'tab-colors'
    },
    {
      name: 'typography',
      title: '✏️',
      label: 'Type',
      className: 'tab-typography'
    }
  ]

  const presetData = [
    { key: 'card', icon: '🃏', name: 'Card', desc: 'Clean card layout' },
    { key: 'hero', icon: '🏆', name: 'Hero', desc: 'Bold hero section' },
    { key: 'minimal', icon: '✨', name: 'Minimal', desc: 'Clean & subtle' },
    { key: 'bold', icon: '💪', name: 'Bold', desc: 'High contrast' },
    { key: 'feature', icon: '⭐', name: 'Feature', desc: 'Highlighted content' },
    { key: 'quote', icon: '💬', name: 'Quote', desc: 'Testimonial style' }
  ]

  return (
    <div className="ultimate-control-tabs">
      <TabPanel
        className="ultimate-control-tabs-panel"
        activeClass="is-active"
        orientation="horizontal"
        initialTabName="presets"
        tabs={tabs}
      >
        {(tab) => {
          switch (tab.name) {
            case 'presets':
              return (
                <div className="animate-slide-in">
                  <div className="section-header">
                    <span className="section-header-icon">⚡</span>
                    {__('Quick Style Presets', 'tailwind-starter')}
                  </div>
                  <div className="preset-grid">
                    {presetData.map(preset => (
                      <button 
                        key={preset.key}
                        className="preset-button"
                        onClick={() => onPresetApply(preset.key)}
                        title={preset.desc}
                      >
                        <div className="preset-button-icon">{preset.icon}</div>
                        <div className="preset-button-label">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            
            case 'spacing':
              return (
                <UltimateSpacingControl
                  value={spacing}
                  onChange={onSpacingChange}
                  device={device}
                />
              )
            
            case 'layout':
              return (
                <UltimateLayoutControl
                  value={layout}
                  onChange={onLayoutChange}
                  device={device}
                />
              )
            
            case 'colors':
              return (
                <div>
                  <UltimateColorPicker
                    label={__('Background Color', 'tailwind-starter')}
                    value={background}
                    onChange={onBackgroundChange}
                    type="background"
                  />
                  <UltimateColorPicker
                    label={__('Text Color', 'tailwind-starter')}
                    value={textColor}
                    onChange={onTextColorChange}
                    type="text"
                  />
                </div>
              )
            
            case 'typography':
              return (
                <UltimateTypographyControl
                  value={typography}
                  onChange={onTypographyChange}
                  device={device}
                />
              )
              
            default:
              return null
          }
        }}
      </TabPanel>
    </div>
  )
}

// Enhanced class generation
export const generateTailwindClasses = (settings, device = 'base') => {
  const classes = []
  const prefix = device !== 'base' ? `${device}:` : ''
  
  const spacingValues = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40]
  
  if (settings.spacing?.[device]) {
    const spacing = settings.spacing[device]
    if (spacing.top > 0) classes.push(`${prefix}pt-${spacingValues[spacing.top]}`)
    if (spacing.right > 0) classes.push(`${prefix}pr-${spacingValues[spacing.right]}`)
    if (spacing.bottom > 0) classes.push(`${prefix}pb-${spacingValues[spacing.bottom]}`)
    if (spacing.left > 0) classes.push(`${prefix}pl-${spacingValues[spacing.left]}`)
  }
  
  if (settings.typography?.[device]) {
    const typo = settings.typography[device]
    if (typo.fontSize) classes.push(`${prefix}${typo.fontSize}`)
    if (typo.fontWeight) classes.push(`${prefix}${typo.fontWeight}`)
    if (typo.textAlign) classes.push(`${prefix}${typo.textAlign}`)
  }
  
  if (settings.layout?.[device]) {
    const layout = settings.layout[device]
    
    // Only add Tailwind classes for quick options (width and height)
    if (layout.width) classes.push(`${prefix}${layout.width}`)
    if (layout.height) classes.push(`${prefix}${layout.height}`)
  }
  
  if (device === 'base') {
    if (settings.backgroundColor) classes.push(settings.backgroundColor)
    if (settings.textColor) classes.push(settings.textColor)
  }
  
  return classes.filter(Boolean).join(' ')
}

// Generate inline styles for custom values
export const generateInlineStyles = (settings, device = 'base') => {
  const styles = {}
  
  if (settings.layout?.[device]) {
    const layout = settings.layout[device]
    
    if (layout.customWidth) styles.width = layout.customWidth
    if (layout.customMaxWidth) styles.maxWidth = layout.customMaxWidth
    if (layout.customMinWidth) styles.minWidth = layout.customMinWidth
    if (layout.customHeight) styles.height = layout.customHeight
    if (layout.customMaxHeight) styles.maxHeight = layout.customMaxHeight
    if (layout.customMinHeight) styles.minHeight = layout.customMinHeight
  }
  
  return styles
}

// Generate all inline styles for all devices
export const generateAllInlineStyles = (settings) => {
  const allStyles = {}
  
  // Base styles
  const baseStyles = generateInlineStyles(settings, 'base')
  Object.assign(allStyles, baseStyles)
  
  // Responsive styles can be handled via CSS custom properties or media queries
  // For now, we'll just use base styles as inline styles work best for base responsive level
  
  return allStyles
}

export const generateAllClasses = (settings) => {
  const allClasses = []
  
  const baseClasses = generateTailwindClasses(settings, 'base')
  if (baseClasses) allClasses.push(baseClasses)
  
  const breakpoints = ['sm', 'md', 'lg', 'xl']
  breakpoints.forEach(device => {
    const deviceClasses = generateTailwindClasses(settings, device)
    if (deviceClasses) allClasses.push(deviceClasses)
  })
  
  return allClasses.join(' ').trim()
}