import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token on everything except /health and /auth/*
axiosInstance.interceptors.request.use(
  (config) => {
    const isPublic = config.url?.includes('/health') || config.url?.includes('/auth/');
    if (!isPublic) {
      const token = localStorage.getItem('brandlens_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwrap { ok: true, data }, throw on { ok: false }, handle 401
axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object') {
      if (body.ok === true) {
        return body.data;
      }
      if (body.ok === false) {
        const error = new Error(body.error?.message || 'API request failed');
        error.code = body.error?.code || 'SERVER_ERROR';
        error.status = response.status;
        return Promise.reject(error);
      }
    }
    return body;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('brandlens_token');
        localStorage.removeItem('brandlens_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      if (data && data.ok === false && data.error) {
        const customErr = new Error(data.error.message || 'Request failed');
        customErr.code = data.error.code || 'ERROR';
        customErr.status = status;
        return Promise.reject(customErr);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
