import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/formatters';

const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  business, 
  currentLevel, 
  upgradeCost, 
  onUpgrade, 
  canAfford 
}) => {
  if (!business) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">{business.icon}</span>
              <h2 className="text-2xl font-bold mb-2">{business.name}</h2>
              <p className="text-gray-400">{business.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Level:</span>
                <span className="text-white font-semibold">{currentLevel}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Upgrade Cost:</span>
                <span className="text-yellow-400 font-semibold">{formatNumber(upgradeCost)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sector:</span>
                <span className="text-white">{business.sector}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={() => {
                  onUpgrade();
                  onClose();
                }}
                disabled={!canAfford}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  canAfford
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentLevel === 0 ? 'Buy' : 'Upgrade'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;