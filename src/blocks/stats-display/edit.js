import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	Button,
	RangeControl,
	ColorPicker,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		stats,
		columns,
		showIcons,
		showDescriptions,
		enableAnimations,
		animationTrigger,
		numberSize,
		alignment,
		backgroundColor,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		highlightedStat,
		cardStyle,
		settings,
		activeDevice
	} = attributes;

	const [editingStat, setEditingStat] = useState(null);
	const [animatedNumbers, setAnimatedNumbers] = useState({});

	// Enhanced preset styles for stats display
	const presets = {
		corporate: {
			spacing: { base: { top: 8, right: 4, bottom: 8, left: 4 } },
			margins: { base: { top: 0, right: 0, bottom: 0, left: 0 } },
			typography: { base: { fontSize: 'text-lg', fontWeight: 'font-normal', textAlign: 'text-center' } },
			backgroundColor: 'bg-gray-50',
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
			typography: { base: { fontSize: 'text-base', fontWeight: 'font-light', textAlign: 'text-center' } },
			backgroundColor: 'bg-white',
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
		className: `stats-display stats-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'counter-animation', icon: '📊', name: 'Counter Animation', desc: 'Numbers animate on scroll' },
		{ key: 'icon-stats', icon: '🎯', name: 'Icon Stats', desc: 'Metrics with icons' },
		{ key: 'simple-grid', icon: '📋', name: 'Simple Grid', desc: 'Clean number presentation' },
		{ key: 'highlighted-single', icon: '⭐', name: 'Highlighted Single', desc: 'One major statistic' }
	];

	const updateStat = (statIndex, field, value) => {
		const updatedStats = [...stats];
		updatedStats[statIndex] = {
			...updatedStats[statIndex],
			[field]: value
		};
		setAttributes({ stats: updatedStats });
	};

	const addStat = () => {
		const newStat = {
			id: `stat-${Date.now()}`,
			number: '100',
			prefix: '',
			suffix: '+',
			label: `Stat ${stats.length + 1}`,
			description: 'Description for this statistic...',
			icon: '📈',
			color: '#3b82f6',
			animationType: 'countUp',
			animationDuration: 2000
		};
		setAttributes({ stats: [...stats, newStat] });
	};

	const removeStat = (statIndex) => {
		const updatedStats = stats.filter((_, index) => index !== statIndex);
		setAttributes({ stats: updatedStats });
	};

	// Simulate number animation for preview
	useEffect(() => {
		if (enableAnimations) {
			const timer = setTimeout(() => {
				const newAnimatedNumbers = {};
				stats.forEach((stat, index) => {
					const targetNumber = parseFloat(stat.number.replace(/,/g, ''));
					if (!isNaN(targetNumber)) {
						newAnimatedNumbers[stat.id] = targetNumber;
					}
				});
				setAnimatedNumbers(newAnimatedNumbers);
			}, 500);

			return () => clearTimeout(timer);
		}
	}, [stats, enableAnimations]);

	const formatNumber = (number) => {
		return new Intl.NumberFormat().format(number);
	};

	const renderStatPreview = (stat, index) => {
		const isHighlighted = layout === 'highlighted-single' && stat.id === highlightedStat;
		const displayNumber = enableAnimations && animatedNumbers[stat.id] !== undefined 
			? formatNumber(animatedNumbers[stat.id]) 
			: stat.number;

		switch (layout) {
			case 'counter-animation':
				return (
					<div key={stat.id} className="stat-item text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
						{showIcons && (
							<div className="stat-icon text-4xl mb-4">{stat.icon}</div>
						)}
						<div className={`stat-number font-bold mb-2 ${
							numberSize === 'small' ? 'text-2xl' :
							numberSize === 'medium' ? 'text-3xl' :
							numberSize === 'large' ? 'text-4xl' : 'text-5xl'
						}`} style={{ color: stat.color }}>
							{stat.prefix}{displayNumber}{stat.suffix}
						</div>
						<h4 className="stat-label font-semibold text-lg mb-1">{stat.label}</h4>
						{showDescriptions && (
							<p className="stat-description text-gray-600 text-sm">{stat.description}</p>
						)}
					</div>
				);

			case 'icon-stats':
				return (
					<div key={stat.id} className="stat-item flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
						<div className="stat-icon text-3xl" style={{ color: stat.color }}>
							{stat.icon}
						</div>
						<div className="flex-1">
							<div className={`stat-number font-bold ${
								numberSize === 'small' ? 'text-xl' :
								numberSize === 'medium' ? 'text-2xl' :
								numberSize === 'large' ? 'text-3xl' : 'text-4xl'
							}`} style={{ color: stat.color }}>
								{stat.prefix}{displayNumber}{stat.suffix}
							</div>
							<h4 className="stat-label font-medium">{stat.label}</h4>
							{showDescriptions && (
								<p className="stat-description text-gray-600 text-xs">{stat.description}</p>
							)}
						</div>
					</div>
				);

			case 'simple-grid':
				return (
					<div key={stat.id} className="stat-item text-center p-4">
						<div className={`stat-number font-bold mb-1 ${
							numberSize === 'small' ? 'text-2xl' :
							numberSize === 'medium' ? 'text-3xl' :
							numberSize === 'large' ? 'text-4xl' : 'text-5xl'
						}`} style={{ color: stat.color }}>
							{stat.prefix}{displayNumber}{stat.suffix}
						</div>
						<h4 className="stat-label font-medium text-gray-700">{stat.label}</h4>
					</div>
				);

			case 'highlighted-single':
				if (isHighlighted) {
					return (
						<div key={stat.id} className="stat-item-highlighted col-span-full text-center p-12 bg-white rounded-xl shadow-lg">
							{showIcons && (
								<div className="stat-icon text-6xl mb-6">{stat.icon}</div>
							)}
							<div className="stat-number font-bold text-6xl mb-4" style={{ color: stat.color }}>
								{stat.prefix}{displayNumber}{stat.suffix}
							</div>
							<h4 className="stat-label font-semibold text-2xl mb-2">{stat.label}</h4>
							{showDescriptions && (
								<p className="stat-description text-gray-600 text-lg max-w-md mx-auto">{stat.description}</p>
							)}
						</div>
					);
				} else {
					return (
						<div key={stat.id} className="stat-item text-center p-4 opacity-75">
							<div className="stat-number font-bold text-2xl mb-1" style={{ color: stat.color }}>
								{stat.prefix}{displayNumber}{stat.suffix}
							</div>
							<h4 className="stat-label font-medium text-sm">{stat.label}</h4>
						</div>
					);
				}

			default:
				return null;
		}
	};

	const getGridColumns = () => {
		if (layout === 'highlighted-single') {
			return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';
		}
		
		switch (columns) {
			case 2: return 'grid-cols-1 md:grid-cols-2';
			case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
			case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
			case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5';
			default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
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

				<PanelBody title={__('⚙️ Display Settings', 'tailwind-starter')} initialOpen={false}>
					<ToggleControl
						label={__('Show Section Header', 'tailwind-starter')}
						checked={showSectionHeader}
						onChange={(value) => setAttributes({ showSectionHeader: value })}
					/>

					<Divider />

					<RangeControl
						label={__('Columns', 'tailwind-starter')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={2}
						max={5}
						disabled={layout === 'highlighted-single'}
					/>

					<ToggleControl
						label={__('Show Icons', 'tailwind-starter')}
						checked={showIcons}
						onChange={(value) => setAttributes({ showIcons: value })}
					/>

					<ToggleControl
						label={__('Show Descriptions', 'tailwind-starter')}
						checked={showDescriptions}
						onChange={(value) => setAttributes({ showDescriptions: value })}
					/>

					<ToggleControl
						label={__('Enable Animations', 'tailwind-starter')}
						checked={enableAnimations}
						onChange={(value) => setAttributes({ enableAnimations: value })}
					/>

					<SelectControl
						label={__('Number Size', 'tailwind-starter')}
						value={numberSize}
						onChange={(value) => setAttributes({ numberSize: value })}
						options={[
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
							{ label: 'Extra Large', value: 'xl' }
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

					{layout === 'highlighted-single' && (
						<SelectControl
							label={__('Highlighted Stat', 'tailwind-starter')}
							value={highlightedStat}
							onChange={(value) => setAttributes({ highlightedStat: value })}
							options={stats.map(stat => ({
								label: stat.label,
								value: stat.id
							}))}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('📊 Stats Management', 'tailwind-starter')} initialOpen={false}>
					{stats.map((stat, index) => (
						<div key={stat.id} className="mb-6 p-4 border rounded">
							<div className="flex justify-between items-center mb-2">
								<strong>Stat {index + 1}</strong>
								<Button
									isDestructive
									isSmall
									onClick={() => removeStat(index)}
								>
									Remove
								</Button>
							</div>
							<TextControl
								label="Number"
								value={stat.number}
								onChange={(value) => updateStat(index, 'number', value)}
								help="Use commas for thousands (e.g., 10,000)"
							/>
							<div className="flex space-x-2">
								<TextControl
									label="Prefix"
									value={stat.prefix}
									onChange={(value) => updateStat(index, 'prefix', value)}
									placeholder="$"
								/>
								<TextControl
									label="Suffix"
									value={stat.suffix}
									onChange={(value) => updateStat(index, 'suffix', value)}
									placeholder="+"
								/>
							</div>
							<TextControl
								label="Label"
								value={stat.label}
								onChange={(value) => updateStat(index, 'label', value)}
							/>
							<TextControl
								label="Description"
								value={stat.description}
								onChange={(value) => updateStat(index, 'description', value)}
							/>
							<TextControl
								label="Icon (Emoji)"
								value={stat.icon}
								onChange={(value) => updateStat(index, 'icon', value)}
							/>
							<div className="mt-2">
								<label className="block text-sm font-medium mb-1">Color</label>
								<ColorPicker
									color={stat.color}
									onChange={(color) => updateStat(index, 'color', color)}
								/>
							</div>
						</div>
					))}
					<Button
						isPrimary
						onClick={addStat}
					>
						Add Stat
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
					background={settings.backgroundColor || 'bg-gray-50'}
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

				<div className={`stats-container grid gap-6 ${getGridColumns()} ${
					alignment === 'left' ? 'text-left' : 
					alignment === 'right' ? 'text-right' : 'text-center'
				}`}>
					{stats.map((stat, index) => renderStatPreview(stat, index))}
				</div>

				<div className="generated-classes mt-4 p-3 bg-gray-100 rounded text-xs">
					<strong>Preview Classes:</strong> {previewClasses}<br />
					<strong>All Device Classes:</strong> {allClasses}
				</div>
			</div>
		</>
	);
} 