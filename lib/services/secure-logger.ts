// Secure Logger Service (T012)
// Per research.md R5: Environment-aware logger with production field redaction

const SENSITIVE_FIELDS = [
  'password', 'token', 'api_key', 'apiKey', 'secret', 'card_number',
  'cardNumber', 'cvv', 'ssn', 'social_security', 'email', 'phone',
  'credit_card', 'authorization', 'cookie', 'session_id', 'private_key',
  'access_token', 'refresh_token',
];

const isProduction = (): boolean => {
  if (typeof window === 'undefined') return process.env.NODE_ENV === 'production';
  return window.location.hostname.includes('karsaazqr.com');
};

const isDebugMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('debug_mode') === 'true';
};

function redact(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(redact);

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f.toLowerCase()))) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = redact(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

class SecureLogger {
  private static instance: SecureLogger;

  static getInstance(): SecureLogger {
    if (!this.instance) this.instance = new SecureLogger();
    return this.instance;
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    if (!isProduction()) return true;
    if (level === 'error') return true;
    return isDebugMode();
  }

  private sanitize(args: unknown[]): unknown[] {
    if (!isProduction()) return args;
    return args.map((arg) =>
      typeof arg === 'object' && arg !== null ? redact(arg) : arg
    );
  }

  debug(...args: unknown[]): void {
    if (!this.shouldLog('debug')) return;
    console.debug('[DEBUG]', ...this.sanitize(args));
  }

  info(...args: unknown[]): void {
    if (!this.shouldLog('info')) return;
    console.info('[INFO]', ...this.sanitize(args));
  }

  warn(...args: unknown[]): void {
    if (!this.shouldLog('warn')) return;
    console.warn('[WARN]', ...this.sanitize(args));
  }

  error(...args: unknown[]): void {
    if (!this.shouldLog('error')) return;
    console.error('[ERROR]', ...this.sanitize(args));
  }

  /** Enable debug mode (admin-only, saved to localStorage) */
  enableDebug(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('debug_mode', 'true');
    }
  }

  /** Disable debug mode */
  disableDebug(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('debug_mode');
    }
  }
}

export const secureLogger = SecureLogger.getInstance();
