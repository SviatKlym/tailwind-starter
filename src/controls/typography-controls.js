/**
 * Typography Controls Module - Code Splitting Implementation
 * Handles font size, weight, alignment, and text styling
 */

import { useState, useEffect } from '@wordpress/element'
import { 
  PanelBody,
  SelectControl,
  RangeControl,
  Button,
  Flex,
  FlexItem,
  ButtonGroup
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { withMemoryCleanup } from '../utils/lazy-controls.js'

/**
 * Typography Control Component
 */
const TypographyControls = ({ typography = {}, onTypographyChange, device = 'base' }) => {
  const currentTypo = typography[device] || {
    fontSize: '',
    fontWeight: '',
    textAlign: '',
    lineHeight: '',
    letterSpacing: '',
    textTransform: ''
  }

  const updateTypography = (property, value) => {
    const newTypography = {
      ...typography,
      [device]: {
        ...currentTypo,
        [property]: value
      }
    }
    onTypographyChange(newTypography)
  }

  const resetTypography = () => {
    const newTypography = {
      ...typography,
      [device]: {
        fontSize: '',
        fontWeight: '',
        textAlign: '',
        lineHeight: '',
        letterSpacing: '',
        textTransform: ''
      }
    }
    onTypographyChange(newTypography)
  }

  const fontSizeOptions = [
    { label: __('Default', 'tailwind-starter'), value: '' },
    { label: __('Extra Small (xs)', 'tailwind-starter'), value: 'xs' },
    { label: __('Small (sm)', 'tailwind-starter'), value: 'sm' },
    { label: __('Base', 'tailwind-starter'), value: 'base' },
    { label: __('Large (lg)', 'tailwind-starter'), value: 'lg' },
    { label: __('Extra Large (xl)', 'tailwind-starter'), value: 'xl' },
    { label: __('2XL', 'tailwind-starter'), value: '2xl' },
    { label: __('3XL', 'tailwind-starter'), value: '3xl' },
    { label: __('4XL', 'tailwind-starter'), value: '4xl' },
    { label: __('5XL', 'tailwind-starter'), value: '5xl' },
    { label: __('6XL', 'tailwind-starter'), value: '6xl' }
  ]

  const fontWeightOptions = [
    { label: __('Default', 'tailwind-starter'), value: '' },
    { label: __('Thin (100)', 'tailwind-starter'), value: 'thin' },
    { label: __('Extra Light (200)', 'tailwind-starter'), value: 'extralight' },
    { label: __('Light (300)', 'tailwind-starter'), value: 'light' },
    { label: __('Normal (400)', 'tailwind-starter'), value: 'normal' },
    { label: __('Medium (500)', 'tailwind-starter'), value: 'medium' },
    { label: __('Semibold (600)', 'tailwind-starter'), value: 'semibold' },
    { label: __('Bold (700)', 'tailwind-starter'), value: 'bold' },
    { label: __('Extra Bold (800)', 'tailwind-starter'), value: 'extrabold' },
    { label: __('Black (900)', 'tailwind-starter'), value: 'black' }
  ]

  const lineHeightOptions = [
    { label: __('Default', 'tailwind-starter'), value: '' },
    { label: __('Tight', 'tailwind-starter'), value: 'tight' },
    { label: __('Snug', 'tailwind-starter'), value: 'snug' },
    { label: __('Normal', 'tailwind-starter'), value: 'normal' },
    { label: __('Relaxed', 'tailwind-starter'), value: 'relaxed' },
    { label: __('Loose', 'tailwind-starter'), value: 'loose' }
  ]

  const letterSpacingOptions = [
    { label: __('Default', 'tailwind-starter'), value: '' },
    { label: __('Tighter', 'tailwind-starter'), value: 'tighter' },
    { label: __('Tight', 'tailwind-starter'), value: 'tight' },
    { label: __('Normal', 'tailwind-starter'), value: 'normal' },
    { label: __('Wide', 'tailwind-starter'), value: 'wide' },
    { label: __('Wider', 'tailwind-starter'), value: 'wider' },
    { label: __('Widest', 'tailwind-starter'), value: 'widest' }
  ]

  const textTransformOptions = [
    { label: __('Default', 'tailwind-starter'), value: '' },
    { label: __('Uppercase', 'tailwind-starter'), value: 'uppercase' },
    { label: __('Lowercase', 'tailwind-starter'), value: 'lowercase' },
    { label: __('Capitalize', 'tailwind-starter'), value: 'capitalize' },
    { label: __('Normal Case', 'tailwind-starter'), value: 'normal-case' }
  ]

  // Generate Tailwind class preview
  const generateTypographyClasses = () => {
    const classes = []
    const prefix = device === 'base' ? '' : `${device}:`
    
    if (currentTypo.fontSize) classes.push(`${prefix}text-${currentTypo.fontSize}`)
    if (currentTypo.fontWeight) classes.push(`${prefix}font-${currentTypo.fontWeight}`)
    if (currentTypo.textAlign) classes.push(`${prefix}text-${currentTypo.textAlign}`)
    if (currentTypo.lineHeight) classes.push(`${prefix}leading-${currentTypo.lineHeight}`)
    if (currentTypo.letterSpacing) classes.push(`${prefix}tracking-${currentTypo.letterSpacing}`)
    if (currentTypo.textTransform) classes.push(`${prefix}${currentTypo.textTransform}`)
    
    return classes.join(' ')
  }

  return (
    <div className="typography-controls">
      <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
        <strong>{__('Typography', 'tailwind-starter')}</strong>
        <Button 
          isSmall 
          variant="tertiary"
          onClick={resetTypography}
          style={{ fontSize: '11px', color: '#dc2626' }}
        >
          🔄 {__('Reset', 'tailwind-starter')}
        </Button>
      </Flex>

      {/* Font Size */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Font Size', 'tailwind-starter')}
          value={currentTypo.fontSize}
          onChange={(value) => updateTypography('fontSize', value)}
          options={fontSizeOptions}
        />
      </div>

      {/* Font Weight */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Font Weight', 'tailwind-starter')}
          value={currentTypo.fontWeight}
          onChange={(value) => updateTypography('fontWeight', value)}
          options={fontWeightOptions}
        />
      </div>

      {/* Text Alignment */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '500' }}>
          {__('Text Alignment', 'tailwind-starter')}
        </label>
        <ButtonGroup>
          {['left', 'center', 'right', 'justify'].map(align => (
            <Button
              key={align}
              isPrimary={currentTypo.textAlign === align}
              isSecondary={currentTypo.textAlign !== align}
              onClick={() => updateTypography('textAlign', currentTypo.textAlign === align ? '' : align)}
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Line Height */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Line Height', 'tailwind-starter')}
          value={currentTypo.lineHeight}
          onChange={(value) => updateTypography('lineHeight', value)}
          options={lineHeightOptions}
        />
      </div>

      {/* Letter Spacing */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Letter Spacing', 'tailwind-starter')}
          value={currentTypo.letterSpacing}
          onChange={(value) => updateTypography('letterSpacing', value)}
          options={letterSpacingOptions}
        />
      </div>

      {/* Text Transform */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Text Transform', 'tailwind-starter')}
          value={currentTypo.textTransform}
          onChange={(value) => updateTypography('textTransform', value)}
          options={textTransformOptions}
        />
      </div>

      {/* Class Preview */}
      {generateTypographyClasses() && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          padding: '8px',
          fontSize: '11px'
        }}>
          <strong>{__('Generated Classes:', 'tailwind-starter')} </strong>
          <code style={{ color: '#1e40af' }}>{generateTypographyClasses()}</code>
        </div>
      )}
    </div>
  )
}

export default withMemoryCleanup(TypographyControls, 'TypographyControls')