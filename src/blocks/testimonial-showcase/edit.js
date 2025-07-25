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
	
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses, TestimonialsManagementModal } from '../../utils/visual-controls.js';
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
	const [isTestimonialsModalOpen, setIsTestimonialsModalOpen] = useState(false);


	// Generate classes for all devices
	const allClasses = generateAllClasses(settings || {});

	// Generate preview classes (just base for editor)
	const previewClasses = generateAllClasses(settings || {});

	const blockProps = useBlockProps({
		className: `testimonial-showcase testimonial-showcase--${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'grid', icon: '📝', name: 'Grid Layout', desc: 'Standard testimonials grid' },
		{ key: 'carousel', icon: '💬', name: 'Carousel', desc: 'Sliding testimonials' },
		{ key: 'masonry', icon: '🧱', name: 'Masonry', desc: 'Staggered layout' }
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
		const cardClasses = `testimonial-card transition-all duration-300 ${
			cardStyle === 'elevated' ? 'testimonial-card-elevated rounded-lg shadow-lg hover:shadow-xl p-6' :
			cardStyle === 'bordered' ? 'testimonial-card-bordered rounded-lg border-2 p-6' :
			cardStyle === 'minimal' ? 'p-6' :
			cardStyle === 'gradient' ? 'testimonial-card-gradient rounded-lg shadow-md hover:shadow-lg p-6' :
			'rounded-lg shadow-md hover:shadow-lg p-6'
		}`;

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

				{showRatings && (
					<div className="testimonial-rating mb-4">
						<div className="star-rating flex items-center">
							{renderStars(testimonial.rating)}
						</div>
					</div>
				)}
				
				<div className="testimonial-content mb-6">
					{quoteStyle === 'blockquote' ? (
						<blockquote className="text-lg italic leading-relaxed opacity-85">
							"{useExcerpts ? testimonial.excerpt : testimonial.content}"
						</blockquote>
					) : (
						<div className="text-lg leading-relaxed opacity-85">
							"{useExcerpts ? testimonial.excerpt : testimonial.content}"
						</div>
					)}
				</div>

				<div className="testimonial-author flex items-center">
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
						<div className="author-name font-semibold flex items-center">
							{testimonial.authorName}
							{showVerifiedBadge && testimonial.verified && (
								<span className="ml-2" title="Verified Customer" style={{color: 'currentColor', opacity: 0.8}}>
									<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
									</svg>
								</span>
							)}
						</div>
						<div className="author-title text-sm opacity-75">{testimonial.authorTitle}</div>
						{showCompany && (
							<div className="author-company text-sm opacity-75">{testimonial.authorCompany}</div>
						)}
						{showLocation && (
							<div className="author-location text-sm opacity-60">
								📍 {testimonial.location}
							</div>
						)}
						{showDate && (
							<div className="testimonial-date text-sm opacity-60">
								{new Date(testimonial.date).toLocaleDateString()}
							</div>
						)}
					</div>

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
					<div style={{ 
						textAlign: 'center', 
						padding: '20px',
						backgroundColor: '#f8f9fa',
						borderRadius: '8px',
						border: '2px dashed #f59e0b'
					}}>
						<div style={{ marginBottom: '12px', fontSize: '24px' }}>💬</div>
						<div style={{ marginBottom: '8px', fontWeight: '600', color: '#1e1e1e' }}>
							{testimonials.length} Testimonial{testimonials.length !== 1 ? 's' : ''} Configured
						</div>
						<div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
							Manage your testimonials in an organized modal window
						</div>
						<Button
							isPrimary
							onClick={() => setIsTestimonialsModalOpen(true)}
							style={{
								background: 'linear-gradient(45deg, #f59e0b, #d97706)',
								border: 'none',
								borderRadius: '6px',
								padding: '8px 16px',
								fontWeight: '600'
							}}
						>
							🚀 Open Testimonials Manager
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
					<div className="section-header text-center mb-12">
						<RichText
							tagName="h2"
							value={sectionTitle}
							onChange={(value) => setAttributes({ sectionTitle: value })}
							placeholder="Section Title..."
							className="text-3xl font-bold mb-4"
						/>
						<RichText
							tagName="p"
							value={sectionSubtitle}
							onChange={(value) => setAttributes({ sectionSubtitle: value })}
							placeholder="Section subtitle..."
							className="text-lg opacity-75 max-w-3xl mx-auto"
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

			{/* Testimonials Management Modal */}
			{isTestimonialsModalOpen && (
				<TestimonialsManagementModal
					isOpen={isTestimonialsModalOpen}
					onClose={() => setIsTestimonialsModalOpen(false)}
					testimonials={testimonials}
					onTestimonialsChange={(newTestimonials) => setAttributes({ testimonials: newTestimonials })}
				/>
			)}
		</>
	);
} 