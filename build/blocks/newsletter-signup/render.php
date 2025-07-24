<?php
/**
 * newsletter-signup Block - Enhanced Server-side render template
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

// Include render helpers
require_once get_template_directory() . '/inc/utils/render-helpers.php';

// Ensure attributes is an array
$attributes = is_array($attributes) ? $attributes : [];

// Sanitize attributes
$attributes = sanitize_block_attributes($attributes);

// Prepare block wrapper with visual controls integration
$wrapper_data = prepare_block_wrapper($attributes, 'newsletter-signup-block');

// Extract block-specific attributes
$layout = $attributes['layout'] ?? 'default';
$show_section_header = $attributes['showSectionHeader'] ?? false;
$section_title = $attributes['sectionTitle'] ?? '';
$section_subtitle = $attributes['sectionSubtitle'] ?? '';

?>

<div class="<?php echo esc_attr($wrapper_data['classes']); ?>" 
     <?php echo $wrapper_data['styles'] ? 'style="' . esc_attr($wrapper_data['styles']) . '"' : ''; ?>>
    
    <?php if ($show_section_header && ($section_title || $section_subtitle)): ?>
        <div class="section-header text-center mb-12">
            <?php if ($section_title): ?>
                <h2 class="section-title text-3xl font-bold mb-4">
                    <?php echo esc_html($section_title); ?>
                </h2>
            <?php endif; ?>
            <?php if ($section_subtitle): ?>
                <p class="section-subtitle text-lg max-w-3xl mx-auto">
                    <?php echo esc_html($section_subtitle); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="newsletter-signup-content">
        <?php
        // Extract attributes
        $layout = $attributes['layout'] ?? 'inline-form';
        $title = $attributes['title'] ?? 'Stay Updated';
        $subtitle = $attributes['subtitle'] ?? 'Get the latest news and updates delivered to your inbox';
        $show_title = (bool) ($attributes['showTitle'] ?? true);
        $show_subtitle = (bool) ($attributes['showSubtitle'] ?? true);
        $email_placeholder = $attributes['emailPlaceholder'] ?? 'Enter your email address';
        $name_placeholder = $attributes['namePlaceholder'] ?? 'Enter your name';
        $submit_button_text = $attributes['submitButtonText'] ?? 'Subscribe';
        $success_message = $attributes['successMessage'] ?? 'Thank you for subscribing! Check your email to confirm.';
        $error_message = $attributes['errorMessage'] ?? 'Something went wrong. Please try again.';
        $privacy_text = $attributes['privacyText'] ?? 'We respect your privacy. Unsubscribe at any time.';
        $show_privacy_text = (bool) ($attributes['showPrivacyText'] ?? true);
        $show_name_field = (bool) ($attributes['showNameField'] ?? false);
        $require_name = (bool) ($attributes['requireName'] ?? false);
        $form_alignment = $attributes['formAlignment'] ?? 'left';
        $button_style = $attributes['buttonStyle'] ?? 'primary';
        $button_size = $attributes['buttonSize'] ?? 'medium';
        $input_style = $attributes['inputStyle'] ?? 'modern';
        $form_layout = $attributes['formLayout'] ?? 'horizontal';
        $enable_icon = (bool) ($attributes['enableIcon'] ?? true);
        $icon_type = $attributes['iconType'] ?? 'email';
        $background_color = $attributes['backgroundColor'] ?? '#f8fafc';
        $text_color = $attributes['textColor'] ?? '#1f2937';
        $accent_color = $attributes['accentColor'] ?? '#3b82f6';
        $border_radius = intval($attributes['borderRadius'] ?? 8);
        $enable_shadow = (bool) ($attributes['enableShadow'] ?? true);
        $enable_animation = (bool) ($attributes['enableAnimation'] ?? true);
        $show_incentive = (bool) ($attributes['showIncentive'] ?? false);
        $incentive_text = $attributes['incentiveText'] ?? 'Get our free guide when you subscribe!';
        $social_proof = $attributes['socialProof'] ?? ['enabled' => false, 'count' => '5,000', 'text' => 'subscribers'];
        $enable_gdpr = (bool) ($attributes['enableGDPRCompliance'] ?? false);
        $gdpr_text = $attributes['gdprText'] ?? 'I agree to receive marketing emails';
        $enable_honeypot = (bool) ($attributes['enableHoneypot'] ?? true);

        // Generate unique form ID
        $form_id = 'newsletter-form-' . wp_generate_uuid4();
        
        // Form alignment classes
        $alignment_classes = '';
        switch ($form_alignment) {
            case 'center':
                $alignment_classes = 'text-center mx-auto';
                break;
            case 'right':
                $alignment_classes = 'text-right ml-auto';
                break;
            default:
                $alignment_classes = 'text-left';
        }

        // Button style classes - colors controlled via visual controls
        $button_classes = 'newsletter-submit-btn transition-all duration-300 font-semibold rounded-lg ';
        switch ($button_style) {
            case 'primary':
                $button_classes .= 'btn-primary ';
                break;
            case 'secondary':
                $button_classes .= 'btn-secondary ';
                break;
            case 'outline':
                $button_classes .= 'btn-outline ';
                break;
            default:
                $button_classes .= 'btn-primary ';
        }

        // Button size classes
        switch ($button_size) {
            case 'small':
                $button_classes .= 'px-4 py-2 text-sm ';
                break;
            case 'large':
                $button_classes .= 'px-8 py-4 text-lg ';
                break;
            default:
                $button_classes .= 'px-6 py-3 text-base ';
        }

        // Input style classes
        $input_classes = 'newsletter-input w-full transition-all duration-300 ';
        switch ($input_style) {
            case 'modern':
                $input_classes .= 'border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-3 ';
                break;
            case 'minimal':
                $input_classes .= 'border-0 border-b-2 border-gray-300 focus:border-blue-500 bg-transparent px-0 py-2 ';
                break;
            case 'filled':
                $input_classes .= 'bg-gray-100 border border-gray-100 focus:bg-white focus:border-blue-500 rounded-lg px-4 py-3 ';
                break;
            default:
                $input_classes .= 'border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-3 ';
        }

        // Container classes
        $container_classes = 'newsletter-signup-container max-w-2xl ';
        if ($form_alignment === 'center') {
            $container_classes .= 'mx-auto text-center ';
        }
        
        if ($enable_shadow) {
            $container_classes .= 'shadow-lg ';
        }
        ?>

        <div class="<?php echo esc_attr($container_classes); ?>" 
             style="background-color: <?php echo esc_attr($background_color); ?>; color: <?php echo esc_attr($text_color); ?>; border-radius: <?php echo esc_attr($border_radius); ?>px;">
            
            <div class="newsletter-content p-8">
                
                <?php if ($enable_icon && $icon_type === 'email') : ?>
                    <div class="newsletter-icon mb-6 <?php echo $form_alignment === 'center' ? 'flex justify-center' : ''; ?>">
                        <div class="icon-container bg-blue-100 p-3 rounded-full inline-flex">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if ($show_title) : ?>
                    <h3 class="newsletter-title text-2xl font-bold mb-2 <?php echo esc_attr($alignment_classes); ?>">
                        <?php echo esc_html($title); ?>
                    </h3>
                <?php endif; ?>

                <?php if ($show_subtitle) : ?>
                    <p class="newsletter-subtitle mb-6 <?php echo esc_attr($alignment_classes); ?>">
                        <?php echo esc_html($subtitle); ?>
                    </p>
                <?php endif; ?>

                <?php if ($show_incentive && $incentive_text) : ?>
                    <div class="newsletter-incentive bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div class="flex items-center">
                            <div class="incentive-icon mr-3">
                                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <p class="text-green-800 font-medium text-sm">
                                <?php echo esc_html($incentive_text); ?>
                            </p>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if ($social_proof['enabled'] ?? false) : ?>
                    <div class="social-proof mb-6 <?php echo esc_attr($alignment_classes); ?>">
                        <p class="text-sm">
                            Join <strong><?php echo esc_html($social_proof['count']); ?></strong> <?php echo esc_html($social_proof['text']); ?>
                        </p>
                    </div>
                <?php endif; ?>

                <form class="newsletter-form" id="<?php echo esc_attr($form_id); ?>" method="post" action="#" data-newsletter-form>
                    
                    <?php if ($enable_honeypot) : ?>
                        <div style="position: absolute; left: -9999px;">
                            <input type="text" name="honeypot" tabindex="-1" autocomplete="off">
                        </div>
                    <?php endif; ?>

                    <div class="form-fields <?php echo $form_layout === 'vertical' ? 'space-y-4' : 'flex gap-4'; ?>">
                        
                        <?php if ($show_name_field) : ?>
                            <div class="name-field <?php echo $form_layout === 'vertical' ? 'w-full' : 'flex-1'; ?>">
                                <label for="<?php echo esc_attr($form_id); ?>-name" class="sr-only">Name</label>
                                <input type="text" 
                                       id="<?php echo esc_attr($form_id); ?>-name"
                                       name="subscriber_name" 
                                       placeholder="<?php echo esc_attr($name_placeholder); ?>" 
                                       class="<?php echo esc_attr($input_classes); ?>"
                                       <?php echo $require_name ? 'required' : ''; ?>>
                            </div>
                        <?php endif; ?>

                        <div class="email-field <?php echo $form_layout === 'vertical' ? 'w-full' : 'flex-1'; ?>">
                            <label for="<?php echo esc_attr($form_id); ?>-email" class="sr-only">Email</label>
                            <input type="email" 
                                   id="<?php echo esc_attr($form_id); ?>-email"
                                   name="subscriber_email" 
                                   placeholder="<?php echo esc_attr($email_placeholder); ?>" 
                                   class="<?php echo esc_attr($input_classes); ?>"
                                   required>
                        </div>

                        <div class="submit-field <?php echo $form_layout === 'vertical' ? 'w-full' : ''; ?>">
                            <button type="submit" class="<?php echo esc_attr($button_classes); ?> <?php echo $form_layout === 'vertical' ? 'w-full' : ''; ?>">
                                <span class="button-text"><?php echo esc_html($submit_button_text); ?></span>
                                <span class="button-spinner hidden">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>

                    <?php if ($enable_gdpr) : ?>
                        <div class="gdpr-field mt-4">
                            <label class="flex items-start">
                                <input type="checkbox" name="gdpr_consent" class="mt-1 mr-2" required>
                                <span class="text-sm">
                                    <?php echo esc_html($gdpr_text); ?>
                                </span>
                            </label>
                        </div>
                    <?php endif; ?>

                    <div class="form-messages mt-4">
                        <div class="success-message hidden bg-green-50 border border-green-200 rounded-lg p-4">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <p class="text-green-800 text-sm"><?php echo esc_html($success_message); ?></p>
                            </div>
                        </div>
                        
                        <div class="error-message hidden bg-red-50 border border-red-200 rounded-lg p-4">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                </svg>
                                <p class="text-red-800 text-sm"><?php echo esc_html($error_message); ?></p>
                            </div>
                        </div>
                    </div>
                </form>

                <?php if ($show_privacy_text) : ?>
                    <div class="privacy-text mt-4 <?php echo esc_attr($alignment_classes); ?>">
                        <p class="text-xs opacity-75">
                            <?php echo esc_html($privacy_text); ?>
                        </p>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('<?php echo esc_js($form_id); ?>');
            if (!form) return;
            
            const submitBtn = form.querySelector('.newsletter-submit-btn');
            const buttonText = submitBtn.querySelector('.button-text');
            const buttonSpinner = submitBtn.querySelector('.button-spinner');
            const successMessage = form.querySelector('.success-message');
            const errorMessage = form.querySelector('.error-message');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show loading state
                submitBtn.disabled = true;
                buttonText.classList.add('hidden');
                buttonSpinner.classList.remove('hidden');
                
                // Hide previous messages
                successMessage.classList.add('hidden');
                errorMessage.classList.add('hidden');
                
                // Get form data
                const formData = new FormData(form);
                formData.append('action', 'newsletter_signup');
                formData.append('nonce', '<?php echo wp_create_nonce('newsletter_signup_nonce'); ?>');
                
                // Submit via AJAX (if WordPress AJAX is available)
                if (typeof ajaxurl !== 'undefined') {
                    fetch(ajaxurl, {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            successMessage.classList.remove('hidden');
                            form.reset();
                        } else {
                            errorMessage.classList.remove('hidden');
                        }
                    })
                    .catch(error => {
                        console.error('Newsletter signup error:', error);
                        errorMessage.classList.remove('hidden');
                    })
                    .finally(() => {
                        // Reset button state
                        submitBtn.disabled = false;
                        buttonText.classList.remove('hidden');
                        buttonSpinner.classList.add('hidden');
                    });
                } else {
                    // Fallback: show success message after delay
                    setTimeout(() => {
                        successMessage.classList.remove('hidden');
                        form.reset();
                        
                        // Reset button state
                        submitBtn.disabled = false;
                        buttonText.classList.remove('hidden');
                        buttonSpinner.classList.add('hidden');
                    }, 1000);
                }
            });
        });
        </script>
    </div>
</div>
