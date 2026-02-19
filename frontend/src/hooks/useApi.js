import { useState, useEffect } from 'react'
import api from '../services/api'

/**
 * Custom hook for API calls
 * @param {string} url - API endpoint
 * @param {object} options - Request options (method, data, etc.)
 * @returns {object} - { data, loading, error, refetch }
 */
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api({
        url,
        ...options,
      })
      setData(response.data)
    } catch (err) {
      setError(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (url) {
      fetchData()
    }
  }, [url])

  return { data, loading, error, refetch: fetchData }
}
