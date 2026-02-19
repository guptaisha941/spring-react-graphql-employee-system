import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaUser, FaEnvelope, FaBuilding, FaBriefcase, FaDollarSign, FaCalendar, FaPhone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useApp } from '../context/AppContext'

// Memoized details modal; avoids re-renders when selected employee has not changed
const EmployeeDetailModalComponent = ({ employee, onClose }) => {
  const { user } = useApp()
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true

  if (!employee) return null

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20
    }
  }

  const detailFields = [
    { key: 'id', label: 'Employee ID', icon: FaUser },
    { key: 'name', label: 'Full Name', icon: FaUser },
    { key: 'email', label: 'Email', icon: FaEnvelope },
    { key: 'phone', label: 'Phone', icon: FaPhone },
    { key: 'department', label: 'Department', icon: FaBuilding },
    { key: 'position', label: 'Position', icon: FaBriefcase },
    { key: 'salary', label: 'Salary', icon: FaDollarSign },
    { key: 'joinDate', label: 'Join Date', icon: FaCalendar },
    { key: 'status', label: 'Status', icon: FaCheckCircle },
  ]

  return (
    <AnimatePresence>
      {employee && (
        <>
          {/* Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </motion.button>

                <div className="flex items-center space-x-4 pr-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg"
                  >
                    {employee.name ? employee.name.charAt(0).toUpperCase() : <FaUser />}
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-white"
                    >
                      {employee.name || 'N/A'}
                    </motion.h2>
                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-blue-100"
                    >
                      {employee.position || 'Employee'}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailFields.map((field, index) => {
                    const Icon = field.icon
                    const value = employee[field.key]

                    if (!value && field.key !== 'status') return null

                    return (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <Icon className="text-white text-sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              {field.label}
                            </p>
                            {field.key === 'status' ? (
                              <div className="flex items-center space-x-2">
                                {employee.status === 'Active' ? (
                                  <FaCheckCircle className="text-green-500" />
                                ) : (
                                  <FaTimesCircle className="text-red-500" />
                                )}
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    employee.status === 'Active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {employee.status || 'N/A'}
                                </span>
                              </div>
                            ) : (
                              <p className="text-sm font-semibold text-gray-900 break-words">
                                {value || 'N/A'}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Additional Info Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      This employee has been with the company since {employee.joinDate || 'N/A'}.
                      {employee.department && ` They are part of the ${employee.department} department.`}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Footer with Back Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back</span>
                </motion.button>

                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Edit Employee
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete Employee
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const EmployeeDetailModal = memo(EmployeeDetailModalComponent)

export default EmployeeDetailModal
