<?php
namespace Gutenberg_Tailwind_Starter;

defined( 'ABSPATH' ) || exit;

class BlockPatterns {
    public function __construct() {
        add_action( 'init', [ $this, 'register_pattern_categories' ] );
        add_action( 'init', [ $this, 'register_patterns' ] );
    }

    /**
     * Register custom pattern categories
     */
    public function register_pattern_categories() {
        register_block_pattern_category( 'tailwind-starter-heroes', [
            'label' => __( 'Heroes', 'tailwind-starter' )
        ] );
        
        register_block_pattern_category( 'tailwind-starter-features', [
            'label' => __( 'Features', 'tailwind-starter' )
        ] );
        
        register_block_pattern_category( 'tailwind-starter-testimonials', [
            'label' => __( 'Testimonials', 'tailwind-starter' )
        ] );
        
        register_block_pattern_category( 'tailwind-starter-pricing', [
            'label' => __( 'Pricing', 'tailwind-starter' )
        ] );
        
        register_block_pattern_category( 'tailwind-starter-cta', [
            'label' => __( 'Call to Action', 'tailwind-starter' )
        ] );
        
        register_block_pattern_category( 'tailwind-starter-pages', [
            'label' => __( 'Full Pages', 'tailwind-starter' )
        ] );
    }

    /**
     * Register block patterns
     */
    public function register_patterns() {
        // Hero with Features Pattern
        register_block_pattern(
            'tailwind-starter/hero-with-features',
            [
                'title'       => __( 'Hero with Features', 'tailwind-starter' ),
                'description' => __( 'A hero section followed by a feature grid', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-heroes' ],
                'content'     => '<!-- wp:tailwind-starter/hero-section {"heading":"Build Amazing Websites","subheading":"With Our Powerful Gutenberg Blocks","buttonText":"Get Started","buttonUrl":"#","backgroundType":"gradient","gradientStart":"#3b82f6","gradientEnd":"#8b5cf6"} /-->

<!-- wp:tailwind-starter/feature-grid {"features":[{"title":"Lightning Fast","description":"Optimized for speed and performance","icon":"lightning"},{"title":"Mobile First","description":"Responsive design that works everywhere","icon":"mobile"},{"title":"SEO Ready","description":"Built with search engines in mind","icon":"search"}]} /-->'
            ]
        );

        // Pricing with CTA Pattern
        register_block_pattern(
            'tailwind-starter/pricing-with-cta',
            [
                'title'       => __( 'Pricing with CTA', 'tailwind-starter' ),
                'description' => __( 'Pricing table followed by a call to action', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-pricing' ],
                'content'     => '<!-- wp:tailwind-starter/pricing-table /-->

<!-- wp:tailwind-starter/cta-section {"heading":"Ready to Get Started?","description":"Join thousands of happy customers","buttonText":"Start Free Trial","style":"centered"} /-->'
            ]
        );

        // Testimonial Showcase Pattern
        register_block_pattern(
            'tailwind-starter/testimonial-showcase-pattern',
            [
                'title'       => __( 'Customer Testimonials', 'tailwind-starter' ),
                'description' => __( 'Showcase customer testimonials with stats', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-testimonials' ],
                'content'     => '<!-- wp:tailwind-starter/stats-display {"stats":[{"number":"10,000+","label":"Happy Customers"},{"number":"99%","label":"Satisfaction Rate"},{"number":"24/7","label":"Support"}]} /-->

<!-- wp:tailwind-starter/testimonial-showcase /-->'
            ]
        );

        // Process Steps with Video Pattern
        register_block_pattern(
            'tailwind-starter/process-with-video',
            [
                'title'       => __( 'Process Steps with Video', 'tailwind-starter' ),
                'description' => __( 'Show your process with an explainer video', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-features' ],
                'content'     => '<!-- wp:tailwind-starter/process-steps {"steps":[{"title":"Sign Up","description":"Create your account in seconds"},{"title":"Customize","description":"Choose your preferences"},{"title":"Launch","description":"Go live with one click"}]} /-->

<!-- wp:tailwind-starter/video-section {"videoUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","heading":"See How It Works"} /-->'
            ]
        );

        // Complete Landing Page Pattern
        register_block_pattern(
            'tailwind-starter/landing-page',
            [
                'title'       => __( 'Complete Landing Page', 'tailwind-starter' ),
                'description' => __( 'A full landing page layout with all sections', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-pages' ],
                'content'     => '<!-- wp:tailwind-starter/hero-with-cta {"heading":"Welcome to the Future","subheading":"Build stunning websites with ease","primaryButtonText":"Get Started","secondaryButtonText":"Learn More","backgroundType":"image"} /-->

<!-- wp:tailwind-starter/integration-logos {"heading":"Trusted by Industry Leaders"} /-->

<!-- wp:tailwind-starter/feature-grid {"heading":"Why Choose Us","features":[{"title":"Easy to Use","description":"No coding required","icon":"cursor-click"},{"title":"Fully Responsive","description":"Works on all devices","icon":"device-mobile"},{"title":"SEO Optimized","description":"Rank higher in search","icon":"search-circle"},{"title":"Fast Loading","description":"Lightning quick performance","icon":"lightning-bolt"},{"title":"Secure","description":"Built with security in mind","icon":"shield-check"},{"title":"Support","description":"24/7 customer support","icon":"support"}]} /-->

<!-- wp:tailwind-starter/before-after {"sectionTitle":"See the Transformation","layout":"slider-comparison"} /-->

<!-- wp:tailwind-starter/content-slider {"heading":"What Our Customers Say"} /-->

<!-- wp:tailwind-starter/stats-display {"heading":"By the Numbers","stats":[{"number":"50,000+","label":"Active Users"},{"number":"4.9/5","label":"Average Rating"},{"number":"99.9%","label":"Uptime"},{"number":"24/7","label":"Support"}]} /-->

<!-- wp:tailwind-starter/pricing-table {"heading":"Choose Your Plan"} /-->

<!-- wp:tailwind-starter/faq-accordion {"heading":"Frequently Asked Questions"} /-->

<!-- wp:tailwind-starter/team-members {"heading":"Meet Our Team"} /-->

<!-- wp:tailwind-starter/newsletter-signup {"heading":"Stay Updated","description":"Get the latest news and updates"} /-->

<!-- wp:tailwind-starter/cta-section {"heading":"Ready to Start Building?","description":"Join thousands of satisfied customers","buttonText":"Get Started Now","style":"gradient"} /-->'
            ]
        );

        // About Page Pattern
        register_block_pattern(
            'tailwind-starter/about-page',
            [
                'title'       => __( 'About Us Page', 'tailwind-starter' ),
                'description' => __( 'Complete about page layout', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-pages' ],
                'content'     => '<!-- wp:tailwind-starter/hero-section {"heading":"About Our Company","subheading":"Building the future of web development","backgroundType":"gradient"} /-->

<!-- wp:tailwind-starter/stats-display {"stats":[{"number":"2015","label":"Founded"},{"number":"100+","label":"Team Members"},{"number":"50+","label":"Countries"}]} /-->

<!-- wp:tailwind-starter/process-steps {"heading":"Our Journey","steps":[{"title":"2015","description":"Company founded with a vision"},{"title":"2018","description":"Reached 10,000 customers"},{"title":"2020","description":"Expanded globally"},{"title":"2023","description":"Leading the industry"}]} /-->

<!-- wp:tailwind-starter/team-members {"heading":"Leadership Team"} /-->

<!-- wp:tailwind-starter/testimonial-showcase {"heading":"What People Say About Us"} /-->

<!-- wp:tailwind-starter/cta-section {"heading":"Join Our Mission","buttonText":"View Open Positions"} /-->'
            ]
        );

        // Services Page Pattern
        register_block_pattern(
            'tailwind-starter/services-page',
            [
                'title'       => __( 'Services Page', 'tailwind-starter' ),
                'description' => __( 'Showcase your services', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-pages' ],
                'content'     => '<!-- wp:tailwind-starter/hero-section {"heading":"Our Services","subheading":"Everything you need to succeed"} /-->

<!-- wp:tailwind-starter/feature-grid {"columns":2,"features":[{"title":"Web Development","description":"Custom websites built to your specifications","icon":"code"},{"title":"App Development","description":"Native and cross-platform mobile apps","icon":"device-mobile"},{"title":"UI/UX Design","description":"Beautiful and functional designs","icon":"color-swatch"},{"title":"Digital Marketing","description":"Reach your target audience effectively","icon":"speakerphone"}]} /-->

<!-- wp:tailwind-starter/process-steps {"heading":"How We Work"} /-->

<!-- wp:tailwind-starter/before-after {"sectionTitle":"Results That Speak"} /-->

<!-- wp:tailwind-starter/pricing-table {"heading":"Service Packages"} /-->

<!-- wp:tailwind-starter/faq-accordion {"heading":"Common Questions"} /-->

<!-- wp:tailwind-starter/cta-section {"heading":"Let\'s Work Together","buttonText":"Get a Quote"} /-->'
            ]
        );

        // Blog/News Section Pattern
        register_block_pattern(
            'tailwind-starter/blog-section',
            [
                'title'       => __( 'Blog Section', 'tailwind-starter' ),
                'description' => __( 'Display recent posts with newsletter signup', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-features' ],
                'content'     => '<!-- wp:tailwind-starter/recent-posts {"heading":"Latest from Our Blog","postsToShow":3} /-->

<!-- wp:tailwind-starter/newsletter-signup {"heading":"Never Miss an Update","description":"Subscribe to our newsletter for the latest news and insights"} /-->'
            ]
        );

        // Contact Section Pattern
        register_block_pattern(
            'tailwind-starter/contact-section',
            [
                'title'       => __( 'Contact Section', 'tailwind-starter' ),
                'description' => __( 'Contact information with social proof', 'tailwind-starter' ),
                'categories'  => [ 'tailwind-starter-cta' ],
                'content'     => '<!-- wp:tailwind-starter/social-proof {"heading":"Get in Touch"} /-->

<!-- wp:group {"backgroundColor":"gray-50","align":"full"} -->
<div class="wp-block-group alignfull has-gray-50-background-color has-background">
<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:heading {"level":3} -->
<h3>Contact Information</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Email:</strong> hello@example.com<br><strong>Phone:</strong> (555) 123-4567<br><strong>Address:</strong> 123 Main St, City, State 12345</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:heading {"level":3} -->
<h3>Business Hours</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM<br>Sunday: Closed</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->'
            ]
        );
    }
}

// Initialize the class
new BlockPatterns();