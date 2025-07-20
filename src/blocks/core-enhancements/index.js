/**
 * Core Block Enhancements Loader
 * 
 * Using the same simple initialization pattern that worked in testing
 */

import { initCoreBlockEnhancements } from '../../utils/core-block-enhancements.js'
import './editor.css'

// Use the same simple pattern that worked in our test
if (!window.tailwindCoreEnhancementsLoaded) {
  console.log('🔧 Core block enhancements: Initializing...')
  initCoreBlockEnhancements()
  window.tailwindCoreEnhancementsLoaded = true
  console.log('🔧 Core block enhancements: Complete')
} else {
  console.log('🔧 Core block enhancements: Already loaded, skipping')
}