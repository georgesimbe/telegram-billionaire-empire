import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useIntegratedGameStore from '../store/integratedGameStore';
import { formatNumber } from '../utils/formatters';

const BusinessCard = ({ business, isOwned = false, onBuy, onClaim, onScrap, onUpgrade }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { player } = useIntegratedGameStore();

  const canAfford = player.cash >= business.cost;
  const canClaim = isOwned && business.lastClaim 
    ? (Date.now() - business.lastClaim) >= (business.cooldown * 1000)
    : isOwned;

  const progress = isOwned && business.lastClaim 
    ? Math.min((Date.now() - business.lastClaim) / (business.cooldown * 1000), 1) * 100 
    : 0;

  const getSectorColor = (sector) => {
    const colors = {
      agriculture: 'bg-green-500',
      mining: 'bg-yellow-600',
      utilities: 'bg-blue-500',
      construction: 'bg-orange-500',
      manufacturing: 'bg-purple-500',
      wholesale: 'bg-indigo-500',
      retail: 'bg-pink-500',
      transportation: 'bg-red-500',
      information: 'bg-cyan-500',
      finance: 'bg-emerald-500',
      real_estate: 'bg-teal-500',
      professional: 'bg-violet-500',
      healthcare: 'bg-rose-500',
      arts: 'bg-fuchsia-500',
      accommodation: 'bg-amber-500',
      other: 'bg-gray-500'
    };
    return colors[sector] || 'bg-gray-500';
  };

  const formatSector = (sector) => {
    return sector.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getSectorColor(business.sector)}`} />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{business.name}</h3>
              <p className="text-sm text-gray-500">{formatSector(business.sector)}</p>
            </div>
          </div>
          {isOwned && (
            <div className="text-right">
              <span className="text-sm font-medium text-blue-600">Level {business.level}</span>
              <p className="text-xs text-gray-500">Max: {business.maxLevel}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">{business.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Cost</p>
            <p className="text-lg font-bold text-gray-900">${formatNumber(business.cost)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-lg font-bold text-green-600">
              ${formatNumber(business.baseRevenue * (isOwned ? business.level : 1))}
            </p>
          </div>
        </div>

        {/* Requirements */}
        {(business.unlockLevel > 1 || business.requiredSociety) && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Requirements:</p>
            <div className="flex flex-wrap gap-2">
              {business.unlockLevel > 1 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  player.level >= business.unlockLevel 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Level {business.unlockLevel}
                </span>
              )}
              {business.requiredSociety && (
                <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  {business.requiredSociety} Society
                </span>
              )}
            </div>
          </div>
        )}

        {/* Materials (expandable) */}
        {business.materials && business.materials.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {isExpanded ? 'Hide' : 'Show'} Materials ({business.materials.length})
            </button>
            
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2"
              >
                <div className="grid grid-cols-2 gap-1">
                  {business.materials.map((material, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {material.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Progress bar for owned businesses */}
        {isOwned && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Revenue Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Total earned for owned businesses */}
        {isOwned && business.totalEarned > 0 && (
          <div className="mb-4 text-center">
            <p className="text-xs text-gray-500">Total Earned</p>
            <p className="text-lg font-bold text-green-600">${formatNumber(business.totalEarned)}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-50 px-4 py-3">
        {!isOwned ? (
          <button
            onClick={() => onBuy(business.id)}
            disabled={!canAfford || player.level < (business.unlockLevel || 1)}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              canAfford && player.level >= (business.unlockLevel || 1)
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!canAfford ? 'Insufficient Funds' : 
             player.level < (business.unlockLevel || 1) ? 'Level Required' : 
             'Buy Business'}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => onClaim(business.id)}
                disabled={!canClaim}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  canClaim
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canClaim ? `Claim $${formatNumber(business.baseRevenue * business.level)}` : 'Cooling Down'}
              </button>
              
              {business.level < business.maxLevel && (
                <button
                  onClick={() => onUpgrade(business.id)}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  ⬆️
                </button>
              )}
            </div>
            
            <button
              onClick={() => onScrap(business.id)}
              className="w-full py-1 px-4 rounded-lg text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              Scrap ({business.level <= 2 ? '100%' : '75%'} refund)
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BusinessCard;