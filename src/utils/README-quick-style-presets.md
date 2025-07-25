# Quick Style Presets

This file contains the Quick Style Presets functionality that was temporarily separated from the Visual Controls system.

## Files

- `quick-style-presets.js` - Contains the preset data, component, and application logic

## Usage

To re-enable Quick Style Presets in the future:

### 1. Import in block edit files:
```javascript
import { QuickStylePresets, applyPresetStyles } from '../utils/quick-style-presets'
```

### 2. Add to Visual Controls:
```javascript
// In visual-controls.js, add back to tabs array:
{
  name: 'presets',
  title: '⚡',
  label: 'Quick',
  className: 'tab-presets'
}

// Add to switch statement:
case 'presets':
  return <QuickStylePresets onPresetApply={onPresetApply} />
```

### 3. Add preset handler in block:
```javascript
const handlePresetApply = (presetKey) => {
  applyPresetStyles(presetKey, setAttributes)
}

// Pass to UltimateControlTabs:
<UltimateControlTabs
  // ... other props
  onPresetApply={handlePresetApply}
/>
```

## Available Presets

- **Card** 🃏 - Clean card layout
- **Hero** 🏆 - Bold hero section  
- **Minimal** ✨ - Clean & subtle
- **Bold** 💪 - High contrast
- **Feature** ⭐ - Highlighted content
- **Quote** 💬 - Testimonial style

## Future Implementation

The preset styles in `presetStyles` object can be extended with:
- More comprehensive style definitions
- Global preset management
- Custom user presets
- Preset preview functionality

## Notes

Currently disabled because:
1. Global preset system needs better architecture
2. Presets conflict with individual visual controls
3. Need better user experience for preset management