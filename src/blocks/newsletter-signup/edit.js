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
import { UltimateControlTabs, generateAllClasses, generateTailwindClasses, generateAllInlineStyles } from '../../utils/visual-controls.js';
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
		settings = {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-center' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		activeDevice = 'base'
	} = attributes;

	// Safe setters with error handling
	const updateSettings = useCallback((newSettings) => {
		if (newSettings && typeof newSettings === 'object') {
			setAttributes({ settings: { ...settings, ...newSettings } });
		}
	}, [settings, setAttributes]);

	// Generate classes safely
	const blockClasses = generateAllClasses(settings || {});
	
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
		className: `newsletter-signup ${blockClasses} ${visualClasses}`.trim(),
		style: visualStyles
	});

	return (
		<>
			<InspectorControls>
				{/* Layout Settings */}
				<PanelBody title={__('Layout Settings')} initialOpen={true}>
					<SelectControl
						label={__('Layout Style')}
						value={layout}
						options={layoutOptions}
						onChange={(value) => setAttributes({ layout: value })}
					/>
					
					<SelectControl
						label={__('Form Style')}
						value={formStyle}
						options={formStyleOptions}
						onChange={(value) => setAttributes({ formStyle: value })}
					/>
					
					{layout !== 'side-by-side' && (
						<SelectControl
							label={__('Button Position')}
							value={buttonPosition}
							options={buttonPositionOptions}
							onChange={(value) => setAttributes({ buttonPosition: value })}
						/>
					)}
				</PanelBody>

				{/* Content Settings */}
				<PanelBody title={__('Content Settings')} initialOpen={false}>
					<ToggleControl
						label={__('Show Title')}
						checked={showTitle}
						onChange={(value) => setAttributes({ showTitle: value })}
					/>
					
					<ToggleControl
						label={__('Show Subtitle')}
						checked={showSubtitle}
						onChange={(value) => setAttributes({ showSubtitle: value })}
					/>
					
					<TextControl
						label={__('Email Placeholder')}
						value={placeholder}
						onChange={(value) => setAttributes({ placeholder: value })}
					/>
					
					<TextControl
						label={__('Button Text')}
						value={buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
					/>
					
					<ToggleControl
						label={__('Show Privacy Text')}
						checked={showPrivacyText}
						onChange={(value) => setAttributes({ showPrivacyText: value })}
					/>
				</PanelBody>

				{/* Integration Settings */}
				<PanelBody title={__('Integration Settings')} initialOpen={false}>
					<SelectControl
						label={__('Email Service')}
						value={integrationService}
						options={integrationOptions}
						onChange={(value) => setAttributes({ integrationService: value })}
					/>
					
					<TextControl
						label={__('API Key')}
						value={apiKey}
						onChange={(value) => setAttributes({ apiKey: value })}
						type="password"
						help={__('Your email service API key')}
					/>
					
					<TextControl
						label={__('List ID')}
						value={listId}
						onChange={(value) => setAttributes({ listId: value })}
						help={__('Target audience/list identifier')}
					/>
				</PanelBody>

				{/* Advanced Settings */}
				<PanelBody title={__('Advanced Settings')} initialOpen={false}>
					<ToggleControl
						label={__('Enable reCAPTCHA')}
						checked={enableCaptcha}
						onChange={(value) => setAttributes({ enableCaptcha: value })}
					/>
					
					<ToggleControl
						label={__('Double Opt-in')}
						checked={enableDoubleOptin}
						onChange={(value) => setAttributes({ enableDoubleOptin: value })}
					/>
					
					<TextControl
						label={__('Success Message')}
						value={successMessage}
						onChange={(value) => setAttributes({ successMessage: value })}
					/>
					
					<TextControl
						label={__('Error Message')}
						value={errorMessage}
						onChange={(value) => setAttributes({ errorMessage: value })}
					/>
					
					<TextControl
						label={__('Redirect URL')}
						value={redirectUrl}
						onChange={(value) => setAttributes({ redirectUrl: value })}
						help={__('Optional redirect after successful signup')}
					/>
				</PanelBody>

				{/* Visual Controls */}
				<PanelBody title={__('🎨 Visual Design Studio', 'tailwind-starter')} initialOpen={false}>
					<UltimateControlTabs
						spacing={settings.spacing || {}}
						onSpacingChange={(spacing) => updateSettings({ spacing })}
						margins={settings.margins || {}}
						onMarginsChange={(margins) => updateSettings({ margins })}
						background={settings.backgroundColor}
						onBackgroundChange={(backgroundColor) => updateSettings({ backgroundColor })}
						textColor={settings.textColor}
						onTextColorChange={(textColor) => updateSettings({ textColor })}
						gradients={settings.gradients || {}}
						onGradientsChange={(gradients) => updateSettings({ gradients })}
						typography={settings.typography || {}}
						onTypographyChange={(typography) => updateSettings({ typography })}
						layout={settings.layout || {}}
						onLayoutChange={(layout) => updateSettings({ layout })}
						effects={settings.effects || {}}
						onEffectsChange={(effects) => updateSettings({ effects })}
						device="base"
						presets={{}}
						onPresetApply={(preset) => {
							console.log('Applying preset:', preset);
						}}
					/>
				</PanelBody>
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