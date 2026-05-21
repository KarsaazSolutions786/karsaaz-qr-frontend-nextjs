/**
 * Public QR Code API Endpoints
 *
 * These endpoints are used by public preview/landing pages
 * and don't require authentication.
 */

import { envConfig } from '@/lib/config/env-config'

/**
 * Purpose: Retrieves appbaseurl.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
const getAppBaseURL = () => {
  if (typeof window !== 'undefined' && (window as any).BACKEND_URL) {
    return (window as any).BACKEND_URL
  }
  return envConfig.API_URL
}

/**
 * Purpose: Retrieves apibaseurl.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
const getApiBaseURL = () => `${getAppBaseURL()}/api`

/**
 * Purpose: Get QR code redirect data by ID Used to fetch QR code data for public preview
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function getQRCodeRedirect(id: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${id}/redirect`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch QR code')
  }

  return response.json()
}

/**
 * Purpose: Build QR code preview URL Matches the Lit frontend QRCodePreviewUrlBuilder
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function buildQRPreviewURL(params: {
  data: any
  type: string
  design?: any
  renderText?: boolean
  id?: string
}): string {
  const { data, type, design = {}, renderText = false, id } = params

  // Build query string (matches Lit frontend implementation)
  const queryParams = new URLSearchParams()

  queryParams.append('data', JSON.stringify(data))
  queryParams.append('type', type)
  queryParams.append('design', JSON.stringify(design))

  if (renderText) {
    queryParams.append('renderText', 'true')
  }

  if (id) {
    queryParams.append('id', id)
  }

  // Content hash for cache busting (simple version)
  const contentStr = JSON.stringify({ data, type, design })
  const hash = simpleHash(contentStr)
  queryParams.append('h', hash)

  return `${getApiBaseURL()}/qrcodes/preview?${queryParams.toString()}`
}

/**
 * Purpose: Simple hash function for cache busting
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Purpose: Fetch data for specific QR types These match the backend structure exactly
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */


export async function getBusinessProfileData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch business profile')
  return response.json()
}

/**
 * Purpose: Retrieves vcarddata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getVCardData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch vCard')
  return response.json()
}

/**
 * Purpose: Retrieves restaurantmenudata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getRestaurantMenuData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch menu')
  return response.json()
}

/**
 * Purpose: Retrieves productcataloguedata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getProductCatalogueData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch catalogue')
  return response.json()
}

/**
 * Purpose: Retrieves businessreviewdata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getBusinessReviewData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch review')
  return response.json()
}

/**
 * Purpose: Retrieves eventdata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getEventData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch event')
  return response.json()
}

/**
 * Purpose: Retrieves leadformdata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getLeadFormData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch form')
  return response.json()
}

/**
 * Purpose: Retrieves websitedata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getWebsiteData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch website')
  return response.json()
}

/**
 * Purpose: Retrieves resumedata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getResumeData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch resume')
  return response.json()
}

/**
 * Purpose: Retrieves upidata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getUPIData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch UPI')
  return response.json()
}

/**
 * Purpose: Retrieves appdownloaddata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getAppDownloadData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch app')
  return response.json()
}

/**
 * Purpose: Retrieves googlereviewdata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export async function getGoogleReviewData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch Google review data')
  return response.json()
}

/**
 * Purpose: Retrieves paypaldata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export async function getPayPalData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch PayPal data')
  return response.json()
}

/**
 * Purpose: Submit review (for business-review type)
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export async function submitReview(
  slug: string,
  data: {
    rating: number
    name: string
    email?: string
    comment?: string
  }
) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to submit review')
  }

  return response.json()
}

/**
 * Purpose: Submit lead form
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function submitLeadForm(slug: string, data: Record<string, any>) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to submit form')
  }

  return response.json()
}

/**
 * Purpose: Track QR code scan/view (analytics)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
    })
  } catch (error) {
    // Silently fail - analytics shouldn't break user experience
    console.debug('Failed to track view:', error)
  }
}

/**
 * Purpose: Get public route for QR code preview
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getPublicPreviewURL(slug: string, preview = false): string {
  const base = getAppBaseURL()
  const url = `${base}/s/${slug}`
  return preview ? `${url}?preview=true` : url
}
