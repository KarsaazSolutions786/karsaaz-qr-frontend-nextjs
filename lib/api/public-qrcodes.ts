/**
 * Public QR Code API Endpoints
 * 
 * These endpoints are used by public preview/landing pages
 * and don't require authentication.
 */

const getAppBaseURL = () => {
  if (typeof window !== 'undefined' && (window as any).BACKEND_URL) {
    return (window as any).BACKEND_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://app.karsaazqr.com';
};

const getApiBaseURL = () => `${getAppBaseURL()}/api`;

/**
 * Get QR code redirect data by ID
 * Used to fetch QR code data for public preview
 */
export async function getQRCodeRedirect(id: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${id}/redirect`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch QR code');
  }

  return response.json();
}

/**
 * Build QR code preview URL
 * Matches the Lit frontend QRCodePreviewUrlBuilder
 */
export function buildQRPreviewURL(params: {
  data: any;
  type: string;
  design?: any;
  renderText?: boolean;
  id?: string;
}): string {
  const { data, type, design = {}, renderText = false, id } = params;

  // Build query string (matches Lit frontend implementation)
  const queryParams = new URLSearchParams();
  
  queryParams.append('data', JSON.stringify(data));
  queryParams.append('type', type);
  queryParams.append('design', JSON.stringify(design));
  
  if (renderText) {
    queryParams.append('renderText', 'true');
  }
  
  if (id) {
    queryParams.append('id', id);
  }

  // Content hash for cache busting (simple version)
  const contentStr = JSON.stringify({ data, type, design });
  const hash = simpleHash(contentStr);
  queryParams.append('h', hash);

  return `${getApiBaseURL()}/qrcodes/preview?${queryParams.toString()}`;
}

/**
 * Simple hash function for cache busting
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Fetch data for specific QR types
 * These match the backend structure exactly
 */

export async function getBusinessProfileData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch business profile');
  return response.json();
}

export async function getVCardData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch vCard');
  return response.json();
}

export async function getRestaurantMenuData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch menu');
  return response.json();
}

export async function getProductCatalogueData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch catalogue');
  return response.json();
}

export async function getBusinessReviewData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch review');
  return response.json();
}

export async function getEventData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch event');
  return response.json();
}

export async function getLeadFormData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch form');
  return response.json();
}

export async function getWebsiteData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch website');
  return response.json();
}

export async function getResumeData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch resume');
  return response.json();
}

export async function getUPIData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch UPI');
  return response.json();
}

export async function getAppDownloadData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`);
  if (!response.ok) throw new Error('Failed to fetch app');
  return response.json();
}

/**
 * Submit review (for business-review type)
 */
export async function submitReview(slug: string, data: {
  rating: number;
  name: string;
  email?: string;
  comment?: string;
}) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit review');
  }

  return response.json();
}

/**
 * Submit lead form
 */
export async function submitLeadForm(slug: string, data: Record<string, any>) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit form');
  }

  return response.json();
}

/**
 * Track QR code scan/view (analytics)
 */
export async function trackQRView(slug: string) {
  try {
    // This is fire-and-forget analytics, don't await or throw errors
    fetch(`${getApiBaseURL()}/qrcodes/${slug}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        timestamp: new Date().toISOString(),
      }),
      keepalive: true, // Important: ensure request completes even if page is closed
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break user experience
    console.debug('Failed to track view:', error);
  }
}

/**
 * Get public route for QR code preview
 */
export function getPublicPreviewURL(slug: string, preview = false): string {
  const base = getAppBaseURL();
  const url = `${base}/s/${slug}`;
  return preview ? `${url}?preview=true` : url;
}
