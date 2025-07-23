<?php
/**
 * Newsletter Signup Block - Server-side render template
 * 
 * @param array    $attributes Block attributes
 * @param string   $content    Block default content
 * @param WP_Block $block      Block instance
 * 
 * @package TailwindStarter
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Process newsletter subscription
 * This function handles the actual subscription logic
 */
if (!function_exists('process_newsletter_subscription')) {
    function process_newsletter_subscription($email, $name, $attributes) {
        $email_service = $attributes['emailService'] ?? 'wordpress';
        
        // Default WordPress handling - store in options table or custom table
        if ($email_service === 'wordpress') {
            
            // Check if email already exists
            $subscribers = get_option('newsletter_subscribers', []);
            if (in_array($email, array_column($subscribers, 'email'))) {
                return [
                    'success' => false,
                    'message' => 'This email is already subscribed.'
                ];
            }
            
            // Add new subscriber
            $subscribers[] = [
                'email' => $email,
                'name' => $name,
                'date_subscribed' => current_time('mysql'),
                'status' => 'active'
            ];
            
            update_option('newsletter_subscribers', $subscribers);
            
            // Optional: Send confirmation email
            $subject = 'Welcome to our newsletter!';
            $message = "Hi " . ($name ?: 'there') . ",\n\nThank you for subscribing to our newsletter!\n\nBest regards,\nThe Team";
            wp_mail($email, $subject, $message);
            
            return ['success' => true];
            
        } elseif ($email_service === 'mailchimp' && !empty($attributes['mailchimpApiKey']) && !empty($attributes['mailchimpListId'])) {
            
            // Mailchimp integration (requires API implementation)
            // This would be implemented with Mailchimp API calls
            return [
                'success' => false,
                'message' => 'Mailchimp integration not yet implemented.'
            ];
            
        } elseif ($email_service === 'convertkit' && !empty($attributes['convertKitApiKey']) && !empty($attributes['convertKitFormId'])) {
            
            // ConvertKit integration (requires API implementation)
            return [
                'success' => false,
                'message' => 'ConvertKit integration not yet implemented.'
            ];
            
        } else {
            
            // Fallback to WordPress
            return process_newsletter_subscription($email, $name, array_merge($attributes, ['emailService' => 'wordpress']));
        }
    }
}

// Extract and set default values
$layout = $attributes['layout'] ?? 'inline-form';
$title = $attributes['title'] ?? 'Stay Updated';
$subtitle = $attributes['subtitle'] ?? 'Get the latest news and updates delivered to your inbox';
$show_title = $attributes['showTitle'] ?? true;
$show_subtitle = $attributes['showSubtitle'] ?? true;
$email_placeholder = $attributes['emailPlaceholder'] ?? 'Enter your email address';
$name_placeholder = $attributes['namePlaceholder'] ?? 'Enter your name';
$submit_button_text = $attributes['submitButtonText'] ?? 'Subscribe';
$success_message = $attributes['successMessage'] ?? 'Thank you for subscribing! Check your email to confirm.';
$error_message = $attributes['errorMessage'] ?? 'Something went wrong. Please try again.';
$privacy_text = $attributes['privacyText'] ?? 'We respect your privacy. Unsubscribe at any time.';
$show_privacy_text = $attributes['showPrivacyText'] ?? true;
$show_name_field = $attributes['showNameField'] ?? false;
$require_name = $attributes['requireName'] ?? false;
$form_alignment = $attributes['formAlignment'] ?? 'left';
$button_style = $attributes['buttonStyle'] ?? 'primary';
$button_size = $attributes['buttonSize'] ?? 'medium';
$input_style = $attributes['inputStyle'] ?? 'modern';
$form_layout = $attributes['formLayout'] ?? 'horizontal';
$enable_icon = $attributes['enableIcon'] ?? true;
$enable_honeypot = $attributes['enableHoneypot'] ?? true;
$enable_gdpr = $attributes['enableGDPRCompliance'] ?? false;
$gdpr_text = $attributes['gdprText'] ?? 'I agree to receive marketing emails';
$settings = $attributes['settings'] ?? [];

// Generate unique form ID for this block instance
$form_id = 'newsletter-signup-' . wp_rand(1000, 9999);

// Handle form submission
$form_status = '';
$form_message = '';
if (isset($_POST['newsletter_signup_submit']) && isset($_POST['form_id']) && $_POST['form_id'] === $form_id) {
    // Verify nonce for security
    if (wp_verify_nonce($_POST['newsletter_nonce'], 'newsletter_signup_' . $form_id)) {
        
        // Honeypot check (bot detection)
        if ($enable_honeypot && !empty($_POST['website'])) {
            $form_status = 'error';
            $form_message = 'Spam detected.';
        } else {
            
            // Validate and sanitize input
            $email = sanitize_email($_POST['email'] ?? '');
            $name = sanitize_text_field($_POST['name'] ?? '');
            
            // Basic validation
            if (empty($email) || !is_email($email)) {
                $form_status = 'error';
                $form_message = 'Please enter a valid email address.';
            } elseif ($require_name && empty($name)) {
                $form_status = 'error';
                $form_message = 'Name is required.';
            } elseif ($enable_gdpr && empty($_POST['gdpr_consent'])) {
                $form_status = 'error';
                $form_message = 'You must agree to receive marketing emails.';
            } else {
                
                // Process the subscription
                // This is where you would integrate with your email service
                $subscription_result = process_newsletter_subscription($email, $name, $attributes);
                
                if ($subscription_result['success']) {
                    $form_status = 'success';
                    $form_message = $success_message;
                    
                    // Optional: Redirect after successful submission
                    if (!empty($attributes['enableRedirect']) && !empty($attributes['redirectUrl'])) {
                        wp_redirect($attributes['redirectUrl']);
                        exit;
                    }
                } else {
                    $form_status = 'error';
                    $form_message = $subscription_result['message'] ?? $error_message;
                }
            }
        }
    } else {
        $form_status = 'error';
        $form_message = 'Security verification failed. Please try again.';
    }
}

// Generate CSS classes from settings
$wrapper_classes = ['newsletter-signup-block', 'layout-' . esc_attr($layout), 'form-alignment-' . esc_attr($form_alignment)];
if (isset($settings['backgroundColor'])) {
    $wrapper_classes[] = esc_attr($settings['backgroundColor']);
}
if (isset($settings['textColor'])) {
    $wrapper_classes[] = esc_attr($settings['textColor']);
}

// Form classes
$form_classes = ['newsletter-form'];
if ($form_layout === 'vertical') {
    $form_classes[] = 'form-vertical';
} else {
    $form_classes[] = 'form-horizontal';
}

// Button classes
$button_classes = ['submit-button', 'button-' . esc_attr($button_style), 'button-' . esc_attr($button_size)];

// Input classes
$input_classes = ['form-input', 'input-' . esc_attr($input_style)];
?>

<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>">
    <?php if ($show_title || $show_subtitle): ?>
        <div class="form-header mb-6">
            <?php if ($show_title): ?>
                <h3 class="form-title text-2xl font-bold mb-2">
                    <?php echo esc_html($title); ?>
                </h3>
            <?php endif; ?>
            <?php if ($show_subtitle): ?>
                <p class="form-subtitle text-gray-600">
                    <?php echo esc_html($subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <?php if ($form_status): ?>
        <div class="form-message mb-4 p-4 rounded-lg <?php echo $form_status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'; ?>">
            <?php echo esc_html($form_message); ?>
        </div>
    <?php endif; ?>
    
    <?php if ($form_status !== 'success'): ?>
        <form method="post" class="<?php echo esc_attr(implode(' ', $form_classes)); ?>">
            <?php wp_nonce_field('newsletter_signup_' . $form_id, 'newsletter_nonce'); ?>
            <input type="hidden" name="form_id" value="<?php echo esc_attr($form_id); ?>">
            
            <?php if ($enable_honeypot): ?>
                <!-- Honeypot field for spam protection -->
                <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off">
            <?php endif; ?>
            
            <div class="form-fields <?php echo $form_layout === 'horizontal' ? 'flex gap-4' : 'space-y-4'; ?>">
                <?php if ($show_name_field): ?>
                    <div class="name-field <?php echo $form_layout === 'horizontal' ? 'flex-1' : 'w-full'; ?>">
                        <label for="name-<?php echo esc_attr($form_id); ?>" class="sr-only">Name</label>
                        <input 
                            type="text" 
                            id="name-<?php echo esc_attr($form_id); ?>"
                            name="name" 
                            placeholder="<?php echo esc_attr($name_placeholder); ?>"
                            class="<?php echo esc_attr(implode(' ', $input_classes)); ?> w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            <?php echo $require_name ? 'required' : ''; ?>
                            value="<?php echo isset($_POST['name']) ? esc_attr($_POST['name']) : ''; ?>"
                        >
                    </div>
                <?php endif; ?>
                
                <div class="email-field <?php echo $form_layout === 'horizontal' ? 'flex-1' : 'w-full'; ?>">
                    <label for="email-<?php echo esc_attr($form_id); ?>" class="sr-only">Email Address</label>
                    <div class="relative">
                        <?php if ($enable_icon): ?>
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                </svg>
                            </div>
                        <?php endif; ?>
                        <input 
                            type="email" 
                            id="email-<?php echo esc_attr($form_id); ?>"
                            name="email" 
                            placeholder="<?php echo esc_attr($email_placeholder); ?>"
                            class="<?php echo esc_attr(implode(' ', $input_classes)); ?> w-full <?php echo $enable_icon ? 'pl-10' : 'pl-4'; ?> pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            value="<?php echo isset($_POST['email']) ? esc_attr($_POST['email']) : ''; ?>"
                        >
                    </div>
                </div>
                
                <div class="submit-field <?php echo $form_layout === 'horizontal' ? 'flex-shrink-0' : 'w-full'; ?>">
                    <button 
                        type="submit" 
                        name="newsletter_signup_submit"
                        class="<?php echo esc_attr(implode(' ', $button_classes)); ?> w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <?php echo esc_html($submit_button_text); ?>
                    </button>
                </div>
            </div>
            
            <?php if ($enable_gdpr): ?>
                <div class="gdpr-field mt-4">
                    <label class="flex items-start">
                        <input 
                            type="checkbox" 
                            name="gdpr_consent" 
                            value="1"
                            class="mt-1 mr-2"
                            required
                            <?php checked(isset($_POST['gdpr_consent'])); ?>
                        >
                        <span class="text-sm text-gray-600">
                            <?php echo esc_html($gdpr_text); ?>
                        </span>
                    </label>
                </div>
            <?php endif; ?>
            
            <?php if ($show_privacy_text): ?>
                <div class="privacy-text mt-4">
                    <p class="text-sm text-gray-500">
                        <?php echo esc_html($privacy_text); ?>
                    </p>
                </div>
            <?php endif; ?>
        </form>
    <?php endif; ?>
</div>