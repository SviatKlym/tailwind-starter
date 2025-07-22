import { useBlockProps, RichText } from '@wordpress/block-editor';
import { generateAllClasses } from '../../utils/visual-controls.js';

export default function save({ attributes }) {
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
		settings,
		activeDevice
	} = attributes;

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings);

	const blockProps = useBlockProps.save({
		className: `recent-posts posts-${layout}`,
		'data-classes': allClasses,
		'data-attributes': JSON.stringify({
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
			enablePagination,
			enableLoadMore,
			enableCategoryFilter,
			showPostViews
		})
	});

	const getGridColumns = () => {
		switch (columns) {
			case 1: return 'grid-cols-1';
			case 2: return 'grid-cols-1 md:grid-cols-2';
			case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
			case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
			default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
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

			{enableCategoryFilter && (
				<div className="category-filters text-center mb-8">
					<div className="inline-flex space-x-2 bg-gray-100 p-1 rounded-lg">
						<button 
							className="filter-btn active px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm"
							data-category="all"
							aria-label="Show all posts"
						>
							All
						</button>
						{/* Category buttons will be populated by frontend JavaScript */}
					</div>
				</div>
			)}

			{/* Posts container - content will be populated by frontend JavaScript */}
			<div className="posts-container">
				{layout === 'featured-post' ? (
					<div className="featured-layout">
						<div className="featured-post mb-8">
							{/* Featured post will be loaded here */}
						</div>
						<div className={`other-posts grid gap-6 ${getGridColumns()}`}>
							{/* Other posts will be loaded here */}
						</div>
					</div>
				) : layout === 'list-view' ? (
					<div className="posts-list space-y-4">
						{/* List posts will be loaded here */}
					</div>
				) : layout === 'masonry' ? (
					<div className="posts-masonry columns-1 md:columns-2 lg:columns-3 gap-6">
						{/* Masonry posts will be loaded here */}
					</div>
				) : layout === 'carousel' ? (
					<div className="posts-carousel-container relative">
						<div className="posts-carousel overflow-hidden">
							<div className="carousel-track flex transition-transform duration-500">
								{/* Carousel posts will be loaded here */}
							</div>
						</div>
						<button 
							className="carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
							aria-label="Previous posts"
						>
							<span aria-hidden="true">←</span>
						</button>
						<button 
							className="carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
							aria-label="Next posts"
						>
							<span aria-hidden="true">→</span>
						</button>
					</div>
				) : (
					<div className={`posts-grid grid gap-6 ${getGridColumns()}`}>
						{/* Grid posts will be loaded here */}
					</div>
				)}
			</div>

			{/* Loading state */}
			<div className="loading-state text-center py-8 hidden">
				<div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
				<p className="text-gray-500">Loading posts...</p>
			</div>

			{/* Empty state */}
			<div className="empty-state text-center py-8 hidden">
				<div className="text-gray-400 text-lg mb-2" aria-hidden="true">📝</div>
				<p className="text-gray-500">{noPostsMessage}</p>
			</div>

			{/* Load more button */}
			{enableLoadMore && (
				<div className="load-more-container text-center mt-8 hidden">
					<button className="load-more-btn bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
						Load More Posts
					</button>
				</div>
			)}

			{/* Pagination */}
			{enablePagination && (
				<div className="pagination-container flex justify-center mt-8 hidden">
					<nav className="pagination flex space-x-2">
						{/* Pagination will be populated by frontend JavaScript */}
					</nav>
				</div>
			)}

			{/* Filter empty state */}
			{enableCategoryFilter && (
				<div className="filter-empty-state text-center py-8 hidden">
					<div className="text-gray-400 text-lg mb-2" aria-hidden="true">🔍</div>
					<p className="text-gray-500">No posts found in this category.</p>
				</div>
			)}
		</div>
	);
} 