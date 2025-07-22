#!/usr/bin/env node

/**
 * Block Optimizer - Replaces Original Files Directly
 * Converts blocks to dynamic generation and replaces original frontend.js/style.scss
 */

const fs = require('fs');
const path = require('path');

// Dynamic block configurations - Top Priority blocks identified from analysis
const DYNAMIC_BLOCKS = {
    'video-section': {
        features: {
            'modal': {
                name: 'Modal/Lightbox',
                size: '25KB',
                css: `.video-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 50; display: flex; align-items: center; justify-content: center; }
.video-modal-content { position: relative; max-width: 90vw; max-height: 90vh; }
.video-modal-close { position: absolute; top: -40px; right: 0; background: none; border: none; color: white; font-size: 24px; cursor: pointer; }`,
                js: `function createVideoModal(videoUrl, title) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = \`
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <video controls autoplay class="w-full max-h-[80vh]">
                <source src="\${videoUrl}" type="video/mp4">
            </video>
        </div>
    \`;
    
    modal.querySelector('.video-modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
    return modal;
}`
            },
            'playlist': {
                name: 'Playlist Functionality',
                size: '15KB', 
                css: `.video-playlist { display: flex; gap: 1rem; }
.video-main { flex: 1; }
.video-sidebar { width: 300px; max-height: 400px; overflow-y: auto; }
.playlist-item { display: flex; gap: 0.75rem; padding: 0.75rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.2s; }
.playlist-item:hover { background: rgba(0,0,0,0.05); }
.playlist-item.active { background: rgba(59, 130, 246, 0.1); }
.playlist-thumbnail { width: 80px; height: 45px; background: #f3f4f6; border-radius: 0.25rem; overflow: hidden; }`,
                js: `function initPlaylist(container) {
    const items = Array.from(container.querySelectorAll('.playlist-item'));
    const mainVideo = container.querySelector('.main-video');
    let currentIndex = 0;
    
    items.forEach((item, index) => {
        item.onclick = () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentIndex = index;
            
            const videoUrl = item.dataset.videoUrl;
            if (videoUrl && mainVideo) {
                mainVideo.src = videoUrl;
                mainVideo.play();
            }
        };
    });
    
    if (items.length > 0) items[0].click();
}`
            },
            'quality-selector': {
                name: 'Quality Selection',
                size: '10KB',
                css: `.quality-selector { position: absolute; bottom: 50px; right: 10px; background: rgba(0,0,0,0.8); border-radius: 4px; overflow: hidden; }
.quality-option { display: block; padding: 8px 12px; color: white; text-decoration: none; font-size: 14px; border: none; background: none; cursor: pointer; }
.quality-option:hover { background: rgba(255,255,255,0.2); }
.quality-option.active { background: rgba(59, 130, 246, 0.8); }`,
                js: `function initQualitySelector(video, qualities) {
    const selector = document.createElement('div');
    selector.className = 'quality-selector';
    
    qualities.forEach(quality => {
        const option = document.createElement('button');
        option.className = 'quality-option';
        option.textContent = quality.label;
        option.onclick = () => {
            video.src = quality.src;
            selector.querySelectorAll('.quality-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        };
        selector.appendChild(option);
    });
    
    video.parentElement.appendChild(selector);
}`
            },
            'lazy-loading': {
                name: 'Lazy Loading',
                size: '8KB',
                css: `.video-lazy { background: #f0f0f0; position: relative; }
.video-lazy::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200px 100%; animation: loading 1.5s infinite; }
@keyframes loading { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }`,
                js: `function initLazyLoading(videos) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const src = video.dataset.src;
                if (src) {
                    video.src = src;
                    video.classList.remove('video-lazy');
                }
                observer.unobserve(video);
            }
        });
    }, { rootMargin: '50px' });
    
    videos.forEach(video => observer.observe(video));
}`
            }
        },
        baseSize: '45KB'
    },
    
    'newsletter-signup': {
        features: {
            'modal': {
                name: 'Modal Popup',
                size: '30KB',
                css: `.newsletter-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50; display: flex; align-items: center; justify-content: center; }
.newsletter-modal-content { background: white; border-radius: 8px; padding: 2rem; max-width: 400px; width: 90%; position: relative; }
.newsletter-modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 20px; cursor: pointer; }`,
                js: `function createNewsletterModal(content) {
    const modal = document.createElement('div');
    modal.className = 'newsletter-modal';
    modal.innerHTML = \`
        <div class="newsletter-modal-content">
            <button class="newsletter-modal-close">&times;</button>
            \${content}
        </div>
    \`;
    
    modal.querySelector('.newsletter-modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
    return modal;
}`
            },
            'validation': {
                name: 'Form Validation',
                size: '15KB',
                css: `.form-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
.form-input.error { border-color: #ef4444; box-shadow: 0 0 0 1px #ef4444; }
.form-success { color: #10b981; font-size: 0.875rem; margin-top: 0.25rem; }`,
                js: `function validateNewsletterForm(form) {
    const email = form.querySelector('input[type="email"]');
    const submit = form.querySelector('button[type="submit"]');
    
    function showError(input, message) {
        const error = input.parentNode.querySelector('.form-error') || document.createElement('div');
        error.className = 'form-error';
        error.textContent = message;
        if (!error.parentNode) input.parentNode.appendChild(error);
        input.classList.add('error');
    }
    
    function clearError(input) {
        const error = input.parentNode.querySelector('.form-error');
        if (error) error.remove();
        input.classList.remove('error');
    }
    
    function validateEmail(email) {
        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    }
    
    email.addEventListener('input', () => clearError(email));
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearError(email);
        
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            return false;
        }
        
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            return false;
        }
        
        submit.disabled = true;
        submit.textContent = 'Subscribing...';
        return true;
    });
}`
            },
            'gdpr': {
                name: 'GDPR Compliance',
                size: '12KB',
                css: `.gdpr-consent { margin-top: 1rem; font-size: 0.875rem; }
.gdpr-checkbox { margin-right: 0.5rem; }
.privacy-link { color: #3b82f6; text-decoration: underline; }`,
                js: `function initGDPRConsent(form) {
    const consentHTML = \`
        <div class="gdpr-consent">
            <label>
                <input type="checkbox" class="gdpr-checkbox" required>
                I agree to the <a href="/privacy" class="privacy-link" target="_blank">Privacy Policy</a>
            </label>
        </div>
    \`;
    
    form.insertAdjacentHTML('beforeend', consentHTML);
    
    const checkbox = form.querySelector('.gdpr-checkbox');
    const submit = form.querySelector('button[type="submit"]');
    
    checkbox.addEventListener('change', () => {
        submit.disabled = !checkbox.checked;
    });
}`
            },
            'analytics': {
                name: 'Analytics Tracking', 
                size: '8KB',
                css: ``,
                js: `function trackNewsletterEvents(form) {
    const email = form.querySelector('input[type="email"]');
    const submit = form.querySelector('button[type="submit"]');
    
    function track(event, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', event, { ...data, event_category: 'newsletter' });
        }
        if (typeof fbq !== 'undefined') {
            fbq('track', event, data);
        }
    }
    
    email.addEventListener('focus', () => track('newsletter_email_focus'));
    
    form.addEventListener('submit', (e) => {
        track('newsletter_submit', { email_domain: email.value.split('@')[1] });
    });
}`
            }
        },
        baseSize: '20KB'
    },
    
    'before-after': {
        features: {
            'auto-slide': {
                name: 'Auto Slide',
                size: '15KB',
                css: `.auto-slide-controls { text-align: center; margin-top: 1rem; }
.auto-slide-button { padding: 0.5rem 1rem; margin: 0 0.25rem; border: 1px solid #d1d5db; background: white; cursor: pointer; }
.auto-slide-button.active { background: #3b82f6; color: white; }`,
                js: `function initAutoSlide(container) {
    const slider = container.querySelector('.before-after-slider');
    const handle = container.querySelector('.slider-handle');
    let autoInterval;
    let isPlaying = false;
    
    function playAutoSlide() {
        if (isPlaying) return;
        isPlaying = true;
        
        let position = 0;
        let direction = 1;
        
        autoInterval = setInterval(() => {
            position += direction * 2;
            if (position >= 100 || position <= 0) direction *= -1;
            
            slider.style.setProperty('--position', position + '%');
        }, 50);
    }
    
    function stopAutoSlide() {
        isPlaying = false;
        clearInterval(autoInterval);
    }
    
    const controls = document.createElement('div');
    controls.className = 'auto-slide-controls';
    controls.innerHTML = \`
        <button class="auto-slide-button play-btn">Play</button>
        <button class="auto-slide-button pause-btn">Pause</button>
    \`;
    
    controls.querySelector('.play-btn').onclick = playAutoSlide;
    controls.querySelector('.pause-btn').onclick = stopAutoSlide;
    
    container.appendChild(controls);
}`
            },
            'fullscreen': {
                name: 'Fullscreen Mode',
                size: '12KB',
                css: `.fullscreen-button { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
.before-after-fullscreen { position: fixed; inset: 0; z-index: 50; background: black; display: flex; align-items: center; justify-content: center; }`,
                js: `function initFullscreen(container) {
    const button = document.createElement('button');
    button.className = 'fullscreen-button';
    button.innerHTML = '⛶';
    button.title = 'Fullscreen';
    
    button.onclick = () => {
        container.classList.add('before-after-fullscreen');
        document.body.style.overflow = 'hidden';
        
        const exitBtn = document.createElement('button');
        exitBtn.innerHTML = '✕';
        exitBtn.style.cssText = 'position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; z-index: 51;';
        exitBtn.onclick = () => {
            container.classList.remove('before-after-fullscreen');
            document.body.style.overflow = '';
            exitBtn.remove();
        };
        
        document.body.appendChild(exitBtn);
    };
    
    container.appendChild(button);
}`
            }
        },
        baseSize: '35KB'
    }
};

class BlockOptimizer {
    constructor() {
        this.blocksDir = './src/blocks';
        this.backupDir = './src/blocks-backup';
    }
    
    /**
     * Main optimization function - replaces original files
     */
    async optimizeBlock(blockName, selectedFeatures = []) {
        console.log(`\n🔧 Optimizing ${blockName}...`);
        
        const blockConfig = DYNAMIC_BLOCKS[blockName];
        if (!blockConfig) {
            console.log(`❌ Block ${blockName} is not configured for dynamic optimization`);
            return;
        }
        
        const blockPath = path.join(this.blocksDir, blockName);
        if (!fs.existsSync(blockPath)) {
            console.log(`❌ Block directory not found: ${blockPath}`);
            return;
        }
        
        // Create backup first
        await this.createBackup(blockName);
        
        // Generate optimized files
        const optimizedFiles = this.generateOptimizedFiles(blockName, selectedFeatures, blockConfig);
        
        // Replace original files
        await this.replaceOriginalFiles(blockPath, optimizedFiles);
        
        // Update block.json
        await this.updateBlockJSON(blockPath, blockName, selectedFeatures, optimizedFiles.size);
        
        console.log(`✅ ${blockName} optimized successfully!`);
        console.log(`📊 Original size: ~${this.estimateOriginalSize(blockName)}`);
        console.log(`📊 Optimized size: ${optimizedFiles.size.formatted}`);
        console.log(`💾 Savings: ${optimizedFiles.size.savings}`);
        console.log(`🔧 Features: ${selectedFeatures.join(', ')}`);
    }
    
    /**
     * Create backup of original files
     */
    async createBackup(blockName) {
        const sourcePath = path.join(this.blocksDir, blockName);
        const backupPath = path.join(this.backupDir, blockName);
        
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true });
            
            // Copy all files to backup
            const files = fs.readdirSync(sourcePath);
            files.forEach(file => {
                const sourceFile = path.join(sourcePath, file);
                const backupFile = path.join(backupPath, file);
                fs.copyFileSync(sourceFile, backupFile);
            });
            
            console.log(`📦 Backup created: ${backupPath}`);
        }
    }
    
    /**
     * Generate optimized files based on selected features
     */
    generateOptimizedFiles(blockName, selectedFeatures, blockConfig) {
        let css = `/**\n * Optimized ${blockName} styles\n * Features: ${selectedFeatures.join(', ')}\n * Generated: ${new Date().toISOString()}\n */\n\n`;
        
        css += `.wp-block-tailwind-starter-${blockName} {\n  /* Optimized block container */\n}\n\n`;
        
        let js = `/**\n * Optimized ${blockName} script\n * Features: ${selectedFeatures.join(', ')}\n * Generated: ${new Date().toISOString()}\n */\n\n`;
        
        // Add selected features only
        selectedFeatures.forEach(featureName => {
            const feature = blockConfig.features[featureName];
            if (feature) {
                css += `/* ${feature.name} - ${feature.size} */\n${feature.css}\n\n`;
                js += `/* ${feature.name} - ${feature.size} */\n${feature.js}\n\n`;
            }
        });
        
        // Add initialization code
        js += this.generateInitCode(blockName, selectedFeatures, blockConfig);
        
        // Add responsive and accessibility
        css += this.getBaseCSS();
        
        const cssSize = Buffer.byteLength(css, 'utf8');
        const jsSize = Buffer.byteLength(js, 'utf8');
        const totalSize = cssSize + jsSize;
        const originalSize = this.getOriginalSize(blockName);
        const savings = Math.round(((originalSize - totalSize) / originalSize) * 100);
        
        return {
            css,
            js,
            size: {
                css: cssSize,
                js: jsSize,  
                total: totalSize,
                formatted: this.formatBytes(totalSize),
                savings: `${savings}%`
            }
        };
    }
    
    /**
     * Generate initialization code
     */
    generateInitCode(blockName, features, blockConfig) {
        let js = `// Block initialization\ndocument.addEventListener('DOMContentLoaded', function() {\n`;
        js += `    const blocks = document.querySelectorAll('.wp-block-tailwind-starter-${blockName}');\n`;
        js += `    blocks.forEach(init${this.toPascalCase(blockName)});\n`;
        js += `});\n\n`;
        
        js += `function init${this.toPascalCase(blockName)}(block) {\n`;
        js += `    if (!block || block.dataset.initialized) return;\n\n`;
        
        // Add feature-specific initialization
        features.forEach(featureName => {
            switch(featureName) {
                case 'modal':
                    js += `    // Initialize modal triggers\n`;
                    js += `    const modalTriggers = block.querySelectorAll('[data-modal]');\n`;
                    js += `    modalTriggers.forEach(trigger => {\n`;
                    js += `        trigger.onclick = (e) => {\n`;
                    js += `            e.preventDefault();\n`;
                    if (blockName === 'video-section') {
                        js += `            createVideoModal(trigger.dataset.videoUrl, trigger.dataset.title);\n`;
                    } else {
                        js += `            createNewsletterModal(trigger.dataset.content);\n`;
                    }
                    js += `        };\n`;
                    js += `    });\n\n`;
                    break;
                    
                case 'playlist':
                    js += `    // Initialize playlist\n`;
                    js += `    const playlist = block.querySelector('.video-playlist');\n`;
                    js += `    if (playlist) initPlaylist(playlist);\n\n`;
                    break;
                    
                case 'validation':
                    js += `    // Initialize form validation\n`;
                    js += `    const form = block.querySelector('form');\n`;
                    js += `    if (form) validateNewsletterForm(form);\n\n`;
                    break;
                    
                case 'auto-slide':
                    js += `    // Initialize auto-slide\n`;
                    js += `    initAutoSlide(block);\n\n`;
                    break;
                    
                case 'fullscreen':
                    js += `    // Initialize fullscreen\n`;
                    js += `    initFullscreen(block);\n\n`;
                    break;
                    
                case 'lazy-loading':
                    js += `    // Initialize lazy loading\n`;
                    js += `    const videos = block.querySelectorAll('video[data-src]');\n`;
                    js += `    if (videos.length > 0) initLazyLoading(videos);\n\n`;
                    break;
                    
                default:
                    js += `    // Initialize ${featureName}\n`;
                    js += `    // Feature-specific code here\n\n`;
            }
        });
        
        js += `    block.dataset.initialized = 'true';\n`;
        js += `}\n`;
        
        return js;
    }
    
    /**
     * Replace original files directly
     */
    async replaceOriginalFiles(blockPath, optimizedFiles) {
        // Replace frontend.js
        const frontendPath = path.join(blockPath, 'frontend.js');
        fs.writeFileSync(frontendPath, optimizedFiles.js);
        console.log(`📝 Replaced: ${frontendPath}`);
        
        // Replace style.scss with style.css (converted)
        const stylePath = path.join(blockPath, 'style.scss');
        const newStylePath = path.join(blockPath, 'style.css');
        
        if (fs.existsSync(stylePath)) {
            fs.renameSync(stylePath, stylePath.replace('.scss', '.scss.backup'));
        }
        fs.writeFileSync(newStylePath, optimizedFiles.css);
        console.log(`📝 Created: ${newStylePath}`);
    }
    
    /**
     * Update block.json with optimization info
     */
    async updateBlockJSON(blockPath, blockName, features, sizeInfo) {
        const jsonPath = path.join(blockPath, 'block.json');
        
        if (fs.existsSync(jsonPath)) {
            const blockJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            // Update with optimization info
            blockJSON.optimized = true;
            blockJSON.optimizationDate = new Date().toISOString();
            blockJSON.selectedFeatures = features;
            blockJSON.optimizedSize = sizeInfo.formatted;
            blockJSON.sizeSavings = sizeInfo.savings;
            
            // Update style reference if changed
            if (blockJSON.style === 'file:./style-index.css') {
                blockJSON.style = 'file:./style.css';
            }
            
            fs.writeFileSync(jsonPath, JSON.stringify(blockJSON, null, 2));
            console.log(`📝 Updated: ${jsonPath}`);
        }
    }
    
    /**
     * Get base CSS for all blocks
     */
    getBaseCSS() {
        return `/* Base responsive and accessibility styles */\n@media (max-width: 768px) {\n  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  * { animation-duration: 0.01ms !important; }\n}\n\n@media print {\n  .modal, .fullscreen-button { display: none; }\n}\n`;
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
    
    getOriginalSize(blockName) {
        const sizes = {
            'video-section': 150 * 1024,
            'newsletter-signup': 140 * 1024,
            'before-after': 110 * 1024
        };
        return sizes[blockName] || 100 * 1024;
    }
    
    estimateOriginalSize(blockName) {
        return this.formatBytes(this.getOriginalSize(blockName));
    }
    
    /**
     * Show available features for a block
     */
    showFeatures(blockName) {
        const blockConfig = DYNAMIC_BLOCKS[blockName];
        if (!blockConfig) {
            console.log(`❌ Block ${blockName} is not configured for optimization`);
            return;
        }
        
        console.log(`\n🔧 Available features for ${blockName}:`);
        Object.entries(blockConfig.features).forEach(([key, feature]) => {
            console.log(`  ✓ ${key}: ${feature.name} (${feature.size})`);
        });
        console.log(`\n📊 Base size: ${blockConfig.baseSize}`);
    }
    
    /**
     * List all optimizable blocks
     */
    listBlocks() {
        console.log('\n🎯 Optimizable blocks (Dynamic Generation):');
        Object.keys(DYNAMIC_BLOCKS).forEach((blockName, index) => {
            const config = DYNAMIC_BLOCKS[blockName];
            const featureCount = Object.keys(config.features).length;
            console.log(`${index + 1}. ${blockName} (${featureCount} optional features, base: ${config.baseSize})`);
        });
    }
}

// CLI Implementation
function parseArgs() {
    const args = process.argv.slice(2);
    const config = { features: [] };
    
    args.forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.substring(2).split('=');
            if (key === 'features') {
                config[key] = value ? value.split(',').map(f => f.trim()) : [];
            } else {
                config[key] = value;
            }
        } else if (arg.startsWith('-')) {
            config[arg.substring(1)] = true;
        }
    });
    
    return config;
}

async function main() {
    const optimizer = new BlockOptimizer();
    const config = parseArgs();
    
    if (config.list || config.l) {
        optimizer.listBlocks();
        return;
    }
    
    if (config.features && config.block) {
        optimizer.showFeatures(config.block);
        return;
    }
    
    if (!config.block) {
        console.log('Usage: node optimize-block.js --block=video-section --features=modal,playlist');
        console.log('       node optimize-block.js --list (show all blocks)');
        console.log('       node optimize-block.js --block=video-section --features (show features)');
        optimizer.listBlocks();
        return;
    }
    
    await optimizer.optimizeBlock(config.block, config.features);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = BlockOptimizer;