import axios from 'axios';

const API_BASE = import.meta.env.PROD 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const signupUser = (data) => api.post('/auth/signup', data);
export const getProfile = () => api.get('/auth/profile');

// Projects
export const getProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const addProjectMembers = (id, members) => api.post(`/projects/${id}/members`, { members });

// Tasks
export const getTasksByProject = (projectId) => api.get(`/tasks/project/${projectId}`);
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Dashboard
export const getDashboardData = () => api.get('/dashboard');

export default api;
