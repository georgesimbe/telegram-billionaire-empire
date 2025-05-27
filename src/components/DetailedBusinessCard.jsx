import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { anime } from 'animejs';
import { useGameStore } from '../store/gameStore';
import { BUSINESSES_CONFIG, calculateBusinessCost, calculateBusinessIncome, STAFF_TYPES } from '../config/businessConfig';
import { formatNumber } from '../utils/formatters';

const DetailedBusinessCard = ({ businessType, onManage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const {
    player,
    businesses,
    buyBusiness,
    upgradeBusiness,
    hireStaff,
    addManager
  } = useGameStore();

  const business = BUSINESSES_CONFIG[businessType];
  const ownedBusiness = businesses.find(b => b.type === businessType);
  const isOwned = !!ownedBusiness;
  const businessLevel = ownedBusiness?.level || 0;
  const businessCost = calculateBusinessCost(business, businessLevel);
  const businessIncome = calculateBusinessIncome(business, businessLevel + 1);
  const canAfford = player.points >= businessCost;
  const canUnlock = player.level >= business.unlockLevel;

  useEffect(() => {
    if (isExpanded && !animationPlayed) {
      // Animate card expansion
      anime({
        targets: '.business-stats',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutQuad'
      });

      // Animate progress bars
      anime({
        targets: '.progress-bar',
        width: ['0%', '100%'],
        duration: 1000,
        delay: 300,
        easing: 'easeOutCubic'
      });

      setAnimationPlayed(true);
    }
  }, [isExpanded, animationPlayed]);

  const handlePurchase = () => {
    if (canAfford && canUnlock) {
      buyBusiness(businessType);

      // Success animation
      anime({
        targets: '.purchase-button',
        scale: [1, 0.9, 1.1, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .8)'
      });
    }
  };

  const handleUpgrade = () => {
    if (isOwned && canAfford) {
      upgradeBusiness(businessType);

      // Upgrade animation
      anime({
        targets: '.level-indicator',
        rotate: '1turn',
        scale: [1, 1.2, 1],
        duration: 800,
        easing: 'easeOutBack(1.7)'
      });
    }
  };

  const getSupplyChainProducts = () => {
    // Define what each business produces for supply chain
    const products = {
      LEMONADE_STAND: ['Fresh Lemons', 'Sugar', 'Ice', 'Cups'],
      PIZZA_SHOP: ['Pizza Dough', 'Tomato Sauce', 'Cheese', 'Toppings'],
      COFFEE_CHAIN: ['Coffee Beans', 'Milk', 'Pastries', 'Packaging'],
      CONVENIENCE_STORE: ['Packaged Goods', 'Beverages', 'Snacks', 'Supplies'],
      FASHION_BOUTIQUE: ['Clothing Items', 'Accessories', 'Seasonal Collections'],
      APP_DEVELOPMENT: ['Mobile Apps', 'Software Solutions', 'Digital Services'],
      GAMING_STUDIO: ['Video Games', 'Gaming Assets', 'Entertainment Content'],
      APARTMENT_COMPLEX: ['Housing Units', 'Rental Services', 'Property Management'],
      OFFICE_TOWER: ['Office Space', 'Commercial Leases', 'Building Services'],
      ELECTRONICS_FACTORY: ['Consumer Electronics', 'Components', 'Tech Hardware'],
      INVESTMENT_FIRM: ['Financial Products', 'Investment Services', 'Portfolio Management'],
      MOVIE_THEATER: ['Entertainment Shows', 'Concession Sales', 'Event Hosting'],
      MEDICAL_CLINIC: ['Healthcare Services', 'Medical Consultations', 'Health Programs'],
      SOLAR_FARM: ['Renewable Energy', 'Electricity Generation', 'Green Certificates'],
      SPACE_TOURISM: ['Space Flights', 'Aerospace Services', 'Space Technology']
    };

    return products[businessType] || ['Business Services'];
  };

  const getUpgradeOptions = () => {
    if (!business.upgrades) return [];

    return business.upgrades.map(upgrade => {
      const upgradeConfig = {
        better_lemons: { name: 'Premium Lemons', cost: 500, bonus: 1.2, description: 'Higher quality lemons increase customer satisfaction' },
        fancy_stand: { name: 'Fancy Stand Design', cost: 1000, bonus: 1.3, description: 'Attractive design draws more customers' },
        marketing_signs: { name: 'Marketing Signs', cost: 750, bonus: 1.15, description: 'Better signage increases visibility' },
        wood_fired_oven: { name: 'Wood-Fired Oven', cost: 5000, bonus: 1.5, description: 'Authentic taste increases customer loyalty' },
        delivery_service: { name: 'Delivery Service', cost: 3000, bonus: 1.4, description: 'Expand reach with delivery options' },
        premium_ingredients: { name: 'Premium Ingredients', cost: 2500, bonus: 1.25, description: 'Higher quality ingredients justify premium pricing' },
        espresso_machines: { name: 'Professional Espresso Machines', cost: 8000, bonus: 1.6, description: 'Better equipment improves drink quality' },
        loyalty_program: { name: 'Customer Loyalty Program', cost: 4000, bonus: 1.3, description: 'Retain customers with rewards program' },
        mobile_app: { name: 'Mobile Ordering App', cost: 6000, bonus: 1.4, description: 'Convenient ordering increases sales' }
      };

      return upgradeConfig[upgrade] || { name: upgrade, cost: 1000, bonus: 1.1, description: 'Business improvement' };
    });
  };

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      layout
    >
      {/* Background animation effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-500" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{business.icon}</div>
            <div>
              <h3 className="text-lg font-bold text-white">{business.name}</h3>
              <p className="text-sm text-gray-400">
                {BUSINESS_CATEGORIES[business.category]?.name || 'Business'}
              </p>
            </div>
          </div>

          {isOwned && (
            <div className="level-indicator flex items-center space-x-2">
              <span className="text-sm text-gray-400">Level</span>
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                {businessLevel}
              </span>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="space-y-2 mb-4">
          <p className="text-gray-300 text-sm">{business.description}</p>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-400">Cost: </span>
              <span className="text-yellow-400 font-semibold">${formatNumber(businessCost)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Income: </span>
              <span className="text-green-400 font-semibold">${formatNumber(businessIncome)}/min</span>
            </div>
          </div>

          {!canUnlock && (
            <div className="text-orange-400 text-sm">
              🔒 Unlock at level {business.unlockLevel}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-3">
          {!isOwned ? (
            <button
              className={`purchase-button flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${canAfford && canUnlock
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              onClick={handlePurchase}
              disabled={!canAfford || !canUnlock}
            >
              {canAfford && canUnlock ? 'Purchase' : 'Cannot Afford'}
            </button>
          ) : (
            <>
              <button
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${canAfford
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleUpgrade}
                disabled={!canAfford}
              >
                Upgrade (${formatNumber(businessCost)})
              </button>
              <button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
                onClick={() => onManage && onManage(businessType)}
              >
                Manage
              </button>
            </>
          )}

          <button
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 border-t border-gray-700 pt-4"
          >
            {/* Business Stats */}
            <div className="business-stats grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-2">Performance</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Profitability</span>
                      <span className="text-green-400">
                        {isOwned ? Math.min(100, (businessLevel / business.maxLevel) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                    <div className="bg-gray-600 rounded-full h-2 mt-1">
                      <div
                        className="progress-bar bg-green-500 h-2 rounded-full"
                        style={{ width: isOwned ? `${Math.min(100, (businessLevel / business.maxLevel) * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Efficiency</span>
                      <span className="text-blue-400">
                        {isOwned ? Math.min(100, 50 + (businessLevel * 3)).toFixed(0) : 0}%
                      </span>
                    </div>
                    <div className="bg-gray-600 rounded-full h-2 mt-1">
                      <div
                        className="progress-bar bg-blue-500 h-2 rounded-full"
                        style={{ width: isOwned ? `${Math.min(100, 50 + (businessLevel * 3))}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-2">Staff Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Required Staff:</span>
                    <span className="text-white">{business.staffRequired || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Manager Level:</span>
                    <span className="text-purple-400">{business.managerLevel || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Franchise Level:</span>
                    <span className="text-yellow-400">{business.franchiseLevel || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Chain Products */}
            <div className="bg-gray-700 rounded-lg p-3">
              <h4 className="text-white font-semibold mb-2">🔗 Supply Chain Products</h4>
              <div className="grid grid-cols-2 gap-2">
                {getSupplyChainProducts().map((product, index) => (
                  <div key={index} className="bg-gray-600 rounded px-2 py-1 text-sm text-gray-300">
                    • {product}
                  </div>
                ))}
              </div>
            </div>

            {/* Available Upgrades */}
            {business.upgrades && (
              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-2">⬆️ Available Upgrades</h4>
                <div className="space-y-2">
                  {getUpgradeOptions().map((upgrade, index) => (
                    <div key={index} className="bg-gray-600 rounded-lg p-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-white font-medium">{upgrade.name}</div>
                          <div className="text-gray-400 text-xs">{upgrade.description}</div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-yellow-400 text-sm">${formatNumber(upgrade.cost)}</div>
                          <div className="text-green-400 text-xs">+{((upgrade.bonus - 1) * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Market Events */}
            {business.newsEvents && (
              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-2">📰 Market Influences</h4>
                <div className="flex flex-wrap gap-1">
                  {business.newsEvents.map((event, index) => (
                    <span key={index} className="bg-orange-600 text-white px-2 py-1 rounded text-xs">
                      {event.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Projection */}
            <div className="bg-gray-700 rounded-lg p-3">
              <h4 className="text-white font-semibold mb-2">💰 Financial Projection</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-gray-400">Hourly</div>
                  <div className="text-green-400">${formatNumber(businessIncome * 60)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Daily</div>
                  <div className="text-green-400">${formatNumber(businessIncome * 60 * 24)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Monthly</div>
                  <div className="text-green-400">${formatNumber(businessIncome * 60 * 24 * 30)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DetailedBusinessCard;