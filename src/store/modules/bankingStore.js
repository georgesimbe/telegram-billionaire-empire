/**
 * Banking Store Module
 * Manages bank accounts, loans, credit cards, investments, and credit management
 */
export const createBankingStore = (set, get) => ({
  // Banking State
  banking: {
    accounts: [
      {
        id: 1,
        type: 'checking',
        balance: 5000,
        interestRate: 0.001,
        accountNumber: 'CHK-001',
        openedDate: new Date(),
        monthlyFee: 0
      }
    ],
    loans: [],
    creditCards: [],
    investments: [],
    creditHistory: [],
    monthlyDebtPayments: 0,
    creditUtilization: 0,
    totalAssets: 5000,
    totalDebts: 0,
    bankingHistory: []
  },

  // Banking Actions
  updateBanking: (updates) => set((state) => ({
    banking: { ...state.banking, ...updates }
  })),

  /**
   * Open a new bank account
   */
  openAccount: (accountType, initialDeposit = 0) => set((state) => {
    if (state.player.cash < initialDeposit) return state;

    const accountTypes = {
      checking: { interestRate: 0.001, monthlyFee: 0, minimumBalance: 0 },
      savings: { interestRate: 0.02, monthlyFee: 0, minimumBalance: 100 },
      money_market: { interestRate: 0.035, monthlyFee: 10, minimumBalance: 2500 },
      cd: { interestRate: 0.045, monthlyFee: 0, minimumBalance: 1000 }
    };

    const accountConfig = accountTypes[accountType];
    if (!accountConfig || initialDeposit < accountConfig.minimumBalance) return state;

    const newAccount = {
      id: Date.now(),
      type: accountType,
      balance: initialDeposit,
      interestRate: accountConfig.interestRate,
      monthlyFee: accountConfig.monthlyFee,
      minimumBalance: accountConfig.minimumBalance,
      accountNumber: `${accountType.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      openedDate: new Date(),
      transactions: []
    };

    return {
      player: {
        ...state.player,
        cash: state.player.cash - initialDeposit
      },
      banking: {
        ...state.banking,
        accounts: [...state.banking.accounts, newAccount],
        totalAssets: state.banking.totalAssets + initialDeposit,
        bankingHistory: [...state.banking.bankingHistory, {
          id: Date.now(),
          type: 'account_opened',
          accountType,
          amount: initialDeposit,
          timestamp: new Date()
        }]
      }
    };
  }),

  /**
   * Deposit money into an account
   */
  depositMoney: (accountId, amount) => set((state) => {
    if (state.player.cash < amount || amount <= 0) return state;

    const updatedAccounts = state.banking.accounts.map(account => {
      if (account.id === accountId) {
        const transaction = {
          id: Date.now(),
          type: 'deposit',
          amount,
          timestamp: new Date(),
          balance: account.balance + amount
        };

        return {
          ...account,
          balance: account.balance + amount,
          transactions: [...(account.transactions || []), transaction]
        };
      }
      return account;
    });

    return {
      player: {
        ...state.player,
        cash: state.player.cash - amount
      },
      banking: {
        ...state.banking,
        accounts: updatedAccounts,
        totalAssets: state.banking.totalAssets + amount
      }
    };
  }),

  /**
   * Withdraw money from an account
   */
  withdrawMoney: (accountId, amount) => set((state) => {
    const account = state.banking.accounts.find(acc => acc.id === accountId);
    if (!account || account.balance < amount || amount <= 0) return state;

    const updatedAccounts = state.banking.accounts.map(acc => {
      if (acc.id === accountId) {
        const transaction = {
          id: Date.now(),
          type: 'withdrawal',
          amount,
          timestamp: new Date(),
          balance: acc.balance - amount
        };

        return {
          ...acc,
          balance: acc.balance - amount,
          transactions: [...(acc.transactions || []), transaction]
        };
      }
      return acc;
    });

    return {
      player: {
        ...state.player,
        cash: state.player.cash + amount
      },
      banking: {
        ...state.banking,
        accounts: updatedAccounts,
        totalAssets: state.banking.totalAssets - amount
      }
    };
  }),

  /**
 * Apply for a loan
 */
  applyForLoan: (loanType, amount, purpose) => {
    const state = get();

    const loanTypes = {
      personal: { maxAmount: 50000, interestRate: 0.12, termMonths: 60, creditScoreRequired: 600 },
      auto: { maxAmount: 100000, interestRate: 0.08, termMonths: 72, creditScoreRequired: 650 },
      home: { maxAmount: 1000000, interestRate: 0.045, termMonths: 360, creditScoreRequired: 700 },
      business: { maxAmount: 500000, interestRate: 0.10, termMonths: 120, creditScoreRequired: 680 }
    };

    const loanConfig = loanTypes[loanType];
    if (!loanConfig) return { success: false, error: 'Invalid loan type' };

    // Check eligibility
    if (amount > loanConfig.maxAmount) {
      return { success: false, error: 'Amount exceeds maximum loan limit' };
    }

    if (state.player.creditScore < loanConfig.creditScoreRequired) {
      return { success: false, error: 'Credit score too low' };
    }

    // Calculate debt-to-income ratio
    const monthlyDebtPayments = state.banking.monthlyDebtPayments;
    const monthlyIncome = state.player.monthlyIncome;
    const debtToIncomeRatio = monthlyIncome > 0 ? monthlyDebtPayments / monthlyIncome : 1;

    if (debtToIncomeRatio > 0.4) {
      return { success: false, error: 'Debt-to-income ratio too high' };
    }

    // Calculate monthly payment
    const monthlyInterestRate = loanConfig.interestRate / 12;
    const monthlyPayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanConfig.termMonths)) /
      (Math.pow(1 + monthlyInterestRate, loanConfig.termMonths) - 1);

    const newLoan = {
      id: Date.now(),
      type: loanType,
      amount,
      remainingBalance: amount,
      interestRate: loanConfig.interestRate,
      monthlyPayment: Math.round(monthlyPayment),
      termMonths: loanConfig.termMonths,
      remainingMonths: loanConfig.termMonths,
      purpose,
      startDate: new Date(),
      status: 'active',
      paymentHistory: []
    };

    set((state) => ({
      player: {
        ...state.player,
        cash: state.player.cash + amount
      },
      banking: {
        ...state.banking,
        loans: [...state.banking.loans, newLoan],
        monthlyDebtPayments: state.banking.monthlyDebtPayments + monthlyPayment,
        totalDebts: state.banking.totalDebts + amount,
        creditHistory: [...state.banking.creditHistory, {
          id: Date.now(),
          type: 'loan_approved',
          amount,
          loanType,
          timestamp: new Date()
        }]
      }
    }));

    return { success: true, loan: newLoan };
  },

  /**
   * Make a loan payment
   */
  payLoan: (loanId, amount) => set((state) => {
    const loan = state.banking.loans.find(l => l.id === loanId);
    if (!loan || state.player.cash < amount) return state;

    const payment = {
      id: Date.now(),
      amount,
      timestamp: new Date(),
      principal: amount * 0.7, // Simplified calculation
      interest: amount * 0.3
    };

    const newBalance = Math.max(0, loan.remainingBalance - payment.principal);
    const isFullyPaid = newBalance === 0;

    const updatedLoans = state.banking.loans.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          remainingBalance: newBalance,
          paymentHistory: [...(l.paymentHistory || []), payment],
          status: isFullyPaid ? 'paid_off' : 'active'
        };
      }
      return l;
    }).filter(l => l.status === 'active');

    // Update credit score for on-time payment
    const creditScoreIncrease = isFullyPaid ? 20 : 2;

    return {
      player: {
        ...state.player,
        cash: state.player.cash - amount,
        creditScore: Math.min(850, state.player.creditScore + creditScoreIncrease)
      },
      banking: {
        ...state.banking,
        loans: updatedLoans,
        monthlyDebtPayments: updatedLoans.reduce((sum, l) => sum + l.monthlyPayment, 0),
        totalDebts: state.banking.totalDebts - payment.principal,
        creditHistory: [...state.banking.creditHistory, {
          id: Date.now(),
          type: isFullyPaid ? 'loan_paid_off' : 'loan_payment',
          amount,
          loanId,
          timestamp: new Date()
        }]
      }
    };
  }),

  /**
   * Apply for a credit card
   */
  applyForCreditCard: (cardType) => {
    const state = get();

    const cardTypes = {
      basic: { creditLimit: 1000, interestRate: 0.18, annualFee: 0, creditScoreRequired: 550 },
      rewards: { creditLimit: 5000, interestRate: 0.16, annualFee: 95, creditScoreRequired: 650 },
      premium: { creditLimit: 15000, interestRate: 0.14, annualFee: 450, creditScoreRequired: 750 }
    };

    const cardConfig = cardTypes[cardType];
    if (!cardConfig) return { success: false, error: 'Invalid card type' };

    if (state.player.creditScore < cardConfig.creditScoreRequired) {
      return { success: false, error: 'Credit score too low' };
    }

    // Check if already has this type of card
    if (state.banking.creditCards.some(card => card.type === cardType)) {
      return { success: false, error: 'Already have this type of card' };
    }

    const newCard = {
      id: Date.now(),
      type: cardType,
      creditLimit: cardConfig.creditLimit,
      currentBalance: 0,
      interestRate: cardConfig.interestRate,
      annualFee: cardConfig.annualFee,
      cardNumber: `****-****-****-${Math.floor(Math.random() * 9000) + 1000}`,
      openedDate: new Date(),
      transactions: [],
      status: 'active'
    };

    set((state) => ({
      banking: {
        ...state.banking,
        creditCards: [...state.banking.creditCards, newCard],
        creditHistory: [...state.banking.creditHistory, {
          id: Date.now(),
          type: 'credit_card_approved',
          cardType,
          creditLimit: cardConfig.creditLimit,
          timestamp: new Date()
        }]
      }
    }));

    return { success: true, card: newCard };
  },

  /**
   * Use credit card for purchase
   */
  useCreditCard: (cardId, amount, description) => set((state) => {
    const card = state.banking.creditCards.find(c => c.id === cardId);
    if (!card || card.currentBalance + amount > card.creditLimit) return state;

    const transaction = {
      id: Date.now(),
      amount,
      description,
      timestamp: new Date(),
      type: 'purchase'
    };

    const updatedCards = state.banking.creditCards.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          currentBalance: c.currentBalance + amount,
          transactions: [...(c.transactions || []), transaction]
        };
      }
      return c;
    });

    // Update credit utilization
    const totalCreditLimit = updatedCards.reduce((sum, card) => sum + card.creditLimit, 0);
    const totalCreditUsed = updatedCards.reduce((sum, card) => sum + card.currentBalance, 0);
    const creditUtilization = totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0;

    return {
      banking: {
        ...state.banking,
        creditCards: updatedCards,
        creditUtilization,
        totalDebts: state.banking.totalDebts + amount
      }
    };
  }),

  /**
   * Pay credit card balance
   */
  payCreditCard: (cardId, amount) => set((state) => {
    const card = state.banking.creditCards.find(c => c.id === cardId);
    if (!card || state.player.cash < amount || amount > card.currentBalance) return state;

    const payment = {
      id: Date.now(),
      amount,
      timestamp: new Date(),
      type: 'payment'
    };

    const updatedCards = state.banking.creditCards.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          currentBalance: c.currentBalance - amount,
          transactions: [...(c.transactions || []), payment]
        };
      }
      return c;
    });

    // Update credit utilization
    const totalCreditLimit = updatedCards.reduce((sum, card) => sum + card.creditLimit, 0);
    const totalCreditUsed = updatedCards.reduce((sum, card) => sum + card.currentBalance, 0);
    const creditUtilization = totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0;

    // Improve credit score for payment
    const creditScoreIncrease = Math.min(5, Math.floor(amount / 100));

    return {
      player: {
        ...state.player,
        cash: state.player.cash - amount,
        creditScore: Math.min(850, state.player.creditScore + creditScoreIncrease)
      },
      banking: {
        ...state.banking,
        creditCards: updatedCards,
        creditUtilization,
        totalDebts: state.banking.totalDebts - amount,
        creditHistory: [...state.banking.creditHistory, {
          id: Date.now(),
          type: 'credit_card_payment',
          amount,
          cardId,
          timestamp: new Date()
        }]
      }
    };
  }),

  /**
   * Make an investment
   */
  makeInvestment: (investmentType, amount) => {
    const state = get();

    const investmentTypes = {
      stocks: { expectedReturn: 0.08, risk: 'medium', minimumAmount: 100 },
      bonds: { expectedReturn: 0.04, risk: 'low', minimumAmount: 1000 },
      mutual_funds: { expectedReturn: 0.06, risk: 'medium', minimumAmount: 500 },
      crypto: { expectedReturn: 0.15, risk: 'high', minimumAmount: 50 },
      real_estate: { expectedReturn: 0.10, risk: 'medium', minimumAmount: 10000 }
    };

    const investmentConfig = investmentTypes[investmentType];
    if (!investmentConfig) return { success: false, error: 'Invalid investment type' };

    if (amount < investmentConfig.minimumAmount) {
      return { success: false, error: 'Amount below minimum investment' };
    }

    if (state.player.cash < amount) {
      return { success: false, error: 'Insufficient funds' };
    }

    const newInvestment = {
      id: Date.now(),
      type: investmentType,
      initialAmount: amount,
      currentValue: amount,
      expectedReturn: investmentConfig.expectedReturn,
      risk: investmentConfig.risk,
      purchaseDate: new Date(),
      transactions: [{
        id: Date.now(),
        type: 'purchase',
        amount,
        timestamp: new Date()
      }]
    };

    set((state) => ({
      player: {
        ...state.player,
        cash: state.player.cash - amount
      },
      banking: {
        ...state.banking,
        investments: [...state.banking.investments, newInvestment],
        totalAssets: state.banking.totalAssets + amount
      }
    }));

    return { success: true, investment: newInvestment };
  },

  /**
   * Get banking statistics and summary
   */
  getBankingStats: () => {
    const state = get();
    const { banking } = state;

    const totalAccountBalance = banking.accounts.reduce((sum, account) => sum + account.balance, 0);
    const totalInvestmentValue = banking.investments.reduce((sum, investment) => sum + investment.currentValue, 0);
    const totalCreditCardDebt = banking.creditCards.reduce((sum, card) => sum + card.currentBalance, 0);
    const totalLoanDebt = banking.loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);

    const netWorth = totalAccountBalance + totalInvestmentValue - totalCreditCardDebt - totalLoanDebt;
    const liquidAssets = state.player.cash + totalAccountBalance;

    const creditScore = state.player.creditScore;
    const creditRating = getCreditRating(creditScore);

    return {
      totalAccountBalance,
      totalInvestmentValue,
      totalCreditCardDebt,
      totalLoanDebt,
      netWorth,
      liquidAssets,
      creditScore,
      creditRating,
      creditUtilization: banking.creditUtilization,
      monthlyDebtPayments: banking.monthlyDebtPayments,
      accountsCount: banking.accounts.length,
      loansCount: banking.loans.length,
      creditCardsCount: banking.creditCards.length,
      investmentsCount: banking.investments.length
    };
  },

  /**
   * Process monthly banking activities (interest, fees, etc.)
   */
  processMonthlyBanking: () => set((state) => {
    // Apply interest to accounts
    const updatedAccounts = state.banking.accounts.map(account => {
      const monthlyInterest = account.balance * (account.interestRate / 12);
      const newBalance = account.balance + monthlyInterest - account.monthlyFee;

      return {
        ...account,
        balance: Math.max(0, newBalance),
        transactions: [...(account.transactions || []), {
          id: Date.now(),
          type: 'monthly_interest',
          amount: monthlyInterest,
          timestamp: new Date(),
          balance: newBalance
        }]
      };
    });

    // Apply interest to credit cards
    const updatedCreditCards = state.banking.creditCards.map(card => {
      if (card.currentBalance > 0) {
        const monthlyInterest = card.currentBalance * (card.interestRate / 12);
        const newBalance = card.currentBalance + monthlyInterest;

        return {
          ...card,
          currentBalance: newBalance,
          transactions: [...(card.transactions || []), {
            id: Date.now(),
            type: 'interest_charge',
            amount: monthlyInterest,
            timestamp: new Date()
          }]
        };
      }
      return card;
    });

    // Update investment values (simplified market simulation)
    const updatedInvestments = state.banking.investments.map(investment => {
      const monthlyReturn = investment.expectedReturn / 12;
      const volatility = investment.risk === 'high' ? 0.1 : investment.risk === 'medium' ? 0.05 : 0.02;
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      const newValue = investment.currentValue * (1 + monthlyReturn) * randomFactor;

      return {
        ...investment,
        currentValue: Math.max(0, newValue)
      };
    });

    return {
      banking: {
        ...state.banking,
        accounts: updatedAccounts,
        creditCards: updatedCreditCards,
        investments: updatedInvestments
      }
    };
  })
});

// Helper functions
function getCreditRating(creditScore) {
  if (creditScore >= 800) return 'Excellent';
  if (creditScore >= 740) return 'Very Good';
  if (creditScore >= 670) return 'Good';
  if (creditScore >= 580) return 'Fair';
  return 'Poor';
}
