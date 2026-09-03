import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';

import { provideWiIcons, WiIconComponent } from '../../icon/src/public-api';
import { plusOutline } from '../../icon/heroicons/src/plus';
import { trashOutline } from '../../icon/heroicons/src/trash';
import { WiButtonDirective } from './public-api';

const meta: Meta<WiButtonDirective> = {
  title: 'Button/WiButton',
  component: WiButtonDirective,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Directiva sobre el elemento nativo: \`<button wiButton>\` para acciones y \`<a wiButton href>\` / \`routerLink\` para navegación.

El host genera caja CSS (\`inline-flex\`), así que overlay como \`[wiTooltip]\` puede ir en el mismo elemento. Evitar \`display: contents\` en hosts que necesiten overlays. No uses \`<button>\` para navegar ni \`role="button"\` en un enlace real.
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
      imports: [WiButtonDirective, WiIconComponent],
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
type Story = StoryObj<WiButtonDirective>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button
        wiButton
        [variant]="variant"
        [size]="size"
        [type]="type"
        [loading]="loading"
        [disabled]="disabled"
        [iconOnly]="iconOnly"
        [ariaLabel]="ariaLabel"
      >
        Guardar
      </button>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <button wiButton type="button" variant="primary">Primary</button>
        <button wiButton type="button" variant="secondary">Secondary</button>
        <button wiButton type="button" variant="danger">Danger</button>
        <button wiButton type="button" variant="ghost">Ghost</button>
        <button wiButton type="button" variant="outline">Outline</button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <button wiButton type="button" size="sm">Small</button>
        <button wiButton type="button" size="md">Medium</button>
        <button wiButton type="button" size="lg">Large</button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <button wiButton type="button" disabled>Primary</button>
        <button wiButton type="button" variant="secondary" disabled>Secondary</button>
        <button wiButton type="button" variant="outline" disabled>Outline</button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <button wiButton type="button" loading>Guardando</button>
        <button wiButton type="button" variant="danger" loading>Eliminando</button>
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <button wiButton type="button">
          <wi-icon name="plus" size="sm" />
          Crear
        </button>
        <button wiButton type="button" variant="danger">
          <wi-icon name="trash" size="sm" />
          Eliminar
        </button>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <button wiButton type="button" iconOnly ariaLabel="Crear">
          <wi-icon name="plus" size="sm" />
        </button>
        <button wiButton type="button" variant="danger" iconOnly ariaLabel="Eliminar">
          <wi-icon name="trash" size="sm" />
        </button>
        <button wiButton type="button" variant="outline" iconOnly ariaLabel="Crear" size="lg">
          <wi-icon name="plus" />
        </button>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
        <a wiButton href="https://example.com">Enlace primary</a>
        <a wiButton variant="outline" href="https://example.com">Enlace outline</a>
        <a wiButton variant="ghost" href="https://example.com">Enlace ghost</a>
        <a wiButton disabled href="https://example.com">Enlace deshabilitado</a>
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
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;padding:1.5rem;">
        <button wiButton type="button" variant="primary">Primary</button>
        <button wiButton type="button" variant="secondary">Secondary</button>
        <button wiButton type="button" variant="danger">Danger</button>
        <button wiButton type="button" variant="ghost">Ghost</button>
        <button wiButton type="button" variant="outline">Outline</button>
        <button wiButton type="button" loading>Loading</button>
        <a wiButton variant="outline" href="https://example.com">Enlace</a>
      </div>
    `,
  }),
};

export const WithLongContent: Story = {
  render: () => ({
    template: `
      <button wiButton type="button">
        Confirmar y continuar con la operación seleccionada
      </button>
    `,
  }),
};
