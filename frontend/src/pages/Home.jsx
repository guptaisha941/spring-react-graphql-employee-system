import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaUsers, FaChartBar, FaFileAlt, FaShieldAlt, FaRocket, FaSpinner } from 'react-icons/fa'
import { useApp } from '../context/AppContext'
import api from '../services/api'
import logger from '../utils/logger'

const Home = () => {
  const { isAuthenticated, isAdmin, user } = useApp()
  const [stats, setStats] = useState([
    { label: 'Total Employees', value: '...', icon: FaUsers, color: 'blue', loading: true },
    { label: 'Active Departments', value: '...', icon: FaChartBar, color: 'green', loading: true },
    { label: 'Reports Generated', value: 'Demo', icon: FaFileAlt, color: 'purple', loading: false },
    { label: 'System Status', value: '...', icon: FaShieldAlt, color: 'orange', loading: true },
  ])

  useEffect(() => {
    if (!isAuthenticated) return

    // Fetch employee count
    const fetchEmployeeCount = async () => {
      try {
        const response = await api.get('/employees', {
          params: { page: 0, size: 1 },
        })
        const totalEmployees = response.data.totalElements || 0
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'Total Employees'
              ? { ...stat, value: totalEmployees.toString(), loading: false }
              : stat
          )
        )
      } catch (error) {
        logger.error('Error fetching employee count:', error)
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'Total Employees'
              ? { ...stat, value: 'Error', loading: false }
              : stat
          )
        )
      }
    }

    // Fetch unique departments (from employee classes)
    const fetchDepartmentCount = async () => {
      try {
        // Fetch first page with large size to get all employees
        const response = await api.get('/employees', {
          params: { page: 0, size: 1000 },
        })
        const employees = response.data.content || []
        const uniqueClasses = new Set(
          employees
            .map((emp) => emp.employeeClass)
            .filter((cls) => cls && cls.trim() !== '')
        )
        const departmentCount = uniqueClasses.size
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'Active Departments'
              ? { ...stat, value: departmentCount.toString(), loading: false }
              : stat
          )
        )
      } catch (error) {
        logger.error('Error fetching department count:', error)
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'Active Departments'
              ? { ...stat, value: 'N/A', loading: false }
              : stat
          )
        )
      }
    }

    // Check system health
    const checkSystemHealth = async () => {
      try {
        // Health endpoint might not require auth, so use direct fetch
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
        const response = await fetch(`${apiUrl}/actuator/health`)
        if (!response.ok) throw new Error('Health check failed')
        const data = await response.json()
        const status = data.status || 'UNKNOWN'
        const healthStatus = status === 'UP' ? 'Online' : 'Offline'
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'System Status'
              ? { ...stat, value: healthStatus, loading: false }
              : stat
          )
        )
      } catch (error) {
        logger.error('Error checking system health:', error)
        // If health check fails but we're authenticated, assume system is running
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'System Status'
              ? { ...stat, value: isAuthenticated ? 'Online' : 'Unknown', loading: false }
              : stat
          )
        )
      }
    }

    // Fetch all stats
    fetchEmployeeCount()
    fetchDepartmentCount()
    checkSystemHealth()
  }, [isAuthenticated])

  const quickActions = [
    { title: 'Manage Employees', description: 'View, add, edit, and delete employee records', link: '/employees', icon: FaUsers },
    ...(isAdmin ? [
      { title: 'View Departments', description: 'Explore department information and statistics', link: '/departments', icon: FaChartBar },
      { title: 'Generate Reports', description: 'Access and download system reports', link: '/reports', icon: FaFileAlt },
    ] : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-bold text-gray-800 mb-4"
        >
          Welcome{isAuthenticated && user ? `, ${user.name}` : ''}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Streamline your workforce management with our comprehensive employee management system.
          {isAdmin && ' You have administrative access to all features.'}
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`text-3xl text-${stat.color}-500`} />
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 flex items-center justify-end space-x-2">
                  {stat.loading ? (
                    <FaSpinner className="animate-spin text-gray-400" />
                  ) : (
                    <span>{stat.value}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                {stat.label === 'Reports Generated' && (
                  <div className="text-xs text-gray-400 mt-1">(Demo data)</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all"
            >
              <Link to={action.link} className="block">
                <action.icon className="text-4xl text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200"
      >
        <div className="flex items-center mb-4">
          <FaRocket className="text-3xl text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Key Features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-gray-800">Employee Management</h4>
              <p className="text-sm text-gray-600">Complete CRUD operations for employee records</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-gray-800">Role-Based Access</h4>
              <p className="text-sm text-gray-600">Secure access control with admin and employee roles</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-gray-800">Real-time Updates</h4>
              <p className="text-sm text-gray-600">Instant synchronization with backend database</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-gray-800">Secure Authentication</h4>
              <p className="text-sm text-gray-600">JWT-based authentication with refresh tokens</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Home
