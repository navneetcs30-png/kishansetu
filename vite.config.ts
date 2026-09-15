import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@farmer': path.resolve(__dirname, './farmer-dashboard/src'),
      '@consumer': path.resolve(__dirname, './agridirect-consumer-dashboard/src'),
      '@bulk': path.resolve(__dirname, './bulk-buyer-dashboard/src'),
      '@admin': path.resolve(__dirname, './admin-dashboard/src'),
      '@auth': path.resolve(__dirname, './user-login-&-authentication/src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
