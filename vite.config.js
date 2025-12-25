// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
  
//   // --- UPDATED PROXY CONFIGURATION ---
//   server: {
//     proxy: {
//       // 1. Proxy any requests starting with /auth to the backend
//       '/auth': {
//         target: 'http://localhost:5000', 
//         changeOrigin: true,
//       },
//       // 2. Proxy any requests starting with /events to the backend
//       '/events': {
//         target: 'http://localhost:5000', 
//         changeOrigin: true,
//       },
//       // Add other top-level route prefixes (like /users, /admin, etc.) here if needed.
//     },
//   },
//   // ---------------------------------
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});