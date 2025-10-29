import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for better development experience
      fastRefresh: true,
      // Babel options for JSX runtime
      babel: {
        plugins: [
          // Add any additional babel plugins here if needed
        ],
      },
    }),
  ],

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },

  // Server configuration
  server: {
    port: 3000,
    host: true, // Listen on all addresses, including LAN and public addresses
    open: true, // Automatically open the app in the browser
    cors: true, // Enable CORS
    proxy: {
      // Proxy API requests to Nakama server during development
      // This helps avoid CORS issues in development
      '/api': {
        target: 'http://localhost:7350',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // Preview server configuration (for production builds)
  preview: {
    port: 4173,
    host: true,
    open: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true, // Generate source maps for debugging
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          vendor: ['react', 'react-dom'],
          nakama: ['@heroiclabs/nakama-js'],
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb - inline assets smaller than this as base64
  },

  // Environment variables prefix
  envPrefix: 'VITE_',

  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', '@heroiclabs/nakama-js'],
    exclude: [],
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: './postcss.config.js',
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // Logging
  logLevel: 'info',

  // Clear screen on dev server start
  clearScreen: true,

  // Base public path
  base: '/',
});