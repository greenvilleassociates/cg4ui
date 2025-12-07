// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'vitedist', 
    assetsDir: 'assets',  // default is 'assets'// or match your existing build folder
  },
});
