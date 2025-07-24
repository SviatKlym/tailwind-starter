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
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';

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
		buttonSize,
		buttonStyle,
		hoverEffect,
		showSectionHeader,
		sectionTitle,
		sectionSubtitle,
		containerWidth,
		cornerRadius,
		shadowStyle,
		settings = {},
		activeDevice
	} = attributes;

	// Enhanced preset styles for CTA section
	const presets = {
		professional: {
			spacing: { base: { top: 12, right: 6, bottom: 12, left: 6 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-semibold', textAlign: 'text-center' } },
			backgroundColor: 'bg-blue-600',
			textColor: 'text-white',
			gradients: {},
			layout: {},
			effects: {}
		},
		modern: {
			spacing: { base: { top: 16, right: 8, bottom: 16, left: 8 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-2xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
			textColor: 'text-white',
			gradients: {},
			layout: {},
			effects: {}
		},
		minimal: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-left' } },
			backgroundColor: 'bg-gray-100',
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

	const blockProps = useBlockProps({
		className: `cta-section cta-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'centered', icon: '🎯', name: 'Centered CTA', desc: 'Center-aligned call to action' },
		{ key: 'split', icon: '↔️', name: 'Split CTA', desc: 'Two-column layout with visual' },
		{ key: 'banner', icon: '📢', name: 'Banner Style', desc: 'Full-width banner format' },
		{ key: 'button-group', icon: '🔘', name: 'Button Group', desc: 'Focus on multiple buttons' }
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

			<PanelBody title={__('⚙️ CTA Settings', 'tailwind-starter')} initialOpen={false}>
				<ToggleControl
					label={__('Show Section Header', 'tailwind-starter')}
					checked={showSectionHeader}
					onChange={(value) => setAttributes({ showSectionHeader: value })}
				/>

				<Divider />

				<SelectControl
					label={__('Text Alignment', 'tailwind-starter')}
					value={alignment}
					options={alignmentOptions}
					onChange={(value) => setAttributes({ alignment: value })}
				/>

				<SelectControl
					label={__('Container Width', 'tailwind-starter')}
					value={containerWidth}
					onChange={(value) => setAttributes({ containerWidth: value })}
					options={[
						{ label: 'Full Width', value: 'full' },
						{ label: 'Wide', value: 'wide' },
						{ label: 'Standard', value: 'standard' },
						{ label: 'Narrow', value: 'narrow' }
					]}
				/>

				<SelectControl
					label={__('Corner Radius', 'tailwind-starter')}
					value={cornerRadius}
					onChange={(value) => setAttributes({ cornerRadius: value })}
					options={[
						{ label: 'None', value: 'none' },
						{ label: 'Small', value: 'small' },
						{ label: 'Medium', value: 'medium' },
						{ label: 'Large', value: 'large' }
					]}
				/>

				<SelectControl
					label={__('Shadow Style', 'tailwind-starter')}
					value={shadowStyle}
					onChange={(value) => setAttributes({ shadowStyle: value })}
					options={[
						{ label: 'None', value: 'none' },
						{ label: 'Small', value: 'small' },
						{ label: 'Medium', value: 'medium' },
						{ label: 'Large', value: 'large' }
					]}
				/>

				<SelectControl
					label={__('Hover Effect', 'tailwind-starter')}
					value={hoverEffect}
					onChange={(value) => setAttributes({ hoverEffect: value })}
					options={[
						{ label: 'None', value: 'none' },
						{ label: 'Lift', value: 'lift' },
						{ label: 'Scale', value: 'scale' },
						{ label: 'Glow', value: 'glow' }
					]}
				/>
			</PanelBody>

			<PanelBody title={__('🔘 Button Settings', 'tailwind-starter')} initialOpen={false}>
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

				<Divider />

				<SelectControl
					label={__('Button Size', 'tailwind-starter')}
					value={buttonSize}
					onChange={(value) => setAttributes({ buttonSize: value })}
					options={[
						{ label: 'Small', value: 'small' },
						{ label: 'Medium', value: 'medium' },
						{ label: 'Large', value: 'large' },
						{ label: 'Extra Large', value: 'xl' }
					]}
				/>
			</PanelBody>

			<PanelBody title={__('🖼️ Background & Media', 'tailwind-starter')} initialOpen={false}>
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
				background={settings?.backgroundColor || 'bg-blue-600'}
				onBackgroundChange={(backgroundColor) => setAttributes({
					settings: { ...(settings || {}), backgroundColor }
				})}
				textColor={settings?.textColor || 'text-white'}
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
				{/* Section Header */}
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
									className={`cta-primary-button rounded-lg font-semibold transition-all cursor-pointer ${
										buttonSize === 'small' ? 'px-4 py-2 text-sm' :
										buttonSize === 'medium' ? 'px-6 py-3 text-base' :
										buttonSize === 'large' ? 'px-8 py-4 text-lg' :
										'px-10 py-5 text-xl'
									} ${
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
										className={`cta-secondary-button rounded-lg font-semibold transition-all cursor-pointer ${
											buttonSize === 'small' ? 'px-4 py-2 text-sm' :
											buttonSize === 'medium' ? 'px-6 py-3 text-base' :
											buttonSize === 'large' ? 'px-8 py-4 text-lg' :
											'px-10 py-5 text-xl'
										} ${
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