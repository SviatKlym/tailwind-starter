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
  TextareaControl,
  Modal,
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

// CSS has been moved to src/editor.css

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

// Block Spacing Control - Based on site pattern analysis
export const UltimateBlockSpacingControl = ({ value = {}, onChange, device = 'base' }) => {
  const currentSpacing = value[device] || { variation: '' }

  const spacingVariations = [
    {
      name: 'Compact',
      key: 'compact',
      description: '1.5rem / 1rem / 0.5rem',
      classes: {
        section: 'mb-6',
        group: 'mb-4',
        element: 'mb-2',
        padding: 'p-4'
      }
    },
    {
      name: 'Generous',
      key: 'generous',
      description: '3rem / 1.5rem / 0.75rem',
      classes: {
        section: 'mb-12',
        group: 'mb-6',
        element: 'mb-3',
        padding: 'p-6'
      }
    },
    {
      name: 'Balanced',
      key: 'balanced',
      description: '2.5rem / 1.25rem / 0.625rem',
      classes: {
        section: 'mb-10',
        group: 'mb-5',
        element: 'mb-2.5',
        padding: 'p-5'
      }
    },
    {
      name: 'Rhythmic',
      key: 'rhythmic',
      description: '4rem / 2rem / 1rem',
      classes: {
        section: 'mb-16',
        group: 'mb-8',
        element: 'mb-4',
        padding: 'p-4'
      }
    }
  ]


  const updateBlockSpacing = (property, newValue) => {
    if (typeof onChange !== 'function') {
      console.error('onChange is not a function in UltimateBlockSpacingControl')
      return
    }
    
    const newSpacingValue = {
      ...value,
      [device]: {
        ...currentSpacing,
        [property]: newValue
      }
    }
    onChange(newSpacingValue)
  }

  const resetBlockSpacing = () => {
    if (typeof onChange !== 'function') {
      console.error('onChange is not a function in UltimateBlockSpacingControl')
      return
    }
    
    const resetValue = {
      ...value,
      [device]: { variation: '' }
    }
    onChange(resetValue)
  }

  const getSelectedVariation = () => {
    return spacingVariations.find(v => v.key === currentSpacing.variation)
  }

  return (
    <div className="animate-slide-in">
      <div className="section-header">
        <span className="section-header-icon">📦</span>
        {__('Block Spacing Patterns', 'tailwind-starter')}
        <button 
          className="reset-button"
          onClick={resetBlockSpacing}
          title="Reset block spacing"
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

      <Text size="12px" weight="600" style={{ margin: '12px 0 8px 0', display: 'block', color: '#374151' }}>
        Choose Spacing Pattern
      </Text>
      
      <div className="preset-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {spacingVariations.map(variation => {
          const isSelected = currentSpacing.variation === variation.key
          return (
            <button
              key={variation.key}
              className={`preset-button ${isSelected ? 'selected' : ''}`}
              onClick={() => updateBlockSpacing('variation', variation.key)}
              style={{
                padding: '12px',
                background: isSelected ? '#6366f1' : 'white',
                color: isSelected ? 'white' : '#374151',
                border: `2px solid ${isSelected ? '#6366f1' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '11px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {variation.name}
              </div>
              <div style={{ fontSize: '10px', opacity: '0.8' }}>
                {variation.description}
              </div>
            </button>
          )
        })}
      </div>

      {/* Preview of selected variation */}
      {getSelectedVariation() && (
        <div style={{
          margin: '16px 0',
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <Text size="11px" weight="600" style={{ display: 'block', color: '#6366f1', marginBottom: '8px' }}>
            Pattern Preview: {getSelectedVariation().name}
          </Text>
          <div style={{ fontSize: '10px', color: '#64748b', lineHeight: '1.4' }}>
            <div>• Sections: <code>{getSelectedVariation().classes.section}</code></div>
            <div>• Groups: <code>{getSelectedVariation().classes.group}</code></div>
            <div>• Elements: <code>{getSelectedVariation().classes.element}</code></div>
            <div>• Padding: <code>{getSelectedVariation().classes.padding}</code></div>
          </div>
        </div>
      )}

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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <UltimateColorPicker
          label={__('Solid Background Color', 'tailwind-starter')}
          value={background}
          onChange={onBackgroundChange}
          type="background"
        />
        <button
          onClick={() => onBackgroundChange('')}
          style={{
            padding: '4px 8px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
          title="Reset Background Color"
        >
          🔄
        </button>
      </div>

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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <UltimateColorPicker
          label={__('Text Color', 'tailwind-starter')}
          value={textColor}
          onChange={onTextColorChange}
          type="text"
        />
        <button
          onClick={() => onTextColorChange('')}
          style={{
            padding: '4px 8px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
          title="Reset Text Color"
        >
          🔄
        </button>
      </div>
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
  blockSpacing,
  onBlockSpacingChange,
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
  onResetAll
}) => {
  const tabs = [
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

  // Global reset function
  const handleResetAll = () => {
    if (typeof onResetAll === 'function') {
      onResetAll()
    } else {
      // Fallback: reset individual settings
      if (onSpacingChange) onSpacingChange({})
      if (onMarginsChange) onMarginsChange({})
      if (onBlockSpacingChange) onBlockSpacingChange({})
      if (onBackgroundChange) onBackgroundChange('')
      if (onTextColorChange) onTextColorChange('')
      if (onGradientsChange) onGradientsChange({})
      if (onTypographyChange) onTypographyChange({})
      if (onLayoutChange) onLayoutChange({})
      if (onEffectsChange) onEffectsChange({})
    }
  }

  return (
    <div className="ultimate-control-tabs">
      {/* Global Reset Button */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        margin: '16px 0',
        padding: '8px',
        backgroundColor: '#fee2e2',
        borderRadius: '6px',
        border: '1px solid #fecaca'
      }}>
        <button 
          onClick={handleResetAll}
          style={{
            padding: '8px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
            
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#b91c1c'
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#dc2626'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }}
          title="Reset all visual controls to default values"
        >
          🔄 Reset All Visual Controls
        </button>
      </div>
      
      <TabPanel
        className="ultimate-control-tabs-panel"
        activeClass="is-active"
        orientation="horizontal"
        initialTabName="spacing"
        tabs={tabs}
      >
        {(tab) => {
          switch (tab.name) {
            case 'spacing':
              return (
                <div className="animate-slide-in">
                  <UltimateBlockSpacingControl
                    value={blockSpacing}
                    onChange={onBlockSpacingChange}
                    device={device}
                  />
                  <div style={{ marginTop: '24px' }}>
                    <UltimateSpacingControl
                      value={spacing}
                      onChange={onSpacingChange}
                      device={device}
                    />
                  </div>
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
    const spacing = settings.spacing?.[device] || {}
    if (spacing.top > 0) classes.push(`${prefix}pt-${spacing.top}`)
    if (spacing.right > 0) classes.push(`${prefix}pr-${spacing.right}`)
    if (spacing.bottom > 0) classes.push(`${prefix}pb-${spacing.bottom}`)
    if (spacing.left > 0) classes.push(`${prefix}pl-${spacing.left}`)
  }

  if (settings.margins?.[device]) {
    const margins = settings.margins?.[device] || {}
    if (margins.top > 0) classes.push(`${prefix}mt-${margins.top}`)
    if (margins.right > 0) classes.push(`${prefix}mr-${margins.right}`)
    if (margins.bottom > 0) classes.push(`${prefix}mb-${margins.bottom}`)
    if (margins.left > 0) classes.push(`${prefix}ml-${margins.left}`)
  }

  // Block spacing patterns - only apply if no individual spacing/margins are set
  const hasIndividualSpacing = settings.spacing?.[device] && Object.values(settings.spacing?.[device] || {}).some(val => val > 0)
  const hasIndividualMargins = settings.margins?.[device] && Object.values(settings.margins?.[device] || {}).some(val => val > 0)
  
  if (settings.blockSpacing?.[device] && !hasIndividualSpacing && !hasIndividualMargins) {
    const blockSpacing = settings.blockSpacing?.[device] || {}
    
    // Apply spacing variation classes based on selected pattern
    if (blockSpacing.variation) {
      const spacingPatterns = {
        'compact': {
          section: 'mb-6',
          padding: 'p-4'
        },
        'generous': {
          section: 'mb-12',
          padding: 'p-6'
        },
        'balanced': {
          section: 'mb-10',
          padding: 'p-5'
        },
        'rhythmic': {
          section: 'mb-16',
          padding: 'p-4'
        }
      }
      
      const pattern = spacingPatterns[blockSpacing.variation]
      if (pattern) {
        // Add the section spacing and padding from pattern
        classes.push(`${prefix}${pattern.section}`)
        classes.push(`${prefix}${pattern.padding}`)
      }
    }
  }
  
  if (settings.typography?.[device]) {
    const typo = settings.typography?.[device] || {}
    if (typo.fontSize) classes.push(`${prefix}${typo.fontSize}`)
    if (typo.fontWeight) classes.push(`${prefix}${typo.fontWeight}`)
    if (typo.textAlign) classes.push(`${prefix}${typo.textAlign}`)
    if (typo.lineHeight) classes.push(`${prefix}${typo.lineHeight}`)
    if (typo.letterSpacing) classes.push(`${prefix}${typo.letterSpacing}`)
    if (typo.textTransform) classes.push(`${prefix}${typo.textTransform}`)
    if (typo.fontSmoothing) classes.push(`${prefix}${typo.fontSmoothing}`)
  }
  
  if (settings.layout?.[device]) {
    const layout = settings.layout?.[device] || {}
    
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
    const effects = settings.effects?.[device] || {}
    
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
    const gradients = settings.gradients?.[device] || {}
    
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
    } else if (settings.backgroundColor?.[device]) {
      // Responsive object format
      classes.push(`${prefix}${settings.backgroundColor[device]}`)
    }
  }
  
  if (settings.textColor) {
    if (typeof settings.textColor === 'string') {
      // Simple string format for backward compatibility
      if (device === 'base') classes.push(settings.textColor)
    } else if (settings.textColor?.[device]) {
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
    const layout = settings.layout?.[device] || {}
    
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
    // Apply default settings if empty to ensure proper styling
    let finalSettings = settings || {}
    if (!settings || (!settings.spacing && !settings.blockSpacing)) {
      finalSettings = {
        ...settings,
        blockSpacing: {
          base: {
            variation: 'balanced'  // This provides default mb-10 p-5 classes
          }
        }
      }
    }
    
    const allClasses = []
    
    const baseClasses = generateTailwindClasses(finalSettings, 'base')
    if (baseClasses) allClasses.push(baseClasses)
    
    const breakpoints = ['sm', 'md', 'lg', 'xl']
    breakpoints.forEach(device => {
      const deviceClasses = generateTailwindClasses(finalSettings, device)
      if (deviceClasses) allClasses.push(deviceClasses)
    })
    
    return allClasses.join(' ').trim()
  })
}

// Enhanced Modal for Managing Complex Controls
export const UltimateManagementModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium' // small, medium, large
}) => {
  if (!isOpen) return null

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { maxWidth: '400px', maxHeight: '500px' }
      case 'large':
        return { maxWidth: '800px', maxHeight: '90vh' }
      default:
        return { maxWidth: '600px', maxHeight: '70vh' }
    }
  }

  return (
    <Modal
      title={title}
      onRequestClose={onClose}
      className="ultimate-management-modal"
      style={getSizeStyles()}
    >
      <div style={{
        padding: '20px',
        maxHeight: '60vh',
        overflowY: 'auto'
      }}>
        {children}
      </div>
    </Modal>
  )
}

// Stats Management Modal Component
export const StatsManagementModal = ({ 
  isOpen, 
  onClose, 
  stats = [], 
  onStatsChange 
}) => {
  const [editingIndex, setEditingIndex] = useState(null)
  const [localStats, setLocalStats] = useState(stats)

  const addStat = () => {
    const newStat = {
      id: Date.now(),
      number: '0',
      label: 'New Stat',
      description: '',
      icon: '',
      color: 'blue',
      highlighted: false
    }
    const updated = [...localStats, newStat]
    setLocalStats(updated)
    onStatsChange(updated)
  }

  const updateStat = (index, field, value) => {
    const updated = localStats.map((stat, i) => 
      i === index ? { ...stat, [field]: value } : stat
    )
    setLocalStats(updated)
    onStatsChange(updated)
  }

  const removeStat = (index) => {
    const updated = localStats.filter((_, i) => i !== index)
    setLocalStats(updated)
    onStatsChange(updated)
  }

  const duplicateStat = (index) => {
    const statToDuplicate = { ...localStats[index], id: Date.now() }
    const updated = [...localStats, statToDuplicate]
    setLocalStats(updated)
    onStatsChange(updated)
  }

  return (
    <UltimateManagementModal
      isOpen={isOpen}
      onClose={onClose}
      title={__('📊 Stats Management', 'tailwind-starter')}
      size="large"
    >
      <div className="stats-management-modal">
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Button
            isPrimary
            onClick={addStat}
            style={{
              background: '#0073aa',
              borderColor: '#0073aa',
              boxShadow: '0 2px 4px rgba(0,115,170,0.3)',
              fontWeight: '600'
            }}
          >
            ➕ Add New Stat
          </Button>
        </div>

        {localStats.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px dashed #ddd'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <p style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>
              No stats added yet
            </p>
            <p style={{ margin: '0', fontSize: '14px' }}>
              Click "Add New Stat" to create your first statistic
            </p>
          </div>
        )}

        <div className="stats-list" style={{ display: 'grid', gap: '16px' }}>
          {localStats.map((stat, index) => (
            <Card key={stat.id} style={{ border: '1px solid #e2e8f0' }}>
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Text size="16px" weight="600">
                    📈 Stat #{index + 1}
                  </Text>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      isSmall
                      onClick={() => duplicateStat(index)}
                      title="Duplicate Stat"
                      style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #0369a1' }}
                    >
                      📋
                    </Button>
                    <Button
                      isSmall
                      isDestructive
                      onClick={() => removeStat(index)}
                      title="Remove Stat"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>

                <VStack spacing={3}>
                  <HStack spacing={3}>
                    <TextControl
                      label="Number/Value"
                      value={stat.number}
                      onChange={(value) => updateStat(index, 'number', value)}
                      placeholder="e.g., 100, 50K, 95%"
                      style={{ flex: 1 }}
                    />
                    <TextControl
                      label="Icon/Emoji"
                      value={stat.icon}
                      onChange={(value) => updateStat(index, 'icon', value)}
                      placeholder="📊"
                      style={{ flex: '0 0 80px' }}
                    />
                  </HStack>

                  <TextControl
                    label="Label"
                    value={stat.label}
                    onChange={(value) => updateStat(index, 'label', value)}
                    placeholder="e.g., Happy Customers"
                  />

                  <TextControl
                    label="Description (Optional)"
                    value={stat.description}
                    onChange={(value) => updateStat(index, 'description', value)}
                    placeholder="Additional details about this statistic"
                  />

                  <HStack spacing={3}>
                    <SelectControl
                      label="Color Theme"
                      value={stat.color}
                      onChange={(value) => updateStat(index, 'color', value)}
                      options={[
                        { label: 'Blue', value: 'blue' },
                        { label: 'Green', value: 'green' },
                        { label: 'Purple', value: 'purple' },
                        { label: 'Red', value: 'red' },
                        { label: 'Orange', value: 'orange' },
                        { label: 'Gray', value: 'gray' }
                      ]}
                      style={{ flex: 1 }}
                    />
                    <div style={{ flex: 1 }}>
                      <ToggleControl
                        label="Highlight This Stat"
                        checked={stat.highlighted}
                        onChange={(value) => updateStat(index, 'highlighted', value)}
                        help={stat.highlighted ? "This stat will stand out" : "Regular appearance"}
                      />
                    </div>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </div>

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #0369a1'
        }}>
          <Text size="14px" weight="600" style={{ color: '#0369a1', marginBottom: '8px' }}>
            💡 Stats Management Tips:
          </Text>
          <ul style={{ margin: '0', paddingLeft: '16px', color: '#1e40af', fontSize: '13px' }}>
            <li>Use emojis or icons to make stats more engaging</li>
            <li>Keep labels short and descriptive</li>
            <li>Highlight your most important statistic</li>
            <li>Use consistent number formatting (e.g., 100K, 95%)</li>
          </ul>
        </div>
      </div>
    </UltimateManagementModal>
  )
}

// Slides Management Modal Component
export const SlidesManagementModal = ({ 
  isOpen, 
  onClose, 
  slides = [], 
  onSlidesChange 
}) => {
  const [editingIndex, setEditingIndex] = useState(null)
  const [localSlides, setLocalSlides] = useState(slides)

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: 'New Slide',
      content: 'Slide content goes here...',
      image: null,
      buttonText: '',
      buttonUrl: '',
      backgroundColor: 'bg-white',
      textColor: 'text-gray-900',
      alignment: 'center'
    }
    const updated = [...localSlides, newSlide]
    setLocalSlides(updated)
    onSlidesChange(updated)
  }

  const updateSlide = (index, field, value) => {
    const updated = localSlides.map((slide, i) => 
      i === index ? { ...slide, [field]: value } : slide
    )
    setLocalSlides(updated)
    onSlidesChange(updated)
  }

  const removeSlide = (index) => {
    const updated = localSlides.filter((_, i) => i !== index)
    setLocalSlides(updated)
    onSlidesChange(updated)
  }

  const duplicateSlide = (index) => {
    const slideToDuplicate = { ...localSlides[index], id: Date.now() }
    const updated = [...localSlides, slideToDuplicate]
    setLocalSlides(updated)
    onSlidesChange(updated)
  }

  const moveSlide = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= localSlides.length) return

    const updated = [...localSlides]
    const [moved] = updated.splice(index, 1)
    updated.splice(newIndex, 0, moved)
    setLocalSlides(updated)
    onSlidesChange(updated)
  }

  return (
    <UltimateManagementModal
      isOpen={isOpen}
      onClose={onClose}
      title={__('🎯 Slides Management', 'tailwind-starter')}
      size="large"
    >
      <div className="slides-management-modal">
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Button
            isPrimary
            onClick={addSlide}
            style={{
              background: '#059669',
              borderColor: '#059669',
              boxShadow: '0 2px 4px rgba(5,150,105,0.3)',
              fontWeight: '600'
            }}
          >
            ➕ Add New Slide
          </Button>
        </div>

        {localSlides.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px dashed #ddd'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <p style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>
              No slides added yet
            </p>
            <p style={{ margin: '0', fontSize: '14px' }}>
              Click "Add New Slide" to create your first slide
            </p>
          </div>
        )}

        <div className="slides-list" style={{ display: 'grid', gap: '16px' }}>
          {localSlides.map((slide, index) => (
            <Card key={slide.id} style={{ border: '1px solid #e2e8f0' }}>
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Text size="16px" weight="600">
                    🎯 Slide #{index + 1}
                  </Text>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      isSmall
                      onClick={() => moveSlide(index, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                      style={{ background: '#f3f4f6', color: '#374151' }}
                    >
                      ⬆️
                    </Button>
                    <Button
                      isSmall
                      onClick={() => moveSlide(index, 'down')}
                      disabled={index === localSlides.length - 1}
                      title="Move Down"
                      style={{ background: '#f3f4f6', color: '#374151' }}
                    >
                      ⬇️
                    </Button>
                    <Button
                      isSmall
                      onClick={() => duplicateSlide(index)}
                      title="Duplicate Slide"
                      style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #0369a1' }}
                    >
                      📋
                    </Button>
                    <Button
                      isSmall
                      isDestructive
                      onClick={() => removeSlide(index)}
                      title="Remove Slide"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>

                <VStack spacing={3}>
                  <TextControl
                    label="Slide Title"
                    value={slide.title}
                    onChange={(value) => updateSlide(index, 'title', value)}
                    placeholder="Enter slide title"
                  />

                  <TextControl
                    label="Slide Content"
                    value={slide.content}
                    onChange={(value) => updateSlide(index, 'content', value)}
                    placeholder="Enter slide content"
                    help="You can use HTML tags for formatting"
                  />

                  <HStack spacing={3}>
                    <TextControl
                      label="Button Text (Optional)"
                      value={slide.buttonText}
                      onChange={(value) => updateSlide(index, 'buttonText', value)}
                      placeholder="e.g., Learn More"
                      style={{ flex: 1 }}
                    />
                    <TextControl
                      label="Button URL (Optional)"
                      value={slide.buttonUrl}
                      onChange={(value) => updateSlide(index, 'buttonUrl', value)}
                      placeholder="https://example.com"
                      style={{ flex: 1 }}
                    />
                  </HStack>

                  <HStack spacing={3}>
                    <SelectControl
                      label="Background Color"
                      value={slide.backgroundColor}
                      onChange={(value) => updateSlide(index, 'backgroundColor', value)}
                      options={[
                        { label: 'White', value: 'bg-white' },
                        { label: 'Gray 50', value: 'bg-gray-50' },
                        { label: 'Blue 50', value: 'bg-blue-50' },
                        { label: 'Green 50', value: 'bg-green-50' },
                        { label: 'Purple 50', value: 'bg-purple-50' },
                        { label: 'Dark', value: 'bg-gray-900' }
                      ]}
                      style={{ flex: 1 }}
                    />
                    <SelectControl
                      label="Text Alignment"
                      value={slide.alignment}
                      onChange={(value) => updateSlide(index, 'alignment', value)}
                      options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' }
                      ]}
                      style={{ flex: 1 }}
                    />
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </div>

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f0fdf4', 
          borderRadius: '8px',
          border: '1px solid #059669'
        }}>
          <Text size="14px" weight="600" style={{ color: '#059669', marginBottom: '8px' }}>
            💡 Slides Management Tips:
          </Text>
          <ul style={{ margin: '0', paddingLeft: '16px', color: '#047857', fontSize: '13px' }}>
            <li>Use the arrow buttons to reorder slides</li>
            <li>Keep slide content concise and engaging</li>
            <li>Add call-to-action buttons to improve engagement</li>
            <li>Use consistent styling across all slides</li>
          </ul>
        </div>
      </div>
    </UltimateManagementModal>
  )
}

// Team Members Management Modal Component
export const TeamManagementModal = ({ 
  isOpen, 
  onClose, 
  members = [], 
  onMembersChange 
}) => {
  const [editingIndex, setEditingIndex] = useState(null)
  const [localMembers, setLocalMembers] = useState(members)

  const addMember = () => {
    const newMember = {
      id: Date.now(),
      name: 'Team Member',
      role: 'Position',
      bio: 'Short bio about this team member.',
      image: null,
      social: { linkedin: '', twitter: '', email: '' }
    }
    const updatedMembers = [...localMembers, newMember]
    setLocalMembers(updatedMembers)
    onMembersChange(updatedMembers)
  }

  const updateMember = (index, field, value) => {
    const updatedMembers = [...localMembers]
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      updatedMembers[index][parent] = { ...updatedMembers[index][parent], [child]: value }
    } else {
      updatedMembers[index][field] = value
    }
    setLocalMembers(updatedMembers)
    onMembersChange(updatedMembers)
  }

  const removeMember = (index) => {
    const updatedMembers = localMembers.filter((_, i) => i !== index)
    setLocalMembers(updatedMembers)
    onMembersChange(updatedMembers)
  }

  return (
    <UltimateManagementModal
      isOpen={isOpen}
      onClose={onClose}
      title="👥 Team Members Management"
      size="large"
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}>
        {localMembers.map((member, index) => (
          <Card key={member.id} style={{ marginBottom: '16px' }}>
            <CardBody>
              <VStack spacing={3}>
                <HStack justify="space-between">
                  <Text weight="600">Team Member {index + 1}</Text>
                  <Button isDestructive isSmall onClick={() => removeMember(index)}>
                    Remove
                  </Button>
                </HStack>
                
                <HStack>
                  <TextControl
                    label="Name"
                    value={member.name}
                    onChange={(value) => updateMember(index, 'name', value)}
                    style={{ flex: 1 }}
                  />
                  <TextControl
                    label="Role/Position"
                    value={member.role}
                    onChange={(value) => updateMember(index, 'role', value)}
                    style={{ flex: 1 }}
                  />
                </HStack>

                <TextareaControl
                  label="Bio"
                  value={member.bio}
                  onChange={(value) => updateMember(index, 'bio', value)}
                  rows={3}
                />

                <div>
                  <Text size="14px" weight="600" style={{ marginBottom: '8px' }}>Social Links</Text>
                  <HStack>
                    <TextControl
                      label="LinkedIn"
                      value={member.social?.linkedin || ''}
                      onChange={(value) => updateMember(index, 'social.linkedin', value)}
                      placeholder="https://linkedin.com/in/username"
                      style={{ flex: 1 }}
                    />
                    <TextControl
                      label="Twitter"
                      value={member.social?.twitter || ''}
                      onChange={(value) => updateMember(index, 'social.twitter', value)}
                      placeholder="https://twitter.com/username"
                      style={{ flex: 1 }}
                    />
                    <TextControl
                      label="Email"
                      value={member.social?.email || ''}
                      onChange={(value) => updateMember(index, 'social.email', value)}
                      placeholder="email@domain.com"
                      style={{ flex: 1 }}
                    />
                  </HStack>
                </div>
              </VStack>
            </CardBody>
          </Card>
        ))}

        <Button isPrimary onClick={addMember} style={{ width: '100%', marginTop: '16px' }}>
          ➕ Add Team Member
        </Button>
      </div>
    </UltimateManagementModal>
  )
}

// Testimonials Management Modal Component
export const TestimonialsManagementModal = ({ 
  isOpen, 
  onClose, 
  testimonials = [], 
  onTestimonialsChange 
}) => {
  const [localTestimonials, setLocalTestimonials] = useState(testimonials)

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      content: 'Great testimonial content here...',
      author: 'Customer Name',
      role: 'Customer Title',
      company: 'Company Name',
      rating: 5,
      featured: false
    }
    const updatedTestimonials = [...localTestimonials, newTestimonial]
    setLocalTestimonials(updatedTestimonials)
    onTestimonialsChange(updatedTestimonials)
  }

  const updateTestimonial = (index, field, value) => {
    const updatedTestimonials = [...localTestimonials]
    updatedTestimonials[index][field] = value
    setLocalTestimonials(updatedTestimonials)
    onTestimonialsChange(updatedTestimonials)
  }

  const removeTestimonial = (index) => {
    const updatedTestimonials = localTestimonials.filter((_, i) => i !== index)
    setLocalTestimonials(updatedTestimonials)
    onTestimonialsChange(updatedTestimonials)
  }

  return (
    <UltimateManagementModal
      isOpen={isOpen}
      onClose={onClose}
      title="💬 Testimonials Management"
      size="large"
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}>
        {localTestimonials.map((testimonial, index) => (
          <Card key={testimonial.id} style={{ marginBottom: '16px' }}>
            <CardBody>
              <VStack spacing={3}>
                <HStack justify="space-between">
                  <Text weight="600">Testimonial {index + 1}</Text>
                  <div>
                    <Button 
                      isSecondary 
                      isSmall 
                      onClick={() => updateTestimonial(index, 'featured', !testimonial.featured)}
                      style={{ marginRight: '8px' }}
                    >
                      {testimonial.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button isDestructive isSmall onClick={() => removeTestimonial(index)}>
                      Remove
                    </Button>
                  </div>
                </HStack>
                
                <TextareaControl
                  label="Testimonial Content"
                  value={testimonial.content}
                  onChange={(value) => updateTestimonial(index, 'content', value)}
                  rows={4}
                />

                <HStack>
                  <TextControl
                    label="Author Name"
                    value={testimonial.author}
                    onChange={(value) => updateTestimonial(index, 'author', value)}
                    style={{ flex: 1 }}
                  />
                  <TextControl
                    label="Role/Title"
                    value={testimonial.role}
                    onChange={(value) => updateTestimonial(index, 'role', value)}
                    style={{ flex: 1 }}
                  />
                  <TextControl
                    label="Company"
                    value={testimonial.company}
                    onChange={(value) => updateTestimonial(index, 'company', value)}
                    style={{ flex: 1 }}
                  />
                </HStack>

                <RangeControl
                  label="Rating"
                  value={testimonial.rating}
                  onChange={(value) => updateTestimonial(index, 'rating', value)}
                  min={1}
                  max={5}
                />
              </VStack>
            </CardBody>
          </Card>
        ))}

        <Button isPrimary onClick={addTestimonial} style={{ width: '100%', marginTop: '16px' }}>
          ➕ Add Testimonial
        </Button>
      </div>
    </UltimateManagementModal>
  )
}

// FAQ Management Modal Component
export const FAQManagementModal = ({ 
  isOpen, 
  onClose, 
  faqs = [], 
  onFAQsChange 
}) => {
  const [localFAQs, setLocalFAQs] = useState(faqs)

  const addFAQ = () => {
    const newFAQ = {
      id: Date.now(),
      question: 'Frequently Asked Question?',
      answer: 'Answer to the question goes here...',
      category: 'General',
      featured: false
    }
    const updatedFAQs = [...localFAQs, newFAQ]
    setLocalFAQs(updatedFAQs)
    onFAQsChange(updatedFAQs)
  }

  const updateFAQ = (index, field, value) => {
    const updatedFAQs = [...localFAQs]
    updatedFAQs[index][field] = value
    setLocalFAQs(updatedFAQs)
    onFAQsChange(updatedFAQs)
  }

  const removeFAQ = (index) => {
    const updatedFAQs = localFAQs.filter((_, i) => i !== index)
    setLocalFAQs(updatedFAQs)
    onFAQsChange(updatedFAQs)
  }

  return (
    <UltimateManagementModal
      isOpen={isOpen}
      onClose={onClose}
      title="📝 FAQ Management"
      size="large"
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}>
        {localFAQs.map((faq, index) => (
          <Card key={faq.id} style={{ marginBottom: '16px' }}>
            <CardBody>
              <VStack spacing={3}>
                <HStack justify="space-between">
                  <Text weight="600">FAQ {index + 1}</Text>
                  <div>
                    <Button 
                      isSecondary 
                      isSmall 
                      onClick={() => updateFAQ(index, 'featured', !faq.featured)}
                      style={{ marginRight: '8px' }}
                    >
                      {faq.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button isDestructive isSmall onClick={() => removeFAQ(index)}>
                      Remove
                    </Button>
                  </div>
                </HStack>
                
                <TextControl
                  label="Question"
                  value={faq.question}
                  onChange={(value) => updateFAQ(index, 'question', value)}
                />

                <TextareaControl
                  label="Answer"
                  value={faq.answer}
                  onChange={(value) => updateFAQ(index, 'answer', value)}
                  rows={4}
                />

                <TextControl
                  label="Category"
                  value={faq.category}
                  onChange={(value) => updateFAQ(index, 'category', value)}
                  placeholder="e.g., General, Technical, Billing"
                />
              </VStack>
            </CardBody>
          </Card>
        ))}

        <Button isPrimary onClick={addFAQ} style={{ width: '100%', marginTop: '16px' }}>
          ➕ Add FAQ
        </Button>
      </div>
    </UltimateManagementModal>
  )
}

// Process Steps Management Modal Component
export const ProcessStepsManagementModal = ({ 
  isOpen, 
  onClose, 
  steps = [], 
  onStepsChange 
}) => {
  const [localSteps, setLocalSteps] = useState(steps)

  const addStep = () => {
    const newStep = {
      id: Date.now(),
      title: 'Process Step',
      description: 'Description of this step...',
      icon: '🔹',
      number: localSteps.length + 1
    }
    const updatedSteps = [...localSteps, newStep]
    setLocalSteps(updatedSteps)
    onStepsChange(updatedSteps)
  }

  const updateStep = (index, field, value) => {
    const updatedSteps = [...localSteps]
    updatedSteps[index][field] = value
    setLocalSteps(updatedSteps)
    onStepsChange(updatedSteps)
  }

  const removeStep = (index) => {
    const updatedSteps = localSteps.filter((_, i) => i !== index)
    // Renumber steps
    updatedSteps.forEach((step, i) => {
      step.number = i + 1
    })
    setLocalSteps(updatedSteps)
    onStepsChange(updatedSteps)
  }

  return (
    <UltimateManagementModal
      isOpen={isOpen}
      onClose={onClose}
      title="📝 Process Steps Management"
      size="large"
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}>
        {localSteps.map((step, index) => (
          <Card key={step.id} style={{ marginBottom: '16px' }}>
            <CardBody>
              <VStack spacing={3}>
                <HStack justify="space-between">
                  <Text weight="600">Step {index + 1}</Text>
                  <Button isDestructive isSmall onClick={() => removeStep(index)}>
                    Remove
                  </Button>
                </HStack>
                
                <HStack>
                  <TextControl
                    label="Icon (Emoji)"
                    value={step.icon}
                    onChange={(value) => updateStep(index, 'icon', value)}
                    style={{ width: '80px' }}
                  />
                  <TextControl
                    label="Step Title"
                    value={step.title}
                    onChange={(value) => updateStep(index, 'title', value)}
                    style={{ flex: 1 }}
                  />
                </HStack>

                <TextareaControl
                  label="Step Description"
                  value={step.description}
                  onChange={(value) => updateStep(index, 'description', value)}
                  rows={3}
                />
              </VStack>
            </CardBody>
          </Card>
        ))}

        <Button isPrimary onClick={addStep} style={{ width: '100%', marginTop: '16px' }}>
          ➕ Add Process Step
        </Button>
      </div>
    </UltimateManagementModal>
  )
}

// Videos Management Modal Component
export const VideosManagementModal = ({ 
  isOpen, 
  onClose, 
  videos = [], 
  onVideosChange 
}) => {
  const [localVideos, setLocalVideos] = useState(videos)

  const addVideo = () => {
    const newVideo = {
      id: Date.now(),
      title: 'Video Title',
      description: 'Video description...',
      url: '',
      thumbnail: null,
      duration: '',
      featured: false
    }
    const updatedVideos = [...localVideos, newVideo]
    setLocalVideos(updatedVideos)
    onVideosChange(updatedVideos)
  }

  const updateVideo = (index, field, value) => {
    const updatedVideos = [...localVideos]
    updatedVideos[index][field] = value
    setLocalVideos(updatedVideos)
    onVideosChange(updatedVideos)
  }

  const removeVideo = (index) => {
    const updatedVideos = localVideos.filter((_, i) => i !== index)
    setLocalVideos(updatedVideos)
    onVideosChange(updatedVideos)
  }

  return (
    <UltimateManagementModal
      isOpen={isOpen}
      onClose={onClose}
      title="🎬 Videos Management"
      size="large"
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}>
        {localVideos.map((video, index) => (
          <Card key={video.id} style={{ marginBottom: '16px' }}>
            <CardBody>
              <VStack spacing={3}>
                <HStack justify="space-between">
                  <Text weight="600">Video {index + 1}</Text>
                  <div>
                    <Button 
                      isSecondary 
                      isSmall 
                      onClick={() => updateVideo(index, 'featured', !video.featured)}
                      style={{ marginRight: '8px' }}
                    >
                      {video.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button isDestructive isSmall onClick={() => removeVideo(index)}>
                      Remove
                    </Button>
                  </div>
                </HStack>
                
                <TextControl
                  label="Video Title"
                  value={video.title}
                  onChange={(value) => updateVideo(index, 'title', value)}
                />

                <TextControl
                  label="Video URL"
                  value={video.url}
                  onChange={(value) => updateVideo(index, 'url', value)}
                  placeholder="https://youtube.com/watch?v=..."
                />

                <HStack>
                  <TextareaControl
                    label="Description"
                    value={video.description}
                    onChange={(value) => updateVideo(index, 'description', value)}
                    rows={3}
                    style={{ flex: 1 }}
                  />
                  <TextControl
                    label="Duration"
                    value={video.duration}
                    onChange={(value) => updateVideo(index, 'duration', value)}
                    placeholder="5:30"
                    style={{ width: '100px' }}
                  />
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}

        <Button isPrimary onClick={addVideo} style={{ width: '100%', marginTop: '16px' }}>
          ➕ Add Video
        </Button>
      </div>
    </UltimateManagementModal>
  )
}
