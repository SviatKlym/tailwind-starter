import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		layout,
		showToggle,
		toggleLabel1,
		toggleLabel2,
		currentToggle,
		plans,
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `pricing-table pricing-${layout}`
	});

	return (
		<div {...blockProps}>
			{showToggle && (
				<div className="pricing-toggle flex justify-center mb-8">
					<div className="bg-gray-100 rounded-lg p-1 flex" data-toggle-pricing>
						<button
							className={`px-4 py-2 rounded-md transition-colors ${
								currentToggle === 'monthly' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
							}`}
							data-period="monthly"
						>
							{toggleLabel1}
						</button>
						<button
							className={`px-4 py-2 rounded-md transition-colors ${
								currentToggle === 'annual' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
							}`}
							data-period="annual"
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
									Most Popular
								</span>
							</div>
						)}

						<div className="plan-header text-center mb-6">
							<h3 className="text-xl font-bold mb-2">{plan.name}</h3>
							<p className="text-gray-600 text-sm mb-4">{plan.description}</p>
							
							<div className="price mb-4">
								<span 
									className="text-4xl font-bold"
									data-monthly-price={`${plan.currency}${plan.monthlyPrice}`}
									data-annual-price={`${plan.currency}${plan.annualPrice}`}
								>
									{plan.currency}{showToggle && currentToggle === 'annual' ? plan.annualPrice : plan.monthlyPrice}
								</span>
								<span 
									className="text-gray-600"
									data-monthly-period="/month"
									data-annual-period="/year"
								>
									/{showToggle && currentToggle === 'annual' ? 'year' : 'month'}
								</span>
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
							<a
								className={`block w-full py-3 rounded-lg font-semibold transition-colors text-center no-underline ${
									plan.isPopular
										? 'bg-blue-600 hover:bg-blue-700 text-white'
										: 'bg-gray-100 hover:bg-gray-200 text-gray-900'
								}`}
								href={plan.ctaUrl}
							>
								{plan.ctaText}
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}