import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useIntegratedGameStore from '../store/integratedGameStore';
import { EconomicSimulator, ECONOMIC_CONFIG } from '../config/economicSimulationConfig';

const EconomicDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [animatedWealth, setAnimatedWealth] = useState(0);
  const [chartData, setChartData] = useState({
    businessPerformance: [],
    economicTrends: [],
    inflationHistory: []
  });
  const [animeLoaded, setAnimeLoaded] = useState(false);

  const dashboardRef = useRef(null);
  const wealthCounterRef = useRef(null);
  const chartRefs = useRef({});
  const animeRef = useRef(null);
  const staggerRef = useRef(null);

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
  // const earnGovernanceRewards = useIntegratedGameStore(state => state.earnGovernanceRewards); // Function doesn't exist

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

  // Load anime.js dynamically
  useEffect(() => {
    const loadAnime = async () => {
      try {
        const animeModule = await import('animejs');
        animeRef.current = animeModule.animate || animeModule.default;
        staggerRef.current = animeModule.stagger;
        setAnimeLoaded(true);
        console.log('Anime.js loaded successfully:', {
          anime: !!animeRef.current,
          stagger: !!staggerRef.current
        });
      } catch (error) {
        console.warn('Failed to load anime.js:', error);
        // Set fallback functions
        animeRef.current = () => { };
        staggerRef.current = () => 0;
        setAnimeLoaded(true); // Still set to true to prevent infinite loading
      }
    };

    loadAnime();
  }, []);

  // Safe animation helper functions
  const safeAnime = (config) => {
    if (animeRef.current && typeof animeRef.current === 'function') {
      try {
        return animeRef.current(config);
      } catch (error) {
        console.warn('Animation error:', error);
      }
    }
  };

  const safeStagger = (value) => {
    if (staggerRef.current && typeof staggerRef.current === 'function') {
      try {
        return staggerRef.current(value);
      } catch (error) {
        console.warn('Stagger error:', error);
        return 0;
      }
    }
    return 0;
  };

  // Generate mock chart data for demonstration
  const generateChartData = () => {
    const businessPerformance = businesses.map((business, index) => ({
      name: business.name,
      income: business.monthlyIncome || 0,
      growth: Math.random() * 20 - 10, // -10% to +10%
      efficiency: business.supplyChainHealth || 1
    }));

    const economicTrends = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      gdp: 100 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
      inflation: 2 + Math.sin(i * 0.3) * 1.5 + Math.random() * 0.5,
      marketCap: 1000 + i * 50 + Math.random() * 100
    }));

    const inflationHistory = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      rate: 2 + Math.sin(i * 0.2) * 0.8 + Math.random() * 0.3
    }));

    setChartData({
      businessPerformance,
      economicTrends,
      inflationHistory
    });
  };

  useEffect(() => {
    // Auto-calculate economic status on component mount
    calculateEconomicStatus();
    generateChartData();
  }, [calculateEconomicStatus]);

  // Separate effect for animations that runs when anime is loaded
  useEffect(() => {
    if (!animeLoaded) return;

    // Animate dashboard entrance
    safeAnime({
      targets: '.dashboard-card',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: safeStagger(150),
      easing: 'easeOutQuad'
    });

    // Animate wealth counter with more sophisticated animation
    safeAnime({
      targets: { value: animatedWealth },
      value: totalWealth,
      duration: 2500,
      easing: 'easeOutExpo',
      update: function (anim) {
        if (anim.animatables && anim.animatables[0] && anim.animatables[0].target) {
          setAnimatedWealth(Math.floor(anim.animatables[0].target.value));
        }
      }
    });

    // Animate progress bars
    setTimeout(() => {
      safeAnime({
        targets: '.progress-bar-fill',
        width: (el) => el.getAttribute('data-width') + '%',
        duration: 1500,
        easing: 'easeOutCubic',
        delay: safeStagger(200)
      });
    }, 500);

    // Animate chart elements
    setTimeout(() => {
      safeAnime({
        targets: '.chart-bar',
        height: (el) => el.getAttribute('data-height') + 'px',
        duration: 1200,
        easing: 'easeOutBounce',
        delay: safeStagger(100)
      });

      safeAnime({
        targets: '.chart-line-point',
        scale: [0, 1],
        duration: 800,
        easing: 'easeOutBack',
        delay: safeStagger(50)
      });
    }, 1000);

  }, [animeLoaded, totalWealth, animatedWealth]);

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
    <div className="bg-gray-800 rounded-lg p-6 space-y-6 relative overflow-hidden" ref={dashboardRef}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-green-500 rounded-full opacity-5 animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-yellow-500 rounded-full opacity-5 animate-ping"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-purple-500 rounded-full opacity-5 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <motion.h2
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          📊 Economic Dashboard
        </motion.h2>
        <div className="flex items-center space-x-4">
          <motion.div
            className="text-right"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-sm text-gray-400">Economic Class</div>
            <div
              className={`text-lg font-bold transition-all duration-300`}
              style={{ color: economicClass.color }}
            >
              {economicClass.label}
            </div>
          </motion.div>
          <motion.div
            className="text-right"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-sm text-gray-400">Total Wealth</div>
            <div className="text-lg font-bold text-green-400 wealth-counter" ref={wealthCounterRef}>
              ${animatedWealth.toLocaleString()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <motion.div
        className="flex space-x-2 bg-gray-700 rounded-lg p-1 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => {
              setSelectedTab(tab.id);
              // Animate tab switch
              safeAnime({
                targets: '.tab-content',
                opacity: [0, 1],
                translateY: [10, 0],
                duration: 300,
                easing: 'easeOutQuad'
              });
            }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${selectedTab === tab.id
              ? 'bg-yellow-500 text-gray-900 shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg mr-2">{tab.icon}</span>
            {tab.label.split(' ').slice(1).join(' ')}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={selectedTab}
        className="tab-content relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Economic Indicators */}
              <div className="bg-gray-700 rounded-lg p-4 dashboard-card">
                <h3 className="text-lg font-semibold text-white mb-3">Economic Indicators</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Inflation Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-400 progress-bar-fill"
                          data-width={Math.min((inflationRate * 100) * 10, 100)}
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <span className="text-red-400">{(inflationRate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Market Influence</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 progress-bar-fill"
                          data-width={economics.marketInfluence || 0}
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <span className="text-blue-400">{economics.marketInfluence?.toFixed(1) || '0.0'}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Political Power</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-400 progress-bar-fill"
                          data-width={Math.min(politicalInfluence * 10, 100)}
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <span className="text-purple-400">{politicalInfluence.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Events</span>
                    <span className="text-orange-400">{economics.activeEvents?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Business Performance */}
              <div className="bg-gray-700 rounded-lg p-4 dashboard-card">
                <h3 className="text-lg font-semibold text-white mb-3">Business Performance</h3>
                <div className="space-y-3">
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cluster Bonuses</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 progress-bar-fill"
                          data-width={economics.clusterBonuses ? ((economics.clusterBonuses.totalBonus - 1) * 100) : 0}
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <span className="text-yellow-400">
                        {economics.clusterBonuses ? `${((economics.clusterBonuses.totalBonus - 1) * 100).toFixed(1)}%` : '0%'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Supply Chain Health</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 progress-bar-fill"
                          data-width={businesses.length > 0
                            ? (businesses.reduce((sum, b) => sum + (b.supplyChainHealth || 1), 0) / businesses.length * 100)
                            : 0
                          }
                          style={{ width: '0%' }}
                        ></div>
                      </div>
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
            </div>

            {/* Animated Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Business Income Chart */}
              <div className="bg-gray-700 rounded-lg p-4 dashboard-card">
                <h3 className="text-lg font-semibold text-white mb-3">Business Income Distribution</h3>
                <div className="h-32 flex items-end justify-center space-x-2">
                  {chartData.businessPerformance.slice(0, 6).map((business, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="chart-bar bg-gradient-to-t from-green-600 to-green-400 w-8 rounded-t"
                        data-height={Math.max((business.income / 1000) * 2, 10)}
                        style={{ height: '0px' }}
                      ></div>
                      <span className="text-xs text-gray-400 mt-1 truncate w-8 text-center">
                        {business.name?.slice(0, 3) || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economic Trends Chart */}
              <div className="bg-gray-700 rounded-lg p-4 dashboard-card">
                <h3 className="text-lg font-semibold text-white mb-3">Economic Trends (12 Months)</h3>
                <div className="h-32 relative">
                  <svg className="w-full h-full" viewBox="0 0 300 100">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                      <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#374151" strokeWidth="0.5" />
                    ))}

                    {/* Trend line */}
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      points={chartData.economicTrends.map((point, index) =>
                        `${(index * 25)},${100 - (point.gdp - 90) * 2}`
                      ).join(' ')}
                    />

                    {/* Data points */}
                    {chartData.economicTrends.map((point, index) => (
                      <circle
                        key={index}
                        className="chart-line-point"
                        cx={index * 25}
                        cy={100 - (point.gdp - 90) * 2}
                        r="3"
                        fill="#10B981"
                        style={{ transform: 'scale(0)' }}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Inflation History Mini Chart */}
            <div className="bg-gray-700 rounded-lg p-4 dashboard-card">
              <h3 className="text-lg font-semibold text-white mb-3">Inflation Rate History (30 Days)</h3>
              <div className="h-16 flex items-end space-x-1">
                {chartData.inflationHistory.map((day, index) => (
                  <div
                    key={index}
                    className="chart-bar bg-gradient-to-t from-red-600 to-red-400 flex-1 rounded-t"
                    data-height={day.rate * 8}
                    style={{ height: '0px' }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-700 rounded-lg p-4 dashboard-card">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    processMonthlyEconomics();
                    // Trigger refresh animation
                    safeAnime({
                      targets: '.dashboard-card',
                      scale: [1, 1.02, 1],
                      duration: 300,
                      easing: 'easeInOutQuad'
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                >
                  📈 Process Economics
                </button>
                <button
                  onClick={() => {
                    checkAndAwardAchievements();
                    // Trigger celebration animation
                    safeAnime({
                      targets: '.wealth-counter',
                      scale: [1, 1.2, 1],
                      color: ['#10B981', '#F59E0B', '#10B981'],
                      duration: 600,
                      easing: 'easeInOutBack'
                    });
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                >
                  🏆 Check Achievements
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'events' && (
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4 dashboard-card">
              <h3 className="text-lg font-semibold text-white mb-3">Active Economic Events</h3>
              {economics.activeEvents && economics.activeEvents.length > 0 ? (
                <div className="space-y-2">
                  {economics.activeEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-600 rounded-lg p-3 border-l-4 border-red-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{event.name}</h4>
                          <p className="text-gray-400 text-sm">{event.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                            Active
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-gray-400">No active economic events</p>
                  <p className="text-gray-500 text-sm mt-2">Your economy is stable!</p>
                </motion.div>
              )}
            </div>

            <div className="bg-gray-700 rounded-lg p-4 dashboard-card">
              <h3 className="text-lg font-semibold text-white mb-3">Trigger Events (Dev Mode)</h3>
              <div className="grid grid-cols-1 gap-2">
                {economicEvents.map((event, index) => (
                  <motion.button
                    key={event.id}
                    onClick={() => {
                      triggerEconomicEvent(event.id);
                      // Trigger warning animation
                      safeAnime({
                        targets: '.dashboard-card',
                        backgroundColor: ['#374151', '#DC2626', '#374151'],
                        duration: 500,
                        easing: 'easeInOutQuad'
                      });
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm text-left transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{event.name}</div>
                        <div className="text-xs opacity-75">{event.description}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${event.risk === 'High' ? 'bg-red-800' :
                          event.risk === 'Medium' ? 'bg-yellow-800' : 'bg-green-800'
                          }`}>
                          {event.risk}
                        </span>
                        <div className="text-lg">⚠️</div>
                      </div>
                    </div>
                  </motion.button>
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
                    className={`px-4 py-2 rounded-lg text-sm ${dailyReward > 0
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
                    onClick={() => {
                      // Placeholder for governance rewards - function doesn't exist yet
                      alert('Governance rewards feature coming soon!');
                    }}
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
