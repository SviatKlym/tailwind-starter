/**
 * Modular Preset System for Gutenberg Blocks
 * Manages shared styles and scripts to optimize bundle sizes
 */

class BlockPresetSystem {
    constructor() {
        this.loadedPresets = new Set();
        this.presetDependencies = new Map();
        this.isEditor = typeof wp !== 'undefined' && wp.blockEditor;
    }

    /**
     * Register preset with its dependencies
     */
    registerPreset(presetName, config) {
        this.presetDependencies.set(presetName, {
            styles: config.styles || [],
            scripts: config.scripts || [],
            dependencies: config.dependencies || [],
            condition: config.condition || (() => true)
        });
    }

    /**
     * Load preset if not already loaded
     */
    async loadPreset(presetName) {
        if (this.loadedPresets.has(presetName)) {
            return;
        }

        const config = this.presetDependencies.get(presetName);
        if (!config || !config.condition()) {
            return;
        }

        // Load dependencies first
        for (const dep of config.dependencies) {
            await this.loadPreset(dep);
        }

        // Load styles
        for (const styleFile of config.styles) {
            await this.loadStylesheet(styleFile);
        }

        // Load scripts
        for (const scriptFile of config.scripts) {
            await this.loadScript(scriptFile);
        }

        this.loadedPresets.add(presetName);
        this.dispatchPresetLoaded(presetName);
    }

    /**
     * Load stylesheet dynamically
     */
    loadStylesheet(href) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`link[href="${href}"]`);
            if (existing) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Load script dynamically
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Dispatch custom event when preset is loaded
     */
    dispatchPresetLoaded(presetName) {
        const event = new CustomEvent('presetLoaded', {
            detail: { presetName }
        });
        document.dispatchEvent(event);
    }

    /**
     * Load presets required by block
     */
    async loadBlockPresets(blockName, requiredPresets = []) {
        const promises = requiredPresets.map(preset => this.loadPreset(preset));
        await Promise.all(promises);
        
        // Dispatch block ready event
        const event = new CustomEvent('blockPresetsReady', {
            detail: { blockName, presets: requiredPresets }
        });
        document.dispatchEvent(event);
    }
}

// Global instance
window.BlockPresets = new BlockPresetSystem();

// Register core presets
window.BlockPresets.registerPreset('animations', {
    styles: ['/wp-content/themes/tailwind-starter/src/presets/styles/animations.css'],
    condition: () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

window.BlockPresets.registerPreset('accessibility', {
    scripts: ['/wp-content/themes/tailwind-starter/src/presets/scripts/accessibility.js']
});

window.BlockPresets.registerPreset('intersection-observer', {
    scripts: ['/wp-content/themes/tailwind-starter/src/presets/scripts/intersection-observer.js'],
    dependencies: ['accessibility']
});

window.BlockPresets.registerPreset('touch-gestures', {
    scripts: ['/wp-content/themes/tailwind-starter/src/presets/scripts/touch-gestures.js'],
    dependencies: ['accessibility'],
    condition: () => 'ontouchstart' in window
});

window.BlockPresets.registerPreset('modal-manager', {
    styles: ['/wp-content/themes/tailwind-starter/src/presets/styles/components.css'],
    scripts: ['/wp-content/themes/tailwind-starter/src/presets/scripts/modal-manager.js'],
    dependencies: ['accessibility']
});

export default window.BlockPresets;