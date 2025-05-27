import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { anime } from 'animejs';
import { useGameStore } from '../store/gameStore';
import { BUSINESSES_CONFIG, STAFF_TYPES, calculateBusinessCost, calculateBusinessIncome } from '../config/businessConfig';
import { formatNumber } from '../utils/formatters';

const BusinessManagementPage = ({ businessType, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const {
    player,
    businesses,
    upgradeBusiness,
    hireStaff,
    addManager,
    sellBusiness
  } = useGameStore();

  const business = BUSINESSES_CONFIG[businessType];
  const ownedBusiness = businesses.find(b => b.type === businessType);
  const businessLevel = ownedBusiness?.level || 0;
  const currentIncome = calculateBusinessIncome(business, businessLevel);
  const upgradeCost = calculateBusinessCost(business, businessLevel);

  useEffect(() => {
    // Animate page entrance
    anime({
      targets: '.management-section',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeOutQuad'
    });

    // Animate stats counters
    anime({
      targets: '.stat-number',
      innerHTML: [0, currentIncome],
      duration: 2000,
      round: 1,
      easing: 'easeOutExpo'
    });
  }, [currentIncome]);

  const handleUpgrade = () => {
    if (player.points >= upgradeCost) {
      upgradeBusiness(businessType);
      setShowUpgradeModal(false);

      // Success animation
      anime({
        targets: '.level-display',
        scale: [1, 1.5, 1],
        rotate: '1turn',
        duration: 1000,
        easing: 'easeOutBack(1.7)'
      });
    }
  };

  const getBusinessAnalytics = () => {
    const hourlyIncome = currentIncome * 60;
    const dailyIncome = hourlyIncome * 24;
    const monthlyIncome = dailyIncome * 30;

    return {
      current: currentIncome,
      hourly: hourlyIncome,
      daily: dailyIncome,
      monthly: monthlyIncome,
      roi: businessLevel > 0 ? ((dailyIncome * 30) / (upgradeCost * businessLevel)) * 100 : 0,
      efficiency: Math.min(100, 50 + (businessLevel * 3))
    };
  };

  const analytics = getBusinessAnalytics();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'staff', name: 'Staff Management', icon: '👥' },
    { id: 'upgrades', name: 'Upgrades', icon: '⬆️' },
    { id: 'supply', name: 'Supply Chain', icon: '🔗' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ];

  const renderOverview = () => (
    <div className="management-section space-y-6">
      {/* Business Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{business.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-white">{business.name}</h1>
              <p className="text-blue-200">{business.description}</p>
              <div className="level-display mt-2">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                  Level {businessLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-gray-300">Current Income</div>
            <div className="stat-number text-3xl font-bold text-green-400">
              ${formatNumber(currentIncome)}/min
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Hourly Income</div>
          <div className="text-xl font-bold text-green-400">${formatNumber(analytics.hourly)}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Daily Income</div>
          <div className="text-xl font-bold text-green-400">${formatNumber(analytics.daily)}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Efficiency</div>
          <div className="text-xl font-bold text-blue-400">{analytics.efficiency.toFixed(0)}%</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm">ROI</div>
          <div className="text-xl font-bold text-purple-400">{analytics.roi.toFixed(1)}%</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
        >
          Upgrade Business (${formatNumber(upgradeCost)})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
        >
          Manage Staff
        </button>
        <button
          onClick={() => sellBusiness && sellBusiness(businessType)}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
        >
          Sell Business
        </button>
      </div>
    </div>
  );

  const renderStaffManagement = () => (
    <div className="management-section space-y-6">
      <h2 className="text-2xl font-bold text-white">Staff Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Staff */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Staff</h3>
          <div className="space-y-3">
            {ownedBusiness?.staff?.map((staff, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{staff.name}</div>
                  <div className="text-gray-400 text-sm">Productivity: {staff.productivity}x</div>
                </div>
                <div className="text-green-400">${formatNumber(staff.cost)}/month</div>
              </div>
            )) || (
                <div className="text-gray-400 text-center py-8">No staff hired yet</div>
              )}
          </div>
        </div>

        {/* Hire Staff */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Hire New Staff</h3>
          <div className="space-y-3">
            {Object.values(STAFF_TYPES).map((staffType) => (
              <div key={staffType.id} className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">{staffType.name}</div>
                    <div className="text-gray-400 text-sm">
                      Productivity: {staffType.productivity}x | Happiness: {(staffType.happiness * 100).toFixed(0)}%
                    </div>
                  </div>
                  <button
                    onClick={() => hireStaff && hireStaff(businessType, staffType.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Hire (${formatNumber(staffType.cost)})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUpgrades = () => (
    <div className="management-section space-y-6">
      <h2 className="text-2xl font-bold text-white">Business Upgrades</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {business.upgrades?.map((upgrade, index) => {
          const upgradeConfig = {
            better_lemons: { name: 'Premium Lemons', cost: 500, bonus: 1.2, description: 'Higher quality lemons increase customer satisfaction', icon: '🍋' },
            fancy_stand: { name: 'Fancy Stand Design', cost: 1000, bonus: 1.3, description: 'Attractive design draws more customers', icon: '🏪' },
            marketing_signs: { name: 'Marketing Signs', cost: 750, bonus: 1.15, description: 'Better signage increases visibility', icon: '📢' },
            wood_fired_oven: { name: 'Wood-Fired Oven', cost: 5000, bonus: 1.5, description: 'Authentic taste increases customer loyalty', icon: '🔥' },
            delivery_service: { name: 'Delivery Service', cost: 3000, bonus: 1.4, description: 'Expand reach with delivery options', icon: '🚗' },
            premium_ingredients: { name: 'Premium Ingredients', cost: 2500, bonus: 1.25, description: 'Higher quality ingredients justify premium pricing', icon: '⭐' }
          };

          const config = upgradeConfig[upgrade] || { name: upgrade, cost: 1000, bonus: 1.1, description: 'Business improvement', icon: '⬆️' };

          return (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{config.icon}</div>
                <div>
                  <h3 className="text-white font-semibold">{config.name}</h3>
                  <p className="text-gray-400 text-sm">{config.description}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-yellow-400">${formatNumber(config.cost)}</div>
                  <div className="text-green-400 text-sm">+{((config.bonus - 1) * 100).toFixed(0)}% income</div>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                  Purchase
                </button>
              </div>
            </div>
          );
        }) || (
            <div className="col-span-2 text-gray-400 text-center py-8">No upgrades available</div>
          )}
      </div>
    </div>
  );

  const renderSupplyChain = () => {
    const products = {
      LEMONADE_STAND: [
        { name: 'Fresh Lemons', quantity: businessLevel * 10, cost: 2, sellPrice: 5 },
        { name: 'Sugar', quantity: businessLevel * 5, cost: 1, sellPrice: 3 },
        { name: 'Ice', quantity: businessLevel * 15, cost: 0.5, sellPrice: 1 },
        { name: 'Cups', quantity: businessLevel * 20, cost: 0.2, sellPrice: 0.5 }
      ],
      PIZZA_SHOP: [
        { name: 'Pizza Dough', quantity: businessLevel * 8, cost: 3, sellPrice: 8 },
        { name: 'Tomato Sauce', quantity: businessLevel * 12, cost: 2, sellPrice: 5 },
        { name: 'Cheese', quantity: businessLevel * 6, cost: 5, sellPrice: 12 },
        { name: 'Toppings', quantity: businessLevel * 10, cost: 4, sellPrice: 10 }
      ]
    };

    const businessProducts = products[businessType] || [
      { name: 'Business Services', quantity: businessLevel * 5, cost: 10, sellPrice: 25 }
    ];

    return (
      <div className="management-section space-y-6">
        <h2 className="text-2xl font-bold text-white">Supply Chain Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Production Output</h3>
            <div className="space-y-3">
              {businessProducts.map((product, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{product.name}</div>
                      <div className="text-gray-400 text-sm">Quantity: {product.quantity}/day</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400">Cost: ${product.cost}</div>
                      <div className="text-green-400">Sell: ${product.sellPrice}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Supply Chain Stats</h3>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-gray-400 text-sm">Daily Production Value</div>
                <div className="text-xl font-bold text-green-400">
                  ${formatNumber(businessProducts.reduce((sum, p) => sum + (p.quantity * p.sellPrice), 0))}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-gray-400 text-sm">Daily Production Cost</div>
                <div className="text-xl font-bold text-red-400">
                  ${formatNumber(businessProducts.reduce((sum, p) => sum + (p.quantity * p.cost), 0))}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-gray-400 text-sm">Daily Profit Margin</div>
                <div className="text-xl font-bold text-purple-400">
                  {((1 - businessProducts.reduce((sum, p) => sum + (p.quantity * p.cost), 0) /
                    businessProducts.reduce((sum, p) => sum + (p.quantity * p.sellPrice), 0)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="management-section space-y-6">
      <h2 className="text-2xl font-bold text-white">Business Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Performance</h3>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Revenue Trend</div>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-green-400">${formatNumber(analytics.monthly)}</div>
                <div className="text-green-400 text-sm">↗ +15.3%</div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Growth Rate</div>
              <div className="text-xl font-bold text-blue-400">
                {businessLevel > 0 ? (businessLevel * 2.5).toFixed(1) : 0}% monthly
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Market Position</div>
              <div className="text-xl font-bold text-purple-400">
                {businessLevel < 10 ? 'Growing' : businessLevel < 25 ? 'Established' : 'Market Leader'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Operational Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Customer Satisfaction</span>
                <span className="text-green-400">{Math.min(100, 70 + businessLevel * 2)}%</span>
              </div>
              <div className="bg-gray-600 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, 70 + businessLevel * 2)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Employee Happiness</span>
                <span className="text-blue-400">{Math.min(100, 60 + businessLevel * 3)}%</span>
              </div>
              <div className="bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, 60 + businessLevel * 3)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Market Share</span>
                <span className="text-purple-400">{Math.min(100, businessLevel * 1.5)}%</span>
              </div>
              <div className="bg-gray-600 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, businessLevel * 1.5)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">{business.name} Management</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-center transition-all ${activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'staff' && renderStaffManagement()}
          {activeTab === 'upgrades' && renderUpgrades()}
          {activeTab === 'supply' && renderSupplyChain()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full m-4">
              <h3 className="text-xl font-bold text-white mb-4">Upgrade Business</h3>
              <p className="text-gray-300 mb-4">
                Upgrade your {business.name} to level {businessLevel + 1} for ${formatNumber(upgradeCost)}?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleUpgrade}
                  disabled={player.points < upgradeCost}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold ${player.points >= upgradeCost
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Confirm Upgrade
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BusinessManagementPage;