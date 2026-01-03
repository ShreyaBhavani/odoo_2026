import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`)
};

// Attendance API
export const attendanceAPI = {
  checkIn: (employeeId) => api.post('/attendance/checkin', { employeeId }),
  checkOut: (employeeId) => api.post('/attendance/checkout', { employeeId }),
  getByEmployee: (employeeId) => api.get(`/attendance/${employeeId}`),
  getAll: () => api.get('/attendance/all')
};

// Salary API
export const salaryAPI = {
  get: (employeeId) => api.get(`/salary/${employeeId}`),
  createOrUpdate: (data) => api.post('/salary', data),
  delete: (employeeId) => api.delete(`/salary/${employeeId}`)
};

export default api;
