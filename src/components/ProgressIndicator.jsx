import React from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from '../utils/formatters';

const ProgressIndicator = ({
  current,
  target,
  label,
  icon,
  color = 'blue',
  showPercentage = true,
  animated = true
}) => {
  const percentage = Math.min((current / target) * 100, 100);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-400',
      gradient: 'from-blue-400 to-blue-600'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-400',
      gradient: 'from-green-400 to-green-600'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-yellow-600'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-400',
      gradient: 'from-purple-400 to-purple-600'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-400',
      gradient: 'from-orange-400 to-orange-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-gray-800/50 rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="font-semibold text-white text-sm">{label}</span>
        </div>
        {showPercentage && (
          <span className={`text-sm font-bold ${colors.text}`}>
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors.gradient}`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
        />
      </div>

      {/* Values */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatNumber(current)}</span>
        <span>{formatNumber(target)}</span>
      </div>
    </div>
  );
};

export default ProgressIndicator; 