import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';
import { formatNumber } from '../utils/formatters';
import { HOUSING_TYPES } from '../config/housingConfig';
import { JOB_CATEGORIES } from '../config/jobsConfig';
import { getCreditScoreRange } from '../config/bankingConfig';
import AnimatedButton from '../components/AnimatedButton';

const HomePage = () => {
  const navigate = useNavigate();
  const player = useGameStore(state => state.player);
  const career = useGameStore(state => state.career);
  const housing = useGameStore(state => state.housing);
  const banking = useGameStore(state => state.banking);
  const relationships = useGameStore(state => state.relationships);
  const businesses = useGameStore(state => state.businesses);
  const gameTime = useGameStore(state => state.gameTime);
  const advanceTime = useGameStore(state => state.advanceTime);
  const addIncome = useGameStore(state => state.addIncome);

  const [notifications, setNotifications] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);

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

  const currentHousing = HOUSING_TYPES[housing.currentHousing?.toUpperCase()] || HOUSING_TYPES.HOMELESS;
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

  const QuickActionCard = ({ title, description, action, icon, color = 'blue' }) => (
    <motion.div
      className={`bg-gray-800 rounded-xl p-4 border border-gray-600 hover:border-${color}-500 transition-colors cursor-pointer`}
      whileHover={{ scale: 1.02 }}
      onClick={action}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <AnimatedButton variant="primary" size="sm" onClick={action}>
        {title}
      </AnimatedButton>
    </motion.div>
  );

  const StatCard = ({ label, value, color = 'white', subtext = '' }) => (
    <div className="bg-gray-700/50 rounded-lg p-3">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-lg font-bold text-${color}`}>{value}</p>
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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          {player.username ? `Welcome back, ${player.username}!` : 'Life Simulator'}
        </h1>
        <p className="text-gray-400">
          Day {gameTime.daysPassed + 1} • {new Date(gameTime.currentDate).toLocaleDateString()}
        </p>
      </div>

      {/* Life Overview */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Life Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Net Worth"
            value={`$${formatNumber(player.cash)}`}
            color="green-400"
          />
          <StatCard
            label="Monthly Income"
            value={`$${formatNumber(monthlyIncome)}`}
            color="blue-400"
          />
          <StatCard
            label="Credit Score"
            value={player.creditScore}
            color={creditScoreRange.color.replace('text-', '')}
            subtext={creditScoreRange.name}
          />
          <StatCard
            label="Happiness"
            value={`${player.happiness}%`}
            color="yellow-400"
          />
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Employment Status */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Employment</h3>
          {career.currentJob ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{career.currentJob.icon}</span>
                <div>
                  <p className="font-semibold text-white">{career.currentJob.name}</p>
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
              <span className="text-2xl">{currentHousing.icon}</span>
              <div>
                <p className="font-semibold text-white">{currentHousing.name}</p>
                <p className="text-sm text-gray-400">${formatNumber(currentHousing.monthlyCost)}/month</p>
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

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            title="Find Career"
            description="Search for jobs and advance your career"
            action={() => navigate('/career')}
            icon="💼"
            color="blue"
          />
          <QuickActionCard
            title="Start Business"
            description="Invest in businesses and build your empire"
            action={() => navigate('/business')}
            icon="🏢"
            color="green"
          />
          <QuickActionCard
            title="Manage Life"
            description="Handle housing, banking, and relationships"
            action={() => navigate('/social')}
            icon="🏠"
            color="purple"
          />
          <QuickActionCard
            title="Collect Rent"
            description="Collect income from your properties"
            action={handleCollectRent}
            icon="🏘️"
            color="yellow"
          />
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