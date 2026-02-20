# Deployment & Testing Guide

Complete step-by-step guide for deploying and testing the Employee Management System.

---

## 🚀 Deployment Guide

### Prerequisites

- GitHub repository with your code
- Render account (free tier available)
- Vercel account (free tier available)
- Basic understanding of environment variables

---

## 📦 Step 1: Deploy PostgreSQL Database (Render)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Sign up/Login

2. **Create PostgreSQL Database**
   - Click **"New +"** → **"PostgreSQL"**
   - **Name**: `employee-db` (or your choice)
   - **Database**: `employee_db`
   - **User**: Auto-generated (note it down)
   - **Region**: Choose closest to you
   - Click **"Create Database"**

3. **Save Connection Details**
   - Wait for database to be created (~2 minutes)
   - Go to database dashboard
   - Copy the **Internal Database URL** (for backend service)
   - Copy the **External Database URL** (for local testing)
   - Note down:
     - Host
     - Port (usually 5432)
     - Database name
     - Username
     - Password

---

## 🔧 Step 2: Deploy Spring Boot Backend Service (Render)

1. **Create Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**
   - **Name**: `employee-service` (or your choice)
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `employee-service`
   - **Runtime**: `Docker` (recommended) or `Java`
   - **Build Command**: 
     ```bash
     mvn clean package -DskipTests
     ```
   - **Start Command**: 
     ```bash
     java -jar target/*.jar
     ```
   - **Instance Type**: Free tier (or paid for better performance)

3. **Set Environment Variables**
   Click **"Environment"** tab and add:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DB_HOST=<your-postgres-host>
   DB_PORT=5432
   DB_NAME=employee_db
   DB_USERNAME=<your-postgres-username>
   DB_PASSWORD=<your-postgres-password>
   JWT_SECRET=<generate-a-strong-secret-minimum-32-characters-long>
   JWT_EXPIRATION_MS=86400000
   JWT_REFRESH_EXPIRATION_MS=604800000
   SERVER_PORT=8080
   ```

   **Generate JWT_SECRET:**
   ```bash
   # On Linux/Mac
   openssl rand -base64 32
   
   # Or use online generator
   # https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
   ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for build to complete (~5-10 minutes)
   - Note the service URL: `https://employee-service.onrender.com`

5. **Verify Deployment**
   - Health check: `https://employee-service.onrender.com/api/actuator/health`
   - Should return: `{"status":"UP"}`

---

## 🌐 Step 3: Deploy GraphQL Gateway (Render)

1. **Create Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect same GitHub repository

2. **Configure Service**
   - **Name**: `graphql-gateway`
   - **Region**: Same as backend
   - **Root Directory**: `graphql-gateway`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm ci --only=production
     ```
   - **Start Command**: 
     ```bash
     node index.js
     ```
   - **Instance Type**: Free tier

3. **Set Environment Variables**
   ```
   PORT=4000
   NODE_ENV=production
   JWT_SECRET=<same-as-backend-service>
   EMPLOYEE_API_URL=https://employee-service.onrender.com/api
   CORS_ORIGIN=*
   EMPLOYEE_API_TIMEOUT=10000
   ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment (~3-5 minutes)
   - Note the service URL: `https://graphql-gateway.onrender.com`

5. **Verify Deployment**
   - Visit: `https://graphql-gateway.onrender.com/graphql`
   - Should see Apollo Studio interface (or GraphQL endpoint)

---

## 🎨 Step 4: Deploy Frontend (Vercel)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Set Environment Variables**
   Click **"Environment Variables"** and add:
   ```
   VITE_API_URL=https://graphql-gateway.onrender.com
   ```

5. **Deploy**
   - Click **"Deploy"**
   - Wait for build (~2-3 minutes)
   - Vercel will provide a URL: `https://your-project.vercel.app`

6. **Update CORS in GraphQL Gateway**
   - Go back to Render GraphQL Gateway service
   - Update environment variable:
     ```
     CORS_ORIGIN=https://your-project.vercel.app
     ```
   - Redeploy the gateway service

---

## ✅ Step 5: Post-Deployment Verification

### 1. Test Database Connection
```bash
# Using psql (if you have PostgreSQL client)
psql <your-external-database-url>

# Or use Render's database dashboard
# Go to database → Connect → Use external connection string
```

### 2. Test Backend Health
```bash
curl https://employee-service.onrender.com/api/actuator/health
# Expected: {"status":"UP"}
```

### 3. Test Authentication
```bash
curl -X POST https://employee-service.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"password123"}'

# Expected: JSON with accessToken, refreshToken, user
```

### 4. Test GraphQL Gateway
```bash
curl https://graphql-gateway.onrender.com/graphql
# Should return GraphQL endpoint response
```

### 5. Test Frontend
- Visit your Vercel URL
- Should see the login page
- Try logging in with admin credentials

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### Authentication Tests

- [ ] **Login as Admin**
  - Username: `admin`
  - Password: `password123`
  - Should redirect to dashboard
  - Should see admin menu options

- [ ] **Login as Employee**
  - Username: `employee1`
  - Password: `password123`
  - Should redirect to dashboard
  - Should NOT see admin-only features

- [ ] **Invalid Credentials**
  - Try wrong password
  - Should show error message

- [ ] **Token Expiration**
  - Wait for token to expire (or manually delete from localStorage)
  - Should redirect to login

#### Employee Management Tests (Admin)

- [ ] **View Employee List**
  - Navigate to Employees page
  - Should see paginated list
  - Test pagination controls

- [ ] **Sort Employees**
  - Click column headers
  - Should sort ascending/descending

- [ ] **Switch View Modes**
  - Toggle between Table and Tile view
  - Both should display correctly

- [ ] **View Employee Details**
  - Click on employee card/row
  - Modal should open with full details

- [ ] **Create Employee** (Admin only)
  - Click "Add Employee" (if implemented)
  - Fill form and submit
  - Should appear in list

- [ ] **Update Employee** (Admin only)
  - Click "Edit" on employee
  - Modify fields and save
  - Changes should persist

- [ ] **Delete Employee** (Admin only)
  - Click "Delete" on employee
  - Confirm deletion
  - Employee should be removed

#### Employee Management Tests (Employee Role)

- [ ] **View Employee List**
  - Login as employee
  - Should see employee list
  - Should NOT see edit/delete buttons

- [ ] **View Employee Details**
  - Click on employee
  - Should see details modal
  - Should NOT see edit/delete options

- [ ] **Attempt Unauthorized Actions**
  - Try to access admin routes directly
  - Should be redirected or see 403 error

#### Performance Tests

- [ ] **Page Load Time**
  - Open browser DevTools → Network tab
  - Initial load should be < 3 seconds

- [ ] **API Response Time**
  - Check Network tab for API calls
  - Response times should be < 500ms

- [ ] **Pagination Performance**
  - Navigate through multiple pages
  - Should load quickly without lag

---

## 🔍 API Testing with cURL

### 1. Login and Get Token

```bash
# Login
RESPONSE=$(curl -X POST https://employee-service.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"password123"}')

# Extract token (requires jq)
TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
echo "Token: $TOKEN"
```

### 2. Get Employees (REST API)

```bash
curl -X GET "https://employee-service.onrender.com/api/employees?page=0&size=10&sort=name,asc" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Get Single Employee

```bash
curl -X GET "https://employee-service.onrender.com/api/employees/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Create Employee (Admin only)

```bash
curl -X POST "https://employee-service.onrender.com/api/employees" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Employee",
    "age": 25,
    "employeeClass": "Junior",
    "subjects": ["Java", "Spring"],
    "attendance": 90
  }'
```

---

## 🧪 GraphQL Testing

### Using GraphQL Playground

1. **Access GraphQL Endpoint**
   - Visit: `https://graphql-gateway.onrender.com/graphql`
   - Or use Apollo Studio if configured

2. **Set Authorization Header**
   ```
   {
     "Authorization": "Bearer <your-access-token>"
   }
   ```

3. **Test Query**
   ```graphql
   query GetEmployees {
     employees(page: 0, size: 10, sort: "name,asc") {
       content {
         id
         name
         age
         employeeClass
       }
       totalElements
       totalPages
     }
   }
   ```

4. **Test Mutation** (Admin only)
   ```graphql
   mutation AddEmployee {
     addEmployee(input: {
       name: "New Employee"
       age: 28
       employeeClass: "Senior"
       subjects: ["GraphQL", "React"]
       attendance: 95
     }) {
       id
       name
     }
   }
   ```

### Using cURL for GraphQL

```bash
curl -X POST https://graphql-gateway.onrender.com/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { employees(page: 0, size: 10) { content { id name } totalElements } }"
  }'
```

---

## 🐛 Troubleshooting

### Backend Service Issues

**Problem**: Service won't start
- Check Render logs for errors
- Verify all environment variables are set
- Check database connection string
- Ensure JWT_SECRET is at least 32 characters

**Problem**: Database connection failed
- Verify database is running in Render
- Check DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
- Ensure database is accessible from service

**Problem**: Health check fails
- Check `/api/actuator/health` endpoint
- Verify Spring Boot started successfully
- Check application logs

### GraphQL Gateway Issues

**Problem**: Cannot connect to backend
- Verify EMPLOYEE_API_URL is correct
- Check backend service is running
- Test backend URL directly

**Problem**: CORS errors
- Update CORS_ORIGIN to match frontend URL
- Ensure credentials: true is set
- Check browser console for specific CORS error

**Problem**: Authentication fails
- Verify JWT_SECRET matches backend
- Check token is being sent in Authorization header
- Verify token hasn't expired

### Frontend Issues

**Problem**: Cannot connect to API
- Verify VITE_API_URL is set correctly
- Check GraphQL gateway is running
- Test API URL directly in browser

**Problem**: Login redirects fail
- Check React Router configuration
- Verify protected routes are set up correctly
- Check browser console for errors

**Problem**: Build fails on Vercel
- Check build logs for specific errors
- Verify all dependencies are in package.json
- Ensure Node.js version is compatible

---

## 📊 Monitoring & Logs

### Render Logs

1. **View Service Logs**
   - Go to service dashboard
   - Click **"Logs"** tab
   - Real-time logs are displayed

2. **Filter Logs**
   - Use search to find specific errors
   - Filter by log level (INFO, ERROR, WARN)

### Vercel Logs

1. **View Deployment Logs**
   - Go to project dashboard
   - Click on deployment
   - View build and runtime logs

2. **Function Logs**
   - If using serverless functions
   - Check function logs in dashboard

### Health Monitoring

**Backend Health Check:**
```bash
# Set up monitoring to ping:
https://employee-service.onrender.com/api/actuator/health

# Expected response every 30 seconds
```

**GraphQL Gateway Health:**
```bash
# Ping:
https://graphql-gateway.onrender.com/graphql

# Should return GraphQL endpoint
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Render and Vercel support automatic deployments:

- **Render**: Deploys on every push to main branch
- **Vercel**: Deploys on every push (configurable)

### Manual Deployment

- **Render**: Click "Manual Deploy" → "Deploy latest commit"
- **Vercel**: Push to GitHub or click "Redeploy"

---

## 📝 Post-Deployment Checklist

- [ ] All services are running
- [ ] Database is accessible
- [ ] Environment variables are set correctly
- [ ] Health checks are passing
- [ ] Authentication works
- [ ] RBAC permissions are correct
- [ ] Frontend can connect to API
- [ ] CORS is configured correctly
- [ ] Logs are accessible
- [ ] Error handling works
- [ ] Performance is acceptable

---

## 🎯 Quick Test Script

Save this as `test-deployment.sh`:

```bash
#!/bin/bash

BACKEND_URL="https://employee-service.onrender.com"
GATEWAY_URL="https://graphql-gateway.onrender.com"
FRONTEND_URL="https://your-project.vercel.app"

echo "Testing Backend Health..."
curl -f "$BACKEND_URL/api/actuator/health" || echo "❌ Backend health check failed"

echo -e "\nTesting Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"password123"}')

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
  echo "✅ Login successful"
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
else
  echo "❌ Login failed"
  exit 1
fi

echo -e "\nTesting GraphQL Gateway..."
curl -f "$GATEWAY_URL/graphql" || echo "❌ GraphQL gateway unreachable"

echo -e "\nTesting Frontend..."
curl -f "$FRONTEND_URL" || echo "❌ Frontend unreachable"

echo -e "\n✅ All tests passed!"
```

Make it executable and run:
```bash
chmod +x test-deployment.sh
./test-deployment.sh
```

---

## 🆘 Support

If you encounter issues:

1. Check service logs in Render/Vercel
2. Verify environment variables
3. Test endpoints individually
4. Check browser console for frontend errors
5. Review this troubleshooting section

---

**Happy Deploying! 🚀**
