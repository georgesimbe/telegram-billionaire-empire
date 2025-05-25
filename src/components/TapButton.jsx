import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TapButton = ({ onTap, points = 1, disabled = false, level = 1 }) => {
  const [tapEffects, setTapEffects] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState([]);

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

    // Create particle effects based on click power
    const particleCount = Math.min(points, 10); // Max 10 particles
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + Math.random() + i,
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        color: getParticleColor(points),
        size: Math.random() * 4 + 2
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);

    // Remove effects after animation
    setTimeout(() => {
      setTapEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);

    setTimeout(() => {
      setParticles(prev => prev.filter(particle => 
        !newParticles.some(newP => newP.id === particle.id)
      ));
    }, 1500);

    onTap();
  };

  const getParticleColor = (clickPower) => {
    if (clickPower >= 10) return 'bg-purple-400';
    if (clickPower >= 5) return 'bg-blue-400';
    if (clickPower >= 3) return 'bg-green-400';
    return 'bg-yellow-400';
  };

  const getButtonSize = (clickPower) => {
    const baseSize = 192; // 48 * 4 (w-48 h-48)
    const bonus = Math.min(clickPower * 2, 32); // Max 32px bonus
    return baseSize + bonus;
  };

  const buttonSize = getButtonSize(points);

  return (
    <div className="relative flex items-center justify-center">
      {/* Main tap button */}
      <motion.button
        className={`
          relative rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600
          shadow-2xl border-4 border-yellow-300 overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{ 
          width: `${buttonSize}px`, 
          height: `${buttonSize}px`,
          boxShadow: points >= 10 
            ? '0 0 40px rgba(147, 51, 234, 0.6), 0 20px 40px rgba(255, 165, 0, 0.5)'
            : points >= 5
            ? '0 0 30px rgba(59, 130, 246, 0.6), 0 20px 40px rgba(255, 165, 0, 0.5)'
            : '0 20px 40px rgba(255, 165, 0, 0.5)'
        }}
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

      {/* Particle effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute pointer-events-none rounded-full ${particle.color}`}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size
            }}
            initial={{
              opacity: 1,
              scale: 0,
              y: 0
            }}
            animate={{
              opacity: 0,
              scale: 1.5,
              y: -60,
              x: (Math.random() - 0.5) * 100
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
              scale: { duration: 0.3 }
            }}
          />
        ))}
      </AnimatePresence>

      {/* Click power indicator */}
      {points > 1 && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full px-3 py-1 border border-yellow-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-yellow-400 font-bold text-sm">
            +{points} per tap
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default TapButton; 