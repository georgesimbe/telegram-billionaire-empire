import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Simple test pages
const HomePage = () => (
  <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
    <h1>🏠 Home Page</h1>
    <p>Welcome to Telegram Billionaire Empire!</p>
    <div style={{ marginTop: '20px' }}>
      <a href="/business" style={{ color: '#4CAF50', marginRight: '20px' }}>Business</a>
      <a href="/profile" style={{ color: '#4CAF50', marginRight: '20px' }}>Profile</a>
      <a href="/career" style={{ color: '#4CAF50' }}>Career</a>
    </div>
  </div>
);

const BusinessPage = () => (
  <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
    <h1>🏢 Business Page</h1>
    <p>Manage your business empire here!</p>
    <a href="/" style={{ color: '#4CAF50' }}>← Back to Home</a>
  </div>
);

const ProfilePage = () => (
  <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
    <h1>👤 Profile Page</h1>
    <p>View your player profile and stats!</p>
    <a href="/" style={{ color: '#4CAF50' }}>← Back to Home</a>
  </div>
);

const CareerPage = () => (
  <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
    <h1>💼 Career Page</h1>
    <p>Manage your career and education!</p>
    <a href="/" style={{ color: '#4CAF50' }}>← Back to Home</a>
  </div>
);

function SimpleApp() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('SimpleApp initializing...');
    setTimeout(() => {
      setIsInitialized(true);
      console.log('SimpleApp initialized successfully!');
    }, 1000);
  }, []);

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        fontSize: '20px'
      }}>
        Loading Simple App...
      </div>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default SimpleApp; 