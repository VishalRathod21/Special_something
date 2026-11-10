import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-dom')) {
            return 'motion-vendor';
          }
          if (id.includes('node_modules/lottie-')) {
            return 'lottie-vendor';
          }
          if (id.includes('node_modules/react')) {
            return 'react-vendor';
          }
          return undefined;
        },
      },
    },
  },
});
