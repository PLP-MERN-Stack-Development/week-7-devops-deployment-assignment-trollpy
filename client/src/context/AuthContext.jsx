import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem
} from '../utils/storage'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getStorageItem('token')
    if (token) {
      authService
        .getProfile()
        .then(setUser)
        .catch(() => removeStorageItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    setStorageItem('token', response.token)
    setUser(response.user)
    return response
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    setStorageItem('token', response.token)
    setUser(response.user)
    return response
  }

  const logout = () => {
    removeStorageItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
