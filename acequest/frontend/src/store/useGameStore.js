import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

function encodeFormData(username, password) {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);
  body.append('grant_type', 'password');
  return body;
}

export const useGameStore = create((set, get) => ({
  user: null,
  profile: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  getAuthHeader: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, {
        username,
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, isAuthenticated: true });
      await get().fetchMe();
      set({ isLoading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Registration failed';
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },

  registerAdmin: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/api/auth/admin/register`, {
        username,
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, isAuthenticated: true });
      await get().fetchMe();
      set({ isLoading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Admin registration failed';
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, encodeFormData(username, password), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, isAuthenticated: true });
      await get().fetchMe();
      set({ isLoading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Login failed';
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },

  loginAdmin: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/api/auth/admin/login`, encodeFormData(username, password), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, isAuthenticated: true });
      await get().fetchMe();
      set({ isLoading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Admin login failed';
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  fetchMe: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: get().getAuthHeader(),
      });
      set({
        user: response.data.user,
        profile: response.data.profile,
        isAuthenticated: true,
      });
    } catch (err) {
      get().logout();
    }
  },

  updateProfileStats: (stats) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...stats } : null,
    }));
  },

  claimDaily: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${API_BASE}/api/player/daily-claim`,
        {},
        { headers: get().getAuthHeader() }
      );
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, coins: response.data.new_coins, login_streak: response.data.login_streak }
          : null,
      }));
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Daily claim failed';
      set({ error: errMsg, isLoading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
