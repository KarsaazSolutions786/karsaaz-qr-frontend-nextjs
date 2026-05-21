// Secure Logger Service (T012)
// Per research.md R5: Environment-aware logger with production field redaction

const SENSITIVE_FIELDS = [
  'password', 'token', 'api_key', 'apiKey', 'secret', 'card_number',
  'cardNumber', 'cvv', 'ssn', 'social_security', 'email', 'phone',
  'credit_card', 'authorization', 'cookie', 'session_id', 'private_key',
  'access_token', 'refresh_token',
];

/**
 * Purpose: Checks if production.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
const isProduction = (): boolean => {
  if (typeof window === 'undefined') return process.env.NODE_ENV === 'production';
  return window.location.hostname.includes('karsaazqr.com');
};

/**
 * Purpose: Checks if debugmode.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
const isDebugMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  // Only allow debug mode in development, never in production
  if (isProduction()) return false;
  return localStorage.getItem('debug_mode') === 'true';
};

/**
 * Purpose: Executes redact functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
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

/**
 * Purpose: Class definition for SecureLogger.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
class SecureLogger {
  private static instance: SecureLogger;

  /**
   * Purpose: Retrieves instance.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static getInstance(): SecureLogger {
    if (!this.instance) this.instance = new SecureLogger();
    return this.instance;
  }

  /**
   * Purpose: Executes shouldLog functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    if (!isProduction()) return true;
    if (level === 'error') return true;
    return isDebugMode();
  }

  /**
   * Purpose: Executes sanitize functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  private sanitize(args: unknown[]): unknown[] {
    if (!isProduction()) return args;
    return args.map((arg) =>
      typeof arg === 'object' && arg !== null ? redact(arg) : arg
    );
  }

  /**
   * Purpose: Executes debug functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  debug(...args: unknown[]): void {
    if (!this.shouldLog('debug')) return;
    console.debug('[DEBUG]', ...this.sanitize(args));
  }

  /**
   * Purpose: Executes info functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  info(...args: unknown[]): void {
    if (!this.shouldLog('info')) return;
    console.info('[INFO]', ...this.sanitize(args));
  }

  /**
   * Purpose: Executes warn functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  warn(...args: unknown[]): void {
    if (!this.shouldLog('warn')) return;
    console.warn('[WARN]', ...this.sanitize(args));
  }

  /**
   * Purpose: Executes error functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  error(...args: unknown[]): void {
    if (!this.shouldLog('error')) return;
    console.error('[ERROR]', ...this.sanitize(args));
  }

}

export const secureLogger = SecureLogger.getInstance();
