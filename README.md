# drm-countries-flags-component

Monorepo for `@drobinetm/countries-flags-*`, a country selector with flag
icons for Angular, React, and Vue.

## Packages

| Package                                                    | Version | Description                      |
| ---------------------------------------------------------- | ------- | -------------------------------- |
| [`@drobinetm/countries-flags-core`](./packages/core)       | 1.0.0   | Shared types, data, utilities    |
| [`@drobinetm/angular-countries-flags`](./packages/angular) | 1.0.0   | Angular 17+ standalone component |
| [`@drobinetm/react-countries-flags`](./packages/react)     | 1.0.0   | React 18+ functional component   |
| [`@drobinetm/vue-countries-flags`](./packages/vue)         | 1.0.0   | Vue 3 Composition API component  |

The documentation site lives in `apps/docs` and is intended for static hosting
in Netlify. It is not published as an npm package.

## Structure

```
drm-countries-flags-component/
├── packages/
│   ├── core/                     ← @drobinetm/countries-flags-core
│   ├── angular/                  ← @drobinetm/angular-countries-flags
│   ├── react/                    ← @drobinetm/react-countries-flags
│   └── vue/                      ← @drobinetm/vue-countries-flags
└── apps/
    └── docs/                     ← Astro landing page + docs site
```

## Development

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Build a specific package
pnpm build:core
pnpm build:angular
pnpm build:react
pnpm build:vue

# Start Astro docs dev server
pnpm dev:docs
```

## Publishing model

The npm publishing targets are:

- `@drobinetm/countries-flags-core`
- `@drobinetm/angular-countries-flags`
- `@drobinetm/react-countries-flags`
- `@drobinetm/vue-countries-flags`

The `apps/docs` project is a landing page and documentation site for Netlify,
not a package intended for npm publication.

Versioning and changelog generation are managed with Changesets. Use
`pnpm changeset` to create a release note, `pnpm version-packages` to update
package versions and changelogs, and `pnpm release` to build and publish the
updated packages.

## API

All framework implementations share the same props contract across Angular,
React, and Vue.

| Prop                            | Type                       | Default              | Description                                              |
| ------------------------------- | -------------------------- | -------------------- | -------------------------------------------------------- |
| `max`                           | `number`                   | `0`                  | Max countries shown. `0` = unlimited.                    |
| `filter`                        | `string[]`                 | `[]`                 | ISO alpha-2 whitelist.                                   |
| `value` / `ngModel` / `v-model` | `string \| null`           | `null`               | Selected country code.                                   |
| `placeholder`                   | `string`                   | `"Select a country"` | Trigger placeholder.                                     |
| `disabled`                      | `boolean`                  | `false`              | Disables interaction.                                    |
| `unstyled`                      | `boolean`                  | `false`              | Disables the bundled look so your app theme owns the UI. |
| `classNames`                    | `CountriesFlagsClassNames` | `{}`                 | Applies custom classes by slot.                          |
| `styles`                        | `CountriesFlagsStyles`     | `{}`                 | Applies inline styles by slot.                           |

## Theming and custom CSS

You can style the component the same way in all three frameworks. Keep the
bundled styles and override specific slots, or set `unstyled` and connect it
to Tailwind, shadcn, Bootstrap, Material, Vuetify, or your own CSS.

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

### React example

```tsx
<CountriesFlags
  value={selectedCode}
  onChange={(event) => setSelectedCode(event.code)}
  unstyled
  classNames={{
    root: 'w-full',
    trigger: 'flex h-10 w-full items-center justify-between rounded-md border px-3',
    list: 'mt-2 rounded-md border bg-popover p-1 shadow-lg',
    option: 'flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2',
    optionSelected: 'bg-primary text-primary-foreground',
    optionActive: 'bg-muted',
  }}
  styles={{
    flag: { borderRadius: '9999px' },
  }}
/>
```

### Vue example

```vue
<CountriesFlags
  v-model="selectedCode"
  :unstyled="true"
  :class-names="{
    trigger: 'w-full rounded-lg border px-3 py-2 text-left',
    list: 'mt-2 rounded-lg border bg-white p-1 shadow-xl',
    option: 'flex items-center gap-2 rounded-md px-3 py-2',
    optionSelected: 'bg-slate-900 text-white',
  }"
  :styles="{
    root: { width: '100%' },
    flag: { borderRadius: '9999px' },
  }"
/>
```

### Angular example

```html
<drm-countries-flags
  [(ngModel)]="selectedCode"
  [unstyled]="true"
  [classNames]="{
    trigger: 'w-full rounded border px-3 py-2 text-start',
    list: 'mt-2 rounded border bg-white p-1 shadow-lg',
    option: 'flex items-center gap-2 rounded px-3 py-2',
    optionSelected: 'bg-primary text-white'
  }"
  [styles]="{
    root: { width: '100%' },
    flag: { borderRadius: '9999px' }
  }"
></drm-countries-flags>
```

### Change event payload

```ts
interface CountryChangeEvent {
  country: Country | null // { code: 'es', name: 'Spain' }
  code: string | null // 'es'
}
```

## License

MIT © Diovi Robinet
