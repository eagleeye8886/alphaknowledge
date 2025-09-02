// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authAPI = {
  getCurrentUser: () => api.get('/auth/user'),
  logout: () => api.post('/auth/logout'),
  
  // NEW: Verify Google JWT token
  verifyGoogleToken: (token) => api.post('/auth/google/verify', { token }),
};

export const progressAPI = {
  getUserProgress: (userId) => api.get(`/api/progress/${userId}`),
  toggleProblem: (problemData) => api.post('/api/progress/toggle', problemData),
  getStats: (userId) => api.get(`/api/progress/stats/${userId}`)
};

export default api;
