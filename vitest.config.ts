/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * VITEST CONFIGURATION
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Cấu hình cho Vitest - Unit & Integration Testing Framework
 * 
 * @file vitest.config.ts
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  test: {
    // Sử dụng happy-dom để mock DOM (nhẹ hơn jsdom)
    environment: 'happy-dom',
    
    // Setup files chạy trước tests
    setupFiles: [],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/mockData/**',
      ],
    },
    
    // Global test timeout
    testTimeout: 10000,
    
    // Globals cho describe/it/expect (không cần import)
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
