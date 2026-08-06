import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import type { WiTabsListVariant, WiTabsOrientation, WiTabsSize } from './wi-tabs.types';
import {
  WiTabsContentDirective,
  WiTabsContentLazyDirective,
  WiTabsComponent,
  WiTabsListComponent,
  WiTabsTriggerDirective,
} from './public-api';

interface WiTabsStoryArgs {
  value: string;
  orientation: WiTabsOrientation;
  variant: WiTabsListVariant;
  size: WiTabsSize;
  tabActivated: ReturnType<typeof fn>;
  valueChange: ReturnType<typeof fn>;
}

const TABS_IMPORTS = [
  WiTabsComponent,
  WiTabsListComponent,
  WiTabsTriggerDirective,
  WiTabsContentDirective,
  WiTabsContentLazyDirective,
];

const meta: Meta<WiTabsStoryArgs> = {
  title: 'Navigation/WiTabs',
  tags: ['autodocs'],
  parameters: {
    // `padded` da ancho definido al canvas; con `centered` el padre shrink-wrapea
    // y el overflow se escapa del viewport (scrollbar nativa exterior).
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pestañas accesibles (Brain). Variante `segmented` (default) / `line`. Títulos y paneles: copy de la app (proyección en `wiTabsTrigger` / `wiTabsContent`; ver Documentation/I18n). `wi-tabs` / lista a ancho del padre; track compacto + scroll y scrollbar de tokens en `.wi-tabs__viewport`. Tipografía densa bajo 40rem de viewport. Events: `tabActivated`, `valueChange`.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: TABS_IMPORTS,
    }),
  ],
  argTypes: {
    value: {
      control: 'select',
      options: ['unmanaged', 'managed'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['segmented', 'line'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    tabActivated: {
      action: 'tabActivated',
      description: 'Se emite al activar una pestaña (clave)',
      table: { category: 'Events' },
      control: false,
    },
    valueChange: {
      action: 'valueChange',
      description: 'Cambio de pestaña activa (two-way con `value`)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    value: 'unmanaged',
    orientation: 'horizontal',
    variant: 'segmented',
    size: 'md',
    tabActivated: fn(),
    valueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<WiTabsStoryArgs>;

export const Default: Story = {
  name: 'Alertas (segmented)',
  render: (args) => ({
    props: {
      ...args,
      active: args.value,
    },
    template: `
      <div class="w-full max-w-md">
        <wi-tabs
          class="w-full"
          [value]="active"
          [orientation]="orientation"
          (valueChange)="active = $event; valueChange($event)"
          (tabActivated)="tabActivated($event)"
        >
        <wi-tabs-list [variant]="variant" [size]="size">
          <button type="button" wiTabsTrigger="unmanaged">Alertas No Gestionadas</button>
          <button type="button" wiTabsTrigger="managed">Alertas Gestionadas</button>
        </wi-tabs-list>
        <div
          wiTabsContent="unmanaged"
          class="box-border min-h-28 w-full flex-1 basis-0 rounded-control border border-outline-variant p-3"
        >
          Lista de alertas no gestionadas
        </div>
        <div
          wiTabsContent="managed"
          class="box-border min-h-28 w-full flex-1 basis-0 rounded-control border border-outline-variant p-3"
        >
          Lista de alertas gestionadas
        </div>
        </wi-tabs>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-lg flex-col gap-6">
        <wi-tabs value="a" (tabActivated)="tabActivated($event)" (valueChange)="valueChange($event)">
          <wi-tabs-list variant="segmented" [size]="size">
            <button type="button" wiTabsTrigger="a">Segmented A</button>
            <button type="button" wiTabsTrigger="b">Segmented B</button>
          </wi-tabs-list>
        </wi-tabs>
        <wi-tabs value="a" (tabActivated)="tabActivated($event)" (valueChange)="valueChange($event)">
          <wi-tabs-list variant="line" [size]="size">
            <button type="button" wiTabsTrigger="a">Line A</button>
            <button type="button" wiTabsTrigger="b">Line B</button>
          </wi-tabs-list>
        </wi-tabs>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-md flex-col gap-4">
        <wi-tabs value="a" (tabActivated)="tabActivated($event)" (valueChange)="valueChange($event)">
          <wi-tabs-list size="sm">
            <button type="button" wiTabsTrigger="a">Small</button>
            <button type="button" wiTabsTrigger="b">Tabs</button>
          </wi-tabs-list>
        </wi-tabs>
        <wi-tabs value="a" (tabActivated)="tabActivated($event)" (valueChange)="valueChange($event)">
          <wi-tabs-list size="md">
            <button type="button" wiTabsTrigger="a">Medium</button>
            <button type="button" wiTabsTrigger="b">Tabs</button>
          </wi-tabs-list>
        </wi-tabs>
      </div>
    `,
  }),
};

export const Vertical: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'En vertical, da a `wi-tabs` un ancho/alto concretos (p. ej. `h-48 w-[32rem]`) y un shell `flex-1` alrededor de los paneles para que el área de contenido no dependa del texto.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      active: 'profile',
    },
    template: `
      <wi-tabs
        class="h-48 w-[32rem] max-w-full"
        orientation="vertical"
        [value]="active"
        (valueChange)="active = $event; valueChange($event)"
        (tabActivated)="tabActivated($event)"
      >
        <wi-tabs-list [variant]="variant" [size]="size">
          <button type="button" wiTabsTrigger="profile">Perfil</button>
          <button type="button" wiTabsTrigger="security">Seguridad</button>
          <button type="button" wiTabsTrigger="notifications">Notificaciones</button>
        </wi-tabs-list>
        <div
          class="box-border flex min-h-0 min-w-0 flex-1 basis-0 flex-col self-stretch overflow-hidden rounded-control border border-outline-variant bg-surface p-3"
        >
          <div wiTabsContent="profile" class="h-full min-h-0 overflow-auto">Perfil</div>
          <div wiTabsContent="security" class="h-full min-h-0 overflow-auto">Seguridad</div>
          <div wiTabsContent="notifications" class="h-full min-h-0 overflow-auto">Notificaciones</div>
        </div>
      </wi-tabs>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-tabs value="a" (tabActivated)="tabActivated($event)" (valueChange)="valueChange($event)">
        <wi-tabs-list [size]="size">
          <button type="button" wiTabsTrigger="a">Activa</button>
          <button type="button" wiTabsTrigger="b" disabled>Deshabilitada</button>
          <button type="button" wiTabsTrigger="c">Otra</button>
        </wi-tabs-list>
      </wi-tabs>
    `,
  }),
};

export const LazyContent: Story = {
  render: (args) => ({
    props: {
      ...args,
      active: 'one',
    },
    template: `
      <wi-tabs
        [value]="active"
        (valueChange)="active = $event; valueChange($event)"
        (tabActivated)="tabActivated($event)"
      >
        <wi-tabs-list>
          <button type="button" wiTabsTrigger="one">Uno</button>
          <button type="button" wiTabsTrigger="two">Dos</button>
        </wi-tabs-list>
        <div wiTabsContent="one">
          <ng-template wiTabsContentLazy>
            <p class="text-sm text-on-surface">Contenido lazy 1 (montado al activar)</p>
          </ng-template>
        </div>
        <div wiTabsContent="two">
          <ng-template wiTabsContentLazy>
            <p class="text-sm text-on-surface">Contenido lazy 2 (montado al activar)</p>
          </ng-template>
        </div>
      </wi-tabs>
    `,
  }),
};

export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mismo comportamiento que el resto: el padre limita el ancho (`max-w-sm`); el scroll vive en `.wi-tabs__viewport`, no en el contenedor exterior.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      active: 'unmanaged',
    },
    template: `
      <div class="wi-dark w-full max-w-sm min-w-0 rounded-control bg-background p-6">
        <wi-tabs
          [value]="active"
          (valueChange)="active = $event; valueChange($event)"
          (tabActivated)="tabActivated($event)"
        >
          <wi-tabs-list>
            <button type="button" wiTabsTrigger="unmanaged">Alertas No Gestionadas</button>
            <button type="button" wiTabsTrigger="managed">Alertas Gestionadas</button>
            <button type="button" wiTabsTrigger="archived">Alertas Archivadas</button>
          </wi-tabs-list>
        </wi-tabs>
      </div>
    `,
  }),
};

export const Responsive: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Padre estrecho (~280px). Scroll y scrollbar custom viven en `.wi-tabs__viewport` (CSS de librería). Tipografía densa bajo 40rem de viewport.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      active: 'unmanaged',
    },
    template: `
      <div class="w-[280px] max-w-full rounded-control border border-outline-variant p-3">
        <wi-tabs
          [value]="active"
          (valueChange)="active = $event; valueChange($event)"
          (tabActivated)="tabActivated($event)"
        >
          <wi-tabs-list>
            <button type="button" wiTabsTrigger="unmanaged">Alertas No Gestionadas</button>
            <button type="button" wiTabsTrigger="managed">Alertas Gestionadas</button>
            <button type="button" wiTabsTrigger="archived">Alertas Archivadas</button>
          </wi-tabs-list>
        </wi-tabs>
      </div>
    `,
  }),
};
