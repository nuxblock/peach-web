import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'peach-web' below with your exact GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: '/peach-web/',
})
