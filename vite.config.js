import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    manifest: false,
  },
  server: {
    fs: {
      strict: true,
      deny: ['.env', '.env.*', '**/.env', '**/.env.*', '**/*.db', '**/*.db-*', '**/server/data/**'],
    },
    proxy: { '/api': 'http://localhost:4000' },
  },
})
