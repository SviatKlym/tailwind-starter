import React from 'react'
import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor'
import { PanelBody, TextControl, SelectControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

registerBlockType('my-tailwind-starter/sample-block', {
  edit: ({ attributes, setAttributes }) => {
    const { title, content, buttonText, buttonUrl, backgroundColor, textColor } = attributes
    const blockProps = useBlockProps()

    const backgroundOptions = [
      { label: 'White', value: 'bg-white' },
      { label: 'Gray 50', value: 'bg-gray-50' },
      { label: 'Primary 50', value: 'bg-primary-50' },
      { label: 'Secondary 50', value: 'bg-secondary-50' },
    ]

    const textColorOptions = [
      { label: 'Gray 900', value: 'text-gray-900' },
      { label: 'Gray 600', value: 'text-gray-600' },
      { label: 'Primary 600', value: 'text-primary-600' },
      { label: 'Secondary 600', value: 'text-secondary-600' },
    ]

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Block Settings', 'my-tailwind-starter')}>
            <TextControl
              label={__('Button URL', 'my-tailwind-starter')}
              value={buttonUrl}
              onChange={(value) => setAttributes({ buttonUrl: value })}
            />
            <SelectControl
              label={__('Background Color', 'my-tailwind-starter')}
              value={backgroundColor}
              options={backgroundOptions}
              onChange={(value) => setAttributes({ backgroundColor: value })}
            />
            <SelectControl
              label={__('Text Color', 'my-tailwind-starter')}
              value={textColor}
              options={textColorOptions}
              onChange={(value) => setAttributes({ textColor: value })}
            />
          </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
          <div className={`card ${backgroundColor} ${textColor} max-w-2xl mx-auto`}>
            <RichText
              tagName="h2"
              value={title}
              onChange={(value) => setAttributes({ title: value })}
              placeholder={__('Enter title...', 'my-tailwind-starter')}
              className="text-2xl font-bold mb-4"
            />
            <RichText
              tagName="p"
              value={content}
              onChange={(value) => setAttributes({ content: value })}
              placeholder={__('Enter content...', 'my-tailwind-starter')}
              className="text-lg mb-6 leading-relaxed"
            />
            <RichText
              tagName="span"
              value={buttonText}
              onChange={(value) => setAttributes({ buttonText: value })}
              placeholder={__('Button text...', 'my-tailwind-starter')}
              className="btn-primary"
            />
          </div>
        </div>
      </>
    )
  },

  save: ({ attributes }) => {
    const { title, content, buttonText, buttonUrl, backgroundColor, textColor } = attributes
    const blockProps = useBlockProps.save()

    return (
      <div {...blockProps}>
        <div className={`card ${backgroundColor} ${textColor} max-w-2xl mx-auto`}>
          <RichText.Content
            tagName="h2"
            value={title}
            className="text-2xl font-bold mb-4"
          />
          <RichText.Content
            tagName="p"
            value={content}
            className="text-lg mb-6 leading-relaxed"
          />
          {buttonText && (
            <a
              href={buttonUrl}
              className="btn-primary"
              role="button"
              aria-label={buttonText}
            >
              <RichText.Content value={buttonText} />
            </a>
          )}
        </div>
      </div>
    )
  },
})