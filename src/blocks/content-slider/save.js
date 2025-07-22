import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
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
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `content-slider slider-${layout}`,
		'data-autoplay': autoplay,
		'data-autoplay-delay': autoplayDelay,
		'data-show-navigation': showNavigation,
		'data-show-pagination': showPagination,
		'data-show-scrollbar': showScrollbar,
		'data-loop': loop,
		'data-slides-per-view': slidesPerView,
		'data-space-between': spaceBetween,
		'data-effect': effect,
		'data-speed': speed,
		'data-pause-on-hover': pauseOnHover,
		'data-centered-slides': centeredSlides,
		'data-free-mode': freeMode,
		'data-slider-height': sliderHeight,
		'data-navigation-style': navigationStyle,
		'data-pagination-style': paginationStyle
	});

	const renderSlide = (slide, index) => {
		switch (layout) {
			case 'image-slider':
				return (
					<div 
						key={slide.id} 
						className="swiper-slide relative overflow-hidden rounded-lg"
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
									loading="lazy"
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
								{slide.buttonText && slide.buttonUrl && (
									<div className="slide-button">
										<a 
											href={slide.buttonUrl}
											className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
										>
											{slide.buttonText}
										</a>
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
						className="swiper-slide bg-white rounded-lg shadow-lg overflow-hidden"
					>
						<div className="flex flex-col md:flex-row h-full">
							{slide.imageUrl && (
								<div className="md:w-1/2">
									<img 
										src={slide.imageUrl} 
										alt={slide.imageAlt}
										className="w-full h-64 md:h-full object-cover"
										loading="lazy"
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
									{slide.buttonText && slide.buttonUrl && (
										<div className="slide-button">
											<a 
												href={slide.buttonUrl}
												className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
											>
												{slide.buttonText}
											</a>
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
						className="swiper-slide text-center p-8"
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
									loading="lazy"
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
						className="swiper-slide text-center p-8"
						style={{ backgroundColor: slide.backgroundColor }}
					>
						<div style={{ color: slide.textColor }}>
							{slide.imageUrl && (
								<div className="mb-6">
									<img 
										src={slide.imageUrl} 
										alt={slide.imageAlt}
										className="w-20 h-20 mx-auto object-contain"
										loading="lazy"
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
							{slide.buttonText && slide.buttonUrl && (
								<div className="slide-button">
									<a 
										href={slide.buttonUrl}
										className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
									>
										{slide.buttonText}
									</a>
								</div>
							)}
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div {...blockProps}>
			{showSectionHeader && (
				<div className="section-header text-center mb-8">
					<RichText.Content
						tagName="h2"
						value={sectionTitle}
						className="text-3xl font-bold mb-2"
					/>
					<RichText.Content
						tagName="p"
						value={sectionSubtitle}
						className="text-gray-600 text-lg"
					/>
				</div>
			)}

			<div className="slider-container relative">
				<div className="swiper">
					<div className="swiper-wrapper">
						{slides.map((slide, index) => renderSlide(slide, index))}
					</div>

					{showNavigation && (
						<>
							<div className="swiper-button-prev"></div>
							<div className="swiper-button-next"></div>
						</>
					)}

					{showPagination && (
						<div className="swiper-pagination"></div>
					)}

					{showScrollbar && (
						<div className="swiper-scrollbar"></div>
					)}
				</div>
			</div>
		</div>
	);
} 