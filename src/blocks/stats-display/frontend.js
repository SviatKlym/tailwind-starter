/**
 * Stats Display Block Frontend JavaScript
 * Handles counter animations and intersection observer
 */

document.addEventListener('DOMContentLoaded', function() {
	// Initialize stats display blocks
	const statsBlocks = document.querySelectorAll('.wp-block-tailwind-starter-stats-display');
	
	statsBlocks.forEach(initStatsBlock);
});

function initStatsBlock(block) {
	const enableAnimations = block.dataset.enableAnimations === 'true';
	const animationTrigger = block.dataset.animationTrigger || 'scroll';
	
	if (!enableAnimations) {
		// If animations are disabled, show final values immediately
		showFinalValues(block);
		return;
	}

	if (animationTrigger === 'scroll') {
		// Use Intersection Observer for scroll-triggered animations
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					animateCounters(entry.target);
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.5,
			rootMargin: '0px 0px -50px 0px'
		});

		observer.observe(block);
	} else {
		// Immediate animation
		setTimeout(() => animateCounters(block), 100);
	}
}

function showFinalValues(block) {
	const statItems = block.querySelectorAll('.stat-item, .stat-item-highlighted');
	
	statItems.forEach(item => {
		const targetNumber = item.dataset.targetNumber;
		const prefix = item.dataset.prefix || '';
		const suffix = item.dataset.suffix || '';
		const counterElement = item.querySelector('.counter-value');
		
		if (counterElement && targetNumber) {
			const finalValue = formatNumber(parseFloat(targetNumber.replace(/,/g, '')));
			counterElement.textContent = finalValue;
		}
	});
}

function animateCounters(block) {
	const statItems = block.querySelectorAll('.stat-item, .stat-item-highlighted');
	
	// Add animation class to block
	block.classList.add('stats-in-view');
	
	statItems.forEach((item, index) => {
		// Stagger animations
		setTimeout(() => {
			animateCounter(item);
		}, index * 200);
	});
}

function animateCounter(item) {
	const targetNumber = item.dataset.targetNumber;
	const prefix = item.dataset.prefix || '';
	const suffix = item.dataset.suffix || '';
	const duration = parseInt(item.dataset.animationDuration) || 2000;
	const counterElement = item.querySelector('.counter-value');
	
	if (!counterElement || !targetNumber) return;
	
	// Parse target number
	const target = parseFloat(targetNumber.replace(/,/g, ''));
	if (isNaN(target)) {
		counterElement.textContent = targetNumber;
		return;
	}
	
	// Add animating class
	item.classList.add('animating');
	
	const startTime = performance.now();
	const startValue = 0;
	
	function updateCounter(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		
		// Use easeOutCubic for smooth animation
		const easeProgress = 1 - Math.pow(1 - progress, 3);
		const currentValue = startValue + (target - startValue) * easeProgress;
		
		// Format and display current value
		const formattedValue = formatNumber(Math.floor(currentValue));
		counterElement.textContent = formattedValue;
		
		if (progress < 1) {
			requestAnimationFrame(updateCounter);
		} else {
			// Animation complete
			const finalValue = formatNumber(target);
			counterElement.textContent = finalValue;
			item.classList.remove('animating');
			item.classList.add('animated');
			
			// Remove animated class after animation
			setTimeout(() => {
				item.classList.remove('animated');
			}, 600);
		}
	}
	
	requestAnimationFrame(updateCounter);
}

function formatNumber(number) {
	// Handle decimal numbers
	if (number % 1 !== 0) {
		return number.toLocaleString('en-US', {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		});
	}
	
	// Handle whole numbers
	return number.toLocaleString('en-US');
}

// Utility function to check if element is in viewport
function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

// Re-trigger animations when window is resized (mobile orientation change)
let resizeTimeout;
window.addEventListener('resize', function() {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		const visibleStatsBlocks = document.querySelectorAll('.wp-block-tailwind-starter-stats-display.stats-in-view');
		visibleStatsBlocks.forEach(block => {
			if (isInViewport(block)) {
				block.classList.remove('stats-in-view');
				setTimeout(() => animateCounters(block), 100);
			}
		});
	}, 250);
}); 