// API client — thin fetch wrapper for appointment-service
// Base URL is injected at build time or defaults to relative path

const API_BASE = '';

interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH';
  path: string;
  body?: unknown;
  signal?: AbortSignal;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
}

export async function apiRequest<T>(options: RequestOptions): Promise<T> {
  const url = `${API_BASE}${options.path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const response = await fetch(url, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    let errorBody: { code?: string; message?: string } = {};
    try {
      errorBody = await response.json();
    } catch {
      // response body is not JSON
    }
    const apiError: ApiError = {
      status: response.status,
      code: errorBody.code ?? `HTTP_${response.status}`,
      message: errorBody.message ?? response.statusText,
    };
    throw apiError;
  }

  if (options.method === 'DELETE' && response.status === 204) {
    return {} as T;
  }

  const data: T = await response.json();
  return data;
}
