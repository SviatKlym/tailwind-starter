import { useBlockProps, RichText } from '@wordpress/block-editor';
import { generateAllClasses } from '../../utils/visual-controls.js';

export default function save({ attributes }) {
	const {
		layout,
		members,
		columns,
		showBio,
		showSocialLinks,
		showContactInfo,
		showSkills,
		showLocation,
		showDepartment,
		filterByDepartment,
		cardStyle,
		imageStyle,
		hoverEffect,
		textAlignment,
		sectionTitle,
		sectionSubtitle,
		showSectionHeader,
		featuredFirst,
		showJoinDate,
		settings,
		activeDevice
	} = attributes;

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings);

	const blockProps = useBlockProps.save({
		className: `team-members team-${layout}`,
		'data-classes': allClasses,
		'data-attributes': JSON.stringify({
			layout,
			columns,
			showBio,
			showSocialLinks,
			showContactInfo,
			showSkills,
			showLocation,
			showDepartment,
			filterByDepartment,
			cardStyle,
			imageStyle,
			hoverEffect,
			textAlignment,
			featuredFirst,
			showJoinDate
		})
	});

	// Filter and sort members
	const filteredMembers = members
		.filter(member => member.name && member.name.trim())
		.sort((a, b) => {
			if (featuredFirst) {
				if (a.featured && !b.featured) return -1;
				if (!a.featured && b.featured) return 1;
			}
			return 0;
		});

	// Get unique departments for frontend filtering
	const departments = [...new Set(members.map(member => member.department))];

	const getGridColumns = () => {
		switch (columns) {
			case 2: return 'grid-cols-1 md:grid-cols-2';
			case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
			case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
			case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5';
			default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
		}
	};

	const renderMemberCard = (member, index) => {
		const cardClasses = `member-card ${cardStyle === 'elevated' ? 'bg-white shadow-lg' : 
			cardStyle === 'bordered' ? 'bg-white border border-gray-200' : 'bg-transparent'} 
			rounded-lg p-6 transition-all duration-300 member-hover-${hoverEffect}`;

		return (
			<div 
				key={member.id} 
				className={cardClasses}
				data-department={member.department}
				data-featured={member.featured ? 'true' : 'false'}
			>
				{member.featured && (
					<div className="featured-badge absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium z-10">
						Featured
					</div>
				)}

				<div className={`member-image mb-4 ${textAlignment === 'center' ? 'text-center' : 
					textAlignment === 'right' ? 'text-right' : 'text-left'}`}>
					{member.imageUrl ? (
						<img 
							src={member.imageUrl} 
							alt={member.imageAlt || `${member.name} - ${member.title}`}
							className={`${imageStyle === 'circle' ? 'rounded-full' : 
								imageStyle === 'rounded' ? 'rounded-lg' : ''} 
								w-24 h-24 object-cover ${textAlignment === 'center' ? 'mx-auto' : ''}`}
							loading="lazy"
						/>
					) : (
						<div className={`${imageStyle === 'circle' ? 'rounded-full' : 
							imageStyle === 'rounded' ? 'rounded-lg' : ''} 
							w-24 h-24 bg-gray-200 flex items-center justify-center ${textAlignment === 'center' ? 'mx-auto' : ''}`}>
							<span className="text-gray-400 text-2xl" aria-hidden="true">👤</span>
						</div>
					)}
				</div>

				<div className={`member-info ${textAlignment === 'center' ? 'text-center' : 
					textAlignment === 'right' ? 'text-right' : 'text-left'}`}>
					<h3 className="member-name text-xl font-semibold mb-1">{member.name}</h3>
					<p className="member-title text-blue-600 font-medium mb-2">{member.title}</p>

					{showDepartment && member.department && (
						<p className="member-department text-sm text-gray-500 mb-2">
							<span className="department-label" data-department={member.department}>
								{member.department}
							</span>
						</p>
					)}

					{showLocation && member.location && (
						<p className="member-location text-sm text-gray-500 mb-2">
							<span aria-hidden="true">📍</span> {member.location}
						</p>
					)}

					{showJoinDate && member.joinDate && (
						<p className="member-join-date text-sm text-gray-500 mb-2">
							Joined {new Date(member.joinDate).toLocaleDateString()}
						</p>
					)}

					{showBio && member.bio && (
						<p className="member-bio text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
					)}

					{showSkills && member.skills && member.skills.length > 0 && (
						<div className="member-skills mb-4">
							<div className="flex flex-wrap gap-2 justify-center">
								{member.skills.map((skill, skillIndex) => (
									<span 
										key={skillIndex}
										className="skill-tag bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					)}

					{showContactInfo && (
						<div className="member-contact mb-4 text-sm">
							{member.email && (
								<p className="text-gray-600 mb-1">
									<span aria-hidden="true">📧</span> 
									<a 
										href={`mailto:${member.email}`} 
										className="text-blue-600 hover:underline ml-1"
										aria-label={`Email ${member.name}`}
									>
										{member.email}
									</a>
								</p>
							)}
							{member.phone && (
								<p className="text-gray-600">
									<span aria-hidden="true">📞</span> 
									<a 
										href={`tel:${member.phone}`} 
										className="text-blue-600 hover:underline ml-1"
										aria-label={`Call ${member.name}`}
									>
										{member.phone}
									</a>
								</p>
							)}
						</div>
					)}

					{showSocialLinks && (
						<div className="member-social flex space-x-3 justify-center mt-4">
							{member.socialLinks.linkedin && (
								<a 
									href={member.socialLinks.linkedin} 
									className="social-link linkedin text-blue-600 hover:text-blue-800 transition-colors duration-200"
									aria-label={`${member.name} LinkedIn Profile`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="sr-only">LinkedIn</span>
									<span aria-hidden="true">💼</span>
								</a>
							)}
							{member.socialLinks.twitter && (
								<a 
									href={member.socialLinks.twitter} 
									className="social-link twitter text-blue-400 hover:text-blue-600 transition-colors duration-200"
									aria-label={`${member.name} Twitter Profile`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="sr-only">Twitter</span>
									<span aria-hidden="true">🐦</span>
								</a>
							)}
							{member.socialLinks.github && (
								<a 
									href={member.socialLinks.github} 
									className="social-link github text-gray-700 hover:text-gray-900 transition-colors duration-200"
									aria-label={`${member.name} GitHub Profile`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="sr-only">GitHub</span>
									<span aria-hidden="true">🔗</span>
								</a>
							)}
							{member.socialLinks.website && (
								<a 
									href={member.socialLinks.website} 
									className="social-link website text-green-600 hover:text-green-800 transition-colors duration-200"
									aria-label={`${member.name} Website`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="sr-only">Website</span>
									<span aria-hidden="true">🌐</span>
								</a>
							)}
						</div>
					)}
				</div>
			</div>
		);
	};

	if (filteredMembers.length === 0) {
		return (
			<div {...blockProps}>
				<div className="empty-state text-center py-8">
					<div className="text-gray-400 text-lg mb-2" aria-hidden="true">👥</div>
					<p className="text-gray-500">No team members to display.</p>
				</div>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			{showSectionHeader && (sectionTitle || sectionSubtitle) && (
				<div className="section-header text-center mb-8">
					{sectionTitle && (
						<RichText.Content
							tagName="h2"
							value={sectionTitle}
							className="text-3xl font-bold mb-2"
						/>
					)}
					{sectionSubtitle && (
						<RichText.Content
							tagName="p"
							value={sectionSubtitle}
							className="text-gray-600 text-lg"
						/>
					)}
				</div>
			)}

			{filterByDepartment && departments.length > 1 && (
				<div className="department-filters text-center mb-8">
					<div className="inline-flex space-x-2 bg-gray-100 p-1 rounded-lg">
						<button 
							className="filter-btn active px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm"
							data-department="all"
						>
							All
						</button>
						{departments.map(dept => (
							<button 
								key={dept}
								className="filter-btn px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
								data-department={dept}
							>
								{dept}
							</button>
						))}
					</div>
				</div>
			)}

			<div className={`team-container grid gap-6 ${getGridColumns()}`}>
				{filteredMembers.map((member, index) => renderMemberCard(member, index))}
			</div>

			{filterByDepartment && (
				<div className="empty-filter-state text-center py-8 hidden">
					<div className="text-gray-400 text-lg mb-2" aria-hidden="true">🔍</div>
					<p className="text-gray-500">No team members found in this department.</p>
				</div>
			)}
		</div>
	);
} 