import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';

import { WiButtonComponent } from '../../button/src/public-api';
import { bars3Outline } from '../../icon/heroicons/src/bars-3';
import { documentOutline } from '../../icon/heroicons/src/document';
import { mapOutline } from '../../icon/heroicons/src/map';
import { trashOutline } from '../../icon/heroicons/src/trash';
import { userOutline } from '../../icon/heroicons/src/user';
import { usersOutline } from '../../icon/heroicons/src/users';
import { provideWiIcons, WiIconComponent } from '../../icon/src/public-api';
import {
  WiCardActionComponent,
  WiCardComponent,
  WiCardContentComponent,
  WiCardDescriptionComponent,
  WiCardFooterComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
} from './public-api';

/**
 * Recetas de composición en la app (no son variantes de API).
 * El card sigue siendo un contenedor; el look se arma con tokens + proyección.
 */
const meta: Meta<WiCardComponent> = {
  title: 'Data display/WiCard',
  component: WiCardComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Contenedor de superficie. **No** expone variantes de producto (header tintado, KPI, fila de lista):
esas se componen en la app con tokens y clases.

- API: \`size\` (\`sm\` | \`md\`) + slots header / title / description / action / content / footer.
- Story **Recipe\\*** = ejemplos de composición, no inputs nuevos.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          bars3: { outline: bars3Outline },
          document: { outline: documentOutline },
          map: { outline: mapOutline },
          trash: { outline: trashOutline },
          user: { outline: userOutline },
          users: { outline: usersOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [
        WiButtonComponent,
        WiCardActionComponent,
        WiCardComponent,
        WiCardContentComponent,
        WiCardDescriptionComponent,
        WiCardFooterComponent,
        WiCardHeaderComponent,
        WiCardTitleComponent,
        WiIconComponent,
      ],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<WiCardComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-card [size]="size" class="w-80">
        <wi-card-header>
          <wi-card-title>Resumen del sitio</wi-card-title>
          <wi-card-description>
            Contenedor para agrupar métricas y acciones relacionadas.
          </wi-card-description>
        </wi-card-header>
        <wi-card-content>
          <p class="text-on-surface-variant">
            El contenido principal del card va aquí. Puede incluir formularios,
            listas o cualquier composición de componentes.
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
            <wi-button variant="ghost" size="sm">Ayuda</wi-button>
          </wi-card-action>
        </wi-card-header>
        <wi-card-content>
          <p class="text-on-surface-variant">
            Se actualizarán los permisos del grupo seleccionado.
          </p>
        </wi-card-content>
        <wi-card-footer class="justify-end">
          <wi-button variant="outline">Cancelar</wi-button>
          <wi-button variant="primary">Aplicar</wi-button>
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
            <wi-card-description>size=&quot;sm&quot; · padding 0.75rem</wi-card-description>
          </wi-card-header>
          <wi-card-content>
            KPIs y paneles densos de dashboard.
          </wi-card-content>
        </wi-card>
        <wi-card size="md" class="w-72">
          <wi-card-header>
            <wi-card-title>Estándar</wi-card-title>
            <wi-card-description>size=&quot;md&quot; · padding 1rem</wi-card-description>
          </wi-card-header>
          <wi-card-content>
            Default para paneles y formularios.
          </wi-card-content>
        </wi-card>
      </div>
    `,
  }),
};

export const ContentOnly: Story = {
  render: () => ({
    template: `
      <wi-card class="w-80">
        <wi-card-content>
          Card mínimo solo con contenido proyectado.
        </wi-card-content>
      </wi-card>
    `,
  }),
};

/** Panel con cabecera tintada (app): py-0 + header bg-primary. */
export const RecipeTintedHeader: Story = {
  name: 'Recipe / Tinted header',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Composición en app: `!py-0 !gap-0` en el card y `bg-primary text-on-primary` en el header. No es un input `variant`.',
      },
    },
  },
  render: () => ({
    template: `
      <wi-card class="w-full max-w-3xl !gap-0 !py-0">
        <wi-card-header
          class="items-center !bg-primary !px-4 !py-3 text-on-primary"
        >
          <div class="flex min-w-0 flex-col gap-0.5">
            <p class="text-xs text-on-primary/80">Multipurpose button</p>
            <wi-card-title class="!text-base !text-on-primary">
              Maximizing Ethane Recovery and Monetization…
            </wi-card-title>
          </div>
          <wi-card-action class="flex gap-2">
            <wi-button
              variant="ghost"
              size="sm"
              iconOnly
              ariaLabel="Mapa"
              class="!text-on-primary hover:!bg-on-primary/15"
            >
              <wi-icon name="map" />
            </wi-button>
            <wi-button
              variant="ghost"
              size="sm"
              iconOnly
              ariaLabel="Menú"
              class="!text-on-primary hover:!bg-on-primary/15"
            >
              <wi-icon name="bars3" />
            </wi-button>
          </wi-card-action>
        </wi-card-header>
        <wi-card-content class="!py-4">
          <div
            class="flex h-48 flex-col justify-end gap-3 rounded-control bg-surface-variant/40 p-4"
            aria-hidden="true"
          >
            <div class="flex flex-1 items-end gap-2 px-2">
              <div class="w-8 rounded-t bg-error" style="height: 70%"></div>
              <div class="w-8 rounded-t bg-error" style="height: 55%"></div>
              <div class="w-8 rounded-t bg-error" style="height: 85%"></div>
              <div class="w-8 rounded-t bg-error" style="height: 40%"></div>
              <div class="w-8 rounded-t bg-primary" style="height: 15%"></div>
              <div class="w-8 rounded-t bg-error" style="height: 60%"></div>
              <div class="w-8 rounded-t bg-error" style="height: 75%"></div>
            </div>
            <div class="flex justify-center gap-4 text-xs text-on-surface-variant">
              <span class="inline-flex items-center gap-1.5">
                <span class="size-2.5 rounded-sm bg-error"></span> Subcontratista (101)
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="size-2.5 rounded-sm bg-primary"></span> Adhoc (1)
              </span>
            </div>
          </div>
        </wi-card-content>
      </wi-card>
    `,
  }),
};

/** Filas de lista (app): panel de altura fija + scroll en el listado. */
export const RecipeAssetRows: Story = {
  name: 'Recipe / Asset rows',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: `
Panel de activos con **altura fija** (\`h-[28rem]\`). El toolbar queda fijo;
la lista usa \`min-h-0 flex-1 overflow-y-auto\` para hacer scroll si hay más filas
(p. ej. 8) sin crecer el card. Composición de app, no un input del card.
        `,
      },
    },
  },
  render: () => ({
    template: `
      <wi-card class="h-[28rem] w-full max-w-md !gap-0 !py-0">
        <wi-card-header class="shrink-0 items-center !pb-3">
          <wi-card-title>Activos con alarma habilitada</wi-card-title>
          <wi-card-action>
            <wi-button variant="outline" size="sm" disabled>Guardar cambios</wi-button>
          </wi-card-action>
        </wi-card-header>
        <wi-card-content class="flex min-h-0 flex-1 flex-col !gap-0 !px-0 !pb-0">
          <div
            class="flex shrink-0 items-center gap-2 bg-primary px-3 py-2 text-on-primary"
          >
            <span class="min-w-0 flex-1 truncate text-sm">Seleccionar tipo de…</span>
            <wi-button variant="secondary" size="sm">+ Añadir</wi-button>
          </div>
          <ul class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
            @for (asset of assets; track asset.name) {
              <li>
                <wi-card size="sm" class="!gap-0 !py-0">
                  <wi-card-content class="flex items-center gap-3 !py-2.5">
                    <span [class]="asset.badgeClass">
                      <wi-icon [name]="asset.icon" size="sm" />
                    </span>
                    <span class="min-w-0 flex-1 font-medium text-on-surface">{{ asset.name }}</span>
                    <wi-button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      [ariaLabel]="'Eliminar ' + asset.name"
                    >
                      <wi-icon name="trash" class="text-on-surface-variant" />
                    </wi-button>
                  </wi-card-content>
                </wi-card>
              </li>
            }
          </ul>
        </wi-card-content>
      </wi-card>
    `,
    props: {
      assets: [
        {
          name: 'JV',
          icon: 'user',
          badgeClass:
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary',
        },
        {
          name: 'Supplier',
          icon: 'user',
          badgeClass:
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-warning text-on-warning',
        },
        {
          name: 'Subcontractor',
          icon: 'users',
          badgeClass:
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-error text-on-error',
        },
        {
          name: 'Adnoc',
          icon: 'user',
          badgeClass:
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary',
        },
        {
          name: 'Vehicle',
          icon: 'map',
          badgeClass:
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-success text-on-success',
        },
        {
          name: 'Adhoc',
          icon: 'user',
          badgeClass:
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container',
        },
        {
          name: 'Contractor B',
          icon: 'users',
          badgeClass:
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-error text-on-error',
        },
        {
          name: 'Fleet East',
          icon: 'map',
          badgeClass:
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-success text-on-success',
        },
      ],
    },
  }),
};

/** KPIs de color (app): content-only + fondo semántico. */
export const RecipeKpiTiles: Story = {
  name: 'Recipe / KPI tiles',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Tiles de métrica: `wi-card` sin header, fondo con tokens (`bg-primary`, `bg-error`, …). El color es de la app, no un `variant` del card. Grid responsive: 2 → 3 → 5 columnas.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <wi-card size="sm" class="!gap-0 !border-0 !bg-secondary !py-0 !text-on-secondary !shadow-none">
          <wi-card-content class="flex items-center gap-2 !py-3">
            <wi-icon name="user" class="opacity-80" />
            <div class="min-w-0">
              <p class="text-lg font-semibold leading-none">12</p>
              <p class="truncate text-xs opacity-90">Adhoc</p>
            </div>
          </wi-card-content>
        </wi-card>
        <wi-card size="sm" class="!gap-0 !border-0 !bg-primary !py-0 !text-on-primary !shadow-none">
          <wi-card-content class="flex items-center gap-2 !py-3">
            <wi-icon name="users" class="opacity-80" />
            <div class="min-w-0">
              <p class="text-lg font-semibold leading-none">48</p>
              <p class="truncate text-xs opacity-90">JV</p>
            </div>
          </wi-card-content>
        </wi-card>
        <wi-card size="sm" class="!gap-0 !border-0 !bg-error !py-0 !text-on-error !shadow-none">
          <wi-card-content class="flex items-center gap-2 !py-3">
            <wi-icon name="users" class="opacity-80" />
            <div class="min-w-0">
              <p class="text-lg font-semibold leading-none">101</p>
              <p class="truncate text-xs opacity-90">Subcontractor</p>
            </div>
          </wi-card-content>
        </wi-card>
        <wi-card size="sm" class="!gap-0 !border-0 !bg-success !py-0 !text-on-success !shadow-none">
          <wi-card-content class="flex items-center gap-2 !py-3">
            <wi-icon name="user" class="opacity-80" />
            <div class="min-w-0">
              <p class="text-lg font-semibold leading-none">7</p>
              <p class="truncate text-xs opacity-90">Supplier</p>
            </div>
          </wi-card-content>
        </wi-card>
        <wi-card size="sm" class="!gap-0 !border-0 !bg-warning !py-0 !text-on-warning !shadow-none">
          <wi-card-content class="flex items-center gap-2 !py-3">
            <wi-icon name="map" class="opacity-80" />
            <div class="min-w-0">
              <p class="text-lg font-semibold leading-none">23</p>
              <p class="truncate text-xs opacity-90">Vehicle</p>
            </div>
          </wi-card-content>
        </wi-card>
      </div>
    `,
  }),
};

/** Grid de paneles de dashboard (app). */
export const RecipeDashboardPanels: Story = {
  name: 'Recipe / Dashboard panels',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Grid de paneles con `size="sm"`. Layout responsive: 1 columna en móvil, 2 desde `sm`, 3 desde `lg`.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="grid w-full max-w-4xl grid-cols-1 gap-3 bg-background p-4 sm:grid-cols-2 lg:grid-cols-3">
        <wi-card size="sm">
          <wi-card-header>
            <wi-card-title>Mapa</wi-card-title>
          </wi-card-header>
          <wi-card-content>
            <div class="flex h-28 items-center justify-center rounded-control bg-surface-variant text-xs text-on-surface-variant">
              Vista mapa
            </div>
          </wi-card-content>
        </wi-card>
        <wi-card size="sm">
          <wi-card-header>
            <wi-card-title>Control de presencia</wi-card-title>
            <wi-card-action>
              <wi-button variant="ghost" size="sm">Detalles</wi-button>
            </wi-card-action>
          </wi-card-header>
          <wi-card-content>
            <div class="flex h-28 items-center justify-center rounded-control bg-surface-variant text-xs text-on-surface-variant">
              Gráfico
            </div>
          </wi-card-content>
        </wi-card>
        <wi-card size="sm" class="sm:col-span-2 lg:col-span-1">
          <wi-card-header>
            <wi-card-title>Alertas SOS</wi-card-title>
          </wi-card-header>
          <wi-card-content>
            <ul class="flex flex-col gap-1 text-xs text-on-surface">
              <li class="rounded-control bg-error-container px-2 py-1 text-on-error-container">Alerta 1</li>
              <li class="rounded-control bg-error-container px-2 py-1 text-on-error-container">Alerta 2</li>
              <li class="rounded-control bg-error-container px-2 py-1 text-on-error-container">Alerta 3</li>
            </ul>
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
      <wi-card class="w-96">
        <wi-card-header>
          <wi-card-title>Tema oscuro</wi-card-title>
          <wi-card-description>
            Contraste vía tokens --wi-color-* en .wi-dark.
          </wi-card-description>
        </wi-card-header>
        <wi-card-content>
          <p class="text-on-surface-variant">
            Superficie, borde y tipografía heredan el tema del documento.
          </p>
        </wi-card-content>
        <wi-card-footer class="justify-end">
          <wi-button variant="outline">Cerrar</wi-button>
          <wi-button>Continuar</wi-button>
        </wi-card-footer>
      </wi-card>
    `,
  }),
};

export const WithLongContent: Story = {
  render: () => ({
    template: `
      <wi-card class="w-96">
        <wi-card-header>
          <wi-card-title>
            Título largo que describe un panel de control operativo
          </wi-card-title>
          <wi-card-description>
            Descripción extendida para comprobar el wrapping del encabezado y
            la jerarquía tipográfica del card.
          </wi-card-description>
        </wi-card-header>
        <wi-card-content>
          <p class="text-on-surface-variant">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            Nulla quis sem at nibh elementum imperdiet.
          </p>
        </wi-card-content>
      </wi-card>
    `,
  }),
};
