import { apiFetch } from './client';

/** The account shape the Django API returns after login/register. */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  isStaff: boolean;
  isSuperuser: boolean;
}

interface AuthResponse {
  user: AuthUser;
}

interface MeResponse {
  user: AuthUser | null;
}

/** Who is signed in right now? `null` for a visitor. */
export async function fetchMe(signal?: AbortSignal): Promise<AuthUser | null> {
  const data = await apiFetch<MeResponse>('/auth/me', { signal });
  return data?.user ?? null;
}

/** Sign in with a Django username + password. */
export async function login(username: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return data.user;
}

/** Create a customer account (staff accounts are made from Django admin). */
export async function register(
  username: string,
  password: string,
  email = ''
): Promise<AuthUser> {
  const data = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  });
  return data.user;
}

/** End the session. */
export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' });
}
