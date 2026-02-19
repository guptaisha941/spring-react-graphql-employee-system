import { useState, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa'
import { useApp } from '../context/AppContext'
import EmployeeDetailModal from './EmployeeDetailModal'

// Memoized tile view so only tiles with changed props re-render
const TileViewComponent = ({ data = [], columns = [] }) => {
  const { user } = useApp()
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)
  const dropdownRefs = useRef({})

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true

  // Essential fields to show in tile
  const essentialFields = ['name', 'email', 'department', 'position', 'status']

  const handleTileClick = (employee) => {
    setSelectedEmployee(employee)
  }

  const handleDropdownToggle = (employeeId, e) => {
    e.stopPropagation()
    setOpenDropdown(openDropdown === employeeId ? null : employeeId)
  }

  const handleEdit = (employee, e) => {
    e.stopPropagation()
    setOpenDropdown(null)
    // Intentionally left as a no-op; real edit logic can be wired without logging
  }

  const handleDelete = (employee, e) => {
    e.stopPropagation()
    setOpenDropdown(null)
    // Intentionally left as a no-op; real delete logic can be wired without logging
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdown(null)
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {data.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTileClick(item)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer relative group"
          >
            {/* Header with Avatar and 3-dot menu */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md"
                >
                  {item.name ? item.name.charAt(0).toUpperCase() : <FaUser />}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {item.name || item.id || 'N/A'}
                  </h3>
                  {item.position && (
                    <p className="text-sm text-gray-500">{item.position}</p>
                  )}
                </div>
              </div>

              {/* 3-dot menu button */}
              <div className="relative" ref={(el) => (dropdownRefs.current[item.id] = el)}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleDropdownToggle(item.id, e)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="More options"
                >
                  <FaEllipsisV className="text-gray-600" />
                </motion.button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {openDropdown === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden"
                    >
                      {isAdmin && (
                        <>
                          <motion.button
                            whileHover={{ backgroundColor: '#eff6ff' }}
                            onClick={(e) => handleEdit(item, e)}
                            className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            <FaEdit className="text-blue-600" />
                            <span>Edit</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ backgroundColor: '#fef2f2' }}
                            onClick={(e) => handleDelete(item, e)}
                            className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-gray-700 hover:text-red-600 transition-colors border-t border-gray-200"
                          >
                            <FaTrash className="text-red-600" />
                            <span>Delete</span>
                          </motion.button>
                        </>
                      )}
                      {!isAdmin && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No actions available
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Essential fields only */}
            <div className="space-y-2">
              {essentialFields.map((fieldKey) => {
                if (fieldKey === 'name' || fieldKey === 'position') {
                  return null // Already displayed in header
                }

                const column = columns.find((col) => col.key === fieldKey)
                if (!column || !item[fieldKey]) return null

                return (
                  <div key={fieldKey} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{column.label}:</span>
                    {fieldKey === 'status' ? (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    ) : (
                      <span className="text-gray-900 font-medium truncate ml-2 max-w-[60%]">
                        {item[fieldKey]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Click indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute bottom-4 right-4 text-xs text-blue-600 font-medium"
            >
              Click to view details →
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </>
  )
}

const TileView = memo(TileViewComponent)

export default TileView
