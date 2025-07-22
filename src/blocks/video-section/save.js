import { useBlockProps, RichText } from '@wordpress/block-editor';
import { generateAllClasses } from '../../utils/visual-controls.js';

export default function save({ attributes }) {
	const {
		layout,
		videos,
		backgroundVideo,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		overlayContent,
		playerStyle,
		thumbnailStyle,
		hoverEffect,
		showPlayButton,
		showDuration,
		showTitle,
		showDescription,
		columns,
		aspectRatio,
		enableModal,
		enableLightbox,
		autoplayModal,
		enableCategories,
		categories,
		activeCategory,
		enableSearch,
		enablePagination,
		videosPerPage,
		loadingStyle,
		enableLazyLoad,
		preloadStrategy,
		qualitySettings,
		playlistMode,
		autoplayNext,
		showPlaylist,
		enableFullscreen,
		enablePictureInPicture,
		enableKeyboardShortcuts,
		customControlsColor,
		accentColor,
		settings,
		activeDevice
	} = attributes;

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings);

	const blockProps = useBlockProps.save({
		className: `video-section layout-${layout}`,
		'data-classes': allClasses,
		'data-attributes': JSON.stringify({
			layout,
			playerStyle,
			thumbnailStyle,
			hoverEffect,
			showPlayButton,
			showDuration,
			showTitle,
			showDescription,
			columns,
			aspectRatio,
			enableModal,
			enableLightbox,
			autoplayModal,
			enableCategories,
			categories,
			activeCategory,
			enableSearch,
			enablePagination,
			videosPerPage,
			loadingStyle,
			enableLazyLoad,
			preloadStrategy,
			qualitySettings,
			playlistMode,
			autoplayNext,
			showPlaylist,
			enableFullscreen,
			enablePictureInPicture,
			enableKeyboardShortcuts,
			customControlsColor,
			accentColor
		})
	});

	const getAspectRatioClass = () => {
		switch (aspectRatio) {
			case '16:9': return 'aspect-video';
			case '4:3': return 'aspect-4/3';
			case '1:1': return 'aspect-square';
			case '21:9': return 'aspect-21/9';
			default: return 'aspect-video';
		}
	};

	const getThumbnailClasses = () => {
		let classes = 'w-full h-full object-cover transition-all duration-300';
		
		switch (thumbnailStyle) {
			case 'rounded':
				classes += ' rounded-lg';
				break;
			case 'circular':
				classes += ' rounded-full';
				break;
			case 'sharp':
			default:
				break;
		}

		if (hoverEffect === 'scale') {
			classes += ' group-hover:scale-105';
		} else if (hoverEffect === 'fade') {
			classes += ' group-hover:opacity-80';
		}

		return classes;
	};

	const getVideoEmbedUrl = (video) => {
		if (video.type === 'youtube' && video.youtubeId) {
			return `https://www.youtube.com/embed/${video.youtubeId}?autoplay=${video.autoplay ? 1 : 0}&mute=${video.muted ? 1 : 0}&loop=${video.loop ? 1 : 0}&controls=${video.controls ? 1 : 0}`;
		}
		if (video.type === 'vimeo' && video.vimeoId) {
			return `https://player.vimeo.com/video/${video.vimeoId}?autoplay=${video.autoplay ? 1 : 0}&muted=${video.muted ? 1 : 0}&loop=${video.loop ? 1 : 0}&controls=${video.controls ? 1 : 0}`;
		}
		return video.url;
	};

	const getVideoThumbnail = (video) => {
		if (video.thumbnail?.url) {
			return video.thumbnail.url;
		}
		if (video.type === 'youtube' && video.youtubeId) {
			return `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
		}
		if (video.type === 'vimeo' && video.vimeoId) {
			return `https://vumbnail.com/${video.vimeoId}.jpg`;
		}
		return null;
	};

	const renderBackgroundVideo = () => {
		const videoUrl = getVideoEmbedUrl(backgroundVideo);
		
		return (
			<div className={`background-video-container relative ${getAspectRatioClass()} overflow-hidden`}>
				{/* Background Video */}
				<div className="absolute inset-0 z-0">
					{backgroundVideo.type === 'upload' && videoUrl ? (
						<video
							className="w-full h-full object-cover"
							autoPlay={backgroundVideo.autoplay}
							muted={backgroundVideo.muted}
							loop={backgroundVideo.loop}
							controls={backgroundVideo.controls}
							playsInline
							preload={preloadStrategy}
							data-lazy-load={enableLazyLoad}
						>
							<source src={videoUrl} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					) : (backgroundVideo.type === 'youtube' || backgroundVideo.type === 'vimeo') && videoUrl ? (
						<iframe
							className="w-full h-full"
							src={videoUrl}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							title="Background Video"
						></iframe>
					) : (
						<div className="w-full h-full bg-gray-800 flex items-center justify-center">
							<div className="text-white text-center">
								<div className="text-4xl mb-2" aria-hidden="true">🎬</div>
								<p>Video not configured</p>
							</div>
						</div>
					)}
				</div>

				{/* Overlay */}
				{backgroundVideo.overlay && (
					<div 
						className="absolute inset-0 bg-black z-10"
						style={{ opacity: backgroundVideo.overlayOpacity / 100 }}
					></div>
				)}

				{/* Content Overlay */}
				<div className="absolute inset-0 z-20 flex items-center justify-center text-white">
					<div className="text-center max-w-4xl px-4">
						{overlayContent.title && (
							<h2 className="text-4xl md:text-6xl font-bold mb-4">
								{overlayContent.title}
							</h2>
						)}
						{overlayContent.subtitle && (
							<p className="text-xl md:text-2xl mb-8 opacity-90">
								{overlayContent.subtitle}
							</p>
						)}
						{overlayContent.showCta && overlayContent.ctaText && (
							<a
								href={overlayContent.ctaUrl || '#'}
								className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
							>
								{overlayContent.ctaText}
							</a>
						)}
					</div>
				</div>
			</div>
		);
	};

	const renderFeaturedVideo = () => {
		const video = videos[0];
		if (!video) return null;

		const videoUrl = getVideoEmbedUrl(video);
		const thumbnailUrl = getVideoThumbnail(video);

		return (
			<div className="featured-video-container">
				<div 
					className={`video-player-wrapper relative ${getAspectRatioClass()} bg-gray-900 rounded-lg overflow-hidden mb-6 group cursor-pointer`}
					data-video-url={videoUrl}
					data-video-type={video.type}
					data-video-id={video.id}
					data-enable-modal={enableModal}
					data-autoplay-modal={autoplayModal}
				>
					{thumbnailUrl ? (
						<img 
							src={thumbnailUrl}
							alt={video.thumbnail?.alt || video.title}
							className={getThumbnailClasses()}
							loading={enableLazyLoad ? 'lazy' : 'eager'}
						/>
					) : (
						<div className="w-full h-full bg-gray-800 flex items-center justify-center">
							<div className="text-white text-center">
								<div className="text-4xl mb-2" aria-hidden="true">📹</div>
								<p>No thumbnail available</p>
							</div>
						</div>
					)}

					{/* Play Button Overlay */}
					{showPlayButton && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="play-button bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-1">
									<path d="M8 5v14l11-7z" fill="currentColor"/>
								</svg>
							</div>
						</div>
					)}

					{/* Duration Badge */}
					{showDuration && video.duration && (
						<div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
							{video.duration}
						</div>
					)}
				</div>

				{/* Video Info */}
				{(showTitle || showDescription) && (
					<div className="video-info">
						{showTitle && video.title && (
							<h3 className="text-2xl font-bold mb-3">{video.title}</h3>
						)}
						{showDescription && video.description && (
							<p className="text-gray-600 leading-relaxed">{video.description}</p>
						)}
					</div>
				)}
			</div>
		);
	};

	const renderVideoGrid = () => {
		if (!videos.length) return null;

		return (
			<div 
				className={`video-grid grid gap-6`}
				style={{ gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))` }}
				data-columns={columns}
			>
				{videos.map((video, index) => {
					const videoUrl = getVideoEmbedUrl(video);
					const thumbnailUrl = getVideoThumbnail(video);

					return (
						<div 
							key={video.id}
							className="video-item group cursor-pointer"
							data-video-url={videoUrl}
							data-video-type={video.type}
							data-video-id={video.id}
							data-video-index={index}
							data-enable-modal={enableModal}
							data-autoplay-modal={autoplayModal}
						>
							<div className={`video-thumbnail-wrapper relative ${getAspectRatioClass()} bg-gray-900 rounded-lg overflow-hidden mb-3`}>
								{thumbnailUrl ? (
									<img 
										src={thumbnailUrl}
										alt={video.thumbnail?.alt || video.title}
										className={getThumbnailClasses()}
										loading={enableLazyLoad ? 'lazy' : 'eager'}
									/>
								) : (
									<div className="w-full h-full bg-gray-800 flex items-center justify-center">
										<div className="text-white text-center">
											<div className="text-2xl mb-1" aria-hidden="true">📹</div>
											<p className="text-sm">No thumbnail</p>
										</div>
									</div>
								)}

								{/* Play Button Overlay */}
								{showPlayButton && (
									<div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-200">
										<div className="play-button bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-110">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-0.5">
												<path d="M8 5v14l11-7z" fill="currentColor"/>
											</svg>
										</div>
									</div>
								)}

								{/* Duration Badge */}
								{showDuration && video.duration && (
									<div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
										{video.duration}
									</div>
								)}

								{/* Category Badge */}
								{enableCategories && video.category && video.category !== 'general' && (
									<div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
										{video.category.charAt(0).toUpperCase() + video.category.slice(1)}
									</div>
								)}
							</div>

							{/* Video Info */}
							{(showTitle || showDescription) && (
								<div className="video-info">
									{showTitle && video.title && (
										<h4 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
											{video.title}
										</h4>
									)}
									{showDescription && video.description && (
										<p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
											{video.description}
										</p>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	const renderPopupPlayer = () => {
		return renderVideoGrid(); // Same layout as video grid, but with modal behavior
	};

	const renderVideoContent = () => {
		switch (layout) {
			case 'background-video':
				return renderBackgroundVideo();
			case 'featured-video':
				return renderFeaturedVideo();
			case 'video-grid':
				return renderVideoGrid();
			case 'popup-player':
				return renderPopupPlayer();
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

			{/* Category Filter (if enabled) */}
			{enableCategories && (layout === 'video-grid' || layout === 'popup-player') && (
				<div className="category-filter flex flex-wrap justify-center gap-2 mb-8">
					<button 
						className={`category-btn px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
						data-category="all"
					>
						All
					</button>
					{categories.map(category => (
						<button 
							key={category}
							className={`category-btn px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
							data-category={category}
						>
							{category.charAt(0).toUpperCase() + category.slice(1)}
						</button>
					))}
				</div>
			)}

			{/* Search Input (if enabled) */}
			{enableSearch && (layout === 'video-grid' || layout === 'popup-player') && (
				<div className="search-container max-w-md mx-auto mb-8">
					<div className="relative">
						<input
							type="text"
							className="video-search w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Search videos..."
							data-search-target=".video-item"
						/>
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>
				</div>
			)}

			{/* Video Content */}
			<div className="video-content-wrapper">
				{renderVideoContent()}
			</div>

			{/* Pagination (if enabled) */}
			{enablePagination && (layout === 'video-grid' || layout === 'popup-player') && videos.length > videosPerPage && (
				<div className="pagination-container flex justify-center mt-8">
					<div className="pagination flex space-x-2">
						<button className="pagination-btn pagination-prev px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
							Previous
						</button>
						<div className="pagination-numbers flex space-x-1">
							{/* Pagination numbers will be generated by frontend JS */}
						</div>
						<button className="pagination-btn pagination-next px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
							Next
						</button>
					</div>
				</div>
			)}

			{/* Video Modal (if enabled) */}
			{enableModal && (
				<div className="video-modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden" id="video-modal">
					<div className="modal-content relative max-w-4xl w-full mx-4">
						<button 
							className="modal-close absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
							aria-label="Close video"
						>
							✕
						</button>
						<div className="modal-video-container aspect-video bg-black rounded-lg overflow-hidden">
							{/* Video player will be inserted here by frontend JS */}
						</div>
						<div className="modal-video-info mt-4 text-white">
							<h3 className="modal-video-title text-xl font-bold mb-2"></h3>
							<p className="modal-video-description text-gray-300"></p>
						</div>
					</div>
				</div>
			)}

			{/* Playlist Sidebar (if enabled) */}
			{showPlaylist && playlistMode && (layout === 'video-grid' || layout === 'popup-player') && (
				<div className="playlist-sidebar fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 z-40" id="playlist-sidebar">
					<div className="playlist-header p-4 border-b">
						<div className="flex justify-between items-center">
							<h3 className="font-bold text-lg">Playlist</h3>
							<button className="playlist-close text-gray-500 hover:text-gray-700">✕</button>
						</div>
					</div>
					<div className="playlist-items overflow-y-auto h-full pb-16">
						{/* Playlist items will be populated by frontend JS */}
					</div>
				</div>
			)}

			{/* Loading States */}
			<div className="video-loading hidden">
				{loadingStyle === 'skeleton' ? (
					<div className="skeleton-loader">
						<div className="animate-pulse">
							<div className="bg-gray-300 rounded-lg aspect-video mb-4"></div>
							<div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
							<div className="h-3 bg-gray-300 rounded w-1/2"></div>
						</div>
					</div>
				) : (
					<div className="spinner-loader flex justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					</div>
				)}
			</div>
		</div>
	);
} 