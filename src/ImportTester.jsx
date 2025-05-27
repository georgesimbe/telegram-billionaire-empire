import React, { useState, useEffect } from 'react';

function ImportTester() {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Define all imports to test
  const importsToTest = [
    // Core React dependencies
    { name: 'React', test: () => typeof React !== 'undefined' },
    {
      name: 'React Router', test: async () => {
        try {
          const { BrowserRouter } = await import('react-router-dom');
          return typeof BrowserRouter !== 'undefined';
        } catch (e) { return false; }
      }
    },

    // TON Connect
    {
      name: 'TON Connect UI React', test: async () => {
        try {
          const tonConnect = await import('@tonconnect/ui-react');
          return typeof tonConnect.TonConnectUIProvider !== 'undefined';
        } catch (e) { return false; }
      }
    },

    // Telegram SDK
    {
      name: 'Telegram Apps SDK', test: async () => {
        try {
          const telegram = await import('@telegram-apps/sdk-react');
          return typeof telegram !== 'undefined';
        } catch (e) { return false; }
      }
    },

    // Game Store
    {
      name: 'Integrated Game Store', test: async () => {
        try {
          const store = await import('./store/integratedGameStore');
          return typeof store.default !== 'undefined';
        } catch (e) { return false; }
      }
    },

    // Pages
    {
      name: 'HomePage', test: async () => {
        try {
          const page = await import('./pages/HomePage');
          return typeof page.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'BusinessPage', test: async () => {
        try {
          const page = await import('./pages/BusinessPage');
          return typeof page.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'ProfilePage', test: async () => {
        try {
          const page = await import('./pages/ProfilePage');
          return typeof page.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'CareerPage', test: async () => {
        try {
          const page = await import('./pages/CareerPage');
          return typeof page.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'StakingPage', test: async () => {
        try {
          const page = await import('./pages/StakingPage');
          return typeof page.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'SettingsPage', test: async () => {
        try {
          const page = await import('./pages/SettingsPage');
          return typeof page.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'InvestmentPage', test: async () => {
        try {
          const page = await import('./pages/InvestmentPage');
          return typeof page.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'SocialPage', test: async () => {
        try {
          const page = await import('./pages/SocialPage');
          return typeof page.default !== 'undefined';
        } catch (e) { return false; }
      }
    },

    // Components
    {
      name: 'Navigation', test: async () => {
        try {
          const comp = await import('./components/Navigation');
          return typeof comp.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'AntiCheatWrapper', test: async () => {
        try {
          const comp = await import('./components/AntiCheatWrapper');
          return typeof comp.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'ParticleBackground', test: async () => {
        try {
          const comp = await import('./components/ParticleBackground');
          return typeof comp.default !== 'undefined';
        } catch (e) { return false; }
      }
    },

    // External Libraries
    {
      name: 'Zustand', test: async () => {
        try {
          const zustand = await import('zustand');
          return typeof zustand.create !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'Framer Motion', test: async () => {
        try {
          const motion = await import('framer-motion');
          return typeof motion.motion !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'Chart.js', test: async () => {
        try {
          const chart = await import('chart.js');
          return typeof chart.Chart !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'React Chart.js 2', test: async () => {
        try {
          const chart = await import('react-chartjs-2');
          return typeof chart.Line !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'Heroicons', test: async () => {
        try {
          const icons = await import('@heroicons/react/24/outline');
          return typeof icons.HomeIcon !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'Date-fns', test: async () => {
        try {
          const dateFns = await import('date-fns');
          return typeof dateFns.format !== 'undefined';
        } catch (e) { return false; }
      }
    },
    {
      name: 'Axios', test: async () => {
        try {
          const axios = await import('axios');
          return typeof axios.default !== 'undefined';
        } catch (e) { return false; }
      }
    },
  ];

  useEffect(() => {
    const runTests = async () => {
      const results = {};

      for (const importTest of importsToTest) {
        try {
          const result = await importTest.test();
          results[importTest.name] = {
            status: result ? 'success' : 'failed',
            error: result ? null : 'Import test failed'
          };
        } catch (error) {
          results[importTest.name] = {
            status: 'error',
            error: error.message
          };
        }
      }

      setTestResults(results);
      setIsLoading(false);
    };

    runTests();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'error': return '🔥';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'failed': return '#f44336';
      case 'error': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const successCount = Object.values(testResults).filter(r => r.status === 'success').length;
  const totalCount = Object.keys(testResults).length;

  if (isLoading) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>🔍 Import Testing in Progress...</h1>
        <p>Testing all imports and dependencies...</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🔍 Import Test Results</h1>
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#333',
        borderRadius: '8px'
      }}>
        <h3>Summary: {successCount}/{totalCount} imports working</h3>
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#555',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(successCount / totalCount) * 100}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {Object.entries(testResults).map(([name, result]) => (
          <div
            key={name}
            style={{
              padding: '10px',
              backgroundColor: '#2a2a2a',
              borderRadius: '5px',
              borderLeft: `4px solid ${getStatusColor(result.status)}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{name}</span>
              <span style={{ fontSize: '18px' }}>{getStatusIcon(result.status)}</span>
            </div>
            {result.error && (
              <div style={{
                marginTop: '5px',
                fontSize: '12px',
                color: '#ff9800',
                fontFamily: 'monospace'
              }}>
                {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#2a4a2a',
        borderRadius: '8px'
      }}>
        <h3>Recommendations:</h3>
        <ul>
          <li>Fix failed imports by checking file paths and dependencies</li>
          <li>Install missing npm packages</li>
          <li>Verify file structure matches import statements</li>
          <li>Check for circular dependencies</li>
        </ul>
      </div>
    </div>
  );
}

export default ImportTester; 