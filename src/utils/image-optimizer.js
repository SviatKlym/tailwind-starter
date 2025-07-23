/**
 * Image Optimization Utility
 * Handles WebP conversion and image loading optimization
 */

class ImageOptimizer {
  constructor() {
    this.webpSupported = null
    this.lazyImages = []
    this.intersectionObserver = null
    this.init()
  }

  /**
   * Initialize the image optimizer
   */
  init() {
    if (typeof window === 'undefined') return

    // Check WebP support
    this.checkWebPSupport()
    
    // Initialize lazy loading
    this.initLazyLoading()
    
    // Initialize responsive image loading
    this.initResponsiveImages()
  }

  /**
   * Check if browser supports WebP format
   */
  async checkWebPSupport() {
    if (this.webpSupported !== null) return this.webpSupported

    return new Promise((resolve) => {
      const webP = new Image()
      webP.onload = webP.onerror = () => {
        this.webpSupported = (webP.height === 2)
        resolve(this.webpSupported)
      }
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })
  }

  /**
   * Initialize lazy loading with Intersection Observer
   */
  initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      this.loadAllImages()
      return
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target)
            this.intersectionObserver.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )

    // Observe all lazy images
    this.observeLazyImages()
  }

  /**
   * Find and observe all lazy images
   */
  observeLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]')
    
    lazyImages.forEach((img) => {
      this.lazyImages.push(img)
      this.intersectionObserver.observe(img)
    })
  }

  /**
   * Load a single image
   */
  async loadImage(img) {
    const src = img.dataset.src || img.src
    
    if (!src) return

    // Check if we should use WebP
    const optimizedSrc = await this.getOptimizedSrc(src)
    
    // Create new image to preload
    const imageLoader = new Image()
    
    imageLoader.onload = () => {
      // Image loaded successfully
      img.src = optimizedSrc
      img.classList.remove('lazy-loading')
      img.classList.add('lazy-loaded')
      
      // Remove data-src attribute
      if (img.dataset.src) {
        delete img.dataset.src
      }
      
      // Trigger custom event
      img.dispatchEvent(new CustomEvent('imageLoaded', {
        detail: { originalSrc: src, optimizedSrc }
      }))
    }
    
    imageLoader.onerror = () => {
      // Fallback to original image if optimized version fails
      img.src = src
      img.classList.remove('lazy-loading')
      img.classList.add('lazy-error')
    }
    
    img.classList.add('lazy-loading')
    imageLoader.src = optimizedSrc
  }

  /**
   * Get optimized image source (WebP if supported)
   */
  async getOptimizedSrc(originalSrc) {
    if (this.webpSupported === null) {
      await this.checkWebPSupport()
    }

    if (!this.webpSupported) {
      return originalSrc
    }

    // Check if WebP version exists
    const webpSrc = this.convertToWebP(originalSrc)
    
    try {
      const response = await fetch(webpSrc, { method: 'HEAD' })
      if (response.ok) {
        return webpSrc
      }
    } catch (error) {
      console.warn('WebP version not available:', webpSrc)
    }
    
    return originalSrc
  }

  /**
   * Convert image URL to WebP format
   */
  convertToWebP(src) {
    // Simple WebP conversion - replace extension
    return src.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp$2')
  }

  /**
   * Initialize responsive image loading
   */
  initResponsiveImages() {
    const responsiveImages = document.querySelectorAll('img[data-srcset]')
    
    responsiveImages.forEach((img) => {
      this.setupResponsiveImage(img)
    })
  }

  /**
   * Setup responsive image with appropriate source
   */
  setupResponsiveImage(img) {
    const srcset = img.dataset.srcset
    if (!srcset) return

    // Parse srcset and select appropriate image
    const sources = this.parseSrcset(srcset)
    const selectedSource = this.selectBestSource(sources)
    
    if (selectedSource) {
      img.dataset.src = selectedSource.url
    }
  }

  /**
   * Parse srcset string into array of sources
   */
  parseSrcset(srcset) {
    return srcset.split(',').map(source => {
      const [url, descriptor] = source.trim().split(' ')
      const width = descriptor ? parseInt(descriptor.replace('w', '')) : null
      return { url, width }
    })
  }

  /**
   * Select best source based on viewport width
   */
  selectBestSource(sources) {
    const viewportWidth = window.innerWidth
    const devicePixelRatio = window.devicePixelRatio || 1
    const targetWidth = viewportWidth * devicePixelRatio

    // Sort sources by width
    sources.sort((a, b) => (a.width || 0) - (b.width || 0))

    // Find best match
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]
      if (!source.width || source.width >= targetWidth) {
        return source
      }
    }

    // Return largest if none match
    return sources[sources.length - 1]
  }

  /**
   * Load all images immediately (fallback)
   */
  loadAllImages() {
    this.lazyImages.forEach((img) => {
      this.loadImage(img)
    })
  }

  /**
   * Add new image to lazy loading
   */
  addLazyImage(img) {
    if (this.intersectionObserver) {
      this.lazyImages.push(img)
      this.intersectionObserver.observe(img)
    } else {
      this.loadImage(img)
    }
  }

  /**
   * Remove image from lazy loading
   */
  removeLazyImage(img) {
    const index = this.lazyImages.indexOf(img)
    if (index > -1) {
      this.lazyImages.splice(index, 1)
      if (this.intersectionObserver) {
        this.intersectionObserver.unobserve(img)
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
    this.lazyImages = []
  }

  /**
   * Get optimization statistics
   */
  getStats() {
    return {
      webpSupported: this.webpSupported,
      lazyImagesCount: this.lazyImages.length,
      loadedImagesCount: document.querySelectorAll('img.lazy-loaded').length,
      errorImagesCount: document.querySelectorAll('img.lazy-error').length
    }
  }
}

// Create singleton instance
const imageOptimizer = new ImageOptimizer()

// Export utility functions
export const optimizeImage = (src) => {
  return imageOptimizer.getOptimizedSrc(src)
}

export const addLazyImage = (img) => {
  imageOptimizer.addLazyImage(img)
}

export const removeLazyImage = (img) => {
  imageOptimizer.removeLazyImage(img)
}

export const getImageStats = () => {
  return imageOptimizer.getStats()
}

export const isWebPSupported = async () => {
  return await imageOptimizer.checkWebPSupport()
}

// CSS has been moved to src/editor.css

export default imageOptimizer