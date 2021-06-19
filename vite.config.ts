import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    lib: {
      name: 'Wheel',
      entry: path.resolve(__dirname, 'src/library.ts'),
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  plugins: [
    vue(),
  ],
})
