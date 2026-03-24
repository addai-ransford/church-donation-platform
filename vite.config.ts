import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import obfuscator from 'vite-plugin-javascript-obfuscator'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/",
  server: {
    watch: {
      usePolling: false,
      ignored: ['node_modules/**', 'dist/**'],
    },

    host: true,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 5174,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    obfuscator({
      include: ['**/*.js', '**/*.ts', '**/*.tsx'],
      apply: 'build',
      options: {
        compact: true,
        identifierNamesGenerator: 'hexadecimal',
        stringArray: true,
        stringArrayThreshold: 0.6,
        disableConsoleOutput: true,
      },
    }),
  ],
  build: {
    sourcemap: false,
    target: 'esnext',
    minify: 'esbuild',
  },
})

