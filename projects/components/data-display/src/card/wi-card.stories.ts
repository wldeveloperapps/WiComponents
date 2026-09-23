import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { WiButtonDirective } from '../../../button/src/public-api';
import {
  WiCardActionComponent,
  WiCardComponent,
  WiCardContentComponent,
  WiCardDescriptionComponent,
  WiCardFooterComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
} from '../public-api';

type WiCardStoryArgs = WiCardComponent & {
  class: string;
};

const meta: Meta<WiCardStoryArgs> = {
  title: 'Data display/WiCard',
  component: WiCardComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Contenedor de superficie. El look de producto (header tintado, KPI, filas) se compone en la app con tokens y \`class\`.

- API: \`size\` (\`sm\` | \`md\` | \`none\`) + slots header / title / description / action / content / footer.
- El host aplica \`py\` + \`gap\`; el padding horizontal vive en header / content / footer.
- \`none\` = flush (sin padding ni gap); el layout lo pone la app.
- \`class\` se fusiona con el host y gana conflictos de utilities (sin \`!important\`).
        `,
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        WiButtonDirective,
        WiCardActionComponent,
        WiCardComponent,
        WiCardContentComponent,
        WiCardDescriptionComponent,
        WiCardFooterComponent,
        WiCardHeaderComponent,
        WiCardTitleComponent,
      ],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'none'],
      description:
        'Layout: sm (py-3 + gap-2) | md (py-4 + gap-2) | none (flush). El padding horizontal está en header/content/footer.',
    },
    class: {
      control: 'text',
      description:
        'Clases extra del host (Tailwind / tokens). Se fusionan con las del card y ganan conflictos (`p-0` pisa `py-4`).',
    },
    userClass: { table: { disable: true }, control: false },
    hostClasses: { table: { disable: true }, control: false },
  },
  args: {
    size: 'md',
    class: 'w-80',
  },
};

export default meta;
type Story = StoryObj<WiCardStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-card [size]="size" [class]="class">
        <wi-card-header>
          <wi-card-title>Título</wi-card-title>
          <wi-card-description>
            Descripción de apoyo bajo el título.
          </wi-card-description>
        </wi-card-header>
        <wi-card-content>
          <p class="text-on-surface-variant">
            Contenido proyectado por la aplicación.
          </p>
        </wi-card-content>
      </wi-card>
    `,
  }),
};

export const WithActionAndFooter: Story = {
  render: () => ({
    template: `
      <wi-card class="w-96">
        <wi-card-header>
          <wi-card-title>Confirmar cambios</wi-card-title>
          <wi-card-description>
            Revisa la configuración antes de aplicar.
          </wi-card-description>
          <wi-card-action>
            <button wiButton variant="ghost" size="sm">Ayuda</button>
          </wi-card-action>
        </wi-card-header>
        <wi-card-content>
          <p class="text-on-surface-variant">
            El pie y la acción del header son slots proyectados.
          </p>
        </wi-card-content>
        <wi-card-footer class="justify-end">
          <button wiButton variant="outline">Cancelar</button>
          <button wiButton variant="primary">Aplicar</button>
        </wi-card-footer>
      </wi-card>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-stretch gap-4">
        <wi-card size="sm" class="w-72">
          <wi-card-header>
            <wi-card-title>Compacto</wi-card-title>
            <wi-card-description>size=&quot;sm&quot; · host py-3 · header/content px-3</wi-card-description>
          </wi-card-header>
          <wi-card-content>Densidad baja.</wi-card-content>
        </wi-card>
        <wi-card size="md" class="w-72">
          <wi-card-header>
            <wi-card-title>Estándar</wi-card-title>
            <wi-card-description>size=&quot;md&quot; · host py-4 · header/content px-4</wi-card-description>
          </wi-card-header>
          <wi-card-content>Default.</wi-card-content>
        </wi-card>
        <wi-card size="none" class="w-72">
          <wi-card-header class="px-4 py-3">
            <wi-card-title>Flush</wi-card-title>
            <wi-card-description>size=&quot;none&quot; · padding lo pone la app</wi-card-description>
          </wi-card-header>
          <wi-card-content class="px-4 pb-4">
            Sin padding ni gap del card.
          </wi-card-content>
        </wi-card>
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
      <div class="wi-dark rounded-control bg-background p-4 text-on-background">
        <wi-card class="w-96">
          <wi-card-header>
            <wi-card-title>Tema oscuro</wi-card-title>
            <wi-card-description>
              Contraste vía tokens en .wi-dark.
            </wi-card-description>
          </wi-card-header>
          <wi-card-content>
            <p class="text-on-surface-variant">
              Superficie, borde y tipografía heredan el tema del documento.
            </p>
          </wi-card-content>
          <wi-card-footer class="justify-end">
            <button wiButton variant="outline">Cerrar</button>
            <button wiButton>Continuar</button>
          </wi-card-footer>
        </wi-card>
      </div>
    `,
  }),
};
