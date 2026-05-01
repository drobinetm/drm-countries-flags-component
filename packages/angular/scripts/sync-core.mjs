import { cpSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const coreSrc = resolve('../../packages/core/src')
const dest = resolve('src/core')

cpSync(coreSrc, dest, { recursive: true })

for (const file of readdirSync(dest)) {
  if (!file.endsWith('.ts')) continue
  const filePath = join(dest, file)
  let content = readFileSync(filePath, 'utf8')

  // Remove .js extensions from local relative imports (core uses ESM-style .js imports)
  content = content.replace(/(from\s+['"]\.\/[^'"]+)\.js(['"])/g, '$1$2')

  // Replace default import of country-list with named import (no @types/country-list default export)
  content = content.replace(
    /import\s+countryList\s+from\s+'country-list'/,
    "import { getData } from 'country-list'",
  )
  content = content.replace(/countryList\.getData\(\)/g, 'getData()')

  writeFileSync(filePath, content)
}

console.log('core synced to src/core')
