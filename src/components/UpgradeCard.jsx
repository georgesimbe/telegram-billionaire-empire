import React from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from '../utils/formatters';
import AnimatedButton from './AnimatedButton';

const UpgradeCard = ({
  upgrade,
  onPurchase,
  canAfford,
  owned = 0,
  disabled = false
}) => {
  const {
    id,
    name,
    description,
    icon,
    baseCost,
    costMultiplier,
    effect,
    maxLevel
  } = upgrade;

  // Calculate current cost based on owned level
  const currentCost = Math.floor(baseCost * Math.pow(costMultiplier, owned));
  const isMaxLevel = maxLevel && owned >= maxLevel;

  const handlePurchase = () => {
    if (!disabled && canAfford && !isMaxLevel) {
      onPurchase(id);
    }
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 
        ${canAfford && !isMaxLevel ? 'border-yellow-400/50 hover:border-yellow-400' : 'border-gray-600'}
        ${disabled ? 'opacity-50' : ''}
        transition-all duration-300
      `}
      whileHover={!disabled && canAfford && !isMaxLevel ? { scale: 1.02, y: -2 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="font-bold text-white">{name}</h3>
            {owned > 0 && (
              <p className="text-sm text-yellow-400">Level {owned}</p>
            )}
          </div>
        </div>

        {isMaxLevel && (
          <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            MAX
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-3 leading-relaxed">
        {description}
      </p>

      {/* Effect */}
      <div className="bg-gray-700/50 rounded-lg p-2 mb-3">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">Effect:</span> {effect}
        </p>
      </div>

      {/* Cost and Purchase */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {isMaxLevel ? (
            <span className="text-green-400 font-semibold">Maxed Out</span>
          ) : (
            <>
              <span className="text-gray-400">Cost: </span>
              <span className={`font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                {formatNumber(currentCost)}
              </span>
            </>
          )}
        </div>

        {!isMaxLevel && (
          <AnimatedButton
            variant={canAfford ? "primary" : "secondary"}
            size="sm"
            onClick={handlePurchase}
            disabled={disabled || !canAfford}
            className="min-w-[80px]"
          >
            {owned > 0 ? 'Upgrade' : 'Buy'}
          </AnimatedButton>
        )}
      </div>

      {/* Progress bar for multi-level upgrades */}
      {maxLevel && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{owned}/{maxLevel}</span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(owned / maxLevel) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UpgradeCard; 