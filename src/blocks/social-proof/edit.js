import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, RichText } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	RangeControl,
	TextControl,
	Button,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		testimonials,
		logos,
		trustBadges,
		showRatings,
		showAvatars,
		autoplay,
		autoplaySpeed,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		columns,
		cardStyle,
		hoverEffect,
		textAlignment,
		settings = {},
		activeDevice
	} = attributes;

	const [editingItem, setEditingItem] = useState(null);

	// Enhanced preset styles for social proof
	const presets = {
		trustworthy: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-center' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		modern: {
			spacing: { base: { top: 10, right: 5, bottom: 10, left: 5 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-medium', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
			textColor: 'text-gray-800',
			gradients: {},
			layout: {},
			effects: {}
		},
		corporate: {
			spacing: { base: { top: 6, right: 3, bottom: 6, left: 3 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-semibold', textAlign: 'text-left' } },
			backgroundColor: 'bg-gray-50',
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
		className: `social-proof social-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'testimonial-carousel', icon: '🎠', name: 'Testimonial Carousel', desc: 'Sliding testimonials with autoplay' },
		{ key: 'review-cards', icon: '⭐', name: 'Review Cards', desc: 'Grid of review cards with ratings' },
		{ key: 'logo-grid', icon: '🏢', name: 'Logo Grid', desc: 'Company logos in grid layout' },
		{ key: 'trust-badges', icon: '🛡️', name: 'Trust Badges', desc: 'Security and trust indicators' }
	];

	const updateTestimonial = (index, field, value) => {
		const updated = [...testimonials];
		updated[index] = { ...updated[index], [field]: value };
		setAttributes({ testimonials: updated });
	};

	const updateLogo = (index, field, value) => {
		const updated = [...logos];
		updated[index] = { ...updated[index], [field]: value };
		setAttributes({ logos: updated });
	};

	const updateTrustBadge = (index, field, value) => {
		const updated = [...trustBadges];
		updated[index] = { ...updated[index], [field]: value };
		setAttributes({ trustBadges: updated });
	};

	const addTestimonial = () => {
		const newTestimonial = {
			id: `testimonial-${Date.now()}`,
			name: 'Customer Name',
			position: 'Job Title',
			company: 'Company Name',
			content: 'Great testimonial content here.',
			rating: 5,
			avatar: null
		};
		setAttributes({ testimonials: [...testimonials, newTestimonial] });
	};

	const addLogo = () => {
		const newLogo = {
			id: `logo-${Date.now()}`,
			name: 'Company Name',
			image: null,
			url: '#'
		};
		setAttributes({ logos: [...logos, newLogo] });
	};

	const addTrustBadge = () => {
		const newBadge = {
			id: `badge-${Date.now()}`,
			name: 'Trust Badge',
			description: 'Badge description',
			icon: 'check'
		};
		setAttributes({ trustBadges: [...trustBadges, newBadge] });
	};

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

			<PanelBody title={__('⚙️ Display Settings', 'tailwind-starter')} initialOpen={false}>
				<ToggleControl
					label={__('Show Section Header', 'tailwind-starter')}
					checked={showSectionHeader}
					onChange={(value) => setAttributes({ showSectionHeader: value })}
				/>

				<Divider />

				{(layout === 'testimonial-carousel' || layout === 'review-cards') && (
					<>
						<ToggleControl
							label={__('Show Ratings', 'tailwind-starter')}
							checked={showRatings}
							onChange={(value) => setAttributes({ showRatings: value })}
						/>
						<ToggleControl
							label={__('Show Avatars', 'tailwind-starter')}
							checked={showAvatars}
							onChange={(value) => setAttributes({ showAvatars: value })}
						/>
					</>
				)}

				{layout === 'review-cards' && (
					<RangeControl
						label={__('Columns', 'tailwind-starter')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={4}
					/>
				)}

				{layout === 'testimonial-carousel' && (
					<>
						<Divider />
						<ToggleControl
							label={__('Autoplay', 'tailwind-starter')}
							checked={autoplay}
							onChange={(value) => setAttributes({ autoplay: value })}
						/>
						{autoplay && (
							<RangeControl
								label={__('Autoplay Speed (ms)', 'tailwind-starter')}
								value={autoplaySpeed}
								onChange={(value) => setAttributes({ autoplaySpeed: value })}
								min={2000}
								max={10000}
								step={500}
							/>
						)}
					</>
				)}

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
						{ label: 'None', value: 'none' }
					]}
				/>

				<SelectControl
					label={__('Text Alignment', 'tailwind-starter')}
					value={textAlignment}
					onChange={(value) => setAttributes({ textAlignment: value })}
					options={[
						{ label: 'Left', value: 'left' },
						{ label: 'Center', value: 'center' },
						{ label: 'Right', value: 'right' }
					]}
				/>
			</PanelBody>

			{(layout === 'testimonial-carousel' || layout === 'review-cards') && (
				<PanelBody title={__('💬 Testimonials Management', 'tailwind-starter')} initialOpen={false}>
					{testimonials.map((testimonial, index) => (
						<div key={testimonial.id} className="testimonial-config mb-4 p-4 border rounded">
							<div className="flex justify-between items-center mb-2">
								<h4><strong>{testimonial.name}</strong></h4>
								<Button
									onClick={() => setEditingItem(editingItem === `testimonial-${index}` ? null : `testimonial-${index}`)}
									variant="secondary"
									size="small"
								>
									{editingItem === `testimonial-${index}` ? __('Collapse', 'tailwind-starter') : __('Edit', 'tailwind-starter')}
								</Button>
							</div>

							{editingItem === `testimonial-${index}` && (
								<>
									<TextControl
										label={__('Name', 'tailwind-starter')}
										value={testimonial.name}
										onChange={(value) => updateTestimonial(index, 'name', value)}
									/>
									<TextControl
										label={__('Position', 'tailwind-starter')}
										value={testimonial.position}
										onChange={(value) => updateTestimonial(index, 'position', value)}
									/>
									<TextControl
										label={__('Company', 'tailwind-starter')}
										value={testimonial.company}
										onChange={(value) => updateTestimonial(index, 'company', value)}
									/>
									<RangeControl
										label={__('Rating', 'tailwind-starter')}
										value={testimonial.rating}
										onChange={(value) => updateTestimonial(index, 'rating', value)}
										min={1}
										max={5}
										step={1}
									/>
									{showAvatars && (
										<>
											<label>{__('Avatar', 'tailwind-starter')}</label>
											<MediaUpload
												onSelect={(media) => updateTestimonial(index, 'avatar', media)}
												allowedTypes={['image']}
												value={testimonial.avatar?.id}
												render={({ open }) => (
													<Button onClick={open} variant="secondary">
														{testimonial.avatar ? __('Change Avatar', 'tailwind-starter') : __('Select Avatar', 'tailwind-starter')}
													</Button>
												)}
											/>
										</>
									)}
								</>
							)}
						</div>
					))}
					<Button onClick={addTestimonial} variant="secondary">
						{__('Add Testimonial', 'tailwind-starter')}
					</Button>
				</PanelBody>
			)}

			{layout === 'logo-grid' && (
				<PanelBody title={__('🏢 Company Logos', 'tailwind-starter')} initialOpen={false}>
					{logos.map((logo, index) => (
						<div key={logo.id} className="logo-config mb-4 p-4 border rounded">
							<TextControl
								label={__('Company Name', 'tailwind-starter')}
								value={logo.name}
								onChange={(value) => updateLogo(index, 'name', value)}
							/>
							<TextControl
								label={__('URL', 'tailwind-starter')}
								value={logo.url}
								onChange={(value) => updateLogo(index, 'url', value)}
							/>
							<MediaUpload
								onSelect={(media) => updateLogo(index, 'image', media)}
								allowedTypes={['image']}
								value={logo.image?.id}
								render={({ open }) => (
									<Button onClick={open} variant="secondary">
										{logo.image ? __('Change Logo', 'tailwind-starter') : __('Select Logo', 'tailwind-starter')}
									</Button>
								)}
							/>
						</div>
					))}
					<Button onClick={addLogo} variant="secondary">
						{__('Add Logo', 'tailwind-starter')}
					</Button>
				</PanelBody>
			)}

			{layout === 'trust-badges' && (
				<PanelBody title={__('🛡️ Trust Badges', 'tailwind-starter')} initialOpen={false}>
					{trustBadges.map((badge, index) => (
						<div key={badge.id} className="badge-config mb-4 p-4 border rounded">
							<TextControl
								label={__('Badge Name', 'tailwind-starter')}
								value={badge.name}
								onChange={(value) => updateTrustBadge(index, 'name', value)}
							/>
							<TextControl
								label={__('Description', 'tailwind-starter')}
								value={badge.description}
								onChange={(value) => updateTrustBadge(index, 'description', value)}
							/>
							<SelectControl
								label={__('Icon', 'tailwind-starter')}
								value={badge.icon}
								options={[
									{ label: __('Shield', 'tailwind-starter'), value: 'shield' },
									{ label: __('Check', 'tailwind-starter'), value: 'check' }
								]}
								onChange={(value) => updateTrustBadge(index, 'icon', value)}
							/>
						</div>
					))}
					<Button onClick={addTrustBadge} variant="secondary">
						{__('Add Trust Badge', 'tailwind-starter')}
					</Button>
				</PanelBody>
			)}
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

				{layout === 'testimonial-carousel' && (
					<div className="testimonial-carousel">
						<div className="testimonial-slide bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
							{testimonials.length > 0 && (
								<>
									{showRatings && (
										<div className="flex justify-center mb-4">
											{renderStars(testimonials[0].rating)}
										</div>
									)}
									<RichText
										tagName="blockquote"
										className="text-lg mb-6 italic"
										value={testimonials[0].content}
										onChange={(value) => updateTestimonial(0, 'content', value)}
										placeholder={__('Testimonial content...', 'tailwind-starter')}
									/>
									<div className="testimonial-author flex items-center justify-center">
										{showAvatars && testimonials[0].avatar && (
											<img 
												src={testimonials[0].avatar.url} 
												alt={testimonials[0].name}
												className="w-12 h-12 rounded-full mr-4"
											/>
										)}
										<div>
											<div className="font-semibold">{testimonials[0].name}</div>
											<div className="text-sm text-gray-600">
												{testimonials[0].position}, {testimonials[0].company}
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				)}

				{layout === 'review-cards' && (
					<div className={`review-cards grid gap-6 ${
						columns === 1 ? 'grid-cols-1' :
						columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
						columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
						'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
					}`}>
						{testimonials.map((testimonial, index) => {
							const cardClasses = `review-card p-6 rounded-lg transition-all duration-300 ${
								cardStyle === 'elevated' ? 'bg-white shadow-lg' :
								cardStyle === 'bordered' ? 'bg-white border border-gray-200' :
								'bg-transparent'
							} ${
								hoverEffect === 'lift' ? 'hover:-translate-y-2 hover:shadow-xl' :
								hoverEffect === 'scale' ? 'hover:scale-105' : ''
							} text-${textAlignment}`;

							return (
								<div key={testimonial.id} className={cardClasses}>
									{showRatings && (
										<div className={`flex mb-3 ${textAlignment === 'center' ? 'justify-center' : textAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
											{renderStars(testimonial.rating)}
										</div>
									)}
									<RichText
										tagName="p"
										className="text-gray-600 mb-4"
										value={testimonial.content}
										onChange={(value) => updateTestimonial(index, 'content', value)}
										placeholder={__('Review content...', 'tailwind-starter')}
									/>
									<div className={`reviewer flex items-center ${textAlignment === 'center' ? 'justify-center' : textAlignment === 'right' ? 'justify-end' : ''}`}>
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
							);
						})}
					</div>
				)}

				{layout === 'logo-grid' && (
					<div className="logo-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
						{logos.map((logo, index) => (
							<div key={logo.id} className="logo-item text-center">
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
		</>
	);
}