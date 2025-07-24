import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	RangeControl,
	Button,
	TextareaControl,
	
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
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
		settings = {},
		activeDevice
	} = attributes;

	const [selectedCategory, setSelectedCategory] = useState('all');

	// Enhanced preset styles for integration logos
	const presets = {
		corporate: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-semibold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		modern: {
			spacing: { base: { top: 10, right: 5, bottom: 10, left: 5 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-r from-blue-50 to-indigo-100',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		minimal: {
			spacing: { base: { top: 6, right: 3, bottom: 6, left: 3 } },
			margins: { base: { top: 1, right: 0, bottom: 1, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-center' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-700',
			gradients: {},
			layout: {},
			effects: {}
		}
	};

	const handlePresetApply = (presetName) => {
		const preset = presets[presetName];
		if (preset) {
			setAttributes({ settings: preset });
		}
	};

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings || {});

	// Generate preview classes (just base for editor)
	const previewClasses = generateAllClasses(settings || {});

	const blockProps = useBlockProps({
		className: `integration-logos logos-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'simple-grid', icon: '⚏', name: 'Simple Grid', desc: 'Uniform logo sizing in grid' },
		{ key: 'carousel-scroll', icon: '→', name: 'Carousel Scroll', desc: 'Horizontal scrolling logos' },
		{ key: 'categorized-display', icon: '📂', name: 'Categorized', desc: 'Grouped by type' },
		{ key: 'masonry', icon: '🧱', name: 'Masonry', desc: 'Pinterest-style layout' },
		{ key: 'showcase', icon: '⭐', name: 'Showcase', desc: 'Featured logo highlight' }
	];

	const addNewLogo = () => {
		const newLogo = {
			id: Date.now(),
			image: '',
			alt: 'Integration Logo',
			title: 'New Integration',
			link: '',
			category: 'integrations',
			description: '',
			openInNewTab: true
		};
		setAttributes({ logos: [...logos, newLogo] });
	};

	const updateLogo = (logoId, field, value) => {
		const updatedLogos = logos.map(logo => 
			logo.id === logoId ? { ...logo, [field]: value } : logo
		);
		setAttributes({ logos: updatedLogos });
	};

	const removeLogo = (logoId) => {
		const updatedLogos = logos.filter(logo => logo.id !== logoId);
		setAttributes({ logos: updatedLogos });
	};

	const duplicateLogo = (logoId) => {
		const logoToDuplicate = logos.find(logo => logo.id === logoId);
		if (logoToDuplicate) {
			const duplicatedLogo = {
				...logoToDuplicate,
				id: Date.now(),
				title: logoToDuplicate.title + ' (Copy)'
			};
			setAttributes({ logos: [...logos, duplicatedLogo] });
		}
	};

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

	const filteredLogos = selectedCategory === 'all' 
		? logos 
		: logos.filter(logo => logo.category === selectedCategory);

	const renderLogo = (logo, index) => {
		const logoClasses = `logo-item ${uniformSize ? 'h-20' : 'h-auto'} ${
			grayscaleDefault ? 'grayscale' : ''
		} ${colorOnHover && grayscaleDefault ? 'hover:grayscale-0' : ''} 
		transition-all duration-300 logo-hover-${hoverEffect} ${
			borderStyle !== 'none' ? `border ${borderStyle === 'rounded' ? 'rounded-lg' : borderStyle === 'circle' ? 'rounded-full' : 'border-gray-200'}` : ''
		} ${backgroundColor !== 'transparent' ? 'p-4' : ''}`;

		const LogoContent = () => (
			<div className={logoClasses}>
				{logo.image ? (
					<img 
						src={logo.image} 
						alt={logo.alt || logo.title}
						className={`w-full ${uniformSize ? 'h-full object-contain' : 'h-auto'} ${alignment === 'center' ? 'mx-auto' : ''}`}
						style={uniformSize ? { maxHeight: `${maxLogoHeight}px` } : {}}
					/>
				) : (
					<div className="logo-placeholder w-full h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
						Add Logo
					</div>
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
			<div key={logo.id} className="logo-wrapper">
				{enableLinks && logo.link ? (
					<a 
						href={logo.link} 
						target={logo.openInNewTab ? '_blank' : '_self'}
						rel="noopener noreferrer"
						className="block"
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
		if (!filteredLogos || filteredLogos.length === 0) {
			return (
				<div className="empty-state text-center py-8">
					<div className="text-gray-400 text-lg mb-2">🏢</div>
					<p className="text-gray-500">No logos to display. Add some logos to get started!</p>
				</div>
			);
		}

		switch (layout) {
			case 'carousel-scroll':
				return (
					<div className="logos-carousel-container overflow-hidden">
						<div className="logos-carousel-track flex space-x-8 animate-scroll">
							{filteredLogos.map((logo, index) => renderLogo(logo, index))}
							{/* Duplicate for seamless loop */}
							{filteredLogos.map((logo, index) => renderLogo(logo, index + filteredLogos.length))}
						</div>
					</div>
				);

			case 'categorized-display':
				const categories = getUniqueCategories();
				return (
					<div className="categorized-logos space-y-8">
						{categories.map(category => {
							const categoryLogos = logos.filter(logo => logo.category === category);
							return (
								<div key={category} className="category-section">
									<h3 className="category-title text-lg font-semibold mb-4 capitalize">{category}</h3>
									<div className={`logos-grid grid gap-6 ${getGridColumns()}`}>
										{categoryLogos.map((logo, index) => renderLogo(logo, index))}
									</div>
								</div>
							);
						})}
					</div>
				);

			case 'masonry':
				return (
					<div className="logos-masonry columns-2 md:columns-3 lg:columns-4 gap-6">
						{filteredLogos.map((logo, index) => (
							<div key={logo.id} className="break-inside-avoid mb-6">
								{renderLogo(logo, index)}
							</div>
						))}
					</div>
				);

			case 'showcase':
				const featuredLogo = filteredLogos[0];
				const otherLogos = filteredLogos.slice(1);
				
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
						{filteredLogos.map((logo, index) => renderLogo(logo, index))}
					</div>
				);
		}
	};

	// Block tab controls - content and functionality
	const blockControls = (
		<>
			<PanelBody title={__('📐 Layout Variations', 'tailwind-starter')} initialOpen={true}>
					<div className="preset-grid">
						{layoutPresets.map(preset => (
							<div
								key={preset.key}
								className={`preset-button ${layout === preset.key ? 'active' : ''}`}
								onClick={() => setAttributes({ layout: preset.key })}
							>
								<div className="preset-icon">{preset.icon}</div>
								<div className="preset-name">{preset.name}</div>
								<div className="preset-desc">{preset.desc}</div>
							</div>
						))}
					</div>
				</PanelBody>

				<PanelBody title={__('⚙️ Logo Settings', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Section Header', 'tailwind-starter')}
						checked={showSectionHeader}
						onChange={(value) => setAttributes({ showSectionHeader: value })}
					/>

	

					<RangeControl
						label={__('Columns', 'tailwind-starter')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={2}
						max={6}
					/>

					<SelectControl
						label={__('Logo Size', 'tailwind-starter')}
						value={logoSize}
						onChange={(value) => setAttributes({ logoSize: value })}
						options={[
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
							{ label: 'Extra Large', value: 'xl' }
						]}
					/>

					<ToggleControl
						label={__('Uniform Size', 'tailwind-starter')}
						checked={uniformSize}
						onChange={(value) => setAttributes({ uniformSize: value })}
					/>

					{uniformSize && (
						<RangeControl
							label={__('Max Logo Height (px)', 'tailwind-starter')}
							value={maxLogoHeight}
							onChange={(value) => setAttributes({ maxLogoHeight: value })}
							min={40}
							max={200}
						/>
					)}

					<ToggleControl
						label={__('Show Titles', 'tailwind-starter')}
						checked={showTitle}
						onChange={(value) => setAttributes({ showTitle: value })}
					/>

					<ToggleControl
						label={__('Show Descriptions', 'tailwind-starter')}
						checked={showDescription}
						onChange={(value) => setAttributes({ showDescription: value })}
					/>

					<ToggleControl
						label={__('Show Categories', 'tailwind-starter')}
						checked={showCategories}
						onChange={(value) => setAttributes({ showCategories: value })}
					/>

					<ToggleControl
						label={__('Enable Links', 'tailwind-starter')}
						checked={enableLinks}
						onChange={(value) => setAttributes({ enableLinks: value })}
					/>

					<SelectControl
						label={__('Hover Effect', 'tailwind-starter')}
						value={hoverEffect}
						onChange={(value) => setAttributes({ hoverEffect: value })}
						options={[
							{ label: 'Lift', value: 'lift' },
							{ label: 'Scale', value: 'scale' },
							{ label: 'Rotate', value: 'rotate' },
							{ label: 'Bounce', value: 'bounce' },
							{ label: 'None', value: 'none' }
						]}
					/>

					<SelectControl
						label={__('Border Style', 'tailwind-starter')}
						value={borderStyle}
						onChange={(value) => setAttributes({ borderStyle: value })}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Square', value: 'square' },
							{ label: 'Rounded', value: 'rounded' },
							{ label: 'Circle', value: 'circle' }
						]}
					/>

					<ToggleControl
						label={__('Grayscale by Default', 'tailwind-starter')}
						checked={grayscaleDefault}
						onChange={(value) => setAttributes({ grayscaleDefault: value })}
					/>

					{grayscaleDefault && (
						<ToggleControl
							label={__('Color on Hover', 'tailwind-starter')}
							checked={colorOnHover}
							onChange={(value) => setAttributes({ colorOnHover: value })}
						/>
					)}

					{layout === 'carousel-scroll' && (
						<>
			
							<ToggleControl
								label={__('Auto Scroll', 'tailwind-starter')}
								checked={autoScroll}
								onChange={(value) => setAttributes({ autoScroll: value })}
							/>

							{autoScroll && (
								<>
									<RangeControl
										label={__('Scroll Speed (seconds)', 'tailwind-starter')}
										value={scrollSpeed}
										onChange={(value) => setAttributes({ scrollSpeed: value })}
										min={10}
										max={60}
									/>

									<ToggleControl
										label={__('Pause on Hover', 'tailwind-starter')}
										checked={pauseOnHover}
										onChange={(value) => setAttributes({ pauseOnHover: value })}
									/>
								</>
							)}
						</>
					)}

					<ToggleControl
						label={__('Enable Category Filter', 'tailwind-starter')}
						checked={enableCategoryFilter}
						onChange={(value) => setAttributes({ enableCategoryFilter: value })}
					/>
				</PanelBody>

				<PanelBody title={__('🏢 Manage Logos', 'tailwind-starter')} initialOpen={false}>
					<div className="logos-manager">
						{logos.map((logo, index) => (
							<div key={logo.id} className="logo-item-editor border border-gray-200 rounded-lg p-4 mb-4">
								<div className="flex justify-between items-center mb-3">
									<h4 className="font-medium">Logo {index + 1}</h4>
									<div className="flex space-x-2">
										<Button
											isSmall
											variant="secondary"
											onClick={() => duplicateLogo(logo.id)}
										>
											Duplicate
										</Button>
										<Button
											isSmall
											isDestructive
											onClick={() => removeLogo(logo.id)}
										>
											Remove
										</Button>
									</div>
								</div>

								<MediaUploadCheck>
									<MediaUpload
										onSelect={(media) => updateLogo(logo.id, 'image', media.url)}
										onSelect={(media) => {
											updateLogo(logo.id, 'image', media.url);
											updateLogo(logo.id, 'alt', media.alt || logo.title);
										}}
										allowedTypes={['image']}
										value={logo.image}
										render={({ open }) => (
											<div className="logo-upload mb-3">
												{logo.image ? (
													<div className="relative">
														<img 
															src={logo.image} 
															alt={logo.alt || logo.title}
															className="w-full h-20 object-contain border border-gray-200 rounded"
														/>
														<Button
															isSmall
															variant="secondary"
															onClick={open}
															className="absolute top-1 right-1"
														>
															Change
														</Button>
													</div>
												) : (
													<Button
														variant="secondary"
														onClick={open}
														className="w-full h-20 border-2 border-dashed border-gray-300 rounded"
													>
														Upload Logo
													</Button>
												)}
											</div>
										)}
									/>
								</MediaUploadCheck>

								<TextControl
									label={__('Title', 'tailwind-starter')}
									value={logo.title}
									onChange={(value) => updateLogo(logo.id, 'title', value)}
									className="mb-2"
								/>

								<TextControl
									label={__('Alt Text', 'tailwind-starter')}
									value={logo.alt}
									onChange={(value) => updateLogo(logo.id, 'alt', value)}
									className="mb-2"
								/>

								<TextControl
									label={__('Category', 'tailwind-starter')}
									value={logo.category}
									onChange={(value) => updateLogo(logo.id, 'category', value)}
									className="mb-2"
								/>

								<TextareaControl
									label={__('Description', 'tailwind-starter')}
									value={logo.description}
									onChange={(value) => updateLogo(logo.id, 'description', value)}
									className="mb-2"
									rows={2}
								/>

								{enableLinks && (
									<>
										<TextControl
											label={__('Link URL', 'tailwind-starter')}
											value={logo.link}
											onChange={(value) => updateLogo(logo.id, 'link', value)}
											className="mb-2"
										/>

										<ToggleControl
											label={__('Open in New Tab', 'tailwind-starter')}
											checked={logo.openInNewTab}
											onChange={(value) => updateLogo(logo.id, 'openInNewTab', value)}
										/>
									</>
								)}
							</div>
						))}

						<Button
							variant="primary"
							onClick={addNewLogo}
							className="w-full"
						>
							Add New Logo
						</Button>
					</div>
				</PanelBody>
			</>  
		);

		// Design tab controls - visual styling only  
		const generalControls = (
			<>
				<UltimateDeviceSelector
					activeDevice={activeDevice}
					onChange={(device) => setAttributes({ activeDevice: device })}
				/>

				<PanelBody title={__('🎨 Visual Presets', 'tailwind-starter')} initialOpen={false}>
					<div className="preset-grid">
						{Object.keys(presets).map(presetName => (
							<div
								key={presetName}
								className="preset-button"
								onClick={() => handlePresetApply(presetName)}
							>
								<div className="preset-icon">🎨</div>
								<div className="preset-name">{presetName.charAt(0).toUpperCase() + presetName.slice(1)}</div>
								<div className="preset-desc">Apply {presetName} styling</div>
							</div>
						))}
					</div>
				</PanelBody>

				<UltimateControlTabs
					spacing={settings?.spacing || {}}
					onSpacingChange={(spacing) => setAttributes({
						settings: { ...(settings || {}), spacing }
					})}
					margins={settings?.margins || {}}
					onMarginsChange={(margins) => setAttributes({
						settings: { ...(settings || {}), margins }
					})}
					background={settings?.backgroundColor || 'bg-white'}
					onBackgroundChange={(backgroundColor) => setAttributes({
						settings: { ...(settings || {}), backgroundColor }
					})}
					textColor={settings?.textColor || 'text-gray-900'}
					onTextColorChange={(textColor) => setAttributes({
						settings: { ...(settings || {}), textColor }
					})}
					gradients={settings?.gradients || {}}
					onGradientsChange={(gradients) => setAttributes({
						settings: { ...(settings || {}), gradients }
					})}
					typography={settings?.typography || {}}
					onTypographyChange={(typography) => setAttributes({
						settings: { ...(settings || {}), typography }
					})}
					layout={settings?.layout || {}}
					onLayoutChange={(layout) => setAttributes({
						settings: { ...(settings || {}), layout }
					})}
					effects={settings?.effects || {}}
					onEffectsChange={(effects) => setAttributes({
						settings: { ...(settings || {}), effects }
					})}
					device={activeDevice}
					presets={{}}
					onPresetApply={(preset) => {
						console.log('Applying preset:', preset);
					}}
					onResetAll={() => {
						setAttributes({
							settings: {
								spacing: {},
								margins: {},
								typography: {},
								backgroundColor: '',
								textColor: '',
								gradients: {},
								layout: {},
								effects: {}
							}
						});
					}}
				/>

				<PanelBody title={__('🛠️ Advanced', 'tailwind-starter')} initialOpen={false}>
					<div className="generated-classes p-3 bg-gray-100 rounded text-xs">
						<strong>Preview Classes:</strong> {previewClasses}<br />
						<strong>All Device Classes:</strong> {allClasses}
					</div>
				</PanelBody>
			</>  
		);

	return (
		<>
			<InspectorControls>
				<SimpleInspectorTabs
					blockControls={blockControls}
					generalControls={generalControls}
				/>
			</InspectorControls>

			<div {...blockProps}>
				{showSectionHeader && (
					<div className="section-header text-center mb-8">
						<RichText
							tagName="h2"
							value={sectionTitle}
							onChange={(value) => setAttributes({ sectionTitle: value })}
							placeholder="Section Title..."
							className="text-3xl font-bold mb-2"
						/>
						<RichText
							tagName="p"
							value={sectionSubtitle}
							onChange={(value) => setAttributes({ sectionSubtitle: value })}
							placeholder="Section subtitle..."
							className="text-gray-600 text-lg"
						/>
					</div>
				)}

				{enableCategoryFilter && getUniqueCategories().length > 1 && (
					<div className="category-filters text-center mb-8">
						<div className="inline-flex space-x-2 bg-gray-100 p-1 rounded-lg">
							<button 
								className={`filter-btn px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'all' ? 'bg-white shadow-sm' : ''}`}
								onClick={() => setSelectedCategory('all')}
							>
								All
							</button>
							{getUniqueCategories().map(category => (
								<button 
									key={category}
									className={`filter-btn px-4 py-2 rounded-md text-sm font-medium capitalize ${selectedCategory === category ? 'bg-white shadow-sm' : ''}`}
									onClick={() => setSelectedCategory(category)}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				)}

				{renderLogos()}
			</div>
		</>
	);
} 