import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaBell, FaSearch } from 'react-icons/fa'
import { useApp } from '../context/AppContext'

const Navbar = ({ onMenuToggle }) => {
  const { user, isAuthenticated, isAdmin, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaSearch className="text-gray-600" />
            </motion.button>

            {isAuthenticated && (
              <>
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaBell className="text-gray-600" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </motion.button>

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
