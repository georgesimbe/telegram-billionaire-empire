import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/formatters';

const PointsDisplay = ({ points = 0, cash = 0 }) => {
  const [prevPoints, setPrevPoints] = useState(points);
  const [pointsChange, setPointsChange] = useState(0);
  const [showChange, setShowChange] = useState(false);

  // Track points changes for animation
  useEffect(() => {
    if (points !== prevPoints) {
      const change = points - prevPoints;
      if (change > 0) {
        setPointsChange(change);
        setShowChange(true);
        setTimeout(() => setShowChange(false), 2000);
      }
      setPrevPoints(points);
    }
  }, [points, prevPoints]);

  const tonValue = (points / 10000).toFixed(3);

  return (
    <div className="relative">
      {/* Main display card */}
      <motion.div
        className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-orange-500 rounded-2xl p-6 mb-6 shadow-2xl border border-yellow-400"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 rounded-2xl opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent transform rotate-45"></div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-4">
            {/* Points Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center relative"
            >
              <p className="text-sm text-yellow-100 mb-1 font-medium">Points</p>
              <motion.p
                className="text-3xl font-bold text-white"
                key={points} // Re-animate when points change
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                {formatNumber(points)}
              </motion.p>

              {/* Points change indicator */}
              <AnimatePresence>
                {showChange && pointsChange > 0 && (
                  <motion.div
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-green-300 font-bold text-sm"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -10, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    +{formatNumber(pointsChange)}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cash Section */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="text-sm text-yellow-100 mb-1 font-medium">Cash</p>
              <motion.p
                className="text-3xl font-bold text-white"
                key={cash}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                ${formatNumber(cash)}
              </motion.p>
            </motion.div>
          </div>

          {/* TON Value Section */}
          <motion.div
            className="mt-4 pt-4 border-t border-yellow-400/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-yellow-100 font-medium">≈ TON Value</span>
              <motion.span
                className="font-bold text-white flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-blue-200">💎</span>
                {tonValue} TON
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Floating sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PointsDisplay;