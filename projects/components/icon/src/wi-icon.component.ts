import { Component, computed, inject, input, isDevMode } from '@angular/core';

import { mergeIconRegistries, resolveIconGlyph } from './wi-icon.registry';
import { WI_ICONS } from './wi-icon.tokens';
import type { WiIconSize, WiIconVariant, WiSvgNode } from './wi-icon.types';

/** Clases Tailwind estáticas (cuando el consumidor las incluye en el CSS). */
const ICON_SIZE_CLASSES: Record<WiIconSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
};

/** Tamaño intrínseco del SVG (visible aunque no haya Tailwind cargado). */
const ICON_SIZE_PX: Record<WiIconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const warnedMissing = new Set<string>();
const warnedFallback = new Set<string>();

/**
 * Icono tipográfico (`wi-icon`).
 *
 * - Color: `currentColor` (p. ej. `class="text-destructive"`).
 * - Sin `label`: decorativo (`aria-hidden="true"`).
 * - Con `label`: `role="img"` + `aria-label`.
 */
@Component({
  selector: 'wi-icon',
  host: {
    class: 'wi-icon inline-block shrink-0 text-current leading-none',
  },
  template: `
    @if (resolved(); as icon) {
      <svg
        [attr.viewBox]="icon.glyph.viewBox"
        [attr.width]="sizePx()"
        [attr.height]="sizePx()"
        [attr.fill]="svgFill()"
        [attr.stroke]="svgStroke()"
        [attr.stroke-width]="svgStrokeWidth()"
        [attr.aria-hidden]="decorative() ? 'true' : null"
        [attr.role]="decorative() ? null : 'img'"
        [attr.aria-label]="decorative() ? null : label()"
        [class]="sizeClass()"
        class="block"
      >
        @for (node of icon.glyph.nodes; track $index) {
          @switch (node.tag) {
            @case ('path') {
              <path
                [attr.d]="attr(node, 'd')"
                [attr.fill]="attr(node, 'fill')"
                [attr.fill-rule]="attr(node, 'fill-rule')"
                [attr.clip-rule]="attr(node, 'clip-rule')"
                [attr.stroke]="attr(node, 'stroke')"
                [attr.stroke-width]="attr(node, 'stroke-width')"
                [attr.stroke-linecap]="attr(node, 'stroke-linecap')"
                [attr.stroke-linejoin]="attr(node, 'stroke-linejoin')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              />
            }
            @case ('circle') {
              <circle
                [attr.cx]="attr(node, 'cx')"
                [attr.cy]="attr(node, 'cy')"
                [attr.r]="attr(node, 'r')"
                [attr.fill]="attr(node, 'fill')"
                [attr.stroke]="attr(node, 'stroke')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              />
            }
            @case ('rect') {
              <rect
                [attr.x]="attr(node, 'x')"
                [attr.y]="attr(node, 'y')"
                [attr.width]="attr(node, 'width')"
                [attr.height]="attr(node, 'height')"
                [attr.rx]="attr(node, 'rx')"
                [attr.ry]="attr(node, 'ry')"
                [attr.fill]="attr(node, 'fill')"
                [attr.stroke]="attr(node, 'stroke')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              />
            }
            @case ('line') {
              <line
                [attr.x1]="attr(node, 'x1')"
                [attr.y1]="attr(node, 'y1')"
                [attr.x2]="attr(node, 'x2')"
                [attr.y2]="attr(node, 'y2')"
                [attr.stroke]="attr(node, 'stroke')"
                [attr.stroke-width]="attr(node, 'stroke-width')"
                [attr.stroke-linecap]="attr(node, 'stroke-linecap')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              />
            }
            @case ('polyline') {
              <polyline
                [attr.points]="attr(node, 'points')"
                [attr.fill]="attr(node, 'fill')"
                [attr.stroke]="attr(node, 'stroke')"
                [attr.stroke-width]="attr(node, 'stroke-width')"
                [attr.stroke-linecap]="attr(node, 'stroke-linecap')"
                [attr.stroke-linejoin]="attr(node, 'stroke-linejoin')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              />
            }
            @case ('polygon') {
              <polygon
                [attr.points]="attr(node, 'points')"
                [attr.fill]="attr(node, 'fill')"
                [attr.stroke]="attr(node, 'stroke')"
                [attr.stroke-width]="attr(node, 'stroke-width')"
                [attr.stroke-linejoin]="attr(node, 'stroke-linejoin')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              />
            }
            @case ('g') {
              <g
                [attr.fill]="attr(node, 'fill')"
                [attr.stroke]="attr(node, 'stroke')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              >
                @for (child of node.children ?? []; track $index) {
                  @switch (child.tag) {
                    @case ('path') {
                      <path
                        [attr.d]="attr(child, 'd')"
                        [attr.fill]="attr(child, 'fill')"
                        [attr.fill-rule]="attr(child, 'fill-rule')"
                        [attr.clip-rule]="attr(child, 'clip-rule')"
                        [attr.stroke]="attr(child, 'stroke')"
                        [attr.stroke-width]="attr(child, 'stroke-width')"
                        [attr.stroke-linecap]="attr(child, 'stroke-linecap')"
                        [attr.stroke-linejoin]="attr(child, 'stroke-linejoin')"
                        [attr.opacity]="attr(child, 'opacity')"
                        [attr.transform]="attr(child, 'transform')"
                      />
                    }
                  }
                }
              </g>
            }
          }
        }
      </svg>
    }
  `,
})
export class WiIconComponent {
  readonly name = input.required<string>();
  readonly variant = input<WiIconVariant>('outline');
  readonly size = input<WiIconSize>('md');
  readonly label = input<string | null>(null);

  private readonly registries = inject(WI_ICONS, { optional: true });
  private readonly icons = mergeIconRegistries(this.registries);

  protected readonly sizeClass = computed(() => ICON_SIZE_CLASSES[this.size()]);

  protected readonly sizePx = computed(() => ICON_SIZE_PX[this.size()]);

  protected readonly decorative = computed(() => this.label() === null);

  protected readonly resolved = computed(() => {
    const name = this.name();
    const variant = this.variant();
    const definition = this.icons[name];
    const result = resolveIconGlyph(definition, variant);

    if (!result) {
      this.warnMissing(name, variant);
      return null;
    }

    if (result.fellBack) {
      this.warnFallback(name, variant, result.usedVariant);
    }

    return result;
  });

  protected readonly svgFill = computed(() => {
    const icon = this.resolved();
    if (!icon || icon.glyph.preserveColors) {
      return null;
    }
    return icon.usedVariant === 'solid' ? 'currentColor' : 'none';
  });

  protected readonly svgStroke = computed(() => {
    const icon = this.resolved();
    if (!icon || icon.glyph.preserveColors) {
      return null;
    }
    return icon.usedVariant === 'outline' ? 'currentColor' : null;
  });

  protected readonly svgStrokeWidth = computed(() => {
    const icon = this.resolved();
    if (!icon || icon.glyph.preserveColors || icon.usedVariant !== 'outline') {
      return null;
    }
    return '1.5';
  });

  protected attr(node: WiSvgNode, key: string): string | null {
    return node.attrs[key] ?? null;
  }

  private warnMissing(name: string, variant: WiIconVariant): void {
    if (!isDevMode()) {
      return;
    }
    const key = `${name}:${variant}:missing`;
    if (warnedMissing.has(key)) {
      return;
    }
    warnedMissing.add(key);
    console.warn(`[wi-icon] Icon "${name}" is not registered. Register it with provideWiIcons().`);
  }

  private warnFallback(name: string, requested: WiIconVariant, used: WiIconVariant): void {
    if (!isDevMode()) {
      return;
    }
    const key = `${name}:${requested}:fallback:${used}`;
    if (warnedFallback.has(key)) {
      return;
    }
    warnedFallback.add(key);
    console.warn(
      `[wi-icon] Icon "${name}" has no "${requested}" variant; falling back to "${used}".`,
    );
  }
}
