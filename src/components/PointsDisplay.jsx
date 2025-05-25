import React from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from '../utils/formatters';

const PointsDisplay = ({ points = 0, cash = 0 }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl p-6 mb-6 shadow-lg">
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-yellow-100 mb-1">Points</p>
          <p className="text-3xl font-bold text-white">
            {formatNumber(points)}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center"
        >
          <p className="text-sm text-yellow-100 mb-1">Cash</p>
          <p className="text-3xl font-bold text-white">
            ${formatNumber(cash)}
          </p>
        </motion.div>
      </div>

      <div className="mt-4 pt-4 border-t border-yellow-400">
        <div className="flex justify-between items-center text-sm">
          <span className="text-yellow-100">≈ TON Value</span>
          <span className="font-bold text-white">
            {(points / 10000).toFixed(2)} TON
          </span>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;