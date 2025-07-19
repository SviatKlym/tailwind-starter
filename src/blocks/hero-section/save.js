import { useBlockProps, RichText } from '@wordpress/block-editor'

export default function Save({ attributes }) {
  const {
    layout,
    headline,
    subheadline,
    primaryCTA,
    secondaryCTA,
    showSecondaryCTA,
    backgroundImage,
    backgroundColor,
    textColor,
    heroImage,
    showTrustBar,
    trustLogos,
    trustText,
    padding
  } = attributes

  const blockProps = useBlockProps.save({
    className: `hero-section hero-section--${layout} ${backgroundColor} ${textColor}`
  })

  const getPaddingClass = (size) => {
    const paddingMap = {
      small: 'py-8 sm:py-12',
      medium: 'py-12 sm:py-16', 
      large: 'py-16 sm:py-24',
      xlarge: 'py-24 sm:py-32'
    }
    return paddingMap[size] || paddingMap.large
  }

  const renderCenteredLayout = () => (
    <div className={`${getPaddingClass(padding.top)} relative`}>
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage.url})`,
            opacity: 0.1 
          }}
        />
      )}
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <RichText.Content
            tagName="h1"
            value={headline}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          />
          <RichText.Content
            tagName="p"
            value={subheadline}
            className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={primaryCTA.url}
              className="btn btn-primary btn-lg px-8 py-4"
              role="button"
            >
              {primaryCTA.text}
            </a>
            {showSecondaryCTA && (
              <a 
                href={secondaryCTA.url}
                className="btn btn-secondary btn-lg px-8 py-4"
                role="button"
              >
                {secondaryCTA.text}
              </a>
            )}
          </div>
        </div>
        
        {showTrustBar && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-6">{trustText}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {trustLogos.map((logo, index) => (
                <img 
                  key={index}
                  src={logo.url} 
                  alt={logo.alt}
                  className="h-8 grayscale"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSplitLayout = () => (
    <div className={`${getPaddingClass(padding.top)} relative`}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <RichText.Content
              tagName="h1"
              value={headline}
              className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            />
            <RichText.Content
              tagName="p"
              value={subheadline}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={primaryCTA.url}
                className="btn btn-primary btn-lg px-8 py-4"
                role="button"
              >
                {primaryCTA.text}
              </a>
              {showSecondaryCTA && (
                <a 
                  href={secondaryCTA.url}
                  className="btn btn-outline btn-lg px-8 py-4"
                  role="button"
                >
                  {secondaryCTA.text}
                </a>
              )}
            </div>
          </div>
          <div className="lg:text-right">
            {heroImage && (
              <img 
                src={heroImage.url} 
                alt={heroImage.alt}
                className="w-full max-w-lg ml-auto rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderMinimalLayout = () => (
    <div className={`${getPaddingClass(padding.top)} text-center`}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <RichText.Content
            tagName="h1"
            value={headline}
            className="text-3xl sm:text-4xl font-bold mb-4"
          />
          <RichText.Content
            tagName="p"
            value={subheadline}
            className="text-lg text-gray-600 mb-6"
          />
          <a 
            href={primaryCTA.url}
            className="btn btn-primary px-6 py-3"
            role="button"
          >
            {primaryCTA.text}
          </a>
        </div>
      </div>
    </div>
  )

  const renderLayout = () => {
    switch (layout) {
      case 'split':
        return renderSplitLayout()
      case 'minimal':
        return renderMinimalLayout()
      default:
        return renderCenteredLayout()
    }
  }

  return (
    <div {...blockProps}>
      {renderLayout()}
    </div>
  )
}