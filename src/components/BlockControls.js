/**
 * Unified Block Controls Component
 * Standardized controls interface for all blocks with Progressive UX/UI
 */

import React, { useState } from 'react'
import { 
  InspectorControls,
  PanelBody
} from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { 
  UltimateDeviceSelector,
  UltimateControlTabs,
  generateAllClasses
} from '../utils/visual-controls.js'

export const BlockControls = ({ 
  attributes, 
  setAttributes, 
  blockSpecificControls = null,
  showDeviceSelector = true,
  showPresets = true,
  presets = null
}) => {
  const {
    settings = {},
    activeDevice = 'base'
  } = attributes

  const [isControlsExpanded, setIsControlsExpanded] = useState(true)

  // Default presets if none provided
  const defaultPresets = {
    minimal: {
      spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
      typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
      backgroundColor: 'bg-white',
      textColor: 'text-gray-900'
    },
    modern: {
      spacing: { base: { top: 8, right: 6, bottom: 8, left: 6 } },
      typography: { base: { fontSize: 'text-lg', fontWeight: 'font-medium', textAlign: 'text-center' } },
      backgroundColor: 'bg-gray-50',
      textColor: 'text-gray-800'
    },
    bold: {
      spacing: { base: { top: 12, right: 8, bottom: 12, left: 8 } },
      typography: { base: { fontSize: 'text-xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
      backgroundColor: 'bg-blue-600',
      textColor: 'text-white'
    }
  }

  const blockPresets = presets || defaultPresets

  const handlePresetApply = (presetName) => {
    const preset = blockPresets[presetName]
    if (preset) {
      setAttributes({ settings: preset })
    }
  }

  const handleSpacingChange = (newSpacing) => {
    setAttributes({
      settings: {
        ...settings,
        spacing: newSpacing
      }
    })
  }

  const handleBackgroundChange = (newBackground) => {
    setAttributes({
      settings: {
        ...settings,
        backgroundColor: newBackground
      }
    })
  }

  const handleTextColorChange = (newTextColor) => {
    setAttributes({
      settings: {
        ...settings,
        textColor: newTextColor
      }
    })
  }

  const handleTypographyChange = (newTypography) => {
    setAttributes({
      settings: {
        ...settings,
        typography: newTypography
      }
    })
  }

  const handleDeviceChange = (newDevice) => {
    setAttributes({ activeDevice: newDevice })
  }

  return (
    <InspectorControls>
      {/* Block-specific controls panel */}
      {blockSpecificControls && (
        <PanelBody
          title={__('Block Settings', 'tailwind-starter')}
          initialOpen={true}
        >
          {blockSpecificControls}
        </PanelBody>
      )}

      {/* Visual Controls Panel */}
      <PanelBody
        title={__('Visual Design', 'tailwind-starter')}
        initialOpen={isControlsExpanded}
        onToggle={() => setIsControlsExpanded(!isControlsExpanded)}
        className="ultimate-visual-controls"
      >
        {/* Device Selector */}
        {showDeviceSelector && (
          <UltimateDeviceSelector
            activeDevice={activeDevice}
            onChange={handleDeviceChange}
          />
        )}

        {/* Main Controls */}
        <UltimateControlTabs
          spacing={settings.spacing}
          onSpacingChange={handleSpacingChange}
          background={settings.backgroundColor}
          onBackgroundChange={handleBackgroundChange}
          textColor={settings.textColor}
          onTextColorChange={handleTextColorChange}
          typography={settings.typography}
          onTypographyChange={handleTypographyChange}
          device={activeDevice}
          presets={blockPresets}
          onPresetApply={handlePresetApply}
          showPresets={showPresets}
        />
      </PanelBody>
    </InspectorControls>
  )
}

export default BlockControls