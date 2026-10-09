import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    // Les appels à /api sont transmis au serveur Express : pas de problème de CORS.
    proxy: { '/api': 'http://localhost:3001' },
  },
})
