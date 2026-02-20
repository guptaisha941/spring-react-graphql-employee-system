import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa'
import DataTable from '../components/DataTable'
import api from '../services/api'
import { useApp } from '../context/AppContext'
import EmployeeModal from '../components/EmployeeModal'
import logger from '../utils/logger'

const Employees = () => {
  const { user, isAdmin } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(20)
  const [sort, setSort] = useState('name,asc')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [deletingEmployee, setDeletingEmployee] = useState(null)

  // Get search query from URL
  const searchQuery = searchParams.get('search') || ''

  // Fetch employees from backend API
  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sort: sort,
      }
      
      // Add search filter if present
      if (searchQuery) {
        params.name = searchQuery
      }
      
      const response = await api.get('/employees', { params })
      
      const pageData = response.data
      setData(pageData.content || [])
      setTotalPages(pageData.totalPages || 0)
      setTotalElements(pageData.totalElements || 0)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch employees. Please try again.'
      setError(message)
      logger.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, sort, searchQuery])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // Handle create employee
  const handleCreate = () => {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  // Handle edit employee
  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  // Handle delete employee
  const handleDelete = async (employee) => {
    if (!window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      return
    }

    setDeletingEmployee(employee.id)
    try {
      await api.delete(`/employees/${employee.id}`)
      // Refresh the list
      await fetchEmployees()
      setDeletingEmployee(null)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete employee. Please try again.'
      alert(message)
      setDeletingEmployee(null)
      logger.error('Error deleting employee:', err)
    }
  }

  // Handle modal save
  const handleModalSave = async (employeeData) => {
    try {
      if (editingEmployee) {
        // Update existing employee
        await api.put(`/employees/${editingEmployee.id}`, employeeData)
      } else {
        // Create new employee
        await api.post('/employees', employeeData)
      }
      setIsModalOpen(false)
      setEditingEmployee(null)
      // Refresh the list
      await fetchEmployees()
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.fieldErrors?.map(fe => `${fe.field}: ${fe.message}`).join(', ') ||
        err.message ||
        'Failed to save employee. Please try again.'
      alert(message)
      logger.error('Error saving employee:', err)
      throw err // Re-throw to let modal handle it
    }
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  // Handle retry
  const handleRetry = useCallback(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // Map backend data to table format
  const mappedData = useMemo(() => {
    return data.map((emp) => ({
      id: emp.id,
      name: emp.name || '-',
      age: emp.age || '-',
      employeeClass: emp.employeeClass || '-',
      subjects: emp.subjects?.join(', ') || '-',
      attendance: emp.attendance !== null && emp.attendance !== undefined ? `${emp.attendance}%` : '-',
      role: emp.role || '-',
      createdAt: emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '-',
      updatedAt: emp.updatedAt ? new Date(emp.updatedAt).toLocaleDateString() : '-',
      _raw: emp, // Store raw data for edit/delete
    }))
  }, [data])

  // Column definitions
  const columns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'age', label: 'Age', sortable: true },
      { key: 'employeeClass', label: 'Class', sortable: true },
      { key: 'subjects', label: 'Subjects', sortable: false },
      { key: 'attendance', label: 'Attendance', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'createdAt', label: 'Created', sortable: true },
      ...(isAdmin ? [{ key: 'actions', label: 'Actions', sortable: false }] : []),
    ],
    [isAdmin]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employees</h1>
          <p className="text-gray-600">
            Manage and view all employees in the system ({totalElements} total)
            {searchQuery && (
              <span className="ml-2 text-sm text-blue-600">
                - Filtered by: "{searchQuery}"
                <button
                  onClick={() => {
                    setSearchParams({})
                    setCurrentPage(0)
                  }}
                  className="ml-2 text-red-600 hover:underline"
                >
                  Clear
                </button>
              </span>
            )}
          </p>
        </div>
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <FaPlus />
            <span>Add Employee</span>
          </motion.button>
        )}
      </div>

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <DataTable
        data={mappedData}
        columns={columns}
        loading={loading}
        error={error}
        itemsPerPage={pageSize}
        onRetry={handleRetry}
        onEdit={isAdmin ? handleEdit : null}
        onDelete={isAdmin ? handleDelete : null}
        deletingId={deletingEmployee}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        disableClientSort={true}
        onSortChange={(sortString) => {
          setSort(sortString)
          setCurrentPage(0) // Reset to first page on sort
        }}
      />

      {/* Employee Modal for Create/Edit */}
      {isModalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleModalSave}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default Employees
