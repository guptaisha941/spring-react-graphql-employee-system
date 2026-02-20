import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaUser, FaSpinner } from 'react-icons/fa'
import api from '../services/api'
import { useApp } from '../context/AppContext'

const Login = () => {
  const { login, isAuthenticated } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Login endpoint matches backend: /v1/auth/login
      const response = await api.post('/v1/auth/login', {
        usernameOrEmail: email,
        password,
      })

      const { accessToken, username, roles } = response.data
      const token = accessToken

      // Build user object from login response
      const authUser = {
        id: username,
        name: username,
        email: email,
        role: roles && roles.length > 0 ? roles[0] : 'ROLE_EMPLOYEE',
        roles: roles || [],
        isAdmin: roles && roles.includes('ROLE_ADMIN'),
      }

      login(authUser, token)
      navigate('/', { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
          <div className="flex flex-col items-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg mb-3"
            >
              <FaLock className="text-2xl" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">EmployeeHub Login</h1>
            <p className="text-slate-300 text-sm mt-1">
              Sign in to manage employees and departments
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="admin or admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </motion.button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 underline">
              Sign up
            </Link>
          </p>
          
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Admin:</strong> admin / password123</p>
              <p><strong>Employee:</strong> employee1 / password123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login

