import React from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from '../utils/formatters';
import ProgressIndicator from './ProgressIndicator';

const EnhancedStats = ({ player, businesses, upgrades, passiveIncome }) => {
  const businessCount = Object.values(businesses).filter(level => level > 0).length;
  const upgradeCount = Object.values(upgrades).reduce((sum, level) => sum + level, 0);
  const totalBusinessLevels = Object.values(businesses).reduce((sum, level) => sum + level, 0);

  const stats = [
    {
      label: 'Total Earned',
      value: formatNumber(player.totalEarned),
      icon: '💰',
      color: 'yellow',
      progress: {
        current: player.totalEarned,
        target: Math.max(player.totalEarned * 2, 100000),
        show: true
      }
    },
    {
      label: 'Businesses',
      value: businessCount,
      icon: '🏢',
      color: 'blue',
      progress: {
        current: businessCount,
        target: 10,
        show: businessCount < 10
      }
    },
    {
      label: 'Level',
      value: player.level,
      icon: '⭐',
      color: 'purple',
      progress: {
        current: player.level,
        target: Math.min(player.level + 5, 100),
        show: player.level < 100
      }
    },
    {
      label: 'Click Power',
      value: player.clickPower || 1,
      icon: '👆',
      color: 'orange',
      progress: {
        current: player.clickPower || 1,
        target: Math.max((player.clickPower || 1) * 2, 10),
        show: true
      }
    },
    {
      label: 'Upgrades',
      value: upgradeCount,
      icon: '⚡',
      color: 'green',
      progress: {
        current: upgradeCount,
        target: Math.max(upgradeCount + 5, 20),
        show: upgradeCount < 50
      }
    },
    {
      label: 'Passive Income',
      value: `${formatNumber(passiveIncome)}/hr`,
      icon: '💎',
      color: 'blue',
      progress: {
        current: passiveIncome,
        target: Math.max(passiveIncome * 2, 1000),
        show: passiveIncome > 0
      }
    }
  ];

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="font-bold text-white">Statistics</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-gray-700/50 rounded-lg p-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="font-bold text-white">{stat.value}</p>
              </div>
            </div>

            {stat.progress.show && (
              <div className="mt-2">
                <ProgressIndicator
                  current={stat.progress.current}
                  target={stat.progress.target}
                  label=""
                  color={stat.color}
                  showPercentage={false}
                  animated={false}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Achievement Progress */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span>🏆</span>
          Achievement Progress
        </h4>

        <div className="space-y-2">
          <ProgressIndicator
            current={player.level}
            target={10}
            label="Business Mogul"
            icon="👑"
            color="purple"
          />

          <ProgressIndicator
            current={player.totalEarned}
            target={1000000}
            label="Millionaire"
            icon="💰"
            color="yellow"
          />

          <ProgressIndicator
            current={businessCount}
            target={5}
            label="Empire Builder"
            icon="🏗️"
            color="blue"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedStats; 