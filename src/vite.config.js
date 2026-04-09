import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const srcDir  = fileURLToPath(new URL('.', import.meta.url))
const rootDir = path.join(srcDir, '..')

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.join(rootDir, 'dist'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
  },
})
