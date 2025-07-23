/**
 * Initialize block functionality when DOM is ready
 * 
 * @param {string} selector - CSS selector for the block
 * @param {Function} callback - Initialization function
 */
export const initializeBlock = (selector, callback) => {
  const initFn = () => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      callback(elements);
    }
  };

  if (document.readyState !== 'loading') {
    initFn();
  } else {
    document.addEventListener('DOMContentLoaded', initFn);
  }
};

/**
 * Initialize multiple blocks
 * 
 * @param {Array} blocks - Array of {selector, callback} objects
 */
export const initializeBlocks = (blocks) => {
  blocks.forEach(({ selector, callback }) => {
    initializeBlock(selector, callback);
  });
};

/**
 * Lazy load block functionality only when needed
 * 
 * @param {string} selector - CSS selector for the block
 * @param {Function} importFn - Dynamic import function
 */
export const lazyInitializeBlock = (selector, importFn) => {
  initializeBlock(selector, async () => {
    try {
      const module = await importFn();
      if (module.init && typeof module.init === 'function') {
        module.init();
      }
    } catch (error) {
      console.error(`Failed to load block functionality for ${selector}:`, error);
    }
  });
};