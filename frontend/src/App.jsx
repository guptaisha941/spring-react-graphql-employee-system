import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Employees from './pages/Employees'
import Departments from './pages/Departments'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Register from './pages/Register'
import ErrorBoundary from './components/ErrorBoundary'

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user) {
    const userRoles = user.roles || [user.role].filter(Boolean)
    const hasRequiredRole = roles.some(role => 
      userRoles.some(userRole => 
        userRole === role || 
        userRole === `ROLE_${role.toUpperCase()}` ||
        userRole.toLowerCase() === role.toLowerCase()
      )
    )
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

function AppRoutes() {
  // Show loading while checking auth
  const { loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
