import axios from 'axios'
import logger from '../utils/logger'

// Validate required environment variable
const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is required')
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    logger.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear tokens and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (error.code === 'ECONNABORTED') {
      logger.error('Request timeout:', error.config?.url)
    } else if (!error.response) {
      logger.error('Network error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
