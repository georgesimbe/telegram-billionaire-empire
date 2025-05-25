import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TapButton = ({ onTap, points = 1, disabled = false }) => {
  const [tapEffects, setTapEffects] = useState([]);
  const [isPressed, setIsPressed] = useState(false);

  const handleTap = (event) => {
    if (disabled) return;

    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Create floating point effect
    const newEffect = {
      id: Date.now() + Math.random(),
      x,
      y,
      points
    };

    setTapEffects(prev => [...prev, newEffect]);

    // Remove effect after animation
    setTimeout(() => {
      setTapEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);

    onTap();
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Main tap button */}
      <motion.button
        className={`
          relative w-48 h-48 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600
          shadow-2xl border-4 border-yellow-300 overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        onTap={handleTap}
        disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        animate={{
          scale: isPressed ? 0.95 : 1,
          boxShadow: isPressed
            ? '0 10px 30px rgba(255, 165, 0, 0.3)'
            : '0 20px 40px rgba(255, 165, 0, 0.5)'
        }}
        transition={{ duration: 0.1 }}
      >
        {/* Pulsing inner glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-80"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 0.6, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-6xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            💰
          </motion.div>
        </div>

        {/* Sparkle effects */}
        {!disabled && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-200 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </motion.button>

      {/* Floating point effects */}
      <AnimatePresence>
        {tapEffects.map((effect) => (
          <motion.div
            key={effect.id}
            className="absolute pointer-events-none text-2xl font-bold text-yellow-400 z-10"
            style={{
              left: effect.x,
              top: effect.y
            }}
            initial={{
              opacity: 1,
              scale: 0.5,
              y: 0
            }}
            animate={{
              opacity: 0,
              scale: 1.2,
              y: -100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            +{effect.points}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TapButton; 