import { useState } from 'react'

const Departments = () => {
  const [departments] = useState([
    { id: 1, name: 'Engineering', employees: 25, budget: '$500,000' },
    { id: 2, name: 'Sales', employees: 15, budget: '$300,000' },
    { id: 3, name: 'Marketing', employees: 12, budget: '$250,000' },
    { id: 4, name: 'HR', employees: 8, budget: '$150,000' },
    { id: 5, name: 'Finance', employees: 10, budget: '$200,000' },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Departments</h1>
        <p className="text-gray-600">
          Manage and view all departments.
          <span className="text-sm text-gray-500 ml-2">(Demo: Mock data - Backend integration pending)</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Budget
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dept.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {dept.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dept.employees}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dept.budget}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Departments
