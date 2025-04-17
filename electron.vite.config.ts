import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
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
        '@resources': resolve('resources'),
        '@public': resolve('src/renderer/public'),
        '@main': resolve('src/main'),
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
