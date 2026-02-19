const { EmployeeService } = require('../services/employeeService');
const { GraphQLError } = require('graphql');

const resolvers = {
  Query: {
    /**
     * Get paginated list of employees with sorting support
     */
    employees: async (parent, args, context) => {
      const { page, size, sort } = args;
      const { token } = context;

      if (!token) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      try {
        const employeeService = new EmployeeService(token);
        return await employeeService.getEmployees({ page, size, sort });
      } catch (error) {
        // Re-throw GraphQL errors as-is, wrap others
        if (error.extensions) {
          throw error;
        }
        throw new GraphQLError(error.message || 'Failed to fetch employees', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    /**
     * Get a single employee by ID
     */
    employee: async (parent, args, context) => {
      const { id } = args;
      const { token } = context;

      if (!token) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (!id) {
        throw new GraphQLError('Employee ID is required', {
          extensions: { code: 'BAD_REQUEST' },
        });
      }

      try {
        const employeeService = new EmployeeService(token);
        return await employeeService.getEmployeeById(id);
      } catch (error) {
        if (error.extensions) {
          throw error;
        }
        throw new GraphQLError(error.message || `Failed to fetch employee with id ${id}`, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },

  Mutation: {
    /**
     * Create a new employee
     */
    addEmployee: async (parent, args, context) => {
      const { input } = args;
      const { token } = context;

      if (!token) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (!input) {
        throw new GraphQLError('Employee input is required', {
          extensions: { code: 'BAD_REQUEST' },
        });
      }

      if (!input.name) {
        throw new GraphQLError('Employee name is required', {
          extensions: { code: 'BAD_REQUEST' },
        });
      }

      try {
        const employeeService = new EmployeeService(token);
        return await employeeService.createEmployee(input);
      } catch (error) {
        if (error.extensions) {
          throw error;
        }
        throw new GraphQLError(error.message || 'Failed to create employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    /**
     * Update an existing employee
     */
    updateEmployee: async (parent, args, context) => {
      const { id, input } = args;
      const { token } = context;

      if (!token) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (!id) {
        throw new GraphQLError('Employee ID is required', {
          extensions: { code: 'BAD_REQUEST' },
        });
      }

      if (!input) {
        throw new GraphQLError('Employee input is required', {
          extensions: { code: 'BAD_REQUEST' },
        });
      }

      try {
        const employeeService = new EmployeeService(token);
        return await employeeService.updateEmployee(id, input);
      } catch (error) {
        if (error.extensions) {
          throw error;
        }
        throw new GraphQLError(error.message || `Failed to update employee with id ${id}`, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
};

module.exports = { resolvers };
