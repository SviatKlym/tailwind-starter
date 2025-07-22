import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator'

export default function save({ attributes }) {
  const {
    title,
    subtitle,
    description,
    ctaText,
    ctaUrl,
    secondaryCtaText,
    secondaryCtaUrl,
    backgroundImage,
    backgroundColor,
    textColor,
    layout,
    urgencyText,
    showCountdown,
    countdownDate,
    socialProofText,
    testimonialText,
    testimonialAuthor,
    trustBadges,
    settings
  } = attributes

  // Enhanced CTA performance configuration
  const performanceConfig = generatePerformanceConfig('cta-section', {
    scrollAnimations: {
      enabled: true,
      type: 'zoomIn',
      duration: '0.8s',
      threshold: 0.5
    },
    analytics: {
      enabled: true,
      trackViews: true,
      trackClicks: true,
      viewData: { section: 'cta', layout },
      clickData: { conversion_point: true }
    },
    // Add countdown timer if enabled
    countdownTimer: showCountdown ? {
      enabled: true,
      targetDate: countdownDate,
      expiredText: 'Limited time offer has ended!'
    } : { enabled: false }
  })

  const blockProps = useBlockProps.save({
    className: `cta-section layout-${layout || 'centered'} ${backgroundColor || 'bg-blue-600'} ${textColor || 'text-white'}`,
    ...generateDataAttributes(performanceConfig)
  })

  // Helper for optimized background
  const renderBackground = () => {
    if (!backgroundImage?.url) return null

    return (
      <div className="cta-background absolute inset-0 overflow-hidden">
        <picture>
          <source 
            srcSet={backgroundImage.url.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
            type="image/webp"
          />
          <img
            src={backgroundImage.url}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
    )
  }

  return (
    <section {...blockProps}>
      {/* Background */}
      {renderBackground()}

      {/* Content */}
      <div className="cta-content relative z-10 container mx-auto px-4 py-16 text-center">
        
        {/* Urgency message */}
        {urgencyText && (
          <div className="urgency-message mb-4">
            <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full animate-pulse">
              ⚡ {urgencyText}
            </span>
          </div>
        )}

        {/* Countdown timer */}
        {showCountdown && countdownDate && (
          <div className="countdown-timer mb-6">
            <div 
              className="text-2xl font-bold text-yellow-300"
              data-countdown={countdownDate}
            >
              Loading countdown...
            </div>
          </div>
        )}

        {/* Main content */}
        {title && (
          <RichText.Content
            tagName="h2"
            value={title}
            className="cta-title text-3xl md:text-5xl font-bold mb-4"
            data-animate="title"
          />
        )}

        {subtitle && (
          <RichText.Content
            tagName="h3"
            value={subtitle}
            className="cta-subtitle text-xl md:text-2xl font-medium mb-4 text-blue-100"
            data-animate="subtitle"
            data-animate-delay="200"
          />
        )}

        {description && (
          <RichText.Content
            tagName="p"
            value={description}
            className="cta-description text-lg mb-8 max-w-2xl mx-auto text-blue-50"
            data-animate="description"
            data-animate-delay="400"
          />
        )}

        {/* CTA Buttons */}
        <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-8" data-animate="buttons" data-animate-delay="600">
          
          {ctaText && ctaUrl && (
            <a
              href={ctaUrl}
              className="primary-cta inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
              data-track-click="primary-cta"
            >
              <span>{ctaText}</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}

          {secondaryCtaText && secondaryCtaUrl && (
            <a
              href={secondaryCtaUrl}
              className="secondary-cta inline-flex items-center px-6 py-3 border-2 border-white text-white text-lg font-semibold rounded-lg transition-all duration-200 hover:bg-white hover:text-blue-600"
              data-track-click="secondary-cta"
            >
              <span>{secondaryCtaText}</span>
            </a>
          )}
        </div>

        {/* Social proof */}
        {socialProofText && (
          <div className="social-proof mb-6" data-animate="social-proof" data-animate-delay="800">
            <p className="text-blue-100 text-sm">{socialProofText}</p>
          </div>
        )}

        {/* Testimonial */}
        {testimonialText && (
          <div className="testimonial mb-8 max-w-md mx-auto" data-animate="testimonial" data-animate-delay="1000">
            <blockquote className="text-blue-50 italic mb-2">
              "{testimonialText}"
            </blockquote>
            {testimonialAuthor && (
              <cite className="text-blue-200 text-sm font-medium">— {testimonialAuthor}</cite>
            )}
          </div>
        )}

        {/* Trust badges */}
        {trustBadges?.length > 0 && (
          <div className="trust-badges flex flex-wrap justify-center items-center gap-6 opacity-70" data-animate="trust-badges" data-animate-delay="1200">
            {trustBadges.map((badge, index) => (
              <div key={index} className="trust-badge">
                {badge.image?.url ? (
                  <img 
                    src={badge.image.url} 
                    alt={badge.text || `Trust badge ${index + 1}`}
                    className="h-8 w-auto filter brightness-0 invert"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-blue-200 text-sm font-medium">{badge.text}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Risk reduction */}
        <div className="risk-reduction mt-8" data-animate="risk-reduction" data-animate-delay="1400">
          <div className="flex flex-wrap justify-center items-center gap-6 text-blue-200 text-sm">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              30-day money back guarantee
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Instant access
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}