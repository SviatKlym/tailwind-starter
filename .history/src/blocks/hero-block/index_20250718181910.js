import { registerBlockType } from '@wordpress/blocks'
import { 
  useBlockProps, 
  RichText, 
  InspectorControls, 
  MediaUpload,
  MediaUploadCheck 
} from '@wordpress/block-editor'
import { 
  PanelBody, 
  TextControl, 
  RangeControl, 
  SelectControl, 
  Button 
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

registerBlockType('my-tailwind-starter/hero-block', {
  edit: ({ attributes, setAttributes }) => {
    const { 
      title, 
      subtitle, 
      buttonText, 
      buttonUrl, 
      backgroundImage, 
      overlayOpacity, 
      textAlignment 
    } = attributes
    
    const blockProps = useBlockProps()

    const alignmentOptions = [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ]

    const backgroundStyle = backgroundImage 
      ? {
          backgroundImage: `url(${backgroundImage.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {}

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Hero Settings', 'my-tailwind-starter')}>
            <TextControl
              label={__('Button URL', 'my-tailwind-starter')}
              value={buttonUrl}
              onChange={(value) => setAttributes({ buttonUrl: value })}
            />
            
            <SelectControl
              label={__('Text Alignment', 'my-tailwind-starter')}
              value={textAlignment}
              options={alignmentOptions}
              onChange={(value) => setAttributes({ textAlignment: value })}
            />

            <RangeControl
              label={__('Overlay Opacity', 'my-tailwind-starter')}
              value={overlayOpacity}
              onChange={(value) => setAttributes({ overlayOpacity: value })}
              min={0}
              max={1}
              step={0.1}
            />

            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => setAttributes({ backgroundImage: media })}
                allowedTypes={['image']}
                value={backgroundImage?.id}
                render={({ open }) => (
                  <Button 
                    onClick={open}
                    variant="secondary"
                    style={{ marginTop: '10px' }}
                  >
                    {backgroundImage ? __('Replace Background Image', 'my-tailwind-starter') : __('Select Background Image', 'my-tailwind-starter')}
                  </Button>
                )}
              />
            </MediaUploadCheck>

            {backgroundImage && (
              <Button
                onClick={() => setAttributes({ backgroundImage: null })}
                variant="link"
                isDestructive
                style={{ marginTop: '10px' }}
              >
                {__('Remove Background Image', 'my-tailwind-starter')}
              </Button>
            )}
          </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
          <div 
            className={`hero-block relative min-h-96 flex items-center justify-center text-${textAlignment}`}
            style={backgroundStyle}
          >
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
            <div className="relative z-10 max-w-4xl mx-auto px-4">
              <RichText
                tagName="h1"
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                placeholder={__('Enter hero title...', 'my-tailwind-starter')}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              />
              <RichText
                tagName="p"
                value={subtitle}
                onChange={(value) => setAttributes({ subtitle: value })}
                placeholder={__('Enter subtitle...', 'my-tailwind-starter')}
                className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
              />
              <RichText
                tagName="span"
                value={buttonText}
                onChange={(value) => setAttributes({ buttonText: value })}
                placeholder={__('Button text...', 'my-tailwind-starter')}
                className="btn-hero"
              />
            </div>
          </div>
        </div>
      </>
    )
  },

  save: ({ attributes }) => {
    const { 
      title, 
      subtitle, 
      buttonText, 
      buttonUrl, 
      backgroundImage, 
      overlayOpacity, 
      textAlignment 
    } = attributes
    
    const blockProps = useBlockProps.save()

    const backgroundStyle = backgroundImage 
      ? {
          backgroundImage: `url(${backgroundImage.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {}

    return (
      <div {...blockProps}>
        <div 
          className={`hero-block relative min-h-96 flex items-center justify-center text-${textAlignment}`}
          style={backgroundStyle}
        >
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <RichText.Content
              tagName="h1"
              value={title}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            />
            <RichText.Content
              tagName="p"
              value={subtitle}
              className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
            />
            {buttonText && (
              <a
                href={buttonUrl}
                className="btn-hero"
                role="button"
                aria-label={buttonText}
              >
                <RichText.Content value={buttonText} />
              </a>
            )}
          </div>
        </div>
      </div>
    )
  },
})