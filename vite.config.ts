import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base is set for GitHub Pages project site: https://abeeeerr.github.io/lookout/
export default defineConfig({
  base: '/lookout/',
  plugins: [react()],
})
