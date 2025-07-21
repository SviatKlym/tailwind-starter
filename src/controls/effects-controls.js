/**
 * Effects Controls Module - Code Splitting Implementation
 * Handles shadows, borders, animations, and hover effects
 */

import { useState, useEffect } from '@wordpress/element'
import { 
  PanelBody,
  SelectControl,
  RangeControl,
  Button,
  Flex,
  FlexItem,
  ToggleControl
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { withMemoryCleanup } from '../utils/lazy-controls.js'
import { UltimateColorPicker } from '../utils/visual-controls.js'

/**
 * Effects Control Component
 */
const EffectsControls = ({ effects = {}, onEffectsChange, device = 'base' }) => {
  const currentEffects = effects[device] || {
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

  const updateEffect = (property, value) => {
    const newEffects = {
      ...effects,
      [device]: {
        ...currentEffects,
        [property]: value
      }
    }
    onEffectsChange(newEffects)
  }

  const resetEffects = () => {
    const newEffects = {
      ...effects,
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
    onEffectsChange(newEffects)
  }

  const shadowOptions = [
    { label: __('None', 'tailwind-starter'), value: '' },
    { label: __('Small', 'tailwind-starter'), value: 'sm' },
    { label: __('Medium', 'tailwind-starter'), value: 'md' },
    { label: __('Large', 'tailwind-starter'), value: 'lg' },
    { label: __('Extra Large', 'tailwind-starter'), value: 'xl' },
    { label: __('2XL', 'tailwind-starter'), value: '2xl' }
  ]

  const borderRadiusOptions = [
    { label: __('None', 'tailwind-starter'), value: '' },
    { label: __('Small', 'tailwind-starter'), value: 'sm' },
    { label: __('Medium', 'tailwind-starter'), value: 'md' },
    { label: __('Large', 'tailwind-starter'), value: 'lg' },
    { label: __('Extra Large', 'tailwind-starter'), value: 'xl' },
    { label: __('2XL', 'tailwind-starter'), value: '2xl' },
    { label: __('3XL', 'tailwind-starter'), value: '3xl' },
    { label: __('Full', 'tailwind-starter'), value: 'full' }
  ]

  const borderStyleOptions = [
    { label: __('None', 'tailwind-starter'), value: '' },
    { label: __('Solid', 'tailwind-starter'), value: 'solid' },
    { label: __('Dashed', 'tailwind-starter'), value: 'dashed' },
    { label: __('Dotted', 'tailwind-starter'), value: 'dotted' },
    { label: __('Double', 'tailwind-starter'), value: 'double' }
  ]

  const animationOptions = [
    { label: __('None', 'tailwind-starter'), value: '' },
    { label: __('Spin', 'tailwind-starter'), value: 'spin' },
    { label: __('Ping', 'tailwind-starter'), value: 'ping' },
    { label: __('Pulse', 'tailwind-starter'), value: 'pulse' },
    { label: __('Bounce', 'tailwind-starter'), value: 'bounce' }
  ]

  const durationOptions = [
    { label: __('75ms', 'tailwind-starter'), value: '75' },
    { label: __('150ms', 'tailwind-starter'), value: '150' },
    { label: __('200ms', 'tailwind-starter'), value: '200' },
    { label: __('300ms', 'tailwind-starter'), value: '300' },
    { label: __('500ms', 'tailwind-starter'), value: '500' },
    { label: __('700ms', 'tailwind-starter'), value: '700' },
    { label: __('1000ms', 'tailwind-starter'), value: '1000' }
  ]

  const easingOptions = [
    { label: __('Linear', 'tailwind-starter'), value: 'linear' },
    { label: __('Ease In', 'tailwind-starter'), value: 'in' },
    { label: __('Ease Out', 'tailwind-starter'), value: 'out' },
    { label: __('Ease In Out', 'tailwind-starter'), value: 'in-out' }
  ]

  // Generate Tailwind class preview
  const generateEffectsClasses = () => {
    const classes = []
    const prefix = device === 'base' ? '' : `${device}:`
    
    if (currentEffects.shadow) classes.push(`${prefix}shadow-${currentEffects.shadow}`)
    if (currentEffects.borderRadius) classes.push(`${prefix}rounded-${currentEffects.borderRadius}`)
    if (currentEffects.borderWidth) classes.push(`${prefix}border-${currentEffects.borderWidth}`)
    if (currentEffects.borderStyle) classes.push(`${prefix}border-${currentEffects.borderStyle}`)
    if (currentEffects.entranceAnimation) classes.push(`${prefix}animate-${currentEffects.entranceAnimation}`)
    if (currentEffects.transitionDuration) classes.push(`${prefix}duration-${currentEffects.transitionDuration}`)
    if (currentEffects.transitionEasing) classes.push(`${prefix}ease-${currentEffects.transitionEasing}`)
    
    // Hover effects
    if (currentEffects.hoverScale) classes.push(`hover:scale-${currentEffects.hoverScale}`)
    if (currentEffects.hoverShadow) classes.push(`hover:shadow-${currentEffects.hoverShadow}`)
    if (currentEffects.hoverOpacity) classes.push(`hover:opacity-${currentEffects.hoverOpacity}`)
    if (currentEffects.hoverRotate) classes.push(`hover:rotate-${currentEffects.hoverRotate}`)
    
    return classes.join(' ')
  }

  return (
    <div className="effects-controls">
      <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
        <strong>{__('Effects & Animations', 'tailwind-starter')}</strong>
        <Button 
          isSmall 
          variant="tertiary"
          onClick={resetEffects}
          style={{ fontSize: '11px', color: '#dc2626' }}
        >
          🔄 {__('Reset', 'tailwind-starter')}
        </Button>
      </Flex>

      {/* Shadow */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Shadow', 'tailwind-starter')}
          value={currentEffects.shadow}
          onChange={(value) => updateEffect('shadow', value)}
          options={shadowOptions}
        />
      </div>

      {/* Border Radius */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Border Radius', 'tailwind-starter')}
          value={currentEffects.borderRadius}
          onChange={(value) => updateEffect('borderRadius', value)}
          options={borderRadiusOptions}
        />
      </div>

      {/* Border Width */}
      <div style={{ marginBottom: '16px' }}>
        <RangeControl
          label={__('Border Width', 'tailwind-starter')}
          value={parseInt(currentEffects.borderWidth) || 0}
          onChange={(value) => updateEffect('borderWidth', value.toString())}
          min={0}
          max={8}
        />
      </div>

      {/* Border Style */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Border Style', 'tailwind-starter')}
          value={currentEffects.borderStyle}
          onChange={(value) => updateEffect('borderStyle', value)}
          options={borderStyleOptions}
        />
      </div>

      {/* Border Color */}
      <div style={{ marginBottom: '16px' }}>
        <UltimateColorPicker
          label={__('Border Color', 'tailwind-starter')}
          value={currentEffects.borderColor}
          onChange={(value) => updateEffect('borderColor', value)}
          type="border"
        />
      </div>

      {/* Hover Effects */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '8px 0', fontSize: '12px', fontWeight: '600' }}>
          {__('Hover Effects', 'tailwind-starter')}
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <SelectControl
            label={__('Hover Scale', 'tailwind-starter')}
            value={currentEffects.hoverScale}
            onChange={(value) => updateEffect('hoverScale', value)}
            options={[
              { label: __('None', 'tailwind-starter'), value: '' },
              { label: __('Scale 95%', 'tailwind-starter'), value: '95' },
              { label: __('Scale 105%', 'tailwind-starter'), value: '105' },
              { label: __('Scale 110%', 'tailwind-starter'), value: '110' }
            ]}
          />

          <SelectControl
            label={__('Hover Shadow', 'tailwind-starter')}
            value={currentEffects.hoverShadow}
            onChange={(value) => updateEffect('hoverShadow', value)}
            options={shadowOptions}
          />
        </div>
      </div>

      {/* Animations */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '8px 0', fontSize: '12px', fontWeight: '600' }}>
          {__('Animations', 'tailwind-starter')}
        </h4>
        
        <SelectControl
          label={__('Entrance Animation', 'tailwind-starter')}
          value={currentEffects.entranceAnimation}
          onChange={(value) => updateEffect('entranceAnimation', value)}
          options={animationOptions}
        />
      </div>

      {/* Transitions */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '8px 0', fontSize: '12px', fontWeight: '600' }}>
          {__('Transitions', 'tailwind-starter')}
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <SelectControl
            label={__('Duration', 'tailwind-starter')}
            value={currentEffects.transitionDuration}
            onChange={(value) => updateEffect('transitionDuration', value)}
            options={durationOptions}
          />

          <SelectControl
            label={__('Easing', 'tailwind-starter')}
            value={currentEffects.transitionEasing}
            onChange={(value) => updateEffect('transitionEasing', value)}
            options={easingOptions}
          />
        </div>
      </div>

      {/* Class Preview */}
      {generateEffectsClasses() && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          padding: '8px',
          fontSize: '11px'
        }}>
          <strong>{__('Generated Classes:', 'tailwind-starter')} </strong>
          <code style={{ color: '#1e40af' }}>{generateEffectsClasses()}</code>
        </div>
      )}
    </div>
  )
}

export default withMemoryCleanup(EffectsControls, 'EffectsControls')