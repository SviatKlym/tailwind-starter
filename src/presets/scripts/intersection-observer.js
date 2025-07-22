/**
 * Shared Intersection Observer Utility
 * Handles scroll-triggered animations and lazy loading
 */

class SharedIntersectionObserver {
    constructor() {
        this.observers = new Map();
        this.callbacks = new Map();
        this.defaultOptions = {
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            rootMargin: '50px 0px',
        };
    }

    /**
     * Create or get existing observer for specific options
     */
    getObserver(options = {}) {
        const config = { ...this.defaultOptions, ...options };
        const key = JSON.stringify(config);
        
        if (!this.observers.has(key)) {
            const observer = new IntersectionObserver((entries) => {
                this.handleIntersection(entries, key);
            }, config);
            
            this.observers.set(key, observer);
            this.callbacks.set(key, new Map());
        }
        
        return this.observers.get(key);
    }

    /**
     * Handle intersection events
     */
    handleIntersection(entries, observerKey) {
        const callbacks = this.callbacks.get(observerKey);
        
        entries.forEach(entry => {
            const element = entry.target;
            const elementCallbacks = callbacks.get(element);
            
            if (elementCallbacks) {
                elementCallbacks.forEach(callback => {
                    try {
                        callback(entry);
                    } catch (error) {
                        console.warn('Intersection Observer callback error:', error);
                    }
                });
            }
        });
    }

    /**
     * Observe element with callback
     */
    observe(element, callback, options = {}) {
        const observer = this.getObserver(options);
        const observerKey = JSON.stringify({ ...this.defaultOptions, ...options });
        const callbacks = this.callbacks.get(observerKey);
        
        if (!callbacks.has(element)) {
            callbacks.set(element, new Set());
            observer.observe(element);
        }
        
        callbacks.get(element).add(callback);
        
        // Return unobserve function
        return () => this.unobserve(element, callback, options);
    }

    /**
     * Stop observing element
     */
    unobserve(element, callback = null, options = {}) {
        const observerKey = JSON.stringify({ ...this.defaultOptions, ...options });
        const observer = this.observers.get(observerKey);
        const callbacks = this.callbacks.get(observerKey);
        
        if (!observer || !callbacks || !callbacks.has(element)) {
            return;
        }
        
        if (callback) {
            callbacks.get(element).delete(callback);
            
            // If no more callbacks for this element, stop observing
            if (callbacks.get(element).size === 0) {
                callbacks.delete(element);
                observer.unobserve(element);
            }
        } else {
            // Remove all callbacks for element
            callbacks.delete(element);
            observer.unobserve(element);
        }
    }

    /**
     * Animate elements when they come into view
     */
    animateOnScroll(elements, animationClass = 'animate-fade-in', options = {}) {
        const elementsArray = Array.isArray(elements) ? elements : [elements];
        const unobserveFunctions = [];
        
        elementsArray.forEach((element, index) => {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            const unobserve = this.observe(element, (entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    // Add stagger delay
                    setTimeout(() => {
                        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        element.classList.add(animationClass);
                        
                        // Announce to screen readers
                        if (window.BlockAccessibility) {
                            window.BlockAccessibility.announceToScreenReader(
                                'New content has appeared on screen'
                            );
                        }
                    }, index * 100); // 100ms stagger
                    
                    // Stop observing once animated
                    this.unobserve(element);
                }
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px',
                ...options
            });
            
            unobserveFunctions.push(unobserve);
        });
        
        return () => unobserveFunctions.forEach(fn => fn());
    }

    /**
     * Lazy load images
     */
    lazyLoadImages(images, options = {}) {
        const imagesArray = Array.isArray(images) ? images : [images];
        
        imagesArray.forEach(img => {
            this.observe(img, (entry) => {
                if (entry.isIntersecting) {
                    this.loadImage(img);
                    this.unobserve(img);
                }
            }, {
                threshold: 0.1,
                rootMargin: '200px 0px',
                ...options
            });
        });
    }

    /**
     * Load image with loading states
     */
    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        if (!src) return;
        
        // Add loading class
        img.classList.add('loading');
        
        // Create new image to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            img.src = src;
            if (srcset) img.srcset = srcset;
            
            img.classList.remove('loading');
            img.classList.add('loaded');
            
            // Fade in effect
            img.style.transition = 'opacity 0.3s ease-out';
            img.style.opacity = '1';
        };
        
        imageLoader.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
        };
        
        imageLoader.src = src;
        if (srcset) imageLoader.srcset = srcset;
    }

    /**
     * Track element visibility for analytics
     */
    trackVisibility(element, callback, options = {}) {
        let hasBeenVisible = false;
        let visibilityStartTime = null;
        
        return this.observe(element, (entry) => {
            if (entry.isIntersecting && !hasBeenVisible) {
                hasBeenVisible = true;
                visibilityStartTime = performance.now();
                
                callback({
                    type: 'visible',
                    element,
                    timestamp: visibilityStartTime
                });
            } else if (!entry.isIntersecting && hasBeenVisible && visibilityStartTime) {
                const visibilityDuration = performance.now() - visibilityStartTime;
                
                callback({
                    type: 'hidden',
                    element,
                    timestamp: performance.now(),
                    duration: visibilityDuration
                });
                
                visibilityStartTime = null;
            }
        }, {
            threshold: 0.5,
            ...options
        });
    }

    /**
     * Cleanup all observers
     */
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.callbacks.clear();
    }
}

// Global instance
window.BlockIntersectionObserver = new SharedIntersectionObserver();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.BlockIntersectionObserver.cleanup();
});

export default window.BlockIntersectionObserver;