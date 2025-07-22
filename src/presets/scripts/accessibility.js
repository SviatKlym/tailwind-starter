/**
 * Shared Accessibility Utilities
 * ARIA management, focus control, screen reader support
 */

class BlockAccessibility {
    constructor() {
        this.announcer = null;
        this.focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ].join(', ');
        
        this.init();
    }

    /**
     * Initialize accessibility utilities
     */
    init() {
        this.createAnnouncer();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    }

    /**
     * Create screen reader announcer element
     */
    createAnnouncer() {
        if (this.announcer) return;
        
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.setAttribute('class', 'sr-only');
        this.announcer.setAttribute('id', 'block-announcer');
        document.body.appendChild(this.announcer);
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message, priority = 'polite') {
        if (!this.announcer || !message) return;
        
        this.announcer.setAttribute('aria-live', priority);
        this.announcer.textContent = '';
        
        // Small delay to ensure screen readers pick up the change
        setTimeout(() => {
            this.announcer.textContent = message;
        }, 100);
        
        // Clear after announcement
        setTimeout(() => {
            this.announcer.textContent = '';
        }, 1000);
    }

    /**
     * Setup keyboard navigation helpers
     */
    setupKeyboardNavigation() {
        // Handle Escape key globally for modals/dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
        });
    }

    /**
     * Handle Escape key press
     */
    handleEscapeKey() {
        // Close modals
        const openModals = document.querySelectorAll('.block-modal-overlay[aria-hidden="false"]');
        openModals.forEach(modal => {
            const closeBtn = modal.querySelector('.block-modal-close');
            if (closeBtn) closeBtn.click();
        });

        // Close dropdowns
        const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');
        openDropdowns.forEach(dropdown => {
            dropdown.setAttribute('aria-expanded', 'false');
        });
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Add focus-visible polyfill behavior
        document.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
    }

    /**
     * Get all focusable elements within container
     */
    getFocusableElements(container) {
        const elements = container.querySelectorAll(this.focusableSelectors);
        return Array.from(elements).filter(el => {
            return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
        });
    }

    /**
     * Trap focus within container
     */
    trapFocus(container) {
        const focusableElements = this.getFocusableElements(container);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);

        // Return cleanup function
        return () => {
            container.removeEventListener('keydown', handleTabKey);
        };
    }

    /**
     * Manage focus restoration
     */
    createFocusManager() {
        let previousFocus = null;

        return {
            store: () => {
                previousFocus = document.activeElement;
            },
            restore: () => {
                if (previousFocus && previousFocus.focus) {
                    previousFocus.focus();
                }
            }
        };
    }

    /**
     * Set ARIA attributes safely
     */
    setAria(element, attributes) {
        if (!element) return;
        
        Object.entries(attributes).forEach(([key, value]) => {
            const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
            
            if (value === null || value === undefined) {
                element.removeAttribute(ariaKey);
            } else {
                element.setAttribute(ariaKey, String(value));
            }
        });
    }

    /**
     * Create keyboard navigation for list items
     */
    createKeyboardNavigation(container, itemSelector, options = {}) {
        const {
            orientation = 'vertical', // 'horizontal' or 'vertical'
            wrap = true,
            onItemSelect = null
        } = options;

        const handleKeyDown = (e) => {
            const items = Array.from(container.querySelectorAll(itemSelector));
            const currentIndex = items.findIndex(item => item === document.activeElement);
            
            if (currentIndex === -1) return;

            let nextIndex = currentIndex;
            
            const isVertical = orientation === 'vertical';
            const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
            const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

            switch (e.key) {
                case nextKey:
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                    if (wrap && nextIndex >= items.length) nextIndex = 0;
                    break;
                    
                case prevKey:
                    e.preventDefault();
                    nextIndex = currentIndex - 1;
                    if (wrap && nextIndex < 0) nextIndex = items.length - 1;
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    nextIndex = 0;
                    break;
                    
                case 'End':
                    e.preventDefault();
                    nextIndex = items.length - 1;
                    break;
                    
                case 'Enter':
                case ' ':
                    if (onItemSelect) {
                        e.preventDefault();
                        onItemSelect(items[currentIndex], currentIndex);
                    }
                    break;
            }

            if (nextIndex !== currentIndex && items[nextIndex]) {
                items[nextIndex].focus();
            }
        };

        container.addEventListener('keydown', handleKeyDown);
        
        // Set initial tabindex values
        const items = container.querySelectorAll(itemSelector);
        items.forEach((item, index) => {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        return () => {
            container.removeEventListener('keydown', handleKeyDown);
        };
    }

    /**
     * Create accessible disclosure (accordion/dropdown)
     */
    createDisclosure(trigger, content, options = {}) {
        const {
            multipleOpen = false,
            closeOnClickOutside = true
        } = options;

        const isExpanded = () => trigger.getAttribute('aria-expanded') === 'true';
        
        const expand = () => {
            trigger.setAttribute('aria-expanded', 'true');
            content.setAttribute('aria-hidden', 'false');
            content.style.display = 'block';
            
            this.announceToScreenReader(`${trigger.textContent} expanded`);
        };
        
        const collapse = () => {
            trigger.setAttribute('aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');
            content.style.display = 'none';
            
            this.announceToScreenReader(`${trigger.textContent} collapsed`);
        };
        
        const toggle = () => {
            if (isExpanded()) {
                collapse();
            } else {
                // Close others if multipleOpen is false
                if (!multipleOpen) {
                    const container = trigger.closest('[data-disclosure-group]');
                    if (container) {
                        const otherTriggers = container.querySelectorAll('[aria-expanded="true"]');
                        otherTriggers.forEach(otherTrigger => {
                            if (otherTrigger !== trigger) {
                                const otherContent = document.getElementById(
                                    otherTrigger.getAttribute('aria-controls')
                                );
                                if (otherContent) {
                                    otherTrigger.setAttribute('aria-expanded', 'false');
                                    otherContent.setAttribute('aria-hidden', 'true');
                                    otherContent.style.display = 'none';
                                }
                            }
                        });
                    }
                }
                expand();
            }
        };

        // Setup ARIA attributes
        const contentId = content.id || `disclosure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        content.id = contentId;
        trigger.setAttribute('aria-controls', contentId);
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');

        // Event listeners
        trigger.addEventListener('click', toggle);
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });

        // Click outside to close
        if (closeOnClickOutside) {
            document.addEventListener('click', (e) => {
                if (isExpanded() && !trigger.contains(e.target) && !content.contains(e.target)) {
                    collapse();
                }
            });
        }

        return { expand, collapse, toggle, isExpanded };
    }

    /**
     * Add skip link
     */
    addSkipLink(targetId, text = 'Skip to main content') {
        const skipLink = document.createElement('a');
        skipLink.href = `#${targetId}`;
        skipLink.textContent = text;
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        return skipLink;
    }
}

// Global instance
window.BlockAccessibility = new BlockAccessibility();

export default window.BlockAccessibility;