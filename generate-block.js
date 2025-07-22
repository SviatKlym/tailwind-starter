#!/usr/bin/env node

/**
 * CLI Tool for Dynamic Block Generation
 * Usage: node generate-block.js --name=my-block --features=carousel,modal
 */

const fs = require('fs');
const path = require('path');

// Simple Node.js version of BlockBuilder for CLI usage
class SimpleBlockBuilder {
    constructor() {
        this.features = {
            'carousel': {
                css: `.carousel-container { position: relative; overflow: hidden; }
.carousel-track { display: flex; transition: transform 0.3s ease; }
.carousel-item { flex: 0 0 100%; }
.carousel-nav { position: absolute; top: 50%; z-index: 10; background: rgba(255,255,255,0.9); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.carousel-prev { left: 1rem; }
.carousel-next { right: 1rem; }
.carousel-dots { display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
.carousel-dot { width: 12px; height: 12px; border-radius: 50%; background: #d1d5db; cursor: pointer; transition: background 0.2s; }
.carousel-dot.active { background: #3b82f6; }`,
                
                js: `function initCarousel(container) {
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
    
    if (container.dataset.autoplay === 'true') {
        const interval = parseInt(container.dataset.interval) || 5000;
        setInterval(nextSlide, interval);
    }
}`
            },
            
            'modal': {
                css: `.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50; display: flex; align-items: center; justify-content: center; }
.modal-container { background: white; border-radius: 0.5rem; max-width: 90vw; max-height: 90vh; overflow: hidden; position: relative; }
.modal-header { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
.modal-body { padding: 1rem; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; }
.modal-close:hover { color: #374151; }`,
                
                js: `function createModal(options = {}) {
    const { title = '', content = '', size = 'medium' } = options;
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const sizeClasses = { small: 'max-w-sm', medium: 'max-w-md', large: 'max-w-lg' };
    
    overlay.innerHTML = \`
        <div class="modal-container \${sizeClasses[size]}">
            <div class="modal-header">
                <h3>\${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">\${content}</div>
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
}`
            },
            
            'form': {
                css: `.form-group { margin-bottom: 1rem; }
.form-input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; transition: border-color 0.2s, box-shadow 0.2s; }
.form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.form-button { padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s; }
.form-button:hover { background: #2563eb; }
.form-button:disabled { opacity: 0.6; cursor: not-allowed; }
.form-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }`,
                
                js: `function initForm(form) {
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
}`
            },
            
            'animations': {
                css: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
.animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.3s; }`,
                
                js: `function animateOnScroll(elements, animationClass = 'animate-fade-in') {
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
}`
            }
        };
    }
    
    buildBlock(config) {
        const { blockName, features, customCSS = '', customJS = '' } = config;
        
        let css = `/* Generated CSS for ${blockName} - Only includes: ${features.join(', ')} */\n\n`;
        css += `.wp-block-tailwind-starter-${blockName} {\n  /* Block container */\n}\n\n`;
        
        let js = `/* Generated JavaScript for ${blockName} */\n\n`;
        
        // Add only selected features
        features.forEach(featureName => {
            const feature = this.features[featureName];
            if (feature) {
                css += `/* ${featureName} styles */\n${feature.css}\n\n`;
                js += `/* ${featureName} functionality */\n${feature.js}\n\n`;
            }
        });
        
        // Add initialization
        js += `/* Initialization */\ndocument.addEventListener('DOMContentLoaded', function() {\n`;
        js += `    const blocks = document.querySelectorAll('.wp-block-tailwind-starter-${blockName}');\n`;
        js += `    blocks.forEach(init${this.toPascalCase(blockName)});\n`;
        js += `});\n\n`;
        
        js += `function init${this.toPascalCase(blockName)}(block) {\n`;
        js += `    if (!block || block.dataset.initialized) return;\n\n`;
        
        // Add feature initialization
        features.forEach(featureName => {
            switch(featureName) {
                case 'carousel':
                    js += `    const carousel = block.querySelector('.carousel-container');\n`;
                    js += `    if (carousel) initCarousel(carousel);\n\n`;
                    break;
                case 'form':
                    js += `    const form = block.querySelector('form');\n`;
                    js += `    if (form) initForm(form);\n\n`;
                    break;
                case 'animations':
                    js += `    const animateElements = block.querySelectorAll('.animate-on-scroll');\n`;
                    js += `    if (animateElements.length > 0) animateOnScroll(animateElements);\n\n`;
                    break;
                case 'modal':
                    js += `    const modalTriggers = block.querySelectorAll('[data-modal]');\n`;
                    js += `    modalTriggers.forEach(trigger => {\n`;
                    js += `        trigger.addEventListener('click', (e) => {\n`;
                    js += `            e.preventDefault();\n`;
                    js += `            createModal({ title: trigger.dataset.modalTitle, content: trigger.dataset.modalContent });\n`;
                    js += `        });\n`;
                    js += `    });\n\n`;
                    break;
            }
        });
        
        js += `    block.dataset.initialized = 'true';\n`;
        js += `}\n`;
        
        // Add custom CSS/JS
        if (customCSS) css += `\n/* Custom CSS */\n${customCSS}\n`;
        if (customJS) js += `\n/* Custom JavaScript */\n${customJS}\n`;
        
        const cssSize = Buffer.byteLength(css, 'utf8');
        const jsSize = Buffer.byteLength(js, 'utf8');
        
        return {
            css,
            js,
            size: {
                css: cssSize,
                js: jsSize,
                total: cssSize + jsSize,
                formatted: this.formatBytes(cssSize + jsSize)
            }
        };
    }
    
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
}

// CLI Implementation
function parseArgs() {
    const args = process.argv.slice(2);
    const config = {};
    
    args.forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.substring(2).split('=');
            if (key === 'features') {
                config[key] = value.split(',').map(f => f.trim());
            } else {
                config[key] = value;
            }
        }
    });
    
    return config;
}

function main() {
    const config = parseArgs();
    
    // Handle JSON config from WordPress
    if (process.argv[2] && process.argv[2].startsWith('{')) {
        try {
            Object.assign(config, JSON.parse(process.argv[2]));
        } catch (e) {
            console.error('Invalid JSON config:', e.message);
            process.exit(1);
        }
    }
    
    if (!config.name && !config.blockName) {
        console.log('Usage: node generate-block.js --name=my-block --features=carousel,modal');
        console.log('Available features: carousel, modal, form, animations');
        process.exit(1);
    }
    
    const blockName = config.name || config.blockName;
    const features = config.features || ['form'];
    
    console.log(`\\n🚀 Generating optimized block: ${blockName}`);
    console.log(`📦 Features: ${features.join(', ')}`);
    
    const builder = new SimpleBlockBuilder();
    const result = builder.buildBlock({
        blockName,
        features,
        customCSS: config.customCSS || '',
        customJS: config.customJS || ''
    });
    
    // Create output directory
    const outputDir = `./optimized-blocks/${blockName}`;
    if (!fs.existsSync('./optimized-blocks')) {
        fs.mkdirSync('./optimized-blocks');
    }
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    // Write files
    fs.writeFileSync(path.join(outputDir, 'style.css'), result.css);
    fs.writeFileSync(path.join(outputDir, 'frontend.js'), result.js);
    
    // Create block.json
    const blockJSON = {
        "$schema": "https://schemas.wp.org/trunk/block.json",
        "apiVersion": 3,
        "name": `tailwind-starter/${blockName}`,
        "title": blockName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        "category": "tailwind-starter",
        "description": `Optimized ${blockName} block with features: ${features.join(', ')}`,
        "supports": { "html": false },
        "style": "file:./style.css",
        "viewScript": "file:./frontend.js",
        "optimized": true,
        "features": features,
        "generatedSize": result.size.formatted
    };
    
    fs.writeFileSync(path.join(outputDir, 'block.json'), JSON.stringify(blockJSON, null, 2));
    
    console.log(`\\n✅ Generated successfully!`);
    console.log(`📁 Output: ${outputDir}/`);
    console.log(`📊 Total size: ${result.size.formatted} (CSS: ${builder.formatBytes(result.size.css)}, JS: ${builder.formatBytes(result.size.js)})`);
    console.log(`\\n📄 Files created:`);
    console.log(`   - ${outputDir}/style.css`);
    console.log(`   - ${outputDir}/frontend.js`);  
    console.log(`   - ${outputDir}/block.json`);
    
    // Compare with typical sizes
    const typicalSize = features.length * 150; // Estimate 150KB per feature typically
    const savings = Math.round(((typicalSize * 1024 - result.size.total) / (typicalSize * 1024)) * 100);
    
    console.log(`\\n💾 Size comparison:`);
    console.log(`   Traditional: ~${typicalSize}KB`);
    console.log(`   Optimized: ${result.size.formatted}`);
    console.log(`   Savings: ${savings}% 🎉`);
}

if (require.main === module) {
    main();
}

module.exports = SimpleBlockBuilder;