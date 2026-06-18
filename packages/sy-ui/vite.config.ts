import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import fs from 'fs'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from '@tailwindcss/vite'

const isDev = process.env.NODE_ENV === 'development'
const isNpm = process.env.BUILD_MODE === 'npm'

const srcPath = path.resolve('src')
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
      environment: 'jsdom',
      include: ['src/**/*.spec.{ts,tsx}'],
      setupFiles: ['src/__test__/setup.ts'],
      coverage: {
        reporter: ['text', 'lcov'],
        include: ['src'],
        exclude: ['**/*.stories.tsx'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
  build: {
    lib: {
      entry: entries,
      formats: isDev ? ['es'] : ['es', 'cjs'],
      fileName: (format: string, name: string) => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'lucide-react',
        'echarts',
        'echarts-for-react',
        ...(isNpm ? [] : ['@syvobase/utils']),
      ],
    },
    minify: !isDev ? 'esbuild' : false,
    cssMinify: !isDev,
    sourcemap: isDev,
    emptyOutDir: !isDev,
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
    !isDev &&
      visualizer({
        filename: path.resolve('report/builder-analyze.html'),
      }),
    dts({
      tsconfigPath: path.resolve('tsconfig.app.json'),
      exclude: ['src/**/*.{spec,stories}.{ts,tsx}'],
    }),
    svgr({
      svgrOptions: {
        icon: '1em',
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  convertColors: {
                    currentColor: true,
                  },
                },
              },
            },
          ],
        },
      },
    }),
  ],
})
