import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit.js';
import save from './save.js';
import metadata from './block.json';

/**
 * Register Recent Posts Block
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});

console.log('📝 Recent Posts block registered'); 