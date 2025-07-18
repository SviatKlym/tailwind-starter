import React from 'react'
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor'
import { PanelBody, TextControl, SelectControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export default function Edit({ attributes, setAttributes }) {
  const { title, content, buttonText, buttonUrl, backgroundColor, textColor } = attributes
  const blockProps = useBlockProps()

  const backgroundOptions = [
    { label: 'White', value: 'bg-white' },
    { label: 'Gray 50', value: 'bg-gray-50' },
    { label: 'Gray 100', value: 'bg-gray-100' },
    { label: 'Blue 50', value: 'bg-blue-50' },
    { label: 'Green 50', value: 'bg-green-50' },
  ]

  const textColorOptions = [
    { label: 'Gray 900', value: 'text-gray-900' },
    { label: 'Gray 600', value: 'text-gray-600' },
    { label: 'Blue 600', value: 'text-blue-600' },
    { label: 'Green 600', value: 'text-green-600' },
  ]

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Block Settings', 'my-tailwind-starter')}>
          <TextControl
            label={__('Button URL', 'my-tailwind-starter')}
            value={buttonUrl}
            onChange={(value) => setAttributes({ buttonUrl: value })}
            help={__('Enter the URL for the button link', 'my-tailwind-starter')}
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
        <div className={`example-block p-6 rounded-lg shadow-md ${backgroundColor} ${textColor}`}>
          <RichText
            tagName="h2"
            value={title}
            onChange={(value) => setAttributes({ title: value })}
            placeholder={__('Enter your title...', 'my-tailwind-starter')}
            className="text-2xl font-bold mb-4"
          />
          <RichText
            tagName="p"
            value={content}
            onChange={(value) => setAttributes({ content: value })}
            placeholder={__('Enter your content...', 'my-tailwind-starter')}
            className="text-lg mb-6 leading-relaxed"
          />
          <RichText
            tagName="span"
            value={buttonText}
            onChange={(value) => setAttributes({ buttonText: value })}
            placeholder={__('Button text...', 'my-tailwind-starter')}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          />
        </div>
      </div>
    </>
  )
}