import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaUser, FaEnvelope, FaSpinner } from 'react-icons/fa'
import api from '../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setSubmitting(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setSubmitting(false)
      return
    }

    try {
      const response = await api.post('/v1/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      // Registration successful - redirect to login
      alert(`Registration successful! Welcome ${response.data.username}. Please login.`)
      navigate('/login')
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.fieldErrors?.map(fe => `${fe.field}: ${fe.message}`).join(', ') ||
        err.message ||
        'Registration failed. Please try again.'
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
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-500 to-blue-500 flex items-center justify-center text-white shadow-lg mb-3"
            >
              <FaUser className="text-2xl" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-slate-300 text-sm mt-1">
              Sign up to access the employee management system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="username"
                  required
                  minLength={3}
                  maxLength={100}
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="johndoe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  maxLength={100}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </motion.button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
