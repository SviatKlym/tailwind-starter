/**
 * Shared Touch Gesture Handler
 * Provides consistent touch/swipe functionality across blocks
 */

class TouchGestureManager {
    constructor() {
        this.activeHandlers = new Map();
        this.globalOptions = {
            threshold: 50,
            restraint: 100,
            allowedTime: 300,
            preventDefault: true
        };
    }

    /**
     * Create touch gesture handler for element
     */
    create(element, options = {}) {
        if (!element || this.activeHandlers.has(element)) {
            return this.activeHandlers.get(element);
        }

        const config = { ...this.globalOptions, ...options };
        const handler = new TouchHandler(element, config);
        this.activeHandlers.set(element, handler);
        
        return handler;
    }

    /**
     * Remove touch handler for element
     */
    destroy(element) {
        const handler = this.activeHandlers.get(element);
        if (handler) {
            handler.destroy();
            this.activeHandlers.delete(element);
        }
    }

    /**
     * Clean up all handlers
     */
    cleanup() {
        this.activeHandlers.forEach(handler => handler.destroy());
        this.activeHandlers.clear();
    }
}

class TouchHandler {
    constructor(element, options) {
        this.element = element;
        this.options = options;
        this.startX = 0;
        this.startY = 0;
        this.distX = 0;
        this.distY = 0;
        this.startTime = 0;
        this.isTracking = false;
        
        this.init();
    }

    init() {
        // Bind methods to preserve context
        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);

        // Add event listeners
        this.element.addEventListener('touchstart', this.handleStart, { passive: !this.options.preventDefault });
        this.element.addEventListener('touchmove', this.handleMove, { passive: !this.options.preventDefault });
        this.element.addEventListener('touchend', this.handleEnd, { passive: true });
        this.element.addEventListener('touchcancel', this.handleEnd, { passive: true });
        
        // Also support mouse events for testing on desktop
        if (this.options.supportMouse) {
            this.element.addEventListener('mousedown', this.handleStart);
            this.element.addEventListener('mousemove', this.handleMove);
            this.element.addEventListener('mouseup', this.handleEnd);
            this.element.addEventListener('mouseleave', this.handleEnd);
        }
    }

    handleStart(e) {
        const touch = e.touches ? e.touches[0] : e;
        
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.startTime = Date.now();
        this.isTracking = true;
        this.distX = 0;
        this.distY = 0;

        if (this.options.onStart) {
            this.options.onStart({
                element: this.element,
                startX: this.startX,
                startY: this.startY
            });
        }
    }

    handleMove(e) {
        if (!this.isTracking) return;

        if (this.options.preventDefault) {
            e.preventDefault();
        }

        const touch = e.touches ? e.touches[0] : e;
        
        this.distX = touch.clientX - this.startX;
        this.distY = touch.clientY - this.startY;

        if (this.options.onMove) {
            this.options.onMove({
                element: this.element,
                distX: this.distX,
                distY: this.distY,
                direction: this.getDirection()
            });
        }
    }

    handleEnd(e) {
        if (!this.isTracking) return;
        
        this.isTracking = false;
        const elapsedTime = Date.now() - this.startTime;
        
        // Determine if this was a valid gesture
        if (elapsedTime <= this.options.allowedTime) {
            const absDistX = Math.abs(this.distX);
            const absDistY = Math.abs(this.distY);
            
            // Check if horizontal swipe
            if (absDistX >= this.options.threshold && absDistY <= this.options.restraint) {
                if (this.distX > 0) {
                    this.triggerSwipe('right');
                } else {
                    this.triggerSwipe('left');
                }
            }
            // Check if vertical swipe
            else if (absDistY >= this.options.threshold && absDistX <= this.options.restraint) {
                if (this.distY > 0) {
                    this.triggerSwipe('down');
                } else {
                    this.triggerSwipe('up');
                }
            }
        }

        if (this.options.onEnd) {
            this.options.onEnd({
                element: this.element,
                distX: this.distX,
                distY: this.distY,
                elapsedTime: elapsedTime,
                direction: this.getDirection()
            });
        }
    }

    triggerSwipe(direction) {
        const callback = this.options[`onSwipe${direction.charAt(0).toUpperCase() + direction.slice(1)}`];
        
        if (typeof callback === 'function') {
            callback({
                element: this.element,
                direction: direction,
                distX: this.distX,
                distY: this.distY
            });
        }

        // Generic swipe callback
        if (this.options.onSwipe) {
            this.options.onSwipe({
                element: this.element,
                direction: direction,
                distX: this.distX,
                distY: this.distY
            });
        }

        // Announce to screen readers
        if (window.BlockAccessibility) {
            const directionText = {
                left: 'swiped left',
                right: 'swiped right',
                up: 'swiped up',
                down: 'swiped down'
            };
            
            window.BlockAccessibility.announceToScreenReader(
                `Content ${directionText[direction]}`
            );
        }
    }

    getDirection() {
        const absDistX = Math.abs(this.distX);
        const absDistY = Math.abs(this.distY);
        
        if (absDistX > absDistY) {
            return this.distX > 0 ? 'right' : 'left';
        } else {
            return this.distY > 0 ? 'down' : 'up';
        }
    }

    destroy() {
        this.element.removeEventListener('touchstart', this.handleStart);
        this.element.removeEventListener('touchmove', this.handleMove);
        this.element.removeEventListener('touchend', this.handleEnd);
        this.element.removeEventListener('touchcancel', this.handleEnd);
        
        if (this.options.supportMouse) {
            this.element.removeEventListener('mousedown', this.handleStart);
            this.element.removeEventListener('mousemove', this.handleMove);
            this.element.removeEventListener('mouseup', this.handleEnd);
            this.element.removeEventListener('mouseleave', this.handleEnd);
        }
    }
}

// Global instance
window.BlockTouchGestures = new TouchGestureManager();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.BlockTouchGestures.cleanup();
});

export default window.BlockTouchGestures;