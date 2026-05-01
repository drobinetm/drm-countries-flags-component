import countryList from 'country-list'
import type { Country, CountriesFlagsStyleObject, CountriesFlagsStyles } from './types.js'

function buildCountries(): Country[] {
  const raw = countryList.getData() as Array<{ code: string; name: string }>
  return raw.map((c) => ({
    code: c.code.toLowerCase(),
    name: c.name,
  }))
}

const allCountries = buildCountries()
const countriesByCode = new Map(allCountries.map((country) => [country.code, country] as const))

export function getCountries(filter: string[] = [], max = 0): Country[] {
  let countries = allCountries

  if (filter.length > 0) {
    const normalized = new Set(filter.map((code) => code.toLowerCase()))
    countries = countries.filter((country) => normalized.has(country.code))
  }

  return max > 0 ? countries.slice(0, max) : countries
}

export function getCountryByCode(code: string): Country | null {
  return countriesByCode.get(code.toLowerCase()) ?? null
}

export function getOptionStyle(
  styles: CountriesFlagsStyles,
  selected: boolean,
  active: boolean,
): CountriesFlagsStyleObject {
  return {
    ...(styles.option ?? {}),
    ...(selected ? (styles.optionSelected ?? {}) : {}),
    ...(active ? (styles.optionActive ?? {}) : {}),
  }
}

export function flagClass(code: string): string {
  return `fi fi-${code.toLowerCase()} fis`
}
