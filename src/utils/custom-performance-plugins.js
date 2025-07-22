/**
 * Custom Performance Plugins
 * 
 * Examples of how easy it is to create and add new performance features
 * to the modular framework.
 * 
 * @package TailwindStarter
 */

import { registerPerformancePlugin } from './performance-framework.js'

/**
 * Custom Lightbox Plugin
 * Add this feature to any block with just configuration!
 */
registerPerformancePlugin('lightbox', {
  apply(blockElement, config) {
    const lightboxImages = blockElement.querySelectorAll('img[data-lightbox]')
    
    lightboxImages.forEach((img, index) => {
      img.style.cursor = 'pointer'
      img.addEventListener('click', (e) => {
        e.preventDefault()
        openLightbox(img, config)
      })
    })
  }
})

/**
 * Custom Countdown Timer Plugin
 * Perfect for CTA sections and urgency!
 */
registerPerformancePlugin('countdownTimer', {
  apply(blockElement, config) {
    const timerElement = blockElement.querySelector('[data-countdown]')
    if (!timerElement || !config.targetDate) return

    function updateTimer() {
      const now = new Date().getTime()
      const target = new Date(config.targetDate).getTime()
      const timeLeft = target - now

      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

        timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`
      } else {
        timerElement.innerHTML = config.expiredText || 'Expired'
      }
    }

    updateTimer()
    setInterval(updateTimer, 1000)
  }
})

/**
 * Custom Progressive Enhancement Plugin
 * Gracefully enhance features based on device capabilities
 */
registerPerformancePlugin('progressiveEnhancement', {
  apply(blockElement, config) {
    // Check device capabilities
    const capabilities = {
      webp: checkWebPSupport(),
      intersectionObserver: 'IntersectionObserver' in window,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      slowConnection: getConnectionSpeed() === 'slow'
    }

    // Apply enhancements based on capabilities
    if (config.webpFallback && !capabilities.webp) {
      enableWebPFallback(blockElement)
    }

    if (config.motionReduction && capabilities.reducedMotion) {
      disableAnimations(blockElement)
    }

    if (config.connectionOptimization && capabilities.slowConnection) {
      optimizeForSlowConnection(blockElement)
    }
  }
})

/**
 * Custom A/B Testing Plugin
 * Easy A/B testing for any block!
 */
registerPerformancePlugin('abTesting', {
  apply(blockElement, config) {
    const testName = config.testName
    const variants = config.variants || []
    
    if (!testName || !variants.length) return

    // Get or set user's variant
    const storageKey = `ab_test_${testName}`
    let userVariant = localStorage.getItem(storageKey)
    
    if (!userVariant) {
      userVariant = variants[Math.floor(Math.random() * variants.length)]
      localStorage.setItem(storageKey, userVariant)
    }

    // Apply variant styles/content
    blockElement.classList.add(`variant-${userVariant}`)
    
    // Track variant assignment
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_assignment', {
        test_name: testName,
        variant: userVariant,
        event_category: 'ab_testing'
      })
    }
  }
})

/**
 * Custom Performance Monitoring Plugin
 * Track actual performance metrics!
 */
registerPerformancePlugin('performanceMonitoring', {
  apply(blockElement, config) {
    // Track block render time
    const startTime = performance.now()
    
    // Use ResizeObserver to detect when block is fully rendered
    const resizeObserver = new ResizeObserver(() => {
      const renderTime = performance.now() - startTime
      
      if (renderTime > 50) { // Only track significant render times
        if (typeof gtag !== 'undefined') {
          gtag('event', 'block_performance', {
            block_type: blockElement.className.split(' ')[0],
            render_time: Math.round(renderTime),
            event_category: 'performance'
          })
        }
      }
      
      resizeObserver.disconnect()
    })
    
    resizeObserver.observe(blockElement)
  }
})

// ============================================================================
// UTILITY FUNCTIONS FOR CUSTOM PLUGINS
// ============================================================================

function openLightbox(img, config) {
  const lightboxHtml = `
    <div class="lightbox-overlay fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div class="lightbox-container relative max-w-4xl max-h-full">
        <button class="lightbox-close absolute -top-12 right-0 text-white text-2xl hover:text-gray-300">
          ✕
        </button>
        <img src="${img.src}" alt="${img.alt}" class="max-w-full max-h-full object-contain rounded-lg">
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', lightboxHtml)
  
  const overlay = document.querySelector('.lightbox-overlay')
  const closeBtn = overlay.querySelector('.lightbox-close')
  
  closeBtn.addEventListener('click', () => overlay.remove())
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove()
  })
}

function checkWebPSupport() {
  return new Promise(resolve => {
    const webp = new Image()
    webp.onload = webp.onerror = () => resolve(webp.height === 2)
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

function getConnectionSpeed() {
  if ('connection' in navigator) {
    const connection = navigator.connection
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return 'slow'
    }
  }
  return 'fast'
}

function enableWebPFallback(blockElement) {
  const webpSources = blockElement.querySelectorAll('source[type="image/webp"]')
  webpSources.forEach(source => source.remove())
}

function disableAnimations(blockElement) {
  const animatedElements = blockElement.querySelectorAll('[data-animate]')
  animatedElements.forEach(element => {
    element.style.opacity = '1'
    element.style.transform = 'none'
  })
}

function optimizeForSlowConnection(blockElement) {
  // Disable autoplay videos
  const videos = blockElement.querySelectorAll('video[autoplay]')
  videos.forEach(video => {
    video.removeAttribute('autoplay')
    video.preload = 'none'
  })
  
  // Use smaller images
  const images = blockElement.querySelectorAll('img')
  images.forEach(img => {
    if (img.src.includes('?w=')) {
      img.src = img.src.replace(/w=\d+/, 'w=400') // Smaller width
    }
  })
} 