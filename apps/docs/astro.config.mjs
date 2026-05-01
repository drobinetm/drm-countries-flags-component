import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vue from '@astrojs/vue'

export default defineConfig({
  site: 'https://drm-countries-flags.netlify.app',
  integrations: [react(), vue()],
  vite: {
    ssr: {
      noExternal: ['@drobinetm/countries-flags-core'],
    },
  },
})
