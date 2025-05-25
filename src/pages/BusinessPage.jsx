import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { INDUSTRIES_CONFIG, calculateBusinessCost, calculateBusinessIncome, getUnlockedBusinesses } from '../config/industriesConfig';
import { formatNumber } from '../utils/formatters';
import UpgradeModal from '../components/UpgradeModal';
import { BUSINESS_CONFIG } from '../config/businessConfig';
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
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
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

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
  };

  const handleUpgrade = () => {
    if (!selectedBusiness) return;

    const actionResult = logAction('BUSINESS_PURCHASE', {
      businessId: selectedBusiness.id
    });

    if (!actionResult.allowed) {
      alert(actionResult.reason);
      return;
    }

    const success = buyBusiness(selectedBusiness.id);
    if (success) {
      // Success feedback handled by modal close
    } else {
      alert('Not enough points to purchase this business');
    }
  };

  const unlockedBusinesses = getUnlockedBusinesses(player.level);
  const currentLevel = selectedBusiness ? (businesses[selectedBusiness.id] || 0) : 0;
  const upgradeCost = selectedBusiness ? calculateBusinessCost(selectedBusiness, currentLevel) : 0;
  const canAfford = player.points >= upgradeCost;

  const purchaseBusiness = (businessType) => {
    const config = BUSINESS_CONFIG[businessType];
    if (!config) return;

    const cost = config.baseCost;
    if (player.cash >= cost) {
      spendMoney(cost);
      addBusiness({
        type: businessType,
        name: config.name,
        level: 1,
        income: config.baseIncome,
        cost: cost,
        staff: [],
        resources: {},
        efficiency: 1.0,
        lastUpdate: Date.now()
      });
    }
  };

  const hireStaff = (businessId, staffType) => {
    const business = businesses.find(b => b.id === businessId);
    const staffConfig = ENHANCED_STAFF_TYPES[staffType];

    if (!business || !staffConfig || player.cash < staffConfig.baseCost) return;

    spendMoney(staffConfig.baseCost);

    const newStaff = {
      id: Date.now(),
      type: staffType,
      level: 1,
      experience: 0,
      morale: staffConfig.baseMorale * 100,
      salary: staffConfig.baseCost * 0.1, // 10% of hire cost as monthly salary
      skills: [...staffConfig.skills],
      hireDate: Date.now()
    };

    const updatedStaff = [...(business.staff || []), newStaff];
    updateBusiness(businessId, { staff: updatedStaff });
  };

  const handleNewsEvent = (eventId, choiceId) => {
    const event = ADVANCED_NEWS_EVENTS[eventId];
    if (!event) return;

    const result = processEventChoice(event, choiceId, {
      businesses,
      points: player.cash
    });

    if (result && result.requirements_met) {
      if (result.costs > 0) {
        spendMoney(result.costs);
      }

      // Apply effects to businesses
      businesses.forEach(business => {
        if (event.affectedIndustries.includes(business.category)) {
          const effects = result.effects;
          const updates = {};

          if (effects.incomeMultiplier) {
            updates.income = business.income * effects.incomeMultiplier;
          }
          if (effects.efficiencyBonus) {
            updates.efficiency = (business.efficiency || 1) * (1 + effects.efficiencyBonus);
          }

          if (Object.keys(updates).length > 0) {
            updateBusiness(business.id, updates);
          }
        }
      });

      setActiveEvent(null);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Business Portfolio Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Business Portfolio</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-900/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{businesses.length}</div>
            <div className="text-sm text-gray-300">Total Businesses</div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              ${businesses.reduce((sum, b) => sum + (b.income || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Monthly Income</div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {businesses.reduce((sum, b) => sum + (b.staff?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-300">Total Staff</div>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {((supplyChainData.totalEfficiency || 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">Avg Efficiency</div>
          </div>
        </div>
      </div>

      {/* Supply Chain Dashboard */}
      {supplyChainData.bottlenecks && supplyChainData.bottlenecks.length > 0 && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-400 mb-4">Supply Chain Alerts</h3>
          <div className="space-y-3">
            {supplyChainData.bottlenecks.map((bottleneck, index) => (
              <div key={index} className="bg-red-900/30 rounded-lg p-3">
                <div className="font-bold text-white">{bottleneck.business}</div>
                <div className="text-sm text-red-300">
                  Efficiency: {(bottleneck.efficiency * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  Missing: {bottleneck.missingResources.map(r => r.resource).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active News Event */}
      {activeEvent && (
        <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-400 mb-4">Breaking News</h3>
          <div className="mb-4">
            <h4 className="font-bold text-white text-lg">{activeEvent.name}</h4>
            <p className="text-gray-300 mt-2">{activeEvent.description}</p>
          </div>

          <div className="space-y-3">
            {activeEvent.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleNewsEvent(activeEvent.id, choice.id)}
                disabled={choice.requirements && player.cash < (choice.requirements.points || 0)}
                className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded-lg transition-colors"
              >
                <div className="font-bold text-white">{choice.text}</div>
                {choice.cost > 0 && (
                  <div className="text-sm text-yellow-400 mt-1">
                    Cost: ${choice.cost.toLocaleString()}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Business List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Your Businesses</h3>
        {businesses.length === 0 ? (
          <p className="text-gray-400">No businesses owned yet. Purchase your first business below!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businesses.map(business => {
              const config = BUSINESS_CONFIG[business.type];
              const efficiency = calculateSupplyChainEfficiency(business, {});
              const teamSynergy = calculateTeamSynergy(business.staff || []);

              return (
                <div
                  key={business.id}
                  className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => setSelectedBusiness(business)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">{business.name}</h4>
                    <span className="text-2xl">{config?.icon}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Level:</span>
                      <span className="text-white">{business.level}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Monthly Income:</span>
                      <span className="text-green-400">${business.income?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Staff:</span>
                      <span className="text-white">{business.staff?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Efficiency:</span>
                      <span className={`${efficiency >= 0.8 ? 'text-green-400' : efficiency >= 0.6 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {(efficiency * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Team Synergy:</span>
                      <span className="text-blue-400">{(teamSynergy * 100).toFixed(1)}%</span>
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

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Available Businesses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(BUSINESS_CONFIG).map(([type, config]) => (
            <div key={type} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white">{config.name}</h4>
                <span className="text-3xl">{config.icon}</span>
              </div>

              <p className="text-sm text-gray-300 mb-4">{config.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-white">${config.baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Monthly Income:</span>
                  <span className="text-green-400">${config.baseIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{config.category}</span>
                </div>
              </div>

              <button
                onClick={() => purchaseBusiness(type)}
                disabled={player.cash < config.baseCost}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Resource Market</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(RESOURCE_TYPES).map(([resourceId, resource]) => {
            const currentPrice = resourcePrices[resourceId] || resource.basePrice;
            const priceChange = ((currentPrice - resource.basePrice) / resource.basePrice) * 100;

            return (
              <div key={resourceId} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{resource.icon}</span>
                    <h4 className="font-bold text-white">{resource.name}</h4>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3">{resource.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Price:</span>
                    <span className="text-white">${currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price Change:</span>
                    <span className={priceChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white capitalize">{resource.category.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStaffManagement = () => (
    <div className="space-y-6">
      {selectedBusiness ? (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              Staff Management - {selectedBusiness.name}
            </h3>
            <button
              onClick={() => setSelectedBusiness(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Current Staff */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white mb-3">Current Staff</h4>
            {selectedBusiness.staff && selectedBusiness.staff.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBusiness.staff.map(staff => {
                  const staffConfig = ENHANCED_STAFF_TYPES[staff.type.toUpperCase()];
                  const productivity = calculateStaffProductivity(staff);
                  const morale = calculateStaffMorale(staff, selectedBusiness);

                  return (
                    <div key={staff.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{staffConfig?.icon}</span>
                        <div>
                          <h5 className="font-bold text-white">{staffConfig?.name}</h5>
                          <div className="text-sm text-gray-400">Level {staff.level}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Productivity:</span>
                          <span className="text-green-400">{(productivity * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Morale:</span>
                          <span className={morale >= 80 ? 'text-green-400' : morale >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                            {morale.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Experience:</span>
                          <span className="text-white">{staff.experience || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">No staff hired yet.</p>
            )}
          </div>

          {/* Hire New Staff */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Hire New Staff</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(ENHANCED_STAFF_TYPES).map(([type, config]) => (
                <div key={type} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{config.icon}</span>
                    <h5 className="font-bold text-white">{config.name}</h5>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{config.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-white">${config.baseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Productivity:</span>
                      <span className="text-green-400">{(config.baseProductivity * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => hireStaff(selectedBusiness.id, type)}
                    disabled={player.cash < config.baseCost}
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Hire
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Staff Management</h3>
          <p className="text-gray-400 mb-4">Select a business to manage its staff.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businesses.map(business => (
              <button
                key={business.id}
                onClick={() => setSelectedBusiness(business)}
                className="text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <h4 className="font-bold text-white">{business.name}</h4>
                <div className="text-sm text-gray-400 mt-1">
                  Staff: {business.staff?.length || 0}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Business Empire</h1>
          <p className="text-blue-200">Build and manage your business portfolio</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
            { id: 'resources', label: 'Resources', icon: '📦' },
            { id: 'staff', label: 'Staff', icon: '👥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'marketplace' && renderMarketplace()}
          {activeTab === 'resources' && renderResources()}
          {activeTab === 'staff' && renderStaffManagement()}
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;