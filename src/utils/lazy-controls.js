/**
 * Lazy Loading Wrapper for Heavy Visual Control Components
 * Improves initial load time by loading components only when needed
 */

import { useState, useEffect, useRef, createElement } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { trackComponentRender, incrementControlsLoaded } from './performance-monitor.js'

/**
 * Intersection Observer hook for lazy loading
 */
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasLoaded) {
        setIsVisible(true)
        setHasLoaded(true)
        observer.unobserve(element)
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    })

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [hasLoaded, options])

  return [elementRef, isVisible]
}

/**
 * Lazy Control Component Wrapper
 */
export const LazyControlWrapper = ({ 
  children, 
  componentName, 
  placeholder = null,
  height = '200px',
  className = ''
}) => {
  const [elementRef, isVisible] = useIntersectionObserver()
  
  // Track performance when component loads
  const renderWithTracking = () => {
    return trackComponentRender(componentName, () => {
      incrementControlsLoaded()
      return children
    })
  }

  // Default placeholder
  const defaultPlaceholder = createElement('div', {
    style: {
      height: height,
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '14px',
      border: '2px dashed #d1d5db'
    }
  }, `⏳ ${__('Loading', 'tailwind-starter')} ${componentName}...`)

  return createElement('div', {
    ref: elementRef,
    className: `lazy-control-wrapper ${className}`,
    style: { minHeight: isVisible ? 'auto' : height }
  }, 
    isVisible ? renderWithTracking() : (placeholder || defaultPlaceholder)
  )
}

/**
 * Code Splitting Helper - Dynamically import components
 */
export const createLazyComponent = (importFunction, componentName) => {
  return (props) => {
    const [Component, setComponent] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
      let isMounted = true
      
      const loadComponent = async () => {
        if (Component || isLoading) return
        
        setIsLoading(true)
        try {
          const module = await importFunction()
          if (isMounted) {
            setComponent(() => module.default || module)
            incrementControlsLoaded()
          }
        } catch (err) {
          if (isMounted) {
            setError(err)
            console.error(`Failed to load component ${componentName}:`, err)
          }
        } finally {
          if (isMounted) {
            setIsLoading(false)
          }
        }
      }

      loadComponent()
      
      return () => {
        isMounted = false
      }
    }, [Component, isLoading, importFunction])

    if (error) {
      return createElement('div', {
        style: {
          padding: '16px',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '14px',
          border: '1px solid #fecaca'
        }
      }, `❌ ${__('Failed to load', 'tailwind-starter')} ${componentName}`)
    }

    if (isLoading || !Component) {
      return createElement('div', {
        style: {
          height: '200px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '14px'
        }
      }, `⏳ ${__('Loading', 'tailwind-starter')} ${componentName}...`)
    }

    return trackComponentRender(componentName, () => 
      createElement(Component, props)
    )
  }
}

/**
 * Debounced Component Updater
 * Prevents excessive re-renders during rapid control changes
 */
export const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const [isDebouncing, setIsDebouncing] = useState(false)

  useEffect(() => {
    setIsDebouncing(true)
    const timer = setTimeout(() => {
      setDebouncedValue(value)
      setIsDebouncing(false)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return [debouncedValue, isDebouncing]
}

/**
 * Memory-efficient component wrapper
 * Cleans up resources when component unmounts
 */
export const withMemoryCleanup = (Component, componentName) => {
  return (props) => {
    const mountedRef = useRef(true)
    
    useEffect(() => {
      return () => {
        mountedRef.current = false
        // Cleanup any component-specific resources
        if (typeof window !== 'undefined' && window.gc) {
          // Suggest garbage collection in development
          setTimeout(() => window.gc(), 1000)
        }
      }
    }, [])

    if (!mountedRef.current) return null

    return trackComponentRender(componentName, () => 
      createElement(Component, props)
    )
  }
}

/**
 * Performance-aware Tab Panel
 * Only renders active tab content
 */
export const LazyTabPanel = ({ activeTab, tabs, renderTab }) => {
  const [loadedTabs, setLoadedTabs] = useState(new Set([activeTab]))
  
  useEffect(() => {
    if (activeTab && !loadedTabs.has(activeTab)) {
      setLoadedTabs(prev => new Set([...prev, activeTab]))
    }
  }, [activeTab, loadedTabs])

  return createElement('div', {
    className: 'lazy-tab-panel'
  },
    tabs.map(tab => 
      createElement('div', {
        key: tab.name,
        style: { 
          display: activeTab === tab.name ? 'block' : 'none'
        }
      },
        loadedTabs.has(tab.name) ? 
          trackComponentRender(`Tab-${tab.name}`, () => renderTab(tab)) :
          createElement('div', {
            style: {
              height: '400px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '14px'
            }
          }, `⏳ ${__('Loading', 'tailwind-starter')} ${tab.label}...`)
      )
    )
  )
}

export default LazyControlWrapper