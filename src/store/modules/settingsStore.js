/**
 * Settings Store Module
 * Manages user preferences, game settings, and configuration
 */
export const createSettingsStore = (set, get) => ({
  // Settings State
  settings: {
    // Game Preferences
    notifications: true,
    autoSave: true,
    difficulty: 'normal', // easy, normal, hard, expert
    currency: 'USD',
    language: 'en',
    theme: 'dark', // light, dark, auto

    // Display Settings
    showAnimations: true,
    showParticles: true,
    reducedMotion: false,
    fontSize: 'medium', // small, medium, large
    colorBlind: false,
    highContrast: false,

    // Audio Settings
    soundEnabled: true,
    musicEnabled: true,
    soundVolume: 0.7,
    musicVolume: 0.5,

    // Gameplay Settings
    autoAdvanceTime: true,
    fastAnimations: false,
    showTutorials: true,
    confirmActions: true,
    showHints: true,

    // Privacy Settings
    analytics: true,
    crashReporting: true,
    personalizedAds: false,
    dataSharing: false,

    // Advanced Settings
    debugMode: false,
    developerMode: false,
    experimentalFeatures: false,
    betaFeatures: false,

    // Notification Preferences
    notificationTypes: {
      dailyRewards: true,
      businessUpdates: true,
      stakingRewards: true,
      achievements: true,
      economicEvents: true,
      governanceVotes: true,
      socialUpdates: false,
      marketingMessages: false
    },

    // Performance Settings
    maxFPS: 60,
    renderQuality: 'high', // low, medium, high, ultra
    backgroundProcessing: true,

    // Backup Settings
    cloudSave: true,
    autoBackup: true,
    backupFrequency: 'daily', // hourly, daily, weekly

    lastUpdated: new Date(),
    version: '2.0.1'
  },

  // Settings Actions
  updateSettings: (updates) => set((state) => ({
    settings: {
      ...state.settings,
      ...updates,
      lastUpdated: new Date()
    }
  })),

  /**
   * Update a specific setting
   */
  updateSetting: (key, value) => set((state) => ({
    settings: {
      ...state.settings,
      [key]: value,
      lastUpdated: new Date()
    }
  })),

  /**
   * Update notification preferences
   */
  updateNotificationSetting: (type, enabled) => set((state) => ({
    settings: {
      ...state.settings,
      notificationTypes: {
        ...state.settings.notificationTypes,
        [type]: enabled
      },
      lastUpdated: new Date()
    }
  })),

  /**
   * Reset settings to default values
   */
  resetSettings: () => set((state) => ({
    settings: {
      ...getDefaultSettings(),
      lastUpdated: new Date()
    }
  })),

  /**
   * Reset specific category of settings
   */
  resetSettingsCategory: (category) => {
    const defaults = getDefaultSettings();
    const categorySettings = getCategorySettings(defaults, category);

    set((state) => ({
      settings: {
        ...state.settings,
        ...categorySettings,
        lastUpdated: new Date()
      }
    }));
  },

  /**
   * Import settings from backup
   */
  importSettings: (settingsData) => {
    try {
      const validatedSettings = validateSettings(settingsData);

      set((state) => ({
        settings: {
          ...state.settings,
          ...validatedSettings,
          lastUpdated: new Date()
        }
      }));

      return { success: true, message: 'Settings imported successfully' };
    } catch (error) {
      return { success: false, message: `Failed to import settings: ${error.message}` };
    }
  },

  /**
   * Export current settings
   */
  exportSettings: () => {
    const state = get();
    return {
      settings: state.settings,
      exportDate: new Date(),
      version: state.settings.version
    };
  },

  /**
   * Get settings by category
   */
  getSettingsByCategory: (category) => {
    const state = get();
    return getCategorySettings(state.settings, category);
  },

  /**
   * Apply theme settings
   */
  applyTheme: (theme) => {
    set((state) => ({
      settings: {
        ...state.settings,
        theme,
        lastUpdated: new Date()
      }
    }));

    // Apply theme to document
    applyThemeToDocument(theme);

    return { success: true, theme };
  },

  /**
   * Toggle accessibility features
   */
  toggleAccessibility: (feature, enabled) => {
    const accessibilitySettings = {
      reducedMotion: enabled,
      highContrast: feature === 'highContrast' ? enabled : undefined,
      colorBlind: feature === 'colorBlind' ? enabled : undefined,
      fontSize: feature === 'fontSize' ? enabled : undefined
    };

    // Remove undefined values
    Object.keys(accessibilitySettings).forEach(key => {
      if (accessibilitySettings[key] === undefined) {
        delete accessibilitySettings[key];
      }
    });

    set((state) => ({
      settings: {
        ...state.settings,
        ...accessibilitySettings,
        lastUpdated: new Date()
      }
    }));

    // Apply accessibility changes to document
    applyAccessibilityToDocument(accessibilitySettings);
  },

  /**
   * Update performance settings
   */
  updatePerformanceSettings: (performanceLevel) => {
    const performancePresets = {
      low: {
        maxFPS: 30,
        renderQuality: 'low',
        showAnimations: false,
        showParticles: false,
        backgroundProcessing: false
      },
      medium: {
        maxFPS: 45,
        renderQuality: 'medium',
        showAnimations: true,
        showParticles: false,
        backgroundProcessing: true
      },
      high: {
        maxFPS: 60,
        renderQuality: 'high',
        showAnimations: true,
        showParticles: true,
        backgroundProcessing: true
      },
      ultra: {
        maxFPS: 120,
        renderQuality: 'ultra',
        showAnimations: true,
        showParticles: true,
        backgroundProcessing: true
      }
    };

    const preset = performancePresets[performanceLevel];
    if (!preset) return { success: false, message: 'Invalid performance level' };

    set((state) => ({
      settings: {
        ...state.settings,
        ...preset,
        lastUpdated: new Date()
      }
    }));

    return { success: true, performanceLevel, settings: preset };
  },

  /**
   * Get recommended settings based on device capabilities
   */
  getRecommendedSettings: () => {
    const deviceInfo = getDeviceCapabilities();
    const recommendations = {};

    // Performance recommendations
    if (deviceInfo.isLowEnd) {
      recommendations.performanceLevel = 'low';
      recommendations.showParticles = false;
      recommendations.maxFPS = 30;
    } else if (deviceInfo.isMobile) {
      recommendations.performanceLevel = 'medium';
      recommendations.maxFPS = 45;
    } else {
      recommendations.performanceLevel = 'high';
      recommendations.maxFPS = 60;
    }

    // Accessibility recommendations
    if (deviceInfo.prefersReducedMotion) {
      recommendations.reducedMotion = true;
      recommendations.showAnimations = false;
    }

    if (deviceInfo.prefersDarkMode) {
      recommendations.theme = 'dark';
    }

    return recommendations;
  },

  /**
   * Validate and sanitize settings
   */
  validateCurrentSettings: () => {
    const state = get();
    try {
      const validatedSettings = validateSettings(state.settings);

      // Update if any settings were corrected
      if (JSON.stringify(validatedSettings) !== JSON.stringify(state.settings)) {
        set((state) => ({
          settings: {
            ...validatedSettings,
            lastUpdated: new Date()
          }
        }));

        return {
          success: true,
          message: 'Settings validated and corrected',
          corrected: true
        };
      }

      return { success: true, message: 'Settings are valid', corrected: false };
    } catch (error) {
      return { success: false, message: `Settings validation failed: ${error.message}` };
    }
  },

  /**
   * Get settings summary for display
   */
  getSettingsSummary: () => {
    const state = get();
    const { settings } = state;

    return {
      gameSettings: {
        difficulty: settings.difficulty,
        autoSave: settings.autoSave,
        notifications: settings.notifications
      },
      displaySettings: {
        theme: settings.theme,
        animations: settings.showAnimations,
        language: settings.language
      },
      accessibilitySettings: {
        reducedMotion: settings.reducedMotion,
        highContrast: settings.highContrast,
        fontSize: settings.fontSize
      },
      privacySettings: {
        analytics: settings.analytics,
        dataSharing: settings.dataSharing
      },
      lastUpdated: settings.lastUpdated,
      version: settings.version
    };
  }
});

// Helper functions
function getDefaultSettings() {
  return {
    notifications: true,
    autoSave: true,
    difficulty: 'normal',
    currency: 'USD',
    language: 'en',
    theme: 'dark',
    showAnimations: true,
    showParticles: true,
    reducedMotion: false,
    fontSize: 'medium',
    colorBlind: false,
    highContrast: false,
    soundEnabled: true,
    musicEnabled: true,
    soundVolume: 0.7,
    musicVolume: 0.5,
    autoAdvanceTime: true,
    fastAnimations: false,
    showTutorials: true,
    confirmActions: true,
    showHints: true,
    analytics: true,
    crashReporting: true,
    personalizedAds: false,
    dataSharing: false,
    debugMode: false,
    developerMode: false,
    experimentalFeatures: false,
    betaFeatures: false,
    notificationTypes: {
      dailyRewards: true,
      businessUpdates: true,
      stakingRewards: true,
      achievements: true,
      economicEvents: true,
      governanceVotes: true,
      socialUpdates: false,
      marketingMessages: false
    },
    maxFPS: 60,
    renderQuality: 'high',
    backgroundProcessing: true,
    cloudSave: true,
    autoBackup: true,
    backupFrequency: 'daily',
    version: '2.0.1'
  };
}

function getCategorySettings(settings, category) {
  const categories = {
    game: ['difficulty', 'autoSave', 'notifications', 'currency', 'language'],
    display: ['theme', 'showAnimations', 'showParticles', 'fontSize'],
    accessibility: ['reducedMotion', 'highContrast', 'colorBlind'],
    audio: ['soundEnabled', 'musicEnabled', 'soundVolume', 'musicVolume'],
    gameplay: ['autoAdvanceTime', 'fastAnimations', 'showTutorials', 'confirmActions', 'showHints'],
    privacy: ['analytics', 'crashReporting', 'personalizedAds', 'dataSharing'],
    advanced: ['debugMode', 'developerMode', 'experimentalFeatures', 'betaFeatures'],
    performance: ['maxFPS', 'renderQuality', 'backgroundProcessing'],
    backup: ['cloudSave', 'autoBackup', 'backupFrequency']
  };

  const categoryKeys = categories[category] || [];
  const categorySettings = {};

  categoryKeys.forEach(key => {
    if (settings[key] !== undefined) {
      categorySettings[key] = settings[key];
    }
  });

  return categorySettings;
}

function validateSettings(settings) {
  const validated = { ...settings };

  // Validate enums
  const validDifficulties = ['easy', 'normal', 'hard', 'expert'];
  if (!validDifficulties.includes(validated.difficulty)) {
    validated.difficulty = 'normal';
  }

  const validThemes = ['light', 'dark', 'auto'];
  if (!validThemes.includes(validated.theme)) {
    validated.theme = 'dark';
  }

  const validFontSizes = ['small', 'medium', 'large'];
  if (!validFontSizes.includes(validated.fontSize)) {
    validated.fontSize = 'medium';
  }

  // Validate numbers
  validated.soundVolume = Math.max(0, Math.min(1, validated.soundVolume || 0.7));
  validated.musicVolume = Math.max(0, Math.min(1, validated.musicVolume || 0.5));
  validated.maxFPS = Math.max(15, Math.min(240, validated.maxFPS || 60));

  // Validate booleans
  const booleanSettings = [
    'notifications', 'autoSave', 'showAnimations', 'showParticles',
    'reducedMotion', 'colorBlind', 'highContrast', 'soundEnabled',
    'musicEnabled', 'autoAdvanceTime', 'fastAnimations', 'showTutorials',
    'confirmActions', 'showHints', 'analytics', 'crashReporting',
    'personalizedAds', 'dataSharing', 'debugMode', 'developerMode',
    'experimentalFeatures', 'betaFeatures', 'backgroundProcessing',
    'cloudSave', 'autoBackup'
  ];

  booleanSettings.forEach(setting => {
    if (typeof validated[setting] !== 'boolean') {
      validated[setting] = getDefaultSettings()[setting];
    }
  });

  return validated;
}

function applyThemeToDocument(theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }
}

function applyAccessibilityToDocument(settings) {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;

    if (settings.reducedMotion !== undefined) {
      root.style.setProperty('--animation-duration', settings.reducedMotion ? '0s' : '');
    }

    if (settings.highContrast !== undefined) {
      root.classList.toggle('high-contrast', settings.highContrast);
    }

    if (settings.fontSize !== undefined) {
      root.setAttribute('data-font-size', settings.fontSize);
    }
  }
}

function getDeviceCapabilities() {
  const capabilities = {
    isLowEnd: false,
    isMobile: false,
    prefersReducedMotion: false,
    prefersDarkMode: false
  };

  if (typeof window !== 'undefined') {
    // Check if mobile
    capabilities.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Check for low-end device indicators
    capabilities.isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;

    // Check user preferences
    capabilities.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    capabilities.prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return capabilities;
} 