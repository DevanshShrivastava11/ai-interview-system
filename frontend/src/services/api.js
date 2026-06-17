import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 60000, // 60 seconds (useful for Gemini evaluation API calls which can take 5-10 seconds)
});

// Request interceptor to attach JWT token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authorization failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect if token expired/invalid
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
