/**
 * Dynamic Block Builder System
 * Generates only the exact JS and CSS needed based on block configuration
 */

class BlockBuilder {
    constructor() {
        this.features = new Map();
        this.cssModules = new Map();
        this.jsModules = new Map();
        this.dependencies = new Map();
        
        this.initializeModules();
    }
    
    /**
     * Initialize all available feature modules
     */
    initializeModules() {
        // CSS Modules - modular styles that can be combined
        this.cssModules.set('carousel', {
            css: `
.carousel-container { position: relative; overflow: hidden; }
.carousel-track { display: flex; transition: transform 0.3s ease; }
.carousel-item { flex: 0 0 100%; }
.carousel-nav { position: absolute; top: 50%; z-index: 10; }
.carousel-prev { left: 1rem; }
.carousel-next { right: 1rem; }
.carousel-dots { display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
.carousel-dot { width: 0.75rem; height: 0.75rem; border-radius: 50%; background: #d1d5db; cursor: pointer; transition: background 0.2s; }
.carousel-dot.active { background: #3b82f6; }
            `,
            classes: ['carousel-container', 'carousel-track', 'carousel-item', 'carousel-nav', 'carousel-prev', 'carousel-next', 'carousel-dots', 'carousel-dot']
        });
        
        this.cssModules.set('modal', {
            css: `
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50; display: flex; align-items: center; justify-content: center; }
.modal-container { background: white; border-radius: 0.5rem; max-width: 90vw; max-height: 90vh; overflow: hidden; }
.modal-header { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
.modal-body { padding: 1rem; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
            `,
            classes: ['modal-overlay', 'modal-container', 'modal-header', 'modal-body', 'modal-close']
        });
        
        this.cssModules.set('form', {
            css: `
.form-group { margin-bottom: 1rem; }
.form-input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; transition: border-color 0.2s, box-shadow 0.2s; }
.form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.form-button { padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s; }
.form-button:hover { background: #2563eb; }
.form-button:disabled { opacity: 0.6; cursor: not-allowed; }
.form-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
            `,
            classes: ['form-group', 'form-input', 'form-button', 'form-error']
        });
        
        this.cssModules.set('grid', {
            css: `
.grid-1 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
.grid-2 { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }
.grid-4 { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }
@media (min-width: 768px) {
    .grid-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }
}
            `,
            classes: ['grid-1', 'grid-2', 'grid-3', 'grid-4']
        });
        
        this.cssModules.set('animations', {
            css: `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
.animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.3s; }
            `,
            classes: ['animate-fade-in', 'animate-slide-up', 'animate-scale-in']
        });
        
        // JavaScript Modules - functional components
        this.jsModules.set('carousel', {
            dependencies: [],
            code: `
function initCarousel(container) {
    const track = container.querySelector('.carousel-track');
    const items = container.querySelectorAll('.carousel-item');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const dots = container.querySelectorAll('.carousel-dot');
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    function updateCarousel() {
        track.style.transform = \`translateX(-\${currentIndex * 100}%)\`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Auto-play if enabled
    if (container.dataset.autoplay === 'true') {
        const interval = parseInt(container.dataset.interval) || 5000;
        setInterval(nextSlide, interval);
    }
    
    return { nextSlide, prevSlide, updateCarousel };
}
            `,
            functions: ['initCarousel']
        });
        
        this.jsModules.set('modal', {
            dependencies: [],
            code: `
function createModal(options = {}) {
    const { title = '', content = '', size = 'medium' } = options;
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const sizeClasses = {
        small: 'max-w-sm',
        medium: 'max-w-md', 
        large: 'max-w-lg'
    };
    
    overlay.innerHTML = \`
        <div class="modal-container \${sizeClasses[size]}">
            <div class="modal-header">
                <h3>\${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                \${content}
            </div>
        </div>
    \`;
    
    const closeBtn = overlay.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(overlay));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
    
    document.body.appendChild(overlay);
    return overlay;
}

function closeModal(modal) {
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
}
            `,
            functions: ['createModal', 'closeModal']
        });
        
        this.jsModules.set('form', {
            dependencies: [],
            code: `
function initForm(form) {
    const inputs = form.querySelectorAll('.form-input');
    const button = form.querySelector('.form-button');
    
    function validateEmail(email) {
        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    }
    
    function showError(input, message) {
        let error = input.parentNode.querySelector('.form-error');
        if (!error) {
            error = document.createElement('div');
            error.className = 'form-error';
            input.parentNode.appendChild(error);
        }
        error.textContent = message;
        input.style.borderColor = '#ef4444';
    }
    
    function clearError(input) {
        const error = input.parentNode.querySelector('.form-error');
        if (error) error.remove();
        input.style.borderColor = '#d1d5db';
    }
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.type === 'email' && input.value) {
                if (!validateEmail(input.value)) {
                    showError(input, 'Please enter a valid email address');
                } else {
                    clearError(input);
                }
            }
        });
        
        input.addEventListener('input', () => clearError(input));
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            }
        });
        
        if (isValid) {
            button.disabled = true;
            button.textContent = 'Submitting...';
            // Handle form submission
            return true;
        }
        return false;
    });
    
    return { validateEmail, showError, clearError };
}
            `,
            functions: ['initForm', 'validateEmail', 'showError', 'clearError']
        });
        
        this.jsModules.set('animations', {
            dependencies: [],
            code: `
function animateOnScroll(elements, animationClass = 'animate-fade-in') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
    return observer;
}

function staggerAnimation(elements, baseClass = 'animate-slide-up', delayClass = 'animate-delay-') {
    elements.forEach((el, index) => {
        el.classList.add(baseClass);
        if (index > 0) {
            el.classList.add(\`\${delayClass}\${Math.min(index, 3)}\`);
        }
    });
}
            `,
            functions: ['animateOnScroll', 'staggerAnimation']
        });
        
        // Feature definitions - combinations of modules
        this.features.set('carousel', {
            cssModules: ['carousel', 'animations'],
            jsModules: ['carousel', 'animations'],
            options: ['autoplay', 'dots', 'arrows', 'infinite']
        });
        
        this.features.set('modal', {
            cssModules: ['modal'],
            jsModules: ['modal'],
            options: ['size', 'backdrop', 'keyboard']
        });
        
        this.features.set('newsletter-form', {
            cssModules: ['form', 'animations'],
            jsModules: ['form', 'animations'],
            options: ['validation', 'ajax', 'redirect']
        });
        
        this.features.set('video-gallery', {
            cssModules: ['grid', 'modal', 'animations'],
            jsModules: ['modal', 'animations'],
            options: ['columns', 'lightbox', 'lazy-loading']
        });
        
        this.features.set('testimonials', {
            cssModules: ['carousel', 'grid', 'animations'],
            jsModules: ['carousel', 'animations'],
            options: ['layout', 'autoplay', 'pagination']
        });
    }
    
    /**
     * Build block based on configuration
     */
    buildBlock(config) {
        const {
            blockName,
            features = [],
            options = {},
            customCSS = '',
            customJS = ''
        } = config;
        
        // Collect required modules
        const requiredCSSModules = new Set();
        const requiredJSModules = new Set();
        
        features.forEach(featureName => {
            const feature = this.features.get(featureName);
            if (feature) {
                feature.cssModules.forEach(module => requiredCSSModules.add(module));
                feature.jsModules.forEach(module => requiredJSModules.add(module));
            }
        });
        
        // Generate CSS
        const css = this.generateCSS(requiredCSSModules, customCSS, blockName);
        
        // Generate JS
        const js = this.generateJS(requiredJSModules, customJS, blockName, features, options);
        
        return {
            css,
            js,
            size: this.calculateSize(css, js),
            modules: {
                css: Array.from(requiredCSSModules),
                js: Array.from(requiredJSModules)
            }
        };
    }
    
    /**
     * Generate optimized CSS
     */
    generateCSS(modules, customCSS, blockName) {
        let css = `/* Generated CSS for ${blockName} - Only includes used modules */\\n\\n`;
        
        // Add block-specific wrapper
        css += `.wp-block-tailwind-starter-${blockName} {\\n`;
        css += '  /* Block container styles */\\n';
        css += '}\\n\\n';
        
        // Add required modules
        modules.forEach(moduleName => {
            const module = this.cssModules.get(moduleName);
            if (module) {
                css += `/* ${moduleName} module */\\n`;
                css += module.css.trim() + '\\n\\n';
            }
        });
        
        // Add custom CSS
        if (customCSS) {
            css += '/* Custom CSS */\\n';
            css += customCSS + '\\n\\n';
        }
        
        // Add responsive and accessibility defaults
        css += this.getResponsiveCSS();
        
        return css;
    }
    
    /**
     * Generate optimized JavaScript
     */
    generateJS(modules, customJS, blockName, features, options) {
        let js = `/**\\n * Generated JavaScript for ${blockName}\\n * Only includes used modules: ${Array.from(modules).join(', ')}\\n */\\n\\n`;
        
        // Add module functions
        const addedFunctions = new Set();
        modules.forEach(moduleName => {
            const module = this.jsModules.get(moduleName);
            if (module) {
                js += `// ${moduleName} module\\n`;
                js += module.code.trim() + '\\n\\n';
                module.functions.forEach(fn => addedFunctions.add(fn));
            }
        });
        
        // Generate initialization function
        js += this.generateInitFunction(blockName, features, options, addedFunctions);
        
        // Add custom JS
        if (customJS) {
            js += '\\n// Custom JavaScript\\n';
            js += customJS + '\\n';
        }
        
        return js;
    }
    
    /**
     * Generate block initialization function
     */
    generateInitFunction(blockName, features, options, availableFunctions) {
        let initJS = `// Block initialization\\n`;
        initJS += `document.addEventListener('DOMContentLoaded', function() {\\n`;
        initJS += `    const blocks = document.querySelectorAll('.wp-block-tailwind-starter-${blockName}');\\n`;
        initJS += `    blocks.forEach(init${this.toPascalCase(blockName)});\\n`;
        initJS += `});\\n\\n`;
        
        initJS += `function init${this.toPascalCase(blockName)}(block) {\\n`;
        initJS += `    if (!block || block.dataset.initialized) return;\\n\\n`;
        
        // Add feature-specific initialization
        features.forEach(featureName => {
            switch(featureName) {
                case 'carousel':
                    if (availableFunctions.has('initCarousel')) {
                        initJS += `    // Initialize carousel\\n`;
                        initJS += `    const carousel = block.querySelector('.carousel-container');\\n`;
                        initJS += `    if (carousel) initCarousel(carousel);\\n\\n`;
                    }
                    break;
                    
                case 'newsletter-form':
                    if (availableFunctions.has('initForm')) {
                        initJS += `    // Initialize form\\n`;
                        initJS += `    const form = block.querySelector('form');\\n`;
                        initJS += `    if (form) initForm(form);\\n\\n`;
                    }
                    break;
                    
                case 'modal':
                    initJS += `    // Setup modal triggers\\n`;
                    initJS += `    const modalTriggers = block.querySelectorAll('[data-modal]');\\n`;
                    initJS += `    modalTriggers.forEach(trigger => {\\n`;
                    initJS += `        trigger.addEventListener('click', (e) => {\\n`;
                    initJS += `            e.preventDefault();\\n`;
                    initJS += `            createModal({\\n`;
                    initJS += `                title: trigger.dataset.modalTitle || '',\\n`;
                    initJS += `                content: trigger.dataset.modalContent || ''\\n`;
                    initJS += `            });\\n`;
                    initJS += `        });\\n`;
                    initJS += `    });\\n\\n`;
                    break;
            }
        });
        
        // Add animations if enabled
        if (availableFunctions.has('animateOnScroll')) {
            initJS += `    // Animate elements on scroll\\n`;
            initJS += `    const animateElements = block.querySelectorAll('.animate-on-scroll');\\n`;
            initJS += `    if (animateElements.length > 0) {\\n`;
            initJS += `        animateOnScroll(animateElements);\\n`;
            initJS += `    }\\n\\n`;
        }
        
        initJS += `    block.dataset.initialized = 'true';\\n`;
        initJS += `}\\n`;
        
        return initJS;
    }
    
    /**
     * Get responsive CSS defaults
     */
    getResponsiveCSS() {
        return `/* Responsive defaults */
@media (max-width: 768px) {
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}

/* Print styles */
@media print {
    .carousel-nav, .modal-overlay { display: none; }
}
`;
    }
    
    /**
     * Calculate estimated file size
     */
    calculateSize(css, js) {
        const cssSize = new Blob([css]).size;
        const jsSize = new Blob([js]).size;
        return {
            css: cssSize,
            js: jsSize,
            total: cssSize + jsSize,
            cssFormatted: this.formatBytes(cssSize),
            jsFormatted: this.formatBytes(jsSize),
            totalFormatted: this.formatBytes(cssSize + jsSize)
        };
    }
    
    /**
     * Utility functions
     */
    toPascalCase(str) {
        return str.replace(/(^|-)(.)/g, (match, dash, letter) => letter.toUpperCase());
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    /**
     * Get available features
     */
    getAvailableFeatures() {
        return Array.from(this.features.keys()).map(name => ({
            name,
            description: this.getFeatureDescription(name),
            options: this.features.get(name).options
        }));
    }
    
    getFeatureDescription(featureName) {
        const descriptions = {
            'carousel': 'Image/content carousel with navigation and auto-play',
            'modal': 'Modal/popup functionality with customizable content',
            'newsletter-form': 'Email subscription form with validation',
            'video-gallery': 'Video grid with lightbox functionality',
            'testimonials': 'Customer testimonial display with multiple layouts'
        };
        return descriptions[featureName] || 'Custom feature';
    }
}

export default BlockBuilder;