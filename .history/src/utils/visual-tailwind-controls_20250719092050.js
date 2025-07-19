import React, { useState } from 'react'
import { 
  PanelBody, 
  Button,
  ButtonGroup,
  RangeControl,
  ToggleControl,
  Tooltip,
  __experimentalGrid as Grid,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalSpacer as Spacer,
  __experimentalText as Text,
  __experimentalHeading as Heading,
  Card,
  CardBody,
  Flex,
  FlexItem
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

// CSS for visual controls
const visualControlsCSS = `
.visual-spacing-control {
  border: 2px dashed #e0e0e0;
  background: #f9f9f9;
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
  border-radius: 8px;
}

.spacing-preview-box {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 60px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  position: relative;
  transition: all 0.2s ease;
}

.spacing-indicator {
  position: absolute;
  background: rgba(59, 130, 246, 0.3);
  border: 1px solid #3b82f6;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #1e40af;
  font-weight: 600;
}

.spacing-indicator.top { top: -20px; left: 50%; transform: translateX(-50%); height: 16px; min-width: 20px; }
.spacing-indicator.right { right: -20px; top: 50%; transform: translateY(-50%); width: 16px; min-height: 20px; }
.spacing-indicator.bottom { bottom: -20px; left: 50%; transform: translateX(-50%); height: 16px; min-width: 20px; }
.spacing-indicator.left { left: -20px; top: 50%; transform: translateY(-50%); width: 16px; min-height: 20px; }

.visual-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(32px, 1fr));
  gap: 4px;
  margin: 12px 0;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.color-swatch.selected {
  border-color: #3b82f6;
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.responsive-device-selector {
  display: flex;
  gap: 8px;
  margin: 16px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.device-button {
  flex: 1;
  min-height: 44px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
}

.device-button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.device-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.25);
}

.device-icon {
  font-size: 18px;
  margin-bottom: 4px;
}

.typography-preview {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layout-grid-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 12px 0;
}

.layout-option {
  aspect-ratio: 1;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;
}

.layout-option:hover {
  border-color: #3b82f6;
  background: #f8faff;
}

.layout-option.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.layout-icon {
  width: 20px;
  height: 20px;
  background: #cbd5e1;
  border-radius: 2px;
}

.quick-preset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 12px 0;
}

.preset-button {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
}

.preset-button:hover {
  border-color: #3b82f6;
  background: #f8faff;
}

.shadow-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 12px 0;
}

.shadow-option {
  aspect-ratio: 1;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.shadow-option:hover {
  border-color: #3b82f6;
}

.shadow-option.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}
`

// Add CSS to the page
if (typeof document !== 'undefined' && !document.getElementById('visual-tailwind-controls-css')) {
  const style = document.createElement('style')
  style.id = 'visual-tailwind-controls-css'
  style.textContent = visualControlsCSS
  document.head.appendChild(style)
}

// Visual Responsive Device Selector
export const VisualDeviceSelector = ({ activeDevice, onChange }) => {
  const devices = [
    { id: 'base', icon: '🖥️', label: 'All', description: 'All Devices' },
    { id: 'sm', icon: '📱', label: 'Mobile', description: '640px+' },
    { id: 'md', icon: '📱', label: 'Tablet', description: '768px+' },
    { id: 'lg', icon: '💻', label: 'Desktop', description: '1024px+' },
    { id: 'xl', icon: '🖥️', label: 'Large', description: '1280px+' },
    { id: '2xl', icon: '🖥️', label: 'XL', description: '1536px+' }
  ]

  return (
    <div className="responsive-device-selector">
      {devices.map(device => (
        <Tooltip key={device.id} text={device.description}>
          <button
            className={`device-button ${activeDevice === device.id ? 'active' : ''}`}
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

// Visual Spacing Control with Preview
export const VisualSpacingControl = ({ 
  label, 
  value = { top: 0, right: 0, bottom: 0, left: 0 }, 
  onChange, 
  type = 'padding' // 'padding' or 'margin'
}) => {
  const updateSpacing = (side, newValue) => {
    onChange({
      ...value,
      [side]: newValue
    })
  }

  const spacingValues = [0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32]
  
  return (
    <PanelBody title={label} initialOpen={false}>
      <div className="visual-spacing-control">
        <div className="spacing-preview-box">
          <Text>{type === 'padding' ? 'Content' : 'Element'}</Text>
          
          {/* Top spacing indicator */}
          {value.top > 0 && (
            <div className="spacing-indicator top">
              {spacingValues[value.top] || value.top}
            </div>
          )}
          
          {/* Right spacing indicator */}
          {value.right > 0 && (
            <div className="spacing-indicator right">
              {spacingValues[value.right] || value.right}
            </div>
          )}
          
          {/* Bottom spacing indicator */}
          {value.bottom > 0 && (
            <div className="spacing-indicator bottom">
              {spacingValues[value.bottom] || value.bottom}
            </div>
          )}
          
          {/* Left spacing indicator */}
          {value.left > 0 && (
            <div className="spacing-indicator left">
              {spacingValues[value.left] || value.left}
            </div>
          )}
        </div>
      </div>

      <VStack spacing={3}>
        <HStack>
          <FlexItem>
            <Text size="12px" weight="600">Top</Text>
            <RangeControl
              value={value.top}
              onChange={(newValue) => updateSpacing('top', newValue)}
              min={0}
              max={spacingValues.length - 1}
              step={1}
              marks={spacingValues.map((val, index) => ({ value: index, label: val.toString() }))}
            />
          </FlexItem>
          <FlexItem>
            <Text size="12px" weight="600">Right</Text>
            <RangeControl
              value={value.right}
              onChange={(newValue) => updateSpacing('right', newValue)}
              min={0}
              max={spacingValues.length - 1}
              step={1}
              marks={spacingValues.map((val, index) => ({ value: index, label: val.toString() }))}
            />
          </FlexItem>
        </HStack>
        
        <HStack>
          <FlexItem>
            <Text size="12px" weight="600">Bottom</Text>
            <RangeControl
              value={value.bottom}
              onChange={(newValue) => updateSpacing('bottom', newValue)}
              min={0}
              max={spacingValues.length - 1}
              step={1}
              marks={spacingValues.map((val, index) => ({ value: index, label: val.toString() }))}
            />
          </FlexItem>
          <FlexItem>
            <Text size="12px" weight="600">Left</Text>
            <RangeControl
              value={value.left}
              onChange={(newValue) => updateSpacing('left', newValue)}
              min={0}
              max={spacingValues.length - 1}
              step={1}
              marks={spacingValues.map((val, index) => ({ value: index, label: val.toString() }))}
            />
          </FlexItem>
        </HStack>

        {/* Quick preset buttons */}
        <div className="quick-preset-grid">
          <button 
            className="preset-button"
            onClick={() => onChange({ top: 0, right: 0, bottom: 0, left: 0 })}
          >
            📱 None
          </button>
          <button 
            className="preset-button"
            onClick={() => onChange({ top: 2, right: 2, bottom: 2, left: 2 })}
          >
            🔹 Small
          </button>
          <button 
            className="preset-button"
            onClick={() => onChange({ top: 4, right: 4, bottom: 4, left: 4 })}
          >
            ⬜ Medium
          </button>
          <button 
            className="preset-button"
            onClick={() => onChange({ top: 6, right: 6, bottom: 6, left: 6 })}
          >
            ⬛ Large
          </button>
        </div>
      </VStack>
    </PanelBody>
  )
}

// Visual Color Picker with Swatches
export const VisualColorPicker = ({ 
  label, 
  value, 
  onChange, 
  type = 'background' // 'background', 'text', 'border'
}) => {
  const colorPalettes = {
    neutral: {
      name: 'Neutral',
      colors: ['white', 'gray-50', 'gray-100', 'gray-200', 'gray-300', 'gray-400', 'gray-500', 'gray-600', 'gray-700', 'gray-800', 'gray-900', 'black']
    },
    blue: {
      name: 'Blue',
      colors: ['blue-50', 'blue-100', 'blue-200', 'blue-300', 'blue-400', 'blue-500', 'blue-600', 'blue-700', 'blue-800', 'blue-900']
    },
    green: {
      name: 'Green', 
      colors: ['green-50', 'green-100', 'green-200', 'green-300', 'green-400', 'green-500', 'green-600', 'green-700', 'green-800', 'green-900']
    },
    red: {
      name: 'Red',
      colors: ['red-50', 'red-100', 'red-200', 'red-300', 'red-400', 'red-500', 'red-600', 'red-700', 'red-800', 'red-900']
    },
    purple: {
      name: 'Purple',
      colors: ['purple-50', 'purple-100', 'purple-200', 'purple-300', 'purple-400', 'purple-500', 'purple-600', 'purple-700', 'purple-800', 'purple-900']
    },
    yellow: {
      name: 'Yellow',
      colors: ['yellow-50', 'yellow-100', 'yellow-200', 'yellow-300', 'yellow-400', 'yellow-500', 'yellow-600', 'yellow-700', 'yellow-800', 'yellow-900']
    }
  }

  const getColorValue = (colorName) => {
    const colorMap = {
      'white': '#ffffff',
      'black': '#000000',
      'gray-50': '#f9fafb',
      'gray-100': '#f3f4f6',
      'gray-200': '#e5e7eb',
      'gray-300': '#d1d5db',
      'gray-400': '#9ca3af',
      'gray-500': '#6b7280',
      'gray-600': '#4b5563',
      'gray-700': '#374151',
      'gray-800': '#1f2937',
      'gray-900': '#111827',
      'blue-50': '#eff6ff',
      'blue-100': '#dbeafe',
      'blue-200': '#bfdbfe',
      'blue-300': '#93c5fd',
      'blue-400': '#60a5fa',
      'blue-500': '#3b82f6',
      'blue-600': '#2563eb',
      'blue-700': '#1d4ed8',
      'blue-800': '#1e40af',
      'blue-900': '#1e3a8a',
      'green-50': '#f0fdf4',
      'green-100': '#dcfce7',
      'green-200': '#bbf7d0',
      'green-300': '#86efac',
      'green-400': '#4ade80',
      'green-500': '#22c55e',
      'green-600': '#16a34a',
      'green-700': '#15803d',
      'green-800': '#166534',
      'green-900': '#14532d',
      'red-50': '#fef2f2',
      'red-100': '#fee2e2',
      'red-200': '#fecaca',
      'red-300': '#fca5a5',
      'red-400': '#f87171',
      'red-500': '#ef4444',
      'red-600': '#dc2626',
      'red-700': '#b91c1c',
      'red-800': '#991b1b',
      'red-900': '#7f1d1d',
      'purple-50': '#faf5ff',
      'purple-100': '#f3e8ff',
      'purple-200': '#e9d5ff',
      'purple-300': '#d8b4fe',
      'purple-400': '#c084fc',
      'purple-500': '#a855f7',
      'purple-600': '#9333ea',
      'purple-700': '#7c3aed',
      'purple-800': '#6b21a8',
      'purple-900': '#581c87',
      'yellow-50': '#fefce8',
      'yellow-100': '#fef3c7',
      'yellow-200': '#fed7aa',
      'yellow-300': '#fbbf24',
      'yellow-400': '#f59e0b',
      'yellow-500': '#d97706',
      'yellow-600': '#b45309',
      'yellow-700': '#92400e',
      'yellow-800': '#78350f',
      'yellow-900': '#451a03'
    }
    return colorMap[colorName] || '#000000'
  }

  return (
    <PanelBody title={label} initialOpen={false}>
      {Object.entries(colorPalettes).map(([paletteKey, palette]) => (
        <div key={paletteKey}>
          <Text size="13px" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
            {palette.name}
          </Text>
          <div className="visual-color-grid">
            {palette.colors.map(colorName => {
              const colorValue = getColorValue(colorName)
              const isSelected = value === `${type}-${colorName}`
              
              return (
                <Tooltip key={colorName} text={colorName}>
                  <div
                    className={`color-swatch ${isSelected ? 'selected' : ''}`}
                    style={{ backgroundColor: colorValue }}
                    onClick={() => onChange(`${type}-${colorName}`)}
                  />
                </Tooltip>
              )
            })}
          </div>
        </div>
      ))}
    </PanelBody>
  )
}

// Visual Typography Control with Live Preview
export const VisualTypographyControl = ({ value = {}, onChange }) => {
  const fontSizes = [
    { name: 'Small', class: 'text-sm', preview: '14px' },
    { name: 'Normal', class: 'text-base', preview: '16px' },
    { name: 'Large', class: 'text-lg', preview: '18px' },
    { name: 'XL', class: 'text-xl', preview: '20px' },
    { name: '2XL', class: 'text-2xl', preview: '24px' },
    { name: '3XL', class: 'text-3xl', preview: '30px' },
    { name: '4XL', class: 'text-4xl', preview: '36px' }
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

  return (
    <PanelBody title={__('Typography', 'tailwind-starter')} initialOpen={false}>
      {/* Live Preview */}
      <div className="typography-preview" style={{
        fontSize: fontSizes.find(f => f.class === value.fontSize)?.preview || '16px',
        fontWeight: fontWeights.find(w => w.class === value.fontWeight)?.weight || '400',
        textAlign: textAligns.find(a => a.class === value.textAlign)?.name.toLowerCase() || 'left'
      }}>
        The quick brown fox jumps over the lazy dog
      </div>

      {/* Font Size Buttons */}
      <VStack spacing={4}>
        <div>
          <Text size="13px" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
            Font Size
          </Text>
          <ButtonGroup>
            {fontSizes.map(size => (
              <Button
                key={size.class}
                variant={value.fontSize === size.class ? 'primary' : 'secondary'}
                size="small"
                onClick={() => onChange({ ...value, fontSize: size.class })}
              >
                {size.name}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Font Weight Buttons */}
        <div>
          <Text size="13px" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
            Font Weight
          </Text>
          <ButtonGroup>
            {fontWeights.map(weight => (
              <Button
                key={weight.class}
                variant={value.fontWeight === weight.class ? 'primary' : 'secondary'}
                size="small"
                onClick={() => onChange({ ...value, fontWeight: weight.class })}
              >
                {weight.name}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Text Alignment */}
        <div>
          <Text size="13px" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
            Text Alignment
          </Text>
          <ButtonGroup>
            {textAligns.map(align => (
              <Button
                key={align.class}
                variant={value.textAlign === align.class ? 'primary' : 'secondary'}
                size="small"
                onClick={() => onChange({ ...value, textAlign: align.class })}
              >
                {align.icon} {align.name}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </VStack>
    </PanelBody>
  )
}

// Visual Layout Selector
export const VisualLayoutControl = ({ value = {}, onChange }) => {
  const layouts = [
    { name: 'Block', class: 'block', icon: '▬' },
    { name: 'Flex Row', class: 'flex flex-row', icon: '↔' },
    { name: 'Flex Column', class: 'flex flex-col', icon: '↕' },
    { name: 'Grid', class: 'grid', icon: '⊞' },
    { name: 'Hidden', class: 'hidden', icon: '👁' }
  ]

  return (
    <PanelBody title={__('Layout', 'tailwind-starter')} initialOpen={false}>
      <Text size="13px" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
        Display Type
      </Text>
      <div className="layout-grid-selector">
        {layouts.map(layout => (
          <Tooltip key={layout.class} text={layout.name}>
            <div
              className={`layout-option ${value.display === layout.class ? 'selected' : ''}`}
              onClick={() => onChange({ ...value, display: layout.class })}
            >
              <div style={{ fontSize: '20px' }}>{layout.icon}</div>
            </div>
          </Tooltip>
        ))}
      </div>
    </PanelBody>
  )
}

// Visual Shadow Control
export const VisualShadowControl = ({ value, onChange }) => {
  const shadows = [
    { name: 'None', class: 'shadow-none', preview: 'none' },
    { name: 'Small', class: 'shadow-sm', preview: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { name: 'Medium', class: 'shadow', preview: '0 1px 3px 0 rgb(0 0 0 / 0.1)' },
    { name: 'Large', class: 'shadow-lg', preview: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    { name: 'XL', class: 'shadow-xl', preview: '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
    { name: '2XL', class: 'shadow-2xl', preview: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }
  ]

  return (
    <PanelBody title={__('Shadow', 'tailwind-starter')} initialOpen={false}>
      <div className="shadow-preview">
        {shadows.map(shadow => (
          <Tooltip key={shadow.class} text={shadow.name}>
            <div
              className={`shadow-option ${value === shadow.class ? 'selected' : ''}`}
              style={{ boxShadow: shadow.preview }}
              onClick={() => onChange(shadow.class)}
            />
          </Tooltip>
        ))}
      </div>
    </PanelBody>
  )
}

// Export utility to convert visual values to Tailwind classes
export const convertToTailwindClasses = (visualValues, deviceBreakpoint = 'base') => {
  const classes = []
  const prefix = deviceBreakpoint !== 'base' ? `${deviceBreakpoint}:` : ''

  // Handle spacing
  if (visualValues.spacing) {
    const spacingValues = [0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32]
    const { top, right, bottom, left } = visualValues.spacing
    
    if (top > 0) classes.push(`${prefix}pt-${spacingValues[top]}`)
    if (right > 0) classes.push(`${prefix}pr-${spacingValues[right]}`)
    if (bottom > 0) classes.push(`${prefix}pb-${spacingValues[bottom]}`)
    if (left > 0) classes.push(`${prefix}pl-${spacingValues[left]}`)
  }

  // Handle typography
  if (visualValues.typography) {
    const { fontSize, fontWeight, textAlign } = visualValues.typography
    if (fontSize) classes.push(`${prefix}${fontSize}`)
    if (fontWeight) classes.push(`${prefix}${fontWeight}`)
    if (textAlign) classes.push(`${prefix}${textAlign}`)
  }

  // Handle layout
  if (visualValues.layout?.display) {
    classes.push(`${prefix}${visualValues.layout.display}`)
  }

  // Handle colors
  if (visualValues.backgroundColor) {
    classes.push(`${prefix}${visualValues.backgroundColor}`)
  }
  if (visualValues.textColor) {
    classes.push(`${prefix}${visualValues.textColor}`)
  }

  // Handle shadow
  if (visualValues.shadow) {
    classes.push(`${prefix}${visualValues.shadow}`)
  }

  return classes.filter(Boolean).join(' ')
}