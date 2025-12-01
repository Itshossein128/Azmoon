import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: ['node_modules', 'e2e/**'],
  },
} as UserConfig);
