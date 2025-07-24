import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator.js'
import { generateAllClasses, generateAllInlineStyles } from '../../utils/visual-controls.js'

export default function save({ attributes }) {
  const {
    beforeImage,
    afterImage,
    beforeLabel,
    afterLabel,
    sliderPosition,
    orientation,
    showLabels,
    enableKeyboard,
    enableTouch,
    enableZoom,
    animationSpeed,
    handleStyle,
    title,
    description,
    backgroundColor,
    settings
  } = attributes

  // Before/After performance configuration
  const performanceConfig = generatePerformanceConfig('before-after', {
    lazyLoading: { 
      enabled: !!(beforeImage?.url || afterImage?.url),
      rootMargin: '100px' 
    },
    scrollAnimations: { 
      enabled: true,
      type: 'fadeInUp',
      duration: '0.6s'
    },
    analytics: {
      enabled: true,
      trackViews: true,
      trackClicks: true,
      viewData: { 
        has_before: !!beforeImage?.url,
        has_after: !!afterImage?.url,
        orientation 
      }
    }
  })

  // Generate visual classes and styles
  const visualClasses = settings ? generateAllClasses(settings) : ''
  const visualStyles = settings ? generateAllInlineStyles(settings) : {}

  const blockProps = useBlockProps.save({
    className: `before-after-block orientation-${orientation || 'horizontal'} ${backgroundColor || ''} ${visualClasses}`.trim(),
    style: visualStyles,
    ...generateDataAttributes(performanceConfig),
    'data-attributes': JSON.stringify({
      layout: attributes.layout || 'slider-comparison',
      sliderPosition: sliderPosition || 50,
      sliderColor: attributes.sliderColor,
      sliderThickness: attributes.sliderThickness,
      handleSize: attributes.handleSize,
      handleStyle: attributes.handleStyle,
      enableKeyboard: enableKeyboard !== false,
      enableTouch: enableTouch !== false,
      enableFullscreen: attributes.enableFullscreen,
      autoSlide: attributes.autoSlide,
      autoSlideDelay: attributes.autoSlideDelay,
      toggleButtonText: attributes.toggleButtonText
    })
  })

  // Helper function for optimized images
  const renderOptimizedImage = (image, alt, type) => {
    if (!image?.url) return null

    return (
      <picture>
        <source 
          srcSet={image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
          type="image/webp"
        />
        <img
          src={image.url}
          alt={alt || `${type} image`}
          className="w-full h-full object-cover select-none"
          draggable="false"
          loading="lazy"
          decoding="async"
        />
      </picture>
    )
  }

  // Handle missing images
  if (!beforeImage?.url && !afterImage?.url) {
    return (
      <div {...blockProps}>
        <div className="before-after-placeholder bg-gray-100 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">Add before and after images to create comparison</p>
        </div>
      </div>
    )
  }

  return (
    <section {...blockProps}>
      {/* Title and description */}
      {(title || description) && (
        <div className="before-after-content text-center mb-8">
          {title && (
            <RichText.Content
              tagName="h2"
              value={title}
              className="comparison-title text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              data-animate="title"
            />
          )}
          {description && (
            <RichText.Content
              tagName="p"
              value={description}
              className="comparison-description text-lg text-gray-600 max-w-2xl mx-auto"
              data-animate="description"
              data-animate-delay="200"
            />
          )}
        </div>
      )}

      {/* Comparison container */}
      <div 
        className="comparison-container relative max-w-4xl mx-auto bg-gray-200 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
        data-animate="comparison"
        data-animate-delay="400"
      >
        
        {/* Before image */}
        <div className="before-image absolute inset-0">
          {renderOptimizedImage(beforeImage, beforeImage?.alt || 'Before image', 'before')}
          
          {/* Before label */}
          {showLabels && beforeLabel && (
            <div className="before-label absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {beforeLabel}
            </div>
          )}
        </div>

        {/* After image (clipped) */}
        <div 
          className="after-image absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - (sliderPosition || 50)}% 0 0)` }}
        >
          {renderOptimizedImage(afterImage, afterImage?.alt || 'After image', 'after')}
          
          {/* After label */}
          {showLabels && afterLabel && (
            <div className="after-label absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {afterLabel}
            </div>
          )}
        </div>

        {/* Slider line */}
        <div 
          className="slider-line absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition || 50}%` }}
        />
        
        {/* Slider handle */}
        <div 
          className="slider-handle absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize z-20"
          style={{ left: `${sliderPosition || 50}%` }}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>

        {/* Fullscreen button */}
        {enableZoom && (
          <button 
            className="fullscreen-btn absolute bottom-4 right-4 w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="View in fullscreen"
            data-fullscreen-trigger
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        )}

        {/* Instructions */}
        <div className="instructions absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
          {enableTouch ? 'Drag or tap to compare' : 'Drag to compare'}
          {enableKeyboard && ' • Use arrow keys'}
        </div>
      </div>

      {/* Keyboard navigation hint */}
      {enableKeyboard && (
        <div className="keyboard-hint text-center mt-4 text-sm text-gray-500">
          Use ← → arrow keys to control the slider
        </div>
      )}
    </section>
  )
} 