# Review de la librería Angular: @drobinetm/angular-countries-flags

## Fecha de evaluación
30 de abril de 2026

## Proyecto evaluado
- Framework: Angular
- Versión anterior de la librería: 1.0.0
- Versión evaluada: 1.0.0
- Entorno: local

## Resumen ejecutivo
La librería Angular puede demostrarse funcionando dentro del monorepo en una app
standalone real con `[(ngModel)]`, `FormControl` y `valueChange`. El build del
consumidor y la validación manual sobre el output servido fueron correctos. Sin
embargo, el package sigue lejos de estar listo para distribución profesional.
No existe publicación en npm, `ng-packagr` continúa emitiendo warnings de
exports, el `package.json` generado en `dist` apunta a rutas internas inválidas,
el subpath `./styles` también apunta a un archivo inexistente, y el componente
sigue sin búsqueda real, sin teclado completo y sin tests automatizados.

## Estado general
- Resultado: No aprobada
- Nivel de riesgo: Alto
- Recomendación: No usar todavía

## Cambios realizados
- Se intentó verificar una versión publicada con
  `pnpm view @drobinetm/angular-countries-flags version`; el resultado fue `404`.
- Se revalidaron `pnpm -r build` y `pnpm -r typecheck` del monorepo.
- Se verificó `pnpm build:angular` y el consumidor `apps/angular`.
- Se validó la app servida desde `apps/angular/dist/.../browser` en
  `http://127.0.0.1:4300`.
- Se revisaron código fuente, demo Angular, docs Astro, README y el
  `packages/angular/dist/package.json` generado por `ng-packagr`.
- Se actualizó este `REVIEW.md` conservando el seguimiento del informe previo.

## Revisión de documentación
La página Angular explica standalone, `ngModel`, reactive forms y `valueChange`,
pero sigue omitiendo dos problemas críticos de uso real. El primero es que el
package no existe en npm, así que la instalación documentada falla fuera del
workspace. El segundo es que la distribución generada no es confiable: la docs
no advierte que el `package.json` emitido por `ng-packagr` contiene rutas con
prefijo `./dist/` dentro del propio `dist`, y tampoco documenta la advertencia
de build `Unable to locate stylesheet: /assets/flag-icon-css/css/flag-icons.min.css`.
Además, la docs no aclara la ausencia de búsqueda real, estado vacío y teclado
avanzado.

## Evaluación de integración en Angular
La integración local en `apps/angular` funciona. En la app de evaluación el
componente renderiza, selecciona valores y actualiza `[(ngModel)]` y el evento
`valueChange`. El archivo de banderas también se sirvió correctamente en la app
estática (`GET /assets/flag-icon-css/css/flag-icons.min.css [304]`). El mayor
problema está en la capa de empaquetado: `packages/angular/dist/package.json`
expone rutas como `./dist/fesm2022/...` y `./dist/index.d.ts` dentro del propio
dist, lo que no es una forma válida de publicar el paquete tal cual. A eso se
suma el warning de `ng-packagr` sobre condiciones de `exports` y la falta de
pruebas del `ControlValueAccessor`.

## Checklist de reutilización profesional

| Criterio | Estado | Evidencia | Acción recomendada |
| --- | --- | --- | --- |
| API clara y estable | Parcial | `packages/angular/src/countries-flags.component.ts:263-278` define una API simple, pero el package se describe como `searchable` en `packages/angular/package.json:4`. | Alinear marketing y funcionalidad real. |
| Documentación suficiente | Pendiente | `apps/docs/src/pages/docs/angular.astro` no cubre publicación inexistente ni problemas reales de distribución. | Documentar instalación real, assets y troubleshooting. |
| Ejemplos básicos | Cumplido | `apps/angular/src/app/app.component.ts` usa `ngModel`, `FormControl` y `valueChange`. | Mantener ejemplo ejecutable. |
| Ejemplos avanzados | Pendiente | No hay guía de SSR, lazy loading, publicación o errores de empaquetado. | Añadir escenarios reales de consumo externo. |
| Soporte Angular | Parcial | La demo local funciona, pero la distribución generada es frágil. | Corregir package manifest y publicación. |
| TypeScript | Parcial | `tsc --noEmit` pasa, pero el `dist/package.json` usa rutas inválidas. | Validar consumo externo real desde un proyecto Angular limpio. |
| Accesibilidad | Parcial | Hay `aria-expanded`, `role=listbox`, `aria-selected`, pero no navegación interna completa. | Implementar patrón accesible completo. |
| Responsive design | No verificado | En esta pasada no se repitió auditoría visual móvil. | Añadir revisión visual automatizada. |
| Theming o personalización | Cumplido | La app de evaluación muestra theming por CSS variables. | Documentar tokens y límites. |
| Manejo de errores | Pendiente | No hay estado vacío ni feedback para filtros vacíos. | Añadir empty state explícito. |
| Testing | Pendiente | No hay tests en `packages/angular`. | Añadir pruebas de forms, outputs y a11y. |
| Compatibilidad con producción | Pendiente | No hay release npm y el `dist/package.json` publicado sería inconsistente. | Resolver distribución antes de publicar. |

## Si REVIEW.md ya existía: seguimiento de pendientes anteriores

| Punto anterior | Estado actual | Evidencia | Comentario |
| --- | --- | --- | --- |
| Corregir import de `flag-icon-css` en docs Angular | Cumplido | `apps/docs/src/pages/docs/angular.astro:35-36` | La ruta de CSS ya está corregida. |
| Revisar distribución y simplificar `exports` | Pendiente | `packages/angular/dist/package.json:23-33` | El manifiesto generado sigue apuntando a rutas internas inválidas. |
| Documentar estrategia de assets Angular | Parcial | `apps/angular` sirve el CSS con éxito, pero `ng build` aún muestra warning de stylesheet no localizado | La solución práctica existe, pero no está documentada a nivel profesional. |
| Implementar búsqueda real | Pendiente | `packages/angular/package.json:4` y componente fuente | Sigue sin buscador real. |
| Completar accesibilidad por teclado | Pendiente | `packages/angular/src/countries-flags.component.ts:350-363` | `ArrowDown` no navega opciones. |
| Añadir tests de forms, outputs y packaging | Pendiente | Búsqueda de `*.spec.*` y `*.test.*` | No existe cobertura. |

## Hallazgos principales

### Críticos
- El package no está publicado en npm. `pnpm view @drobinetm/angular-countries-flags version`
  devolvió `404`, por lo que la instalación documentada falla fuera del monorepo.
- La promesa de selector `searchable` sigue sin existir. `packages/angular/package.json:4`
  lo describe como buscable, pero el componente no implementa búsqueda.
- El manifiesto generado en `packages/angular/dist/package.json:23-33` apunta a
  rutas `./dist/...` dentro del propio `dist`, y también exporta `./styles` hacia
  `./dist/styles.css`, archivo que no existe en el output generado.

### Importantes
- `ng-packagr` sigue emitiendo warnings de export conditions durante
  `pnpm build:angular`.
- La accesibilidad por teclado sigue siendo incompleta.
  `packages/angular/src/countries-flags.component.ts:350-363` sólo cubre
  abrir/cerrar con `Enter`, `Space` y `Escape`.
- No hay pruebas automatizadas para `ControlValueAccessor`, `valueChange` o
  compatibilidad con forms.
- `ng build` del consumidor emitió el warning
  `Unable to locate stylesheet: /assets/flag-icon-css/css/flag-icons.min.css`,
  aunque el archivo sí estuvo disponible al servir el build final.

### Menores
- `ngOnInit` y `ngOnChanges` siguen vacíos en
  `packages/angular/src/countries-flags.component.ts:318-320`.
- No existen README o changelog específicos del package Angular.

## Pruebas realizadas

| Caso probado | Resultado | Evidencia | Observaciones |
| --- | --- | --- | --- |
| Publicación npm | Fallo | `pnpm view @drobinetm/angular-countries-flags version` | No existe release pública. |
| Build del package Angular | Parcial | `pnpm build:angular` | Build exitoso con warnings de `ng-packagr` sobre `exports`. |
| TypeScript | OK | `pnpm -r typecheck` | Sin errores de tipado. |
| Build del consumidor Angular | Parcial | `pnpm -r build` | Compila, pero muestra warning de stylesheet. |
| Renderizado básico | OK | Snapshot y navegador en `http://127.0.0.1:4300` | La UI renderiza correctamente. |
| `[(ngModel)]` y selección | OK | Prueba manual en navegador | El valor pasó de `none` a `ad`. |
| `valueChange` | OK | Panel `LATEST EVENT` del demo | Se registró `Andorra (ad)`. |
| Carga de CSS de banderas en build servido | OK | Red en `http://127.0.0.1:4300` | `assets/flag-icon-css/css/flag-icons.min.css` respondió `304`. |
| Teclado básico | OK | Navegador en `http://127.0.0.1:4300` | Apertura y cierre básico operativos. |
| Teclado avanzado | Fallo | Prueba manual con `ArrowDown` | No hubo navegación interna. |

## Pruebas faltantes recomendadas
- Test unitario de `ControlValueAccessor`.
- Test de integración con `FormsModule` y `ReactiveFormsModule`.
- Test de `valueChange` con payload completo.
- Test de accesibilidad con navegación por teclado.
- Test de empaquetado/consumo externo desde una app Angular limpia fuera del monorepo.
- Test real del manifest publicado tras `ng-packagr`.

## Recomendaciones concretas
- Publicar el package correctamente o documentar que hoy sólo está pensado para
  uso local/workspace.
  Dónde: release process, README y docs Angular.
  Por qué importa: la instalación pública falla. Prioridad: Alta.
- Corregir el `dist/package.json` emitido por `ng-packagr`.
  Dónde: `packages/angular/package.json` y configuración de build.
  Por qué importa: el paquete publicado no debe apuntar a rutas `./dist/...`
  dentro de sí mismo. Prioridad: Alta.
- Eliminar la promesa de `searchable` o implementar búsqueda real.
  Dónde: `packages/angular/package.json`, docs y componente fuente.
  Por qué importa: hoy la API pública no coincide con el comportamiento.
  Prioridad: Alta.
- Completar accesibilidad del patrón `listbox`.
  Dónde: `packages/angular/src/countries-flags.component.ts`.
  Por qué importa: la navegación por teclado es insuficiente. Prioridad: Alta.
- Añadir tests de forms, outputs y packaging.
  Dónde: `packages/angular`.
  Por qué importa: no hay cobertura de regresión. Prioridad: Alta.

## Qué falta para ser headless y agnóstica del framework visual
Hoy la implementación Angular está todavía más lejos de un enfoque headless,
porque además de markup fijo incorpora estilos inline dentro del propio
componente. Para que sea realmente adaptable a CSS puro, Tailwind, Bootstrap,
Vuetify o cualquier design system, necesita lo siguiente.

- Extraer los estilos inline del componente y ofrecer un modo `unstyled` real.
- Separar la lógica de selección y formularios del render visual, idealmente con
  una capa base reutilizable y un wrapper visual opcional.
- Permitir plantillas configurables para trigger, opción, icono y empty state,
  por ejemplo mediante `ng-template` o una API equivalente.
- Exponer clases/atributos por subparte del componente en lugar de depender sólo
  de la estructura interna `.drm-cf__*`.
- Definir un contrato claro de estados visuales (`open`, `selected`, `focused`,
  `disabled`, `empty`) para que el consumidor pueda mapearlos a su design system.
- Añadir empty state configurable y no dejar la lista simplemente vacía.
- Documentar una estrategia oficial de integración con frameworks visuales,
  distinguiendo entre lógica del selector y apariencia del campo.
- Validar que el package puede consumirse sin su CSS por defecto y seguir siendo
  accesible y funcional dentro de un proyecto Angular externo.

## Conclusión
La librería Angular demuestra que el componente puede funcionar localmente, pero
el package todavía no es una librería Angular profesional y reutilizable. Debe
resolver publicación, manifiesto generado, exports, accesibilidad y testing antes
de considerarse apta para producción.
