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
import { trackClassGeneration } from './performance-monitor.js'
import { useDebouncedValue } from './lazy-controls.js'

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

/* Transition utilities for hover effects */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\\:scale-95:hover {
  transform: scale(0.95);
}

.hover\\:scale-105:hover {
  transform: scale(1.05);
}

.hover\\:scale-110:hover {
  transform: scale(1.1);
}

.ultimate-control-tabs .components-tab-panel__tabs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
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

// Enhanced Spacing Control with Class Display
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

  const getTailwindClass = (side, index) => {
    const prefix = device !== 'base' ? `${device}:` : ''
    const sidePrefix = {
      top: 'pt',
      right: 'pr', 
      bottom: 'pb',
      left: 'pl'
    }
    const value = spacingValues[index]
    return value === 0 ? '' : `${prefix}${sidePrefix[side]}-${value}`
  }

  const resetSpacing = () => {
    const resetValue = {
      ...value,
      [device]: { top: 0, right: 0, bottom: 0, left: 0 }
    }
    onChange(resetValue)
  }

  return (
    <div className="animate-slide-in">
      <div className="section-header">
        <span className="section-header-icon">📏</span>
        {__('Spacing (Padding)', 'tailwind-starter')}
        <button 
          className="reset-button"
          onClick={resetSpacing}
          title="Reset padding values"
          style={{
            marginLeft: 'auto',
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
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
              <div className="spacing-pixels">{spacingValues[currentSpacing[side]]}px</div>
              <div className="spacing-class">
                {getTailwindClass(side, currentSpacing[side]) || 'none'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Enhanced Margin Control with Class Display
export const UltimateMarginControl = ({ value = {}, onChange, device = 'base' }) => {
  const spacingValues = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40]
  const currentMargin = value[device] || { top: 0, right: 0, bottom: 0, left: 0 }

  const updateMargin = (side, index) => {
    const newValue = {
      ...value,
      [device]: {
        ...currentMargin,
        [side]: index
      }
    }
    onChange(newValue)
  }

  const getTailwindClass = (side, index) => {
    const prefix = device !== 'base' ? `${device}:` : ''
    const sidePrefix = {
      top: 'mt',
      right: 'mr', 
      bottom: 'mb',
      left: 'ml'
    }
    const value = spacingValues[index]
    return value === 0 ? '' : `${prefix}${sidePrefix[side]}-${value}`
  }

  const resetMargin = () => {
    const resetValue = {
      ...value,
      [device]: { top: 0, right: 0, bottom: 0, left: 0 }
    }
    onChange(resetValue)
  }

  return (
    <div className="animate-slide-in">
      <div className="section-header">
        <span className="section-header-icon">📐</span>
        {__('Spacing (Margin)', 'tailwind-starter')}
        <button 
          className="reset-button"
          onClick={resetMargin}
          title="Reset margin values"
          style={{
            marginLeft: 'auto',
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
      </div>
      <div className="spacing-grid">
        {['top', 'right', 'bottom', 'left'].map(side => (
          <div key={side} className="spacing-control-item">
            <label>{side.charAt(0).toUpperCase() + side.slice(1)}</label>
            <RangeControl
              value={currentMargin[side]}
              onChange={(newValue) => updateMargin(side, newValue)}
              min={0}
              max={spacingValues.length - 1}
              step={1}
              withInputField={false}
            />
            <div className="spacing-value-display">
              <div className="spacing-pixels">{spacingValues[currentMargin[side]]}px</div>
              <div className="spacing-class">
                {getTailwindClass(side, currentMargin[side]) || 'none'}
              </div>
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

  const prefix = type === 'background' ? 'bg' : type === 'border' ? 'border' : 'text'
  const currentValue = value?.replace(`${prefix}-`, '') || ''

  return (
    <div className="color-palette-section animate-slide-in">
      <div className="section-header">
        <span className="section-header-icon">
          {type === 'background' ? '🎨' : type === 'border' ? '🔲' : '✏️'}
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
  const currentTypo = value[device] || { 
    fontSize: '', 
    fontWeight: '', 
    textAlign: '',
    lineHeight: '',
    letterSpacing: '',
    textTransform: '',
    fontSmoothing: ''
  }

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

  const lineHeights = [
    { name: 'Tight', class: 'leading-tight' },
    { name: 'Snug', class: 'leading-snug' },
    { name: 'Normal', class: 'leading-normal' },
    { name: 'Relaxed', class: 'leading-relaxed' },
    { name: 'Loose', class: 'leading-loose' }
  ]

  const letterSpacings = [
    { name: 'Tighter', class: 'tracking-tighter' },
    { name: 'Tight', class: 'tracking-tight' },
    { name: 'Normal', class: 'tracking-normal' },
    { name: 'Wide', class: 'tracking-wide' },
    { name: 'Wider', class: 'tracking-wider' },
    { name: 'Widest', class: 'tracking-widest' }
  ]

  const textTransforms = [
    { name: 'None', class: 'normal-case' },
    { name: 'Uppercase', class: 'uppercase' },
    { name: 'Lowercase', class: 'lowercase' },
    { name: 'Capitalize', class: 'capitalize' }
  ]

  const fontSmoothings = [
    { name: 'Default', class: '' },
    { name: 'Antialiased', class: 'antialiased' },
    { name: 'Subpixel', class: 'subpixel-antialiased' }
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

  const resetTypography = () => {
    const resetValue = {
      ...value,
      [device]: { 
        fontSize: '', 
        fontWeight: '', 
        textAlign: '',
        lineHeight: '',
        letterSpacing: '',
        textTransform: '',
        fontSmoothing: ''
      }
    }
    onChange(resetValue)
  }

  return (
    <div className="animate-slide-in">
      <div className="section-header">
        <span className="section-header-icon">✏️</span>
        {__('Typography', 'tailwind-starter')}
        <button 
          className="reset-button"
          onClick={resetTypography}
          title="Reset typography values"
          style={{
            marginLeft: 'auto',
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
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

      {/* Line Height */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Line Height
      </Text>
      <div className="enhanced-button-grid">
        {lineHeights.map(height => (
          <button
            key={height.class}
            className={`enhanced-style-button ${currentTypo.lineHeight === height.class ? 'selected' : ''}`}
            onClick={() => updateTypography('lineHeight', height.class)}
          >
            {height.name}
          </button>
        ))}
      </div>

      {/* Letter Spacing */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Letter Spacing
      </Text>
      <div className="enhanced-button-grid">
        {letterSpacings.map(spacing => (
          <button
            key={spacing.class}
            className={`enhanced-style-button ${currentTypo.letterSpacing === spacing.class ? 'selected' : ''}`}
            onClick={() => updateTypography('letterSpacing', spacing.class)}
          >
            {spacing.name}
          </button>
        ))}
      </div>

      {/* Text Transform */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Text Transform
      </Text>
      <div className="enhanced-button-grid">
        {textTransforms.map(transform => (
          <button
            key={transform.class}
            className={`enhanced-style-button ${currentTypo.textTransform === transform.class ? 'selected' : ''}`}
            onClick={() => updateTypography('textTransform', transform.class)}
          >
            {transform.name}
          </button>
        ))}
      </div>

      {/* Font Smoothing */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Font Smoothing
      </Text>
      <div className="enhanced-button-grid">
        {fontSmoothings.map(smoothing => (
          <button
            key={smoothing.class}
            className={`enhanced-style-button ${currentTypo.fontSmoothing === smoothing.class ? 'selected' : ''}`}
            onClick={() => updateTypography('fontSmoothing', smoothing.class)}
          >
            {smoothing.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// Ultimate Effects Control - Shadows, Borders, Hover Effects
export const UltimateEffectsControl = ({ value = {}, onChange, device = 'base' }) => {
  const deviceEffects = value[device] || {
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

  const shadowOptions = [
    { name: 'None', class: '', preview: 'No shadow' },
    { name: 'SM', class: 'shadow-sm', preview: '0 1px 2px rgba(0,0,0,0.05)' },
    { name: 'Base', class: 'shadow', preview: '0 1px 3px rgba(0,0,0,0.1)' },
    { name: 'MD', class: 'shadow-md', preview: '0 4px 6px rgba(0,0,0,0.1)' },
    { name: 'LG', class: 'shadow-lg', preview: '0 10px 15px rgba(0,0,0,0.1)' },
    { name: 'XL', class: 'shadow-xl', preview: '0 20px 25px rgba(0,0,0,0.1)' },
    { name: '2XL', class: 'shadow-2xl', preview: '0 25px 50px rgba(0,0,0,0.25)' }
  ]

  const borderRadiusOptions = [
    { name: 'None', class: 'rounded-none' },
    { name: 'SM', class: 'rounded-sm' },
    { name: 'Base', class: 'rounded' },
    { name: 'MD', class: 'rounded-md' },
    { name: 'LG', class: 'rounded-lg' },
    { name: 'XL', class: 'rounded-xl' },
    { name: '2XL', class: 'rounded-2xl' },
    { name: '3XL', class: 'rounded-3xl' },
    { name: 'Full', class: 'rounded-full' }
  ]

  const borderWidthOptions = [
    { name: '0', class: 'border-0' },
    { name: '1', class: 'border' },
    { name: '2', class: 'border-2' },
    { name: '4', class: 'border-4' },
    { name: '8', class: 'border-8' }
  ]

  const hoverScaleOptions = [
    { name: 'None', class: '' },
    { name: '90%', class: 'hover:scale-90' },
    { name: '95%', class: 'hover:scale-95' },
    { name: '105%', class: 'hover:scale-105' },
    { name: '110%', class: 'hover:scale-110' },
    { name: '125%', class: 'hover:scale-125' },
    { name: '150%', class: 'hover:scale-150' }
  ]

  const hoverShadowOptions = [
    { name: 'None', class: '' },
    { name: 'SM', class: 'hover:shadow-sm' },
    { name: 'MD', class: 'hover:shadow-md' },
    { name: 'LG', class: 'hover:shadow-lg' },
    { name: 'XL', class: 'hover:shadow-xl' },
    { name: '2XL', class: 'hover:shadow-2xl' }
  ]

  const hoverOpacityOptions = [
    { name: 'None', class: '' },
    { name: '75%', class: 'hover:opacity-75' },
    { name: '80%', class: 'hover:opacity-80' },
    { name: '90%', class: 'hover:opacity-90' },
    { name: '95%', class: 'hover:opacity-95' }
  ]

  const borderStyleOptions = [
    { name: 'Solid', class: 'border-solid' },
    { name: 'Dashed', class: 'border-dashed' },
    { name: 'Dotted', class: 'border-dotted' },
    { name: 'Double', class: 'border-double' },
    { name: 'None', class: 'border-none' }
  ]

  const entranceAnimationOptions = [
    { name: 'None', class: '' },
    { name: 'Spin', class: 'animate-spin' },
    { name: 'Ping', class: 'animate-ping' },
    { name: 'Pulse', class: 'animate-pulse' },
    { name: 'Bounce', class: 'animate-bounce' }
  ]

  const scrollAnimationOptions = [
    { name: 'None', class: '' },
    { name: 'Pulse on Scroll', class: 'animate-pulse' },
    { name: 'Bounce on Scroll', class: 'animate-bounce' },
    { name: 'Ping on Scroll', class: 'animate-ping' }
  ]

  const transitionDurationOptions = [
    { name: 'Fast', class: 'duration-75' },
    { name: 'Normal', class: 'duration-150' },
    { name: 'Slow', class: 'duration-300' },
    { name: 'Slower', class: 'duration-500' },
    { name: 'Slowest', class: 'duration-700' }
  ]

  const transitionEasingOptions = [
    { name: 'Linear', class: 'ease-linear' },
    { name: 'Ease In', class: 'ease-in' },
    { name: 'Ease Out', class: 'ease-out' },
    { name: 'Ease In Out', class: 'ease-in-out' }
  ]

  const hoverRotateOptions = [
    { name: 'None', class: '' },
    { name: '1°', class: 'hover:rotate-1' },
    { name: '3°', class: 'hover:rotate-3' },
    { name: '6°', class: 'hover:rotate-6' },
    { name: '12°', class: 'hover:rotate-12' },
    { name: '-3°', class: 'hover:-rotate-3' },
    { name: '-6°', class: 'hover:-rotate-6' }
  ]

  const hoverBgColorOptions = [
    { name: 'None', class: '' },
    { name: 'Blue', class: 'hover:bg-blue-500' },
    { name: 'Green', class: 'hover:bg-green-500' },
    { name: 'Purple', class: 'hover:bg-purple-500' },
    { name: 'Red', class: 'hover:bg-red-500' },
    { name: 'Gray', class: 'hover:bg-gray-500' },
    { name: 'White', class: 'hover:bg-white' },
    { name: 'Black', class: 'hover:bg-black' }
  ]

  const updateEffects = (property, newValue) => {
    const newEffectsValue = {
      ...value,
      [device]: {
        ...deviceEffects,
        [property]: newValue
      }
    }
    onChange(newEffectsValue)
  }

  const resetEffects = () => {
    const resetValue = {
      ...value,
      [device]: {
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
    }
    onChange(resetValue)
  }

  return (
    <div className="animate-slide-in">
      {/* Effects Reset Button */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <span className="section-header-icon">✨</span>
        {__('Effects & Animations', 'tailwind-starter')}
        <button 
          className="reset-button"
          onClick={resetEffects}
          title="Reset all effects values"
          style={{
            marginLeft: 'auto',
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Box Shadow Section */}
      <div className="section-header">
        <span className="section-header-icon">🌫️</span>
        {__('Box Shadow', 'tailwind-starter')}
      </div>
      
      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Shadow Intensity
      </Text>
      <div className="enhanced-button-grid">
        {shadowOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.shadow === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('shadow', option.class)}
            title={option.preview}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Border Radius Section */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">🔘</span>
        {__('Border Radius', 'tailwind-starter')}
      </div>
      
      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Corner Rounding
      </Text>
      <div className="enhanced-button-grid">
        {borderRadiusOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.borderRadius === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('borderRadius', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Border Width Section */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">📏</span>
        {__('Border', 'tailwind-starter')}
      </div>
      
      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Border Width
      </Text>
      <div className="enhanced-button-grid">
        {borderWidthOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.borderWidth === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('borderWidth', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Border Style
      </Text>
      <div className="enhanced-button-grid">
        {borderStyleOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.borderStyle === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('borderStyle', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Border Color
      </Text>
      <UltimateColorPicker
        label="Border Color"
        value={deviceEffects.borderColor}
        onChange={(newColor) => updateEffects('borderColor', newColor)}
        type="border"
      />

      {/* Hover Effects Section */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">🎯</span>
        {__('Hover Effects', 'tailwind-starter')}
      </div>
      
      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Hover Scale
      </Text>
      <div className="enhanced-button-grid">
        {hoverScaleOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.hoverScale === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('hoverScale', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Hover Shadow
      </Text>
      <div className="enhanced-button-grid">
        {hoverShadowOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.hoverShadow === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('hoverShadow', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Hover Opacity
      </Text>
      <div className="enhanced-button-grid">
        {hoverOpacityOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.hoverOpacity === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('hoverOpacity', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Hover Rotation
      </Text>
      <div className="enhanced-button-grid">
        {hoverRotateOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.hoverRotate === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('hoverRotate', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Hover Background Color
      </Text>
      <div className="enhanced-button-grid">
        {hoverBgColorOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.hoverBgColor === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('hoverBgColor', option.class)}
            style={option.name !== 'None' ? { 
              backgroundColor: option.name === 'Black' ? '#000' : option.name === 'White' ? '#fff' : undefined,
              color: option.name === 'Black' ? '#fff' : option.name === 'White' ? '#000' : undefined,
              border: option.name === 'White' ? '1px solid #ccc' : undefined
            } : {}}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Animation & Transitions Section */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">✨</span>
        {__('Animations & Transitions', 'tailwind-starter')}
      </div>

      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Entrance Animation
      </Text>
      <div className="enhanced-button-grid">
        {entranceAnimationOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.entranceAnimation === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('entranceAnimation', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Scroll Animation
      </Text>
      <div className="enhanced-button-grid">
        {scrollAnimationOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.scrollAnimation === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('scrollAnimation', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Transition Duration
      </Text>
      <div className="enhanced-button-grid">
        {transitionDurationOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.transitionDuration === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('transitionDuration', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Transition Easing
      </Text>
      <div className="enhanced-button-grid">
        {transitionEasingOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceEffects.transitionEasing === option.class ? 'selected' : ''}`}
            onClick={() => updateEffects('transitionEasing', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// Ultimate Colors Control - Background, Text, Gradients
export const UltimateColorsControl = ({ 
  background, 
  onBackgroundChange, 
  textColor, 
  onTextColorChange,
  gradients,
  onGradientsChange,
  device = 'base' 
}) => {
  const deviceGradients = gradients[device] || {
    type: '',
    direction: '',
    fromColor: '',
    toColor: '',
    opacity: ''
  }

  const gradientTypes = [
    { name: 'None', class: '' },
    { name: 'Linear Right', class: 'bg-gradient-to-r' },
    { name: 'Linear Bottom', class: 'bg-gradient-to-b' },
    { name: 'Linear Top Right', class: 'bg-gradient-to-tr' },
    { name: 'Linear Bottom Right', class: 'bg-gradient-to-br' }
  ]

  const gradientColors = [
    { name: 'Blue', from: 'from-blue-400', to: 'to-blue-600', preview: 'linear-gradient(to right, #60a5fa, #2563eb)' },
    { name: 'Purple', from: 'from-purple-400', to: 'to-purple-600', preview: 'linear-gradient(to right, #c084fc, #9333ea)' },
    { name: 'Green', from: 'from-green-400', to: 'to-green-600', preview: 'linear-gradient(to right, #4ade80, #16a34a)' },
    { name: 'Pink', from: 'from-pink-400', to: 'to-pink-600', preview: 'linear-gradient(to right, #f472b6, #dc2626)' },
    { name: 'Orange', from: 'from-orange-400', to: 'to-orange-600', preview: 'linear-gradient(to right, #fb923c, #ea580c)' },
    { name: 'Teal', from: 'from-teal-400', to: 'to-teal-600', preview: 'linear-gradient(to right, #2dd4bf, #0d9488)' }
  ]

  const opacityOptions = [
    { name: '100%', class: 'opacity-100' },
    { name: '90%', class: 'opacity-90' },
    { name: '80%', class: 'opacity-80' },
    { name: '70%', class: 'opacity-70' },
    { name: '50%', class: 'opacity-50' },
    { name: '30%', class: 'opacity-30' }
  ]

  const updateGradients = (property, newValue) => {
    const newGradientsValue = {
      ...gradients,
      [device]: {
        ...deviceGradients,
        [property]: newValue
      }
    }
    onGradientsChange(newGradientsValue)
  }

  const resetColors = () => {
    // Reset gradients for this device
    const resetGradientsValue = {
      ...gradients,
      [device]: {
        type: '',
        direction: '',
        fromColor: '',
        toColor: '',
        opacity: ''
      }
    }
    onGradientsChange(resetGradientsValue)
    
    // Reset background and text colors
    onBackgroundChange('')
    onTextColorChange('')
  }

  return (
    <div className="animate-slide-in">
      {/* Colors Reset Button */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <span className="section-header-icon">🎨</span>
        {__('Colors & Gradients', 'tailwind-starter')}
        <button 
          className="reset-button"
          onClick={resetColors}
          title="Reset all color values"
          style={{
            marginLeft: 'auto',
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Background Colors */}
      <div className="section-header">
        <span className="section-header-icon">🎨</span>
        {__('Background Colors', 'tailwind-starter')}
      </div>
      
      <UltimateColorPicker
        label={__('Solid Background Color', 'tailwind-starter')}
        value={background}
        onChange={onBackgroundChange}
        type="background"
      />

      {/* Gradient Backgrounds */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">🌈</span>
        {__('Gradient Backgrounds', 'tailwind-starter')}
      </div>

      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Gradient Type
      </Text>
      <div className="enhanced-button-grid">
        {gradientTypes.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceGradients.type === option.class ? 'selected' : ''}`}
            onClick={() => updateGradients('type', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {deviceGradients.type && (
        <>
          <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
            Gradient Colors
          </Text>
          <div className="enhanced-button-grid">
            {gradientColors.map(option => (
              <button
                key={option.name}
                className={`enhanced-style-button ${deviceGradients.fromColor === option.from ? 'selected' : ''}`}
                onClick={() => {
                  updateGradients('fromColor', option.from)
                  updateGradients('toColor', option.to)
                }}
                style={{ 
                  background: option.preview,
                  color: 'white',
                  border: 'none'
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Opacity Controls */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">👻</span>
        {__('Opacity', 'tailwind-starter')}
      </div>

      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Background Opacity
      </Text>
      <div className="enhanced-button-grid">
        {opacityOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceGradients.opacity === option.class ? 'selected' : ''}`}
            onClick={() => updateGradients('opacity', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Text Colors */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">✏️</span>
        {__('Text Colors', 'tailwind-starter')}
      </div>
      
      <UltimateColorPicker
        label={__('Text Color', 'tailwind-starter')}
        value={textColor}
        onChange={onTextColorChange}
        type="text"
      />
    </div>
  )
}

// Ultimate Layout Control
export const UltimateLayoutControl = ({ value = {}, onChange, device = 'base' }) => {
  // Ensure device layout exists with default values
  const deviceLayout = value[device] || {
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

  const gapOptions = [
    { name: '0', class: 'gap-0' },
    { name: '1', class: 'gap-1' },
    { name: '2', class: 'gap-2' },
    { name: '4', class: 'gap-4' },
    { name: '6', class: 'gap-6' },
    { name: '8', class: 'gap-8' },
    { name: '12', class: 'gap-12' },
    { name: '16', class: 'gap-16' }
  ]

  const justifyOptions = [
    { name: 'Start', class: 'justify-start' },
    { name: 'Center', class: 'justify-center' },
    { name: 'End', class: 'justify-end' },
    { name: 'Between', class: 'justify-between' },
    { name: 'Around', class: 'justify-around' },
    { name: 'Evenly', class: 'justify-evenly' }
  ]

  const alignOptions = [
    { name: 'Start', class: 'items-start' },
    { name: 'Center', class: 'items-center' },
    { name: 'End', class: 'items-end' },
    { name: 'Stretch', class: 'items-stretch' },
    { name: 'Baseline', class: 'items-baseline' }
  ]

  const positionOptions = [
    { name: 'Static', class: 'static' },
    { name: 'Relative', class: 'relative' },
    { name: 'Absolute', class: 'absolute' },
    { name: 'Fixed', class: 'fixed' },
    { name: 'Sticky', class: 'sticky' }
  ]

  const zIndexOptions = [
    { name: 'Auto', class: 'z-auto' },
    { name: '0', class: 'z-0' },
    { name: '10', class: 'z-10' },
    { name: '20', class: 'z-20' },
    { name: '30', class: 'z-30' },
    { name: '40', class: 'z-40' },
    { name: '50', class: 'z-50' }
  ]
  
  const maxWidthOptions = [
    { name: 'None', class: 'max-w-none' },
    { name: 'SM', class: 'max-w-sm' },
    { name: 'MD', class: 'max-w-md' },
    { name: 'LG', class: 'max-w-lg' },
    { name: 'XL', class: 'max-w-xl' },
    { name: '4XL', class: 'max-w-4xl' }
  ]

  const gridColsOptions = [
    { name: 'None', class: '' },
    { name: '1', class: 'grid-cols-1' },
    { name: '2', class: 'grid-cols-2' },
    { name: '3', class: 'grid-cols-3' },
    { name: '4', class: 'grid-cols-4' },
    { name: '5', class: 'grid-cols-5' },
    { name: '6', class: 'grid-cols-6' },
    { name: '12', class: 'grid-cols-12' }
  ]

  const gridRowsOptions = [
    { name: 'None', class: '' },
    { name: '1', class: 'grid-rows-1' },
    { name: '2', class: 'grid-rows-2' },
    { name: '3', class: 'grid-rows-3' },
    { name: '4', class: 'grid-rows-4' },
    { name: '5', class: 'grid-rows-5' },
    { name: '6', class: 'grid-rows-6' }
  ]

  const displayOptions = [
    { name: 'Block', class: 'block' },
    { name: 'Flex', class: 'flex' },
    { name: 'Grid', class: 'grid' },
    { name: 'Inline', class: 'inline' },
    { name: 'Inline Block', class: 'inline-block' },
    { name: 'Hidden', class: 'hidden' }
  ]
  
  const updateLayout = (property, newValue) => {
    const newLayoutValue = {
      ...value, 
      [device]: {
        ...deviceLayout,
        [property]: newValue
      }
    }
    
    onChange(newLayoutValue)
  }
  
  // Helper function to generate custom class
  const generateCustomClass = (prefix, value) => {
    if (!value) return ''
    // Check if it's already a Tailwind class (starts with prefix-)
    if (value.startsWith(`${prefix}-`)) return value
    // Generate arbitrary value class: w-[600px], h-[70vh], etc.
    return `${prefix}-[${value}]`
  }
  
  const resetLayout = () => {
    const resetValue = {
      ...value,
      [device]: {
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
    }
    onChange(resetValue)
  }

  return (
    <div className="animate-slide-in">
      {/* Layout Reset Button */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <span className="section-header-icon">📐</span>
        {__('Layout Controls', 'tailwind-starter')}
        <button 
          className="reset-button"
          onClick={resetLayout}
          title="Reset all layout values"
          style={{
            marginLeft: 'auto',
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
      </div>

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

      {/* Flexbox Controls Section */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">📦</span>
        {__('Flexbox & Grid', 'tailwind-starter')}
      </div>

      {/* Gap Controls */}
      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Gap (Spacing between items)
      </Text>
      <div className="enhanced-button-grid">
        {gapOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceLayout.gap === option.class ? 'selected' : ''}`}
            onClick={() => updateLayout('gap', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Justify Content */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Justify Content (Horizontal alignment)
      </Text>
      <div className="enhanced-button-grid">
        {justifyOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceLayout.justifyContent === option.class ? 'selected' : ''}`}
            onClick={() => updateLayout('justifyContent', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Align Items */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Align Items (Vertical alignment)
      </Text>
      <div className="enhanced-button-grid">
        {alignOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceLayout.alignItems === option.class ? 'selected' : ''}`}
            onClick={() => updateLayout('alignItems', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Display Controls Section */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">📺</span>
        {__('Display Type', 'tailwind-starter')}
      </div>

      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Display Property
      </Text>
      <div className="enhanced-button-grid">
        {displayOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceLayout.display === option.class ? 'selected' : ''}`}
            onClick={() => updateLayout('display', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* CSS Grid Controls Section */}
      {deviceLayout.display === 'grid' && (
        <div>
          <div className="section-header" style={{ marginTop: '32px' }}>
            <span className="section-header-icon">🔲</span>
            {__('CSS Grid Layout', 'tailwind-starter')}
          </div>

          <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
            Grid Columns
          </Text>
          <div className="enhanced-button-grid">
            {gridColsOptions.map(option => (
              <button
                key={option.class}
                className={`enhanced-style-button ${deviceLayout.gridCols === option.class ? 'selected' : ''}`}
                onClick={() => updateLayout('gridCols', option.class)}
              >
                {option.name}
              </button>
            ))}
          </div>

          <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
            Grid Rows
          </Text>
          <div className="enhanced-button-grid">
            {gridRowsOptions.map(option => (
              <button
                key={option.class}
                className={`enhanced-style-button ${deviceLayout.gridRows === option.class ? 'selected' : ''}`}
                onClick={() => updateLayout('gridRows', option.class)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Position Controls Section */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <span className="section-header-icon">📍</span>
        {__('Position & Z-Index', 'tailwind-starter')}
      </div>

      {/* Position Type */}
      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Position Type
      </Text>
      <div className="enhanced-button-grid">
        {positionOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceLayout.position === option.class ? 'selected' : ''}`}
            onClick={() => updateLayout('position', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Z-Index */}
      <Text size="12px" weight="600" style={{ margin: '16px 0 8px 0', display: 'block', color: '#374151' }}>
        Z-Index (Layer stacking)
      </Text>
      <div className="enhanced-button-grid">
        {zIndexOptions.map(option => (
          <button
            key={option.class}
            className={`enhanced-style-button ${deviceLayout.zIndex === option.class ? 'selected' : ''}`}
            onClick={() => updateLayout('zIndex', option.class)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// Ultimate Control Tabs
export const UltimateControlTabs = ({ 
  spacing, 
  onSpacingChange,
  margins,
  onMarginsChange,
  background,
  onBackgroundChange,
  textColor,
  onTextColorChange,
  gradients,
  onGradientsChange,
  typography,
  onTypographyChange,
  layout,
  onLayoutChange,
  effects,
  onEffectsChange,
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
    },
    {
      name: 'effects',
      title: '✨',
      label: 'Effects',
      className: 'tab-effects'
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
                <div className="animate-slide-in">
                  <UltimateSpacingControl
                    value={spacing}
                    onChange={onSpacingChange}
                    device={device}
                  />
                  <div style={{ marginTop: '24px' }}>
                    <UltimateMarginControl
                      value={margins}
                      onChange={onMarginsChange}
                      device={device}
                    />
                  </div>
                </div>
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
                <UltimateColorsControl
                  background={background}
                  onBackgroundChange={onBackgroundChange}
                  textColor={textColor}
                  onTextColorChange={onTextColorChange}
                  gradients={gradients}
                  onGradientsChange={onGradientsChange}
                  device={device}
                />
              )
            
            case 'typography':
              return (
                <UltimateTypographyControl
                  value={typography}
                  onChange={onTypographyChange}
                  device={device}
                />
              )

            case 'effects':
              return (
                <UltimateEffectsControl
                  value={effects}
                  onChange={onEffectsChange}
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
    if (spacing.top > 0) classes.push(`${prefix}pt-${spacing.top}`)
    if (spacing.right > 0) classes.push(`${prefix}pr-${spacing.right}`)
    if (spacing.bottom > 0) classes.push(`${prefix}pb-${spacing.bottom}`)
    if (spacing.left > 0) classes.push(`${prefix}pl-${spacing.left}`)
  }

  if (settings.margins?.[device]) {
    const margins = settings.margins[device]
    if (margins.top > 0) classes.push(`${prefix}mt-${margins.top}`)
    if (margins.right > 0) classes.push(`${prefix}mr-${margins.right}`)
    if (margins.bottom > 0) classes.push(`${prefix}mb-${margins.bottom}`)
    if (margins.left > 0) classes.push(`${prefix}ml-${margins.left}`)
  }
  
  if (settings.typography?.[device]) {
    const typo = settings.typography[device]
    if (typo.fontSize) classes.push(`${prefix}${typo.fontSize}`)
    if (typo.fontWeight) classes.push(`${prefix}${typo.fontWeight}`)
    if (typo.textAlign) classes.push(`${prefix}${typo.textAlign}`)
    if (typo.lineHeight) classes.push(`${prefix}${typo.lineHeight}`)
    if (typo.letterSpacing) classes.push(`${prefix}${typo.letterSpacing}`)
    if (typo.textTransform) classes.push(`${prefix}${typo.textTransform}`)
    if (typo.fontSmoothing) classes.push(`${prefix}${typo.fontSmoothing}`)
  }
  
  if (settings.layout?.[device]) {
    const layout = settings.layout[device]
    
    // Add Tailwind classes for layout
    if (layout.width) classes.push(`${prefix}${layout.width}`)
    if (layout.height) classes.push(`${prefix}${layout.height}`)
    
    // Add flexbox classes
    if (layout.gap) classes.push(`${prefix}${layout.gap}`)
    if (layout.justifyContent) classes.push(`${prefix}${layout.justifyContent}`)
    if (layout.alignItems) classes.push(`${prefix}${layout.alignItems}`)
    
    // Add position classes
    if (layout.position) classes.push(`${prefix}${layout.position}`)
    if (layout.zIndex) classes.push(`${prefix}${layout.zIndex}`)
    
    // Add display classes
    if (layout.display) classes.push(`${prefix}${layout.display}`)
    
    // Add CSS Grid classes
    if (layout.gridCols) classes.push(`${prefix}${layout.gridCols}`)
    if (layout.gridRows) classes.push(`${prefix}${layout.gridRows}`)
  }

  if (settings.effects?.[device]) {
    const effects = settings.effects[device]
    
    // Add effect classes
    if (effects.shadow) classes.push(`${prefix}${effects.shadow}`)
    if (effects.borderRadius) classes.push(`${prefix}${effects.borderRadius}`)
    if (effects.borderWidth) classes.push(`${prefix}${effects.borderWidth}`)
    if (effects.borderStyle) classes.push(`${prefix}${effects.borderStyle}`)
    if (effects.borderColor) classes.push(`${prefix}${effects.borderColor}`)
    
    // Add hover effects and transition
    if (effects.hoverScale || effects.hoverShadow || effects.hoverOpacity || effects.hoverRotate || effects.hoverBgColor) {
      classes.push(`${prefix}transition-all`)
      if (effects.hoverScale) classes.push(`${prefix}${effects.hoverScale}`)
      if (effects.hoverShadow) classes.push(`${prefix}${effects.hoverShadow}`)
      if (effects.hoverOpacity) classes.push(`${prefix}${effects.hoverOpacity}`)
      if (effects.hoverRotate) classes.push(`${prefix}${effects.hoverRotate}`)
      if (effects.hoverBgColor) classes.push(`${prefix}${effects.hoverBgColor}`)
    }
    
    // Add animation and transition classes
    if (effects.entranceAnimation) classes.push(`${prefix}${effects.entranceAnimation}`)
    if (effects.scrollAnimation) classes.push(`${prefix}${effects.scrollAnimation}`)
    if (effects.transitionDuration) classes.push(`${prefix}${effects.transitionDuration}`)
    if (effects.transitionEasing) classes.push(`${prefix}${effects.transitionEasing}`)
  }
  
  if (settings.gradients?.[device]) {
    const gradients = settings.gradients[device]
    
    // Add gradient classes
    if (gradients.type) classes.push(`${prefix}${gradients.type}`)
    if (gradients.fromColor) classes.push(`${prefix}${gradients.fromColor}`)
    if (gradients.toColor) classes.push(`${prefix}${gradients.toColor}`)
    if (gradients.opacity) classes.push(`${prefix}${gradients.opacity}`)
  }

  // Add background and text colors (should work for all devices)
  if (settings.backgroundColor) {
    if (typeof settings.backgroundColor === 'string') {
      // Simple string format for backward compatibility
      if (device === 'base') classes.push(settings.backgroundColor)
    } else if (settings.backgroundColor[device]) {
      // Responsive object format
      classes.push(`${prefix}${settings.backgroundColor[device]}`)
    }
  }
  
  if (settings.textColor) {
    if (typeof settings.textColor === 'string') {
      // Simple string format for backward compatibility
      if (device === 'base') classes.push(settings.textColor)
    } else if (settings.textColor[device]) {
      // Responsive object format
      classes.push(`${prefix}${settings.textColor[device]}`)
    }
  }
  
  return classes.filter(Boolean).join(' ')
}

// Generate inline styles for custom values
export const generateInlineStyles = (settings, device = 'base') => {
  const styles = {}
  
  if (settings.layout?.[device]) {
    const layout = settings.layout[device]
    
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
  // Use performance tracking
  return trackClassGeneration(settings, () => {
    const allClasses = []
    
    const baseClasses = generateTailwindClasses(settings, 'base')
    if (baseClasses) allClasses.push(baseClasses)
    
    const breakpoints = ['sm', 'md', 'lg', 'xl']
    breakpoints.forEach(device => {
      const deviceClasses = generateTailwindClasses(settings, device)
      if (deviceClasses) allClasses.push(deviceClasses)
    })
    
    return allClasses.join(' ').trim()
  })
}