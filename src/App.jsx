import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { initMiniApp, useMiniApp, useViewport } from '@telegram-apps/sdk-react';
import useGameStore from './store/gameStore';
import HomePage from './pages/HomePage';
import BusinessPage from './pages/BusinessPage';
import InvestmentPage from './pages/InvestmentPage';
import SocialPage from './pages/SocialPage';
import ProfilePage from './pages/ProfilePage';
import CareerPage from './pages/CareerPage';
import StakingPage from './pages/StakingPage';
import SettingsPage from './pages/SettingsPage';
import Navigation from './components/Navigation';
import AntiCheatWrapper from './components/AntiCheatWrapper';
import ParticleBackground from './components/ParticleBackground';

const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  // const miniApp = useMiniApp();
  // const viewport = useViewport();
  const initializePlayer = useGameStore(state => state.initializePlayer);
  const resetDailyActions = useGameStore(state => state.resetDailyActions);
  const setPlayer = useGameStore(state => state.setPlayer);
  const earnPoints = useGameStore(state => state.earnPoints);

  // Debug logging (reduced)
  console.log('App component rendered, isInitialized:', isInitialized);

  useEffect(() => {
    // Simplified initialization for development
    const init = async () => {
      try {
        console.log('Initializing app...');

        // Initialize player with mock data
        console.log('Initializing player...');
        if (typeof initializePlayer === 'function') {
          initializePlayer({
            id: 12345,
            username: 'testuser',
            first_name: 'Test',
            last_name: 'User'
          });
          console.log('Player initialized successfully');
        } else {
          console.error('initializePlayer is not a function:', typeof initializePlayer);
        }

        console.log('Player initialized, setting app as initialized...');
        setIsInitialized(true);
        console.log('App initialization complete!');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Force initialization even on error
        setIsInitialized(true);
      }
    };

    // Add a small delay to ensure everything is loaded
    setTimeout(init, 100);

    // Fallback: force initialization after 3 seconds if it hasn't happened
    const fallbackTimeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('Forcing app initialization due to timeout');
        setIsInitialized(true);
      }
    }, 3000);

    // Reset daily actions on app launch
    try {
      if (typeof resetDailyActions === 'function') {
        resetDailyActions();
        console.log('Daily actions reset successfully');
      } else {
        console.error('resetDailyActions is not a function:', typeof resetDailyActions);
      }
    } catch (error) {
      console.error('Failed to reset daily actions:', error);
    }

    // Check daily actions every minute
    const interval = setInterval(() => {
      try {
        if (typeof resetDailyActions === 'function') {
          resetDailyActions();
        }
      } catch (error) {
        console.error('Failed to reset daily actions in interval:', error);
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
    };
  }, []); // Empty dependency array - run only once on mount

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <Router>
        <AntiCheatWrapper>
          <div className="min-h-screen bg-gray-900 text-white pb-16 relative">
            <ParticleBackground intensity="low" />
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/business" element={<BusinessPage />} />
                <Route path="/career" element={<CareerPage />} />
                <Route path="/invest" element={<InvestmentPage />} />
                <Route path="/social" element={<SocialPage />} />
                <Route path="/staking" element={<StakingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Navigation />
            </div>
          </div>
        </AntiCheatWrapper>
      </Router>
    </TonConnectUIProvider>
  );
}

export default App;
