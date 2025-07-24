import { createDynamicBlock } from '../../utils/block-factory.js';
import Edit from './edit.js';
import metadata from './block.json';
import './style.scss';

createDynamicBlock(metadata.name, Edit, metadata);
