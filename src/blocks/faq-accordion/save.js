import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator'

export default function save({ attributes }) {
  const {
    faqs,
    allowMultiple,
    defaultOpen,
    showSearch,
    showIcon,
    iconStyle,
    animationSpeed,
    accordionStyle,
    headerStyle,
    backgroundColor,
    textColor,
    title,
    subtitle,
    showHeader,
    settings
  } = attributes

  // FAQ accordion performance configuration
  const performanceConfig = generatePerformanceConfig('faq-accordion', {
    scrollAnimations: {
      enabled: true,
      type: 'fadeInUp',
      duration: '0.6s',
      threshold: 0.2
    },
    analytics: {
      enabled: true,
      trackViews: true,
      trackClicks: true,
      viewData: { 
        faq_count: faqs?.length || 0,
        allow_multiple: allowMultiple,
        has_search: showSearch
      }
    }
  })

  const blockProps = useBlockProps.save({
    className: `faq-accordion-block ${accordionStyle || 'bordered'} ${backgroundColor || ''} ${textColor || ''}`,
    ...generateDataAttributes(performanceConfig),
    'data-allow-multiple': allowMultiple || false,
    'data-animation-speed': animationSpeed || 300,
    'data-default-open': defaultOpen || 0
  })

  // Helper function to render FAQ icon
  const renderFaqIcon = (isOpen = false) => {
    if (!showIcon) return null

    const iconClasses = `faq-icon w-6 h-6 transition-transform duration-300 ${
      isOpen ? 'transform rotate-180' : ''
    }`

    if (iconStyle === 'plus') {
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }

    if (iconStyle === 'arrow') {
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      )
    }

    // Default chevron
    return (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  // Individual FAQ item component
  const renderFaqItem = (faq, index) => {
    const isDefaultOpen = defaultOpen === index

    const headerStyleClasses = {
      'minimal': 'p-4 hover:bg-gray-50',
      'filled': 'p-4 bg-gray-100 hover:bg-gray-200',
      'bordered': 'p-4 border-b border-gray-200 hover:bg-gray-50'
    }[headerStyle] || 'p-4 border-b border-gray-200 hover:bg-gray-50'

    return (
      <div
        key={faq.id || index}
        className={`faq-item ${accordionStyle === 'boxed' ? 'bg-white rounded-lg shadow-sm mb-4' : 'border-b border-gray-200 last:border-b-0'}`}
        data-faq-index={index}
        data-faq-id={faq.id}
        data-animate="faq-item"
        data-animate-delay={index * 100}
      >
        
        {/* FAQ Question/Header */}
        <button
          className={`faq-header w-full text-left ${headerStyleClasses} transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50`}
          aria-expanded={isDefaultOpen}
          aria-controls={`faq-content-${index}`}
          data-faq-toggle
          data-track-click="faq-toggle"
        >
          <div className="flex items-center justify-between">
            <div className="faq-question flex-1 pr-4">
              <RichText.Content
                tagName="h3"
                value={faq.question}
                className="text-lg font-semibold text-gray-900 leading-relaxed"
              />
            </div>
            {renderFaqIcon(isDefaultOpen)}
          </div>
        </button>

        {/* FAQ Answer/Content */}
        <div
          id={`faq-content-${index}`}
          className={`faq-content overflow-hidden transition-all duration-${animationSpeed || 300} ease-out ${
            isDefaultOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isDefaultOpen}
          data-faq-content
        >
          <div className="faq-answer p-4 pt-0">
            <RichText.Content
              tagName="div"
              value={faq.answer}
              className="text-gray-600 leading-relaxed prose prose-blue max-w-none"
            />
            
            {/* Optional FAQ metadata */}
            {(faq.category || faq.tags) && (
              <div className="faq-meta mt-4 pt-4 border-t border-gray-100">
                {faq.category && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mr-2">
                    {faq.category}
                  </span>
                )}
                {faq.tags?.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Handle empty FAQs
  if (!faqs?.length) {
    return (
      <div {...blockProps}>
        <div className="faq-placeholder bg-gray-100 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">Add FAQ items to create your accordion</p>
        </div>
      </div>
    )
  }

  return (
    <section {...blockProps}>
      {/* Header */}
      {showHeader && (title || subtitle) && (
        <div className="faq-header text-center mb-12" data-animate="header">
          {title && (
            <RichText.Content
              tagName="h2"
              value={title}
              className="faq-title text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            />
          )}
          {subtitle && (
            <RichText.Content
              tagName="p"
              value={subtitle}
              className="faq-subtitle text-lg text-gray-600 max-w-2xl mx-auto"
            />
          )}
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div className="faq-search mb-8" data-animate="search" data-animate-delay="200">
          <div className="relative max-w-md mx-auto">
            <input
              type="search"
              placeholder="Search FAQs..."
              className="faq-search-input w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
              data-faq-search
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Search results count */}
          <div className="search-results-count text-center mt-4 text-sm text-gray-600" data-search-count style={{ display: 'none' }}>
            <span data-results-text></span>
          </div>
        </div>
      )}

      {/* FAQ Items */}
      <div 
        className={`faq-container max-w-4xl mx-auto ${
          accordionStyle === 'boxed' ? 'space-y-4' : 'border border-gray-200 rounded-lg overflow-hidden'
        }`}
        data-animate="faq-container"
        data-animate-delay="400"
      >
        {faqs.map((faq, index) => renderFaqItem(faq, index))}
      </div>

      {/* No results message (hidden by default) */}
      {showSearch && (
        <div className="no-results text-center py-8 text-gray-500" style={{ display: 'none' }} data-no-results>
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>No FAQs found matching your search.</p>
          <button 
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            data-clear-search
          >
            Clear search
          </button>
        </div>
      )}

      {/* Keyboard navigation hint */}
      <div className="keyboard-hint text-center mt-8 text-sm text-gray-500">
        Use Tab to navigate, Enter or Space to toggle, and arrow keys to move between items
      </div>
    </section>
  )
} 