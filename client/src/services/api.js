import axios from 'axios';
import { config } from '../config/config';

// Create axios instance
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Projects
  projects: {
    getAll: (params) => api.get('/projects', { params }),
    getOne: (id) => api.get(`/projects/${id}`),
    getFeatured: () => api.get('/projects/featured'),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
  },

  // Team
  team: {
    getAll: () => api.get('/team'),
    getOne: (id) => api.get(`/team/${id}`),
    create: (data) => api.post('/team', data),
    update: (id, data) => api.put(`/team/${id}`, data),
    delete: (id) => api.delete(`/team/${id}`),
  },

  // Statistics
  statistics: {
    get: () => api.get('/statistics'),
    update: (data) => api.put('/statistics', data),
  },

  // Contact
  contact: {
    submit: (data) => api.post('/contact', data),
    getAll: () => api.get('/contact'),
    update: (id, data) => api.put(`/contact/${id}`, data),
    delete: (id) => api.delete(`/contact/${id}`),
  },

  // Auth
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    me: () => api.get('/auth/me'),
    setup: (data) => api.post('/auth/setup', data),
    updatePassword: (data) => api.put('/auth/updatepassword', data),
  },

  // Gallery
  gallery: {
    getAll: (params) => api.get('/gallery', { params }),
    create: (data) => api.post('/gallery', data),
    update: (id, data) => api.put(`/gallery/${id}`, data),
    delete: (id) => api.delete(`/gallery/${id}`),
  },

  // Services
  services: {
    getAll: (params) => api.get('/services', { params }),
    getOne: (id) => api.get(`/services/${id}`),
    create: (data) => api.post('/services', data),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`),
  },

  // Ministries
  ministries: {
    getAll: (params) => api.get('/ministries', { params }),
    getOne: (id) => api.get(`/ministries/${id}`),
    create: (data) => api.post('/ministries', data),
    update: (id, data) => api.put(`/ministries/${id}`, data),
    delete: (id) => api.delete(`/ministries/${id}`),
  },

  // Home Content
  homeContent: {
    get: () => api.get('/home-content'),
    update: (data) => api.put('/home-content', data),
  },

  // About Content
  aboutContent: {
    get: () => api.get('/about-content'),
    update: (data) => api.put('/about-content', data),
  },

  // Videos
  videos: {
    getAll: (params) => api.get('/videos', { params }),
    getOne: (id) => api.get(`/videos/${id}`),
    create: (data) => api.post('/videos', data),
    update: (id, data) => api.put(`/videos/${id}`, data),
    delete: (id) => api.delete(`/videos/${id}`),
  },

  // Settings
  settings: {
    get: () => api.get('/settings'),
    update: (data) => api.put('/settings', data),
    testEmail: (email) => api.post('/settings/test-email', { email }),
  },

  // Stories (Blog)
  stories: {
    getAll: (params) => api.get('/stories', { params }),
    getOne: (idOrSlug) => api.get(`/stories/${idOrSlug}`),
    create: (data) => api.post('/stories', data),
    update: (id, data) => api.put(`/stories/${id}`, data),
    delete: (id) => api.delete(`/stories/${id}`),
  },

  // Subscribers
  subscribers: {
    subscribe: (data) => api.post('/subscribers', data),
    unsubscribe: (data) => api.post('/subscribers/unsubscribe', data),
    getAll: () => api.get('/subscribers'),
    broadcast: (data) => api.post('/subscribers/broadcast', data),
  },

  // Volunteers
  volunteers: {
    apply: (data) => api.post('/volunteers', data),
    getAll: () => api.get('/volunteers'),
    updateStatus: (id, status) => api.put(`/volunteers/${id}`, { status }),
    delete: (id) => api.delete(`/volunteers/${id}`),
  },

  // File upload
  upload: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
