import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		layout,
		headline,
		description,
		primaryButton,
		secondaryButton,
		showSecondaryButton,
		backgroundColor,
		backgroundImage,
		hasOverlay,
		overlayOpacity,
		textColor,
		alignment,
		visualElement,
		showVisualElement,
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `cta-section cta-${layout} text-${alignment}`
	});

	const sectionStyle = {
		backgroundColor: backgroundColor,
		color: textColor,
		backgroundImage: backgroundImage ? `url(${backgroundImage.url})` : 'none',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		position: 'relative'
	};

	const getButtonClasses = (buttonStyle) => {
		const baseClasses = 'inline-block px-8 py-3 rounded-lg font-semibold transition-all text-lg no-underline';
		
		switch(buttonStyle) {
			case 'primary':
				return `${baseClasses} bg-white text-gray-900 hover:bg-gray-100`;
			case 'secondary':
				return `${baseClasses} bg-gray-800 text-white hover:bg-gray-700`;
			case 'outline':
				return `${baseClasses} border-2 border-white text-white hover:bg-white hover:text-gray-900`;
			case 'ghost':
				return `${baseClasses} text-white hover:bg-white hover:bg-opacity-20`;
			default:
				return `${baseClasses} bg-white text-gray-900 hover:bg-gray-100`;
		}
	};

	return (
		<div {...blockProps}>
			<div className="cta-wrapper relative py-16 px-4" style={sectionStyle}>
				{hasOverlay && backgroundImage && (
					<div 
						className="absolute inset-0 bg-black"
						style={{ opacity: overlayOpacity / 100 }}
					/>
				)}

				<div className={`cta-content relative z-10 max-w-6xl mx-auto ${
					layout === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : ''
				}`}>
					<div className={`cta-text ${layout === 'split' ? 'lg:pr-8' : 'max-w-4xl mx-auto'}`}>
						<RichText.Content
							tagName="h2"
							className="cta-headline text-3xl lg:text-5xl font-bold mb-6"
							value={headline}
							style={{ color: textColor }}
						/>
						
						<RichText.Content
							tagName="p"
							className="cta-description text-lg lg:text-xl mb-8 opacity-90"
							value={description}
							style={{ color: textColor }}
						/>

						<div className={`cta-buttons flex gap-4 ${
							alignment === 'center' ? 'justify-center' : 
							alignment === 'right' ? 'justify-end' : 'justify-start'
						} ${layout === 'button-group' ? 'flex-wrap' : ''}`}>
							<a
								className={`cta-primary-button ${getButtonClasses(primaryButton.style)}`}
								href={primaryButton.url}
								{...(primaryButton.opensInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
							>
								{primaryButton.text}
							</a>
							
							{showSecondaryButton && (
								<a
									className={`cta-secondary-button ${getButtonClasses(secondaryButton.style)}`}
									href={secondaryButton.url}
									{...(secondaryButton.opensInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
								>
									{secondaryButton.text}
								</a>
							)}
						</div>
					</div>

					{layout === 'split' && showVisualElement && (
						<div className="cta-visual">
							{visualElement && (
								<img 
									src={visualElement.url} 
									alt="CTA Visual"
									className="w-full rounded-lg shadow-lg"
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}