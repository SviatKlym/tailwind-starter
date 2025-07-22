/**
 * Fixed Visual Controls - Addresses React DOM errors and performance issues
 * Simplified and optimized version with proper error handling
 */

import React, { useState, useCallback } from 'react'
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

// Safe performance tracking - no errors if undefined
const safeTrackGeneration = (fn, fallback = () => ({})) => {
  try {
    return typeof fn === 'function' ? fn() : fallback()
  } catch (error) {
    console.warn('Visual controls generation error:', error)
    return fallback()
  }
}

// Safe attribute access with defaults
const safeGet = (obj, path, defaultValue = {}) => {
  try {
    return path.split('.').reduce((current, key) => current && current[key], obj) || defaultValue
  } catch {
    return defaultValue
  }
}

// Device selector component with error boundaries
export const UltimateDeviceSelector = ({ activeDevice = 'base', onDeviceChange }) => {
  if (typeof onDeviceChange !== 'function') {
    console.warn('UltimateDeviceSelector: onDeviceChange must be a function')
    return null
  }

  const devices = [
    { key: 'base', label: __('All Devices'), icon: '🖥️' },
    { key: 'md', label: __('Tablet'), icon: '📱' },
    { key: 'sm', label: __('Mobile'), icon: '📱' }
  ]

  return (
    <div className="device-selector" style={{ 
      display: 'flex', 
      gap: '3px', 
      margin: '12px 0',
      padding: '3px',
      background: '#f0f0f0',
      borderRadius: '8px'
    }}>
      {devices.map(device => (
        <button
          key={device.key}
          type="button"
          className={`device-btn ${activeDevice === device.key ? 'active' : ''}`}
          onClick={() => onDeviceChange(device.key)}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            background: activeDevice === device.key ? '#0073aa' : 'transparent',
            color: activeDevice === device.key ? 'white' : '#333',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          <span>{device.icon}</span>
          <span style={{ marginLeft: '4px' }}>{device.label}</span>
        </button>
      ))}
    </div>
  )
}

// Simplified spacing control with proper error handling
export const UltimateSpacingControl = ({ 
  value = {}, 
  onChange, 
  device = 'base',
  label = __('Spacing')
}) => {
  if (typeof onChange !== 'function') {
    console.warn('UltimateSpacingControl: onChange must be a function')
    return null
  }

  const deviceValue = safeGet(value, device, { top: 0, right: 0, bottom: 0, left: 0 })
  
  const updateSpacing = useCallback((side, newValue) => {
    const safeValue = typeof newValue === 'number' ? newValue : 0
    const newSpacing = {
      ...value,
      [device]: {
        ...deviceValue,
        [side]: safeValue
      }
    }
    onChange(newSpacing)
  }, [value, device, deviceValue, onChange])

  const sides = [
    { key: 'top', label: __('Top') },
    { key: 'right', label: __('Right') },
    { key: 'bottom', label: __('Bottom') },
    { key: 'left', label: __('Left') }
  ]

  return (
    <PanelBody title={label} initialOpen={false}>
      <VStack spacing={3}>
        {sides.map(side => (
          <RangeControl
            key={side.key}
            label={side.label}
            value={deviceValue[side.key] || 0}
            onChange={(newValue) => updateSpacing(side.key, newValue)}
            min={0}
            max={20}
            step={1}
          />
        ))}
      </VStack>
    </PanelBody>
  )
}

// Simplified typography control
export const UltimateTypographyControl = ({ 
  value = {}, 
  onChange, 
  device = 'base',
  label = __('Typography')
}) => {
  if (typeof onChange !== 'function') {
    console.warn('UltimateTypographyControl: onChange must be a function')
    return null
  }

  const deviceValue = safeGet(value, device, { fontSize: '', fontWeight: '', lineHeight: '' })
  
  const updateTypography = useCallback((property, newValue) => {
    const newTypography = {
      ...value,
      [device]: {
        ...deviceValue,
        [property]: newValue || ''
      }
    }
    onChange(newTypography)
  }, [value, device, deviceValue, onChange])

  const fontSizeOptions = [
    { label: __('Default'), value: '' },
    { label: __('Small'), value: 'text-sm' },
    { label: __('Base'), value: 'text-base' },
    { label: __('Large'), value: 'text-lg' },
    { label: __('Extra Large'), value: 'text-xl' },
    { label: __('2XL'), value: 'text-2xl' },
    { label: __('3XL'), value: 'text-3xl' }
  ]

  const fontWeightOptions = [
    { label: __('Default'), value: '' },
    { label: __('Light'), value: 'font-light' },
    { label: __('Normal'), value: 'font-normal' },
    { label: __('Medium'), value: 'font-medium' },
    { label: __('Semibold'), value: 'font-semibold' },
    { label: __('Bold'), value: 'font-bold' }
  ]

  return (
    <PanelBody title={label} initialOpen={false}>
      <VStack spacing={3}>
        <SelectControl
          label={__('Font Size')}
          value={deviceValue.fontSize || ''}
          options={fontSizeOptions}
          onChange={(newValue) => updateTypography('fontSize', newValue)}
        />
        <SelectControl
          label={__('Font Weight')}
          value={deviceValue.fontWeight || ''}
          options={fontWeightOptions}
          onChange={(newValue) => updateTypography('fontWeight', newValue)}
        />
      </VStack>
    </PanelBody>
  )
}

// Main control tabs component with error boundaries
export const UltimateControlTabs = ({
  spacing = {},
  typography = {},
  colors = {},
  effects = {},
  onSpacingChange,
  onTypographyChange,
  onColorsChange,
  onEffectsChange
}) => {
  const [device, setDevice] = useState('base')

  // Validate all onChange functions
  const safeOnSpacingChange = useCallback((value) => {
    if (typeof onSpacingChange === 'function') {
      onSpacingChange(value)
    }
  }, [onSpacingChange])

  const safeOnTypographyChange = useCallback((value) => {
    if (typeof onTypographyChange === 'function') {
      onTypographyChange(value)
    }
  }, [onTypographyChange])

  const tabs = [
    {
      name: 'spacing',
      title: __('Spacing'),
      content: (
        <UltimateSpacingControl
          value={spacing}
          onChange={safeOnSpacingChange}
          device={device}
        />
      )
    },
    {
      name: 'typography', 
      title: __('Typography'),
      content: (
        <UltimateTypographyControl
          value={typography}
          onChange={safeOnTypographyChange}
          device={device}
        />
      )
    }
  ]

  return (
    <div className="ultimate-visual-controls">
      <UltimateDeviceSelector
        activeDevice={device}
        onDeviceChange={setDevice}
      />
      
      <TabPanel
        tabs={tabs}
        initialTabName="spacing"
      >
        {tab => tab.content}
      </TabPanel>
    </div>
  )
}

// Safe class generation with error handling
export const generateTailwindClasses = (settings = {}) => {
  return safeTrackGeneration(() => {
    const classes = []
    
    // Safe spacing class generation
    const spacing = safeGet(settings, 'spacing', {})
    Object.entries(spacing).forEach(([device, values]) => {
      if (values && typeof values === 'object') {
        const devicePrefix = device === 'base' ? '' : `${device}:`
        
        if (typeof values.top === 'number' && values.top > 0) {
          classes.push(`${devicePrefix}pt-${values.top}`)
        }
        if (typeof values.right === 'number' && values.right > 0) {
          classes.push(`${devicePrefix}pr-${values.right}`)
        }
        if (typeof values.bottom === 'number' && values.bottom > 0) {
          classes.push(`${devicePrefix}pb-${values.bottom}`)
        }
        if (typeof values.left === 'number' && values.left > 0) {
          classes.push(`${devicePrefix}pl-${values.left}`)
        }
      }
    })

    // Safe typography class generation
    const typography = safeGet(settings, 'typography', {})
    Object.entries(typography).forEach(([device, values]) => {
      if (values && typeof values === 'object') {
        const devicePrefix = device === 'base' ? '' : `${device}:`
        
        if (values.fontSize && typeof values.fontSize === 'string') {
          classes.push(`${devicePrefix}${values.fontSize}`)
        }
        if (values.fontWeight && typeof values.fontWeight === 'string') {
          classes.push(`${devicePrefix}${values.fontWeight}`)
        }
      }
    })

    return classes.filter(Boolean).join(' ')
  }, () => '')
}

// Export safe defaults
export default {
  UltimateDeviceSelector,
  UltimateSpacingControl,
  UltimateTypographyControl,
  UltimateControlTabs,
  generateTailwindClasses
}