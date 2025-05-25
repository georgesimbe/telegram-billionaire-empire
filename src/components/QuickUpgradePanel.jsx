import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../utils/formatters';
import { UPGRADES_CONFIG, calculateUpgradeCost } from '../config/upgradesConfig';
import AnimatedButton from './AnimatedButton';

const QuickUpgradePanel = ({ playerPoints, upgrades = {}, onUpgradePurchase }) => {
  const navigate = useNavigate();

  // Get top 3 affordable upgrades
  const getAffordableUpgrades = () => {
    const allUpgrades = Object.values(UPGRADES_CONFIG);

    return allUpgrades
      .map(upgrade => {
        const currentLevel = upgrades[upgrade.id] || 0;
        const cost = calculateUpgradeCost(upgrade, currentLevel);
        const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel;

        return {
          ...upgrade,
          currentLevel,
          cost,
          canAfford: playerPoints >= cost && !isMaxLevel,
          isMaxLevel
        };
      })
      .filter(upgrade => upgrade.canAfford)
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 3);
  };

  const affordableUpgrades = getAffordableUpgrades();

  if (affordableUpgrades.length === 0) {
    return (
      <motion.div
        className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white mb-1">Quick Upgrades</h3>
            <p className="text-sm text-gray-400">No affordable upgrades available</p>
          </div>
          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/upgrades')}
          >
            View All
          </AnimatedButton>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-xl p-4 mb-6 border border-purple-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white mb-1 flex items-center gap-2">
            <span>⚡</span>
            Quick Upgrades
          </h3>
          <p className="text-sm text-gray-400">Affordable upgrades for you</p>
        </div>
        <AnimatedButton
          variant="secondary"
          size="sm"
          onClick={() => navigate('/upgrades')}
        >
          View All
        </AnimatedButton>
      </div>

      <div className="space-y-3">
        {affordableUpgrades.map((upgrade, index) => (
          <motion.div
            key={upgrade.id}
            className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{upgrade.icon}</span>
              <div>
                <h4 className="font-semibold text-white text-sm">{upgrade.name}</h4>
                <p className="text-xs text-gray-400">{upgrade.effect}</p>
                {upgrade.currentLevel > 0 && (
                  <p className="text-xs text-yellow-400">Level {upgrade.currentLevel}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-bold text-yellow-400">
                  {formatNumber(upgrade.cost)}
                </p>
              </div>
              <AnimatedButton
                variant="primary"
                size="xs"
                onClick={() => onUpgradePurchase(upgrade.id)}
                className="min-w-[60px]"
              >
                {upgrade.currentLevel > 0 ? 'Up' : 'Buy'}
              </AnimatedButton>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickUpgradePanel; 