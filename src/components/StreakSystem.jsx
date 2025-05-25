import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/formatters';
import AnimatedButton from './AnimatedButton';

const StreakSystem = ({ onStreakReward }) => {
  const [streak, setStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [lastClaimDate, setLastClaimDate] = useState(null);

  useEffect(() => {
    checkStreakStatus();
  }, []);

  const checkStreakStatus = () => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem('lastStreakClaim');
    const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');

    setLastClaimDate(lastClaim);
    setStreak(currentStreak);

    if (!lastClaim) {
      // First time user
      setCanClaim(true);
    } else {
      const lastClaimDate = new Date(lastClaim);
      const todayDate = new Date(today);
      const diffTime = todayDate - lastClaimDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Can claim today (next day)
        setCanClaim(true);
      } else if (diffDays > 1) {
        // Streak broken, reset
        setStreak(0);
        localStorage.setItem('currentStreak', '0');
        setCanClaim(true);
      } else {
        // Already claimed today
        setCanClaim(false);
      }
    }
  };

  const claimStreak = () => {
    const newStreak = streak + 1;
    const today = new Date().toDateString();

    setStreak(newStreak);
    setCanClaim(false);
    setShowReward(true);

    localStorage.setItem('currentStreak', newStreak.toString());
    localStorage.setItem('lastStreakClaim', today);

    // Calculate reward based on streak
    const baseReward = 500;
    const streakMultiplier = Math.min(newStreak * 0.1, 2); // Max 2x multiplier at 20 days
    const reward = Math.floor(baseReward * (1 + streakMultiplier));

    onStreakReward(reward, newStreak);

    setTimeout(() => setShowReward(false), 3000);
  };

  const getStreakReward = (streakDay) => {
    const baseReward = 500;
    const streakMultiplier = Math.min(streakDay * 0.1, 2);
    return Math.floor(baseReward * (1 + streakMultiplier));
  };

  const getStreakIcon = (day) => {
    if (day <= 3) return '🔥';
    if (day <= 7) return '⚡';
    if (day <= 14) return '💎';
    if (day <= 30) return '👑';
    return '🌟';
  };

  return (
    <>
      <motion.div
        className="bg-gradient-to-r from-orange-800/30 to-red-800/30 rounded-xl p-4 mb-6 border border-orange-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getStreakIcon(streak + 1)}</span>
            <div>
              <h3 className="font-bold text-white">Daily Streak</h3>
              <p className="text-sm text-gray-400">
                {streak > 0 ? `${streak} days in a row!` : 'Start your streak today'}
              </p>
            </div>
          </div>

          {canClaim && (
            <AnimatedButton
              variant="success"
              size="sm"
              onClick={claimStreak}
              className="bg-gradient-to-r from-orange-500 to-red-600"
            >
              Claim +{formatNumber(getStreakReward(streak + 1))}
            </AnimatedButton>
          )}
        </div>

        {/* Streak Progress */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {[...Array(7)].map((_, i) => {
            const day = i + 1;
            const isCompleted = day <= streak;
            const isCurrent = day === streak + 1 && canClaim;

            return (
              <motion.div
                key={i}
                className={`
                  h-8 rounded-lg flex items-center justify-center text-xs font-bold
                  ${isCompleted
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : isCurrent
                      ? 'bg-yellow-400 text-gray-900 animate-pulse'
                      : 'bg-gray-700 text-gray-400'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
              >
                {day}
              </motion.div>
            );
          })}
        </div>

        {/* Next Rewards Preview */}
        <div className="text-xs text-gray-400">
          <span>Next rewards: </span>
          {[1, 2, 3].map(i => {
            const nextDay = streak + i;
            const reward = getStreakReward(nextDay);
            return (
              <span key={i} className="text-yellow-400 mr-2">
                Day {nextDay}: {formatNumber(reward)}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* Streak Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-center shadow-2xl"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                {getStreakIcon(streak)}
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Streak Bonus!</h2>
              <p className="text-xl text-orange-100">Day {streak}</p>
              <p className="text-lg text-orange-200 mt-2">
                +{formatNumber(getStreakReward(streak))} points
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StreakSystem; 