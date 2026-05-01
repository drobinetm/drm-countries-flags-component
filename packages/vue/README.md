# @drobinetm/vue-countries-flags

`@drobinetm/vue-countries-flags` provides a country selector component with
flag icons for Vue 3 applications.

It shares data and contracts with the Angular and React packages through
`@drobinetm/countries-flags-core`.

## Install

Install the package and required peer dependencies.

```bash
pnpm add @drobinetm/vue-countries-flags vue flag-icons
```

Import the flag-icons CSS once in your app entry point.

```ts
import 'flag-icons/css/flag-icons.min.css'
```

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CountriesFlags } from '@drobinetm/vue-countries-flags'

const country = ref<string | null>(null)
</script>

<template>
  <CountriesFlags
    v-model="country"
    placeholder="Select a country"
    @change="(event) => console.log(event.code)"
  />
</template>
```

## Props

`CountriesFlags` accepts:

- `modelValue?: string | null`
- `max?: number`
- `filter?: string[]`
- `placeholder?: string`
- `disabled?: boolean`
- `unstyled?: boolean`
- `classNames?: CountriesFlagsClassNames`
- `styles?: CountriesFlagsStyles`

## Events

- `update:modelValue` with `string | null`
- `change` with `CountryChangeEvent`

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
  type Country,
  type CountriesFlagsProps,
  type CountryChangeEvent,
  type CountriesFlagsClassNames,
  type CountriesFlagsStyles,
} from '@drobinetm/vue-countries-flags'
```

## Docs

Project docs:

- https://drm-countries-flags.netlify.app/docs/vue/

## License

MIT © Diovi Robinet Morales
