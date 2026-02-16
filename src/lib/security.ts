/**
 * Security Utilities
 * Ported from legacy devtools-protection.js and iframe-detector.js
 */

export const securityUtils = {
  /**
   * Prevent the application from being embedded in an iframe (Clickjacking protection)
   */
  detectIframe: () => {
    if (typeof window === 'undefined') return;
    
    if (window.self !== window.top) {
      // If we are in an iframe, try to break out or clear body
      try {
        if (window.top) {
          window.top.location.href = window.self.location.href;
        }
      } catch (e) {
        document.body.innerHTML = "<h1>Security Warning</h1><p>This application cannot be embedded.</p>";
      }
    }
  },

  /**
   * Basic DevTools protection - discourages inspection
   */
  initDevToolsProtection: () => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'development') return;

    // Discourage right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Discourage common devtools shortcuts
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    });
  }
};

export default securityUtils;
