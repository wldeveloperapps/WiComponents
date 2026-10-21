import { isWiAccent, type WiAccent, type WiAccentTone } from './wi-accent.types';

export interface WiAccentPaint {
  readonly color: string | null;
  readonly background: string | null;
}

const EMPTY_PAINT: WiAccentPaint = { color: null, background: null };

function accentVar(accent: WiAccent): string {
  return `var(--wi-color-accent-${accent})`;
}

function onAccentVar(accent: WiAccent): string {
  return `var(--wi-color-on-accent-${accent})`;
}

function accentContainerVar(accent: WiAccent): string {
  return `var(--wi-color-accent-${accent}-container)`;
}

function onAccentContainerVar(accent: WiAccent): string {
  return `var(--wi-color-on-accent-${accent}-container)`;
}

/**
 * Referencias a tokens del acento. El valor real cambia con `.wi-dark`.
 * No es una clase Tailwind: el id sale de una unión cerrada.
 */
export function wiAccentPaint(accent: unknown, tone: WiAccentTone): WiAccentPaint {
  if (!isWiAccent(accent)) {
    return EMPTY_PAINT;
  }

  switch (tone) {
    case 'container':
      return {
        color: onAccentContainerVar(accent),
        background: accentContainerVar(accent),
      };
    case 'solid':
      return {
        color: onAccentVar(accent),
        background: accentVar(accent),
      };
    case 'icon':
      return {
        color: accentVar(accent),
        background: null,
      };
  }
}

/** Color de la muestra del selector (el acento, no el contenedor). */
export function wiAccentSwatchBackground(accent: WiAccent): string {
  return accentVar(accent);
}
