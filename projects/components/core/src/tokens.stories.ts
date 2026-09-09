import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { WI_COLOR_TOKEN_PREFIX } from './wi-theme';
import { STORYBOOK_PALETTES, type StorybookPaletteId } from '../../.storybook/palettes';

interface TokenGroup {
  readonly title: string;
  readonly tokens: readonly string[];
}

interface TokenSwatch {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
}

interface PaletteGroupView {
  readonly title: string;
  readonly tokens: readonly TokenSwatch[];
}

interface SemanticPair {
  readonly background: string;
  readonly foreground: string;
  readonly label: string;
}

const TOKEN_GROUPS: readonly TokenGroup[] = [
  {
    title: 'Marca',
    tokens: [
      'primary',
      'on-primary',
      'primary-container',
      'on-primary-container',
      'secondary',
      'on-secondary',
      'secondary-container',
      'on-secondary-container',
    ],
  },
  {
    title: 'Superficies',
    tokens: [
      'background',
      'on-background',
      'surface',
      'on-surface',
      'surface-variant',
      'on-surface-variant',
    ],
  },
  {
    title: 'Contenedores',
    tokens: [
      'surface-container-lowest',
      'surface-container-low',
      'surface-container',
      'surface-container-high',
      'surface-container-highest',
    ],
  },
  {
    title: 'Bordes y foco',
    tokens: ['outline', 'outline-variant', 'ring'],
  },
  {
    title: 'Feedback',
    tokens: [
      'error',
      'on-error',
      'error-container',
      'on-error-container',
      'warning',
      'on-warning',
      'warning-container',
      'on-warning-container',
      'success',
      'on-success',
      'success-container',
      'on-success-container',
    ],
  },
  {
    title: 'Inverso',
    tokens: ['inverse-surface', 'inverse-on-surface'],
  },
];

const SEMANTIC_PAIRS: readonly SemanticPair[] = [
  { background: 'primary', foreground: 'on-primary', label: 'Acción principal' },
  {
    background: 'primary-container',
    foreground: 'on-primary-container',
    label: 'Contenedor primary',
  },
  { background: 'secondary', foreground: 'on-secondary', label: 'Acción secundaria' },
  { background: 'surface', foreground: 'on-surface', label: 'Panel' },
  { background: 'surface-container', foreground: 'on-surface-variant', label: 'Contenedor' },
  { background: 'inverse-surface', foreground: 'inverse-on-surface', label: 'Inverso' },
  { background: 'error', foreground: 'on-error', label: 'Error' },
  { background: 'error-container', foreground: 'on-error-container', label: 'Contenedor error' },
  { background: 'warning', foreground: 'on-warning', label: 'Aviso' },
  {
    background: 'warning-container',
    foreground: 'on-warning-container',
    label: 'Contenedor aviso',
  },
  { background: 'success', foreground: 'on-success', label: 'Éxito' },
  {
    background: 'success-container',
    foreground: 'on-success-container',
    label: 'Contenedor éxito',
  },
];

function cssVarName(token: string): string {
  return `${WI_COLOR_TOKEN_PREFIX}${token}`;
}

function toHex(value: string): string {
  const trimmed = value.trim();
  const rgb =
    trimmed.match(/^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i) ??
    trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (!rgb) {
    return trimmed;
  }
  const hex = [rgb[1], rgb[2], rgb[3]]
    .map((channel) => Number(channel).toString(16).padStart(2, '0'))
    .join('');
  return `#${hex}`;
}

function readTokenValue(token: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVarName(token)).trim();
  return raw ? toHex(raw) : '—';
}

function readPalette(): PaletteGroupView[] {
  if (typeof document === 'undefined') {
    return [];
  }
  return TOKEN_GROUPS.map((group) => ({
    title: group.title,
    tokens: group.tokens.map((name) => ({
      name,
      cssVar: cssVarName(name),
      value: readTokenValue(name),
    })),
  }));
}

/**
 * Catálogo visual de la paleta `--wi-color-*` (Storybook, no es API pública).
 */
@Component({
  selector: 'wi-sb-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 bg-background p-6 text-on-background">
      <header class="space-y-1">
        <h1 class="text-lg font-semibold">Paleta semántica</h1>
        <p class="text-sm text-on-surface-variant">
          Tokens públicos <code class="text-xs">--wi-color-*</code>. Toolbar:
          <strong>Paleta</strong> (app) y <strong>Tema</strong> (light/dark).
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-sm font-semibold tracking-wide text-on-surface-variant uppercase">
          Pares fondo / texto
        </h2>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          @for (pair of pairs; track pair.label) {
            <div
              class="rounded-control border border-outline-variant px-4 py-3 text-sm"
              [style.background-color]="'var(' + cssVar(pair.background) + ')'"
              [style.color]="'var(' + cssVar(pair.foreground) + ')'"
            >
              <p class="font-medium">{{ pair.label }}</p>
              <p class="mt-1 font-mono text-xs opacity-80">
                {{ pair.background }} / {{ pair.foreground }}
              </p>
            </div>
          }
        </div>
      </section>

      @for (group of groups(); track group.title) {
        <section class="space-y-3">
          <h2 class="text-sm font-semibold tracking-wide text-on-surface-variant uppercase">
            {{ group.title }}
          </h2>
          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            @for (token of group.tokens; track token.name) {
              <article
                class="flex overflow-hidden rounded-control border border-outline-variant bg-surface-container-lowest"
              >
                <div
                  class="w-16 shrink-0 border-r border-outline-variant"
                  [style.background-color]="'var(' + token.cssVar + ')'"
                  [attr.aria-label]="token.name"
                ></div>
                <div class="min-w-0 flex-1 px-3 py-2">
                  <p class="truncate text-sm font-medium text-on-surface">{{ token.name }}</p>
                  <p class="truncate font-mono text-xs text-on-surface-variant">
                    {{ token.cssVar }}
                  </p>
                  <p class="font-mono text-xs text-on-surface">{{ token.value }}</p>
                </div>
              </article>
            }
          </div>
        </section>
      }
    </div>
  `,
})
class WiStorybookPaletteComponent {
  readonly theme = input<'light' | 'dark'>('light');
  readonly palette = input<StorybookPaletteId>(STORYBOOK_PALETTES[0].id);
  readonly pairs = SEMANTIC_PAIRS;
  readonly groups = signal<PaletteGroupView[]>([]);

  constructor() {
    effect(() => {
      this.theme();
      this.palette();
      this.groups.set(readPalette());
    });
  }

  cssVar(token: string): string {
    return cssVarName(token);
  }
}

const meta: Meta = {
  title: 'Foundation/Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Paleta semántica `--wi-color-*`. La toolbar Paleta simula otra app; Tema simula light/dark. Los componentes no conocen el nombre de la paleta.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiStorybookPaletteComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Palette: Story = {
  render: (_args, { globals }) => ({
    props: {
      theme: globals['theme'] === 'dark' ? 'dark' : 'light',
      palette: globals['palette'] ?? STORYBOOK_PALETTES[0].id,
    },
    template: `<wi-sb-palette [theme]="theme" [palette]="palette" />`,
  }),
};
