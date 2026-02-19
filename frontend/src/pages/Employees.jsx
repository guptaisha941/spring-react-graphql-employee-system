import { useState, useEffect, useCallback, useMemo } from 'react'
import DataTable from '../components/DataTable'

const Employees = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Memoized mock data generator so it has a stable identity across renders
  const generateMockData = useCallback(() => {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations']
    const positions = ['Manager', 'Senior Developer', 'Developer', 'Analyst', 'Coordinator', 'Specialist']
    const statuses = ['Active', 'Inactive']
    
    return Array.from({ length: 47 }, (_, i) => ({
      id: i + 1,
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      salary: `$${(Math.random() * 100000 + 40000).toFixed(0)}`,
      joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    }))
  }, [])

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Simulate random errors (10% chance)
        if (Math.random() < 0.1) {
          throw new Error('Failed to fetch employee data. Please try again.')
        }
        
        setData(generateMockData())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [generateMockData])

  // Memoize column definitions so DataTable can skip re-rendering when nothing changed
  const columns = useMemo(
    () => [
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
    ],
    []
  )

  // Stable retry handler so memoized children don't re-render unnecessarily
  const handleRetry = useCallback(() => {
    setError(null)
    setLoading(true)
    setTimeout(() => {
      setData(generateMockData())
      setLoading(false)
    }, 1000)
  }, [generateMockData])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Employees</h1>
        <p className="text-gray-600">Manage and view all employees in the system</p>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        itemsPerPage={10}
        onRetry={handleRetry}
      />
    </div>
  )
}

export default Employees
