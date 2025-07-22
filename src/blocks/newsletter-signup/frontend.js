/**
 * Newsletter Signup Block Frontend Functionality
 */

class NewsletterSignupManager {
	constructor(element) {
		this.element = element;
		this.attributes = JSON.parse(element.dataset.attributes || '{}');
		this.layout = this.attributes.layout || 'inline-form';
		this.form = null;
		this.modal = null;
		this.modalShown = false;
		
		this.init();
	}

	init() {
		// Find the form within this block
		this.form = this.element.querySelector('.newsletter-form-container');
		
		if (!this.form) {
			console.warn('Newsletter form not found');
			return;
		}

		// Initialize based on layout
		switch (this.layout) {
			case 'modal-popup':
				this.initModal();
				break;
			default:
				this.initInlineForm();
				break;
		}

		// Setup form submission
		this.setupFormSubmission();

		// Setup reCAPTCHA if enabled
		if (this.attributes.enableReCaptcha && this.attributes.recaptchaSiteKey) {
			this.setupRecaptcha();
		}
	}

	initInlineForm() {
		// Add focus effects and validation
		const inputs = this.form.querySelectorAll('input[type="email"], input[type="text"]');
		inputs.forEach(input => {
			input.addEventListener('focus', () => this.onInputFocus(input));
			input.addEventListener('blur', () => this.onInputBlur(input));
			input.addEventListener('input', () => this.onInputChange(input));
		});

		// Add animation if enabled
		if (this.attributes.enableAnimation) {
			this.addAnimation();
		}
	}

	initModal() {
		this.modal = this.element.querySelector('.newsletter-modal');
		if (!this.modal) return;

		// Setup modal triggers
		this.setupModalTriggers();

		// Setup modal close events
		this.setupModalCloseEvents();

		// Check if already shown this session
		if (this.attributes.showOncePerSession && this.hasShownThisSession()) {
			return;
		}

		// Initialize form within modal
		this.initInlineForm();
	}

	setupModalTriggers() {
		const triggerType = this.attributes.modalTrigger || 'scroll';

		switch (triggerType) {
			case 'time':
				this.setupTimeDelayTrigger();
				break;
			case 'scroll':
				this.setupScrollTrigger();
				break;
			case 'exit':
				this.setupExitIntentTrigger();
				break;
			case 'manual':
				// Manual trigger - can be called externally
				window.showNewsletterModal = () => this.showModal();
				break;
		}
	}

	setupTimeDelayTrigger() {
		const delay = this.attributes.modalDelay || 5000;
		setTimeout(() => {
			if (!this.modalShown) {
				this.showModal();
			}
		}, delay);
	}

	setupScrollTrigger() {
		const percentage = this.attributes.scrollPercentage || 50;
		let triggered = false;

		const checkScroll = () => {
			if (triggered || this.modalShown) return;

			const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
			
			if (scrollPercent >= percentage) {
				triggered = true;
				this.showModal();
				window.removeEventListener('scroll', checkScroll);
			}
		};

		window.addEventListener('scroll', checkScroll, { passive: true });
	}

	setupExitIntentTrigger() {
		let triggered = false;

		const handleMouseLeave = (e) => {
			if (triggered || this.modalShown) return;
			
			if (e.clientY <= 0) {
				triggered = true;
				this.showModal();
				document.removeEventListener('mouseleave', handleMouseLeave);
			}
		};

		document.addEventListener('mouseleave', handleMouseLeave);
	}

	setupModalCloseEvents() {
		// Close button
		const closeBtn = this.modal.querySelector('.modal-close');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => this.closeModal());
		}

		// Escape key
		if (this.attributes.enableEscapeKey) {
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
					this.closeModal();
				}
			});
		}

		// Backdrop click
		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) {
				this.closeModal();
			}
		});
	}

	showModal() {
		if (this.modalShown || !this.modal) return;

		this.modal.classList.remove('hidden');
		document.body.style.overflow = 'hidden';
		this.modalShown = true;

		// Set session flag
		if (this.attributes.showOncePerSession) {
			sessionStorage.setItem('newsletter_modal_shown', 'true');
		}

		// Focus first input
		const firstInput = this.modal.querySelector('input[type="email"], input[type="text"]');
		if (firstInput) {
			setTimeout(() => firstInput.focus(), 300);
		}

		// Track analytics
		this.trackEvent('modal_shown');

		// Announce to screen readers
		this.announceToScreenReader('Newsletter signup form opened');
	}

	closeModal() {
		if (!this.modal) return;

		this.modal.classList.add('hidden');
		document.body.style.overflow = '';

		// Track analytics
		this.trackEvent('modal_closed');

		// Announce to screen readers
		this.announceToScreenReader('Newsletter signup form closed');
	}

	hasShownThisSession() {
		return sessionStorage.getItem('newsletter_modal_shown') === 'true';
	}

	setupFormSubmission() {
		this.form.addEventListener('submit', async (e) => {
			e.preventDefault();
			await this.handleFormSubmission(e);
		});
	}

	async handleFormSubmission(e) {
		const formData = new FormData(this.form);
		const submitButton = this.form.querySelector('button[type="submit"]');
		const loadingEl = this.element.querySelector('.newsletter-loading');

		// Validate form
		if (!this.validateForm(formData)) {
			return;
		}

		// Check honeypot
		if (this.attributes.enableHoneypot && formData.get('website')) {
			// Silent fail for spam
			this.showSuccessMessage();
			return;
		}

		// Show loading state
		this.showLoadingState(true);
		if (submitButton) {
			submitButton.disabled = true;
			submitButton.textContent = 'Subscribing...';
		}

		try {
			// Handle reCAPTCHA if enabled
			if (this.attributes.enableReCaptcha) {
				const token = await this.getRecaptchaToken();
				formData.append('recaptcha_token', token);
			}

			// Prepare submission data
			const submissionData = this.prepareSubmissionData(formData);

			// Submit to appropriate service
			const result = await this.submitToService(submissionData);

			if (result.success) {
				this.handleSubmissionSuccess(result);
			} else {
				this.handleSubmissionError(result.error || 'Subscription failed');
			}

		} catch (error) {
			console.error('Newsletter submission error:', error);
			this.handleSubmissionError('Something went wrong. Please try again.');
		} finally {
			this.showLoadingState(false);
			if (submitButton) {
				submitButton.disabled = false;
				submitButton.textContent = this.attributes.submitButtonText || 'Subscribe';
			}
		}
	}

	validateForm(formData) {
		const email = formData.get('email');
		const name = formData.get('name');

		// Email validation
		if (!email || !this.isValidEmail(email)) {
			this.showFieldError('email', 'Please enter a valid email address');
			return false;
		}

		// Name validation (if required)
		if (this.attributes.showNameField && this.attributes.requireName && !name) {
			this.showFieldError('name', 'Name is required');
			return false;
		}

		// GDPR consent validation
		if (this.attributes.enableGDPRCompliance) {
			const consent = formData.get('gdpr_consent');
			if (!consent) {
				this.showError('Please agree to receive marketing emails');
				return false;
			}
		}

		// Clear any existing errors
		this.clearErrors();
		return true;
	}

	isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	prepareSubmissionData(formData) {
		const data = {
			email: formData.get('email'),
			name: formData.get('name') || '',
			form_layout: this.layout,
			source: 'newsletter_block',
			double_optin: this.attributes.enableDoubleOptIn,
			tags: this.attributes.tags || [],
			custom_fields: {},
			metadata: {
				layout: this.layout,
				timestamp: new Date().toISOString(),
				user_agent: navigator.userAgent,
				referrer: document.referrer,
				page_url: window.location.href
			}
		};

		// Add custom fields
		this.attributes.customFields?.forEach(field => {
			const value = formData.get(field.name);
			if (value) {
				data.custom_fields[field.name] = value;
			}
		});

		// Add GDPR consent
		if (this.attributes.enableGDPRCompliance) {
			data.gdpr_consent = formData.get('gdpr_consent') === 'on';
		}

		// Add reCAPTCHA token
		const recaptchaToken = formData.get('recaptcha_token');
		if (recaptchaToken) {
			data.recaptcha_token = recaptchaToken;
		}

		return data;
	}

	async submitToService(data) {
		const service = this.attributes.emailService || 'wordpress';

		switch (service) {
			case 'mailchimp':
				return await this.submitToMailchimp(data);
			case 'convertkit':
				return await this.submitToConvertKit(data);
			case 'custom':
				return await this.submitToCustomAPI(data);
			default:
				return await this.submitToWordPress(data);
		}
	}

	async submitToWordPress(data) {
		const response = await fetch(window.tailwindStarterAjax?.ajax_url || '/wp-admin/admin-ajax.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'newsletter_signup',
				nonce: window.tailwindStarterAjax?.nonce || '',
				...data
			})
		});

		const result = await response.json();
		return result;
	}

	async submitToMailchimp(data) {
		// Note: Mailchimp requires server-side processing due to CORS
		// This would typically go through a WordPress endpoint
		return await this.submitToWordPress({
			...data,
			service: 'mailchimp',
			api_key: this.attributes.mailchimpApiKey,
			list_id: this.attributes.mailchimpListId
		});
	}

	async submitToConvertKit(data) {
		// ConvertKit API submission
		const apiKey = this.attributes.convertKitApiKey;
		const formId = this.attributes.convertKitFormId;

		if (!apiKey || !formId) {
			throw new Error('ConvertKit API key and form ID required');
		}

		const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				api_key: apiKey,
				email: data.email,
				first_name: data.name,
				tags: data.tags,
				...data.custom_fields
			})
		});

		const result = await response.json();
		
		if (result.subscription) {
			return { success: true, data: result };
		} else {
			return { success: false, error: result.message || 'Subscription failed' };
		}
	}

	async submitToCustomAPI(data) {
		const endpoint = this.attributes.customApiEndpoint;
		const method = this.attributes.customApiMethod || 'POST';

		if (!endpoint) {
			throw new Error('Custom API endpoint required');
		}

		const response = await fetch(endpoint, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		});

		const result = await response.json();
		return result;
	}

	async setupRecaptcha() {
		// Wait for reCAPTCHA to load
		if (typeof grecaptcha === 'undefined') {
			setTimeout(() => this.setupRecaptcha(), 100);
			return;
		}

		try {
			await grecaptcha.ready();
		} catch (error) {
			console.warn('reCAPTCHA failed to load:', error);
		}
	}

	async getRecaptchaToken() {
		if (typeof grecaptcha === 'undefined') {
			throw new Error('reCAPTCHA not loaded');
		}

		return await grecaptcha.execute(this.attributes.recaptchaSiteKey, {
			action: 'newsletter_signup'
		});
	}

	handleSubmissionSuccess(result) {
		// Show success message
		this.showSuccessMessage();

		// Track conversion
		this.trackEvent('subscription_success');
		this.trackConversion();

		// Redirect if enabled
		if (this.attributes.enableRedirect && this.attributes.redirectUrl) {
			setTimeout(() => {
				window.location.href = this.attributes.redirectUrl;
			}, 2000);
		}

		// Close modal if in modal layout
		if (this.layout === 'modal-popup') {
			setTimeout(() => this.closeModal(), 3000);
		}

		// Clear form
		this.form.reset();

		// Announce success to screen readers
		this.announceToScreenReader('Successfully subscribed to newsletter');
	}

	handleSubmissionError(error) {
		this.showError(error);
		this.trackEvent('subscription_error', { error });

		// Announce error to screen readers
		this.announceToScreenReader('Subscription failed. Please try again.');
	}

	showSuccessMessage() {
		const messagesContainer = this.element.querySelector('.form-messages');
		const successEl = messagesContainer?.querySelector('.success-message');
		const errorEl = messagesContainer?.querySelector('.error-message');

		if (messagesContainer && successEl) {
			messagesContainer.classList.remove('hidden');
			successEl.classList.remove('hidden');
			if (errorEl) errorEl.classList.add('hidden');

			// Hide after delay
			setTimeout(() => {
				messagesContainer.classList.add('hidden');
				successEl.classList.add('hidden');
			}, 5000);
		}
	}

	showError(message) {
		const messagesContainer = this.element.querySelector('.form-messages');
		const errorEl = messagesContainer?.querySelector('.error-message');
		const successEl = messagesContainer?.querySelector('.success-message');

		if (messagesContainer && errorEl) {
			errorEl.textContent = message;
			messagesContainer.classList.remove('hidden');
			errorEl.classList.remove('hidden');
			if (successEl) successEl.classList.add('hidden');

			// Hide after delay
			setTimeout(() => {
				messagesContainer.classList.add('hidden');
				errorEl.classList.add('hidden');
			}, 5000);
		}
	}

	showFieldError(fieldName, message) {
		const field = this.form.querySelector(`input[name="${fieldName}"]`);
		if (field) {
			field.classList.add('border-red-500', 'focus:ring-red-500');
			field.setAttribute('aria-invalid', 'true');

			// Remove error styling on input
			const removeError = () => {
				field.classList.remove('border-red-500', 'focus:ring-red-500');
				field.removeAttribute('aria-invalid');
				field.removeEventListener('input', removeError);
			};
			field.addEventListener('input', removeError);
		}

		this.showError(message);
	}

	clearErrors() {
		const fields = this.form.querySelectorAll('input');
		fields.forEach(field => {
			field.classList.remove('border-red-500', 'focus:ring-red-500');
			field.removeAttribute('aria-invalid');
		});
	}

	showLoadingState(show) {
		const loadingEl = this.element.querySelector('.newsletter-loading');
		if (loadingEl) {
			loadingEl.classList.toggle('hidden', !show);
		}
	}

	onInputFocus(input) {
		input.parentElement?.classList.add('focused');
	}

	onInputBlur(input) {
		input.parentElement?.classList.remove('focused');
	}

	onInputChange(input) {
		// Real-time validation
		if (input.type === 'email' && input.value) {
			const isValid = this.isValidEmail(input.value);
			input.classList.toggle('border-red-500', !isValid);
			input.classList.toggle('border-green-500', isValid);
		}
	}

	addAnimation() {
		// Add entrance animation
		if (this.attributes.animationType === 'slideInUp') {
			this.element.style.transform = 'translateY(20px)';
			this.element.style.opacity = '0';
			this.element.style.transition = 'all 0.6s ease-out';

			// Trigger animation when in view
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.style.transform = 'translateY(0)';
						entry.target.style.opacity = '1';
						observer.unobserve(entry.target);
					}
				});
			}, { threshold: 0.1 });

			observer.observe(this.element);
		}
	}

	trackEvent(eventName, data = {}) {
		// Google Analytics
		if (typeof gtag !== 'undefined') {
			gtag('event', eventName, {
				event_category: 'newsletter',
				event_label: this.layout,
				...data
			});
		}

		// Facebook Pixel
		if (typeof fbq !== 'undefined') {
			fbq('track', 'Lead', {
				content_name: 'Newsletter Signup',
				content_category: this.layout
			});
		}

		// Custom analytics
		if (window.newsletterAnalytics) {
			window.newsletterAnalytics(eventName, {
				layout: this.layout,
				...data
			});
		}
	}

	trackConversion() {
		const goal = this.attributes.conversionGoal || 'newsletter_signup';
		
		// Google Analytics conversion
		if (typeof gtag !== 'undefined') {
			gtag('event', 'conversion', {
				send_to: goal
			});
		}

		// Track as custom event
		this.trackEvent('conversion', { goal });
	}

	announceToScreenReader(message) {
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

// Initialize all newsletter signup blocks when DOM is ready
function initNewsletterSignupBlocks() {
	const blocks = document.querySelectorAll('.wp-block-tailwind-starter-newsletter-signup');
	
	blocks.forEach(block => {
		if (!block.dataset.initialized) {
			new NewsletterSignupManager(block);
			block.dataset.initialized = 'true';
		}
	});
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initNewsletterSignupBlocks);
} else {
	initNewsletterSignupBlocks();
}

// Re-initialize on dynamic content load
document.addEventListener('newsletterSignupBlocksUpdate', initNewsletterSignupBlocks);

// Export for potential external use
window.NewsletterSignupManager = NewsletterSignupManager;

console.log('📧 Newsletter Signup block frontend loaded'); 