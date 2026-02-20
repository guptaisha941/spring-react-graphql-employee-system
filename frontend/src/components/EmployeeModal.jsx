import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSpinner } from 'react-icons/fa'

const EmployeeModal = ({ employee, onSave, onClose }) => {
  const isEditMode = !!employee
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    employeeClass: '',
    subjects: '',
    attendance: '',
    role: 'EMPLOYEE',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        age: employee.age || '',
        employeeClass: employee.employeeClass || '',
        subjects: employee.subjects?.join(', ') || '',
        attendance: employee.attendance || '',
        role: employee.role || 'EMPLOYEE',
      })
    }
  }, [employee])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    try {
      // Prepare data for API
      const submitData = {
        name: formData.name.trim(),
        age: formData.age ? parseInt(formData.age, 10) : null,
        employeeClass: formData.employeeClass.trim() || null,
        subjects: formData.subjects
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        attendance: formData.attendance ? parseInt(formData.attendance, 10) : null,
        role: formData.role || null,
      }

      await onSave(submitData)
    } catch (err) {
      // Handle validation errors from backend
      if (err.response?.data?.fieldErrors) {
        const fieldErrors = {}
        err.response.data.fieldErrors.forEach((fe) => {
          fieldErrors[fe.field] = fe.message
        })
        setErrors(fieldErrors)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={submitting}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={submitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="150"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={submitting}
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>

            {/* Employee Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Class
              </label>
              <input
                type="text"
                name="employeeClass"
                value={formData.employeeClass}
                onChange={handleChange}
                maxLength="100"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employeeClass ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={submitting}
              />
              {errors.employeeClass && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeClass}</p>
              )}
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subjects (comma-separated)
              </label>
              <input
                type="text"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                placeholder="Java, Spring Boot, React"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subjects ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={submitting}
              />
              {errors.subjects && (
                <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>
              )}
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendance (%)
              </label>
              <input
                type="number"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                min="0"
                max="100"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.attendance ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={submitting}
              />
              {errors.attendance && (
                <p className="mt-1 text-sm text-red-600">{errors.attendance}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={submitting}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting && <FaSpinner className="animate-spin" />}
                <span>{submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default EmployeeModal
