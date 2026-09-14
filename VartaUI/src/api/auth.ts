import type { AuthResponse, User } from './types';
import { apiRequest, setAuthToken, removeAuthToken } from './client';

const USER_SESSION_KEY = 'varta_user_session';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const cleanEmail = email.trim();
  const cleanPass = password.trim();

  const res = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
  });

  if (res.token) {
    setAuthToken(res.token);
  }
  if (res.user) {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(res.user));
  }
  return res;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanPass = password.trim();

  const res = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: cleanName, email: cleanEmail, password: cleanPass }),
  });

  if (res.token) {
    setAuthToken(res.token);
  }
  if (res.user) {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(res.user));
  }
  return res;
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch {
    // Ignore server error on logout to allow local sign-out
  } finally {
    removeAuthToken();
    localStorage.removeItem(USER_SESSION_KEY);
  }
}
