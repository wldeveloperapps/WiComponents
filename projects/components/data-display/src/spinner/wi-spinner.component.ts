import { Component, computed, input } from '@angular/core';

import type { WiSpinnerSize } from './wi-spinner.types';

const SIZE_CLASSES: Record<WiSpinnerSize, string> = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-6',
};

/**
 * Indicador de carga indeterminado (`wi-spinner`).
 *
 * - Tamaños: `sm` | `md` (default) | `lg`.
 * - Color vía `currentColor` (hereda del padre; p. ej. `text-primary`).
 * - Animación spin con `motion-safe:` (respeta `prefers-reduced-motion`).
 * - A11y: `role="status"` + `aria-label` (override con `ariaLabel` / `aria-label`).
 *
 * ```html
 * <wi-spinner />
 * <wi-spinner size="lg" ariaLabel="Cargando datos" />
 * <span class="text-primary"><wi-spinner /></span>
 * ```
 */
@Component({
  selector: 'wi-spinner',
  host: {
    'data-slot': 'spinner',
    '[attr.data-size]': 'size()',
    role: 'status',
    '[attr.aria-label]': 'ariaLabel()',
    class: 'wi-spinner inline-flex shrink-0 items-center justify-center text-current',
  },
  template: `
    <svg [class]="svgClasses()" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  `,
})
export class WiSpinnerComponent {
  /** Tamaño del indicador. */
  readonly size = input<WiSpinnerSize>('md');

  /**
   * Nombre accesible anunciado por lectores de pantalla.
   * La app puede localizarlo (p. ej. vía i18n).
   */
  readonly ariaLabel = input('Cargando', { alias: 'aria-label' });

  protected readonly svgClasses = computed(
    () => `${SIZE_CLASSES[this.size()]} motion-safe:animate-spin`,
  );
}
