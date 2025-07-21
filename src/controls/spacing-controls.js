/**
 * Spacing Controls Module - Code Splitting Implementation
 * Handles padding and margin controls
 */

import { useState, useEffect } from '@wordpress/element'
import { 
  PanelBody,
  RangeControl,
  Button,
  ButtonGroup,
  Flex,
  FlexItem
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { withMemoryCleanup } from '../utils/lazy-controls.js'

/**
 * Spacing Control Component
 */
const SpacingControls = ({ spacing = {}, onSpacingChange, device = 'base' }) => {
  const currentSpacing = spacing[device] || { top: 0, right: 0, bottom: 0, left: 0 }

  const updateSpacing = (side, value) => {
    const newSpacing = {
      ...spacing,
      [device]: {
        ...currentSpacing,
        [side]: value
      }
    }
    onSpacingChange(newSpacing)
  }

  const linkValues = (value) => {
    const newSpacing = {
      ...spacing,
      [device]: {
        top: value,
        right: value,
        bottom: value,
        left: value
      }
    }
    onSpacingChange(newSpacing)
  }

  const resetSpacing = () => {
    const newSpacing = {
      ...spacing,
      [device]: { top: 0, right: 0, bottom: 0, left: 0 }
    }
    onSpacingChange(newSpacing)
  }

  // Generate Tailwind class preview
  const generateSpacingClasses = () => {
    const classes = []
    const sides = ['top', 'right', 'bottom', 'left']
    const sideMap = { top: 't', right: 'r', bottom: 'b', left: 'l' }
    
    sides.forEach(side => {
      const value = currentSpacing[side]
      if (value > 0) {
        const prefix = device === 'base' ? '' : `${device}:`
        classes.push(`${prefix}p${sideMap[side]}-${value}`)
      }
    })
    
    return classes.join(' ')
  }

  return (
    <div className="spacing-controls">
      <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
        <strong>{__('Padding', 'tailwind-starter')}</strong>
        <Button 
          isSmall 
          variant="tertiary"
          onClick={resetSpacing}
          style={{ fontSize: '11px', color: '#dc2626' }}
        >
          🔄 {__('Reset', 'tailwind-starter')}
        </Button>
      </Flex>

      {/* Quick Link All Values */}
      <div style={{ marginBottom: '16px' }}>
        <RangeControl
          label={__('All Sides', 'tailwind-starter')}
          value={currentSpacing.top === currentSpacing.right && 
                 currentSpacing.right === currentSpacing.bottom && 
                 currentSpacing.bottom === currentSpacing.left ? currentSpacing.top : 0}
          onChange={linkValues}
          min={0}
          max={64}
          help={__('Apply same padding to all sides', 'tailwind-starter')}
        />
      </div>

      {/* Individual Controls */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px',
        marginBottom: '16px'
      }}>
        <RangeControl
          label={__('Top', 'tailwind-starter')}
          value={currentSpacing.top}
          onChange={(value) => updateSpacing('top', value)}
          min={0}
          max={64}
        />
        
        <RangeControl
          label={__('Right', 'tailwind-starter')}
          value={currentSpacing.right}
          onChange={(value) => updateSpacing('right', value)}
          min={0}
          max={64}
        />
        
        <RangeControl
          label={__('Bottom', 'tailwind-starter')}
          value={currentSpacing.bottom}
          onChange={(value) => updateSpacing('bottom', value)}
          min={0}
          max={64}
        />
        
        <RangeControl
          label={__('Left', 'tailwind-starter')}
          value={currentSpacing.left}
          onChange={(value) => updateSpacing('left', value)}
          min={0}
          max={64}
        />
      </div>

      {/* Class Preview */}
      {generateSpacingClasses() && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          padding: '8px',
          fontSize: '11px'
        }}>
          <strong>{__('Generated Classes:', 'tailwind-starter')} </strong>
          <code style={{ color: '#1e40af' }}>{generateSpacingClasses()}</code>
        </div>
      )}
    </div>
  )
}

export default withMemoryCleanup(SpacingControls, 'SpacingControls')