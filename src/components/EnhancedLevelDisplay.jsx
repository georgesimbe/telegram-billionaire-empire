import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/formatters';
import { GAME_CONFIG } from '../config/gameConfig';
import AnimatedButton from './AnimatedButton';

const EnhancedLevelDisplay = ({ level = 1, xp = 0, onShowDetails }) => {
  const [showModal, setShowModal] = useState(false);

  // Calculate XP requirements with scaling
  const getXPForLevel = (targetLevel) => {
    const baseXP = GAME_CONFIG.LEVELS.XP_PER_LEVEL;
    const scaling = GAME_CONFIG.LEVELS.SCALING;
    return Math.floor(baseXP * Math.pow(scaling, targetLevel - 1));
  };

  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const xpProgress = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const progressPercentage = Math.max(0, Math.min(100, (xpProgress / xpNeeded) * 100));

  // Get level benefits
  const getLevelBenefits = (targetLevel) => {
    const benefits = [];

    // Click power increases every level
    benefits.push(`Click Power: ${targetLevel}`);

    // Special unlocks at certain levels
    if (targetLevel >= 5) benefits.push('Unlock: Business Upgrades');
    if (targetLevel >= 10) benefits.push('Unlock: Investment Options');
    if (targetLevel >= 15) benefits.push('Unlock: Franchise System');
    if (targetLevel >= 20) benefits.push('Unlock: Manager Hiring');
    if (targetLevel >= 25) benefits.push('Unlock: Global Markets');
    if (targetLevel >= 30) benefits.push('Unlock: Automation Systems');
    if (targetLevel >= 50) benefits.push('Unlock: Mega Corporations');
    if (targetLevel >= 75) benefits.push('Unlock: Space Ventures');
    if (targetLevel >= 100) benefits.push('Unlock: Time Travel Business');

    // Passive bonuses
    if (targetLevel % 10 === 0) benefits.push(`+${targetLevel / 10}% Passive Income Bonus`);
    if (targetLevel % 5 === 0) benefits.push(`Daily Bonus: +${targetLevel * 100} points`);

    return benefits;
  };

  const currentBenefits = getLevelBenefits(level);
  const nextBenefits = getLevelBenefits(level + 1);

  // Get level tier and color
  const getLevelTier = (targetLevel) => {
    if (targetLevel >= 100) return { name: 'Legendary', color: 'from-purple-500 to-pink-500', icon: '👑' };
    if (targetLevel >= 75) return { name: 'Master', color: 'from-yellow-400 to-orange-500', icon: '🏆' };
    if (targetLevel >= 50) return { name: 'Expert', color: 'from-blue-400 to-purple-500', icon: '💎' };
    if (targetLevel >= 25) return { name: 'Advanced', color: 'from-green-400 to-blue-500', icon: '⭐' };
    if (targetLevel >= 10) return { name: 'Intermediate', color: 'from-yellow-500 to-green-500', icon: '🌟' };
    return { name: 'Beginner', color: 'from-gray-400 to-gray-600', icon: '🔰' };
  };

  const currentTier = getLevelTier(level);
  const nextTier = getLevelTier(level + 1);

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-xl p-4 mb-4 border border-purple-500/30 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowModal(true)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentTier.color} flex items-center justify-center text-xl`}>
              {currentTier.icon}
            </div>
            <div>
              <h3 className="font-bold text-white">Level {level}</h3>
              <p className="text-sm text-gray-400">{currentTier.name}</p>
            </div>
          </div>
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            ℹ️
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">XP Progress</span>
            <span className="text-purple-400 font-medium">
              {formatNumber(xpProgress)} / {formatNumber(xpNeeded)}
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatNumber(nextLevelXP - xp)} XP to next level
          </p>
        </div>

        {/* Quick Benefits Preview */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-800/50 rounded-lg p-2">
            <p className="text-gray-400">Click Power</p>
            <p className="font-bold text-white">{level}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <p className="text-gray-400">Next Unlock</p>
            <p className="font-bold text-purple-400">
              {nextBenefits.find(b => b.includes('Unlock:'))?.replace('Unlock: ', '') || 'Level Up!'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentTier.color} flex items-center justify-center text-2xl`}>
                    {currentTier.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Level {level}</h2>
                    <p className="text-purple-400">{currentTier.name} Tier</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Progress Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">Progress to Level {level + 1}</h3>
                <div className="bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{formatNumber(xpProgress)} XP</span>
                  <span className="text-purple-400">{progressPercentage.toFixed(1)}%</span>
                  <span className="text-gray-400">{formatNumber(xpNeeded)} XP</span>
                </div>
              </div>

              {/* Current Benefits */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  Current Benefits
                </h3>
                <div className="space-y-2">
                  {currentBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="bg-green-800/20 border border-green-600/30 rounded-lg p-2 text-sm text-green-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      ✓ {benefit}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Next Level Benefits */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>🚀</span>
                  Level {level + 1} Benefits
                </h3>
                <div className="space-y-2">
                  {nextBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="bg-blue-800/20 border border-blue-600/30 rounded-lg p-2 text-sm text-blue-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      → {benefit}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Level Milestones */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>🏁</span>
                  Upcoming Milestones
                </h3>
                <div className="space-y-2">
                  {[5, 10, 15, 20, 25, 30, 50, 75, 100].filter(milestone => milestone > level).slice(0, 3).map((milestone, index) => {
                    const milestoneXP = getXPForLevel(milestone);
                    const milestoneTier = getLevelTier(milestone);
                    return (
                      <motion.div
                        key={milestone}
                        className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${milestoneTier.color} flex items-center justify-center text-sm`}>
                            {milestoneTier.icon}
                          </div>
                          <div>
                            <p className="font-medium text-white">Level {milestone}</p>
                            <p className="text-xs text-gray-400">{milestoneTier.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-purple-400">{formatNumber(milestoneXP)} XP</p>
                          <p className="text-xs text-gray-500">
                            {formatNumber(milestoneXP - xp)} needed
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Close Button */}
              <AnimatedButton
                variant="primary"
                size="md"
                onClick={() => setShowModal(false)}
                className="w-full"
              >
                Close
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedLevelDisplay; 