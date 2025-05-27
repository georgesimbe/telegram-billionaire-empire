import React, { useState, useEffect } from 'react';

function FileStructureAnalyzer() {
  const [analysisResults, setAnalysisResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Expected file structure based on imports in App.jsx
  const expectedFiles = [
    // Pages
    { path: './pages/HomePage', category: 'Pages' },
    { path: './pages/BusinessPage', category: 'Pages' },
    { path: './pages/InvestmentPage', category: 'Pages' },
    { path: './pages/SocialPage', category: 'Pages' },
    { path: './pages/ProfilePage', category: 'Pages' },
    { path: './pages/CareerPage', category: 'Pages' },
    { path: './pages/StakingPage', category: 'Pages' },
    { path: './pages/SettingsPage', category: 'Pages' },

    // Components
    { path: './components/Navigation', category: 'Components' },
    { path: './components/AntiCheatWrapper', category: 'Components' },
    { path: './components/ParticleBackground', category: 'Components' },
    { path: './components/AnimatedButton', category: 'Components' },
    { path: './components/HintIcon', category: 'Components' },
    { path: './components/EconomicDashboard', category: 'Components' },
    { path: './components/UpgradeModal', category: 'Components' },

    // Store
    { path: './store/integratedGameStore', category: 'Store' },
    { path: './store/modules/index', category: 'Store Modules' },
    { path: './store/modules/playerStore', category: 'Store Modules' },
    { path: './store/modules/businessStore', category: 'Store Modules' },
    { path: './store/modules/bankingStore', category: 'Store Modules' },
    { path: './store/modules/careerStore', category: 'Store Modules' },
    { path: './store/modules/housingStore', category: 'Store Modules' },
    { path: './store/modules/relationshipsStore', category: 'Store Modules' },
    { path: './store/modules/stakingStore', category: 'Store Modules' },
    { path: './store/modules/governanceStore', category: 'Store Modules' },
    { path: './store/modules/economicsStore', category: 'Store Modules' },
    { path: './store/modules/achievementsStore', category: 'Store Modules' },
    { path: './store/modules/gameTimeStore', category: 'Store Modules' },
    { path: './store/modules/securityStore', category: 'Store Modules' },
    { path: './store/modules/settingsStore', category: 'Store Modules' },

    // Config
    { path: './config/housingConfig', category: 'Config' },
    { path: './config/jobsConfig', category: 'Config' },
    { path: './config/bankingConfig', category: 'Config' },
    { path: './config/educationConfig', category: 'Config' },
    { path: './config/relationshipsConfig', category: 'Config' },
    { path: './config/stakingConfig', category: 'Config' },
    { path: './config/gameConfig', category: 'Config' },
    { path: './config/businessConfig', category: 'Config' },
    { path: './config/economicSimulationConfig', category: 'Config' },
    { path: './config/expandedIndustriesConfig', category: 'Config' },
    { path: './config/securityConfig', category: 'Config' },
    { path: './config/supplyChainConfig', category: 'Config' },
    { path: './config/staffManagementConfig', category: 'Config' },
    { path: './config/advancedNewsConfig', category: 'Config' },

    // Utils
    { path: './utils/formatters', category: 'Utils' },
    { path: './utils/antiCheatDetector', category: 'Utils' },
    { path: './utils/tonIntegration', category: 'Utils' },

    // Services
    { path: './services/api', category: 'Services' },
  ];

  useEffect(() => {
    const analyzeFiles = async () => {
      const results = {};

      for (const file of expectedFiles) {
        try {
          // Try to import the file
          await import(/* @vite-ignore */ file.path);
          results[file.path] = {
            status: 'exists',
            category: file.category,
            error: null
          };
        } catch (error) {
          results[file.path] = {
            status: 'missing',
            category: file.category,
            error: error.message
          };
        }
      }

      setAnalysisResults(results);
      setIsLoading(false);
    };

    analyzeFiles();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'exists': return '✅';
      case 'missing': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'exists': return '#4CAF50';
      case 'missing': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  // Group results by category
  const groupedResults = {};
  Object.entries(analysisResults).forEach(([path, result]) => {
    if (!groupedResults[result.category]) {
      groupedResults[result.category] = [];
    }
    groupedResults[result.category].push({ path, ...result });
  });

  const existingCount = Object.values(analysisResults).filter(r => r.status === 'exists').length;
  const totalCount = Object.keys(analysisResults).length;

  if (isLoading) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>📁 Analyzing File Structure...</h1>
        <p>Checking for missing files and broken paths...</p>
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
      <h1>📁 File Structure Analysis</h1>

      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#333',
        borderRadius: '8px'
      }}>
        <h3>Summary: {existingCount}/{totalCount} files found</h3>
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#555',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(existingCount / totalCount) * 100}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {Object.entries(groupedResults).map(([category, files]) => {
        const categoryExists = files.filter(f => f.status === 'exists').length;
        const categoryTotal = files.length;

        return (
          <div key={category} style={{ marginBottom: '20px' }}>
            <h3 style={{
              color: '#4CAF50',
              borderBottom: '2px solid #333',
              paddingBottom: '5px'
            }}>
              {category} ({categoryExists}/{categoryTotal})
            </h3>

            <div style={{ display: 'grid', gap: '5px', marginTop: '10px' }}>
              {files.map((file) => (
                <div
                  key={file.path}
                  style={{
                    padding: '8px',
                    backgroundColor: '#2a2a2a',
                    borderRadius: '3px',
                    borderLeft: `3px solid ${getStatusColor(file.status)}`,
                    fontSize: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace' }}>{file.path}</span>
                    <span>{getStatusIcon(file.status)}</span>
                  </div>
                  {file.error && file.status === 'missing' && (
                    <div style={{
                      marginTop: '3px',
                      fontSize: '11px',
                      color: '#ff9800',
                      fontFamily: 'monospace'
                    }}>
                      {file.error.includes('Cannot resolve module') ? 'File not found' : file.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#2a4a2a',
        borderRadius: '8px'
      }}>
        <h3>Next Steps:</h3>
        <ul>
          <li>Create missing files or fix import paths</li>
          <li>Check for typos in file names</li>
          <li>Verify file extensions (.js, .jsx, .ts, .tsx)</li>
          <li>Ensure proper export statements in existing files</li>
        </ul>
      </div>
    </div>
  );
}

export default FileStructureAnalyzer; 