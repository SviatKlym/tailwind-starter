import React, { useState } from 'react'
import { 
  TabPanel,
  Tooltip,
  __experimentalText as Text
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

// CSS has been moved to src/editor.css

// ==========================================================================
// CORE INSPECTOR TABS COMPONENT
// ==========================================================================

export const InspectorTabs = ({ 
  variant = 'horizontal',
  blockControls,
  generalControls,
  initialTab = 'block'
}) => {
  // Simple two-tab configuration
  const tabs = [
    {
      name: 'block',
      title: '🔧 Block',
      icon: '🔧',
      className: 'tab-block',
      fullTitle: '🔧 Block Settings'
    },
    {
      name: 'general',
      title: '🎨 Design',  
      icon: '🎨',
      className: 'tab-general',
      fullTitle: '🎨 Visual Design'
    }
  ]

  // Render tab content based on variant
  const renderTabTitle = (tab) => {
    switch (variant) {
      default:
        return (
          <span className="tab-horizontal-content">
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-text">{tab.title.replace(/^[🔧🎨]\s/, '')}</span>
          </span>
        )
    }
  }

  return (
    <div className={`inspector-tabs inspector-tabs--${variant}`}>
      <TabPanel
        className="inspector-tabs-panel"
        activeClass="is-active"
        orientation={variant === 'vertical' ? 'vertical' : 'horizontal'}
        initialTabName={initialTab}
        tabs={tabs.map(tab => ({
          ...tab,
          title: renderTabTitle(tab)
        }))}
      >
        {(tab) => (
          <div className="inspector-tabs__content">
            {tab.name === 'block' ? blockControls : generalControls}
          </div>
        )}
      </TabPanel>
    </div>
  )
}

export const SimpleInspectorTabs = ({ blockControls, generalControls, variant = 'horizontal' }) => {
  const [activeTab, setActiveTab] = useState('block')

  return (
    <div className={`inspector-tabs inspector-tabs--${variant}`}>
      <div className="components-tab-panel__tabs">
        <button 
          className={`components-tab-panel__tabs-item ${activeTab === 'block' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('block')}
        >
          <span className="tab-horizontal-content">
            <span className="tab-icon">🔧</span>
            <span className="tab-text">Block</span>
          </span>
        </button>
        <button 
          className={`components-tab-panel__tabs-item ${activeTab === 'general' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <span className="tab-horizontal-content">
            <span className="tab-icon">🎨</span>
            <span className="tab-text">Design</span>
          </span>
        </button>
      </div>
      
      <div className="inspector-tabs__content">
        {activeTab === 'block' && (
          <div className="inspector-tabs__section">
            <div className="inspector-tabs__description">
              🔧 Configure block-specific settings, content, and functionality.
            </div>
            {blockControls}
          </div>
        )}
        
        {activeTab === 'general' && (
          <div className="inspector-tabs__section">
            <div className="inspector-tabs__description">
              🎨 Adjust visual styling, spacing, colors, and responsive design.
            </div>
            {generalControls}
          </div>
        )}
      </div>
    </div>
  )
}

// ==========================================================================
// EXPORT DEFAULT
// ==========================================================================

export default InspectorTabs