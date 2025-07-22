/**
 * Content Slider Block Frontend JavaScript
 * Handles Swiper.js initialization and custom slider functionality
 */

document.addEventListener('DOMContentLoaded', function() {
	// Initialize all content slider blocks
	const sliderBlocks = document.querySelectorAll('.wp-block-tailwind-starter-content-slider');
	
	sliderBlocks.forEach(initSliderBlock);
});

function initSliderBlock(block) {
	const swiperContainer = block.querySelector('.swiper');
	if (!swiperContainer) return;

	// Get settings from data attributes
	const settings = getSliderSettings(block);
	
	// Load Swiper CSS and JS if not already loaded
	loadSwiperAssets().then(() => {
		// Initialize Swiper
		const swiper = initializeSwiper(swiperContainer, settings);
		
		// Add custom functionality
		addCustomControls(block, swiper, settings);
		
		// Handle responsive behavior
		handleResponsiveSlider(swiper, settings);
		
		// Add accessibility features
		addAccessibilityFeatures(block, swiper);
	});
}

function getSliderSettings(block) {
	return {
		autoplay: block.dataset.autoplay === 'true',
		autoplayDelay: parseInt(block.dataset.autoplayDelay) || 5000,
		showNavigation: block.dataset.showNavigation === 'true',
		showPagination: block.dataset.showPagination === 'true',
		showScrollbar: block.dataset.showScrollbar === 'true',
		loop: block.dataset.loop === 'true',
		slidesPerView: parseInt(block.dataset.slidesPerView) || 1,
		spaceBetween: parseInt(block.dataset.spaceBetween) || 30,
		effect: block.dataset.effect || 'slide',
		speed: parseInt(block.dataset.speed) || 600,
		pauseOnHover: block.dataset.pauseOnHover === 'true',
		centeredSlides: block.dataset.centeredSlides === 'true',
		freeMode: block.dataset.freeMode === 'true',
		sliderHeight: block.dataset.sliderHeight || 'auto',
		navigationStyle: block.dataset.navigationStyle || 'arrows',
		paginationStyle: block.dataset.paginationStyle || 'bullets'
	};
}

function loadSwiperAssets() {
	return new Promise((resolve) => {
		// Check if Swiper is already loaded
		if (window.Swiper) {
			resolve();
			return;
		}

		// Load Swiper CSS
		if (!document.querySelector('link[href*="swiper"]')) {
			const swiperCSS = document.createElement('link');
			swiperCSS.rel = 'stylesheet';
			swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
			document.head.appendChild(swiperCSS);
		}

		// Load Swiper JS
		if (!document.querySelector('script[src*="swiper"]')) {
			const swiperJS = document.createElement('script');
			swiperJS.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
			swiperJS.onload = resolve;
			document.head.appendChild(swiperJS);
		} else {
			resolve();
		}
	});
}

function initializeSwiper(container, settings) {
	const swiperConfig = {
		// Core settings
		slidesPerView: settings.slidesPerView,
		spaceBetween: settings.spaceBetween,
		loop: settings.loop,
		speed: settings.speed,
		effect: settings.effect,
		centeredSlides: settings.centeredSlides,
		freeMode: settings.freeMode,

		// Autoplay
		autoplay: settings.autoplay ? {
			delay: settings.autoplayDelay,
			disableOnInteraction: false,
			pauseOnMouseEnter: settings.pauseOnHover
		} : false,

		// Navigation
		navigation: settings.showNavigation ? {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		} : false,

		// Pagination
		pagination: settings.showPagination ? {
			el: '.swiper-pagination',
			type: settings.paginationStyle,
			clickable: true,
			dynamicBullets: true
		} : false,

		// Scrollbar
		scrollbar: settings.showScrollbar ? {
			el: '.swiper-scrollbar',
			draggable: true
		} : false,

		// Responsive breakpoints
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 10
			},
			768: {
				slidesPerView: Math.min(settings.slidesPerView, 2),
				spaceBetween: settings.spaceBetween / 2
			},
			1024: {
				slidesPerView: settings.slidesPerView,
				spaceBetween: settings.spaceBetween
			}
		},

		// Effect-specific settings
		fadeEffect: settings.effect === 'fade' ? {
			crossFade: true
		} : undefined,

		cubeEffect: settings.effect === 'cube' ? {
			shadow: true,
			slideShadows: true,
			shadowOffset: 20,
			shadowScale: 0.94
		} : undefined,

		coverflowEffect: settings.effect === 'coverflow' ? {
			rotate: 50,
			stretch: 0,
			depth: 100,
			modifier: 1,
			slideShadows: true
		} : undefined,

		// Event callbacks
		on: {
			init: function() {
				// Add loading complete class
				container.closest('.wp-block-tailwind-starter-content-slider').classList.remove('slider-loading');
				
				// Trigger custom event
				container.dispatchEvent(new CustomEvent('swiperInitialized', { 
					detail: { swiper: this }
				}));
			},
			
			slideChange: function() {
				// Update ARIA labels
				updateSlideAria(this);
				
				// Trigger custom event
				container.dispatchEvent(new CustomEvent('slideChanged', { 
					detail: { 
						swiper: this, 
						activeIndex: this.activeIndex 
					}
				}));
			},

			autoplayStart: function() {
				container.setAttribute('data-autoplay-active', 'true');
			},

			autoplayStop: function() {
				container.setAttribute('data-autoplay-active', 'false');
			}
		}
	};

	// Initialize Swiper
	return new Swiper(container, swiperConfig);
}

function addCustomControls(block, swiper, settings) {
	// Play/Pause button for autoplay
	if (settings.autoplay && settings.pauseOnHover) {
		const playPauseBtn = document.createElement('button');
		playPauseBtn.className = 'slider-play-pause absolute top-4 right-4 z-20 w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all';
		playPauseBtn.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
		playPauseBtn.setAttribute('aria-label', 'Play/Pause slider');
		
		let isPlaying = true;
		
		playPauseBtn.addEventListener('click', () => {
			if (isPlaying) {
				swiper.autoplay.stop();
				playPauseBtn.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
				playPauseBtn.setAttribute('aria-label', 'Play slider');
				isPlaying = false;
			} else {
				swiper.autoplay.start();
				playPauseBtn.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
				playPauseBtn.setAttribute('aria-label', 'Pause slider');
				isPlaying = true;
			}
		});
		
		block.querySelector('.slider-container').appendChild(playPauseBtn);
	}

	// Slide counter
	if (swiper.slides.length > 1) {
		const counter = document.createElement('div');
		counter.className = 'slider-counter absolute bottom-4 left-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm';
		counter.innerHTML = `<span class="current">1</span> / <span class="total">${swiper.slides.length}</span>`;
		
		// Update counter on slide change
		swiper.on('slideChange', () => {
			counter.querySelector('.current').textContent = swiper.realIndex + 1;
		});
		
		block.querySelector('.slider-container').appendChild(counter);
	}

	// Progress bar for autoplay
	if (settings.autoplay) {
		const progressBar = document.createElement('div');
		progressBar.className = 'slider-progress absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-30 z-20';
		progressBar.innerHTML = '<div class="progress-fill h-full bg-white transition-all duration-1000 ease-linear" style="width: 0%"></div>';
		
		const progressFill = progressBar.querySelector('.progress-fill');
		
		swiper.on('autoplayTimeLeft', (s, time, progress) => {
			progressFill.style.width = `${(1 - progress) * 100}%`;
		});
		
		swiper.on('slideChange', () => {
			progressFill.style.width = '0%';
		});
		
		block.querySelector('.slider-container').appendChild(progressBar);
	}
}

function handleResponsiveSlider(swiper, settings) {
	// Handle orientation change
	window.addEventListener('orientationchange', () => {
		setTimeout(() => {
			swiper.update();
		}, 500);
	});

	// Handle window resize
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			swiper.update();
		}, 250);
	});

	// Handle intersection observer for performance
	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if (settings.autoplay && swiper.autoplay.paused) {
						swiper.autoplay.start();
					}
				} else {
					if (settings.autoplay && !swiper.autoplay.paused) {
						swiper.autoplay.stop();
					}
				}
			});
		}, { threshold: 0.5 });

		observer.observe(swiper.el);
	}
}

function addAccessibilityFeatures(block, swiper) {
	// Add ARIA labels to slides
	updateSlideAria(swiper);
	
	// Add keyboard navigation
	swiper.keyboard.enable();
	
	// Add focus management
	swiper.on('slideChange', () => {
		const activeSlide = swiper.slides[swiper.activeIndex];
		const focusableElements = activeSlide.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
		
		if (focusableElements.length > 0) {
			focusableElements[0].focus();
		}
	});

	// Add screen reader announcements
	const srAnnouncement = document.createElement('div');
	srAnnouncement.className = 'sr-only';
	srAnnouncement.setAttribute('aria-live', 'polite');
	srAnnouncement.setAttribute('aria-atomic', 'true');
	block.appendChild(srAnnouncement);

	swiper.on('slideChange', () => {
		const activeSlide = swiper.slides[swiper.activeIndex];
		const slideTitle = activeSlide.querySelector('h3, h4, h5, h6');
		if (slideTitle) {
			srAnnouncement.textContent = `Slide ${swiper.activeIndex + 1} of ${swiper.slides.length}: ${slideTitle.textContent}`;
		}
	});
}

function updateSlideAria(swiper) {
	swiper.slides.forEach((slide, index) => {
		slide.setAttribute('role', 'group');
		slide.setAttribute('aria-roledescription', 'slide');
		slide.setAttribute('aria-label', `Slide ${index + 1} of ${swiper.slides.length}`);
		
		if (index === swiper.activeIndex) {
			slide.setAttribute('aria-current', 'true');
		} else {
			slide.removeAttribute('aria-current');
		}
	});
}

// Global API for external control
window.contentSliderAPI = {
	getInstance: function(blockElement) {
		const swiperEl = blockElement.querySelector('.swiper');
		return swiperEl && swiperEl.swiper ? swiperEl.swiper : null;
	},
	
	goToSlide: function(blockElement, slideIndex) {
		const swiper = this.getInstance(blockElement);
		if (swiper) {
			swiper.slideTo(slideIndex);
		}
	},
	
	playSlider: function(blockElement) {
		const swiper = this.getInstance(blockElement);
		if (swiper && swiper.autoplay) {
			swiper.autoplay.start();
		}
	},
	
	pauseSlider: function(blockElement) {
		const swiper = this.getInstance(blockElement);
		if (swiper && swiper.autoplay) {
			swiper.autoplay.stop();
		}
	}
}; 