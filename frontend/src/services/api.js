/**
 * HomeLink Centralized API Client
 * Connects frontend smoothly to NestJS Backend on http://localhost:3000/api
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('homelink_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('homelink_token', token);
    } else {
      localStorage.removeItem('homelink_token');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('homelink_token');
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(json?.message || `HTTP error ${response.status}`);
      }

      return json?.data !== undefined ? json.data : json;
    } catch (err) {
      console.warn(`[HomeLink API] request failed for ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  auth = {
    login: async (credentials) => {
      const res = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res?.accessToken) {
        this.setToken(res.accessToken);
      }
      return res;
    },
    register: async (userData) => {
      const res = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (res?.accessToken) {
        this.setToken(res.accessToken);
      }
      return res;
    },
    getMe: () => this.request('/auth/me'),
    logout: () => {
      this.setToken(null);
      return this.request('/auth/logout', { method: 'POST' }).catch(() => true);
    },
  };

  // Property Endpoints
  properties = {
    search: (params = {}) => {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.append(k, v);
      });
      return this.request(`/properties/search?${qs.toString()}`);
    },
    getById: (id) => this.request(`/properties/${id}`),
    create: (data) => this.request('/properties', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id, status) =>
      this.request(`/properties/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    compare: (ids) => {
      const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
      return this.request(`/properties/compare?ids=${encodeURIComponent(idsStr)}`);
    },
    uploadPhoto: async (propertyId, file) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = this.getToken();
      const res = await fetch(`${API_BASE}/properties/${propertyId}/photos`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      return res.json();
    },
  };

  // Roommate Endpoints
  roommates = {
    search: (params = {}) => {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.append(k, v);
      });
      return this.request(`/roommates/search?${qs.toString()}`);
    },
    getById: (id) => this.request(`/roommates/${id}`),
    updateStatus: (id, status) =>
      this.request(`/roommates/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  };

  // Roommate Request Endpoints
  roommateRequests = {
    send: (receiverId, message) =>
      this.request('/roommate-requests', {
        method: 'POST',
        body: JSON.stringify({ receiverId, message }),
      }),
    getSent: () => this.request('/roommate-requests/sent'),
    getReceived: () => this.request('/roommate-requests/received'),
    accept: (requestId) => this.request(`/roommate-requests/${requestId}/accept`, { method: 'PATCH' }),
    decline: (requestId) => this.request(`/roommate-requests/${requestId}/decline`, { method: 'PATCH' }),
    cancel: (requestId) => this.request(`/roommate-requests/${requestId}/cancel`, { method: 'PATCH' }),
  };

  // Chat & Messaging Endpoints
  chat = {
    getConversations: () => this.request('/conversations'),
    getMessages: (conversationId) => this.request(`/conversations/${conversationId}/messages`),
    sendMessage: (conversationId, message) =>
      this.request(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  };

  // Saved / Favorites Endpoints
  saved = {
    saveProperty: (propertyId) => this.request(`/saved/properties/${propertyId}`, { method: 'POST' }),
    unsaveProperty: (propertyId) => this.request(`/saved/properties/${propertyId}`, { method: 'DELETE' }),
    getSavedProperties: () => this.request('/saved/properties'),
    saveRoommate: (roommateId) => this.request(`/saved/roommates/${roommateId}`, { method: 'POST' }),
    unsaveRoommate: (roommateId) => this.request(`/saved/roommates/${roommateId}`, { method: 'DELETE' }),
    getSavedRoommates: () => this.request('/saved/roommates'),
  };

  // Notifications Endpoints
  notifications = {
    getAll: () => this.request('/notifications'),
    markRead: (id) => this.request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => this.request('/notifications/read-all', { method: 'PATCH' }),
  };

  // Safety & Reports Endpoints
  reports = {
    createReport: (data) => this.request('/reports', { method: 'POST', body: JSON.stringify(data) }),
    blockUser: (blockedId) => this.request('/reports/block', { method: 'POST', body: JSON.stringify({ blockedId }) }),
  };

  // AI Endpoints
  ai = {
    search: (query) => this.request('/ai/search', { method: 'POST', body: JSON.stringify({ query }) }),
    chat: (payload) => {
      const body = typeof payload === 'string' ? { message: payload } : payload;
      return this.request('/ai/chat', { method: 'POST', body: JSON.stringify(body) });
    },
    verifyPhoto: (image, metadata = {}) =>
      this.request('/ai/verify-photo', {
        method: 'POST',
        body: JSON.stringify({ image, ...metadata }),
      }),
  };
}

export const api = new ApiClient();
export default api;
