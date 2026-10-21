/**
 * Paleta cerrada de acentos de entidad.
 * El valor que se guarda es el id, no un color. Claro y oscuro viven en
 * `--wi-color-accent-*` (`:root` y `.wi-dark`).
 */
export const WI_ACCENTS = [
  'blue',
  'teal',
  'green',
  'amber',
  'orange',
  'red',
  'purple',
  'pink',
  'slate',
] as const;

/** Id de acento de la paleta. */
export type WiAccent = (typeof WI_ACCENTS)[number];

/** Tamaño de las muestras del selector. */
export type WiAccentPickerSize = 'sm' | 'md' | 'lg';

/**
 * Cómo se aplica el acento.
 * - `icon`: tiñe el icono (currentColor), sin fondo.
 * - `container`: fondo tintado y icono con contraste.
 * - `solid`: fondo del acento y contenido `on-accent`.
 */
export type WiAccentTone = 'icon' | 'container' | 'solid';

/** Nombres accesibles por acento. Los textos los pone la app. */
export type WiAccentLabels = Partial<Record<WiAccent, string>>;

/** `true` si `value` es un id de la paleta. */
export function isWiAccent(value: unknown): value is WiAccent {
  return typeof value === 'string' && (WI_ACCENTS as readonly string[]).includes(value);
}
