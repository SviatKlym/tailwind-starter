import { createBlock } from '../../utils/block-factory.js';
import Edit from './edit.js';
import save from './save.js';
import metadata from './block.json';
import './style.scss';

createBlock(metadata.name, Edit, save, metadata);
