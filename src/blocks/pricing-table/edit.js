import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	Button,
	
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { SimpleInspectorTabs } from '../../components/InspectorTabs.js';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		showToggle,
		toggleLabel1,
		toggleLabel2,
		currentToggle,
		plans,
		settings = {},
		activeDevice
	} = attributes;

	const [editingPlan, setEditingPlan] = useState(null);


	// Generate classes for all devices
	const allClasses = generateAllClasses(settings || {});

	// Generate preview classes (just base for editor)
	const previewClasses = generateAllClasses(settings || {});

	const blockProps = useBlockProps({
		className: `pricing-table pricing-table--${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'three-tier', icon: '📊', name: 'Three Tier', desc: 'Standard 3-column layout' },
		{ key: 'simple', icon: '🃏', name: 'Simple Cards', desc: 'Clean card design' },
		{ key: 'comparison', icon: '📋', name: 'Comparison', desc: 'Feature comparison table' }
	];

	const updatePlan = (planIndex, field, value) => {
		const updatedPlans = [...plans];
		updatedPlans[planIndex] = {
			...updatedPlans[planIndex],
			[field]: value
		};
		setAttributes({ plans: updatedPlans });
	};

	const updatePlanFeature = (planIndex, featureIndex, value) => {
		const updatedPlans = [...plans];
		updatedPlans[planIndex].features[featureIndex] = value;
		setAttributes({ plans: updatedPlans });
	};

	const addFeatureToPlan = (planIndex) => {
		const updatedPlans = [...plans];
		updatedPlans[planIndex].features.push('New Feature');
		setAttributes({ plans: updatedPlans });
	};

	const removeFeatureFromPlan = (planIndex, featureIndex) => {
		const updatedPlans = [...plans];
		updatedPlans[planIndex].features.splice(featureIndex, 1);
		setAttributes({ plans: updatedPlans });
	};

	const getCurrentPrice = (plan) => {
		if (showToggle && currentToggle === 'annual') {
			return plan.annualPrice;
		}
		return plan.monthlyPrice;
	};

	const getCurrentPeriod = () => {
		if (showToggle && currentToggle === 'annual') {
			return 'year';
		}
		return 'month';
	};

	// Block tab controls - content and functionality
	const blockControls = (
		<>
			<PanelBody title={__('🎯 Quick Style Presets', 'tailwind-starter')} initialOpen={true}>
					<div style={{ marginBottom: '16px' }}>
						<label style={{ 
							fontWeight: '600', 
							fontSize: '13px', 
							color: '#1e1e1e',
							marginBottom: '8px',
							display: 'block'
						}}>
							{__('Layout Style', 'tailwind-starter')}
						</label>
						<div className="preset-grid" style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(2, 1fr)',
							gap: '8px',
							marginTop: '8px'
						}}>
							{layoutPresets.map((preset) => (
								<button
									key={preset.key}
									className={`preset-button ${layout === preset.key ? 'active' : ''}`}
									onClick={() => setAttributes({ layout: preset.key })}
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										padding: '12px 8px',
										border: layout === preset.key ? '2px solid #2563eb' : '2px solid #e5e7eb',
										borderRadius: '8px',
										background: layout === preset.key ? '#eff6ff' : '#ffffff',
										cursor: 'pointer',
										transition: 'all 0.2s ease',
										fontSize: '12px',
										fontWeight: '500',
										color: layout === preset.key ? '#2563eb' : '#374151',
										textAlign: 'center',
										minHeight: '80px',
										justifyContent: 'center'
									}}
								>
									<span style={{ fontSize: '20px', marginBottom: '4px' }}>{preset.icon}</span>
									<span style={{ fontWeight: '600', marginBottom: '2px' }}>{preset.name}</span>
									<span style={{ fontSize: '10px', opacity: 0.7, lineHeight: '1.2' }}>{preset.desc}</span>
								</button>
							))}
						</div>
					</div>

	

					<ToggleControl
						label={__('Show Toggle Switch', 'tailwind-starter')}
						checked={showToggle}
						onChange={(value) => setAttributes({ showToggle: value })}
					/>

					{showToggle && (
						<>
							<TextControl
								label={__('Toggle Label 1', 'tailwind-starter')}
								value={toggleLabel1}
								onChange={(value) => setAttributes({ toggleLabel1: value })}
							/>
							<TextControl
								label={__('Toggle Label 2', 'tailwind-starter')}
								value={toggleLabel2}
								onChange={(value) => setAttributes({ toggleLabel2: value })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('💰 Pricing Plans Manager', 'tailwind-starter')} initialOpen={false}>
					{plans.map((plan, index) => (
						<div key={plan.id} className="pricing-plan-config" style={{
							marginBottom: '16px',
							padding: '16px',
							border: plan.isPopular ? '2px solid #3b82f6' : '1px solid #e5e7eb',
							borderRadius: '12px',
							background: plan.isPopular ? '#eff6ff' : '#ffffff',
							boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
							position: 'relative'
						}}>
							{plan.isPopular && (
								<div style={{
									position: 'absolute',
									top: '-8px',
									left: '12px',
									background: '#3b82f6',
									color: 'white',
									padding: '2px 8px',
									borderRadius: '4px',
									fontSize: '10px',
									fontWeight: '600'
								}}>
									POPULAR
								</div>
							)}
							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '12px'
							}}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<span style={{ fontSize: '16px' }}>💼</span>
									<h4 style={{ 
										fontWeight: '600', 
										margin: 0,
										color: plan.isPopular ? '#1e40af' : '#374151'
									}}>
										{plan.name}
									</h4>
								</div>
								<Button
									onClick={() => setEditingPlan(editingPlan === index ? null : index)}
									variant={plan.isPopular ? "primary" : "secondary"}
									size="small"
									style={{
										borderRadius: '6px',
										fontSize: '11px',
										fontWeight: '500'
									}}
								>
									{editingPlan === index ? __('✕ Close', 'tailwind-starter') : __('✏️ Edit', 'tailwind-starter')}
								</Button>
							</div>

							{editingPlan === index && (
								<div style={{
									background: '#f8fafc',
									border: '1px solid #e2e8f0',
									borderRadius: '8px',
									padding: '16px',
									marginTop: '12px'
								}}>
									<div style={{
										display: 'grid',
										gridTemplateColumns: '1fr 1fr',
										gap: '12px',
										marginBottom: '16px'
									}}>
										<TextControl
											label={__('📝 Plan Name', 'tailwind-starter')}
											value={plan.name}
											onChange={(value) => updatePlan(index, 'name', value)}
											style={{ fontSize: '13px' }}
										/>
										<TextControl
											label={__('💬 Description', 'tailwind-starter')}
											value={plan.description}
											onChange={(value) => updatePlan(index, 'description', value)}
											style={{ fontSize: '13px' }}
										/>
									</div>
									
									<div style={{
										display: 'grid',
										gridTemplateColumns: '1fr 1fr',
										gap: '12px',
										marginBottom: '16px'
									}}>
										<TextControl
											label={__('💳 Monthly Price', 'tailwind-starter')}
											value={plan.monthlyPrice}
											onChange={(value) => updatePlan(index, 'monthlyPrice', value)}
											placeholder="19"
											style={{ fontSize: '13px' }}
										/>
										<TextControl
											label={__('🎟️ Annual Price', 'tailwind-starter')}
											value={plan.annualPrice}
											onChange={(value) => updatePlan(index, 'annualPrice', value)}
											placeholder="190"
											style={{ fontSize: '13px' }}
										/>
									</div>
									
									<div style={{
										display: 'grid',
										gridTemplateColumns: '1fr 1fr',
										gap: '12px',
										marginBottom: '16px'
									}}>
										<TextControl
											label={__('🔥 CTA Text', 'tailwind-starter')}
											value={plan.ctaText}
											onChange={(value) => updatePlan(index, 'ctaText', value)}
											placeholder="Get Started"
											style={{ fontSize: '13px' }}
										/>
										<TextControl
											label={__('🔗 CTA URL', 'tailwind-starter')}
											value={plan.ctaUrl}
											onChange={(value) => updatePlan(index, 'ctaUrl', value)}
											placeholder="#"
											style={{ fontSize: '13px' }}
										/>
									</div>
									
									<div style={{
										background: plan.isPopular ? '#dbeafe' : '#f1f5f9',
										border: plan.isPopular ? '1px solid #60a5fa' : '1px solid #cbd5e1',
										borderRadius: '6px',
										padding: '12px',
										marginBottom: '16px'
									}}>
										<ToggleControl
											label={__('⭐ Mark as Popular Plan', 'tailwind-starter')}
											checked={plan.isPopular}
											onChange={(value) => updatePlan(index, 'isPopular', value)}
											style={{ fontSize: '13px' }}
										/>
									</div>

									<div style={{
										borderTop: '1px solid #e2e8f0',
										paddingTop: '16px',
										marginTop: '16px'
									}}>
										<h5 style={{
											fontSize: '14px',
											fontWeight: '600',
											color: '#374151',
											marginBottom: '12px',
											display: 'flex',
											alignItems: 'center',
											gap: '6px'
										}}>
											<span>📋</span> {__('Plan Features', 'tailwind-starter')}
										</h5>
									{plan.features.map((feature, featureIndex) => (
										<div key={featureIndex} style={{
											display: 'flex',
											gap: '8px',
											marginBottom: '8px',
											alignItems: 'flex-end'
										}}>
											<div style={{ flex: 1 }}>
												<TextControl
													label={`Feature ${featureIndex + 1}`}
													value={feature}
													onChange={(value) => updatePlanFeature(index, featureIndex, value)}
													placeholder="Enter feature description..."
													style={{ fontSize: '12px' }}
												/>
											</div>
											<Button
												onClick={() => removeFeatureFromPlan(index, featureIndex)}
												variant="secondary"
												isDestructive
												size="small"
												style={{
													borderRadius: '4px',
													fontSize: '10px',
													padding: '6px 8px',
													minHeight: '32px'
												}}
											>
												🗑️
											</Button>
										</div>
									))}
									<Button
										onClick={() => addFeatureToPlan(index)}
										variant="primary"
										size="small"
										style={{
											borderRadius: '6px',
											fontSize: '12px',
											fontWeight: '500',
											marginTop: '8px',
											width: '100%'
										}}
									>
										➕ {__('Add New Feature', 'tailwind-starter')}
									</Button>
								</div>
								</div>
							)}
						</div>
					))}
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

				<UltimateControlTabs
					spacing={settings?.spacing || {}}
					onSpacingChange={(spacing) => setAttributes({
						settings: { ...(settings || {}), spacing }
					})}
					margins={settings?.margins || {}}
					onMarginsChange={(margins) => setAttributes({
						settings: { ...(settings || {}), margins }
					})}
					blockSpacing={settings?.blockSpacing || {}}
					onBlockSpacingChange={(blockSpacing) => setAttributes({
						settings: { ...(settings || {}), blockSpacing }
					})}
					background={settings?.backgroundColor}
					onBackgroundChange={(backgroundColor) => setAttributes({
						settings: { ...(settings || {}), backgroundColor }
					})}
					textColor={settings?.textColor}
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
				/>

				{/* Advanced Info */}
				<PanelBody title={__('🚀 Advanced', 'tailwind-starter')} initialOpen={false}>
					<div style={{
						background: '#f0f9ff',
						border: '1px solid #bae6fd',
						borderRadius: '6px',
						padding: '12px',
						fontSize: '12px'
					}}>
						<strong>💎 Generated Output:</strong>
						<br />
						<code style={{ wordBreak: 'break-all', fontSize: '10px' }}>
							{allClasses || 'No custom styles yet'}
						</code>
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
				<div 
					className={`pricing-table-container transition-all duration-300 ${previewClasses}`}
					style={{ 
						position: 'relative',
						border: '2px dashed #e5e7eb',
						borderRadius: '8px',
						padding: '1rem'
					}}
				>
					{/* Device indicator */}
					<div style={{
						position: 'absolute',
						top: '6px',
						right: '6px',
						background: 'rgba(59, 130, 246, 0.9)',
						color: 'white',
						padding: '2px 6px',
						borderRadius: '10px',
						fontSize: '9px',
						fontWeight: '600',
						pointerEvents: 'none',
						zIndex: 10
					}}>
						{activeDevice === 'base' ? '🖥️ ALL' : `📱 ${activeDevice.toUpperCase()}`}
					</div>

					{showToggle && (
						<div className="pricing-toggle flex justify-center mb-8">
						<div className="bg-gray-100 rounded-lg p-1 flex">
							<button
								className={`px-4 py-2 rounded-md transition-colors ${
									currentToggle === 'monthly' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
								}`}
								onClick={() => setAttributes({ currentToggle: 'monthly' })}
							>
								{toggleLabel1}
							</button>
							<button
								className={`px-4 py-2 rounded-md transition-colors ${
									currentToggle === 'annual' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
								}`}
								onClick={() => setAttributes({ currentToggle: 'annual' })}
							>
								{toggleLabel2}
							</button>
						</div>
					</div>
				)}

				<div className={`pricing-plans grid gap-8 ${
					layout === 'three-tier' || layout === 'simple' ? 'lg:grid-cols-3' : 
					layout === 'comparison' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
				}`}>
					{plans.map((plan, index) => (
						<div 
							key={plan.id} 
							className={`pricing-plan relative bg-white rounded-lg shadow-lg border-2 p-6 ${
								plan.isPopular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
							}`}
						>
							{plan.isPopular && (
								<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
									<span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
										{__('Most Popular', 'tailwind-starter')}
									</span>
								</div>
							)}

							<div className="plan-header text-center mb-6">
								<h3 className="text-xl font-bold mb-2">{plan.name}</h3>
								<p className="text-gray-600 text-sm mb-4">{plan.description}</p>
								
								<div className="price mb-4">
									<span className="text-4xl font-bold">
										{plan.currency}{getCurrentPrice(plan)}
									</span>
									<span className="text-gray-600">/{getCurrentPeriod()}</span>
								</div>
							</div>

							<div className="plan-features mb-6">
								<ul className="space-y-2">
									{plan.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-center text-sm">
											<svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
											{feature}
										</li>
									))}
								</ul>
							</div>

							<div className="plan-cta">
								<div
									className={`w-full py-3 rounded-lg font-semibold transition-colors text-center cursor-pointer ${
										plan.isPopular
											? 'bg-blue-600 hover:bg-blue-700 text-white'
											: 'bg-gray-100 hover:bg-gray-200 text-gray-900'
									}`}
								>
									{plan.ctaText}
								</div>
							</div>
						</div>
					))}
					</div>
				</div>
			</div>
		</>
	);
}