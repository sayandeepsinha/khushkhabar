import type { UserPreferences } from './types';
import { MOCK_DEFAULT_PREFERENCES } from './mockData';
import { apiRequest, removeAuthToken, simulateDelay, USE_MOCK } from './client';

const PREFS_KEY = 'varta_user_preferences';

export async function getUserPreferences(): Promise<UserPreferences> {
  if (USE_MOCK) {
    await simulateDelay(200);
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      return saved ? JSON.parse(saved) : MOCK_DEFAULT_PREFERENCES;
    } catch {
      return MOCK_DEFAULT_PREFERENCES;
    }
  }
  return apiRequest<UserPreferences>('/user/preferences');
}

export async function updateUserPreferences(
  newPrefs: Partial<UserPreferences>
): Promise<UserPreferences> {
  if (USE_MOCK) {
    await simulateDelay(350);
    const current = await getUserPreferences();
    const updated = { ...current, ...newPrefs };
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    return updated;
  }

  return apiRequest<UserPreferences>('/user/preferences', {
    method: 'PUT',
    body: JSON.stringify(newPrefs),
  });
}

export async function deleteUserAccount(
  _password: string,
  _reason?: string
): Promise<{ success: boolean; message: string }> {
  if (USE_MOCK) {
    await simulateDelay(600);
    removeAuthToken();
    localStorage.removeItem('varta_user_session');
    localStorage.removeItem(PREFS_KEY);
    return {
      success: true,
      message: 'Account successfully removed and all data erased.',
    };
  }

  return apiRequest<{ success: boolean; message: string }>('/user/account', {
    method: 'DELETE',
    body: JSON.stringify({ password: _password, reason: _reason }),
  });
}
