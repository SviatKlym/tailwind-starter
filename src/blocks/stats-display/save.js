import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
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
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `stats-display stats-${layout}`,
		'data-enable-animations': enableAnimations,
		'data-animation-trigger': animationTrigger
	});

	const renderStat = (stat, index) => {
		const isHighlighted = layout === 'highlighted-single' && stat.id === highlightedStat;

		switch (layout) {
			case 'counter-animation':
				return (
					<div 
						key={stat.id} 
						className="stat-item text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
						data-stat-id={stat.id}
						data-target-number={stat.number}
						data-prefix={stat.prefix}
						data-suffix={stat.suffix}
						data-animation-duration={stat.animationDuration || 2000}
					>
						{showIcons && (
							<div className="stat-icon text-4xl mb-4">{stat.icon}</div>
						)}
						<div 
							className={`stat-number font-bold mb-2 ${
								numberSize === 'small' ? 'text-2xl' :
								numberSize === 'medium' ? 'text-3xl' :
								numberSize === 'large' ? 'text-4xl' : 'text-5xl'
							}`} 
							style={{ color: stat.color }}
							data-counter="true"
						>
							{stat.prefix}<span className="counter-value">0</span>{stat.suffix}
						</div>
						<h4 className="stat-label font-semibold text-lg mb-1">{stat.label}</h4>
						{showDescriptions && (
							<p className="stat-description text-gray-600 text-sm">{stat.description}</p>
						)}
					</div>
				);

			case 'icon-stats':
				return (
					<div 
						key={stat.id} 
						className="stat-item flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
						data-stat-id={stat.id}
						data-target-number={stat.number}
						data-prefix={stat.prefix}
						data-suffix={stat.suffix}
						data-animation-duration={stat.animationDuration || 2000}
					>
						<div className="stat-icon text-3xl" style={{ color: stat.color }}>
							{stat.icon}
						</div>
						<div className="flex-1">
							<div 
								className={`stat-number font-bold ${
									numberSize === 'small' ? 'text-xl' :
									numberSize === 'medium' ? 'text-2xl' :
									numberSize === 'large' ? 'text-3xl' : 'text-4xl'
								}`} 
								style={{ color: stat.color }}
								data-counter="true"
							>
								{stat.prefix}<span className="counter-value">0</span>{stat.suffix}
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
					<div 
						key={stat.id} 
						className="stat-item text-center p-4 hover:transform hover:scale-105 transition-all duration-300"
						data-stat-id={stat.id}
						data-target-number={stat.number}
						data-prefix={stat.prefix}
						data-suffix={stat.suffix}
						data-animation-duration={stat.animationDuration || 2000}
					>
						<div 
							className={`stat-number font-bold mb-1 ${
								numberSize === 'small' ? 'text-2xl' :
								numberSize === 'medium' ? 'text-3xl' :
								numberSize === 'large' ? 'text-4xl' : 'text-5xl'
							}`} 
							style={{ color: stat.color }}
							data-counter="true"
						>
							{stat.prefix}<span className="counter-value">0</span>{stat.suffix}
						</div>
						<h4 className="stat-label font-medium text-gray-700">{stat.label}</h4>
					</div>
				);

			case 'highlighted-single':
				if (isHighlighted) {
					return (
						<div 
							key={stat.id} 
							className="stat-item-highlighted col-span-full text-center p-12 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
							data-stat-id={stat.id}
							data-target-number={stat.number}
							data-prefix={stat.prefix}
							data-suffix={stat.suffix}
							data-animation-duration={stat.animationDuration || 2000}
						>
							{showIcons && (
								<div className="stat-icon text-6xl mb-6">{stat.icon}</div>
							)}
							<div 
								className="stat-number font-bold text-6xl mb-4" 
								style={{ color: stat.color }}
								data-counter="true"
							>
								{stat.prefix}<span className="counter-value">0</span>{stat.suffix}
							</div>
							<h4 className="stat-label font-semibold text-2xl mb-2">{stat.label}</h4>
							{showDescriptions && (
								<p className="stat-description text-gray-600 text-lg max-w-md mx-auto">{stat.description}</p>
							)}
						</div>
					);
				} else {
					return (
						<div 
							key={stat.id} 
							className="stat-item text-center p-4 opacity-75 hover:opacity-100 transition-opacity duration-300"
							data-stat-id={stat.id}
							data-target-number={stat.number}
							data-prefix={stat.prefix}
							data-suffix={stat.suffix}
							data-animation-duration={stat.animationDuration || 1500}
						>
							<div 
								className="stat-number font-bold text-2xl mb-1" 
								style={{ color: stat.color }}
								data-counter="true"
							>
								{stat.prefix}<span className="counter-value">0</span>{stat.suffix}
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

			<div className={`stats-container grid gap-6 ${getGridColumns()} ${
				alignment === 'left' ? 'text-left' : 
				alignment === 'right' ? 'text-right' : 'text-center'
			}`}>
				{stats.map((stat, index) => renderStat(stat, index))}
			</div>
		</div>
	);
} 