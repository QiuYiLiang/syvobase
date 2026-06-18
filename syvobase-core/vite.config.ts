import { defineConfig } from 'vite'
import path from 'node:path'
import dts from 'vite-plugin-dts'

const isDev = process.env.NODE_ENV === 'development'
const srcPath = path.resolve(__dirname, 'src')
const indexEntry = path.join(srcPath, 'index.ts')

// https://vite.dev/config/
export default defineConfig({
  ...{
    test: {
      globals: true,
      include: ['src/**/*.spec.{ts,tsx}'],
      coverage: {
        reporter: ['text', 'lcov'],
        include: ['src'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: indexEntry,
      },
      formats: ['es', 'cjs'],
      fileName: (format: string, name: string) => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: ['zod', 'dayjs'],
    },
    minify: !isDev,
    sourcemap: isDev,
    emptyOutDir: !isDev,
  },
  plugins: [
    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.app.json'),
      rollupTypes: true,
    }),
  ],
  experimental: {
    enableNativePlugin: true,
  },
})
