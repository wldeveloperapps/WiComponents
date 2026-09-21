import { Directionality } from '@angular/cdk/bidi';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonDirective } from '../../../button/src/public-api';
import { WiTableComponent, type WiColumnDef } from '../../../data-display/src/public-api';
import { WiDatepickerComponent } from '../../../forms/src/datepicker/wi-datepicker.component';
import { WiSelectComponent } from '../../../forms/src/select/wi-select.component';
import { WI_HEROICONS_CURATED } from '../../../icon/heroicons/src/curated';
import { provideWiIcons } from '../../../icon/src/public-api';
import { WiMenuComponent, WiMenuItemDirective, WiMenuTriggerDirective } from '../public-api';

interface NestedScrollRow {
  id: string;
  name: string;
  discipline: string;
}

const TABLE_COLUMNS: WiColumnDef[] = [
  {
    id: 'name',
    header: 'Nombre',
    field: 'name',
    sortable: true,
    filterable: true,
    showFrom: 'always',
  },
  {
    id: 'discipline',
    header: 'Disciplina',
    field: 'discipline',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Civil', value: 'CIVIL' },
      { label: 'Other', value: 'OTHER' },
    ],
  },
];

const TABLE_ROWS: NestedScrollRow[] = [
  { id: '1', name: 'Ana Pérez', discipline: 'CIVIL' },
  { id: '2', name: 'Luis Soto', discipline: 'OTHER' },
  { id: '3', name: 'Marta Gil', discipline: 'CIVIL' },
];

const SITE_OPTIONS = [
  { id: 'north', name: 'North site' },
  { id: 'south', name: 'South site' },
  { id: 'east', name: 'East operations' },
];

interface NestedScrollStoryArgs {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
  opened: ReturnType<typeof fn>;
  closed: ReturnType<typeof fn>;
  triggered: ReturnType<typeof fn>;
  filtersChange: ReturnType<typeof fn>;
}

const NESTED_SCROLL_TEMPLATE = `
  <div class="bg-background text-on-background">
    <div class="relative flex min-h-[100dvh]">
      <aside
        class="sticky top-0 flex w-44 shrink-0 flex-col gap-2 self-start border-r border-outline-variant bg-surface-container px-3 py-4 text-sm font-medium text-on-surface"
        style="z-index: 1100; height: 100dvh"
        data-testid="nested-sidebar"
      >
        Sidebar (z-index 1100) — el menú queda debajo
      </aside>
      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="sticky top-0 flex h-10 items-center border-b border-outline-variant bg-surface-container px-4 text-sm font-medium text-on-surface"
          style="z-index: 10"
          data-testid="nested-header"
        >
          Header / migas (z-index 10) — el desplegable queda encima
        </header>
        <div class="p-4">
    <p class="mb-3 max-w-xl text-sm text-on-surface-variant">
      Abre un panel y haz scroll <strong>dentro del recuadro</strong> (no de la ventana). El overlay
      debe seguir al trigger. El menú se pinta a z-index 1000: encima del recuadro y del header
      (10), y <strong>debajo</strong> del sidebar (1100).
    </p>
    <div
      class="overflow-auto rounded-control border border-outline-variant bg-surface p-4"
      style="height: 300px"
      data-testid="nested-scroll-container"
    >
      <div class="flex max-w-sm flex-col gap-4">
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-medium text-on-surface">Select</span>
          <wi-select
            [options]="siteOptions"
            optionLabel="name"
            optionValue="id"
            placeholder="Elige un sitio"
            ariaLabel="Sitio"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-medium text-on-surface">Datepicker</span>
          <wi-datepicker
            placeholder="Elige una fecha"
            calendarLabel="Abrir calendario"
            ariaLabel="Fecha"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
        </label>
        <div class="flex flex-col gap-1 text-sm">
          <span class="font-medium text-on-surface">Menú</span>
          <button
            wiButton
            type="button"
            [wiMenuTrigger]="menu"
            (opened)="opened()"
            (closed)="closed()"
          >
            Acciones
          </button>
          <ng-template #menu>
            <wi-menu>
              <button type="button" wiMenuItem (triggered)="triggered()">Editar</button>
              <button type="button" wiMenuItem (triggered)="triggered()">Duplicar</button>
            </wi-menu>
          </ng-template>
        </div>
      </div>
      <div class="mt-6">
        <p class="mb-2 text-sm font-medium text-on-surface">Filtro de columna (tabla)</p>
        <wi-table
          class="w-full"
          [columns]="columns"
          [data]="rows"
          [pageSize]="5"
          [showFilters]="true"
          [columnVisibility]="true"
          [showResultCount]="false"
          [compact]="false"
          trackBy="id"
          (filtersChange)="filtersChange($event)"
        />
      </div>
      <div style="height: 480px" aria-hidden="true"></div>
    </div>
        </div>
      </div>
    </div>
  </div>
`;

const meta: Meta<NestedScrollStoryArgs> = {
  title: 'Overlays/Nested scroll',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component: `
Regresión de overlays anclados al trigger dentro de un \`overflow: auto\` (shell 100dvh).

CDK \`reposition\` solo oye window y \`cdkScrollable\`. Sin este arreglo el panel se queda fijo en el viewport al hacer scroll interno.

**Z-index:** contrato y tabla de capas en **Documentation → Z-index**. Aquí: portal CDK a \`1000\` (no top-layer). El sidebar va a \`1100\` (el menú no se pinta encima). Header / migas van a \`10\` (el desplegable sí queda encima). Cards / overflow sin z-index quedan debajo del panel.

Incluye Select, Datepicker, Menu y filtro / visibilidad de \`wi-table\`. Diálogos, confirm modal y toast sí pueden ir al top-layer.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [Directionality, provideWiIcons(WI_HEROICONS_CURATED)],
    }),
    moduleMetadata({
      imports: [
        WiSelectComponent,
        WiDatepickerComponent,
        WiMenuTriggerDirective,
        WiMenuComponent,
        WiMenuItemDirective,
        WiButtonDirective,
        WiTableComponent,
      ],
    }),
  ],
  argTypes: {
    valueChange: { action: 'valueChange', table: { category: 'Events' }, control: false },
    touch: { action: 'touch', table: { category: 'Events' }, control: false },
    opened: { action: 'opened', table: { category: 'Events' }, control: false },
    closed: { action: 'closed', table: { category: 'Events' }, control: false },
    triggered: { action: 'triggered', table: { category: 'Events' }, control: false },
    filtersChange: { action: 'filtersChange', table: { category: 'Events' }, control: false },
  },
  args: {
    valueChange: fn(),
    touch: fn(),
    opened: fn(),
    closed: fn(),
    triggered: fn(),
    filtersChange: fn(),
  },
};

export default meta;
type Story = StoryObj<NestedScrollStoryArgs>;

export const OverflowContainer: Story = {
  name: 'Overflow container (regresión)',
  render: (args) => ({
    props: {
      ...args,
      siteOptions: SITE_OPTIONS,
      columns: TABLE_COLUMNS,
      rows: TABLE_ROWS,
    },
    template: NESTED_SCROLL_TEMPLATE,
  }),
};
