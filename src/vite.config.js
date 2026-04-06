import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

// __dirname = /Users/lexis/BachHotline/Bach-Hotline-App/src
const srcDir    = fileURLToPath(new URL('.', import.meta.url))
const rootDir   = path.join(srcDir, '..')
const stubApp   = path.join(srcDir, 'stubs', 'firebase-app.js')
const stubStore = path.join(srcDir, 'stubs', 'firebase-firestore.js')
const hasFb     = existsSync(path.join(srcDir, 'node_modules', 'firebase', 'package.json'))

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.join(rootDir, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: hasFb ? [] : [
      { find: 'firebase/app',       replacement: stubApp   },
      { find: 'firebase/firestore', replacement: stubStore },
    ],
  },
})
