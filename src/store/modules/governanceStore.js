import { STAKING_CALCULATIONS } from '../../config/stakingConfig.js';

/**
 * Governance Store Module
 * Manages community governance, voting, proposals, and governance tokens
 */
export const createGovernanceStore = (set, get) => ({
  // Governance State
  governance: {
    votingPower: 0,
    activeProposals: [],
    votingHistory: [],
    submittedProposals: [],
    governanceTokens: 0,
    delegatedVotes: {},
    proposalCategories: ['economic', 'technical', 'community', 'treasury'],
    minimumVotingPower: 100,
    proposalThreshold: 1000, // Minimum voting power to submit proposals
  },

  // Governance Actions
  updateGovernance: (updates) => set((state) => ({
    governance: { ...state.governance, ...updates }
  })),

  /**
   * Calculate voting power based on staking positions and tenure
   */
  calculateVotingPower: () => {
    const state = get();
    const { activeStakes, stakingTenure } = state.staking || {};

    if (!activeStakes || !stakingTenure) return 0;

    const votingPower = STAKING_CALCULATIONS.calculateVotingPower(activeStakes, stakingTenure);

    set((state) => ({
      governance: {
        ...state.governance,
        votingPower
      }
    }));

    return votingPower;
  },

  /**
   * Submit a new governance proposal
   */
  submitProposal: (proposalData) => {
    const state = get();

    // Check if user has enough voting power to submit proposals
    if (state.governance.votingPower < state.governance.proposalThreshold) {
      return {
        success: false,
        error: `Minimum ${state.governance.proposalThreshold} voting power required to submit proposals`
      };
    }

    const newProposal = {
      id: Date.now(),
      title: proposalData.title,
      description: proposalData.description,
      category: proposalData.category,
      submittedBy: state.player?.id || 'anonymous',
      submittedAt: new Date(),
      votesFor: 0,
      votesAgainst: 0,
      totalVotingPower: 0,
      status: 'active',
      endDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 days from now
      requiredQuorum: 10000, // Minimum total voting power needed
      executionData: proposalData.executionData || null,
    };

    set((state) => ({
      governance: {
        ...state.governance,
        activeProposals: [...state.governance.activeProposals, newProposal],
        submittedProposals: [...state.governance.submittedProposals, newProposal.id]
      }
    }));

    return { success: true, proposalId: newProposal.id };
  },

  /**
   * Vote on an active proposal
   */
  voteOnProposal: (proposalId, vote) => {
    const state = get();

    // Validate vote
    if (!['for', 'against', 'abstain'].includes(vote)) {
      return { success: false, error: 'Invalid vote option' };
    }

    // Check if user has voting power
    if (state.governance.votingPower <= 0) {
      return { success: false, error: 'No voting power available' };
    }

    // Check if proposal exists and is active
    const proposal = state.governance.activeProposals.find(p => p.id === proposalId);
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    if (proposal.status !== 'active' || new Date() > new Date(proposal.endDate)) {
      return { success: false, error: 'Proposal is no longer active' };
    }

    // Check if already voted
    const alreadyVoted = state.governance.votingHistory.some(v => v.proposalId === proposalId);
    if (alreadyVoted) {
      return { success: false, error: 'Already voted on this proposal' };
    }

    // Record the vote
    const voteRecord = {
      id: Date.now(),
      proposalId,
      vote,
      votingPower: state.governance.votingPower,
      timestamp: new Date(),
      voter: state.player?.id || 'anonymous'
    };

    // Update proposal vote counts
    const updatedProposals = state.governance.activeProposals.map(p => {
      if (p.id === proposalId) {
        const updates = {
          totalVotingPower: p.totalVotingPower + state.governance.votingPower
        };

        if (vote === 'for') {
          updates.votesFor = p.votesFor + state.governance.votingPower;
        } else if (vote === 'against') {
          updates.votesAgainst = p.votesAgainst + state.governance.votingPower;
        }

        return { ...p, ...updates };
      }
      return p;
    });

    set((state) => ({
      governance: {
        ...state.governance,
        activeProposals: updatedProposals,
        votingHistory: [...state.governance.votingHistory, voteRecord]
      }
    }));

    return { success: true, voteRecord };
  },

  /**
   * Delegate voting power to another user
   */
  delegateVotes: (delegateToId, amount) => {
    const state = get();

    if (amount > state.governance.votingPower) {
      return { success: false, error: 'Cannot delegate more voting power than available' };
    }

    const currentDelegated = Object.values(state.governance.delegatedVotes).reduce((sum, amt) => sum + amt, 0);
    if (currentDelegated + amount > state.governance.votingPower) {
      return { success: false, error: 'Insufficient voting power to delegate' };
    }

    set((state) => ({
      governance: {
        ...state.governance,
        delegatedVotes: {
          ...state.governance.delegatedVotes,
          [delegateToId]: (state.governance.delegatedVotes[delegateToId] || 0) + amount
        }
      }
    }));

    return { success: true };
  },

  /**
   * Revoke delegated voting power
   */
  revokeDelegation: (delegateId, amount) => {
    const state = get();

    const currentDelegation = state.governance.delegatedVotes[delegateId] || 0;
    if (amount > currentDelegation) {
      return { success: false, error: 'Cannot revoke more than currently delegated' };
    }

    const newAmount = currentDelegation - amount;
    const updatedDelegations = { ...state.governance.delegatedVotes };

    if (newAmount <= 0) {
      delete updatedDelegations[delegateId];
    } else {
      updatedDelegations[delegateId] = newAmount;
    }

    set((state) => ({
      governance: {
        ...state.governance,
        delegatedVotes: updatedDelegations
      }
    }));

    return { success: true };
  },

  /**
   * Process proposal outcomes and execute if passed
   */
  processProposalOutcomes: () => {
    const state = get();
    const now = new Date();

    const updatedProposals = state.governance.activeProposals.map(proposal => {
      // Check if proposal has ended
      if (proposal.status === 'active' && now > new Date(proposal.endDate)) {
        const totalVotes = proposal.votesFor + proposal.votesAgainst;
        const hasQuorum = proposal.totalVotingPower >= proposal.requiredQuorum;
        const passed = hasQuorum && proposal.votesFor > proposal.votesAgainst;

        return {
          ...proposal,
          status: passed ? 'passed' : 'failed',
          finalizedAt: now,
          hasQuorum,
          passed
        };
      }
      return proposal;
    });

    set((state) => ({
      governance: {
        ...state.governance,
        activeProposals: updatedProposals
      }
    }));

    // Return newly finalized proposals for potential execution
    return updatedProposals.filter(p =>
      p.status === 'passed' &&
      !state.governance.activeProposals.find(orig => orig.id === p.id && orig.status === 'passed')
    );
  },

  /**
   * Get governance statistics
   */
  getGovernanceStats: () => {
    const state = get();
    const { governance } = state;

    const totalProposalsSubmitted = governance.submittedProposals.length;
    const totalVotesCast = governance.votingHistory.length;
    const activeDelegations = Object.keys(governance.delegatedVotes).length;
    const totalDelegatedPower = Object.values(governance.delegatedVotes).reduce((sum, amt) => sum + amt, 0);

    const proposalsByCategory = governance.activeProposals.reduce((acc, proposal) => {
      acc[proposal.category] = (acc[proposal.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalProposalsSubmitted,
      totalVotesCast,
      activeDelegations,
      totalDelegatedPower,
      availableVotingPower: governance.votingPower - totalDelegatedPower,
      proposalsByCategory,
      canSubmitProposals: governance.votingPower >= governance.proposalThreshold
    };
  },

  /**
   * Get user's voting history with proposal details
   */
  getVotingHistory: () => {
    const state = get();

    return state.governance.votingHistory.map(vote => {
      const proposal = state.governance.activeProposals.find(p => p.id === vote.proposalId);
      return {
        ...vote,
        proposalTitle: proposal?.title || 'Unknown Proposal',
        proposalCategory: proposal?.category || 'unknown',
        proposalStatus: proposal?.status || 'unknown'
      };
    });
  }
}); 