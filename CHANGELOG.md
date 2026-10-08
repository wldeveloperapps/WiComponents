# Changelog

## 1.0.1

### Fixed

- `wi-select`: `aria-invalid` del trigger sigue el estado de validación del control (touched o submit). Un required sin tocar ya no se anuncia como inválido.

## 1.0.0

Primera versión estable de `@wldeveloperapps/ui` y `@wldeveloperapps/ui-mcp`. La API pública queda cubierta por Semantic Versioning.

### Changed

- Promoción del corte `0.1.0-alpha.7` a estable. No cambia ningún selector, input, output, tipo ni entry point respecto a ese alpha.
- Catálogo MCP: los componentes publicados pasan de `experimental` a `stable`.

### Known limitations

- Sin Form Field; labels y errores los arma la app
- `wi_audit` no está implementado
- Iconos: subconjunto Heroicons (ver `docs/icons-prime-migration.md`)

## 0.1.0-alpha.7

Séptimo corte interno de `@wldeveloperapps/ui` y `@wldeveloperapps/ui-mcp`. API experimental: puede cambiar en el siguiente alpha.

### Added

- `wi-input` con `type="password"`: botón revelar/ocultar (`passwordToggle`, activo por defecto) y etiquetas accesibles. No hay componente password aparte. Glifos `eye` y `eye-slash` en `@wldeveloperapps/ui/icon/heroicons`
- `wi-icon`: input `src` para un SVG de la app (ruta o URL `http(s)`) sin registrarlo en `provideWiIcons`. Hace falta `provideHttpClient()`. `preserveColors` mantiene los colores del fichero
- Catálogo MCP: cada entrada documenta `limits` y `requires`

### Changed

- Contrato de z-index en página: header y migas `10`, overlay anclado `1000`, sidebar `1100`. El panel queda encima del header y debajo del sidebar. Si el trigger está dentro de un diálogo, confirm modal o toast, el panel entra en el top-layer y se pinta encima de ese modal
- Overlays transitorios (`wi-select`, `wi-menu`, `[wiTooltip]`, filtros de `wi-table`, `wi-speed-dial`) **cierran** al hacer scroll fuera del panel. `wi-datepicker`, `wi-date-range`, `wi-popover` y `wi-confirm-popup` siguen reposicionando
- `button[wiButton]` / `a[wiButton]` con `iconOnly` y `loading`: el spinner sustituye al icono

## 0.1.0-alpha.6

Sexto corte interno de `@wldeveloperapps/ui` y `@wldeveloperapps/ui-mcp`. API experimental: puede cambiar en el siguiente alpha.

### Breaking

- Viewport de toasts: selector `wi-toaster` → `wi-toast`; `WiToasterComponent` → `WiToastComponent`. En el root: `<wi-toast />`

### Added

- `WiConfirmationService`: bus único para `wi-confirm-dialog` (modal) y `wi-confirm-popup` (anclado) con `key` / `target`
- Overlays anclados siguen al trigger en scroll anidado (`overflow: auto` interno); contrato de z-index `1000` (panel) / `1100` (chrome de app); `styles/overlay.css`; docs **Z-index**; story Nested scroll; e2e Playwright
- Filtros de `wi-table`: `wi-input` y `wi-select` (mismo chrome que forms)

### Fixed

- Padding de alineación de texto en `wi-datepicker` / `wi-date-range`

## 0.1.0-alpha.5

Quinto corte interno de `@wldeveloperapps/ui` y `@wldeveloperapps/ui-mcp`. API experimental: puede cambiar en el siguiente alpha.

### Fixed

- `wi-date-range`: al modificar un rango ya relleno, el panel ya no se cierra al elegir el inicio; el fin se puede completar en la misma apertura

## 0.1.0-alpha.4

Cuarto corte interno de `@wldeveloperapps/ui` y `@wldeveloperapps/ui-mcp`. API experimental: puede cambiar en el siguiente alpha.

### Breaking

- `wi-date-range`: un único input con calendario de rango (ya no dos `wi-datepicker`). Eliminados inputs/outputs duplicados (`startPlaceholder` / `endPlaceholder` / `startTouch` / `endTouch` / …). API alineada al datepicker: `placeholder`, `ariaLabel`, `calendarLabel`, `invalid`, `touch`, `startTimeLabel` / `endTimeLabel`.

### Added

- `displayFormat` en `wi-datepicker` y `wi-date-range` (tokens `YYYY` `YY` `MM` `DD` `HH` `mm`); `formatDate` sigue teniendo prioridad
- Helpers `formatWiDate` / `formatWiDateRange`
- `provideWiTimeZone` / `injectWiTimeZoneId` (TZ IANA del site; no muta el Date naive)
- Stories Forms/WiDateRange (Selected, DisplayFormats, WithTime, SiteTimeZone, …)
- MCP: entrada de catálogo `date-range` (`wi_view` / `wi_usage` / `wi_search`)

## 0.1.0-alpha.3

Tercer corte interno de `@wldeveloperapps/ui` y `@wldeveloperapps/ui-mcp`. API experimental.

### Changed

- README del paquete publicado (instalación GitHub Packages, no placeholder de ng-packagr)
- Stories de picklist con prefijo `wi-`
- Tests de la librería resuelven entry points en CI
- Estilos y documentación de `WiCard`

## 0.1.0-alpha.2

Segundo corte interno de `@wldeveloperapps/ui` y `@wldeveloperapps/ui-mcp`. API experimental.

### Added

- CI en GitHub Actions (`lint`, tests, build) y publicación a GitHub Packages (`pnpm publish:github`)

### Changed

- Tarball de `pnpm pack` alineado con el nombre del paquete (`wldeveloperapps-ui-{version}.tgz`)
- `apps/e2e-consumer` consume el `.tgz` con ruta relativa (`file:../../dist/…`)
- `cursor-pointer` en button, datepicker y select

## 0.1.0-alpha.1

Primera entrega interna de `@wldeveloperapps/ui` y `@wldeveloperapps/ui-mcp`. API experimental: puede cambiar en el siguiente alpha.

### Added

- Entry points: `@wldeveloperapps/ui/core`, `/button`, `/forms`, `/data-display`, `/navigation`, `/overlays`, `/icon`, `/icon/heroicons`
- Componentes y patterns: button, input, otp, checkbox, switch, select (single/multi), listbox, picklist, datepicker/range, file-upload, table, card, chip, skeleton, spinner, tabs, stepper, breadcrumb, dialog, toast, confirm dialog/popup, menu, popover, tooltip, speed-dial, icon
- Tokens `--wi-color-*` y tema `.wi-dark` (`WI_DARK_CLASS`)
- Servidor MCP `@wldeveloperapps/ui-mcp`: `wi_list`, `wi_search`, `wi_view`, `wi_usage`, `wi_docs`
- Empaquetado APF + smoke `apps/e2e-consumer`

### Known limitations

- Sin Form Field; labels y errores los arma la app
- `wi_audit` no está implementado
- Iconos: subconjunto Heroicons (ver `docs/icons-prime-migration.md`)
- Sin CI ni publicación npm; entregar el `.tgz` o path local
