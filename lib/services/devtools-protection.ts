// DevTools Protection Service (T013)
// Per research.md R3: Block F12, Ctrl+Shift+I/J/C/U, right-click, dimension detection

const DEVTOOLS_THRESHOLD = 160;

class DevToolsProtection {
  private static instance: DevToolsProtection;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private initialized = false;

  static getInstance(): DevToolsProtection {
    if (!this.instance) this.instance = new DevToolsProtection();
    return this.instance;
  }

  private isLocalhost(): boolean {
    if (typeof window === 'undefined') return true;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  }

  /** Initialize protection - only active on non-localhost */
  init(): void {
    if (typeof window === 'undefined' || this.initialized || this.isLocalhost()) return;
    this.initialized = true;

    // Block keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyDown, true);

    // Block right-click context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault(), true);

    // Poll for dimension changes (DevTools open detection)
    this.intervalId = setInterval(() => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > DEVTOOLS_THRESHOLD || heightDiff > DEVTOOLS_THRESHOLD) {
        document.body.classList.add('devtools-open');
      } else {
        document.body.classList.remove('devtools-open');
      }
    }, 1000);
  }

  /** Cleanup event listeners and intervals */
  destroy(): void {
    if (typeof window === 'undefined') return;
    document.removeEventListener('keydown', this.handleKeyDown, true);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.initialized = false;
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault();
      return;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
      e.preventDefault();
    }
  };
}

export const devToolsProtection = DevToolsProtection.getInstance();
