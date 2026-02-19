import { memo } from 'react'
import { motion } from 'framer-motion'

// Memoized loading skeleton; props are primitive so this prevents redundant animations
const LoadingSkeletonComponent = ({ columns = 10, rows = 10 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Skeleton */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="h-4 bg-gray-200 rounded animate-pulse"
              style={{ width: `${Math.random() * 60 + 80}px` }}
            />
          ))}
        </div>
      </div>

      {/* Rows Skeleton */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: rowIndex * 0.05 }}
            className="px-6 py-4"
          >
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{ width: `${Math.random() * 60 + 80}px` }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const LoadingSkeleton = memo(LoadingSkeletonComponent)

export default LoadingSkeleton
