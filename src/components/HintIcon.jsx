import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionMarkCircleIcon, InformationCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';

// Game hints database
export const GAME_HINTS = {
  BUSINESS_ROI: {
    title: "Business ROI",
    hint: "Return on Investment (ROI) decreases as you level up businesses. Early game businesses provide 15% daily returns, while late game focuses on 4% daily returns with passive income from staking.",
    type: "tip",
    wikiLink: "/wiki/business-mechanics"
  },
  BUSINESS_UPGRADE: {
    title: "Business Upgrades",
    hint: "Upgrading businesses increases their income but costs more each level. Focus on supply chain synergies for maximum efficiency bonuses.",
    type: "info",
    wikiLink: "/wiki/business-upgrades"
  },
  SUPPLY_CHAIN: {
    title: "Supply Chain",
    hint: "Owning supplier businesses gives you 15-25% income bonuses. Build vertical integration by purchasing businesses that supply each other.",
    type: "tip",
    wikiLink: "/wiki/supply-chain"
  },
  STAKING_POOLS: {
    title: "Staking Pools",
    hint: "Different pools offer different APY rates and lock periods. Higher APY usually means longer lock periods. Your voting power increases with tenure.",
    type: "info",
    wikiLink: "/wiki/staking-system"
  },
  ECONOMIC_CLASSES: {
    title: "Economic Classes",
    hint: "Your economic class affects your influence in governance. Progress from Working Class to Ultra Rich by accumulating wealth and assets.",
    type: "info",
    wikiLink: "/wiki/economic-classes"
  },
  GOVERNANCE_VOTING: {
    title: "Governance Voting",
    hint: "Your voting power is based on your staked amount plus tenure bonuses. Participate in governance to shape the game's economic policies.",
    type: "tip",
    wikiLink: "/wiki/governance"
  },
  CAREER_PROGRESSION: {
    title: "Career Progression",
    hint: "Education unlocks better jobs with higher salaries. Invest in education early for long-term income benefits.",
    type: "tip",
    wikiLink: "/wiki/career-system"
  },
  HOUSING_SYSTEM: {
    title: "Housing System",
    hint: "Better housing improves your happiness and unlocks new opportunities. Progress from homeless to space stations!",
    type: "info",
    wikiLink: "/wiki/housing"
  },
  INFLATION_PROTECTION: {
    title: "Inflation Protection",
    hint: "Stakers get 50% protection from inflation, while non-stakers face full impact. Stake your tokens to preserve purchasing power.",
    type: "tip",
    wikiLink: "/wiki/economic-simulation"
  },
  MARKET_EVENTS: {
    title: "Market Events",
    hint: "Economic events can boost or hurt different industries. Diversify your portfolio to minimize risk and maximize opportunities.",
    type: "info",
    wikiLink: "/wiki/market-events"
  }
};

// Quick hint component for inline use
export const QuickHint = ({ hintKey, size = "sm", className = "" }) => {
  const hint = GAME_HINTS[hintKey];
  if (!hint) return null;

  return (
    <HintIcon
      hint={hint.hint}
      title={hint.title}
      type={hint.type}
      size={size}
      className={className}
      wikiLink={hint.wikiLink}
    />
  );
};

const HintIcon = ({
  hint,
  title,
  type = 'info',
  position = 'top',
  size = 'sm',
  className = '',
  wikiLink = null
}) => {
  const [showHint, setShowHint] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'tip':
        return LightBulbIcon;
      case 'help':
        return QuestionMarkCircleIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'tip':
        return 'text-yellow-400 hover:text-yellow-300';
      case 'help':
        return 'text-blue-400 hover:text-blue-300';
      default:
        return 'text-gray-400 hover:text-gray-300';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 'h-3 w-3';
      case 'sm':
        return 'h-4 w-4';
      case 'md':
        return 'h-5 w-5';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-4 w-4';
    }
  };

  const getTooltipPosition = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const Icon = getIcon();

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onMouseEnter={() => setShowHint(true)}
        onMouseLeave={() => setShowHint(false)}
        onClick={() => setShowHint(!showHint)}
        className={`${getIconColor()} transition-colors cursor-help`}
        aria-label={title || 'Show hint'}
      >
        <Icon className={getIconSize()} />
      </button>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${getTooltipPosition()}`}
          >
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg max-w-xs">
              {/* Arrow */}
              <div
                className={`absolute w-2 h-2 bg-gray-800 border-gray-600 transform rotate-45 ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-b border-r' :
                  position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t border-l' :
                    position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' :
                      'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'
                  }`}
              />

              {title && (
                <h4 className="text-white font-medium text-sm mb-1">{title}</h4>
              )}

              <p className="text-gray-300 text-xs leading-relaxed">{hint}</p>

              {wikiLink && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <a
                    href={wikiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs underline"
                  >
                    📖 Learn more in wiki
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



export default HintIcon; 