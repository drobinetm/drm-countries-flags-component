# @drobinetm/angular-countries-flags

`@drobinetm/angular-countries-flags` provides a standalone country selector
component with flag icons for Angular applications.

It shares data and contracts with the React and Vue packages through
`@drobinetm/countries-flags-core`.

## Install

Install the package and required peer dependencies.

```bash
pnpm add @drobinetm/angular-countries-flags @angular/common @angular/core @angular/forms flag-icons
```

Import the flag-icons CSS once in your global styles.

```css
@import 'flag-icons/css/flag-icons.min.css';
```

## Basic usage

```ts
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CountriesFlagsComponent } from '@drobinetm/angular-countries-flags'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CountriesFlagsComponent],
  template: `
    <drm-countries-flags
      [(ngModel)]="country"
      placeholder="Select a country"
      (valueChange)="onCountryChange($event)"
    />
  `,
})
export class AppComponent {
  country: string | null = null

  onCountryChange(event: { code: string | null }) {
    console.log(event.code)
  }
}
```

## Inputs

`CountriesFlagsComponent` supports:

- `max?: number`
- `filter?: string[]`
- `placeholder?: string`
- `disabled?: boolean`
- `unstyled?: boolean`
- `classNames?: CountriesFlagsClassNames`
- `styles?: CountriesFlagsStyles`

It also supports Angular forms via `ControlValueAccessor` (`ngModel` and
reactive forms).

## Output

- `valueChange: EventEmitter<CountryChangeEvent>`

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
  CountriesFlagsComponent,
  type Country,
  type CountriesFlagsProps,
  type CountryChangeEvent,
  type CountriesFlagsClassNames,
  type CountriesFlagsStyles,
} from '@drobinetm/angular-countries-flags'
```

## Docs

Project docs:

- https://drm-countries-flags.netlify.app/docs/angular/

## License

MIT © Diovi Robinet Morales
