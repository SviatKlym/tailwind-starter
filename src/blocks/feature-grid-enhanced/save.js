import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		layout,
		features,
		columns,
		showIcons,
		iconPosition,
		visualSettings
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `feature-grid-enhanced feature-${layout} icon-${iconPosition}`
	});

	const getIconSvg = (iconType, color = '#3b82f6') => {
		const icons = {
			speed: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M20.38 8.57l-1.23 1.85a8 8 0 01-.9 13.11L12 16.97v-7.5l6.76-3.9c.68-.39 1.54.1 1.62.9zM3.12 8.57C2.8 7.85 3.27 7 4.06 7h15.88c.79 0 1.26.85.94 1.57l-1.23 1.85a8 8 0 01-13.3 0L3.12 8.57z"/></svg>,
			shield: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/></svg>,
			support: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
			integration: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
			scale: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
			analytics: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>,
			settings: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>,
			users: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4H4zM10 18v-4h3v4h-3zM16 18v-4h3v4h-3z"/></svg>,
			globe: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
			heart: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
			star: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
			check: <svg width="24" height="24" fill={color} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
		};
		return icons[iconType] || icons.check;
	};

	return (
		<div {...blockProps}>
			<div className={`feature-grid grid gap-6 ${
				layout === 'three-column' ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}` :
				layout === 'card' ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}` :
				layout === 'icon-left' ? 'grid-cols-1 md:grid-cols-2' :
				'grid-cols-1'
			}`}>
				{features.map((feature, index) => (
					<div 
						key={feature.id} 
						className={`feature-item ${
							layout === 'card' ? 'bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow' :
							layout === 'icon-left' ? 'flex items-start gap-4' :
							layout === 'minimal' ? 'border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0' :
							'text-center'
						}`}
					>
						{showIcons && (
							<div className={`feature-icon ${
								iconPosition === 'top' ? 'mb-4 flex justify-center' :
								iconPosition === 'left' ? 'mr-4 flex-shrink-0' :
								'ml-4 flex-shrink-0 order-last'
							}`}>
								<div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
									{getIconSvg(feature.icon, feature.iconColor)}
								</div>
							</div>
						)}
						
						<div className="feature-content">
							<RichText.Content
								tagName="h3"
								className="feature-title text-lg font-semibold mb-2"
								value={feature.title}
							/>
							
							<RichText.Content
								tagName="p"
								className="feature-description text-gray-600"
								value={feature.description}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}