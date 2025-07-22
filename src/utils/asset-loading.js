/**
 * Smart Asset Enqueuing Strategy
 * Loads only the scripts and styles each block actually needs
 */

class BlockAssetManager {
    constructor() {
        this.loadedAssets = new Set();
        this.blockAssets = new Map();
        this.presetAssets = new Map();
        this.assetQueue = new Map();
        this.isEditor = typeof wp !== 'undefined' && wp.blockEditor;
        
        this.init();
    }

    /**
     * Initialize asset manager
     */
    init() {
        // Register core presets
        this.registerCorePresets();
        
        // Setup block detection
        this.setupBlockDetection();
        
        // Load critical CSS immediately
        this.loadCriticalCSS();
    }

    /**
     * Register core preset assets
     */
    registerCorePresets() {
        this.presetAssets.set('base', {
            styles: ['/wp-content/themes/tailwind-starter/src/presets/styles/components.css'],
            scripts: [],
            critical: true
        });

        this.presetAssets.set('animations', {
            styles: ['/wp-content/themes/tailwind-starter/src/presets/styles/animations.css'],
            scripts: [],
            condition: () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });

        this.presetAssets.set('accessibility', {
            styles: [],
            scripts: ['/wp-content/themes/tailwind-starter/src/presets/scripts/accessibility.js'],
            critical: true
        });

        this.presetAssets.set('intersection-observer', {
            styles: [],
            scripts: ['/wp-content/themes/tailwind-starter/src/presets/scripts/intersection-observer.js'],
            dependencies: ['accessibility']
        });

        this.presetAssets.set('touch-gestures', {
            styles: [],
            scripts: ['/wp-content/themes/tailwind-starter/src/presets/scripts/touch-gestures.js'],
            dependencies: ['accessibility'],
            condition: () => 'ontouchstart' in window
        });

        this.presetAssets.set('modal-manager', {
            styles: [],
            scripts: ['/wp-content/themes/tailwind-starter/src/presets/scripts/modal-manager.js'],
            dependencies: ['accessibility']
        });
    }

    /**
     * Register block-specific assets
     */
    registerBlockAssets(blockName, config) {
        this.blockAssets.set(blockName, {
            styles: config.styles || [],
            scripts: config.scripts || [],
            presets: config.presets || [],
            condition: config.condition || (() => true),
            priority: config.priority || 'normal' // 'critical', 'high', 'normal', 'low'
        });
    }

    /**
     * Setup block detection in DOM
     */
    setupBlockDetection() {
        if (this.isEditor) {
            // In editor, load assets immediately when blocks are registered
            this.setupEditorAssetLoading();
        } else {
            // On frontend, detect blocks in DOM and load assets accordingly
            this.setupFrontendAssetLoading();
        }
    }

    /**
     * Setup editor asset loading
     */
    setupEditorAssetLoading() {
        // Load all critical presets immediately in editor
        this.loadPreset('base');
        this.loadPreset('accessibility');
        
        // Listen for block insertion
        if (wp.data && wp.data.subscribe) {
            wp.data.subscribe(() => {
                const blocks = wp.data.select('core/block-editor').getBlocks();
                this.processEditorBlocks(blocks);
            });
        }
    }

    /**
     * Setup frontend asset loading
     */
    setupFrontendAssetLoading() {
        // Load critical assets immediately
        this.loadCriticalAssets();
        
        // Detect blocks on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.detectAndLoadBlockAssets();
            });
        } else {
            this.detectAndLoadBlockAssets();
        }

        // Setup intersection observer for lazy loading non-critical blocks
        this.setupLazyBlockLoading();
    }

    /**
     * Load critical CSS immediately
     */
    loadCriticalCSS() {
        const criticalCSS = `
            .block-loading { display: flex; align-items: center; justify-content: center; padding: 2rem; }
            .block-spinner { width: 2rem; height: 2rem; border: 4px solid #e5e7eb; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
    }

    /**
     * Load critical assets
     */
    async loadCriticalAssets() {
        const criticalPresets = ['base', 'accessibility'];
        const promises = criticalPresets.map(preset => this.loadPreset(preset));
        await Promise.all(promises);
    }

    /**
     * Detect blocks in DOM and load their assets
     */
    async detectAndLoadBlockAssets() {
        const blockElements = document.querySelectorAll('[class*="wp-block-tailwind-starter-"]');
        const foundBlocks = new Set();

        blockElements.forEach(element => {
            const classes = Array.from(element.classList);
            classes.forEach(className => {
                const match = className.match(/wp-block-tailwind-starter-(.+)/);
                if (match) {
                    foundBlocks.add(match[1]);
                }
            });
        });

        // Load assets for found blocks
        const loadPromises = Array.from(foundBlocks).map(blockName => 
            this.loadBlockAssets(blockName)
        );

        await Promise.all(loadPromises);
    }

    /**
     * Setup lazy loading for blocks below the fold
     */
    setupLazyBlockLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const blockName = this.getBlockNameFromElement(entry.target);
                    if (blockName) {
                        this.loadBlockAssets(blockName);
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            rootMargin: '100px 0px' // Load when block is 100px away from viewport
        });

        // Observe blocks that are below the fold
        const belowFoldBlocks = this.getBelowFoldBlocks();
        belowFoldBlocks.forEach(block => observer.observe(block));
    }

    /**
     * Get blocks that are below the fold
     */
    getBelowFoldBlocks() {
        const blocks = document.querySelectorAll('[class*="wp-block-tailwind-starter-"]');
        const viewportHeight = window.innerHeight;
        
        return Array.from(blocks).filter(block => {
            const rect = block.getBoundingClientRect();
            return rect.top > viewportHeight;
        });
    }

    /**
     * Get block name from DOM element
     */
    getBlockNameFromElement(element) {
        const classes = Array.from(element.classList);
        for (const className of classes) {
            const match = className.match(/wp-block-tailwind-starter-(.+)/);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    /**
     * Process editor blocks
     */
    processEditorBlocks(blocks) {
        const blockNames = new Set();
        
        const extractBlockNames = (blockList) => {
            blockList.forEach(block => {
                if (block.name && block.name.startsWith('tailwind-starter/')) {
                    const blockName = block.name.replace('tailwind-starter/', '');
                    blockNames.add(blockName);
                }
                
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    extractBlockNames(block.innerBlocks);
                }
            });
        };
        
        extractBlockNames(blocks);
        
        // Load assets for active blocks
        blockNames.forEach(blockName => {
            this.loadBlockAssets(blockName);
        });
    }

    /**
     * Load assets for a specific block
     */
    async loadBlockAssets(blockName) {
        const config = this.blockAssets.get(blockName);
        if (!config || !config.condition()) {
            return;
        }

        // Load presets first
        if (config.presets && config.presets.length > 0) {
            const presetPromises = config.presets.map(preset => this.loadPreset(preset));
            await Promise.all(presetPromises);
        }

        // Load block-specific styles
        const stylePromises = config.styles.map(style => this.loadStylesheet(style));
        
        // Load block-specific scripts
        const scriptPromises = config.scripts.map(script => this.loadScript(script));
        
        await Promise.all([...stylePromises, ...scriptPromises]);
        
        // Dispatch block assets loaded event
        const event = new CustomEvent('blockAssetsLoaded', {
            detail: { blockName, config }
        });
        document.dispatchEvent(event);
    }

    /**
     * Load preset and its dependencies
     */
    async loadPreset(presetName) {
        if (this.loadedAssets.has(`preset:${presetName}`)) {
            return;
        }

        const config = this.presetAssets.get(presetName);
        if (!config || (config.condition && !config.condition())) {
            return;
        }

        // Load dependencies first
        if (config.dependencies) {
            const depPromises = config.dependencies.map(dep => this.loadPreset(dep));
            await Promise.all(depPromises);
        }

        // Load preset assets
        const stylePromises = config.styles.map(style => this.loadStylesheet(style));
        const scriptPromises = config.scripts.map(script => this.loadScript(script));
        
        await Promise.all([...stylePromises, ...scriptPromises]);
        
        this.loadedAssets.add(`preset:${presetName}`);
    }

    /**
     * Load stylesheet with caching
     */
    loadStylesheet(href) {
        const assetId = `style:${href}`;
        
        if (this.loadedAssets.has(assetId)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`link[href="${href}"]`);
            if (existing) {
                this.loadedAssets.add(assetId);
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => {
                this.loadedAssets.add(assetId);
                resolve();
            };
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Load script with caching
     */
    loadScript(src) {
        const assetId = `script:${src}`;
        
        if (this.loadedAssets.has(assetId)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                this.loadedAssets.add(assetId);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                this.loadedAssets.add(assetId);
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Preload assets for better performance
     */
    preloadAssets(assets) {
        assets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            
            if (asset.endsWith('.css')) {
                link.as = 'style';
            } else if (asset.endsWith('.js')) {
                link.as = 'script';
            }
            
            link.href = asset;
            document.head.appendChild(link);
        });
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            loadedAssets: Array.from(this.loadedAssets),
            registeredBlocks: Array.from(this.blockAssets.keys()),
            registeredPresets: Array.from(this.presetAssets.keys())
        };
    }
}

// Global instance
window.BlockAssetManager = new BlockAssetManager();

// Register example block assets
window.BlockAssetManager.registerBlockAssets('testimonial-showcase', {
    presets: ['intersection-observer', 'animations'],
    scripts: ['/wp-content/themes/tailwind-starter/src/blocks/testimonial-showcase/frontend.js'],
    priority: 'high'
});

window.BlockAssetManager.registerBlockAssets('video-section', {
    presets: ['modal-manager', 'animations'],
    scripts: ['/wp-content/themes/tailwind-starter/src/blocks/video-section/frontend.js'],
    priority: 'normal'
});

window.BlockAssetManager.registerBlockAssets('content-slider', {
    presets: ['touch-gestures', 'intersection-observer'],
    scripts: ['/wp-content/themes/tailwind-starter/src/blocks/content-slider/frontend.js'],
    priority: 'normal'
});

export default window.BlockAssetManager;