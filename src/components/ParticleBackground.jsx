import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = ({ intensity = 'low' }) => {
  const [particles, setParticles] = useState([]);

  const intensitySettings = {
    low: { count: 15, speed: 20 },
    medium: { count: 25, speed: 15 },
    high: { count: 40, speed: 10 }
  };

  const settings = intensitySettings[intensity] || intensitySettings.low;

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < settings.count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          duration: Math.random() * settings.speed + 10,
          delay: Math.random() * 5,
          type: Math.random() > 0.7 ? 'star' : 'circle'
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [settings.count, settings.speed]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.type === 'star'
              ? 'text-yellow-400'
              : 'bg-gradient-to-br from-blue-400 to-purple-500 rounded-full'
            }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.type === 'circle' ? `${particle.size}px` : 'auto',
            height: particle.type === 'circle' ? `${particle.size}px` : 'auto',
            fontSize: particle.type === 'star' ? `${particle.size * 4}px` : 'inherit'
          }}
          initial={{
            opacity: 0,
            scale: 0,
            y: 0
          }}
          animate={{
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0],
            y: [-20, -100, -180],
            x: [0, Math.random() * 40 - 20, Math.random() * 80 - 40]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          {particle.type === 'star' && '✨'}
        </motion.div>
      ))}

      {/* Ambient glow effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>
    </div>
  );
};

export default ParticleBackground; 