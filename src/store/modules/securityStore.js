import { SECURITY_CONFIG, SecurityCalculator } from '../../config/securityConfig.js';
import { antiCheatDetector } from '../../utils/antiCheatDetector.js';

/**
 * Security Store Module
 * Manages anti-cheat, security monitoring, and fraud prevention
 */
export const createSecurityStore = (set, get) => ({
  // Security State
  security: {
    initialized: false,
    deviceData: null,
    sessionId: null,
    startTime: null,
    actionLog: [],
    recentClicks: [],
    suspiciousActivity: [],
    securityLevel: 'normal', // low, normal, high, critical
    lastSecurityCheck: new Date(),
    banStatus: {
      isBanned: false,
      banReason: null,
      banExpiry: null,
      appealable: true
    },
    riskScore: 0,
    trustScore: 100,
    verificationStatus: {
      deviceVerified: false,
      behaviorVerified: false,
      patternVerified: false
    }
  },

  // Security Actions
  initializeSecurity: (deviceData) => {
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    set((state) => ({
      security: {
        ...state.security,
        deviceData,
        initialized: true,
        sessionId,
        startTime: new Date(),
        lastSecurityCheck: new Date()
      }
    }));

    // Perform initial security checks
    get().performSecurityCheck();

    return { success: true, sessionId };
  },

  /**
   * Log user actions for security monitoring
   */
  logAction: (actionType, data = {}) => {
    const state = get();
    const now = Date.now();
    const security = state.security || {};

    // Rate limiting for clicks
    if (actionType === 'CLICK') {
      const recentClicks = security.recentClicks || [];
      const oneSecondAgo = now - 1000;
      const filteredClicks = recentClicks.filter(time => time > oneSecondAgo);

      // Check for click spam
      if (filteredClicks.length > SECURITY_CONFIG.MAX_CLICKS_PER_SECOND) {
        get().flagSuspiciousActivity('CLICK_SPAM', {
          clicksPerSecond: filteredClicks.length,
          threshold: SECURITY_CONFIG.MAX_CLICKS_PER_SECOND
        });

        return { allowed: false, reason: 'Too many clicks per second' };
      }

      set((state) => ({
        security: {
          ...state.security,
          recentClicks: [...filteredClicks, now]
        }
      }));
    }

    // Log the action
    const actionEntry = {
      type: actionType,
      data,
      timestamp: now,
      sessionId: security.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    };

    set((state) => ({
      security: {
        ...state.security,
        actionLog: [
          ...(state.security?.actionLog || []).slice(-SECURITY_CONFIG.MAX_ACTION_LOG_SIZE),
          actionEntry
        ]
      }
    }));

    // Analyze action patterns
    get().analyzeActionPatterns(actionType, data);

    return { allowed: true };
  },

  /**
   * Flag suspicious activity
   */
  flagSuspiciousActivity: (type, details) => {
    const suspiciousEntry = {
      id: Date.now(),
      type,
      details,
      timestamp: new Date(),
      severity: getSeverityLevel(type),
      resolved: false
    };

    set((state) => ({
      security: {
        ...state.security,
        suspiciousActivity: [
          ...state.security.suspiciousActivity,
          suspiciousEntry
        ]
      }
    }));

    // Update risk score
    get().updateRiskScore(suspiciousEntry.severity);

    // Check if action should trigger a ban
    get().evaluateBanConditions();

    return suspiciousEntry;
  },

  /**
   * Perform comprehensive security check
   */
  performSecurityCheck: () => {
    const state = get();
    const checks = {
      deviceIntegrity: checkDeviceIntegrity(state),
      behaviorAnalysis: analyzeBehaviorPatterns(state),
      actionValidation: validateRecentActions(state),
      timeConsistency: checkTimeConsistency(state),
      patternDetection: detectAnomalousPatterns(state)
    };

    const overallScore = calculateSecurityScore(checks);
    const securityLevel = determineSecurityLevel(overallScore);

    set((state) => ({
      security: {
        ...state.security,
        lastSecurityCheck: new Date(),
        securityLevel,
        verificationStatus: {
          deviceVerified: checks.deviceIntegrity.passed,
          behaviorVerified: checks.behaviorAnalysis.passed,
          patternVerified: checks.patternDetection.passed
        }
      }
    }));

    // Flag any failed checks
    Object.entries(checks).forEach(([checkType, result]) => {
      if (!result.passed) {
        get().flagSuspiciousActivity(`SECURITY_CHECK_FAILED_${checkType.toUpperCase()}`, result);
      }
    });

    return { checks, overallScore, securityLevel };
  },

  /**
   * Analyze action patterns for anomalies
   */
  analyzeActionPatterns: (actionType, data) => {
    const state = get();
    const recentActions = state.security.actionLog.slice(-50); // Last 50 actions

    // Check for automation patterns
    if (antiCheatDetector.detectAutomation(recentActions)) {
      get().flagSuspiciousActivity('AUTOMATION_DETECTED', {
        actionType,
        patternLength: recentActions.length
      });
    }

    // Check for impossible timing
    if (antiCheatDetector.detectImpossibleTiming(recentActions)) {
      get().flagSuspiciousActivity('IMPOSSIBLE_TIMING', {
        actionType,
        recentActions: recentActions.slice(-5)
      });
    }

    // Check for value manipulation
    if (actionType === 'MONEY_CHANGE' && data.amount) {
      if (antiCheatDetector.detectValueManipulation(data.amount, state)) {
        get().flagSuspiciousActivity('VALUE_MANIPULATION', {
          amount: data.amount,
          expectedRange: antiCheatDetector.getExpectedValueRange(state)
        });
      }
    }
  },

  /**
   * Update risk score based on activity
   */
  updateRiskScore: (severityIncrease) => {
    set((state) => {
      const currentRisk = state.security.riskScore || 0;
      const newRisk = Math.min(100, currentRisk + severityIncrease);

      // Decrease trust score inversely
      const trustDecrease = severityIncrease * 2;
      const newTrust = Math.max(0, (state.security.trustScore || 100) - trustDecrease);

      return {
        security: {
          ...state.security,
          riskScore: newRisk,
          trustScore: newTrust
        }
      };
    });
  },

  /**
   * Evaluate if ban conditions are met
   */
  evaluateBanConditions: () => {
    const state = get();
    const { security } = state;

    // Check various ban conditions
    const banConditions = {
      highRiskScore: security.riskScore >= SECURITY_CONFIG.BAN_RISK_THRESHOLD,
      lowTrustScore: security.trustScore <= SECURITY_CONFIG.MIN_TRUST_SCORE,
      multipleSuspiciousActivities: security.suspiciousActivity.length >= SECURITY_CONFIG.MAX_SUSPICIOUS_ACTIVITIES,
      criticalViolations: security.suspiciousActivity.some(activity =>
        activity.severity >= SECURITY_CONFIG.CRITICAL_VIOLATION_THRESHOLD
      )
    };

    const shouldBan = Object.values(banConditions).some(condition => condition);

    if (shouldBan && !security.banStatus.isBanned) {
      get().issueBan(banConditions);
    }

    return { shouldBan, conditions: banConditions };
  },

  /**
   * Issue a ban to the user
   */
  issueBan: (reasons) => {
    const banDuration = calculateBanDuration(reasons);
    const banExpiry = new Date(Date.now() + banDuration);

    set((state) => ({
      security: {
        ...state.security,
        banStatus: {
          isBanned: true,
          banReason: Object.keys(reasons).filter(key => reasons[key]).join(', '),
          banExpiry,
          appealable: banDuration < SECURITY_CONFIG.PERMANENT_BAN_THRESHOLD
        }
      }
    }));

    return { banned: true, expiry: banExpiry, appealable: banDuration < SECURITY_CONFIG.PERMANENT_BAN_THRESHOLD };
  },

  /**
   * Appeal a ban
   */
  appealBan: (appealReason) => {
    const state = get();

    if (!state.security.banStatus.isBanned || !state.security.banStatus.appealable) {
      return { success: false, message: 'No appealable ban found' };
    }

    // In a real implementation, this would submit to a review system
    const appealId = Date.now().toString();

    set((state) => ({
      security: {
        ...state.security,
        banAppeal: {
          id: appealId,
          reason: appealReason,
          submittedAt: new Date(),
          status: 'pending'
        }
      }
    }));

    return { success: true, appealId, message: 'Ban appeal submitted for review' };
  },

  /**
   * Get security status and recommendations
   */
  getSecurityStatus: () => {
    const state = get();
    const { security } = state;

    const recentSuspiciousActivity = security.suspiciousActivity.filter(activity =>
      new Date() - new Date(activity.timestamp) < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    const recommendations = generateSecurityRecommendations(security);

    return {
      securityLevel: security.securityLevel,
      riskScore: security.riskScore,
      trustScore: security.trustScore,
      isBanned: security.banStatus.isBanned,
      banExpiry: security.banStatus.banExpiry,
      recentSuspiciousActivity: recentSuspiciousActivity.length,
      totalSuspiciousActivity: security.suspiciousActivity.length,
      verificationStatus: security.verificationStatus,
      recommendations,
      lastCheck: security.lastSecurityCheck
    };
  },

  /**
   * Reset security warnings (for testing or admin override)
   */
  resetSecurityWarnings: () => set((state) => ({
    security: {
      ...state.security,
      suspiciousActivity: [],
      riskScore: 0,
      trustScore: 100,
      securityLevel: 'normal'
    }
  })),

  /**
   * Get detailed security report
   */
  getSecurityReport: () => {
    const state = get();
    const { security } = state;

    const actionsByType = security.actionLog.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {});

    const suspiciousByType = security.suspiciousActivity.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    const sessionDuration = security.startTime
      ? new Date() - new Date(security.startTime)
      : 0;

    return {
      sessionInfo: {
        sessionId: security.sessionId,
        duration: sessionDuration,
        startTime: security.startTime,
        actionsLogged: security.actionLog.length
      },
      securityMetrics: {
        riskScore: security.riskScore,
        trustScore: security.trustScore,
        securityLevel: security.securityLevel
      },
      activityBreakdown: {
        actionsByType,
        suspiciousByType,
        totalSuspicious: security.suspiciousActivity.length
      },
      verificationStatus: security.verificationStatus,
      banStatus: security.banStatus
    };
  }
});

// Helper functions
function getSeverityLevel(activityType) {
  const severityMap = {
    'CLICK_SPAM': 5,
    'AUTOMATION_DETECTED': 15,
    'IMPOSSIBLE_TIMING': 10,
    'VALUE_MANIPULATION': 25,
    'DEV_TOOLS_DETECTED': 20,
    'SECURITY_CHECK_FAILED_DEVICEINTEGRITY': 10,
    'SECURITY_CHECK_FAILED_BEHAVIORANALYSIS': 8,
    'SECURITY_CHECK_FAILED_PATTERNDETECTION': 12
  };

  return severityMap[activityType] || 5;
}

function checkDeviceIntegrity(state) {
  // Simplified device integrity check
  const deviceData = state.security.deviceData;

  if (!deviceData) {
    return { passed: false, reason: 'No device data available' };
  }

  // Check for suspicious device characteristics
  const suspiciousIndicators = [
    !deviceData.userAgent,
    deviceData.screen?.width < 100,
    deviceData.screen?.height < 100,
    deviceData.timezone && Math.abs(deviceData.timezone) > 12
  ];

  const suspiciousCount = suspiciousIndicators.filter(Boolean).length;

  return {
    passed: suspiciousCount < 2,
    score: Math.max(0, 100 - (suspiciousCount * 25)),
    indicators: suspiciousCount
  };
}

function analyzeBehaviorPatterns(state) {
  const actions = state.security.actionLog || [];

  if (actions.length < 10) {
    return { passed: true, reason: 'Insufficient data for analysis' };
  }

  // Check for human-like behavior patterns
  const timings = actions.slice(-20).map((action, index, arr) => {
    if (index === 0) return 0;
    return action.timestamp - arr[index - 1].timestamp;
  }).filter(timing => timing > 0);

  const averageTiming = timings.reduce((sum, timing) => sum + timing, 0) / timings.length;
  const variance = timings.reduce((sum, timing) => sum + Math.pow(timing - averageTiming, 2), 0) / timings.length;

  // Human behavior should have some variance
  const isHumanLike = variance > 1000 && averageTiming > 100;

  return {
    passed: isHumanLike,
    score: isHumanLike ? 85 : 30,
    averageTiming,
    variance
  };
}

function validateRecentActions(state) {
  const recentActions = state.security.actionLog.slice(-10);

  // Check for impossible sequences
  const impossibleSequences = recentActions.filter((action, index) => {
    if (index === 0) return false;
    const prevAction = recentActions[index - 1];
    const timeDiff = action.timestamp - prevAction.timestamp;

    // Actions less than 10ms apart are suspicious
    return timeDiff < 10;
  });

  return {
    passed: impossibleSequences.length === 0,
    score: Math.max(0, 100 - (impossibleSequences.length * 20)),
    impossibleSequences: impossibleSequences.length
  };
}

function checkTimeConsistency(state) {
  const sessionStart = new Date(state.security.startTime);
  const now = new Date();
  const sessionDuration = now - sessionStart;

  // Check for time manipulation
  const lastAction = state.security.actionLog[state.security.actionLog.length - 1];
  if (lastAction) {
    const actionTime = new Date(lastAction.timestamp);
    const timeDrift = Math.abs(actionTime - now);

    // More than 5 minutes drift is suspicious
    const isConsistent = timeDrift < 5 * 60 * 1000;

    return {
      passed: isConsistent,
      score: isConsistent ? 95 : 20,
      timeDrift,
      sessionDuration
    };
  }

  return { passed: true, score: 100, reason: 'No actions to validate' };
}

function detectAnomalousPatterns(state) {
  const actions = state.security.actionLog || [];

  // Look for repetitive patterns that might indicate automation
  const actionTypes = actions.slice(-30).map(action => action.type);
  const patterns = findRepeatingPatterns(actionTypes);

  // Patterns longer than 5 actions repeated more than 3 times are suspicious
  const suspiciousPatterns = patterns.filter(pattern =>
    pattern.length >= 5 && pattern.repetitions >= 3
  );

  return {
    passed: suspiciousPatterns.length === 0,
    score: Math.max(0, 100 - (suspiciousPatterns.length * 30)),
    patterns: suspiciousPatterns.length
  };
}

function findRepeatingPatterns(sequence) {
  const patterns = [];

  for (let length = 3; length <= Math.floor(sequence.length / 2); length++) {
    for (let start = 0; start <= sequence.length - length * 2; start++) {
      const pattern = sequence.slice(start, start + length);
      const patternStr = pattern.join(',');

      let repetitions = 1;
      let nextStart = start + length;

      while (nextStart + length <= sequence.length) {
        const nextPattern = sequence.slice(nextStart, nextStart + length);
        if (nextPattern.join(',') === patternStr) {
          repetitions++;
          nextStart += length;
        } else {
          break;
        }
      }

      if (repetitions >= 2) {
        patterns.push({ pattern, length, repetitions, start });
      }
    }
  }

  return patterns;
}

function calculateSecurityScore(checks) {
  const scores = Object.values(checks).map(check => check.score || 0);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function determineSecurityLevel(score) {
  if (score >= 80) return 'normal';
  if (score >= 60) return 'low';
  if (score >= 40) return 'high';
  return 'critical';
}

function calculateBanDuration(reasons) {
  let baseDuration = 60 * 60 * 1000; // 1 hour

  if (reasons.criticalViolations) baseDuration *= 24; // 24 hours
  if (reasons.multipleSuspiciousActivities) baseDuration *= 2;
  if (reasons.highRiskScore) baseDuration *= 1.5;
  if (reasons.lowTrustScore) baseDuration *= 1.2;

  return Math.min(baseDuration, 7 * 24 * 60 * 60 * 1000); // Max 7 days
}

function generateSecurityRecommendations(security) {
  const recommendations = [];

  if (security.riskScore > 50) {
    recommendations.push('Reduce suspicious activity to improve security standing');
  }

  if (security.trustScore < 70) {
    recommendations.push('Engage in normal gameplay to rebuild trust score');
  }

  if (!security.verificationStatus.deviceVerified) {
    recommendations.push('Device verification failed - ensure you are using a standard browser');
  }

  if (security.suspiciousActivity.length > 5) {
    recommendations.push('Multiple security flags detected - review your gameplay patterns');
  }

  return recommendations;
} 