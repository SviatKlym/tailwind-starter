import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	// Dynamic block - content is rendered server-side via render.php
	// Server-side form processing handles all functionality and security
	return null;
} 