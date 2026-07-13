import { envConfig } from '@/lib/config/env-config'

const getAppBaseURL = () => {
  if (typeof window !== 'undefined' && (window as any).BACKEND_URL) {
    return (window as any).BACKEND_URL
  }
  return envConfig.API_URL
}

const getApiBaseURL = () => `${getAppBaseURL()}/api`


export async function getQRCodeRedirect(id: string) {
  const response = await fetch(`${getApiBaseURL()}/public/qrcodes/${id}`, {
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


export function buildQRPreviewURL(params: {
  data: any
  type: string
  design?: any
  renderText?: boolean
  id?: string
}): string {
  const { data, type, design = {}, renderText = false, id } = params
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

  const contentStr = JSON.stringify({ data, type, design })
  const hash = simpleHash(contentStr)
  queryParams.append('h', hash)

  return `${getApiBaseURL()}/qrcodes/preview?${queryParams.toString()}`
}


function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}


export async function getBusinessProfileData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch business profile')
  return response.json()
}

export async function getVCardData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch vCard')
  return response.json()
}

export async function getRestaurantMenuData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch menu')
  return response.json()
}

export async function getProductCatalogueData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch catalogue')
  return response.json()
}


export async function getBusinessReviewData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch review')
  return response.json()
}

export async function getEventData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch event')
  return response.json()
}

export async function getLeadFormData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch form')
  return response.json()
}

export async function getWebsiteData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch website')
  return response.json()
}

export async function getResumeData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch resume')
  return response.json()
}

export async function getUPIData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch UPI')
  return response.json()
}

export async function getAppDownloadData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch app')
  return response.json()
}

export async function getGoogleReviewData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch Google review data')
  return response.json()
}

export async function getPayPalData(slug: string) {
  const response = await fetch(`${getApiBaseURL()}/qrcodes/${slug}/redirect`)
  if (!response.ok) throw new Error('Failed to fetch PayPal data')
  return response.json()
}


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

export function getPublicPreviewURL(slug: string, preview = false): string {
  const base = getAppBaseURL()
  const url = `${base}/s/${slug}`
  return preview ? `${url}?preview=true` : url
}
