import { Directionality } from '@angular/cdk/bidi';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonComponent } from '../../button/src/public-api';
import { xMarkOutline } from '../../icon/heroicons/src/x-mark';
import { provideWiIcons, WiIconComponent } from '../../icon/src/public-api';
import type { WiDialogSize } from './wi-dialog.types';
import {
  WiDialogCloseDirective,
  WiDialogComponent,
  WiDialogContentComponent,
  WiDialogDescriptionComponent,
  WiDialogFooterComponent,
  WiDialogHeaderComponent,
  WiDialogPortalDirective,
  WiDialogTitleComponent,
  WiDialogTriggerDirective,
} from './public-api';

interface WiDialogStoryArgs {
  size: WiDialogSize;
  disableClose: boolean;
  showCloseButton: boolean;
  closed: ReturnType<typeof fn>;
  stateChanged: ReturnType<typeof fn>;
}

const dialogImports = [
  WiDialogComponent,
  WiDialogTriggerDirective,
  WiDialogPortalDirective,
  WiDialogCloseDirective,
  WiDialogContentComponent,
  WiDialogHeaderComponent,
  WiDialogTitleComponent,
  WiDialogDescriptionComponent,
  WiDialogFooterComponent,
  WiButtonComponent,
  WiIconComponent,
];

const meta: Meta<WiDialogStoryArgs> = {
  title: 'Overlays/WiDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Dialog modal por composición (\`wi-dialog\` + header / content / footer).

- Size: \`sm\` | \`md\` | \`lg\` → anchos 24rem / 32rem / 42rem (con margen en viewport estrecho). El pane CDK se centra.
- Apertura: \`wiDialogTrigger\` (o \`[(state)]\`).
- Panel: \`ng-template wiDialogPortal\` con \`wi-dialog-content\`.
- Cierre: Escape / backdrop (salvo \`disableClose\`), \`wiDialogClose\`, botón X (icono \`x-mark\` vía \`provideWiIcons\`).
- Events: \`stateChanged\` (\`'open' | 'closed'\`), \`closed\`.
- Responsive: el footer apila en viewport estrecho (\`flex-col-reverse\` → \`sm:flex-row\`). Comprobar ~320px.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        Directionality,
        provideWiIcons({
          'x-mark': { outline: xMarkOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: dialogImports,
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Dialog' },
    },
    disableClose: {
      control: 'boolean',
      table: { category: 'Dialog' },
    },
    showCloseButton: {
      control: 'boolean',
      table: { category: 'Content' },
    },
    closed: {
      action: 'closed',
      description: 'Se emite al cerrar el dialog (resultado opcional)',
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
    size: 'md',
    disableClose: false,
    showCloseButton: true,
    closed: fn(),
    stateChanged: fn(),
  },
};

export default meta;
type Story = StoryObj<WiDialogStoryArgs>;

const dialogBody = `
  <ng-template wiDialogPortal>
    <wi-dialog-content [showCloseButton]="showCloseButton">
      <wi-dialog-header>
        <wi-dialog-title>Editar sitio</wi-dialog-title>
        <wi-dialog-description>
          Los cambios se aplican al guardar. Esta acción no elimina datos.
        </wi-dialog-description>
      </wi-dialog-header>
      <p class="min-w-0 text-sm text-on-surface">
        Contenido del formulario o mensaje. En viewports estrechos el panel usa todo el ancho disponible.
      </p>
      <wi-dialog-footer>
        <wi-button type="button" variant="secondary" wiDialogClose>Cancelar</wi-button>
        <wi-button type="button" wiDialogClose>Guardar</wi-button>
      </wi-dialog-footer>
    </wi-dialog-content>
  </ng-template>
`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-dialog
        [size]="size"
        [disableClose]="disableClose"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiDialogTrigger>Abrir dialog</wi-button>
        ${dialogBody}
      </wi-dialog>
    `,
  }),
};

export const Sizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
    disableClose: { table: { disable: true } },
    showCloseButton: { table: { disable: true } },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-wrap gap-3">
        <wi-dialog size="sm" (closed)="closed($event)" (stateChanged)="stateChanged($event)">
          <wi-button type="button" wiDialogTrigger>Size sm</wi-button>
          <ng-template wiDialogPortal>
            <wi-dialog-content>
              <wi-dialog-header>
                <wi-dialog-title>Pequeño</wi-dialog-title>
                <wi-dialog-description>24rem</wi-dialog-description>
              </wi-dialog-header>
              <wi-dialog-footer>
                <wi-button type="button" wiDialogClose>Cerrar</wi-button>
              </wi-dialog-footer>
            </wi-dialog-content>
          </ng-template>
        </wi-dialog>

        <wi-dialog size="md" (closed)="closed($event)" (stateChanged)="stateChanged($event)">
          <wi-button type="button" wiDialogTrigger>Size md</wi-button>
          <ng-template wiDialogPortal>
            <wi-dialog-content>
              <wi-dialog-header>
                <wi-dialog-title>Mediano</wi-dialog-title>
                <wi-dialog-description>32rem</wi-dialog-description>
              </wi-dialog-header>
              <wi-dialog-footer>
                <wi-button type="button" wiDialogClose>Cerrar</wi-button>
              </wi-dialog-footer>
            </wi-dialog-content>
          </ng-template>
        </wi-dialog>

        <wi-dialog size="lg" (closed)="closed($event)" (stateChanged)="stateChanged($event)">
          <wi-button type="button" wiDialogTrigger>Size lg</wi-button>
          <ng-template wiDialogPortal>
            <wi-dialog-content>
              <wi-dialog-header>
                <wi-dialog-title>Grande</wi-dialog-title>
                <wi-dialog-description>42rem</wi-dialog-description>
              </wi-dialog-header>
              <wi-dialog-footer>
                <wi-button type="button" wiDialogClose>Cerrar</wi-button>
              </wi-dialog-footer>
            </wi-dialog-content>
          </ng-template>
        </wi-dialog>
      </div>
    `,
  }),
};

export const DisableClose: Story = {
  args: {
    disableClose: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-dialog
        [disableClose]="disableClose"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <wi-button type="button" wiDialogTrigger>Sin dismiss (Escape / backdrop)</wi-button>
        <ng-template wiDialogPortal>
          <wi-dialog-content [showCloseButton]="false">
            <wi-dialog-header>
              <wi-dialog-title>Acción en curso</wi-dialog-title>
              <wi-dialog-description>
                Escape y backdrop no cierran. Usa el botón de la app.
              </wi-dialog-description>
            </wi-dialog-header>
            <wi-dialog-footer>
              <wi-button type="button" wiDialogClose>Entendido</wi-button>
            </wi-dialog-footer>
          </wi-dialog-content>
        </ng-template>
      </wi-dialog>
    `,
  }),
};

export const WithoutCloseButton: Story = {
  args: {
    showCloseButton: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-dialog (closed)="closed($event)" (stateChanged)="stateChanged($event)">
        <wi-button type="button" wiDialogTrigger>Sin botón X</wi-button>
        ${dialogBody}
      </wi-dialog>
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
        <wi-dialog
          [size]="size"
          (closed)="closed($event)"
          (stateChanged)="stateChanged($event)"
        >
          <wi-button type="button" wiDialogTrigger>Abrir en dark</wi-button>
          ${dialogBody}
        </wi-dialog>
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
        <wi-dialog
          size="md"
          (closed)="closed($event)"
          (stateChanged)="stateChanged($event)"
        >
          <wi-button type="button" class="w-full" wiDialogTrigger>Abrir (estrecho)</wi-button>
          ${dialogBody}
        </wi-dialog>
      </div>
    `,
  }),
};
