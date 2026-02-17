import { ApiError, ValidationError } from './error-handler';
import Cookies from 'js-cookie';
import { withRetry } from './network-retry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.100.17:8000/api';

function resolveRoute(route: string) {
  let cleanRoute = route.replace(API_BASE_URL, '');
  if (cleanRoute.startsWith('/')) {
    cleanRoute = cleanRoute.substring(1);
  }
  return `${API_BASE_URL}/${cleanRoute}`.replace(/([^:]\/)\/+/g, "$1");
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function request(route: string, options: RequestOptions = {}) {
  const { params, headers: customHeaders, body, ...rest } = options;

  let url = resolveRoute(route);

  // Append query params
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += (url.includes('?') ? '&' : '?') + searchParams.toString();
  }

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  // Auth token from Cookies (Middleware compatible) or LocalStorage fallback
  const token = Cookies.get('auth_token') || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  let finalHeaders: Record<string, string> = { ...defaultHeaders, ...(customHeaders as Record<string, string>) };

  // Handle FormData
  if (body instanceof FormData) {
    const { 'Content-Type': _, ...headersWithoutContentType } = finalHeaders;
    finalHeaders = headersWithoutContentType;
  }

  const fetchRequest = new Request(url, {
    ...rest,
    headers: finalHeaders as HeadersInit,
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  });

  const isRetryable = !rest.method || rest.method === 'GET';
  const response = isRetryable
    ? await withRetry(() => fetch(fetchRequest.clone()), { maxRetries: 2 })
    : await fetch(fetchRequest);

  // Custom event for legacy compatibility (client-side only)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('api:response-ready', { detail: { response } }));
  }

  let jsonResponse: unknown = null;
  try {
    jsonResponse = await response.clone().json();
  } catch {
    // Ignore non-json responses
  }

  // Handle Validation Errors (Laravel standard)
  if ((jsonResponse as { validationErrors?: object })?.validationErrors || (response.status === 422)) {
    throw new ValidationError({ response, request: fetchRequest, jsonResponse: (jsonResponse as { validationErrors?: object }) || { validationErrors: {} } });
  }

  // Handle API Errors
  if (!response.ok) {
    throw new ApiError({ response, request: fetchRequest });
  }

  return jsonResponse;
}

export const apiClient = {
  get: <T = any>(url: string, params?: Record<string, string | number | boolean>, options?: RequestInit): Promise<T> =>
    request(url, { ...options, method: 'GET', params }) as Promise<T>,

  post: <T = any>(url: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request(url, { ...options, method: 'POST', body: body as BodyInit }) as Promise<T>,

  put: <T = any>(url: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request(url, { ...options, method: 'PUT', body: body as BodyInit }) as Promise<T>,

  patch: <T = any>(url: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request(url, { ...options, method: 'PATCH', body: body as BodyInit }) as Promise<T>,


  delete: <T = any>(url: string, options?: RequestInit): Promise<T> =>
    request(url, { ...options, method: 'DELETE' }) as Promise<T>,

  upload: <T = any>(url: string, data: FormData): Promise<T> => {
    return request(url, { method: 'POST', body: data }) as Promise<T>;
  }
};

export default apiClient;
