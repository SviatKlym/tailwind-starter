import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	RangeControl,
	
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		postsPerPage,
		columns,
		categories,
		tags,
		showFeaturedImage,
		showExcerpt,
		showAuthor,
		showDate,
		showCategories,
		showTags,
		showReadTime,
		showReadMore,
		excludeCurrentPost,
		orderBy,
		order,
		featuredPostSize,
		imageAspectRatio,
		cardStyle,
		hoverEffect,
		textAlignment,
		excerptLength,
		dateFormat,
		readMoreText,
		noPostsMessage,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		enablePagination,
		enableLoadMore,
		enableCategoryFilter,
		showPostViews,
		settings = {},
		activeDevice
	} = attributes;

	const [selectedCategories, setSelectedCategories] = useState(categories);

	// Enhanced preset styles for recent posts
	const presets = {
		blog: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-left' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		news: {
			spacing: { base: { top: 6, right: 3, bottom: 6, left: 3 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-medium', textAlign: 'text-left' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-800',
			gradients: {},
			layout: {},
			effects: {}
		},
		magazine: {
			spacing: { base: { top: 10, right: 5, bottom: 10, left: 5 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-semibold', textAlign: 'text-left' } },
			backgroundColor: 'bg-gradient-to-br from-indigo-50 to-blue-100',
			textColor: 'text-gray-900',
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
		className: `recent-posts posts-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	// Get WordPress posts for preview
	const { posts, allCategories, isLoading } = useSelect((select) => {
		const { getEntityRecords } = select('core');
		
		const postsQuery = {
			per_page: postsPerPage,
			_embed: true,
			status: 'publish',
			order: order,
			orderby: orderBy
		};

		if (categories && categories.length > 0) {
			postsQuery.categories = categories.join(',');
		}

		if (tags && tags.length > 0) {
			postsQuery.tags = tags.join(',');
		}

		return {
			posts: getEntityRecords('postType', 'post', postsQuery) || [],
			allCategories: getEntityRecords('taxonomy', 'category', { per_page: -1 }) || [],
			isLoading: !getEntityRecords('postType', 'post', postsQuery)
		};
	}, [postsPerPage, categories, tags, orderBy, order]);

	const layoutPresets = [
		{ key: 'grid-layout', icon: '📱', name: 'Grid Layout', desc: 'Card-style post previews in grid' },
		{ key: 'list-view', icon: '📋', name: 'List View', desc: 'Minimal post titles and dates' },
		{ key: 'featured-post', icon: '⭐', name: 'Featured Post', desc: 'One large + smaller posts' },
		{ key: 'masonry', icon: '🧱', name: 'Masonry', desc: 'Pinterest-style layout' },
		{ key: 'carousel', icon: '🎠', name: 'Carousel', desc: 'Horizontal scrolling posts' }
	];

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		if (dateFormat === 'relative') {
			const now = new Date();
			const diffTime = Math.abs(now - date);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			
			if (diffDays === 1) return '1 day ago';
			if (diffDays < 7) return `${diffDays} days ago`;
			if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
			return `${Math.ceil(diffDays / 30)} months ago`;
		}
		return date.toLocaleDateString();
	};

	const getExcerpt = (content, length = excerptLength) => {
		const text = content.rendered.replace(/<[^>]*>/g, '');
		return text.length > length ? text.substring(0, length) + '...' : text;
	};

	const getFeaturedImage = (post) => {
		if (!showFeaturedImage) return null;
		return post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
	};

	const getAuthor = (post) => {
		return post._embedded?.author?.[0]?.name || 'Unknown Author';
	};

	const getPostCategories = (post) => {
		return post._embedded?.['wp:term']?.[0] || [];
	};

	const renderPostCard = (post, index, isFeatured = false) => {
		const featuredImage = getFeaturedImage(post);
		const postCategories = getPostCategories(post);
		
		const cardClasses = `post-card ${cardStyle === 'elevated' ? 'bg-white shadow-lg' : 
			cardStyle === 'bordered' ? 'bg-white border border-gray-200' : 'bg-transparent'} 
			rounded-lg overflow-hidden transition-all duration-300 post-hover-${hoverEffect} ${isFeatured ? 'featured-post-card' : ''}`;

		return (
			<article key={post.id} className={cardClasses}>
				{featuredImage && (
					<div className={`post-image ${imageAspectRatio === '16:9' ? 'aspect-video' : 
						imageAspectRatio === '4:3' ? 'aspect-4/3' : 'aspect-square'} overflow-hidden`}>
						<img 
							src={featuredImage} 
							alt={post.title.rendered}
							className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
						/>
					</div>
				)}

				<div className="post-content p-6">
					{showCategories && postCategories.length > 0 && (
						<div className="post-categories mb-3 flex flex-wrap gap-2">
							{postCategories.slice(0, 2).map(category => (
								<span 
									key={category.id}
									className="category-tag bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
								>
									{category.name}
								</span>
							))}
						</div>
					)}

					<h3 className={`post-title font-bold mb-3 ${isFeatured ? 'text-2xl' : 'text-xl'} leading-tight`}>
						<a href={post.link} className="text-gray-900 hover:text-blue-600 transition-colors duration-200">
							{post.title.rendered}
						</a>
					</h3>

					{showExcerpt && (
						<div className="post-excerpt text-gray-600 mb-4 leading-relaxed">
							{getExcerpt(post.content)}
						</div>
					)}

					<div className="post-meta flex items-center justify-between text-sm text-gray-500">
						<div className="meta-left flex items-center space-x-4">
							{showAuthor && (
								<span className="post-author">
									By {getAuthor(post)}
								</span>
							)}
							{showDate && (
								<time className="post-date">
									{formatDate(post.date)}
								</time>
							)}
							{showReadTime && (
								<span className="read-time">
									{Math.ceil(post.content.rendered.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read
								</span>
							)}
						</div>

						{showReadMore && (
							<a 
								href={post.link}
								className="read-more text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
							>
								{readMoreText} →
							</a>
						)}
					</div>
				</div>
			</article>
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

	const renderPosts = () => {
		if (isLoading) {
			return (
				<div className="loading-state text-center py-8">
					<div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
					<p className="text-gray-500">Loading posts...</p>
				</div>
			);
		}

		if (!posts || posts.length === 0) {
			return (
				<div className="empty-state text-center py-8">
					<div className="text-gray-400 text-lg mb-2">📝</div>
					<p className="text-gray-500">{noPostsMessage}</p>
				</div>
			);
		}

		switch (layout) {
			case 'featured-post':
				const featuredPost = posts[0];
				const otherPosts = posts.slice(1, 5);
				
				return (
					<div className="featured-layout">
						<div className="featured-post mb-8">
							{renderPostCard(featuredPost, 0, true)}
						</div>
						{otherPosts.length > 0 && (
							<div className="other-posts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{otherPosts.map((post, index) => renderPostCard(post, index + 1))}
							</div>
						)}
					</div>
				);

			case 'list-view':
				return (
					<div className="posts-list space-y-4">
						{posts.map((post, index) => (
							<div key={post.id} className="list-post-item flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
								{showFeaturedImage && getFeaturedImage(post) && (
									<div className="post-thumbnail w-16 h-16 flex-shrink-0">
										<img 
											src={getFeaturedImage(post)} 
											alt={post.title.rendered}
											className="w-full h-full object-cover rounded"
										/>
									</div>
								)}
								<div className="post-info flex-grow">
									<h3 className="post-title font-semibold text-lg mb-1">
										<a href={post.link} className="text-gray-900 hover:text-blue-600">
											{post.title.rendered}
										</a>
									</h3>
									<div className="post-meta text-sm text-gray-500">
										{showAuthor && <span>By {getAuthor(post)}</span>}
										{showDate && <span className="ml-2">{formatDate(post.date)}</span>}
									</div>
								</div>
							</div>
						))}
					</div>
				);

			case 'masonry':
				return (
					<div className="posts-masonry columns-1 md:columns-2 lg:columns-3 gap-6">
						{posts.map((post, index) => (
							<div key={post.id} className="break-inside-avoid mb-6">
								{renderPostCard(post, index)}
							</div>
						))}
					</div>
				);

			default: // grid-layout
				return (
					<div className={`posts-grid grid gap-6 ${getGridColumns()}`}>
						{posts.map((post, index) => renderPostCard(post, index))}
					</div>
				);
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

			<PanelBody title={__('📝 Query Settings', 'tailwind-starter')} initialOpen={false}>
				<RangeControl
					label={__('Posts Per Page', 'tailwind-starter')}
					value={postsPerPage}
					onChange={(value) => setAttributes({ postsPerPage: value })}
					min={1}
					max={20}
				/>

				<SelectControl
					label={__('Order By', 'tailwind-starter')}
					value={orderBy}
					onChange={(value) => setAttributes({ orderBy: value })}
					options={[
						{ label: 'Date', value: 'date' },
						{ label: 'Title', value: 'title' },
						{ label: 'Menu Order', value: 'menu_order' },
						{ label: 'Random', value: 'rand' }
					]}
				/>

				<SelectControl
					label={__('Order', 'tailwind-starter')}
					value={order}
					onChange={(value) => setAttributes({ order: value })}
					options={[
						{ label: 'Descending', value: 'desc' },
						{ label: 'Ascending', value: 'asc' }
					]}
				/>

				{allCategories.length > 0 && (
					<>
		
						<p className="text-sm font-medium">Filter by Categories:</p>
						{allCategories.map(category => (
							<ToggleControl
								key={category.id}
								label={category.name}
								checked={categories.includes(category.id)}
								onChange={(checked) => {
									const newCategories = checked 
										? [...categories, category.id]
										: categories.filter(id => id !== category.id);
									setAttributes({ categories: newCategories });
								}}
							/>
						))}
					</>
				)}

				<ToggleControl
					label={__('Exclude Current Post', 'tailwind-starter')}
					checked={excludeCurrentPost}
					onChange={(value) => setAttributes({ excludeCurrentPost: value })}
				/>
			</PanelBody>

			<PanelBody title={__('⚙️ Display Settings', 'tailwind-starter')} initialOpen={false}>
				<ToggleControl
					label={__('Show Section Header', 'tailwind-starter')}
					checked={showSectionHeader}
					onChange={(value) => setAttributes({ showSectionHeader: value })}
				/>



				<RangeControl
					label={__('Columns', 'tailwind-starter')}
					value={columns}
					onChange={(value) => setAttributes({ columns: value })}
					min={1}
					max={4}
				/>

				<ToggleControl
					label={__('Show Featured Image', 'tailwind-starter')}
					checked={showFeaturedImage}
					onChange={(value) => setAttributes({ showFeaturedImage: value })}
				/>

				<ToggleControl
					label={__('Show Excerpt', 'tailwind-starter')}
					checked={showExcerpt}
					onChange={(value) => setAttributes({ showExcerpt: value })}
				/>

				<ToggleControl
					label={__('Show Author', 'tailwind-starter')}
					checked={showAuthor}
					onChange={(value) => setAttributes({ showAuthor: value })}
				/>

				<ToggleControl
					label={__('Show Date', 'tailwind-starter')}
					checked={showDate}
					onChange={(value) => setAttributes({ showDate: value })}
				/>

				<ToggleControl
					label={__('Show Categories', 'tailwind-starter')}
					checked={showCategories}
					onChange={(value) => setAttributes({ showCategories: value })}
				/>

				<ToggleControl
					label={__('Show Read Time', 'tailwind-starter')}
					checked={showReadTime}
					onChange={(value) => setAttributes({ showReadTime: value })}
				/>

				<ToggleControl
					label={__('Show Read More', 'tailwind-starter')}
					checked={showReadMore}
					onChange={(value) => setAttributes({ showReadMore: value })}
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
					label={__('Hover Effect', 'tailwind-starter')}
					value={hoverEffect}
					onChange={(value) => setAttributes({ hoverEffect: value })}
					options={[
						{ label: 'Lift', value: 'lift' },
						{ label: 'Scale', value: 'scale' },
						{ label: 'Shadow', value: 'shadow' }
					]}
				/>

				<SelectControl
					label={__('Image Aspect Ratio', 'tailwind-starter')}
					value={imageAspectRatio}
					onChange={(value) => setAttributes({ imageAspectRatio: value })}
					options={[
						{ label: '16:9', value: '16:9' },
						{ label: '4:3', value: '4:3' },
						{ label: 'Square', value: 'square' }
					]}
				/>

				<SelectControl
					label={__('Date Format', 'tailwind-starter')}
					value={dateFormat}
					onChange={(value) => setAttributes({ dateFormat: value })}
					options={[
						{ label: 'Relative (e.g., 2 days ago)', value: 'relative' },
						{ label: 'Absolute (e.g., Jan 15, 2024)', value: 'absolute' }
					]}
				/>

				<RangeControl
					label={__('Excerpt Length', 'tailwind-starter')}
					value={excerptLength}
					onChange={(value) => setAttributes({ excerptLength: value })}
					min={50}
					max={300}
				/>

				<TextControl
					label={__('Read More Text', 'tailwind-starter')}
					value={readMoreText}
					onChange={(value) => setAttributes({ readMoreText: value })}
				/>

				<TextControl
					label={__('No Posts Message', 'tailwind-starter')}
					value={noPostsMessage}
					onChange={(value) => setAttributes({ noPostsMessage: value })}
				/>
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
				background={settings?.backgroundColor || 'bg-white'}
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

				{renderPosts()}
			</div>
		</>
	);
} 