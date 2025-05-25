import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StreakSystem from './StreakSystem';
import MiniGame from './MiniGame';
import QuickUpgradePanel from './QuickUpgradePanel';

const SideMenuPopup = ({
  playerPoints,
  upgrades,
  onUpgradePurchase,
  onStreakReward,
  onGameReward
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('streak');

  const tabs = [
    { id: 'streak', label: 'Streak', icon: '🔥' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'upgrades', label: 'Upgrades', icon: '⚡' }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Menu Toggle Button */}
      <motion.button
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-white text-xl">
          {isOpen ? '✕' : '☰'}
        </span>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-gray-900 to-gray-800 z-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                <button
                  onClick={toggleMenu}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'text-white bg-gray-700 border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {activeTab === 'streak' && (
                  <motion.div
                    key="streak"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StreakSystem onStreakReward={onStreakReward} />
                  </motion.div>
                )}

                {activeTab === 'games' && (
                  <motion.div
                    key="games"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MiniGame onGameReward={onGameReward} />
                  </motion.div>
                )}

                {activeTab === 'upgrades' && (
                  <motion.div
                    key="upgrades"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuickUpgradePanel
                      playerPoints={playerPoints}
                      upgrades={upgrades}
                      onUpgradePurchase={onUpgradePurchase}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideMenuPopup; 