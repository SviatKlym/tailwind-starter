import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	RangeControl,
	Button,
	ColorPicker,
	TextareaControl
} from '@wordpress/components';

// Import visual controls
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses, generateAllInlineStyles } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';
import { useState, useCallback } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	// Destructure with safe defaults
	const {
		layout = 'inline-form',
		title = 'Stay Updated',
		subtitle = 'Get the latest news and updates delivered to your inbox',
		showTitle = true,
		showSubtitle = true,
		placeholder = 'Enter your email address',
		buttonText = 'Subscribe',
		showPrivacyText = true,
		privacyText = 'We respect your privacy and will never share your information.',
		formStyle = 'modern',
		buttonPosition = 'right',
		enableCaptcha = false,
		captchaType = 'recaptcha',
		enableDoubleOptin = true,
		successMessage = 'Thank you for subscribing!',
		errorMessage = 'Please enter a valid email address.',
		integrationService = 'mailchimp',
		listId = '',
		apiKey = '',
		redirectUrl = '',
		enableAnalytics = false,
		trackingId = '',
		customFields = [],
		enableConditionalLogic = false,
		conditionalRules = [],
		enableABTesting = false,
		abVariants = [],
		settings = {},
		activeDevice = 'base'
	} = attributes;

	// Safe setters with error handling
	const updateSettings = useCallback((newSettings) => {
		if (newSettings && typeof newSettings === 'object') {
			setAttributes({ settings: { ...(settings || {}), ...newSettings } });
		}
	}, [settings, setAttributes]);

	// Enhanced preset styles for newsletter signup
	const presets = {
		professional: {
			spacing: { base: { top: 10, right: 5, bottom: 10, left: 5 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-medium', textAlign: 'text-center' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		modern: {
			spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-semibold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
			textColor: 'text-gray-800',
			gradients: {},
			layout: {},
			effects: {}
		},
		minimal: {
			spacing: { base: { top: 6, right: 3, bottom: 6, left: 3 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-left' } },
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
	const previewClasses = generateAllClasses(settings || {});

	// Layout presets as preset grid
	const layoutPresets = [
		{ key: 'inline-form', icon: '➡️', name: 'Inline Form', desc: 'Email and button side by side' },
		{ key: 'stacked-form', icon: '⬇️', name: 'Stacked Form', desc: 'Email above button' },
		{ key: 'side-by-side', icon: '↔️', name: 'Side by Side', desc: 'Content and form in columns' },
		{ key: 'minimal', icon: '◻️', name: 'Minimal', desc: 'Clean simple design' }
	];
	
	// Layout options
	const layoutOptions = [
		{ label: __('Inline Form'), value: 'inline-form' },
		{ label: __('Stacked Form'), value: 'stacked-form' },
		{ label: __('Side by Side'), value: 'side-by-side' },
		{ label: __('Popup Modal'), value: 'modal' },
		{ label: __('Slide In'), value: 'slide-in' },
		{ label: __('Floating Bar'), value: 'floating-bar' }
	];

	const formStyleOptions = [
		{ label: __('Modern'), value: 'modern' },
		{ label: __('Classic'), value: 'classic' },
		{ label: __('Minimal'), value: 'minimal' },
		{ label: __('Rounded'), value: 'rounded' }
	];

	const buttonPositionOptions = [
		{ label: __('Right'), value: 'right' },
		{ label: __('Below'), value: 'below' },
		{ label: __('Full Width'), value: 'full' }
	];

	const integrationOptions = [
		{ label: __('Mailchimp'), value: 'mailchimp' },
		{ label: __('ConvertKit'), value: 'convertkit' },
		{ label: __('Mailerlite'), value: 'mailerlite' },
		{ label: __('Custom Webhook'), value: 'webhook' }
	];

	// Form layout classes
	const getFormLayoutClasses = () => {
		switch (layout) {
			case 'inline-form':
				return 'flex flex-col sm:flex-row gap-3 items-center';
			case 'stacked-form':
				return 'flex flex-col gap-4';
			case 'side-by-side':
				return 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center';
			default:
				return 'flex flex-col gap-4';
		}
	};

	// Button position classes
	const getButtonPositionClass = () => {
		if (layout === 'stacked-form' || buttonPosition === 'below') {
			return 'w-full mt-3';
		}
		if (buttonPosition === 'full') {
			return 'w-full';
		}
		return buttonPosition === 'right' ? 'ml-3' : '';
	};

	// Input container classes
	const getInputContainerClass = () => {
		if (layout === 'inline-form' && buttonPosition === 'right') {
			return 'flex-1 flex';
		}
		return 'w-full';
	};

	// Generate visual classes and styles
	const visualClasses = generateAllClasses(settings || {});
	const visualStyles = generateAllInlineStyles(settings || {});

	const blockProps = useBlockProps({
		className: `newsletter-signup newsletter-${layout} ${previewClasses}`,
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

			<PanelBody title={__('⚙️ Form Settings', 'tailwind-starter')} initialOpen={false}>
				<SelectControl
					label={__('Form Style', 'tailwind-starter')}
					value={formStyle}
					options={formStyleOptions}
					onChange={(value) => setAttributes({ formStyle: value })}
				/>
				
				{layout !== 'side-by-side' && (
					<SelectControl
						label={__('Button Position', 'tailwind-starter')}
						value={buttonPosition}
						options={buttonPositionOptions}
						onChange={(value) => setAttributes({ buttonPosition: value })}
					/>
				)}

				<ToggleControl
					label={__('Show Title', 'tailwind-starter')}
					checked={showTitle}
					onChange={(value) => setAttributes({ showTitle: value })}
				/>
				
				<ToggleControl
					label={__('Show Subtitle', 'tailwind-starter')}
					checked={showSubtitle}
					onChange={(value) => setAttributes({ showSubtitle: value })}
				/>
				
				<TextControl
					label={__('Email Placeholder', 'tailwind-starter')}
					value={placeholder}
					onChange={(value) => setAttributes({ placeholder: value })}
				/>
				
				<TextControl
					label={__('Button Text', 'tailwind-starter')}
					value={buttonText}
					onChange={(value) => setAttributes({ buttonText: value })}
				/>
				
				<ToggleControl
					label={__('Show Privacy Text', 'tailwind-starter')}
					checked={showPrivacyText}
					onChange={(value) => setAttributes({ showPrivacyText: value })}
				/>
			</PanelBody>

			<PanelBody title={__('🔗 Integration Settings', 'tailwind-starter')} initialOpen={false}>
				<SelectControl
					label={__('Email Service', 'tailwind-starter')}
					value={integrationService}
					options={integrationOptions}
					onChange={(value) => setAttributes({ integrationService: value })}
				/>
				
				<TextControl
					label={__('API Key', 'tailwind-starter')}
					value={apiKey}
					onChange={(value) => setAttributes({ apiKey: value })}
					type="password"
					help={__('Your email service API key', 'tailwind-starter')}
				/>
				
				<TextControl
					label={__('List ID', 'tailwind-starter')}
					value={listId}
					onChange={(value) => setAttributes({ listId: value })}
					help={__('Target audience/list identifier', 'tailwind-starter')}
				/>
			</PanelBody>

			<PanelBody title={__('🛠️ Advanced Settings', 'tailwind-starter')} initialOpen={false}>
				<ToggleControl
					label={__('Enable reCAPTCHA', 'tailwind-starter')}
					checked={enableCaptcha}
					onChange={(value) => setAttributes({ enableCaptcha: value })}
				/>
				
				<ToggleControl
					label={__('Double Opt-in', 'tailwind-starter')}
					checked={enableDoubleOptin}
					onChange={(value) => setAttributes({ enableDoubleOptin: value })}
				/>
				
				<TextControl
					label={__('Success Message', 'tailwind-starter')}
					value={successMessage}
					onChange={(value) => setAttributes({ successMessage: value })}
				/>
				
				<TextControl
					label={__('Error Message', 'tailwind-starter')}
					value={errorMessage}
					onChange={(value) => setAttributes({ errorMessage: value })}
				/>
				
				<TextControl
					label={__('Redirect URL', 'tailwind-starter')}
					value={redirectUrl}
					onChange={(value) => setAttributes({ redirectUrl: value })}
					help={__('Optional redirect after successful signup', 'tailwind-starter')}
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
				background={settings?.backgroundColor || 'bg-gray-50'}
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
				<div className="block-container-narrow">
					{layout === 'side-by-side' ? (
						<div className={getFormLayoutClasses()}>
							{/* Content Side */}
							<div className="content-side">
								{showTitle && (
									<RichText
										tagName="h2"
										className="text-3xl font-bold mb-4"
										value={title}
										onChange={(value) => setAttributes({ title: value })}
										placeholder={__('Enter newsletter title...')}
									/>
								)}
								{showSubtitle && (
									<RichText
										tagName="p"
										className="text-lg text-gray-600 mb-6"
										value={subtitle}
										onChange={(value) => setAttributes({ subtitle: value })}
										placeholder={__('Enter newsletter subtitle...')}
									/>
								)}
							</div>
							
							{/* Form Side */}
							<div className="form-side">
								<div className="newsletter-form bg-white p-6 rounded-lg shadow-md">
									<div className="flex flex-col gap-4">
										<input
											type="email"
											placeholder={placeholder}
											className="block-input"
											disabled
										/>
										<button
											type="submit"
											className="block-btn-primary w-full"
											disabled
										>
											{buttonText}
										</button>
									</div>
									{showPrivacyText && (
										<RichText
											tagName="p"
											className="text-xs text-gray-500 mt-3"
											value={privacyText}
											onChange={(value) => setAttributes({ privacyText: value })}
											placeholder={__('Enter privacy text...')}
										/>
									)}
								</div>
							</div>
						</div>
					) : (
						<div className="text-center">
							{/* Standard Layout */}
							{showTitle && (
								<RichText
									tagName="h2"
									className="block-section-title"
									value={title}
									onChange={(value) => setAttributes({ title: value })}
									placeholder={__('Enter newsletter title...')}
								/>
							)}
							{showSubtitle && (
								<RichText
									tagName="p"
									className="block-section-subtitle"
									value={subtitle}
									onChange={(value) => setAttributes({ subtitle: value })}
									placeholder={__('Enter newsletter subtitle...')}
								/>
							)}

							{/* Newsletter Form */}
							<div className="newsletter-form mt-8">
								<div className={getFormLayoutClasses()}>
									<div className={getInputContainerClass()}>
										<input
											type="email"
											placeholder={placeholder}
											className="block-input"
											disabled
										/>
									</div>
									<button
										type="submit"
										className={`block-btn-primary ${getButtonPositionClass()}`}
										disabled
									>
										{buttonText}
									</button>
								</div>
								
								{showPrivacyText && (
									<RichText
										tagName="p"
										className="text-sm text-gray-500 mt-4"
										value={privacyText}
										onChange={(value) => setAttributes({ privacyText: value })}
										placeholder={__('Enter privacy text...')}
									/>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Editor Helper Info */}
				<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
					<strong>{__('Newsletter Signup Block')}</strong><br/>
					{__('Layout:')} {layout} | {__('Service:')} {integrationService}
					{apiKey && listId && (
						<><br/>{__('✓ Integration configured')}</>
					)}
					{(!apiKey || !listId) && (
						<><br/>{__('⚠ Configure API settings in the sidebar')}</>
					)}
				</div>
			</div>
		</>
	);
}