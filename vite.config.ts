import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('zustand')) {
              return 'vendor-store';
            }
            if (id.includes('/node_modules/katex/')) {
              return 'vendor-katex';
            }
            if (id.includes('react-katex')) {
              return 'vendor-react-katex';
            }
            if (id.includes('rehype-katex') || id.includes('remark-math')) {
              return 'vendor-math-markdown';
            }
            if (id.includes('react-markdown') || id.includes('marked') || id.includes('dompurify')) {
              return 'vendor-markdown';
            }
            return 'vendor-misc';
          }

          if (id.includes('/src/components/visualizations/')) {
            return 'feature-visualizers';
          }

          return undefined;
        }
      }
    }
  }
})
