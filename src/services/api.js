import axios from 'axios';
import { storage } from './storage';

const API_BASE_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor для обработки ошибок
// Response interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    
    if (error.response?.status === 401) {
      storage.removeToken();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const accountsAPI = {
  create: (data) => api.post('/accounts/', data),
  getAll: () => api.get('/accounts/'),
  delete: (id) => api.delete(`/accounts/${id}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/me'),
};

export const categoriesAPI = {
  create: (data) => api.post('/categories/', data),
  getAll: () => api.get('/categories/'),
  getWithBalances: (type) => api.get(`/categories/with-balances?category_type=${type}`),
};

export const operationsAPI = {
  create: (data) => api.post('/operations/', data),
  getAll: (params) => api.get('/operations/', { params }),
  getDetails: () => api.get('/operations/details'),
};

export default api;