import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { WiButtonDirective } from '@wiloc/ui/button';

import {
  WiCardComponent,
  WiCardContentComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
  WiSpinnerComponent,
} from '../public-api';

const meta: Meta<WiSpinnerComponent> = {
  title: 'Data display/WiSpinner',
  component: WiSpinnerComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Indicador de carga indeterminado.

- API: \`size\` (\`sm\` | \`md\` | \`lg\`), \`ariaLabel\` / \`aria-label\`.
- Color: \`currentColor\` (hereda del padre; p. ej. \`text-primary\`).
- Animación spin con \`motion-safe:\` (respeta reduced-motion).
- A11y: \`role="status"\` + \`aria-label\` (localizable desde la app).
        `,
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        WiButtonDirective,
        WiCardComponent,
        WiCardContentComponent,
        WiCardHeaderComponent,
        WiCardTitleComponent,
        WiSpinnerComponent,
      ],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del indicador: `sm` | `md` | `lg`.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Nombre accesible (`aria-label`). Localizable desde la app.',
    },
  },
  args: {
    size: 'md',
    ariaLabel: 'Cargando',
  },
};

export default meta;
type Story = StoryObj<WiSpinnerComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-spinner [size]="size" [ariaLabel]="ariaLabel" />
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-on-surface-variant">sm</span>
          <wi-spinner size="sm" />
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-on-surface-variant">md</span>
          <wi-spinner size="md" />
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-on-surface-variant">lg</span>
          <wi-spinner size="lg" />
        </div>
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <span class="text-on-surface"><wi-spinner ariaLabel="Cargando" /></span>
        <span class="text-primary"><wi-spinner ariaLabel="Cargando" /></span>
        <span class="text-error"><wi-spinner ariaLabel="Cargando" /></span>
        <span class="text-on-surface-variant"><wi-spinner ariaLabel="Cargando" /></span>
      </div>
    `,
  }),
};

/** Inline junto a texto (app). */
export const RecipeInline: Story = {
  name: 'Recipe / Inline',
  parameters: {
    docs: {
      description: {
        story: 'Spinner junto a un mensaje de estado. El copy lo aporta la app.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex items-center gap-2 text-on-surface" role="status" aria-live="polite">
        <wi-spinner size="sm" ariaLabel="Cargando" />
        <span>Cargando…</span>
      </div>
    `,
  }),
};

/** Centro de un card / área de contenido. */
export const RecipeCard: Story = {
  name: 'Recipe / Card',
  parameters: {
    docs: {
      description: {
        story:
          'Área de contenido en carga. `aria-busy` en el contenedor; el spinner aporta el status.',
      },
    },
  },
  render: () => ({
    template: `
      <wi-card class="w-72" aria-busy="true">
        <wi-card-header>
          <wi-card-title>Detalle</wi-card-title>
        </wi-card-header>
        <wi-card-content>
          <div class="flex min-h-24 items-center justify-center text-primary">
            <wi-spinner size="lg" ariaLabel="Cargando detalle" />
          </div>
        </wi-card-content>
      </wi-card>
    `,
  }),
};

/** Botón ocupado: preferir \`loading\` del botón; aquí se muestra composición manual. */
export const RecipeWithButton: Story = {
  name: 'Recipe / With button',
  parameters: {
    docs: {
      description: {
        story:
          'Para botones, preferir `button[wiButton]` con `[loading]="true"`. Esta recipe muestra composición manual si hace falta.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <button wiButton [loading]="true" ariaLabel="Guardando">Guardar</button>
        <button wiButton variant="outline" [disabled]="true">
          <wi-spinner size="sm" ariaLabel="Procesando" />
          Procesando
        </button>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: () => ({
    template: `
      <div class="flex items-center gap-6 rounded-control bg-background p-4 text-on-surface">
        <wi-spinner size="sm" />
        <wi-spinner />
        <wi-spinner size="lg" />
        <span class="text-primary"><wi-spinner /></span>
      </div>
    `,
  }),
};
