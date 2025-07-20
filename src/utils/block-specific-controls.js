import { __ } from '@wordpress/i18n'

/**
 * Block-specific control configurations and presets
 */

// Heading Block Enhancements
export const HEADING_PRESETS = {
  h1_hero: {
    spacing: { base: { top: 8, right: 0, bottom: 8, left: 0 } },
    typography: { base: { fontSize: 'text-5xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-gray-900'
  },
  h1_page: {
    spacing: { base: { top: 6, right: 0, bottom: 6, left: 0 } },
    typography: { base: { fontSize: 'text-4xl', fontWeight: 'font-bold', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-900'
  },
  h2_section: {
    spacing: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
    typography: { base: { fontSize: 'text-3xl', fontWeight: 'font-semibold', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-800'
  },
  h3_subsection: {
    spacing: { base: { top: 3, right: 0, bottom: 3, left: 0 } },
    typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-semibold', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-800'
  },
  accent_heading: {
    spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
    typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-900'
  },
  minimal_heading: {
    spacing: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
    typography: { base: { fontSize: 'text-lg', fontWeight: 'font-medium', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-700'
  }
}

// Paragraph Block Enhancements
export const PARAGRAPH_PRESETS = {
  body_text: {
    spacing: { base: { top: 0, right: 0, bottom: 4, left: 0 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-700'
  },
  lead_paragraph: {
    spacing: { base: { top: 0, right: 0, bottom: 6, left: 0 } },
    typography: { base: { fontSize: 'text-xl', fontWeight: 'font-normal', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-800'
  },
  small_text: {
    spacing: { base: { top: 0, right: 0, bottom: 2, left: 0 } },
    typography: { base: { fontSize: 'text-sm', fontWeight: 'font-normal', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-600'
  },
  caption_text: {
    spacing: { base: { top: 1, right: 0, bottom: 1, left: 0 } },
    typography: { base: { fontSize: 'text-xs', fontWeight: 'font-normal', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-gray-500'
  },
  highlight_text: {
    spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-medium', textAlign: 'text-left' } },
    backgroundColor: 'bg-yellow-50',
    textColor: 'text-yellow-900'
  },
  quote_style: {
    spacing: { base: { top: 4, right: 6, bottom: 4, left: 6 } },
    typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-center' } },
    backgroundColor: 'bg-gray-50',
    textColor: 'text-gray-800'
  }
}

// Button Block Enhancements  
export const BUTTON_PRESETS = {
  primary_button: {
    spacing: { base: { top: 3, right: 6, bottom: 3, left: 6 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-medium', textAlign: 'text-center' } },
    backgroundColor: 'bg-blue-600',
    textColor: 'text-white'
  },
  secondary_button: {
    spacing: { base: { top: 3, right: 6, bottom: 3, left: 6 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-medium', textAlign: 'text-center' } },
    backgroundColor: 'bg-white',
    textColor: 'text-blue-600'
  },
  ghost_button: {
    spacing: { base: { top: 3, right: 6, bottom: 3, left: 6 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-medium', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-blue-600'
  },
  large_button: {
    spacing: { base: { top: 4, right: 8, bottom: 4, left: 8 } },
    typography: { base: { fontSize: 'text-lg', fontWeight: 'font-semibold', textAlign: 'text-center' } },
    backgroundColor: 'bg-blue-600',
    textColor: 'text-white'
  },
  small_button: {
    spacing: { base: { top: 2, right: 4, bottom: 2, left: 4 } },
    typography: { base: { fontSize: 'text-sm', fontWeight: 'font-medium', textAlign: 'text-center' } },
    backgroundColor: 'bg-blue-600',
    textColor: 'text-white'
  },
  cta_button: {
    spacing: { base: { top: 4, right: 8, bottom: 4, left: 8 } },
    typography: { base: { fontSize: 'text-xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
    backgroundColor: 'bg-green-600',
    textColor: 'text-white'
  }
}

// Image Block Enhancements
export const IMAGE_PRESETS = {
  hero_image: {
    spacing: { base: { top: 0, right: 0, bottom: 8, left: 0 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: ''
  },
  content_image: {
    spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: ''
  },
  rounded_image: {
    spacing: { base: { top: 2, right: 2, bottom: 2, left: 2 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: 'bg-gray-50',
    textColor: ''
  },
  featured_image: {
    spacing: { base: { top: 6, right: 6, bottom: 6, left: 6 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: 'bg-white',
    textColor: ''
  },
  thumbnail: {
    spacing: { base: { top: 1, right: 1, bottom: 1, left: 1 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: ''
  },
  gallery_image: {
    spacing: { base: { top: 2, right: 2, bottom: 2, left: 2 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: 'bg-gray-100',
    textColor: ''
  }
}

// Group Block Enhancements
export const GROUP_PRESETS = {
  section_container: {
    spacing: { base: { top: 8, right: 6, bottom: 8, left: 6 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: 'bg-white',
    textColor: ''
  },
  content_card: {
    spacing: { base: { top: 6, right: 6, bottom: 6, left: 6 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: 'bg-white',
    textColor: ''
  },
  highlight_section: {
    spacing: { base: { top: 8, right: 8, bottom: 8, left: 8 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: 'bg-blue-50',
    textColor: ''
  },
  sidebar_widget: {
    spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: 'bg-gray-50',
    textColor: ''
  },
  full_width: {
    spacing: { base: { top: 12, right: 0, bottom: 12, left: 0 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: 'bg-gray-900',
    textColor: 'text-white'
  },
  minimal_container: {
    spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: '',
    textColor: ''
  }
}

// List Block Enhancements
export const LIST_PRESETS = {
  bullet_list: {
    spacing: { base: { top: 0, right: 0, bottom: 4, left: 4 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-700'
  },
  numbered_list: {
    spacing: { base: { top: 0, right: 0, bottom: 4, left: 4 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-700'
  },
  checklist: {
    spacing: { base: { top: 0, right: 0, bottom: 4, left: 4 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-medium', textAlign: 'text-left' } },
    backgroundColor: 'bg-green-50',
    textColor: 'text-green-800'
  },
  feature_list: {
    spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
    typography: { base: { fontSize: 'text-lg', fontWeight: 'font-medium', textAlign: 'text-left' } },
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-900'
  },
  inline_list: {
    spacing: { base: { top: 2, right: 2, bottom: 2, left: 2 } },
    typography: { base: { fontSize: 'text-sm', fontWeight: 'font-normal', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-gray-600'
  },
  navigation_list: {
    spacing: { base: { top: 3, right: 4, bottom: 3, left: 4 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-medium', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-blue-600'
  }
}

// Quote Block Enhancements
export const QUOTE_PRESETS = {
  blockquote: {
    spacing: { base: { top: 6, right: 8, bottom: 6, left: 8 } },
    typography: { base: { fontSize: 'text-xl', fontWeight: 'font-normal', textAlign: 'text-left' } },
    backgroundColor: 'bg-gray-50',
    textColor: 'text-gray-800'
  },
  pullquote: {
    spacing: { base: { top: 8, right: 6, bottom: 8, left: 6 } },
    typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-medium', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-gray-900'
  },
  testimonial: {
    spacing: { base: { top: 6, right: 6, bottom: 6, left: 6 } },
    typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-center' } },
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-900'
  },
  accent_quote: {
    spacing: { base: { top: 6, right: 6, bottom: 6, left: 6 } },
    typography: { base: { fontSize: 'text-xl', fontWeight: 'font-medium', textAlign: 'text-center' } },
    backgroundColor: 'bg-yellow-50',
    textColor: 'text-yellow-900'
  },
  minimal_quote: {
    spacing: { base: { top: 4, right: 4, bottom: 4, left: 4 } },
    typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
    backgroundColor: '',
    textColor: 'text-gray-600'
  },
  featured_quote: {
    spacing: { base: { top: 8, right: 8, bottom: 8, left: 8 } },
    typography: { base: { fontSize: 'text-3xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
    backgroundColor: 'bg-gray-900',
    textColor: 'text-white'
  }
}

// Spacer Block Enhancements
export const SPACER_PRESETS = {
  small_spacer: {
    spacing: { base: { top: 5, right: 0, bottom: 5, left: 0 } }, // 20px
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: '',
    textColor: ''
  },
  medium_spacer: {
    spacing: { base: { top: 10, right: 0, bottom: 10, left: 0 } }, // 40px
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: '',
    textColor: ''
  },
  large_spacer: {
    spacing: { base: { top: 20, right: 0, bottom: 20, left: 0 } }, // 80px
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: '',
    textColor: ''
  },
  section_break: {
    spacing: { base: { top: 24, right: 0, bottom: 24, left: 0 } }, // 96px
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: '',
    textColor: ''
  },
  content_spacer: {
    spacing: { base: { top: 8, right: 0, bottom: 8, left: 0 } }, // 32px
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: '',
    textColor: ''
  },
  tight_spacer: {
    spacing: { base: { top: 2, right: 0, bottom: 2, left: 0 } }, // 8px
    typography: { base: { fontSize: '', fontWeight: '', textAlign: '' } },
    backgroundColor: '',
    textColor: ''
  }
}

// Separator Block Enhancements
export const SEPARATOR_PRESETS = {
  default_separator: {
    spacing: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-gray-300'
  },
  thick_separator: {
    spacing: { base: { top: 6, right: 0, bottom: 6, left: 0 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-gray-400'
  },
  accent_separator: {
    spacing: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-blue-400'
  },
  subtle_separator: {
    spacing: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-gray-200'
  },
  section_separator: {
    spacing: { base: { top: 8, right: 0, bottom: 8, left: 0 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: '',
    textColor: 'text-gray-500'
  },
  decorative_separator: {
    spacing: { base: { top: 6, right: 0, bottom: 6, left: 0 } },
    typography: { base: { fontSize: '', fontWeight: '', textAlign: 'text-center' } },
    backgroundColor: 'bg-gradient-to-r from-transparent via-gray-300 to-transparent',
    textColor: ''
  }
}

// Get presets for a specific block type
export function getBlockPresets(blockName) {
  switch (blockName) {
    case 'core/heading':
      return HEADING_PRESETS
    case 'core/paragraph':
      return PARAGRAPH_PRESETS
    case 'core/button':
      return BUTTON_PRESETS
    case 'core/image':
      return IMAGE_PRESETS
    case 'core/group':
      return GROUP_PRESETS
    case 'core/list':
      return LIST_PRESETS
    case 'core/quote':
      return QUOTE_PRESETS
    case 'core/spacer':
      return SPACER_PRESETS
    case 'core/separator':
      return SEPARATOR_PRESETS
    default:
      return {
        default: {
          spacing: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
          typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
          backgroundColor: '',
          textColor: 'text-gray-700'
        }
      }
  }
}