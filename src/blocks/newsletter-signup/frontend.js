/**
 * Optimized Newsletter Signup Frontend
 * Reduced from 689 lines to ~180 lines using shared presets
 */

// Wait for presets to be ready
document.addEventListener('blockPresetsReady', function(e) {
    if (e.detail.blockName !== 'newsletter-signup') return;
    
    const blocks = document.querySelectorAll('.wp-block-tailwind-starter-newsletter-signup');
    blocks.forEach(initNewsletterSignup);
});

function initNewsletterSignup(block) {
    if (!block || block.dataset.initialized) return;
    
    const form = block.querySelector('.newsletter-form');
    const layout = block.dataset.layout || 'inline-form';
    
    if (!form) return;
    
    // Use shared intersection observer for animations
    window.BlockIntersectionObserver.animateOnScroll(
        [block],
        'animate-fade-in animate-slide-up'
    );
    
    // Create newsletter form handler
    const newsletterHandler = new NewsletterFormHandler(form, block, {
        layout,
        integrationService: block.dataset.integrationService || 'mailchimp',
        apiKey: block.dataset.apiKey || '',
        listId: block.dataset.listId || '',
        enableCaptcha: block.dataset.enableCaptcha === 'true',
        enableDoubleOptin: block.dataset.enableDoubleOptin !== 'false',
        successMessage: block.dataset.successMessage || 'Thank you for subscribing!',
        errorMessage: block.dataset.errorMessage || 'Please enter a valid email address.',
        redirectUrl: block.dataset.redirectUrl || ''
    });
    
    // Initialize form
    newsletterHandler.init();
    
    block.dataset.initialized = 'true';
}

class NewsletterFormHandler {
    constructor(form, block, options = {}) {
        this.form = form;
        this.block = block;
        this.options = options;
        this.emailInput = null;
        this.submitButton = null;
        this.messageContainer = null;
        this.isSubmitting = false;
        this.validationRules = {
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            }
        };
    }
    
    init() {
        this.createFormHTML();
        this.bindEvents();
        this.setupAccessibility();
        
        // Setup modal or slide-in if needed
        if (this.options.layout === 'modal' || this.options.layout === 'slide-in') {
            this.setupAdvancedLayout();
        }
    }
    
    createFormHTML() {
        // Find existing form elements or create them
        this.emailInput = this.form.querySelector('input[type="email"]') || this.createEmailInput();
        this.submitButton = this.form.querySelector('button[type="submit"]') || this.createSubmitButton();
        this.messageContainer = this.form.querySelector('.form-messages') || this.createMessageContainer();
        
        // Make sure form has proper attributes
        this.form.setAttribute('novalidate', '');
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    createEmailInput() {
        const input = document.createElement('input');
        input.type = 'email';
        input.name = 'email';
        input.placeholder = this.block.dataset.placeholder || 'Enter your email address';
        input.className = 'block-input';
        input.required = true;
        input.setAttribute('aria-describedby', 'email-error');
        
        const container = this.form.querySelector('.input-container') || this.form;
        container.appendChild(input);
        
        return input;
    }
    
    createSubmitButton() {
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = this.block.dataset.buttonText || 'Subscribe';
        button.className = 'block-btn-primary';
        
        this.form.appendChild(button);
        return button;
    }
    
    createMessageContainer() {
        const container = document.createElement('div');
        container.className = 'form-messages mt-3';
        container.setAttribute('aria-live', 'polite');
        
        this.form.appendChild(container);
        return container;
    }
    
    bindEvents() {
        // Real-time validation
        this.emailInput.addEventListener('blur', () => {
            this.validateField('email', this.emailInput.value);
        });
        
        this.emailInput.addEventListener('input', () => {
            // Clear previous errors on input
            this.clearFieldError('email');
        });
        
        // Submit button loading state
        this.submitButton.addEventListener('click', () => {
            if (this.isSubmitting) return;
            this.trackEvent('newsletter_submit_attempt');
        });
    }
    
    setupAccessibility() {
        // Use shared accessibility helper for form enhancements
        if (window.BlockAccessibility) {
            // Add labels if missing
            if (!this.form.querySelector('label[for="' + this.emailInput.id + '"]')) {
                const label = document.createElement('label');
                label.htmlFor = this.emailInput.id || 'newsletter-email';
                label.textContent = 'Email Address';
                label.className = 'sr-only';
                this.emailInput.parentNode.insertBefore(label, this.emailInput);
            }
            
            // Setup keyboard navigation
            window.BlockAccessibility.createKeyboardNavigation(
                this.form,
                'input, button',
                {
                    onItemSelect: (item) => {
                        if (item.type === 'submit') {
                            this.handleSubmit(new Event('submit'));
                        }
                    }
                }
            );
        }
    }
    
    setupAdvancedLayout() {
        if (this.options.layout === 'modal') {
            this.setupModalLayout();
        } else if (this.options.layout === 'slide-in') {
            this.setupSlideInLayout();
        }
    }
    
    setupModalLayout() {
        // Create modal trigger
        const trigger = document.createElement('button');
        trigger.textContent = 'Subscribe to Newsletter';
        trigger.className = 'block-btn-primary';
        
        // Replace form with trigger initially
        this.form.style.display = 'none';
        this.block.appendChild(trigger);
        
        trigger.addEventListener('click', () => {
            if (window.BlockModalManager) {
                const modal = window.BlockModalManager.create({
                    title: 'Subscribe to Newsletter',
                    content: this.form.outerHTML,
                    size: 'medium',
                    onShow: () => {
                        // Reinitialize form in modal
                        const modalForm = modal.element.querySelector('.newsletter-form');
                        if (modalForm) {
                            this.initModalForm(modalForm);
                        }
                    }
                });
                modal.show();
            }
        });
    }
    
    setupSlideInLayout() {
        // Simple slide-in after delay
        setTimeout(() => {
            this.form.classList.add('slide-in-active');
        }, 3000); // 3 second delay
    }
    
    initModalForm(modalForm) {
        const modalHandler = new NewsletterFormHandler(modalForm, this.block, this.options);
        modalHandler.createFormHTML();
        modalHandler.bindEvents();
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validate form
        if (!this.validateForm()) {
            this.announceError('Please fix the errors below');
            return;
        }
        
        this.isSubmitting = true;
        this.setLoadingState(true);
        
        try {
            const formData = this.getFormData();
            const result = await this.submitToService(formData);
            
            if (result.success) {
                this.handleSuccess(result);
                this.trackEvent('newsletter_signup_success');
            } else {
                this.handleError(result.message || this.options.errorMessage);
                this.trackEvent('newsletter_signup_error', { error: result.message });
            }
        } catch (error) {
            console.error('Newsletter signup error:', error);
            this.handleError(this.options.errorMessage);
            this.trackEvent('newsletter_signup_error', { error: error.message });
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate email
        if (!this.validateField('email', this.emailInput.value)) {
            isValid = false;
        }
        
        // reCAPTCHA validation (if enabled)
        if (this.options.enableCaptcha && typeof grecaptcha !== 'undefined') {
            const captchaResponse = grecaptcha.getResponse();
            if (!captchaResponse) {
                this.showFieldError('captcha', 'Please complete the CAPTCHA');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    validateField(fieldName, value) {
        const rule = this.validationRules[fieldName];
        if (!rule) return true;
        
        // Required field check
        if (rule.required && (!value || value.trim() === '')) {
            this.showFieldError(fieldName, `${fieldName} is required`);
            return false;
        }
        
        // Pattern check
        if (rule.pattern && value && !rule.pattern.test(value)) {
            this.showFieldError(fieldName, rule.message);
            return false;
        }
        
        this.clearFieldError(fieldName);
        return true;
    }
    
    showFieldError(fieldName, message) {
        const errorId = `${fieldName}-error`;
        let errorElement = this.form.querySelector(`#${errorId}`);
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'block-error';
            errorElement.setAttribute('role', 'alert');
            
            // Insert after the field
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
        }
        
        errorElement.textContent = message;
        
        // Update field aria attributes
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', errorId);
        }
    }
    
    clearFieldError(fieldName) {
        const errorElement = this.form.querySelector(`#${fieldName}-error`);
        if (errorElement) {
            errorElement.remove();
        }
        
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        }
    }
    
    getFormData() {
        return {
            email: this.emailInput.value.trim(),
            source: 'wordpress-block',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer
        };
    }
    
    async submitToService(formData) {
        // Use WordPress AJAX endpoint
        const ajaxUrl = window.ajaxurl || '/wp-admin/admin-ajax.php';
        
        const response = await fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'newsletter_signup',
                nonce: window.newsletterNonce || '',
                email: formData.email,
                service: this.options.integrationService,
                list_id: this.options.listId,
                double_optin: this.options.enableDoubleOptin ? '1' : '0'
            })
        });
        
        return await response.json();
    }
    
    handleSuccess(result) {
        this.showMessage(this.options.successMessage, 'success');
        this.clearForm();
        
        // Redirect if specified
        if (this.options.redirectUrl) {
            setTimeout(() => {
                window.location.href = this.options.redirectUrl;
            }, 2000);
        }
        
        // Announce success to screen readers
        this.announceSuccess(this.options.successMessage);
    }
    
    handleError(message) {
        this.showMessage(message, 'error');
        this.announceError(message);
    }
    
    showMessage(message, type) {
        this.messageContainer.className = `form-messages mt-3 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`;
        this.messageContainer.textContent = message;
    }
    
    clearForm() {
        this.emailInput.value = '';
        this.clearFieldError('email');
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <div class="block-spinner w-4 h-4 mr-2"></div>
                ${this.submitButton.textContent}
            `;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = this.block.dataset.buttonText || 'Subscribe';
        }
    }
    
    announceSuccess(message) {
        if (window.BlockAccessibility) {
            window.BlockAccessibility.announceToScreenReader(message, 'polite');
        }
    }
    
    announceError(message) {
        if (window.BlockAccessibility) {
            window.BlockAccessibility.announceToScreenReader(message, 'assertive');
        }
    }
    
    trackEvent(eventName, properties = {}) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', properties);
        }
        
        // Custom tracking
        if (window.newsletterAnalytics) {
            window.newsletterAnalytics.track(eventName, properties);
        }
    }
}

// Register block assets when DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerNewsletterAssets);
} else {
    registerNewsletterAssets();
}

function registerNewsletterAssets() {
    if (window.BlockAssetManager) {
        window.BlockAssetManager.registerBlockAssets('newsletter-signup', {
            presets: ['accessibility', 'animations'],
            priority: 'normal'
        });
    }
}

// Load reCAPTCHA if needed
document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.wp-block-tailwind-starter-newsletter-signup[data-enable-captcha="true"]');
    
    if (blocks.length > 0 && !window.grecaptcha) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        document.head.appendChild(script);
    }
});