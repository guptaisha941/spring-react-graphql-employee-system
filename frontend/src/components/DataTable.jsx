import { useState, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import Pagination from './Pagination'
import LoadingSkeleton from './LoadingSkeleton'
import ErrorState from './ErrorState'
import TileView from './TileView'
import ViewToggle from './ViewToggle'

// Memoized table component to avoid unnecessary re-renders when props remain the same
const DataTableComponent = ({ 
  data = [], 
  columns = [], 
  loading = false, 
  error = null,
  itemsPerPage = 10,
  onRetry = null
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [viewMode, setViewMode] = useState('table') // 'table' or 'tile'

  // Default columns if none provided
  const defaultColumns = useMemo(() => {
    if (columns.length > 0) return columns
    return [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'department', label: 'Department', sortable: true },
      { key: 'position', label: 'Position', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'salary', label: 'Salary', sortable: true },
      { key: 'joinDate', label: 'Join Date', sortable: true },
      { key: 'phone', label: 'Phone', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false },
    ]
  }, [columns])

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1) // Reset to first page on sort
  }

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
    })
  }, [data, sortConfig])

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (!defaultColumns.find(col => col.key === columnKey)?.sortable) {
      return null
    }

    if (sortConfig.key !== columnKey) {
      return <FaSort className="text-gray-400 ml-2" />
    }

    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="text-blue-600 ml-2" />
    ) : (
      <FaSortDown className="text-blue-600 ml-2" />
    )
  }

  if (loading) {
    return <LoadingSkeleton columns={defaultColumns.length} rows={itemsPerPage} />
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Data Table ({sortedData.length} items)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}
          </p>
        </div>
        <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {defaultColumns.map((column, index) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center">
                        {column.label}
                        {renderSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id || rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.02 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {defaultColumns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.key === 'actions' ? (
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 font-medium">
                              Delete
                            </button>
                          </div>
                        ) : column.key === 'status' ? (
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            row[column.key] === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {row[column.key]}
                          </span>
                        ) : (
                          row[column.key] || '-'
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <TileView data={paginatedData} columns={defaultColumns} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

const DataTable = memo(DataTableComponent)

export default DataTable
