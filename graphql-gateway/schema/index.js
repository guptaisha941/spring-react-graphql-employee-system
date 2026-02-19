const typeDefs = `
  type Employee {
    id: ID!
    name: String!
    age: Int
    employeeClass: String
    subjects: [String]
    attendance: Int
  }

  type EmployeePage {
    content: [Employee]
    totalElements: Int
    totalPages: Int
  }

  type Query {
    employees(page: Int, size: Int, sort: String): EmployeePage
    employee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(input: EmployeeInput): Employee
    updateEmployee(id: ID!, input: EmployeeInput): Employee
  }

  input EmployeeInput {
    name: String!
    age: Int
    employeeClass: String
    subjects: [String]
    attendance: Int
  }
`.trim();

module.exports = { typeDefs };
