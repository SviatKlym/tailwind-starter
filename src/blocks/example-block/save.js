import React from 'react'
import { useBlockProps, RichText } from '@wordpress/block-editor'

export default function Save({ attributes }) {
  const { title, content, buttonText, buttonUrl, backgroundColor, textColor } = attributes
  const blockProps = useBlockProps.save()

  return (
    <div {...blockProps}>
      <div className={`example-block p-6 rounded-lg shadow-md ${backgroundColor} ${textColor}`}>
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
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            role="button"
            aria-label={buttonText}
          >
            <RichText.Content value={buttonText} />
          </a>
        )}
      </div>
    </div>
  )
}