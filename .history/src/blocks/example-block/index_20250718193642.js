import { registerBlockType } from '@wordpress/blocks'
import Edit from './edit.js'
import Save from './save.js'

registerBlockType('my-tailwind-starter/example-block', {
  edit: Edit,
  save: Save,
})