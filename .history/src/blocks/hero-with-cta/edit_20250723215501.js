import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl, 
	RangeControl,
	Button,
	TextControl,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses, generateAllInlineStyles } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		headline,
		subheadline,
		primaryCta,
		secondaryCta,
		showSecondaryCta,
		backgroundImage,
		backgroundVideo,
		hasOverlay,
		overlayOpacity,
		textAlignment,
		visualSettings,
		activeDevice
	} = attributes;

	// Generate visual classes from settings
	const visualClasses = generateAllClasses(visualSettings || {});
	const visualStyles = generateAllInlineStyles(visualSettings || {});

	const blockProps = useBlockProps({
		className: `hero-with-cta hero-${layout} text-${textAlignment} ${visualClasses}`.trim(),
		style: visualStyles
	});

	const layoutOptions = [
		{ label: __('Centered Layout', 'tailwind-starter'), value: 'centered' },
		{ label: __('Split Layout', 'tailwind-starter'), value: 'split' },
		{ label: __('Video Background', 'tailwind-starter'), value: 'video' },
		{ label: __('Multi-CTA', 'tailwind-starter'), value: 'multi-cta' }
	];

	const alignmentOptions = [
		{ label: __('Left', 'tailwind-starter'), value: 'left' },
		{ label: __('Center', 'tailwind-starter'), value: 'center' },
		{ label: __('Right', 'tailwind-starter'), value: 'right' }
	];

	// Enhanced preset styles for hero with CTA
	const presets = {
		modern: {
			spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
			typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
			backgroundColor: 'bg-blue-600',
			textColor: 'text-white'
		},
		minimal: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-normal', textAlign: 'text-left' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-900'
		},
		bold: {
			spacing: { base: { top: 16, right: 8, bottom: 16, left: 8 } },
			typography: { base: { fontSize: 'text-3xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
			backgroundColor: 'bg-black',
			textColor: 'text-white'
		}
	}

	const handlePresetApply = (presetName) => {
		const preset = presets[presetName]
		if (preset) {
			setAttributes({ visualSettings: preset })
		}
	}

	// Block-specific controls
	const blockControls = (
		<>
			<PanelBody title={__('Hero Settings', 'tailwind-starter')} initialOpen={true}>
				<SelectControl
					label={__('Layout', 'tailwind-starter')}
					value={layout}
					options={layoutOptions}
					onChange={(value) => setAttributes({ layout: value })}
				/>

				<Divider />

				<h4>{__('Primary CTA', 'tailwind-starter')}</h4>
				<TextControl
					label={__('Button Text', 'tailwind-starter')}
					value={primaryCta.text}
					onChange={(value) => setAttributes({ 
						primaryCta: { ...primaryCta, text: value }
					})}
				/>
				<TextControl
					label={__('Button URL', 'tailwind-starter')}
					value={primaryCta.url}
					onChange={(value) => setAttributes({ 
						primaryCta: { ...primaryCta, url: value }
					})}
				/>
				<ToggleControl
					label={__('Open in new tab', 'tailwind-starter')}
					checked={primaryCta.opensInNewTab}
					onChange={(value) => setAttributes({ 
						primaryCta: { ...primaryCta, opensInNewTab: value }
					})}
				/>

				<Divider />

				<ToggleControl
					label={__('Show Secondary CTA', 'tailwind-starter')}
					checked={showSecondaryCta}
					onChange={(value) => setAttributes({ showSecondaryCta: value })}
				/>

				{showSecondaryCta && (
					<>
						<h4>{__('Secondary CTA', 'tailwind-starter')}</h4>
						<TextControl
							label={__('Button Text', 'tailwind-starter')}
							value={secondaryCta.text}
							onChange={(value) => setAttributes({ 
								secondaryCta: { ...secondaryCta, text: value }
							})}
						/>
						<TextControl
							label={__('Button URL', 'tailwind-starter')}
							value={secondaryCta.url}
							onChange={(value) => setAttributes({ 
								secondaryCta: { ...secondaryCta, url: value }
							})}
						/>
						<ToggleControl
							label={__('Open in new tab', 'tailwind-starter')}
							checked={secondaryCta.opensInNewTab}
							onChange={(value) => setAttributes({ 
								secondaryCta: { ...secondaryCta, opensInNewTab: value }
							})}
						/>
					</>
				)}
			</PanelBody>

			<PanelBody title={__('Background', 'tailwind-starter')} initialOpen={false}>
					{layout === 'video' ? (
						<>
							<h4>{__('Background Video', 'tailwind-starter')}</h4>
							<MediaUpload
								onSelect={(media) => setAttributes({ backgroundVideo: media })}
								allowedTypes={['video']}
								value={backgroundVideo?.id}
								render={({ open }) => (
									<Button
										className={backgroundVideo ? 'editor-post-featured-image__preview' : 'editor-post-featured-image__toggle'}
										onClick={open}
									>
										{backgroundVideo ? __('Replace Video', 'tailwind-starter') : __('Select Video', 'tailwind-starter')}
									</Button>
								)}
							/>
							{backgroundVideo && (
								<Button
									onClick={() => setAttributes({ backgroundVideo: null })}
									isLink
									isDestructive
								>
									{__('Remove Video', 'tailwind-starter')}
								</Button>
							)}
						</>
					) : (
						<>
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
						</>
					)}

					{(backgroundImage || backgroundVideo) && (
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
			</PanelBody>
		</>
	)

	// General visual controls
	const generalControls = (
		<>
			<PanelBody title={__('📱 Responsive Design', 'tailwind-starter')} initialOpen={true}>
				<UltimateDeviceSelector
					activeDevice={activeDevice}
					onChange={(device) => setAttributes({ activeDevice: device })}
				/>
				<div style={{ 
					background: '#f0f9ff', 
					border: '1px solid #bae6fd', 
					borderRadius: '8px', 
					padding: '12px', 
					margin: '12px 0',
					fontSize: '12px',
					color: '#1e40af'
				}}>
					<strong>💡 Pro Tip:</strong> Start with "All" devices for your base design, then customize for mobile/tablet as needed!
				</div>
			</PanelBody>

			<UltimateControlTabs
				spacing={visualSettings.spacing || {}}
				onSpacingChange={(spacing) => setAttributes({
					visualSettings: { ...visualSettings, spacing }
				})}
				margins={visualSettings.margins || {}}
				onMarginsChange={(margins) => setAttributes({
					visualSettings: { ...visualSettings, margins }
				})}
				blockSpacing={visualSettings.blockSpacing || {}}
				onBlockSpacingChange={(blockSpacing) => setAttributes({
					visualSettings: { ...visualSettings, blockSpacing }
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
				device={activeDevice}
				presets={presets}
				onPresetApply={handlePresetApply}
				onResetAll={() => {
					setAttributes({ 
						visualSettings: {
							spacing: {},
							margins: {},
							blockSpacing: {},
							typography: {},
							layout: {},
							effects: {},
							gradients: {},
							backgroundColor: '',
							textColor: ''
						}
					})
				}}
			/>

			<PanelBody title={__('🚀 Advanced', 'tailwind-starter')} initialOpen={false}>
				<div style={{
					background: '#f0f9ff',
					border: '1px solid #bae6fd',
					borderRadius: '6px',
					padding: '12px',
					fontSize: '12px'
				}}>
					<strong>💎 Generated Classes:</strong>
					<br />
					<code style={{ wordBreak: 'break-all', fontSize: '10px' }}>
						{visualClasses || 'No custom styles yet'}
					</code>
				</div>
			</PanelBody>
		</>
	)

	return (
		<>
			<InspectorControls>
				<SimpleInspectorTabs
					variant="horizontal"
					blockControls={blockControls}
					generalControls={generalControls}
					initialTab="block"
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div className="hero-content-wrapper relative min-h-[400px] flex items-center">
					{/* Background Elements */}
					{backgroundImage && (
						<div 
							className="absolute inset-0 bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: `url(${backgroundImage.url})` }}
						/>
					)}
					
					{backgroundVideo && layout === 'video' && (
						<video 
							className="absolute inset-0 w-full h-full object-cover"
							autoPlay 
							muted 
							loop
							src={backgroundVideo.url}
						/>
					)}

					{hasOverlay && (backgroundImage || backgroundVideo) && (
						<div 
							className="absolute inset-0 bg-black"
							style={{ opacity: overlayOpacity / 100 }}
						/>
					)}

					{/* Content */}
					<div className={`hero-content relative z-10 w-full ${
						layout === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : 
						'max-w-4xl mx-auto px-4'
					}`}>
						<div className={`hero-text ${layout === 'split' ? 'lg:pr-8' : ''}`}>
							<RichText
								tagName="h1"
								className="hero-headline text-4xl lg:text-6xl font-bold mb-6 text-white"
								value={headline}
								onChange={(value) => setAttributes({ headline: value })}
								placeholder={__('Enter headline...', 'tailwind-starter')}
							/>
							
							<RichText
								tagName="p"
								className="hero-subheadline text-lg lg:text-xl mb-8 text-gray-200"
								value={subheadline}
								onChange={(value) => setAttributes({ subheadline: value })}
								placeholder={__('Enter description...', 'tailwind-starter')}
							/>

							<div className={`hero-cta-buttons flex gap-4 ${
								textAlignment === 'center' ? 'justify-center' : 
								textAlignment === 'right' ? 'justify-end' : 'justify-start'
							}`}>
								<div
									className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
								>
									{primaryCta.text}
								</div>
								
								{showSecondaryCta && (
									<div
										className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
									>
										{secondaryCta.text}
									</div>
								)}
							</div>
						</div>

						{layout === 'split' && (
							<div className="hero-visual">
								<div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
									<span className="text-gray-500">{__('Visual Element', 'tailwind-starter')}</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}