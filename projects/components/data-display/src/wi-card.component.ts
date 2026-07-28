import { Component, input } from '@angular/core';

import type { WiCardSize } from './wi-card.types';

/**
 * Contenedor de superficie (`wi-card`) para agrupar contenido (dashboards, formularios, etc.).
 *
 * Espaciado denso (paneles tipo dashboard):
 * - `size="md"` → padding 1rem (`p-4` / `px-4`)
 * - `size="sm"` → padding 0.75rem (`p-3` / `px-3`)
 * - Gap entre secciones: 0.5rem (`gap-2`), independiente del padding
 *
 * Composición:
 * ```html
 * <wi-card>
 *   <wi-card-header>
 *     <wi-card-title>Título</wi-card-title>
 *     <wi-card-description>Descripción</wi-card-description>
 *     <wi-card-action>…</wi-card-action>
 *   </wi-card-header>
 *   <wi-card-content>…</wi-card-content>
 *   <wi-card-footer>…</wi-card-footer>
 * </wi-card>
 * ```
 */
@Component({
  selector: 'wi-card',
  host: {
    'data-slot': 'card',
    '[attr.data-size]': 'size()',
    class:
      'wi-card group/card flex flex-col gap-2 overflow-hidden rounded-control-lg border border-outline-variant bg-surface py-4 text-sm text-on-surface shadow-sm data-[size=sm]:py-3 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-[inherit] *:[img:last-child]:rounded-b-[inherit]',
  },
  template: `<ng-content />`,
})
export class WiCardComponent {
  /** Densidad del padding interno: `sm` (0.75rem) | `md` (1rem). */
  readonly size = input<WiCardSize>('md');
}

@Component({
  selector: 'wi-card-header',
  host: {
    'data-slot': 'card-header',
    class:
      'wi-card__header @container/card-header grid auto-rows-min items-start gap-1 px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
  },
  template: `<ng-content />`,
})
export class WiCardHeaderComponent {}

@Component({
  selector: 'wi-card-title',
  host: {
    'data-slot': 'card-title',
    class: 'wi-card__title text-sm leading-snug font-semibold text-on-surface',
  },
  template: `<ng-content />`,
})
export class WiCardTitleComponent {}

@Component({
  selector: 'wi-card-description',
  host: {
    'data-slot': 'card-description',
    class: 'wi-card__description text-xs text-on-surface-variant',
  },
  template: `<ng-content />`,
})
export class WiCardDescriptionComponent {}

@Component({
  selector: 'wi-card-action',
  host: {
    'data-slot': 'card-action',
    class: 'wi-card__action col-start-2 row-span-2 row-start-1 self-start justify-self-end',
  },
  template: `<ng-content />`,
})
export class WiCardActionComponent {}

@Component({
  selector: 'wi-card-content',
  host: {
    'data-slot': 'card-content',
    class: 'wi-card__content px-4 group-data-[size=sm]/card:px-3',
  },
  template: `<ng-content />`,
})
export class WiCardContentComponent {}

@Component({
  selector: 'wi-card-footer',
  host: {
    'data-slot': 'card-footer',
    class:
      'wi-card__footer flex items-center gap-2 rounded-b-[inherit] border-t border-outline-variant p-4 group-data-[size=sm]/card:p-3',
  },
  template: `<ng-content />`,
})
export class WiCardFooterComponent {}
