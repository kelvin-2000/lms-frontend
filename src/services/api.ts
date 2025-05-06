import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to get a cookie value
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    // First try localStorage
    let token = localStorage.getItem('token');

    // If not found in localStorage, try cookies
    if (!token) {
      token = getCookie('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');

      // Also clear cookies
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie =
        'userRole=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

      // Redirect to login
      const isAdminPath = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminPath
        ? `/admin/login?redirect=${window.location.pathname}`
        : '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
