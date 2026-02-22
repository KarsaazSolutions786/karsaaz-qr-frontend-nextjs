// iframe Detector Service (T018)
// Per research.md R10: Check framing, blur overlay, respect config

class IframeDetector {
  private static instance: IframeDetector;
  private overlayElement: HTMLElement | null = null;

  static getInstance(): IframeDetector {
    if (!this.instance) this.instance = new IframeDetector();
    return this.instance;
  }

  /** Check if page is loaded inside an iframe with hostname mismatch */
  isFramed(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      if (window.parent === window) return false;
      // Check hostname mismatch
      const parentHostname = window.parent.location.hostname;
      return parentHostname !== window.location.hostname;
    } catch {
      // Cross-origin: parent access blocked → framed by different origin
      return window.parent !== window;
    }
  }

  /** Initialize detection and show overlay if framed */
  init(allowIframeEmbed = false): void {
    if (typeof window === 'undefined' || allowIframeEmbed) return;
    if (!this.isFramed()) return;

    // Apply blur to all content
    document.body.style.filter = 'blur(10px)';
    document.body.style.pointerEvents = 'none';

    // Create overlay
    this.overlayElement = document.createElement('div');
    this.overlayElement.id = 'iframe-detector-overlay';
    Object.assign(this.overlayElement.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '999999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.85)',
      color: 'white',
      fontSize: '18px',
      textAlign: 'center',
      padding: '20px',
    });
    this.overlayElement.innerHTML = `
      <div>
        <p style="margin-bottom:16px">This content cannot be displayed in an iframe.</p>
        <a href="${window.location.href}" target="_blank" rel="noopener"
           style="color:#60a5fa;text-decoration:underline">
          Open in a new tab
        </a>
      </div>
    `;
    document.body.appendChild(this.overlayElement);
  }

  /** Cleanup overlay */
  destroy(): void {
    if (typeof window === 'undefined') return;
    document.body.style.filter = '';
    document.body.style.pointerEvents = '';
    if (this.overlayElement) {
      this.overlayElement.remove();
      this.overlayElement = null;
    }
  }
}

export const iframeDetector = IframeDetector.getInstance();
