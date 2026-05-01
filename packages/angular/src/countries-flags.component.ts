import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  ViewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import {
  getCountries,
  getCountryByCode,
  getOptionStyle,
  flagClass,
} from '@drobinetm/countries-flags-core'
import type {
  Country,
  CountriesFlagsProps,
  CountryChangeEvent,
  CountriesFlagsClassNames,
  CountriesFlagsStyles,
} from '@drobinetm/countries-flags-core'

@Component({
  selector: 'drm-countries-flags',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountriesFlagsComponent),
      multi: true,
    },
  ],
  template: `
    <div
      [class]="rootClass()"
      [ngStyle]="styles.root || null"
      [attr.data-disabled]="disabled ? 'true' : 'false'"
      [attr.data-open]="isOpen() ? 'true' : 'false'"
    >
      <button
        #triggerButton
        [id]="triggerId"
        type="button"
        [class]="triggerClass()"
        [disabled]="disabled"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="isOpen() ? listboxId : null"
        [attr.aria-activedescendant]="
          isOpen() && activeIndex() >= 0 ? optionId(activeIndex()) : null
        "
        [attr.aria-label]="selectedCountry() ? selectedCountry()!.name : placeholder"
        [attr.data-slot]="'trigger'"
        [ngStyle]="styles.trigger || null"
        [attr.data-disabled]="disabled ? 'true' : 'false'"
        [attr.data-open]="isOpen() ? 'true' : 'false'"
        (click)="toggleDropdown()"
        (keydown)="onTriggerKeydown($event)"
      >
        <span [class]="triggerContentClass()" [ngStyle]="styles.triggerContent || null">
          @if (selectedCountry()) {
            <span
              [class]="flagElementClass(selectedCountry()!.code)"
              [attr.data-slot]="'flag'"
              [ngStyle]="styles.flag || null"
              aria-hidden="true"
            ></span>
            <span [class]="labelClass()" [ngStyle]="styles.label || null">{{
              selectedCountry()!.name
            }}</span>
          } @else {
            <span [class]="placeholderClass()" [ngStyle]="styles.placeholder || null">{{
              placeholder
            }}</span>
          }
        </span>
        <svg
          [class]="chevronClass()"
          [attr.data-slot]="'chevron'"
          [ngStyle]="styles.chevron || null"
          [attr.data-open]="isOpen() ? 'true' : 'false'"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      @if (isOpen()) {
        <div
          [class]="backdropClass()"
          [attr.data-slot]="'backdrop'"
          [ngStyle]="styles.backdrop || null"
          (click)="close()"
        ></div>
        <ul
          [id]="listboxId"
          role="listbox"
          [class]="listClass()"
          [attr.aria-label]="'Countries'"
          [attr.aria-labelledby]="triggerId"
          [attr.data-slot]="'list'"
          [ngStyle]="styles.list || null"
          (keydown)="onListKeydown($event)"
        >
          @if (!countries().length) {
            <li [class]="emptyClass()" [attr.data-slot]="'empty'" [ngStyle]="styles.empty || null">
              No countries available.
            </li>
          }
          @for (country of countries(); track country.code) {
            <li
              [id]="optionId($index)"
              role="option"
              [class]="optionClass(country.code === internalValue(), $index === activeIndex())"
              [ngStyle]="optionStyle(country.code === internalValue(), $index === activeIndex())"
              [attr.aria-selected]="country.code === internalValue()"
              [attr.data-slot]="'option'"
              [attr.data-selected]="country.code === internalValue() ? 'true' : 'false'"
              [attr.data-active]="$index === activeIndex() ? 'true' : 'false'"
              (click)="selectCountry(country)"
            >
              <span
                [class]="flagElementClass(country.code)"
                [attr.data-slot]="'flag'"
                [ngStyle]="styles.flag || null"
                aria-hidden="true"
              ></span>
              <span [class]="optionNameClass()" [ngStyle]="styles.optionName || null">{{
                country.name
              }}</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        position: relative;
        font-family: inherit;
      }

      .drm-cf {
        position: relative;
        display: inline-block;
        min-width: 220px;
      }

      .drm-cf--disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .drm-cf__trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        min-height: 40px;
        padding: 0 12px;
        background: var(--drm-cf-bg, rgba(10, 18, 34, 0.76));
        border: 1px solid var(--drm-cf-border, rgba(255, 255, 255, 0.08));
        border-radius: var(--drm-cf-radius, 14px);
        color: var(--drm-cf-text, #f7f9ff);
        cursor: pointer;
        font-size: 0.95rem;
        font-family: inherit;
        transition:
          border-color 180ms ease,
          box-shadow 180ms ease;
      }

      .drm-cf__trigger:hover:not(:disabled) {
        border-color: var(--drm-cf-border-hover, rgba(115, 190, 255, 0.24));
      }

      .drm-cf__trigger:focus-visible {
        outline: none;
        border-color: var(--drm-cf-focus, #0f6dff);
        box-shadow: 0 0 0 3px rgba(15, 109, 255, 0.24);
      }

      .drm-cf__trigger-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
      }

      .drm-cf__placeholder {
        color: var(--drm-cf-placeholder, rgba(196, 209, 236, 0.56));
      }

      .drm-cf__label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .drm-cf__chevron {
        flex-shrink: 0;
        transition: transform 180ms ease;
        color: var(--drm-cf-text-soft, rgba(232, 239, 255, 0.74));
      }

      .drm-cf__chevron--open {
        transform: rotate(180deg);
      }

      .drm-cf__backdrop {
        position: fixed;
        inset: 0;
        z-index: 99;
      }

      .drm-cf__list {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        z-index: 100;
        max-height: 260px;
        overflow-y: auto;
        margin: 0;
        padding: 4px;
        list-style: none;
        background: var(--drm-cf-dropdown-bg, rgba(7, 14, 28, 0.96));
        border: 1px solid var(--drm-cf-border, rgba(255, 255, 255, 0.08));
        border-radius: var(--drm-cf-radius, 14px);
        backdrop-filter: blur(18px);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
      }

      .drm-cf__list::-webkit-scrollbar {
        width: 4px;
      }

      .drm-cf__list::-webkit-scrollbar-track {
        background: transparent;
      }

      .drm-cf__list::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12);
        border-radius: 2px;
      }

      .drm-cf__option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 10px;
        cursor: pointer;
        color: var(--drm-cf-text, #f7f9ff);
        font-size: 0.9rem;
        transition: background 120ms ease;
      }

      .drm-cf__option:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      .drm-cf__option--selected {
        background: rgba(15, 109, 255, 0.16);
        color: var(--drm-cf-accent, #8ad9ff);
      }

      .drm-cf__option--active {
        background: rgba(255, 255, 255, 0.06);
      }

      .drm-cf__empty {
        padding: 12px;
        color: var(--drm-cf-placeholder, rgba(196, 209, 236, 0.56));
        font-size: 0.9rem;
        text-align: center;
      }

      .drm-cf__flag {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        overflow: hidden;
      }

      .drm-cf__option-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ],
})
export class CountriesFlagsComponent implements ControlValueAccessor {
  private static nextId = 0
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly instanceId = CountriesFlagsComponent.nextId++

  @ViewChild('triggerButton') private triggerButton?: ElementRef<HTMLButtonElement>

  readonly triggerId = `drm-cf-trigger-${this.instanceId}`
  readonly listboxId = `drm-cf-list-${this.instanceId}`

  @Input() max: CountriesFlagsProps['max'] = 0

  @Input() filter: CountriesFlagsProps['filter'] = []

  @Input() placeholder: CountriesFlagsProps['placeholder'] = 'Select a country'

  @Input() disabled: CountriesFlagsProps['disabled'] = false

  @Input() unstyled: CountriesFlagsProps['unstyled'] = false

  @Input() classNames: CountriesFlagsClassNames = {}

  @Input() styles: CountriesFlagsStyles = {}

  @Output() valueChange = new EventEmitter<CountryChangeEvent>()

  readonly isOpen = signal(false)
  readonly activeIndex = signal(-1)
  readonly internalValue = signal<string | null>(null)

  readonly countries = computed(() => getCountries(this.filter ?? [], this.max ?? 0))

  readonly selectedCountry = computed<Country | null>(() => {
    const code = this.internalValue()
    if (!code) return null
    return getCountryByCode(code)
  })

  optionId(index: number): string {
    return `${this.listboxId}-option-${index}`
  }

  private getInitialActiveIndex(): number {
    const selectedIndex = this.countries().findIndex(
      (country) => country.code === this.internalValue(),
    )
    if (selectedIndex >= 0) return selectedIndex
    return this.countries().length ? 0 : -1
  }

  private moveActive(nextIndex: number): void {
    const countries = this.countries()
    if (!countries.length) {
      this.activeIndex.set(-1)
      return
    }

    this.activeIndex.set(((nextIndex % countries.length) + countries.length) % countries.length)
  }

  private openDropdown(): void {
    this.activeIndex.set(this.getInitialActiveIndex())
    this.isOpen.set(true)
  }

  private focusTrigger(): void {
    queueMicrotask(() => this.triggerButton?.nativeElement.focus())
  }

  private onChange: (value: string | null) => void = () => {}
  private onTouched: () => void = () => {}

  writeValue(value: string | null): void {
    this.internalValue.set(value ?? null)
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
    this.cdr.markForCheck()
  }

  flagClass(code: string): string {
    return flagClass(code)
  }

  private joinClasses(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(' ')
  }

  rootClass(): string {
    return this.joinClasses(
      !this.unstyled && 'drm-cf',
      !this.unstyled && this.disabled && 'drm-cf--disabled',
      this.classNames.root,
    )
  }

  triggerClass(): string {
    return this.joinClasses(!this.unstyled && 'drm-cf__trigger', this.classNames.trigger)
  }

  triggerContentClass(): string {
    return this.joinClasses(
      !this.unstyled && 'drm-cf__trigger-content',
      this.classNames.triggerContent,
    )
  }

  placeholderClass(): string {
    return this.joinClasses(!this.unstyled && 'drm-cf__placeholder', this.classNames.placeholder)
  }

  labelClass(): string {
    return this.joinClasses(!this.unstyled && 'drm-cf__label', this.classNames.label)
  }

  chevronClass(): string {
    return this.joinClasses(
      !this.unstyled && 'drm-cf__chevron',
      !this.unstyled && this.isOpen() && 'drm-cf__chevron--open',
      this.classNames.chevron,
    )
  }

  backdropClass(): string {
    return this.joinClasses(!this.unstyled && 'drm-cf__backdrop', this.classNames.backdrop)
  }

  listClass(): string {
    return this.joinClasses(!this.unstyled && 'drm-cf__list', this.classNames.list)
  }

  emptyClass(): string {
    return this.joinClasses(!this.unstyled && 'drm-cf__empty', this.classNames.empty)
  }

  optionClass(selected: boolean, active: boolean): string {
    return this.joinClasses(
      !this.unstyled && 'drm-cf__option',
      !this.unstyled && selected && 'drm-cf__option--selected',
      !this.unstyled && active && 'drm-cf__option--active',
      this.classNames.option,
      selected && this.classNames.optionSelected,
      active && this.classNames.optionActive,
    )
  }

  flagElementClass(code: string): string {
    return this.joinClasses(
      !this.unstyled && 'drm-cf__flag',
      this.flagClass(code),
      this.classNames.flag,
    )
  }

  optionNameClass(): string {
    return this.joinClasses(!this.unstyled && 'drm-cf__option-name', this.classNames.optionName)
  }

  optionStyle(selected: boolean, active: boolean) {
    return getOptionStyle(this.styles, selected, active)
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      if (this.isOpen()) {
        this.close()
      } else {
        this.openDropdown()
      }

      this.onTouched()
    }
  }

  close(restoreFocus = false): void {
    this.isOpen.set(false)
    this.activeIndex.set(-1)

    if (restoreFocus) {
      this.focusTrigger()
    }
  }

  selectCountry(country: Country): void {
    this.internalValue.set(country.code)
    this.onChange(country.code)
    this.onTouched()
    this.close(true)

    this.valueChange.emit({ country, code: country.code })
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (this.isOpen() && this.activeIndex() >= 0) {
        this.selectCountry(this.countries()[this.activeIndex()])
      } else {
        this.toggleDropdown()
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!this.isOpen()) {
        this.openDropdown()
        return
      }

      this.moveActive(this.activeIndex() + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!this.isOpen()) {
        this.openDropdown()
        if (this.countries().length) this.activeIndex.set(this.countries().length - 1)
        return
      }

      this.moveActive(this.activeIndex() - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      if (!this.isOpen()) this.openDropdown()
      this.moveActive(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      if (!this.isOpen()) this.openDropdown()
      this.moveActive(this.countries().length - 1)
    } else if (event.key === 'Escape') {
      this.close(true)
    }
  }

  onListKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close(true)
    }
  }
}
