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
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateTailwindClasses, generateAllClasses } from '../../utils/visual-controls.js';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		beforeImage,
		afterImage,
		beforeLabel,
		afterLabel,
		showLabels,
		labelPosition,
		sliderPosition,
		sliderColor,
		sliderThickness,
		handleStyle,
		handleSize,
		aspectRatio,
		borderRadius,
		enableShadow,
		animationSpeed,
		autoSlide,
		autoSlideDelay,
		toggleButtonText,
		fadeDirection,
		enableKeyboard,
		enableTouch,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		description,
		showDescription,
		descriptionPosition,
		enableFullscreen,
		overlayOpacity,
		hoverEffect,
		settings,
		activeDevice
	} = attributes;

	const [currentView, setCurrentView] = useState('before');
	const [sliderPos, setSliderPos] = useState(sliderPosition);

	// Enhanced preset styles for before after
	const presets = {
		modern: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-semibold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gray-50',
			textColor: 'text-gray-900',
			gradients: {},
			layout: {},
			effects: {}
		},
		clean: {
			spacing: { base: { top: 6, right: 3, bottom: 6, left: 3 } },
			margins: { base: { top: 2, right: 0, bottom: 2, left: 0 } },
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-normal', textAlign: 'text-center' } },
			backgroundColor: 'bg-white',
			textColor: 'text-gray-800',
			gradients: {},
			layout: {},
			effects: {}
		},
		dramatic: {
			spacing: { base: { top: 10, right: 5, bottom: 10, left: 5 } },
			margins: { base: { top: 4, right: 0, bottom: 4, left: 0 } },
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-bold', textAlign: 'text-center' } },
			backgroundColor: 'bg-gradient-to-br from-gray-900 to-black',
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
		className: `before-after comparison-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'slider-comparison', icon: '⭤', name: 'Slider Comparison', desc: 'Draggable divider' },
		{ key: 'toggle-switch', icon: '🔄', name: 'Toggle Switch', desc: 'Click to switch views' },
		{ key: 'side-by-side', icon: '⚏', name: 'Side by Side', desc: 'Static comparison' },
		{ key: 'overlay-fade', icon: '🔀', name: 'Overlay Fade', desc: 'Smooth transition effect' }
	];

	const getAspectRatioClass = () => {
		switch (aspectRatio) {
			case '16:9': return 'aspect-video';
			case '4:3': return 'aspect-4/3';
			case '1:1': return 'aspect-square';
			case '3:2': return 'aspect-3/2';
			default: return 'aspect-video';
		}
	};

	const renderImagePlaceholder = (type, image, onSelect) => {
		return (
			<MediaUploadCheck>
				<MediaUpload
					onSelect={onSelect}
					allowedTypes={['image']}
					value={image.id}
					render={({ open }) => (
						<div className="image-placeholder">
							{image.url ? (
								<div className="relative">
									<img 
										src={image.url} 
										alt={image.alt}
										className="w-full h-full object-cover rounded"
									/>
									<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200">
										<Button
											variant="secondary"
											onClick={open}
											className="bg-white text-gray-800"
										>
											Change {type} Image
										</Button>
									</div>
								</div>
							) : (
								<Button
									variant="secondary"
									onClick={open}
									className="w-full h-32 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-600"
								>
									Upload {type} Image
								</Button>
							)}
						</div>
					)}
				/>
			</MediaUploadCheck>
		);
	};

	const renderComparison = () => {
		if (!beforeImage.url || !afterImage.url) {
			return (
				<div className="comparison-placeholder bg-gray-100 rounded-lg p-8 text-center">
					<div className="text-gray-400 text-lg mb-2">📷</div>
					<p className="text-gray-500">Upload both before and after images to see the comparison preview</p>
				</div>
			);
		}

		switch (layout) {
			case 'slider-comparison':
				return (
					<div className={`comparison-container relative ${getAspectRatioClass()} overflow-hidden rounded-lg ${enableShadow ? 'shadow-lg' : ''}`}>
						<div className="before-image absolute inset-0">
							<img 
								src={beforeImage.url} 
								alt={beforeImage.alt}
								className="w-full h-full object-cover"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
									{beforeLabel}
								</div>
							)}
						</div>
						<div 
							className="after-image absolute inset-0"
							style={{ clipPath: `polygon(${sliderPos}% 0%, 100% 0%, 100% 100%, ${sliderPos}% 100%)` }}
						>
							<img 
								src={afterImage.url} 
								alt={afterImage.alt}
								className="w-full h-full object-cover"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
									{afterLabel}
								</div>
							)}
						</div>
						<div 
							className="slider-handle absolute top-0 bottom-0 bg-white shadow-lg flex items-center justify-center cursor-ew-resize"
							style={{ 
								left: `${sliderPos}%`, 
								width: `${handleSize}px`,
								transform: 'translateX(-50%)',
								borderRadius: handleStyle === 'circle' ? '50%' : '4px'
							}}
						>
							<div className="slider-arrows text-gray-600">⇄</div>
						</div>
						<div 
							className="slider-line absolute top-0 bottom-0 bg-white"
							style={{ 
								left: `${sliderPos}%`, 
								width: `${sliderThickness}px`,
								transform: 'translateX(-50%)'
							}}
						/>
					</div>
				);

			case 'toggle-switch':
				return (
					<div className={`comparison-container relative ${getAspectRatioClass()} overflow-hidden rounded-lg ${enableShadow ? 'shadow-lg' : ''}`}>
						<div className={`before-image absolute inset-0 transition-opacity duration-300 ${currentView === 'after' ? 'opacity-0' : 'opacity-100'}`}>
							<img 
								src={beforeImage.url} 
								alt={beforeImage.alt}
								className="w-full h-full object-cover"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
									{beforeLabel}
								</div>
							)}
						</div>
						<div className={`after-image absolute inset-0 transition-opacity duration-300 ${currentView === 'before' ? 'opacity-0' : 'opacity-100'}`}>
							<img 
								src={afterImage.url} 
								alt={afterImage.alt}
								className="w-full h-full object-cover"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
									{afterLabel}
								</div>
							)}
						</div>
						<button 
							className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-opacity-100 transition-all duration-200"
							onClick={() => setCurrentView(currentView === 'before' ? 'after' : 'before')}
						>
							{toggleButtonText}
						</button>
					</div>
				);

			case 'side-by-side':
				return (
					<div className={`comparison-container grid grid-cols-2 gap-4 rounded-lg overflow-hidden ${enableShadow ? 'shadow-lg' : ''}`}>
						<div className={`before-section relative ${getAspectRatioClass()}`}>
							<img 
								src={beforeImage.url} 
								alt={beforeImage.alt}
								className="w-full h-full object-cover"
							/>
							{showLabels && (
								<div className={`label ${labelPosition === 'overlay' ? 'absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm' : 'text-center mt-2 font-medium'}`}>
									{beforeLabel}
								</div>
							)}
						</div>
						<div className={`after-section relative ${getAspectRatioClass()}`}>
							<img 
								src={afterImage.url} 
								alt={afterImage.alt}
								className="w-full h-full object-cover"
							/>
							{showLabels && (
								<div className={`label ${labelPosition === 'overlay' ? 'absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm' : 'text-center mt-2 font-medium'}`}>
									{afterLabel}
								</div>
							)}
						</div>
					</div>
				);

			case 'overlay-fade':
				return (
					<div className={`comparison-container relative ${getAspectRatioClass()} overflow-hidden rounded-lg ${enableShadow ? 'shadow-lg' : ''} group`}>
						<div className="before-image absolute inset-0">
							<img 
								src={beforeImage.url} 
								alt={beforeImage.alt}
								className="w-full h-full object-cover"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
									{beforeLabel}
								</div>
							)}
						</div>
						<div className="after-image absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
							<img 
								src={afterImage.url} 
								alt={afterImage.alt}
								className="w-full h-full object-cover"
							/>
							{showLabels && labelPosition === 'overlay' && (
								<div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
									{afterLabel}
								</div>
							)}
						</div>
						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
							Hover to reveal
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

				<PanelBody title={__('🖼️ Images', 'tailwind-starter')} initialOpen={false}>
					<h4 className="font-medium mb-3">Before Image</h4>
					{renderImagePlaceholder('Before', beforeImage, (media) => 
						setAttributes({ 
							beforeImage: { 
								url: media.url, 
								alt: media.alt || beforeLabel, 
								id: media.id 
							} 
						})
					)}
					<TextControl
						label={__('Before Image Alt Text', 'tailwind-starter')}
						value={beforeImage.alt}
						onChange={(value) => setAttributes({ 
							beforeImage: { ...beforeImage, alt: value } 
						})}
						className="mt-2 mb-4"
					/>

					<h4 className="font-medium mb-3">After Image</h4>
					{renderImagePlaceholder('After', afterImage, (media) => 
						setAttributes({ 
							afterImage: { 
								url: media.url, 
								alt: media.alt || afterLabel, 
								id: media.id 
							} 
						})
					)}
					<TextControl
						label={__('After Image Alt Text', 'tailwind-starter')}
						value={afterImage.alt}
						onChange={(value) => setAttributes({ 
							afterImage: { ...afterImage, alt: value } 
						})}
						className="mt-2"
					/>
				</PanelBody>

				<PanelBody title={__('⚙️ Comparison Settings', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Section Header', 'tailwind-starter')}
						checked={showSectionHeader}
						onChange={(value) => setAttributes({ showSectionHeader: value })}
					/>

					<Divider />

					<ToggleControl
						label={__('Show Labels', 'tailwind-starter')}
						checked={showLabels}
						onChange={(value) => setAttributes({ showLabels: value })}
					/>

					{showLabels && (
						<>
							<TextControl
								label={__('Before Label', 'tailwind-starter')}
								value={beforeLabel}
								onChange={(value) => setAttributes({ beforeLabel: value })}
							/>

							<TextControl
								label={__('After Label', 'tailwind-starter')}
								value={afterLabel}
								onChange={(value) => setAttributes({ afterLabel: value })}
							/>

							<SelectControl
								label={__('Label Position', 'tailwind-starter')}
								value={labelPosition}
								onChange={(value) => setAttributes({ labelPosition: value })}
								options={[
									{ label: 'Overlay', value: 'overlay' },
									{ label: 'Below', value: 'below' }
								]}
							/>
						</>
					)}

					<SelectControl
						label={__('Aspect Ratio', 'tailwind-starter')}
						value={aspectRatio}
						onChange={(value) => setAttributes({ aspectRatio: value })}
						options={[
							{ label: '16:9', value: '16:9' },
							{ label: '4:3', value: '4:3' },
							{ label: '1:1', value: '1:1' },
							{ label: '3:2', value: '3:2' }
						]}
					/>

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

					{layout === 'slider-comparison' && (
						<>
							<Divider />
							<h4 className="font-medium mb-3">Slider Settings</h4>
							
							<RangeControl
								label={__('Initial Slider Position (%)', 'tailwind-starter')}
								value={sliderPosition}
								onChange={(value) => {
									setAttributes({ sliderPosition: value });
									setSliderPos(value);
								}}
								min={0}
								max={100}
							/>

							<div className="color-picker-wrapper mb-4">
								<label className="block text-sm font-medium mb-2">Slider Color</label>
								<ColorPicker
									color={sliderColor}
									onChange={(value) => setAttributes({ sliderColor: value })}
								/>
							</div>

							<RangeControl
								label={__('Slider Thickness (px)', 'tailwind-starter')}
								value={sliderThickness}
								onChange={(value) => setAttributes({ sliderThickness: value })}
								min={1}
								max={10}
							/>

							<SelectControl
								label={__('Handle Style', 'tailwind-starter')}
								value={handleStyle}
								onChange={(value) => setAttributes({ handleStyle: value })}
								options={[
									{ label: 'Circle', value: 'circle' },
									{ label: 'Square', value: 'square' }
								]}
							/>

							<RangeControl
								label={__('Handle Size (px)', 'tailwind-starter')}
								value={handleSize}
								onChange={(value) => setAttributes({ handleSize: value })}
								min={30}
								max={60}
							/>
						</>
					)}

					{layout === 'toggle-switch' && (
						<>
							<Divider />
							<TextControl
								label={__('Toggle Button Text', 'tailwind-starter')}
								value={toggleButtonText}
								onChange={(value) => setAttributes({ toggleButtonText: value })}
							/>
						</>
					)}

					<RangeControl
						label={__('Animation Speed (ms)', 'tailwind-starter')}
						value={animationSpeed}
						onChange={(value) => setAttributes({ animationSpeed: value })}
						min={100}
						max={1000}
					/>

					<ToggleControl
						label={__('Enable Keyboard Navigation', 'tailwind-starter')}
						checked={enableKeyboard}
						onChange={(value) => setAttributes({ enableKeyboard: value })}
					/>

					<ToggleControl
						label={__('Enable Touch/Swipe', 'tailwind-starter')}
						checked={enableTouch}
						onChange={(value) => setAttributes({ enableTouch: value })}
					/>

					<ToggleControl
						label={__('Show Description', 'tailwind-starter')}
						checked={showDescription}
						onChange={(value) => setAttributes({ showDescription: value })}
					/>

					{showDescription && (
						<>
							<TextareaControl
								label={__('Description', 'tailwind-starter')}
								value={description}
								onChange={(value) => setAttributes({ description: value })}
								rows={3}
							/>

							<SelectControl
								label={__('Description Position', 'tailwind-starter')}
								value={descriptionPosition}
								onChange={(value) => setAttributes({ descriptionPosition: value })}
								options={[
									{ label: 'Above', value: 'top' },
									{ label: 'Below', value: 'bottom' }
								]}
							/>
						</>
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

				{showDescription && descriptionPosition === 'top' && description && (
					<div className="description mb-6">
						<p className="text-gray-600 text-center">{description}</p>
					</div>
				)}

				{renderComparison()}

				{showLabels && labelPosition === 'below' && layout === 'side-by-side' && (
					<div className="labels-below grid grid-cols-2 gap-4 mt-4">
						<div className="text-center font-medium">{beforeLabel}</div>
						<div className="text-center font-medium">{afterLabel}</div>
					</div>
				)}

				{showDescription && descriptionPosition === 'bottom' && description && (
					<div className="description mt-6">
						<p className="text-gray-600 text-center">{description}</p>
					</div>
				)}

				<div className="generated-classes mt-4 p-3 bg-gray-100 rounded text-xs">
					<strong>Preview Classes:</strong> {previewClasses}<br />
					<strong>All Device Classes:</strong> {allClasses}
				</div>
			</div>
		</>
	);
} 