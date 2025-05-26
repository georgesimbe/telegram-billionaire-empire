import React, { useEffect, useRef, useState } from 'react';
import useIntegratedGameStore from '../store/integratedGameStore';
import { antiCheatDetector } from '../utils/antiCheatDetector';

const AntiCheatWrapper = ({ children }) => {
  const logAction = useIntegratedGameStore(state => state.logAction);
  const initializeSecurity = useIntegratedGameStore(state => state.initializeSecurity);
  const getSecurityStatus = useIntegratedGameStore(state => state.getSecurityStatus);
  
  const [securityInitialized, setSecurityInitialized] = useState(false);
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  // Initialize security on mount
  useEffect(() => {
    const initSecurity = async () => {
      try {
        const deviceData = {
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        };
        
        await initializeSecurity(deviceData);
        setSecurityInitialized(true);
      } catch (error) {
        console.warn('Security initialization failed:', error);
        setSecurityInitialized(true); // Continue anyway
      }
    };
    
    initSecurity();
  }, [initializeSecurity]);

  useEffect(() => {
    if (!securityInitialized) return;

    // Click monitoring
    const handleClick = (e) => {
      const now = Date.now();
      
      // Reset click counter every second
      if (now - lastClickTime.current > 1000) {
        clickCount.current = 0;
        lastClickTime.current = now;
      }
      
      clickCount.current++;
      
      // Log click with rate limiting
      const result = logAction('CLICK', {
        clickRate: clickCount.current,
        coordinates: { x: e.clientX, y: e.clientY }
      });
      
      if (!result.allowed) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Basic DevTools detection
    const detectDevTools = () => {
      const threshold = 160;
      const devToolsOpen = 
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold;
      
      if (devToolsOpen) {
        logAction('DEV_TOOLS_DETECTED', {
          heightDiff: window.outerHeight - window.innerHeight,
          widthDiff: window.outerWidth - window.innerWidth
        });
      }
      
      // Check for automation
      antiCheatDetector.detectAutomation();
    };

    // Context menu blocking
    const handleContextMenu = (e) => {
      logAction('RIGHT_CLICK', { target: e.target.tagName });
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('click', handleClick, true);
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Periodic security checks
    const securityInterval = setInterval(detectDevTools, 2000);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(securityInterval);
    };
  }, [logAction, securityInitialized]);

  // Check if user should be banned
  const securityStatus = getSecurityStatus();
  if (securityStatus.shouldBan) {
    return (
      <div className="min-h-screen bg-red-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Account Suspended</h1>
          <p className="mb-4">Your account has been suspended due to suspicious activity.</p>
          <p className="text-sm opacity-75">Please contact support if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AntiCheatWrapper;