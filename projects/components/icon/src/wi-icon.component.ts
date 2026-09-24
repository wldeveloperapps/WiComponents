import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, isDevMode, resource } from '@angular/core';

import { WiIconSrcLoader, type WiIconSrcFailure } from './wi-icon-src.loader';
import { mergeIconRegistries, resolveIconGlyph } from './wi-icon.registry';
import { WI_ICONS } from './wi-icon.tokens';
import type {
  WiIconGlyph,
  WiIconName,
  WiIconSize,
  WiIconVariant,
  WiSvgNode,
} from './wi-icon.types';
import { isAllowedIconSrc, type WiParsedExternalIcon } from './wi-icon.svg';

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
const warnedUsage = new Set<string>();

interface ResolvedNamedIcon {
  readonly kind: 'name';
  readonly glyph: WiIconGlyph;
  readonly usedVariant: WiIconVariant;
}

interface ResolvedSrcIcon {
  readonly kind: 'src';
  readonly glyph: WiIconGlyph;
  readonly rootFill: string | null;
  readonly rootStroke: string | null;
  readonly rootStrokeWidth: string | null;
  readonly rootStrokeLinecap: string | null;
  readonly rootStrokeLinejoin: string | null;
}

interface ExternalRequest {
  readonly url: string;
  readonly preserveColors: boolean;
}

/**
 * Icono tipográfico (`wi-icon`).
 *
 * Se resuelve por `name` (registro `provideWiIcons`) o por `src` (SVG de la app o URL http/https).
 * Los dos modos pintan un SVG inline (`currentColor`, `size`, misma accesibilidad).
 *
 * - Sin `label`: decorativo (`aria-hidden="true"`).
 * - Con `label`: `role="img"` + `aria-label`.
 */
@Component({
  selector: 'wi-icon',
  imports: [NgTemplateOutlet],
  host: {
    class: 'wi-icon inline-flex shrink-0 items-center justify-center text-current leading-none',
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
        [attr.stroke-linecap]="svgStrokeLinecap()"
        [attr.stroke-linejoin]="svgStrokeLinejoin()"
        [attr.aria-hidden]="decorative() ? 'true' : null"
        [attr.role]="decorative() ? null : 'img'"
        [attr.aria-label]="decorative() ? null : label()"
        [class]="sizeClass()"
        class="block"
      >
        <ng-template #iconNode let-node>
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
                [attr.stroke-width]="attr(node, 'stroke-width')"
                [attr.stroke-linecap]="attr(node, 'stroke-linecap')"
                [attr.stroke-linejoin]="attr(node, 'stroke-linejoin')"
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
                [attr.stroke-width]="attr(node, 'stroke-width')"
                [attr.stroke-linecap]="attr(node, 'stroke-linecap')"
                [attr.stroke-linejoin]="attr(node, 'stroke-linejoin')"
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
                [attr.stroke-linecap]="attr(node, 'stroke-linecap')"
                [attr.stroke-linejoin]="attr(node, 'stroke-linejoin')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              />
            }
            @case ('g') {
              <g
                [attr.fill]="attr(node, 'fill')"
                [attr.fill-rule]="attr(node, 'fill-rule')"
                [attr.clip-rule]="attr(node, 'clip-rule')"
                [attr.stroke]="attr(node, 'stroke')"
                [attr.stroke-width]="attr(node, 'stroke-width')"
                [attr.stroke-linecap]="attr(node, 'stroke-linecap')"
                [attr.stroke-linejoin]="attr(node, 'stroke-linejoin')"
                [attr.opacity]="attr(node, 'opacity')"
                [attr.transform]="attr(node, 'transform')"
              >
                @for (child of childNodes(node); track $index) {
                  <ng-container
                    [ngTemplateOutlet]="iconNode"
                    [ngTemplateOutletContext]="{ $implicit: child }"
                  />
                }
              </g>
            }
          }
        </ng-template>
        @for (node of icon.glyph.nodes; track $index) {
          <ng-container
            [ngTemplateOutlet]="iconNode"
            [ngTemplateOutletContext]="{ $implicit: node }"
          />
        }
      </svg>
    }
  `,
})
export class WiIconComponent {
  /** Nombre registrado con `provideWiIcons`. Exactamente uno de `name` o `src`. */
  readonly name = input<WiIconName | null>(null);

  /**
   * Ruta de un SVG de la app (`assets/images/gate-open.svg`) o URL `http`/`https`.
   * No se registra en `provideWiIcons`. Requiere `provideHttpClient()`.
   */
  readonly src = input<string | null>(null);

  /** Solo aplica a `name`. Con `src` se ignora. */
  readonly variant = input<WiIconVariant>('outline');

  readonly size = input<WiIconSize>('md');

  /** `null`: decorativo. Con texto: `role="img"` + `aria-label`. */
  readonly label = input<string | null>(null);

  /**
   * Solo aplica a `src`. `false` pasa fill/stroke de color a `currentColor`.
   * `true` respeta los del fichero (`WiIconGlyph.preserveColors`).
   */
  readonly preserveColors = input(false);

  private readonly registries = inject(WI_ICONS, { optional: true });
  private readonly icons = mergeIconRegistries(this.registries);
  private readonly loader = inject(WiIconSrcLoader);

  private readonly srcUrl = computed(() => {
    const name = blankToNull(this.name());
    const src = blankToNull(this.src());
    if (name || !src || !isAllowedIconSrc(src)) {
      return null;
    }
    return src;
  });

  private readonly external = resource({
    params: (): ExternalRequest | undefined => {
      const url = this.srcUrl();
      if (!url) {
        return undefined;
      }
      return { url, preserveColors: this.preserveColors() };
    },
    loader: ({ params }) => this.loader.loadIcon(params.url, params.preserveColors),
  });

  protected readonly sizeClass = computed(() => ICON_SIZE_CLASSES[this.size()]);

  protected readonly sizePx = computed(() => ICON_SIZE_PX[this.size()]);

  protected readonly decorative = computed(() => this.label() === null);

  protected readonly resolved = computed(() => {
    const name = blankToNull(this.name());
    const src = blankToNull(this.src());

    if (name && src) {
      this.warnUsage(
        'name-and-src',
        '[wi-icon] Both "name" and "src" were set. Using "name" and ignoring "src".',
      );
      return this.resolveNamed(name);
    }

    if (name) {
      return this.resolveNamed(name);
    }

    if (src) {
      return this.resolveExternal(src);
    }

    this.warnUsage('missing-source', '[wi-icon] Provide "name" or "src". Neither was set.');
    return null;
  });

  protected readonly svgFill = computed(() => {
    const icon = this.resolved();
    if (!icon) {
      return null;
    }
    if (icon.kind === 'src') {
      return icon.rootFill;
    }
    if (icon.glyph.preserveColors) {
      return null;
    }
    return icon.usedVariant === 'solid' ? 'currentColor' : 'none';
  });

  protected readonly svgStroke = computed(() => {
    const icon = this.resolved();
    if (!icon) {
      return null;
    }
    if (icon.kind === 'src') {
      return icon.rootStroke;
    }
    if (icon.glyph.preserveColors) {
      return null;
    }
    return icon.usedVariant === 'outline' ? 'currentColor' : null;
  });

  protected readonly svgStrokeWidth = computed(() => {
    const icon = this.resolved();
    if (!icon) {
      return null;
    }
    if (icon.kind === 'src') {
      return icon.rootStrokeWidth;
    }
    if (icon.glyph.preserveColors || icon.usedVariant !== 'outline') {
      return null;
    }
    return '1.5';
  });

  protected readonly svgStrokeLinecap = computed(() => {
    const icon = this.resolved();
    return icon?.kind === 'src' ? icon.rootStrokeLinecap : null;
  });

  protected readonly svgStrokeLinejoin = computed(() => {
    const icon = this.resolved();
    return icon?.kind === 'src' ? icon.rootStrokeLinejoin : null;
  });

  protected attr(node: WiSvgNode, key: string): string | null {
    return node.attrs[key] ?? null;
  }

  protected childNodes(node: WiSvgNode): readonly WiSvgNode[] {
    return node.children ?? [];
  }

  private resolveNamed(name: string): ResolvedNamedIcon | null {
    const variant = this.variant();
    const result = resolveIconGlyph(this.icons[name], variant);

    if (!result) {
      this.warnMissing(name, variant);
      return null;
    }

    if (result.fellBack) {
      this.warnFallback(name, variant, result.usedVariant);
    }

    return { kind: 'name', glyph: result.glyph, usedVariant: result.usedVariant };
  }

  private resolveExternal(src: string): ResolvedSrcIcon | null {
    if (!isAllowedIconSrc(src)) {
      this.warnUsage(
        `invalid:${src}`,
        `[wi-icon] src "${src}" must be an app path or an http(s) URL.`,
      );
      return null;
    }

    const status = this.external.status();
    if (status === 'error') {
      this.warnUsage(`http:${src}`, `[wi-icon] Failed to load SVG from "${src}".`);
      return null;
    }
    if (status !== 'resolved' && status !== 'local') {
      return null;
    }

    const result = this.external.value();
    if (!result?.ok) {
      this.warnSrcFailure(src, result?.kind ?? 'http');
      return null;
    }

    return toSrcIcon(result.icon);
  }

  private warnSrcFailure(src: string, kind: WiIconSrcFailure): void {
    if (kind === 'client') {
      this.warnUsage(
        `client:${src}`,
        `[wi-icon] HttpClient is not available. Add provideHttpClient() to load "${src}".`,
      );
      return;
    }
    if (kind === 'parse') {
      this.warnUsage(`parse:${src}`, `[wi-icon] Could not parse SVG from "${src}".`);
      return;
    }
    this.warnUsage(`http:${src}`, `[wi-icon] Failed to load SVG from "${src}".`);
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

  private warnUsage(key: string, message: string): void {
    if (!isDevMode() || warnedUsage.has(key)) {
      return;
    }
    warnedUsage.add(key);
    console.warn(message);
  }
}

function blankToNull(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toSrcIcon(icon: WiParsedExternalIcon): ResolvedSrcIcon {
  return {
    kind: 'src',
    glyph: icon.glyph,
    rootFill: icon.rootFill,
    rootStroke: icon.rootStroke,
    rootStrokeWidth: icon.rootStrokeWidth,
    rootStrokeLinecap: icon.rootStrokeLinecap,
    rootStrokeLinejoin: icon.rootStrokeLinejoin,
  };
}
