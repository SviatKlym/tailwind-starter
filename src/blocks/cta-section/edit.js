import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	RangeControl,
	TextControl,
	ColorPalette,
	Button,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs } from '../../utils/visual-controls.js';

const colorPalette = [
	{ name: 'Blue', color: '#3b82f6' },
	{ name: 'Green', color: '#10b981' },
	{ name: 'Purple', color: '#8b5cf6' },
	{ name: 'Red', color: '#ef4444' },
	{ name: 'Yellow', color: '#f59e0b' },
	{ name: 'Pink', color: '#ec4899' },
	{ name: 'Indigo', color: '#6366f1' },
	{ name: 'Gray', color: '#6b7280' }
];

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		headline,
		description,
		primaryButton,
		secondaryButton,
		showSecondaryButton,
		backgroundColor,
		backgroundImage,
		hasOverlay,
		overlayOpacity,
		textColor,
		alignment,
		visualElement,
		showVisualElement,
		visualSettings
	} = attributes;

	const blockProps = useBlockProps({
		className: `cta-section cta-${layout} text-${alignment}`
	});

	const layoutOptions = [
		{ label: __('Centered CTA', 'tailwind-starter'), value: 'centered' },
		{ label: __('Split CTA', 'tailwind-starter'), value: 'split' },
		{ label: __('Banner Style', 'tailwind-starter'), value: 'banner' },
		{ label: __('Button Group', 'tailwind-starter'), value: 'button-group' }
	];

	const alignmentOptions = [
		{ label: __('Left', 'tailwind-starter'), value: 'left' },
		{ label: __('Center', 'tailwind-starter'), value: 'center' },
		{ label: __('Right', 'tailwind-starter'), value: 'right' }
	];

	const buttonStyleOptions = [
		{ label: __('Primary', 'tailwind-starter'), value: 'primary' },
		{ label: __('Secondary', 'tailwind-starter'), value: 'secondary' },
		{ label: __('Outline', 'tailwind-starter'), value: 'outline' },
		{ label: __('Ghost', 'tailwind-starter'), value: 'ghost' }
	];

	const sectionStyle = {
		backgroundColor: backgroundColor,
		color: textColor,
		backgroundImage: backgroundImage ? `url(${backgroundImage.url})` : 'none',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		position: 'relative'
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('CTA Settings', 'tailwind-starter')} initialOpen={true}>
					<SelectControl
						label={__('Layout Style', 'tailwind-starter')}
						value={layout}
						options={layoutOptions}
						onChange={(value) => setAttributes({ layout: value })}
					/>

					<SelectControl
						label={__('Text Alignment', 'tailwind-starter')}
						value={alignment}
						options={alignmentOptions}
						onChange={(value) => setAttributes({ alignment: value })}
					/>

					<Divider />

					<h4>{__('Primary Button', 'tailwind-starter')}</h4>
					<TextControl
						label={__('Button Text', 'tailwind-starter')}
						value={primaryButton.text}
						onChange={(value) => setAttributes({ 
							primaryButton: { ...primaryButton, text: value }
						})}
					/>
					<TextControl
						label={__('Button URL', 'tailwind-starter')}
						value={primaryButton.url}
						onChange={(value) => setAttributes({ 
							primaryButton: { ...primaryButton, url: value }
						})}
					/>
					<SelectControl
						label={__('Button Style', 'tailwind-starter')}
						value={primaryButton.style}
						options={buttonStyleOptions}
						onChange={(value) => setAttributes({ 
							primaryButton: { ...primaryButton, style: value }
						})}
					/>
					<ToggleControl
						label={__('Open in new tab', 'tailwind-starter')}
						checked={primaryButton.opensInNewTab}
						onChange={(value) => setAttributes({ 
							primaryButton: { ...primaryButton, opensInNewTab: value }
						})}
					/>

					<Divider />

					<ToggleControl
						label={__('Show Secondary Button', 'tailwind-starter')}
						checked={showSecondaryButton}
						onChange={(value) => setAttributes({ showSecondaryButton: value })}
					/>

					{showSecondaryButton && (
						<>
							<h4>{__('Secondary Button', 'tailwind-starter')}</h4>
							<TextControl
								label={__('Button Text', 'tailwind-starter')}
								value={secondaryButton.text}
								onChange={(value) => setAttributes({ 
									secondaryButton: { ...secondaryButton, text: value }
								})}
							/>
							<TextControl
								label={__('Button URL', 'tailwind-starter')}
								value={secondaryButton.url}
								onChange={(value) => setAttributes({ 
									secondaryButton: { ...secondaryButton, url: value }
								})}
							/>
							<SelectControl
								label={__('Button Style', 'tailwind-starter')}
								value={secondaryButton.style}
								options={buttonStyleOptions}
								onChange={(value) => setAttributes({ 
									secondaryButton: { ...secondaryButton, style: value }
								})}
							/>
							<ToggleControl
								label={__('Open in new tab', 'tailwind-starter')}
								checked={secondaryButton.opensInNewTab}
								onChange={(value) => setAttributes({ 
									secondaryButton: { ...secondaryButton, opensInNewTab: value }
								})}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Visual Settings', 'tailwind-starter')} initialOpen={false}>
					<div>
						<label>{__('Background Color', 'tailwind-starter')}</label>
						<ColorPalette
							colors={colorPalette}
							value={backgroundColor}
							onChange={(value) => setAttributes({ backgroundColor: value || '#3b82f6' })}
						/>
					</div>

					<div>
						<label>{__('Text Color', 'tailwind-starter')}</label>
						<ColorPalette
							colors={[
								{ name: 'White', color: '#ffffff' },
								{ name: 'Black', color: '#000000' },
								{ name: 'Gray Dark', color: '#374151' },
								{ name: 'Gray Light', color: '#9ca3af' }
							]}
							value={textColor}
							onChange={(value) => setAttributes({ textColor: value || '#ffffff' })}
						/>
					</div>

					<Divider />

					<h4>{__('Background Image', 'tailwind-starter')}</h4>
					<MediaUpload
						onSelect={(media) => setAttributes({ backgroundImage: media })}
						allowedTypes={['image']}
						value={backgroundImage?.id}
						render={({ open }) => (
							<Button
								className={backgroundImage ? 'editor-post-featured-image__preview' : 'editor-post-featured-image__toggle'}
								onClick={open}
							>
								{backgroundImage ? __('Replace Image', 'tailwind-starter') : __('Select Image', 'tailwind-starter')}
							</Button>
						)}
					/>
					{backgroundImage && (
						<Button
							onClick={() => setAttributes({ backgroundImage: null })}
							isLink
							isDestructive
						>
							{__('Remove Image', 'tailwind-starter')}
						</Button>
					)}

					{backgroundImage && (
						<>
							<Divider />
							<ToggleControl
								label={__('Add Overlay', 'tailwind-starter')}
								checked={hasOverlay}
								onChange={(value) => setAttributes({ hasOverlay: value })}
							/>
							{hasOverlay && (
								<RangeControl
									label={__('Overlay Opacity', 'tailwind-starter')}
									value={overlayOpacity}
									onChange={(value) => setAttributes({ overlayOpacity: value })}
									min={0}
									max={100}
									step={10}
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							)}
						</>
					)}

					<Divider />

					{layout === 'split' && (
						<>
							<ToggleControl
								label={__('Show Visual Element', 'tailwind-starter')}
								checked={showVisualElement}
								onChange={(value) => setAttributes({ showVisualElement: value })}
							/>
							{showVisualElement && (
								<>
									<h4>{__('Visual Element', 'tailwind-starter')}</h4>
									<MediaUpload
										onSelect={(media) => setAttributes({ visualElement: media })}
										allowedTypes={['image']}
										value={visualElement?.id}
										render={({ open }) => (
											<Button onClick={open} variant="secondary">
												{visualElement ? __('Change Image', 'tailwind-starter') : __('Select Image', 'tailwind-starter')}
											</Button>
										)}
									/>
								</>
							)}
						</>
					)}
				</PanelBody>

				<PanelBody title={__('🎨 Visual Design Studio', 'tailwind-starter')} initialOpen={false}>
					<UltimateControlTabs
						spacing={visualSettings.spacing || {}}
						onSpacingChange={(spacing) => setAttributes({
							visualSettings: { ...visualSettings, spacing }
						})}
						margins={visualSettings.margins || {}}
						onMarginsChange={(margins) => setAttributes({
							visualSettings: { ...visualSettings, margins }
						})}
						background={visualSettings.backgroundColor}
						onBackgroundChange={(backgroundColor) => setAttributes({
							visualSettings: { ...visualSettings, backgroundColor }
						})}
						textColor={visualSettings.textColor}
						onTextColorChange={(textColor) => setAttributes({
							visualSettings: { ...visualSettings, textColor }
						})}
						gradients={visualSettings.gradients || {}}
						onGradientsChange={(gradients) => setAttributes({
							visualSettings: { ...visualSettings, gradients }
						})}
						typography={visualSettings.typography || {}}
						onTypographyChange={(typography) => setAttributes({
							visualSettings: { ...visualSettings, typography }
						})}
						layout={visualSettings.layout || {}}
						onLayoutChange={(layout) => setAttributes({
							visualSettings: { ...visualSettings, layout }
						})}
						effects={visualSettings.effects || {}}
						onEffectsChange={(effects) => setAttributes({
							visualSettings: { ...visualSettings, effects }
						})}
						device="base"
						presets={{}}
						onPresetApply={(preset) => {
							console.log('Applying preset:', preset);
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="cta-wrapper relative py-16 px-4" style={sectionStyle}>
					{hasOverlay && backgroundImage && (
						<div 
							className="absolute inset-0 bg-black"
							style={{ opacity: overlayOpacity / 100 }}
						/>
					)}

					<div className={`cta-content relative z-10 max-w-6xl mx-auto ${
						layout === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : ''
					}`}>
						<div className={`cta-text ${layout === 'split' ? 'lg:pr-8' : 'max-w-4xl mx-auto'}`}>
							<RichText
								tagName="h2"
								className="cta-headline text-3xl lg:text-5xl font-bold mb-6"
								value={headline}
								onChange={(value) => setAttributes({ headline: value })}
								placeholder={__('Enter headline...', 'tailwind-starter')}
								style={{ color: textColor }}
							/>
							
							<RichText
								tagName="p"
								className="cta-description text-lg lg:text-xl mb-8 opacity-90"
								value={description}
								onChange={(value) => setAttributes({ description: value })}
								placeholder={__('Enter description...', 'tailwind-starter')}
								style={{ color: textColor }}
							/>

							<div className={`cta-buttons flex gap-4 ${
								alignment === 'center' ? 'justify-center' : 
								alignment === 'right' ? 'justify-end' : 'justify-start'
							} ${layout === 'button-group' ? 'flex-wrap' : ''}`}>
								<div
									className={`cta-primary-button px-8 py-3 rounded-lg font-semibold transition-all text-lg cursor-pointer ${
										primaryButton.style === 'primary' ? 'bg-white text-gray-900 hover:bg-gray-100' :
										primaryButton.style === 'secondary' ? 'bg-gray-800 text-white hover:bg-gray-700' :
										primaryButton.style === 'outline' ? 'border-2 border-white text-white hover:bg-white hover:text-gray-900' :
										'text-white hover:bg-white hover:bg-opacity-20'
									}`}
								>
									{primaryButton.text}
								</div>
								
								{showSecondaryButton && (
									<div
										className={`cta-secondary-button px-8 py-3 rounded-lg font-semibold transition-all text-lg cursor-pointer ${
											secondaryButton.style === 'primary' ? 'bg-white text-gray-900 hover:bg-gray-100' :
											secondaryButton.style === 'secondary' ? 'bg-gray-800 text-white hover:bg-gray-700' :
											secondaryButton.style === 'outline' ? 'border-2 border-white text-white hover:bg-white hover:text-gray-900' :
											'text-white hover:bg-white hover:bg-opacity-20'
										}`}
									>
										{secondaryButton.text}
									</div>
								)}
							</div>
						</div>

						{layout === 'split' && showVisualElement && (
							<div className="cta-visual">
								{visualElement ? (
									<img 
										src={visualElement.url} 
										alt="CTA Visual"
										className="w-full rounded-lg shadow-lg"
									/>
								) : (
									<div className="aspect-video bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
										<span className="text-white opacity-60">{__('Visual Element', 'tailwind-starter')}</span>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}