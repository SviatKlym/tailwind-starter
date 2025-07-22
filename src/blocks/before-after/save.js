import { useBlockProps, RichText } from '@wordpress/block-editor';
import { generateAllClasses } from '../../utils/visual-controls.js';

export default function save({ attributes }) {
	const {
		layout,
		beforeImage,
		afterImage,
		beforeLabel,
		afterLabel,
		showLabels,
		labelPosition,
		sliderPosition,
		sliderColor,
		sliderThickness,
		handleStyle,
		handleSize,
		aspectRatio,
		borderRadius,
		enableShadow,
		animationSpeed,
		autoSlide,
		autoSlideDelay,
		toggleButtonText,
		fadeDirection,
		enableKeyboard,
		enableTouch,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		description,
		showDescription,
		descriptionPosition,
		enableFullscreen,
		overlayOpacity,
		hoverEffect,
		settings,
		activeDevice
	} = attributes;

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings);

	const blockProps = useBlockProps.save({
		className: `before-after comparison-${layout}`,
		'data-classes': allClasses,
		'data-attributes': JSON.stringify({
			layout,
			sliderPosition,
			sliderColor,
			sliderThickness,
			handleStyle,
			handleSize,
			aspectRatio,
			borderRadius,
			enableShadow,
			animationSpeed,
			autoSlide,
			autoSlideDelay,
			fadeDirection,
			enableKeyboard,
			enableTouch,
			enableFullscreen,
			overlayOpacity,
			hoverEffect
		})
	});

	const getAspectRatioClass = () => {
		switch (aspectRatio) {
			case '16:9': return 'aspect-video';
			case '4:3': return 'aspect-4/3';
			case '1:1': return 'aspect-square';
			case '3:2': return 'aspect-3/2';
			default: return 'aspect-video';
		}
	};

	const renderComparison = () => {
		if (!beforeImage.url || !afterImage.url) {
			return (
				<div className="comparison-placeholder bg-gray-100 rounded-lg p-8 text-center hidden">
					<div className="text-gray-400 text-lg mb-2" aria-hidden="true">📷</div>
					<p className="text-gray-500">Before and after images not configured.</p>
				</div>
			);
		}

		const containerClasses = `comparison-container relative ${getAspectRatioClass()} overflow-hidden ${enableShadow ? 'shadow-lg' : ''}`;
		const containerStyle = {
			borderRadius: `${borderRadius}px`
		};

		switch (layout) {
			case 'slider-comparison':
				return (
					<div 
						className={containerClasses}
						style={containerStyle}
						data-slider-position={sliderPosition}
						data-slider-color={sliderColor}
						data-slider-thickness={sliderThickness}
						data-handle-style={handleStyle}
						data-handle-size={handleSize}
					>
						<div className="before-image absolute inset-0">
							<img 
								src={beforeImage.url} 
								alt={beforeImage.alt}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="before-label absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
									{beforeLabel}
								</div>
							)}
						</div>
						
						<div className="after-image absolute inset-0">
							<img 
								src={afterImage.url} 
								alt={afterImage.alt}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="after-label absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
									{afterLabel}
								</div>
							)}
						</div>

						<div className="slider-line absolute top-0 bottom-0 bg-white pointer-events-none"></div>
						
						<div className="slider-handle absolute top-0 bottom-0 flex items-center justify-center cursor-ew-resize select-none">
							<div className="handle-grip bg-white shadow-lg rounded-full flex items-center justify-center">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M8 7L13 12L8 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									<path d="M16 7L11 12L16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
						</div>
					</div>
				);

			case 'toggle-switch':
				return (
					<div 
						className={containerClasses}
						style={containerStyle}
						data-toggle-text={toggleButtonText}
					>
						<div className="before-image absolute inset-0 transition-opacity duration-300">
							<img 
								src={beforeImage.url} 
								alt={beforeImage.alt}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="before-label absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
									{beforeLabel}
								</div>
							)}
						</div>
						
						<div className="after-image absolute inset-0 opacity-0 transition-opacity duration-300">
							<img 
								src={afterImage.url} 
								alt={afterImage.alt}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="after-label absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
									{afterLabel}
								</div>
							)}
						</div>

						<button 
							className="toggle-button absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-opacity-100 transition-all duration-200 font-medium"
							aria-label="Toggle between before and after views"
						>
							{toggleButtonText}
						</button>
					</div>
				);

			case 'side-by-side':
				return (
					<div className="comparison-container">
						<div className={`side-by-side-grid grid grid-cols-1 md:grid-cols-2 gap-4 ${enableShadow ? 'shadow-lg' : ''}`} style={{ borderRadius: `${borderRadius}px` }}>
							<div className={`before-section relative ${getAspectRatioClass()} overflow-hidden`} style={{ borderRadius: `${borderRadius}px` }}>
								<img 
									src={beforeImage.url} 
									alt={beforeImage.alt}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
								{showLabels && labelPosition === 'overlay' && (
									<div className="before-label absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
										{beforeLabel}
									</div>
								)}
							</div>
							
							<div className={`after-section relative ${getAspectRatioClass()} overflow-hidden`} style={{ borderRadius: `${borderRadius}px` }}>
								<img 
									src={afterImage.url} 
									alt={afterImage.alt}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
								{showLabels && labelPosition === 'overlay' && (
									<div className="after-label absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
										{afterLabel}
									</div>
								)}
							</div>
						</div>
						
						{showLabels && labelPosition === 'below' && (
							<div className="labels-below grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								<div className="text-center font-medium text-gray-700">{beforeLabel}</div>
								<div className="text-center font-medium text-gray-700">{afterLabel}</div>
							</div>
						)}
					</div>
				);

			case 'overlay-fade':
				return (
					<div 
						className={`${containerClasses} group cursor-pointer`}
						style={containerStyle}
						data-fade-direction={fadeDirection}
					>
						<div className="before-image absolute inset-0">
							<img 
								src={beforeImage.url} 
								alt={beforeImage.alt}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="before-label absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
									{beforeLabel}
								</div>
							)}
						</div>
						
						<div className="after-image absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
							<img 
								src={afterImage.url} 
								alt={afterImage.alt}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="after-label absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
									{afterLabel}
								</div>
							)}
						</div>

						<div className="fade-hint absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm pointer-events-none">
							Hover to reveal
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div {...blockProps}>
			{showSectionHeader && (sectionTitle || sectionSubtitle) && (
				<div className="section-header text-center mb-8">
					{sectionTitle && (
						<RichText.Content
							tagName="h2"
							value={sectionTitle}
							className="text-3xl font-bold mb-2"
						/>
					)}
					{sectionSubtitle && (
						<RichText.Content
							tagName="p"
							value={sectionSubtitle}
							className="text-gray-600 text-lg"
						/>
					)}
				</div>
			)}

			{showDescription && descriptionPosition === 'top' && description && (
				<div className="description mb-6">
					<p className="text-gray-600 text-center">{description}</p>
				</div>
			)}

			<div className="comparison-wrapper">
				{renderComparison()}
			</div>

			{showDescription && descriptionPosition === 'bottom' && description && (
				<div className="description mt-6">
					<p className="text-gray-600 text-center">{description}</p>
				</div>
			)}

			{enableFullscreen && (
				<button 
					className="fullscreen-button mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
					aria-label="View in fullscreen"
				>
					View Fullscreen
				</button>
			)}
		</div>
	);
} 