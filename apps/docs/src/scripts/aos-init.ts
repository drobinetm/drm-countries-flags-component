// AOS ships without usable local typings in this workspace setup.
import AOSModule from 'aos'
import 'aos/dist/aos.css'

const AOS = AOSModule as {
  init(options?: { duration?: number; once?: boolean; offset?: number }): void
}

const initSectionAnimations = () => {
  document.body.classList.add('aos-active')

  const sections = Array.from(document.querySelectorAll('main .section'))

  sections.forEach((section, index) => {
    if (!(section instanceof HTMLElement)) return

    if (!section.dataset.aos) {
      section.dataset.aos = 'fade-up'
    }

    if (!section.dataset.aosDuration) {
      section.dataset.aosDuration = '1450'
    }

    if (!section.dataset.aosOffset) {
      section.dataset.aosOffset = '90'
    }

    if (!section.dataset.aosDelay) {
      section.dataset.aosDelay = String(Math.min(index * 120, 360))
    }
  })

  AOS.init({
    duration: 1450,
    once: true,
    offset: 90,
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSectionAnimations, { once: true })
} else {
  initSectionAnimations()
}
