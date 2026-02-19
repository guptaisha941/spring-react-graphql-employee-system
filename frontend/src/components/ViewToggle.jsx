import { memo } from 'react'
import { motion } from 'framer-motion'
import { FaTable, FaTh } from 'react-icons/fa'

// Memoized view toggle; it only re-renders when viewMode or onToggle change
const ViewToggleComponent = ({ viewMode, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggle('table')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'table'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <FaTable />
        <span className="text-sm font-medium">Table</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggle('tile')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'tile'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <FaTh />
        <span className="text-sm font-medium">Tile</span>
      </motion.button>
    </div>
  )
}

const ViewToggle = memo(ViewToggleComponent)

export default ViewToggle
