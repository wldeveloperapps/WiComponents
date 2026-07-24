import type { WiIconDefinition, WiIconRegistry, WiIconVariant } from './wi-icon.types';

/**
 * Combina varios registros.
 * Orden: el último gana por nombre; dentro de un nombre se hace merge de variantes.
 */
export function mergeIconRegistries(
  registries: readonly WiIconRegistry[] | null | undefined,
): WiIconRegistry {
  if (!registries?.length) {
    return {};
  }

  const merged: Record<string, WiIconDefinition> = {};

  for (const registry of registries) {
    for (const [name, definition] of Object.entries(registry)) {
      const existing = merged[name];
      merged[name] = existing
        ? {
            outline: definition.outline ?? existing.outline,
            solid: definition.solid ?? existing.solid,
          }
        : definition;
    }
  }

  return merged;
}

export interface WiResolvedIcon {
  readonly glyph: NonNullable<WiIconDefinition['outline']>;
  readonly usedVariant: WiIconVariant;
  readonly fellBack: boolean;
}

/**
 * Resuelve el glifo para una variante solicitada.
 * Fallback: variante pedida → la otra → `null`.
 */
export function resolveIconGlyph(
  definition: WiIconDefinition | undefined,
  variant: WiIconVariant,
): WiResolvedIcon | null {
  if (!definition) {
    return null;
  }

  const preferred = definition[variant];
  if (preferred) {
    return { glyph: preferred, usedVariant: variant, fellBack: false };
  }

  const fallbackVariant: WiIconVariant = variant === 'outline' ? 'solid' : 'outline';
  const fallback = definition[fallbackVariant];
  if (fallback) {
    return { glyph: fallback, usedVariant: fallbackVariant, fellBack: true };
  }

  return null;
}
