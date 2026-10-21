import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Año fijo al compilar: el HTML prerenderizado y el cliente muestran lo mismo.
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    target: 'es2019',
    assetsInlineLimit: 2048,
  },
})
