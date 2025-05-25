import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/formatters';
import AnimatedButton from './AnimatedButton';

const MiniGame = ({ onGameReward }) => {
  const [gameActive, setGameActive] = useState(false);
  const [gameType, setGameType] = useState(null);
  const [gameData, setGameData] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    checkGameCooldown();
  }, []);

  useEffect(() => {
    let interval;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const checkGameCooldown = () => {
    const lastPlayed = localStorage.getItem('lastMiniGame');
    if (lastPlayed) {
      const timeDiff = Date.now() - parseInt(lastPlayed);
      const cooldownTime = 5 * 60 * 1000; // 5 minutes

      if (timeDiff < cooldownTime) {
        setCanPlay(false);
        setTimeLeft(Math.ceil((cooldownTime - timeDiff) / 1000));
      }
    }
  };

  const startGame = (type) => {
    if (!canPlay) return;

    setGameType(type);
    setGameActive(true);

    switch (type) {
      case 'tap':
        startTapGame();
        break;
      case 'memory':
        startMemoryGame();
        break;
      case 'reaction':
        startReactionGame();
        break;
    }
  };

  const startTapGame = () => {
    setGameData({
      taps: 0,
      timeLeft: 10,
      target: 50
    });

    const interval = setInterval(() => {
      setGameData(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          endGame(prev.taps >= prev.target);
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const startMemoryGame = () => {
    const sequence = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setGameData({
      sequence,
      playerSequence: [],
      showingSequence: true,
      currentIndex: 0,
      phase: 'showing'
    });

    // Show sequence
    setTimeout(() => {
      setGameData(prev => ({ ...prev, showingSequence: false, phase: 'input' }));
    }, 3000);
  };

  const startReactionGame = () => {
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    setGameData({
      waiting: true,
      startTime: null,
      reactionTime: null
    });

    setTimeout(() => {
      setGameData(prev => ({
        ...prev,
        waiting: false,
        startTime: Date.now()
      }));
    }, delay);
  };

  const endGame = (won) => {
    setGameActive(false);
    setCanPlay(false);
    setTimeLeft(300); // 5 minute cooldown
    localStorage.setItem('lastMiniGame', Date.now().toString());

    if (won) {
      const baseReward = 200;
      const bonusMultiplier = gameType === 'reaction' ? 2 : 1.5;
      const reward = Math.floor(baseReward * bonusMultiplier);
      onGameReward(reward, gameType);
    }
  };

  const handleTap = () => {
    if (gameType === 'tap') {
      setGameData(prev => ({ ...prev, taps: prev.taps + 1 }));
    }
  };

  const handleMemoryClick = (index) => {
    if (gameType === 'memory' && gameData.phase === 'input') {
      const newPlayerSequence = [...gameData.playerSequence, index];

      if (newPlayerSequence[newPlayerSequence.length - 1] !== gameData.sequence[newPlayerSequence.length - 1]) {
        // Wrong answer
        endGame(false);
        return;
      }

      if (newPlayerSequence.length === gameData.sequence.length) {
        // Completed successfully
        endGame(true);
        return;
      }

      setGameData(prev => ({ ...prev, playerSequence: newPlayerSequence }));
    }
  };

  const handleReactionClick = () => {
    if (gameType === 'reaction' && !gameData.waiting && gameData.startTime) {
      const reactionTime = Date.now() - gameData.startTime;
      setGameData(prev => ({ ...prev, reactionTime }));

      // Good reaction time is under 500ms
      endGame(reactionTime < 500);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!canPlay && timeLeft > 0) {
    return (
      <motion.div
        className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 rounded-xl p-4 mb-6 border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h3 className="font-bold text-white mb-2 flex items-center justify-center gap-2">
            <span>🎮</span>
            Mini Games
          </h3>
          <p className="text-sm text-gray-400 mb-2">Next game available in:</p>
          <p className="text-lg font-bold text-blue-400">{formatTime(timeLeft)}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 rounded-xl p-4 mb-6 border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white mb-1 flex items-center gap-2">
              <span>🎮</span>
              Mini Games
            </h3>
            <p className="text-sm text-gray-400">Quick games for bonus points</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => startGame('tap')}
            disabled={!canPlay}
            className="flex flex-col items-center p-3"
          >
            <span className="text-lg mb-1">👆</span>
            <span className="text-xs">Tap Rush</span>
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => startGame('memory')}
            disabled={!canPlay}
            className="flex flex-col items-center p-3"
          >
            <span className="text-lg mb-1">🧠</span>
            <span className="text-xs">Memory</span>
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => startGame('reaction')}
            disabled={!canPlay}
            className="flex flex-col items-center p-3"
          >
            <span className="text-lg mb-1">⚡</span>
            <span className="text-xs">Reaction</span>
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Game Modal */}
      <AnimatePresence>
        {gameActive && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
            >
              {/* Tap Game */}
              {gameType === 'tap' && (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Tap Rush!</h3>
                  <p className="text-gray-300 mb-4">
                    Tap {gameData.target} times in {gameData.timeLeft} seconds
                  </p>
                  <div className="text-3xl font-bold text-yellow-400 mb-4">
                    {gameData.taps}/{gameData.target}
                  </div>
                  <div className="text-lg text-blue-400 mb-4">
                    Time: {gameData.timeLeft}s
                  </div>
                  <motion.button
                    className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-4xl"
                    whileTap={{ scale: 0.9 }}
                    onClick={handleTap}
                  >
                    👆
                  </motion.button>
                </div>
              )}

              {/* Memory Game */}
              {gameType === 'memory' && (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Memory Game</h3>
                  <p className="text-gray-300 mb-4">
                    {gameData.showingSequence ? 'Watch the sequence!' : 'Repeat the sequence!'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[0, 1, 2, 3].map(index => (
                      <motion.button
                        key={index}
                        className={`
                          h-16 rounded-lg font-bold text-white
                          ${index === 0 ? 'bg-red-500' : ''}
                          ${index === 1 ? 'bg-blue-500' : ''}
                          ${index === 2 ? 'bg-green-500' : ''}
                          ${index === 3 ? 'bg-yellow-500' : ''}
                          ${gameData.showingSequence && gameData.sequence[gameData.currentIndex] === index ? 'ring-4 ring-white' : ''}
                        `}
                        onClick={() => handleMemoryClick(index)}
                        disabled={gameData.showingSequence}
                        whileTap={{ scale: 0.95 }}
                      >
                        {index + 1}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reaction Game */}
              {gameType === 'reaction' && (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Reaction Test</h3>
                  {gameData.waiting ? (
                    <div>
                      <p className="text-gray-300 mb-4">Wait for the green light...</p>
                      <div className="w-32 h-32 bg-red-500 rounded-full mx-auto"></div>
                    </div>
                  ) : gameData.reactionTime ? (
                    <div>
                      <p className="text-gray-300 mb-4">Your reaction time:</p>
                      <div className="text-2xl font-bold text-yellow-400">
                        {gameData.reactionTime}ms
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300 mb-4">Click NOW!</p>
                      <motion.button
                        className="w-32 h-32 bg-green-500 rounded-full mx-auto text-white font-bold"
                        onClick={handleReactionClick}
                        whileTap={{ scale: 0.9 }}
                      >
                        CLICK!
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              <AnimatedButton
                variant="secondary"
                size="sm"
                onClick={() => setGameActive(false)}
                className="w-full mt-4"
              >
                Close
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MiniGame; 