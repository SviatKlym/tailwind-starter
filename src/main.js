/**
 * Main entry point for theme assets
 * Loads performance framework and progressive enhancements
 */

// Import the modular performance framework
import './utils/performance-framework.js'
import './utils/custom-performance-plugins.js'

// Import progressive loader for frontend blocks
import './utils/progressive-loader.js'

// Import frontend animations system
import './frontend-animations.js'

// Import existing block scripts
import './index.js'

// Initialize performance framework when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Tailwind Starter Theme Loaded with Progressive Enhancement')
  
  // Optional: Add theme-specific performance monitoring
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
    console.log('🔧 Development mode: Performance monitoring enabled')
  }
})

// Export utilities for use in other files if needed
export { 
  generatePerformanceConfig, 
  generateDataAttributes,
  configPresets 
} from './utils/block-config-generator.js'

export { 
  registerPerformancePlugin,
  applyPerformanceOptimizations,
  initializePerformanceSystem 
} from './utils/performance-framework.js'