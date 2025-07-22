/**
 * Performance Optimization Framework
 * 
 * A modular, extensible system for applying performance optimizations
 * to WordPress Gutenberg blocks through simple configuration.
 * 
 * @package TailwindStarter
 */

// Performance optimization registry
const performancePlugins = new Map();

/**
 * Register a performance optimization plugin
 * @param {string} name - Plugin name
 * @param {Object} plugin - Plugin configuration
 */
export function registerPerformancePlugin(name, plugin) {
  performancePlugins.set(name, plugin);
}

/**
 * Apply performance optimizations to a block
 * @param {HTMLElement} blockElement - The block DOM element
 * @param {Object} config - Performance configuration
 */
export function applyPerformanceOptimizations(blockElement, config = {}) {
  if (!blockElement || !config) return;

  // Apply each enabled optimization
  Object.entries(config).forEach(([pluginName, pluginConfig]) => {
    if (pluginConfig.enabled && performancePlugins.has(pluginName)) {
      const plugin = performancePlugins.get(pluginName);
      plugin.apply(blockElement, pluginConfig);
    }
  });
}

/**
 * Initialize performance system for a block
 * @param {HTMLElement} blockElement - The block DOM element
 */
export function initializePerformanceSystem(blockElement) {
  const config = getPerformanceConfig(blockElement);
  if (config) {
    applyPerformanceOptimizations(blockElement, config);
  }
}

/**
 * Get performance configuration from block data attributes
 * @param {HTMLElement} blockElement - The block DOM element
 * @returns {Object} Performance configuration
 */
function getPerformanceConfig(blockElement) {
  try {
    const configAttr = blockElement.dataset.performanceConfig;
    return configAttr ? JSON.parse(configAttr) : {};
  } catch (error) {
    console.warn('Invalid performance configuration:', error);
    return {};
  }
}

// ============================================================================
// CORE PERFORMANCE PLUGINS
// ============================================================================

/**
 * Lazy Loading Plugin
 */
registerPerformancePlugin('lazyLoading', {
  apply(blockElement, config) {
    const images = blockElement.querySelectorAll('img[data-lazy-src]');
    
    if (!images.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load image
          if (img.dataset.lazySrc) {
            img.src = img.dataset.lazySrc;
            img.removeAttribute('data-lazy-src');
          }
          
          if (img.dataset.lazySrcset) {
            img.srcset = img.dataset.lazySrcset;
            img.removeAttribute('data-lazy-srcset');
          }
          
          // Load WebP source
          const picture = img.closest('picture');
          if (picture) {
            const source = picture.querySelector('source[data-lazy-srcset]');
            if (source) {
              source.srcset = source.dataset.lazySrcset;
              source.removeAttribute('data-lazy-srcset');
            }
          }
          
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: config.rootMargin || '50px' });

    images.forEach(img => observer.observe(img));
  }
});

/**
 * Scroll Animations Plugin
 */
registerPerformancePlugin('scrollAnimations', {
  apply(blockElement, config) {
    const animatedElements = blockElement.querySelectorAll('[data-animate]');
    
    if (!animatedElements.length) return;

    // Set initial states
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = getInitialTransform(config.type || 'fadeInUp');
      element.style.transition = `opacity ${config.duration || '0.6s'} ease-out, transform ${config.duration || '0.6s'} ease-out`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = parseInt(element.dataset.animateDelay) || 0;
          
          setTimeout(() => {
            requestAnimationFrame(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0) translateX(0) scale(1)';
              element.classList.add('animation-complete');
            });
          }, delay);
          
          observer.unobserve(element);
        }
      });
    }, { threshold: config.threshold || 0.1 });

    animatedElements.forEach(element => observer.observe(element));
  }
});

/**
 * Hover Effects Plugin
 */
registerPerformancePlugin('hoverEffects', {
  apply(blockElement, config) {
    const hoverElements = blockElement.querySelectorAll('[data-hover]');
    
    hoverElements.forEach(element => {
      let rafId = null;
      
      element.addEventListener('mouseenter', () => {
        if (rafId) cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
          applyHoverStyles(element, config.enter || {});
        });
      });
      
      element.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
          applyHoverStyles(element, config.leave || {});
        });
      });
    });
  }
});

/**
 * Analytics Plugin
 */
registerPerformancePlugin('analytics', {
  apply(blockElement, config) {
    // Track block views
    if (config.trackViews) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trackEvent('block_view', {
              block_type: blockElement.className.split(' ')[0],
              ...config.viewData
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(blockElement);
    }
    
    // Track interactions
    if (config.trackClicks) {
      const clickables = blockElement.querySelectorAll('[data-track-click]');
      clickables.forEach((element, index) => {
        element.addEventListener('click', () => {
          trackEvent('block_interaction', {
            element_index: index,
            element_type: element.dataset.trackClick,
            ...config.clickData
          });
        });
      });
    }
  }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getInitialTransform(type) {
  const transforms = {
    fadeInUp: 'translateY(30px)',
    fadeInDown: 'translateY(-30px)',
    fadeInLeft: 'translateX(-30px)',
    fadeInRight: 'translateX(30px)',
    zoomIn: 'scale(0.9)',
    slideInUp: 'translateY(50px)'
  };
  return transforms[type] || transforms.fadeInUp;
}

function applyHoverStyles(element, styles) {
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property] = value;
  });
}

function trackEvent(eventName, eventData) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      ...eventData,
      event_category: 'performance_framework'
    });
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('trackCustom', eventName, eventData);
  }
  
  // Custom analytics
  if (window.customAnalytics) {
    window.customAnalytics.track(eventName, eventData);
  }
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Find all blocks with performance configuration
    const performanceBlocks = document.querySelectorAll('[data-performance-config]');
    performanceBlocks.forEach(initializePerformanceSystem);
  });
  
  // Handle dynamically added blocks (for block editor)
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.dataset?.performanceConfig) {
            initializePerformanceSystem(node);
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Reduced motion support
if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
  // Disable animations for accessibility
  const style = document.createElement('style');
  style.textContent = `
    [data-animate] {
      opacity: 1 !important;
      transform: none !important;
    }
  `;
  document.head.appendChild(style);
} 