import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator.js'
import { generateAllClasses, generateAllInlineStyles } from '../../utils/visual-controls.js'

export default function save({ attributes }) {
  const {
    features,
    gridColumns,
    mobileColumns,
    tabletColumns,
    showImages,
    showTitles,
    showDescriptions,
    showButtons,
    cardStyle,
    imageStyle,
    sectionTitle,
    sectionSubtitle,
    showSectionHeader,
    backgroundColor,
    textColor,
    settings
  } = attributes

  // Simple performance configuration
  const performanceConfig = generatePerformanceConfig('feature-grid', {
    lazyLoading: { 
      enabled: showImages,
      rootMargin: '50px' 
    },
    scrollAnimations: { 
      enabled: true,
      type: 'fadeInUp',
      duration: '0.6s'
    },
    hoverEffects: {
      enabled: true,
      enter: { transform: 'translateY(-4px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
      leave: { transform: 'translateY(0)', boxShadow: 'none' }
    },
    analytics: {
      enabled: true,
      trackViews: true,
      trackClicks: showButtons,
      viewData: { section: 'features', columns: gridColumns }
    }
  })

  // Generate visual classes and styles
  const visualClasses = settings ? generateAllClasses(settings) : ''
  const visualStyles = settings ? generateAllInlineStyles(settings) : {}

  const blockProps = useBlockProps.save({
    className: `feature-grid-block ${backgroundColor || ''} ${textColor || ''} ${visualClasses}`.trim(),
    style: visualStyles,
    ...generateDataAttributes(performanceConfig)
  })

  // Simple helper for optimized images
  const renderFeatureImage = (feature, index) => {
    if (!showImages || !feature.image?.url) return null

    const isLazy = index > 2 // Only first 3 images load immediately
    const imageStyleClasses = {
      'rounded': 'rounded-lg',
      'circle': 'rounded-full',
      'square': 'rounded-none',
      'soft': 'rounded-md'
    }[imageStyle] || 'rounded-lg'

    return (
      <div className={`feature-image-container relative overflow-hidden aspect-square ${imageStyleClasses} mb-4`}>
        <picture>
          <source 
            srcSet={isLazy ? '' : feature.image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
            type="image/webp"
            data-lazy-srcset={isLazy ? feature.image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp') : ''}
          />
          <img
            src={isLazy ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5QzlDQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPgo=' : feature.image.url}
            alt={feature.image.alt || feature.title || `Feature ${index + 1}`}
            className="feature-image w-full h-full object-cover transition-all duration-300"
            loading={isLazy ? 'lazy' : 'eager'}
            data-lazy-src={isLazy ? feature.image.url : ''}
          />
        </picture>

        {/* Icon overlay */}
        {feature.icon && (
          <div className="feature-icon absolute top-4 left-4 w-12 h-12 bg-white bg-opacity-90 rounded-lg flex items-center justify-center shadow-lg">
            {feature.icon.includes('<svg') ? (
              <div dangerouslySetInnerHTML={{ __html: feature.icon }} className="w-6 h-6" />
            ) : (
              <span className="text-2xl">{feature.icon}</span>
            )}
          </div>
        )}
      </div>
    )
  }

  // Simple feature card component
  const renderFeatureCard = (feature, index) => {
    const cardStyleClasses = {
      'elevated': 'bg-white rounded-xl shadow-lg hover:shadow-xl',
      'bordered': 'bg-white border border-gray-200 rounded-lg hover:border-gray-300',
      'minimal': 'bg-transparent',
      'filled': 'bg-gray-50 rounded-lg hover:bg-gray-100'
    }[cardStyle] || 'bg-white rounded-xl shadow-lg hover:shadow-xl'

    return (
      <div
        key={feature.id || index}
        className={`feature-card ${cardStyleClasses} p-6 transition-all duration-300 group`}
        data-animate="feature-card"
        data-animate-delay={index * 150}
        data-hover
      >
        
        {renderFeatureImage(feature, index)}

        <div className="feature-content text-center">
          
          {showTitles && feature.title && (
            <RichText.Content
              tagName="h3"
              value={feature.title}
              className="feature-title text-lg md:text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200"
            />
          )}

          {showDescriptions && feature.description && (
            <RichText.Content
              tagName="p"
              value={feature.description}
              className="feature-description text-gray-600 leading-relaxed mb-4"
            />
          )}

          {/* Feature highlights/tags */}
          {feature.highlights?.length > 0 && (
            <div className="feature-highlights flex flex-wrap gap-2 mb-4 justify-center">
              {feature.highlights.map((highlight, hlIndex) => (
                <span
                  key={hlIndex}
                  className="highlight-tag inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}

          {showButtons && feature.buttonText && (
            <a
              href={feature.buttonUrl || '#'}
              className="feature-button inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              target={feature.buttonTarget || '_self'}
              rel={feature.buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
              data-track-click="feature-cta"
              aria-label={`${feature.buttonText} - ${feature.title}`}
            >
              <span>{feature.buttonText}</span>
              {feature.buttonIcon && (
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </a>
          )}
        </div>
      </div>
    )
  }

  // Handle empty state
  if (!features?.length) {
    return (
      <div {...blockProps}>
        <div className="feature-grid-placeholder bg-gray-100 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-600">Add features to create your grid</p>
        </div>
      </div>
    )
  }

  // Generate responsive grid classes
  const getGridClasses = () => {
    const mobile = mobileColumns || 1
    const tablet = tabletColumns || 2
    const desktop = gridColumns || 3
    return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} gap-6`
  }

  return (
    <section {...blockProps}>
      {/* Section Header */}
      {showSectionHeader && (sectionTitle || sectionSubtitle) && (
        <div className="feature-grid-header text-center mb-12" data-animate="header">
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

      {/* Features Grid */}
      <div className={`features-container ${getGridClasses()}`}>
        {features.map((feature, index) => renderFeatureCard(feature, index))}
      </div>
    </section>
  )
}