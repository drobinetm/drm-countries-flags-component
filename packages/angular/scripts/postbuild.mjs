import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const distPackagePath = resolve('dist/package.json')
const distPackage = JSON.parse(readFileSync(distPackagePath, 'utf8'))

distPackage.description = 'Angular 17+ standalone component to display a country selector with flag icons'
distPackage.main = './fesm2022/drobinetm-angular-countries-flags.mjs'
distPackage.module = './fesm2022/drobinetm-angular-countries-flags.mjs'
distPackage.types = './index.d.ts'
distPackage.typings = './index.d.ts'
distPackage.files = [
  'fesm2022',
  'index.d.ts',
  'countries-flags.component.d.ts',
]
distPackage.exports = {
  '.': {
    types: './index.d.ts',
    import: './fesm2022/drobinetm-angular-countries-flags.mjs',
    default: './fesm2022/drobinetm-angular-countries-flags.mjs',
  },
  './package.json': './package.json',
}
distPackage.dependencies = {
  ...distPackage.dependencies,
  'country-list': '^2.3.0',
}
writeFileSync(distPackagePath, `${JSON.stringify(distPackage, null, 2)}\n`)
