import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	// Dynamic block - content is rendered server-side via render.php
	// Role-based filtering and team management handled on server
	return null;
} 