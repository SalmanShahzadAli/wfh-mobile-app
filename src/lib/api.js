const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function saveTokens(access, refresh) {
  localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) return false;

  const data = await response.json();
  saveTokens(data.access, data.refresh);
  return true;
}

export async function apiRequest(endpoint, options = {}, retry = true) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  const isAuthEndpoint = endpoint === '/login/' || endpoint === '/register/';
  if (response.status === 401 && retry && !isAuthEndpoint && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest(endpoint, options, false);
    }
    clearTokens();
    if (typeof window !== 'undefined') window.location.href = '/login';
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw { status: response.status, data };
  }
  return data;
}