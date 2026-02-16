import { ApiError, ValidationError } from './error-handler';
import Cookies from 'js-cookie';

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

  const finalHeaders = { ...defaultHeaders, ...customHeaders };

  // Handle FormData
  if (body instanceof FormData) {
    delete (finalHeaders as any)['Content-Type'];
  }

  const fetchRequest = new Request(url, {
    ...rest,
    headers: finalHeaders,
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  });

  const response = await fetch(fetchRequest);

  // Custom event for legacy compatibility (client-side only)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('api:response-ready', { detail: { response } }));
  }

  let jsonResponse: any = null;
  try {
    jsonResponse = await response.clone().json();
  } catch {
    // Ignore non-json responses
  }

  // Handle Validation Errors (Laravel standard)
  if (jsonResponse?.validationErrors || (response.status === 422)) {
    throw new ValidationError({ response, request: fetchRequest, jsonResponse: jsonResponse || { validationErrors: {} } });
  }

  // Handle API Errors
  if (!response.ok) {
    throw new ApiError({ response, request: fetchRequest });
  }

  return jsonResponse;
}

export const apiClient = {
  get: (url: string, params?: Record<string, any>, options?: RequestInit) => 
    request(url, { ...options, method: 'GET', params }),
  
  post: (url: string, body?: any, options?: RequestInit) => 
    request(url, { ...options, method: 'POST', body }),
  
  put: (url: string, body?: any, options?: RequestInit) => 
    request(url, { ...options, method: 'PUT', body }),
  
  patch: (url: string, body?: any, options?: RequestInit) => 
    request(url, { ...options, method: 'PATCH', body }),
  
  delete: (url: string, options?: RequestInit) => 
    request(url, { ...options, method: 'DELETE' }),

  upload: (url: string, data: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    return request(url, { method: 'POST', body: formData });
  }
};

export default apiClient;
