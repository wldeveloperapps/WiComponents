/**
 * Paletas de producto en Storybook (simulan apps consumidoras).
 * No es API de @wiloc/ui: cada app pisa `--wi-color-*` en su CSS global.
 *
 * Para añadir una paleta:
 * 1. Crear `.storybook/palettes/<id>.css` (ver iiot.css).
 * 2. Importarla en `preview.ts`.
 * 3. Añadir la entrada aquí.
 */
export const STORYBOOK_PALETTE_ATTR = 'data-wi-palette' as const;

export const STORYBOOK_PALETTES = [{ id: 'iiot', title: 'IIOT', right: 'Wiloc' }] as const;

export type StorybookPaletteId = (typeof STORYBOOK_PALETTES)[number]['id'];

export function isStorybookPaletteId(value: string): value is StorybookPaletteId {
  return STORYBOOK_PALETTES.some((palette) => palette.id === value);
}

export function applyStorybookPalette(id: string): StorybookPaletteId {
  const resolved = isStorybookPaletteId(id) ? id : STORYBOOK_PALETTES[0].id;
  document.documentElement.setAttribute(STORYBOOK_PALETTE_ATTR, resolved);
  return resolved;
}
