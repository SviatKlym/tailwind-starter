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
import { UltimateControlTabs, UltimateDeviceSelector, generateTailwindClasses, generateAllClasses } from '../../utils/visual-controls.js';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
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

	const [activeVideoTab, setActiveVideoTab] = useState(0);

	// Enhanced preset styles for video section
	const presets = {
		modern: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-semibold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		dark: {
			spacing: { base: { top: 10, right: 5, bottom: 10, left: 5 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-br from-gray-900 to-black',
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

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings);

	// Generate preview classes (just base for editor)
	const previewClasses = generateTailwindClasses(settings, 'base');

	const blockProps = useBlockProps({
		className: `video-section layout-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'background-video', icon: '🎬', name: 'Background Video', desc: 'Autoplay with content overlay' },
		{ key: 'featured-video', icon: '▶️', name: 'Featured Video', desc: 'Prominent player with description' },
		{ key: 'video-grid', icon: '⚏', name: 'Video Grid', desc: 'Multiple video thumbnails' },
		{ key: 'popup-player', icon: '📺', name: 'Popup Player', desc: 'Modal video playback' }
	];

	const getAspectRatioClass = () => {
		switch (aspectRatio) {
			case '16:9': return 'aspect-video';
			case '4:3': return 'aspect-4/3';
			case '1:1': return 'aspect-square';
			case '21:9': return 'aspect-21/9';
			default: return 'aspect-video';
		}
	};

	const addVideo = () => {
		const newVideo = {
			id: Date.now(),
			url: "",
			type: "upload",
			title: "New Video",
			description: "Video description",
			thumbnail: { url: "", alt: "Video thumbnail", id: 0 },
			duration: "",
			category: "general",
			autoplay: false,
			muted: false,
			loop: false,
			controls: true,
			poster: "",
			youtubeId: "",
			vimeoId: ""
		};
		setAttributes({ videos: [...videos, newVideo] });
	};

	const updateVideo = (index, key, value) => {
		const updatedVideos = [...videos];
		updatedVideos[index] = { ...updatedVideos[index], [key]: value };
		setAttributes({ videos: updatedVideos });
	};

	const removeVideo = (index) => {
		const updatedVideos = videos.filter((_, i) => i !== index);
		setAttributes({ videos: updatedVideos });
		if (activeVideoTab >= updatedVideos.length) {
			setActiveVideoTab(Math.max(0, updatedVideos.length - 1));
		}
	};

	const getVideoPreview = (video) => {
		if (video.type === 'youtube' && video.youtubeId) {
			return `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
		}
		if (video.type === 'vimeo' && video.vimeoId) {
			return `https://vumbnail.com/${video.vimeoId}.jpg`;
		}
		if (video.thumbnail?.url) {
			return video.thumbnail.url;
		}
		return null;
	};

	const renderVideoUpload = (video, index) => {
		return (
			<div className="video-upload-section space-y-4">
				<TabPanel
					className="video-type-tabs"
					activeClass="active-tab"
					tabs={[
						{ name: 'upload', title: 'Upload' },
						{ name: 'youtube', title: 'YouTube' },
						{ name: 'vimeo', title: 'Vimeo' },
						{ name: 'url', title: 'URL' }
					]}
					onSelect={(tabName) => updateVideo(index, 'type', tabName)}
				>
					{(tab) => (
						<div className="tab-content">
							{tab.name === 'upload' && (
								<MediaUploadCheck>
									<MediaUpload
										onSelect={(media) => updateVideo(index, 'url', media.url)}
										allowedTypes={['video']}
										value={video.url}
										render={({ open }) => (
											<Button
												variant={video.url ? 'secondary' : 'primary'}
												onClick={open}
												className="w-full"
											>
												{video.url ? 'Change Video' : 'Upload Video'}
											</Button>
										)}
									/>
								</MediaUploadCheck>
							)}

							{tab.name === 'youtube' && (
								<TextControl
									label={__('YouTube Video ID', 'tailwind-starter')}
									value={video.youtubeId}
									onChange={(value) => {
										updateVideo(index, 'youtubeId', value);
										updateVideo(index, 'url', `https://www.youtube.com/watch?v=${value}`);
									}}
									placeholder="dQw4w9WgXcQ"
									help="Enter the video ID from YouTube URL"
								/>
							)}

							{tab.name === 'vimeo' && (
								<TextControl
									label={__('Vimeo Video ID', 'tailwind-starter')}
									value={video.vimeoId}
									onChange={(value) => {
										updateVideo(index, 'vimeoId', value);
										updateVideo(index, 'url', `https://vimeo.com/${value}`);
									}}
									placeholder="123456789"
									help="Enter the video ID from Vimeo URL"
								/>
							)}

							{tab.name === 'url' && (
								<TextControl
									label={__('Video URL', 'tailwind-starter')}
									value={video.url}
									onChange={(value) => updateVideo(index, 'url', value)}
									placeholder="https://example.com/video.mp4"
									help="Enter direct video URL or embed URL"
								/>
							)}
						</div>
					)}
				</TabPanel>

				<TextControl
					label={__('Video Title', 'tailwind-starter')}
					value={video.title}
					onChange={(value) => updateVideo(index, 'title', value)}
				/>

				<TextareaControl
					label={__('Video Description', 'tailwind-starter')}
					value={video.description}
					onChange={(value) => updateVideo(index, 'description', value)}
					rows={3}
				/>

				<div className="thumbnail-upload">
					<label className="block text-sm font-medium mb-2">Custom Thumbnail</label>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => updateVideo(index, 'thumbnail', {
								url: media.url,
								alt: media.alt || video.title,
								id: media.id
							})}
							allowedTypes={['image']}
							value={video.thumbnail?.id}
							render={({ open }) => (
								<div className="thumbnail-preview">
									{(video.thumbnail?.url || getVideoPreview(video)) ? (
										<div className="relative">
											<img 
												src={video.thumbnail?.url || getVideoPreview(video)} 
												alt={video.thumbnail?.alt || video.title}
												className="w-full h-32 object-cover rounded border"
											/>
											<Button
												variant="secondary"
												onClick={open}
												className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity"
											>
												Change Thumbnail
											</Button>
										</div>
									) : (
										<Button
											variant="secondary"
											onClick={open}
											className="w-full h-32 border-2 border-dashed border-gray-300 rounded text-gray-500"
										>
											Upload Thumbnail
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
				</div>

				<div className="video-settings grid grid-cols-2 gap-2">
					<TextControl
						label={__('Duration', 'tailwind-starter')}
						value={video.duration}
						onChange={(value) => updateVideo(index, 'duration', value)}
						placeholder="5:30"
					/>

					<SelectControl
						label={__('Category', 'tailwind-starter')}
						value={video.category}
						onChange={(value) => updateVideo(index, 'category', value)}
						options={categories.map(cat => ({ label: cat.charAt(0).toUpperCase() + cat.slice(1), value: cat }))}
					/>
				</div>

				<div className="video-controls">
					<ToggleControl
						label={__('Autoplay', 'tailwind-starter')}
						checked={video.autoplay}
						onChange={(value) => updateVideo(index, 'autoplay', value)}
					/>

					<ToggleControl
						label={__('Muted', 'tailwind-starter')}
						checked={video.muted}
						onChange={(value) => updateVideo(index, 'muted', value)}
					/>

					<ToggleControl
						label={__('Loop', 'tailwind-starter')}
						checked={video.loop}
						onChange={(value) => updateVideo(index, 'loop', value)}
					/>

					<ToggleControl
						label={__('Show Controls', 'tailwind-starter')}
						checked={video.controls}
						onChange={(value) => updateVideo(index, 'controls', value)}
					/>
				</div>

				<div className="video-actions flex justify-end space-x-2">
					<Button
						variant="tertiary"
						isDestructive
						onClick={() => removeVideo(index)}
						disabled={videos.length === 1}
					>
						Remove Video
					</Button>
				</div>
			</div>
		);
	};

	const renderVideoPreview = () => {
		switch (layout) {
			case 'background-video':
				return (
					<div className={`background-video-preview relative ${getAspectRatioClass()} overflow-hidden rounded-lg`}>
						{backgroundVideo.url ? (
							<>
								<div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
								<div className="absolute inset-0 flex items-center justify-center text-white">
									<div className="text-center">
										<h3 className="text-2xl font-bold mb-2">{overlayContent.title}</h3>
										<p className="text-lg mb-4">{overlayContent.subtitle}</p>
										{overlayContent.showCta && (
											<button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
												{overlayContent.ctaText}
											</button>
										)}
									</div>
								</div>
								<div className="video-placeholder bg-gray-800 w-full h-full flex items-center justify-center">
									<div className="text-white text-center">
										<div className="text-4xl mb-2">🎬</div>
										<p>Background Video Preview</p>
									</div>
								</div>
							</>
						) : (
							<div className="bg-gray-200 w-full h-full flex items-center justify-center">
								<p className="text-gray-500">Upload a background video</p>
							</div>
						)}
					</div>
				);

			case 'featured-video':
				const featuredVideo = videos[0];
				return (
					<div className="featured-video-preview">
						<div className={`video-player relative ${getAspectRatioClass()} bg-gray-800 rounded-lg overflow-hidden mb-4`}>
							{(featuredVideo?.thumbnail?.url || getVideoPreview(featuredVideo)) ? (
								<img 
									src={featuredVideo.thumbnail.url || getVideoPreview(featuredVideo)} 
									alt={featuredVideo?.title || 'Video thumbnail'}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-white">
									<div className="text-center">
										<div className="text-4xl mb-2">▶️</div>
										<p>Upload a video</p>
									</div>
								</div>
							)}
							{showPlayButton && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="bg-white bg-opacity-90 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
										<div className="text-2xl">▶️</div>
									</div>
								</div>
							)}
							{showDuration && featuredVideo?.duration && (
								<div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
									{featuredVideo.duration}
								</div>
							)}
						</div>
						{(showTitle || showDescription) && (
							<div className="video-info">
								{showTitle && featuredVideo?.title && (
									<h3 className="text-xl font-semibold mb-2">{featuredVideo.title}</h3>
								)}
								{showDescription && featuredVideo?.description && (
									<p className="text-gray-600">{featuredVideo.description}</p>
								)}
							</div>
						)}
					</div>
				);

			case 'video-grid':
			case 'popup-player':
				return (
					<div className={`video-grid grid gap-4`} style={{ gridTemplateColumns: `repeat(${Math.min(columns, videos.length)}, 1fr)` }}>
						{videos.slice(0, 6).map((video, index) => (
							<div key={video.id} className="video-item group cursor-pointer">
								<div className={`video-thumbnail relative ${getAspectRatioClass()} bg-gray-200 rounded-lg overflow-hidden mb-2`}>
									{(video.thumbnail?.url || getVideoPreview(video)) ? (
										<img 
											src={video.thumbnail.url || getVideoPreview(video)} 
											alt={video.title}
											className={`w-full h-full object-cover transition-transform duration-300 ${hoverEffect === 'scale' ? 'group-hover:scale-105' : ''}`}
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<div className="text-center">
												<div className="text-2xl mb-1">📹</div>
												<p className="text-xs">No thumbnail</p>
											</div>
										</div>
									)}
									{showPlayButton && (
										<div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
											<div className="bg-white bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
												<div className="text-lg">▶️</div>
											</div>
										</div>
									)}
									{showDuration && video.duration && (
										<div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-xs">
											{video.duration}
										</div>
									)}
								</div>
								{(showTitle || showDescription) && (
									<div className="video-info">
										{showTitle && (
											<h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
										)}
										{showDescription && (
											<p className="text-xs text-gray-600 line-clamp-2">{video.description}</p>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<InspectorControls>
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

				{layout === 'background-video' && (
					<PanelBody title={__('🎬 Background Video', 'tailwind-starter')} initialOpen={false}>
						<TabPanel
							className="video-type-tabs"
							activeClass="active-tab"
							tabs={[
								{ name: 'upload', title: 'Upload' },
								{ name: 'youtube', title: 'YouTube' },
								{ name: 'vimeo', title: 'Vimeo' },
								{ name: 'url', title: 'URL' }
							]}
							onSelect={(tabName) => setAttributes({ 
								backgroundVideo: { ...backgroundVideo, type: tabName }
							})}
						>
							{(tab) => (
								<div className="tab-content mb-4">
									{tab.name === 'upload' && (
										<MediaUploadCheck>
											<MediaUpload
												onSelect={(media) => setAttributes({ 
													backgroundVideo: { ...backgroundVideo, url: media.url }
												})}
												allowedTypes={['video']}
												value={backgroundVideo.url}
												render={({ open }) => (
													<Button
														variant={backgroundVideo.url ? 'secondary' : 'primary'}
														onClick={open}
														className="w-full"
													>
														{backgroundVideo.url ? 'Change Background Video' : 'Upload Background Video'}
													</Button>
												)}
											/>
										</MediaUploadCheck>
									)}

									{tab.name === 'youtube' && (
										<TextControl
											label={__('YouTube Video ID', 'tailwind-starter')}
											value={backgroundVideo.youtubeId}
											onChange={(value) => setAttributes({ 
												backgroundVideo: { 
													...backgroundVideo, 
													youtubeId: value,
													url: `https://www.youtube.com/watch?v=${value}`
												}
											})}
											placeholder="dQw4w9WgXcQ"
										/>
									)}

									{tab.name === 'vimeo' && (
										<TextControl
											label={__('Vimeo Video ID', 'tailwind-starter')}
											value={backgroundVideo.vimeoId}
											onChange={(value) => setAttributes({ 
												backgroundVideo: { 
													...backgroundVideo, 
													vimeoId: value,
													url: `https://vimeo.com/${value}`
												}
											})}
											placeholder="123456789"
										/>
									)}

									{tab.name === 'url' && (
										<TextControl
											label={__('Video URL', 'tailwind-starter')}
											value={backgroundVideo.url}
											onChange={(value) => setAttributes({ 
												backgroundVideo: { ...backgroundVideo, url: value }
											})}
											placeholder="https://example.com/video.mp4"
										/>
									)}
								</div>
							)}
						</TabPanel>

						<ToggleControl
							label={__('Enable Overlay', 'tailwind-starter')}
							checked={backgroundVideo.overlay}
							onChange={(value) => setAttributes({ 
								backgroundVideo: { ...backgroundVideo, overlay: value }
							})}
						/>

						{backgroundVideo.overlay && (
							<RangeControl
								label={__('Overlay Opacity (%)', 'tailwind-starter')}
								value={backgroundVideo.overlayOpacity}
								onChange={(value) => setAttributes({ 
									backgroundVideo: { ...backgroundVideo, overlayOpacity: value }
								})}
								min={0}
								max={100}
							/>
						)}

						<Divider />
						<h4 className="font-medium mb-3">Overlay Content</h4>
						
						<TextControl
							label={__('Overlay Title', 'tailwind-starter')}
							value={overlayContent.title}
							onChange={(value) => setAttributes({ 
								overlayContent: { ...overlayContent, title: value }
							})}
						/>

						<TextControl
							label={__('Overlay Subtitle', 'tailwind-starter')}
							value={overlayContent.subtitle}
							onChange={(value) => setAttributes({ 
								overlayContent: { ...overlayContent, subtitle: value }
							})}
						/>

						<ToggleControl
							label={__('Show CTA Button', 'tailwind-starter')}
							checked={overlayContent.showCta}
							onChange={(value) => setAttributes({ 
								overlayContent: { ...overlayContent, showCta: value }
							})}
						/>

						{overlayContent.showCta && (
							<>
								<TextControl
									label={__('CTA Text', 'tailwind-starter')}
									value={overlayContent.ctaText}
									onChange={(value) => setAttributes({ 
										overlayContent: { ...overlayContent, ctaText: value }
									})}
								/>

								<TextControl
									label={__('CTA URL', 'tailwind-starter')}
									value={overlayContent.ctaUrl}
									onChange={(value) => setAttributes({ 
										overlayContent: { ...overlayContent, ctaUrl: value }
									})}
								/>
							</>
						)}
					</PanelBody>
				)}

				{(layout === 'featured-video' || layout === 'video-grid' || layout === 'popup-player') && (
					<PanelBody title={__('🎥 Videos', 'tailwind-starter')} initialOpen={false}>
						<div className="videos-section">
							<div className="videos-header flex justify-between items-center mb-4">
								<h4 className="font-medium">Manage Videos</h4>
								<Button
									variant="secondary"
									onClick={addVideo}
									className="text-sm"
								>
									Add Video
								</Button>
							</div>

							{videos.length > 0 && (
								<TabPanel
									className="video-tabs"
									activeClass="active-tab"
									tabs={videos.map((video, index) => ({
										name: `video-${index}`,
										title: video.title || `Video ${index + 1}`
									}))}
									onSelect={(tabName) => {
										const index = parseInt(tabName.split('-')[1]);
										setActiveVideoTab(index);
									}}
								>
									{(tab) => {
										const index = parseInt(tab.name.split('-')[1]);
										return renderVideoUpload(videos[index], index);
									}}
								</TabPanel>
							)}
						</div>
					</PanelBody>
				)}

				<PanelBody title={__('⚙️ Display Settings', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Section Header', 'tailwind-starter')}
						checked={showSectionHeader}
						onChange={(value) => setAttributes({ showSectionHeader: value })}
					/>

					<Divider />

					{(layout === 'video-grid' || layout === 'popup-player') && (
						<>
							<RangeControl
								label={__('Columns', 'tailwind-starter')}
								value={columns}
								onChange={(value) => setAttributes({ columns: value })}
								min={1}
								max={4}
							/>

							<Divider />
						</>
					)}

					<SelectControl
						label={__('Aspect Ratio', 'tailwind-starter')}
						value={aspectRatio}
						onChange={(value) => setAttributes({ aspectRatio: value })}
						options={[
							{ label: '16:9', value: '16:9' },
							{ label: '4:3', value: '4:3' },
							{ label: '1:1', value: '1:1' },
							{ label: '21:9', value: '21:9' }
						]}
					/>

					<SelectControl
						label={__('Thumbnail Style', 'tailwind-starter')}
						value={thumbnailStyle}
						onChange={(value) => setAttributes({ thumbnailStyle: value })}
						options={[
							{ label: 'Rounded', value: 'rounded' },
							{ label: 'Sharp', value: 'sharp' },
							{ label: 'Circular', value: 'circular' }
						]}
					/>

					<SelectControl
						label={__('Hover Effect', 'tailwind-starter')}
						value={hoverEffect}
						onChange={(value) => setAttributes({ hoverEffect: value })}
						options={[
							{ label: 'Scale', value: 'scale' },
							{ label: 'Fade', value: 'fade' },
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
						label={__('Show Video Title', 'tailwind-starter')}
						checked={showTitle}
						onChange={(value) => setAttributes({ showTitle: value })}
					/>

					<ToggleControl
						label={__('Show Description', 'tailwind-starter')}
						checked={showDescription}
						onChange={(value) => setAttributes({ showDescription: value })}
					/>

					<ToggleControl
						label={__('Enable Modal Playback', 'tailwind-starter')}
						checked={enableModal}
						onChange={(value) => setAttributes({ enableModal: value })}
					/>

					{enableModal && (
						<ToggleControl
							label={__('Autoplay in Modal', 'tailwind-starter')}
							checked={autoplayModal}
							onChange={(value) => setAttributes({ autoplayModal: value })}
						/>
					)}
				</PanelBody>

				<UltimateDeviceSelector
					activeDevice={activeDevice}
					onChange={(device) => setAttributes({ activeDevice: device })}
				/>

				<UltimateControlTabs
					spacing={settings.spacing || {}}
					onSpacingChange={(spacing) => setAttributes({
						settings: { ...settings, spacing }
					})}
					margins={settings.margins || {}}
					onMarginsChange={(margins) => setAttributes({
						settings: { ...settings, margins }
					})}
					background={settings.backgroundColor || 'bg-white'}
					onBackgroundChange={(backgroundColor) => setAttributes({
						settings: { ...settings, backgroundColor }
					})}
					textColor={settings.textColor || 'text-gray-900'}
					onTextColorChange={(textColor) => setAttributes({
						settings: { ...settings, textColor }
					})}
					gradients={settings.gradients || {}}
					onGradientsChange={(gradients) => setAttributes({
						settings: { ...settings, gradients }
					})}
					typography={settings.typography || {}}
					onTypographyChange={(typography) => setAttributes({
						settings: { ...settings, typography }
					})}
					layout={settings.layout || {}}
					onLayoutChange={(layout) => setAttributes({
						settings: { ...settings, layout }
					})}
					effects={settings.effects || {}}
					onEffectsChange={(effects) => setAttributes({
						settings: { ...settings, effects }
					})}
					activeDevice={activeDevice}
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

				<div className="video-content">
					{renderVideoPreview()}
				</div>

				<div className="generated-classes mt-4 p-3 bg-gray-100 rounded text-xs">
					<strong>Preview Classes:</strong> {previewClasses}<br />
					<strong>All Device Classes:</strong> {allClasses}
				</div>
			</div>
		</>
	);
} 