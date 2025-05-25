import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import Spline from '@splinetool/react-spline';
import useGameStore from '../store/gameStore';
import { formatNumber } from '../utils/formatters';
import { GAME_CONFIG } from '../config/gameConfig';
import { TonIntegration } from '../utils/tonIntegration';

const ProfilePage = () => {
  const player = useGameStore(state => state.player);
  const businesses = useGameStore(state => state.businesses);
  const achievements = useGameStore(state => state.achievements);
  const suspicionLevel = useGameStore(state => state.suspicionLevel);
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const [tonConnectUI] = useTonConnectUI();
  const connected = tonConnectUI.connected;
  const wallet = tonConnectUI.wallet;

  const handleWithdraw = async () => {
    if (!connected || !wallet) {
      alert('Please connect your TON wallet first');
      return;
    }

    const points = parseInt(withdrawAmount);
    if (isNaN(points) || points < GAME_CONFIG.MIN_WITHDRAWAL) {
      alert(`Minimum withdrawal is ${formatNumber(GAME_CONFIG.MIN_WITHDRAWAL)} points`);
      return;
    }

    if (points > player.points) {
      alert('Insufficient points');
      return;
    }

    setIsWithdrawing(true);
    
    try {
      const result = await TonIntegration.convertPointsToTON(
        points,
        wallet.account.address,
        tonConnectUI
      );
      
      if (result.success) {
        // Deduct points
        useGameStore.setState(state => ({
          player: {
            ...state.player,
            points: state.player.points - points
          }
        }));
        
        alert(`Successfully withdrew ${result.amount} TON!`);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
      } else {
        alert(`Withdrawal failed: ${result.error}`);
      }
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Calculate stats
  const totalBusinessValue = businesses.reduce((sum, b) => sum + b.cost * b.level, 0);
  const rank = player.level < 10 ? 'Novice' : 
               player.level < 20 ? 'Entrepreneur' :
               player.level < 30 ? 'Tycoon' : 
               player.level < 50 ? 'Mogul' : 'Billionaire';

  return (
    <div className="p-4 max-w-md mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* 3D Avatar Section with Spline */}
      <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden mb-6">
        <Spline 
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9U/scene.splinecode"
          className="w-full h-full"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
          <h2 className="text-xl font-bold">{player.username || 'Anonymous'}</h2>
          <p className="text-gray-400">{rank} • Level {player.level}</p>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">TON Wallet</h3>
        <div className="flex justify-center">
          <TonConnectButton />
        </div>
        {connected && wallet && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">Connected:</p>
            <p className="font-mono text-sm">{wallet.account.address.slice(0, 8)}...{wallet.account.address.slice(-6)}</p>
          </div>
        )}
      </div>

      {/* Points & Withdrawal */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-400">Available Points</p>
            <p className="text-2xl font-bold">{formatNumber(player.points)}</p>
            <p className="text-xs text-gray-400">
              ≈ {(player.points / GAME_CONFIG.POINTS_TO_TON_RATE).toFixed(2)} TON
            </p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={player.points < GAME_CONFIG.MIN_WITHDRAWAL}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              player.points >= GAME_CONFIG.MIN_WITHDRAWAL
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Withdraw
          </button>
        </div>
        
        <div className="text-xs text-gray-400">
          <p>• Minimum withdrawal: {formatNumber(GAME_CONFIG.MIN_WITHDRAWAL)} points</p>
          <p>• Withdrawal fee: {GAME_CONFIG.WITHDRAWAL_FEE * 100}%</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total Earned</p>
            <p className="font-bold">{formatNumber(player.totalEarned)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Cash Balance</p>
            <p className="font-bold">${formatNumber(player.cash)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Businesses</p>
            <p className="font-bold">{businesses.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Business Value</p>
            <p className="font-bold">${formatNumber(totalBusinessValue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Experience</p>
            <p className="font-bold">{player.xp} XP</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Account Status</p>
            <p className={`font-bold ${suspicionLevel > 5 ? 'text-red-400' : 'text-green-400'}`}>
              {suspicionLevel > 5 ? 'Suspicious' : 'Good Standing'}
            </p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Achievements</h3>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700 rounded-lg p-3 text-center"
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <p className="text-xs">{achievement.name}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No achievements yet. Keep playing to unlock!
          </p>
        )}
      </div>

      {/* Settings */}
      <div className="mt-6 space-y-3">
        <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-semibold transition-colors">
          Settings ⚙️
        </button>
        <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-semibold transition-colors">
          Help & Support 💬
        </button>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-sm w-full"
          >
            <h3 className="text-xl font-bold mb-4">Withdraw Points</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Points to Withdraw</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={`Min: ${formatNumber(GAME_CONFIG.MIN_WITHDRAWAL)}`}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              />
              
              <div className="mt-2 text-sm text-gray-400">
                <p>You'll receive: {withdrawAmount ? ((parseInt(withdrawAmount) / GAME_CONFIG.POINTS_TO_TON_RATE) * (1 - GAME_CONFIG.WITHDRAWAL_FEE)).toFixed(2) : '0'} TON</p>
                <p>Fee: {withdrawAmount ? ((parseInt(withdrawAmount) / GAME_CONFIG.POINTS_TO_TON_RATE) * GAME_CONFIG.WITHDRAWAL_FEE).toFixed(2) : '0'} TON</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold"
                disabled={isWithdrawing}
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold"
                disabled={isWithdrawing}
              >
                {isWithdrawing ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;