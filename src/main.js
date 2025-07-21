/**
 * Main Theme Entry Point
 * Initializes performance optimizations and utilities
 */

// Initialize performance optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Tailwind Starter Theme with Performance Optimizations loaded')
  
  // Lazy load performance utilities
  try {
    // Initialize performance monitoring
    const { default: performanceMonitor } = await import('./utils/performance-monitor.js')
    console.log('📊 Performance monitor initialized')
    
    // Initialize asset optimizer
    const { default: assetOptimizer } = await import('./utils/asset-optimizer.js')
    console.log('🎯 Asset optimizer initialized')
    
    // Initialize image optimizer
    const { default: imageOptimizer } = await import('./utils/image-optimizer.js')
    console.log('🖼️ Image optimizer initialized')
    
    // Export utilities for global access
    window.TailwindStarter = {
      performanceMonitor,
      assetOptimizer,
      imageOptimizer,
      async getPerformanceReport() {
        const { getPerformanceReport } = await import('./utils/asset-optimizer.js')
        return await getPerformanceReport()
      }
    }
    
    // Performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      // Log performance stats after page load
      setTimeout(() => {
        if (performanceMonitor && performanceMonitor.logReport) {
          performanceMonitor.logReport()
        }
      }, 3000)
    }
    
  } catch (error) {
    console.warn('Some performance utilities failed to load:', error)
  }
})