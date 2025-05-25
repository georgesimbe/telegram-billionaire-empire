import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { INDUSTRIES_CONFIG, calculateBusinessCost, calculateBusinessIncome, getUnlockedBusinesses } from '../config/industriesConfig';
import { formatNumber } from '../utils/formatters';
import UpgradeModal from '../components/UpgradeModal';

const BusinessPage = () => {
  const player = useGameStore(state => state.player);
  const businesses = useGameStore(state => state.businesses);
  const buyBusiness = useGameStore(state => state.buyBusiness);
  const logAction = useGameStore(state => state.logAction);

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
    setShowUpgradeModal(true);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Business Empire</h1>
        
        <div className="grid gap-4">
          {unlockedBusinesses.map((business) => {
            const currentBusinessLevel = businesses[business.id] || 0;
            const cost = calculateBusinessCost(business, currentBusinessLevel);
            const income = calculateBusinessIncome(business, currentBusinessLevel);
            const affordable = player.points >= cost;

            return (
              <motion.div
                key={business.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBusinessClick(business)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{business.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{business.name}</h3>
                      <p className="text-gray-400 text-sm">{business.description}</p>
                      <p className="text-xs text-gray-500">Sector: {business.sector}</p>
                      {currentBusinessLevel > 0 && (
                        <p className="text-green-400 text-sm">
                          Level {currentBusinessLevel} • Income: {formatNumber(income)}/hr
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-400">
                      {formatNumber(cost)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {currentBusinessLevel === 0 ? 'Buy' : 'Upgrade'}
                    </p>
                    {!affordable && (
                      <p className="text-xs text-red-400">Not enough points</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {unlockedBusinesses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No businesses available at your level.</p>
            <p className="text-sm text-gray-500">Level up to unlock more businesses!</p>
          </div>
        )}

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => {
            setShowUpgradeModal(false);
            setSelectedBusiness(null);
          }}
          business={selectedBusiness}
          currentLevel={currentLevel}
          upgradeCost={upgradeCost}
          onUpgrade={handleUpgrade}
          canAfford={canAfford}
        />
      </div>
    </div>
  );
};

export default BusinessPage;