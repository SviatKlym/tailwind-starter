/**
 * Block Configurator - Dynamic UI for selecting only needed features
 * Generates optimized blocks based on specific requirements
 */

import BlockBuilder from './BlockBuilder.js';

class BlockConfigurator {
    constructor() {
        this.builder = new BlockBuilder();
        this.currentConfig = {
            blockName: '',
            features: [],
            options: {},
            customCSS: '',
            customJS: ''
        };
        
        this.previewMode = false;
        this.generatedFiles = null;
    }
    
    /**
     * Create configuration UI
     */
    createUI() {
        const container = document.createElement('div');
        container.className = 'block-configurator';
        container.innerHTML = this.getUIHTML();
        
        this.bindEvents(container);
        return container;
    }
    
    /**
     * Generate UI HTML
     */
    getUIHTML() {
        const features = this.builder.getAvailableFeatures();
        
        return `
            <div class="configurator-container max-w-6xl mx-auto p-6">
                <h1 class="text-3xl font-bold mb-8">Dynamic Block Builder</h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Configuration Panel -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-xl font-semibold mb-4">Block Configuration</h2>
                            
                            <!-- Block Name -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium mb-2">Block Name</label>
                                <input type="text" 
                                       id="block-name" 
                                       placeholder="e.g., product-showcase, team-gallery"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <p class="text-sm text-gray-500 mt-1">Use kebab-case (lowercase with dashes)</p>
                            </div>
                            
                            <!-- Features Selection -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium mb-4">Features (select only what you need)</label>
                                <div class="space-y-3">
                                    ${features.map(feature => `
                                        <div class="feature-option border border-gray-200 rounded-lg p-4">
                                            <label class="flex items-start space-x-3">
                                                <input type="checkbox" 
                                                       value="${feature.name}" 
                                                       class="mt-1 feature-checkbox"
                                                       data-feature="${feature.name}">
                                                <div class="flex-1">
                                                    <div class="font-medium">${this.capitalizeFirst(feature.name)}</div>
                                                    <div class="text-sm text-gray-600">${feature.description}</div>
                                                    
                                                    <!-- Feature Options -->
                                                    <div class="feature-options mt-3 hidden">
                                                        <div class="text-xs font-medium text-gray-700 mb-2">Options:</div>
                                                        <div class="flex flex-wrap gap-2">
                                                            ${feature.options.map(option => `
                                                                <label class="inline-flex items-center text-xs">
                                                                    <input type="checkbox" 
                                                                           value="${option}"
                                                                           class="option-checkbox mr-1"
                                                                           data-feature="${feature.name}"
                                                                           data-option="${option}">
                                                                    ${this.capitalizeFirst(option.replace('-', ' '))}
                                                                </label>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Custom CSS -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium mb-2">Custom CSS (optional)</label>
                                <textarea id="custom-css" 
                                          rows="4" 
                                          placeholder="/* Add your custom styles here */"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"></textarea>
                            </div>
                            
                            <!-- Custom JS -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium mb-2">Custom JavaScript (optional)</label>
                                <textarea id="custom-js" 
                                          rows="4" 
                                          placeholder="// Add your custom JavaScript here"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"></textarea>
                            </div>
                            
                            <!-- Actions -->
                            <div class="flex space-x-4">
                                <button id="generate-preview" 
                                        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    Generate Preview
                                </button>
                                <button id="download-files" 
                                        class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                                    Download Files
                                </button>
                                <button id="save-config" 
                                        class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                                    Save Config
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Preview Panel -->
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h3 class="text-lg font-semibold mb-4">Preview & Stats</h3>
                            
                            <!-- File Size Preview -->
                            <div id="size-preview" class="mb-6">
                                <div class="text-sm text-gray-600 mb-2">Estimated file sizes:</div>
                                <div class="space-y-1 text-sm">
                                    <div>CSS: <span id="css-size" class="font-mono">0 KB</span></div>
                                    <div>JavaScript: <span id="js-size" class="font-mono">0 KB</span></div>
                                    <div class="font-medium">Total: <span id="total-size" class="font-mono">0 KB</span></div>
                                </div>
                            </div>
                            
                            <!-- Selected Features -->
                            <div id="selected-features" class="mb-6">
                                <div class="text-sm text-gray-600 mb-2">Selected features:</div>
                                <div id="feature-list" class="text-sm text-gray-500">None selected</div>
                            </div>
                            
                            <!-- Generated Modules -->
                            <div id="generated-modules" class="mb-6 hidden">
                                <div class="text-sm text-gray-600 mb-2">Included modules:</div>
                                <div id="css-modules" class="text-xs text-blue-600 mb-1"></div>
                                <div id="js-modules" class="text-xs text-green-600"></div>
                            </div>
                            
                            <!-- Code Preview -->
                            <div id="code-preview" class="hidden">
                                <div class="text-sm text-gray-600 mb-2">Code preview:</div>
                                <div class="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
                                    <pre id="preview-code" class="text-xs text-gray-700"></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Bind UI events
     */
    bindEvents(container) {
        // Block name input
        const blockNameInput = container.querySelector('#block-name');
        blockNameInput.addEventListener('input', (e) => {
            this.currentConfig.blockName = e.target.value;
            this.updatePreview();
        });
        
        // Feature checkboxes
        const featureCheckboxes = container.querySelectorAll('.feature-checkbox');
        featureCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const featureName = e.target.dataset.feature;
                const optionsDiv = e.target.closest('.feature-option').querySelector('.feature-options');
                
                if (e.target.checked) {
                    this.currentConfig.features.push(featureName);
                    optionsDiv.classList.remove('hidden');
                } else {
                    this.currentConfig.features = this.currentConfig.features.filter(f => f !== featureName);
                    optionsDiv.classList.add('hidden');
                    
                    // Clear feature options
                    delete this.currentConfig.options[featureName];
                }
                
                this.updatePreview();
            });
        });
        
        // Option checkboxes
        const optionCheckboxes = container.querySelectorAll('.option-checkbox');
        optionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const featureName = e.target.dataset.feature;
                const optionName = e.target.dataset.option;
                
                if (!this.currentConfig.options[featureName]) {
                    this.currentConfig.options[featureName] = [];
                }
                
                if (e.target.checked) {
                    this.currentConfig.options[featureName].push(optionName);
                } else {
                    this.currentConfig.options[featureName] = this.currentConfig.options[featureName].filter(o => o !== optionName);
                }
                
                this.updatePreview();
            });
        });
        
        // Custom CSS/JS
        const customCSS = container.querySelector('#custom-css');
        const customJS = container.querySelector('#custom-js');
        
        customCSS.addEventListener('input', (e) => {
            this.currentConfig.customCSS = e.target.value;
            this.updatePreview();
        });
        
        customJS.addEventListener('input', (e) => {
            this.currentConfig.customJS = e.target.value;
            this.updatePreview();
        });
        
        // Action buttons
        container.querySelector('#generate-preview').addEventListener('click', () => {
            this.generatePreview();
        });
        
        container.querySelector('#download-files').addEventListener('click', () => {
            this.downloadFiles();
        });
        
        container.querySelector('#save-config').addEventListener('click', () => {
            this.saveConfig();
        });
    }
    
    /**
     * Update preview panel
     */
    updatePreview() {
        const container = document.querySelector('.block-configurator');
        
        // Update selected features
        const featureList = container.querySelector('#feature-list');
        if (this.currentConfig.features.length > 0) {
            featureList.textContent = this.currentConfig.features.join(', ');
            featureList.className = 'text-sm text-gray-900';
        } else {
            featureList.textContent = 'None selected';
            featureList.className = 'text-sm text-gray-500';
        }
        
        // Generate and show file sizes
        if (this.currentConfig.blockName && this.currentConfig.features.length > 0) {
            try {
                const generated = this.builder.buildBlock(this.currentConfig);
                this.generatedFiles = generated;
                
                // Update size display
                container.querySelector('#css-size').textContent = generated.size.cssFormatted;
                container.querySelector('#js-size').textContent = generated.size.jsFormatted;
                container.querySelector('#total-size').textContent = generated.size.totalFormatted;
                
                // Show included modules
                const modulesDiv = container.querySelector('#generated-modules');
                modulesDiv.classList.remove('hidden');
                container.querySelector('#css-modules').textContent = 'CSS: ' + generated.modules.css.join(', ');
                container.querySelector('#js-modules').textContent = 'JS: ' + generated.modules.js.join(', ');
                
            } catch (error) {
                console.error('Preview generation error:', error);
            }
        } else {
            container.querySelector('#generated-modules').classList.add('hidden');
        }
    }
    
    /**
     * Generate full preview
     */
    generatePreview() {
        if (!this.validateConfig()) return;
        
        const generated = this.builder.buildBlock(this.currentConfig);
        this.generatedFiles = generated;
        
        // Show code preview
        const codePreview = document.querySelector('#code-preview');
        const previewCode = document.querySelector('#preview-code');
        
        codePreview.classList.remove('hidden');
        previewCode.textContent = `/* CSS Preview (${generated.size.cssFormatted}) */\\n` + 
                                   generated.css.substring(0, 200) + '...\\n\\n' +
                                   `/* JavaScript Preview (${generated.size.jsFormatted}) */\\n` +
                                   generated.js.substring(0, 200) + '...';
        
        this.showNotification('Preview generated successfully!', 'success');
    }
    
    /**
     * Download generated files
     */
    downloadFiles() {
        if (!this.generatedFiles) {
            this.showNotification('Please generate preview first', 'error');
            return;
        }
        
        const blockName = this.currentConfig.blockName;
        
        // Create files
        const files = [
            {
                name: `${blockName}-style.css`,
                content: this.generatedFiles.css,
                type: 'text/css'
            },
            {
                name: `${blockName}-script.js`,
                content: this.generatedFiles.js,
                type: 'text/javascript'
            },
            {
                name: `${blockName}-config.json`,
                content: JSON.stringify(this.currentConfig, null, 2),
                type: 'application/json'
            }
        ];
        
        // Download each file
        files.forEach(file => {
            const blob = new Blob([file.content], { type: file.type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        
        this.showNotification('Files downloaded successfully!', 'success');
    }
    
    /**
     * Save configuration
     */
    saveConfig() {
        if (!this.validateConfig()) return;
        
        const configJSON = JSON.stringify(this.currentConfig, null, 2);
        const blob = new Blob([configJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentConfig.blockName}-config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Configuration saved!', 'success');
    }
    
    /**
     * Validate current configuration
     */
    validateConfig() {
        if (!this.currentConfig.blockName) {
            this.showNotification('Please enter a block name', 'error');
            return false;
        }
        
        if (this.currentConfig.features.length === 0) {
            this.showNotification('Please select at least one feature', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    /**
     * Utility functions
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    /**
     * Load saved configuration
     */
    loadConfig(config) {
        this.currentConfig = { ...config };
        // Update UI based on loaded config
        this.updateUIFromConfig();
    }
    
    updateUIFromConfig() {
        // Implementation for updating UI when loading a saved config
        // This would restore checkboxes, inputs, etc.
    }
}

export default BlockConfigurator;