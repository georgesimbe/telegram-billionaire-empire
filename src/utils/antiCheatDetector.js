// Optimized Anti-Cheat Detection System
import { SECURITY_CONFIG } from '../config/securityConfig.js';

class AntiCheatDetector {
  constructor() {
    this.clickTimes = [];
    this.violations = [];
    this.deviceFingerprint = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.deviceFingerprint = await this.generateDeviceFingerprint();
      this.isInitialized = true;
    } catch (error) {
      console.warn('AntiCheat initialization failed:', error);
    }
  }

  // Simplified device fingerprinting
  async generateDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = {
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      canvas: canvas.toDataURL(),
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown'
    };

    return this.hashFingerprint(fingerprint);
  }

  hashFingerprint(fingerprint) {
    const str = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32-bit integer
    }
    return hash.toString(36);
  }

  // Click rate detection
  checkClickRate() {
    const now = Date.now();
    this.clickTimes.push(now);
    
    // Keep only last second of clicks
    this.clickTimes = this.clickTimes.filter(time => now - time < 1000);
    
    if (this.clickTimes.length > SECURITY_CONFIG.ANTI_CHEAT.MAX_CLICK_RATE) {
      this.addViolation('CLICK_SPAM', { rate: this.clickTimes.length });
      return false;
    }
    
    return true;
  }

  // Detect automation tools
  detectAutomation() {
    const indicators = {
      webdriver: navigator.webdriver,
      phantom: window.phantom || window._phantom,
      selenium: window.selenium,
      chrome: !window.chrome && navigator.userAgent.includes('Chrome')
    };

    const automationDetected = Object.values(indicators).some(Boolean);
    
    if (automationDetected) {
      this.addViolation('AUTOMATION', indicators);
    }
    
    return automationDetected;
  }

  // Add security violation
  addViolation(type, metadata = {}) {
    this.violations.push({
      type,
      timestamp: Date.now(),
      metadata
    });

    // Clean old violations (keep last 24 hours)
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    this.violations = this.violations.filter(v => v.timestamp > dayAgo);
  }

  // Get risk score
  getRiskScore() {
    return this.violations.length;
  }

  // Check if user should be banned
  shouldBan() {
    return this.getRiskScore() >= SECURITY_CONFIG.ANTI_CHEAT.BAN_THRESHOLD;
  }

  // Reset violations (for testing)
  reset() {
    this.violations = [];
    this.clickTimes = [];
  }
}

export const antiCheatDetector = new AntiCheatDetector();
export default antiCheatDetector;