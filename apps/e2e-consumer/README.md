# e2e-consumer

App Angular **separada** que consume `@wiloc/ui` desde el `.tgz` empaquetado (no desde el source del monorepo).

## Flujo desde la raíz del repo

```bash
pnpm pack:lib              # build + pack → dist/wiloc-ui-*.tgz
pnpm e2e-consumer:sync     # pack + pnpm add del .tgz aquí
pnpm e2e-consumer:build    # compila contra el paquete
pnpm e2e-consumer:serve    # http://localhost:4200
```

## Qué valida

- `exports` del paquete (button, forms, icon, styles)
- peers (`@angular/*`, `@angular/aria`, `@spartan-ng/brain`, …)
- tokens CSS + Tailwind + `.wi-dark`
- locale de app (`provideWiCalendarI18n` + textos ES/EN)
- smoke: button, input, checkbox, switch, select, listbox, datepicker, dialog, iconos

No publica a npm; solo comprueba el artefacto local.
