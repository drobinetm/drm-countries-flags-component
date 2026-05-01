# Review de la librería Vue: @drobinetm/vue-countries-flags

## Fecha de evaluación
30 de abril de 2026

## Proyecto evaluado
- Framework: Vue
- Versión anterior de la librería: 1.0.0
- Versión evaluada: 1.0.0
- Entorno: local

## Resumen ejecutivo
La implementación Vue funciona dentro del monorepo en una app consumidora real,
y el flujo base con `v-model` y `@change` quedó validado en navegador y build.
Sin embargo, la librería todavía no está lista para uso profesional externo.
No existe release en npm, por lo que la instalación documentada falla fuera del
workspace. Además, el package se sigue describiendo como `searchable` aunque no
hay búsqueda en el componente, la accesibilidad por teclado sigue incompleta, no
hay estado vacío ni pruebas automatizadas, y el impacto de `flag-icon-css`
sigue siendo alto en el bundle final.

## Estado general
- Resultado: No aprobada
- Nivel de riesgo: Alto
- Recomendación: No usar todavía

## Cambios realizados
- Se intentó verificar una versión más reciente publicada con
  `pnpm view @drobinetm/vue-countries-flags version`; el resultado fue `404`.
- Se revalidaron `pnpm -r build` y `pnpm -r typecheck` sobre el monorepo.
- Se verificó el package Vue con `pnpm build:vue`.
- Se verificó el consumidor real `apps/vue` con build y validación manual en
  `http://127.0.0.1:4176` sirviendo el `dist` generado.
- Se revisaron código fuente, demo consumidora, README raíz y docs Astro.
- Se actualizó este `REVIEW.md` conservando el seguimiento de hallazgos previos.

## Revisión de documentación
La página Vue en Astro cubre instalación, uso básico, props y emits, pero sigue
sin reflejar el estado real del package. La guía presupone publicación en npm,
cuando `@drobinetm/vue-countries-flags` no existe en el registry. Tampoco
documenta que el componente no tiene búsqueda real, que no expone slots ni
composables, que no hay estado vacío, ni que la accesibilidad por teclado se
limita a abrir y cerrar el dropdown. Además, el demo real `apps/vue` funciona
sin importar `@drobinetm/vue-countries-flags/styles`, por lo que la docs no deja
claro si ese import es obligatorio u opcional en bundlers modernos.

## Evaluación de integración en Vue
La integración local en `apps/vue` es directa usando `workspace:*`. El componente
renderiza, permite seleccionar países y actualiza `v-model` y el log del evento
`change`. En navegador quedó validado el flujo base de apertura, selección y
cierre con `Escape`. TypeScript también quedó verificado con `vue-tsc --noEmit`
durante el build de la app consumidora. El problema principal no está en el caso
básico, sino en el salto a uso profesional: instalación externa no verificable,
sin búsqueda real, sin estado vacío, sin tests y con accesibilidad parcial.

## Checklist de reutilización profesional

| Criterio | Estado | Evidencia | Acción recomendada |
| --- | --- | --- | --- |
| API clara y estable | Parcial | `packages/vue/src/CountriesFlags.vue:25-54` define una API corta, pero el package se describe como `searchable` en `packages/vue/package.json:4`. | Alinear naming, descripción y comportamiento real. |
| Documentación suficiente | Pendiente | `apps/docs/src/pages/docs/vue.astro` cubre lo básico, pero no documenta limitaciones reales ni la ausencia de release npm. | Añadir instalación real, límites conocidos y troubleshooting. |
| Ejemplos básicos | Cumplido | `apps/vue/src/App.vue` expone un consumidor real con cuatro casos visibles. | Mantener un demo runnable dentro del monorepo. |
| Ejemplos avanzados | Pendiente | No hay formularios complejos, empty state ni testing examples. | Agregar demos avanzadas y casos borde. |
| Soporte Vue | Parcial | El soporte local funciona, pero el package no está publicado y la instalación externa no quedó verificada. | Publicar o documentar que el uso actual es sólo workspace/local. |
| TypeScript | Cumplido | `pnpm -r typecheck` y `vue-tsc --noEmit` pasaron. | Añadir tests de tipos. |
| Accesibilidad | Parcial | Hay `aria-haspopup`, `aria-expanded`, `role=listbox` y `aria-selected`, pero no navegación por flechas. | Implementar patrón completo de listbox accesible. |
| Responsive design | No verificado | En esta pasada no se repitió una auditoría visual móvil completa. | Añadir screenshot tests o smoke tests responsive. |
| Theming o personalización | Cumplido | El demo aplica theming vía CSS variables y Tailwind. | Documentar tokens soportados y alcance real. |
| Manejo de errores | Pendiente | No existe empty state cuando no hay resultados. | Mostrar y documentar estado vacío. |
| Testing | Pendiente | No hay archivos `*.spec.*` o `*.test.*` en `packages/vue`. | Añadir tests unitarios e integración. |
| Compatibilidad con producción | Pendiente | `pnpm view` da `404` y el build del consumidor genera `455.76 kB` de CSS final. | Publicar correctamente y documentar/mitigar el costo de assets. |

## Si REVIEW.md ya existía: seguimiento de pendientes anteriores

| Punto anterior | Estado actual | Evidencia | Comentario |
| --- | --- | --- | --- |
| Corregir import de `flag-icon-css` en docs Vue | Cumplido | `apps/docs/src/pages/docs/vue.astro:30-32` | La ruta actual usa `flag-icons.min.css`. |
| Implementar búsqueda real | Pendiente | `packages/vue/package.json:4` y `packages/vue/src/CountriesFlags.vue:103-172` | Sigue existiendo la promesa de `searchable` sin buscador real. |
| Completar navegación por teclado | Pendiente | `packages/vue/src/CountriesFlags.vue:84-91` | Sigue sin soporte de `ArrowDown`, `ArrowUp`, `Home` y `End`. |
| Añadir estado vacío | Pendiente | `packages/vue/src/CountriesFlags.vue:150-171` | La lista simplemente queda vacía. |
| Añadir tests automatizados | Pendiente | Búsqueda de `*.spec.*` y `*.test.*` en `packages/vue` | No existe cobertura. |
| Documentar impacto de bundle | Pendiente | Build de `apps/vue` | El coste sigue sin documentarse en docs/README. |

## Hallazgos principales

### Críticos
- El package no está publicado en npm. `pnpm view @drobinetm/vue-countries-flags version`
  devolvió `404`, así que la instalación documentada con `pnpm add` falla fuera
  del workspace.
- La librería se describe como `searchable` en `packages/vue/package.json:4`,
  pero `packages/vue/src/CountriesFlags.vue:103-172` no implementa ningún campo
  de búsqueda ni filtrado por texto.

### Importantes
- La accesibilidad sigue siendo parcial. `packages/vue/src/CountriesFlags.vue:84-91`
  sólo maneja `Enter`, `Space` y `Escape`; en prueba manual `ArrowDown` no movió
  foco ni selección.
- No existe estado vacío ni feedback cuando `filter` produce cero resultados.
- No hay pruebas automatizadas para props, emits ni accesibilidad.
- El build del consumidor Vue generó `dist/assets/index-CM8jQNFb.css` de
  `455.76 kB`, evidenciando alto peso por `flag-icon-css` y assets asociados.

### Menores
- No hay slots ni composables exportados.
- No existen README o changelog específicos del package Vue.
- En la demo servida apareció un `404` de `favicon.ico`, pero no se observaron
  errores funcionales propios del componente.

## Pruebas realizadas

| Caso probado | Resultado | Evidencia | Observaciones |
| --- | --- | --- | --- |
| Publicación npm | Fallo | `pnpm view @drobinetm/vue-countries-flags version` | No existe release pública. |
| Build del package Vue | OK | `pnpm build:vue` y `pnpm -r build` | Generó artefactos y tipos. |
| TypeScript | OK | `pnpm -r typecheck` | `vue-tsc --noEmit` pasó. |
| Build del consumidor Vue | OK | `pnpm -r build` | `apps/vue` compila consumiendo el package local. |
| Renderizado básico | OK | Snapshot de `http://127.0.0.1:4176` | La UI homogénea renderiza correctamente. |
| Selección y `v-model` | OK | Prueba manual en navegador | El valor pasó de `none` a `bb` tras seleccionar. |
| Evento `change` | OK | Panel `LATEST EVENT` y lista de eventos | Se registró `Barbados (bb)`. |
| Teclado básico | OK | Navegador en `http://127.0.0.1:4176` | Apertura y cierre con `Enter`/`Escape`. |
| Teclado avanzado | Fallo | Prueba manual con `ArrowDown` | No hubo navegación interna. |
| Console warnings propios | Parcial | DevTools | Sólo se observó `404` de `favicon.ico` del servidor estático. |

## Pruebas faltantes recomendadas
- Test unitario de `update:modelValue` y `change`.
- Test de render con `filter=[]`, subconjuntos concretos y `max=0`.
- Test de estado vacío cuando `filter` no devuelve países.
- Test de teclado con `ArrowDown`, `ArrowUp`, `Home`, `End` y `Escape`.
- Test de accesibilidad con `axe` o equivalente.
- Test de instalación real desde tarball o registry antes de publicar.

## Recomendaciones concretas
- Publicar el package en npm o corregir la documentación para indicar que hoy sólo
  funciona por `workspace:*` o instalación local.
  Dónde: proceso de release, README y docs Vue.
  Por qué importa: la instalación pública actual falla. Prioridad: Alta.
- Eliminar la promesa de `searchable` o implementar búsqueda real.
  Dónde: `packages/vue/package.json`, README y `packages/vue/src/CountriesFlags.vue`.
  Por qué importa: hoy la API pública no coincide con el comportamiento.
  Prioridad: Alta.
- Implementar navegación completa de `listbox` accesible.
  Dónde: `packages/vue/src/CountriesFlags.vue`.
  Por qué importa: la interacción por teclado está incompleta. Prioridad: Alta.
- Añadir empty state visible cuando no haya resultados.
  Dónde: `packages/vue/src/CountriesFlags.vue` y docs Vue.
  Por qué importa: mejora UX y hace el componente más testeable. Prioridad: Media.
- Añadir tests unitarios e integración.
  Dónde: `packages/vue`.
  Por qué importa: no hay red de seguridad para regresiones. Prioridad: Alta.

## Qué falta para ser headless y agnóstica del framework visual
Hoy la implementación Vue no es headless. Es un componente ya estilizado con
markup, clases internas y comportamiento visual acoplado. Para que pueda
adaptarse con facilidad a CSS puro, Tailwind, Bootstrap o Vuetify, necesita lo
siguiente.

- Modo `unstyled` real para desactivar completamente los estilos por defecto.
- API explícita de clases por partes, por ejemplo `root`, `trigger`, `list`,
  `option`, `flag`, `label`, `chevron` y `emptyState`.
- Slots para sustituir el contenido del trigger, de cada opción y del estado
  vacío sin rehacer la lógica del componente.
- Separación entre lógica y presentación, idealmente extrayendo la lógica a un
  composable headless y dejando el componente actual como wrapper estilizado.
- Contrato estable para estados visuales (`open`, `selected`, `disabled`,
  `focused`, `empty`) que pueda mapearse a cualquier design system.
- Posibilidad de controlar la estructura del DOM o, como mínimo, de extenderla
  sin depender de las clases internas `.drm-cf__*`.
- Empty state configurable y renderizable desde fuera, en vez de una lista que
  simplemente queda vacía.
- Documentación específica de integración con design systems externos,
  aclarando qué parte controla la librería y qué parte controla el consumidor.

## Conclusión
La librería Vue resuelve el caso básico dentro del monorepo, pero todavía no es
reutilizable ni profesional para consumo externo. Para aprobarla completamente
debe tener publicación real o una estrategia formal de distribución, corregir la
promesa de `searchable`, completar accesibilidad por teclado y añadir tests y
documentación de producción.
