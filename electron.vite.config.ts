import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@resources': resolve('resources'),
        '@main': resolve('src/main'),
        '@': resolve('src/renderer/src')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@resources': resolve('resources'),
        '@main': resolve('src/main'),
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
