import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    // Don't set Content-Type for FormData - let browser set it with boundary
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
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
      localStorage.removeItem('user');
      window.location.href = '/';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/library-panel/auth/login', credentials),
  logout: () => api.post('/api/library-panel/auth/logout'),
  changePassword: (data) => api.put('/api/library-panel/profile/change-password', data),
  getProfile: () => api.get('/api/library-panel/profile'),
  updateProfile: (data) => api.put('/api/library-panel/profile', data)
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/api/library-panel/dashboard/stats'),
  getRecentActivities: () => api.get('/api/library-panel/dashboard/recent-activities'),
  getOverdueBooks: () => api.get('/api/library-panel/dashboard/overdue-books'),
  getPopularBooks: () => api.get('/api/library-panel/dashboard/popular-books')
};

// Book APIs
export const bookAPI = {
  getAll: (params) => api.get('/api/library-panel/book/all', { params }),
  getById: (id) => api.get(`/api/library-panel/book/${id}`),
  create: (data) => api.post('/api/library-panel/book/add', data),
  update: (id, data) => api.put(`/api/library-panel/book/${id}`, data),
  delete: (id) => api.delete(`/api/library-panel/book/${id}`),
  search: (query) => api.get('/api/library-panel/book/all', { params: { search: query } })
};

// Book Issue APIs
export const bookIssueAPI = {
  getAll: (params) => api.get('/api/library-panel/book-issue/all', { params }),
  getById: (id) => api.get(`/api/library-panel/book-issue/${id}`),
  issue: (data) => api.post('/api/library-panel/book-issue/issue', data),
  return: (id, data) => api.put(`/api/library-panel/book-issue/return/${id}`, data)
};

// Member APIs
export const memberAPI = {
  getAll: (params) => api.get('/api/library-panel/member/all', { params }),
  getById: (id) => api.get(`/api/library-panel/member/${id}`),
  create: (data) => api.post('/api/library-panel/member/add', data),
  update: (id, data) => api.put(`/api/library-panel/member/${id}`, data),
  delete: (id) => api.delete(`/api/library-panel/member/${id}`),
  search: (query) => api.get('/api/library-panel/member/all', { params: { search: query } })
};

// Student APIs
export const studentAPI = {
  getAll: (params) => api.get('/api/library-panel/student/all', { params }),
  getClasses: () => api.get('/api/library-panel/student/classes'),
  getSections: (classId) => api.get('/api/library-panel/student/sections', { params: { classId } }),
  create: (data) => api.post('/api/library-panel/student/add', data),
  update: (id, data) => api.put(`/api/library-panel/student/${id}`, data),
  delete: (id) => api.delete(`/api/library-panel/student/${id}`),
  search: (query) => api.get('/api/library-panel/student/all', { params: { search: query } })
};

// Library Card APIs
export const libraryCardAPI = {
  getAll: (params) => api.get('/api/library-panel/library-card/all', { params }),
  getById: (id) => api.get(`/api/library-panel/library-card/${id}`),
  create: (data) => api.post('/api/library-panel/library-card/add', data),
  update: (id, data) => api.put(`/api/library-panel/library-card/${id}`, data),
  delete: (id) => api.delete(`/api/library-panel/library-card/${id}`)
};

// Book Categorization APIs
export const categorizationAPI = {
  getAll: () => api.get('/api/library-panel/book-categorization/all'),
  getById: (id) => api.get(`/api/library-panel/book-categorization/${id}`),
  create: (data) => api.post('/api/library-panel/book-categorization/add', data),
  update: (id, data) => api.put(`/api/library-panel/book-categorization/${id}`, data),
  delete: (id) => api.delete(`/api/library-panel/book-categorization/${id}`)
};

// Book Limit APIs
export const bookLimitAPI = {
  getAll: () => api.get('/api/library-panel/book-limit/all'),
  getById: (id) => api.get(`/api/library-panel/book-limit/${id}`),
  create: (data) => api.post('/api/library-panel/book-limit/add', data),
  update: (id, data) => api.put(`/api/library-panel/book-limit/${id}`, data),
  delete: (id) => api.delete(`/api/library-panel/book-limit/${id}`)
};

// Digital Library APIs
export const digitalLibraryAPI = {
  getAll: (params) => api.get('/api/library-panel/digital-library/all', { params }),
  getById: (id) => api.get(`/api/library-panel/digital-library/${id}`),
  create: (data) => api.post('/api/library-panel/digital-library/upload', data),
  update: (id, data) => api.put(`/api/library-panel/digital-library/${id}`, data),
  delete: (id) => api.delete(`/api/library-panel/digital-library/${id}`)
};

// Book Request APIs
export const bookRequestAPI = {
  getAll: (params) => api.get('/api/library-panel/book-request/all', { params }),
  getById: (id) => api.get(`/api/library-panel/book-request/${id}`),
  create: (data) => api.post('/api/library-panel/book-request', data),
  approve: (id) => api.put(`/api/library-panel/book-request/${id}/approve`),
  reject: (id) => api.put(`/api/library-panel/book-request/${id}/reject`),
  delete: (id) => api.delete(`/api/library-panel/book-request/${id}`)
};

// Reports APIs
export const reportsAPI = {
  getExecutiveReport: () => api.get('/api/library-panel/reports/executive'),
  getCirculationReport: (params) => api.get('/api/library-panel/reports/circulation', { params }),
  getFinancialReport: (params) => api.get('/api/library-panel/reports/financial', { params }),
  getInventoryReport: () => api.get('/api/library-panel/reports/inventory'),
  getIssuedBooks: (params) => api.get('/api/library-panel/reports/issued-books', { params }),
  getOverdueBooks: (params) => api.get('/api/library-panel/reports/overdue-books', { params })
};

// Barcode & Fine APIs
export const barcodeFineAPI = {
  scanBarcode: (barcode) => api.get(`/api/library-panel/barcode-fine/${barcode}`),
  getFines: (params) => api.get('/api/library-panel/barcode-fine/fines', { params }),
  payFine: (id) => api.put(`/api/library-panel/barcode-fine/pay/${id}`),
  waiveFine: (id) => api.put(`/api/library-panel/barcode-fine/waive/${id}`)
};

// Settings APIs
export const settingsAPI = {
  get: () => api.get('/api/library-panel/auth/settings'),
  update: (data) => api.put('/api/library-panel/auth/settings', data)
};

export default api;
