import React, { useState } from 'react'
import { 
  TabPanel,
  Tooltip,
  __experimentalText as Text
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

// Lightweight CSS for inspector tabs - minimal and scalable
const inspectorTabsCSS = `
/* ==========================================================================
   BASE INSPECTOR TABS SYSTEM
   ========================================================================== */

.inspector-tabs {
  width: 100%;
  --tab-primary: #6366f1;
  --tab-primary-hover: #4f46e5;
  --tab-secondary: #f1f5f9;
  --tab-border: #e2e8f0;
  --tab-text: #475569;
  --tab-text-active: #ffffff;
  --tab-radius: 6px;
}

/* ==========================================================================
   VARIATION 1: HORIZONTAL TABS (DEFAULT)
   ========================================================================== */

.inspector-tabs--horizontal .components-tab-panel__tabs {
  display: flex;
  background: var(--tab-secondary);
  border-radius: var(--tab-radius);
  padding: 2px;
  margin-bottom: 16px;
  border: 1px solid var(--tab-border);
}

.inspector-tabs--horizontal .components-tab-panel__tabs-item {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: calc(var(--tab-radius) - 2px);
  font-size: 12px;
  font-weight: 600;
  color: var(--tab-text);
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tab-horizontal-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-vertical-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-icon {
  font-size: 14px;
  line-height: 1;
}

.tab-text {
  font-size: 12px;
  font-weight: 600;
}

.tab-icon-only {
  font-size: 16px;
  line-height: 1;
}

.inspector-tabs--horizontal .components-tab-panel__tabs-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: var(--tab-primary);
}

.inspector-tabs--horizontal .components-tab-panel__tabs-item.is-active {
  background: var(--tab-primary);
  color: var(--tab-text-active);
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.3);
}

.inspector-tabs--horizontal .components-tab-panel__tab-content {
  padding: 0 8px
}
`

// Add CSS to document
if (typeof document !== 'undefined' && !document.getElementById('inspector-tabs-css')) {
  const style = document.createElement('style')
  style.id = 'inspector-tabs-css'
  style.textContent = inspectorTabsCSS
  document.head.appendChild(style)
}

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