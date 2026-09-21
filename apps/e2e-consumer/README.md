# e2e-consumer

App Angular **separada** que consume `@wldeveloperapps/ui` desde el `.tgz` empaquetado (no desde el source del monorepo).

## Flujo desde la raíz del repo

```bash
pnpm pack:lib              # build + pack → dist/wldeveloperapps-ui-*.tgz
pnpm e2e-consumer:sync     # pack + pnpm add del .tgz aquí
pnpm e2e-consumer:build    # compila contra el paquete
pnpm e2e-consumer:serve    # http://localhost:4200
pnpm e2e-consumer:e2e      # Playwright: overlay anclado en overflow interno
```

## Qué valida

- `exports` del paquete (button, forms, icon, navigation, overlays, data-display, styles)
- peers (`@angular/*`, `@angular/aria`, `@spartan-ng/brain`, …)
- tokens CSS + Tailwind + `.wi-dark`
- locale de app (`provideWiCalendarI18n` + textos ES/EN)
- smoke: button, input, checkbox, switch, select, listbox, datepicker, date-range, dialog, tabs, breadcrumb, table, iconos
- `provideWiTimeZone` + `displayFormat` en datepicker/range
- overlays anclados dentro de `overflow: auto` (select, datepicker, menú, filtro de tabla)

## Playwright

Tras sincronizar el `.tgz`:

```bash
pnpm e2e-consumer:e2e
```

Arranca `ng serve` y comprueba que el panel sigue al trigger al hacer scroll **dentro** del recuadro de 300px. La primera vez descarga Chromium (`playwright install chromium`).

No publica a npm; solo comprueba el artefacto local.
