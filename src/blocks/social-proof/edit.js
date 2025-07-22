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
import { UltimateControlTabs } from '../../utils/visual-controls.js';
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
		visualSettings
	} = attributes;

	const [editingItem, setEditingItem] = useState(null);

	const blockProps = useBlockProps({
		className: `social-proof social-${layout}`
	});

	const layoutOptions = [
		{ label: __('Testimonial Carousel', 'tailwind-starter'), value: 'testimonial-carousel' },
		{ label: __('Logo Grid', 'tailwind-starter'), value: 'logo-grid' },
		{ label: __('Review Cards', 'tailwind-starter'), value: 'review-cards' },
		{ label: __('Trust Badges', 'tailwind-starter'), value: 'trust-badges' }
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

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Social Proof Settings', 'tailwind-starter')} initialOpen={true}>
					<SelectControl
						label={__('Layout Style', 'tailwind-starter')}
						value={layout}
						options={layoutOptions}
						onChange={(value) => setAttributes({ layout: value })}
					/>

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
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							)}
						</>
					)}
				</PanelBody>

				{(layout === 'testimonial-carousel' || layout === 'review-cards') && (
					<PanelBody title={__('Testimonials', 'tailwind-starter')} initialOpen={false}>
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
											__nextHasNoMarginBottom
											__next40pxDefaultSize
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
					<PanelBody title={__('Company Logos', 'tailwind-starter')} initialOpen={false}>
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
					<PanelBody title={__('Trust Badges', 'tailwind-starter')} initialOpen={false}>
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

				<PanelBody title={__('🎨 Visual Design Studio', 'tailwind-starter')} initialOpen={false}>
					<UltimateControlTabs
						spacing={visualSettings.spacing || {}}
						onSpacingChange={(spacing) => setAttributes({
							visualSettings: { ...visualSettings, spacing }
						})}
						background={visualSettings.backgroundColor}
						onBackgroundChange={(backgroundColor) => setAttributes({
							visualSettings: { ...visualSettings, backgroundColor }
						})}
						textColor={visualSettings.textColor}
						onTextColorChange={(textColor) => setAttributes({
							visualSettings: { ...visualSettings, textColor }
						})}
						typography={visualSettings.typography || {}}
						onTypographyChange={(typography) => setAttributes({
							visualSettings: { ...visualSettings, typography }
						})}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
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
					<div className="review-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{testimonials.map((testimonial, index) => (
							<div key={testimonial.id} className="review-card bg-white p-6 rounded-lg shadow-md">
								{showRatings && (
									<div className="flex mb-3">
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
								<div className="reviewer flex items-center">
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
						))}
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