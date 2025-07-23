import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	Button,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		steps,
		showNumbers,
		showIcons,
		showDuration,
		connectingLines,
		numberStyle,
		alignment,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		settings,
		activeDevice
	} = attributes;

	const [editingStep, setEditingStep] = useState(null);

	// Enhanced preset styles for process steps
	const presets = {
		professional: {
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
	const previewClasses = generateAllClasses(settings || {});

	const blockProps = useBlockProps({
		className: `process-steps process-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'horizontal-timeline', icon: '➡️', name: 'Horizontal Timeline', desc: 'Left-to-right flow' },
		{ key: 'vertical-steps', icon: '⬇️', name: 'Vertical Steps', desc: 'Numbered list format' },
		{ key: 'icon-steps', icon: '🎨', name: 'Icon Steps', desc: 'Visual icons for each step' },
		{ key: 'minimal-numbers', icon: '🔢', name: 'Minimal Numbers', desc: 'Clean numbered progression' }
	];

	const updateStep = (stepIndex, field, value) => {
		const updatedSteps = [...steps];
		updatedSteps[stepIndex] = {
			...updatedSteps[stepIndex],
			[field]: value
		};
		setAttributes({ steps: updatedSteps });
	};

	const addStep = () => {
		const newStep = {
			id: `step-${Date.now()}`,
			title: `Step ${steps.length + 1}`,
			description: 'Description for this step...',
			icon: '📋',
			duration: '1 week'
		};
		setAttributes({ steps: [...steps, newStep] });
	};

	const removeStep = (stepIndex) => {
		const updatedSteps = steps.filter((_, index) => index !== stepIndex);
		setAttributes({ steps: updatedSteps });
	};

	const renderStepPreview = (step, index) => {
		const stepNumber = index + 1;
		
		switch (layout) {
			case 'horizontal-timeline':
				return (
					<div key={step.id} className="step-item flex-1 relative">
						{connectingLines && index < steps.length - 1 && (
							<div className="absolute top-6 right-0 w-full h-0.5 bg-blue-200 z-0"></div>
						)}
						<div className="relative z-10 text-center">
							{showNumbers && (
								<div className={`step-number w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-white bg-blue-600 ${
									numberStyle === 'square' ? 'rounded-lg' : 'rounded-full'
								}`}>
									{stepNumber}
								</div>
							)}
							{showIcons && (
								<div className="step-icon text-2xl mb-3">{step.icon}</div>
							)}
							<h4 className="step-title font-semibold text-lg mb-2">{step.title}</h4>
							<p className="step-description text-sm text-gray-600 mb-2">{step.description}</p>
							{showDuration && (
								<span className="step-duration text-xs text-blue-600 font-medium">{step.duration}</span>
							)}
						</div>
					</div>
				);

			case 'vertical-steps':
				return (
					<div key={step.id} className="step-item flex items-start space-x-4 relative">
						{connectingLines && index < steps.length - 1 && (
							<div className="absolute left-6 top-12 w-0.5 h-full bg-blue-200 z-0"></div>
						)}
						<div className="relative z-10">
							{showNumbers && (
								<div className={`step-number w-12 h-12 flex items-center justify-center font-bold text-white bg-blue-600 ${
									numberStyle === 'square' ? 'rounded-lg' : 'rounded-full'
								}`}>
									{stepNumber}
								</div>
							)}
						</div>
						<div className="flex-1">
							{showIcons && (
								<div className="step-icon text-2xl mb-2">{step.icon}</div>
							)}
							<h4 className="step-title font-semibold text-lg mb-2">{step.title}</h4>
							<p className="step-description text-gray-600 mb-2">{step.description}</p>
							{showDuration && (
								<span className="step-duration text-sm text-blue-600 font-medium">{step.duration}</span>
							)}
						</div>
					</div>
				);

			case 'icon-steps':
				return (
					<div key={step.id} className="step-item text-center">
						<div className="step-icon text-4xl mb-4">{step.icon}</div>
						<h4 className="step-title font-semibold text-lg mb-2">{step.title}</h4>
						<p className="step-description text-gray-600 text-sm mb-2">{step.description}</p>
						{showDuration && (
							<span className="step-duration text-xs text-blue-600 font-medium">{step.duration}</span>
						)}
					</div>
				);

			case 'minimal-numbers':
				return (
					<div key={step.id} className="step-item flex items-start space-x-3">
						{showNumbers && (
							<div className="step-number w-8 h-8 flex items-center justify-center font-bold text-blue-600 bg-blue-100 rounded-full text-sm">
								{stepNumber}
							</div>
						)}
						<div className="flex-1">
							<h4 className="step-title font-semibold mb-1">{step.title}</h4>
							<p className="step-description text-gray-600 text-sm">{step.description}</p>
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

				<PanelBody title={__('⚙️ Step Settings', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Section Header', 'tailwind-starter')}
						checked={showSectionHeader}
						onChange={(value) => setAttributes({ showSectionHeader: value })}
					/>

					<Divider />

					<ToggleControl
						label={__('Show Numbers', 'tailwind-starter')}
						checked={showNumbers}
						onChange={(value) => setAttributes({ showNumbers: value })}
					/>

					<ToggleControl
						label={__('Show Icons', 'tailwind-starter')}
						checked={showIcons}
						onChange={(value) => setAttributes({ showIcons: value })}
					/>

					<ToggleControl
						label={__('Show Duration', 'tailwind-starter')}
						checked={showDuration}
						onChange={(value) => setAttributes({ showDuration: value })}
					/>

					<ToggleControl
						label={__('Connecting Lines', 'tailwind-starter')}
						checked={connectingLines}
						onChange={(value) => setAttributes({ connectingLines: value })}
					/>

					<SelectControl
						label={__('Number Style', 'tailwind-starter')}
						value={numberStyle}
						onChange={(value) => setAttributes({ numberStyle: value })}
						options={[
							{ label: 'Circle', value: 'circle' },
							{ label: 'Square', value: 'square' }
						]}
					/>

					<SelectControl
						label={__('Alignment', 'tailwind-starter')}
						value={alignment}
						onChange={(value) => setAttributes({ alignment: value })}
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
					/>
				</PanelBody>

				<PanelBody title={__('📝 Steps Management', 'tailwind-starter')} initialOpen={false}>
					{steps.map((step, index) => (
						<div key={step.id} className="mb-4 p-4 border rounded">
							<div className="flex justify-between items-center mb-2">
								<strong>Step {index + 1}</strong>
								<Button
									isDestructive
									isSmall
									onClick={() => removeStep(index)}
								>
									Remove
								</Button>
							</div>
							<TextControl
								label="Title"
								value={step.title}
								onChange={(value) => updateStep(index, 'title', value)}
							/>
							<TextControl
								label="Description"
								value={step.description}
								onChange={(value) => updateStep(index, 'description', value)}
							/>
							<TextControl
								label="Icon (Emoji)"
								value={step.icon}
								onChange={(value) => updateStep(index, 'icon', value)}
							/>
							<TextControl
								label="Duration"
								value={step.duration}
								onChange={(value) => updateStep(index, 'duration', value)}
							/>
						</div>
					))}
					<Button
						isPrimary
						onClick={addStep}
					>
						Add Step
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
					device={activeDevice}
					presets={{}}
					onPresetApply={(preset) => {
						console.log('Applying preset:', preset);
					}}
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

				<div className={`process-steps-container ${
					layout === 'horizontal-timeline' ? 'flex space-x-8' :
					layout === 'vertical-steps' ? 'space-y-8' :
					layout === 'icon-steps' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' :
					'space-y-6'
				} ${alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'}`}>
					{steps.map((step, index) => renderStepPreview(step, index))}
				</div>

				<div className="generated-classes mt-4 p-3 bg-gray-100 rounded text-xs">
					<strong>Preview Classes:</strong> {previewClasses}<br />
					<strong>All Device Classes:</strong> {allClasses}
				</div>
			</div>
		</>
	);
} 