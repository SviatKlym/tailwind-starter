import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator'

export default function save({ attributes }) {
  const {
    slides,
    autoplay,
    autoplaySpeed,
    slidesPerView,
    slidesPerGroup,
    spaceBetween,
    infinite,
    showNavigation,
    showPagination,
    enableLazyLoading,
    enableTouchGestures,
    enableKeyboard,
    fadeTransition,
    pauseOnHover,
    adaptiveHeight,
    centeredSlides,
    title,
    subtitle,
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

  const blockProps = useBlockProps.save({
    className: `content-slider-block ${backgroundColor || ''}`,
    ...generateDataAttributes(performanceConfig),
    'data-autoplay': autoplay || false,
    'data-autoplay-speed': autoplaySpeed || 3000,
    'data-slides-per-view': slidesPerView || 1,
    'data-slides-per-group': slidesPerGroup || 1,
    'data-space-between': spaceBetween || 0,
    'data-infinite': infinite !== false,
    'data-fade-transition': fadeTransition || false,
    'data-pause-on-hover': pauseOnHover !== false,
    'data-adaptive-height': adaptiveHeight || false,
    'data-centered-slides': centeredSlides || false,
    'data-enable-touch': enableTouchGestures !== false,
    'data-enable-keyboard': enableKeyboard !== false
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
      {(title || subtitle) && (
        <div className="slider-header text-center mb-12" data-animate="header">
          {title && (
            <RichText.Content
              tagName="h2"
              value={title}
              className="slider-title text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            />
          )}
          {subtitle && (
            <RichText.Content
              tagName="p"
              value={subtitle}
              className="slider-subtitle text-lg text-gray-600 max-w-2xl mx-auto"
            />
          )}
        </div>
      )}

      {/* Slider container */}
      <div className="slider-container relative" data-animate="slider" data-animate-delay="200">
        
        {/* Slides wrapper */}
        <div 
          className="slider-wrapper relative overflow-hidden"
          data-slider-track
        >
          <div className="slider-track flex transition-transform duration-300 ease-out">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className={`slide-wrapper flex-shrink-0 ${
                  slidesPerView === 1 ? 'w-full' :
                  slidesPerView === 2 ? 'w-1/2' :
                  slidesPerView === 3 ? 'w-1/3' :
                  slidesPerView === 4 ? 'w-1/4' :
                  'w-full'
                }`}
                style={{ paddingRight: spaceBetween ? `${spaceBetween}px` : undefined }}
              >
                {renderSlide(slide, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {showNavigation && slides.length > (slidesPerView || 1) && (
          <>
            <button 
              className="slider-prev absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 z-10"
              aria-label="Previous slide"
              data-slider-prev
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="slider-next absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 z-10"
              aria-label="Next slide"
              data-slider-next
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Pagination dots */}
      {showPagination && slides.length > 1 && (
        <div className="slider-pagination flex justify-center mt-8 gap-2" data-slider-pagination>
          {slides.map((_, index) => (
            <button
              key={index}
              className="pagination-dot w-3 h-3 rounded-full bg-gray-300 hover:bg-blue-600 transition-colors duration-200"
              aria-label={`Go to slide ${index + 1}`}
              data-slide-index={index}
            />
          ))}
        </div>
      )}

      {/* Progress bar (for autoplay) */}
      {autoplay && (
        <div className="slider-progress mt-4">
          <div className="progress-track w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="progress-fill h-full bg-blue-600 rounded-full transition-all ease-linear"
              data-slider-progress
            />
          </div>
        </div>
      )}
    </section>
  )
} 