// vite.config.js
import { defineConfig } from "file:///E:/xampp/htdocs/nlu-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///E:/xampp/htdocs/nlu-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  // Use relative base path
  base: "./",
  // Asset handling
  assetsInclude: ["**/*.ttf", "**/*.woff", "**/*.woff2", "**/*.svg", "**/*.png", "**/*.jpg"],
  // Dependency optimization
  optimizeDeps: {
    include: ["jquery", "prop-types", "owl.carousel"],
    // Pre-bundle these libraries
    exclude: ["primereact"]
    // Exclude from optimization
  },
  // Build Configuration
  build: {
    rollupOptions: {
      input: {
        main: "./index.html"
        // Main entry point
      }
    },
    assetsInlineLimit: 0
    // Disable base64 inlining of small assets
  },
  // Server configuration (useful for local testing)
  server: {
    open: true,
    // Auto-open in browser
    port: 3e3
    // Default port
  },
  // Resolve issues for legacy dependencies (if required)
  resolve: {
    alias: {
      "@": "/src"
      // Use '@' as alias for src folder
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcbmx1LWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcbmx1LWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi94YW1wcC9odGRvY3Mvbmx1LWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuXHJcbiAgLy8gVXNlIHJlbGF0aXZlIGJhc2UgcGF0aFxyXG4gIGJhc2U6ICcuLycsXHJcblxyXG4gIC8vIEFzc2V0IGhhbmRsaW5nXHJcbiAgYXNzZXRzSW5jbHVkZTogWycqKi8qLnR0ZicsICcqKi8qLndvZmYnLCAnKiovKi53b2ZmMicsICcqKi8qLnN2ZycsICcqKi8qLnBuZycsICcqKi8qLmpwZyddLFxyXG5cclxuICAvLyBEZXBlbmRlbmN5IG9wdGltaXphdGlvblxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogWydqcXVlcnknLCAncHJvcC10eXBlcycsICdvd2wuY2Fyb3VzZWwnXSwgLy8gUHJlLWJ1bmRsZSB0aGVzZSBsaWJyYXJpZXNcclxuICAgIGV4Y2x1ZGU6IFsncHJpbWVyZWFjdCddLCAvLyBFeGNsdWRlIGZyb20gb3B0aW1pemF0aW9uXHJcbiAgfSxcclxuXHJcbiAgLy8gQnVpbGQgQ29uZmlndXJhdGlvblxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgbWFpbjogJy4vaW5kZXguaHRtbCcsIC8vIE1haW4gZW50cnkgcG9pbnRcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMCwgLy8gRGlzYWJsZSBiYXNlNjQgaW5saW5pbmcgb2Ygc21hbGwgYXNzZXRzXHJcbiAgfSxcclxuXHJcbiAgLy8gU2VydmVyIGNvbmZpZ3VyYXRpb24gKHVzZWZ1bCBmb3IgbG9jYWwgdGVzdGluZylcclxuICBzZXJ2ZXI6IHtcclxuICAgIG9wZW46IHRydWUsIC8vIEF1dG8tb3BlbiBpbiBicm93c2VyXHJcbiAgICBwb3J0OiAzMDAwLCAvLyBEZWZhdWx0IHBvcnRcclxuICB9LFxyXG5cclxuICAvLyBSZXNvbHZlIGlzc3VlcyBmb3IgbGVnYWN5IGRlcGVuZGVuY2llcyAoaWYgcmVxdWlyZWQpXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiAnL3NyYycsIC8vIFVzZSAnQCcgYXMgYWxpYXMgZm9yIHNyYyBmb2xkZXJcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFEsU0FBUyxvQkFBb0I7QUFDM1MsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQTtBQUFBLEVBR2pCLE1BQU07QUFBQTtBQUFBLEVBR04sZUFBZSxDQUFDLFlBQVksYUFBYSxjQUFjLFlBQVksWUFBWSxVQUFVO0FBQUE7QUFBQSxFQUd6RixjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsVUFBVSxjQUFjLGNBQWM7QUFBQTtBQUFBLElBQ2hELFNBQVMsQ0FBQyxZQUFZO0FBQUE7QUFBQSxFQUN4QjtBQUFBO0FBQUEsRUFHQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNO0FBQUE7QUFBQSxNQUNSO0FBQUEsSUFDRjtBQUFBLElBQ0EsbUJBQW1CO0FBQUE7QUFBQSxFQUNyQjtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLEVBQ1I7QUFBQTtBQUFBLEVBR0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
