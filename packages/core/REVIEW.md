# Review del package Core: @drobinetm/countries-flags-core

## Fecha de evaluación
30 de abril de 2026

## Proyecto evaluado
- Framework: Core compartido TypeScript
- Versión anterior de la librería: 1.0.0
- Versión evaluada: 1.0.0
- Entorno: local

## Resumen ejecutivo
El package core compila y tipa correctamente, y sus utilidades principales
funcionan en una prueba real de ejecución sobre el `dist` generado. Aun así,
no está listo como dependencia profesional publicada: no existe release en npm,
no tiene `REVIEW.md` previo, no tiene tests automatizados, ni README o changelog
propios por package. Además, `getCountries()` usa el filtro como whitelist, pero
no preserva el orden solicitado por el consumidor, lo que complica escenarios en
los que el orden esperado forma parte de la UX. También arrastra la dependencia
`country-list`, que sigue siendo un punto de fricción para tooling y bundling.

## Estado general
- Resultado: No aprobada
- Nivel de riesgo: Medio
- Recomendación: No usar todavía

## Cambios realizados
- Se revisó `packages/core/package.json`, `src/index.ts`, `src/types.ts` y
  `src/data.ts`.
- Se ejecutaron `pnpm build:core` y `pnpm --filter @drobinetm/countries-flags-core typecheck`.
- Se ejecutó una prueba smoke real con Node importando
  `./packages/core/dist/index.js`.
- Se verificó publicación en npm con `pnpm view @drobinetm/countries-flags-core version`.
- Se creó este `REVIEW.md` desde cero.

## Revisión de documentación
La documentación raíz del monorepo menciona el package y su contrato básico,
pero no existe documentación propia en `packages/core`. Tampoco hay changelog
por package ni ejemplos de consumo directo del core fuera de las implementaciones
de framework. Esto limita la reutilización profesional porque el package es la
base compartida, pero hoy sólo puede entenderse leyendo el código fuente.

## Evaluación técnica del core
La superficie pública es pequeña y entendible: exporta tipos (`Country`,
`CountriesFlagsProps`, `CountryChangeEvent`) y tres utilidades
(`getCountries`, `getCountryByCode`, `flagClass`). La smoke test real devolvió
resultados válidos para lookup y generación de clases CSS. Sin embargo,
`getCountries(filter, max)` no conserva el orden del filtro de entrada.
Con la prueba `getCountries(['es', 'us', 'br'], 2)` el resultado fue
`[{ code: 'br' }, { code: 'es' }]`, lo que demuestra que el orden final depende
del orden interno de `country-list`, no del orden pedido por el consumidor.
Además, `getAllCountries()` reconstruye la lista completa en cada llamada, lo
que no es grave para 249 entradas, pero sí es trabajo repetido e innecesario.

## Checklist de reutilización profesional

| Criterio | Estado | Evidencia | Acción recomendada |
| --- | --- | --- | --- |
| API clara y estable | Cumplido | `packages/core/src/index.ts` expone una API corta y explícita. | Mantener la superficie pública pequeña. |
| Documentación suficiente | Pendiente | No existe README propio ni changelog del package. | Añadir README, changelog y ejemplos de uso directo. |
| Ejemplos básicos | Pendiente | No hay ejemplos específicos del core. | Documentar `getCountries`, `getCountryByCode` y `flagClass`. |
| Ejemplos avanzados | Pendiente | No hay guías sobre orden, límites o normalización. | Añadir casos borde y contratos esperados. |
| Soporte multi-framework | Parcial | El core sí es consumido por Angular, React y Vue, pero no tiene validación aislada más allá de smoke test. | Añadir tests compartidos y contrato estable. |
| TypeScript | Cumplido | `pnpm --filter @drobinetm/countries-flags-core typecheck` pasó correctamente. | Añadir tests de tipos en CI. |
| Accesibilidad | No aplica | El core no renderiza UI. | Mantenerlo sin lógica visual. |
| Responsive design | No aplica | El core no renderiza UI. | No aplica. |
| Theming o personalización | Parcial | `flagClass()` resuelve clases CSS, pero no documenta dependencias externas. | Documentar contrato con `flag-icon-css`. |
| Manejo de errores | Pendiente | No hay validación explícita para filtros inválidos, `max` negativos o entradas vacías fuera del comportamiento implícito. | Definir y documentar comportamiento para entradas inválidas. |
| Testing | Pendiente | No existen archivos `*.spec.*` o `*.test.*` en `packages/core`. | Añadir tests unitarios. |
| Compatibilidad con producción | Parcial | Build y typecheck pasan, pero no existe release npm y depende de `country-list`. | Publicar correctamente o documentar que es interno. |

## Si REVIEW.md ya existía: seguimiento de pendientes anteriores
No existía una revisión anterior.

## Hallazgos principales

### Críticos
- El package no está publicado en npm. `pnpm view @drobinetm/countries-flags-core version`
  devolvió `404`, por lo que no puede instalarse externamente con la guía actual.

### Importantes
- `getCountries()` no preserva el orden del filtro de entrada.
  Evidencia: la smoke test real devolvió `br, es` para
  `getCountries(['es', 'us', 'br'], 2)`. El comportamiento actual usa el orden
  interno de `country-list`, no el orden pedido por el consumidor.
- No hay tests automatizados del contrato compartido.
- No existe documentación propia del package, aunque es la base de las tres
  implementaciones de UI.

### Menores
- `getAllCountries()` recalcula la lista completa en cada llamada en
  `packages/core/src/data.ts:8-14`.
- La relación con `flag-icon-css` está implícita en `flagClass()` y no está
  documentada a nivel de package.

## Pruebas realizadas

| Caso probado | Resultado | Evidencia | Observaciones |
| --- | --- | --- | --- |
| Publicación npm | Fallo | `pnpm view @drobinetm/countries-flags-core version` | El package no existe en el registry. |
| Build del package | OK | `pnpm build:core` | Generó `dist/index.js`, `dist/index.cjs` y tipos. |
| TypeScript | OK | `pnpm --filter @drobinetm/countries-flags-core typecheck` | Sin errores. |
| Smoke test de `getCountries` | OK con observaciones | `node --input-type=module -e "import ..."` | Funciona, pero no preserva orden del filtro. |
| Smoke test de `getCountryByCode` | OK | Misma ejecución Node | `getCountryByCode('ES')` devolvió `Spain`. |
| Smoke test de `flagClass` | OK | Misma ejecución Node | Devolvió `flag-icon flag-icon-es flag-icon-squared`. |

## Pruebas faltantes recomendadas
- Test unitario de orden del filtro en `getCountries()`.
- Test de normalización a lowercase para `filter` y `code`.
- Test de `max=0`, `max<0` y filtros vacíos.
- Test de regresión para tipos exportados.
- Test de performance simple o memoización del dataset base.

## Recomendaciones concretas
- Publicar el package o dejar explícito que es sólo interno.
  Dónde: release process del monorepo, README raíz y docs.
  Por qué importa: hoy la instalación pública falla. Prioridad: Alta.
- Definir si el orden del filtro debe preservarse.
  Dónde: `packages/core/src/data.ts` y documentación.
  Por qué importa: afecta directamente la UX de los consumidores. Prioridad: Alta.
- Añadir tests unitarios del contrato compartido.
  Dónde: `packages/core`.
  Por qué importa: hoy no hay red de seguridad para los tres frameworks.
  Prioridad: Alta.
- Documentar el contrato del core y su dependencia de `flag-icon-css`.
  Dónde: `packages/core/README.md`.
  Por qué importa: mejora reutilización y DX. Prioridad: Media.
- Evitar recalcular el dataset completo en cada llamada.
  Dónde: `packages/core/src/data.ts`.
  Por qué importa: simplifica lógica y evita trabajo repetido. Prioridad: Baja.

## Conclusión
El core funciona como base técnica del monorepo, pero todavía no puede
considerarse un package profesional y reutilizable por sí solo. Para aprobarlo
completamente necesita publicación real o documentación explícita de uso
interno, tests automatizados, documentación propia y una definición clara del
comportamiento esperado de `getCountries()` respecto al orden del filtro.
