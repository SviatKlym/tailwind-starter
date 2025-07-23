import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl,
	Button,
	RangeControl,
	TextareaControl,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { UltimateControlTabs, UltimateDeviceSelector, generateAllClasses, generateTailwindClasses } from '../../utils/visual-controls.js';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
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

	const [editingMember, setEditingMember] = useState(null);
	const [selectedDepartment, setSelectedDepartment] = useState('all');

	// Enhanced preset styles for team members
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
			typography: { base: { fontSize: 'text-xl', fontWeight: 'font-medium', textAlign: 'text-center' } },
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
		className: `team-members team-${layout} ${previewClasses}`,
		'data-classes': previewClasses,
		'data-all-classes': allClasses
	});

	const layoutPresets = [
		{ key: 'grid-cards', icon: '🏛️', name: 'Grid Cards', desc: 'Photo, name, title, bio' },
		{ key: 'list-format', icon: '📋', name: 'List Format', desc: 'Horizontal photo + text' },
		{ key: 'minimal-display', icon: '👤', name: 'Minimal Display', desc: 'Photo and name only' },
		{ key: 'social-links', icon: '🔗', name: 'Social Links', desc: 'Integrated social icons' }
	];

	const updateMember = (memberIndex, field, value) => {
		const updatedMembers = [...members];
		if (field.includes('.')) {
			const [parent, child] = field.split('.');
			updatedMembers[memberIndex] = {
				...updatedMembers[memberIndex],
				[parent]: {
					...updatedMembers[memberIndex][parent],
					[child]: value
				}
			};
		} else {
			updatedMembers[memberIndex] = {
				...updatedMembers[memberIndex],
				[field]: value
			};
		}
		setAttributes({ members: updatedMembers });
	};

	const addMember = () => {
		const newMember = {
			id: `member-${Date.now()}`,
			name: 'New Team Member',
			title: 'Position Title',
			department: 'Department',
			bio: 'Brief bio about this team member...',
			imageUrl: '',
			imageAlt: '',
			email: 'email@company.com',
			phone: '+1 (555) 123-4567',
			socialLinks: {
				linkedin: '',
				twitter: '',
				github: '',
				website: ''
			},
			featured: false,
			skills: [],
			location: 'City, State',
			joinDate: new Date().toISOString().split('T')[0]
		};
		setAttributes({ members: [...members, newMember] });
	};

	const removeMember = (memberIndex) => {
		const updatedMembers = members.filter((_, index) => index !== memberIndex);
		setAttributes({ members: updatedMembers });
	};

	// Get unique departments for filtering
	const departments = [...new Set(members.map(member => member.department))];

	// Filter and sort members
	const filteredMembers = members
		.filter(member => !filterByDepartment || selectedDepartment === 'all' || member.department === selectedDepartment)
		.sort((a, b) => {
			if (featuredFirst) {
				if (a.featured && !b.featured) return -1;
				if (!a.featured && b.featured) return 1;
			}
			return 0;
		});

	const renderMemberCard = (member, index) => {
		const cardClasses = `member-card ${cardStyle === 'elevated' ? 'bg-white shadow-lg' : 
			cardStyle === 'bordered' ? 'bg-white border border-gray-200' : 'bg-transparent'} 
			rounded-lg p-6 transition-all duration-300 ${hoverEffect === 'lift' ? 'hover:-translate-y-2 hover:shadow-xl' : 
			hoverEffect === 'scale' ? 'hover:scale-105' : 'hover:shadow-md'}`;

		return (
			<div key={member.id} className={cardClasses}>
				{member.featured && (
					<div className="featured-badge absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
						Featured
					</div>
				)}

				<div className={`member-image mb-4 ${textAlignment}`}>
					{member.imageUrl ? (
						<img 
							src={member.imageUrl} 
							alt={member.imageAlt}
							className={`${imageStyle === 'circle' ? 'rounded-full' : 
								imageStyle === 'rounded' ? 'rounded-lg' : ''} 
								w-24 h-24 object-cover ${textAlignment === 'center' ? 'mx-auto' : ''}`}
						/>
					) : (
						<div className={`${imageStyle === 'circle' ? 'rounded-full' : 
							imageStyle === 'rounded' ? 'rounded-lg' : ''} 
							w-24 h-24 bg-gray-200 flex items-center justify-center ${textAlignment === 'center' ? 'mx-auto' : ''}`}>
							<span className="text-gray-400 text-2xl">👤</span>
						</div>
					)}
				</div>

				<div className={`member-info text-${textAlignment}`}>
					<h3 className="member-name text-xl font-semibold mb-1">{member.name}</h3>
					<p className="member-title text-blue-600 font-medium mb-2">{member.title}</p>

					{showDepartment && (
						<p className="member-department text-sm text-gray-500 mb-2">{member.department}</p>
					)}

					{showLocation && (
						<p className="member-location text-sm text-gray-500 mb-2">📍 {member.location}</p>
					)}

					{showJoinDate && (
						<p className="member-join-date text-sm text-gray-500 mb-2">
							Joined {new Date(member.joinDate).toLocaleDateString()}
						</p>
					)}

					{showBio && (
						<p className="member-bio text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
					)}

					{showSkills && member.skills && member.skills.length > 0 && (
						<div className="member-skills mb-4">
							<div className="flex flex-wrap gap-2">
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
						<div className="member-contact mb-4">
							{member.email && (
								<p className="text-sm text-gray-600 mb-1">
									📧 <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a>
								</p>
							)}
							{member.phone && (
								<p className="text-sm text-gray-600">
									📞 <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">{member.phone}</a>
								</p>
							)}
						</div>
					)}

					{showSocialLinks && (
						<div className="member-social flex space-x-3 justify-center">
							{member.socialLinks.linkedin && (
								<a href={member.socialLinks.linkedin} className="text-blue-600 hover:text-blue-800">
									<span className="sr-only">LinkedIn</span>
									💼
								</a>
							)}
							{member.socialLinks.twitter && (
								<a href={member.socialLinks.twitter} className="text-blue-400 hover:text-blue-600">
									<span className="sr-only">Twitter</span>
									🐦
								</a>
							)}
							{member.socialLinks.github && (
								<a href={member.socialLinks.github} className="text-gray-700 hover:text-gray-900">
									<span className="sr-only">GitHub</span>
									🔗
								</a>
							)}
							{member.socialLinks.website && (
								<a href={member.socialLinks.website} className="text-green-600 hover:text-green-800">
									<span className="sr-only">Website</span>
									🌐
								</a>
							)}
						</div>
					)}
				</div>
			</div>
		);
	};

	const getGridColumns = () => {
		switch (columns) {
			case 2: return 'grid-cols-1 md:grid-cols-2';
			case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
			case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
			case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5';
			default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
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
					/>

					<ToggleControl
						label={__('Show Bio', 'tailwind-starter')}
						checked={showBio}
						onChange={(value) => setAttributes({ showBio: value })}
					/>

					<ToggleControl
						label={__('Show Social Links', 'tailwind-starter')}
						checked={showSocialLinks}
						onChange={(value) => setAttributes({ showSocialLinks: value })}
					/>

					<ToggleControl
						label={__('Show Contact Info', 'tailwind-starter')}
						checked={showContactInfo}
						onChange={(value) => setAttributes({ showContactInfo: value })}
					/>

					<ToggleControl
						label={__('Show Skills', 'tailwind-starter')}
						checked={showSkills}
						onChange={(value) => setAttributes({ showSkills: value })}
					/>

					<ToggleControl
						label={__('Show Location', 'tailwind-starter')}
						checked={showLocation}
						onChange={(value) => setAttributes({ showLocation: value })}
					/>

					<ToggleControl
						label={__('Show Department', 'tailwind-starter')}
						checked={showDepartment}
						onChange={(value) => setAttributes({ showDepartment: value })}
					/>

					<ToggleControl
						label={__('Show Join Date', 'tailwind-starter')}
						checked={showJoinDate}
						onChange={(value) => setAttributes({ showJoinDate: value })}
					/>

					<ToggleControl
						label={__('Featured Members First', 'tailwind-starter')}
						checked={featuredFirst}
						onChange={(value) => setAttributes({ featuredFirst: value })}
					/>

					<SelectControl
						label={__('Card Style', 'tailwind-starter')}
						value={cardStyle}
						onChange={(value) => setAttributes({ cardStyle: value })}
						options={[
							{ label: 'Elevated (Shadow)', value: 'elevated' },
							{ label: 'Bordered', value: 'bordered' },
							{ label: 'Flat', value: 'flat' }
						]}
					/>

					<SelectControl
						label={__('Image Style', 'tailwind-starter')}
						value={imageStyle}
						onChange={(value) => setAttributes({ imageStyle: value })}
						options={[
							{ label: 'Circle', value: 'circle' },
							{ label: 'Rounded', value: 'rounded' },
							{ label: 'Square', value: 'square' }
						]}
					/>

					<SelectControl
						label={__('Hover Effect', 'tailwind-starter')}
						value={hoverEffect}
						onChange={(value) => setAttributes({ hoverEffect: value })}
						options={[
							{ label: 'Lift', value: 'lift' },
							{ label: 'Scale', value: 'scale' },
							{ label: 'Shadow', value: 'shadow' }
						]}
					/>

					<SelectControl
						label={__('Text Alignment', 'tailwind-starter')}
						value={textAlignment}
						onChange={(value) => setAttributes({ textAlignment: value })}
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
					/>
				</PanelBody>

				{filterByDepartment && (
					<PanelBody title={__('🏢 Department Filter', 'tailwind-starter')} initialOpen={false}>
						<SelectControl
							label={__('Filter by Department', 'tailwind-starter')}
							value={selectedDepartment}
							onChange={(value) => setSelectedDepartment(value)}
							options={[
								{ label: 'All Departments', value: 'all' },
								...departments.map(dept => ({ label: dept, value: dept }))
							]}
						/>
					</PanelBody>
				)}

				<PanelBody title={__('👥 Team Management', 'tailwind-starter')} initialOpen={false}>
					{members.map((member, index) => (
						<div key={member.id} className="mb-6 p-4 border rounded">
							<div className="flex justify-between items-center mb-2">
								<strong>{member.name}</strong>
								<div className="flex space-x-2">
									<Button
										isSecondary
										isSmall
										onClick={() => updateMember(index, 'featured', !member.featured)}
									>
										{member.featured ? 'Unfeature' : 'Feature'}
									</Button>
									<Button
										isDestructive
										isSmall
										onClick={() => removeMember(index)}
									>
										Remove
									</Button>
								</div>
							</div>

							<TextControl
								label="Name"
								value={member.name}
								onChange={(value) => updateMember(index, 'name', value)}
							/>

							<TextControl
								label="Title"
								value={member.title}
								onChange={(value) => updateMember(index, 'title', value)}
							/>

							<TextControl
								label="Department"
								value={member.department}
								onChange={(value) => updateMember(index, 'department', value)}
							/>

							<TextareaControl
								label="Bio"
								value={member.bio}
								onChange={(value) => updateMember(index, 'bio', value)}
								rows={3}
							/>

							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										updateMember(index, 'imageUrl', media.url);
										updateMember(index, 'imageAlt', media.alt);
									}}
									allowedTypes={['image']}
									value={member.imageUrl}
									render={({ open }) => (
										<div className="mt-2">
											<Button onClick={open} isSecondary>
												{member.imageUrl ? 'Change Photo' : 'Select Photo'}
											</Button>
											{member.imageUrl && (
												<div className="mt-2">
													<img 
														src={member.imageUrl} 
														alt={member.imageAlt}
														className="w-20 h-20 object-cover rounded"
													/>
													<Button
														onClick={() => {
															updateMember(index, 'imageUrl', '');
															updateMember(index, 'imageAlt', '');
														}}
														isDestructive
														isSmall
														className="ml-2"
													>
														Remove
													</Button>
												</div>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>

							<div className="flex space-x-2">
								<TextControl
									label="Email"
									value={member.email}
									onChange={(value) => updateMember(index, 'email', value)}
									type="email"
								/>
								<TextControl
									label="Phone"
									value={member.phone}
									onChange={(value) => updateMember(index, 'phone', value)}
									type="tel"
								/>
							</div>

							<TextControl
								label="Location"
								value={member.location}
								onChange={(value) => updateMember(index, 'location', value)}
							/>

							<div className="mt-2">
								<label className="block text-sm font-medium mb-1">Social Links</label>
								<TextControl
									label="LinkedIn"
									value={member.socialLinks.linkedin}
									onChange={(value) => updateMember(index, 'socialLinks.linkedin', value)}
									placeholder="https://linkedin.com/in/username"
								/>
								<TextControl
									label="Twitter"
									value={member.socialLinks.twitter}
									onChange={(value) => updateMember(index, 'socialLinks.twitter', value)}
									placeholder="https://twitter.com/username"
								/>
								<TextControl
									label="GitHub"
									value={member.socialLinks.github}
									onChange={(value) => updateMember(index, 'socialLinks.github', value)}
									placeholder="https://github.com/username"
								/>
								<TextControl
									label="Website"
									value={member.socialLinks.website}
									onChange={(value) => updateMember(index, 'socialLinks.website', value)}
									placeholder="https://website.com"
								/>
							</div>

							<TextControl
								label="Skills (comma-separated)"
								value={member.skills.join(', ')}
								onChange={(value) => updateMember(index, 'skills', value.split(',').map(s => s.trim()).filter(s => s))}
								placeholder="JavaScript, React, Node.js"
							/>
						</div>
					))}

					<Button
						isPrimary
						onClick={addMember}
					>
						Add Team Member
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

				<div className={`team-container grid gap-6 ${getGridColumns()}`}>
					{filteredMembers.map((member, index) => renderMemberCard(member, index))}
				</div>

				{filteredMembers.length === 0 && (
					<div className="empty-state text-center py-8">
						<div className="text-gray-400 text-lg mb-2">👥</div>
						<p className="text-gray-500">No team members found for the selected criteria.</p>
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