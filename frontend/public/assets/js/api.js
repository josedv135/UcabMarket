/**
 * Módulo reutilizable de llamadas a la API de UcabMarket
 * Utiliza CONFIG.API_BASE_URL e inyecta el token Bearer automáticamente.
 */
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
window.escapeHtml = escapeHtml;

const api = {
  getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
  },

  getCurrentUser() {
    const raw = localStorage.getItem(CONFIG.USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  },

  setSession(token, user) {
    if (token) {
      localStorage.setItem(CONFIG.TOKEN_KEY, token);
    }
    if (user) {
      localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
    }
  },

  updateUser(updatedFields) {
    const current = this.getCurrentUser() || {};
    const merged = { ...current, ...updatedFields };
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(merged));
    return merged;
  },

  clearSession() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  },

  async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMsg = 'Error en la petición';
      if (Array.isArray(data?.message)) {
        errorMsg = data.message.join('. ');
      } else if (typeof data?.message === 'string') {
        errorMsg = data.message;
      } else if (data?.error) {
        errorMsg = data.error;
      }
      throw new Error(errorMsg);
    }

    return data;
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    const isForm = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isForm ? body : JSON.stringify(body),
    });
  },

  patch(endpoint, body) {
    const isForm = body instanceof FormData;
    return this.request(endpoint, {
      method: 'PATCH',
      body: isForm ? body : JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
