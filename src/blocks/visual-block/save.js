import { useBlockProps } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator'

export default function save({ attributes }) {
  const {
    content,
    layout,
    backgroundColor,
    textColor,
    borderRadius,
    padding,
    margin,
    boxShadow,
    backgroundImage,
    overlayOpacity,
    customCSS,
    enableAnimations,
    animationType,
    enableHover,
    hoverEffect,
    settings
  } = attributes

  // Visual block performance configuration
  const performanceConfig = generatePerformanceConfig('visual-block', {
    scrollAnimations: {
      enabled: enableAnimations !== false,
      type: animationType || 'fadeInUp',
      duration: '0.6s'
    },
    hoverEffects: enableHover ? {
      enabled: true,
      enter: getHoverStyles(hoverEffect, 'enter'),
      leave: getHoverStyles(hoverEffect, 'leave')
    } : { enabled: false },
    analytics: {
      enabled: true,
      trackViews: true,
      viewData: { 
        layout,
        has_background_image: !!backgroundImage?.url,
        has_custom_css: !!customCSS
      }
    }
  })

  const blockProps = useBlockProps.save({
    className: `visual-block layout-${layout || 'default'}`,
    ...generateDataAttributes(performanceConfig),
    style: generateInlineStyles(attributes)
  })

  // Helper function to generate inline styles
  function generateInlineStyles(attrs) {
    const styles = {}

    // Basic styling
    if (attrs.backgroundColor) styles.backgroundColor = attrs.backgroundColor
    if (attrs.textColor) styles.color = attrs.textColor
    if (attrs.borderRadius) styles.borderRadius = attrs.borderRadius
    if (attrs.boxShadow) styles.boxShadow = attrs.boxShadow

    // Spacing
    if (attrs.padding) {
      if (typeof attrs.padding === 'object') {
        if (attrs.padding.top) styles.paddingTop = attrs.padding.top
        if (attrs.padding.right) styles.paddingRight = attrs.padding.right
        if (attrs.padding.bottom) styles.paddingBottom = attrs.padding.bottom
        if (attrs.padding.left) styles.paddingLeft = attrs.padding.left
      } else {
        styles.padding = attrs.padding
      }
    }

    if (attrs.margin) {
      if (typeof attrs.margin === 'object') {
        if (attrs.margin.top) styles.marginTop = attrs.margin.top
        if (attrs.margin.right) styles.marginRight = attrs.margin.right
        if (attrs.margin.bottom) styles.marginBottom = attrs.margin.bottom
        if (attrs.margin.left) styles.marginLeft = attrs.margin.left
      } else {
        styles.margin = attrs.margin
      }
    }

    return styles
  }

  // Helper function to get hover effect styles
  function getHoverStyles(effect, state) {
    const effects = {
      lift: {
        enter: { transform: 'translateY(-4px)', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' },
        leave: { transform: 'translateY(0)', boxShadow: '' }
      },
      scale: {
        enter: { transform: 'scale(1.02)' },
        leave: { transform: 'scale(1)' }
      },
      glow: {
        enter: { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
        leave: { boxShadow: '' }
      },
      rotate: {
        enter: { transform: 'rotate(1deg)' },
        leave: { transform: 'rotate(0deg)' }
      },
      fade: {
        enter: { opacity: '0.8' },
        leave: { opacity: '1' }
      }
    }

    return effects[effect]?.[state] || {}
  }

  // Helper function to render background
  const renderBackground = () => {
    if (!backgroundImage?.url) return null

    return (
      <div className="visual-block-background absolute inset-0 overflow-hidden">
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
        
        {/* Overlay */}
        {overlayOpacity && (
          <div 
            className="background-overlay absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}
      </div>
    )
  }

  return (
    <div {...blockProps} {...(enableHover && { 'data-hover': true })}>
      {/* Background */}
      {renderBackground()}

      {/* Content */}
      <div className="visual-block-content relative z-10" data-animate="content">
        {content && (
          <div 
            className="visual-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>

      {/* Custom CSS (if provided) */}
      {customCSS && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .visual-block {
              ${customCSS}
            }
          `
        }} />
      )}
    </div>
  )
}