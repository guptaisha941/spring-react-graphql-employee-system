import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  FaHome, 
  FaUsers, 
  FaBuilding, 
  FaChartBar, 
  FaTimes,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa'

const SideMenu = ({ isOpen, onClose }) => {
  const location = useLocation()

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: FaHome,
      path: '/',
      submenu: null,
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: FaUsers,
      path: '/employees',
      submenu: [
        { label: 'All Employees', path: '/employees' },
        { label: 'Add Employee', path: '/employees/add' },
        { label: 'Employee Reports', path: '/employees/reports' },
      ],
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: FaBuilding,
      path: '/departments',
      submenu: [
        { label: 'All Departments', path: '/departments' },
        { label: 'Add Department', path: '/departments/add' },
        { label: 'Department Stats', path: '/departments/stats' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FaChartBar,
      path: '/reports',
      submenu: [
        { label: 'Overview', path: '/reports' },
        { label: 'Analytics', path: '/reports/analytics' },
        { label: 'Export Data', path: '/reports/export' },
      ],
    },
  ]

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const menuVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Side Menu */}
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                aria-label="Close menu"
              >
                <FaTimes className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Menu Items */}
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    isActive={location.pathname === item.path}
                    onClose={onClose}
                  />
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                Employee Management System
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

const MenuItem = ({ item, isActive, onClose }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const Icon = item.icon

  const handleClick = () => {
    if (item.submenu) {
      setIsSubmenuOpen(!isSubmenuOpen)
    } else {
      onClose()
    }
  }

  return (
    <li>
      <motion.div
        whileHover={{ x: 4 }}
        className="rounded-lg overflow-hidden"
      >
        <Link
          to={item.path}
          onClick={handleClick}
          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
            isActive
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          {item.submenu && (
            <motion.div
              animate={{ rotate: isSubmenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isSubmenuOpen ? (
                <FaChevronDown className="w-4 h-4" />
              ) : (
                <FaChevronRight className="w-4 h-4" />
              )}
            </motion.div>
          )}
        </Link>

        {/* Submenu */}
        {item.submenu && (
          <AnimatePresence>
            {isSubmenuOpen && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-gray-50 ml-8 mt-1 rounded-lg"
              >
                {item.submenu.map((subItem, index) => (
                  <motion.li
                    key={subItem.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={subItem.path}
                      onClick={onClose}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-blue-600 transition-colors"
                    >
                      {subItem.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </li>
  )
}

export default SideMenu
