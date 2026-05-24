import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // SPA — serve index.html for all routes (needed for Vercel / any static host)
  // The actual SPA fallback in production is handled by vercel.json rewrites.
  // For local `vite preview`, this option handles it:
  server: {
    // dev server: proxy all 404s → index.html
    historyApiFallback: true,
  } as any,

  build: {
    outDir: 'dist',
    sourcemap: false,
    // Separate vendor chunk for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ['react', 'react-dom'],
          lucide: ['lucide-react'],
        },
      },
    },
  },
});
