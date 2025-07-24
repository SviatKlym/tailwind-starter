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
	
} from '@wordpress/components';

// Import fixed visual controls
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';
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
		settings = {},
		activeDevice = 'base'
	} = attributes;

	// Safe setters with error handling
	const updateSettings = useCallback((newSettings) => {
		if (newSettings && typeof newSettings === 'object') {
			setAttributes({ settings: { ...(settings || {}), ...newSettings } });
		}
	}, [settings, setAttributes]);

	const updateVideos = useCallback((newVideos) => {
		if (Array.isArray(newVideos)) {
			setAttributes({ videos: newVideos });
		}
	}, [setAttributes]);

	// Enhanced preset styles for video section
	const presets = {
		modern: {
			spacing: { base: { top: 10, right: 5, bottom: 10, left: 5 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-medium', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-br from-gray-50 to-blue-50',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		cinematic: {
			spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
			backgroundColor: 'bg-black',
			textColor: 'text-white',
			gradients: {},
			layout: {},
			effects: {}
		},
		minimal: {
			spacing: { base: { top: 6, right: 3, bottom: 6, left: 3 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
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

	// Generate classes safely
	const allClasses = generateAllClasses(settings || {});
	const previewClasses = generateAllClasses(settings || {});
	
	// Layout options as preset grid
	const layoutPresets = [
		{ key: 'featured-video', icon: '⭐', name: 'Featured Video', desc: 'Single prominent video with details' },
		{ key: 'grid', icon: '🔲', name: 'Video Grid', desc: 'Multiple videos in grid layout' },
		{ key: 'carousel', icon: '🎠', name: 'Video Carousel', desc: 'Scrollable video carousel' },
		{ key: 'background-video', icon: '🎬', name: 'Background Video', desc: 'Full-screen background video' },
		{ key: 'playlist', icon: '📋', name: 'Video Playlist', desc: 'Sequential video playlist' }
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
		className: `video-section video-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

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

			<PanelBody title={__('⚙️ Video Settings', 'tailwind-starter')} initialOpen={false}>
				<ToggleControl
					label={__('Show Section Header', 'tailwind-starter')}
					checked={showSectionHeader}
					onChange={(value) => setAttributes({ showSectionHeader: value })}
				/>



				{(layout === 'grid' || layout === 'carousel') && (
					<RangeControl
						label={__('Columns', 'tailwind-starter')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={4}
						step={1}
					/>
				)}
				
				<SelectControl
					label={__('Aspect Ratio', 'tailwind-starter')}
					value={aspectRatio}
					options={aspectRatioOptions}
					onChange={(value) => setAttributes({ aspectRatio: value })}
				/>

				<SelectControl
					label={__('Player Style', 'tailwind-starter')}
					value={playerStyle}
					options={playerStyleOptions}
					onChange={(value) => setAttributes({ playerStyle: value })}
				/>

				<SelectControl
					label={__('Thumbnail Style', 'tailwind-starter')}
					value={thumbnailStyle}
					onChange={(value) => setAttributes({ thumbnailStyle: value })}
					options={[
						{ label: 'Rounded', value: 'rounded' },
						{ label: 'Square', value: 'square' },
						{ label: 'Circle', value: 'circle' }
					]}
				/>

				<SelectControl
					label={__('Hover Effect', 'tailwind-starter')}
					value={hoverEffect}
					onChange={(value) => setAttributes({ hoverEffect: value })}
					options={[
						{ label: 'Scale', value: 'scale' },
						{ label: 'Lift', value: 'lift' },
						{ label: 'None', value: 'none' }
					]}
				/>
				
				<ToggleControl
					label={__('Show Play Button', 'tailwind-starter')}
					checked={showPlayButton}
					onChange={(value) => setAttributes({ showPlayButton: value })}
				/>
				
				<ToggleControl
					label={__('Show Duration', 'tailwind-starter')}
					checked={showDuration}
					onChange={(value) => setAttributes({ showDuration: value })}
				/>

				<ToggleControl
					label={__('Show Title', 'tailwind-starter')}
					checked={showTitle}
					onChange={(value) => setAttributes({ showTitle: value })}
				/>

				<ToggleControl
					label={__('Show Description', 'tailwind-starter')}
					checked={showDescription}
					onChange={(value) => setAttributes({ showDescription: value })}
				/>
				
				<ToggleControl
					label={__('Enable Modal', 'tailwind-starter')}
					checked={enableModal}
					onChange={(value) => setAttributes({ enableModal: value })}
				/>
				
				<ToggleControl
					label={__('Enable Lazy Loading', 'tailwind-starter')}
					checked={enableLazyLoad}
					onChange={(value) => setAttributes({ enableLazyLoad: value })}
				/>

				{enableCategories && (
					<>
		
						<ToggleControl
							label={__('Enable Categories', 'tailwind-starter')}
							checked={enableCategories}
							onChange={(value) => setAttributes({ enableCategories: value })}
						/>
					</>
				)}
			</PanelBody>

			<PanelBody title={__('🎬 Videos Management', 'tailwind-starter')} initialOpen={false}>
				{videos.map((video, index) => (
					<div key={video.id} className="video-config mb-4 p-4 border rounded">
						<div className="flex justify-between items-center mb-2">
							<h4><strong>{video.title || `Video ${index + 1}`}</strong></h4>
							<Button
								onClick={() => removeVideo(index)}
								variant="secondary"
								isDestructive
								size="small"
							>
								{__('Remove', 'tailwind-starter')}
							</Button>
						</div>

						<TextControl
							label={__('Video Title', 'tailwind-starter')}
							value={video.title}
							onChange={(value) => updateVideo(index, { title: value })}
							placeholder="Enter video title..."
						/>

						<TextareaControl
							label={__('Video Description', 'tailwind-starter')}
							value={video.description}
							onChange={(value) => updateVideo(index, { description: value })}
							placeholder="Enter video description..."
							rows={3}
						/>

						<TextControl
							label={__('Video URL', 'tailwind-starter')}
							value={video.url}
							onChange={(value) => updateVideo(index, { url: value })}
							placeholder="Enter video URL or upload..."
						/>

						<TextControl
							label={__('Duration', 'tailwind-starter')}
							value={video.duration}
							onChange={(value) => updateVideo(index, { duration: value })}
							placeholder="e.g., 5:30"
						/>

						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => updateVideo(index, { 
									thumbnail: { 
										url: media.url, 
										alt: media.alt || video.title,
										id: media.id 
									} 
								})}
								allowedTypes={['image']}
								value={video.thumbnail?.id}
								render={({ open }) => (
									<div className="mt-2">
										<Button onClick={open} variant="secondary">
											{video.thumbnail?.url ? __('Change Thumbnail', 'tailwind-starter') : __('Select Thumbnail', 'tailwind-starter')}
										</Button>
										{video.thumbnail?.url && (
											<div className="mt-2">
												<img 
													src={video.thumbnail.url} 
													alt={video.thumbnail.alt}
													className="w-20 h-12 object-cover rounded"
												/>
											</div>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
					</div>
				))}
				
				<Button onClick={addVideo} variant="primary" className="w-full">
					{__('Add Video', 'tailwind-starter')}
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
				onSpacingChange={(spacing) => updateSettings({ spacing })}
				margins={settings?.margins || {}}
				onMarginsChange={(margins) => updateSettings({ margins })}
				background={settings?.backgroundColor}
				onBackgroundChange={(backgroundColor) => updateSettings({ backgroundColor })}
				textColor={settings?.textColor}
				onTextColorChange={(textColor) => updateSettings({ textColor })}
				gradients={settings?.gradients || {}}
				onGradientsChange={(gradients) => updateSettings({ gradients })}
				typography={settings?.typography || {}}
				onTypographyChange={(typography) => updateSettings({ typography })}
				layout={settings?.layout || {}}
				onLayoutChange={(layout) => updateSettings({ layout })}
				effects={settings?.effects || {}}
				onEffectsChange={(effects) => updateSettings({ effects })}
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
				{/* Section Header */}
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

				{/* Editor Helper Text */}
				{videos.length === 0 && (
					<div className="empty-state text-center py-8">
						<div className="text-gray-400 text-lg mb-2">🎬</div>
						<p className="text-gray-500">No videos added yet. Use the "Videos Management" panel to add videos.</p>
					</div>
				)}
			</div>
		</>
	);
}