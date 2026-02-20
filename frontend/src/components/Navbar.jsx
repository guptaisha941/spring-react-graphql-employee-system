import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaBell, FaSearch, FaTimes } from 'react-icons/fa'
import { useApp } from '../context/AppContext'

const Navbar = ({ onMenuToggle }) => {
  const { user, isAuthenticated, isAdmin, logout } = useApp()
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to employees page with search query
      navigate(`/employees?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  // Mock notifications (in real app, fetch from API)
  const notifications = [
    { id: 1, message: 'New employee added', time: '2 hours ago', read: false },
    { id: 2, message: 'System maintenance scheduled', time: '1 day ago', read: false },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white shadow-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                EmployeeHub
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/">Home</NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/employees">Employees</NavLink>
                  {isAdmin && (
                    <>
                      <NavLink to="/departments">Departments</NavLink>
                      <NavLink to="/reports">Reports</NavLink>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Icon - Desktop */}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSearch(true)}
                  className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                  title="Search"
                >
                  <FaSearch className="text-gray-600" />
                </motion.button>
              )}

              {isAuthenticated && (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                      title="Notifications"
                    >
                      <FaBell className="text-gray-600" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </motion.button>

                    {/* Notifications Dropdown */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <FaTimes />
                            </button>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="p-4 text-center text-gray-500 text-sm">
                                No notifications
                              </div>
                            ) : (
                              notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                    !notification.read ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <p className="text-sm text-gray-800">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Profile */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  >
                    <FaUser />
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {user?.name || 'User'}
                    </span>
                    {isAdmin && (
                      <span className="ml-1 text-[10px] px-2 py-0.5 bg-white/20 rounded-full uppercase tracking-wide">
                        Admin
                      </span>
                    )}
                  </motion.div>

                  {/* Logout */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </motion.button>
                </>
              )}

              {!isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  Login
                </motion.button>
              )}

              {/* Hamburger Menu */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onMenuToggle}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-4"
            >
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search employees..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </form>
              <p className="mt-2 text-xs text-gray-500">
                Press Enter to search or click outside to close
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

const NavLink = ({ to, children }) => {
  return (
    <Link to={to}>
      <motion.span
        whileHover={{ y: -2 }}
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
      >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
      </motion.span>
    </Link>
  )
}

export default Navbar
