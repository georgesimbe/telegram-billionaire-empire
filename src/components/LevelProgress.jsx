import React from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from '../config/gameConfig';

const LevelProgress = ({ level = 1, xp = 0 }) => {
  // Calculate required XP for current level
  const baseXP = GAME_CONFIG.LEVELS.XP_PER_LEVEL;
  const scaling = GAME_CONFIG.LEVELS.XP_SCALING;
  const requiredXP = Math.floor(baseXP * Math.pow(scaling, level - 1));

  // Ensure values are valid numbers
  const currentXP = Math.max(0, xp || 0);
  const progress = Math.min(100, (currentXP / requiredXP) * 100);
  const xpToNext = Math.max(0, requiredXP - currentXP);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="font-semibold">Level {level}</span>
        </div>
        <span className="text-sm text-gray-400">
          {currentXP} / {requiredXP} XP
        </span>
      </div>

      <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="mt-2 text-xs text-gray-400 text-center">
        {xpToNext} XP to next level
      </div>
    </div>
  );
};

export default LevelProgress;