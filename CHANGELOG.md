# Changelog

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
