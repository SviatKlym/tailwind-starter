/**
 * Before After Block Frontend Functionality
 */

class BeforeAfterComparison {
	constructor(element) {
		this.element = element;
		this.attributes = JSON.parse(element.dataset.attributes || '{}');
		this.layout = this.attributes.layout || 'slider-comparison';
		this.isDragging = false;
		this.currentView = 'before';
		
		this.init();
	}

	init() {
		switch (this.layout) {
			case 'slider-comparison':
				this.initSliderComparison();
				break;
			case 'toggle-switch':
				this.initToggleSwitch();
				break;
			case 'overlay-fade':
				this.initOverlayFade();
				break;
			case 'side-by-side':
				this.initSideBySide();
				break;
		}

		// Add keyboard support if enabled
		if (this.attributes.enableKeyboard) {
			this.initKeyboardNavigation();
		}

		// Add fullscreen support if enabled
		if (this.attributes.enableFullscreen) {
			this.initFullscreen();
		}
	}

	initSliderComparison() {
		const container = this.element.querySelector('.comparison-container');
		if (!container) return;

		const afterImage = container.querySelector('.after-image');
		const sliderLine = container.querySelector('.slider-line');
		const sliderHandle = container.querySelector('.slider-handle');
		
		if (!afterImage || !sliderLine || !sliderHandle) return;

		// Set initial position
		const initialPosition = this.attributes.sliderPosition || 50;
		this.updateSliderPosition(initialPosition);

		// Mouse events
		sliderHandle.addEventListener('mousedown', this.startDrag.bind(this));
		document.addEventListener('mousemove', this.onDrag.bind(this));
		document.addEventListener('mouseup', this.stopDrag.bind(this));

		// Touch events if enabled
		if (this.attributes.enableTouch) {
			sliderHandle.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
			document.addEventListener('touchmove', this.onDrag.bind(this), { passive: false });
			document.addEventListener('touchend', this.stopDrag.bind(this));
		}

		// Auto slide if enabled
		if (this.attributes.autoSlide) {
			this.startAutoSlide();
		}

		// Store references
		this.container = container;
		this.afterImage = afterImage;
		this.sliderLine = sliderLine;
		this.sliderHandle = sliderHandle;
	}

	initToggleSwitch() {
		const container = this.element.querySelector('.comparison-container');
		const toggleButton = container?.querySelector('.toggle-button');
		const beforeImage = container?.querySelector('.before-image');
		const afterImage = container?.querySelector('.after-image');

		if (!toggleButton || !beforeImage || !afterImage) return;

		toggleButton.addEventListener('click', () => {
			this.currentView = this.currentView === 'before' ? 'after' : 'before';
			
			if (this.currentView === 'after') {
				beforeImage.style.opacity = '0';
				afterImage.style.opacity = '1';
				toggleButton.textContent = 'Show Before';
			} else {
				beforeImage.style.opacity = '1';
				afterImage.style.opacity = '0';
				toggleButton.textContent = this.attributes.toggleButtonText || 'Toggle View';
			}

			// Announce change for screen readers
			this.announceChange(`Now showing ${this.currentView} image`);
		});

		// Add keyboard support for toggle button
		toggleButton.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggleButton.click();
			}
		});
	}

	initOverlayFade() {
		const container = this.element.querySelector('.comparison-container');
		if (!container) return;

		// Add click support for touch devices
		if (this.attributes.enableTouch) {
			let isRevealed = false;
			
			container.addEventListener('click', () => {
				const afterImage = container.querySelector('.after-image');
				if (!afterImage) return;

				isRevealed = !isRevealed;
				
				if (isRevealed) {
					afterImage.style.opacity = '1';
					container.classList.add('revealed');
				} else {
					afterImage.style.opacity = '0';
					container.classList.remove('revealed');
				}

				this.announceChange(`${isRevealed ? 'After' : 'Before'} image is now visible`);
			});
		}
	}

	initSideBySide() {
		// Add intersection observer for animations
		if ('IntersectionObserver' in window) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-in');
					}
				});
			}, { threshold: 0.1 });

			const sections = this.element.querySelectorAll('.before-section, .after-section');
			sections.forEach(section => {
				observer.observe(section);
			});
		}
	}

	initKeyboardNavigation() {
		this.element.setAttribute('tabindex', '0');
		this.element.addEventListener('keydown', (e) => {
			if (this.layout === 'slider-comparison') {
				this.handleSliderKeyboard(e);
			} else if (this.layout === 'toggle-switch') {
				this.handleToggleKeyboard(e);
			}
		});
	}

	handleSliderKeyboard(e) {
		if (!this.container) return;

		const step = 5; // 5% steps
		let currentPosition = parseFloat(this.sliderLine?.style.left) || 50;

		switch (e.key) {
			case 'ArrowLeft':
				e.preventDefault();
				currentPosition = Math.max(0, currentPosition - step);
				this.updateSliderPosition(currentPosition);
				this.announceChange(`Slider at ${Math.round(currentPosition)}%`);
				break;
			case 'ArrowRight':
				e.preventDefault();
				currentPosition = Math.min(100, currentPosition + step);
				this.updateSliderPosition(currentPosition);
				this.announceChange(`Slider at ${Math.round(currentPosition)}%`);
				break;
			case 'Home':
				e.preventDefault();
				this.updateSliderPosition(0);
				this.announceChange('Slider at beginning');
				break;
			case 'End':
				e.preventDefault();
				this.updateSliderPosition(100);
				this.announceChange('Slider at end');
				break;
		}
	}

	handleToggleKeyboard(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			const toggleButton = this.element.querySelector('.toggle-button');
			if (toggleButton) {
				toggleButton.click();
			}
		}
	}

	startDrag(e) {
		e.preventDefault();
		this.isDragging = true;
		this.element.classList.add('dragging');
		
		// Store initial positions
		const rect = this.container.getBoundingClientRect();
		this.containerLeft = rect.left;
		this.containerWidth = rect.width;
	}

	onDrag(e) {
		if (!this.isDragging || !this.container) return;

		e.preventDefault();
		
		const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
		const relativeX = clientX - this.containerLeft;
		const percentage = Math.max(0, Math.min(100, (relativeX / this.containerWidth) * 100));

		this.updateSliderPosition(percentage);
	}

	stopDrag() {
		if (!this.isDragging) return;
		
		this.isDragging = false;
		this.element.classList.remove('dragging');
	}

	updateSliderPosition(percentage) {
		if (!this.afterImage || !this.sliderLine || !this.sliderHandle) return;

		// Update clip path for after image
		this.afterImage.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`;
		
		// Update slider line and handle positions
		this.sliderLine.style.left = `${percentage}%`;
		this.sliderHandle.style.left = `${percentage}%`;

		// Apply custom styling
		if (this.attributes.sliderColor) {
			this.sliderLine.style.backgroundColor = this.attributes.sliderColor;
			this.sliderHandle.style.backgroundColor = this.attributes.sliderColor;
		}

		if (this.attributes.sliderThickness) {
			this.sliderLine.style.width = `${this.attributes.sliderThickness}px`;
		}

		if (this.attributes.handleSize) {
			this.sliderHandle.style.width = `${this.attributes.handleSize}px`;
			this.sliderHandle.style.height = `${this.attributes.handleSize}px`;
		}

		if (this.attributes.handleStyle === 'square') {
			this.sliderHandle.style.borderRadius = '4px';
		}
	}

	startAutoSlide() {
		const delay = this.attributes.autoSlideDelay || 3000;
		let direction = 1;
		let position = 50;

		const autoSlideInterval = setInterval(() => {
			if (this.isDragging) return;

			position += direction * 2;
			
			if (position >= 100 || position <= 0) {
				direction *= -1;
			}

			this.updateSliderPosition(position);
		}, delay / 50);

		// Stop auto slide on user interaction
		this.element.addEventListener('mousedown', () => {
			clearInterval(autoSlideInterval);
		}, { once: true });
	}

	initFullscreen() {
		const fullscreenButton = this.element.querySelector('.fullscreen-button');
		if (!fullscreenButton) return;

		fullscreenButton.addEventListener('click', () => {
			this.toggleFullscreen();
		});
	}

	toggleFullscreen() {
		if (!document.fullscreenElement) {
			this.element.requestFullscreen().then(() => {
				this.element.classList.add('fullscreen-mode');
			}).catch(err => {
				console.log('Fullscreen error:', err);
			});
		} else {
			document.exitFullscreen().then(() => {
				this.element.classList.remove('fullscreen-mode');
			});
		}
	}

	announceChange(message) {
		// Create announcement for screen readers
		const announcement = document.createElement('div');
		announcement.setAttribute('aria-live', 'polite');
		announcement.setAttribute('aria-atomic', 'true');
		announcement.className = 'sr-only';
		announcement.textContent = message;
		
		document.body.appendChild(announcement);
		
		setTimeout(() => {
			document.body.removeChild(announcement);
		}, 1000);
	}
}

// Initialize all before-after blocks when DOM is ready
function initBeforeAfterBlocks() {
	const blocks = document.querySelectorAll('.wp-block-tailwind-starter-before-after');
	
	blocks.forEach(block => {
		if (!block.dataset.initialized) {
			new BeforeAfterComparison(block);
			block.dataset.initialized = 'true';
		}
	});
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initBeforeAfterBlocks);
} else {
	initBeforeAfterBlocks();
}

// Re-initialize on dynamic content load (for AJAX pages, etc.)
document.addEventListener('beforeAfterBlocksUpdate', initBeforeAfterBlocks);

// Export for potential external use
window.BeforeAfterComparison = BeforeAfterComparison;

console.log('📸 Before After block frontend loaded'); 