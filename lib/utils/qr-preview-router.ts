/**
 * QR Preview Router Utility
 * 
 * Handles dynamic routing of QR codes based on their type.
 * Detects QR type and returns the appropriate preview route.
 */

export interface QRTypeRoute {
  type: string;
  route: string;
  aliases?: string[];
}

export const QR_TYPE_ROUTES: QRTypeRoute[] = [
  { type: 'biolinks', route: '', aliases: ['biolink'] },
  { type: 'business-profile', route: '/business-profile', aliases: ['business'] },
  { type: 'vcard-plus', route: '/vcard', aliases: ['vcard', 'contact'] },
  { type: 'restaurant-menu', route: '/menu', aliases: ['menu'] },
  { type: 'product-catalogue', route: '/products', aliases: ['products', 'catalog', 'catalogue'] },
  { type: 'business-review', route: '/review', aliases: ['review', 'rating'] },
  { type: 'event', route: '/event', aliases: [] },
  { type: 'lead-form', route: '/form', aliases: ['form', 'contact-form'] },
  { type: 'website-builder', route: '/website', aliases: ['website', 'site'] },
  { type: 'resume', route: '/resume', aliases: ['cv', 'curriculum-vitae'] },
  { type: 'upi-dynamic', route: '/upi', aliases: ['upi', 'payment'] },
  { type: 'app-download', route: '/app', aliases: ['app', 'download'] },
];

/**
 * Get preview route for a QR type
 */
export function getPreviewRoute(qrType: string, slug: string): string | null {
  const normalizedType = qrType.toLowerCase().trim();

  // Find route by type or alias
  const route = QR_TYPE_ROUTES.find(
    (r) =>
      r.type === normalizedType ||
      r.aliases?.includes(normalizedType)
  );

  if (!route) {
    return null;
  }

  // Biolinks uses root path
  if (route.type === 'biolinks') {
    return `/${slug}`;
  }

  return `${route.route}/${slug}`;
}

/**
 * Check if QR type has a landing page
 */
export function hasLandingPage(qrType: string): boolean {
  return getPreviewRoute(qrType, 'test') !== null;
}

/**
 * Get all supported QR types with landing pages
 */
export function getSupportedQRTypes(): string[] {
  return QR_TYPE_ROUTES.map((r) => r.type);
}

/**
 * Check if QR type is a static redirect (URL, Email, Phone, SMS, WiFi, etc.)
 */
export function isStaticQRType(qrType: string): boolean {
  const staticTypes = [
    'url',
    'email',
    'phone',
    'sms',
    'wifi',
    'text',
    'location',
    'youtube',
    'facebook',
    'instagram',
    'twitter',
    'linkedin',
    'whatsapp',
  ];

  return staticTypes.includes(qrType.toLowerCase().trim());
}

/**
 * Build preview URL with optional preview mode
 */
export function buildPreviewUrl(
  qrType: string,
  slug: string,
  options: {
    preview?: boolean;
    baseUrl?: string;
  } = {}
): string {
  const { preview = false, baseUrl = '' } = options;

  const route = getPreviewRoute(qrType, slug);

  if (!route) {
    return `${baseUrl}/404`;
  }

  const url = `${baseUrl}${route}`;
  return preview ? `${url}?preview=true` : url;
}
