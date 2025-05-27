import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIntegratedGameStore from '../store/integratedGameStore';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TabNavigation from '../components/ui/TabNavigation';
import {
  HOUSING_TYPES,
  getAvailableHousing,
  calculateMortgagePayment,
  getHousingEffects
} from '../config/housingConfig';
import {
  ACCOUNT_TYPES,
  LOAN_TYPES,
  CREDIT_CARDS,
  getCreditScoreRange,
  getAvailableLoans,
  calculateLoanPayment
} from '../config/bankingConfig';
import {
  RELATIONSHIP_TYPES,
  SOCIAL_ACTIVITIES,
  getRelationshipLevel,
  calculateRelationshipEffects
} from '../config/relationshipsConfig';
import { formatNumber } from '../utils/formatters';
import AnimatedButton from '../components/AnimatedButton';

const SocialPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Get state from integrated store
  const player = useIntegratedGameStore(state => state.player);
  const housing = useIntegratedGameStore(state => state.housing);
  const banking = useIntegratedGameStore(state => state.banking);
  const relationships = useIntegratedGameStore(state => state.relationships);
  const career = useIntegratedGameStore(state => state.career);

  // Get actions from integrated store
  const updatePlayer = useIntegratedGameStore(state => state.updatePlayer);
  const updateHousing = useIntegratedGameStore(state => state.updateHousing);
  const addBankAccount = useIntegratedGameStore(state => state.addBankAccount);
  const addLoan = useIntegratedGameStore(state => state.addLoan);
  const addCreditCard = useIntegratedGameStore(state => state.addCreditCard);
  const addRelationship = useIntegratedGameStore(state => state.addRelationship);
  const updateRelationship = useIntegratedGameStore(state => state.updateRelationship);
  const spendCash = useIntegratedGameStore(state => state.spendCash);
  const addIncome = useIntegratedGameStore(state => state.addIncome);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const tabs = [
    { id: 'overview', label: 'Life Overview', icon: '🏠' },
    { id: 'housing', label: 'Housing', icon: '🏡' },
    { id: 'banking', label: 'Banking', icon: '🏦' },
    { id: 'relationships', label: 'Relationships', icon: '👥' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '✨' }
  ];

  const currentHousing = HOUSING_TYPES[housing.currentHousing?.toLowerCase()] || HOUSING_TYPES.homeless;
  const housingBonuses = getHousingEffects(currentHousing);
  const relationshipEffects = calculateRelationshipEffects(relationships?.connections || []);
  const creditScoreRange = getCreditScoreRange(player.creditScore);

  const handleHousingUpgrade = (housingType) => {
    const housingConfig = HOUSING_TYPES[housingType.toLowerCase()];
    if (!housingConfig) {
      showNotification('Invalid housing type selected', 'error');
      return;
    }

    if (player.cash >= housingConfig.downPayment &&
      player.monthlyIncome >= housingConfig.requirements.income &&
      player.creditScore >= housingConfig.requirements.creditScore) {

      spendCash(housingConfig.downPayment, 'housing_purchase');
      updateHousing({
        currentHousing: housingType,
        monthlyHousingCost: housingConfig.monthlyMaintenance,
        ownedProperties: [...(housing.ownedProperties || []), {
          type: housingType,
          purchaseDate: new Date(),
          value: housingConfig.downPayment * 2
        }]
      });

      showNotification(`Successfully purchased ${housingConfig.name}!`, 'success');
      setShowModal(null);
    } else {
      showNotification('You don\'t meet the requirements for this housing', 'error');
    }
  };

  const handleLoanApplication = (loanType) => {
    const loan = LOAN_TYPES[loanType.toUpperCase()];
    if (!loan) {
      showNotification('Invalid loan type selected', 'error');
      return;
    }

    if (player.creditScore >= loan.requirements.creditScore &&
      player.monthlyIncome >= loan.requirements.income) {

      const loanAmount = selectedItem?.amount || loan.minAmount;
      const monthlyPayment = calculateLoanPayment(loanAmount, loan.baseInterestRate, loan.termMonths[0]);

      const newLoan = {
        id: Date.now(),
        type: loanType,
        amount: loanAmount,
        monthlyPayment,
        remainingBalance: loanAmount,
        interestRate: loan.baseInterestRate,
        termMonths: loan.termMonths[0],
        startDate: new Date()
      };

      addLoan(newLoan);
      addIncome(loanAmount, 'loan');
      showNotification(`Loan approved! $${formatNumber(loanAmount)} added to your account`, 'success');
      setShowModal(null);
    } else {
      showNotification('Loan application denied. Improve your credit score or income.', 'error');
    }
  };

  const handleSocialActivity = (activity, relationshipId) => {
    const relationship = (relationships?.connections || []).find(r => r.id === relationshipId);
    if (!relationship) {
      showNotification('Relationship not found', 'error');
      return;
    }

    if (player.cash >= activity.cost) {
      spendCash(activity.cost, 'social_activity');

      updatePlayer({
        happiness: Math.min(100, player.happiness + activity.happinessGain),
        energy: Math.max(0, player.energy - activity.energyCost)
      });

      updateRelationship(relationshipId, {
        points: Math.min(100, relationship.points + activity.relationshipGain),
        lastInteraction: new Date()
      });

      showNotification(`Had a great time with ${relationship.name}!`, 'success');
    } else {
      showNotification('Not enough money for this activity', 'error');
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Life Stats */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Life Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Net Worth</p>
            <p className="text-lg font-bold text-green-400">${formatNumber(player.cash)}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Monthly Income</p>
            <p className="text-lg font-bold text-blue-400">${formatNumber(player.monthlyIncome)}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Credit Score</p>
            <p className={`text-lg font-bold ${creditScoreRange.color}`}>
              {player.creditScore}
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Happiness</p>
            <p className="text-lg font-bold text-yellow-400">{player.happiness}%</p>
          </div>
        </div>
      </div>

      {/* Current Housing */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Current Housing</h3>
          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('housing')}
          >
            Manage Housing
          </AnimatedButton>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-3xl">{currentHousing.icon}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-white">{currentHousing.name}</h4>
            <p className="text-sm text-gray-400">{currentHousing.description}</p>
            <p className="text-sm text-green-400">${formatNumber(currentHousing.monthlyMaintenance)}/month</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Happiness Bonus</p>
            <p className="font-bold text-yellow-400">+{housingBonuses.happiness}</p>
          </div>
        </div>
      </div>

      {/* Relationships Summary */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Relationships</h3>
          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('relationships')}
          >
            Manage Relationships
          </AnimatedButton>
        </div>
        <div className="space-y-3">
          {(relationships?.connections || []).slice(0, 3).map(relationship => {
            const level = getRelationshipLevel(relationship.points);
            const type = RELATIONSHIP_TYPES[relationship.type?.toUpperCase()] || RELATIONSHIP_TYPES.FRIENDS;
            return (
              <div key={relationship.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{type.icon}</span>
                  <div>
                    <p className="font-medium text-white">{relationship.name}</p>
                    <p className="text-sm text-gray-400">{type.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${level.color}`}>
                    {level.name}
                  </p>
                  <p className="text-xs text-gray-400">{relationship.points}/100</p>
                </div>
              </div>
            );
          })}
          {(relationships?.connections || []).length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400">No relationships yet</p>
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('relationships')}
                className="mt-2"
              >
                Meet People
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Financial Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Bank Accounts</span>
            <span className="text-white">{banking.accounts?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Active Loans</span>
            <span className="text-white">{banking.loans?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Credit Cards</span>
            <span className="text-white">{banking.creditCards?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Monthly Debt Payments</span>
            <span className="text-red-400">${formatNumber(banking.monthlyDebtPayments || 0)}</span>
          </div>
        </div>
        <AnimatedButton
          variant="secondary"
          size="sm"
          onClick={() => setActiveTab('banking')}
          className="w-full mt-4"
        >
          Manage Banking
        </AnimatedButton>
      </div>
    </div>
  );

  const HousingTab = () => {
    const availableHousing = getAvailableHousing(player.monthlyIncome, player.creditScore);

    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Available Housing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(HOUSING_TYPES).map(([key, housingType]) => {
              const isAvailable = availableHousing.some(h => h.id === housingType.id);
              const isCurrent = key.toLowerCase() === housing.currentHousing?.toLowerCase();

              return (
                <motion.div
                  key={key}
                  className={`bg-gray-700/50 rounded-xl p-4 border ${isCurrent ? 'border-green-500' :
                    isAvailable ? 'border-gray-600 hover:border-blue-500' :
                      'border-gray-700 opacity-50'
                    } transition-colors cursor-pointer`}
                  whileHover={isAvailable ? { scale: 1.02 } : {}}
                  onClick={() => isAvailable && !isCurrent && setShowModal({ type: 'housing', item: housingType })}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{housingType.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{housingType.name}</h4>
                        {isCurrent && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Current</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">${formatNumber(housingType.monthlyMaintenance)}/mo</p>
                      <p className="text-xs text-gray-500">Down: ${formatNumber(housingType.downPayment)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{housingType.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded">
                        +{housingType.happiness} Happiness
                      </span>
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded">
                        +{housingType.health} Health
                      </span>
                    </div>

                    {isAvailable && !isCurrent && (
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowModal({ type: 'housing', item: housingType });
                        }}
                      >
                        {housingType.canBuy ? 'Buy' : 'Rent'}
                      </AnimatedButton>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const BankingTab = () => {
    const availableLoans = getAvailableLoans(player.creditScore, player.monthlyIncome);

    return (
      <div className="space-y-6">
        {/* Credit Score */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Credit Profile</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold" style={{ color: creditScoreRange.color }}>
                {player.creditScore}
              </p>
              <p className="text-sm text-gray-400">{creditScoreRange.name}</p>
            </div>
            <div className="w-48 bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((player.creditScore - 300) / 550) * 100}%`,
                  backgroundColor: creditScoreRange.color
                }}
              />
            </div>
          </div>
        </div>

        {/* Current Loans */}
        {banking.loans?.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Current Loans</h3>
            <div className="space-y-3">
              {banking.loans.map(loan => (
                <div key={loan.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{LOAN_TYPES[loan.type.toUpperCase()].name}</h4>
                    <p className="text-red-400">${formatNumber(loan.monthlyPayment)}/mo</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Remaining: ${formatNumber(loan.remainingBalance)}</span>
                    <span className="text-gray-400">{loan.interestRate * 100}% APR</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Loans */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Available Loans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableLoans.map(loan => (
              <motion.div
                key={loan.id}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowModal({ type: 'loan', item: loan })}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{loan.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{loan.name}</h4>
                    <p className="text-sm text-gray-400">{loan.baseInterestRate * 100}% APR</p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3">{loan.description}</p>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">${formatNumber(loan.minAmount)} - ${formatNumber(loan.maxAmount)}</span>
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal({ type: 'loan', item: loan });
                    }}
                  >
                    Apply
                  </AnimatedButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RelationshipsTab = () => (
    <div className="space-y-6">
      {/* Relationship Effects */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Relationship Benefits</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Happiness Bonus</p>
            <p className="text-lg font-bold text-yellow-400">+{relationshipEffects.happiness}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Support Network</p>
            <p className="text-lg font-bold text-blue-400">+{relationshipEffects.support}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Career Bonus</p>
            <p className="text-lg font-bold text-green-400">+{relationshipEffects.careerBonus}%</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Monthly Expenses</p>
            <p className="text-lg font-bold text-red-400">${formatNumber(relationshipEffects.monthlyExpenses || 0)}</p>
          </div>
        </div>
      </div>

      {/* Current Relationships */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Your Relationships</h3>
        <div className="space-y-4">
          {(relationships?.connections || []).map(relationship => {
            const level = getRelationshipLevel(relationship.points);
            const type = RELATIONSHIP_TYPES[relationship.type?.toUpperCase()] || RELATIONSHIP_TYPES.FRIENDS;
            const availableActivities = Object.values(SOCIAL_ACTIVITIES).filter(activity =>
              activity.applicableTypes.includes(relationship.type)
            );

            return (
              <div key={relationship.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{relationship.name}</h4>
                      <p className="text-sm text-gray-400">{type.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium" style={{ color: level.color }}>
                      {level.name}
                    </p>
                    <p className="text-xs text-gray-500">{relationship.points}/100</p>
                  </div>
                </div>

                <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${relationship.points}%`,
                      backgroundColor: level.color
                    }}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {availableActivities.slice(0, 3).map(activity => (
                    <AnimatedButton
                      key={activity.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSocialActivity(activity, relationship.id)}
                      disabled={player.cash < activity.cost}
                    >
                      {activity.icon} {activity.name} (${activity.cost})
                    </AnimatedButton>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const LifestyleTab = () => (
    <div className="space-y-6">
      {/* Lifestyle Overview */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Lifestyle Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Happiness</p>
            <p className="text-lg font-bold text-yellow-400">{player.happiness}%</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Health</p>
            <p className="text-lg font-bold text-green-400">{player.health || 80}%</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Energy</p>
            <p className="text-lg font-bold text-blue-400">{player.energy || 70}%</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Stress</p>
            <p className="text-lg font-bold text-red-400">{player.stress || 30}%</p>
          </div>
        </div>
      </div>

      {/* Lifestyle Activities */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Lifestyle Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-green-500 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (player.cash >= 100) {
                spendCash(100, 'gym_membership');
                updatePlayer({
                  health: Math.min(100, (player.health || 80) + 5),
                  happiness: Math.min(100, player.happiness + 2)
                });
                showNotification('Great workout! Health and happiness increased.', 'success');
              } else {
                showNotification('Not enough money for gym membership', 'error');
              }
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏋️</span>
              <div>
                <h4 className="font-semibold text-white">Gym Membership</h4>
                <p className="text-sm text-gray-400">$100 - Improve health and happiness</p>
              </div>
            </div>
            <AnimatedButton
              variant="success"
              size="sm"
              disabled={player.cash < 100}
              className="w-full"
            >
              Work Out (+5 Health, +2 Happiness)
            </AnimatedButton>
          </motion.div>

          <motion.div
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (player.cash >= 200) {
                spendCash(200, 'spa_day');
                updatePlayer({
                  stress: Math.max(0, (player.stress || 30) - 10),
                  happiness: Math.min(100, player.happiness + 8)
                });
                showNotification('Relaxing spa day! Stress reduced and happiness increased.', 'success');
              } else {
                showNotification('Not enough money for spa day', 'error');
              }
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🧘</span>
              <div>
                <h4 className="font-semibold text-white">Spa Day</h4>
                <p className="text-sm text-gray-400">$200 - Reduce stress and boost happiness</p>
              </div>
            </div>
            <AnimatedButton
              variant="primary"
              size="sm"
              disabled={player.cash < 200}
              className="w-full"
            >
              Relax (-10 Stress, +8 Happiness)
            </AnimatedButton>
          </motion.div>

          <motion.div
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-purple-500 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (player.cash >= 150) {
                spendCash(150, 'education');
                updatePlayer({
                  experience: (player.experience || 0) + 50,
                  happiness: Math.min(100, player.happiness + 3)
                });
                showNotification('Learning new skills! Experience and happiness increased.', 'success');
              } else {
                showNotification('Not enough money for education', 'error');
              }
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📚</span>
              <div>
                <h4 className="font-semibold text-white">Education</h4>
                <p className="text-sm text-gray-400">$150 - Gain experience and knowledge</p>
              </div>
            </div>
            <AnimatedButton
              variant="secondary"
              size="sm"
              disabled={player.cash < 150}
              className="w-full"
            >
              Study (+50 XP, +3 Happiness)
            </AnimatedButton>
          </motion.div>

          <motion.div
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-yellow-500 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (player.cash >= 300) {
                spendCash(300, 'vacation');
                updatePlayer({
                  happiness: Math.min(100, player.happiness + 15),
                  stress: Math.max(0, (player.stress || 30) - 15),
                  energy: Math.min(100, (player.energy || 70) + 10)
                });
                showNotification('Amazing vacation! All stats improved significantly.', 'success');
              } else {
                showNotification('Not enough money for vacation', 'error');
              }
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏖️</span>
              <div>
                <h4 className="font-semibold text-white">Vacation</h4>
                <p className="text-sm text-gray-400">$300 - Ultimate relaxation and happiness</p>
              </div>
            </div>
            <AnimatedButton
              variant="warning"
              size="sm"
              disabled={player.cash < 300}
              className="w-full"
            >
              Take Vacation (+15 Happiness, -15 Stress, +10 Energy)
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto pb-20">
      <PageHeader
        title="Life Management"
        subtitle="Manage your housing, finances, relationships, and lifestyle"
        showCash={true}
        cash={player.cash}
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
        className="mb-6"
      />

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'housing' && <HousingTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'relationships' && <RelationshipsTab />}
          {activeTab === 'lifestyle' && <LifestyleTab />}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
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
              {showModal.type === 'housing' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {showModal.item.canBuy ? 'Purchase' : 'Rent'} {showModal.item.name}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Cost:</span>
                      <span className="text-white">${formatNumber(showModal.item.monthlyMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Down Payment:</span>
                      <span className="text-white">${formatNumber(showModal.item.downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Cash:</span>
                      <span className={player.cash >= showModal.item.downPayment ? 'text-green-400' : 'text-red-400'}>
                        ${formatNumber(player.cash)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AnimatedButton
                      variant="secondary"
                      size="md"
                      onClick={() => setShowModal(null)}
                      className="flex-1"
                    >
                      Cancel
                    </AnimatedButton>
                    <AnimatedButton
                      variant="primary"
                      size="md"
                      onClick={() => handleHousingUpgrade(showModal.item.id)}
                      disabled={player.cash < showModal.item.downPayment}
                      className="flex-1"
                    >
                      Confirm
                    </AnimatedButton>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default SocialPage;