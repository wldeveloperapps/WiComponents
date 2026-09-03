import { Directionality } from '@angular/cdk/bidi';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonComponent } from '../../../button/src/public-api';
import { WiSelectComponent } from '../../../forms/src/public-api';
import type { WiPopoverAlign, WiPopoverSize } from './wi-popover.types';
import {
  WiPopoverCloseDirective,
  WiPopoverComponent,
  WiPopoverContentComponent,
  WiPopoverDescriptionComponent,
  WiPopoverHeaderComponent,
  WiPopoverPortalDirective,
  WiPopoverTitleComponent,
  WiPopoverTriggerDirective,
} from '../public-api';

interface WiPopoverStoryArgs {
  size: WiPopoverSize;
  align: WiPopoverAlign;
  sideOffset: number;
  ariaLabel: string;
  closed: ReturnType<typeof fn>;
  stateChanged: ReturnType<typeof fn>;
}

const popoverImports = [
  WiPopoverComponent,
  WiPopoverTriggerDirective,
  WiPopoverPortalDirective,
  WiPopoverCloseDirective,
  WiPopoverContentComponent,
  WiPopoverHeaderComponent,
  WiPopoverTitleComponent,
  WiPopoverDescriptionComponent,
  WiButtonComponent,
  WiSelectComponent,
];

const meta: Meta<WiPopoverStoryArgs> = {
  title: 'Overlays/WiPopover',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Popover anclado al trigger (\`wi-popover\`) por composición: header / title / description / content.

- Size: \`sm\` | \`md\` → anchos 18rem / 24rem (con tope \`calc(100vw-2rem)\`).
- Apertura: \`wiPopoverTrigger\` (toggle) o \`[wiPopoverTriggerFor]\` / \`open(origin)\` / \`[(state)]\`.
- Panel: \`ng-template wiPopoverPortal\` con \`wi-popover-content\`.
- Cierre: Escape, clic fuera, \`wiPopoverClose\`. Un overlay CDK anidado (\`wi-select\`, etc.) no cierra el popover. Sin backdrop (\`role=dialog\`, \`aria-modal=false\`).
- Events: \`stateChanged\` (\`'open' | 'closed'\`), \`closed\`.
- Para listas de acciones usar \`wi-menu\`. Para confirmar, \`wi-confirm-popup\`.
- Copy: textos desde la app (i18n).
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [Directionality],
    }),
    moduleMetadata({
      imports: popoverImports,
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      table: { category: 'Popover' },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      table: { category: 'Popover' },
    },
    sideOffset: {
      control: 'number',
      table: { category: 'Popover' },
    },
    ariaLabel: {
      control: 'text',
      table: { category: 'A11y' },
    },
    closed: {
      action: 'closed',
      description: 'Se emite al cerrar el popover (resultado opcional)',
      table: { category: 'Events' },
      control: false,
    },
    stateChanged: {
      action: 'stateChanged',
      description: "Se emite cuando el estado pasa a 'open' o 'closed'",
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    size: 'sm',
    align: 'center',
    sideOffset: 8,
    ariaLabel: '',
    closed: fn(),
    stateChanged: fn(),
  },
};

export default meta;
type Story = StoryObj<WiPopoverStoryArgs>;

const popoverBody = `
  <ng-template wiPopoverPortal>
    <wi-popover-content>
      <wi-popover-header>
        <wi-popover-title>Detalles del sitio</wi-popover-title>
        <wi-popover-description>
          Contenido rico anclado al trigger. Los textos los aporta la app.
        </wi-popover-description>
      </wi-popover-header>
      <p class="min-w-0 text-sm text-on-surface">
        Coordenadas, estado o cualquier contenido proyectado. No es un menú de acciones.
      </p>
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <wi-button type="button" variant="secondary" size="sm" wiPopoverClose>Cerrar</wi-button>
        <wi-button type="button" size="sm" wiPopoverClose>Ver ficha</wi-button>
      </div>
    </wi-popover-content>
  </ng-template>
`;

export const Default: Story = {
  args: {
    sideOffset: 10,
  },

  render: (args) => ({
    props: args,
    template: `
      <wi-popover
        [size]="size"
        [align]="align"
        [sideOffset]="sideOffset"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiPopoverTrigger>Abrir popover</wi-button>
        ${popoverBody}
      </wi-popover>
    `,
  }),
};

export const Sizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
    align: { table: { disable: true } },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-wrap gap-3">
        <wi-popover size="sm" (closed)="closed($event)" (stateChanged)="stateChanged($event)">
          <wi-button type="button" wiPopoverTrigger>Size sm</wi-button>
          <ng-template wiPopoverPortal>
            <wi-popover-content>
              <wi-popover-header>
                <wi-popover-title>Pequeño</wi-popover-title>
                <wi-popover-description>18rem</wi-popover-description>
              </wi-popover-header>
              <wi-button type="button" size="sm" wiPopoverClose>Cerrar</wi-button>
            </wi-popover-content>
          </ng-template>
        </wi-popover>

        <wi-popover size="md" (closed)="closed($event)" (stateChanged)="stateChanged($event)">
          <wi-button type="button" wiPopoverTrigger>Size md</wi-button>
          <ng-template wiPopoverPortal>
            <wi-popover-content>
              <wi-popover-header>
                <wi-popover-title>Mediano</wi-popover-title>
                <wi-popover-description>24rem</wi-popover-description>
              </wi-popover-header>
              <wi-button type="button" size="sm" wiPopoverClose>Cerrar</wi-button>
            </wi-popover-content>
          </ng-template>
        </wi-popover>
      </div>
    `,
  }),
};

export const AlignStart: Story = {
  args: {
    align: 'start',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-popover
        [size]="size"
        [align]="align"
        [sideOffset]="sideOffset"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiPopoverTrigger>Align start</wi-button>
        ${popoverBody}
      </wi-popover>
    `,
  }),
};

export const AlignEnd: Story = {
  args: {
    align: 'end',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-popover
        [size]="size"
        [align]="align"
        [sideOffset]="sideOffset"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiPopoverTrigger>Align end</wi-button>
        ${popoverBody}
      </wi-popover>
    `,
  }),
};

export const AccountCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Contenido rico (p. ej. ficha de cuenta). Los datos y acciones los aporta la app; no sustituye a `wi-menu`.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-popover
        align="end"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" variant="outline" wiPopoverTrigger>Cuenta</wi-button>
        <ng-template wiPopoverPortal>
          <wi-popover-content>
            <wi-popover-header>
              <wi-popover-title>Ana García</wi-popover-title>
              <wi-popover-description>ana@ejemplo.com</wi-popover-description>
            </wi-popover-header>
            <p class="min-w-0 text-sm text-on-surface">
              Rol y preferencias los define la aplicación consumidora.
            </p>
            <wi-button type="button" variant="secondary" size="sm" class="w-full" wiPopoverClose>
              Cerrar sesión
            </wi-button>
          </wi-popover-content>
        </ng-template>
      </wi-popover>
    `,
  }),
};

export const NestedSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Un `wi-select` abre otro overlay CDK. El popover permanece abierto al interactuar con el select; clic fuera de ambos lo cierra. No hace falta `closeOnOutsidePointerEvents=false`.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      languageOptions: ['Español', 'English', 'Français'],
    },
    template: `
      <wi-popover
        align="end"
        size="md"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" variant="outline" wiPopoverTrigger>Usuario</wi-button>
        <ng-template wiPopoverPortal>
          <wi-popover-content>
            <wi-popover-header>
              <wi-popover-title>Preferencias</wi-popover-title>
              <wi-popover-description>
                El select es un overlay anidado; no cierra este panel.
              </wi-popover-description>
            </wi-popover-header>
            <wi-select
              [options]="languageOptions"
              placeholder="Idioma"
              ariaLabel="Idioma"
            />
            <wi-button type="button" variant="secondary" size="sm" wiPopoverClose>
              Cerrar
            </wi-button>
          </wi-popover-content>
        </ng-template>
      </wi-popover>
    `,
  }),
};

export const LongContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Contenido largo con scroll interno; el panel no debe desbordar el viewport.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-popover
        size="md"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiPopoverTrigger>Contenido largo</wi-button>
        <ng-template wiPopoverPortal>
          <wi-popover-content>
            <wi-popover-header>
              <wi-popover-title>Notas del sitio</wi-popover-title>
              <wi-popover-description>Scroll interno si no cabe.</wi-popover-description>
            </wi-popover-header>
            <div class="max-h-40 min-h-0 min-w-0 overflow-y-auto text-sm text-on-surface">
              <p>
                Texto de ejemplo lo bastante largo para comprobar el recorte y el scroll interno
                en viewports estrechos. La aplicación aporta el contenido real.
              </p>
              <p class="mt-2">
                Segunda nota. El panel usa tope de ancho y no debe empujar el layout de la página.
              </p>
            </div>
            <wi-button type="button" size="sm" wiPopoverClose>Cerrar</wi-button>
          </wi-popover-content>
        </ng-template>
      </wi-popover>
    `,
  }),
};

export const AriaLabelOnly: Story = {
  args: {
    ariaLabel: 'Filtros rápidos',
  },
  parameters: {
    docs: {
      description: {
        story: 'Sin título visible: el panel usa `ariaLabel` aportado por la app.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-popover
        [ariaLabel]="ariaLabel"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiPopoverTrigger>Sin título</wi-button>
        <ng-template wiPopoverPortal>
          <wi-popover-content>
            <p class="min-w-0 text-sm text-on-surface">Panel sin wi-popover-title.</p>
            <wi-button type="button" size="sm" wiPopoverClose>Cerrar</wi-button>
          </wi-popover-content>
        </ng-template>
      </wi-popover>
    `,
  }),
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8">
        <wi-popover
          [size]="size"
          (closed)="closed($event)"
          (stateChanged)="stateChanged($event)"
        >
          <wi-button type="button" wiPopoverTrigger>Abrir (dark)</wi-button>
          ${popoverBody}
        </wi-popover>
      </div>
    `,
  }),
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Panel con tope calc(100vw-2rem). Acciones en columna invertida bajo sm. Comprobar ~320–400px.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-90">
        <wi-popover
          size="sm"
          (closed)="closed($event)"
          (stateChanged)="stateChanged($event)"
        >
          <wi-button type="button" class="w-full" wiPopoverTrigger>Abrir (estrecho)</wi-button>
          ${popoverBody}
        </wi-popover>
      </div>
    `,
  }),
};
