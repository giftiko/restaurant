import { API_BASE } from './menu';

/** Read a cookie by name (used to echo Django's csrftoken back on writes). */
export function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Make sure a csrftoken cookie exists, then return it. Called only for unsafe
 * requests; the value is re-read every time because Django rotates the token
 * when a session logs in.
 */
export async function ensureCsrfToken(): Promise<string> {
  const existing = readCookie('csrftoken');
  if (existing) return existing;
  try {
    await fetch(`${API_BASE}/auth/csrf`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
  } catch {
    /* offline; the write will fail and fall back to local state */
  }
  return readCookie('csrftoken') || '';
}

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];

/** An API error that keeps the HTTP status so callers can branch on 401/403. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * `fetch` wrapper for the Django API: always sends the session cookie and
 * attaches the CSRF header Django's session auth requires on writes.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((init.headers as Record<string, string>) || {}),
  };
  if (init.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (!SAFE_METHODS.includes(method)) {
    const token = await ensureCsrfToken();
    if (token) headers['X-CSRFToken'] = token;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    method,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let detail = `${method} ${path} responded ${response.status}`;
    try {
      const data = await response.json();
      if (data?.detail) detail = data.detail;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(detail, response.status);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
