import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { formatNumber } from '../utils/formatters';
import { GAME_CONFIG } from '../config/gameConfig';

const SocialPage = () => {
  const player = useGameStore(state => state.player);
  const friends = useGameStore(state => state.friends);
  const clan = useGameStore(state => state.clan);
  const referralCode = useGameStore(state => state.referralCode);
  const dailyStats = useGameStore(state => state.dailyStats);
  
  const [activeTab, setActiveTab] = useState('friends');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [joinClanCode, setJoinClanCode] = useState('');

  // Generate referral code if not exists
  useEffect(() => {
    if (!referralCode) {
      const code = `BE${player.id || Math.random().toString(36).substr(2, 9)}`;
      useGameStore.setState({ referralCode: code });
    }
  }, [player.id, referralCode]);

  const handleInviteFriend = () => {
    if (dailyStats.friendInvites >= GAME_CONFIG.DAILY_LIMITS.FRIEND_INVITES) {
      alert('Daily invite limit reached');
      return;
    }

    const inviteLink = `https://t.me/BillionaireEmpireBot?start=${referralCode}`;
    
    // Open Telegram share
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent('Join me in Billionaire Empire and earn TON! 💰')}`);
    
    // Update daily stats
    useGameStore.setState(state => ({
      dailyStats: {
        ...state.dailyStats,
        friendInvites: state.dailyStats.friendInvites + 1
      }
    }));
  };

  const handleJoinClan = () => {
    if (!joinClanCode) {
      alert('Please enter a clan code');
      return;
    }

    // In production, this would verify the clan code with backend
    useGameStore.setState({
      clan: {
        id: joinClanCode,
        name: `Clan ${joinClanCode}`,
        members: 1,
        level: 1,
        bonus: GAME_CONFIG.SOCIAL.CLAN_BONUS,
      }
    });

    setJoinClanCode('');
    alert('Successfully joined clan!');
  };

  const handleCreateClan = () => {
    const clanCode = `CLAN${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    useGameStore.setState({
      clan: {
        id: clanCode,
        name: `${player.username}'s Empire`,
        members: 1,
        level: 1,
        bonus: GAME_CONFIG.SOCIAL.CLAN_BONUS,
        isLeader: true,
      }
    });

    alert(`Clan created! Code: ${clanCode}`);
  };

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'CryptoKing', points: 50000000, avatar: '👑' },
    { rank: 2, name: 'MoonShot', points: 35000000, avatar: '🚀' },
    { rank: 3, name: 'DiamondHands', points: 28000000, avatar: '💎' },
    { rank: 4, name: player.username || 'You', points: player.totalEarned, avatar: '😎' },
    { rank: 5, name: 'WhaleAlert', points: 15000000, avatar: '🐋' },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="p-4 max-w-md mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6">Social Hub</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {['friends', 'clan', 'leaderboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div>
          {/* Referral Stats */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Referral Program</h2>
            <div className="bg-gray-700 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-400 mb-1">Your Referral Code</p>
              <p className="font-mono text-xl font-bold">{referralCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-400">Friends Invited</p>
                <p className="text-xl font-bold">{friends.length}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-400">Earnings</p>
                <p className="text-xl font-bold text-green-400">
                  +{formatNumber(friends.reduce((sum, f) => sum + (f.earnings || 0) * 0.05, 0))}
                </p>
              </div>
            </div>
            <button
              onClick={handleInviteFriend}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors"
            >
              Invite Friend (+{GAME_CONFIG.SOCIAL.REFERRAL_BONUS} points)
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Earn {GAME_CONFIG.SOCIAL.REFERRAL_PERCENTAGE * 100}% of your friends' earnings!
            </p>
          </div>

          {/* Friends List */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Your Friends</h3>
            {friends.length > 0 ? (
              <div className="space-y-2">
                {friends.map((friend, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{friend.avatar || '👤'}</span>
                      <div>
                        <p className="font-semibold">{friend.name}</p>
                        <p className="text-xs text-gray-400">Level {friend.level || 1}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-400">
                        +{formatNumber((friend.earnings || 0) * 0.05)}
                      </p>
                      <p className="text-xs text-gray-400">earned</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">
                No friends yet. Start inviting to earn bonus points!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Clan Tab */}
      {activeTab === 'clan' && (
        <div>
          {clan ? (
            <div>
              {/* Clan Info */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{clan.name}</h2>
                    <p className="text-gray-400">Code: {clan.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Clan Level</p>
                    <p className="text-2xl font-bold">{clan.level}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Members</p>
                    <p className="text-xl font-bold">{clan.members}/{GAME_CONFIG.SOCIAL.CLAN_SIZE_LIMIT}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Bonus</p>
                    <p className="text-xl font-bold text-green-400">+{(clan.bonus * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {clan.isLeader && (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold">
                    Manage Clan
                  </button>
                )}
              </div>

              {/* Clan Benefits */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Clan Benefits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>+10% bonus on all earnings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Access to clan tournaments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Exclusive clan chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Weekly clan rewards</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              {/* Join or Create Clan */}
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-3">Join a Clan</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinClanCode}
                    onChange={(e) => setJoinClanCode(e.target.value.toUpperCase())}
                    placeholder="Enter clan code"
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <button
                    onClick={handleJoinClan}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
                  >
                    Join
                  </button>
                </div>
              </div>

              <div className="text-center py-4">
                <p className="text-gray-400 mb-2">or</p>
                <button
                  onClick={handleCreateClan}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold"
                >
                  Create Your Own Clan
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Global Rankings</h2>
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    player.name === (useGameStore.getState().player.username || 'You')
                      ? 'bg-blue-900 border border-blue-600'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="text-2xl font-bold w-12 text-center">
                    {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-2xl">{player.avatar}</span>
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-sm text-gray-400">{formatNumber(player.points)} points</p>
                    </div>
                  </div>
                  {player.rank <= 3 && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Prize</p>
                      <p className="font-bold text-yellow-400">
                        {[1000, 500, 250][player.rank - 1]} TON
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Tournament ends in</p>
              <p className="text-xl font-mono font-bold">23:45:12</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPage;