# Testing Guide

Comprehensive testing guide for the Employee Management System.

---

## 🧪 Testing Overview

This guide covers:
- Unit Testing
- Integration Testing
- API Testing
- End-to-End Testing
- Performance Testing
- Security Testing

---

## 🔧 Setup Testing Environment

### Prerequisites

```bash
# Backend
cd employee-service
mvn test

# Frontend
cd frontend
npm test

# GraphQL Gateway
cd graphql-gateway
npm test  # If tests are added
```

---

## 📝 Unit Tests

### Backend Unit Tests

**Test Structure:**
```
employee-service/src/test/java/
└── com/company/employee/
    ├── service/
    │   └── EmployeeServiceTest.java
    ├── controller/
    │   └── EmployeeControllerTest.java
    └── security/
        └── JwtUtilTest.java
```

**Run Tests:**
```bash
cd employee-service
mvn test

# Run specific test
mvn test -Dtest=EmployeeServiceTest

# Run with coverage
mvn test jacoco:report
```

**Example Test:**
```java
@SpringBootTest
@Transactional
class EmployeeServiceTest {
    
    @Autowired
    private EmployeeService employeeService;
    
    @Test
    void testGetAllEmployees() {
        Page<EmployeeResponse> result = employeeService.getAllEmployees(
            0, 20, "name,asc", null
        );
        assertNotNull(result);
        assertTrue(result.getTotalElements() >= 0);
    }
}
```

### Frontend Unit Tests

**Run Tests:**
```bash
cd frontend
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

**Example Test:**
```javascript
import { render, screen } from '@testing-library/react';
import Employees from './pages/Employees';

test('renders employee list', () => {
  render(<Employees />);
  const heading = screen.getByText(/Employees/i);
  expect(heading).toBeInTheDocument();
});
```

---

## 🔗 Integration Tests

### Backend Integration Tests

**Test Database Operations:**
```java
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class EmployeeControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private UserRepository userRepository;
    
    private String accessToken;
    
    @BeforeEach
    void setUp() {
        // Create test user and get token
        accessToken = getAccessToken("admin", "password123");
    }
    
    @Test
    void testGetEmployees() throws Exception {
        mockMvc.perform(get("/api/employees")
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
}
```

### API Integration Tests

**Test Full Request Flow:**
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"password123"}' \
  | jq -r '.accessToken')

# 2. Get Employees
curl -X GET "http://localhost:8080/api/employees?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. Create Employee
curl -X POST "http://localhost:8080/api/employees" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "age": 25,
    "employeeClass": "Junior"
  }'
```

---

## 🌐 API Testing

### REST API Testing

**Using Postman:**

1. **Import Collection**
   - Create new collection: "Employee Management API"
   - Add requests for each endpoint

2. **Set Environment Variables**
   ```
   base_url: http://localhost:8080/api
   token: (set after login)
   ```

3. **Test Flow:**
   - Login → Save token
   - Get Employees → Verify pagination
   - Create Employee → Verify response
   - Update Employee → Verify changes
   - Delete Employee → Verify deletion

**Using cURL:**

```bash
# Test script
#!/bin/bash

BASE_URL="http://localhost:8080/api"

# Login
echo "Testing Login..."
LOGIN=$(curl -s -X POST "$BASE_URL/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"password123"}')

TOKEN=$(echo $LOGIN | jq -r '.accessToken')
echo "Token: $TOKEN"

# Get Employees
echo -e "\nTesting Get Employees..."
curl -X GET "$BASE_URL/employees?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Get Single Employee
echo -e "\n\nTesting Get Employee by ID..."
curl -X GET "$BASE_URL/employees/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### GraphQL API Testing

**Using GraphQL Playground:**

1. **Access Playground**
   - Visit: `http://localhost:4000/graphql`

2. **Set Headers**
   ```json
   {
     "Authorization": "Bearer <your-token>"
   }
   ```

3. **Test Queries**
   ```graphql
   query GetEmployees {
     employees(page: 0, size: 10, sort: "name,asc") {
       content {
         id
         name
         age
       }
       totalElements
       totalPages
     }
   }
   ```

4. **Test Mutations**
   ```graphql
   mutation AddEmployee {
     addEmployee(input: {
       name: "Test Employee"
       age: 30
       employeeClass: "Senior"
     }) {
       id
       name
     }
   }
   ```

**Using Insomnia/GraphiQL:**

- Import GraphQL schema
- Set authorization header
- Test queries and mutations interactively

---

## 🎭 End-to-End Testing

### Manual E2E Test Scenarios

**Scenario 1: Admin Workflow**
1. Login as admin
2. Navigate to Employees page
3. View employee list
4. Click on employee to see details
5. Create new employee
6. Edit employee
7. Delete employee
7. Logout

**Scenario 2: Employee Workflow**
1. Login as employee
2. Navigate to Employees page
3. View employee list (read-only)
4. Click on employee to see details
5. Verify edit/delete buttons are hidden
6. Logout

**Scenario 3: Unauthorized Access**
1. Try to access `/employees` without login
2. Should redirect to login
3. Login with employee account
4. Try to access admin-only features
5. Should show 403 or redirect

### Automated E2E Testing (Cypress/Playwright)

**Example Cypress Test:**
```javascript
describe('Employee Management', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[name="username"]').type('admin');
    cy.get('[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  it('should display employee list', () => {
    cy.visit('/employees');
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });

  it('should paginate employees', () => {
    cy.visit('/employees');
    cy.get('[aria-label="Next page"]').click();
    cy.url().should('include', 'page=2');
  });
});
```

---

## ⚡ Performance Testing

### Load Testing with Apache Bench

```bash
# Test backend endpoint
ab -n 1000 -c 10 \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/employees?page=0&size=20

# Expected: < 200ms average response time
```

### Load Testing with k6

```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  let token = 'YOUR_TOKEN';
  let headers = {
    'Authorization': `Bearer ${token}`,
  };
  
  let res = http.get('http://localhost:8080/api/employees?page=0&size=20', {
    headers: headers,
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

Run:
```bash
k6 run load-test.js
```

### Frontend Performance Testing

**Lighthouse Audit:**
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view

# Check metrics:
# - First Contentful Paint < 1.8s
# - Time to Interactive < 3.8s
# - Performance Score > 90
```

**React DevTools Profiler:**
1. Open React DevTools
2. Go to Profiler tab
3. Record interaction
4. Analyze component render times
5. Identify performance bottlenecks

---

## 🔒 Security Testing

### Authentication Tests

**Test Invalid Credentials:**
```bash
# Wrong password
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"wrong"}'

# Should return 401 Unauthorized
```

**Test Token Validation:**
```bash
# Expired token
curl -X GET http://localhost:8080/api/employees \
  -H "Authorization: Bearer expired_token"

# Invalid token
curl -X GET http://localhost:8080/api/employees \
  -H "Authorization: Bearer invalid_token"

# Missing token
curl -X GET http://localhost:8080/api/employees

# All should return 401
```

### Authorization Tests

**Test RBAC:**
```bash
# Login as employee
EMPLOYEE_TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"employee1","password":"password123"}' \
  | jq -r '.accessToken')

# Try to create employee (should fail)
curl -X POST http://localhost:8080/api/employees \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'

# Should return 403 Forbidden
```

### Input Validation Tests

**Test SQL Injection:**
```bash
# Should be sanitized
curl -X GET "http://localhost:8080/api/employees?name=' OR '1'='1" \
  -H "Authorization: Bearer $TOKEN"
```

**Test XSS:**
```bash
# Should be escaped
curl -X POST http://localhost:8080/api/employees \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>"}'
```

---

## 📊 Test Coverage

### Backend Coverage

```bash
cd employee-service

# Generate coverage report
mvn test jacoco:report

# View report
open target/site/jacoco/index.html

# Target: > 80% coverage
```

### Frontend Coverage

```bash
cd frontend

# Run with coverage
npm test -- --coverage

# View report
open coverage/lcov-report/index.html

# Target: > 70% coverage
```

---

## ✅ Test Checklist

### Functional Tests
- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] Admin can view all employees
- [ ] Admin can create employee
- [ ] Admin can update employee
- [ ] Admin can delete employee
- [ ] Employee can view employees (read-only)
- [ ] Employee cannot create/update/delete
- [ ] Pagination works correctly
- [ ] Sorting works correctly
- [ ] Filtering works correctly

### Non-Functional Tests
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Handles 100+ concurrent users
- [ ] Error messages are user-friendly
- [ ] Mobile responsive design

### Security Tests
- [ ] JWT tokens are validated
- [ ] RBAC is enforced
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection (if applicable)
- [ ] Password is hashed (BCrypt)

---

## 🐛 Debugging Tests

### Backend Debugging

```bash
# Run tests with debug output
mvn test -X

# Run specific test with debug
mvn -Dtest=EmployeeServiceTest -Dmaven.surefire.debug test

# Attach debugger on port 5005
```

### Frontend Debugging

```bash
# Run tests with verbose output
npm test -- --verbose

# Run tests in watch mode
npm test -- --watch

# Debug in browser
npm test -- --runInBand --no-cache
```

---

## 📈 Continuous Testing

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '17'
      - run: cd employee-service && mvn test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: cd frontend && npm ci && npm test
```

---

**Happy Testing! 🧪**
