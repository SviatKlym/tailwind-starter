import React from 'react'
import { __ } from '@wordpress/i18n'

// Quick Style Presets Data
export const presetData = [
  { key: 'card', icon: '🃏', name: 'Card', desc: 'Clean card layout' },
  { key: 'hero', icon: '🏆', name: 'Hero', desc: 'Bold hero section' },
  { key: 'minimal', icon: '✨', name: 'Minimal', desc: 'Clean & subtle' },
  { key: 'bold', icon: '💪', name: 'Bold', desc: 'High contrast' },
  { key: 'feature', icon: '⭐', name: 'Feature', desc: 'Highlighted content' },
  { key: 'quote', icon: '💬', name: 'Quote', desc: 'Testimonial style' }
]

// Quick Style Presets Component
export const QuickStylePresets = ({ onPresetApply }) => {
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
            onClick={() => onPresetApply && onPresetApply(preset.key)}
            title={preset.desc}
          >
            <div className="preset-button-icon">{preset.icon}</div>
            <div className="preset-button-label">{preset.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Preset styles mapping (to be implemented later)
export const presetStyles = {
  card: {
    spacing: {
      base: { top: 6, right: 6, bottom: 6, left: 6 }
    },
    effects: {
      base: { 
        shadow: 'shadow-lg',
        borderRadius: 'rounded-lg'
      }
    },
    backgroundColor: 'bg-white'
  },
  hero: {
    spacing: {
      base: { top: 16, right: 8, bottom: 16, left: 8 }
    },
    typography: {
      base: {
        fontSize: 'text-4xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center'
      }
    },
    backgroundColor: 'bg-gray-900',
    textColor: 'text-white'
  },
  minimal: {
    spacing: {
      base: { top: 4, right: 4, bottom: 4, left: 4 }
    },
    typography: {
      base: {
        fontSize: 'text-base',
        fontWeight: 'font-normal'
      }
    },
    backgroundColor: 'bg-gray-50'
  },
  bold: {
    spacing: {
      base: { top: 8, right: 8, bottom: 8, left: 8 }
    },
    typography: {
      base: {
        fontSize: 'text-xl',
        fontWeight: 'font-black',
        textAlign: 'text-center'
      }
    },
    effects: {
      base: {
        shadow: 'shadow-2xl'
      }
    },
    backgroundColor: 'bg-black',
    textColor: 'text-white'
  },
  feature: {
    spacing: {
      base: { top: 8, right: 6, bottom: 8, left: 6 }
    },
    effects: {
      base: {
        borderRadius: 'rounded-xl',
        shadow: 'shadow-md'
      }
    },
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-900'
  },
  quote: {
    spacing: {
      base: { top: 6, right: 8, bottom: 6, left: 8 }
    },
    typography: {
      base: {
        fontSize: 'text-lg',
        fontWeight: 'font-medium',
        textAlign: 'text-center'
      }
    },
    effects: {
      base: {
        borderRadius: 'rounded-lg'
      }
    },
    backgroundColor: 'bg-gray-100',
    textColor: 'text-gray-700'
  }
}

// Function to apply preset styles
export const applyPresetStyles = (presetKey, setAttributes) => {
  const preset = presetStyles[presetKey]
  if (!preset) return
  
  // Apply the preset styles to block attributes
  const settings = {}
  
  if (preset.spacing) {
    settings.spacing = preset.spacing
  }
  
  if (preset.typography) {
    settings.typography = preset.typography
  }
  
  if (preset.effects) {
    settings.effects = preset.effects
  }
  
  if (preset.backgroundColor) {
    settings.backgroundColor = preset.backgroundColor
  }
  
  if (preset.textColor) {
    settings.textColor = preset.textColor
  }
  
  // Update block attributes
  setAttributes({ settings })
}