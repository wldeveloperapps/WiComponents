import { Directionality } from '@angular/cdk/bidi';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonComponent } from '../../../button/src/public-api';
import type {
  WiConfirmPopupAlign,
  WiConfirmPopupConfirmVariant,
  WiConfirmPopupSize,
} from './wi-confirm-popup.types';
import {
  WiConfirmPopupComponent,
  WiConfirmPopupTriggerDirective,
  provideWiOverlaysI18n,
} from '../public-api';

interface WiConfirmPopupStoryArgs {
  size: WiConfirmPopupSize;
  align: WiConfirmPopupAlign;
  sideOffset: number;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant: WiConfirmPopupConfirmVariant;
  showCancel: boolean;
  loading: boolean;
  confirmed: ReturnType<typeof fn>;
  cancelled: ReturnType<typeof fn>;
  closed: ReturnType<typeof fn>;
  stateChanged: ReturnType<typeof fn>;
}

const confirmImports = [WiConfirmPopupComponent, WiConfirmPopupTriggerDirective, WiButtonComponent];

const meta: Meta<WiConfirmPopupStoryArgs> = {
  title: 'Overlays/WiConfirmPopup',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Confirmación compacta anclada al trigger (\`wi-confirm-popup\`).

- API: \`title\`, \`description?\`, \`confirmLabel\`, \`cancelLabel?\`, \`confirmVariant\` (\`primary\` | \`danger\`), \`size\` (\`sm\` | \`md\`), \`align\`, \`sideOffset\`, \`loading\`, \`showCancel\`.
- Apertura: \`wiConfirmPopupTrigger\` (ancla al host) o \`open(origin)\` / \`[(state)]\`.
- Events: \`confirmed\`, \`cancelled\`, \`stateChanged\`, \`closed\`.
- A11y: \`role=alertdialog\` sin backdrop; cierra con Escape y clic fuera.
- Diferencia vs \`wi-confirm-dialog\`: popup contextual anclado; dialog modal centrado.
- Copy: textos desde la app; chrome cancel vía \`provideWiOverlaysI18n({ confirmCancelLabel })\`.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        Directionality,
        provideWiOverlaysI18n({
          confirmCancelLabel: () => 'Cancelar',
        }),
      ],
    }),
    moduleMetadata({
      imports: confirmImports,
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      table: { category: 'Popup' },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      table: { category: 'Popup' },
    },
    sideOffset: {
      control: 'number',
      table: { category: 'Popup' },
    },
    title: {
      control: 'text',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      table: { category: 'Content' },
    },
    confirmLabel: {
      control: 'text',
      table: { category: 'Content' },
    },
    cancelLabel: {
      control: 'text',
      table: { category: 'Content' },
    },
    confirmVariant: {
      control: 'select',
      options: ['primary', 'danger'],
      table: { category: 'Content' },
    },
    showCancel: {
      control: 'boolean',
      table: { category: 'Content' },
    },
    loading: {
      control: 'boolean',
      table: { category: 'Content' },
    },
    confirmed: {
      action: 'confirmed',
      description: 'Se emite al pulsar confirmar',
      table: { category: 'Events' },
      control: false,
    },
    cancelled: {
      action: 'cancelled',
      description: 'Se emite al pulsar cancelar',
      table: { category: 'Events' },
      control: false,
    },
    closed: {
      action: 'closed',
      description: "Se emite al cerrar ('confirmed' | 'cancelled' | dismiss)",
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
    title: 'Eliminar fila',
    description: 'Esta acción no se puede deshacer.',
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    confirmVariant: 'danger',
    showCancel: true,
    loading: false,
    confirmed: fn(),
    cancelled: fn(),
    closed: fn(),
    stateChanged: fn(),
  },
};

export default meta;
type Story = StoryObj<WiConfirmPopupStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-popup
        [size]="size"
        [align]="align"
        [sideOffset]="sideOffset"
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        [showCancel]="showCancel"
        [loading]="loading"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" variant="danger" wiConfirmPopupTrigger>Eliminar</wi-button>
      </wi-confirm-popup>
    `,
  }),
};

export const PrimaryConfirm: Story = {
  args: {
    title: 'Publicar cambios',
    description: 'Los cambios serán visibles de inmediato.',
    confirmLabel: 'Publicar',
    confirmVariant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-popup
        [size]="size"
        [align]="align"
        [sideOffset]="sideOffset"
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiConfirmPopupTrigger>Publicar</wi-button>
      </wi-confirm-popup>
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
      <wi-confirm-popup
        [size]="size"
        [align]="align"
        [sideOffset]="sideOffset"
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" variant="danger" wiConfirmPopupTrigger>Eliminar (align start)</wi-button>
      </wi-confirm-popup>
    `,
  }),
};

export const WithoutDescription: Story = {
  args: {
    title: '¿Continuar?',
    description: '',
    confirmLabel: 'Continuar',
    confirmVariant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-popup
        [title]="title"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiConfirmPopupTrigger>Continuar</wi-button>
      </wi-confirm-popup>
    `,
  }),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-popup
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        [loading]="loading"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" variant="danger" wiConfirmPopupTrigger>Eliminar (loading)</wi-button>
      </wi-confirm-popup>
    `,
  }),
};

export const WithoutCancel: Story = {
  args: {
    showCancel: false,
    title: 'Acción requerida',
    description: 'Debes confirmar para continuar.',
    confirmLabel: 'Entendido',
    confirmVariant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-popup
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [confirmVariant]="confirmVariant"
        [showCancel]="showCancel"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiConfirmPopupTrigger>Abrir</wi-button>
      </wi-confirm-popup>
    `,
  }),
};

export const InTableRow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Uso típico: confirmar una acción de fila sin modal a pantalla completa. El popup se ancla al botón de la fila.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-md overflow-hidden rounded-control border border-outline-variant">
        <div class="flex items-center justify-between gap-4 border-b border-outline-variant px-4 py-3">
          <span class="text-sm text-on-surface">Sitio A</span>
          <wi-confirm-popup
            [title]="title"
            [description]="description"
            [confirmLabel]="confirmLabel"
            [cancelLabel]="cancelLabel"
            [confirmVariant]="confirmVariant"
            align="end"
            (confirmed)="confirmed()"
            (cancelled)="cancelled()"
            (closed)="closed($event)"
            (stateChanged)="stateChanged($event)"
          >
            <wi-button type="button" size="sm" variant="danger" wiConfirmPopupTrigger>Eliminar</wi-button>
          </wi-confirm-popup>
        </div>
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <span class="text-sm text-on-surface">Sitio B</span>
          <wi-confirm-popup
            title="Eliminar Sitio B"
            description="Esta acción no se puede deshacer."
            confirmLabel="Eliminar"
            confirmVariant="danger"
            align="end"
            (confirmed)="confirmed()"
            (cancelled)="cancelled()"
            (closed)="closed($event)"
            (stateChanged)="stateChanged($event)"
          >
            <wi-button type="button" size="sm" variant="danger" wiConfirmPopupTrigger>Eliminar</wi-button>
          </wi-confirm-popup>
        </div>
      </div>
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
        <wi-confirm-popup
          [title]="title"
          [description]="description"
          [confirmLabel]="confirmLabel"
          [cancelLabel]="cancelLabel"
          [confirmVariant]="confirmVariant"
          (confirmed)="confirmed()"
          (cancelled)="cancelled()"
          (closed)="closed($event)"
          (stateChanged)="stateChanged($event)"
        >
          <wi-button type="button" variant="danger" wiConfirmPopupTrigger>Eliminar (dark)</wi-button>
        </wi-confirm-popup>
      </div>
    `,
  }),
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Panel con tope calc(100vw-2rem). Footer en columna invertida bajo sm.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-90">
        <wi-confirm-popup
          size="sm"
          [title]="title"
          [description]="description"
          [confirmLabel]="confirmLabel"
          [cancelLabel]="cancelLabel"
          [confirmVariant]="confirmVariant"
          (confirmed)="confirmed()"
          (cancelled)="cancelled()"
          (closed)="closed($event)"
          (stateChanged)="stateChanged($event)"
        >
          <wi-button type="button" class="w-full" variant="danger" wiConfirmPopupTrigger>
            Eliminar (estrecho)
          </wi-button>
        </wi-confirm-popup>
      </div>
    `,
  }),
};
