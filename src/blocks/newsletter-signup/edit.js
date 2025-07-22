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
		title,
		subtitle,
		showTitle,
		showSubtitle,
		emailPlaceholder,
		namePlaceholder,
		submitButtonText,
		successMessage,
		errorMessage,
		privacyText,
		showPrivacyText,
		showNameField,
		requireName,
		formAlignment,
		buttonStyle,
		buttonSize,
		inputStyle,
		formLayout,
		enableIcon,
		iconType,
		backgroundColor,
		textColor,
		accentColor,
		borderRadius,
		enableShadow,
		enableAnimation,
		animationType,
		modalTrigger,
		modalDelay,
		scrollPercentage,
		exitIntent,
		modalOverlayOpacity,
		enableCloseButton,
		enableEscapeKey,
		showOncePerSession,
		emailService,
		mailchimpApiKey,
		mailchimpListId,
		convertKitApiKey,
		convertKitFormId,
		customApiEndpoint,
		customApiMethod,
		enableDoubleOptIn,
		enableGDPRCompliance,
		gdprText,
		enableHoneypot,
		enableReCaptcha,
		recaptchaSiteKey,
		redirectUrl,
		enableRedirect,
		tags,
		customFields,
		enableAnalytics,
		conversionGoal,
		incentiveType,
		incentiveText,
		incentiveImage,
		showIncentive,
		socialProof,
		settings,
		activeDevice
	} = attributes;

	// Enhanced preset styles for newsletter signup
	const presets = {
		modern: {
			spacing: { base: { top: 6, right: 4, bottom: 6, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-semibold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		minimal: {
			spacing: { base: { top: 4, right: 3, bottom: 4, left: 3 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-sm', fontWeight: 'font-normal', textAlign: 'text-left' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-800',
			gradients: {},
			layout: {},
			effects: {}
		},
		bold: {
			spacing: { base: { top: 8, right: 6, bottom: 8, left: 6 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-bold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
			textColor: 'text-white',
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
		className: `newsletter-signup layout-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'inline-form', icon: '📧', name: 'Inline Form', desc: 'Simple email + button' },
		{ key: 'modal-popup', icon: '🪟', name: 'Modal Popup', desc: 'Triggered by scroll or time' },
		{ key: 'sidebar-widget', icon: '📌', name: 'Sidebar Widget', desc: 'Compact vertical form' },
		{ key: 'full-section', icon: '🎯', name: 'Full Section', desc: 'Prominent subscription area' }
	];

	const getFormAlignmentClass = () => {
		switch (formAlignment) {
			case 'left': return 'text-left';
			case 'center': return 'text-center';
			case 'right': return 'text-right';
			default: return 'text-left';
		}
	};

	const getButtonStyleClass = () => {
		switch (buttonStyle) {
			case 'primary': return 'bg-blue-600 hover:bg-blue-700 text-white';
			case 'secondary': return 'bg-gray-600 hover:bg-gray-700 text-white';
			case 'outline': return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white';
			case 'ghost': return 'text-blue-600 hover:bg-blue-50';
			default: return 'bg-blue-600 hover:bg-blue-700 text-white';
		}
	};

	const getButtonSizeClass = () => {
		switch (buttonSize) {
			case 'small': return 'px-4 py-2 text-sm';
			case 'medium': return 'px-6 py-3 text-base';
			case 'large': return 'px-8 py-4 text-lg';
			default: return 'px-6 py-3 text-base';
		}
	};

	const getInputStyleClass = () => {
		const baseClass = 'w-full border focus:ring-2 focus:border-transparent transition-all duration-200';
		switch (inputStyle) {
			case 'modern': return `${baseClass} border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500`;
			case 'minimal': return `${baseClass} border-0 border-b-2 border-gray-300 rounded-none px-2 py-2 focus:ring-blue-500`;
			case 'bordered': return `${baseClass} border-2 border-gray-400 rounded-md px-3 py-2 focus:ring-blue-500`;
			default: return `${baseClass} border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500`;
		}
	};

	const addCustomField = () => {
		const newField = {
			id: Date.now(),
			name: 'custom_field',
			label: 'Custom Field',
			type: 'text',
			required: false,
			placeholder: 'Enter value'
		};
		setAttributes({ customFields: [...customFields, newField] });
	};

	const updateCustomField = (index, key, value) => {
		const updatedFields = [...customFields];
		updatedFields[index] = { ...updatedFields[index], [key]: value };
		setAttributes({ customFields: updatedFields });
	};

	const removeCustomField = (index) => {
		const updatedFields = customFields.filter((_, i) => i !== index);
		setAttributes({ customFields: updatedFields });
	};

	const renderFormPreview = () => {
		const formClasses = `newsletter-form ${getFormAlignmentClass()}`;
		const inputClasses = getInputStyleClass();
		const buttonClasses = `${getButtonStyleClass()} ${getButtonSizeClass()} font-semibold rounded transition-all duration-200`;

		switch (layout) {
			case 'inline-form':
				return (
					<div className={formClasses}>
						{(showTitle || showSubtitle) && (
							<div className="form-header mb-4">
								{showTitle && title && (
									<h3 className="text-lg font-semibold mb-2">{title}</h3>
								)}
								{showSubtitle && subtitle && (
									<p className="text-gray-600 text-sm">{subtitle}</p>
								)}
							</div>
						)}

						<div className={`form-fields ${formLayout === 'horizontal' ? 'flex gap-2' : 'space-y-3'}`}>
							{showNameField && (
								<input
									type="text"
									placeholder={namePlaceholder}
									className={inputClasses}
									disabled
								/>
							)}
							<input
								type="email"
								placeholder={emailPlaceholder}
								className={inputClasses}
								disabled
							/>
							<button
								type="submit"
								className={buttonClasses}
								disabled
							>
								{enableIcon && iconType === 'arrow' && <span className="mr-2">→</span>}
								{submitButtonText}
							</button>
						</div>

						{showPrivacyText && privacyText && (
							<p className="text-xs text-gray-500 mt-2">{privacyText}</p>
						)}
					</div>
				);

			case 'modal-popup':
				return (
					<div className="modal-preview bg-black bg-opacity-50 p-8 rounded-lg">
						<div className="modal-content bg-white p-6 rounded-lg max-w-md mx-auto relative">
							{enableCloseButton && (
								<button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">✕</button>
							)}
							<div className={formClasses}>
								{enableIcon && iconType === 'email' && (
									<div className="text-center mb-4">
										<span className="text-4xl">📧</span>
									</div>
								)}
								{showTitle && title && (
									<h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
								)}
								{showSubtitle && subtitle && (
									<p className="text-gray-600 mb-4 text-center">{subtitle}</p>
								)}

								<div className="form-fields space-y-3">
									{showNameField && (
										<input
											type="text"
											placeholder={namePlaceholder}
											className={inputClasses}
											disabled
										/>
									)}
									<input
										type="email"
										placeholder={emailPlaceholder}
										className={inputClasses}
										disabled
									/>
									<button
										type="submit"
										className={`${buttonClasses} w-full`}
										disabled
									>
										{submitButtonText}
									</button>
								</div>

								{showPrivacyText && privacyText && (
									<p className="text-xs text-gray-500 mt-3 text-center">{privacyText}</p>
								)}
							</div>
						</div>
					</div>
				);

			case 'sidebar-widget':
				return (
					<div className="sidebar-widget bg-gray-50 p-4 rounded-lg max-w-xs">
						<div className={formClasses}>
							{enableIcon && iconType === 'email' && (
								<div className="text-center mb-3">
									<span className="text-2xl">📧</span>
								</div>
							)}
							{showTitle && title && (
								<h4 className="font-semibold mb-2 text-center">{title}</h4>
							)}
							{showSubtitle && subtitle && (
								<p className="text-gray-600 text-sm mb-3 text-center">{subtitle}</p>
							)}

							<div className="form-fields space-y-2">
								{showNameField && (
									<input
										type="text"
										placeholder={namePlaceholder}
										className={inputClasses}
										disabled
									/>
								)}
								<input
									type="email"
									placeholder={emailPlaceholder}
									className={inputClasses}
									disabled
								/>
								<button
									type="submit"
									className={`${buttonClasses} w-full text-sm`}
									disabled
								>
									{submitButtonText}
								</button>
							</div>

							{showPrivacyText && privacyText && (
								<p className="text-xs text-gray-500 mt-2 text-center">{privacyText}</p>
							)}
						</div>
					</div>
				);

			case 'full-section':
				return (
					<div className="full-section-preview bg-blue-50 p-8 rounded-lg">
						<div className={formClasses}>
							{enableIcon && iconType === 'email' && (
								<div className="text-center mb-6">
									<span className="text-6xl">📧</span>
								</div>
							)}
							
							{showIncentive && incentiveImage.url && (
								<div className="incentive-image text-center mb-4">
									<img 
										src={incentiveImage.url} 
										alt={incentiveImage.alt}
										className="w-24 h-24 object-cover rounded-lg mx-auto"
									/>
								</div>
							)}

							{showTitle && title && (
								<h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
							)}
							{showSubtitle && subtitle && (
								<p className="text-gray-600 text-lg mb-6 text-center max-w-2xl mx-auto">{subtitle}</p>
							)}

							{showIncentive && incentiveText && (
								<p className="text-blue-600 font-medium mb-4 text-center">{incentiveText}</p>
							)}

							{socialProof.enabled && (
								<p className="text-gray-500 text-sm mb-6 text-center">
									Join <strong>{socialProof.count}</strong> {socialProof.text}
								</p>
							)}

							<div className="form-fields max-w-md mx-auto">
								<div className={formLayout === 'horizontal' ? 'flex gap-3' : 'space-y-3'}>
									{showNameField && (
										<input
											type="text"
											placeholder={namePlaceholder}
											className={inputClasses}
											disabled
										/>
									)}
									<input
										type="email"
										placeholder={emailPlaceholder}
										className={inputClasses}
										disabled
									/>
									<button
										type="submit"
										className={buttonClasses}
										disabled
									>
										{submitButtonText}
									</button>
								</div>

								{enableGDPRCompliance && (
									<label className="flex items-start mt-3 text-sm">
										<input type="checkbox" className="mt-1 mr-2" disabled />
										<span className="text-gray-600">{gdprText}</span>
									</label>
								)}

								{showPrivacyText && privacyText && (
									<p className="text-xs text-gray-500 mt-3 text-center">{privacyText}</p>
								)}
							</div>
						</div>
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

				<PanelBody title={__('📝 Form Content', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Title', 'tailwind-starter')}
						checked={showTitle}
						onChange={(value) => setAttributes({ showTitle: value })}
					/>

					{showTitle && (
						<TextControl
							label={__('Title', 'tailwind-starter')}
							value={title}
							onChange={(value) => setAttributes({ title: value })}
						/>
					)}

					<ToggleControl
						label={__('Show Subtitle', 'tailwind-starter')}
						checked={showSubtitle}
						onChange={(value) => setAttributes({ showSubtitle: value })}
					/>

					{showSubtitle && (
						<TextareaControl
							label={__('Subtitle', 'tailwind-starter')}
							value={subtitle}
							onChange={(value) => setAttributes({ subtitle: value })}
							rows={3}
						/>
					)}

					<Divider />

					<TextControl
						label={__('Email Placeholder', 'tailwind-starter')}
						value={emailPlaceholder}
						onChange={(value) => setAttributes({ emailPlaceholder: value })}
					/>

					<TextControl
						label={__('Submit Button Text', 'tailwind-starter')}
						value={submitButtonText}
						onChange={(value) => setAttributes({ submitButtonText: value })}
					/>

					<ToggleControl
						label={__('Show Name Field', 'tailwind-starter')}
						checked={showNameField}
						onChange={(value) => setAttributes({ showNameField: value })}
					/>

					{showNameField && (
						<>
							<TextControl
								label={__('Name Placeholder', 'tailwind-starter')}
								value={namePlaceholder}
								onChange={(value) => setAttributes({ namePlaceholder: value })}
							/>

							<ToggleControl
								label={__('Require Name', 'tailwind-starter')}
								checked={requireName}
								onChange={(value) => setAttributes({ requireName: value })}
							/>
						</>
					)}

					<Divider />

					<ToggleControl
						label={__('Show Privacy Text', 'tailwind-starter')}
						checked={showPrivacyText}
						onChange={(value) => setAttributes({ showPrivacyText: value })}
					/>

					{showPrivacyText && (
						<TextareaControl
							label={__('Privacy Text', 'tailwind-starter')}
							value={privacyText}
							onChange={(value) => setAttributes({ privacyText: value })}
							rows={2}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('🎯 Incentives & Social Proof', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Incentive', 'tailwind-starter')}
						checked={showIncentive}
						onChange={(value) => setAttributes({ showIncentive: value })}
					/>

					{showIncentive && (
						<>
							<SelectControl
								label={__('Incentive Type', 'tailwind-starter')}
								value={incentiveType}
								onChange={(value) => setAttributes({ incentiveType: value })}
								options={[
									{ label: 'Free Guide', value: 'guide' },
									{ label: 'Discount', value: 'discount' },
									{ label: 'Free Trial', value: 'trial' },
									{ label: 'Exclusive Content', value: 'content' }
								]}
							/>

							<TextControl
								label={__('Incentive Text', 'tailwind-starter')}
								value={incentiveText}
								onChange={(value) => setAttributes({ incentiveText: value })}
							/>

							<div className="incentive-image-upload mb-4">
								<label className="block text-sm font-medium mb-2">Incentive Image</label>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={(media) => setAttributes({ 
											incentiveImage: {
												url: media.url,
												alt: media.alt || 'Incentive',
												id: media.id
											}
										})}
										allowedTypes={['image']}
										value={incentiveImage.id}
										render={({ open }) => (
											<div className="image-upload-area">
												{incentiveImage.url ? (
													<div className="relative">
														<img 
															src={incentiveImage.url} 
															alt={incentiveImage.alt}
															className="w-24 h-24 object-cover rounded border"
														/>
														<Button
															variant="secondary"
															onClick={open}
															className="mt-2 w-full"
														>
															Change Image
														</Button>
													</div>
												) : (
													<Button
														variant="secondary"
														onClick={open}
														className="w-full h-20 border-2 border-dashed border-gray-300 rounded text-gray-500"
													>
														Upload Incentive Image
													</Button>
												)}
											</div>
										)}
									/>
								</MediaUploadCheck>
							</div>
						</>
					)}

					<Divider />

					<ToggleControl
						label={__('Enable Social Proof', 'tailwind-starter')}
						checked={socialProof.enabled}
						onChange={(value) => setAttributes({ 
							socialProof: { ...socialProof, enabled: value }
						})}
					/>

					{socialProof.enabled && (
						<>
							<TextControl
								label={__('Subscriber Count', 'tailwind-starter')}
								value={socialProof.count}
								onChange={(value) => setAttributes({ 
									socialProof: { ...socialProof, count: value }
								})}
								placeholder="5,000"
							/>

							<TextControl
								label={__('Count Label', 'tailwind-starter')}
								value={socialProof.text}
								onChange={(value) => setAttributes({ 
									socialProof: { ...socialProof, text: value }
								})}
								placeholder="subscribers"
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('🎨 Form Design', 'tailwind-starter')} initialOpen={false}>
					<SelectControl
						label={__('Form Alignment', 'tailwind-starter')}
						value={formAlignment}
						onChange={(value) => setAttributes({ formAlignment: value })}
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
					/>

					<SelectControl
						label={__('Form Layout', 'tailwind-starter')}
						value={formLayout}
						onChange={(value) => setAttributes({ formLayout: value })}
						options={[
							{ label: 'Horizontal', value: 'horizontal' },
							{ label: 'Vertical', value: 'vertical' }
						]}
					/>

					<SelectControl
						label={__('Button Style', 'tailwind-starter')}
						value={buttonStyle}
						onChange={(value) => setAttributes({ buttonStyle: value })}
						options={[
							{ label: 'Primary', value: 'primary' },
							{ label: 'Secondary', value: 'secondary' },
							{ label: 'Outline', value: 'outline' },
							{ label: 'Ghost', value: 'ghost' }
						]}
					/>

					<SelectControl
						label={__('Button Size', 'tailwind-starter')}
						value={buttonSize}
						onChange={(value) => setAttributes({ buttonSize: value })}
						options={[
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' }
						]}
					/>

					<SelectControl
						label={__('Input Style', 'tailwind-starter')}
						value={inputStyle}
						onChange={(value) => setAttributes({ inputStyle: value })}
						options={[
							{ label: 'Modern', value: 'modern' },
							{ label: 'Minimal', value: 'minimal' },
							{ label: 'Bordered', value: 'bordered' }
						]}
					/>

					<ToggleControl
						label={__('Enable Icon', 'tailwind-starter')}
						checked={enableIcon}
						onChange={(value) => setAttributes({ enableIcon: value })}
					/>

					{enableIcon && (
						<SelectControl
							label={__('Icon Type', 'tailwind-starter')}
							value={iconType}
							onChange={(value) => setAttributes({ iconType: value })}
							options={[
								{ label: 'Email', value: 'email' },
								{ label: 'Arrow', value: 'arrow' },
								{ label: 'Check', value: 'check' }
							]}
						/>
					)}

					<RangeControl
						label={__('Border Radius', 'tailwind-starter')}
						value={borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={20}
					/>

					<ToggleControl
						label={__('Enable Shadow', 'tailwind-starter')}
						checked={enableShadow}
						onChange={(value) => setAttributes({ enableShadow: value })}
					/>
				</PanelBody>

				{layout === 'modal-popup' && (
					<PanelBody title={__('🪟 Modal Settings', 'tailwind-starter')} initialOpen={false}>
						<SelectControl
							label={__('Trigger Type', 'tailwind-starter')}
							value={modalTrigger}
							onChange={(value) => setAttributes({ modalTrigger: value })}
							options={[
								{ label: 'Time Delay', value: 'time' },
								{ label: 'Scroll Percentage', value: 'scroll' },
								{ label: 'Exit Intent', value: 'exit' },
								{ label: 'Manual', value: 'manual' }
							]}
						/>

						{modalTrigger === 'time' && (
							<RangeControl
								label={__('Delay (seconds)', 'tailwind-starter')}
								value={modalDelay / 1000}
								onChange={(value) => setAttributes({ modalDelay: value * 1000 })}
								min={1}
								max={60}
							/>
						)}

						{modalTrigger === 'scroll' && (
							<RangeControl
								label={__('Scroll Percentage (%)', 'tailwind-starter')}
								value={scrollPercentage}
								onChange={(value) => setAttributes({ scrollPercentage: value })}
								min={10}
								max={90}
							/>
						)}

						<RangeControl
							label={__('Overlay Opacity (%)', 'tailwind-starter')}
							value={modalOverlayOpacity}
							onChange={(value) => setAttributes({ modalOverlayOpacity: value })}
							min={0}
							max={100}
						/>

						<ToggleControl
							label={__('Show Close Button', 'tailwind-starter')}
							checked={enableCloseButton}
							onChange={(value) => setAttributes({ enableCloseButton: value })}
						/>

						<ToggleControl
							label={__('Enable Escape Key', 'tailwind-starter')}
							checked={enableEscapeKey}
							onChange={(value) => setAttributes({ enableEscapeKey: value })}
						/>

						<ToggleControl
							label={__('Show Once Per Session', 'tailwind-starter')}
							checked={showOncePerSession}
							onChange={(value) => setAttributes({ showOncePerSession: value })}
						/>
					</PanelBody>
				)}

				<PanelBody title={__('📧 Email Service Integration', 'tailwind-starter')} initialOpen={false}>
					<SelectControl
						label={__('Email Service', 'tailwind-starter')}
						value={emailService}
						onChange={(value) => setAttributes({ emailService: value })}
						options={[
							{ label: 'WordPress (Default)', value: 'wordpress' },
							{ label: 'Mailchimp', value: 'mailchimp' },
							{ label: 'ConvertKit', value: 'convertkit' },
							{ label: 'Custom API', value: 'custom' }
						]}
					/>

					{emailService === 'mailchimp' && (
						<>
							<TextControl
								label={__('Mailchimp API Key', 'tailwind-starter')}
								value={mailchimpApiKey}
								onChange={(value) => setAttributes({ mailchimpApiKey: value })}
								type="password"
								help="Your Mailchimp API key from your account settings"
							/>

							<TextControl
								label={__('List ID', 'tailwind-starter')}
								value={mailchimpListId}
								onChange={(value) => setAttributes({ mailchimpListId: value })}
								help="The Mailchimp list ID to subscribe users to"
							/>
						</>
					)}

					{emailService === 'convertkit' && (
						<>
							<TextControl
								label={__('ConvertKit API Key', 'tailwind-starter')}
								value={convertKitApiKey}
								onChange={(value) => setAttributes({ convertKitApiKey: value })}
								type="password"
								help="Your ConvertKit API key"
							/>

							<TextControl
								label={__('Form ID', 'tailwind-starter')}
								value={convertKitFormId}
								onChange={(value) => setAttributes({ convertKitFormId: value })}
								help="The ConvertKit form ID"
							/>
						</>
					)}

					{emailService === 'custom' && (
						<>
							<TextControl
								label={__('API Endpoint', 'tailwind-starter')}
								value={customApiEndpoint}
								onChange={(value) => setAttributes({ customApiEndpoint: value })}
								placeholder="https://api.example.com/subscribe"
								help="The custom API endpoint for subscriptions"
							/>

							<SelectControl
								label={__('HTTP Method', 'tailwind-starter')}
								value={customApiMethod}
								onChange={(value) => setAttributes({ customApiMethod: value })}
								options={[
									{ label: 'POST', value: 'POST' },
									{ label: 'PUT', value: 'PUT' },
									{ label: 'PATCH', value: 'PATCH' }
								]}
							/>
						</>
					)}

					<ToggleControl
						label={__('Enable Double Opt-in', 'tailwind-starter')}
						checked={enableDoubleOptIn}
						onChange={(value) => setAttributes({ enableDoubleOptIn: value })}
					/>
				</PanelBody>

				<PanelBody title={__('🛡️ Security & Compliance', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('GDPR Compliance', 'tailwind-starter')}
						checked={enableGDPRCompliance}
						onChange={(value) => setAttributes({ enableGDPRCompliance: value })}
					/>

					{enableGDPRCompliance && (
						<TextControl
							label={__('GDPR Consent Text', 'tailwind-starter')}
							value={gdprText}
							onChange={(value) => setAttributes({ gdprText: value })}
						/>
					)}

					<ToggleControl
						label={__('Enable Honeypot', 'tailwind-starter')}
						checked={enableHoneypot}
						onChange={(value) => setAttributes({ enableHoneypot: value })}
						help="Hidden field to prevent spam"
					/>

					<ToggleControl
						label={__('Enable reCAPTCHA', 'tailwind-starter')}
						checked={enableReCaptcha}
						onChange={(value) => setAttributes({ enableReCaptcha: value })}
					/>

					{enableReCaptcha && (
						<TextControl
							label={__('reCAPTCHA Site Key', 'tailwind-starter')}
							value={recaptchaSiteKey}
							onChange={(value) => setAttributes({ recaptchaSiteKey: value })}
							help="Your Google reCAPTCHA site key"
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
				<div className="newsletter-signup-preview">
					{renderFormPreview()}
				</div>

				<div className="generated-classes mt-4 p-3 bg-gray-100 rounded text-xs">
					<strong>Preview Classes:</strong> {previewClasses}<br />
					<strong>All Device Classes:</strong> {allClasses}
				</div>
			</div>
		</>
	);
} 