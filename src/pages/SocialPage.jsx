import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HOUSING_TYPES,
  getAvailableHousing,
  calculateMortgagePayment,
  getHousingBonuses
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
  const [playerStats, setPlayerStats] = useState({
    cash: 25000,
    monthlyIncome: 4500,
    creditScore: 720,
    happiness: 75,
    health: 80,
    energy: 70,
    currentHousing: 'studio_apartment',
    bankAccounts: ['checking', 'savings'],
    loans: [],
    creditCards: [],
    relationships: [
      { id: 1, name: 'Sarah Johnson', type: 'family', points: 75, lastInteraction: new Date() },
      { id: 2, name: 'Mike Chen', type: 'friends', points: 60, lastInteraction: new Date() },
      { id: 3, name: 'Emma Davis', type: 'romantic', points: 85, lastInteraction: new Date() }
    ]
  });

  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Life Overview', icon: '🏠' },
    { id: 'housing', label: 'Housing', icon: '🏡' },
    { id: 'banking', label: 'Banking', icon: '🏦' },
    { id: 'relationships', label: 'Relationships', icon: '👥' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '✨' }
  ];

  const currentHousing = HOUSING_TYPES[playerStats.currentHousing.toUpperCase()];
  const housingBonuses = getHousingBonuses(currentHousing);
  const relationshipEffects = calculateRelationshipEffects(playerStats.relationships);
  const creditScoreRange = getCreditScoreRange(playerStats.creditScore);

  const handleHousingUpgrade = (housingType) => {
    const housing = HOUSING_TYPES[housingType.toUpperCase()];
    if (playerStats.cash >= housing.downPayment &&
      playerStats.monthlyIncome >= housing.requirements.income &&
      playerStats.creditScore >= housing.requirements.creditScore) {

      setPlayerStats(prev => ({
        ...prev,
        cash: prev.cash - housing.downPayment,
        currentHousing: housingType
      }));
      setShowModal(null);
    }
  };

  const handleLoanApplication = (loanType) => {
    const loan = LOAN_TYPES[loanType.toUpperCase()];
    if (playerStats.creditScore >= loan.requirements.creditScore &&
      playerStats.monthlyIncome >= loan.requirements.income) {

      const loanAmount = selectedItem?.amount || loan.minAmount;
      const monthlyPayment = calculateLoanPayment(loanAmount, loan.baseInterestRate, loan.termMonths[0]);

      const newLoan = {
        id: Date.now(),
        type: loanType,
        amount: loanAmount,
        monthlyPayment,
        remainingBalance: loanAmount,
        interestRate: loan.baseInterestRate,
        termMonths: loan.termMonths[0]
      };

      setPlayerStats(prev => ({
        ...prev,
        cash: prev.cash + loanAmount,
        loans: [...prev.loans, newLoan]
      }));
      setShowModal(null);
    }
  };

  const handleSocialActivity = (activity, relationshipId) => {
    const relationship = playerStats.relationships.find(r => r.id === relationshipId);
    if (relationship && playerStats.cash >= activity.cost) {
      setPlayerStats(prev => ({
        ...prev,
        cash: prev.cash - activity.cost,
        happiness: Math.min(100, prev.happiness + activity.happinessGain),
        energy: Math.max(0, prev.energy - activity.energyCost),
        relationships: prev.relationships.map(r =>
          r.id === relationshipId
            ? { ...r, points: Math.min(100, r.points + activity.relationshipGain), lastInteraction: new Date() }
            : r
        )
      }));
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
            <p className="text-lg font-bold text-green-400">${formatNumber(playerStats.cash)}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Monthly Income</p>
            <p className="text-lg font-bold text-blue-400">${formatNumber(playerStats.monthlyIncome)}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Credit Score</p>
            <p className={`text-lg font-bold`} style={{ color: creditScoreRange.color }}>
              {playerStats.creditScore}
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Happiness</p>
            <p className="text-lg font-bold text-yellow-400">{playerStats.happiness}%</p>
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
            <p className="text-sm text-green-400">${formatNumber(currentHousing.monthlyCost)}/month</p>
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
          {playerStats.relationships.slice(0, 3).map(relationship => {
            const level = getRelationshipLevel(relationship.points);
            const type = RELATIONSHIP_TYPES[relationship.type.toUpperCase()];
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
                  <p className="text-sm font-medium" style={{ color: level.color }}>
                    {level.name}
                  </p>
                  <p className="text-xs text-gray-500">{relationship.points}/100</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Budget */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Monthly Budget</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Income</span>
            <span className="text-green-400">+${formatNumber(playerStats.monthlyIncome)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Housing</span>
            <span className="text-red-400">-${formatNumber(currentHousing.monthlyCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Loan Payments</span>
            <span className="text-red-400">
              -${formatNumber(playerStats.loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Relationship Expenses</span>
            <span className="text-red-400">-${formatNumber(relationshipEffects.monthlyExpenses || 0)}</span>
          </div>
          <hr className="border-gray-600" />
          <div className="flex justify-between font-bold">
            <span className="text-white">Net Income</span>
            <span className={`${playerStats.monthlyIncome - currentHousing.monthlyCost -
                playerStats.loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0) -
                (relationshipEffects.monthlyExpenses || 0) > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
              ${formatNumber(
                playerStats.monthlyIncome - currentHousing.monthlyCost -
                playerStats.loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0) -
                (relationshipEffects.monthlyExpenses || 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const HousingTab = () => {
    const availableHousing = getAvailableHousing(playerStats.monthlyIncome, playerStats.creditScore);

    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Available Housing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(HOUSING_TYPES).map(([key, housing]) => {
              const isAvailable = availableHousing.some(h => h.id === housing.id);
              const isCurrent = key.toLowerCase() === playerStats.currentHousing;

              return (
                <motion.div
                  key={key}
                  className={`bg-gray-700/50 rounded-xl p-4 border ${isCurrent ? 'border-green-500' :
                      isAvailable ? 'border-gray-600 hover:border-blue-500' :
                        'border-gray-700 opacity-50'
                    } transition-colors cursor-pointer`}
                  whileHover={isAvailable ? { scale: 1.02 } : {}}
                  onClick={() => isAvailable && !isCurrent && setShowModal({ type: 'housing', item: housing })}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{housing.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{housing.name}</h4>
                        {isCurrent && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Current</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">${formatNumber(housing.monthlyCost)}/mo</p>
                      <p className="text-xs text-gray-500">Down: ${formatNumber(housing.downPayment)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{housing.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded">
                        +{housing.happiness} Happiness
                      </span>
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded">
                        +{housing.health} Health
                      </span>
                    </div>

                    {isAvailable && !isCurrent && (
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowModal({ type: 'housing', item: housing });
                        }}
                      >
                        {housing.canBuy ? 'Buy' : 'Rent'}
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
    const availableLoans = getAvailableLoans(playerStats.creditScore, playerStats.monthlyIncome);

    return (
      <div className="space-y-6">
        {/* Credit Score */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Credit Profile</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold" style={{ color: creditScoreRange.color }}>
                {playerStats.creditScore}
              </p>
              <p className="text-sm text-gray-400">{creditScoreRange.name}</p>
            </div>
            <div className="w-48 bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((playerStats.creditScore - 300) / 550) * 100}%`,
                  backgroundColor: creditScoreRange.color
                }}
              />
            </div>
          </div>
        </div>

        {/* Current Loans */}
        {playerStats.loans.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Current Loans</h3>
            <div className="space-y-3">
              {playerStats.loans.map(loan => (
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
          {playerStats.relationships.map(relationship => {
            const level = getRelationshipLevel(relationship.points);
            const type = RELATIONSHIP_TYPES[relationship.type.toUpperCase()];
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
                      disabled={playerStats.cash < activity.cost}
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

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Life Management</h1>
        <p className="text-gray-400">Manage your housing, finances, relationships, and lifestyle</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

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
                      <span className="text-white">${formatNumber(showModal.item.monthlyCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Down Payment:</span>
                      <span className="text-white">${formatNumber(showModal.item.downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Cash:</span>
                      <span className={playerStats.cash >= showModal.item.downPayment ? 'text-green-400' : 'text-red-400'}>
                        ${formatNumber(playerStats.cash)}
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
                      disabled={playerStats.cash < showModal.item.downPayment}
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
    </div>
  );
};

export default SocialPage;