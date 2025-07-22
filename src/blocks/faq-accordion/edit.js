import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	Button,
	TextareaControl,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateTailwindClasses, generateAllClasses } from '../../utils/visual-controls.js';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
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
		settings,
		activeDevice
	} = attributes;

	const [editingFaq, setEditingFaq] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	// Enhanced preset styles for FAQ accordion
	const presets = {
		professional: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-left' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		modern: {
			spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-medium', textAlign: 'text-left' } },
			backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
			textColor: 'text-gray-800',
			gradients: {},
			layout: {},
			effects: {}
		},
		minimal: {
			spacing: { base: { top: 6, right: 2, bottom: 6, left: 2 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-light', textAlign: 'text-left' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-700',
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
		className: `faq-accordion faq-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'simple-accordion', icon: '📋', name: 'Simple Accordion', desc: 'Basic expand/collapse' },
		{ key: 'categorized-faq', icon: '🗂️', name: 'Categorized FAQ', desc: 'Grouped by topic' },
		{ key: 'search-enabled', icon: '🔍', name: 'Search Enabled', desc: 'Live search functionality' },
		{ key: 'icon-accordion', icon: '🎨', name: 'Icon Accordion', desc: 'Questions with icons' }
	];

	const updateFaq = (faqIndex, field, value) => {
		const updatedFaqs = [...faqs];
		updatedFaqs[faqIndex] = {
			...updatedFaqs[faqIndex],
			[field]: value
		};
		setAttributes({ faqs: updatedFaqs });
	};

	const addFaq = () => {
		const newFaq = {
			id: `faq-${Date.now()}`,
			question: 'New question?',
			answer: 'Answer for this question...',
			category: 'general',
			categoryLabel: 'General',
			icon: '❓',
			isOpen: false,
			featured: false
		};
		setAttributes({ faqs: [...faqs, newFaq] });
	};

	const removeFaq = (faqIndex) => {
		const updatedFaqs = faqs.filter((_, index) => index !== faqIndex);
		setAttributes({ faqs: updatedFaqs });
	};

	const toggleFaqOpen = (faqIndex) => {
		const updatedFaqs = [...faqs];
		
		if (!allowMultipleOpen) {
			// Close all other FAQs
			updatedFaqs.forEach((faq, index) => {
				if (index !== faqIndex) {
					updatedFaqs[index].isOpen = false;
				}
			});
		}
		
		updatedFaqs[faqIndex].isOpen = !updatedFaqs[faqIndex].isOpen;
		setAttributes({ faqs: updatedFaqs });
	};

	// Filter FAQs based on search and categories
	const filteredFaqs = faqs.filter(faq => {
		const matchesSearch = searchTerm === '' || 
			faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
		
		return matchesSearch;
	});

	// Group FAQs by category for categorized layout
	const groupedFaqs = filteredFaqs.reduce((groups, faq) => {
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
		const globalIndex = faqs.findIndex(f => f.id === faq.id);
		
		return (
			<div 
				key={faq.id} 
				className={`faq-item ${accordionStyle === 'bordered' ? 'border border-gray-200 rounded-lg mb-2' : 'border-b border-gray-200'} ${faq.isOpen ? 'faq-open' : ''}`}
			>
				<div 
					className="faq-question cursor-pointer p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
					onClick={() => toggleFaqOpen(globalIndex)}
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
				{faq.isOpen && (
					<div className="faq-answer p-4 pt-0 text-gray-600 leading-relaxed">
						{faq.answer}
					</div>
				)}
			</div>
		);
	};

	const renderCategorizedFaqs = () => {
		return Object.entries(groupedFaqs).map(([categoryKey, categoryData]) => (
			<div key={categoryKey} className="faq-category mb-8">
				<h3 className="text-xl font-semibold mb-4 text-gray-800">{categoryData.label}</h3>
				<div className="faq-category-items space-y-2">
					{categoryData.items.map((faq, index) => renderFaqItem(faq, index))}
				</div>
			</div>
		));
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

				<PanelBody title={__('⚙️ Accordion Settings', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Section Header', 'tailwind-starter')}
						checked={showSectionHeader}
						onChange={(value) => setAttributes({ showSectionHeader: value })}
					/>

					<Divider />

					<ToggleControl
						label={__('Show Search', 'tailwind-starter')}
						checked={showSearch || layout === 'search-enabled'}
						onChange={(value) => setAttributes({ showSearch: value })}
						disabled={layout === 'search-enabled'}
					/>

					<ToggleControl
						label={__('Show Categories', 'tailwind-starter')}
						checked={showCategories || layout === 'categorized-faq'}
						onChange={(value) => setAttributes({ showCategories: value })}
						disabled={layout === 'categorized-faq'}
					/>

					<ToggleControl
						label={__('Show Icons', 'tailwind-starter')}
						checked={showIcons}
						onChange={(value) => setAttributes({ showIcons: value })}
					/>

					<ToggleControl
						label={__('Allow Multiple Open', 'tailwind-starter')}
						checked={allowMultipleOpen}
						onChange={(value) => setAttributes({ allowMultipleOpen: value })}
						help="Allow multiple FAQ items to be open simultaneously"
					/>

					<SelectControl
						label={__('Animation Speed', 'tailwind-starter')}
						value={animationSpeed}
						onChange={(value) => setAttributes({ animationSpeed: value })}
						options={[
							{ label: 'Fast', value: 'fast' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Slow', value: 'slow' }
						]}
					/>

					<SelectControl
						label={__('Accordion Style', 'tailwind-starter')}
						value={accordionStyle}
						onChange={(value) => setAttributes({ accordionStyle: value })}
						options={[
							{ label: 'Bordered', value: 'bordered' },
							{ label: 'Borderless', value: 'borderless' },
							{ label: 'Cards', value: 'cards' }
						]}
					/>

					<TextControl
						label={__('Search Placeholder', 'tailwind-starter')}
						value={searchPlaceholder}
						onChange={(value) => setAttributes({ searchPlaceholder: value })}
					/>

					<TextControl
						label={__('Empty State Message', 'tailwind-starter')}
						value={emptyStateMessage}
						onChange={(value) => setAttributes({ emptyStateMessage: value })}
					/>
				</PanelBody>

				<PanelBody title={__('📝 FAQ Management', 'tailwind-starter')} initialOpen={false}>
					{faqs.map((faq, index) => (
						<div key={faq.id} className="mb-6 p-4 border rounded">
							<div className="flex justify-between items-center mb-2">
								<strong>FAQ {index + 1}</strong>
								<div className="flex space-x-2">
									<Button
										isSecondary
										isSmall
										onClick={() => updateFaq(index, 'featured', !faq.featured)}
									>
										{faq.featured ? 'Unfeature' : 'Feature'}
									</Button>
									<Button
										isDestructive
										isSmall
										onClick={() => removeFaq(index)}
									>
										Remove
									</Button>
								</div>
							</div>
							<TextControl
								label="Question"
								value={faq.question}
								onChange={(value) => updateFaq(index, 'question', value)}
							/>
							<TextareaControl
								label="Answer"
								value={faq.answer}
								onChange={(value) => updateFaq(index, 'answer', value)}
								rows={3}
							/>
							<div className="flex space-x-2">
								<TextControl
									label="Category Key"
									value={faq.category}
									onChange={(value) => updateFaq(index, 'category', value)}
									placeholder="general"
								/>
								<TextControl
									label="Category Label"
									value={faq.categoryLabel}
									onChange={(value) => updateFaq(index, 'categoryLabel', value)}
									placeholder="General"
								/>
							</div>
							<TextControl
								label="Icon (Emoji)"
								value={faq.icon}
								onChange={(value) => updateFaq(index, 'icon', value)}
							/>
						</div>
					))}
					<Button
						isPrimary
						onClick={addFaq}
					>
						Add FAQ
					</Button>
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

				{(showSearch || layout === 'search-enabled') && (
					<div className="faq-search mb-6">
						<div className="relative">
							<input
								type="text"
								className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder={searchPlaceholder}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
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
					{filteredFaqs.length === 0 ? (
						<div className="empty-state text-center py-8">
							<div className="text-gray-400 text-lg mb-2">❓</div>
							<p className="text-gray-500">{emptyStateMessage}</p>
						</div>
					) : (
						<>
							{(showCategories || layout === 'categorized-faq') ? (
								renderCategorizedFaqs()
							) : (
								<div className="faq-items space-y-2">
									{filteredFaqs.map((faq, index) => renderFaqItem(faq, index))}
								</div>
							)}
						</>
					)}
				</div>

				<div className="generated-classes mt-4 p-3 bg-gray-100 rounded text-xs">
					<strong>Preview Classes:</strong> {previewClasses}<br />
					<strong>All Device Classes:</strong> {allClasses}
				</div>
			</div>
		</>
	);
} 