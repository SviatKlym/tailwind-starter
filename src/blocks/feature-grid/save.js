import { useBlockProps, RichText } from '@wordpress/block-editor'

export default function Save({ attributes }) {
  const {
    features,
    columns,
    iconStyle,
    alignment,
    layout,
    backgroundColor,
    sectionTitle,
    sectionSubtitle,
    showSection,
    padding
  } = attributes

  const blockProps = useBlockProps.save({
    className: `feature-grid ${backgroundColor}`
  })

  const getPaddingClass = (size) => {
    const paddingMap = {
      small: 'py-8',
      medium: 'py-12',
      large: 'py-16'
    }
    return paddingMap[size] || paddingMap.large
  }

  const getGridClass = () => {
    const gridMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
    return gridMap[columns] || gridMap[3]
  }

  const renderIcon = (icon) => {
    const iconClasses = {
      emoji: 'text-4xl mb-4',
      circle: 'w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto',
      square: 'w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4 mx-auto',
      minimal: 'text-2xl text-blue-600 mb-4'
    }

    if (iconStyle === 'emoji') {
      return <div className={iconClasses.emoji}>{icon}</div>
    }

    return (
      <div className={iconClasses[iconStyle]}>
        {icon}
      </div>
    )
  }

  const renderFeature = (feature, index) => {
    const textAlignment = alignment === 'center' ? 'text-center' : 'text-left'
    
    if (layout === 'list') {
      return (
        <div key={feature.id} className="flex items-start space-x-4 p-6">
          <div className="flex-shrink-0">
            {renderIcon(feature.icon)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        </div>
      )
    }

    const cardClasses = layout === 'card' 
      ? 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'
      : 'p-6'

    return (
      <div key={feature.id} className={`${cardClasses} ${textAlignment}`}>
        <div className={alignment === 'center' ? 'flex justify-center' : ''}>
          {renderIcon(feature.icon)}
        </div>
        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    )
  }

  return (
    <div {...blockProps}>
      <div className={`${getPaddingClass(padding)}`}>
        <div className="container mx-auto px-4">
          {showSection && sectionTitle && (
            <div className="text-center mb-12">
              <RichText.Content
                tagName="h2"
                value={sectionTitle}
                className="text-3xl font-bold mb-4"
              />
              {sectionSubtitle && (
                <RichText.Content
                  tagName="p"
                  value={sectionSubtitle}
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                />
              )}
            </div>
          )}
          
          <div className={`grid ${getGridClass()} gap-8`}>
            {features.map((feature, index) => renderFeature(feature, index))}
          </div>
        </div>
      </div>
    </div>
  )
}