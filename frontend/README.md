# Employee Management Frontend

Production-ready React application built with Vite, React 18, and modern tooling.

## 🚀 Tech Stack

- **Vite 5** - Fast build tool and dev server
- **React 18** - UI library with hooks
- **React Router 6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (Spring Boot service)

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# API Configuration (REQUIRED)
VITE_API_URL=http://localhost:8080/api

# Optional
VITE_API_TIMEOUT=30000
```

**Important:** The API URL must include the `/api` context path from Spring Boot.

## 🏃 Running the Application

### Development Mode

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_URL=http://localhost:8080/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **The app will:**
   - Start on `http://localhost:5173`
   - Hot reload on file changes
   - Show detailed error messages
   - Log all API calls to console

### Production Build

1. **Set production environment variables:**
   
   Create `.env.production` file (or use `.env` for local testing):
   ```bash
   # .env.production
   VITE_API_URL=https://api.yourdomain.com/api
   VITE_API_TIMEOUT=30000
   ```
   
   **Note:** Vite automatically loads `.env.production` during build. For local preview, you can use `.env` file.

2. **Build for production:**
   ```bash
   npm run build
   ```
   
   This will:
   - Create optimized, minified production build in `dist/` folder
   - Split code into vendor chunks for better caching
   - Remove source maps (for smaller bundle size)
   - Use esbuild for fast minification
   - Generate production-ready static assets

3. **Preview production build locally:**
   
   After building, preview the production build:
   ```bash
   npm run preview
   ```
   
   The preview server will:
   - Start on `http://localhost:4173` (configurable in `vite.config.js`)
   - Serve the production build from `dist/` folder
   - Simulate production environment locally
   - Allow testing before deployment
   
   **Important:** Make sure your backend API is accessible at the URL specified in `.env.production` or `.env` file.

4. **Deploy the `dist/` folder:**
   - The `dist/` folder contains optimized, minified production build
   - Deploy to Vercel, Netlify, or any static hosting service
   - Or use the included Dockerfile for containerized deployment

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t employee-frontend:latest .
```

### Run with Docker

```bash
docker run -d \
  --name employee-frontend \
  -p 3000:80 \
  -e VITE_API_URL=https://api.yourdomain.com/api \
  employee-frontend:latest
```

## 🔐 Authentication & Security

### JWT Token Storage

- **Storage:** Tokens stored in `localStorage`
- **Security:** Tokens are automatically added to API requests via Axios interceptor
- **Logout:** Tokens are securely removed on logout
- **Expiration:** 401 responses automatically clear tokens and redirect to login

### Token Flow

1. User logs in → Token stored in `localStorage`
2. All API requests → Token added to `Authorization: Bearer <token>` header
3. Token expires → 401 response → Auto-redirect to login
4. User logs out → Token removed from `localStorage`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── DataTable.jsx
│   │   ├── EmployeeModal.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Employees.jsx
│   │   ├── Login.jsx
│   │   └── ...
│   ├── services/       # API services
│   │   └── api.js      # Axios configuration
│   ├── context/        # React Context
│   │   └── AppContext.jsx
│   ├── utils/          # Utility functions
│   │   └── logger.js    # Production logger
│   ├── hooks/          # Custom hooks
│   └── layouts/        # Layout components
├── public/             # Static assets
├── .env.example        # Environment variables template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## 🎨 Features

- ✅ **Real API Integration** - Fetches data from Spring Boot backend
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete employees
- ✅ **Role-Based Access** - Admin vs Employee permissions
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Error Handling** - Comprehensive error boundaries and API error handling
- ✅ **Loading States** - Loading indicators for all async operations
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Production Optimized** - Minified, chunked, and optimized builds

## 🐛 Error Handling

### API Errors

- **401 Unauthorized:** Automatically redirects to login
- **Network Errors:** Shows user-friendly error messages
- **Timeout Errors:** Configurable timeout (default 30s)
- **Validation Errors:** Field-level error display

### Error Boundaries

- Catches React component errors
- Shows user-friendly error page
- Development: Shows error details
- Production: Shows generic message

## 📊 Performance Optimizations

- **Code Splitting:** Automatic route-based splitting
- **Vendor Chunks:** Separate React, UI, and HTTP libraries
- **Tree Shaking:** Unused code removed in production
- **Minification:** Terser minification with console removal
- **Memoization:** React.memo, useMemo, useCallback for re-render optimization

## 🔍 Development Tools

### Linting

```bash
npm run lint
```

### Build Analysis

```bash
# Build and check output
npm run build

# Check dist/ folder size and contents
# Windows PowerShell:
Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum

# Linux/Mac:
du -sh dist
```

### Production Preview Workflow

**Complete workflow for testing production build:**

```bash
# 1. Set production environment variables
# Edit .env.production or .env with production API URL
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production

# 2. Build for production
npm run build

# 3. Preview production build locally
npm run preview

# 4. Open browser to http://localhost:4173
# 5. Test all functionality with production build
# 6. Verify API calls work correctly
# 7. Check browser console for any errors
# 8. Test on different devices/network if needed
```

**Preview Server Options:**

- Default URL: `http://localhost:4173`
- To change port: Edit `vite.config.js` preview.port
- To auto-open browser: Set `preview.open: true` in `vite.config.js`
- To access from network: Set `preview.host: true` in `vite.config.js`

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | - |
| `VITE_API_TIMEOUT` | API request timeout (ms) | No | 30000 |

## 🚨 Troubleshooting

### API Connection Issues

- Verify `VITE_API_URL` is correct (must include `/api`)
- Check backend is running on correct port
- Verify CORS is configured on backend

### Build Failures

**Common Issues:**

1. **Permission Errors (EPERM):**
   - On Windows: Run terminal as Administrator
   - Close any processes using the `dist/` folder
   - Clear build cache: `rm -rf dist node_modules/.vite`

2. **Module Resolution Errors:**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Clear Vite cache: `rm -rf node_modules/.vite`
   - Check Node.js version: `node --version` (should be 18+)

3. **Environment Variable Issues:**
   - Ensure `.env` or `.env.production` exists
   - Verify `VITE_API_URL` is set correctly
   - Restart terminal after changing `.env` files

4. **Port Already in Use (Preview):**
   - Change port in `vite.config.js` preview section
   - Or kill process using port 4173: `netstat -ano | findstr :4173`

### Preview Server Issues

- **Preview not starting:** Ensure `npm run build` completed successfully first
- **API calls failing:** Verify `.env` file has correct `VITE_API_URL` for your backend
- **CORS errors:** Check backend CORS configuration includes preview server URL

### Token Issues

- Check browser console for token errors
- Verify token is stored: `localStorage.getItem('token')`
- Clear storage and re-login if token is corrupted

## 📄 License

This project is proprietary software.

## 👥 Support

For issues or questions, contact the development team.
