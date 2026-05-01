import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    dts({ insertTypesEntry: true, rollupTypes: true, tsconfigPath: './tsconfig.json' }),
  ],
  resolve: {
    alias: {
      '@drobinetm/countries-flags-core': fileURLToPath(
        new URL('../core/src/index.ts', import.meta.url),
      ),
    },
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'VueCountriesFlags',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-countries-flags.css'
          return assetInfo.name ?? 'asset'
        },
      },
    },
    cssCodeSplit: false,
  },
})
