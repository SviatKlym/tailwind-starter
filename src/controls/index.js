/**
 * Visual Controls Modules Export - Code Splitting Entry Point
 * Enables lazy loading of individual control modules
 */

import { createLazyComponent } from '../utils/lazy-controls.js'

// Lazy-loaded control components with code splitting
export const LazySpacingControls = createLazyComponent(
  () => import('./spacing-controls.js'),
  'SpacingControls'
)

export const LazyTypographyControls = createLazyComponent(
  () => import('./typography-controls.js'),
  'TypographyControls'
)

export const LazyEffectsControls = createLazyComponent(
  () => import('./effects-controls.js'),
  'EffectsControls'
)

export const LazyLayoutControls = createLazyComponent(
  () => import('./layout-controls.js'),
  'LayoutControls'
)

// Direct imports for non-heavy components (can still be loaded immediately)
export { default as SpacingControls } from './spacing-controls.js'
export { default as TypographyControls } from './typography-controls.js'
export { default as EffectsControls } from './effects-controls.js'
export { default as LayoutControls } from './layout-controls.js'

// Helper function to get lazy component by name
export const getLazyComponent = (componentName) => {
  const components = {
    'spacing': LazySpacingControls,
    'typography': LazyTypographyControls,
    'effects': LazyEffectsControls,
    'layout': LazyLayoutControls
  }
  
  return components[componentName] || null
}

// Bundle size analysis helper (development only)
if (process.env.NODE_ENV === 'development') {
  console.log('📦 Visual Controls Modules loaded with code splitting')
}