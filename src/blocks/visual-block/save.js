import React from 'react'
import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generateAllClasses } from '../../utils/visual-controls.js'

export default function Save({ attributes }) {
  const { 
    title, 
    content, 
    buttonText, 
    buttonUrl, 
    settings
  } = attributes
  
  const blockProps = useBlockProps.save()

  // Generate all responsive classes
  const allClasses = generateAllClasses(settings)

  return (
    <div {...blockProps}>
      <div className={`visual-block ${allClasses} rounded-lg transition-all duration-300`}>
        <RichText.Content
          tagName="h2"
          value={title}
          className="mb-3"
        />
        
        <RichText.Content
          tagName="p"
          value={content}
          className="mb-4 leading-relaxed"
        />
        
        {buttonText && (
          <a
            href={buttonUrl}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
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