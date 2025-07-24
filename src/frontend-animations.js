/**
 * Frontend Animation System
 * 
 * Simple, standalone animation system for [data-animate] elements
 * that doesn't require the performance framework configuration.
 * 
 * @package TailwindStarter
 */

(function() {
    'use strict';

    /**
     * Initialize scroll animations for [data-animate] elements
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if (!animatedElements.length) return;

        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseInt(element.dataset.animateDelay) || 0;
                    
                    // Apply animation after delay
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0) translateX(0) scale(1)';
                            element.classList.add('animation-complete');
                        });
                    }, delay);
                    
                    // Stop observing this element
                    observer.unobserve(element);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe all animated elements
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Initialize animations when DOM is ready
     */
    function init() {
        // Respect user's motion preferences
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Make all elements visible immediately for reduced motion
            const animatedElements = document.querySelectorAll('[data-animate]');
            animatedElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.classList.add('animation-complete');
            });
            return;
        }

        // Initialize scroll animations
        initScrollAnimations();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle dynamically added elements (for dynamic content)
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            let hasNewAnimatedElements = false;
            
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        // Check if the node itself has data-animate
                        if (node.hasAttribute && node.hasAttribute('data-animate')) {
                            hasNewAnimatedElements = true;
                        }
                        // Check if any child nodes have data-animate
                        if (node.querySelectorAll && node.querySelectorAll('[data-animate]').length > 0) {
                            hasNewAnimatedElements = true;
                        }
                    }
                });
            });
            
            // Re-initialize if new animated elements were added
            if (hasNewAnimatedElements) {
                setTimeout(init, 100); // Small delay to ensure elements are fully rendered
            }
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }
})();