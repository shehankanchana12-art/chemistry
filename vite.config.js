import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    // Cloud preview hostnames look like pv-<id>.freebuff.site — scoped to the
    // platform preview domains rather than a blanket allowlist.
    allowedHosts: [
      process.env.__VITE_PREVIEW_HOST,
      '.freebuff.site',
      '.agent37.app',
    ].filter(Boolean),
  },
})
