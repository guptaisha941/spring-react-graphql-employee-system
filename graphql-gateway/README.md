# GraphQL Gateway

Production-ready GraphQL API gateway built with Express, Apollo Server, and Node.js. Provides a GraphQL interface over the Spring Boot REST API with JWT authentication.

## 🚀 Tech Stack

- **Node.js 20** - Runtime environment
- **Express 4** - Web framework
- **Apollo Server 4** - GraphQL server
- **GraphQL** - Query language
- **Axios** - HTTP client for REST API calls
- **JWT** - Token-based authentication

## 📋 Prerequisites

- Node.js 20+ and npm
- Backend Spring Boot API running
- JWT secret key (at least 32 characters)

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server Configuration
PORT=4000

# JWT Configuration (REQUIRED)
JWT_SECRET=your-256-bit-secret-key-change-in-production-must-be-at-least-32-chars

# Employee API Configuration (REQUIRED)
EMPLOYEE_API_URL=http://localhost:8080/api

# Optional Configuration
EMPLOYEE_API_TIMEOUT=10000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
NODE_ENV=production
LOG_LEVEL=info
```

**Important:**
- `JWT_SECRET` must match the secret used by Spring Boot backend
- `EMPLOYEE_API_URL` must include the `/api` context path
- In production, set `NODE_ENV=production` and use a strong `JWT_SECRET`

## 🏃 Running the Application

### Development Mode

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Or:
   ```bash
   npm start
   ```

4. **The gateway will:**
   - Start on `http://localhost:4000`
   - GraphQL endpoint: `http://localhost:4000/graphql`
   - Health check: `http://localhost:4000/health`
   - Enable GraphQL introspection
   - Show detailed error messages

### Production Mode

1. **Set production environment variables:**
   ```bash
   NODE_ENV=production
   JWT_SECRET=<your-secure-secret-key>
   EMPLOYEE_API_URL=https://api.yourdomain.com/api
   CORS_ORIGIN=https://yourdomain.com
   LOG_LEVEL=warn
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Production features:**
   - GraphQL introspection disabled
   - Sanitized error messages
   - Security headers enabled
   - Reduced logging (errors/warnings only)
   - CSRF protection enabled

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t graphql-gateway:latest .
```

### Run with Docker

```bash
docker run -d \
  --name graphql-gateway \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secure-secret-key \
  -e EMPLOYEE_API_URL=http://employee-service:8080/api \
  -e CORS_ORIGIN=https://yourdomain.com \
  graphql-gateway:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  graphql-gateway:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - EMPLOYEE_API_URL=http://employee-service:8080/api
      - CORS_ORIGIN=${CORS_ORIGIN}
    depends_on:
      - employee-service
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🔐 Authentication

All GraphQL queries and mutations require JWT authentication:

1. **Get token from Spring Boot API:**
   ```bash
   POST http://localhost:8080/api/v1/auth/login
   {
     "usernameOrEmail": "admin",
     "password": "password123"
   }
   ```

2. **Use token in GraphQL requests:**
   ```bash
   POST http://localhost:4000/graphql
   Headers:
     Authorization: Bearer <your-jwt-token>
   Body:
     {
       "query": "{ employees { content { id name age } } }"
     }
   ```

## 📊 GraphQL API

### Queries

**Get Employees (Paginated):**
```graphql
query {
  employees(page: 0, size: 10, sort: "name,asc") {
    content {
      id
      name
      age
      employeeClass
      subjects
      attendance
    }
    totalElements
    totalPages
  }
}
```

**Get Employee by ID:**
```graphql
query {
  employee(id: "1") {
    id
    name
    age
    employeeClass
    subjects
    attendance
  }
}
```

### Mutations

**Create Employee:**
```graphql
mutation {
  addEmployee(input: {
    name: "John Doe"
    age: 30
    employeeClass: "Engineering"
    subjects: ["Math", "Science"]
    attendance: 95
  }) {
    id
    name
    age
  }
}
```

**Update Employee:**
```graphql
mutation {
  updateEmployee(
    id: "1"
    input: {
      name: "Jane Doe"
      age: 31
      attendance: 98
    }
  ) {
    id
    name
    age
    attendance
  }
}
```

## 🏥 Health Check

The gateway provides a health check endpoint:

```bash
GET http://localhost:4000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "graphql-gateway",
  "timestamp": "2026-02-20T14:30:00.000Z",
  "uptime": 3600
}
```

## 🔒 Security Features

- **JWT Authentication:** All requests require valid JWT tokens
- **Security Headers:** XSS protection, content type sniffing prevention
- **CORS:** Configurable origin restrictions
- **Error Sanitization:** Production errors don't expose internal details
- **CSRF Protection:** Enabled in Apollo Server
- **Non-root User:** Docker container runs as non-root user
- **Input Validation:** GraphQL schema validation

## 📁 Project Structure

```
graphql-gateway/
├── index.js              # Main server entry point
├── schema/               # GraphQL schema definitions
│   └── index.js
├── resolvers/            # GraphQL resolvers
│   └── index.js
├── middleware/           # Express middleware
│   └── index.js          # JWT validation middleware
├── services/             # Business logic services
│   ├── employeeService.js
│   └── index.js
├── utils/                # Utility functions
│   └── logger.js         # Production-aware logger
├── Dockerfile            # Docker build configuration
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## 🐛 Error Handling

### GraphQL Errors

Errors are formatted consistently:

```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Error Codes

- `UNAUTHENTICATED` - Missing or invalid JWT token
- `BAD_REQUEST` - Invalid input parameters
- `NOT_FOUND` - Resource not found
- `SERVICE_UNAVAILABLE` - Backend API unavailable
- `INTERNAL_SERVER_ERROR` - Server error

## 📝 Logging

Logging is environment-aware:

- **Development:** All log levels (error, warn, info, debug)
- **Production:** Only errors and warnings by default

Configure log level via `LOG_LEVEL` environment variable:
- `error` - Only errors
- `warn` - Errors and warnings
- `info` - Errors, warnings, and info (default in production)
- `debug` - All messages (default in development)

## 🚨 Troubleshooting

### Gateway Won't Start

- **Check environment variables:** Ensure `JWT_SECRET` and `EMPLOYEE_API_URL` are set
- **Check port availability:** Default port is 4000
- **Check Node.js version:** Requires Node.js 20+

### Authentication Errors

- **Invalid token:** Verify JWT secret matches backend
- **Token expired:** Get a new token from `/api/v1/auth/login`
- **Missing token:** Include `Authorization: Bearer <token>` header

### Backend Connection Issues

- **Verify backend URL:** Check `EMPLOYEE_API_URL` is correct
- **Check backend is running:** Test backend health endpoint
- **Network connectivity:** Ensure gateway can reach backend
- **CORS issues:** Verify backend CORS configuration

### GraphQL Errors

- **Schema validation:** Check query/mutation syntax
- **Field errors:** Verify requested fields exist in schema
- **Type errors:** Ensure input types match schema

## 🔄 Graceful Shutdown

The gateway handles graceful shutdown:

- **SIGTERM/SIGINT:** Closes HTTP server gracefully
- **Uncaught exceptions:** Logs and shuts down gracefully
- **Unhandled rejections:** Logs and shuts down gracefully
- **Timeout:** Forces shutdown after 10 seconds if needed

## 📊 Performance

- **Connection pooling:** Axios reuses connections
- **Request timeout:** Configurable via `EMPLOYEE_API_TIMEOUT`
- **Error caching:** Prevents repeated failed requests
- **Minimal overhead:** Lightweight GraphQL layer

## 📄 License

This project is proprietary software.

## 👥 Support

For issues or questions, contact the development team.
