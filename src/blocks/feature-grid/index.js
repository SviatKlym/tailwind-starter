import { registerBlockType } from '@wordpress/blocks'
import Edit from './edit.js'
import Save from './save.js'
import metadata from './block.json'
import './style.css'
import './editor.css'

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
})