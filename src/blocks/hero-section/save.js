import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator.js'
import { generateAllClasses } from '../../utils/visual-controls.js'

export default function save({ attributes }) {
  const {
    headline,
    subheadline,
    primaryCTA,
    secondaryCTA,
    showSecondaryCTA,
    backgroundImage,
    backgroundColor,
    textColor,
    heroImage,
    layout,
    padding,
    titleFontSize,
    titleFontWeight,
    subtitleFontSize,
    titleMarginBottom,
    subtitleMarginBottom,
    contentMaxWidth,
    contentAlignment,
    contentPadding,
    buttonSpacing,
    primaryButtonStyle,
    secondaryButtonStyle,
    animationDuration,
    hoverEffects,
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
      trackClicks: !!(primaryCTA?.text || secondaryCTA?.text),
      viewData: { section: 'hero', layout }
    }
  })

  // Generate the same classes as the editor
  const allClasses = generateAllClasses(settings || {})
  
  const blockProps = useBlockProps.save({
    className: `hero-section hero-section--${layout || 'centered'} ${backgroundColor || 'bg-white'} ${textColor || 'text-gray-900'} ${allClasses}`,
    'data-classes': allClasses,
    'data-all-classes': allClasses,
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
      <div className={`hero-content relative z-10 container mx-auto ${contentPadding || 'px-4 py-24'} ${contentAlignment || 'text-center'}`}>
        
        {headline && (
          <RichText.Content
            tagName="h1"
            value={headline}
            className={`hero-title ${titleFontSize || 'text-4xl md:text-6xl'} ${titleFontWeight || 'font-bold'} ${titleMarginBottom || 'mb-6'} ${textColor || 'text-gray-900'}`}
            data-animate="title"
          />
        )}

        {subheadline && (
          <RichText.Content
            tagName="h2"
            value={subheadline}
            className={`hero-subtitle ${subtitleFontSize || 'text-xl md:text-2xl'} ${subtitleMarginBottom || 'mb-8'} ${contentMaxWidth || 'max-w-3xl'} mx-auto ${textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}
            data-animate="subtitle"
            data-animate-delay="200"
          />
        )}

        <div className={`hero-ctas ${buttonSpacing || 'space-x-4'}`}>
          {primaryCTA?.text && primaryCTA?.url && (
            <a
              href={primaryCTA.url}
              className={`hero-cta-primary inline-flex items-center ${primaryButtonStyle?.padding || 'px-8 py-4'} ${primaryButtonStyle?.backgroundColor || 'bg-blue-600'} ${primaryButtonStyle?.hoverBackgroundColor || 'hover:bg-blue-700'} ${primaryButtonStyle?.textColor || 'text-white'} ${primaryButtonStyle?.fontSize || 'text-lg'} ${primaryButtonStyle?.fontWeight || 'font-semibold'} ${primaryButtonStyle?.borderRadius || 'rounded-lg'} transition-all ${animationDuration || 'duration-200'} ${hoverEffects ? 'hover:scale-105' : ''} focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50`}
              data-animate="cta"
              data-animate-delay="400"
              data-track-click="primary-cta"
            >
              <span>{primaryCTA.text}</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}

          {showSecondaryCTA && secondaryCTA?.text && secondaryCTA?.url && (
            <a
              href={secondaryCTA.url}
              className={`hero-cta-secondary inline-flex items-center ${secondaryButtonStyle?.padding || 'px-8 py-4'} ${secondaryButtonStyle?.backgroundColor || 'bg-transparent'} ${secondaryButtonStyle?.borderStyle || 'border border-gray-300'} ${secondaryButtonStyle?.hoverBackgroundColor || 'hover:bg-gray-50'} ${secondaryButtonStyle?.textColor || 'text-gray-700'} ${secondaryButtonStyle?.fontSize || 'text-lg'} ${secondaryButtonStyle?.fontWeight || 'font-semibold'} ${secondaryButtonStyle?.borderRadius || 'rounded-lg'} transition-all ${animationDuration || 'duration-200'} focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50`}
              data-animate="cta"
              data-animate-delay="500"
              data-track-click="secondary-cta"
            >
              <span>{secondaryCTA.text}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}