import { booleanAttribute, Component, computed, input } from '@angular/core';

import type { WiSkeletonShape } from './wi-skeleton.types';

/**
 * Placeholder de carga (`wi-skeleton`) mientras llega el contenido real.
 *
 * - Formas: `rectangle` (default) | `circle`.
 * - Dimensiones vía `size` (cuadrado/círculo) o `width` / `height` (CSS length).
 * - Animación pulse respetando `prefers-reduced-motion` (`motion-safe:`).
 * - Presentacional: `aria-hidden="true"`; el contenedor padre puede usar `aria-busy`.
 *
 * ```html
 * <wi-skeleton />
 * <wi-skeleton shape="circle" size="2.5rem" />
 * <wi-skeleton width="10rem" height="4rem" />
 * <wi-skeleton [animated]="false" />
 * ```
 */
@Component({
  selector: 'wi-skeleton',
  host: {
    'data-slot': 'skeleton',
    '[attr.data-shape]': 'shape()',
    '[attr.data-animated]': 'animated()',
    'aria-hidden': 'true',
    class:
      'wi-skeleton block shrink-0 bg-surface-variant data-[shape=rectangle]:rounded-control data-[shape=circle]:rounded-full motion-safe:data-[animated=true]:animate-pulse',
    '[style.width]': 'resolvedWidth()',
    '[style.height]': 'resolvedHeight()',
  },
  template: '',
})
export class WiSkeletonComponent {
  /** Forma del placeholder. */
  readonly shape = input<WiSkeletonShape>('rectangle');

  /**
   * Lado del cuadrado/círculo (CSS length). Si se define, fija `width` y `height`.
   */
  readonly size = input<string | undefined>(undefined);

  /** Ancho (CSS length). Default rectangle: `100%`. */
  readonly width = input<string | undefined>(undefined);

  /** Alto (CSS length). Default rectangle: `1rem`. */
  readonly height = input<string | undefined>(undefined);

  /** Pulse animation (desactivable; respeta reduced-motion vía `motion-safe:`). */
  readonly animated = input(true, { transform: booleanAttribute });

  protected readonly resolvedWidth = computed(() => {
    const size = this.size();
    if (size) {
      return size;
    }

    const width = this.width();
    if (width) {
      return width;
    }

    if (this.shape() === 'circle') {
      return this.height() ?? '2.5rem';
    }

    return '100%';
  });

  protected readonly resolvedHeight = computed(() => {
    const size = this.size();
    if (size) {
      return size;
    }

    const height = this.height();
    if (height) {
      return height;
    }

    if (this.shape() === 'circle') {
      return this.width() ?? '2.5rem';
    }

    return '1rem';
  });
}
