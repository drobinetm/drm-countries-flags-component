# @drobinetm/countries-flags-core

`@drobinetm/countries-flags-core` is the shared data and type layer used by the
Angular, React, and Vue countries-flags packages.

This package exports:

- country data helpers (`getCountries`, `getCountryByCode`)
- styling helper (`getOptionStyle`)
- flag icon class helper (`flagClass`)
- shared TypeScript contracts (`Country`, `CountriesFlagsProps`, and others)

## Install

```bash
pnpm add @drobinetm/countries-flags-core
```

## Usage

```ts
import {
  getCountries,
  getCountryByCode,
  flagClass,
  type Country,
} from '@drobinetm/countries-flags-core'

const all = getCountries()
const subset = getCountries(['us', 'do', 'mx'], 2)
const selected = getCountryByCode('do')
const className = flagClass('do') // "fi fi-do fis"
```

## API

### `getCountries(filter?: string[], max?: number): Country[]`

- Returns all countries by default.
- `filter` lets you pass an ISO alpha-2 whitelist.
- `max` limits the number of returned entries (`0` means unlimited).

### `getCountryByCode(code: string): Country | null`

- Looks up one country by ISO alpha-2 code.
- The lookup is case-insensitive.

### `getOptionStyle(styles, selected, active): CountriesFlagsStyleObject`

- Merges slot styles for option state.
- Applies base `option` styles and optional selected/active variants.

### `flagClass(code: string): string`

- Returns the `flag-icons` class string for an ISO alpha-2 code.
- Example: `flagClass("us")` returns `fi fi-us fis`.

## Types

Main exported types:

- `Country`
- `CountriesFlagsProps`
- `CountryChangeEvent`
- `CountriesFlagsClassNames`
- `CountriesFlagsStyles`
- `CountriesFlagsStyleObject`
- `CountriesFlagsStyleValue`

## Notes

- Country codes are normalized to lowercase.
- Country names come from the `country-list` dataset.

## License

MIT © Diovi Robinet Morales
