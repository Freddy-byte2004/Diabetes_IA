import axios from 'axios';


const BASE_URL = process.env.REACT_APP_API_URL || 'https://diabetes-ia-backend-1.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add Authorization header from localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
