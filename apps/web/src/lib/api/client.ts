import { env } from '@/lib/utils/env';
import { isDemoMode, mockApiResponse } from './demo';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  correlationId?: string;
}

export class ApiClientError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, string[]>;
  public correlationId?: string;

  constructor(status: number, error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = error.code;
    this.details = error.details;
    this.correlationId = error.correlationId;
  }
}

function generateCorrelationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') ?? null;
}

export function getApiUrl(path: string): string {
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuthRedirect?: boolean;
}

export async function apiClient<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, skipAuthRedirect = false, ...init } = options;

  // Demo mode: return mock data without hitting the backend
  if (isDemoMode()) {
    return mockApiResponse(endpoint, { method: init.method, params }) as T;
  }

  let url = getApiUrl(endpoint);

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const correlationId = generateCorrelationId();
  const csrfToken = getCsrfToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Correlation-ID': correlationId,
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    ...customHeaders,
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
      credentials: 'include',
    });
  } catch (err) {
    throw new ApiClientError(0, {
      code: 'NETWORK_ERROR',
      message: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
      correlationId,
    });
  }

  if (response.status === 401 && !skipAuthRedirect) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiClientError(401, {
      code: 'UNAUTHORIZED',
      message: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
      correlationId,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let body: unknown;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    const errorBody = body as ApiError | null;
    throw new ApiClientError(response.status, {
      code: errorBody?.code ?? 'UNKNOWN_ERROR',
      message: errorBody?.message ?? `Beklenmeyen bir hata oluştu (HTTP ${response.status})`,
      details: errorBody?.details,
      correlationId,
    });
  }

  return body as T;
}

export async function apiGet<T = unknown>(endpoint: string, params?: RequestOptions['params']): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET', params });
}

export async function apiPost<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPatch<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' });
}
