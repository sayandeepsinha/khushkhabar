import type { AuthResponse, User } from './types';
import { MOCK_USER } from './mockData';
import { apiRequest, setAuthToken, removeAuthToken, simulateDelay, USE_MOCK } from './client';

const USER_SESSION_KEY = 'varta_user_session';

export async function login(email: string, _password: string): Promise<AuthResponse> {
  if (USE_MOCK) {
    await simulateDelay(400);
    const mockUser: User = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
    };
    const response: AuthResponse = {
      user: mockUser,
      token: 'mock_jwt_token_varta_xyz123',
    };
    setAuthToken(response.token);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(mockUser));
    return response;
  }

  const res = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: _password }),
  });
  setAuthToken(res.token);
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(res.user));
  return res;
}

export async function register(
  name: string,
  email: string,
  _password: string
): Promise<AuthResponse> {
  if (USE_MOCK) {
    await simulateDelay(500);
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'New Reader',
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const response: AuthResponse = {
      user: newUser,
      token: `mock_jwt_token_${Date.now()}`,
    };
    setAuthToken(response.token);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
    return response;
  }

  const res = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password: _password }),
  });
  setAuthToken(res.token);
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(res.user));
  return res;
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : MOCK_USER; // Default to demo user for easy previewing
  } catch {
    return MOCK_USER;
  }
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await simulateDelay(200);
    removeAuthToken();
    localStorage.removeItem(USER_SESSION_KEY);
    return;
  }

  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    removeAuthToken();
    localStorage.removeItem(USER_SESSION_KEY);
  }
}
