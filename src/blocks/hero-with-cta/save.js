import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		layout,
		headline,
		subheadline,
		primaryCta,
		secondaryCta,
		showSecondaryCta,
		backgroundImage,
		backgroundVideo,
		hasOverlay,
		overlayOpacity,
		textAlignment,
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `hero-with-cta hero-${layout} text-${textAlignment}`
	});

	return (
		<div {...blockProps}>
			<div className="hero-content-wrapper relative min-h-[400px] flex items-center">
				{/* Background Elements */}
				{backgroundImage && (
					<div 
						className="absolute inset-0 bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: `url(${backgroundImage.url})` }}
					/>
				)}
				
				{backgroundVideo && layout === 'video' && (
					<video 
						className="absolute inset-0 w-full h-full object-cover"
						autoPlay 
						muted 
						loop
						src={backgroundVideo.url}
					/>
				)}

				{hasOverlay && (backgroundImage || backgroundVideo) && (
					<div 
						className="absolute inset-0 bg-black"
						style={{ opacity: overlayOpacity / 100 }}
					/>
				)}

				{/* Content */}
				<div className={`hero-content relative z-10 w-full ${
					layout === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : 
					'max-w-4xl mx-auto px-4'
				}`}>
					<div className={`hero-text ${layout === 'split' ? 'lg:pr-8' : ''}`}>
						<RichText.Content
							tagName="h1"
							className="hero-headline text-4xl lg:text-6xl font-bold mb-6 text-white"
							value={headline}
						/>
						
						<RichText.Content
							tagName="p"
							className="hero-subheadline text-lg lg:text-xl mb-8 text-gray-200"
							value={subheadline}
						/>

						<div className={`hero-cta-buttons flex gap-4 ${
							textAlignment === 'center' ? 'justify-center' : 
							textAlignment === 'right' ? 'justify-end' : 'justify-start'
						}`}>
							<a
								className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
								href={primaryCta.url}
								{...(primaryCta.opensInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
							>
								{primaryCta.text}
							</a>
							
							{showSecondaryCta && (
								<a
									className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
									href={secondaryCta.url}
									{...(secondaryCta.opensInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
								>
									{secondaryCta.text}
								</a>
							)}
						</div>
					</div>

					{layout === 'split' && (
						<div className="hero-visual">
							<div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
								<span className="text-gray-500">Visual Element</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}