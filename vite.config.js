import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Use relative base path
  base: './',

  // Asset handling
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.svg', '**/*.png', '**/*.jpg'],

  // Dependency optimization
  optimizeDeps: {
    include: ['jquery', 'prop-types', 'owl.carousel'], // Pre-bundle these libraries
    exclude: ['primereact'], // Exclude from optimization
  },

  // Build Configuration
  build: {
    rollupOptions: {
      input: {
        main: './index.html', // Main entry point
      },
    },
    assetsInlineLimit: 0, // Disable base64 inlining of small assets
  },

  // Server configuration (useful for local testing)
  server: {
    open: true, // Auto-open in browser
    port: 3000, // Default port
  },

  // Resolve issues for legacy dependencies (if required)
  resolve: {
    alias: {
      '@': '/src', // Use '@' as alias for src folder
    },
  },
});
