import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
  forwardRef,
  type KeyboardEvent,
} from 'react'
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
import './styles.css'

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export interface CountriesFlagsReactProps extends CountriesFlagsProps {
  onChange?: (event: CountryChangeEvent) => void
  className?: string
}

export const CountriesFlags = forwardRef<HTMLDivElement, CountriesFlagsReactProps>(
  function CountriesFlags(
    {
      max = 0,
      filter = [],
      value = null,
      placeholder = 'Select a country',
      disabled = false,
      unstyled = false,
      classNames,
      styles,
      onChange,
      className = '',
    },
    ref,
  ) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const triggerId = useId()
    const listboxId = useId()
    const triggerRef = useRef<HTMLButtonElement>(null)

    const countries = useMemo(() => getCountries(filter, max), [filter, max])

    const selectedCountry: Country | null = useMemo(
      () => (value ? getCountryByCode(value) : null),
      [value],
    )

    const getInitialActiveIndex = useCallback(() => {
      const selectedIndex = countries.findIndex((country) => country.code === value)
      if (selectedIndex >= 0) return selectedIndex
      return countries.length ? 0 : -1
    }, [countries, value])

    const optionId = useCallback((index: number) => `${listboxId}-option-${index}`, [listboxId])

    const moveActive = useCallback(
      (nextIndex: number) => {
        if (!countries.length) {
          setActiveIndex(-1)
          return
        }

        setActiveIndex(((nextIndex % countries.length) + countries.length) % countries.length)
      },
      [countries],
    )

    const open = useCallback(() => {
      setActiveIndex(getInitialActiveIndex())
      setIsOpen(true)
    }, [getInitialActiveIndex])

    useEffect(() => {
      if (!isOpen) return

      setActiveIndex(getInitialActiveIndex())

      const handleKeydown = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false)
          setActiveIndex(-1)
          triggerRef.current?.focus()
        }
      }

      document.addEventListener('keydown', handleKeydown)
      return () => document.removeEventListener('keydown', handleKeydown)
    }, [getInitialActiveIndex, isOpen])

    useEffect(() => {
      if (!isOpen) return

      if (!countries.length) {
        setActiveIndex(-1)
        return
      }

      if (activeIndex < 0 || activeIndex >= countries.length) {
        setActiveIndex(getInitialActiveIndex())
      }
    }, [activeIndex, countries, getInitialActiveIndex, isOpen])

    const toggle = useCallback(() => {
      if (disabled) return

      if (isOpen) {
        setIsOpen(false)
        setActiveIndex(-1)
        return
      }

      open()
    }, [disabled, isOpen, open])

    const close = useCallback(() => {
      setIsOpen(false)
      setActiveIndex(-1)
    }, [])

    const selectCountry = useCallback(
      (country: Country) => {
        onChange?.({ country, code: country.code })
        close()
        triggerRef.current?.focus()
      },
      [onChange, close],
    )

    const onTriggerKeydown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (isOpen && activeIndex >= 0) {
            selectCountry(countries[activeIndex])
            return
          }

          toggle()
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (!isOpen) {
            open()
            return
          }

          moveActive(activeIndex + 1)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (!isOpen) {
            open()
            if (countries.length) setActiveIndex(countries.length - 1)
            return
          }

          moveActive(activeIndex - 1)
        } else if (e.key === 'Home') {
          e.preventDefault()
          if (!isOpen) open()
          moveActive(0)
        } else if (e.key === 'End') {
          e.preventDefault()
          if (!isOpen) open()
          moveActive(countries.length - 1)
        } else if (e.key === 'Escape') {
          e.preventDefault()
          close()
          setActiveIndex(-1)
        }
      },
      [activeIndex, close, countries, isOpen, moveActive, open, selectCountry, toggle],
    )

    const slots: CountriesFlagsClassNames = classNames ?? {}
    const slotStyles: CountriesFlagsStyles = styles ?? {}

    return (
      <div
        ref={ref}
        className={joinClasses(
          !unstyled && 'drm-cf',
          !unstyled && disabled && 'drm-cf--disabled',
          slots.root,
          className,
        )}
        style={slotStyles.root}
        data-disabled={disabled ? 'true' : 'false'}
        data-open={isOpen ? 'true' : 'false'}
      >
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          className={joinClasses(!unstyled && 'drm-cf__trigger', slots.trigger)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-label={selectedCountry ? selectedCountry.name : placeholder}
          onClick={toggle}
          onKeyDown={onTriggerKeydown}
          style={slotStyles.trigger}
          data-slot="trigger"
          data-disabled={disabled ? 'true' : 'false'}
          data-open={isOpen ? 'true' : 'false'}
        >
          <span
            className={joinClasses(!unstyled && 'drm-cf__trigger-content', slots.triggerContent)}
            style={slotStyles.triggerContent}
          >
            {selectedCountry ? (
              <>
                <span
                  className={joinClasses(
                    !unstyled && 'drm-cf__flag',
                    flagClass(selectedCountry.code),
                    slots.flag,
                  )}
                  aria-hidden="true"
                  style={slotStyles.flag}
                  data-slot="flag"
                />
                <span
                  className={joinClasses(!unstyled && 'drm-cf__label', slots.label)}
                  style={slotStyles.label}
                >
                  {selectedCountry.name}
                </span>
              </>
            ) : (
              <span
                className={joinClasses(!unstyled && 'drm-cf__placeholder', slots.placeholder)}
                style={slotStyles.placeholder}
              >
                {placeholder}
              </span>
            )}
          </span>
          <svg
            className={joinClasses(
              !unstyled && 'drm-cf__chevron',
              !unstyled && isOpen && 'drm-cf__chevron--open',
              slots.chevron,
            )}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
            style={slotStyles.chevron}
            data-slot="chevron"
            data-open={isOpen ? 'true' : 'false'}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className={joinClasses(!unstyled && 'drm-cf__backdrop', slots.backdrop)}
            onClick={close}
            style={slotStyles.backdrop}
            data-slot="backdrop"
          />
        )}

        {isOpen && (
          <ul
            id={listboxId}
            role="listbox"
            className={joinClasses(!unstyled && 'drm-cf__list', slots.list)}
            aria-label="Countries"
            aria-labelledby={triggerId}
            style={slotStyles.list}
            data-slot="list"
          >
            {!countries.length && (
              <li
                className={joinClasses(!unstyled && 'drm-cf__empty', slots.empty)}
                style={slotStyles.empty}
                data-slot="empty"
              >
                No countries available.
              </li>
            )}
            {countries.map((country, index) => (
              <li
                id={optionId(index)}
                key={country.code}
                role="option"
                className={joinClasses(
                  !unstyled && 'drm-cf__option',
                  !unstyled && value === country.code && 'drm-cf__option--selected',
                  !unstyled && index === activeIndex && 'drm-cf__option--active',
                  slots.option,
                  value === country.code && slots.optionSelected,
                  index === activeIndex && slots.optionActive,
                )}
                style={getOptionStyle(slotStyles, value === country.code, index === activeIndex)}
                aria-selected={value === country.code}
                onClick={() => selectCountry(country)}
                data-slot="option"
                data-selected={value === country.code ? 'true' : 'false'}
                data-active={index === activeIndex ? 'true' : 'false'}
              >
                <span
                  className={joinClasses(
                    !unstyled && 'drm-cf__flag',
                    flagClass(country.code),
                    slots.flag,
                  )}
                  aria-hidden="true"
                  style={slotStyles.flag}
                  data-slot="flag"
                />
                <span
                  className={joinClasses(!unstyled && 'drm-cf__option-name', slots.optionName)}
                  style={slotStyles.optionName}
                >
                  {country.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  },
)

CountriesFlags.displayName = 'CountriesFlags'

export type { Country, CountriesFlagsProps, CountryChangeEvent }
