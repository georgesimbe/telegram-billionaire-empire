import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import Spline from '@splinetool/react-spline';
import {
  UserIcon,
  CogIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  StarIcon,
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HeartIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ShieldCheckIcon,
  PencilIcon,
  PhotoIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import useIntegratedGameStore from '../store/integratedGameStore';
import { formatNumber } from '../utils/formatters';
import { GAME_CONFIG } from '../config/gameConfig';
import { TonIntegration } from '../utils/tonIntegration';
import HintIcon, { QuickHint } from '../components/HintIcon';
import { STAKING_POOLS } from '../config/stakingConfig';
import { EXPANDED_INDUSTRIES_CONFIG, INDUSTRY_SECTORS } from '../config/expandedIndustriesConfig';

const ProfilePage = () => {
  const {
    player,
    career,
    housing,
    banking,
    relationships,
    businesses,
    staking,
    governance,
    economics,
    achievements,
    calculateEconomicStatus
    // updateMarketInfluence // Function doesn't exist
  } = useIntegratedGameStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [profileCustomization, setProfileCustomization] = useState({
    profilePicture: '',
    bannerImage: '',
    backgroundImage: '',
    displayName: player.username || 'Anonymous',
    bio: '',
    showLevel: true,
    showWealth: false,
    showAchievements: true,
    showBusinesses: true
  });

  const [tonConnectUI] = useTonConnectUI();
  const connected = tonConnectUI.connected;
  const wallet = tonConnectUI.wallet;

  const navigate = useNavigate();

  // Calculate comprehensive stats
  useEffect(() => {
    calculateEconomicStatus();
    // updateMarketInfluence(); // Function doesn't exist
  }, [calculateEconomicStatus]);

  // Load saved profile customization
  useEffect(() => {
    const saved = localStorage.getItem('profileCustomization');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfileCustomization(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load profile customization:', error);
      }
    }
  }, []);

  const totalBusinessValue = businesses.reduce((sum, b) => sum + (b.cost || 0) * (b.level || 1), 0);
  const totalWealth = player.cash + totalBusinessValue + staking.tonBalance * 100; // Rough TON to USD conversion

  const getEconomicClass = (wealth) => {
    if (wealth >= 20000000) return { name: 'Ultra Rich', color: 'text-purple-400', icon: '👑' };
    if (wealth >= 2000000) return { name: 'Wealthy', color: 'text-yellow-400', icon: '💎' };
    if (wealth >= 500000) return { name: 'Upper Middle', color: 'text-blue-400', icon: '🏆' };
    if (wealth >= 100000) return { name: 'Middle Class', color: 'text-green-400', icon: '🏠' };
    return { name: 'Working Class', color: 'text-gray-400', icon: '⚒️' };
  };

  const economicClass = getEconomicClass(totalWealth);

  const getHealthStatus = () => {
    const health = player.health || 80;
    if (health >= 90) return { status: 'Excellent', color: 'text-green-400', icon: '💚' };
    if (health >= 70) return { status: 'Good', color: 'text-blue-400', icon: '💙' };
    if (health >= 50) return { status: 'Fair', color: 'text-yellow-400', icon: '💛' };
    return { status: 'Poor', color: 'text-red-400', icon: '❤️' };
  };

  const healthStatus = getHealthStatus();

  const getHousingDisplay = () => {
    const housingTypes = {
      homeless: { name: 'Homeless', icon: '🏚️', color: 'text-red-400' },
      shelter: { name: 'Shelter', icon: '🏠', color: 'text-orange-400' },
      apartment: { name: 'Apartment', icon: '🏢', color: 'text-yellow-400' },
      house: { name: 'House', icon: '🏡', color: 'text-green-400' },
      mansion: { name: 'Mansion', icon: '🏰', color: 'text-blue-400' },
      penthouse: { name: 'Penthouse', icon: '🏙️', color: 'text-purple-400' },
      private_island: { name: 'Private Island', icon: '🏝️', color: 'text-pink-400' },
      space_station: { name: 'Space Station', icon: '🛸', color: 'text-cyan-400' }
    };
    return housingTypes[housing.currentHousing] || housingTypes.homeless;
  };

  const housingDisplay = getHousingDisplay();

  const getEducationDisplay = () => {
    const educationTypes = {
      high_school: { name: 'High School', icon: '🎓', level: 1 },
      college: { name: 'College Degree', icon: '🎓', level: 2 },
      masters: { name: 'Masters Degree', icon: '🎓', level: 3 },
      phd: { name: 'PhD', icon: '🎓', level: 4 }
    };
    return educationTypes[career.education] || educationTypes.high_school;
  };

  const educationDisplay = getEducationDisplay();

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

    if (points > (player.points || 0)) {
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
        useGameStore.setState(state => ({
          player: {
            ...state.player,
            points: (state.player.points || 0) - points
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

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Life Status Overview */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Life Overview</h3>
          <QuickHint hintKey="ECONOMIC_CLASSES" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Economic Class:</span>
              <span className={`font-semibold ${economicClass.color}`}>
                {economicClass.icon} {economicClass.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Housing:</span>
              <span className={`font-semibold ${housingDisplay.color}`}>
                {housingDisplay.icon} {housingDisplay.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Education:</span>
              <span className="text-blue-400 font-semibold">
                {educationDisplay.icon} {educationDisplay.name}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Health:</span>
              <span className={`font-semibold ${healthStatus.color}`}>
                {healthStatus.icon} {healthStatus.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Happiness:</span>
              <span className="text-yellow-400 font-semibold">
                😊 {player.happiness || 70}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Credit Score:</span>
              <span className={`font-semibold ${(player.creditScore || 650) >= 700 ? 'text-green-400' : 'text-yellow-400'}`}>
                💳 {player.creditScore || 650}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wealth & Assets */}
      {profileCustomization.showWealth ? (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Wealth & Assets</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Cash Balance</p>
              <p className="text-2xl font-bold text-green-400">${formatNumber(player.cash)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Business Value</p>
              <p className="text-2xl font-bold text-blue-400">${formatNumber(totalBusinessValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">TON Balance</p>
              <p className="text-2xl font-bold text-purple-400">{formatNumber(staking.tonBalance)} TON</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Wealth</p>
              <p className="text-2xl font-bold text-yellow-400">${formatNumber(totalWealth)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Wealth & Assets</h3>
          <div className="text-center py-8">
            <EyeSlashIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Wealth information is private</p>
            <p className="text-sm text-gray-500">This user has chosen to keep their financial information private.</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Businesses</p>
              <p className="text-xl font-bold">{businesses.length}</p>
            </div>
            <BuildingOfficeIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Relationships</p>
              <p className="text-xl font-bold">{relationships.length}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-pink-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Voting Power</p>
              <p className="text-xl font-bold">{formatNumber(governance.votingPower || 0)}</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Achievements</p>
              <p className="text-xl font-bold">{achievements.length}</p>
            </div>
            <TrophyIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStakingTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Staking Portfolio</h3>
          <QuickHint hintKey="STAKING_POOLS" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400">Total Staked</p>
            <p className="text-2xl font-bold text-purple-400">{formatNumber(staking.totalStaked)} TON</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pending Rewards</p>
            <p className="text-2xl font-bold text-green-400">{formatNumber(staking.pendingRewards)} TON</p>
          </div>
        </div>

        {Object.keys(staking.activeStakes || {}).length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Active Stakes</h4>
            {Object.entries(staking.activeStakes || {}).map(([poolId, stake]) => {
              const pool = STAKING_POOLS[poolId.toUpperCase()];
              if (!pool) return null;

              return (
                <div key={poolId} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{pool.name}</span>
                    <span className="text-green-400">{stake.apy}% APY</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Staked: {formatNumber(stake.amount)} TON</span>
                    <span>Lock: {pool.lockPeriod} days</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No active stakes</p>
            <button
              onClick={() => navigate('/staking')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Start Staking
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Business Empire</h3>
          <QuickHint hintKey="BUSINESS_ROI" />
        </div>

        {!profileCustomization.showBusinesses ? (
          <div className="text-center py-8">
            <EyeSlashIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Business portfolio is private</p>
            <p className="text-sm text-gray-500">This user has chosen to keep their business information private.</p>
          </div>
        ) : businesses.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400">Total Businesses</p>
                <p className="text-xl font-bold">{businesses.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Portfolio Value</p>
                <p className="text-xl font-bold text-blue-400">${formatNumber(totalBusinessValue)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white">Business Portfolio</h4>
              {Object.entries(INDUSTRY_SECTORS).map(([sectorName, sectorData]) => {
                const sectorBusinesses = businesses.filter(b => {
                  const config = EXPANDED_INDUSTRIES_CONFIG[b.id];
                  return config?.sector === sectorName;
                });

                if (sectorBusinesses.length === 0) return null;

                return (
                  <div key={sectorName} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">
                        {sectorData.icon} {sectorName}
                      </span>
                      <span className="text-sm text-gray-400">
                        {sectorBusinesses.length} businesses
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {sectorBusinesses.map(b => EXPANDED_INDUSTRIES_CONFIG[b.id]?.name).join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No businesses owned</p>
            <button
              onClick={() => navigate('/business')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Start Building
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Social Network</h3>
          <QuickHint hintKey="RELATIONSHIPS" />
        </div>

        {(relationships?.connections || []).length > 0 ? (
          <div className="space-y-3">
            {(relationships?.connections || []).map(rel => (
              <div key={rel.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{rel.name}</span>
                  <span className="text-sm text-gray-400 capitalize">{rel.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-600 rounded-full h-2 mr-2">
                      <div
                        className="bg-pink-400 h-2 rounded-full"
                        style={{ width: `${rel.points}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{rel.points}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No relationships yet</p>
            <p className="text-sm text-gray-500">Build relationships to unlock networking opportunities</p>
          </div>
        )}
      </div>

      {/* Governance Participation */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Governance</h3>
          <QuickHint hintKey="GOVERNANCE_VOTING" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Voting Power</p>
            <p className="text-xl font-bold text-green-400">{formatNumber(governance.votingPower || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Votes Cast</p>
            <p className="text-xl font-bold">{governance.votingHistory?.length || 0}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/governance')}
          className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          View Governance
        </button>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>

        {!profileCustomization.showAchievements ? (
          <div className="text-center py-8">
            <EyeSlashIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Achievements are private</p>
            <p className="text-sm text-gray-500">This user has chosen to keep their achievements private.</p>
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold text-white mb-1">{achievement.name}</h4>
                  <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                  {achievement.ton_reward && (
                    <span className="inline-block px-2 py-1 bg-purple-600 text-white text-xs rounded">
                      +{achievement.ton_reward} TON
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrophyIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No achievements yet</p>
            <p className="text-sm text-gray-500">Keep playing to unlock achievements and earn TON rewards!</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto pb-20">
      {/* Header with 3D Avatar and Customization */}
      <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden mb-6">
        {/* Background Image */}
        {profileCustomization.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${profileCustomization.backgroundImage})` }}
          />
        )}

        {/* Banner Image */}
        {profileCustomization.bannerImage && (
          <div
            className="absolute top-0 left-0 right-0 h-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${profileCustomization.bannerImage})` }}
          />
        )}

        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9U/scene.splinecode"
          className="w-full h-full"
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="relative">
                {profileCustomization.profilePicture ? (
                  <img
                    src={profileCustomization.profilePicture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center border-2 border-white">
                    <UserIcon className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  {profileCustomization.displayName || player.username || 'Anonymous'}
                </h1>
                <p className="text-gray-400">
                  {profileCustomization.showLevel && `Level ${player.level} • `}
                  {economicClass.name}
                </p>
                {profileCustomization.bio && (
                  <p className="text-gray-300 text-sm mt-1">{profileCustomization.bio}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowCustomizeModal(true)}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <PencilIcon className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => {
                  // Open Telegram DM
                  window.open(`https://t.me/${player.username || 'telegram'}`, '_blank');
                }}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <ChatBubbleLeftIcon className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <CogIcon className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TON Wallet Section */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">TON Wallet</h3>
          <TonConnectButton />
        </div>

        {connected && wallet && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Connected:</p>
              <p className="font-mono text-sm text-gray-300">
                {wallet.account.address.slice(0, 8)}...{wallet.account.address.slice(-6)}
              </p>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={(player.points || 0) < GAME_CONFIG.MIN_WITHDRAWAL}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${(player.points || 0) >= GAME_CONFIG.MIN_WITHDRAWAL
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
              Withdraw
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'overview', name: 'Overview', icon: UserIcon },
          { id: 'staking', name: 'Staking', icon: ChartBarIcon },
          { id: 'business', name: 'Business', icon: BuildingOfficeIcon },
          { id: 'social', name: 'Social', icon: UsersIcon },
          { id: 'achievements', name: 'Achievements', icon: TrophyIcon }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'staking' && renderStakingTab()}
        {activeTab === 'business' && renderBusinessTab()}
        {activeTab === 'social' && renderSocialTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
      </motion.div>

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

      {/* Profile Customization Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-6 text-white">Customize Profile</h3>

            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={profileCustomization.displayName}
                  onChange={(e) => setProfileCustomization(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter display name"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bio</label>
                <textarea
                  value={profileCustomization.bio}
                  onChange={(e) => setProfileCustomization(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white h-20 resize-none"
                  placeholder="Tell others about yourself..."
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">{profileCustomization.bio.length}/150</p>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Profile Picture URL</label>
                <div className="flex space-x-3">
                  <input
                    type="url"
                    value={profileCustomization.profilePicture}
                    onChange={(e) => setProfileCustomization(prev => ({ ...prev, profilePicture: e.target.value }))}
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                    <PhotoIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Banner Image URL</label>
                <div className="flex space-x-3">
                  <input
                    type="url"
                    value={profileCustomization.bannerImage}
                    onChange={(e) => setProfileCustomization(prev => ({ ...prev, bannerImage: e.target.value }))}
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="https://example.com/banner.jpg"
                  />
                  <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                    <PhotoIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Background Image */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Background Image URL</label>
                <div className="flex space-x-3">
                  <input
                    type="url"
                    value={profileCustomization.backgroundImage}
                    onChange={(e) => setProfileCustomization(prev => ({ ...prev, backgroundImage: e.target.value }))}
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="https://example.com/background.jpg"
                  />
                  <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                    <PhotoIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Privacy Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Show Level</span>
                    <button
                      onClick={() => setProfileCustomization(prev => ({ ...prev, showLevel: !prev.showLevel }))}
                      className={`p-2 rounded-lg ${profileCustomization.showLevel ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      {profileCustomization.showLevel ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Show Wealth Status</span>
                    <button
                      onClick={() => setProfileCustomization(prev => ({ ...prev, showWealth: !prev.showWealth }))}
                      className={`p-2 rounded-lg ${profileCustomization.showWealth ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      {profileCustomization.showWealth ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Show Achievements</span>
                    <button
                      onClick={() => setProfileCustomization(prev => ({ ...prev, showAchievements: !prev.showAchievements }))}
                      className={`p-2 rounded-lg ${profileCustomization.showAchievements ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      {profileCustomization.showAchievements ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Show Businesses</span>
                    <button
                      onClick={() => setProfileCustomization(prev => ({ ...prev, showBusinesses: !prev.showBusinesses }))}
                      className={`p-2 rounded-lg ${profileCustomization.showBusinesses ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      {profileCustomization.showBusinesses ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save customization settings
                  localStorage.setItem('profileCustomization', JSON.stringify(profileCustomization));
                  setShowCustomizeModal(false);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;