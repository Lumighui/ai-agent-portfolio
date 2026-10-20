import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    allowedHosts: ['.loca.lt', '.serveousercontent.com', '.lhr.life'],
    host: '0.0.0.0',
    port: 5173
  }
})
