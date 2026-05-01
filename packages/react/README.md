# @drobinetm/react-countries-flags

`@drobinetm/react-countries-flags` provides a country selector component with
flag icons for React applications.

It shares data and contracts with the Angular and Vue packages through
`@drobinetm/countries-flags-core`.

## Install

Install the package and required peer dependencies.

```bash
pnpm add @drobinetm/react-countries-flags react react-dom flag-icons
```

Import the flag-icons CSS once in your app entry point.

```ts
import 'flag-icons/css/flag-icons.min.css'
```

## Basic usage

```tsx
import { useState } from 'react'
import { CountriesFlags } from '@drobinetm/react-countries-flags'

export function Example() {
  const [country, setCountry] = useState<string | null>(null)

  return (
    <CountriesFlags
      value={country}
      onChange={(event) => setCountry(event.code)}
      placeholder="Select a country"
    />
  )
}
```

## Props

`CountriesFlags` accepts:

- `value?: string | null`
- `onChange?: (event: CountryChangeEvent) => void`
- `max?: number`
- `filter?: string[]`
- `placeholder?: string`
- `disabled?: boolean`
- `unstyled?: boolean`
- `classNames?: CountriesFlagsClassNames`
- `styles?: CountriesFlagsStyles`
- `className?: string`

## Styling

By default, the package includes its own styles.

- Set `unstyled` to `true` if you want to style every slot yourself.
- Use `classNames` for class-based overrides per slot.
- Use `styles` for inline style-object overrides per slot.

Available slots:

- `root`
- `trigger`
- `triggerContent`
- `placeholder`
- `label`
- `chevron`
- `backdrop`
- `list`
- `empty`
- `option`
- `optionSelected`
- `optionActive`
- `flag`
- `optionName`

## Accessibility

The component includes keyboard and ARIA support:

- `Enter` / `Space`: open or select
- `ArrowUp` / `ArrowDown`: move active option
- `Home` / `End`: jump to first or last option
- `Escape`: close dropdown

## Exports

```ts
import {
  CountriesFlags,
  type CountriesFlagsReactProps,
  type Country,
  type CountriesFlagsProps,
  type CountryChangeEvent,
  type CountriesFlagsClassNames,
  type CountriesFlagsStyles,
} from '@drobinetm/react-countries-flags'
```

## Docs

Project docs:

- https://drm-countries-flags.netlify.app/docs/react/

## License

MIT © Diovi Robinet Morales
