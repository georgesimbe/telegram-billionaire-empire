import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useIntegratedGameStore from '../store/integratedGameStore';
import { formatNumber } from '../utils/formatters';
import { HOUSING_TYPES } from '../config/housingConfig';
import { JOB_CATEGORIES } from '../config/jobsConfig';
import { getCreditScoreRange } from '../config/bankingConfig';
import AnimatedButton from '../components/AnimatedButton';
import PageHeader from '../components/ui/PageHeader';
import Card, { StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CogIcon, PlusIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const navigate = useNavigate();
  const player = useIntegratedGameStore(state => state.player);
  const career = useIntegratedGameStore(state => state.career);
  const housing = useIntegratedGameStore(state => state.housing);
  const banking = useIntegratedGameStore(state => state.banking);
  const relationships = useIntegratedGameStore(state => state.relationships);
  const businesses = useIntegratedGameStore(state => state.businesses);
  const gameTime = useIntegratedGameStore(state => state.gameTime);
  const advanceTime = useIntegratedGameStore(state => state.advanceTime);
  const addIncome = useIntegratedGameStore(state => state.addIncome);

  const [notifications, setNotifications] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
  const [customQuickActions, setCustomQuickActions] = useState(() => {
    const saved = localStorage.getItem('customQuickActions');
    return saved ? JSON.parse(saved) : [
      'find_career',
      'start_business',
      'manage_life',
      'collect_rent'
    ];
  });

  useEffect(() => {
    // Check if this is a new player
    if (!player.username) {
      setShowWelcome(true);
    }

    // Process daily income if time has passed
    const lastLogin = new Date(player.lastLogin);
    const now = new Date();
    const daysPassed = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));

    if (daysPassed > 0) {
      advanceTime(daysPassed);
      showNotification(`Welcome back! ${daysPassed} day(s) have passed.`, 'info');
    }
  }, []);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const currentHousing = HOUSING_TYPES[housing.currentHousing?.toLowerCase()] || HOUSING_TYPES.homeless;
  const creditScoreRange = getCreditScoreRange(player.creditScore);
  const monthlyIncome = player.monthlyIncome + businesses.reduce((sum, biz) => sum + (biz.monthlyIncome || 0), 0);
  const monthlyExpenses = housing.monthlyHousingCost + banking.monthlyDebtPayments;
  const netIncome = monthlyIncome - monthlyExpenses;

  const handleWorkDay = () => {
    if (career.currentJob) {
      const dailyPay = Math.floor(player.monthlyIncome / 30);
      addIncome(dailyPay, 'work');
      showNotification(`You worked today and earned $${formatNumber(dailyPay)}!`, 'success');
    } else {
      showNotification('You need a job to work! Visit the Career page.', 'warning');
    }
  };

  const handleCollectRent = () => {
    const rentIncome = businesses.filter(b => b.category === 'real_estate')
      .reduce((sum, property) => sum + (property.monthlyIncome || 0), 0);

    if (rentIncome > 0) {
      const dailyRent = Math.floor(rentIncome / 30);
      addIncome(dailyRent, 'rent');
      showNotification(`Collected $${formatNumber(dailyRent)} in rent!`, 'success');
    } else {
      showNotification('You don\'t own any rental properties yet.', 'info');
    }
  };

  const handleQuickInvest = () => {
    if (player.cash >= 1000) {
      const investmentReturn = Math.random() * 200 - 50; // -$50 to +$150 return
      addIncome(1000 - investmentReturn, 'investment');

      if (investmentReturn > 0) {
        showNotification(`Investment successful! Gained $${formatNumber(investmentReturn)}`, 'success');
      } else {
        showNotification(`Investment lost $${formatNumber(Math.abs(investmentReturn))}`, 'warning');
      }
    } else {
      showNotification('Need $1000 to invest', 'error');
    }
  };

  const handlePayBills = () => {
    const totalBills = (housing.monthlyHousingCost || 0) + (banking.monthlyDebtPayments || 0);
    if (totalBills > 0 && player.cash >= totalBills) {
      addIncome(-totalBills, 'bills');
      showNotification(`Paid $${formatNumber(totalBills)} in bills`, 'success');
    } else if (totalBills === 0) {
      showNotification('No bills to pay', 'info');
    } else {
      showNotification('Not enough money to pay bills', 'error');
    }
  };

  const handleQuickActionToggle = (actionId) => {
    setCustomQuickActions(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  };

  // Save custom quick actions to localStorage
  useEffect(() => {
    localStorage.setItem('customQuickActions', JSON.stringify(customQuickActions));
  }, [customQuickActions]);

  // Available Quick Actions
  const availableQuickActions = {
    find_career: {
      id: 'find_career',
      title: 'Find Career',
      description: 'Search for jobs and advance your career',
      action: () => navigate('/career'),
      icon: '💼',
      color: 'blue',
      category: 'Career'
    },
    start_business: {
      id: 'start_business',
      title: 'Start Business',
      description: 'Invest in businesses and build your empire',
      action: () => navigate('/business'),
      icon: '🏢',
      color: 'green',
      category: 'Business'
    },
    manage_life: {
      id: 'manage_life',
      title: 'Manage Life',
      description: 'Handle housing, banking, and relationships',
      action: () => navigate('/social'),
      icon: '🏠',
      color: 'purple',
      category: 'Social'
    },
    collect_rent: {
      id: 'collect_rent',
      title: 'Collect Rent',
      description: 'Collect income from your properties',
      action: handleCollectRent,
      icon: '🏘️',
      color: 'yellow',
      category: 'Income'
    },
    work_today: {
      id: 'work_today',
      title: 'Work Today',
      description: 'Earn daily income from your job',
      action: handleWorkDay,
      icon: '⚡',
      color: 'green',
      category: 'Income',
      disabled: !career.currentJob
    },
    view_profile: {
      id: 'view_profile',
      title: 'View Profile',
      description: 'Check your profile and achievements',
      action: () => navigate('/profile'),
      icon: '👤',
      color: 'blue',
      category: 'Profile'
    },
    staking_rewards: {
      id: 'staking_rewards',
      title: 'Staking Rewards',
      description: 'Manage your TON staking portfolio',
      action: () => navigate('/staking'),
      icon: '💰',
      color: 'purple',
      category: 'Finance'
    },
    check_settings: {
      id: 'check_settings',
      title: 'Settings',
      description: 'Customize your game experience',
      action: () => navigate('/settings'),
      icon: '⚙️',
      color: 'gray',
      category: 'System'
    },
    quick_invest: {
      id: 'quick_invest',
      title: 'Quick Invest',
      description: 'Make a quick $1000 investment',
      action: handleQuickInvest,
      icon: '📈',
      color: 'green',
      category: 'Finance',
      disabled: player.cash < 1000
    },
    pay_bills: {
      id: 'pay_bills',
      title: 'Pay Bills',
      description: 'Pay monthly housing and debt payments',
      action: handlePayBills,
      icon: '💳',
      color: 'red',
      category: 'Finance'
    },
    social_activity: {
      id: 'social_activity',
      title: 'Social Activity',
      description: 'Spend time with friends and family',
      action: () => navigate('/social?tab=relationships'),
      icon: '👥',
      color: 'pink',
      category: 'Social'
    },
    education: {
      id: 'education',
      title: 'Study',
      description: 'Improve your skills and knowledge',
      action: () => navigate('/career?tab=education'),
      icon: '📚',
      color: 'blue',
      category: 'Career'
    }
  };

  const QuickActionCard = ({ title, description, action, icon, color = 'blue', disabled = false }) => {
    const colorClasses = {
      blue: 'border-blue-500 hover:bg-blue-500/10',
      green: 'border-green-500 hover:bg-green-500/10',
      purple: 'border-purple-500 hover:bg-purple-500/10',
      yellow: 'border-yellow-500 hover:bg-yellow-500/10',
      red: 'border-red-500 hover:bg-red-500/10',
      pink: 'border-pink-500 hover:bg-pink-500/10',
      gray: 'border-gray-500 hover:bg-gray-500/10'
    };

    return (
      <motion.div
        className={`bg-gray-800 rounded-xl p-4 border-2 ${colorClasses[color]} transition-all cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={!disabled ? action : undefined}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{icon}</span>
          <h4 className="font-semibold text-white">{title}</h4>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </motion.div>
    );
  };

  const StatCard = ({ label, value, color = 'white', subtext = '' }) => (
    <div className="bg-gray-700/50 rounded-lg p-3">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-lg font-bold text-${color}-400`}>{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto pb-20">
      {/* Welcome Modal for New Players */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="text-center">
                <span className="text-6xl mb-4 block">🏙️</span>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Life Simulator!</h2>
                <p className="text-gray-300 mb-6">
                  Start your journey from the bottom and build your empire. Get a job, find housing,
                  manage relationships, and grow your business empire!
                </p>
                <AnimatedButton
                  variant="primary"
                  size="md"
                  onClick={() => setShowWelcome(false)}
                  className="w-full"
                >
                  Start Your Journey
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Customization Modal */}
      <AnimatePresence>
        {showQuickActionsModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Customize Quick Actions</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowQuickActionsModal(false)}
                >
                  Close
                </Button>
              </div>

              <p className="text-gray-400 mb-6">
                Select which quick actions you want to display on your homepage. You can choose up to 8 actions.
              </p>

              {/* Group actions by category */}
              {Object.entries(
                Object.values(availableQuickActions).reduce((acc, action) => {
                  if (!acc[action.category]) acc[action.category] = [];
                  acc[action.category].push(action);
                  return acc;
                }, {})
              ).map(([category, actions]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {actions.map(action => (
                      <div
                        key={action.id}
                        className={`bg-gray-700/50 rounded-lg p-4 border-2 transition-all cursor-pointer ${customQuickActions.includes(action.id)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                          } ${action.disabled ? 'opacity-50' : ''}`}
                        onClick={() => {
                          if (customQuickActions.length < 8 || customQuickActions.includes(action.id)) {
                            handleQuickActionToggle(action.id);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{action.icon}</span>
                            <div>
                              <h4 className="font-medium text-white">{action.title}</h4>
                              <p className="text-sm text-gray-400">{action.description}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${customQuickActions.includes(action.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-400'
                            }`}>
                            {customQuickActions.includes(action.id) && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                        </div>
                        {action.disabled && (
                          <p className="text-xs text-red-400 mt-2">Currently unavailable</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
                <p className="text-sm text-gray-400">
                  Selected: {customQuickActions.length}/8 actions
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowQuickActionsModal(false)}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <PageHeader
        title={player.username ? `Welcome back, ${player.username}!` : 'Life Simulator'}
        subtitle={`Day ${gameTime.daysPassed + 1} • ${new Date(gameTime.currentDate).toLocaleDateString()}`}
        showCash={true}
        cash={player.cash}
      />

      {/* Life Overview */}
      <Card title="Life Overview" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Net Worth"
            value={`$${formatNumber(player.cash)}`}
            color="green"
          />
          <StatCard
            label="Monthly Income"
            value={`$${formatNumber(monthlyIncome)}`}
            color="blue"
          />
          <StatCard
            label="Credit Score"
            value={player.creditScore}
            color={creditScoreRange.color.includes('green') ? 'green' : creditScoreRange.color.includes('yellow') ? 'yellow' : 'red'}
          />
          <StatCard
            label="Happiness"
            value={`${player.happiness}%`}
            color="yellow"
          />
        </div>
      </Card>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Employment Status */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Employment</h3>
          {career.currentJob ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{(career.currentJob && career.currentJob.icon) || '💼'}</span>
                <div>
                  <p className="font-semibold text-white">{(career.currentJob && career.currentJob.name) || 'Unknown Job'}</p>
                  <p className="text-sm text-gray-400">${formatNumber(player.monthlyIncome)}/month</p>
                </div>
              </div>
              <AnimatedButton
                variant="success"
                size="sm"
                onClick={handleWorkDay}
                className="w-full"
              >
                Work Today (+${formatNumber(Math.floor(player.monthlyIncome / 30))})
              </AnimatedButton>
            </div>
          ) : (
            <div className="text-center py-4">
              <span className="text-4xl mb-2 block">💼</span>
              <p className="text-gray-400 mb-3">Unemployed</p>
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={() => navigate('/career')}
                className="w-full"
              >
                Find a Job
              </AnimatedButton>
            </div>
          )}
        </div>

        {/* Housing Status */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Housing</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentHousing?.icon || '🏠'}</span>
              <div>
                <p className="font-semibold text-white">{currentHousing?.name || 'Unknown Housing'}</p>
                <p className="text-sm text-gray-400">${formatNumber(currentHousing?.monthlyMaintenance || 0)}/month</p>
              </div>
            </div>
            <AnimatedButton
              variant="secondary"
              size="sm"
              onClick={() => navigate('/social')}
              className="w-full"
            >
              Manage Housing
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Monthly Budget */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Monthly Budget</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Income</span>
            <span className="text-green-400">+${formatNumber(monthlyIncome)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Housing</span>
            <span className="text-red-400">-${formatNumber(housing.monthlyHousingCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Debt Payments</span>
            <span className="text-red-400">-${formatNumber(banking.monthlyDebtPayments)}</span>
          </div>
          <hr className="border-gray-600" />
          <div className="flex justify-between font-bold">
            <span className="text-white">Net Income</span>
            <span className={netIncome >= 0 ? 'text-green-400' : 'text-red-400'}>
              {netIncome >= 0 ? '+' : ''}${formatNumber(netIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* Customizable Quick Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Quick Actions</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowQuickActionsModal(true)}
            className="flex items-center gap-2"
          >
            <CogIcon className="h-4 w-4" />
            Customize
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {customQuickActions.slice(0, 8).map(actionId => {
            const action = availableQuickActions[actionId];
            if (!action) return null;

            return (
              <QuickActionCard
                key={action.id}
                title={action.title}
                description={action.description}
                action={action.action}
                icon={action.icon}
                color={action.color}
                disabled={action.disabled}
              />
            );
          })}

          {customQuickActions.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400 mb-4">No quick actions selected</p>
              <Button
                variant="primary"
                onClick={() => setShowQuickActionsModal(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <PlusIcon className="h-4 w-4" />
                Add Quick Actions
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Relationships Summary */}
      {relationships.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Relationships</h3>
          <div className="space-y-2">
            {relationships.slice(0, 3).map(relationship => (
              <div key={relationship.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="font-medium text-white">{relationship.name}</p>
                    <p className="text-sm text-gray-400">{relationship.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-400">{relationship.points}/100</p>
                </div>
              </div>
            ))}
          </div>
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/social')}
            className="w-full mt-4"
          >
            Manage Relationships
          </AnimatedButton>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`p-4 rounded-lg shadow-lg max-w-sm ${notification.type === 'success' ? 'bg-green-600' :
                notification.type === 'warning' ? 'bg-yellow-600' :
                  notification.type === 'error' ? 'bg-red-600' :
                    'bg-blue-600'
                }`}
            >
              <p className="text-white text-sm">{notification.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;