import { registerBlockType } from '@wordpress/blocks'
import Edit from './edit.js'
import Save from './save.js'

registerBlockType('tailwind-starter/example-block', {
  edit: Edit,
  save: Save,
})