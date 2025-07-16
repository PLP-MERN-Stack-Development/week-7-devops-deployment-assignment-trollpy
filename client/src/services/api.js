import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { useMemo } from 'react'

// Create base API instance without auth for non-React contexts
const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for base API
baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Create authenticated API instance
const createAuthenticatedApi = (getToken) => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor to add auth token
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Error getting token:', error)
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor to handle token expiration
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = '/auth/login'
      }
      return Promise.reject(error)
    }
  )

  return api
}

// Custom hook to get authenticated API instance
export const useApi = () => {
  const { getToken } = useAuth()
  
  const api = useMemo(() => {
    return createAuthenticatedApi(getToken)
  }, [getToken])

  return api
}

// Export base API for backward compatibility (use with caution - no auth)
export const api = baseApi

// Export authenticated API creator for service files
export { createAuthenticatedApi }