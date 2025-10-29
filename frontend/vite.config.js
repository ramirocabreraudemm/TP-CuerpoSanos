import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const BACKEND_URL = env.VITE_API_URL || 'http://localhost:3080'

  return {
    plugins: [vue()],
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
