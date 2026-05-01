# @drobinetm/countries-flags

[![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031?logo=angular&logoColor=white)](https://drm-countries-flags.netlify.app/docs/angular/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=111827)](https://drm-countries-flags.netlify.app/docs/react/)
[![Vue](https://img.shields.io/badge/Vue-3-42B883?logo=vue.js&logoColor=white)](https://drm-countries-flags.netlify.app/docs/vue/)
[![Astro](https://img.shields.io/badge/Docs-Astro-FF5D01?logo=astro&logoColor=white)](https://drm-countries-flags.netlify.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/monorepo-pnpm-F69220?logo=pnpm&logoColor=white)](./pnpm-workspace.yaml)

`@drobinetm/countries-flags` is a country selector with flag icons for
Angular, React, and Vue. You can use it in forms, onboarding, settings,
checkout flows, and admin panels. Each package is native to its framework, and
all of them share the same core data, API, and styling model.

## Why this library

Use this library if you want the same country selector API across different
frontend stacks. It includes a shared core package for country data, types,
and utilities, plus one UI package per framework. You can use the default
styles, override slots, or disable the bundled styles and use your own.

## Installation

Install the package that matches your target framework. All UI packages require
`flag-icons` as a peer dependency.

### Angular

Package for Angular 17+ applications.

```bash
pnpm add @drobinetm/angular-countries-flags flag-icons
npm install @drobinetm/angular-countries-flags flag-icons
yarn add @drobinetm/angular-countries-flags flag-icons
```

### React

Package for React 18+ applications.

```bash
pnpm add @drobinetm/react-countries-flags flag-icons
npm install @drobinetm/react-countries-flags flag-icons
yarn add @drobinetm/react-countries-flags flag-icons
```

### Vue

Package for Vue 3 applications.

```bash
pnpm add @drobinetm/vue-countries-flags flag-icons
npm install @drobinetm/vue-countries-flags flag-icons
yarn add @drobinetm/vue-countries-flags flag-icons
```

## Packages

The monorepo includes a shared core package and one UI package per framework.

| Package                                                    | Version | Description                               |
| ---------------------------------------------------------- | ------- | ----------------------------------------- |
| [`@drobinetm/countries-flags-core`](./packages/core)       | 1.0.0   | Shared types, country data, and utilities |
| [`@drobinetm/angular-countries-flags`](./packages/angular) | 1.0.0   | Angular 17+ standalone component          |
| [`@drobinetm/react-countries-flags`](./packages/react)     | 1.0.0   | React 18+ functional component            |
| [`@drobinetm/vue-countries-flags`](./packages/vue)         | 1.0.0   | Vue 3 Composition API component           |

## Shared API

All implementations follow the same public contract across Angular, React, and
Vue.

| Prop                            | Type                       | Default              | Description                                                |
| ------------------------------- | -------------------------- | -------------------- | ---------------------------------------------------------- |
| `max`                           | `number`                   | `0`                  | Maximum number of countries shown. `0` means unlimited.    |
| `filter`                        | `string[]`                 | `[]`                 | ISO alpha-2 whitelist.                                     |
| `value` / `ngModel` / `v-model` | `string \| null`           | `null`               | Selected country code.                                     |
| `placeholder`                   | `string`                   | `"Select a country"` | Trigger placeholder text.                                  |
| `disabled`                      | `boolean`                  | `false`              | Disables interaction.                                      |
| `unstyled`                      | `boolean`                  | `false`              | Disables bundled styles so your app theme controls the UI. |
| `classNames`                    | `CountriesFlagsClassNames` | `{}`                 | Applies custom classes by slot.                            |
| `styles`                        | `CountriesFlagsStyles`     | `{}`                 | Applies inline styles by slot.                             |

The change event payload is the same in all implementations.

```ts
interface CountryChangeEvent {
  country: Country | null
  code: string | null
}
```

## Theming

You can keep the bundled styles and override specific slots, or set
`unstyled` and style the component with your own CSS or UI library.

Available styling slots:

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

## Project site

The project site includes docs, demos, and support.

- Project site: https://drm-countries-flags.netlify.app/
- Angular documentation: https://drm-countries-flags.netlify.app/docs/angular/
- React documentation: https://drm-countries-flags.netlify.app/docs/react/
- Vue documentation: https://drm-countries-flags.netlify.app/docs/vue/
- Theming guide: https://drm-countries-flags.netlify.app/docs/theming/

## Development

The repository is a `pnpm` monorepo.

```bash
pnpm install
pnpm build
pnpm build:core
pnpm build:angular
pnpm build:react
pnpm build:vue
pnpm dev:docs
```

Versioning and changelog generation are managed with Changesets.

- Create a release note with `pnpm changeset`
- Update package versions with `pnpm version-packages`
- Build and publish with `pnpm release`

## Support

Project support is available here.

- Support: https://drm-countries-flags.netlify.app/support/

## License

MIT © Diovi Robinet Morales
