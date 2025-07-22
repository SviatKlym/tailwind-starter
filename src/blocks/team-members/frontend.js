/**
 * Team Members Block Frontend JavaScript
 * Handles department filtering, animations, and interactive features
 */

class TeamMembersBlock {
	constructor() {
		this.blocks = [];
		this.init();
	}

	init() {
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.initializeBlocks());
		} else {
			this.initializeBlocks();
		}
	}

	initializeBlocks() {
		const teamBlocks = document.querySelectorAll('.wp-block-tailwind-starter-team-members');
		
		teamBlocks.forEach((block, index) => {
			this.initializeBlock(block, index);
		});

		// Global resize handler for responsive adjustments
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				this.handleResize();
			}, 250);
		});
	}

	initializeBlock(block, index) {
		const blockData = {
			element: block,
			id: `team-members-${index}`,
			attributes: this.parseAttributes(block),
			filterState: 'all',
			members: Array.from(block.querySelectorAll('.member-card')),
			filters: block.querySelector('.department-filters'),
			emptyState: block.querySelector('.empty-filter-state')
		};

		this.blocks.push(blockData);

		// Initialize features
		this.initializeFiltering(blockData);
		this.initializeAnimations(blockData);
		this.initializeAccessibility(blockData);

		// Add intersection observer for scroll animations
		this.observeBlock(blockData);
	}

	parseAttributes(block) {
		try {
			const dataAttributes = block.getAttribute('data-attributes');
			return dataAttributes ? JSON.parse(dataAttributes) : {};
		} catch (error) {
			console.warn('Failed to parse team members block attributes:', error);
			return {};
		}
	}

	initializeFiltering(blockData) {
		if (!blockData.filters || !blockData.attributes.filterByDepartment) {
			return;
		}

		const filterButtons = blockData.filters.querySelectorAll('.filter-btn');
		
		filterButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				const department = button.getAttribute('data-department');
				this.filterMembers(blockData, department);
				this.updateFilterButtons(blockData, button);
			});

			// Keyboard navigation
			button.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					button.click();
				}
			});
		});
	}

	filterMembers(blockData, department) {
		blockData.filterState = department;
		let visibleCount = 0;

		blockData.members.forEach((member, index) => {
			const memberDepartment = member.getAttribute('data-department');
			const shouldShow = department === 'all' || memberDepartment === department;

			if (shouldShow) {
				this.showMember(member, index);
				visibleCount++;
			} else {
				this.hideMember(member);
			}
		});

		// Handle empty state
		this.toggleEmptyState(blockData, visibleCount === 0);

		// Announce filter change to screen readers
		this.announceFilterChange(blockData, department, visibleCount);
	}

	showMember(member, index) {
		member.style.display = '';
		member.classList.remove('hidden');
		
		// Staggered animation
		setTimeout(() => {
			member.classList.add('animate-in');
		}, index * 50);
	}

	hideMember(member) {
		member.classList.remove('animate-in');
		member.classList.add('hidden');
		
		setTimeout(() => {
			if (member.classList.contains('hidden')) {
				member.style.display = 'none';
			}
		}, 300);
	}

	updateFilterButtons(blockData, activeButton) {
		const filterButtons = blockData.filters.querySelectorAll('.filter-btn');
		
		filterButtons.forEach(button => {
			button.classList.remove('active');
			button.setAttribute('aria-pressed', 'false');
		});
		
		activeButton.classList.add('active');
		activeButton.setAttribute('aria-pressed', 'true');
	}

	toggleEmptyState(blockData, show) {
		if (!blockData.emptyState) return;

		if (show) {
			blockData.emptyState.classList.remove('hidden');
			blockData.emptyState.setAttribute('aria-hidden', 'false');
		} else {
			blockData.emptyState.classList.add('hidden');
			blockData.emptyState.setAttribute('aria-hidden', 'true');
		}
	}

	announceFilterChange(blockData, department, visibleCount) {
		// Create or update screen reader announcement
		let announcement = blockData.element.querySelector('.sr-announcement');
		if (!announcement) {
			announcement = document.createElement('div');
			announcement.className = 'sr-only sr-announcement';
			announcement.setAttribute('aria-live', 'polite');
			blockData.element.appendChild(announcement);
		}

		const departmentText = department === 'all' ? 'all departments' : `${department} department`;
		const countText = visibleCount === 1 ? '1 team member' : `${visibleCount} team members`;
		announcement.textContent = `Filtered to show ${countText} from ${departmentText}`;
	}

	initializeAnimations(blockData) {
		// Add hover enhancements for better user feedback
		blockData.members.forEach(member => {
			const hoverEffect = blockData.attributes.hoverEffect || 'lift';
			
			member.addEventListener('mouseenter', () => {
				this.enhanceHover(member, hoverEffect);
			});

			member.addEventListener('mouseleave', () => {
				this.resetHover(member);
			});
		});
	}

	enhanceHover(member, effect) {
		const socialLinks = member.querySelectorAll('.social-link');
		const skillTags = member.querySelectorAll('.skill-tag');

		// Enhance social links visibility
		socialLinks.forEach((link, index) => {
			setTimeout(() => {
				link.style.transform = 'translateY(-2px) scale(1.1)';
				link.style.opacity = '1';
			}, index * 50);
		});

		// Animate skill tags
		skillTags.forEach((tag, index) => {
			setTimeout(() => {
				tag.style.transform = 'translateY(-1px)';
			}, index * 25);
		});
	}

	resetHover(member) {
		const socialLinks = member.querySelectorAll('.social-link');
		const skillTags = member.querySelectorAll('.skill-tag');

		socialLinks.forEach(link => {
			link.style.transform = '';
			link.style.opacity = '';
		});

		skillTags.forEach(tag => {
			tag.style.transform = '';
		});
	}

	initializeAccessibility(blockData) {
		// Add ARIA labels for filter buttons
		const filterButtons = blockData.filters?.querySelectorAll('.filter-btn');
		filterButtons?.forEach(button => {
			const department = button.getAttribute('data-department');
			const label = department === 'all' ? 
				'Show all team members' : 
				`Filter by ${department} department`;
			button.setAttribute('aria-label', label);
			button.setAttribute('role', 'button');
			button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
		});

		// Add role and labels for member cards
		blockData.members.forEach(member => {
			member.setAttribute('role', 'article');
			const memberName = member.querySelector('.member-name')?.textContent;
			if (memberName) {
				member.setAttribute('aria-label', `Team member: ${memberName}`);
			}
		});

		// Improve social link accessibility
		const socialLinks = blockData.element.querySelectorAll('.social-link');
		socialLinks.forEach(link => {
			if (!link.getAttribute('aria-label')) {
				const href = link.getAttribute('href');
				const memberName = link.closest('.member-card')?.querySelector('.member-name')?.textContent;
				
				if (href && memberName) {
					let platform = 'Website';
					if (href.includes('linkedin')) platform = 'LinkedIn';
					else if (href.includes('twitter')) platform = 'Twitter';
					else if (href.includes('github')) platform = 'GitHub';
					
					link.setAttribute('aria-label', `${memberName}'s ${platform} profile`);
				}
			}
		});
	}

	observeBlock(blockData) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.animateBlockEntry(blockData);
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.1,
			rootMargin: '50px 0px'
		});

		observer.observe(blockData.element);
	}

	animateBlockEntry(blockData) {
		// Staggered animation for visible members
		const visibleMembers = blockData.members.filter(member => 
			!member.classList.contains('hidden') && 
			member.style.display !== 'none'
		);

		visibleMembers.forEach((member, index) => {
			setTimeout(() => {
				member.classList.add('animate-in');
			}, index * 100);
		});
	}

	handleResize() {
		// Re-adjust layouts and animations on resize
		this.blocks.forEach(blockData => {
			// Reset any inline styles that might interfere with responsive behavior
			blockData.members.forEach(member => {
				const computedStyle = window.getComputedStyle(member);
				if (computedStyle.display === 'none' && !member.classList.contains('hidden')) {
					member.style.display = '';
				}
			});
		});
	}

	// Public API for external control
	filterBlockByDepartment(blockIndex, department) {
		const blockData = this.blocks[blockIndex];
		if (blockData && blockData.attributes.filterByDepartment) {
			this.filterMembers(blockData, department);
			
			// Update active filter button
			const targetButton = blockData.filters?.querySelector(`[data-department="${department}"]`);
			if (targetButton) {
				this.updateFilterButtons(blockData, targetButton);
			}
		}
	}

	getAllDepartments(blockIndex) {
		const blockData = this.blocks[blockIndex];
		if (!blockData) return [];

		const departments = new Set();
		blockData.members.forEach(member => {
			const dept = member.getAttribute('data-department');
			if (dept) departments.add(dept);
		});

		return Array.from(departments);
	}

	getVisibleMembersCount(blockIndex) {
		const blockData = this.blocks[blockIndex];
		if (!blockData) return 0;

		return blockData.members.filter(member => 
			!member.classList.contains('hidden') && 
			member.style.display !== 'none'
		).length;
	}
}

// Initialize when DOM is ready
const teamMembersBlocks = new TeamMembersBlock();

// Expose global API
window.TeamMembersBlock = teamMembersBlocks;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
	module.exports = TeamMembersBlock;
} 