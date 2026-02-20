import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Production build optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for production (set to false for smaller builds)
    sourcemap: false,
    
    // Minify options (esbuild is faster than terser and built-in)
    minify: 'esbuild',
    // Note: To remove console.log, we use a logger utility that checks env.DEV
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'react-icons'],
          'http-vendor': ['axios'],
        },
      },
    },
  },
  
  // Server configuration (development)
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  
  // Preview configuration (production preview)
  preview: {
    port: 4173,
    strictPort: false,
    open: false, // Set to true to auto-open browser
    host: true, // Expose on network (0.0.0.0)
  },
})
