import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit.js';
import save from './save.js';
import metadata from './block.json';

/**
 * Register Team Members Block
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});

console.log('🎭 Team Members block registered'); 