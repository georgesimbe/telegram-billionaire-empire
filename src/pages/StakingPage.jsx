import React, { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import EconomicDashboard from '../components/EconomicDashboard';
import {
  STAKING_POOLS,
  GOVERNANCE_SYSTEM,
  ECONOMIC_EVENTS,
  STAKING_CALCULATIONS,
  calculateTotalDailyRewards,
  calculateTotalStaked,
  getActiveEconomicEvents,
  calculateEventEffects
} from '../config/stakingConfig';

const StakingPage = () => {
  const {
    staking,
    governance,
    economics,
    businesses,
    player,
    stakeTokens,
    unstakeTokens,
    claimStakingRewards,
    updateStaking,
    submitProposal,
    voteOnProposal
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  // Calculate derived values
  const totalDailyRewards = calculateTotalDailyRewards(staking.activeStakes);
  const totalStaked = calculateTotalStaked(staking.activeStakes);
  const availablePools = Object.values(STAKING_POOLS);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-white mb-4">🏦 Economic Staking Portfolio</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {staking.tonBalance.toFixed(2)} TON
            </div>
            <div className="text-sm text-purple-200">Available Balance</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {totalStaked.toFixed(2)} TON
            </div>
            <div className="text-sm text-purple-200">Total Staked</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">
              {totalDailyRewards.toFixed(4)} TON
            </div>
            <div className="text-sm text-purple-200">Daily Rewards</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {staking.votingPower.toFixed(0)}
            </div>
            <div className="text-sm text-purple-200">Voting Power</div>
          </div>
        </div>

        {/* Pending Rewards */}
        {staking.pendingRewards > 0 && (
          <div className="mt-4 bg-green-900/30 border border-green-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-green-400 font-bold">Pending Rewards</h4>
                <p className="text-2xl font-bold text-white">
                  {staking.pendingRewards.toFixed(4)} TON
                </p>
              </div>
              <button
                onClick={claimStakingRewards}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                Claim Rewards
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Economic Events */}
      {economics.activeEvents.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Active Economic Events</h3>
          <div className="space-y-3">
            {economics.activeEvents.map((event, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-orange-400 font-bold flex items-center gap-2">
                    {event.icon} {event.name}
                  </h4>
                  <span className="text-sm text-orange-300">
                    {Math.ceil((event.endTime - Date.now()) / (1000 * 60 * 60 * 24))} days left
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Active Stakes */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">🔐 My Active Stakes</h3>
        {Object.keys(staking.activeStakes).length === 0 ? (
          <p className="text-gray-400">No active stakes. Start staking to earn rewards and gain voting power!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(staking.activeStakes).map(([poolId, stake]) => {
              const pool = Object.values(STAKING_POOLS).find(p => p.id === poolId);
              if (!pool) return null;

              const lockEndDate = new Date(stake.startDate);
              lockEndDate.setDate(lockEndDate.getDate() + stake.lockPeriod);
              const daysRemaining = Math.max(0, Math.ceil((lockEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
              const isLocked = daysRemaining > 0;

              return (
                <div key={poolId} className={`bg-gray-700 border-2 rounded-lg p-4 ${isLocked ? 'border-red-500' : 'border-green-500'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{pool.icon}</span>
                      <h4 className="font-bold text-white">{pool.name}</h4>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${isLocked ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                      {isLocked ? `${daysRemaining}d locked` : 'Unlocked'}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Staked Amount:</span>
                      <span className="text-white font-bold">{stake.amount.toFixed(2)} TON</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">APY:</span>
                      <span className="text-green-400 font-bold">{stake.apy.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Daily Rewards:</span>
                      <span className="text-yellow-400 font-bold">
                        {STAKING_CALCULATIONS.calculateDailyRewards(stake.amount, stake.apy).toFixed(4)} TON
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPool(poolId);
                      setActiveTab('manage');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition-colors"
                  >
                    Manage Stake
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderStakingPools = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">💰 Available Staking Pools</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {availablePools.map(pool => {
            const currentStake = staking.activeStakes[pool.id]?.amount || 0;
            const canStake = staking.tonBalance >= pool.minStake;
            const hasSpace = currentStake < pool.maxStake;

            return (
              <div key={pool.id} className={`bg-gray-700 border-2 rounded-lg p-6 ${canStake && hasSpace ? 'border-green-500' : 'border-gray-600'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pool.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-lg">{pool.name}</h4>
                      <div className={`text-sm px-2 py-1 rounded ${pool.color === 'blue' ? 'bg-blue-900 text-blue-300' : 
                        pool.color === 'purple' ? 'bg-purple-900 text-purple-300' :
                        pool.color === 'orange' ? 'bg-orange-900 text-orange-300' :
                        pool.color === 'green' ? 'bg-green-900 text-green-300' :
                        'bg-emerald-900 text-emerald-300'}`}>
                        {pool.apy}% APY • {pool.lockPeriod} days lock
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">{pool.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Min Stake:</span>
                    <span className="text-white">{pool.minStake} TON</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Stake:</span>
                    <span className="text-white">{pool.maxStake.toLocaleString()} TON</span>
                  </div>
                  {currentStake > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your Stake:</span>
                      <span className="text-yellow-400 font-bold">{currentStake.toFixed(2)} TON</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-bold text-white mb-2">Benefits:</h5>
                  <div className="space-y-1">
                    {pool.features.map((feature, idx) => (
                      <div key={idx} className="text-xs text-green-400">✓ {feature}</div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-bold text-white mb-2">Risk Profile:</h5>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-300">
                      Liquidity Lock: <span className={pool.risks.liquidityLock === 'low' ? 'text-green-400' : 
                        pool.risks.liquidityLock === 'medium' ? 'text-yellow-400' : 'text-red-400'}>
                        {pool.risks.liquidityLock}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300">
                      Market Exposure: <span className={pool.risks.marketExposure === 'low' ? 'text-green-400' : 
                        pool.risks.marketExposure === 'medium' ? 'text-yellow-400' : 'text-red-400'}>
                        {pool.risks.marketExposure}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPool(pool.id);
                    setActiveTab('manage');
                  }}
                  disabled={!canStake || !hasSpace}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
                >
                  {!canStake ? 'Insufficient Balance' : !hasSpace ? 'Pool Full' : 'Stake Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderManageStake = () => {
    if (!selectedPool) {
      return (
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-400">Select a pool to manage your stake.</p>
        </div>
      );
    }

    const pool = Object.values(STAKING_POOLS).find(p => p.id === selectedPool);
    const currentStake = staking.activeStakes[selectedPool];

    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{pool.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{pool.name}</h3>
              <p className="text-gray-400">{pool.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stake Tokens */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-bold text-white mb-4">💰 Stake Tokens</h4>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Amount to Stake (TON)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  min={pool.minStake}
                  max={Math.min(staking.tonBalance, pool.maxStake - (currentStake?.amount || 0))}
                  step="0.01"
                  className="w-full bg-gray-600 text-white p-3 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder={`Min: ${pool.minStake} TON`}
                />
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Balance:</span>
                  <span className="text-white">{staking.tonBalance.toFixed(2)} TON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">APY:</span>
                  <span className="text-green-400">{pool.apy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lock Period:</span>
                  <span className="text-white">{pool.lockPeriod} days</span>
                </div>
                {stakeAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Rewards:</span>
                    <span className="text-yellow-400">
                      {STAKING_CALCULATIONS.calculateDailyRewards(parseFloat(stakeAmount) || 0, pool.apy).toFixed(4)} TON
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const amount = parseFloat(stakeAmount);
                  if (amount >= pool.minStake && amount <= staking.tonBalance) {
                    stakeTokens(selectedPool, amount);
                    setStakeAmount('');
                  }
                }}
                disabled={!stakeAmount || parseFloat(stakeAmount) < pool.minStake || parseFloat(stakeAmount) > staking.tonBalance}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
              >
                Stake Tokens
              </button>
            </div>

            {/* Unstake Tokens */}
            {currentStake && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-4">🔓 Unstake Tokens</h4>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">Amount to Unstake (TON)</label>
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    min="0.01"
                    max={currentStake.amount}
                    step="0.01"
                    className="w-full bg-gray-600 text-white p-3 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder={`Max: ${currentStake.amount.toFixed(2)} TON`}
                  />
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Stake:</span>
                    <span className="text-white">{currentStake.amount.toFixed(2)} TON</span>
                  </div>
                  
                  {unstakeAmount && (() => {
                    const lockEndDate = new Date(currentStake.startDate);
                    lockEndDate.setDate(lockEndDate.getDate() + currentStake.lockPeriod);
                    const timeRemaining = Math.max(0, (lockEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const penalty = STAKING_CALCULATIONS.calculateUnstakingPenalty(selectedPool.toUpperCase(), timeRemaining);
                    const penaltyAmount = parseFloat(unstakeAmount) * penalty;
                    const netAmount = parseFloat(unstakeAmount) - penaltyAmount;

                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Early Unstake Penalty:</span>
                          <span className="text-red-400">{(penalty * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Penalty Amount:</span>
                          <span className="text-red-400">{penaltyAmount.toFixed(4)} TON</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">You Will Receive:</span>
                          <span className="text-green-400">{netAmount.toFixed(4)} TON</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <button
                  onClick={() => {
                    const amount = parseFloat(unstakeAmount);
                    if (amount > 0 && amount <= currentStake.amount) {
                      unstakeTokens(selectedPool, amount);
                      setUnstakeAmount('');
                    }
                  }}
                  disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > currentStake.amount}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
                >
                  Unstake Tokens
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGovernance = () => (
    <div className="space-y-6">
      {/* Voting Power Overview */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-white mb-4">🗳️ Governance Power</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {governance.votingPower.toFixed(0)}
            </div>
            <div className="text-sm text-purple-200">Voting Power</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">
              {governance.activeProposals.length}
            </div>
            <div className="text-sm text-purple-200">Active Proposals</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {governance.votingHistory.length}
            </div>
            <div className="text-sm text-purple-200">Votes Cast</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {governance.submittedProposals.length}
            </div>
            <div className="text-sm text-purple-200">Proposals Submitted</div>
          </div>
        </div>
      </div>

      {/* Active Proposals */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">📋 Active Proposals</h3>
        {governance.activeProposals.length === 0 ? (
          <p className="text-gray-400">No active proposals. Community members can submit proposals for voting.</p>
        ) : (
          <div className="space-y-4">
            {governance.activeProposals.map(proposal => {
              const hasVoted = governance.votingHistory.some(v => v.proposalId === proposal.id);
              const totalVotes = proposal.votesFor + proposal.votesAgainst;
              const supportPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

              return (
                <div key={proposal.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white">{proposal.title}</h4>
                    <div className={`px-3 py-1 rounded text-sm font-bold ${hasVoted ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>
                      {hasVoted ? 'Voted' : 'Pending'}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{proposal.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Votes For:</span>
                      <span className="text-green-400">{proposal.votesFor.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Votes Against:</span>
                      <span className="text-red-400">{proposal.votesAgainst.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Support:</span>
                      <span className="text-white">{supportPercentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  {!hasVoted && governance.votingPower > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => voteOnProposal(proposal.id, 'for')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition-colors"
                      >
                        Vote For
                      </button>
                      <button
                        onClick={() => voteOnProposal(proposal.id, 'against')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold transition-colors"
                      >
                        Vote Against
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Proposal Types */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">📝 Proposal Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(GOVERNANCE_SYSTEM.PROPOSAL_TYPES).map(proposalType => (
            <div key={proposalType.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{proposalType.icon}</span>
                <h4 className="font-bold text-white">{proposalType.name}</h4>
              </div>
              <p className="text-gray-300 text-sm mb-3">{proposalType.description}</p>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Required Votes: {proposalType.requiredVotes.toLocaleString()}</div>
                <div>Voting Period: {proposalType.votingPeriod} days</div>
                <div>Implementation: {proposalType.implementationTime} days</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💰 Economic Staking System</h1>
          <p className="text-blue-200">Stake TON tokens to earn rewards and shape the economy</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'pools', label: 'Staking Pools', icon: '💰' },
            { id: 'manage', label: 'Manage Stakes', icon: '⚙️' },
            { id: 'governance', label: 'Governance', icon: '🗳️' },
            { id: 'economics', label: 'Economics', icon: '🌍' }
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
          {activeTab === 'pools' && renderStakingPools()}
          {activeTab === 'manage' && renderManageStake()}
          {activeTab === 'governance' && renderGovernance()}
          {activeTab === 'economics' && <EconomicDashboard />}
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
