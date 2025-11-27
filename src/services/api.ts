import axios from 'axios';

// The baseURL is left empty, making this instance rely entirely on the 
// Vite proxy configuration (in vite.config.js) to route requests starting 
// with '/api' to the backend (http://localhost:5000).
const api = axios.create({
  baseURL: 'http://localhost:5000',
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