/**
 * Performance Monitoring Utility for Visual Controls
 * Tracks Core Web Vitals and component performance
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      componentRenderTimes: {},
      classGenerationTimes: {},
      totalControlsLoaded: 0,
      memoryUsage: null
    }
    this.isEnabled = process.env.NODE_ENV === 'development'
    
    if (this.isEnabled) {
      this.init()
    }
  }

  init() {
    // Monitor Core Web Vitals if available
    if (typeof window !== 'undefined' && 'web-vitals' in window) {
      this.initWebVitals()
    }
    
    // Monitor memory usage
    this.monitorMemory()
    
    console.log('🚀 Visual Controls Performance Monitor initialized')
  }

  initWebVitals() {
    // Core Web Vitals monitoring
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = window['web-vitals']
      
      getCLS(this.onCLS.bind(this))
      getFID(this.onFID.bind(this))
      getFCP(this.onFCP.bind(this))
      getLCP(this.onLCP.bind(this))
      getTTFB(this.onTTFB.bind(this))
    } catch (error) {
      console.warn('Web Vitals not available:', error)
    }
  }

  onCLS(metric) {
    this.logMetric('CLS', metric.value, 'Layout Shift', metric.value < 0.1 ? '✅' : '⚠️')
  }

  onFID(metric) {
    this.logMetric('FID', metric.value, 'First Input Delay (ms)', metric.value < 100 ? '✅' : '⚠️')
  }

  onFCP(metric) {
    this.logMetric('FCP', metric.value, 'First Contentful Paint (ms)', metric.value < 1800 ? '✅' : '⚠️')
  }

  onLCP(metric) {
    this.logMetric('LCP', metric.value, 'Largest Contentful Paint (ms)', metric.value < 2500 ? '✅' : '⚠️')
  }

  onTTFB(metric) {
    this.logMetric('TTFB', metric.value, 'Time to First Byte (ms)', metric.value < 800 ? '✅' : '⚠️')
  }

  logMetric(name, value, description, status) {
    console.log(`${status} ${name}: ${Math.round(value)} - ${description}`)
  }

  // Track component render performance
  startComponentTimer(componentName) {
    if (!this.isEnabled) return
    
    return performance.now()
  }

  endComponentTimer(componentName, startTime) {
    if (!this.isEnabled || !startTime) return
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    if (!this.metrics.componentRenderTimes[componentName]) {
      this.metrics.componentRenderTimes[componentName] = []
    }
    
    this.metrics.componentRenderTimes[componentName].push(renderTime)
    
    // Log slow renders
    if (renderTime > 16) { // 16ms = 60fps threshold
      console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`)
    }
  }

  // Track class generation performance
  trackClassGeneration(settingsSize, generationTime) {
    if (!this.isEnabled) return
    
    this.metrics.classGenerationTimes = {
      averageTime: generationTime,
      settingsSize: settingsSize,
      classesPerMs: settingsSize / generationTime
    }
    
    if (generationTime > 5) {
      console.warn(`⚠️ Slow class generation: ${generationTime.toFixed(2)}ms for ${settingsSize} settings`)
    }
  }

  // Monitor memory usage
  monitorMemory() {
    if (!this.isEnabled || typeof window === 'undefined' || !performance.memory) return
    
    setInterval(() => {
      const memory = performance.memory
      this.metrics.memoryUsage = {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      }
      
      // Warn if memory usage is high
      if (this.metrics.memoryUsage.used > 50) {
        console.warn(`⚠️ High memory usage: ${this.metrics.memoryUsage.used}MB`)
      }
    }, 10000) // Check every 10 seconds
  }

  // Get performance report
  getReport() {
    if (!this.isEnabled) return null
    
    const report = {
      componentRenderTimes: this.getComponentAverages(),
      classGeneration: this.metrics.classGenerationTimes,
      memoryUsage: this.metrics.memoryUsage,
      totalControlsLoaded: this.metrics.totalControlsLoaded
    }
    
    return report
  }

  getComponentAverages() {
    const averages = {}
    
    Object.entries(this.metrics.componentRenderTimes).forEach(([component, times]) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      averages[component] = {
        average: Math.round(avg * 100) / 100,
        samples: times.length,
        max: Math.max(...times),
        min: Math.min(...times)
      }
    })
    
    return averages
  }

  // Log performance report to console
  logReport() {
    if (!this.isEnabled) return
    
    const report = this.getReport()
    
    console.group('📊 Visual Controls Performance Report')
    console.log('Component Render Times:', report.componentRenderTimes)
    console.log('Class Generation:', report.classGeneration)
    console.log('Memory Usage:', report.memoryUsage)
    console.log('Total Controls Loaded:', report.totalControlsLoaded)
    console.groupEnd()
  }

  // Increment controls counter
  incrementControlsLoaded() {
    this.metrics.totalControlsLoaded++
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor()

// Export utility functions
export const trackComponentRender = (componentName, renderFunction) => {
  const startTime = performanceMonitor.startComponentTimer(componentName)
  const result = renderFunction()
  performanceMonitor.endComponentTimer(componentName, startTime)
  return result
}

export const trackClassGeneration = (settings, generationFunction) => {
  const startTime = performance.now()
  const result = generationFunction()
  const endTime = performance.now()
  
  performanceMonitor.trackClassGeneration(
    Object.keys(settings).length,
    endTime - startTime
  )
  
  return result
}

export const getPerformanceReport = () => {
  return performanceMonitor.getReport()
}

export const logPerformanceReport = () => {
  performanceMonitor.logReport()
}

export const incrementControlsLoaded = () => {
  performanceMonitor.incrementControlsLoaded()
}

export default performanceMonitor