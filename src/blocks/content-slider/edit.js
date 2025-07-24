import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	Button,
	RangeControl,
	ColorPicker,
	TextareaControl,
	
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		slides,
		autoplay,
		autoplayDelay,
		showNavigation,
		showPagination,
		showScrollbar,
		loop,
		slidesPerView,
		spaceBetween,
		effect,
		speed,
		pauseOnHover,
		centeredSlides,
		freeMode,
		sliderHeight,
		navigationStyle,
		paginationStyle,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		settings = {},
		activeDevice
	} = attributes;

	const [editingSlide, setEditingSlide] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);

	// Enhanced preset styles for content slider
	const presets = {
		modern: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-center' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		elegant: {
			spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-medium', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-br from-gray-900 to-gray-700',
			textColor: 'text-white',
			gradients: {},
			layout: {},
			effects: {}
		},
		minimal: {
			spacing: { base: { top: 6, right: 2, bottom: 6, left: 2 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-light', textAlign: 'text-left' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-800',
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
		className: `content-slider slider-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'image-slider', icon: '🖼️', name: 'Image Slider', desc: 'Photos with captions' },
		{ key: 'content-cards', icon: '📄', name: 'Content Cards', desc: 'Text + image combinations' },
		{ key: 'testimonial-slider', icon: '💬', name: 'Testimonial Slider', desc: 'Rotating customer quotes' },
		{ key: 'feature-showcase', icon: '⭐', name: 'Feature Showcase', desc: 'Product highlights rotation' }
	];

	const updateSlide = (slideIndex, field, value) => {
		const updatedSlides = [...slides];
		updatedSlides[slideIndex] = {
			...updatedSlides[slideIndex],
			[field]: value
		};
		setAttributes({ slides: updatedSlides });
	};

	const addSlide = () => {
		const newSlide = {
			id: `slide-${Date.now()}`,
			type: 'content',
			title: `Slide ${slides.length + 1}`,
			subtitle: 'Subtitle here',
			description: 'Description for this slide...',
			imageUrl: '',
			imageAlt: '',
			buttonText: 'Learn More',
			buttonUrl: '#',
			backgroundColor: '#f8fafc',
			textColor: '#1f2937',
			overlayOpacity: 0.3,
			textAlignment: 'center',
			featured: false
		};
		setAttributes({ slides: [...slides, newSlide] });
	};

	const removeSlide = (slideIndex) => {
		const updatedSlides = slides.filter((_, index) => index !== slideIndex);
		setAttributes({ slides: updatedSlides });
		if (currentSlide >= updatedSlides.length) {
			setCurrentSlide(Math.max(0, updatedSlides.length - 1));
		}
	};

	const renderSlidePreview = (slide, index) => {
		const isActive = index === currentSlide;
		
		switch (layout) {
			case 'image-slider':
				return (
					<div 
						key={slide.id} 
						className={`slide-item relative overflow-hidden rounded-lg ${isActive ? 'block' : 'hidden'}`}
						style={{ 
							backgroundColor: slide.backgroundColor,
							minHeight: sliderHeight === 'auto' ? '400px' : sliderHeight
						}}
					>
						{slide.imageUrl && (
							<div className="slide-image absolute inset-0">
								<img 
									src={slide.imageUrl} 
									alt={slide.imageAlt}
									className="w-full h-full object-cover"
								/>
								<div 
									className="absolute inset-0 bg-black"
									style={{ opacity: slide.overlayOpacity }}
								></div>
							</div>
						)}
						<div className={`slide-content relative z-10 p-8 h-full flex flex-col justify-center text-${slide.textAlignment}`}>
							<div style={{ color: slide.textColor }}>
								{slide.subtitle && (
									<p className="text-sm uppercase tracking-wide mb-2 opacity-90">{slide.subtitle}</p>
								)}
								<h3 className="text-3xl font-bold mb-4">{slide.title}</h3>
								<p className="text-lg mb-6 opacity-90">{slide.description}</p>
								{slide.buttonText && (
									<div className="slide-button">
										<div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
											{slide.buttonText}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				);

			case 'content-cards':
				return (
					<div 
						key={slide.id} 
						className={`slide-item bg-white rounded-lg shadow-lg overflow-hidden ${isActive ? 'block' : 'hidden'}`}
					>
						<div className="flex flex-col md:flex-row">
							{slide.imageUrl && (
								<div className="md:w-1/2">
									<img 
										src={slide.imageUrl} 
										alt={slide.imageAlt}
										className="w-full h-64 md:h-full object-cover"
									/>
								</div>
							)}
							<div className={`${slide.imageUrl ? 'md:w-1/2' : 'w-full'} p-8 flex flex-col justify-center`}>
								<div style={{ color: slide.textColor }}>
									{slide.subtitle && (
										<p className="text-sm text-blue-600 font-medium mb-2">{slide.subtitle}</p>
									)}
									<h3 className="text-2xl font-bold mb-4">{slide.title}</h3>
									<p className="text-gray-600 mb-6">{slide.description}</p>
									{slide.buttonText && (
										<div className="slide-button">
											<div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
												{slide.buttonText}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				);

			case 'testimonial-slider':
				return (
					<div 
						key={slide.id} 
						className={`slide-item text-center p-8 ${isActive ? 'block' : 'hidden'}`}
						style={{ backgroundColor: slide.backgroundColor }}
					>
						<div style={{ color: slide.textColor }}>
							<div className="text-4xl mb-6">💬</div>
							<blockquote className="text-xl italic mb-6">"{slide.description}"</blockquote>
							{slide.imageUrl && (
								<img 
									src={slide.imageUrl} 
									alt={slide.imageAlt}
									className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
								/>
							)}
							<h4 className="font-semibold text-lg">{slide.title}</h4>
							{slide.subtitle && (
								<p className="text-sm opacity-75">{slide.subtitle}</p>
							)}
						</div>
					</div>
				);

			case 'feature-showcase':
				return (
					<div 
						key={slide.id} 
						className={`slide-item text-center p-8 ${isActive ? 'block' : 'hidden'}`}
						style={{ backgroundColor: slide.backgroundColor }}
					>
						<div style={{ color: slide.textColor }}>
							{slide.imageUrl && (
								<div className="mb-6">
									<img 
										src={slide.imageUrl} 
										alt={slide.imageAlt}
										className="w-20 h-20 mx-auto object-contain"
									/>
								</div>
							)}
							<h3 className="text-2xl font-bold mb-4">{slide.title}</h3>
							{slide.subtitle && (
								<p className="text-lg font-medium mb-4 opacity-90">{slide.subtitle}</p>
							)}
							<p className="text-gray-600 mb-6">{slide.description}</p>
							{slide.featured && (
								<div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium mb-4">
									Featured
								</div>
							)}
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	// Block-specific controls
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

			<PanelBody title={__('⚙️ Slider Settings', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Section Header', 'tailwind-starter')}
						checked={showSectionHeader}
						onChange={(value) => setAttributes({ showSectionHeader: value })}
					/>

	

					<ToggleControl
						label={__('Autoplay', 'tailwind-starter')}
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
					/>

					{autoplay && (
						<RangeControl
							label={__('Autoplay Delay (ms)', 'tailwind-starter')}
							value={autoplayDelay}
							onChange={(value) => setAttributes({ autoplayDelay: value })}
							min={1000}
							max={10000}
							step={500}
						/>
					)}

					<ToggleControl
						label={__('Show Navigation', 'tailwind-starter')}
						checked={showNavigation}
						onChange={(value) => setAttributes({ showNavigation: value })}
					/>

					<ToggleControl
						label={__('Show Pagination', 'tailwind-starter')}
						checked={showPagination}
						onChange={(value) => setAttributes({ showPagination: value })}
					/>

					<ToggleControl
						label={__('Loop', 'tailwind-starter')}
						checked={loop}
						onChange={(value) => setAttributes({ loop: value })}
					/>

					<ToggleControl
						label={__('Pause on Hover', 'tailwind-starter')}
						checked={pauseOnHover}
						onChange={(value) => setAttributes({ pauseOnHover: value })}
					/>

					<RangeControl
						label={__('Slides Per View', 'tailwind-starter')}
						value={slidesPerView}
						onChange={(value) => setAttributes({ slidesPerView: value })}
						min={1}
						max={5}
					/>

					<RangeControl
						label={__('Space Between (px)', 'tailwind-starter')}
						value={spaceBetween}
						onChange={(value) => setAttributes({ spaceBetween: value })}
						min={0}
						max={100}
						step={5}
					/>

					<SelectControl
						label={__('Effect', 'tailwind-starter')}
						value={effect}
						onChange={(value) => setAttributes({ effect: value })}
						options={[
							{ label: 'Slide', value: 'slide' },
							{ label: 'Fade', value: 'fade' },
							{ label: 'Cube', value: 'cube' },
							{ label: 'Coverflow', value: 'coverflow' }
						]}
					/>

					<RangeControl
						label={__('Speed (ms)', 'tailwind-starter')}
						value={speed}
						onChange={(value) => setAttributes({ speed: value })}
						min={300}
						max={2000}
						step={100}
	/>

					<SelectControl
						label={__('Slider Height', 'tailwind-starter')}
						value={sliderHeight}
						onChange={(value) => setAttributes({ sliderHeight: value })}
						options={[
							{ label: 'Auto', value: 'auto' },
							{ label: '300px', value: '300px' },
							{ label: '400px', value: '400px' },
							{ label: '500px', value: '500px' },
							{ label: '600px', value: '600px' }
						]}
					/>
			</PanelBody>

			<PanelBody title={__('📊 Slides Management', 'tailwind-starter')} initialOpen={false}>
					<div className="mb-4">
						<label className="block text-sm font-medium mb-2">Current Slide Preview</label>
						<div className="flex space-x-2 mb-4">
							{slides.map((slide, index) => (
								<div
									key={slide.id}
									className={`w-3 h-3 rounded-full cursor-pointer ${
										index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
									}`}
									onClick={() => setCurrentSlide(index)}
								/>
							))}
						</div>
					</div>

					{slides.map((slide, index) => (
						<div key={slide.id} className="mb-6 p-4 border rounded">
							<div className="flex justify-between items-center mb-2">
								<strong>Slide {index + 1}</strong>
								<div className="flex space-x-2">
									<Button
										isSecondary
										isSmall
										onClick={() => updateSlide(index, 'featured', !slide.featured)}
									>
										{slide.featured ? 'Unfeature' : 'Feature'}
									</Button>
									<Button
										isDestructive
										isSmall
										onClick={() => removeSlide(index)}
									>
										Remove
									</Button>
								</div>
							</div>
							
							<TextControl
								label="Title"
								value={slide.title}
								onChange={(value) => updateSlide(index, 'title', value)}
							/>
							
							<TextControl
								label="Subtitle"
								value={slide.subtitle}
								onChange={(value) => updateSlide(index, 'subtitle', value)}
							/>
							
							<TextareaControl
								label="Description"
								value={slide.description}
								onChange={(value) => updateSlide(index, 'description', value)}
								rows={3}
							/>

							<div className="flex space-x-2">
								<TextControl
									label="Button Text"
									value={slide.buttonText}
									onChange={(value) => updateSlide(index, 'buttonText', value)}
								/>
								<TextControl
									label="Button URL"
									value={slide.buttonUrl}
									onChange={(value) => updateSlide(index, 'buttonUrl', value)}
								/>
							</div>

							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										updateSlide(index, 'imageUrl', media.url);
										updateSlide(index, 'imageAlt', media.alt);
									}}
									allowedTypes={['image']}
									value={slide.imageUrl}
									render={({ open }) => (
										<div className="mt-2">
											<Button onClick={open} isSecondary>
												{slide.imageUrl ? 'Change Image' : 'Select Image'}
											</Button>
											{slide.imageUrl && (
												<div className="mt-2">
													<img 
														src={slide.imageUrl} 
														alt={slide.imageAlt}
														className="w-20 h-20 object-cover rounded"
													/>
													<Button
														onClick={() => {
															updateSlide(index, 'imageUrl', '');
															updateSlide(index, 'imageAlt', '');
														}}
														isDestructive
														isSmall
														className="ml-2"
													>
														Remove
													</Button>
												</div>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>

							<div className="mt-2">
								<label className="block text-sm font-medium mb-1">Background Color</label>
								<ColorPicker
									color={slide.backgroundColor}
									onChange={(color) => updateSlide(index, 'backgroundColor', color)}
								/>
							</div>

							<div className="mt-2">
								<label className="block text-sm font-medium mb-1">Text Color</label>
								<ColorPicker
									color={slide.textColor}
									onChange={(color) => updateSlide(index, 'textColor', color)}
								/>
							</div>

							<SelectControl
								label="Text Alignment"
								value={slide.textAlignment}
								onChange={(value) => updateSlide(index, 'textAlignment', value)}
								options={[
									{ label: 'Left', value: 'left' },
									{ label: 'Center', value: 'center' },
									{ label: 'Right', value: 'right' }
								]}
							/>

							<RangeControl
								label="Overlay Opacity"
								value={slide.overlayOpacity}
								onChange={(value) => updateSlide(index, 'overlayOpacity', value)}
								min={0}
								max={1}
								step={0.1}
							/>
						</div>
					))}
					
					<Button
						isPrimary
						onClick={addSlide}
					>
						Add Slide
					</Button>
			</PanelBody>
		</>
	)

	// General visual controls
	const generalControls = (
		<>
			<PanelBody title={__('📱 Responsive Design', 'tailwind-starter')} initialOpen={true}>
				<UltimateDeviceSelector
					activeDevice={activeDevice}
					onChange={(device) => setAttributes({ activeDevice: device })}
				/>
				<div style={{ 
					background: '#f0f9ff', 
					border: '1px solid #bae6fd', 
					borderRadius: '8px', 
					padding: '12px', 
					margin: '12px 0',
					fontSize: '12px',
					color: '#1e40af'
				}}>
					<strong>💡 Pro Tip:</strong> Start with "All" devices for your base design, then customize for mobile/tablet as needed!
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
				blockSpacing={settings?.blockSpacing || {}}
				onBlockSpacingChange={(blockSpacing) => setAttributes({
					settings: { ...(settings || {}), blockSpacing }
				})}
				background={settings?.backgroundColor}
				onBackgroundChange={(backgroundColor) => setAttributes({
					settings: { ...(settings || {}), backgroundColor }
				})}
				textColor={settings?.textColor}
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
				presets={presets}
				onPresetApply={handlePresetApply}
				onResetAll={() => {
					setAttributes({ 
						settings: {
							spacing: {},
							margins: {},
							blockSpacing: {},
							typography: {},
							layout: {},
							effects: {},
							gradients: {},
							backgroundColor: '',
							textColor: ''
						}
					})
				}}
			/>

			<PanelBody title={__('🚀 Advanced', 'tailwind-starter')} initialOpen={false}>
				<div style={{
					background: '#f0f9ff',
					border: '1px solid #bae6fd',
					borderRadius: '6px',
					padding: '12px',
					fontSize: '12px'
				}}>
					<strong>💎 Generated Classes:</strong>
					<br />
					<code style={{ wordBreak: 'break-all', fontSize: '10px' }}>
						{allClasses || 'No custom styles yet'}
					</code>
				</div>
			</PanelBody>
		</>
	)

	return (
		<>
			<InspectorControls>
				<SimpleInspectorTabs
					variant="horizontal"
					blockControls={blockControls}
					generalControls={generalControls}
					initialTab="block"
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

				<div className="slider-container relative">
					<div className="slider-wrapper">
						{slides.map((slide, index) => renderSlidePreview(slide, index))}
					</div>

					{showNavigation && slides.length > 1 && (
						<div className="slider-navigation">
							<div 
								className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer z-10"
								onClick={() => setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : slides.length - 1)}
							>
								<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
							</div>
							<div 
								className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer z-10"
								onClick={() => setCurrentSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0)}
							>
								<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</div>
					)}

					{showPagination && slides.length > 1 && (
						<div className="slider-pagination flex justify-center space-x-2 mt-6">
							{slides.map((_, index) => (
								<div
									key={index}
									className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
										index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
									}`}
									onClick={() => setCurrentSlide(index)}
								/>
							))}
						</div>
					)}
				</div>

			</div>
		</>
	);
} 