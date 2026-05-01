<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  getCountries,
  getCountryByCode,
  getOptionStyle,
  flagClass,
} from '@drobinetm/countries-flags-core'
import type {
  Country,
  CountryChangeEvent,
  CountriesFlagsClassNames,
  CountriesFlagsStyles,
} from '@drobinetm/countries-flags-core'
import './styles.css'

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    max?: number
    filter?: string[]
    placeholder?: string
    disabled?: boolean
    unstyled?: boolean
    classNames?: CountriesFlagsClassNames
    styles?: CountriesFlagsStyles
  }>(),
  {
    modelValue: null,
    max: 0,
    filter: () => [],
    placeholder: 'Select a country',
    disabled: false,
    unstyled: false,
    classNames: () => ({}),
    styles: () => ({}),
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  change: [event: CountryChangeEvent]
}>()

const instance = getCurrentInstance()
const isOpen = ref(false)
const activeIndex = ref(-1)
const triggerRef = ref<HTMLButtonElement | null>(null)
const triggerId = `drm-cf-trigger-${instance?.uid ?? '0'}`
const listboxId = `drm-cf-list-${instance?.uid ?? '0'}`

const countries = computed<Country[]>(() => getCountries(props.filter, props.max))

const selectedCountry = computed<Country | null>(() =>
  props.modelValue ? getCountryByCode(props.modelValue) : null,
)

const slots = computed(() => props.classNames ?? {})
const slotStyles = computed(() => props.styles ?? {})

function optionId(index: number) {
  return `${listboxId}-option-${index}`
}

function getInitialActiveIndex() {
  const selectedIndex = countries.value.findIndex((country) => country.code === props.modelValue)
  if (selectedIndex >= 0) return selectedIndex
  return countries.value.length ? 0 : -1
}

function open() {
  activeIndex.value = getInitialActiveIndex()
  isOpen.value = true
}

function focusTrigger() {
  void nextTick(() => triggerRef.value?.focus())
}

function moveActive(nextIndex: number) {
  const total = countries.value.length
  if (!total) {
    activeIndex.value = -1
    return
  }

  activeIndex.value = ((nextIndex % total) + total) % total
}

function toggle() {
  if (props.disabled) return

  if (isOpen.value) {
    close()
    return
  }

  open()
}

function close(restoreFocus = false) {
  isOpen.value = false
  activeIndex.value = -1

  if (restoreFocus) {
    focusTrigger()
  }
}

function closeFromBackdrop() {
  close()
}

function selectCountry(country: Country) {
  emit('update:modelValue', country.code)
  emit('change', { country, code: country.code })
  close(true)
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (isOpen.value && activeIndex.value >= 0) {
      selectCountry(countries.value[activeIndex.value])
    } else {
      toggle()
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!isOpen.value) {
      open()
      return
    }

    moveActive(activeIndex.value + 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!isOpen.value) {
      open()
      if (countries.value.length) moveActive(countries.value.length - 1)
      return
    }

    moveActive(activeIndex.value - 1)
  } else if (e.key === 'Home') {
    e.preventDefault()
    if (!isOpen.value) open()
    moveActive(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    if (!isOpen.value) open()
    moveActive(countries.value.length - 1)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close(true)
  }
}

function onDocKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) close(true)
}

onMounted(() => document.addEventListener('keydown', onDocKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onDocKeydown))

watch(countries, () => {
  if (!isOpen.value) return

  if (!countries.value.length) {
    activeIndex.value = -1
    return
  }

  if (activeIndex.value < 0 || activeIndex.value >= countries.value.length) {
    activeIndex.value = getInitialActiveIndex()
  }
})
</script>

<template>
  <div
    :class="[!unstyled && 'drm-cf', !unstyled && disabled && 'drm-cf--disabled', slots.root]"
    :style="slotStyles.root"
    :data-disabled="disabled ? 'true' : 'false'"
    :data-open="isOpen ? 'true' : 'false'"
  >
    <button
      ref="triggerRef"
      :id="triggerId"
      type="button"
      :class="joinClasses(!unstyled && 'drm-cf__trigger', slots.trigger)"
      :disabled="disabled"
      :aria-haspopup="'listbox'"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? listboxId : undefined"
      :aria-activedescendant="isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined"
      :aria-label="selectedCountry ? selectedCountry.name : placeholder"
      @click="toggle"
      @keydown="onTriggerKeydown"
      :style="slotStyles.trigger"
      data-slot="trigger"
      :data-disabled="disabled ? 'true' : 'false'"
      :data-open="isOpen ? 'true' : 'false'"
    >
      <span
        :class="joinClasses(!unstyled && 'drm-cf__trigger-content', slots.triggerContent)"
        :style="slotStyles.triggerContent"
      >
        <template v-if="selectedCountry">
          <span
            :class="
              joinClasses(!unstyled && 'drm-cf__flag', flagClass(selectedCountry.code), slots.flag)
            "
            :style="slotStyles.flag"
            aria-hidden="true"
            data-slot="flag"
          />
          <span
            :class="joinClasses(!unstyled && 'drm-cf__label', slots.label)"
            :style="slotStyles.label"
            >{{ selectedCountry.name }}</span
          >
        </template>
        <span
          v-else
          :class="joinClasses(!unstyled && 'drm-cf__placeholder', slots.placeholder)"
          :style="slotStyles.placeholder"
          >{{ placeholder }}</span
        >
      </span>

      <svg
        :class="
          joinClasses(
            !unstyled && 'drm-cf__chevron',
            !unstyled && isOpen && 'drm-cf__chevron--open',
            slots.chevron,
          )
        "
        width="12"
        height="12"
        viewBox="0 0 12 12"
        aria-hidden="true"
        data-slot="chevron"
        :style="slotStyles.chevron"
        :data-open="isOpen ? 'true' : 'false'"
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

    <div
      v-if="isOpen"
      :class="joinClasses(!unstyled && 'drm-cf__backdrop', slots.backdrop)"
      :style="slotStyles.backdrop"
      data-slot="backdrop"
      @click="closeFromBackdrop"
    />

    <ul
      v-if="isOpen"
      :id="listboxId"
      role="listbox"
      :class="joinClasses(!unstyled && 'drm-cf__list', slots.list)"
      aria-label="Countries"
      :aria-labelledby="triggerId"
      :style="slotStyles.list"
      data-slot="list"
    >
      <li
        v-if="!countries.length"
        :class="joinClasses(!unstyled && 'drm-cf__empty', slots.empty)"
        :style="slotStyles.empty"
        data-slot="empty"
      >
        No countries available.
      </li>
      <li
        v-for="(country, index) in countries"
        :id="optionId(index)"
        :key="country.code"
        role="option"
        :class="
          joinClasses(
            !unstyled && 'drm-cf__option',
            !unstyled && country.code === modelValue && 'drm-cf__option--selected',
            !unstyled && index === activeIndex && 'drm-cf__option--active',
            slots.option,
            country.code === modelValue && slots.optionSelected,
            index === activeIndex && slots.optionActive,
          )
        "
        :style="getOptionStyle(slotStyles, country.code === modelValue, index === activeIndex)"
        :aria-selected="country.code === modelValue"
        data-slot="option"
        :data-selected="country.code === modelValue ? 'true' : 'false'"
        :data-active="index === activeIndex ? 'true' : 'false'"
        @click="selectCountry(country)"
      >
        <span
          :class="joinClasses(!unstyled && 'drm-cf__flag', flagClass(country.code), slots.flag)"
          :style="slotStyles.flag"
          aria-hidden="true"
          data-slot="flag"
        />
        <span
          :class="joinClasses(!unstyled && 'drm-cf__option-name', slots.optionName)"
          :style="slotStyles.optionName"
          >{{ country.name }}</span
        >
      </li>
    </ul>
  </div>
</template>
