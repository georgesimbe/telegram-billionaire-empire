import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useIntegratedGameStore from '../store/integratedGameStore';
import { EconomicSimulator, ECONOMIC_CONFIG } from '../config/economicSimulationConfig';

const EconomicDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const player = useIntegratedGameStore(state => state.player);
  const businesses = useIntegratedGameStore(state => state.businesses);
  const staking = useIntegratedGameStore(state => state.staking);
  const economics = useIntegratedGameStore(state => state.economics);
  const achievements = useIntegratedGameStore(state => state.achievements);
  
  const claimDailyLoginReward = useIntegratedGameStore(state => state.claimDailyLoginReward);
  const checkAndAwardAchievements = useIntegratedGameStore(state => state.checkAndAwardAchievements);
  const calculateEconomicStatus = useIntegratedGameStore(state => state.calculateEconomicStatus);
  const processMonthlyEconomics = useIntegratedGameStore(state => state.processMonthlyEconomics);
  const triggerEconomicEvent = useIntegratedGameStore(state => state.triggerEconomicEvent);
  const earnGovernanceRewards = useIntegratedGameStore(state => state.earnGovernanceRewards);
  
  // Calculate current economic status
  const totalWealth = player.cash + player.totalEarned + 
                     businesses.reduce((sum, b) => sum + (b.value || 0), 0);
  const economicClass = EconomicSimulator.getEconomicClass(totalWealth);
  const politicalInfluence = EconomicSimulator.calculatePoliticalInfluence(
    economicClass.class, 
    staking.totalStaked, 
    achievements
  );
  const dailyReward = EconomicSimulator.calculateDailyLoginReward(businesses, staking);
  const inflationRate = EconomicSimulator.calculateInflationRate(staking.totalStaked);

  useEffect(() => {
    // Auto-calculate economic status on component mount
    calculateEconomicStatus();
  }, [calculateEconomicStatus]);

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'events', label: '🌍 Events', icon: '🌍' },
    { id: 'rewards', label: '💰 Rewards', icon: '💰' },
    { id: 'influence', label: '🏛️ Influence', icon: '🏛️' }
  ];

  const economicEvents = [
    { id: 'MARKET_CRASH', name: 'Market Crash', description: 'Test economic downturn', risk: 'High' },
    { id: 'INNOVATION_BOOM', name: 'Innovation Boom', description: 'Technology breakthrough', risk: 'Low' },
    { id: 'INFRASTRUCTURE_CRISIS', name: 'Infrastructure Crisis', description: 'System failures', risk: 'Medium' },
    { id: 'RESOURCE_SHORTAGE', name: 'Resource Shortage', description: 'Supply disruption', risk: 'Medium' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Economic Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Economic Class</div>
            <div className={`text-lg font-bold`} style={{ color: economicClass.color }}>
              {economicClass.label}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Wealth</div>
            <div className="text-lg font-bold text-green-400">
              ${totalWealth.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-gray-700 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-yellow-500 text-gray-900'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Economic Indicators */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Economic Indicators</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Inflation Rate</span>
                    <span className="text-red-400">{(inflationRate * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Influence</span>
                    <span className="text-blue-400">{economics.marketInfluence?.toFixed(1) || '0.0'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Political Power</span>
                    <span className="text-purple-400">{politicalInfluence.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Events</span>
                    <span className="text-orange-400">{economics.activeEvents?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Business Performance */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Business Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Businesses</span>
                    <span className="text-green-400">{businesses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Income</span>
                    <span className="text-green-400">
                      ${businesses.reduce((sum, b) => sum + (b.monthlyIncome || 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cluster Bonuses</span>
                    <span className="text-yellow-400">
                      {economics.clusterBonuses ? `${((economics.clusterBonuses.totalBonus - 1) * 100).toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Supply Chain Health</span>
                    <span className="text-blue-400">
                      {businesses.length > 0 
                        ? `${(businesses.reduce((sum, b) => sum + (b.supplyChainHealth || 1), 0) / businesses.length * 100).toFixed(0)}%`
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={processMonthlyEconomics}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  📈 Process Economics
                </button>
                <button
                  onClick={checkAndAwardAchievements}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  🏆 Check Achievements
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'events' && (
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Active Economic Events</h3>
              {economics.activeEvents && economics.activeEvents.length > 0 ? (
                <div className="space-y-2">
                  {economics.activeEvents.map((event, index) => (
                    <div key={index} className="bg-gray-600 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{event.name}</h4>
                          <p className="text-gray-400 text-sm">{event.description}</p>
                        </div>
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No active economic events</p>
              )}
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Trigger Events (Dev Mode)</h3>
              <div className="grid grid-cols-1 gap-2">
                {economicEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => triggerEconomicEvent(event.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{event.name}</div>
                        <div className="text-xs opacity-75">{event.description}</div>
                      </div>
                      <span className="text-xs bg-red-800 px-2 py-1 rounded">
                        {event.risk}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'rewards' && (
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Play-to-Earn Rewards</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">Daily Login Reward</div>
                    <div className="text-gray-400 text-sm">
                      {dailyReward > 0 ? `${dailyReward} TON available` : 'Own businesses to earn'}
                    </div>
                  </div>
                  <button
                    onClick={claimDailyLoginReward}
                    disabled={dailyReward === 0}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      dailyReward > 0
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Claim
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">Governance Participation</div>
                    <div className="text-gray-400 text-sm">Earn 0.1 TON for voting</div>
                  </div>
                  <button
                    onClick={() => earnGovernanceRewards('vote')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Earn
                  </button>
                </div>

                <div className="p-3 bg-gray-600 rounded-lg">
                  <div className="text-white font-semibold mb-2">Achievement Progress</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">First Business</span>
                      <span className={businesses.length >= 1 ? 'text-green-400' : 'text-gray-400'}>
                        {businesses.length >= 1 ? '✅ 0.1 TON' : '❌ Need 1 business'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Millionaire</span>
                      <span className={player.totalEarned >= 1000000 ? 'text-green-400' : 'text-gray-400'}>
                        {player.totalEarned >= 1000000 ? '✅ 1.0 TON' : `❌ ${((player.totalEarned / 1000000) * 100).toFixed(1)}%`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Business Empire</span>
                      <span className={businesses.length >= 10 ? 'text-green-400' : 'text-gray-400'}>
                        {businesses.length >= 10 ? '✅ 5.0 TON' : `❌ ${businesses.length}/10 businesses`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'influence' && (
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Political & Economic Influence</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-600 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Economic Class</span>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{ backgroundColor: economicClass.color, color: 'white' }}
                    >
                      {economicClass.label}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Wealth Range: ${economicClass.min.toLocaleString()} - {
                      economicClass.max === Infinity ? '∞' : `$${economicClass.max.toLocaleString()}`
                    }
                  </div>
                </div>

                <div className="p-3 bg-gray-600 rounded-lg">
                  <div className="text-white font-semibold mb-2">Political Influence Breakdown</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Base Class Multiplier</span>
                      <span className="text-white">{
                        economicClass.class === 'POOR' ? '1.0x' :
                        economicClass.class === 'MIDDLE' ? '1.2x' :
                        economicClass.class === 'UPPER_MIDDLE' ? '1.5x' :
                        economicClass.class === 'WEALTHY' ? '2.0x' : '3.0x'
                      }</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Staking Bonus</span>
                      <span className="text-blue-400">+{(Math.log10(staking.totalStaked + 1) * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Achievement Bonus</span>
                      <span className="text-green-400">+{(achievements.length * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-500 pt-2 flex justify-between font-semibold">
                      <span className="text-white">Total Influence</span>
                      <span className="text-purple-400">{politicalInfluence.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-600 rounded-lg">
                  <div className="text-white font-semibold mb-2">Governance Power</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Voting Power</span>
                      <span className="text-yellow-400">{staking.votingPower || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Governance Tokens</span>
                      <span className="text-purple-400">{staking.governanceTokens || 0}</span>
                    </div>
                    <div className="text-gray-400 text-xs mt-2">
                      Voting power is based on staked TON and tenure bonuses
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EconomicDashboard;
