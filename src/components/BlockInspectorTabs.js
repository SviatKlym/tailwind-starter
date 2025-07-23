import React, { useState } from 'react'
import { 
  TabPanel,
  Tooltip,
  __experimentalText as Text,
  __experimentalVStack as VStack
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

// Enhanced CSS for the block inspector tabs
const blockInspectorTabsCSS = `
/* ==========================================================================
   VARIATION 1: HORIZONTAL TABS AT TOP (DEFAULT)
   ========================================================================== */

.block-inspector-tabs-horizontal {
  width: 100%;
  border-bottom: 1px solid #e2e8f0;
}

.block-inspector-tabs-horizontal .components-tab-panel__tabs {
  display: flex;
  background: #f8fafc;
  border-radius: 8px 8px 0 0;
  padding: 4px;
  margin: 0 0 16px 0;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.block-inspector-tabs-horizontal .components-tab-panel__tabs-item {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}

.block-inspector-tabs-horizontal .components-tab-panel__tabs-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  transform: translateY(-1px);
}

.block-inspector-tabs-horizontal .components-tab-panel__tabs-item.is-active {
  background: #6366f1;
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

.block-inspector-tabs-horizontal .components-tab-panel__tab-content {
  padding: 0 4px;
  animation: fadeIn 0.3s ease;
}

/* ==========================================================================
   VARIATION 2: VERTICAL TABS ON LEFT
   ========================================================================== */

.block-inspector-tabs-vertical {
  display: flex;
  gap: 16px;
  width: 100%;
  min-height: 400px;
}

.block-inspector-tabs-vertical .components-tab-panel__tabs {
  display: flex;
  flex-direction: column;
  width: 140px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  height: fit-content;
  gap: 4px;
}

.block-inspector-tabs-vertical .components-tab-panel__tabs-item {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
}

.block-inspector-tabs-vertical .components-tab-panel__tabs-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  transform: translateX(2px);
}

.block-inspector-tabs-vertical .components-tab-panel__tabs-item.is-active {
  background: #6366f1;
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  transform: translateX(4px);
}

.block-inspector-tabs-vertical .components-tab-panel__tab-content {
  flex: 1;
  padding: 8px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  animation: slideInRight 0.3s ease;
}

/* ==========================================================================
   VARIATION 3: ICON-ONLY COMPACT TABS
   ========================================================================== */

.block-inspector-tabs-icons {
  width: 100%;
}

.block-inspector-tabs-icons .components-tab-panel__tabs {
  display: flex;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  padding: 6px;
  margin: 0 0 20px 0;
  border: 1px solid #e2e8f0;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.block-inspector-tabs-icons .components-tab-panel__tabs-item {
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  position: relative;
}

.block-inspector-tabs-icons .components-tab-panel__tabs-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  transform: scale(1.1) rotate(5deg);
}

.block-inspector-tabs-icons .components-tab-panel__tabs-item.is-active {
  background: #6366f1;
  color: white;
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
}

.block-inspector-tabs-icons .components-tab-panel__tab-content {
  padding: 8px;
  animation: fadeInUp 0.3s ease;
}

/* ==========================================================================
   COMMON ANIMATIONS
   ========================================================================== */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { 
    opacity: 0; 
    transform: translateX(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* ==========================================================================
   TAB CONTENT STYLING
   ========================================================================== */

.block-inspector-tab-section {
  margin-bottom: 20px;
}

.block-inspector-tab-section:last-child {
  margin-bottom: 0;
}

.tab-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-section-description {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.4;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #6366f1;
}
`

// Add CSS to document
if (typeof document !== 'undefined' && !document.getElementById('block-inspector-tabs-css')) {
  const style = document.createElement('style')
  style.id = 'block-inspector-tabs-css'
  style.textContent = blockInspectorTabsCSS
  document.head.appendChild(style)
}

// ==========================================================================
// VARIATION 1: HORIZONTAL TABS AT TOP
// ==========================================================================

export const HorizontalBlockInspectorTabs = ({ 
  generalControls, 
  blockControls, 
  advancedControls,
  children 
}) => {
  const tabs = [
    {
      name: 'general',
      title: '⚙️ General',
      className: 'tab-general'
    },
    {
      name: 'block',
      title: '🎯 Block',
      className: 'tab-block'
    },
    {
      name: 'advanced',
      title: '🔧 Advanced',
      className: 'tab-advanced'
    }
  ]

  return (
    <div className="block-inspector-tabs-horizontal">
      <TabPanel
        className="block-inspector-tabs-panel"
        activeClass="is-active"
        orientation="horizontal"
        initialTabName="general"
        tabs={tabs}
      >
        {(tab) => {
          switch (tab.name) {
            case 'general':
              return (
                <div className="block-inspector-tab-section">
                  <div className="tab-section-description">
                    Global controls that affect the overall appearance and behavior across all blocks.
                  </div>
                  {generalControls}
                </div>
              )
            
            case 'block':
              return (
                <div className="block-inspector-tab-section">
                  <div className="tab-section-description">
                    Block-specific settings that control unique features and content for this particular block type.
                  </div>
                  {blockControls}
                </div>
              )
            
            case 'advanced':
              return (
                <div className="block-inspector-tab-section">
                  <div className="tab-section-description">
                    Advanced settings for fine-tuning performance, accessibility, and technical configurations.
                  </div>
                  {advancedControls}
                </div>
              )
              
            default:
              return children
          }
        }}
      </TabPanel>
    </div>
  )
}

// ==========================================================================
// VARIATION 2: VERTICAL TABS ON LEFT
// ==========================================================================

export const VerticalBlockInspectorTabs = ({ 
  generalControls, 
  blockControls, 
  advancedControls,
  children 
}) => {
  const tabs = [
    {
      name: 'general',
      title: '⚙️ General',
      className: 'tab-general'
    },
    {
      name: 'block',
      title: '🎯 Block',
      className: 'tab-block'
    },
    {
      name: 'advanced',
      title: '🔧 Advanced',
      className: 'tab-advanced'
    }
  ]

  return (
    <div className="block-inspector-tabs-vertical">
      <TabPanel
        className="block-inspector-tabs-panel"
        activeClass="is-active"
        orientation="vertical"
        initialTabName="general"
        tabs={tabs}
      >
        {(tab) => {
          switch (tab.name) {
            case 'general':
              return (
                <VStack spacing={4}>
                  <div className="tab-section-header">
                    <span>⚙️</span>
                    <Text weight="600">General Controls</Text>
                  </div>
                  <div className="tab-section-description">
                    Global styling and layout options that apply universally.
                  </div>
                  {generalControls}
                </VStack>
              )
            
            case 'block':
              return (
                <VStack spacing={4}>
                  <div className="tab-section-header">
                    <span>🎯</span>
                    <Text weight="600">Block Controls</Text>
                  </div>
                  <div className="tab-section-description">
                    Specific settings for this block's unique functionality.
                  </div>
                  {blockControls}
                </VStack>
              )
            
            case 'advanced':
              return (
                <VStack spacing={4}>
                  <div className="tab-section-header">
                    <span>🔧</span>
                    <Text weight="600">Advanced Settings</Text>
                  </div>
                  <div className="tab-section-description">
                    Technical configurations and performance optimizations.
                  </div>
                  {advancedControls}
                </VStack>
              )
              
            default:
              return children
          }
        }}
      </TabPanel>
    </div>
  )
}

// ==========================================================================
// VARIATION 3: ICON-ONLY COMPACT TABS
// ==========================================================================

export const IconBlockInspectorTabs = ({ 
  generalControls, 
  blockControls, 
  advancedControls,
  children 
}) => {
  const tabs = [
    {
      name: 'general',
      title: '⚙️',
      className: 'tab-general'
    },
    {
      name: 'block',
      title: '🎯',
      className: 'tab-block'
    },
    {
      name: 'advanced',
      title: '🔧',
      className: 'tab-advanced'
    }
  ]

  return (
    <div className="block-inspector-tabs-icons">
      <TabPanel
        className="block-inspector-tabs-panel"
        activeClass="is-active"
        orientation="horizontal"
        initialTabName="general"
        tabs={tabs}
      >
        {(tab) => {
          // Wrap each tab button with tooltip
          const TabButton = ({ tabName, icon, label }) => (
            <Tooltip text={label}>
              <button className="components-tab-panel__tabs-item">
                {icon}
              </button>
            </Tooltip>
          )

          switch (tab.name) {
            case 'general':
              return (
                <div className="block-inspector-tab-section">
                  <div className="tab-section-header">
                    <span>⚙️</span>
                    <Text weight="600">General Controls</Text>
                  </div>
                  {generalControls}
                </div>
              )
            
            case 'block':
              return (
                <div className="block-inspector-tab-section">
                  <div className="tab-section-header">
                    <span>🎯</span>
                    <Text weight="600">Block-Specific Controls</Text>
                  </div>
                  {blockControls}
                </div>
              )
            
            case 'advanced':
              return (
                <div className="block-inspector-tab-section">
                  <div className="tab-section-header">
                    <span>🔧</span>
                    <Text weight="600">Advanced Settings</Text>
                  </div>
                  {advancedControls}
                </div>
              )
              
            default:
              return children
          }
        }}
      </TabPanel>
    </div>
  )
}

// ==========================================================================
// ENHANCED TAB WRAPPER WITH VARIATION SELECTOR
// ==========================================================================

export const BlockInspectorTabs = ({ 
  variant = 'horizontal',
  generalControls,
  blockControls,
  advancedControls,
  children
}) => {
  const TabComponent = {
    horizontal: HorizontalBlockInspectorTabs,
    vertical: VerticalBlockInspectorTabs,
    icons: IconBlockInspectorTabs
  }[variant] || HorizontalBlockInspectorTabs

  return (
    <TabComponent
      generalControls={generalControls}
      blockControls={blockControls}
      advancedControls={advancedControls}
    >
      {children}
    </TabComponent>
  )
}

export default BlockInspectorTabs