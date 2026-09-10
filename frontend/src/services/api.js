import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  timeout: 15000,
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear invalid session
      if (localStorage.getItem('cf_token')) {
        console.warn('Session expired or unauthorized. Logging out.');
        localStorage.removeItem('cf_token');
        localStorage.removeItem('cf_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
