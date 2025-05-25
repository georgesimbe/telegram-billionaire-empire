export const ACCOUNT_TYPES = {
  CHECKING: {
    id: 'checking',
    name: 'Checking Account',
    icon: '💳',
    description: 'Basic account for daily transactions.',
    minimumBalance: 0,
    monthlyFee: 12,
    interestRate: 0.001,
    overdraftFee: 35,
    requirements: { creditScore: 300, income: 0 }
  },
  SAVINGS: {
    id: 'savings',
    name: 'Savings Account',
    icon: '🏦',
    description: 'Earn interest on your savings.',
    minimumBalance: 100,
    monthlyFee: 5,
    interestRate: 0.02,
    overdraftFee: 0,
    requirements: { creditScore: 400, income: 1000 }
  },
  HIGH_YIELD_SAVINGS: {
    id: 'high_yield_savings',
    name: 'High-Yield Savings',
    icon: '💰',
    description: 'Higher interest rates for larger balances.',
    minimumBalance: 10000,
    monthlyFee: 0,
    interestRate: 0.045,
    overdraftFee: 0,
    requirements: { creditScore: 650, income: 5000 }
  },
  MONEY_MARKET: {
    id: 'money_market',
    name: 'Money Market Account',
    icon: '📈',
    description: 'Premium account with investment features.',
    minimumBalance: 25000,
    monthlyFee: 0,
    interestRate: 0.055,
    overdraftFee: 0,
    requirements: { creditScore: 700, income: 10000 }
  }
};

export const LOAN_TYPES = {
  PERSONAL: {
    id: 'personal',
    name: 'Personal Loan',
    icon: '💵',
    description: 'Unsecured loan for personal expenses.',
    minAmount: 1000,
    maxAmount: 50000,
    termMonths: [12, 24, 36, 48, 60],
    baseInterestRate: 0.08,
    requirements: { creditScore: 600, income: 2000, debtToIncome: 0.4 },
    processingTime: 3, // days
    fees: { origination: 0.02, prepayment: 0 }
  },
  AUTO: {
    id: 'auto',
    name: 'Auto Loan',
    icon: '🚗',
    description: 'Secured loan for vehicle purchase.',
    minAmount: 5000,
    maxAmount: 100000,
    termMonths: [36, 48, 60, 72, 84],
    baseInterestRate: 0.045,
    requirements: { creditScore: 550, income: 2500, debtToIncome: 0.45 },
    processingTime: 5,
    fees: { origination: 0, prepayment: 0 }
  },
  STUDENT: {
    id: 'student',
    name: 'Student Loan',
    icon: '🎓',
    description: 'Education financing with flexible terms.',
    minAmount: 1000,
    maxAmount: 200000,
    termMonths: [120, 180, 240, 300],
    baseInterestRate: 0.055,
    requirements: { creditScore: 500, income: 0, debtToIncome: 0.6 },
    processingTime: 7,
    fees: { origination: 0.01, prepayment: 0 },
    defermentOptions: true
  },
  BUSINESS: {
    id: 'business',
    name: 'Business Loan',
    icon: '🏢',
    description: 'Capital for business ventures.',
    minAmount: 10000,
    maxAmount: 500000,
    termMonths: [12, 24, 36, 60, 84],
    baseInterestRate: 0.07,
    requirements: { creditScore: 650, income: 5000, debtToIncome: 0.35, businessPlan: true },
    processingTime: 14,
    fees: { origination: 0.03, prepayment: 0.02 }
  },
  MORTGAGE: {
    id: 'mortgage',
    name: 'Home Mortgage',
    icon: '🏠',
    description: 'Long-term home financing.',
    minAmount: 50000,
    maxAmount: 2000000,
    termMonths: [180, 240, 300, 360],
    baseInterestRate: 0.065,
    requirements: { creditScore: 620, income: 3000, debtToIncome: 0.28 },
    processingTime: 30,
    fees: { origination: 0.005, prepayment: 0 },
    downPaymentRequired: true
  }
};

export const CREDIT_CARDS = {
  BASIC: {
    id: 'basic',
    name: 'Basic Credit Card',
    icon: '💳',
    description: 'Simple credit card for building credit.',
    creditLimit: { min: 500, max: 2000 },
    interestRate: 0.24,
    annualFee: 0,
    rewards: { cashback: 0 },
    requirements: { creditScore: 300, income: 1000 }
  },
  REWARDS: {
    id: 'rewards',
    name: 'Rewards Credit Card',
    icon: '🎁',
    description: 'Earn cashback on purchases.',
    creditLimit: { min: 1000, max: 10000 },
    interestRate: 0.19,
    annualFee: 95,
    rewards: { cashback: 0.015 },
    requirements: { creditScore: 650, income: 3000 }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium Credit Card',
    icon: '💎',
    description: 'High-limit card with premium benefits.',
    creditLimit: { min: 5000, max: 50000 },
    interestRate: 0.16,
    annualFee: 450,
    rewards: { cashback: 0.025, travelPoints: 2 },
    requirements: { creditScore: 750, income: 10000 }
  },
  BUSINESS: {
    id: 'business',
    name: 'Business Credit Card',
    icon: '🏢',
    description: 'Credit card for business expenses.',
    creditLimit: { min: 2000, max: 100000 },
    interestRate: 0.18,
    annualFee: 0,
    rewards: { cashback: 0.02 },
    requirements: { creditScore: 680, income: 5000, businessOwner: true }
  }
};

export const INVESTMENT_PRODUCTS = {
  CD: {
    id: 'cd',
    name: 'Certificate of Deposit',
    icon: '📜',
    description: 'Fixed-term deposit with guaranteed returns.',
    minAmount: 1000,
    terms: [6, 12, 24, 36, 60], // months
    interestRates: [0.025, 0.03, 0.035, 0.04, 0.045],
    earlyWithdrawalPenalty: 0.1,
    requirements: { creditScore: 500, income: 2000 }
  },
  IRA: {
    id: 'ira',
    name: 'Individual Retirement Account',
    icon: '🏖️',
    description: 'Tax-advantaged retirement savings.',
    minAmount: 500,
    maxAnnualContribution: 6000,
    interestRate: 0.07, // average market return
    taxBenefit: true,
    requirements: { creditScore: 600, income: 1000 }
  },
  MUTUAL_FUND: {
    id: 'mutual_fund',
    name: 'Mutual Fund',
    icon: '📊',
    description: 'Diversified investment portfolio.',
    minAmount: 2500,
    expectedReturn: 0.08,
    riskLevel: 'moderate',
    managementFee: 0.015,
    requirements: { creditScore: 650, income: 5000 }
  },
  STOCKS: {
    id: 'stocks',
    name: 'Stock Trading Account',
    icon: '📈',
    description: 'Individual stock investments.',
    minAmount: 100,
    expectedReturn: 0.10,
    riskLevel: 'high',
    tradingFee: 9.99,
    requirements: { creditScore: 600, income: 3000 }
  }
};

export const CREDIT_SCORE_RANGES = {
  POOR: { min: 300, max: 579, name: 'Poor', color: '#ef4444' },
  FAIR: { min: 580, max: 669, name: 'Fair', color: '#f97316' },
  GOOD: { min: 670, max: 739, name: 'Good', color: '#eab308' },
  VERY_GOOD: { min: 740, max: 799, name: 'Very Good', color: '#22c55e' },
  EXCELLENT: { min: 800, max: 850, name: 'Excellent', color: '#10b981' }
};

export const CREDIT_FACTORS = {
  PAYMENT_HISTORY: { weight: 0.35, name: 'Payment History' },
  CREDIT_UTILIZATION: { weight: 0.30, name: 'Credit Utilization' },
  CREDIT_HISTORY_LENGTH: { weight: 0.15, name: 'Credit History Length' },
  CREDIT_MIX: { weight: 0.10, name: 'Credit Mix' },
  NEW_CREDIT: { weight: 0.10, name: 'New Credit Inquiries' }
};

// Helper functions
export const calculateCreditScore = (factors) => {
  let score = 300; // Base score

  // Payment history (35%)
  score += factors.paymentHistory * 0.35 * 550;

  // Credit utilization (30%)
  const utilizationScore = Math.max(0, 1 - factors.creditUtilization);
  score += utilizationScore * 0.30 * 550;

  // Credit history length (15%)
  const historyScore = Math.min(1, factors.creditHistoryMonths / 120); // Max at 10 years
  score += historyScore * 0.15 * 550;

  // Credit mix (10%)
  score += factors.creditMix * 0.10 * 550;

  // New credit (10%)
  const newCreditScore = Math.max(0, 1 - factors.newCreditInquiries / 10);
  score += newCreditScore * 0.10 * 550;

  return Math.round(Math.min(850, Math.max(300, score)));
};

export const getCreditScoreRange = (score) => {
  return Object.values(CREDIT_SCORE_RANGES).find(range =>
    score >= range.min && score <= range.max
  );
};

export const calculateLoanPayment = (principal, interestRate, termMonths) => {
  const monthlyRate = interestRate / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment);
};

export const calculateLoanInterestRate = (baseLoan, creditScore, income, debtToIncome) => {
  let rate = baseLoan.baseInterestRate;

  // Credit score adjustment
  if (creditScore < 600) rate += 0.05;
  else if (creditScore < 650) rate += 0.03;
  else if (creditScore < 700) rate += 0.01;
  else if (creditScore >= 750) rate -= 0.01;

  // Debt-to-income adjustment
  if (debtToIncome > 0.4) rate += 0.02;
  else if (debtToIncome < 0.2) rate -= 0.005;

  return Math.max(0.03, rate); // Minimum 3% rate
};

export const getAvailableLoans = (creditScore, income, currentDebts = 0) => {
  const debtToIncome = currentDebts / income;

  return Object.values(LOAN_TYPES).filter(loan => {
    return creditScore >= loan.requirements.creditScore &&
      income >= loan.requirements.income &&
      debtToIncome <= loan.requirements.debtToIncome;
  });
};

export const getAvailableCreditCards = (creditScore, income) => {
  return Object.values(CREDIT_CARDS).filter(card => {
    return creditScore >= card.requirements.creditScore &&
      income >= card.requirements.income;
  });
};

export const calculateCreditLimit = (card, creditScore, income) => {
  const baseLimit = (card.creditLimit.min + card.creditLimit.max) / 2;
  const scoreMultiplier = Math.min(2, creditScore / 650);
  const incomeMultiplier = Math.min(3, income / 5000);

  const calculatedLimit = baseLimit * scoreMultiplier * incomeMultiplier;
  return Math.round(Math.min(card.creditLimit.max, Math.max(card.creditLimit.min, calculatedLimit)));
};

export const calculateMonthlyInterest = (balance, interestRate) => {
  return Math.round(balance * (interestRate / 12));
};

export const calculateInvestmentReturn = (principal, rate, months) => {
  const monthlyRate = rate / 12;
  return Math.round(principal * Math.pow(1 + monthlyRate, months));
}; 