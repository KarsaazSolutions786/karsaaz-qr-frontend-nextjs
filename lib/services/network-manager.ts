// Network Manager Service (T014)
// Per research.md R6: online/offline, effectiveType, slow connections

type ConnectionType = '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
type NetworkEventHandler = (status: { isOnline: boolean; connectionType: ConnectionType; isSlow: boolean }) => void;

class NetworkManager {
  private static instance: NetworkManager;
  private listeners: NetworkEventHandler[] = [];

  static getInstance(): NetworkManager {
    if (!this.instance) this.instance = new NetworkManager();
    return this.instance;
  }

  get isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  get connectionType(): ConnectionType {
    if (typeof navigator === 'undefined') return 'unknown';
    const conn = (navigator as any).connection;
    if (!conn) return 'unknown';
    return (conn.effectiveType as ConnectionType) || 'unknown';
  }

  get isSlow(): boolean {
    if (typeof navigator === 'undefined') return false;
    const conn = (navigator as any).connection;
    if (!conn) return false;
    const type = conn.effectiveType;
    if (type === 'slow-2g' || type === '2g') return true;
    return (conn.downlink ?? Infinity) < 1;
  }

  /** Get current network status snapshot */
  getStatus() {
    return {
      isOnline: this.isOnline,
      connectionType: this.connectionType,
      isSlow: this.isSlow,
    };
  }

  /** Subscribe to network changes */
  subscribe(handler: NetworkEventHandler): () => void {
    this.listeners.push(handler);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== handler);
    };
  }

  /** Initialize event listeners */
  init(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', this.notify);
    window.addEventListener('offline', this.notify);
    const conn = (navigator as any).connection;
    if (conn) conn.addEventListener('change', this.notify);
  }

  /** Cleanup listeners */
  destroy(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('online', this.notify);
    window.removeEventListener('offline', this.notify);
    const conn = (navigator as any).connection;
    if (conn) conn.removeEventListener('change', this.notify);
  }

  private notify = (): void => {
    const status = this.getStatus();
    this.listeners.forEach((fn) => fn(status));
  };
}

export const networkManager = NetworkManager.getInstance();
