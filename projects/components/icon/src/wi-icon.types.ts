/**
 * Tipos públicos de `@wiloc/ui/icon`.
 * No exponen APIs de Heroicons.
 */

/** Variante visual del icono. */
export type WiIconVariant = 'outline' | 'solid';

/** Tamaño tipográfico del icono (clases Tailwind estáticas). */
export type WiIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Nombre de icono registrado.
 * Es `string` a propósito para permitir iconos personalizados de la app.
 */
export type WiIconName = string;

/** Etiquetas SVG permitidas al renderizar glyphs. */
export type WiSvgTag = 'path' | 'circle' | 'rect' | 'line' | 'polyline' | 'polygon' | 'g';

/**
 * Nodo SVG estructurado.
 * Solo se renderizan tags y atributos de la allowlist del componente.
 */
export interface WiSvgNode {
  readonly tag: WiSvgTag;
  readonly attrs: Readonly<Record<string, string>>;
  readonly children?: readonly WiSvgNode[];
}

/**
 * Representación tipada de un glifo SVG.
 * Preferible a strings HTML: sin innerHTML y compatible con SSR.
 */
export interface WiIconGlyph {
  readonly viewBox: string;
  readonly nodes: readonly WiSvgNode[];
  /**
   * Si es `true`, no se aplican defaults de `currentColor`
   * (útil para logos multicolor).
   */
  readonly preserveColors?: boolean;
}

/** Definición de un icono con una o ambas variantes. */
export interface WiIconDefinition {
  readonly outline?: WiIconGlyph;
  readonly solid?: WiIconGlyph;
}

/** Mapa nombre → definición para `provideWiIcons`. */
export type WiIconRegistry = Readonly<Record<string, WiIconDefinition>>;
