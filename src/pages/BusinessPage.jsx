import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useIntegratedGameStore from '../store/integratedGameStore';
import { EXPANDED_INDUSTRIES_CONFIG, INDUSTRY_SECTORS, calculateBusinessCost, calculateBusinessIncome, getUnlockedBusinesses, getBusinessesBySector, calculateSupplyChainBonus } from '../config/expandedIndustriesConfig';
import HintIcon, { QuickHint, GAME_HINTS } from '../components/HintIcon';
import { formatNumber } from '../utils/formatters';
import UpgradeModal from '../components/UpgradeModal';
import { BUSINESSES_CONFIG } from '../config/businessConfig';
import {
  RESOURCE_TYPES,
  PRODUCTION_RECIPES,
  calculateSupplyChainEfficiency,
  calculateResourcePrice,
  getSupplyChainDashboard,
  simulateMarketFluctuation
} from '../config/supplyChainConfig';
import {
  ENHANCED_STAFF_TYPES,
  EXECUTIVE_TYPES,
  calculateStaffProductivity,
  calculateStaffMorale,
  calculateExecutiveBonus,
  calculateTeamSynergy
} from '../config/staffManagementConfig';
import {
  ADVANCED_NEWS_EVENTS,
  getApplicableEvents,
  processEventChoice,
  simulateCommunityVoting
} from '../config/advancedNewsConfig';

const BusinessPage = () => {
  const {
    businesses,
    addBusiness,
    updateBusiness,
    player,
    spendMoney,
    addIncome
  } = useIntegratedGameStore();

  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [resourcePrices, setResourcePrices] = useState({});
  const [activeEvent, setActiveEvent] = useState(null);
  const [supplyChainData, setSupplyChainData] = useState({});

  // Initialize resource prices
  useEffect(() => {
    const initialPrices = {};
    Object.keys(RESOURCE_TYPES).forEach(resourceId => {
      initialPrices[resourceId] = RESOURCE_TYPES[resourceId].basePrice;
    });
    setResourcePrices(initialPrices);

    // Simulate market fluctuations every 30 seconds
    const interval = setInterval(() => {
      setResourcePrices(prev => simulateMarketFluctuation(prev));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Update supply chain dashboard
  useEffect(() => {
    if (businesses.length > 0) {
      const resources = {}; // This would come from player's resource inventory
      const dashboard = getSupplyChainDashboard(businesses, resources, resourcePrices);
      setSupplyChainData(dashboard);
    }
  }, [businesses, resourcePrices]);

  // Check for news events
  useEffect(() => {
    const checkForEvents = () => {
      const playerState = { businesses, points: player.cash };
      const applicableEvents = getApplicableEvents(playerState);

      if (applicableEvents.length > 0 && !activeEvent) {
        setActiveEvent(applicableEvents[0]);
      }
    };

    const interval = setInterval(checkForEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [businesses, player.cash, activeEvent]);

  const unlockedBusinesses = getUnlockedBusinesses(player.level);
  const ownedBusinesses = businesses || [];

  const purchaseBusiness = (businessConfig) => {
    const cost = calculateBusinessCost(businessConfig, 0);

    if (player.cash >= cost) {
      spendMoney(cost);
      addBusiness({
        id: businessConfig.id,
        type: businessConfig.id,
        name: businessConfig.name,
        level: 1,
        income: businessConfig.baseIncome,
        cost: cost,
        sector: businessConfig.sector,
        lastCollected: Date.now(),
        supplyChain: businessConfig.supplyChain
      });
    } else {
      alert('Not enough cash to purchase this business!');
    }
  };

  const upgradeBusiness = (businessId) => {
    const business = ownedBusinesses.find(b => b.id === businessId);
    const businessConfig = EXPANDED_INDUSTRIES_CONFIG[businessId];

    if (!business || !businessConfig) return;

    const upgradeCost = calculateBusinessCost(businessConfig, business.level);

    if (player.cash >= upgradeCost) {
      spendMoney(upgradeCost);
      updateBusiness(businessId, {
        level: business.level + 1,
        income: calculateBusinessIncome(businessConfig, business.level + 1)
      });
    } else {
      alert('Not enough cash to upgrade this business!');
    }
  };

  const collectIncome = (businessId) => {
    const business = ownedBusinesses.find(b => b.id === businessId);
    const businessConfig = EXPANDED_INDUSTRIES_CONFIG[businessId];

    if (!business || !businessConfig) return;

    const supplyChainBonus = calculateSupplyChainBonus(ownedBusinesses, businessConfig);
    const income = calculateBusinessIncome(businessConfig, business.level, supplyChainBonus);

    addIncome(income);
    updateBusiness(businessId, { lastCollected: Date.now() });
  };

  const renderMarketplace = () => {
    const sectors = selectedSector === 'all'
      ? Object.keys(INDUSTRY_SECTORS)
      : [selectedSector];

    return (
      <div className="space-y-6">
        {/* Sector Filter */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Business Marketplace</h3>
            <QuickHint hintKey="BUSINESS_UPGRADE" />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedSector === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              All Industries
            </button>
            {Object.entries(INDUSTRY_SECTORS).map(([sectorName, sectorData]) => (
              <button
                key={sectorName}
                onClick={() => setSelectedSector(sectorName)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedSector === sectorName
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {sectorData.icon} {sectorName}
              </button>
            ))}
          </div>
        </div>

        {/* Business Grid */}
        {sectors.map(sectorName => {
          const sectorBusinesses = getBusinessesBySector(sectorName).filter(
            business => business.unlockLevel <= player.level
          );

          if (sectorBusinesses.length === 0) return null;

          return (
            <div key={sectorName} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{INDUSTRY_SECTORS[sectorName].icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{sectorName}</h3>
                  <p className="text-gray-400 text-sm">{INDUSTRY_SECTORS[sectorName].description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectorBusinesses.map(business => {
                  const owned = ownedBusinesses.find(b => b.id === business.id);
                  const cost = calculateBusinessCost(business, owned?.level || 0);
                  const income = calculateBusinessIncome(business, owned?.level || 1);
                  const supplyChainBonus = calculateSupplyChainBonus(ownedBusinesses, business);
                  const canAfford = player.cash >= cost;

                  return (
                    <motion.div
                      key={business.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{business.icon}</span>
                          <div>
                            <h4 className="text-white font-semibold">{business.name}</h4>
                            <p className="text-gray-400 text-xs">{business.description}</p>
                          </div>
                        </div>
                        <HintIcon
                          hint={`${business.description}. Unlock level: ${business.unlockLevel}`}
                          title={business.name}
                          type="info"
                          size="sm"
                        />
                      </div>

                      {/* Business Stats */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Cost:</span>
                          <span className="text-white">${formatNumber(cost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Income:</span>
                          <span className="text-green-400">${formatNumber(income)}/min</span>
                        </div>
                        {owned && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Level:</span>
                            <span className="text-blue-400">{owned.level}</span>
                          </div>
                        )}
                        {supplyChainBonus > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Supply Bonus:</span>
                            <span className="text-yellow-400">+{(supplyChainBonus * 100).toFixed(1)}%</span>
                          </div>
                        )}
                      </div>

                      {/* Supply Chain Requirements */}
                      {business.supplyChain?.requires?.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <span className="text-gray-400 text-xs">Supply Chain:</span>
                            <QuickHint hintKey="SUPPLY_CHAIN" size="xs" className="ml-1" />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {business.supplyChain.requires.map(req => {
                              const hasSupplier = ownedBusinesses.some(b => b.id === req);
                              const supplierConfig = EXPANDED_INDUSTRIES_CONFIG[req];
                              return (
                                <span
                                  key={req}
                                  className={`text-xs px-2 py-1 rounded ${hasSupplier
                                    ? 'bg-green-900 text-green-300'
                                    : 'bg-red-900 text-red-300'
                                    }`}
                                >
                                  {supplierConfig?.icon} {supplierConfig?.name || req}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {!owned ? (
                          <button
                            onClick={() => purchaseBusiness(business)}
                            disabled={!canAfford}
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${canAfford
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              }`}
                          >
                            {canAfford ? 'Purchase' : 'Insufficient Funds'}
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <button
                              onClick={() => collectIncome(business.id)}
                              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            >
                              Collect Income
                            </button>
                            <button
                              onClick={() => upgradeBusiness(business.id)}
                              disabled={!canAfford}
                              className={`w-full py-1 px-4 rounded-lg text-sm transition-colors ${canAfford
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                              Upgrade (${formatNumber(cost)})
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPortfolio = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Your Business Portfolio</h3>
          <QuickHint hintKey="BUSINESS_ROI" />
        </div>

        {ownedBusinesses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">You don't own any businesses yet.</p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedBusinesses.map(business => {
              const config = EXPANDED_INDUSTRIES_CONFIG[business.id];
              if (!config) return null;

              const supplyChainBonus = calculateSupplyChainBonus(ownedBusinesses, config);
              const income = calculateBusinessIncome(config, business.level, supplyChainBonus);

              return (
                <div key={business.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{config.icon}</span>
                    <div>
                      <h4 className="text-white font-semibold">{config.name}</h4>
                      <p className="text-gray-400 text-sm">Level {business.level}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Income:</span>
                      <span className="text-green-400">${formatNumber(income)}/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sector:</span>
                      <span className="text-blue-400">{config.sector}</span>
                    </div>
                    {supplyChainBonus > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Supply Bonus:</span>
                        <span className="text-yellow-400">+{(supplyChainBonus * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => collectIncome(business.id)}
                    className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Collect Income
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderSupplyChain = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Supply Chain Analysis</h3>
          <QuickHint hintKey="SUPPLY_CHAIN" />
        </div>

        {ownedBusinesses.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Purchase businesses to see supply chain analysis
          </p>
        ) : (
          <div className="space-y-4">
            {ownedBusinesses.map(business => {
              const config = EXPANDED_INDUSTRIES_CONFIG[business.id];
              if (!config?.supplyChain?.requires) return null;

              const supplyChainBonus = calculateSupplyChainBonus(ownedBusinesses, config);

              return (
                <div key={business.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{config.icon}</span>
                      <h4 className="text-white font-semibold">{config.name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${supplyChainBonus > 0.2 ? 'bg-green-900 text-green-300' :
                      supplyChainBonus > 0 ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                      {supplyChainBonus > 0 ? `+${(supplyChainBonus * 100).toFixed(1)}%` : 'No Bonus'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Required Suppliers:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {config.supplyChain.requires.map(req => {
                        const hasSupplier = ownedBusinesses.some(b => b.id === req);
                        const supplierConfig = EXPANDED_INDUSTRIES_CONFIG[req];

                        return (
                          <div
                            key={req}
                            className={`p-2 rounded text-sm ${hasSupplier
                              ? 'bg-green-900 text-green-300'
                              : 'bg-gray-600 text-gray-300'
                              }`}
                          >
                            <span className="mr-1">{supplierConfig?.icon}</span>
                            {supplierConfig?.name || req}
                            {hasSupplier && <span className="ml-1">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Business Empire</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Cash:</span>
          <span className="text-green-400 font-bold">${formatNumber(player.cash)}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'marketplace', name: 'Marketplace', icon: '🏪' },
          { id: 'portfolio', name: 'Portfolio', icon: '📊' },
          { id: 'supply-chain', name: 'Supply Chain', icon: '🔗' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'marketplace' && renderMarketplace()}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'supply-chain' && renderSupplyChain()}
      </motion.div>
    </div>
  );
};

export default BusinessPage;
