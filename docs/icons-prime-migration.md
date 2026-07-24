# Migración PrimeIcons → `@wiloc/ui/icon`

Referencia para la app consumidora. Los nombres públicos son estilo Heroicons
(kebab-case), no `pi-*`.

Catálogo visual en Storybook: **Icon → WiIcon → Catalog**.

## Sustitutos claros

| PrimeIcons                            | `wi-icon` `name`               |
| ------------------------------------- | ------------------------------ |
| `pi-angle-double-left`                | `chevron-double-left`          |
| `pi-angle-double-right`               | `chevron-double-right`         |
| `pi-angle-down` / `pi-chevron-down`   | `chevron-down`                 |
| `pi-angle-left` / `pi-chevron-left`   | `chevron-left`                 |
| `pi-angle-right` / `pi-chevron-right` | `chevron-right`                |
| `pi-angle-up` / `pi-chevron-up`       | `chevron-up`                   |
| `pi-arrow-circle-down`                | `arrow-down-circle`            |
| `pi-arrow-left`                       | `arrow-left`                   |
| `pi-arrow-right`                      | `arrow-right`                  |
| `pi-bars`                             | `bars-3`                       |
| `pi-bell`                             | `bell`                         |
| `pi-bell-slash`                       | `bell-slash`                   |
| `pi-box`                              | `archive-box` (alt. `cube`)    |
| `pi-calendar`                         | `calendar`                     |
| `pi-chart` / `pi-chart-bar`           | `chart-bar`                    |
| `pi-chart-pie`                        | `chart-pie`                    |
| `pi-check`                            | `check`                        |
| `pi-check-circle`                     | `check-circle`                 |
| `pi-clock`                            | `clock`                        |
| `pi-cloud`                            | `cloud`                        |
| `pi-cloud-download`                   | `cloud-arrow-down`             |
| `pi-cloud-upload`                     | `cloud-arrow-up`               |
| `pi-cog`                              | `cog-6-tooth`                  |
| `pi-download`                         | `arrow-down-tray`              |
| `pi-ellipsis-v`                       | `ellipsis-vertical`            |
| `pi-envelope`                         | `envelope`                     |
| `pi-exclamation-circle`               | `exclamation-circle`           |
| `pi-exclamation-triangle`             | `exclamation-triangle`         |
| `pi-eye`                              | `eye`                          |
| `pi-file`                             | `document`                     |
| `pi-filter`                           | `funnel`                       |
| `pi-flag-fill`                        | `flag` (`variant="solid"`)     |
| `pi-folder`                           | `folder`                       |
| `pi-home`                             | `home`                         |
| `pi-id-card`                          | `identification`               |
| `pi-inbox`                            | `inbox`                        |
| `pi-info-circle`                      | `information-circle`           |
| `pi-key`                              | `key`                          |
| `pi-list`                             | `list-bullet`                  |
| `pi-lock`                             | `lock-closed`                  |
| `pi-lock-open`                        | `lock-open`                    |
| `pi-map`                              | `map`                          |
| `pi-map-marker`                       | `map-pin`                      |
| `pi-megaphone`                        | `megaphone`                    |
| `pi-microchip`                        | `cpu-chip`                     |
| `pi-moon`                             | `moon`                         |
| `pi-objects-column`                   | `squares-2x2` / `table-cells`  |
| `pi-pause`                            | `pause`                        |
| `pi-pencil`                           | `pencil`                       |
| `pi-phone`                            | `phone`                        |
| `pi-play`                             | `play`                         |
| `pi-plus`                             | `plus`                         |
| `pi-plus-circle`                      | `plus-circle`                  |
| `pi-refresh`                          | `arrow-path`                   |
| `pi-search`                           | `magnifying-glass`             |
| `pi-send`                             | `paper-airplane`               |
| `pi-shield`                           | `shield-check`                 |
| `pi-sign-out`                         | `arrow-right-on-rectangle`     |
| `pi-sliders-h`                        | `adjustments-horizontal`       |
| `pi-sort` / `pi-sort-alt`             | `arrows-up-down`               |
| `pi-sort-down`                        | `bars-arrow-down`              |
| `pi-sort-up`                          | `bars-arrow-up`                |
| `pi-step-backward`                    | `backward`                     |
| `pi-step-forward`                     | `forward`                      |
| `pi-stop`                             | `stop`                         |
| `pi-sun`                              | `sun`                          |
| `pi-th-large`                         | `squares-2x2`                  |
| `pi-times`                            | `x-mark`                       |
| `pi-times-circle`                     | `x-circle`                     |
| `pi-trash`                            | `trash`                        |
| `pi-upload`                           | `arrow-up-tray`                |
| `pi-user`                             | `user`                         |
| `pi-user-plus`                        | `user-plus`                    |
| `pi-users`                            | `users`                        |
| `pi-volume-off`                       | `speaker-x-mark`               |
| `pi-volume-up`                        | `speaker-wave`                 |
| `pi-history`                          | `arrow-uturn-left` (o `clock`) |

## Sin sustituto claro (faltan)

Resolver en la **app** (custom `WiIconGlyph`) o con otro componente:

| PrimeIcons                                | Notas                                  |
| ----------------------------------------- | -------------------------------------- |
| `pi-file-excel`                           | Logo / asset de marca                  |
| `pi-filter-slash`                         | Composición o glyph custom             |
| `pi-save`                                 | No hay “floppy” en Heroicons → custom  |
| `pi-route`                                | Custom o aproximar con `map`           |
| `pi-spinner`                              | Usar spinner del DS, no icono estático |
| `pi-circle-fill`                          | Suele bastar CSS (`rounded-full`)      |
| `pi-calendar-clock`                       | Usar `calendar` o custom               |
| `pi-calendar-plus`                        | Usar `calendar` o custom               |
| `pi-check-square`                         | Preferir checkbox del DS               |
| `pi-sort-alpha-down` / `pi-sort-alpha-up` | Custom                                 |
| `pi-compass`                              | Aprox. `map` o custom                  |
| `pi-directions`                           | Aprox. `map` o custom                  |
| `pi-chart-line`                           | Aprox. `chart-bar` o custom            |
| `pi-stopwatch`                            | Aprox. `clock` o custom                |

## Uso en la app

```ts
import { provideWiIcons } from '@wiloc/ui/icon';
import { trashOutline, homeOutline } from '@wiloc/ui/icon/heroicons';

provideWiIcons({
  trash: { outline: trashOutline },
  home: { outline: homeOutline },
});
```

No registres todo el catálogo de golpe: importa solo lo que uses.
