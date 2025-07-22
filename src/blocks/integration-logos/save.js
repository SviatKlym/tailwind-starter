import { useBlockProps, RichText } from '@wordpress/block-editor';
import { generateAllClasses } from '../../utils/visual-controls.js';

export default function save({ attributes }) {
	const {
		layout,
		logos,
		columns,
		logoSize,
		showTitle,
		showDescription,
		showCategories,
		enableLinks,
		hoverEffect,
		logoFilter,
		alignment,
		spacing,
		backgroundColor,
		borderStyle,
		aspectRatio,
		autoScroll,
		scrollSpeed,
		pauseOnHover,
		enableCategoryFilter,
		filterPosition,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		grayscaleDefault,
		colorOnHover,
		uniformSize,
		maxLogoHeight,
		carouselAutoplay,
		carouselSpeed,
		settings,
		activeDevice
	} = attributes;

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings);

	const blockProps = useBlockProps.save({
		className: `integration-logos logos-${layout}`,
		'data-classes': allClasses,
		'data-attributes': JSON.stringify({
			layout,
			columns,
			logoSize,
			showTitle,
			showDescription,
			showCategories,
			enableLinks,
			hoverEffect,
			logoFilter,
			alignment,
			spacing,
			backgroundColor,
			borderStyle,
			aspectRatio,
			autoScroll,
			scrollSpeed,
			pauseOnHover,
			enableCategoryFilter,
			filterPosition,
			grayscaleDefault,
			colorOnHover,
			uniformSize,
			maxLogoHeight,
			carouselAutoplay,
			carouselSpeed
		})
	});

	const getGridColumns = () => {
		switch (columns) {
			case 2: return 'grid-cols-2';
			case 3: return 'grid-cols-2 md:grid-cols-3';
			case 4: return 'grid-cols-2 md:grid-cols-4';
			case 5: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
			case 6: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
			default: return 'grid-cols-2 md:grid-cols-4';
		}
	};

	const getUniqueCategories = () => {
		const categories = logos.map(logo => logo.category).filter(Boolean);
		return [...new Set(categories)];
	};

	const renderLogo = (logo, index) => {
		const logoClasses = `logo-item ${uniformSize ? 'h-20' : 'h-auto'} ${
			grayscaleDefault ? 'grayscale' : ''
		} ${colorOnHover && grayscaleDefault ? 'hover:grayscale-0' : ''} 
		transition-all duration-300 logo-hover-${hoverEffect} ${
			borderStyle !== 'none' ? `border ${borderStyle === 'rounded' ? 'rounded-lg' : borderStyle === 'circle' ? 'rounded-full' : 'border-gray-200'}` : ''
		} ${backgroundColor !== 'transparent' ? 'p-4' : ''}`;

		const LogoContent = () => (
			<div className={logoClasses} data-category={logo.category || 'uncategorized'}>
				{logo.image && (
					<img 
						src={logo.image} 
						alt={logo.alt || logo.title}
						className={`w-full ${uniformSize ? 'h-full object-contain' : 'h-auto'} ${alignment === 'center' ? 'mx-auto' : ''}`}
						style={uniformSize ? { maxHeight: `${maxLogoHeight}px` } : {}}
						loading="lazy"
					/>
				)}
				
				{showTitle && logo.title && (
					<h4 className="logo-title mt-2 text-sm font-medium text-center">{logo.title}</h4>
				)}
				
				{showDescription && logo.description && (
					<p className="logo-description mt-1 text-xs text-gray-600 text-center">{logo.description}</p>
				)}
				
				{showCategories && logo.category && (
					<span className="logo-category mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
						{logo.category}
					</span>
				)}
			</div>
		);

		return (
			<div key={logo.id} className="logo-wrapper" data-category={logo.category || 'uncategorized'}>
				{enableLinks && logo.link ? (
					<a 
						href={logo.link} 
						target={logo.openInNewTab ? '_blank' : '_self'}
						rel="noopener noreferrer"
						className="block"
						aria-label={`Visit ${logo.title || 'partner website'}`}
					>
						<LogoContent />
					</a>
				) : (
					<LogoContent />
				)}
			</div>
		);
	};

	const renderLogos = () => {
		if (!logos || logos.length === 0) {
			return (
				<div className="empty-state text-center py-8 hidden">
					<div className="text-gray-400 text-lg mb-2" aria-hidden="true">🏢</div>
					<p className="text-gray-500">No logos to display.</p>
				</div>
			);
		}

		switch (layout) {
			case 'carousel-scroll':
				return (
					<div className="logos-carousel-container overflow-hidden relative">
						<div className="logos-carousel-track flex space-x-8" data-auto-scroll={autoScroll} data-scroll-speed={scrollSpeed} data-pause-on-hover={pauseOnHover}>
							{logos.concat(logos).map((logo, index) => (
								<div key={`${logo.id}-${index}`} className="logo-slide flex-shrink-0 w-32">
									{renderLogo(logo, index)}
								</div>
							))}
						</div>
					</div>
				);

			case 'categorized-display':
				const categories = getUniqueCategories();
				return (
					<div className="categorized-logos space-y-8">
						{categories.map(category => (
							<div key={category} className="category-section" data-category={category}>
								<h3 className="category-title text-lg font-semibold mb-4 capitalize">{category}</h3>
								<div className={`logos-grid grid gap-6 ${getGridColumns()}`}>
									{logos.filter(logo => logo.category === category).map((logo, index) => 
										renderLogo(logo, index)
									)}
								</div>
							</div>
						))}
					</div>
				);

			case 'masonry':
				return (
					<div className="logos-masonry columns-2 md:columns-3 lg:columns-4 gap-6">
						{logos.map((logo, index) => (
							<div key={logo.id} className="break-inside-avoid mb-6">
								{renderLogo(logo, index)}
							</div>
						))}
					</div>
				);

			case 'showcase':
				const featuredLogo = logos[0];
				const otherLogos = logos.slice(1);
				
				return (
					<div className="showcase-layout">
						{featuredLogo && (
							<div className="featured-logo mb-8 text-center">
								<div className="featured-logo-wrapper inline-block p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
									{renderLogo(featuredLogo, 0)}
								</div>
							</div>
						)}
						{otherLogos.length > 0 && (
							<div className={`other-logos grid gap-4 ${getGridColumns()}`}>
								{otherLogos.map((logo, index) => renderLogo(logo, index + 1))}
							</div>
						)}
					</div>
				);

			default: // simple-grid
				return (
					<div className={`logos-grid grid gap-6 ${getGridColumns()}`}>
						{logos.map((logo, index) => renderLogo(logo, index))}
					</div>
				);
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

			{enableCategoryFilter && getUniqueCategories().length > 1 && (
				<div className="category-filters text-center mb-8">
					<div className="inline-flex space-x-2 bg-gray-100 p-1 rounded-lg">
						<button 
							className="filter-btn active px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm"
							data-category="all"
							aria-label="Show all logos"
						>
							All
						</button>
						{getUniqueCategories().map(category => (
							<button 
								key={category}
								className="filter-btn px-4 py-2 rounded-md text-sm font-medium capitalize"
								data-category={category}
								aria-label={`Show ${category} logos`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			)}

			<div className="logos-container">
				{renderLogos()}
			</div>

			{/* Empty state for filtered results */}
			{enableCategoryFilter && (
				<div className="filter-empty-state text-center py-8 hidden">
					<div className="text-gray-400 text-lg mb-2" aria-hidden="true">🔍</div>
					<p className="text-gray-500">No logos found in this category.</p>
				</div>
			)}
		</div>
	);
} 