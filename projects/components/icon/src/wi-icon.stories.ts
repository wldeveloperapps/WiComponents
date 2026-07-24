import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';

import { provideWiIcons, WiIconComponent, type WiIconGlyph } from './public-api';
import { WI_HEROICONS_CURATED } from '../heroicons/src/curated';
import { homeOutline } from '../heroicons/src/home';

/**
 * Ejemplo de icono custom de app (derivado de workericon.svg).
 * Vive en Storybook como demo; en producción iría en la app consumidora.
 */
const workerIcon: WiIconGlyph = {
  viewBox: '0 0 32 32',
  nodes: [
    {
      tag: 'path',
      attrs: {
        d: 'M29.7,23.3L28,21.6V20c0-3.3-1.3-6.2-3.5-8.5L23,18.2c-0.1,0.5-0.5,0.8-1,0.8c-0.1,0-0.1,0-0.2,0c-0.5-0.1-0.9-0.7-0.8-1.2l2-8.9c0-0.3-0.2-0.7-0.5-0.8c-4-2-8.9-2-12.9,0C9.2,8.3,9,8.6,9,8.9l2,8.9c0.1,0.5-0.2,1.1-0.8,1.2c-0.1,0-0.1,0-0.2,0c-0.5,0-0.9-0.3-1-0.8l-1.5-6.7C5.3,13.8,4,16.7,4,20v1.6l-1.7,1.7C2,23.6,1.9,24,2.1,24.4C2.2,24.8,2.6,25,3,25h26c0.4,0,0.8-0.2,0.9-0.6C30.1,24,30,23.6,29.7,23.3z',
      },
    },
  ],
};

const meta: Meta<WiIconComponent> = {
  title: 'Icon/WiIcon',
  component: WiIconComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons(WI_HEROICONS_CURATED),
        provideWiIcons({
          worker: { solid: workerIcon },
        }),
      ],
    }),
    moduleMetadata({
      imports: [WiIconComponent],
    }),
  ],
  argTypes: {
    name: { control: 'text' },
    variant: {
      control: 'select',
      options: ['outline', 'solid'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    label: { control: 'text' },
  },
  args: {
    name: 'home',
    variant: 'outline',
    size: 'lg',
    label: null,
  },
};

export default meta;
type Story = StoryObj<WiIconComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;align-items:center;gap:12px;font:16px/1.4 system-ui;color:#111;">
        <wi-icon [name]="name" [variant]="variant" [size]="size" [label]="label" />
        <span>{{ name }} ({{ variant }})</span>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:flex-end;gap:1.5rem;color:#111;">
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="xs" /><div>xs</div>
        </div>
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="sm" /><div>sm</div>
        </div>
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="md" /><div>md</div>
        </div>
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="lg" /><div>lg</div>
        </div>
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="xl" /><div>xl</div>
        </div>
      </div>
    `,
  }),
};

export const Outline: Story = {
  args: {
    name: 'trash',
    variant: 'outline',
    size: 'xl',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;align-items:center;gap:12px;font:16px/1.4 system-ui;color:#111;">
        <wi-icon [name]="name" [variant]="variant" [size]="size" [label]="label" />
        <span>trash outline</span>
      </div>
    `,
  }),
};

export const Solid: Story = {
  args: {
    name: 'trash',
    variant: 'solid',
    size: 'xl',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;align-items:center;gap:12px;font:16px/1.4 system-ui;color:#111;">
        <wi-icon [name]="name" [variant]="variant" [size]="size" [label]="label" />
        <span>trash solid</span>
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;color:#111;">
        <wi-icon name="trash" style="color:#dc2626" size="lg" />
        <wi-icon name="check" style="color:#16a34a" size="lg" />
        <wi-icon name="information-circle" style="color:#2563eb" size="lg" />
      </div>
    `,
  }),
};

export const Decorative: Story = {
  render: () => ({
    template: `
      <button type="button" style="display:inline-flex;align-items:center;gap:0.5rem;">
        <wi-icon name="plus" />
        Crear usuario
      </button>
    `,
  }),
};

export const AccessibleLabel: Story = {
  args: {
    name: 'exclamation-triangle',
    label: 'Advertencia',
    variant: 'solid',
    size: 'lg',
  },
};

export const InsideButton: Story = {
  render: () => ({
    template: `
      <button type="button" style="display:inline-flex;align-items:center;gap:0.5rem;">
        <wi-icon name="trash" />
        Eliminar
      </button>
    `,
  }),
};

export const IconOnlyButton: Story = {
  render: () => ({
    template: `
      <button type="button" aria-label="Eliminar usuario" style="display:inline-flex;padding:0.5rem;">
        <wi-icon name="trash" />
      </button>
    `,
  }),
};

export const CustomIcon: Story = {
  args: {
    name: 'worker',
    variant: 'solid',
    size: 'xl',
    label: 'Trabajador',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;font:14px/1.4 system-ui;color:#111;">
        <wi-icon [name]="name" [variant]="variant" [size]="size" [label]="label" />
        <span>
          Custom de app: <code>worker</code> (registrado con
          <code>provideWiIcons</code>, no viene de Heroicons)
        </span>
      </div>
    `,
  }),
};

export const MissingIcon: Story = {
  args: {
    name: 'not-registered',
  },
};

export const MissingVariant: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          'outline-only': { outline: homeOutline },
        }),
      ],
    }),
  ],
  args: {
    name: 'outline-only',
    variant: 'solid',
  },
};

const catalogNames = Object.keys(WI_HEROICONS_CURATED).sort((a, b) => a.localeCompare(b));

/** Rejilla del catálogo oficial generado (outline + solid). */
export const Catalog: Story = {
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
  render: () => ({
    props: { names: catalogNames },
    template: `
      <div style="font:14px/1.4 system-ui;color:#111;">
        <p style="margin:0 0 1rem;">
          Catálogo oficial: {{ names.length }} iconos (outline | solid).
          Registra solo los que uses con <code>provideWiIcons</code>.
        </p>
        <div
          style="
            display:grid;
            grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
            gap:12px;
          "
        >
          @for (name of names; track name) {
            <div
              style="
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:8px;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:8px;
              "
            >
              <div style="display:flex;gap:12px;align-items:center;">
                <wi-icon [name]="name" variant="outline" size="lg" />
                <wi-icon [name]="name" variant="solid" size="lg" />
              </div>
              <code style="font-size:11px;word-break:break-all;text-align:center;">
                {{ name }}
              </code>
            </div>
          }
        </div>
      </div>
    `,
  }),
};
