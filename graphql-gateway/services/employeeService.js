const axios = require('axios');

const API_BASE_URL = process.env.EMPLOYEE_API_URL;
const API_TIMEOUT = parseInt(process.env.EMPLOYEE_API_TIMEOUT || '10000', 10);

if (!API_BASE_URL) {
  throw new Error('EMPLOYEE_API_URL environment variable is required');
}

/**
 * Creates an Axios instance configured for the Employee API
 */
function createApiClient(token) {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: API_TIMEOUT,
  });

  return client;
}

/**
 * Employee service for interacting with Spring Boot REST API
 */
class EmployeeService {
  constructor(token) {
    this.client = createApiClient(token);
  }

  /**
   * Get paginated list of employees
   * @param {Object} params - { page, size, sort }
   * @returns {Promise<Object>} EmployeePage response
   */
  async getEmployees(params = {}) {
    try {
      const { page, size, sort } = params;
      const queryParams = new URLSearchParams();
      
      if (page !== undefined) queryParams.append('page', page);
      if (size !== undefined) queryParams.append('size', size);
      if (sort) queryParams.append('sort', sort);

      const url = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.client.get(url);
      
      return {
        content: response.data.content || response.data || [],
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch employees');
    }
  }

  /**
   * Get a single employee by ID
   * @param {string} id - Employee ID
   * @returns {Promise<Object>} Employee object
   */
  async getEmployeeById(id) {
    try {
      const response = await this.client.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch employee with id ${id}`);
    }
  }

  /**
   * Create a new employee
   * @param {Object} input - EmployeeInput data
   * @returns {Promise<Object>} Created employee
   */
  async createEmployee(input) {
    try {
      const response = await this.client.post('/employees', input);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create employee');
    }
  }

  /**
   * Update an existing employee
   * @param {string} id - Employee ID
   * @param {Object} input - EmployeeInput data
   * @returns {Promise<Object>} Updated employee
   */
  async updateEmployee(id, input) {
    try {
      const response = await this.client.put(`/employees/${id}`, input);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update employee with id ${id}`);
    }
  }

  /**
   * Handle and format API errors
   * @param {Error} error - Axios error
   * @param {string} defaultMessage - Default error message
   * @returns {Error} Formatted GraphQL error
   */
  handleError(error, defaultMessage) {
    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || defaultMessage;
      const errorObj = new Error(message);
      errorObj.extensions = {
        code: this.getErrorCode(status),
        statusCode: status,
        ...(error.response.data && { details: error.response.data }),
      };
      return errorObj;
    } else if (error.request) {
      // Request made but no response received
      const errorObj = new Error('Unable to reach employee service');
      errorObj.extensions = {
        code: 'SERVICE_UNAVAILABLE',
      };
      return errorObj;
    } else {
      // Error setting up request
      const errorObj = new Error(error.message || defaultMessage);
      errorObj.extensions = {
        code: 'INTERNAL_ERROR',
      };
      return errorObj;
    }
  }

  /**
   * Map HTTP status codes to GraphQL error codes
   * @param {number} status - HTTP status code
   * @returns {string} Error code
   */
  getErrorCode(status) {
    const statusMap = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };
    return statusMap[status] || 'INTERNAL_ERROR';
  }
}

module.exports = { EmployeeService };
