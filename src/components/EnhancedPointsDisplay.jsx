import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/formatters';
import AnimatedButton from './AnimatedButton';

const EnhancedPointsDisplay = ({ points = 0, cash = 0, onTrade }) => {
  const [showTrading, setShowTrading] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeDirection, setTradeDirection] = useState('pointsToTon'); // pointsToTon or tonToPoints
  const [tonValue, setTonValue] = useState(0);
  const [tonPrice, setTonPrice] = useState(2.5); // Mock TON price in USD

  // Calculate TON value (1000 points = 1 TON for example)
  useEffect(() => {
    const calculatedTonValue = points / 1000;
    setTonValue(calculatedTonValue);
  }, [points]);

  const handleTrade = () => {
    const amount = parseFloat(tradeAmount);
    if (!amount || amount <= 0) return;

    if (tradeDirection === 'pointsToTon') {
      if (amount > points) {
        alert('Insufficient points!');
        return;
      }
      // Convert points to TON
      const tonReceived = amount / 1000;
      onTrade?.({ type: 'pointsToTon', pointsSpent: amount, tonReceived });
    } else {
      // Convert TON to points (if user has TON)
      const pointsReceived = amount * 1000;
      onTrade?.({ type: 'tonToPoints', tonSpent: amount, pointsReceived });
    }

    setTradeAmount('');
    setShowTrading(false);
  };

  const getMaxTradeAmount = () => {
    return tradeDirection === 'pointsToTon' ? points : tonValue;
  };

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 mb-6 border border-yellow-500/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Main Display */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Points */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Points</p>
            <motion.p
              className="text-2xl font-bold text-yellow-400"
              key={points}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatNumber(points)}
            </motion.p>
          </div>

          {/* Cash */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Cash</p>
            <motion.p
              className="text-2xl font-bold text-green-400"
              key={cash}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ${formatNumber(cash)}
            </motion.p>
          </div>
        </div>

        {/* TON Value Section */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">≈ TON Value</span>
            <span className="text-xs text-gray-500">1000 pts = 1 TON</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="text-xl font-bold text-blue-400">
                {tonValue.toFixed(3)} TON
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">≈ ${(tonValue * tonPrice).toFixed(2)}</p>
              <p className="text-xs text-gray-500">${tonPrice}/TON</p>
            </div>
          </div>
        </div>

        {/* Trade Button */}
        <AnimatedButton
          variant="primary"
          size="md"
          onClick={() => setShowTrading(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <span className="flex items-center justify-center gap-2">
            <span>💱</span>
            Trade Points ↔ TON
          </span>
        </AnimatedButton>
      </motion.div>

      {/* Trading Modal */}
      <AnimatePresence>
        {showTrading && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Trade</h3>
                <button
                  onClick={() => setShowTrading(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Trade Direction Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setTradeDirection('pointsToTon')}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${tradeDirection === 'pointsToTon'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                    }`}
                >
                  Points → TON
                </button>
                <button
                  onClick={() => setTradeDirection('tonToPoints')}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${tradeDirection === 'tonToPoints'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                    }`}
                >
                  TON → Points
                </button>
              </div>

              {/* Trade Input */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  {tradeDirection === 'pointsToTon' ? 'Points to Trade' : 'TON to Trade'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    max={getMaxTradeAmount()}
                  />
                  <button
                    onClick={() => setTradeAmount(getMaxTradeAmount().toString())}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300"
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Available: {formatNumber(getMaxTradeAmount())} {tradeDirection === 'pointsToTon' ? 'points' : 'TON'}
                </p>
              </div>

              {/* Trade Preview */}
              {tradeAmount && (
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-400 mb-1">You will receive:</p>
                  <p className="text-lg font-bold text-green-400">
                    {tradeDirection === 'pointsToTon'
                      ? `${(parseFloat(tradeAmount) / 1000).toFixed(3)} TON`
                      : `${formatNumber(parseFloat(tradeAmount) * 1000)} points`
                    }
                  </p>
                </div>
              )}

              {/* Trade Actions */}
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton
                  variant="secondary"
                  size="md"
                  onClick={() => setShowTrading(false)}
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  variant="success"
                  size="md"
                  onClick={handleTrade}
                  disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
                >
                  Trade
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedPointsDisplay; 