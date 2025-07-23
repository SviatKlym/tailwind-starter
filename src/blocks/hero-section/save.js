import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator.js'

export default function save({ attributes }) {
  const {
    title,
    subtitle,
    description,
    backgroundImage,
    ctaText,
    ctaUrl,
    layout,
    alignment,
    overlayOpacity,
    textColor,
    settings
  } = attributes

  // Generate performance config with simple options
  const performanceConfig = generatePerformanceConfig('hero-section', {
    lazyLoading: { 
      enabled: !!backgroundImage?.url,
      rootMargin: '100px' 
    },
    scrollAnimations: { 
      enabled: true,
      type: 'fadeInUp',
      duration: '0.8s'
    },
    analytics: {
      enabled: true,
      trackViews: true,
      trackClicks: !!ctaText,
      viewData: { section: 'hero', layout }
    }
  })

  const blockProps = useBlockProps.save({
    className: `hero-section layout-${layout || 'centered'} align-${alignment || 'center'}`,
    ...generateDataAttributes(performanceConfig)
  })

  // Helper function for optimized images (reusable utility)
  const renderOptimizedImage = (image, alt = '') => {
    if (!image?.url) return null

    const isLazy = true // Let the framework handle lazy loading logic
    
    return (
      <picture>
        <source 
          srcSet={isLazy ? '' : image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
          type="image/webp"
          data-lazy-srcset={isLazy ? image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp') : ''}
        />
        <img
          src={isLazy ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5QzlDQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPgo=' : image.url}
          alt={alt}
          className="hero-background-image w-full h-full object-cover"
          data-lazy-src={isLazy ? image.url : ''}
        />
      </picture>
    )
  }

  return (
    <section {...blockProps}>
      {/* Background */}
      {backgroundImage?.url && (
        <div className="hero-background absolute inset-0 overflow-hidden">
          {renderOptimizedImage(backgroundImage, '')}
          {overlayOpacity && (
            <div 
              className="hero-overlay absolute inset-0 bg-black" 
              style={{ opacity: overlayOpacity / 100 }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className={`hero-content relative z-10 container mx-auto px-4 py-24 ${
        alignment === 'left' ? 'text-left' : 
        alignment === 'right' ? 'text-right' : 
        'text-center'
      }`}>
        
        {title && (
          <RichText.Content
            tagName="h1"
            value={title}
            className={`hero-title text-4xl md:text-6xl font-bold mb-6 ${textColor || 'text-white'}`}
            data-animate="title"
          />
        )}

        {subtitle && (
          <RichText.Content
            tagName="h2"
            value={subtitle}
            className={`hero-subtitle text-xl md:text-2xl mb-4 ${textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}
            data-animate="subtitle"
            data-animate-delay="200"
          />
        )}

        {description && (
          <RichText.Content
            tagName="p"
            value={description}
            className={`hero-description text-lg mb-8 max-w-2xl ${
              alignment === 'center' ? 'mx-auto' : ''
            } ${textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'}`}
            data-animate="description"
            data-animate-delay="400"
          />
        )}

        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            className="hero-cta inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            data-animate="cta"
            data-animate-delay="600"
            data-track-click="cta"
          >
            <span>{ctaText}</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        )}
      </div>
    </section>
  )
}