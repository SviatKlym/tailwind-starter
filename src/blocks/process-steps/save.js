import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator.js'

export default function save({ attributes }) {
  const {
    steps,
    layout,
    orientation,
    showNumbers,
    showIcons,
    showConnectors,
    numberStyle,
    iconStyle,
    sectionTitle,
    sectionSubtitle,
    showSectionHeader,
    enableProgressBar,
    enableClickable,
    backgroundColor,
    textColor,
    settings
  } = attributes

  // Process steps performance configuration
  const performanceConfig = generatePerformanceConfig('process-steps', {
    scrollAnimations: {
      enabled: true,
      type: 'fadeInUp',
      duration: '0.6s',
      threshold: 0.3
    },
    analytics: {
      enabled: true,
      trackViews: true,
      trackClicks: enableClickable,
      viewData: { section: 'process', layout, stepCount: steps?.length || 0 }
    }
  })

  const blockProps = useBlockProps.save({
    className: `process-steps-block layout-${layout || 'vertical'} orientation-${orientation || 'left'} ${backgroundColor || ''} ${textColor || ''}`,
    ...generateDataAttributes(performanceConfig)
  })

  // Helper function to render step number
  const renderStepNumber = (step, index) => {
    if (!showNumbers) return null

    const numberClasses = `step-number inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
      numberStyle === 'filled' ? 'bg-blue-600 text-white' :
      numberStyle === 'outlined' ? 'border-2 border-blue-600 text-blue-600 bg-white' :
      numberStyle === 'minimal' ? 'bg-gray-100 text-gray-700' :
      'bg-blue-600 text-white'
    }`

    return (
      <div className={`step-number-container flex-shrink-0 ${layout === 'horizontal' ? 'mb-4' : 'mr-6'}`}>
        <div 
          className={numberClasses}
          data-step-number={index + 1}
        >
          {step.customNumber || (index + 1)}
        </div>
      </div>
    )
  }

  // Helper function to render step icon
  const renderStepIcon = (step, index) => {
    if (!showIcons || !step.icon) return null

    const iconClasses = `step-icon inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
      iconStyle === 'filled' ? 'bg-blue-100 text-blue-600' :
      iconStyle === 'outlined' ? 'border-2 border-blue-600 text-blue-600 bg-white' :
      iconStyle === 'minimal' ? 'text-blue-600' :
      'bg-blue-100 text-blue-600'
    }`

    return (
      <div className={`step-icon-container flex-shrink-0 ${layout === 'horizontal' ? 'mb-4' : 'mr-6'}`}>
        <div className={iconClasses}>
          {step.icon.includes('<svg') ? (
            <div dangerouslySetInnerHTML={{ __html: step.icon }} />
          ) : (
            <span className="text-2xl">{step.icon}</span>
          )}
        </div>
      </div>
    )
  }

  // Helper function to render connector line
  const renderConnector = (index, isLast) => {
    if (!showConnectors || isLast) return null

    return (
      <div className={`step-connector ${
        layout === 'horizontal' 
          ? 'absolute left-1/2 transform -translate-x-1/2 w-0.5 h-8 top-full bg-blue-300' 
          : 'absolute top-1/2 transform -translate-y-1/2 h-0.5 w-8 left-full bg-blue-300'
      }`} />
    )
  }

  // Helper function to render individual step
  const renderStep = (step, index) => {
    const isLast = index === (steps?.length || 0) - 1

    return (
      <div
        key={step.id || index}
        className={`process-step relative ${
          layout === 'horizontal' 
            ? 'flex-1 text-center' 
            : 'flex items-start mb-8 last:mb-0'
        } ${enableClickable ? 'cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors' : ''}`}
        data-step-index={index}
        data-animate="step"
        data-animate-delay={index * 150}
        {...(enableClickable && { 'data-track-click': 'process-step' })}
      >
        
        {/* Step visual element (number or icon) */}
        <div className={`step-visual-container ${layout === 'horizontal' ? 'mb-4' : 'flex-shrink-0'}`}>
          {showNumbers && renderStepNumber(step, index)}
          {showIcons && renderStepIcon(step, index)}
          {renderConnector(index, isLast)}
        </div>

        {/* Step content */}
        <div className={`step-content ${layout === 'horizontal' ? 'w-full' : 'flex-1'}`}>
          
          {/* Step title */}
          {step.title && (
            <RichText.Content
              tagName="h3"
              value={step.title}
              className="step-title text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-tight"
            />
          )}

          {/* Step subtitle */}
          {step.subtitle && (
            <RichText.Content
              tagName="h4"
              value={step.subtitle}
              className="step-subtitle text-base font-medium text-blue-600 mb-2"
            />
          )}

          {/* Step description */}
          {step.description && (
            <RichText.Content
              tagName="p"
              value={step.description}
              className="step-description text-gray-600 leading-relaxed mb-4"
            />
          )}

          {/* Step action button */}
          {step.buttonText && step.buttonUrl && (
            <a
              href={step.buttonUrl}
              className="step-button inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              target={step.buttonTarget || '_self'}
              rel={step.buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
              data-track-click="step-cta"
            >
              <span>{step.buttonText}</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}

          {/* Step metadata (duration, difficulty, etc.) */}
          {(step.duration || step.difficulty) && (
            <div className="step-metadata flex flex-wrap gap-3 mt-4 text-sm text-gray-500">
              {step.duration && (
                <div className="metadata-item flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{step.duration}</span>
                </div>
              )}
              {step.difficulty && (
                <div className="metadata-item flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>{step.difficulty}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Handle empty steps
  if (!steps?.length) {
    return (
      <div {...blockProps}>
        <div className="process-steps-placeholder bg-gray-100 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="text-gray-600">Add process steps to create your workflow</p>
        </div>
      </div>
    )
  }

  return (
    <section {...blockProps}>
      {/* Section Header */}
      {showSectionHeader && (sectionTitle || sectionSubtitle) && (
        <div className="process-steps-header text-center mb-12" data-animate="header">
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

      {/* Progress Bar */}
      {enableProgressBar && (
        <div className="progress-bar-container mb-8">
          <div className="progress-track w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="progress-fill h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out" style={{ width: '0%' }} />
          </div>
        </div>
      )}

      {/* Process Steps Container */}
      <div className={`process-steps-container ${
        layout === 'horizontal' 
          ? 'flex flex-col md:flex-row gap-8 items-start' 
          : 'flex flex-col space-y-8'
      }`}>
        {steps.map((step, index) => renderStep(step, index))}
      </div>
    </section>
  )
} 