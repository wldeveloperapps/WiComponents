import { Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonComponent } from '@wiloc/ui/button';

import { checkOutline } from '../../../icon/heroicons/src/check';
import { funnelOutline } from '../../../icon/heroicons/src/funnel';
import { mapPinOutline } from '../../../icon/heroicons/src/map-pin';
import { provideWiIcons, WiIconComponent } from '../../../icon/src/public-api';
import {
  WiCardComponent,
  WiCardContentComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
  WiChipComponent,
} from '../public-api';

type WiChipStoryArgs = WiChipComponent & {
  removed: ReturnType<typeof fn>;
  clicked: ReturnType<typeof fn>;
  label: string;
};

const DEMO_APPS = [
  'Cliente web',
  'Monitor de borde',
  'Energías en sitio',
  'Asignación de dispositivos',
  'Cliente de plataforma',
  'Emparejado',
  'Borde',
  'API en tiempo real',
  'Permisos de trabajo',
] as const;

@Component({
  selector: 'wi-chip-selectable-demo',
  imports: [WiButtonComponent, WiChipComponent, WiIconComponent],
  template: `
    <div class="flex w-full max-w-3xl min-w-0 flex-col gap-4">
      <p class="text-sm text-on-surface">
        Elige las aplicaciones a las que el usuario tendrá acceso.
      </p>
      <div class="flex min-w-0 flex-wrap gap-2">
        @for (name of apps; track name) {
          <wi-chip
            size="md"
            clickable
            [selected]="isSelected(name)"
            [ariaLabel]="name"
            (clicked)="toggle(name)"
          >
            {{ name }}
            @if (isSelected(name)) {
              <wi-icon name="check" size="xs" />
            }
          </wi-chip>
        }
      </div>
      <div class="flex flex-wrap gap-2">
        <wi-button variant="outline">Atrás</wi-button>
        <wi-button>Siguiente</wi-button>
      </div>
    </div>
  `,
})
class WiChipSelectableDemoComponent {
  protected readonly apps = DEMO_APPS;
  private readonly selected = signal<ReadonlySet<string>>(new Set(['Emparejado']));

  protected isSelected(name: string): boolean {
    return this.selected().has(name);
  }

  protected toggle(name: string): void {
    this.selected.update((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }
}

const meta: Meta<WiChipStoryArgs> = {
  title: 'Data display/WiChip',
  component: WiChipComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Etiqueta compacta para **tags**, **estados**, **filtros** y **selección** (mismo rol que \`p-chip\` en la app).

- API: \`variant\`, \`size\` (\`sm\` default = \`text-xs px-2 py-1\` | \`md\`), \`selected\`, \`clickable\`, \`removable\`, \`disabled\`, \`removeLabel\`, \`ariaLabel\`.
- Forma \`rounded-control\` (no pill). Neutral: \`surface-variant\` + \`on-surface-variant\`.
- \`selected\` pinta success; el check se proyecta (\`wi-icon\`). \`clickable\` no muta el estado: la app decide.
- Copy e iconos los aporta la app (i18n). Events: \`removed\`, \`clicked\`.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          check: { outline: checkOutline },
          funnel: { outline: funnelOutline },
          'map-pin': { outline: mapPinOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [
        WiButtonComponent,
        WiCardComponent,
        WiCardContentComponent,
        WiCardHeaderComponent,
        WiCardTitleComponent,
        WiChipComponent,
        WiChipSelectableDemoComponent,
        WiIconComponent,
      ],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Apariencia semántica (si no está `selected`).',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Tamaño: `sm` (tags) | `md` (selección).',
    },
    selected: {
      control: 'boolean',
      description: 'Apariencia de elegido (success). La app controla el valor.',
    },
    clickable: {
      control: 'boolean',
      description: 'Host como botón (`aria-pressed`). Emite `clicked`.',
    },
    removable: {
      control: 'boolean',
      description: 'Muestra el aspa para quitar el chip.',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita clic/aspa y atenúa el chip.',
    },
    removeLabel: {
      control: 'text',
      description: 'Nombre accesible del aspa (`aria-label`). Localizable desde la app.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Nombre accesible del chip (alias `aria-label`).',
    },
    label: {
      control: 'text',
      description: 'Texto proyectado (demo). En la app llega por content projection.',
      table: { category: 'Demo' },
    },
    removed: {
      action: 'removed',
      description: 'Se emite al pulsar el aspa',
      table: { category: 'Events' },
      control: false,
    },
    clicked: {
      action: 'clicked',
      description: 'Se emite al activar un chip clickable',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    variant: 'neutral',
    size: 'sm',
    selected: false,
    clickable: false,
    removable: false,
    disabled: false,
    removeLabel: 'Quitar',
    ariaLabel: null,
    label: 'User',
    removed: fn(),
    clicked: fn(),
  },
};

export default meta;
type Story = StoryObj<WiChipStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-chip
        [variant]="variant"
        [size]="size"
        [selected]="selected"
        [clickable]="clickable"
        [removable]="removable"
        [disabled]="disabled"
        [removeLabel]="removeLabel"
        [ariaLabel]="ariaLabel"
        (removed)="removed()"
        (clicked)="clicked()"
      >
        {{ label }}
      </wi-chip>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <wi-chip variant="neutral">Neutral</wi-chip>
        <wi-chip variant="primary">Primary</wi-chip>
        <wi-chip variant="secondary">Secondary</wi-chip>
        <wi-chip variant="success">Success</wi-chip>
        <wi-chip variant="warning">Warning</wi-chip>
        <wi-chip variant="danger">Danger</wi-chip>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <wi-chip size="sm">User</wi-chip>
        <wi-chip size="md">Cliente web</wi-chip>
      </div>
    `,
  }),
};

export const Removable: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <wi-chip removable removeLabel="Quitar zona norte" (removed)="removed()">Zona norte</wi-chip>
        <wi-chip variant="primary" removable removeLabel="Quitar activo" (removed)="removed()">
          Activo
        </wi-chip>
        <wi-chip variant="danger" removable removeLabel="Quitar alerta" (removed)="removed()">
          Alerta
        </wi-chip>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <wi-chip disabled>Neutral</wi-chip>
        <wi-chip variant="success" disabled>Success</wi-chip>
        <wi-chip removable disabled removeLabel="Quitar filtro">Filtro</wi-chip>
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  args: {
    selected: false,
  },

  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <wi-chip>
          <wi-icon name="funnel" size="xs" />
          Filtro
        </wi-chip>
        <wi-chip selected>
          Completado
          <wi-icon name="check" size="xs" />
        </wi-chip>
        <wi-chip variant="primary" removable removeLabel="Quitar ubicación">
          <wi-icon name="map-pin" size="xs" />
          Madrid
        </wi-chip>
      </div>
    `,
  }),
};

export const WithLongContent: Story = {
  render: () => ({
    template: `
      <div class="w-48">
        <wi-chip removable removeLabel="Quitar filtro de planta">
          Planta de ensamblaje norte con recubrimiento especial
        </wi-chip>
      </div>
    `,
  }),
};

/** Tags de perfil: rol y aplicaciones (copy de la app). */
export const RecipeTags: Story = {
  name: 'Recipe / Tags',
  parameters: {
    docs: {
      description: {
        story:
          'Chips presentacionales densos (`sm`) en un detalle. El texto lo aporta la app; no hay selección ni aspa.',
      },
    },
  },
  render: () => ({
    template: `
      <wi-card class="w-80">
        <wi-card-header>
          <wi-card-title>Permisos</wi-card-title>
        </wi-card-header>
        <wi-card-content>
          <p class="text-sm text-on-surface">Sitio principal</p>
          <div class="mt-2 flex min-w-0 flex-wrap gap-1">
            <wi-chip ariaLabel="User">User</wi-chip>
          </div>
          <p class="mt-3 text-sm text-on-surface">Aplicaciones</p>
          <div class="mt-2 flex min-w-0 flex-wrap gap-1">
            <wi-chip ariaLabel="Cliente web">Cliente web</wi-chip>
            <wi-chip ariaLabel="API en tiempo real">API en tiempo real</wi-chip>
          </div>
        </wi-card-content>
      </wi-card>
    `,
  }),
};

/** Selector de aplicaciones: clickable + selected. El check se proyecta. */
export const RecipeSelectable: Story = {
  name: 'Recipe / Selectable',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Paso de asignación: chips a ancho de contenido, wrap en fila (`flex-wrap`). `clicked` no hace toggle interno; a ~320px refluan. Copy e ítems los aporta la app.',
      },
    },
  },
  render: () => ({
    template: `<wi-chip-selectable-demo />`,
  }),
};

/** Filtros aplicados: wrap en viewport estrecho (~320px). */
export const RecipeFilters: Story = {
  name: 'Recipe / Filters',
  parameters: {
    docs: {
      description: {
        story:
          'Grupo de filtros removibles. El contenedor hace wrap; a ~320px los chips refluan sin overflow horizontal.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex w-72 min-w-0 flex-wrap gap-2">
        <wi-chip removable removeLabel="Quitar filtro zona norte" (removed)="removed()">
          Zona norte
        </wi-chip>
        <wi-chip variant="primary" removable removeLabel="Quitar filtro tipo bomba" (removed)="removed()">
          Tipo: bomba
        </wi-chip>
        <wi-chip variant="warning" removable removeLabel="Quitar filtro alerta" (removed)="removed()">
          Alerta
        </wi-chip>
        <wi-chip removable removeLabel="Quitar filtro 2024" (removed)="removed()">2024</wi-chip>
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
      <div class="flex flex-wrap items-center gap-2 rounded-control bg-background p-4">
        <wi-chip>User</wi-chip>
        <wi-chip variant="primary">Primary</wi-chip>
        <wi-chip selected>
          Elegida
          <wi-icon name="check" size="xs" />
        </wi-chip>
        <wi-chip variant="warning">Warning</wi-chip>
        <wi-chip variant="danger" removable removeLabel="Quitar">Danger</wi-chip>
      </div>
    `,
  }),
};
