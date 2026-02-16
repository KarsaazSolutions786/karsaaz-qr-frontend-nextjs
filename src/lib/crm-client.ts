/**
 * CRM API Client
 * Connects to the Karsaaz EBS CRM at crmapp.karsaazebs.com
 * Used for: Support Tickets, Referrals, Withdrawals
 */

const CRM_BASE_URL = process.env.NEXT_PUBLIC_CRM_URL || 'https://crmapp.karsaazebs.com/api';
const CRM_TOKEN = process.env.NEXT_PUBLIC_CRM_TOKEN || '';

async function crmRequest(route: string, options: RequestInit & { params?: Record<string, string> } = {}) {
  const { params, headers: customHeaders, body, ...rest } = options;

  let url = `${CRM_BASE_URL}${route.startsWith('/') ? route : `/${route}`}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += (url.includes('?') ? '&' : '?') + searchParams.toString();
  }

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (CRM_TOKEN) {
    defaultHeaders['Authorization'] = `Bearer ${CRM_TOKEN}`;
  }

  // Don't set Content-Type for FormData
  if (!(body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const finalHeaders = { ...defaultHeaders, ...customHeaders };

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  });

  let jsonResponse: any = null;
  try {
    jsonResponse = await response.json();
  } catch {
    // Ignore non-json responses
  }

  if (!response.ok) {
    console.error('CRM API Error:', jsonResponse || response.statusText);
    throw new Error(jsonResponse?.message || `CRM API Error: ${response.status}`);
  }

  return jsonResponse;
}

export const crmClient = {
  get: (url: string, params?: Record<string, any>) =>
    crmRequest(url, { method: 'GET', params: params ? Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) : undefined }),

  post: (url: string, body?: any) =>
    crmRequest(url, {
      method: 'POST',
      body,
    }),

  put: (url: string, body?: any) =>
    crmRequest(url, { method: 'PUT', body }),

  delete: (url: string) =>
    crmRequest(url, { method: 'DELETE' }),
};

export default crmClient;
