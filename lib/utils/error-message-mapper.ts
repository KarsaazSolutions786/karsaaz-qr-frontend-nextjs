/**
 * Centralized Error Message Mapping Service
 * Translates backend error codes and messages to user-friendly text
 */

// Error code to message mapping
// Use intersection type so known keys return `string` (not `string | undefined`)
const ERROR_MESSAGES = {
  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  PAYMENT_001: 'Please check your payment information and try again.',
  PAYMENT_002: 'Please enter a valid card number.',
  PAYMENT_003: 'Please enter a valid expiry date.',
  PAYMENT_004: 'Please enter a valid security code.',
  PAYMENT_005: 'Please enter a valid billing address.',

  // Payment processor errors
  PAYMENT_101:
    'Your card was declined. Please contact your bank or try a different payment method.',
  PAYMENT_102:
    'Insufficient funds available. Please check your account balance or use a different payment method.',
  PAYMENT_103:
    'This transaction exceeds your card limit. Please contact your bank or use a different payment method.',
  PAYMENT_104: 'This transaction has been flagged for security review. Please contact support.',
  PAYMENT_105: 'Payment processing is temporarily unavailable. Please try again later.',

  // Authentication errors
  PAYMENT_201: 'Please log in to continue.',
  PAYMENT_202: 'Your session has expired. Please log in again.',
  PAYMENT_203: 'Invalid login credentials. Please try again.',

  // Authorization errors
  PAYMENT_301: "You don't have permission to perform this action.",
  PAYMENT_302: "Your subscription doesn't include this feature.",
  PAYMENT_303: 'Please upgrade your plan to access this feature.',

  // Business logic errors
  PAYMENT_401: "You've reached your QR code limit. Please upgrade your plan.",
  PAYMENT_402: "You've reached your scan limit. Please upgrade your plan.",
  PAYMENT_403: 'This feature is not available in your current plan.',
  PAYMENT_404: 'The requested item was not found.',
  PAYMENT_405: 'This action is not allowed.',

  // Network errors
  PAYMENT_501: 'Connection error. Please check your internet connection and try again.',
  PAYMENT_502: 'Server is temporarily unavailable. Please try again later.',
  PAYMENT_503: 'Request timeout. Please try again.',

  // System errors
  PAYMENT_601: 'A system error occurred. Please contact support if the problem persists.',
  PAYMENT_602: 'Service is temporarily unavailable. Please contact support.',

  // Generic error messages
  NETWORK_ERROR: 'Connection error. Please check your internet connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  TIMEOUT_ERROR: 'The request is taking longer than expected. Please wait a moment and try again.',
  CONNECTION_TIMEOUT:
    'Connection timeout. Please check your internet connection and try again later.',
  FORBIDDEN: "You don't have permission to perform this action.",
  UNAUTHORIZED: 'Please log in to continue.',
  NOT_FOUND: 'The requested item was not found.',
  BAD_REQUEST: 'Invalid request. Please check your input and try again.',

  // Additional network errors
  CONNECTION_REFUSED: 'Unable to connect to the server. Please check your internet connection.',
  DNS_ERROR: 'Unable to reach the server. Please check your internet connection.',
  SSL_ERROR: 'Secure connection failed. Please try again.',
  CORS_ERROR: 'Cross-origin request blocked. Please contact support.',
  OFFLINE: 'You appear to be offline. Please check your internet connection.',

  // Authentication and session errors
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Invalid authentication token. Please log in again.',
  LOGIN_REQUIRED: 'Please log in to access this feature.',
  ACCOUNT_LOCKED: 'Your account has been temporarily locked. Please contact support.',
  TOO_MANY_LOGIN_ATTEMPTS: 'Too many login attempts. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  PASSWORD_EXPIRED: 'Your password has expired. Please reset your password.',

  // Authorization and permission errors
  INSUFFICIENT_PERMISSIONS: "You don't have permission to perform this action.",
  FEATURE_NOT_AVAILABLE: 'This feature is not available in your current plan.',
  SUBSCRIPTION_REQUIRED: 'A subscription is required to access this feature.',
  PLAN_UPGRADE_REQUIRED: 'Please upgrade your plan to access this feature.',
  ADMIN_ONLY: 'This action is restricted to administrators.',
  OWNER_ONLY: 'Only the owner can perform this action.',

  // Rate limiting and quota errors
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment and try again.',
  QUOTA_EXCEEDED: 'You have exceeded your usage quota. Please upgrade your plan.',
  API_LIMIT_REACHED: 'API request limit reached. Please try again later.',
  DAILY_LIMIT_EXCEEDED: 'Daily usage limit exceeded. Please try again tomorrow.',
  MONTHLY_LIMIT_EXCEEDED: 'Monthly usage limit exceeded. Please upgrade your plan.',

  // File and upload errors
  FILE_TOO_LARGE: 'File size is too large. Please choose a smaller file.',
  FILE_TYPE_NOT_SUPPORTED: 'File type not supported. Please choose a different file.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Please delete some files or upgrade your plan.',

  // Service-specific errors
  MAINTENANCE_MODE: 'The service is temporarily under maintenance. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  FEATURE_DISABLED: 'This feature is currently disabled.',
  REGION_NOT_SUPPORTED: 'This service is not available in your region.',

  // Data validation errors
  INVALID_FORMAT: 'Invalid data format. Please check your input.',
  DATA_CORRUPTION: 'Data corruption detected. Please try again.',
  PROCESSING_FAILED: 'Data processing failed. Please try again.',
  EXPORT_FAILED: 'Export failed. Please try again.',
  IMPORT_FAILED: 'Import failed. Please check your data and try again.',

  // QR Code specific errors
  QRCODE_LIMIT_REACHED:
    "You've reached your QR code limit. Please upgrade your plan or delete some existing QR codes.",
  QRCODE_NOT_FOUND: 'QR code not found. It may have been deleted.',
  QRCODE_INVALID_DATA: 'Invalid QR code data. Please check your input.',
  QRCODE_GENERATION_FAILED: 'Failed to generate QR code. Please try again.',

  // User account errors
  EMAIL_ALREADY_EXISTS: 'This email address is already registered.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long and include letters and numbers.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address to continue.',

  // Subscription errors
  SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Please renew to continue.',
  SUBSCRIPTION_CANCELLED: 'Your subscription has been cancelled.',
  PLAN_NOT_FOUND: 'The selected plan is not available.',
  UPGRADE_REQUIRED: 'Please upgrade your plan to access this feature.',
}

// Field-specific validation messages
const FIELD_SPECIFIC_MESSAGES: Record<string, Record<string, string>> = {
  email: {
    required: 'Email address is required.',
    email: 'Please enter a valid email address.',
    unique: 'This email address is already registered.',
    max: 'Email address is too long.',
  },
  password: {
    required: 'Password is required.',
    min: 'Password must be at least 8 characters long.',
    confirmed: 'Passwords do not match.',
    regex: 'Password must include letters and numbers.',
  },
  name: {
    required: 'Name is required.',
    max: 'Name is too long.',
    min: 'Name is too short.',
  },
  phone: {
    required: 'Phone number is required.',
    regex: 'Please enter a valid phone number.',
  },
  url: {
    required: 'URL is required.',
    url: 'Please enter a valid URL.',
    max: 'URL is too long.',
  },
  title: {
    required: 'Title is required.',
    max: 'Title is too long.',
  },
  description: {
    required: 'Description is required.',
    max: 'Description is too long.',
  },
}

/**
 * Get user-friendly error message from error code
 */
export function getErrorMessage(errorCode: string | null | undefined): string {
  if (!errorCode) {
    return ERROR_MESSAGES.UNKNOWN_ERROR ?? 'An unexpected error occurred.'
  }

  const upperCode = errorCode.toString().toUpperCase()
  return (ERROR_MESSAGES as Record<string, string>)[upperCode] ?? ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirst(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
}

/**
 * Get user-friendly validation error message
 */
export function getValidationMessage(field: string, rule: string, originalMessage = ''): string {
  // Check for field-specific messages first
  if (FIELD_SPECIFIC_MESSAGES[field]?.[rule]) {
    return FIELD_SPECIFIC_MESSAGES[field][rule]
  }

  // Generic validation messages based on rule
  const genericMessages: Record<string, string> = {
    required: `${capitalizeFirst(field)} is required.`,
    email: 'Please enter a valid email address.',
    min: `${capitalizeFirst(field)} is too short.`,
    max: `${capitalizeFirst(field)} is too long.`,
    unique: `This ${field} is already taken.`,
    confirmed: `${capitalizeFirst(field)} confirmation does not match.`,
    numeric: `${capitalizeFirst(field)} must be a number.`,
    integer: `${capitalizeFirst(field)} must be a whole number.`,
    url: 'Please enter a valid URL.',
    regex: `${capitalizeFirst(field)} format is invalid.`,
    in: `Please select a valid ${field}.`,
    boolean: `${capitalizeFirst(field)} must be true or false.`,
    date: `${capitalizeFirst(field)} must be a valid date.`,
    file: `Please select a valid ${field} file.`,
    image: `Please select a valid ${field} image.`,
    mimes: `${capitalizeFirst(field)} must be a valid file type.`,
    size: `${capitalizeFirst(field)} file size is invalid.`,
  }

  return genericMessages[rule] || originalMessage || `${capitalizeFirst(field)} is invalid.`
}

/**
 * Extract validation rule from error message
 */
function extractRuleFromMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('required')) return 'required'
  if (lowerMessage.includes('email')) return 'email'
  if (lowerMessage.includes('minimum') || lowerMessage.includes('at least')) return 'min'
  if (lowerMessage.includes('maximum') || lowerMessage.includes('too long')) return 'max'
  if (lowerMessage.includes('unique') || lowerMessage.includes('already')) return 'unique'
  if (lowerMessage.includes('confirmation') || lowerMessage.includes('match')) return 'confirmed'
  if (lowerMessage.includes('number') || lowerMessage.includes('numeric')) return 'numeric'
  if (lowerMessage.includes('url')) return 'url'
  if (lowerMessage.includes('format') || lowerMessage.includes('invalid')) return 'regex'

  return 'invalid'
}

/**
 * Process validation errors and return formatted message
 */
export function processValidationErrors(
  validationErrors: Record<string, string | string[]> | null | undefined
): string {
  if (!validationErrors || typeof validationErrors !== 'object') {
    return ERROR_MESSAGES.VALIDATION_ERROR
  }

  const errors: string[] = []

  for (const [field, messages] of Object.entries(validationErrors)) {
    const fieldMessages = Array.isArray(messages) ? messages : [messages]

    fieldMessages.forEach(message => {
      const rule = extractRuleFromMessage(message)
      const userMessage = getValidationMessage(field, rule, message)
      errors.push(userMessage)
    })
  }

  return errors.length > 0 ? errors.join(' ') : ERROR_MESSAGES.VALIDATION_ERROR
}

/**
 * Translate backend message to user-friendly message
 */
export function translateMessage(message: string | null | undefined): string {
  if (!message) return ERROR_MESSAGES.UNKNOWN_ERROR

  const lowerMessage = message.toLowerCase()

  const patterns: Record<string, string> = {
    'validation failed': ERROR_MESSAGES.VALIDATION_ERROR,
    unauthorized: ERROR_MESSAGES.UNAUTHORIZED,
    forbidden: ERROR_MESSAGES.FORBIDDEN,
    'not found': ERROR_MESSAGES.NOT_FOUND,
    'network error': ERROR_MESSAGES.NETWORK_ERROR,
    timeout: ERROR_MESSAGES.TIMEOUT_ERROR,
    'connection timeout': ERROR_MESSAGES.CONNECTION_TIMEOUT,
    'request timeout': ERROR_MESSAGES.TIMEOUT_ERROR,
    'signal is aborted': ERROR_MESSAGES.CONNECTION_TIMEOUT,
    abort: ERROR_MESSAGES.CONNECTION_TIMEOUT,
    'server error': ERROR_MESSAGES.SERVER_ERROR,
    'payment failed': 'Payment processing failed. Please try again.',
    'card declined': 'Your card was declined. Please try a different payment method.',
    'insufficient funds': 'Insufficient funds. Please check your account balance.',
    'limit reached': 'You have reached your limit. Please upgrade your plan.',
    'subscription expired': 'Your subscription has expired. Please renew to continue.',
    'email already exists': ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
    'invalid email': ERROR_MESSAGES.INVALID_EMAIL,
  }

  for (const [pattern, userMessage] of Object.entries(patterns)) {
    if (lowerMessage.includes(pattern)) {
      return userMessage
    }
  }

  return message
}

/**
 * Get HTTP status code message
 */
export function getHttpStatusMessage(status: number): string {
  const statusMessages: Record<number, string> = {
    400: ERROR_MESSAGES.BAD_REQUEST,
    401: ERROR_MESSAGES.UNAUTHORIZED,
    403: ERROR_MESSAGES.FORBIDDEN,
    404: ERROR_MESSAGES.NOT_FOUND,
    422: ERROR_MESSAGES.VALIDATION_ERROR,
    429: 'Too many requests. Please wait a moment and try again.',
    500: ERROR_MESSAGES.SERVER_ERROR,
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
    504: ERROR_MESSAGES.TIMEOUT_ERROR,
  }

  return statusMessages[status] || ERROR_MESSAGES.UNKNOWN_ERROR
}

interface ApiError {
  validationErrors?: Record<string, string | string[]>
  error_code?: string
  code?: string
  message?: string
  status?: number
}

/**
 * Process API error response and return user-friendly message
 */
export function processApiError(error: ApiError): string {
  // Handle validation errors
  if (error.validationErrors) {
    return processValidationErrors(error.validationErrors)
  }

  // Handle error with code
  if (error.error_code || error.code) {
    return getErrorMessage(error.error_code || error.code)
  }

  // Handle error with message
  if (error.message) {
    return translateMessage(error.message)
  }

  // Handle HTTP status codes
  if (error.status) {
    return getHttpStatusMessage(error.status)
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: Error | ApiError): boolean {
  const err = error as Error
  return (
    err.name === 'NetworkError' ||
    err.message?.toLowerCase().includes('network') ||
    err.message?.toLowerCase().includes('fetch') ||
    (typeof navigator !== 'undefined' && !navigator.onLine)
  )
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: Error | ApiError): boolean {
  const err = error as Error & { code?: string }
  return (
    err.name === 'TimeoutError' ||
    err.name === 'AbortError' ||
    err.message?.toLowerCase().includes('timeout') ||
    err.message?.toLowerCase().includes('abort') ||
    err.message?.toLowerCase().includes('signal is aborted') ||
    err.code === 'TIMEOUT' ||
    err.code === 'ABORT'
  )
}

/**
 * Check if error is a connection error
 */
export function isConnectionError(error: Error | ApiError): boolean {
  const err = error as Error
  return (
    isNetworkError(error) ||
    isTimeoutError(error) ||
    err.message?.toLowerCase().includes('connection') ||
    err.message?.toLowerCase().includes('refused')
  )
}

// Export the error messages for direct access if needed
export { ERROR_MESSAGES, FIELD_SPECIFIC_MESSAGES }
