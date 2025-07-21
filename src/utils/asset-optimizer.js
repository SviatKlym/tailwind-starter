/**
 * Asset Optimization Utility
 * Handles CSS/JS minification, compression, and optimization
 */

import { getPerformanceReport } from './performance-monitor.js'
import imageOptimizer from './image-optimizer.js'

class AssetOptimizer {
  constructor() {
    this.compressionSupported = null
    this.optimizedAssets = new Map()
    this.init()
  }

  /**
   * Initialize asset optimizer
   */
  init() {
    if (typeof window === 'undefined') return

    // Check compression support
    this.checkCompressionSupport()
    
    // Optimize existing assets
    this.optimizeLoadedAssets()
    
    // Monitor for new assets
    this.setupAssetMonitoring()
  }

  /**
   * Check if browser supports compression (Brotli/Gzip)
   */
  checkCompressionSupport() {
    if (typeof window.CompressionStream !== 'undefined') {
      this.compressionSupported = 'brotli'
    } else if (typeof window.Response !== 'undefined' && 'compression' in new Response()) {
      this.compressionSupported = 'gzip'
    } else {
      this.compressionSupported = false
    }
  }

  /**
   * Optimize already loaded assets
   */
  optimizeLoadedAssets() {
    // Optimize CSS files
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]')
    styleSheets.forEach(link => this.optimizeStyleSheet(link))
    
    // Optimize script files
    const scripts = document.querySelectorAll('script[src]')
    scripts.forEach(script => this.optimizeScript(script))
    
    // Optimize images
    const images = document.querySelectorAll('img')
    images.forEach(img => this.optimizeImage(img))
  }

  /**
   * Setup monitoring for new assets
   */
  setupAssetMonitoring() {
    // Monitor DOM changes for new assets
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for new stylesheets
            if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
              this.optimizeStyleSheet(node)
            }
            // Check for new scripts
            else if (node.tagName === 'SCRIPT' && node.src) {
              this.optimizeScript(node)
            }
            // Check for new images
            else if (node.tagName === 'IMG') {
              this.optimizeImage(node)
            }
            // Check for new assets within added elements
            else {
              const nestedStyleSheets = node.querySelectorAll?.('link[rel="stylesheet"]')
              const nestedScripts = node.querySelectorAll?.('script[src]')
              const nestedImages = node.querySelectorAll?.('img')
              
              nestedStyleSheets?.forEach(link => this.optimizeStyleSheet(link))
              nestedScripts?.forEach(script => this.optimizeScript(script))
              nestedImages?.forEach(img => this.optimizeImage(img))
            }
          }
        })
      })
    })

    observer.observe(document.head, { childList: true, subtree: true })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  /**
   * Optimize stylesheet loading
   */
  async optimizeStyleSheet(link) {
    const href = link.href
    if (!href || this.optimizedAssets.has(href)) return

    try {
      // Mark as being optimized
      this.optimizedAssets.set(href, 'optimizing')
      
      // Add preload hints for critical CSS
      if (this.isCriticalCSS(href)) {
        this.addResourceHint('preload', href, 'style')
      }
      
      // Add loading optimization attributes
      if (!link.hasAttribute('media')) {
        link.media = 'all'
      }
      
      // Add defer loading for non-critical CSS
      if (!this.isCriticalCSS(href)) {
        link.media = 'print'
        link.onload = function() {
          this.media = 'all'
        }
      }
      
      this.optimizedAssets.set(href, 'optimized')
      
    } catch (error) {
      console.warn('Failed to optimize stylesheet:', href, error)
      this.optimizedAssets.set(href, 'error')
    }
  }

  /**
   * Optimize script loading
   */
  async optimizeScript(script) {
    const src = script.src
    if (!src || this.optimizedAssets.has(src)) return

    try {
      // Mark as being optimized
      this.optimizedAssets.set(src, 'optimizing')
      
      // Add preload hints for critical scripts
      if (this.isCriticalScript(src)) {
        this.addResourceHint('preload', src, 'script')
      }
      
      // Add async/defer attributes if not present
      if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
        if (this.isCriticalScript(src)) {
          script.defer = true
        } else {
          script.async = true
        }
      }
      
      this.optimizedAssets.set(src, 'optimized')
      
    } catch (error) {
      console.warn('Failed to optimize script:', src, error)
      this.optimizedAssets.set(src, 'error')
    }
  }

  /**
   * Optimize image loading
   */
  async optimizeImage(img) {
    const src = img.src || img.dataset.src
    if (!src || this.optimizedAssets.has(src)) return

    try {
      // Mark as being optimized
      this.optimizedAssets.set(src, 'optimizing')
      
      // Add to image optimizer
      imageOptimizer.addLazyImage(img)
      
      // Add loading attribute if not present
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy'
      }
      
      // Add decoding attribute for better performance
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async'
      }
      
      this.optimizedAssets.set(src, 'optimized')
      
    } catch (error) {
      console.warn('Failed to optimize image:', src, error)
      this.optimizedAssets.set(src, 'error')
    }
  }

  /**
   * Check if CSS is critical
   */
  isCriticalCSS(href) {
    const criticalPatterns = [
      'main.css',
      'style.css',
      'critical.css',
      'above-fold.css'
    ]
    
    return criticalPatterns.some(pattern => href.includes(pattern))
  }

  /**
   * Check if script is critical
   */
  isCriticalScript(src) {
    const criticalPatterns = [
      'polyfill',
      'runtime',
      'vendor',
      'main.js'
    ]
    
    return criticalPatterns.some(pattern => src.includes(pattern))
  }

  /**
   * Add resource hint to document head
   */
  addResourceHint(rel, href, as) {
    // Check if hint already exists
    const existing = document.querySelector(`link[rel="${rel}"][href="${href}"]`)
    if (existing) return

    const link = document.createElement('link')
    link.rel = rel
    link.href = href
    if (as) link.as = as
    
    // Add crossorigin for external resources
    if (this.isExternalResource(href)) {
      link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
  }

  /**
   * Check if resource is external
   */
  isExternalResource(url) {
    try {
      const resourceUrl = new URL(url, window.location.origin)
      return resourceUrl.origin !== window.location.origin
    } catch {
      return false
    }
  }

  /**
   * Minify CSS content
   */
  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
      .replace(/\s*{\s*/g, '{') // Remove spaces around braces
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
      .replace(/\s*,\s*/g, ',') // Remove spaces around commas
      .replace(/\s*:\s*/g, ':') // Remove spaces around colons
      .trim()
  }

  /**
   * Minify JavaScript content
   */
  minifyJS(js) {
    // Basic minification - in production, use a proper minifier
    return js
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}();,:])\s*/g, '$1') // Remove spaces around operators
      .trim()
  }

  /**
   * Compress text content using available compression
   */
  async compressText(text) {
    if (!this.compressionSupported || typeof window.CompressionStream === 'undefined') {
      return text
    }

    try {
      const stream = new CompressionStream('gzip')
      const writer = stream.writable.getWriter()
      const reader = stream.readable.getReader()
      
      writer.write(new TextEncoder().encode(text))
      writer.close()
      
      const chunks = []
      let done = false
      
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) chunks.push(value)
      }
      
      return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []))
    } catch (error) {
      console.warn('Compression failed:', error)
      return text
    }
  }

  /**
   * Get optimization statistics
   */
  getOptimizationStats() {
    const stats = {
      totalAssets: this.optimizedAssets.size,
      optimizedAssets: 0,
      failedAssets: 0,
      compressionSupported: this.compressionSupported,
      imageStats: imageOptimizer.getStats()
    }

    this.optimizedAssets.forEach(status => {
      if (status === 'optimized') stats.optimizedAssets++
      if (status === 'error') stats.failedAssets++
    })

    return stats
  }

  /**
   * Generate comprehensive performance report
   */
  async getPerformanceReport() {
    const optimizationStats = this.getOptimizationStats()
    const performanceStats = getPerformanceReport()
    
    return {
      timestamp: new Date().toISOString(),
      optimization: optimizationStats,
      performance: performanceStats,
      recommendations: this.generateRecommendations(optimizationStats)
    }
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(stats) {
    const recommendations = []
    
    if (stats.failedAssets > 0) {
      recommendations.push('Some assets failed to optimize. Check browser console for errors.')
    }
    
    if (!stats.compressionSupported) {
      recommendations.push('Browser does not support modern compression. Consider server-side compression.')
    }
    
    if (stats.imageStats.errorImagesCount > 0) {
      recommendations.push(`${stats.imageStats.errorImagesCount} images failed to load. Check image URLs.`)
    }
    
    if (!stats.imageStats.webpSupported) {
      recommendations.push('Browser does not support WebP. Consider fallback images.')
    }
    
    return recommendations
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.optimizedAssets.clear()
  }
}

// Create singleton instance
const assetOptimizer = new AssetOptimizer()

// Export utility functions
export const optimizeAsset = (element) => {
  if (element.tagName === 'LINK' && element.rel === 'stylesheet') {
    return assetOptimizer.optimizeStyleSheet(element)
  } else if (element.tagName === 'SCRIPT' && element.src) {
    return assetOptimizer.optimizeScript(element)
  } else if (element.tagName === 'IMG') {
    return assetOptimizer.optimizeImage(element)
  }
}

export const getOptimizationStats = () => {
  return assetOptimizer.getOptimizationStats()
}

export const getPerformanceReport = async () => {
  return await assetOptimizer.getPerformanceReport()
}

export const minifyCSS = (css) => {
  return assetOptimizer.minifyCSS(css)
}

export const minifyJS = (js) => {
  return assetOptimizer.minifyJS(js)
}

export default assetOptimizer