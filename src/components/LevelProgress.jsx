import React from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from '../config/gameConfig';

const LevelProgress = ({ level, xp }) => {
  const requiredXP = GAME_CONFIG.LEVELS.XP_PER_LEVEL * Math.pow(GAME_CONFIG.LEVELS.XP_SCALING, level - 1);
  const progress = (xp / requiredXP) * 100;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="font-semibold">Level {level}</span>
        </div>
        <span className="text-sm text-gray-400">
          {xp} / {Math.floor(requiredXP)} XP
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
        {Math.floor(requiredXP - xp)} XP to next level
      </div>
    </div>
  );
};

export default LevelProgress;