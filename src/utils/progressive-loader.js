/**
 * Progressive Frontend Loader
 * Handles progressive enhancement and loading of block functionality
 */

class ProgressiveLoader {
  constructor() {
    this.loadedBlocks = new Set()
    this.loadingPromises = new Map()
    this.intersectionObserver = null
    this.init()
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup())
    } else {
      this.setup()
    }
  }

  setup() {
    // Setup intersection observer for lazy loading
    this.setupIntersectionObserver()
    
    // Load critical blocks immediately
    this.loadCriticalBlocks()
    
    // Setup lazy loading for other blocks
    this.setupLazyLoading()
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers - load all blocks
      this.loadAllBlocks()
      return
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadBlock(entry.target)
            this.intersectionObserver.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )
  }

  loadCriticalBlocks() {
    // Load blocks that are above the fold or critical for functionality
    const criticalSelectors = [
      '.wp-block-tailwind-starter-hero-section',
      '.wp-block-tailwind-starter-hero-with-cta',
      '.wp-block-tailwind-starter-cta-section'
    ]

    criticalSelectors.forEach(selector => {
      const blocks = document.querySelectorAll(selector)
      blocks.forEach(block => this.loadBlock(block))
    })
  }

  setupLazyLoading() {
    // Find all blocks that should be lazy loaded
    const lazySelectors = [
      '.wp-block-tailwind-starter-testimonial-showcase',
      '.wp-block-tailwind-starter-pricing-table',
      '.wp-block-tailwind-starter-stats-display',
      '.wp-block-tailwind-starter-team-members',
      '.wp-block-tailwind-starter-faq-accordion',
      '.wp-block-tailwind-starter-content-slider',
      '.wp-block-tailwind-starter-before-after',
      '.wp-block-tailwind-starter-video-section'
    ]

    lazySelectors.forEach(selector => {
      const blocks = document.querySelectorAll(selector)
      blocks.forEach(block => {
        if (!this.isInViewport(block)) {
          this.intersectionObserver.observe(block)
        } else {
          this.loadBlock(block)
        }
      })
    })
  }

  async loadBlock(blockElement) {
    const blockType = this.getBlockType(blockElement)
    
    if (this.loadedBlocks.has(blockElement) || !blockType) {
      return
    }

    // Check if already loading
    if (this.loadingPromises.has(blockElement)) {
      return this.loadingPromises.get(blockElement)
    }

    // Add loading state
    blockElement.classList.add('block-loading')
    
    const loadingPromise = this.loadBlockScript(blockType, blockElement)
    this.loadingPromises.set(blockElement, loadingPromise)

    try {
      await loadingPromise
      this.loadedBlocks.add(blockElement)
      blockElement.classList.remove('block-loading')
      blockElement.classList.add('block-loaded')
      
      // Dispatch custom event
      blockElement.dispatchEvent(new CustomEvent('blockLoaded', {
        detail: { blockType, element: blockElement }
      }))
      
    } catch (error) {
      console.warn(`Failed to load block: ${blockType}`, error)
      blockElement.classList.remove('block-loading')
      blockElement.classList.add('block-error')
    } finally {
      this.loadingPromises.delete(blockElement)
    }
  }

  async loadBlockScript(blockType, blockElement) {
    const scriptMap = {
      'testimonial-showcase': () => this.loadTestimonialShowcase(blockElement),
      'pricing-table': () => this.loadPricingTable(blockElement),
      'stats-display': () => this.loadStatsDisplay(blockElement),
      'team-members': () => this.loadTeamMembers(blockElement),
      'faq-accordion': () => this.loadFaqAccordion(blockElement),
      'content-slider': () => this.loadContentSlider(blockElement),
      'before-after': () => this.loadBeforeAfter(blockElement),
      'video-section': () => this.loadVideoSection(blockElement)
    }

    if (scriptMap[blockType]) {
      await scriptMap[blockType]()
    }
  }

  getBlockType(element) {
    const classList = Array.from(element.classList)
    const blockClass = classList.find(cls => cls.startsWith('wp-block-tailwind-starter-'))
    return blockClass ? blockClass.replace('wp-block-tailwind-starter-', '') : null
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  // Block-specific loaders
  async loadTestimonialShowcase(blockElement) {
    if (typeof TestimonialShowcaseBlock !== 'undefined') return
    
    // Dynamic import would go here in a real implementation
    // For now, we'll initialize the existing class
    if (window.TestimonialShowcaseBlock) {
      new window.TestimonialShowcaseBlock()
    }
  }

  async loadPricingTable(blockElement) {
    // Initialize pricing table functionality
    this.initializePricingTable(blockElement)
  }

  async loadStatsDisplay(blockElement) {
    // Initialize stats animation
    this.initializeStatsAnimation(blockElement)
  }

  async loadTeamMembers(blockElement) {
    // Initialize team member interactions
    this.initializeTeamMembers(blockElement)
  }

  async loadFaqAccordion(blockElement) {
    // Initialize FAQ accordion
    this.initializeFaqAccordion(blockElement)
  }

  async loadContentSlider(blockElement) {
    // Initialize content slider
    this.initializeContentSlider(blockElement)
  }

  async loadBeforeAfter(blockElement) {
    // Initialize before/after slider
    this.initializeBeforeAfter(blockElement)
  }

  async loadVideoSection(blockElement) {
    // Initialize video controls
    this.initializeVideoSection(blockElement)
  }

  // Initialize methods for each block type
  initializePricingTable(element) {
    const toggleBtns = element.querySelectorAll('.toggle-btn')
    const monthlyPrices = element.querySelectorAll('.monthly-price')
    const annualPrices = element.querySelectorAll('.annual-price')
    
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const period = this.dataset.period
        
        toggleBtns.forEach(b => {
          b.classList.remove('active', 'bg-white', 'shadow-sm')
          b.classList.add('text-gray-600')
        })
        this.classList.add('active', 'bg-white', 'shadow-sm')
        this.classList.remove('text-gray-600')
        
        if (period === 'monthly') {
          monthlyPrices.forEach(el => el.classList.remove('hidden'))
          annualPrices.forEach(el => el.classList.add('hidden'))
        } else {
          monthlyPrices.forEach(el => el.classList.add('hidden'))
          annualPrices.forEach(el => el.classList.remove('hidden'))
        }
      })
    })
  }

  initializeStatsAnimation(element) {
    const stats = element.querySelectorAll('.stat-number')
    
    stats.forEach(stat => {
      const target = parseInt(stat.textContent)
      const duration = 2000
      const step = target / (duration / 16)
      let current = 0
      
      const updateNumber = () => {
        if (current < target) {
          current += step
          stat.textContent = Math.floor(current)
          requestAnimationFrame(updateNumber)
        } else {
          stat.textContent = target
        }
      }
      
      updateNumber()
    })
  }

  initializeFaqAccordion(element) {
    const faqItems = element.querySelectorAll('.faq-item')
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question')
      const answer = item.querySelector('.faq-answer')
      
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open')
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open')
            const otherAnswer = otherItem.querySelector('.faq-answer')
            otherAnswer.style.maxHeight = '0'
          }
        })
        
        // Toggle current item
        if (isOpen) {
          item.classList.remove('open')
          answer.style.maxHeight = '0'
        } else {
          item.classList.add('open')
          answer.style.maxHeight = answer.scrollHeight + 'px'
        }
      })
    })
  }

  loadAllBlocks() {
    const allBlocks = document.querySelectorAll('[class*="wp-block-tailwind-starter-"]')
    allBlocks.forEach(block => this.loadBlock(block))
  }

  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
    this.loadedBlocks.clear()
    this.loadingPromises.clear()
  }
}

// Initialize progressive loader
const progressiveLoader = new ProgressiveLoader()

export default progressiveLoader