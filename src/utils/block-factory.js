import { registerBlockType } from '@wordpress/blocks';

/**
 * Block factory for standardized block registration
 * 
 * @param {string} name - Block name from metadata
 * @param {Function} edit - Edit component
 * @param {Function} save - Save function
 * @param {Object} metadata - Block metadata
 * @param {Object} options - Additional options
 */
export const createBlock = (name, edit, save, metadata, options = {}) => {
  registerBlockType(name, {
    ...metadata,
    edit,
    save,
    ...options
  });
};

/**
 * Create a dynamic block (server-side rendered)
 * 
 * @param {string} name - Block name from metadata
 * @param {Function} edit - Edit component
 * @param {Object} metadata - Block metadata
 * @param {Object} options - Additional options
 */
export const createDynamicBlock = (name, edit, metadata, options = {}) => {
  registerBlockType(name, {
    ...metadata,
    edit,
    save: () => null, // Dynamic blocks return null for save
    ...options
  });
};