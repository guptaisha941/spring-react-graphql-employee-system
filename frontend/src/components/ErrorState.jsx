import { memo } from 'react'
import { motion } from 'framer-motion'
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa'

// Memoized error state to avoid re-rendering when message/onRetry are stable
const ErrorStateComponent = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-md p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="flex justify-center mb-4"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
        </div>
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Error Loading Data
      </h3>
      <p className="text-gray-600 mb-6">{message}</p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaRedo />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  )
}

const ErrorState = memo(ErrorStateComponent)

export default ErrorState
