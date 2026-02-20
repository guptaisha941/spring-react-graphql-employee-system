# Build & Preview Guide

Quick reference for building and previewing the production React application.

## Quick Start

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Build for production
npm run build

# 3. Preview production build
npm run preview
```

## Build Configuration

The build is configured in `vite.config.js` with the following optimizations:

- **Output:** `dist/` folder
- **Minification:** esbuild (fast)
- **Source Maps:** Disabled (smaller bundle)
- **Code Splitting:** Vendor chunks separated (React, UI libraries, HTTP client)
- **Chunk Size Warning:** 1000 KB limit

## Environment Variables

### Development
Create `.env` file:
```bash
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
```

### Production
Create `.env.production` file:
```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=30000
```

**Important:** Vite loads `.env.production` automatically during `npm run build`. For `npm run preview`, it uses `.env` by default.

## Preview Server

After building, use `npm run preview` to test the production build locally:

- **Default URL:** `http://localhost:4173`
- **Port:** Configurable in `vite.config.js` (preview.port)
- **Network Access:** Enabled (host: true) - accessible from other devices on same network
- **Auto-open:** Disabled by default (set preview.open: true to enable)

## Build Output

After `npm run build`, check the `dist/` folder:

```
dist/
├── index.html          # Entry HTML file
├── assets/
│   ├── index-*.js      # Main application bundle
│   ├── react-vendor-*.js  # React vendor chunk
│   ├── ui-vendor-*.js  # UI libraries chunk
│   ├── http-vendor-*.js   # Axios chunk
│   └── *.css           # Stylesheets
```

## Troubleshooting

### Build Fails

1. **Clear caches:**
   ```bash
   rm -rf node_modules/.vite dist
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be 18+
   ```

3. **Permission errors (Windows):**
   - Run terminal as Administrator
   - Close any processes using `dist/` folder

### Preview Not Working

1. **Ensure build completed:**
   ```bash
   npm run build
   ```

2. **Check port availability:**
   - Default port: 4173
   - Change in `vite.config.js` if needed

3. **Verify environment variables:**
   - Check `.env` file exists
   - Verify `VITE_API_URL` is correct

### API Calls Failing in Preview

- Ensure backend API is running and accessible
- Verify `VITE_API_URL` in `.env` matches your backend
- Check CORS configuration on backend includes preview server URL

## Deployment

The `dist/` folder contains everything needed for deployment:

- **Static Hosting:** Deploy `dist/` to Vercel, Netlify, GitHub Pages, etc.
- **Docker:** Use included `Dockerfile` for containerized deployment
- **CDN:** Upload `dist/` contents to any CDN or object storage

## Build Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server (port 5173) |
| `build` | `npm run build` | Build for production (outputs to `dist/`) |
| `preview` | `npm run preview` | Preview production build (port 4173) |
| `lint` | `npm run lint` | Run ESLint checks |
