import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch {
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      }
    }

    setLoading(false)
  }, [])

  const login = (authUser, token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }
    if (authUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(authUser))
      setUser(authUser)
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const isAuthenticated = !!user
  // Check if user has admin role (supports both ROLE_ADMIN and admin formats)
  const isAdmin = user?.isAdmin === true || 
                  user?.role === 'admin' || 
                  user?.role === 'ROLE_ADMIN' ||
                  (user?.roles && Array.isArray(user.roles) && (
                    user.roles.includes('ROLE_ADMIN') || 
                    user.roles.includes('admin')
                  ))

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
