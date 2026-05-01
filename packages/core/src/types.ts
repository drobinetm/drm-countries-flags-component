export interface Country {
  code: string
  name: string
}

export interface CountriesFlagsProps {
  max?: number
  filter?: string[]
  value?: string | null
  placeholder?: string
  disabled?: boolean
  unstyled?: boolean
  classNames?: CountriesFlagsClassNames
  styles?: CountriesFlagsStyles
}

export type CountriesFlagsStyleValue = string | number

export type CountriesFlagsStyleObject = Record<string, CountriesFlagsStyleValue>

export interface CountriesFlagsClassNames {
  root?: string
  trigger?: string
  triggerContent?: string
  placeholder?: string
  label?: string
  chevron?: string
  backdrop?: string
  list?: string
  empty?: string
  option?: string
  optionSelected?: string
  optionActive?: string
  flag?: string
  optionName?: string
}

export interface CountriesFlagsStyles {
  root?: CountriesFlagsStyleObject
  trigger?: CountriesFlagsStyleObject
  triggerContent?: CountriesFlagsStyleObject
  placeholder?: CountriesFlagsStyleObject
  label?: CountriesFlagsStyleObject
  chevron?: CountriesFlagsStyleObject
  backdrop?: CountriesFlagsStyleObject
  list?: CountriesFlagsStyleObject
  empty?: CountriesFlagsStyleObject
  option?: CountriesFlagsStyleObject
  optionSelected?: CountriesFlagsStyleObject
  optionActive?: CountriesFlagsStyleObject
  flag?: CountriesFlagsStyleObject
  optionName?: CountriesFlagsStyleObject
}

export interface CountryChangeEvent {
  country: Country | null
  code: string | null
}
