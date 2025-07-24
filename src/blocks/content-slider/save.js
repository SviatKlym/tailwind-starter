import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator.js'
import { generateAllClasses, generateAllInlineStyles } from '../../utils/visual-controls.js'

export default function save({ attributes }) {
  const {
    slides,
    autoplay,
    autoplayDelay,
    showNavigation,
    showPagination,
    showScrollbar,
    loop,
    slidesPerView,
    spaceBetween,
    effect,
    speed,
    pauseOnHover,
    centeredSlides,
    freeMode,
    sliderHeight,
    navigationStyle,
    paginationStyle,
    sectionTitle,
    sectionSubtitle,
    showSectionHeader,
    enableLazyLoading,
    backgroundColor,
    settings
  } = attributes

  // Content slider performance configuration
  const performanceConfig = generatePerformanceConfig('content-slider', {
    lazyLoading: { 
      enabled: enableLazyLoading !== false,
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
        slide_count: slides?.length || 0,
        autoplay,
        slides_per_view: slidesPerView || 1
      }
    }
  })

  // Generate visual classes and styles
  const visualClasses = settings ? generateAllClasses(settings) : ''
  const visualStyles = settings ? generateAllInlineStyles(settings) : {}

  const blockProps = useBlockProps.save({
    className: `content-slider-block ${backgroundColor || ''} ${visualClasses}`.trim(),
    style: visualStyles,
    ...generateDataAttributes(performanceConfig),
    'data-autoplay': autoplay || false,
    'data-autoplay-delay': autoplayDelay || 5000,
    'data-show-navigation': showNavigation || true,
    'data-show-pagination': showPagination || true,
    'data-show-scrollbar': showScrollbar || false,
    'data-loop': loop !== false,
    'data-slides-per-view': slidesPerView || 1,
    'data-space-between': spaceBetween || 30,
    'data-effect': effect || 'slide',
    'data-speed': speed || 600,
    'data-pause-on-hover': pauseOnHover !== false,
    'data-centered-slides': centeredSlides || false,
    'data-free-mode': freeMode || false,
    'data-slider-height': sliderHeight || 'auto',
    'data-navigation-style': navigationStyle || 'arrows',
    'data-pagination-style': paginationStyle || 'bullets'
  })

  // Helper function for optimized slide images
  const renderSlideImage = (slide, index) => {
    if (!slide.image?.url) return null

    const isLazy = enableLazyLoading !== false && index > 1 // First 2 slides load immediately

    return (
      <div className="slide-image-container relative overflow-hidden rounded-lg mb-4">
        <picture>
          <source 
            srcSet={isLazy ? '' : slide.image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
            type="image/webp"
            data-lazy-srcset={isLazy ? slide.image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp') : ''}
          />
          <img
            src={isLazy ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5QzlDQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPgo=' : slide.image.url}
            alt={slide.image.alt || slide.title || `Slide ${index + 1}`}
            className="slide-image w-full h-64 object-cover transition-all duration-300"
            loading={isLazy ? 'lazy' : index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            data-lazy-src={isLazy ? slide.image.url : ''}
            data-slide-index={index}
          />
        </picture>
      </div>
    )
  }

  // Individual slide component
  const renderSlide = (slide, index) => (
    <div
      key={slide.id || index}
      className="slider-slide bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
      data-slide-index={index}
      data-slide-id={slide.id}
    >
      
      {/* Slide image */}
      {renderSlideImage(slide, index)}

      {/* Slide content */}
      <div className="slide-content p-6">
        
        {/* Slide category/tag */}
        {slide.category && (
          <span className="slide-category inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
            {slide.category}
          </span>
        )}

        {/* Slide title */}
        {slide.title && (
          <RichText.Content
            tagName="h3"
            value={slide.title}
            className="slide-title text-xl font-semibold text-gray-900 mb-3 leading-tight"
          />
        )}

        {/* Slide excerpt */}
        {slide.excerpt && (
          <RichText.Content
            tagName="p"
            value={slide.excerpt}
            className="slide-excerpt text-gray-600 leading-relaxed mb-4"
          />
        )}

        {/* Slide metadata */}
        {(slide.author || slide.date) && (
          <div className="slide-meta flex items-center text-sm text-gray-500 mb-4">
            {slide.author && (
              <span className="slide-author">By {slide.author}</span>
            )}
            {slide.author && slide.date && (
              <span className="mx-2">•</span>
            )}
            {slide.date && (
              <span className="slide-date">{slide.date}</span>
            )}
          </div>
        )}

        {/* Slide button */}
        {slide.buttonText && slide.buttonUrl && (
          <a
            href={slide.buttonUrl}
            className="slide-button inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            target={slide.buttonTarget || '_self'}
            rel={slide.buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
            data-track-click="slide-cta"
          >
            <span>{slide.buttonText}</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )

  // Handle empty slides
  if (!slides?.length) {
    return (
      <div {...blockProps}>
        <div className="content-slider-placeholder bg-gray-100 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-600">Add slides to create your content slider</p>
        </div>
      </div>
    )
  }

  return (
    <section {...blockProps}>
      {/* Header */}
      {showSectionHeader && (sectionTitle || sectionSubtitle) && (
        <div className="slider-header text-center mb-12" data-animate="header">
          {sectionTitle && (
            <h2 className="slider-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {sectionTitle}
            </h2>
          )}
          {sectionSubtitle && (
            <p className="slider-subtitle text-lg text-gray-600 max-w-2xl mx-auto">
              {sectionSubtitle}
            </p>
          )}
        </div>
      )}

      {/* Slider container */}
      <div className="slider-container relative" data-animate="slider" data-animate-delay="200">
        
        {/* Swiper container */}
        <div className="swiper">
          <div className="swiper-wrapper">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className="swiper-slide"
              >
                {renderSlide(slide, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {showNavigation && slides.length > (slidesPerView || 1) && (
          <>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </>
        )}
        
        {/* Pagination */}
        {showPagination && (
          <div className="swiper-pagination"></div>
        )}
        
        {/* Scrollbar */}
        {showScrollbar && (
          <div className="swiper-scrollbar"></div>
        )}
      </div>
    </section>
  )
} 