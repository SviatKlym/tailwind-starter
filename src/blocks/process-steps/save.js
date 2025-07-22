import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
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
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `process-steps process-${layout}`
	});

	const renderStep = (step, index) => {
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
								<div className={`step-number w-12 h-12 mx-auto mb-4 flex items-center justify-center font-bold text-white bg-blue-600 ${
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
		<div {...blockProps}>
			{showSectionHeader && (
				<div className="section-header text-center mb-8">
					<RichText.Content
						tagName="h2"
						value={sectionTitle}
						className="text-3xl font-bold mb-2"
					/>
					<RichText.Content
						tagName="p"
						value={sectionSubtitle}
						className="text-gray-600 text-lg"
					/>
				</div>
			)}

			<div className={`process-steps-container ${
				layout === 'horizontal-timeline' ? 'flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8' :
				layout === 'vertical-steps' ? 'space-y-8' :
				layout === 'icon-steps' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' :
				'space-y-6'
			} ${alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'}`}>
				{steps.map((step, index) => renderStep(step, index))}
			</div>
		</div>
	);
} 