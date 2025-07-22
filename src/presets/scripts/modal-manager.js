/**
 * Shared Modal Manager
 * Handles modal/popup functionality across blocks
 */

class ModalManager {
    constructor() {
        this.activeModals = new Map();
        this.scrollbarWidth = this.getScrollbarWidth();
        this.originalOverflow = '';
        this.init();
    }

    init() {
        // Handle escape key globally
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
        });
    }

    /**
     * Create and show modal
     */
    create(options = {}) {
        const config = {
            id: this.generateId(),
            title: '',
            content: '',
            size: 'medium', // small, medium, large, full
            showCloseButton: true,
            backdrop: true,
            keyboard: true,
            focus: true,
            ...options
        };

        const modal = new Modal(config, this);
        this.activeModals.set(config.id, modal);
        
        return modal;
    }

    /**
     * Show existing modal
     */
    show(modalId) {
        const modal = this.activeModals.get(modalId);
        if (modal) {
            modal.show();
        }
    }

    /**
     * Hide modal
     */
    hide(modalId) {
        const modal = this.activeModals.get(modalId);
        if (modal) {
            modal.hide();
        }
    }

    /**
     * Destroy modal
     */
    destroy(modalId) {
        const modal = this.activeModals.get(modalId);
        if (modal) {
            modal.destroy();
            this.activeModals.delete(modalId);
        }
    }

    /**
     * Close top (most recent) modal
     */
    closeTopModal() {
        const modals = Array.from(this.activeModals.values());
        const visibleModals = modals.filter(modal => modal.isVisible);
        
        if (visibleModals.length > 0) {
            const topModal = visibleModals[visibleModals.length - 1];
            topModal.hide();
        }
    }

    /**
     * Lock body scroll when modal is open
     */
    lockScroll() {
        if (document.body.style.overflow !== 'hidden') {
            this.originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${this.scrollbarWidth}px`;
        }
    }

    /**
     * Unlock body scroll when all modals are closed
     */
    unlockScroll() {
        const visibleModals = Array.from(this.activeModals.values())
            .filter(modal => modal.isVisible);
            
        if (visibleModals.length === 0) {
            document.body.style.overflow = this.originalOverflow;
            document.body.style.paddingRight = '';
        }
    }

    /**
     * Get scrollbar width for proper body padding
     */
    getScrollbarWidth() {
        const scrollDiv = document.createElement('div');
        scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }

    /**
     * Generate unique modal ID
     */
    generateId() {
        return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Cleanup all modals
     */
    cleanup() {
        this.activeModals.forEach(modal => modal.destroy());
        this.activeModals.clear();
        this.unlockScroll();
    }
}

class Modal {
    constructor(config, manager) {
        this.config = config;
        this.manager = manager;
        this.isVisible = false;
        this.element = null;
        this.focusManager = null;
        this.previousFocus = null;
        
        this.create();
    }

    create() {
        // Create modal structure
        this.element = document.createElement('div');
        this.element.className = 'block-modal-overlay';
        this.element.id = this.config.id;
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');
        this.element.setAttribute('aria-hidden', 'true');
        this.element.style.display = 'none';
        
        if (this.config.title) {
            this.element.setAttribute('aria-labelledby', `${this.config.id}-title`);
        }

        // Size classes
        const sizeClasses = {
            small: 'max-w-sm',
            medium: 'max-w-md',
            large: 'max-w-lg',
            full: 'max-w-full'
        };

        this.element.innerHTML = `
            <div class="block-modal ${sizeClasses[this.config.size] || sizeClasses.medium}">
                ${this.config.title ? `
                    <div class="block-modal-header">
                        <h3 id="${this.config.id}-title" class="block-modal-title">
                            ${this.config.title}
                        </h3>
                        ${this.config.showCloseButton ? `
                            <button type="button" class="block-modal-close" aria-label="Close modal">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="block-modal-body">
                    ${this.config.content}
                </div>
                
                ${this.config.footer ? `
                    <div class="block-modal-footer">
                        ${this.config.footer}
                    </div>
                ` : ''}
            </div>
        `;

        // Add event listeners
        this.bindEvents();
        
        // Add to DOM
        document.body.appendChild(this.element);
    }

    bindEvents() {
        // Close button
        const closeButton = this.element.querySelector('.block-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }

        // Backdrop click
        if (this.config.backdrop) {
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) {
                    this.hide();
                }
            });
        }

        // Custom event handlers
        if (this.config.onShow) {
            this.element.addEventListener('modalShow', this.config.onShow);
        }
        
        if (this.config.onHide) {
            this.element.addEventListener('modalHide', this.config.onHide);
        }
    }

    show() {
        if (this.isVisible) return;

        // Store previous focus
        this.previousFocus = document.activeElement;
        
        // Show modal
        this.element.style.display = 'flex';
        this.element.setAttribute('aria-hidden', 'false');
        this.isVisible = true;
        
        // Lock body scroll
        this.manager.lockScroll();
        
        // Setup focus management
        if (this.config.focus && window.BlockAccessibility) {
            this.focusManager = window.BlockAccessibility.trapFocus(
                this.element.querySelector('.block-modal')
            );
            
            // Focus first focusable element or close button
            const focusableElements = window.BlockAccessibility.getFocusableElements(
                this.element.querySelector('.block-modal')
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
        
        // Dispatch event
        this.element.dispatchEvent(new CustomEvent('modalShow', {
            detail: { modal: this }
        }));
        
        // Announce to screen readers
        if (window.BlockAccessibility) {
            window.BlockAccessibility.announceToScreenReader(
                `${this.config.title || 'Modal'} opened`
            );
        }
    }

    hide() {
        if (!this.isVisible) return;

        // Hide modal
        this.element.style.display = 'none';
        this.element.setAttribute('aria-hidden', 'true');
        this.isVisible = false;
        
        // Cleanup focus management
        if (this.focusManager) {
            this.focusManager();
            this.focusManager = null;
        }
        
        // Restore previous focus
        if (this.previousFocus && this.previousFocus.focus) {
            this.previousFocus.focus();
        }
        
        // Unlock scroll if no other modals
        this.manager.unlockScroll();
        
        // Dispatch event
        this.element.dispatchEvent(new CustomEvent('modalHide', {
            detail: { modal: this }
        }));
        
        // Announce to screen readers
        if (window.BlockAccessibility) {
            window.BlockAccessibility.announceToScreenReader(
                `${this.config.title || 'Modal'} closed`
            );
        }
    }

    updateContent(content) {
        const body = this.element.querySelector('.block-modal-body');
        if (body) {
            body.innerHTML = content;
        }
    }

    updateTitle(title) {
        const titleElement = this.element.querySelector('.block-modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    destroy() {
        if (this.isVisible) {
            this.hide();
        }
        
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = null;
        this.focusManager = null;
        this.previousFocus = null;
    }
}

// Global instance
window.BlockModalManager = new ModalManager();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.BlockModalManager.cleanup();
});

export default window.BlockModalManager;