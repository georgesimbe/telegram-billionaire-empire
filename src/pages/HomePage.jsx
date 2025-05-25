import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import PointsDisplay from '../components/PointsDisplay';
import LevelProgress from '../components/LevelProgress';
import TapButton from '../components/TapButton';
import AnimatedButton from '../components/AnimatedButton';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationToast from '../components/NotificationToast';
import { gameApi, apiUtils } from '../services/api';
import { formatNumber } from '../utils/formatters';

const HomePage = () => {
  const player = useGameStore(state => state.player);
  const earnPoints = useGameStore(state => state.earnPoints);
  const businesses = useGameStore(state => state.businesses);
  const setPlayer = useGameStore(state => state.setPlayer);

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);

  // Load user profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await gameApi.getProfile();
      setPlayer(response.data.user);
      showNotification('Welcome back!', 'success');
    } catch (error) {
      console.error('Failed to load profile:', error);
      showNotification('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info', title = '') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleTap = async () => {
    try {
      const response = await gameApi.tap(1);
      setPlayer(prev => ({
        ...prev,
        points: response.data.points,
        level: response.data.level,
        clickPower: response.data.clickPower
      }));

      if (response.data.leveledUp) {
        showNotification(`Level up! You are now level ${response.data.level}`, 'success', 'Congratulations!');
      }
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      showNotification(errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading your empire..." />
      </div>
    );
  }

  return (
    <>
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      <div className="p-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Billionaire Empire
          </h1>
          <p className="text-gray-400">Tap to earn, invest to grow!</p>
        </motion.div>

        {/* Points Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PointsDisplay points={player.points} cash={player.cash || player.points} />
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LevelProgress level={player.level} experience={player.experience} />
        </motion.div>

        {/* Tap Area */}
        <motion.div
          className="mt-8 mb-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TapButton
            onTap={handleTap}
            points={player.clickPower || 1}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="bg-gray-800 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Earned</p>
              <p className="font-bold">{formatNumber(player.totalEarned || 0)}</p>
            </div>
            <div>
              <p className="text-gray-400">Businesses</p>
              <p className="font-bold">{player.businesses?.length || 0}</p>
            </div>
            <div>
              <p className="text-gray-400">Level</p>
              <p className="font-bold">{player.level}</p>
            </div>
            <div>
              <p className="text-gray-400">Click Power</p>
              <p className="font-bold">{player.clickPower || 1}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-6 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <AnimatedButton variant="secondary" size="md">
            Watch Ad 📺
          </AnimatedButton>
          <AnimatedButton variant="success" size="md">
            Invite Friends 👥
          </AnimatedButton>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;