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
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalText as Text,
  Card,
  CardBody,
  Flex,
  FlexItem
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

// Device Selector Component
export const DeviceSelector = ({ activeDevice, onChange }) => {
  const devices = [
    { id: 'base', icon: '🖥️', label: 'All' },
    { id: 'sm', icon: '📱', label: 'SM' },
    { id: 'md', icon: '📱', label: 'MD' },
    { id: 'lg', icon: '💻', label: 'LG' },
    { id: 'xl', icon: '🖥️', label: 'XL' }
  ]

  return (
    <div className="device-selector">
      {devices.map(device => (
        <button
          key={device.id}
          className={`device-btn ${activeDevice === device.id ? 'active' : ''}`}
          onClick={() => onChange(device.id)}
        >
          <div className="device-icon">{device.icon}</div>
          <div>{device.label}</div>
        </button>
      ))}
    </div>
  )
}

// Improved Spacing Control
export const ImprovedSpacingControl = ({ value = {}, onChange, device = 'base' }) => {
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
    <div>
      <div className="section-header">
        📏 Spacing (Padding)
      </div>
      <div className="spacing-grid">
        <div className="spacing-control-item">
          <label>Top</label>
          <RangeControl
            value={currentSpacing.top}
            onChange={(newValue) => updateSpacing('top', newValue)}
            min={0}
            max={spacingValues.length - 1}
            step={1}
            withInputField={false}
          />
          <Text size="11px" color="#666">
            {spacingValues[currentSpacing.top]}px
          </Text>
        </div>
        <div className="spacing-control-item">
          <label>Right</label>
          <RangeControl
            value={currentSpacing.right}
            onChange={(newValue) => updateSpacing('right', newValue)}
            min={0}
            max={spacingValues.length - 1}
            step={1}
            withInputField={false}
          />
          <Text size="11px" color="#666">
            {spacingValues[currentSpacing.right]}px
          </Text>
        </div>
        <div className="spacing-control-item">
          <label>Bottom</label>
          <RangeControl
            value={currentSpacing.bottom}
            onChange={(newValue) => updateSpacing('bottom', newValue)}
            min={0}
            max={spacingValues.length - 1}
            step={1}
            withInputField={false}
          />
          <Text size="11px" color="#666">
            {spacingValues[currentSpacing.bottom]}px
          </Text>
        </div>
        <div className="spacing-control-item">
          <label>Left</label>
          <RangeControl
            value={currentSpacing.left}
            onChange={(newValue) => updateSpacing('left', newValue)}
            min={0}
            max={spacingValues.length - 1}
            step={1}
            withInputField={false}
          />
          <Text size="11px" color="#666">
            {spacingValues[currentSpacing.left]}px
          </Text>
        </div>
      </div>
    </div>
  )
}

// Improved Color Picker
export const ImprovedColorPicker = ({ 
  label, 
  value, 
  onChange, 
  type = 'background' // 'background', 'text'
}) => {
  const colors = [
    { name: 'White', value: 'white', hex: '#ffffff' },
    { name: 'Gray 50', value: 'gray-50', hex: '#f9fafb' },
    { name: 'Gray 100', value: 'gray-100', hex: '#f3f4f6' },
    { name: 'Gray 200', value: 'gray-200', hex: '#e5e7eb' },
    { name: 'Gray 300', value: 'gray-300', hex: '#d1d5db' },
    { name: 'Gray 500', value: 'gray-500', hex: '#6b7280' },
    { name: 'Gray 700', value: 'gray-700', hex: '#374151' },
    { name: 'Gray 900', value: 'gray-900', hex: '#111827' },
    
    { name: 'Blue 50', value: 'blue-50', hex: '#eff6ff' },
    { name: 'Blue 100', value: 'blue-100', hex: '#dbeafe' },
    { name: 'Blue 500', value: 'blue-500', hex: '#3b82f6' },
    { name: 'Blue 600', value: 'blue-600', hex: '#2563eb' },
    { name: 'Blue 700', value: 'blue-700', hex: '#1d4ed8' },
    { name: 'Blue 900', value: 'blue-900', hex: '#1e3a8a' },
    { name: 'Indigo 600', value: 'indigo-600', hex: '#4f46e5' },
    { name: 'Purple 600', value: 'purple-600', hex: '#9333ea' },
    
    { name: 'Green 50', value: 'green-50', hex: '#f0fdf4' },
    { name: 'Green 100', value: 'green-100', hex: '#dcfce7' },
    { name: 'Green 500', value: 'green-500', hex: '#22c55e' },
    { name: 'Green 600', value: 'green-600', hex: '#16a34a' },
    { name: 'Green 700', value: 'green-700', hex: '#15803d' },
    { name: 'Emerald 600', value: 'emerald-600', hex: '#059669' },
    { name: 'Teal 600', value: 'teal-600', hex: '#0d9488' },
    { name: 'Cyan 600', value: 'cyan-600', hex: '#0891b2' },
    
    { name: 'Red 50', value: 'red-50', hex: '#fef2f2' },
    { name: 'Red 100', value: 'red-100', hex: '#fee2e2' },
    { name: 'Red 500', value: 'red-500', hex: '#ef4444' },
    { name: 'Red 600', value: 'red-600', hex: '#dc2626' },
    { name: 'Orange 500', value: 'orange-500', hex: '#f97316' },
    { name: 'Amber 500', value: 'amber-500', hex: '#f59e0b' },
    { name: 'Yellow 400', value: 'yellow-400', hex: '#facc15' },
    { name: 'Black', value: 'black', hex: '#000000' }
  ]

  const prefix = type === 'background' ? 'bg' : 'text'
  const currentValue = value?.replace(`${prefix}-`, '') || ''

  return (
    <div>
      <div className="section-header">
        {type === 'background' ? '🎨 Background' : '✏️ Text Color'}
      </div>
      <div className="color-palette-grid">
        {colors.map(color => {
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
  )
}

// Improved Typography Control
export const ImprovedTypographyControl = ({ value = {}, onChange, device = 'base' }) => {
  const currentTypo = value[device] || {}

  const fontSizes = [
    { name: 'XS', class: 'text-xs', size: '12px' },
    { name: 'SM', class: 'text-sm', size: '14px' },
    { name: 'Base', class: 'text-base', size: '16px' },
    { name: 'LG', class: 'text-lg', size: '18px' },
    { name: 'XL', class: 'text-xl', size: '20px' },
    { name: '2XL', class: 'text-2xl', size: '24px' },
    { name: '3XL', class: 'text-3xl', size: '30px' },
    { name: '4XL', class: 'text-4xl', size: '36px' },
    { name: '5XL', class: 'text-5xl', size: '48px' }
  ]

  const fontWeights = [
    { name: 'Light', class: 'font-light' },
    { name: 'Normal', class: 'font-normal' },
    { name: 'Medium', class: 'font-medium' },
    { name: 'Bold', class: 'font-bold' }
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
    <div>
      <div className="section-header">
        ✏️ Typography
      </div>
      
      {/* Live Preview */}
      <div 
        className="typography-preview"
        style={{
          fontSize: fontSizes.find(f => f.class === currentTypo.fontSize)?.size || '16px',
          fontWeight: currentTypo.fontWeight?.includes('light') ? '300' : 
                     currentTypo.fontWeight?.includes('medium') ? '500' :
                     currentTypo.fontWeight?.includes('bold') ? '700' : '400',
          textAlign: currentTypo.textAlign?.replace('text-', '') || 'left'
        }}
      >
        Sample text preview
      </div>

      {/* Font Size */}
      <Text size="12px" weight="600" style={{ margin: '12px 0 6px 0', display: 'block' }}>
        Size
      </Text>
      <div className="button-grid">
        {fontSizes.slice(0, 6).map(size => (
          <button
            key={size.class}
            className={`style-button ${currentTypo.fontSize === size.class ? 'selected' : ''}`}
            onClick={() => updateTypography('fontSize', size.class)}
          >
            {size.name}
          </button>
        ))}
      </div>

      {/* Font Weight */}
      <Text size="12px" weight="600" style={{ margin: '12px 0 6px 0', display: 'block' }}>
        Weight
      </Text>
      <div className="button-grid">
        {fontWeights.map(weight => (
          <button
            key={weight.class}
            className={`style-button ${currentTypo.fontWeight === weight.class ? 'selected' : ''}`}
            onClick={() => updateTypography('fontWeight', weight.class)}
          >
            {weight.name}
          </button>
        ))}
      </div>

      {/* Text Alignment */}
      <Text size="12px" weight="600" style={{ margin: '12px 0 6px 0', display: 'block' }}>
        Alignment
      </Text>
      <div className="button-grid">
        {textAligns.map(align => (
          <button
            key={align.class}
            className={`style-button ${currentTypo.textAlign === align.class ? 'selected' : ''}`}
            onClick={() => updateTypography('textAlign', align.class)}
          >
            {align.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

// Main Control Tabs Component
export const ControlTabs = ({ 
  spacing, 
  onSpacingChange,
  background,
  onBackgroundChange,
  textColor,
  onTextColorChange,
  typography,
  onTypographyChange,
  device,
  presets,
  onPresetApply
}) => {
  const tabs = [
    {
      name: 'presets',
      title: '⚡ Quick',
      className: 'tab-presets'
    },
    {
      name: 'spacing', 
      title: '📏 Space',
      className: 'tab-spacing'
    },
    {
      name: 'colors',
      title: '🎨 Colors',
      className: 'tab-colors'
    },
    {
      name: 'typography',
      title: '✏️ Type',
      className: 'tab-typography'
    }
  ]

  return (
    <div className="control-tabs">
      <TabPanel
        className="control-tabs-panel"
        activeClass="is-active"
        orientation="horizontal"
        initialTabName="presets"
        tabs={tabs}
      >
        {(tab) => {
          switch (tab.name) {
            case 'presets':
              return (
                <div>
                  <div className="preset-grid">
                    <button 
                      className="preset-button"
                      onClick={() => onPresetApply('card')}
                    >
                      <div>🃏</div>
                      <div>Card</div>
                    </button>
                    <button 
                      className="preset-button"
                      onClick={() => onPresetApply('hero')}
                    >
                      <div>🏆</div>
                      <div>Hero</div>
                    </button>
                    <button 
                      className="preset-button"
                      onClick={() => onPresetApply('minimal')}
                    >
                      <div>✨</div>
                      <div>Minimal</div>
                    </button>
                    <button 
                      className="preset-button"
                      onClick={() => onPresetApply('bold')}
                    >
                      <div>💪</div>
                      <div>Bold</div>
                    </button>
                  </div>
                </div>
              )
            
            case 'spacing':
              return (
                <ImprovedSpacingControl
                  value={spacing}
                  onChange={onSpacingChange}
                  device={device}
                />
              )
            
            case 'colors':
              return (
                <div>
                  <ImprovedColorPicker
                    label="Background"
                    value={background}
                    onChange={onBackgroundChange}
                    type="background"
                  />
                  <ImprovedColorPicker
                    label="Text"
                    value={textColor}
                    onChange={onTextColorChange}
                    type="text"
                  />
                </div>
              )
            
            case 'typography':
              return (
                <ImprovedTypographyControl
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

// Convert improved values to Tailwind classes
export const generateTailwindClasses = (settings, device = 'base') => {
  const classes = []
  const prefix = device !== 'base' ? `${device}:` : ''
  
  // Spacing values mapping
  const spacingValues = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40]
  
  // Handle spacing
  if (settings.spacing?.[device]) {
    const spacing = settings.spacing[device]
    if (spacing.top > 0) classes.push(`${prefix}pt-${spacingValues[spacing.top]}`)
    if (spacing.right > 0) classes.push(`${prefix}pr-${spacingValues[spacing.right]}`)
    if (spacing.bottom > 0) classes.push(`${prefix}pb-${spacingValues[spacing.bottom]}`)
    if (spacing.left > 0) classes.push(`${prefix}pl-${spacingValues[spacing.left]}`)
  }
  
  // Handle typography
  if (settings.typography?.[device]) {
    const typo = settings.typography[device]
    if (typo.fontSize) classes.push(`${prefix}${typo.fontSize}`)
    if (typo.fontWeight) classes.push(`${prefix}${typo.fontWeight}`)
    if (typo.textAlign) classes.push(`${prefix}${typo.textAlign}`)
  }
  
  // Handle colors (always include base colors, and responsive ones for other devices)
  if (device === 'base') {
    if (settings.backgroundColor) classes.push(settings.backgroundColor)
    if (settings.textColor) classes.push(settings.textColor)
  }
  
  return classes.filter(Boolean).join(' ')
}

// Generate all responsive classes
export const generateAllClasses = (settings) => {
  const allClasses = []
  
  // Always start with base classes
  const baseClasses = generateTailwindClasses(settings, 'base')
  if (baseClasses) allClasses.push(baseClasses)
  
  // Add responsive classes
  const breakpoints = ['sm', 'md', 'lg', 'xl']
  breakpoints.forEach(device => {
    const deviceClasses = generateTailwindClasses(settings, device)
    if (deviceClasses) allClasses.push(deviceClasses)
  })
  
  return allClasses.join(' ').trim()
}