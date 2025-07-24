import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	Button,
	RangeControl,
	TextareaControl,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		testimonials,
		columns,
		showRatings,
		showAuthorImages,
		showCompany,
		showLocation,
		showDate,
		showVerifiedBadge,
		useExcerpts,
		categoryFiltering,
		featuredFirst,
		autoRotate,
		rotationSpeed,
		cardStyle,
		quoteStyle,
		ratingStyle,
		textAlignment,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		enableVideoTestimonials,
		averageRating,
		totalReviews,
		showAverageRating,
		settings = {},
		activeDevice
	} = attributes;

	const [editingTestimonial, setEditingTestimonial] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState('all');

	// Enhanced preset styles for testimonials
	const presets = {
		professional: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-center' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		modern: {
			spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-medium', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
			textColor: 'text-gray-800',
			gradients: {},
			layout: {},
			effects: {}
		},
		minimal: {
			spacing: { base: { top: 6, right: 2, bottom: 6, left: 2 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-light', textAlign: 'text-left' } },
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
		className: `testimonial-showcase testimonial-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'cards-grid', icon: '📝', name: 'Cards Grid', desc: 'Card-style testimonials in grid' },
		{ key: 'quotes-carousel', icon: '💬', name: 'Quotes Carousel', desc: 'Rotating large quotes' },
		{ key: 'masonry-layout', icon: '🧱', name: 'Masonry Layout', desc: 'Pinterest-style layout' },
		{ key: 'single-featured', icon: '⭐', name: 'Single Featured', desc: 'One large testimonial' },
		{ key: 'split-content', icon: '📐', name: 'Split Content', desc: 'Content and testimonials side by side' },
		{ key: 'video-testimonials', icon: '🎥', name: 'Video Testimonials', desc: 'Video-focused layout' }
	];

	const updateTestimonial = (testimonialIndex, field, value) => {
		const updatedTestimonials = [...testimonials];
		updatedTestimonials[testimonialIndex] = {
			...updatedTestimonials[testimonialIndex],
			[field]: value
		};
		setAttributes({ testimonials: updatedTestimonials });
	};

	const addTestimonial = () => {
		const newTestimonial = {
			id: `testimonial-${Date.now()}`,
			content: 'Amazing product! It has completely transformed our business processes and improved our efficiency.',
			excerpt: 'Amazing product! It has completely transformed our business...',
			authorName: 'New Customer',
			authorTitle: 'Position Title',
			authorCompany: 'Company Name',
			authorImageUrl: '',
			authorImageAlt: '',
			rating: 5,
			category: 'General',
			featured: false,
			videoUrl: '',
			verified: true,
			date: new Date().toISOString().split('T')[0],
			location: 'City, State'
		};
		setAttributes({ testimonials: [...testimonials, newTestimonial] });
	};

	const removeTestimonial = (testimonialIndex) => {
		const updatedTestimonials = testimonials.filter((_, index) => index !== testimonialIndex);
		setAttributes({ testimonials: updatedTestimonials });
	};

	// Get unique categories for filtering
	const categories = [...new Set(testimonials.map(testimonial => testimonial.category))];

	// Filter and sort testimonials
	const filteredTestimonials = testimonials
		.filter(testimonial => !categoryFiltering || selectedCategory === 'all' || testimonial.category === selectedCategory)
		.sort((a, b) => {
			if (featuredFirst) {
				if (a.featured && !b.featured) return -1;
				if (!a.featured && b.featured) return 1;
			}
			return 0;
		});

	const renderStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<span key={i} className={`star ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
					★
				</span>
			);
		}
		return stars;
	};

	const renderTestimonialCard = (testimonial, index) => {
		const cardClasses = `testimonial-card ${cardStyle === 'elevated' ? 'bg-white shadow-lg' : 
			cardStyle === 'bordered' ? 'bg-white border border-gray-200' : 'bg-transparent'} 
			rounded-lg p-6 transition-all duration-300 hover:shadow-xl`;

		return (
			<div key={testimonial.id} className={cardClasses}>
				{testimonial.featured && (
					<div className="featured-badge absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
						Featured
					</div>
				)}

				{quoteStyle === 'classic' && (
					<div className="quote-mark text-6xl text-gray-200 leading-none mb-4">"</div>
				)}

				<div className={`testimonial-content mb-6 text-${textAlignment}`}>
					{showRatings && (
						<div className="rating mb-4 flex justify-center">
							{renderStars(testimonial.rating)}
						</div>
					)}

					<blockquote className="text-gray-700 italic text-lg leading-relaxed">
						{useExcerpts ? testimonial.excerpt : testimonial.content}
					</blockquote>
				</div>

				<div className={`author-info flex items-center ${textAlignment === 'center' ? 'justify-center' : 
					textAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
					{showAuthorImages && (
						<div className="author-image mr-4">
							{testimonial.authorImageUrl ? (
								<img 
									src={testimonial.authorImageUrl} 
									alt={testimonial.authorImageAlt}
									className="w-12 h-12 rounded-full object-cover"
								/>
							) : (
								<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
									<span className="text-gray-400 text-lg">👤</span>
								</div>
							)}
						</div>
					)}

					<div className="author-details">
						<div className="author-name font-semibold text-gray-900">{testimonial.authorName}</div>
						<div className="author-title text-sm text-gray-600">{testimonial.authorTitle}</div>
						{showCompany && (
							<div className="author-company text-sm text-blue-600">{testimonial.authorCompany}</div>
						)}
						{showLocation && (
							<div className="author-location text-xs text-gray-500">{testimonial.location}</div>
						)}
						{showDate && (
							<div className="testimonial-date text-xs text-gray-500">
								{new Date(testimonial.date).toLocaleDateString()}
							</div>
						)}
					</div>

					{showVerifiedBadge && testimonial.verified && (
						<div className="verified-badge ml-auto">
							<span className="text-green-500 text-sm">✓ Verified</span>
						</div>
					)}
				</div>

				{enableVideoTestimonials && testimonial.videoUrl && (
					<div className="video-testimonial mt-4">
						<div className="video-placeholder bg-gray-200 rounded-lg p-4 text-center">
							<span className="text-gray-500">🎥 Video testimonial available</span>
						</div>
					</div>
				)}
			</div>
		);
	};

	const getGridColumns = () => {
		switch (columns) {
			case 1: return 'grid-cols-1';
			case 2: return 'grid-cols-1 md:grid-cols-2';
			case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
			case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
			default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
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

				<PanelBody title={__('⚙️ Display Settings', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Section Header', 'tailwind-starter')}
						checked={showSectionHeader}
						onChange={(value) => setAttributes({ showSectionHeader: value })}
					/>

					{showAverageRating && (
						<>
							<RangeControl
								label={__('Average Rating', 'tailwind-starter')}
								value={averageRating}
								onChange={(value) => setAttributes({ averageRating: value })}
								min={1}
								max={5}
								step={0.1}
							/>
							<RangeControl
								label={__('Total Reviews', 'tailwind-starter')}
								value={totalReviews}
								onChange={(value) => setAttributes({ totalReviews: value })}
								min={1}
								max={10000}
							/>
						</>
					)}

					<RangeControl
						label={__('Columns', 'tailwind-starter')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={4}
					/>

					<ToggleControl
						label={__('Show Ratings', 'tailwind-starter')}
						checked={showRatings}
						onChange={(value) => setAttributes({ showRatings: value })}
					/>

					<ToggleControl
						label={__('Show Author Images', 'tailwind-starter')}
						checked={showAuthorImages}
						onChange={(value) => setAttributes({ showAuthorImages: value })}
					/>

					<ToggleControl
						label={__('Show Company', 'tailwind-starter')}
						checked={showCompany}
						onChange={(value) => setAttributes({ showCompany: value })}
					/>

					<ToggleControl
						label={__('Show Location', 'tailwind-starter')}
						checked={showLocation}
						onChange={(value) => setAttributes({ showLocation: value })}
					/>

					<ToggleControl
						label={__('Show Date', 'tailwind-starter')}
						checked={showDate}
						onChange={(value) => setAttributes({ showDate: value })}
					/>

					<ToggleControl
						label={__('Show Verified Badge', 'tailwind-starter')}
						checked={showVerifiedBadge}
						onChange={(value) => setAttributes({ showVerifiedBadge: value })}
					/>

					<ToggleControl
						label={__('Use Excerpts', 'tailwind-starter')}
						checked={useExcerpts}
						onChange={(value) => setAttributes({ useExcerpts: value })}
					/>

					<ToggleControl
						label={__('Featured First', 'tailwind-starter')}
						checked={featuredFirst}
						onChange={(value) => setAttributes({ featuredFirst: value })}
					/>

					<ToggleControl
						label={__('Category Filtering', 'tailwind-starter')}
						checked={categoryFiltering}
						onChange={(value) => setAttributes({ categoryFiltering: value })}
					/>

					<ToggleControl
						label={__('Enable Video Testimonials', 'tailwind-starter')}
						checked={enableVideoTestimonials}
						onChange={(value) => setAttributes({ enableVideoTestimonials: value })}
					/>

					<ToggleControl
						label={__('Show Average Rating', 'tailwind-starter')}
						checked={showAverageRating}
						onChange={(value) => setAttributes({ showAverageRating: value })}
					/>

					<SelectControl
						label={__('Card Style', 'tailwind-starter')}
						value={cardStyle}
						onChange={(value) => setAttributes({ cardStyle: value })}
						options={[
							{ label: 'Elevated (Shadow)', value: 'elevated' },
							{ label: 'Bordered', value: 'bordered' },
							{ label: 'Flat', value: 'flat' }
						]}
					/>

					<SelectControl
						label={__('Quote Style', 'tailwind-starter')}
						value={quoteStyle}
						onChange={(value) => setAttributes({ quoteStyle: value })}
						options={[
							{ label: 'Modern', value: 'modern' },
							{ label: 'Classic (with quotes)', value: 'classic' },
							{ label: 'Minimal', value: 'minimal' }
						]}
					/>

					<SelectControl
						label={__('Rating Style', 'tailwind-starter')}
						value={ratingStyle}
						onChange={(value) => setAttributes({ ratingStyle: value })}
						options={[
							{ label: 'Stars', value: 'stars' },
							{ label: 'Numbers', value: 'numbers' },
							{ label: 'Text', value: 'text' }
						]}
					/>

					<SelectControl
						label={__('Text Alignment', 'tailwind-starter')}
						value={textAlignment}
						onChange={(value) => setAttributes({ textAlignment: value })}
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
					/>
				</PanelBody>

				{categoryFiltering && (
					<PanelBody title={__('🏷️ Category Filter', 'tailwind-starter')} initialOpen={false}>
						<SelectControl
							label={__('Filter by Category', 'tailwind-starter')}
							value={selectedCategory}
							onChange={(value) => setSelectedCategory(value)}
							options={[
								{ label: 'All Categories', value: 'all' },
								...categories.map(cat => ({ label: cat, value: cat }))
							]}
						/>
					</PanelBody>
				)}

				<PanelBody title={__('💬 Testimonial Management', 'tailwind-starter')} initialOpen={false}>
					{testimonials.map((testimonial, index) => (
						<div key={testimonial.id} className="mb-6 p-4 border rounded">
							<div className="flex justify-between items-center mb-2">
								<strong>{testimonial.authorName}</strong>
								<div className="flex space-x-2">
									<Button
										isSecondary
										isSmall
										onClick={() => updateTestimonial(index, 'featured', !testimonial.featured)}
									>
										{testimonial.featured ? 'Unfeature' : 'Feature'}
									</Button>
									<Button
										isDestructive
										isSmall
										onClick={() => removeTestimonial(index)}
									>
										Remove
									</Button>
								</div>
							</div>

							<TextareaControl
								label="Testimonial Content"
								value={testimonial.content}
								onChange={(value) => updateTestimonial(index, 'content', value)}
								rows={3}
							/>

							<TextareaControl
								label="Excerpt"
								value={testimonial.excerpt}
								onChange={(value) => updateTestimonial(index, 'excerpt', value)}
								rows={2}
							/>

							<div className="flex space-x-2">
								<TextControl
									label="Author Name"
									value={testimonial.authorName}
									onChange={(value) => updateTestimonial(index, 'authorName', value)}
								/>
								<TextControl
									label="Title"
									value={testimonial.authorTitle}
									onChange={(value) => updateTestimonial(index, 'authorTitle', value)}
								/>
							</div>

							<div className="flex space-x-2">
								<TextControl
									label="Company"
									value={testimonial.authorCompany}
									onChange={(value) => updateTestimonial(index, 'authorCompany', value)}
								/>
								<TextControl
									label="Category"
									value={testimonial.category}
									onChange={(value) => updateTestimonial(index, 'category', value)}
								/>
							</div>

							<TextControl
								label="Location"
								value={testimonial.location}
								onChange={(value) => updateTestimonial(index, 'location', value)}
							/>

							<RangeControl
								label="Rating"
								value={testimonial.rating}
								onChange={(value) => updateTestimonial(index, 'rating', value)}
								min={1}
								max={5}
							/>

							<ToggleControl
								label="Verified"
								checked={testimonial.verified}
								onChange={(value) => updateTestimonial(index, 'verified', value)}
							/>

							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										updateTestimonial(index, 'authorImageUrl', media.url);
										updateTestimonial(index, 'authorImageAlt', media.alt);
									}}
									allowedTypes={['image']}
									value={testimonial.authorImageUrl}
									render={({ open }) => (
										<div className="mt-2">
											<Button onClick={open} isSecondary>
												{testimonial.authorImageUrl ? 'Change Photo' : 'Select Photo'}
											</Button>
											{testimonial.authorImageUrl && (
												<div className="mt-2">
													<img 
														src={testimonial.authorImageUrl} 
														alt={testimonial.authorImageAlt}
														className="w-20 h-20 object-cover rounded"
													/>
													<Button
														onClick={() => {
															updateTestimonial(index, 'authorImageUrl', '');
															updateTestimonial(index, 'authorImageAlt', '');
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

							{enableVideoTestimonials && (
								<TextControl
									label="Video URL"
									value={testimonial.videoUrl}
									onChange={(value) => updateTestimonial(index, 'videoUrl', value)}
									placeholder="https://youtube.com/watch?v=..."
								/>
							)}
						</div>
					))}

					<Button
						isPrimary
						onClick={addTestimonial}
					>
						Add Testimonial
					</Button>
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
					background={settings?.backgroundColor || 'bg-gray-50'}
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
					activeDevice={activeDevice}
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

						{showAverageRating && (
							<div className="average-rating mt-4 flex items-center justify-center space-x-2">
								<div className="rating-stars flex">
									{renderStars(Math.floor(averageRating))}
								</div>
								<span className="rating-text text-lg font-medium">{averageRating}</span>
								<span className="review-count text-gray-600">({totalReviews} reviews)</span>
							</div>
						)}
					</div>
				)}

				<div className={`testimonials-container grid gap-6 ${getGridColumns()}`}>
					{filteredTestimonials.map((testimonial, index) => renderTestimonialCard(testimonial, index))}
				</div>

				{filteredTestimonials.length === 0 && (
					<div className="empty-state text-center py-8">
						<div className="text-gray-400 text-lg mb-2">💬</div>
						<p className="text-gray-500">No testimonials found for the selected criteria.</p>
					</div>
				)}
			</div>
		</>
	);
} 