import axios from 'axios';

// Use environment variable for API URL
// Falls back to localhost if VITE_API_URL is not set
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔗 API URL:', API_URL); // Helpful for debugging

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach the JWT token from localStorage 
// to the Authorization header of every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // The convention for JWT is 'Bearer <token>'
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  // Handle request error
  return Promise.reject(error);
});

export default api;