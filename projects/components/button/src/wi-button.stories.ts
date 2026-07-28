import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';

import { provideWiIcons, WiIconComponent } from '../../icon/src/public-api';
import { plusOutline } from '../../icon/heroicons/src/plus';
import { trashOutline } from '../../icon/heroicons/src/trash';
import { WiButtonComponent } from './public-api';

const meta: Meta<WiButtonComponent> = {
  title: 'Button/WiButton',
  component: WiButtonComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Host con \`inline-flex\` (genera caja CSS). Así directivas de overlay como \`[wiTooltip]\` pueden ir en \`<wi-button>\` sin anclarse en (0,0). Evitar \`display: contents\` en hosts que necesiten overlays.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          plus: { outline: plusOutline },
          trash: { outline: trashOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [WiButtonComponent, WiIconComponent],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    iconOnly: false,
    ariaLabel: null,
  },
};

export default meta;
type Story = StoryObj<WiButtonComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-button
        [variant]="variant"
        [size]="size"
        [type]="type"
        [loading]="loading"
        [disabled]="disabled"
        [iconOnly]="iconOnly"
        [ariaLabel]="ariaLabel"
      >
        Guardar
      </wi-button>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <wi-button variant="primary">Primary</wi-button>
        <wi-button variant="secondary">Secondary</wi-button>
        <wi-button variant="danger">Danger</wi-button>
        <wi-button variant="ghost">Ghost</wi-button>
        <wi-button variant="outline">Outline</wi-button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <wi-button size="sm">Small</wi-button>
        <wi-button size="md">Medium</wi-button>
        <wi-button size="lg">Large</wi-button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <wi-button disabled>Primary</wi-button>
        <wi-button variant="secondary" disabled>Secondary</wi-button>
        <wi-button variant="outline" disabled>Outline</wi-button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <wi-button loading>Guardando</wi-button>
        <wi-button variant="danger" loading>Eliminando</wi-button>
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <wi-button>
          <wi-icon name="plus" size="sm" />
          Crear
        </wi-button>
        <wi-button variant="danger">
          <wi-icon name="trash" size="sm" />
          Eliminar
        </wi-button>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <wi-button iconOnly ariaLabel="Crear">
          <wi-icon name="plus" size="sm" />
        </wi-button>
        <wi-button variant="danger" iconOnly ariaLabel="Eliminar">
          <wi-icon name="trash" size="sm" />
        </wi-button>
        <wi-button variant="outline" iconOnly ariaLabel="Crear" size="lg">
          <wi-icon name="plus" />
        </wi-button>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  parameters: {
    globals: { theme: 'dark' },
  },
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;padding:1.5rem;">
        <wi-button variant="primary">Primary</wi-button>
        <wi-button variant="secondary">Secondary</wi-button>
        <wi-button variant="danger">Danger</wi-button>
        <wi-button variant="ghost">Ghost</wi-button>
        <wi-button variant="outline">Outline</wi-button>
        <wi-button loading>Loading</wi-button>
      </div>
    `,
  }),
};

export const WithLongContent: Story = {
  render: () => ({
    template: `
      <wi-button>
        Confirmar y continuar con la operación seleccionada
      </wi-button>
    `,
  }),
};
