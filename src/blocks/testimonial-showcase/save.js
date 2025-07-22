import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator'

export default function save({ attributes }) {
  const {
    testimonials,
    layout,
    columns,
    showImages,
    showCompany,
    showRating,
    autoSlide,
    slideSpeed,
    sectionTitle,
    sectionSubtitle,
    showSectionHeader,
    backgroundColor,
    textColor,
    settings
  } = attributes

  // Testimonials performance configuration
  const performanceConfig = generatePerformanceConfig('testimonial-showcase', {
    lazyLoading: { 
      enabled: showImages,
      rootMargin: '100px' 
    },
    scrollAnimations: { 
      enabled: true,
      type: 'fadeInLeft',
      duration: '0.7s',
      threshold: 0.2
    },
    analytics: {
      enabled: true,
      trackViews: true,
      viewData: { section: 'testimonials', layout, columns }
    }
  })

  const blockProps = useBlockProps.save({
    className: `testimonial-showcase layout-${layout || 'grid'} ${backgroundColor || ''} ${textColor || ''}`,
    ...generateDataAttributes(performanceConfig)
  })

  // Helper for optimized avatar images
  const renderAvatar = (testimonial, index) => {
    if (!showImages || !testimonial.avatar?.url) return null

    const isLazy = index > 2 // First 3 avatars load immediately

    return (
      <div className="testimonial-avatar w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
        <picture>
          <source 
            srcSet={isLazy ? '' : testimonial.avatar.url.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
            type="image/webp"
            data-lazy-srcset={isLazy ? testimonial.avatar.url.replace(/\.(jpg|jpeg|png)$/i, '.webp') : ''}
          />
          <img
            src={isLazy ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUM5Q0EwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Mb2FkaW5nPC90ZXh0Pgo8L3N2Zz4K' : testimonial.avatar.url}
            alt={testimonial.avatar.alt || `${testimonial.name || 'Customer'} avatar`}
            className="w-full h-full object-cover"
            loading={isLazy ? 'lazy' : 'eager'}
            data-lazy-src={isLazy ? testimonial.avatar.url : ''}
          />
        </picture>
      </div>
    )
  }

  // Helper for star ratings
  const renderRating = (rating) => {
    if (!showRating || !rating) return null

    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      }
    }

    return (
      <div className="testimonial-rating flex justify-center mb-4">
        <div className="flex items-center">
          {stars}
          <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
        </div>
      </div>
    )
  }

  // Individual testimonial component
  const renderTestimonial = (testimonial, index) => (
    <div
      key={testimonial.id || index}
      className="testimonial bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl"
      data-animate="testimonial"
      data-animate-delay={index * 200}
    >
      
      {renderAvatar(testimonial, index)}

      {renderRating(testimonial.rating)}

      {testimonial.content && (
        <RichText.Content
          tagName="blockquote"
          value={testimonial.content}
          className="testimonial-content text-gray-700 text-lg leading-relaxed mb-6 italic"
        />
      )}

      <div className="testimonial-author">
        {testimonial.name && (
          <RichText.Content
            tagName="cite"
            value={testimonial.name}
            className="author-name text-gray-900 font-semibold text-base block"
          />
        )}
        
        {showCompany && testimonial.company && (
          <RichText.Content
            tagName="span"
            value={testimonial.company}
            className="author-company text-gray-600 text-sm"
          />
        )}
        
        {testimonial.position && (
          <RichText.Content
            tagName="span"
            value={testimonial.position}
            className="author-position text-blue-600 text-sm block"
          />
        )}
      </div>
    </div>
  )

  // Handle empty state
  if (!testimonials?.length) {
    return (
      <div {...blockProps}>
        <div className="testimonials-placeholder bg-gray-100 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-600">Add testimonials to showcase customer feedback</p>
        </div>
      </div>
    )
  }

  // Generate grid classes
  const getGridClasses = () => {
    if (layout === 'slider') return 'flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4'
    
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
    
    return `grid ${gridCols[columns] || gridCols[3]} gap-6`
  }

  return (
    <section {...blockProps}>
      {/* Section Header */}
      {showSectionHeader && (sectionTitle || sectionSubtitle) && (
        <div className="testimonials-header text-center mb-12" data-animate="header">
          {sectionTitle && (
            <RichText.Content
              tagName="h2"
              value={sectionTitle}
              className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            />
          )}
          {sectionSubtitle && (
            <RichText.Content
              tagName="p"
              value={sectionSubtitle}
              className="section-subtitle text-lg text-gray-600 max-w-2xl mx-auto"
            />
          )}
        </div>
      )}

      {/* Testimonials Container */}
      <div className={`testimonials-container ${getGridClasses()}`}>
        {testimonials.map((testimonial, index) => 
          layout === 'slider' ? (
            <div key={testimonial.id || index} className="testimonial-slide flex-none w-80 snap-center">
              {renderTestimonial(testimonial, index)}
            </div>
          ) : (
            renderTestimonial(testimonial, index)
          )
        )}
      </div>

      {/* Slider navigation (if slider layout) */}
      {layout === 'slider' && (
        <div className="slider-navigation flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className="nav-dot w-3 h-3 rounded-full bg-gray-300 hover:bg-blue-600 transition-colors duration-200"
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
} 