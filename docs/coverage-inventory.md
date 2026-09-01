# Inventario de cobertura `@wiloc/ui`

Checklist de **demanda** extraído del uso real de PrimeNG en la app consumidora.

- No es un plan de wrappers 1:1.
- Los nombres objetivo son capacidades / componentes **Wi**, no selectores `p-*`.
- Actualizar la columna **Estado** al implementar o descartar.

**Estados:** `planned` | `in-progress` | `done` | `pattern` | `app-only` | `out-of-scope`

**Cubos:**

| Cubo         | Significado                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| base         | Componente / API pública del design system                                                                   |
| pattern      | Composición reutilizable (vive en el dominio adecuado, p. ej. `overlays`; no hay entry `@wiloc/ui/patterns`) |
| app-only     | Queda en la app (adapter, feature o migración)                                                               |
| out-of-scope | No se replica (acoplamiento Prime / no aporta)                                                               |

---

## Forms

| Capacidad Wi (objetivo) | Origen Prime (referencia) | Dominio  | Cubo    | Estado  | Notas                                                                                                                                                                |
| ----------------------- | ------------------------- | -------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                  | `button`                  | `button` | base    | done    | `@wiloc/ui/button` (`wi-button`); variant/size/loading/iconOnly                                                                                                      |
| Text input              | `inputtext`               | `forms`  | base    | done    | `@wiloc/ui/forms` (`wi-input`); CVA + FormValueControl; size/type/invalid                                                                                            |
| Password                | `password`                | `forms`  | base    | planned | login / cambio contraseña                                                                                                                                            |
| Checkbox                | `checkbox`                | `forms`  | base    | done    | `@wiloc/ui/forms` (`wi-checkbox`); CVA + FormValueControl; size/indeterminate/invalid                                                                                |
| Select                  | `select`                  | `forms`  | base    | done    | `@wiloc/ui/forms` (`wi-select`); single+multi vía `multiple`; overlays, clear, templates item/selected; sin filtro                                                   |
| MultiSelect             | `multiselect`             | `forms`  | base    | done    | multi + chips removibles vía `wi-select[multiple]`; queda filtro multi-opción                                                                                        |
| DatePicker              | `datepicker`              | `forms`  | base    | done    | `@wiloc/ui/forms` (`wi-datepicker` + `wi-date-range`); helpers civil/zoned (`toLocalDateString`, `datepickerValueToUtcIso`); docs `docs/datepicker-international.md` |
| Float label / Field     | `floatlabel`              | `forms`  | base    | planned | preferir field compuesto frente a API Prime                                                                                                                          |
| Input group             | `inputgroup` + addon      | `forms`  | base    | planned | composición, no entry point por addon                                                                                                                                |
| Input with icon         | `iconfield` + `inputicon` | `forms`  | base    | planned | composición con icon registry                                                                                                                                        |
| Input OTP               | `inputotp`                | `forms`  | base    | done    | `@wiloc/ui/forms` (`wi-otp`); CVA + FormValueControl; length (default 6); size; numeric/text/tel; `completed`                                                        |
| Slider                  | `slider`                  | `forms`  | base    | planned | heatmap                                                                                                                                                              |
| Toggle switch           | `toggleswitch`            | `forms`  | base    | done    | `@wiloc/ui/forms` (`wi-switch`); CVA + FormValueControl; size/invalid                                                                                                |
| Listbox                 | `listbox`                 | `forms`  | base    | done    | `@wiloc/ui/forms` (`wi-listbox`); CVA + FormValueControl; single/multiple; `@angular/aria` listbox. Virtual scroll → futuro                                          |
| Pick list               | `picklist`                | `forms`  | pattern | done    | `@wiloc/ui/forms` (`wi-picklist`); dos listbox + transfer; `options` + `value` (asignados); labels i18n vía inputs; sin filtro/DnD/reorder                           |
| File upload             | `fileupload`              | `forms`  | pattern | done    | `@wiloc/ui/forms` (`wi-file-upload`); choose + filename + upload; `accept` + `maxFileSize` + `reject`; sin HTTP (app); labels i18n vía inputs                        |

## Data display & layout

| Capacidad Wi (objetivo) | Origen Prime (referencia) | Dominio                     | Cubo     | Estado   | Notas                                                                                                                                                                                                                            |
| ----------------------- | ------------------------- | --------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Table                   | `table`                   | `data-display`              | base     | done     | `@wiloc/ui/data-display` (`wi-table`): sort, filtros+operadores, page, column visibility, row actions, toolbar slots; `WiColumnDef.priority` collapse → panel por fila bajo 960px (sin scroll lateral); `compact` override. Reorder columnas → futuro |
| Card                    | `card`                    | `data-display`              | base     | done     | `@wiloc/ui/data-display` (`wi-card` + parts); padding denso `sm` 0.75rem / `md` 1rem; gap secciones 0.5rem                                                                                                                       |
| Chip / Tag              | `chip` / `tag`            | `data-display`              | base     | done     | `@wiloc/ui/data-display` (`wi-chip`); tags `sm` + selección `clickable`/`selected`; removable; proyección de icono                                                                                                                                 |
| Skeleton                | `skeleton`                | `data-display`              | base     | done     | `@wiloc/ui/data-display` (`wi-skeleton`); shape rectangle/circle; size/width/height; animated + motion-safe pulse; aria-hidden                                                                                                   |
| Spinner                 | `progressspinner`         | `data-display`              | base     | done     | `@wiloc/ui/data-display` (`wi-spinner`); size sm/md/lg; currentColor; motion-safe spin; role=status + aria-label                                                                                                                 |
| Image                   | `image`                   | —                           | app-only | app-only | valorar si hace falta wrapper; suele bastar `<img>` / asset app                                                                                                                                                                  |
| Virtual scroller        | `scroller`                | `data-display` / `patterns` | base     | planned  | listas grandes (alertas / histórico)                                                                                                                                                                                             |

## Navigation

| Capacidad Wi (objetivo) | Origen Prime (referencia) | Dominio         | Cubo    | Estado  | Notas                                                                                                                                                      |
| ----------------------- | ------------------------- | --------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs                    | `tabs`                    | `navigation`    | base    | done    | `@wiloc/ui/navigation` (`wi-tabs` + list/trigger/content); `segmented`/`line`; scroll+scrollbar+container queries en `wi-tabs.css`                         |
| Stepper                 | `stepper`                 | `navigation`    | pattern | done    | `@wiloc/ui/navigation` (`wi-stepper` + `[wiStepperPanel]`); `steps` data-driven (label+icon de la app); vertical/horizontal; `linear`; Back/Next en la app |
| Breadcrumb              | `breadcrumb`              | `navigation`    | base    | done    | `@wiloc/ui/navigation` (`wi-breadcrumb`); `items` data-driven (label+href+icon de la app); último ítem pastilla `aria-current=page`; `itemClick` para Router |
| Divider                 | `divider`                 | `core` / layout | base    | planned |                                                                                                                                                            |

## Overlays & feedback

| Capacidad Wi (objetivo) | Origen Prime (referencia)        | Dominio    | Cubo | Estado  | Notas                                                                                                                                                           |
| ----------------------- | -------------------------------- | ---------- | ---- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dialog                  | `dialog`                         | `overlays` | base | done    | composición header/content/footer (`@wiloc/ui/overlays`)                                                                                                        |
| Toast service           | `toast` + `MessageService`       | `overlays` | base | done    | `@wiloc/ui/overlays` (`wi-toaster`→body, `wiToast`/`WiToast`; i18n producto vía API, chrome vía `provideWiOverlaysI18n`: `toastCloseLabel`, `toastRegionLabel`) |
| Confirm dialog/popup    | `confirmdialog` / `confirmpopup` | `overlays` | base | done    | `@wiloc/ui/overlays` (`wi-confirm-dialog` modal + `wi-confirm-popup` anclado); API compacta title/description/confirmLabel; `role=alertdialog`                  |
| Menu                    | `menu`                           | `overlays` | base | done    | `@wiloc/ui/overlays` (`wi-menu` + `[wiMenuTrigger]` / item / radio); story Asset Types                                                                          |
| Context menu            | `contextmenu`                    | `overlays` | base | planned | p. ej. asset-table                                                                                                                                              |
| Popover                 | `popover`                        | `overlays` | base | done    | `@wiloc/ui/overlays` (`wi-popover` + trigger/portal/content/header); anclado, sin backdrop. Menú de acciones → `wi-menu`                                        |
| Tooltip                 | `tooltip`                        | `overlays` | base | done    | `@wiloc/ui/overlays` (`[wiTooltip]`); host con caja CSS; `wi-button` es `inline-flex` (compatible); ver story HostMustHaveBox                                   |
| Speed dial              | `speeddial`                      | `overlays` | base | done    | `@wiloc/ui/overlays` (`wi-speed-dial`); items data-driven; tooltips; direction; closeOnSelect; Escape + clic fuera                                              |

## Infraestructura (no clonar)

| Capacidad / tema      | Origen Prime (referencia)            | Cubo         | Estado       | Notas                                                                                      |
| --------------------- | ------------------------------------ | ------------ | ------------ | ------------------------------------------------------------------------------------------ |
| Tokens + dark mode    | `providePrimeNG`, Aura, `data-theme` | base         | in-progress  | Tokens `--wi-color-*` + `@wiloc/ui/core`; app aplica `class="wi-dark"`; Storybook toolbar  |
| PassThrough `[pt]`    | PrimeNG PT                           | out-of-scope | out-of-scope | Sustituir por composición + variantes + tokens                                             |
| Ripple                | `ripple`                             | out-of-scope | out-of-scope | No requerido en el design system                                                           |
| Tipos/servicios Prime | `api` (`MenuItem`, etc.)             | out-of-scope | out-of-scope | Tipos Wi propios; adapters solo en la app si hace falta                                    |
| Tailwind Prime plugin | `tailwindcss-primeui`                | out-of-scope | out-of-scope | La lib no depende de clases `.p-*`                                                         |
| PrimeIcons            | `primeicons`                         | base         | in-progress  | MVP + catálogo Heroicons (~79); mapa en `docs/icons-prime-migration.md`; Storybook Catalog |

---

## Requisitos transversales (siempre)

- Overlays: portal a body, focus trap, escape, dismiss, z-index; compatible con layouts con scroll/transform.
- Forms: Reactive Forms / CVA cuando el control lo sea; labels y errores accesibles.
- i18n: textos desde la app (p. ej. Transloco); la librería no hardcodea copy.
- A11y: teclado y nombre accesible en cada control interactivo.
- Rendimiento: virtual scroll y table lazy solo donde el inventario lo exige.
- Empaquetado: secondary entry points por dominio; tree-shakeable.
- Migración app: incremental; adapters en la **app**, no API Prime-like en la librería.

---

## Fases de construcción

1. **Foundation** — tokens, button, input, card, tooltip, spinner/skeleton
2. **Feedback** — toast + confirm
3. **Overlays** — dialog, menu, popover
4. **Forms alto impacto** — select, checkbox, datepicker
5. **Table** — MVP → filters / column reorder
6. **Especializados** — tabs, stepper, picklist, file upload, scroller, context menu, resto forms

---

## Cómo mantener este documento

1. Al cerrar un componente público: poner `done` y alinear nombre con selector/`@wiloc/ui/...`.
2. Si algo no entra en la librería: `app-only` o `out-of-scope` con motivo breve.
3. No añadir filas “por si acaso”; solo demanda real o decisión explícita de producto.
4. La rule `.cursor/rules/coverage-inventory.mdc` debe seguir apuntando aquí.
