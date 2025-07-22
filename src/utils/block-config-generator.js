/**
 * Block Performance Configuration Generator
 * 
 * Generates clean, reusable performance configurations for blocks
 * instead of embedding complex inline code.
 * 
 * @package TailwindStarter
 */

/**
 * Generate performance configuration for a block
 * @param {string} blockType - Type of block (hero-section, feature-grid, etc.)
 * @param {Object} options - Block-specific options
 * @returns {Object} Performance configuration
 */
export function generatePerformanceConfig(blockType, options = {}) {
  const baseConfig = getBaseConfig(blockType);
  return mergeConfigs(baseConfig, options);
}

/**
 * Get base performance configuration for block types
 * @param {string} blockType - Block type
 * @returns {Object} Base configuration
 */
function getBaseConfig(blockType) {
  const configs = {
    'hero-section': {
      lazyLoading: {
        enabled: true,
        rootMargin: '100px'
      },
      scrollAnimations: {
        enabled: true,
        type: 'fadeInUp',
        duration: '0.8s',
        threshold: 0.1
      },
      analytics: {
        enabled: true,
        trackViews: true,
        viewData: { section: 'hero' }
      }
    },
    
    'feature-grid': {
      lazyLoading: {
        enabled: true,
        rootMargin: '50px'
      },
      scrollAnimations: {
        enabled: true,
        type: 'fadeInUp',
        duration: '0.6s',
        threshold: 0.1
      },
      hoverEffects: {
        enabled: true,
        enter: { transform: 'translateY(-4px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
        leave: { transform: 'translateY(0)', boxShadow: 'none' }
      },
      analytics: {
        enabled: true,
        trackViews: true,
        trackClicks: true,
        clickData: { section: 'features' }
      }
    },
    
    'process-steps': {
      scrollAnimations: {
        enabled: true,
        type: 'fadeInUp',
        duration: '0.6s',
        threshold: 0.3
      },
      analytics: {
        enabled: true,
        trackViews: true,
        viewData: { section: 'process' }
      }
    },
    
    'cta-section': {
      scrollAnimations: {
        enabled: true,
        type: 'zoomIn',
        duration: '0.8s',
        threshold: 0.5
      },
      analytics: {
        enabled: true,
        trackViews: true,
        trackClicks: true,
        viewData: { section: 'cta' },
        clickData: { conversion_point: true }
      }
    },
    
    'testimonial-showcase': {
      lazyLoading: {
        enabled: true,
        rootMargin: '100px'
      },
      scrollAnimations: {
        enabled: true,
        type: 'fadeInLeft',
        duration: '0.7s',
        threshold: 0.2
      }
    },
    
    'video-section': {
      lazyLoading: {
        enabled: true,
        rootMargin: '200px'
      },
      analytics: {
        enabled: true,
        trackViews: true,
        viewData: { media_type: 'video' }
      }
    }
  };
  
  return configs[blockType] || {
    scrollAnimations: {
      enabled: true,
      type: 'fadeInUp',
      duration: '0.6s'
    }
  };
}

/**
 * Merge configurations with user options
 * @param {Object} baseConfig - Base configuration
 * @param {Object} userOptions - User-provided options
 * @returns {Object} Merged configuration
 */
function mergeConfigs(baseConfig, userOptions) {
  const merged = { ...baseConfig };
  
  Object.entries(userOptions).forEach(([key, value]) => {
    if (merged[key] && typeof merged[key] === 'object' && typeof value === 'object') {
      merged[key] = { ...merged[key], ...value };
    } else {
      merged[key] = value;
    }
  });
  
  return merged;
}

/**
 * Generate data attributes for block element
 * @param {Object} config - Performance configuration
 * @returns {Object} Data attributes
 */
export function generateDataAttributes(config) {
  return {
    'data-performance-config': JSON.stringify(config),
    'data-performance-framework': 'enabled'
  };
}

/**
 * Pre-defined configuration presets
 */
export const configPresets = {
  // High-performance preset for critical sections
  critical: {
    lazyLoading: { enabled: true, rootMargin: '0px' },
    scrollAnimations: { enabled: true, duration: '0.4s' },
    analytics: { enabled: true, trackViews: true }
  },
  
  // Standard preset for most blocks
  standard: {
    lazyLoading: { enabled: true, rootMargin: '50px' },
    scrollAnimations: { enabled: true, duration: '0.6s' },
    analytics: { enabled: true, trackViews: true }
  },
  
  // Rich preset for interactive blocks
  interactive: {
    lazyLoading: { enabled: true, rootMargin: '100px' },
    scrollAnimations: { enabled: true, duration: '0.6s' },
    hoverEffects: { enabled: true },
    analytics: { enabled: true, trackViews: true, trackClicks: true }
  },
  
  // Minimal preset for simple blocks
  minimal: {
    scrollAnimations: { enabled: true, duration: '0.3s' }
  }
};

/**
 * Apply preset configuration
 * @param {string} preset - Preset name
 * @param {Object} overrides - Configuration overrides
 * @returns {Object} Configuration
 */
export function applyPreset(preset, overrides = {}) {
  const baseConfig = configPresets[preset] || configPresets.standard;
  return mergeConfigs(baseConfig, overrides);
} 