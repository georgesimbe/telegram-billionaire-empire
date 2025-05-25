import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/formatters';

const PassiveIncomeDisplay = ({
  hourlyIncome = 0,
  businesses = {},
  activeBoosts = [],
  onCollectOffline
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [liveEarnings, setLiveEarnings] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Calculate earnings per second
  const earningsPerSecond = hourlyIncome / 3600;

  // Update live earnings every second
  useEffect(() => {
    if (hourlyIncome <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = (now - lastUpdate) / 1000;
      setLiveEarnings(prev => prev + (earningsPerSecond * timeDiff));
      setLastUpdate(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [hourlyIncome, earningsPerSecond, lastUpdate]);

  // Reset live earnings when collected
  const handleCollect = () => {
    if (liveEarnings > 0) {
      onCollectOffline?.(Math.floor(liveEarnings));
      setLiveEarnings(0);
    }
  };

  // Get business income breakdown
  const getBusinessBreakdown = () => {
    return Object.entries(businesses)
      .filter(([_, level]) => level > 0)
      .map(([businessId, level]) => {
        // Mock business data - in real app this would come from business config
        const businessData = {
          lemonade: { name: 'Lemonade Stand', icon: '🍋', baseIncome: 10 },
          pizza: { name: 'Pizza Shop', icon: '🍕', baseIncome: 50 },
          tech: { name: 'Tech Startup', icon: '💻', baseIncome: 200 },
          real_estate: { name: 'Real Estate', icon: '🏢', baseIncome: 1000 }
        };

        const business = businessData[businessId] || {
          name: businessId,
          icon: '🏪',
          baseIncome: 25
        };

        const income = business.baseIncome * level;
        return { ...business, level, income };
      });
  };

  const businessBreakdown = getBusinessBreakdown();

  if (hourlyIncome <= 0) {
    return (
      <motion.div
        className="bg-gray-800/30 border border-gray-600/50 rounded-xl p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <span className="text-4xl mb-2 block">💰</span>
          <p className="text-gray-400 text-sm">No passive income yet</p>
          <p className="text-xs text-gray-500 mt-1">Buy businesses to start earning!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-gradient-to-r from-green-800/30 to-emerald-800/30 border border-green-600/50 rounded-xl p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-xl">💰</span>
            <div>
              <h3 className="font-semibold text-white text-sm">Passive Income</h3>
              <p className="text-xs text-gray-400">
                {formatNumber(hourlyIncome)}/hour
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            {showDetails ? '▼' : '▶'}
          </button>
        </div>

        {/* Live Earnings */}
        <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Live Earnings</p>
              <motion.p
                className="text-lg font-bold text-green-400"
                key={Math.floor(liveEarnings)}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                +{formatNumber(Math.floor(liveEarnings))}
              </motion.p>
            </div>
            {liveEarnings >= 1 && (
              <motion.button
                onClick={handleCollect}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Collect
              </motion.button>
            )}
          </div>
        </div>

        {/* Active Boosts */}
        {activeBoosts.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {activeBoosts.map((boost, index) => (
              <motion.div
                key={index}
                className="bg-yellow-600/20 border border-yellow-500/30 rounded-full px-2 py-1 flex items-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-xs">{boost.icon}</span>
                <span className="text-xs text-yellow-400 font-medium">
                  {boost.multiplier}x
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Earnings Rate */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            +{formatNumber(earningsPerSecond * 60, 1)}/min • +{formatNumber(earningsPerSecond, 2)}/sec
          </p>
        </div>
      </motion.div>

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="bg-gray-800/50 rounded-xl p-4 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>📊</span>
              Income Breakdown
            </h4>

            <div className="space-y-2">
              {businessBreakdown.map((business, index) => (
                <motion.div
                  key={business.name}
                  className="flex items-center justify-between bg-gray-700/50 rounded-lg p-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{business.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{business.name}</p>
                      <p className="text-xs text-gray-400">Level {business.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">
                      {formatNumber(business.income)}/hr
                    </p>
                    <p className="text-xs text-gray-400">
                      {((business.income / hourlyIncome) * 100).toFixed(1)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-600 mt-3 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Total Income</span>
                <span className="font-bold text-green-400">
                  {formatNumber(hourlyIncome)}/hour
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PassiveIncomeDisplay; 