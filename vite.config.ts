import { defineConfig } from 'vite'
import define from './env'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      strict: true,
      allow: ['.'],
    },
  },
  define,
})
