import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: '⚡',
      label: 'Upgrades',
      color: 'from-purple-500 to-blue-600',
      action: () => navigate('/upgrades')
    },
    {
      icon: '🏢',
      label: 'Business',
      color: 'from-blue-500 to-cyan-600',
      action: () => navigate('/business')
    },
    {
      icon: '👥',
      label: 'Social',
      color: 'from-green-500 to-emerald-600',
      action: () => navigate('/social')
    }
  ];

  const handleActionClick = (action) => {
    action.action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col gap-3 mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                className={`
                  w-12 h-12 rounded-full bg-gradient-to-r ${action.color}
                  flex items-center justify-center text-white shadow-lg
                  hover:shadow-xl transition-shadow duration-200
                `}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActionClick(action)}
              >
                <span className="text-lg">{action.icon}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className={`
          w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500
          flex items-center justify-center text-white shadow-lg
          hover:shadow-xl transition-all duration-200
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-2xl">+</span>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton; 