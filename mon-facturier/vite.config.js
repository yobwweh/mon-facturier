import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Important pour que les chemins fonctionnent dans Electron
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // On exclut ces modules du bundle Frontend car ils sont gérés par le Backend (Node)
      external: ['electron', 'better-sqlite3', 'path', 'fs'], 
    }
  },
  server: {
    port: 5173,
    strictPort: true,
  }
})