import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generateAllClasses, generateAllInlineStyles } from '../../utils/visual-controls.js'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator.js'

export default function Save({ attributes }) {
  const {
    layout,
    headline,
    subheadline,
    description,
    primaryCTA,
    secondaryCTA,
    showSecondaryCTA,
    backgroundImage,
    backgroundColor,
    textColor,
    ctaAlignment,
    urgencyText,
    showUrgency,
    trustSignals,
    showTrustSignals,
    videoUrl,
    showVideo,
    visualSettings
  } = attributes

  // Generate optimized classes for all devices
  const visualClasses = visualSettings ? generateAllClasses(visualSettings) : ''
  const visualStyles = visualSettings ? generateAllInlineStyles(visualSettings) : {}

  // Generate performance configuration for the block
  const performanceConfig = generatePerformanceConfig('hero-section', {
    analytics: {
      enabled: true,
      trackViews: true,
      trackClicks: true,
      viewData: { section: 'hero-cta', layout },
      clickData: { conversion_point: true }
    }
  })
  const performanceAttrs = generateDataAttributes(performanceConfig)

  const blockProps = useBlockProps.save({
    className: `hero-with-cta hero-with-cta--${layout} ${backgroundColor} ${textColor} ${visualClasses}`.trim(),
    style: visualStyles,
    'data-conversion-tracking': 'enabled',
    ...performanceAttrs
  })

  // Helper function to generate optimized image URLs
  const getOptimizedImageUrl = (image, width = 1920, quality = 85) => {
    if (!image?.url) return ''
    
    if (image.url.includes('/wp-content/uploads/')) {
      const baseUrl = image.url.split('?')[0]
      return `${baseUrl}?w=${width}&h=${Math.round(width / 1.77)}&q=${quality}&f=auto`
    }
    
    return image.url
  }

  // Helper function to generate WebP URLs
  const getWebPUrl = (image) => {
    if (!image?.url) return ''
    return image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  }

  // Helper for urgency/scarcity messaging
  const renderUrgencyMessage = () => {
    if (!showUrgency || !urgencyText) return null

    return (
      <div className="urgency-message bg-red-50 border border-red-200 rounded-lg p-3 mb-6 opacity-0" data-animate="urgency">
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-red-700 font-medium text-sm">{urgencyText}</span>
        </div>
      </div>
    )
  }

  // Helper for trust signals
  const renderTrustSignals = () => {
    if (!showTrustSignals || !trustSignals?.length) return null

    return (
      <div className="trust-signals mt-8 opacity-0" data-animate="trust-signals">
        <div className="flex flex-wrap justify-center items-center gap-6">
          {trustSignals.map((signal, index) => (
            <div key={signal.id || index} className="trust-signal flex items-center space-x-2">
              {signal.icon && (
                <div className="trust-icon text-green-500 text-lg">
                  {signal.icon}
                </div>
              )}
              <span className="text-sm text-gray-600 font-medium">
                {signal.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Optimized background rendering
  const renderOptimizedBackground = () => {
    if (!backgroundImage?.url) return null

    return (
      <div className="hero-background absolute inset-0 overflow-hidden">
        <picture>
          <source 
            srcSet={`${getWebPUrl(backgroundImage)} 1920w, ${getOptimizedImageUrl(backgroundImage, 1024).replace(/\.(jpg|jpeg|png)/gi, '.webp')} 1024w`}
            sizes="100vw"
            type="image/webp"
          />
          <img
            src={getOptimizedImageUrl(backgroundImage)}
            srcSet={`${getOptimizedImageUrl(backgroundImage)} 1920w, ${getOptimizedImageUrl(backgroundImage, 1024)} 1024w`}
            sizes="100vw"
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            onLoad="this.closest('.hero-background').classList.add('loaded')"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      </div>
    )
  }

  // Optimized video background
  const renderVideoBackground = () => {
    if (!showVideo || !videoUrl) return null

    return (
      <div className="video-background absolute inset-0 overflow-hidden">
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
          preload="metadata"
          poster={backgroundImage?.url}
        >
          <source src={videoUrl} type="video/mp4" />
          {/* Fallback to background image */}
          {backgroundImage?.url && (
            <img src={getOptimizedImageUrl(backgroundImage)} alt="" className="w-full h-full object-cover" />
          )}
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20"></div>
      </div>
    )
  }

  // High-performance CTA button with conversion tracking
  const renderOptimizedCTA = (cta, isPrimary = true, additionalClasses = '') => {
    if (!cta?.text) return null

    const buttonId = `cta-${isPrimary ? 'primary' : 'secondary'}-${Date.now()}`
    const baseClasses = isPrimary 
      ? 'btn-primary bg-blue-600 hover:bg-blue-700'
      : 'btn-secondary bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300'

    return (
      <a
        id={buttonId}
        href={cta.url || '#'}
        className={`btn btn-lg ${baseClasses} ${additionalClasses} inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl`}
        role="button"
        data-cta-type={isPrimary ? 'primary' : 'secondary'}
        data-cta-text={cta.text}
        data-conversion-target="true"
        aria-label={`${cta.text} - ${cta.description || 'Call to action'}`}
        onClick={`trackCTAClick('${buttonId}', '${isPrimary ? 'primary' : 'secondary'}', '${cta.text}')`}
      >
        <span className="cta-text">{cta.text}</span>
        {isPrimary && (
          <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </a>
    )
  }

  const renderCenteredLayout = () => (
    <div className="relative flex items-center justify-center hero-content">
      {showVideo ? renderVideoBackground() : renderOptimizedBackground()}
      
      <div className="relative container mx-auto px-4 text-center z-10 max-w-4xl">
        {/* Headline */}
        <RichText.Content
          tagName="h1"
          value={headline}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight opacity-0"
          data-animate="headline"
        />
        
        {/* Subheadline */}
        <RichText.Content
          tagName="p"
          value={subheadline}
          className="text-xl sm:text-2xl mb-8 leading-relaxed opacity-0"
          data-animate="subheadline"
        />
        
        {/* Description */}
        {description && (
          <RichText.Content
            tagName="p"
            value={description}
            className="text-lg mb-8 max-w-2xl mx-auto opacity-0"
            data-animate="description"
          />
        )}
        
        {/* Urgency Message */}
        {renderUrgencyMessage()}
        
        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 ${ctaAlignment === 'center' ? 'justify-center' : ctaAlignment === 'left' ? 'justify-start' : 'justify-end'} items-center opacity-0`} data-animate="cta-buttons">
          {renderOptimizedCTA(primaryCTA, true, 'min-w-[220px] text-lg')}
          
          {showSecondaryCTA && renderOptimizedCTA(secondaryCTA, false, 'min-w-[200px]')}
        </div>
        
        {/* Trust Signals */}
        {renderTrustSignals()}
      </div>
    </div>
  )

  const renderSplitLayout = () => (
    <div className="relative min-h-screen hero-content">
      {showVideo ? renderVideoBackground() : renderOptimizedBackground()}
      
      <div className="relative container mx-auto px-4 z-10 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Content Column */}
          <div className="">
            <RichText.Content
              tagName="h1"
              value={headline}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight opacity-0"
              data-animate="headline"
            />
            
            <RichText.Content
              tagName="p"
              value={subheadline}
              className="text-xl text-gray-100 mb-6 leading-relaxed opacity-0"
              data-animate="subheadline"
            />
            
            {description && (
              <RichText.Content
                tagName="p"
                value={description}
                className="text-lg text-gray-200 mb-8 opacity-0"
                data-animate="description"
              />
            )}
            
            {renderUrgencyMessage()}
            
            <div className="flex flex-col sm:flex-row gap-4 opacity-0" data-animate="cta-buttons">
              {renderOptimizedCTA(primaryCTA, true, 'min-w-[200px]')}
              {showSecondaryCTA && renderOptimizedCTA(secondaryCTA, false)}
            </div>
            
            {renderTrustSignals()}
          </div>
          
          {/* Visual/Form Column */}
          <div className="lg:pl-8 opacity-0" data-animate="visual-content">
            {/* This could contain a form, image, or other visual element */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold  mb-4">Ready to Get Started?</h3>
              <p className=" mb-6">Join thousands of satisfied customers today.</p>
              
              {/* Quick action form */}
              <div className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
                  data-conversion-field="email"
                />
                {renderOptimizedCTA(
                  { text: 'Start Free Trial', url: primaryCTA?.url || '#' }, 
                  true, 
                  'w-full justify-center'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLayoutContent = () => {
    switch (layout) {
      case 'split-with-form':
        return renderSplitLayout()
      default:
        return renderCenteredLayout()
    }
  }

  return (
    <section {...blockProps}>
      {renderLayoutContent()}
      
      {/* High-Performance Conversion Tracking & Animation Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const hero = document.currentScript.parentElement;
            
            // Conversion tracking function
            window.trackCTAClick = function(buttonId, type, text) {
              // Analytics tracking
              if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                  'cta_type': type,
                  'cta_text': text,
                  'button_id': buttonId,
                  'event_category': 'conversion',
                  'value': type === 'primary' ? 100 : 50
                });
              }
              
              // Custom conversion tracking
              if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', { content_name: text });
              }
              
              // Heatmap tracking
              if (typeof hotjar !== 'undefined') {
                hotjar.event('cta_click_' + type);
              }
              
              // Custom event dispatch for A/B testing
              hero.dispatchEvent(new CustomEvent('cta-clicked', {
                detail: { type, text, buttonId },
                bubbles: true
              }));
            };
            
            // High-performance intersection observer for animations
            const observerOptions = {
              threshold: 0.15,
              rootMargin: '0px 0px -100px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const elements = entry.target.querySelectorAll('[data-animate]');
                  elements.forEach((el, index) => {
                    // Staggered animation with performance optimization
                    requestAnimationFrame(() => {
                      setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0) scale(1)';
                        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                      }, index * 200);
                    });
                  });
                  observer.unobserve(entry.target);
                }
              });
            }, observerOptions);
            
            observer.observe(hero);
            
            // Preload critical CTA resources
            const primaryCTA = hero.querySelector('[data-cta-type="primary"]');
            if (primaryCTA && primaryCTA.href && primaryCTA.href !== '#') {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = primaryCTA.href;
              document.head.appendChild(link);
            }
            
            // A/B testing framework hook
            if (typeof window.optimizelyEdge !== 'undefined') {
              window.optimizelyEdge.push({
                type: 'event',
                eventName: 'hero_cta_viewed'
              });
            }
            
            // Conversion rate optimization - button hover tracking
            const ctaButtons = hero.querySelectorAll('[data-conversion-target]');
            ctaButtons.forEach(btn => {
              btn.addEventListener('mouseenter', () => {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'cta_hover', {
                    'cta_type': btn.dataset.ctaType,
                    'event_category': 'engagement'
                  });
                }
              });
            });
            
            // Enhanced focus management for accessibility
            const focusableElements = hero.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            }
            
          })();
        `
      }} />
    </section>
  )
}

