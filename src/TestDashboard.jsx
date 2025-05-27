import React, { useState } from 'react';
import ImportTester from './ImportTester';
import FileStructureAnalyzer from './FileStructureAnalyzer';

function TestDashboard() {
  const [activeTab, setActiveTab] = useState('imports');

  const tabs = [
    { id: 'imports', label: '🔍 Import Tests', component: ImportTester },
    { id: 'files', label: '📁 File Structure', component: FileStructureAnalyzer },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #333'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>🧪 Telegram Billionaire Empire - Test Dashboard</h1>
        <p style={{ margin: 0, color: '#ccc' }}>
          Comprehensive testing suite for imports, file structure, and dependencies
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        backgroundColor: '#333',
        borderBottom: '1px solid #555'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '15px 25px',
              backgroundColor: activeTab === tab.id ? '#4CAF50' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#ccc',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {ActiveComponent && <ActiveComponent />}
      </div>

      {/* Footer */}
      <div style={{
        padding: '20px',
        backgroundColor: '#2a2a2a',
        borderTop: '2px solid #333',
        textAlign: 'center',
        color: '#ccc'
      }}>
        <p>Use this dashboard to identify and fix import issues before deploying the main application.</p>
      </div>
    </div>
  );
}

export default TestDashboard; 