import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import UpgradeCard from '../components/UpgradeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationToast from '../components/NotificationToast';
import {
  UPGRADES_CONFIG,
  UPGRADE_CATEGORIES,
  getUpgradesByCategory,
  calculateUpgradeCost
} from '../config/upgradesConfig';
import { formatNumber } from '../utils/formatters';

const UpgradesPage = () => {
  const player = useGameStore(state => state.player);
  const upgrades = useGameStore(state => state.upgrades || {});
  const spendPoints = useGameStore(state => state.spendPoints);
  const setUpgrades = useGameStore(state => state.setUpgrades);

  const [selectedCategory, setSelectedCategory] = useState('click');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleUpgradePurchase = async (upgradeId) => {
    const upgrade = UPGRADES_CONFIG[upgradeId];
    if (!upgrade) return;

    const currentLevel = upgrades[upgradeId] || 0;
    const cost = calculateUpgradeCost(upgrade, currentLevel);

    if (player.points < cost) {
      showNotification('Not enough points!', 'error');
      return;
    }

    if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) {
      showNotification('Upgrade is already at maximum level!', 'warning');
      return;
    }

    setLoading(true);

    try {
      // Spend points
      const success = spendPoints(cost);
      if (!success) {
        showNotification('Transaction failed!', 'error');
        return;
      }

      // Update upgrades
      const newUpgrades = {
        ...upgrades,
        [upgradeId]: currentLevel + 1
      };
      setUpgrades(newUpgrades);

      showNotification(
        `${upgrade.name} upgraded to level ${currentLevel + 1}!`,
        'success',
        'Upgrade Purchased!'
      );

      // Apply upgrade effects immediately
      applyUpgradeEffects(upgradeId, currentLevel + 1);

    } catch (error) {
      console.error('Failed to purchase upgrade:', error);
      showNotification('Failed to purchase upgrade', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyUpgradeEffects = (upgradeId, level) => {
    const upgrade = UPGRADES_CONFIG[upgradeId];
    if (!upgrade) return;

    // This would typically update the game store with new bonuses
    // For now, we'll just show the effect in a notification
    showNotification(
      `${upgrade.effect} applied!`,
      'info',
      'Effect Active'
    );
  };

  const categoryUpgrades = getUpgradesByCategory(selectedCategory);

  return (
    <>
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      <div className="p-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Upgrades
          </h1>
          <p className="text-gray-400">Enhance your empire with powerful upgrades</p>

          {/* Points Display */}
          <div className="mt-4 bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-400">💰</span>
              <span className="text-lg font-bold text-white">
                {formatNumber(player.points)} Points
              </span>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex gap-2 mb-6 overflow-x-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {Object.values(UPGRADE_CATEGORIES).map((category) => (
            <motion.button
              key={category.id}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${selectedCategory === category.id
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span className="text-sm">{category.name}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Category Description */}
        <motion.div
          className="bg-gray-800/50 rounded-lg p-3 mb-6"
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {UPGRADE_CATEGORIES[selectedCategory.toUpperCase()]?.icon}
            </span>
            <div>
              <h3 className="font-semibold text-white">
                {UPGRADE_CATEGORIES[selectedCategory.toUpperCase()]?.name}
              </h3>
              <p className="text-sm text-gray-400">
                {UPGRADE_CATEGORIES[selectedCategory.toUpperCase()]?.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Upgrades Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {categoryUpgrades.map((upgrade, index) => {
              const currentLevel = upgrades[upgrade.id] || 0;
              const cost = calculateUpgradeCost(upgrade, currentLevel);
              const canAfford = player.points >= cost;

              return (
                <motion.div
                  key={upgrade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <UpgradeCard
                    upgrade={upgrade}
                    onPurchase={handleUpgradePurchase}
                    canAfford={canAfford}
                    owned={currentLevel}
                    disabled={loading}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Loading Overlay */}
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner size="lg" text="Processing upgrade..." />
          </motion.div>
        )}

        {/* Empty State */}
        {categoryUpgrades.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-500">
              More upgrades in this category will be available soon!
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default UpgradesPage; 