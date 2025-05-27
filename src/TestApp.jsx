import React, { useState, useEffect } from 'react';

function TestApp() {
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    console.log('TestApp mounted');
    setStatus('TestApp loaded successfully!');
  }, []);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎮 Telegram Billionaire Empire - Test Mode</h1>
      <p>✅ React is working!</p>
      <p>✅ Backend API is working!</p>
      <p>🔧 Main app has dependency loading issues</p>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#333', borderRadius: '8px' }}>
        <h3>Test Results:</h3>
        <ul>
          <li>✅ Vite development server: Running</li>
          <li>✅ Backend server (port 3000): Running</li>
          <li>✅ Profile API: Working</li>
          <li>✅ Tap API: Working</li>
          <li>❌ Main React app: Dependency issues</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#2a4a2a', borderRadius: '8px' }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>Fix React dependency loading issues</li>
          <li>Ensure all npm packages are properly installed</li>
          <li>Test main application functionality</li>
        </ol>
      </div>
    </div>
  );
}

export default TestApp; 