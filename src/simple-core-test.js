/**
 * SIMPLE TEST - Core Block Enhancement
 * This is a minimal test to isolate the duplicate controls issue
 */

import { addFilter } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { createElement, Fragment } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

// Only one block for testing
const TEST_BLOCKS = ['core/heading']

// Simple test: Add one panel to heading blocks only
const withSimpleTestControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    const { name } = props
    
    // Only add to heading blocks
    if (name !== 'core/heading') {
      return createElement(BlockEdit, props)
    }

    console.log('🧪 Adding SIMPLE TEST controls to heading')

    return createElement(Fragment, null,
      // Original block
      createElement(BlockEdit, props),
      
      // Our simple test panel
      createElement(InspectorControls, null,
        createElement(PanelBody, {
          title: '🧪 SIMPLE TEST CONTROLS',
          initialOpen: false
        },
          createElement('div', { style: { padding: '12px' } },
            'This is a simple test panel. If you see duplicates of this, there\'s a loading issue.'
          )
        )
      )
    )
  }
}, 'withSimpleTestControls')

// Initialize ONLY if not already done
if (!window.simpleTestInitialized) {
  console.log('🧪 SIMPLE TEST: Initializing...')
  
  addFilter(
    'editor.BlockEdit',
    'simple-test/controls',
    withSimpleTestControls
  )
  
  window.simpleTestInitialized = true
  console.log('🧪 SIMPLE TEST: Complete')
} else {
  console.log('🧪 SIMPLE TEST: Already initialized, skipping')
}