import { useBlockProps, RichText } from '@wordpress/block-editor';
import { generateAllClasses } from '../../utils/visual-controls.js';

export default function save({ attributes }) {
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
		settings,
		activeDevice
	} = attributes;

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings);

	const blockProps = useBlockProps.save({
		className: `testimonial-showcase testimonial-${layout}`,
		'data-classes': allClasses,
		'data-attributes': JSON.stringify({
			layout,
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
			enableVideoTestimonials
		})
	});

	// Filter and sort testimonials
	const filteredTestimonials = testimonials
		.filter(testimonial => testimonial.content && testimonial.content.trim())
		.sort((a, b) => {
			if (featuredFirst) {
				if (a.featured && !b.featured) return -1;
				if (!a.featured && b.featured) return 1;
			}
			return 0;
		});

	// Get unique categories for frontend filtering
	const categories = [...new Set(testimonials.map(testimonial => testimonial.category))];

	const getGridColumns = () => {
		switch (columns) {
			case 1: return 'grid-cols-1';
			case 2: return 'grid-cols-1 md:grid-cols-2';
			case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
			case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
			default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
		}
	};

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
			rounded-lg p-6 transition-all duration-300 testimonial-hover`;

		return (
			<div 
				key={testimonial.id} 
				className={cardClasses}
				data-category={testimonial.category}
				data-featured={testimonial.featured ? 'true' : 'false'}
				data-rating={testimonial.rating}
			>
				{testimonial.featured && (
					<div className="featured-badge absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
						Featured
					</div>
				)}

				{quoteStyle === 'classic' && (
					<div className="quote-mark text-6xl text-gray-200 leading-none mb-4" aria-hidden="true">"</div>
				)}

				<div className={`testimonial-content mb-6 ${textAlignment === 'center' ? 'text-center' : 
					textAlignment === 'right' ? 'text-right' : 'text-left'}`}>
					{showRatings && (
						<div className="rating mb-4 flex justify-center" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
							{renderStars(testimonial.rating)}
						</div>
					)}

					<blockquote className="text-gray-700 italic text-lg leading-relaxed" role="text">
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
									alt={testimonial.authorImageAlt || `${testimonial.authorName} - ${testimonial.authorTitle}`}
									className="w-12 h-12 rounded-full object-cover"
									loading="lazy"
								/>
							) : (
								<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
									<span className="text-gray-400 text-lg" aria-hidden="true">👤</span>
								</div>
							)}
						</div>
					)}

					<div className="author-details">
						<div className="author-name font-semibold text-gray-900">{testimonial.authorName}</div>
						<div className="author-title text-sm text-gray-600">{testimonial.authorTitle}</div>
						{showCompany && testimonial.authorCompany && (
							<div className="author-company text-sm text-blue-600">{testimonial.authorCompany}</div>
						)}
						{showLocation && testimonial.location && (
							<div className="author-location text-xs text-gray-500">
								<span aria-hidden="true">📍</span> {testimonial.location}
							</div>
						)}
						{showDate && testimonial.date && (
							<div className="testimonial-date text-xs text-gray-500">
								{new Date(testimonial.date).toLocaleDateString()}
							</div>
						)}
					</div>

					{showVerifiedBadge && testimonial.verified && (
						<div className="verified-badge ml-auto">
							<span className="text-green-500 text-sm flex items-center">
								<span aria-hidden="true">✓</span>
								<span className="ml-1">Verified</span>
							</span>
						</div>
					)}
				</div>

				{enableVideoTestimonials && testimonial.videoUrl && (
					<div className="video-testimonial mt-4">
						<div className="video-preview bg-gray-900 rounded-lg relative overflow-hidden aspect-video">
							<button 
								className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-all duration-300 group"
								data-video-url={testimonial.videoUrl}
								aria-label={`Play video testimonial from ${testimonial.authorName}`}
							>
								<div className="bg-white rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
									<span className="text-gray-900 text-2xl" aria-hidden="true">▶</span>
								</div>
							</button>
							<div className="absolute bottom-4 left-4 right-4">
								<p className="text-white text-sm">
									<span aria-hidden="true">🎥</span> Video testimonial from {testimonial.authorName}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	if (filteredTestimonials.length === 0) {
		return (
			<div {...blockProps}>
				<div className="empty-state text-center py-8">
					<div className="text-gray-400 text-lg mb-2" aria-hidden="true">💬</div>
					<p className="text-gray-500">No testimonials to display.</p>
				</div>
			</div>
		);
	}

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

					{showAverageRating && (
						<div className="average-rating mt-4 flex items-center justify-center space-x-2">
							<div className="rating-stars flex" role="img" aria-label={`Average rating: ${averageRating} out of 5 stars`}>
								{renderStars(Math.floor(averageRating))}
							</div>
							<span className="rating-text text-lg font-medium">{averageRating}</span>
							<span className="review-count text-gray-600">({totalReviews} reviews)</span>
						</div>
					)}
				</div>
			)}

			{categoryFiltering && categories.length > 1 && (
				<div className="category-filters text-center mb-8">
					<div className="inline-flex space-x-2 bg-gray-100 p-1 rounded-lg">
						<button 
							className="filter-btn active px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm"
							data-category="all"
							aria-label="Show all testimonials"
						>
							All
						</button>
						{categories.map(category => (
							<button 
								key={category}
								className="filter-btn px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
								data-category={category}
								aria-label={`Filter by ${category} testimonials`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			)}

			{layout === 'quotes-carousel' ? (
				<div className="testimonials-carousel relative" data-auto-rotate={autoRotate} data-rotation-speed={rotationSpeed}>
					<div className="carousel-container overflow-hidden">
						<div className="carousel-track flex transition-transform duration-500">
							{filteredTestimonials.map((testimonial, index) => (
								<div key={testimonial.id} className="carousel-slide w-full flex-shrink-0">
									{renderTestimonialCard(testimonial, index)}
								</div>
							))}
						</div>
					</div>
					
					{filteredTestimonials.length > 1 && (
						<>
							<button 
								className="carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
								aria-label="Previous testimonial"
							>
								<span aria-hidden="true">←</span>
							</button>
							<button 
								className="carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
								aria-label="Next testimonial"
							>
								<span aria-hidden="true">→</span>
							</button>
							
							<div className="carousel-indicators flex justify-center mt-4 space-x-2">
								{filteredTestimonials.map((_, index) => (
									<button
										key={index}
										className={`indicator w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
										data-slide={index}
										aria-label={`Go to testimonial ${index + 1}`}
									></button>
								))}
							</div>
						</>
					)}
				</div>
			) : layout === 'masonry-layout' ? (
				<div className="testimonials-masonry columns-1 md:columns-2 lg:columns-3 gap-6">
					{filteredTestimonials.map((testimonial, index) => (
						<div key={testimonial.id} className="break-inside-avoid mb-6">
							{renderTestimonialCard(testimonial, index)}
						</div>
					))}
				</div>
			) : layout === 'single-featured' ? (
				<div className="testimonials-single">
					{filteredTestimonials.slice(0, 1).map((testimonial, index) => (
						<div key={testimonial.id} className="featured-testimonial max-w-4xl mx-auto">
							{renderTestimonialCard(testimonial, index)}
						</div>
					))}
					
					{filteredTestimonials.length > 1 && (
						<div className="other-testimonials grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
							{filteredTestimonials.slice(1, 4).map((testimonial, index) => (
								<div key={testimonial.id} className="mini-testimonial">
									{renderTestimonialCard(testimonial, index + 1)}
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				<div className={`testimonials-container grid gap-6 ${getGridColumns()}`}>
					{filteredTestimonials.map((testimonial, index) => renderTestimonialCard(testimonial, index))}
				</div>
			)}

			{categoryFiltering && (
				<div className="empty-filter-state text-center py-8 hidden">
					<div className="text-gray-400 text-lg mb-2" aria-hidden="true">🔍</div>
					<p className="text-gray-500">No testimonials found in this category.</p>
				</div>
			)}
		</div>
	);
} 