import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		layout,
		faqs,
		showSearch,
		searchPlaceholder,
		showCategories,
		showIcons,
		allowMultipleOpen,
		animationSpeed,
		accordionStyle,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		emptyStateMessage,
		categoriesFilter,
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `faq-accordion faq-${layout}`,
		'data-allow-multiple': allowMultipleOpen,
		'data-animation-speed': animationSpeed,
		'data-accordion-style': accordionStyle
	});

	// Group FAQs by category for categorized layout
	const groupedFaqs = faqs.reduce((groups, faq) => {
		const category = faq.category || 'general';
		if (!groups[category]) {
			groups[category] = {
				label: faq.categoryLabel || 'General',
				items: []
			};
		}
		groups[category].items.push(faq);
		return groups;
	}, {});

	const renderFaqItem = (faq, index) => {
		return (
			<div 
				key={faq.id} 
				className={`faq-item ${accordionStyle === 'bordered' ? 'border border-gray-200 rounded-lg mb-2' : 
					accordionStyle === 'cards' ? 'bg-white border border-gray-200 rounded-lg shadow-sm mb-4' : 'border-b border-gray-200'
				} ${faq.isOpen ? 'faq-open' : ''}`}
				data-faq-id={faq.id}
				data-category={faq.category}
				data-featured={faq.featured}
			>
				<div 
					className="faq-question cursor-pointer p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
					role="button"
					tabIndex="0"
					aria-expanded={faq.isOpen}
					data-faq-toggle
				>
					<div className="flex items-center space-x-3 flex-1">
						{showIcons && layout === 'icon-accordion' && (
							<span className="faq-icon text-xl">{faq.icon}</span>
						)}
						<h4 className="font-semibold text-gray-900">{faq.question}</h4>
						{faq.featured && (
							<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Featured</span>
						)}
					</div>
					<div className={`faq-toggle transition-transform duration-200 ${faq.isOpen ? 'rotate-180' : ''}`}>
						<svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
				<div 
					className={`faq-answer overflow-hidden transition-all ${
						animationSpeed === 'fast' ? 'duration-150' :
						animationSpeed === 'slow' ? 'duration-500' : 'duration-300'
					} ${faq.isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
					aria-hidden={!faq.isOpen}
				>
					<div className="p-4 pt-0 text-gray-600 leading-relaxed">
						{faq.answer}
					</div>
				</div>
			</div>
		);
	};

	const renderCategorizedFaqs = () => {
		return Object.entries(groupedFaqs).map(([categoryKey, categoryData]) => (
			<div key={categoryKey} className="faq-category mb-8" data-category={categoryKey}>
				<h3 className="text-xl font-semibold mb-4 text-gray-800">{categoryData.label}</h3>
				<div className="faq-category-items space-y-2">
					{categoryData.items.map((faq, index) => renderFaqItem(faq, index))}
				</div>
			</div>
		));
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

			{(showSearch || layout === 'search-enabled') && (
				<div className="faq-search mb-6">
					<div className="relative">
						<input
							type="text"
							className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder={searchPlaceholder}
							data-faq-search
						/>
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>
				</div>
			)}

			<div className="faq-container">
				<div className="faq-content">
					{(showCategories || layout === 'categorized-faq') ? (
						renderCategorizedFaqs()
					) : (
						<div className="faq-items space-y-2">
							{faqs.map((faq, index) => renderFaqItem(faq, index))}
						</div>
					)}
				</div>
				
				<div className="faq-empty-state hidden text-center py-8">
					<div className="text-gray-400 text-lg mb-2">❓</div>
					<p className="text-gray-500">{emptyStateMessage}</p>
				</div>
			</div>
		</div>
	);
} 