import { computed, Directive, input } from '@angular/core';

import { wiAccentPaint } from './wi-accent.paint';
import type { WiAccent, WiAccentTone } from './wi-accent.types';

/**
 * Aplica un acento de la paleta al host (icono o pastilla).
 *
 * El color sale de `--wi-color-accent-*`. Con `.wi-dark` cambia solo.
 * `null` o un id desconocido no pintan color.
 */
@Directive({
  selector: '[wiAccent]',
  host: {
    class: 'wi-accent',
    '[attr.data-wi-accent]': 'resolvedAccent()',
    '[attr.data-wi-accent-tone]': 'tone()',
    '[style.color]': 'paint().color',
    '[style.background-color]': 'paint().background',
  },
})
export class WiAccentDirective {
  /** Id de la paleta. `null` deja el color del contexto. */
  readonly accent = input<WiAccent | null>(null, { alias: 'wiAccent' });

  /** `icon` tiñe el glifo; `container` y `solid` añaden fondo. */
  readonly tone = input<WiAccentTone>('icon', { alias: 'wiAccentTone' });

  protected readonly resolvedAccent = computed(() => this.accent());

  protected readonly paint = computed(() => wiAccentPaint(this.accent(), this.tone()));
}
