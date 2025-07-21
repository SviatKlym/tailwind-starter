/**
 * Layout Controls Module - Code Splitting Implementation
 * Handles width, height, display, flexbox, grid, and positioning
 */

import { useState, useEffect } from '@wordpress/element'
import { 
  PanelBody,
  SelectControl,
  TextControl,
  Button,
  Flex,
  FlexItem,
  ButtonGroup
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { withMemoryCleanup } from '../utils/lazy-controls.js'

/**
 * Layout Control Component
 */
const LayoutControls = ({ layout = {}, onLayoutChange, device = 'base' }) => {
  const currentLayout = layout[device] || {
    width: '',
    height: '',
    display: '',
    justifyContent: '',
    alignItems: '',
    gap: '',
    gridCols: '',
    gridRows: '',
    position: '',
    zIndex: ''
  }

  const updateLayout = (property, value) => {
    const newLayout = {
      ...layout,
      [device]: {
        ...currentLayout,
        [property]: value
      }
    }
    onLayoutChange(newLayout)
  }

  const resetLayout = () => {
    const newLayout = {
      ...layout,
      [device]: {
        width: '',
        height: '',
        display: '',
        justifyContent: '',
        alignItems: '',
        gap: '',
        gridCols: '',
        gridRows: '',
        position: '',
        zIndex: ''
      }
    }
    onLayoutChange(newLayout)
  }

  const widthOptions = [
    { label: __('Auto', 'tailwind-starter'), value: '' },
    { label: __('25%', 'tailwind-starter'), value: '1/4' },
    { label: __('33%', 'tailwind-starter'), value: '1/3' },
    { label: __('50%', 'tailwind-starter'), value: '1/2' },
    { label: __('66%', 'tailwind-starter'), value: '2/3' },
    { label: __('75%', 'tailwind-starter'), value: '3/4' },
    { label: __('100%', 'tailwind-starter'), value: 'full' },
    { label: __('Fit Content', 'tailwind-starter'), value: 'fit' },
    { label: __('Min Content', 'tailwind-starter'), value: 'min' },
    { label: __('Max Content', 'tailwind-starter'), value: 'max' }
  ]

  const heightOptions = [
    { label: __('Auto', 'tailwind-starter'), value: '' },
    { label: __('100%', 'tailwind-starter'), value: 'full' },
    { label: __('100vh', 'tailwind-starter'), value: 'screen' },
    { label: __('Min Content', 'tailwind-starter'), value: 'min' },
    { label: __('Max Content', 'tailwind-starter'), value: 'max' },
    { label: __('Fit Content', 'tailwind-starter'), value: 'fit' }
  ]

  const displayOptions = [
    { label: __('Default', 'tailwind-starter'), value: '' },
    { label: __('Block', 'tailwind-starter'), value: 'block' },
    { label: __('Inline', 'tailwind-starter'), value: 'inline' },
    { label: __('Inline Block', 'tailwind-starter'), value: 'inline-block' },
    { label: __('Flex', 'tailwind-starter'), value: 'flex' },
    { label: __('Grid', 'tailwind-starter'), value: 'grid' },
    { label: __('Hidden', 'tailwind-starter'), value: 'hidden' }
  ]

  const justifyOptions = [
    { label: __('Start', 'tailwind-starter'), value: 'start' },
    { label: __('Center', 'tailwind-starter'), value: 'center' },
    { label: __('End', 'tailwind-starter'), value: 'end' },
    { label: __('Between', 'tailwind-starter'), value: 'between' },
    { label: __('Around', 'tailwind-starter'), value: 'around' },
    { label: __('Evenly', 'tailwind-starter'), value: 'evenly' }
  ]

  const alignOptions = [
    { label: __('Start', 'tailwind-starter'), value: 'start' },
    { label: __('Center', 'tailwind-starter'), value: 'center' },
    { label: __('End', 'tailwind-starter'), value: 'end' },
    { label: __('Stretch', 'tailwind-starter'), value: 'stretch' },
    { label: __('Baseline', 'tailwind-starter'), value: 'baseline' }
  ]

  const gapOptions = [
    { label: __('None', 'tailwind-starter'), value: '' },
    { label: __('1 (0.25rem)', 'tailwind-starter'), value: '1' },
    { label: __('2 (0.5rem)', 'tailwind-starter'), value: '2' },
    { label: __('4 (1rem)', 'tailwind-starter'), value: '4' },
    { label: __('6 (1.5rem)', 'tailwind-starter'), value: '6' },
    { label: __('8 (2rem)', 'tailwind-starter'), value: '8' },
    { label: __('12 (3rem)', 'tailwind-starter'), value: '12' },
    { label: __('16 (4rem)', 'tailwind-starter'), value: '16' },
    { label: __('20 (5rem)', 'tailwind-starter'), value: '20' },
    { label: __('24 (6rem)', 'tailwind-starter'), value: '24' }
  ]

  const gridColOptions = [
    { label: __('None', 'tailwind-starter'), value: '' },
    { label: __('1 Column', 'tailwind-starter'), value: '1' },
    { label: __('2 Columns', 'tailwind-starter'), value: '2' },
    { label: __('3 Columns', 'tailwind-starter'), value: '3' },
    { label: __('4 Columns', 'tailwind-starter'), value: '4' },
    { label: __('5 Columns', 'tailwind-starter'), value: '5' },
    { label: __('6 Columns', 'tailwind-starter'), value: '6' },
    { label: __('12 Columns', 'tailwind-starter'), value: '12' }
  ]

  const positionOptions = [
    { label: __('Static', 'tailwind-starter'), value: '' },
    { label: __('Relative', 'tailwind-starter'), value: 'relative' },
    { label: __('Absolute', 'tailwind-starter'), value: 'absolute' },
    { label: __('Fixed', 'tailwind-starter'), value: 'fixed' },
    { label: __('Sticky', 'tailwind-starter'), value: 'sticky' }
  ]

  // Generate Tailwind class preview
  const generateLayoutClasses = () => {
    const classes = []
    const prefix = device === 'base' ? '' : `${device}:`
    
    if (currentLayout.width) classes.push(`${prefix}w-${currentLayout.width}`)
    if (currentLayout.height) classes.push(`${prefix}h-${currentLayout.height}`)
    if (currentLayout.display) classes.push(`${prefix}${currentLayout.display}`)
    if (currentLayout.justifyContent) classes.push(`${prefix}justify-${currentLayout.justifyContent}`)
    if (currentLayout.alignItems) classes.push(`${prefix}items-${currentLayout.alignItems}`)
    if (currentLayout.gap) classes.push(`${prefix}gap-${currentLayout.gap}`)
    if (currentLayout.gridCols) classes.push(`${prefix}grid-cols-${currentLayout.gridCols}`)
    if (currentLayout.gridRows) classes.push(`${prefix}grid-rows-${currentLayout.gridRows}`)
    if (currentLayout.position) classes.push(`${prefix}${currentLayout.position}`)
    if (currentLayout.zIndex) classes.push(`${prefix}z-${currentLayout.zIndex}`)
    
    return classes.join(' ')
  }

  return (
    <div className="layout-controls">
      <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
        <strong>{__('Layout & Display', 'tailwind-starter')}</strong>
        <Button 
          isSmall 
          variant="tertiary"
          onClick={resetLayout}
          style={{ fontSize: '11px', color: '#dc2626' }}
        >
          🔄 {__('Reset', 'tailwind-starter')}
        </Button>
      </Flex>

      {/* Display */}
      <div style={{ marginBottom: '16px' }}>
        <SelectControl
          label={__('Display', 'tailwind-starter')}
          value={currentLayout.display}
          onChange={(value) => updateLayout('display', value)}
          options={displayOptions}
        />
      </div>

      {/* Width & Height */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <SelectControl
          label={__('Width', 'tailwind-starter')}
          value={currentLayout.width}
          onChange={(value) => updateLayout('width', value)}
          options={widthOptions}
        />

        <SelectControl
          label={__('Height', 'tailwind-starter')}
          value={currentLayout.height}
          onChange={(value) => updateLayout('height', value)}
          options={heightOptions}
        />
      </div>

      {/* Flexbox Controls - Only show when display is flex */}
      {(currentLayout.display === 'flex' || currentLayout.display === '') && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '8px 0', fontSize: '12px', fontWeight: '600' }}>
            {__('Flexbox', 'tailwind-starter')}
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <SelectControl
              label={__('Justify Content', 'tailwind-starter')}
              value={currentLayout.justifyContent}
              onChange={(value) => updateLayout('justifyContent', value)}
              options={[{ label: __('Default', 'tailwind-starter'), value: '' }, ...justifyOptions]}
            />

            <SelectControl
              label={__('Align Items', 'tailwind-starter')}
              value={currentLayout.alignItems}
              onChange={(value) => updateLayout('alignItems', value)}
              options={[{ label: __('Default', 'tailwind-starter'), value: '' }, ...alignOptions]}
            />
          </div>

          <SelectControl
            label={__('Gap', 'tailwind-starter')}
            value={currentLayout.gap}
            onChange={(value) => updateLayout('gap', value)}
            options={gapOptions}
          />
        </div>
      )}

      {/* Grid Controls - Only show when display is grid */}
      {currentLayout.display === 'grid' && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '8px 0', fontSize: '12px', fontWeight: '600' }}>
            {__('CSS Grid', 'tailwind-starter')}
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <SelectControl
              label={__('Grid Columns', 'tailwind-starter')}
              value={currentLayout.gridCols}
              onChange={(value) => updateLayout('gridCols', value)}
              options={gridColOptions}
            />

            <SelectControl
              label={__('Grid Rows', 'tailwind-starter')}
              value={currentLayout.gridRows}
              onChange={(value) => updateLayout('gridRows', value)}
              options={gridColOptions.map(option => ({
                ...option,
                label: option.label.replace('Column', 'Row')
              }))}
            />
          </div>

          <SelectControl
            label={__('Gap', 'tailwind-starter')}
            value={currentLayout.gap}
            onChange={(value) => updateLayout('gap', value)}
            options={gapOptions}
          />
        </div>
      )}

      {/* Position & Z-Index */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '8px 0', fontSize: '12px', fontWeight: '600' }}>
          {__('Positioning', 'tailwind-starter')}
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <SelectControl
            label={__('Position', 'tailwind-starter')}
            value={currentLayout.position}
            onChange={(value) => updateLayout('position', value)}
            options={positionOptions}
          />

          <TextControl
            label={__('Z-Index', 'tailwind-starter')}
            value={currentLayout.zIndex}
            onChange={(value) => updateLayout('zIndex', value)}
            placeholder={__('0, 10, 20, 30...', 'tailwind-starter')}
            help={__('Common values: 0, 10, 20, 30, 40, 50', 'tailwind-starter')}
          />
        </div>
      </div>

      {/* Class Preview */}
      {generateLayoutClasses() && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          padding: '8px',
          fontSize: '11px'
        }}>
          <strong>{__('Generated Classes:', 'tailwind-starter')} </strong>
          <code style={{ color: '#1e40af' }}>{generateLayoutClasses()}</code>
        </div>
      )}
    </div>
  )
}

export default withMemoryCleanup(LayoutControls, 'LayoutControls')