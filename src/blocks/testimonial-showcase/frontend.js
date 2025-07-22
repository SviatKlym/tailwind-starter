/**
 * Testimonial Showcase Block Frontend JavaScript
 * Handles carousel, category filtering, video testimonials, and animations
 */

class TestimonialShowcaseBlock {
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
		const testimonialBlocks = document.querySelectorAll('.wp-block-tailwind-starter-testimonial-showcase');
		
		testimonialBlocks.forEach((block, index) => {
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
			id: `testimonial-showcase-${index}`,
			attributes: this.parseAttributes(block),
			filterState: 'all',
			currentSlide: 0,
			testimonials: Array.from(block.querySelectorAll('.testimonial-card')),
			filters: block.querySelector('.category-filters'),
			carousel: block.querySelector('.testimonials-carousel'),
			emptyState: block.querySelector('.empty-filter-state'),
			autoRotateTimer: null
		};

		this.blocks.push(blockData);

		// Initialize features
		this.initializeFiltering(blockData);
		this.initializeCarousel(blockData);
		this.initializeVideoTestimonials(blockData);
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
			console.warn('Failed to parse testimonial showcase block attributes:', error);
			return {};
		}
	}

	initializeFiltering(blockData) {
		if (!blockData.filters || !blockData.attributes.categoryFiltering) {
			return;
		}

		const filterButtons = blockData.filters.querySelectorAll('.filter-btn');
		
		filterButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				const category = button.getAttribute('data-category');
				this.filterTestimonials(blockData, category);
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

	filterTestimonials(blockData, category) {
		blockData.filterState = category;
		let visibleCount = 0;

		blockData.testimonials.forEach((testimonial, index) => {
			const testimonialCategory = testimonial.getAttribute('data-category');
			const shouldShow = category === 'all' || testimonialCategory === category;

			if (shouldShow) {
				this.showTestimonial(testimonial, index);
				visibleCount++;
			} else {
				this.hideTestimonial(testimonial);
			}
		});

		// Handle empty state
		this.toggleEmptyState(blockData, visibleCount === 0);

		// Reset carousel if in carousel mode
		if (blockData.carousel && blockData.attributes.layout === 'quotes-carousel') {
			blockData.currentSlide = 0;
			this.updateCarousel(blockData);
		}

		// Announce filter change to screen readers
		this.announceFilterChange(blockData, category, visibleCount);
	}

	showTestimonial(testimonial, index) {
		testimonial.style.display = '';
		testimonial.classList.remove('hidden');
		
		// Staggered animation
		setTimeout(() => {
			testimonial.classList.add('animate-in');
		}, index * 100);
	}

	hideTestimonial(testimonial) {
		testimonial.classList.remove('animate-in');
		testimonial.classList.add('hidden');
		
		setTimeout(() => {
			if (testimonial.classList.contains('hidden')) {
				testimonial.style.display = 'none';
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

	announceFilterChange(blockData, category, visibleCount) {
		// Create or update screen reader announcement
		let announcement = blockData.element.querySelector('.sr-announcement');
		if (!announcement) {
			announcement = document.createElement('div');
			announcement.className = 'sr-only sr-announcement';
			announcement.setAttribute('aria-live', 'polite');
			blockData.element.appendChild(announcement);
		}

		const categoryText = category === 'all' ? 'all categories' : `${category} category`;
		const countText = visibleCount === 1 ? '1 testimonial' : `${visibleCount} testimonials`;
		announcement.textContent = `Filtered to show ${countText} from ${categoryText}`;
	}

	initializeCarousel(blockData) {
		if (!blockData.carousel || blockData.attributes.layout !== 'quotes-carousel') {
			return;
		}

		const track = blockData.carousel.querySelector('.carousel-track');
		const prevButton = blockData.carousel.querySelector('.carousel-prev');
		const nextButton = blockData.carousel.querySelector('.carousel-next');
		const indicators = blockData.carousel.querySelectorAll('.indicator');
		
		if (!track) return;

		const slides = track.querySelectorAll('.carousel-slide');
		const totalSlides = slides.length;

		if (totalSlides <= 1) return;

		// Previous button
		prevButton?.addEventListener('click', () => {
			this.previousSlide(blockData);
		});

		// Next button
		nextButton?.addEventListener('click', () => {
			this.nextSlide(blockData);
		});

		// Indicator buttons
		indicators.forEach((indicator, index) => {
			indicator.addEventListener('click', () => {
				this.goToSlide(blockData, index);
			});
		});

		// Keyboard navigation
		blockData.carousel.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				this.previousSlide(blockData);
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				this.nextSlide(blockData);
			}
		});

		// Touch/swipe support
		this.initializeSwipeGestures(blockData);

		// Auto-rotation if enabled
		if (blockData.attributes.autoRotate) {
			this.startAutoRotation(blockData);

			// Pause on hover
			blockData.carousel.addEventListener('mouseenter', () => {
				this.pauseAutoRotation(blockData);
			});

			blockData.carousel.addEventListener('mouseleave', () => {
				this.startAutoRotation(blockData);
			});
		}

		// Initial setup
		this.updateCarousel(blockData);
	}

	previousSlide(blockData) {
		const totalSlides = blockData.carousel.querySelectorAll('.carousel-slide').length;
		blockData.currentSlide = (blockData.currentSlide - 1 + totalSlides) % totalSlides;
		this.updateCarousel(blockData);
	}

	nextSlide(blockData) {
		const totalSlides = blockData.carousel.querySelectorAll('.carousel-slide').length;
		blockData.currentSlide = (blockData.currentSlide + 1) % totalSlides;
		this.updateCarousel(blockData);
	}

	goToSlide(blockData, slideIndex) {
		blockData.currentSlide = slideIndex;
		this.updateCarousel(blockData);
	}

	updateCarousel(blockData) {
		const track = blockData.carousel.querySelector('.carousel-track');
		const indicators = blockData.carousel.querySelectorAll('.indicator');
		const prevButton = blockData.carousel.querySelector('.carousel-prev');
		const nextButton = blockData.carousel.querySelector('.carousel-next');

		if (!track) return;

		// Update track position
		const translateX = -blockData.currentSlide * 100;
		track.style.transform = `translateX(${translateX}%)`;

		// Update indicators
		indicators.forEach((indicator, index) => {
			if (index === blockData.currentSlide) {
				indicator.classList.add('bg-blue-500');
				indicator.classList.remove('bg-gray-300');
			} else {
				indicator.classList.remove('bg-blue-500');
				indicator.classList.add('bg-gray-300');
			}
		});

		// Update button states
		const totalSlides = blockData.carousel.querySelectorAll('.carousel-slide').length;
		
		if (prevButton) {
			prevButton.disabled = blockData.currentSlide === 0;
		}
		
		if (nextButton) {
			nextButton.disabled = blockData.currentSlide === totalSlides - 1;
		}

		// Announce slide change
		this.announceSlideChange(blockData);
	}

	announceSlideChange(blockData) {
		const totalSlides = blockData.carousel.querySelectorAll('.carousel-slide').length;
		const currentSlideNumber = blockData.currentSlide + 1;
		
		let announcement = blockData.carousel.querySelector('.slide-announcement');
		if (!announcement) {
			announcement = document.createElement('div');
			announcement.className = 'sr-only slide-announcement';
			announcement.setAttribute('aria-live', 'polite');
			blockData.carousel.appendChild(announcement);
		}

		announcement.textContent = `Slide ${currentSlideNumber} of ${totalSlides}`;
	}

	initializeSwipeGestures(blockData) {
		let startX = 0;
		let currentX = 0;
		let isDragging = false;

		const track = blockData.carousel.querySelector('.carousel-track');
		if (!track) return;

		const handleStart = (e) => {
			isDragging = true;
			startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
			track.style.transition = 'none';
		};

		const handleMove = (e) => {
			if (!isDragging) return;
			
			e.preventDefault();
			currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
			const deltaX = currentX - startX;
			const currentTranslate = -blockData.currentSlide * 100;
			const newTranslate = currentTranslate + (deltaX / track.offsetWidth) * 100;
			
			track.style.transform = `translateX(${newTranslate}%)`;
		};

		const handleEnd = () => {
			if (!isDragging) return;
			
			isDragging = false;
			track.style.transition = 'transform 0.5s ease';
			
			const deltaX = currentX - startX;
			const threshold = 50;
			
			if (Math.abs(deltaX) > threshold) {
				if (deltaX > 0) {
					this.previousSlide(blockData);
				} else {
					this.nextSlide(blockData);
				}
			} else {
				this.updateCarousel(blockData);
			}
		};

		// Mouse events
		track.addEventListener('mousedown', handleStart);
		document.addEventListener('mousemove', handleMove);
		document.addEventListener('mouseup', handleEnd);

		// Touch events
		track.addEventListener('touchstart', handleStart, { passive: false });
		track.addEventListener('touchmove', handleMove, { passive: false });
		track.addEventListener('touchend', handleEnd);
	}

	startAutoRotation(blockData) {
		const speed = blockData.attributes.rotationSpeed || 5000;
		
		blockData.autoRotateTimer = setInterval(() => {
			this.nextSlide(blockData);
		}, speed);
	}

	pauseAutoRotation(blockData) {
		if (blockData.autoRotateTimer) {
			clearInterval(blockData.autoRotateTimer);
			blockData.autoRotateTimer = null;
		}
	}

	initializeVideoTestimonials(blockData) {
		if (!blockData.attributes.enableVideoTestimonials) {
			return;
		}

		const videoButtons = blockData.element.querySelectorAll('[data-video-url]');
		
		videoButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				const videoUrl = button.getAttribute('data-video-url');
				this.openVideoModal(videoUrl);
			});
		});
	}

	openVideoModal(videoUrl) {
		// Create modal overlay
		const modal = document.createElement('div');
		modal.className = 'video-modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
		modal.innerHTML = `
			<div class="video-container bg-white rounded-lg overflow-hidden max-w-4xl w-full mx-4">
				<div class="video-header flex justify-between items-center p-4 border-b">
					<h3 class="text-lg font-semibold">Video Testimonial</h3>
					<button class="close-modal text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
				</div>
				<div class="video-content aspect-video">
					<iframe 
						src="${this.convertToEmbedUrl(videoUrl)}" 
						class="w-full h-full" 
						frameborder="0" 
						allowfullscreen
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					></iframe>
				</div>
			</div>
		`;

		// Add modal to page
		document.body.appendChild(modal);
		document.body.style.overflow = 'hidden';

		// Close modal handlers
		const closeModal = () => {
			document.body.removeChild(modal);
			document.body.style.overflow = '';
		};

		modal.querySelector('.close-modal').addEventListener('click', closeModal);
		modal.addEventListener('click', (e) => {
			if (e.target === modal) closeModal();
		});

		// Escape key handler
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				closeModal();
				document.removeEventListener('keydown', handleEscape);
			}
		};
		document.addEventListener('keydown', handleEscape);

		// Focus management
		modal.querySelector('.close-modal').focus();
	}

	convertToEmbedUrl(url) {
		// Convert YouTube URLs to embed format
		if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
			const videoId = url.includes('youtu.be/') 
				? url.split('youtu.be/')[1].split('?')[0]
				: url.split('v=')[1].split('&')[0];
			return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
		}

		// Convert Vimeo URLs to embed format
		if (url.includes('vimeo.com/')) {
			const videoId = url.split('vimeo.com/')[1].split('?')[0];
			return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
		}

		// Return original URL if not recognized
		return url;
	}

	initializeAnimations(blockData) {
		// Add hover enhancements for better user feedback
		blockData.testimonials.forEach(testimonial => {
			testimonial.addEventListener('mouseenter', () => {
				this.enhanceHover(testimonial);
			});

			testimonial.addEventListener('mouseleave', () => {
				this.resetHover(testimonial);
			});
		});
	}

	enhanceHover(testimonial) {
		const authorImage = testimonial.querySelector('.author-image img');
		const stars = testimonial.querySelectorAll('.star.text-yellow-400');

		// Enhance author image
		if (authorImage) {
			authorImage.style.transform = 'scale(1.05)';
		}

		// Animate stars
		stars.forEach((star, index) => {
			setTimeout(() => {
				star.style.transform = 'scale(1.2)';
			}, index * 50);
		});
	}

	resetHover(testimonial) {
		const authorImage = testimonial.querySelector('.author-image img');
		const stars = testimonial.querySelectorAll('.star');

		if (authorImage) {
			authorImage.style.transform = '';
		}

		stars.forEach(star => {
			star.style.transform = '';
		});
	}

	initializeAccessibility(blockData) {
		// Add ARIA labels for filter buttons
		const filterButtons = blockData.filters?.querySelectorAll('.filter-btn');
		filterButtons?.forEach(button => {
			const category = button.getAttribute('data-category');
			const label = category === 'all' ? 
				'Show all testimonials' : 
				`Filter by ${category} testimonials`;
			button.setAttribute('aria-label', label);
			button.setAttribute('role', 'button');
			button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
		});

		// Add role and labels for testimonial cards
		blockData.testimonials.forEach(testimonial => {
			testimonial.setAttribute('role', 'article');
			const authorName = testimonial.querySelector('.author-name')?.textContent;
			if (authorName) {
				testimonial.setAttribute('aria-label', `Testimonial from ${authorName}`);
			}
		});

		// Improve carousel accessibility
		if (blockData.carousel) {
			blockData.carousel.setAttribute('role', 'region');
			blockData.carousel.setAttribute('aria-label', 'Testimonial carousel');
			blockData.carousel.setAttribute('tabindex', '0');
		}
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
		// Staggered animation for visible testimonials
		const visibleTestimonials = blockData.testimonials.filter(testimonial => 
			!testimonial.classList.contains('hidden') && 
			testimonial.style.display !== 'none'
		);

		visibleTestimonials.forEach((testimonial, index) => {
			setTimeout(() => {
				testimonial.classList.add('animate-in');
			}, index * 150);
		});
	}

	handleResize() {
		// Re-adjust layouts and animations on resize
		this.blocks.forEach(blockData => {
			// Reset carousel positions
			if (blockData.carousel && blockData.attributes.layout === 'quotes-carousel') {
				this.updateCarousel(blockData);
			}

			// Reset any inline styles that might interfere with responsive behavior
			blockData.testimonials.forEach(testimonial => {
				const computedStyle = window.getComputedStyle(testimonial);
				if (computedStyle.display === 'none' && !testimonial.classList.contains('hidden')) {
					testimonial.style.display = '';
				}
			});
		});
	}

	// Public API for external control
	filterBlockByCategory(blockIndex, category) {
		const blockData = this.blocks[blockIndex];
		if (blockData && blockData.attributes.categoryFiltering) {
			this.filterTestimonials(blockData, category);
			
			// Update active filter button
			const targetButton = blockData.filters?.querySelector(`[data-category="${category}"]`);
			if (targetButton) {
				this.updateFilterButtons(blockData, targetButton);
			}
		}
	}

	goToSlideInBlock(blockIndex, slideIndex) {
		const blockData = this.blocks[blockIndex];
		if (blockData && blockData.carousel) {
			this.goToSlide(blockData, slideIndex);
		}
	}

	getAllCategories(blockIndex) {
		const blockData = this.blocks[blockIndex];
		if (!blockData) return [];

		const categories = new Set();
		blockData.testimonials.forEach(testimonial => {
			const category = testimonial.getAttribute('data-category');
			if (category) categories.add(category);
		});

		return Array.from(categories);
	}

	getVisibleTestimonialsCount(blockIndex) {
		const blockData = this.blocks[blockIndex];
		if (!blockData) return 0;

		return blockData.testimonials.filter(testimonial => 
			!testimonial.classList.contains('hidden') && 
			testimonial.style.display !== 'none'
		).length;
	}
}

// Initialize when DOM is ready
const testimonialShowcaseBlocks = new TestimonialShowcaseBlock();

// Expose global API
window.TestimonialShowcaseBlock = testimonialShowcaseBlocks;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
	module.exports = TestimonialShowcaseBlock;
} 