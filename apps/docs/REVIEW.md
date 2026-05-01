# Review del package Astro docs: @drobinetm/docs-countries-flags

## Fecha de evaluación
30 de abril de 2026

## Proyecto evaluado
- Framework: Astro
- Versión anterior de la librería: 1.0.0
- Versión evaluada: 1.0.0
- Entorno: local

## Resumen ejecutivo
El sitio docs builda correctamente y el modo `astro dev` cargó sin overlay en la
validación actual. La estructura visual es buena y la navegación por framework
es clara. Aun así, la documentación sigue siendo técnicamente poco confiable:
promete instalación desde npm aunque no hay paquetes publicados, afirma
accesibilidad con teclado completo que la librería no entrega, y omite problemas
reales de empaquetado y distribución en React y Angular. Además, la config de
Astro mantiene `optimizeDeps.include: ['country-list']`, lo que sigue generando
warnings en dev sin beneficio claro.

## Estado general
- Resultado: No aprobada
- Nivel de riesgo: Alto
- Recomendación: No usar todavía

## Cambios realizados
- Se revalidó `pnpm --filter @drobinetm/docs-countries-flags build` dentro de
  `pnpm -r build`.
- Se validó el sitio estático en `http://127.0.0.1:4322`.
- Se levantó `astro dev` en segundo plano y se validó la home en
  `http://127.0.0.1:4323`.
- Se revisaron `apps/docs/src/pages/index.astro`, las páginas framework y
  `apps/docs/astro.config.mjs`.
- Se contrastó la docs con los packages reales, sus builds y los consumidores
  Vue, React y Angular del monorepo.
- Se actualizó este `REVIEW.md` conservando el historial relevante.

## Revisión de documentación
La estructura general del sitio es buena: existe home, separación por framework
y tablas de props. El problema está en la exactitud técnica. La home y la guía
de instalación sugieren `pnpm add @drobinetm/...`, pero ninguno de los packages
está publicado en npm. La home también promete "Full keyboard navigation" en
`apps/docs/src/pages/index.astro:95-99`, lo que contradice el comportamiento real
de Vue, React y Angular. En React, además, la guía recomienda un import de
estilos que hoy no coincide con el artefacto generado por el package. Tampoco se
documentan limitaciones reales como ausencia de búsqueda, empty state, falta de
tests o peso elevado de `flag-icon-css`.

## Evaluación de integración en Astro
`astro build` funciona correctamente. En esta validación también cargó
correctamente `astro dev` en `http://127.0.0.1:4323`, por lo que el overlay de
HMR reportado anteriormente no se reprodujo. El problema vigente en dev es otro:
`apps/docs/astro.config.mjs:11-14` sigue incluyendo `country-list` en
`optimizeDeps.include`, y el log del servidor mostró el warning
`Failed to resolve dependency: country-list, present in client optimizeDeps.include`.
Además, el sitio sigue sin enlazar explícitamente a las apps consumidoras reales
como evidencia viva del comportamiento documentado.

## Checklist de reutilización profesional

| Criterio | Estado | Evidencia | Acción recomendada |
| --- | --- | --- | --- |
| API clara y estable | Pendiente | La home y las páginas framework exageran capacidades reales. | Corregir afirmaciones y alinear contenido con el código. |
| Documentación suficiente | Parcial | Hay cobertura básica, pero faltan límites conocidos, troubleshooting y estado de publicación. | Añadir secciones de instalación real, límites y errores comunes. |
| Ejemplos básicos | Cumplido | Las páginas framework tienen snippets básicos. | Mantenerlos sincronizados con código probado. |
| Ejemplos avanzados | Pendiente | No hay demos vivos ni enlaces claros a consumidores reales. | Añadir demos interactivos o links a las apps de evaluación. |
| Soporte Astro | Parcial | `astro build` y `astro dev` cargaron, pero persiste warning de `optimizeDeps`. | Limpiar config y validar tooling en CI. |
| TypeScript | Parcial | El sitio funciona, pero la confiabilidad del contenido es el problema principal, no el tipado. | Añadir smoke tests del sitio. |
| Accesibilidad | Pendiente | La docs afirma teclado completo que hoy no existe. | Documentar alcance real de a11y. |
| Responsive design | No verificado | En esta pasada no se hizo auditoría visual móvil del docs site. | Añadir revisión visual o screenshot tests. |
| Theming o personalización | Parcial | La home muestra CSS variables, pero no hay guía completa por framework. | Añadir ejemplos y tabla de tokens por integración. |
| Manejo de errores | Pendiente | No hay troubleshooting de empaquetado, npm 404 o assets Angular. | Añadir troubleshooting específico. |
| Testing | Pendiente | No hay pruebas automatizadas del sitio. | Añadir smoke tests, link checking y validación de snippets. |
| Compatibilidad con producción | Pendiente | El sitio builda, pero publica instrucciones y claims no verificables externamente. | Corregir contenido antes de usarlo como fuente oficial. |

## Si REVIEW.md ya existía: seguimiento de pendientes anteriores

| Punto anterior | Estado actual | Evidencia | Comentario |
| --- | --- | --- | --- |
| Corregir imports de `flag-icon-css` en páginas framework | Cumplido | Páginas `apps/docs/src/pages/docs/*.astro` | La ruta actual es correcta. |
| Corregir claims de capacidad | Pendiente | `apps/docs/src/pages/index.astro:95-99` | La home sigue prometiendo teclado completo. |
| Añadir troubleshooting Angular y `flag-icon-css` | Pendiente | Página Angular actual | Sigue faltando guía real de integración y publicación. |
| Revisar inestabilidad de `astro dev` | Obsoleto | `http://127.0.0.1:4323` cargó correctamente | El overlay anterior no se reprodujo en esta pasada. |
| Eliminar o justificar `optimizeDeps.include: ['country-list']` | Pendiente | `apps/docs/astro.config.mjs:11-14` y log de dev | El warning sigue presente. |
| Enlazar a consumidores reales o demos vivos | Pendiente | Sitio actual | Siguen siendo snippets estáticos. |

## Hallazgos principales

### Críticos
- La documentación instruye instalar paquetes desde npm, pero `pnpm view` sobre
  `@drobinetm/angular-countries-flags`, `@drobinetm/react-countries-flags`,
  `@drobinetm/vue-countries-flags` y `@drobinetm/countries-flags-core` devolvió
  `404`. Hoy la guía principal de instalación falla.
- La home promete accesibilidad con "Full keyboard navigation" en
  `apps/docs/src/pages/index.astro:95-99`, pero las tres implementaciones sólo
  validaron apertura/cierre básico y fallaron en navegación con flechas.

### Importantes
- La guía React recomienda `@drobinetm/react-countries-flags/styles`, pero el
  package React genera `dist/style.css` y no `dist/styles.css`.
- La guía Angular no documenta que el build del consumidor aún emite el warning
  `Unable to locate stylesheet: /assets/flag-icon-css/css/flag-icons.min.css`.
- `apps/docs/astro.config.mjs:11-14` sigue generando warning por
  `optimizeDeps.include: ['country-list']`.
- El sitio no aprovecha las apps consumidoras reales del monorepo como evidencia
  runnable del comportamiento documentado.

### Menores
- No hay changelog o guía de migración por framework.
- Falta una sección de limitaciones conocidas por package.

## Pruebas realizadas

| Caso probado | Resultado | Evidencia | Observaciones |
| --- | --- | --- | --- |
| Build del sitio docs | OK | `pnpm --filter @drobinetm/docs-countries-flags build` | Generó `/`, `/docs/vue`, `/docs/react` y `/docs/angular`. |
| Home en build servido | OK | `http://127.0.0.1:4322` | La navegación principal carga correctamente. |
| Home en `astro dev` | OK con observaciones | `http://127.0.0.1:4323` y log `/tmp/drm-docs-dev-live.log` | No hubo overlay, pero sí warning por `country-list`. |
| Exactitud de claims de accesibilidad | Fallo | Home y pruebas manuales en apps | La docs promete más de lo que entregan los packages. |
| Exactitud de instalación npm | Fallo | `pnpm view @drobinetm/* version` | No hay release pública. |
| Demos vivos | No verificado | Sitio actual | Sólo hay snippets estáticos. |

## Pruebas faltantes recomendadas
- Smoke tests de navegación y status code del sitio.
- Validación automática de links.
- Verificación visual responsive de home y páginas framework.
- Test que valide que cada snippet de instalación corresponde a un package
  realmente publicable o instalable.
- Test que compare claims del docs contra artefactos reales del build.

## Recomendaciones concretas
- Corregir todas las instrucciones de instalación para reflejar el estado real de
  publicación.
  Dónde: home, README y páginas framework.
  Por qué importa: hoy inducen instalaciones fallidas. Prioridad: Alta.
- Eliminar claims falsos de accesibilidad y búsqueda.
  Dónde: `apps/docs/src/pages/index.astro` y páginas framework.
  Por qué importa: la documentación hoy promete capacidades inexistentes.
  Prioridad: Alta.
- Añadir troubleshooting específico por framework.
  Dónde: `apps/docs/src/pages/docs/*.astro`.
  Por qué importa: React y Angular tienen fricciones reales de empaquetado y
  assets. Prioridad: Alta.
- Eliminar o justificar `optimizeDeps.include: ['country-list']`.
  Dónde: `apps/docs/astro.config.mjs`.
  Por qué importa: sigue agregando ruido en dev. Prioridad: Media.
- Enlazar a los consumidores reales o integrar demos vivos.
  Dónde: páginas framework del docs.
  Por qué importa: el monorepo ya tiene evidencia runnable y el sitio no la usa.
  Prioridad: Media.

## Conclusión
El sitio Astro es una buena base visual, pero todavía no puede considerarse una
documentación técnica profesional y confiable. Para aprobarlo completamente debe
corregir instalación, claims de capacidad, troubleshooting y su relación con los
artefactos reales que hoy producen los packages.
