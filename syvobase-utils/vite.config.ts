import { defineConfig } from 'vite'
import path from 'node:path'
import dts from 'vite-plugin-dts'
import fs from 'fs'

const isDev = process.env.NODE_ENV === 'development'
const srcPath = path.resolve(__dirname, 'src')
const indexEntry = path.join(srcPath, 'index.ts')

const entries = fs
  .readdirSync(srcPath)
  .filter((componentName) =>
    fs.existsSync(path.join(srcPath, componentName, 'index.ts'))
  )
  .reduce(
    (ret, componentName) => {
      const entry = path.join(srcPath, componentName, 'index.ts')
      ret[componentName] = entry
      return ret
    },
    {
      index: indexEntry,
    } as Record<string, string>
  )

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
      entry: entries,
      formats: ['es', 'cjs'],
      fileName: (format: string, name: string) => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: [],
    },
    minify: !isDev,
    cssMinify: !isDev,
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
