import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		layout,
		testimonials,
		logos,
		trustBadges,
		showRatings,
		showAvatars,
		autoplay,
		autoplaySpeed,
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `social-proof social-${layout}`
	});

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => (
			<svg
				key={i}
				className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		));
	};

	const getIconSvg = (iconType) => {
		const icons = {
			shield: <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
			check: <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
		};
		return icons[iconType] || icons.check;
	};

	return (
		<div {...blockProps}>
			{layout === 'testimonial-carousel' && (
				<div 
					className="testimonial-carousel swiper"
					data-autoplay={autoplay}
					data-autoplay-speed={autoplaySpeed}
				>
					<div className="swiper-wrapper">
						{testimonials.map((testimonial, index) => (
							<div key={testimonial.id} className="swiper-slide">
								<div className="testimonial-slide bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
									{showRatings && (
										<div className="flex justify-center mb-4">
											{renderStars(testimonial.rating)}
										</div>
									)}
									<RichText.Content
										tagName="blockquote"
										className="text-lg mb-6 italic"
										value={testimonial.content}
									/>
									<div className="testimonial-author flex items-center justify-center">
										{showAvatars && testimonial.avatar && (
											<img 
												src={testimonial.avatar.url} 
												alt={testimonial.name}
												className="w-12 h-12 rounded-full mr-4"
											/>
										)}
										<div>
											<div className="font-semibold">{testimonial.name}</div>
											<div className="text-sm text-gray-600">
												{testimonial.position}, {testimonial.company}
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="swiper-pagination"></div>
					<div className="swiper-button-next"></div>
					<div className="swiper-button-prev"></div>
				</div>
			)}

			{layout === 'review-cards' && (
				<div className="review-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) => (
						<div key={testimonial.id} className="review-card bg-white p-6 rounded-lg shadow-md">
							{showRatings && (
								<div className="flex mb-3">
									{renderStars(testimonial.rating)}
								</div>
							)}
							<RichText.Content
								tagName="p"
								className="text-gray-600 mb-4"
								value={testimonial.content}
							/>
							<div className="reviewer flex items-center">
								{showAvatars && testimonial.avatar && (
									<img 
										src={testimonial.avatar.url} 
										alt={testimonial.name}
										className="w-10 h-10 rounded-full mr-3"
									/>
								)}
								<div>
									<div className="font-medium text-sm">{testimonial.name}</div>
									<div className="text-xs text-gray-500">{testimonial.company}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{layout === 'logo-grid' && (
				<div className="logo-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
					{logos.map((logo, index) => (
						<div key={logo.id} className="logo-item text-center">
							{logo.url !== '#' ? (
								<a href={logo.url} target="_blank" rel="noopener noreferrer">
									{logo.image ? (
										<img 
											src={logo.image.url} 
											alt={logo.name}
											className="h-12 mx-auto opacity-60 hover:opacity-100 transition-opacity"
										/>
									) : (
										<div className="h-12 bg-gray-200 rounded flex items-center justify-center">
											<span className="text-xs text-gray-500">{logo.name}</span>
										</div>
									)}
								</a>
							) : (
								logo.image ? (
									<img 
										src={logo.image.url} 
										alt={logo.name}
										className="h-12 mx-auto opacity-60 hover:opacity-100 transition-opacity"
									/>
								) : (
									<div className="h-12 bg-gray-200 rounded flex items-center justify-center">
										<span className="text-xs text-gray-500">{logo.name}</span>
									</div>
								)
							)}
						</div>
					))}
				</div>
			)}

			{layout === 'trust-badges' && (
				<div className="trust-badges flex flex-wrap justify-center gap-8">
					{trustBadges.map((badge, index) => (
						<div key={badge.id} className="trust-badge flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
							{getIconSvg(badge.icon)}
							<div>
								<div className="font-semibold text-sm">{badge.name}</div>
								<div className="text-xs text-gray-600">{badge.description}</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}