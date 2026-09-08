import { Component, computed, inject, input } from '@angular/core';
import type { ClassValue } from 'clsx';
import { hlm } from '@wiloc/ui/core';

import type { WiCardSize } from './wi-card.types';

const CARD_BASE_CLASSES =
  'wi-card group/card flex flex-col rounded-control-lg border border-outline-variant bg-surface text-sm text-on-surface shadow-sm has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-[inherit] *:[img:last-child]:rounded-b-[inherit]';

const CARD_SIZE_CLASSES: Record<WiCardSize, string> = {
  md: 'gap-2 py-4',
  sm: 'gap-2 py-3',
  none: 'gap-0 py-0',
};

const HEADER_BASE_CLASSES =
  'wi-card__header @container/card-header grid auto-rows-min items-start gap-1 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]';

const HEADER_PAD_CLASSES: Record<WiCardSize, string> = {
  md: 'px-4',
  sm: 'px-3',
  none: '',
};

const CONTENT_BASE_CLASSES = 'wi-card__content';

const CONTENT_PAD_CLASSES: Record<WiCardSize, string> = {
  md: 'px-4',
  sm: 'px-3',
  none: '',
};

const FOOTER_BASE_CLASSES =
  'wi-card__footer flex items-center gap-2 rounded-b-[inherit] border-t border-outline-variant';

const FOOTER_PAD_CLASSES: Record<WiCardSize, string> = {
  md: 'p-4',
  sm: 'p-3',
  none: '',
};

function injectCardSize(): () => WiCardSize {
  const card = inject(WiCardComponent, { optional: true });
  return () => card?.size() ?? 'md';
}

/**
 * Contenedor de superficie (`wi-card`) para agrupar contenido (dashboards, formularios, etc.).
 *
 * Layout (`size`). El host aplica padding vertical y gap; el horizontal vive en header/content/footer:
 * - `size="md"` (default) → host `py-4` + `gap-2`; header/content `px-4`; footer `p-4`
 * - `size="sm"` → host `py-3` + `gap-2`; header/content `px-3`; footer `p-3`
 * - `size="none"` → flush: host `py-0` + `gap-0`; header/content/footer sin padding (lo pone la app)
 *
 * Las clases del atributo `class` se fusionan con las del host: las del consumidor ganan conflictos
 * de utilities (`p-0 gap-0`, `overflow-visible`, `flex` en el header) sin `!important`.
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
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class WiCardComponent {
  /** Densidad del layout: `sm` | `md` (default) | `none` (flush). */
  readonly size = input<WiCardSize>('md');

  /** Clases extra del host; se fusionan y ganan conflictos. Alias del atributo `class`. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- native `class` for twMerge
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly hostClasses = computed(() =>
    hlm(CARD_BASE_CLASSES, CARD_SIZE_CLASSES[this.size()], this.userClass()),
  );
}

@Component({
  selector: 'wi-card-header',
  host: {
    'data-slot': 'card-header',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class WiCardHeaderComponent {
  private readonly cardSize = injectCardSize();

  /** Clases extra del host; se fusionan y ganan conflictos. Alias del atributo `class`. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- native `class` for twMerge
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly hostClasses = computed(() =>
    hlm(HEADER_BASE_CLASSES, HEADER_PAD_CLASSES[this.cardSize()], this.userClass()),
  );
}

@Component({
  selector: 'wi-card-title',
  host: {
    'data-slot': 'card-title',
    class: 'wi-card__title text-sm leading-snug font-semibold',
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
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class WiCardContentComponent {
  private readonly cardSize = injectCardSize();

  /** Clases extra del host; se fusionan y ganan conflictos. Alias del atributo `class`. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- native `class` for twMerge
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly hostClasses = computed(() =>
    hlm(CONTENT_BASE_CLASSES, CONTENT_PAD_CLASSES[this.cardSize()], this.userClass()),
  );
}

@Component({
  selector: 'wi-card-footer',
  host: {
    'data-slot': 'card-footer',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class WiCardFooterComponent {
  private readonly cardSize = injectCardSize();

  /** Clases extra del host; se fusionan y ganan conflictos. Alias del atributo `class`. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- native `class` for twMerge
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly hostClasses = computed(() =>
    hlm(FOOTER_BASE_CLASSES, FOOTER_PAD_CLASSES[this.cardSize()], this.userClass()),
  );
}
