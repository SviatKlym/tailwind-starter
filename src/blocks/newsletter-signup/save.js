import { useBlockProps, RichText } from '@wordpress/block-editor';
import { generateAllClasses } from '../../utils/visual-controls.js';

export default function save({ attributes }) {
	const {
		layout,
		title,
		subtitle,
		showTitle,
		showSubtitle,
		emailPlaceholder,
		namePlaceholder,
		submitButtonText,
		successMessage,
		errorMessage,
		privacyText,
		showPrivacyText,
		showNameField,
		requireName,
		formAlignment,
		buttonStyle,
		buttonSize,
		inputStyle,
		formLayout,
		enableIcon,
		iconType,
		backgroundColor,
		textColor,
		accentColor,
		borderRadius,
		enableShadow,
		enableAnimation,
		animationType,
		modalTrigger,
		modalDelay,
		scrollPercentage,
		exitIntent,
		modalOverlayOpacity,
		enableCloseButton,
		enableEscapeKey,
		showOncePerSession,
		emailService,
		mailchimpApiKey,
		mailchimpListId,
		convertKitApiKey,
		convertKitFormId,
		customApiEndpoint,
		customApiMethod,
		enableDoubleOptIn,
		enableGDPRCompliance,
		gdprText,
		enableHoneypot,
		enableReCaptcha,
		recaptchaSiteKey,
		redirectUrl,
		enableRedirect,
		tags,
		customFields,
		enableAnalytics,
		conversionGoal,
		incentiveType,
		incentiveText,
		incentiveImage,
		showIncentive,
		socialProof,
		settings
	} = attributes;

	// Generate classes for all devices
	const allClasses = generateAllClasses(settings);

	const blockProps = useBlockProps.save({
		className: `newsletter-signup layout-${layout}`,
		'data-classes': allClasses,
		'data-attributes': JSON.stringify({
			layout,
			formAlignment,
			buttonStyle,
			buttonSize,
			inputStyle,
			formLayout,
			enableIcon,
			iconType,
			borderRadius,
			enableShadow,
			enableAnimation,
			animationType,
			modalTrigger,
			modalDelay,
			scrollPercentage,
			exitIntent,
			modalOverlayOpacity,
			enableCloseButton,
			enableEscapeKey,
			showOncePerSession,
			emailService,
			enableDoubleOptIn,
			enableGDPRCompliance,
			enableHoneypot,
			enableReCaptcha,
			recaptchaSiteKey,
			redirectUrl,
			enableRedirect,
			enableAnalytics,
			conversionGoal,
			showNameField,
			requireName
		})
	});

	const getFormAlignmentClass = () => {
		switch (formAlignment) {
			case 'left': return 'text-left';
			case 'center': return 'text-center';
			case 'right': return 'text-right';
			default: return 'text-left';
		}
	};

	const getButtonStyleClass = () => {
		switch (buttonStyle) {
			case 'primary': return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
			case 'secondary': return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600';
			case 'outline': return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent';
			case 'ghost': return 'text-blue-600 hover:bg-blue-50 border-transparent bg-transparent';
			default: return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
		}
	};

	const getButtonSizeClass = () => {
		switch (buttonSize) {
			case 'small': return 'px-4 py-2 text-sm';
			case 'medium': return 'px-6 py-3 text-base';
			case 'large': return 'px-8 py-4 text-lg';
			default: return 'px-6 py-3 text-base';
		}
	};

	const getInputStyleClass = () => {
		const baseClass = 'w-full border focus:ring-2 focus:border-transparent transition-all duration-200 bg-white';
		switch (inputStyle) {
			case 'modern': return `${baseClass} border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500`;
			case 'minimal': return `${baseClass} border-0 border-b-2 border-gray-300 rounded-none px-2 py-2 focus:ring-blue-500 bg-transparent`;
			case 'bordered': return `${baseClass} border-2 border-gray-400 rounded-md px-3 py-2 focus:ring-blue-500`;
			default: return `${baseClass} border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500`;
		}
	};

	const renderIcon = (iconType, className = 'text-2xl') => {
		switch (iconType) {
			case 'email':
				return <span className={className} aria-hidden="true">📧</span>;
			case 'arrow':
				return <span className={className} aria-hidden="true">→</span>;
			case 'check':
				return <span className={className} aria-hidden="true">✓</span>;
			default:
				return <span className={className} aria-hidden="true">📧</span>;
		}
	};

	const renderFormFields = () => {
		const inputClasses = getInputStyleClass();
		const buttonClasses = `${getButtonStyleClass()} ${getButtonSizeClass()} font-semibold rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;
		
		return (
			<div className={`newsletter-form ${formLayout === 'horizontal' ? 'flex gap-2 sm:gap-3' : 'space-y-3'}`}>
				{showNameField && (
					<div className={formLayout === 'horizontal' ? 'flex-1' : 'w-full'}>
						<label htmlFor="newsletter-name" className="sr-only">
							{namePlaceholder}
						</label>
						<input
							type="text"
							id="newsletter-name"
							name="name"
							placeholder={namePlaceholder}
							className={inputClasses}
							required={requireName}
							aria-describedby="name-help"
						/>
					</div>
				)}

				<div className={formLayout === 'horizontal' ? 'flex-1' : 'w-full'}>
					<label htmlFor="newsletter-email" className="sr-only">
						{emailPlaceholder}
					</label>
					<input
						type="email"
						id="newsletter-email"
						name="email"
						placeholder={emailPlaceholder}
						className={inputClasses}
						required
						aria-describedby="email-help"
					/>
				</div>

				{/* Custom Fields */}
				{customFields.map((field, index) => (
					<div key={field.id} className={formLayout === 'horizontal' ? 'flex-1' : 'w-full'}>
						<label htmlFor={`newsletter-${field.name}`} className="sr-only">
							{field.label}
						</label>
						<input
							type={field.type}
							id={`newsletter-${field.name}`}
							name={field.name}
							placeholder={field.placeholder}
							className={inputClasses}
							required={field.required}
						/>
					</div>
				))}

				<div className={formLayout === 'horizontal' ? 'flex-shrink-0' : 'w-full'}>
					<button
						type="submit"
						className={`${buttonClasses} ${formLayout === 'vertical' ? 'w-full' : ''}`}
						aria-describedby="submit-help"
					>
						{enableIcon && iconType === 'arrow' && (
							<span className="mr-2" aria-hidden="true">→</span>
						)}
						{submitButtonText}
						{enableIcon && iconType === 'check' && (
							<span className="ml-2" aria-hidden="true">✓</span>
						)}
					</button>
				</div>
			</div>
		);
	};

	const renderInlineForm = () => {
		return (
			<div className={`newsletter-signup-inline ${getFormAlignmentClass()}`}>
				{(showTitle || showSubtitle) && (
					<div className="form-header mb-6">
						{showTitle && title && (
							<h3 className="text-lg font-semibold mb-2 text-gray-900">
								{title}
							</h3>
						)}
						{showSubtitle && subtitle && (
							<p className="text-gray-600 text-sm leading-relaxed">
								{subtitle}
							</p>
						)}
					</div>
				)}

				<form className="newsletter-form-container" data-layout="inline">
					{renderFormFields()}

					{enableGDPRCompliance && (
						<div className="gdpr-consent mt-4">
							<label className="flex items-start text-sm">
								<input
									type="checkbox"
									name="gdpr_consent"
									className="mt-1 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									required
								/>
								<span className="text-gray-600 leading-relaxed">{gdprText}</span>
							</label>
						</div>
					)}

					{showPrivacyText && privacyText && (
						<p className="text-xs text-gray-500 mt-3 leading-relaxed">
							{privacyText}
						</p>
					)}

					{/* Hidden fields for form processing */}
					{enableHoneypot && (
						<input
							type="text"
							name="website"
							style={{ display: 'none' }}
							tabIndex="-1"
							autoComplete="off"
						/>
					)}

					<input type="hidden" name="newsletter_action" value="subscribe" />
					<input type="hidden" name="form_layout" value={layout} />
					{tags.length > 0 && (
						<input type="hidden" name="tags" value={tags.join(',')} />
					)}
				</form>

				{/* Success/Error Messages */}
				<div className="form-messages mt-4 hidden">
					<div className="success-message bg-green-50 text-green-800 p-3 rounded-lg border border-green-200 hidden">
						{successMessage}
					</div>
					<div className="error-message bg-red-50 text-red-800 p-3 rounded-lg border border-red-200 hidden">
						{errorMessage}
					</div>
				</div>
			</div>
		);
	};

	const renderSidebarWidget = () => {
		return (
			<div className="newsletter-signup-sidebar bg-gray-50 p-4 rounded-lg">
				<div className={`text-center`}>
					{enableIcon && iconType === 'email' && (
						<div className="mb-3">
							{renderIcon('email', 'text-2xl')}
						</div>
					)}

					{showTitle && title && (
						<h4 className="font-semibold mb-2 text-gray-900 text-sm">
							{title}
						</h4>
					)}
					{showSubtitle && subtitle && (
						<p className="text-gray-600 text-xs mb-4 leading-relaxed">
							{subtitle}
						</p>
					)}

					{socialProof.enabled && (
						<p className="text-gray-500 text-xs mb-3">
							Join <strong>{socialProof.count}</strong> {socialProof.text}
						</p>
					)}

					<form className="newsletter-form-container" data-layout="sidebar">
						<div className="newsletter-form space-y-2">
							{showNameField && (
								<div>
									<label htmlFor="sidebar-name" className="sr-only">
										{namePlaceholder}
									</label>
									<input
										type="text"
										id="sidebar-name"
										name="name"
										placeholder={namePlaceholder}
										className={getInputStyleClass()}
										required={requireName}
									/>
								</div>
							)}

							<div>
								<label htmlFor="sidebar-email" className="sr-only">
									{emailPlaceholder}
								</label>
								<input
									type="email"
									id="sidebar-email"
									name="email"
									placeholder={emailPlaceholder}
									className={getInputStyleClass()}
									required
								/>
							</div>

							<button
								type="submit"
								className={`${getButtonStyleClass()} ${getButtonSizeClass()} font-semibold rounded border transition-all duration-200 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
							>
								{submitButtonText}
							</button>
						</div>

						{enableGDPRCompliance && (
							<label className="flex items-start text-xs mt-3">
								<input
									type="checkbox"
									name="gdpr_consent"
									className="mt-0.5 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									required
								/>
								<span className="text-gray-600 leading-relaxed">{gdprText}</span>
							</label>
						)}

						{showPrivacyText && privacyText && (
							<p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
								{privacyText}
							</p>
						)}

						{/* Hidden fields */}
						{enableHoneypot && (
							<input
								type="text"
								name="website"
								style={{ display: 'none' }}
								tabIndex="-1"
								autoComplete="off"
							/>
						)}
						<input type="hidden" name="newsletter_action" value="subscribe" />
						<input type="hidden" name="form_layout" value={layout} />
					</form>

					{/* Messages */}
					<div className="form-messages mt-3 hidden">
						<div className="success-message bg-green-50 text-green-700 p-2 rounded text-xs hidden">
							{successMessage}
						</div>
						<div className="error-message bg-red-50 text-red-700 p-2 rounded text-xs hidden">
							{errorMessage}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderFullSection = () => {
		return (
			<div className="newsletter-signup-full bg-blue-50 py-12 px-6 rounded-lg">
				<div className={`max-w-4xl mx-auto ${getFormAlignmentClass()}`}>
					{enableIcon && iconType === 'email' && (
						<div className="text-center mb-6">
							{renderIcon('email', 'text-6xl')}
						</div>
					)}

					{showIncentive && incentiveImage.url && (
						<div className="text-center mb-6">
							<img 
								src={incentiveImage.url} 
								alt={incentiveImage.alt}
								className="w-24 h-24 object-cover rounded-lg mx-auto shadow-lg"
								loading="lazy"
							/>
						</div>
					)}

					{showTitle && title && (
						<h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
							{title}
						</h2>
					)}
					
					{showSubtitle && subtitle && (
						<p className="text-gray-600 text-lg md:text-xl mb-6 leading-relaxed max-w-2xl mx-auto">
							{subtitle}
						</p>
					)}

					{showIncentive && incentiveText && (
						<p className="text-blue-600 font-medium mb-6 text-center">
							{incentiveText}
						</p>
					)}

					{socialProof.enabled && (
						<p className="text-gray-500 text-sm mb-8 text-center">
							Join <strong>{socialProof.count}</strong> {socialProof.text}
						</p>
					)}

					<form className="newsletter-form-container max-w-md mx-auto" data-layout="full-section">
						{renderFormFields()}

						{enableGDPRCompliance && (
							<label className="flex items-start text-sm mt-4">
								<input
									type="checkbox"
									name="gdpr_consent"
									className="mt-1 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									required
								/>
								<span className="text-gray-600 leading-relaxed">{gdprText}</span>
							</label>
						)}

						{showPrivacyText && privacyText && (
							<p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
								{privacyText}
							</p>
						)}

						{/* Hidden fields */}
						{enableHoneypot && (
							<input
								type="text"
								name="website"
								style={{ display: 'none' }}
								tabIndex="-1"
								autoComplete="off"
							/>
						)}
						<input type="hidden" name="newsletter_action" value="subscribe" />
						<input type="hidden" name="form_layout" value={layout} />
						{tags.length > 0 && (
							<input type="hidden" name="tags" value={tags.join(',')} />
						)}
					</form>

					{/* Messages */}
					<div className="form-messages mt-6 max-w-md mx-auto hidden">
						<div className="success-message bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 text-center hidden">
							{successMessage}
						</div>
						<div className="error-message bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 text-center hidden">
							{errorMessage}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderModalPopup = () => {
		return (
			<>
				{/* Modal Trigger (invisible, handled by JS) */}
				<div className="newsletter-modal-trigger" style={{ display: 'none' }}></div>
				
				{/* Modal HTML (hidden by default) */}
				<div 
					className="newsletter-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
					style={{ backdropFilter: 'blur(4px)' }}
				>
					<div className="modal-content bg-white p-6 rounded-lg max-w-md w-full mx-4 relative shadow-2xl">
						{enableCloseButton && (
							<button 
								className="modal-close absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
								aria-label="Close newsletter signup"
							>
								<span className="text-xl leading-none" aria-hidden="true">×</span>
							</button>
						)}

						<div className="text-center">
							{enableIcon && iconType === 'email' && (
								<div className="mb-4">
									{renderIcon('email', 'text-4xl')}
								</div>
							)}

							{showIncentive && incentiveImage.url && (
								<div className="mb-4">
									<img 
										src={incentiveImage.url} 
										alt={incentiveImage.alt}
										className="w-20 h-20 object-cover rounded-lg mx-auto"
										loading="lazy"
									/>
								</div>
							)}

							{showTitle && title && (
								<h3 id="modal-title" className="text-xl font-bold mb-3 text-gray-900">
									{title}
								</h3>
							)}
							
							{showSubtitle && subtitle && (
								<p className="text-gray-600 mb-4 leading-relaxed">
									{subtitle}
								</p>
							)}

							{showIncentive && incentiveText && (
								<p className="text-blue-600 font-medium mb-4">
									{incentiveText}
								</p>
							)}

							{socialProof.enabled && (
								<p className="text-gray-500 text-sm mb-4">
									Join <strong>{socialProof.count}</strong> {socialProof.text}
								</p>
							)}

							<form className="newsletter-form-container" data-layout="modal">
								<div className="newsletter-form space-y-3">
									{showNameField && (
										<div>
											<label htmlFor="modal-name" className="sr-only">
												{namePlaceholder}
											</label>
											<input
												type="text"
												id="modal-name"
												name="name"
												placeholder={namePlaceholder}
												className={getInputStyleClass()}
												required={requireName}
											/>
										</div>
									)}

									<div>
										<label htmlFor="modal-email" className="sr-only">
											{emailPlaceholder}
										</label>
										<input
											type="email"
											id="modal-email"
											name="email"
											placeholder={emailPlaceholder}
											className={getInputStyleClass()}
											required
										/>
									</div>

									<button
										type="submit"
										className={`${getButtonStyleClass()} ${getButtonSizeClass()} font-semibold rounded border transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
									>
										{submitButtonText}
									</button>
								</div>

								{enableGDPRCompliance && (
									<label className="flex items-start text-sm mt-3">
										<input
											type="checkbox"
											name="gdpr_consent"
											className="mt-1 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											required
										/>
										<span className="text-gray-600 leading-relaxed">{gdprText}</span>
									</label>
								)}

								{showPrivacyText && privacyText && (
									<p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
										{privacyText}
									</p>
								)}

								{/* Hidden fields */}
								{enableHoneypot && (
									<input
										type="text"
										name="website"
										style={{ display: 'none' }}
										tabIndex="-1"
										autoComplete="off"
									/>
								)}
								<input type="hidden" name="newsletter_action" value="subscribe" />
								<input type="hidden" name="form_layout" value={layout} />
							</form>

							{/* Messages */}
							<div className="form-messages mt-4 hidden">
								<div className="success-message bg-green-50 text-green-800 p-3 rounded-lg border border-green-200 hidden">
									{successMessage}
								</div>
								<div className="error-message bg-red-50 text-red-800 p-3 rounded-lg border border-red-200 hidden">
									{errorMessage}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};

	const renderContent = () => {
		switch (layout) {
			case 'inline-form':
				return renderInlineForm();
			case 'sidebar-widget':
				return renderSidebarWidget();
			case 'full-section':
				return renderFullSection();
			case 'modal-popup':
				return renderModalPopup();
			default:
				return renderInlineForm();
		}
	};

	return (
		<div {...blockProps}>
			{renderContent()}

			{/* reCAPTCHA */}
			{enableReCaptcha && recaptchaSiteKey && (
				<script 
					src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
					async 
					defer
				></script>
			)}

			{/* Loading State */}
			<div className="newsletter-loading hidden">
				<div className="flex items-center justify-center p-4">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
					<span className="ml-2 text-sm text-gray-600">Subscribing...</span>
				</div>
			</div>
		</div>
	);
} 