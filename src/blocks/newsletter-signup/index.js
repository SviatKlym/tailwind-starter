import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit.js';
import save from './save.js';
import metadata from './block.json';

/**
 * Register Newsletter Signup Block
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});

console.log('📧 Newsletter Signup block registered'); 