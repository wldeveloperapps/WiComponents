import { Directionality } from '@angular/cdk/bidi';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonComponent } from '../../button/src/public-api';
import type { WiConfirmDialogConfirmVariant, WiConfirmDialogSize } from './wi-confirm-dialog.types';
import {
  WiConfirmDialogComponent,
  WiConfirmDialogTriggerDirective,
  provideWiOverlaysI18n,
} from './public-api';

interface WiConfirmDialogStoryArgs {
  size: WiConfirmDialogSize;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant: WiConfirmDialogConfirmVariant;
  showCancel: boolean;
  loading: boolean;
  confirmed: ReturnType<typeof fn>;
  cancelled: ReturnType<typeof fn>;
  closed: ReturnType<typeof fn>;
  stateChanged: ReturnType<typeof fn>;
}

const confirmImports = [
  WiConfirmDialogComponent,
  WiConfirmDialogTriggerDirective,
  WiButtonComponent,
];

const meta: Meta<WiConfirmDialogStoryArgs> = {
  title: 'Overlays/WiConfirmDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Diálogo de confirmación compacto (\`wi-confirm-dialog\`).

- API: \`title\`, \`description?\`, \`confirmLabel\`, \`cancelLabel?\`, \`confirmVariant\` (\`primary\` | \`danger\`), \`size\` (\`sm\` | \`md\`), \`loading\`, \`showCancel\`.
- Apertura: \`wiConfirmDialogTrigger\` o \`[(state)]\` / \`open()\`.
- Events: \`confirmed\`, \`cancelled\`, \`stateChanged\`, \`closed\` (resultado \`'confirmed' | 'cancelled'\`).
- A11y: \`role=alertdialog\`; por defecto no cierra con Escape / backdrop (\`disableClose\`).
- Copy: textos desde la app; chrome cancel vía \`provideWiOverlaysI18n({ confirmCancelLabel })\`.
- Responsive: footer apila en viewport estrecho. Comprobar ~320px.
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
      table: { category: 'Dialog' },
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
      description: "Se emite al cerrar ('confirmed' | 'cancelled')",
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
    title: 'Eliminar sitio',
    description: 'Esta acción no se puede deshacer. Se perderán los datos asociados.',
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
type Story = StoryObj<WiConfirmDialogStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-dialog
        [size]="size"
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
        <wi-button type="button" variant="danger" wiConfirmDialogTrigger>Eliminar sitio</wi-button>
      </wi-confirm-dialog>
    `,
  }),
};

export const PrimaryConfirm: Story = {
  args: {
    title: 'Publicar cambios',
    description: 'Los cambios serán visibles para todos los usuarios del sitio.',
    confirmLabel: 'Publicar',
    confirmVariant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-dialog
        [size]="size"
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
        <wi-button type="button" wiConfirmDialogTrigger>Publicar</wi-button>
      </wi-confirm-dialog>
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
      <wi-confirm-dialog
        [title]="title"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiConfirmDialogTrigger>Continuar</wi-button>
      </wi-confirm-dialog>
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
      <wi-confirm-dialog
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
        <wi-button type="button" variant="danger" wiConfirmDialogTrigger>Eliminar (loading)</wi-button>
      </wi-confirm-dialog>
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
      <wi-confirm-dialog
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
        <wi-button type="button" wiConfirmDialogTrigger>Abrir</wi-button>
      </wi-confirm-dialog>
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
        <wi-confirm-dialog
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
          <wi-button type="button" variant="danger" wiConfirmDialogTrigger>Eliminar (dark)</wi-button>
        </wi-confirm-dialog>
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
          'Footer en columna invertida bajo `sm`. Comprobar legibilidad ~320–400px sin overflow horizontal indebido.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-90">
        <wi-confirm-dialog
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
          <wi-button type="button" class="w-full" variant="danger" wiConfirmDialogTrigger>
            Eliminar (estrecho)
          </wi-button>
        </wi-confirm-dialog>
      </div>
    `,
  }),
};
