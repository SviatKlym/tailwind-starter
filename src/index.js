/**
 * Main entry point for theme JavaScript
 * Block registration is handled by AssetController.php using register_block_type()
 * These imports are needed for wp-scripts build to create the block assets
 */

// Import all custom blocks (needed for wp-scripts build process)
import './blocks/hero-section/index.js';
import './blocks/cta-section/index.js';
import './blocks/feature-grid/index.js';
import './blocks/hero-with-cta/index.js';
import './blocks/pricing-table/index.js';
import './blocks/social-proof/index.js';
import './blocks/video-section/index.js';
import './blocks/newsletter-signup/index.js';
import './blocks/before-after/index.js';
import './blocks/content-slider/index.js';
import './blocks/faq-accordion/index.js';
import './blocks/integration-logos/index.js';
import './blocks/process-steps/index.js';
import './blocks/recent-posts/index.js';
import './blocks/stats-display/index.js';
import './blocks/team-members/index.js';
import './blocks/testimonial-showcase/index.js';

// Import core block enhancements
import './blocks/core-enhancements/index.js';

console.log('🚀 Tailwind Starter theme JavaScript loaded')