import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit.js';
import save from './save.js';
import metadata from './block.json';

/**
 * Register Before After Block
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});

console.log('📸 Before After block registered'); 