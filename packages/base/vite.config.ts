import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'lib/main.ts',
      name: 'Contexer',
      // the proper extensions will be added
      fileName: 'main',
    },
  },
  plugins: [dts()]
})