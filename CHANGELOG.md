# Changelog

## 0.1.0-alpha.1

Primera entrega interna de `@wiloc/ui` y `@wiloc/ui-mcp`. API experimental: puede cambiar en el siguiente alpha.

### Added

- Entry points: `@wiloc/ui/core`, `/button`, `/forms`, `/data-display`, `/navigation`, `/overlays`, `/icon`, `/icon/heroicons`
- Componentes y patterns: button, input, otp, checkbox, switch, select (single/multi), listbox, picklist, datepicker/range, file-upload, table, card, chip, skeleton, spinner, tabs, stepper, dialog, toast, confirm dialog/popup, menu, popover, tooltip, speed-dial, icon
- Tokens `--wi-color-*` y tema `.wi-dark` (`WI_DARK_CLASS`)
- Servidor MCP `@wiloc/ui-mcp`: `wi_list`, `wi_search`, `wi_view`, `wi_usage`, `wi_docs`
- Empaquetado APF + smoke `apps/e2e-consumer`

### Known limitations

- Sin Form Field; labels y errores los arma la app
- `wi_audit` no está implementado
- Iconos: subconjunto Heroicons (ver `docs/icons-prime-migration.md`)
- Sin CI ni publicación npm; entregar el `.tgz` o path local
