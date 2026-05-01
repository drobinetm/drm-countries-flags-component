# Review de la librería React: @drobinetm/react-countries-flags

## Fecha de evaluación
30 de abril de 2026

## Proyecto evaluado
- Framework: React
- Versión anterior de la librería: 1.0.0
- Versión evaluada: 1.0.0
- Entorno: local

## Resumen ejecutivo
La implementación React funciona dentro del workspace y el caso básico quedó
validado en una app Vite real con selección, actualización de estado y callback
`onChange`. Sin embargo, no está lista para uso profesional externo. El package
no existe en npm, así que la instalación documentada falla. Además, sigue
prometiendo un comportamiento `searchable` inexistente, la accesibilidad por
teclado es parcial, no hay estado vacío ni tests, y apareció un problema nuevo
de empaquetado: la docs recomienda importar `@drobinetm/react-countries-flags/styles`,
pero el build genera `dist/style.css` mientras el `exports` apunta a
`./dist/styles.css`.

## Estado general
- Resultado: No aprobada
- Nivel de riesgo: Alto
- Recomendación: No usar todavía

## Cambios realizados
- Se intentó verificar una versión publicada con
  `pnpm view @drobinetm/react-countries-flags version`; el resultado fue `404`.
- Se revalidaron `pnpm -r build` y `pnpm -r typecheck` del monorepo.
- Se verificó el package React con `pnpm build:react`.
- Se verificó el consumidor `apps/react` en build y en navegador sobre
  `http://127.0.0.1:4175` sirviendo el `dist` generado.
- Se revisaron código fuente, `package.json`, artefactos `dist`, docs Astro y
  README raíz.
- Se actualizó este `REVIEW.md` conservando el historial relevante.

## Revisión de documentación
La documentación React cubre instalación, uso controlado y props principales,
pero hoy no es fiable como guía de consumo externo. Primero, porque el package
no está publicado en npm. Segundo, porque `apps/docs/src/pages/docs/react.astro:30-32`
recomienda `import '@drobinetm/react-countries-flags/styles'`, mientras el build
real produce `packages/react/dist/style.css` y el `exports` del package apunta a
`./dist/styles.css` en `packages/react/package.json:26-33`. También siguen sin
documentarse la ausencia de búsqueda real, las limitaciones de accesibilidad, el
empty state inexistente y el impacto de bundle de `flag-icon-css`.

## Evaluación de integración en React
La integración local en `apps/react` funciona y la API controlada es clara para
un consumidor React: `value`, `onChange`, `disabled` y `className`. En navegador
quedó validado el flujo base: renderizado, apertura, selección y actualización
del estado del demo. El problema está en la madurez de distribución y calidad:
instalación pública inexistente, export de estilos roto, búsqueda ausente,
teclado incompleto y falta total de cobertura automatizada.

## Checklist de reutilización profesional

| Criterio | Estado | Evidencia | Acción recomendada |
| --- | --- | --- | --- |
| API clara y estable | Parcial | `packages/react/src/CountriesFlags.tsx:15-25` expone una API simple, pero el package se describe como `searchable` en `packages/react/package.json:4`. | Alinear la promesa pública con el comportamiento real. |
| Documentación suficiente | Pendiente | `apps/docs/src/pages/docs/react.astro` omite limitaciones reales y usa una instrucción de estilos inconsistente con el build. | Corregir instalación, estilos y límites conocidos. |
| Ejemplos básicos | Cumplido | `apps/react/src/App.tsx` es un consumidor real runnable. | Mantener el demo dentro del repo. |
| Ejemplos avanzados | Pendiente | No hay formularios, estados vacíos ni escenarios de error. | Agregar demos avanzadas. |
| Soporte React | Parcial | El soporte local funciona, pero no hay release npm y el subpath de estilos está roto. | Corregir empaquetado y publicación. |
| TypeScript | Cumplido | `pnpm -r typecheck` pasó sin errores. | Añadir tests de tipos. |
| Accesibilidad | Parcial | Hay `aria-expanded`, `aria-controls`, `role=listbox`, pero no navegación interna por teclado. | Implementar patrón completo de listbox accesible. |
| Responsive design | No verificado | En esta pasada no se repitió una auditoría móvil completa. | Añadir verificación visual automatizada. |
| Theming o personalización | Cumplido | El demo usa `className` y theming visual. | Documentar tokens y estilos esperados. |
| Manejo de errores | Pendiente | No hay empty state ni feedback de lista vacía. | Añadir render explícito para cero resultados. |
| Testing | Pendiente | No existen `*.spec.*` ni `*.test.*` en `packages/react`. | Incorporar pruebas unitarias e integración. |
| Compatibilidad con producción | Pendiente | `pnpm view` da `404`, el CSS final pesa `455.76 kB` y el export `./styles` no coincide con el build real. | Corregir publicación, subpaths y coste de assets. |

## Si REVIEW.md ya existía: seguimiento de pendientes anteriores

| Punto anterior | Estado actual | Evidencia | Comentario |
| --- | --- | --- | --- |
| Corregir import de `flag-icon-css` en docs React | Cumplido | `apps/docs/src/pages/docs/react.astro:30-32` | La ruta de `flag-icons.min.css` ya está corregida. |
| Implementar búsqueda real | Pendiente | `packages/react/package.json:4` y `packages/react/src/CountriesFlags.tsx:113-191` | La promesa sigue sin cumplirse. |
| Completar accesibilidad del `listbox` | Pendiente | `packages/react/src/CountriesFlags.tsx:72-110` | `ArrowDown` no navega opciones. |
| Añadir empty state | Pendiente | Render actual del `ul` | Sigue sin feedback para cero resultados. |
| Añadir tests automatizados | Pendiente | Búsqueda de `*.spec.*` y `*.test.*` | No existe cobertura. |
| Documentar costo de assets | Pendiente | Build de `apps/react` | El impacto sigue sin documentarse. |

## Hallazgos principales

### Críticos
- El package no está publicado en npm. `pnpm view @drobinetm/react-countries-flags version`
  devolvió `404`, por lo que la instalación documentada falla fuera del monorepo.
- El package se anuncia como `searchable` en `packages/react/package.json:4`,
  pero `packages/react/src/CountriesFlags.tsx:113-191` no implementa búsqueda.
- El subpath de estilos está roto. `packages/react/package.json:26-33` exporta
  `./styles` hacia `./dist/styles.css`, pero el build real genera
  `packages/react/dist/style.css`.

### Importantes
- La accesibilidad es parcial. `packages/react/src/CountriesFlags.tsx:103-110`
  sólo abre con `Enter` y `Space`, y `72-85` sólo cierra con `Escape`; en la
  prueba manual `ArrowDown` no movió foco ni selección.
- No existe estado vacío visible para subconjuntos sin resultados.
- No hay pruebas automatizadas para props, `onChange`, foco ni accesibilidad.
- El build del consumidor React generó `dist/assets/index-CM8jQNFb.css` de
  `455.76 kB`, evidenciando alto coste de CSS y assets de banderas.

### Menores
- No hay hooks o variantes de composición más extensibles.
- No existen README o changelog específicos del package React.
- En la demo servida sólo apareció un `404` de `favicon.ico`; no se observaron
  errores funcionales propios del componente.

## Pruebas realizadas

| Caso probado | Resultado | Evidencia | Observaciones |
| --- | --- | --- | --- |
| Publicación npm | Fallo | `pnpm view @drobinetm/react-countries-flags version` | No existe release pública. |
| Build del package React | OK | `pnpm build:react` y `pnpm -r build` | Generó artefactos y tipos. |
| TypeScript | OK | `pnpm -r typecheck` | Sin errores. |
| Build del consumidor React | OK | `pnpm -r build` | La app React compila consumiendo el package local. |
| Renderizado básico | OK | Snapshot de `http://127.0.0.1:4175` | La UI homogénea renderiza correctamente. |
| API controlada `value` | OK | Prueba manual en navegador | El valor pasó de `none` a `ad`. |
| Evento `onChange` | OK | Panel `LATEST EVENT` del demo | Se registró `Andorra (ad)`. |
| Teclado básico | OK | Navegador en `http://127.0.0.1:4175` | Apertura y cierre básico operativos. |
| Teclado avanzado | Fallo | Prueba manual con `ArrowDown` | No hubo navegación interna. |
| Export de estilos | Fallo | `packages/react/package.json` y contenido de `packages/react/dist` | El subpath `./styles` no coincide con el artefacto generado. |

## Pruebas faltantes recomendadas
- Test de `onChange` con payload completo.
- Test de foco al cerrar con `Escape` y tras seleccionar una opción.
- Test de lista vacía cuando `filter` no devuelve países.
- Test de accesibilidad con `axe`.
- Test de subpath export `./styles` desde un consumidor externo real.
- Test de instalación real desde tarball o registry antes de publicar.

## Recomendaciones concretas
- Publicar el package en npm o documentar formalmente que hoy sólo está pensado
  para `workspace:*` o instalación local.
  Dónde: release process, README y docs React.
  Por qué importa: la instalación pública actual falla. Prioridad: Alta.
- Corregir el export de estilos.
  Dónde: `packages/react/package.json` o configuración de build para generar
  `styles.css` en vez de `style.css`.
  Por qué importa: la docs recomienda un import que hoy rompe. Prioridad: Alta.
- Eliminar la promesa de `searchable` o implementar búsqueda real.
  Dónde: `packages/react/package.json`, README y `packages/react/src/CountriesFlags.tsx`.
  Por qué importa: hoy la API pública no coincide con el comportamiento.
  Prioridad: Alta.
- Completar accesibilidad del `listbox`.
  Dónde: `packages/react/src/CountriesFlags.tsx`.
  Por qué importa: el soporte de teclado es insuficiente. Prioridad: Alta.
- Añadir tests automatizados de integración.
  Dónde: `packages/react`.
  Por qué importa: no existe red de seguridad para regresiones. Prioridad: Alta.

## Qué falta para ser headless y agnóstica del framework visual
Hoy la implementación React no sigue un enfoque headless. Es un componente con
estilos y estructura visual propios, personalizable por tokens, pero no fácil de
adaptar a cualquier design system sin fricción. Para pasar a un modelo realmente
agnóstico necesita lo siguiente.

- Modo `unstyled` real para desactivar el CSS propio del package.
- API de `slotProps` o `classNames` por subparte del componente, no sólo un
  `className` global en el root.
- Render props o subcomponentes para redefinir trigger, option row, icono,
  label y empty state sin duplicar la lógica interna.
- Separación entre estado/behaviour y render, por ejemplo con un hook headless
  `useCountriesFlags()` y un componente estilizado opcional encima.
- Estados expuestos de forma composable (`open`, `activeOption`, `selected`,
  `disabled`, `empty`) para integrarlo con Tailwind, Bootstrap o librerías UI.
- Menor dependencia de clases privadas `.drm-cf__*` como única vía de ajuste.
- Soporte explícito para empty state y variantes visuales controladas por el
  consumidor, no por CSS fijo del package.
- Guías de integración reales con sistemas visuales externos, incluyendo cómo
  sustituir completamente la apariencia manteniendo la accesibilidad.

## Conclusión
La librería React funciona para un caso básico dentro del monorepo, pero todavía
no puede considerarse un package reutilizable y profesional. Necesita resolver
publicación, empaquetado de estilos, discrepancias de API, accesibilidad y
testing antes de aprobarse para producción.
