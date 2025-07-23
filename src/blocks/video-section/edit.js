import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	RangeControl,
	Button,
	ColorPicker,
	TextareaControl,
	TabPanel,
	__experimentalDivider as Divider
} from '@wordpress/components';

// Import fixed visual controls
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { useState, useEffect, useCallback } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	// Destructure with safe defaults
	const {
		layout = 'featured-video',
		videos = [],
		backgroundVideo = {},
		sectionTitle = 'Video Showcase',
		sectionSubtitle = 'Discover our latest videos and content',
		showSectionHeader = true,
		overlayContent = {},
		playerStyle = 'modern',
		thumbnailStyle = 'rounded',
		hoverEffect = 'scale',
		showPlayButton = true,
		showDuration = true,
		showTitle = true,
		showDescription = true,
		columns = 3,
		aspectRatio = '16:9',
		enableModal = true,
		enableLightbox = false,
		autoplayModal = true,
		enableCategories = false,
		categories = ['general', 'tutorials', 'testimonials', 'demos'],
		activeCategory = 'all',
		enableSearch = false,
		enablePagination = false,
		videosPerPage = 6,
		loadingStyle = 'skeleton',
		enableLazyLoad = true,
		preloadStrategy = 'metadata',
		qualitySettings = {},
		playlistMode = false,
		autoplayNext = false,
		showPlaylist = false,
		enableFullscreen = true,
		enablePictureInPicture = true,
		enableKeyboardShortcuts = true,
		customControlsColor = '#ffffff',
		accentColor = '#3b82f6',
		settings = {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-left' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		activeDevice = 'base'
	} = attributes;

	// Safe setters with error handling
	const updateSettings = useCallback((newSettings) => {
		if (newSettings && typeof newSettings === 'object') {
			setAttributes({ settings: { ...settings, ...newSettings } });
		}
	}, [settings, setAttributes]);

	const updateVideos = useCallback((newVideos) => {
		if (Array.isArray(newVideos)) {
			setAttributes({ videos: newVideos });
		}
	}, [setAttributes]);

	// Generate classes safely
	const blockClasses = generateAllClasses(settings);
	
	// Layout options
	const layoutOptions = [
		{ label: __('Featured Video'), value: 'featured-video' },
		{ label: __('Video Grid'), value: 'grid' },
		{ label: __('Video Carousel'), value: 'carousel' },
		{ label: __('Background Video'), value: 'background-video' },
		{ label: __('Video Playlist'), value: 'playlist' }
	];

	const aspectRatioOptions = [
		{ label: __('16:9'), value: '16:9' },
		{ label: __('4:3'), value: '4:3' },
		{ label: __('1:1'), value: '1:1' },
		{ label: __('21:9'), value: '21:9' }
	];

	const playerStyleOptions = [
		{ label: __('Modern'), value: 'modern' },
		{ label: __('Classic'), value: 'classic' },
		{ label: __('Minimal'), value: 'minimal' },
		{ label: __('Custom'), value: 'custom' }
	];

	// Add new video function
	const addVideo = () => {
		const newVideo = {
			id: Date.now(),
			url: '',
			type: 'upload',
			title: `Video ${videos.length + 1}`,
			description: 'Video description goes here',
			thumbnail: { url: '', alt: 'Video thumbnail', id: 0 },
			duration: '',
			category: 'general',
			autoplay: false,
			muted: false,
			loop: false,
			controls: true,
			poster: '',
			youtubeId: '',
			vimeoId: ''
		};
		
		updateVideos([...videos, newVideo]);
	};

	// Update video function
	const updateVideo = (index, updatedVideo) => {
		const newVideos = [...videos];
		newVideos[index] = { ...newVideos[index], ...updatedVideo };
		updateVideos(newVideos);
	};

	// Remove video function
	const removeVideo = (index) => {
		const newVideos = videos.filter((_, i) => i !== index);
		updateVideos(newVideos);
	};

	// Grid column classes based on count
	const getGridClasses = () => {
		const colMap = {
			1: 'grid-cols-1',
			2: 'grid-cols-1 md:grid-cols-2',
			3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
			4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
		};
		return colMap[columns] || colMap[3];
	};

	// Aspect ratio classes
	const getAspectRatioClass = () => {
		const ratioMap = {
			'16:9': 'aspect-video',
			'4:3': 'aspect-[4/3]',
			'1:1': 'aspect-square',
			'21:9': 'aspect-[21/9]'
		};
		return ratioMap[aspectRatio] || 'aspect-video';
	};

	const blockProps = useBlockProps({
		className: `video-section ${blockClasses}`.trim()
	});

	return (
		<>
			<InspectorControls>
				{/* Layout Settings */}
				<PanelBody title={__('Layout Settings')} initialOpen={true}>
					<SelectControl
						label={__('Layout Style')}
						value={layout}
						options={layoutOptions}
						onChange={(value) => setAttributes({ layout: value })}
					/>
					
					{(layout === 'grid' || layout === 'carousel') && (
						<RangeControl
							label={__('Columns')}
							value={columns}
							onChange={(value) => setAttributes({ columns: value })}
							min={1}
							max={4}
							step={1}
						/>
					)}
					
					<SelectControl
						label={__('Aspect Ratio')}
						value={aspectRatio}
						options={aspectRatioOptions}
						onChange={(value) => setAttributes({ aspectRatio: value })}
					/>
				</PanelBody>

				{/* Video Settings */}
				<PanelBody title={__('Video Settings')} initialOpen={false}>
					<SelectControl
						label={__('Player Style')}
						value={playerStyle}
						options={playerStyleOptions}
						onChange={(value) => setAttributes({ playerStyle: value })}
					/>
					
					<ToggleControl
						label={__('Enable Modal')}
						checked={enableModal}
						onChange={(value) => setAttributes({ enableModal: value })}
					/>
					
					<ToggleControl
						label={__('Show Play Button')}
						checked={showPlayButton}
						onChange={(value) => setAttributes({ showPlayButton: value })}
					/>
					
					<ToggleControl
						label={__('Show Duration')}
						checked={showDuration}
						onChange={(value) => setAttributes({ showDuration: value })}
					/>
					
					<ToggleControl
						label={__('Enable Lazy Loading')}
						checked={enableLazyLoad}
						onChange={(value) => setAttributes({ enableLazyLoad: value })}
					/>
				</PanelBody>

				{/* Visual Controls */}
				<UltimateControlTabs
					spacing={settings.spacing || {}}
					onSpacingChange={(spacing) => updateSettings({ spacing })}
					margins={settings.margins || {}}
					onMarginsChange={(margins) => updateSettings({ margins })}
					background={settings.backgroundColor}
					onBackgroundChange={(backgroundColor) => updateSettings({ backgroundColor })}
					textColor={settings.textColor}
					onTextColorChange={(textColor) => updateSettings({ textColor })}
					gradients={settings.gradients || {}}
					onGradientsChange={(gradients) => updateSettings({ gradients })}
					typography={settings.typography || {}}
					onTypographyChange={(typography) => updateSettings({ typography })}
					layout={settings.layout || {}}
					onLayoutChange={(layout) => updateSettings({ layout })}
					effects={settings.effects || {}}
					onEffectsChange={(effects) => updateSettings({ effects })}
					device="base"
					presets={{}}
					onPresetApply={(preset) => {
						console.log('Applying preset:', preset);
					}}
				/>
			</InspectorControls>

			<div {...blockProps}>
				{/* Section Header */}
				{showSectionHeader && (
					<div className="block-section-header">
						<RichText
							tagName="h2"
							className="block-section-title"
							value={sectionTitle}
							onChange={(value) => setAttributes({ sectionTitle: value })}
							placeholder={__('Enter section title...')}
						/>
						<RichText
							tagName="p"
							className="block-section-subtitle"
							value={sectionSubtitle}
							onChange={(value) => setAttributes({ sectionSubtitle: value })}
							placeholder={__('Enter section subtitle...')}
						/>
					</div>
				)}

				{/* Video Content */}
				{layout === 'featured-video' && videos.length > 0 && (
					<div className="featured-video-container">
						<div className={`video-item ${getAspectRatioClass()} bg-gray-200 rounded-lg overflow-hidden relative group`}>
							{videos[0].thumbnail?.url ? (
								<img
									src={videos[0].thumbnail.url}
									alt={videos[0].thumbnail.alt}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-gray-100">
									<span className="text-gray-400 text-lg">No thumbnail</span>
								</div>
							)}
							
							{showPlayButton && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
										<svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
											<path d="M8 5v10l8-5-8-5z"/>
										</svg>
									</div>
								</div>
							)}
							
							{showDuration && videos[0].duration && (
								<div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
									{videos[0].duration}
								</div>
							)}
						</div>
						
						{(showTitle || showDescription) && (
							<div className="mt-4">
								{showTitle && (
									<RichText
										tagName="h3"
										className="text-xl font-semibold mb-2"
										value={videos[0].title}
										onChange={(value) => updateVideo(0, { title: value })}
										placeholder={__('Enter video title...')}
									/>
								)}
								{showDescription && (
									<RichText
										tagName="p"
										className="text-gray-600"
										value={videos[0].description}
										onChange={(value) => updateVideo(0, { description: value })}
										placeholder={__('Enter video description...')}
									/>
								)}
							</div>
						)}
					</div>
				)}

				{layout === 'grid' && (
					<div className={`video-grid grid ${getGridClasses()} gap-6`}>
						{videos.map((video, index) => (
							<div key={video.id} className="video-item group">
								<div className={`${getAspectRatioClass()} bg-gray-200 rounded-lg overflow-hidden relative`}>
									{video.thumbnail?.url ? (
										<img
											src={video.thumbnail.url}
											alt={video.thumbnail.alt}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-gray-100">
											<span className="text-gray-400">No thumbnail</span>
										</div>
									)}
									
									{showPlayButton && (
										<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
											<div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
												<svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
													<path d="M8 5v10l8-5-8-5z"/>
												</svg>
											</div>
										</div>
									)}
									
									{showDuration && video.duration && (
										<div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
											{video.duration}
										</div>
									)}
								</div>
								
								{(showTitle || showDescription) && (
									<div className="mt-3">
										{showTitle && (
											<RichText
												tagName="h4"
												className="font-medium mb-1"
												value={video.title}
												onChange={(value) => updateVideo(index, { title: value })}
												placeholder={__('Enter video title...')}
											/>
										)}
										{showDescription && (
											<RichText
												tagName="p"
												className="text-sm text-gray-600"
												value={video.description}
												onChange={(value) => updateVideo(index, { description: value })}
												placeholder={__('Enter video description...')}
											/>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				)}

				{/* Add Video Button */}
				<div className="mt-6 text-center">
					<Button
						isPrimary
						onClick={addVideo}
						className="inline-flex items-center"
					>
						<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
						</svg>
						{__('Add Video')}
					</Button>
				</div>

				{/* Editor Helper Text */}
				{videos.length === 0 && (
					<div className="block-empty-state">
						<div className="block-empty-icon">
							<svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM15 9a1 1 0 11-2 0v2.5L11.5 10l-4 4H15V9z" />
							</svg>
						</div>
						<h3 className="block-empty-title">{__('No Videos Added')}</h3>
						<p className="block-empty-description">{__('Click "Add Video" to get started.')}</p>
					</div>
				)}
			</div>
		</>
	);
}