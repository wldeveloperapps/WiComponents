import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonDirective } from '../../../button/src/public-api';
import { ellipsisVerticalOutline } from '../../../icon/heroicons/src/ellipsis-vertical';
import { provideWiIcons, WiIconComponent } from '../../../icon/src/public-api';
import {
  WiMenuComponent,
  WiMenuItemDirective,
  WiMenuTriggerDirective,
} from '../../../overlays/src/public-api';
import type { WiColumnDef } from './wi-column.types';
import { WiTableCellDirective } from './wi-table-cell.directive';
import { WiTableComponent } from './wi-table.component';
import { WiTableRowActionsDirective } from './wi-table-row-actions.directive';

interface DemoRow {
  id: string;
  lastSeen: string;
  eid: string;
  name: string;
  discipline: string;
  company: string;
}

const COLUMNS: WiColumnDef[] = [
  {
    id: 'lastSeen',
    header: 'Última posición',
    field: 'lastSeen',
    sortable: true,
    filterable: true,
    filterPlaceholder: 'Escribir para buscar',
    showFrom: 'always',
  },
  {
    id: 'eid',
    header: 'EID / UID',
    field: 'eid',
    sortable: true,
    filterable: true,
    filterPlaceholder: 'Escribir para buscar',
    showFrom: 'md',
  },
  {
    id: 'name',
    header: 'Nombre',
    field: 'name',
    sortable: true,
    filterable: true,
    filterPlaceholder: 'Escribir para buscar',
    showFrom: 'always',
  },
  {
    id: 'discipline',
    header: 'Disciplina',
    field: 'discipline',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterPlaceholder: 'Seleccionar uno',
    filterOptions: [
      { label: 'Civil', value: 'CIVIL' },
      { label: 'Other', value: 'OTHER' },
      { label: 'Commissioning', value: 'COMMISSIONING' },
    ],
  },
  {
    id: 'company',
    header: 'Empresa',
    field: 'company',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterPlaceholder: 'Seleccionar uno',
    showFrom: 'lg',
    filterOptions: [
      { label: 'JV', value: 'JV' },
      { label: 'NMDC', value: 'NMDC' },
      { label: 'TR', value: 'TR' },
    ],
  },
];

const ROWS: DemoRow[] = [
  {
    id: '1',
    lastSeen: '2026-08-01 06:41:40',
    eid: '78419850059687',
    name: 'Abderrahmen Kirad',
    discipline: 'OTHER',
    company: 'JV',
  },
  {
    id: '2',
    lastSeen: '2026-08-01 06:40:12',
    eid: '78419850059688',
    name: 'Afsar Ashraf',
    discipline: 'CIVIL',
    company: 'NMDC',
  },
  {
    id: '3',
    lastSeen: '2026-08-01 06:38:55',
    eid: '78419850059689',
    name: 'Carla Ruiz',
    discipline: 'COMMISSIONING',
    company: 'TR',
  },
  {
    id: '4',
    lastSeen: '2026-08-01 06:35:01',
    eid: '78419850059690',
    name: 'Diego Soto',
    discipline: 'CIVIL',
    company: 'JV',
  },
  {
    id: '5',
    lastSeen: '2026-08-01 06:30:22',
    eid: '78419850059691',
    name: 'Elena Gil',
    discipline: 'OTHER',
    company: 'NMDC',
  },
  {
    id: '6',
    lastSeen: '2026-08-01 06:28:10',
    eid: '78419850059692',
    name: 'Farid Khan',
    discipline: 'CIVIL',
    company: 'TR',
  },
  {
    id: '7',
    lastSeen: '2026-08-01 06:20:44',
    eid: '78419850059693',
    name: 'Gina Pérez',
    discipline: 'OTHER',
    company: 'JV',
  },
  {
    id: '8',
    lastSeen: '2026-08-01 06:15:03',
    eid: '78419850059694',
    name: 'Hugo Martín',
    discipline: 'COMMISSIONING',
    company: 'NMDC',
  },
];

type StoryArgs = WiTableComponent<DemoRow> & {
  sortChange: ReturnType<typeof fn>;
  pageChange: ReturnType<typeof fn>;
  filtersChange: ReturnType<typeof fn>;
};

const meta: Meta<StoryArgs> = {
  title: 'Data display/WiTable',
  component: WiTableComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Tabla declarativa del design system. La app pasa \`WiColumnDef\` + filas (p. ej. desde metadatos).

**Default** = API mínima. **Recipe /** = composición de producto (toolbar, menú de fila) — no son inputs nuevos.

**Compacto (automático) y desplegable:**

- Cada columna declara \`showFrom\`: \`'always'\` | \`'sm'\` (640) | \`'md'\` (768) | \`'compact'\` (960, default) | \`'lg'\` (1024). El corte es el **ancho del contenedor**, no el viewport.
- Las que no cumplen el corte van a una tarjeta con chevron. En esta demo: Última posición y Nombre (\`always\`); EID (\`md\`); Disciplina (omitido = \`compact\`); Empresa (\`lg\`).
- El chevron sale solo si hay columnas fuera de la fila; no hace falta \`[compact]="true"\`.
- \`[compact]\` \`null\` (default) = según el ancho medido. \`true\` = solo \`always\` en la fila; \`false\` = todas en la fila.

- Cliente: sin \`totalItems\` → filter / sort / page locales.
- Servidor: con \`totalItems\` + página en \`data\`; reaccionar a \`(filtersChange)\` / \`(sortChange)\` / \`(pageChange)\`.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          'ellipsis-vertical': { outline: ellipsisVerticalOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [
        WiTableComponent,
        WiTableCellDirective,
        WiTableRowActionsDirective,
        WiButtonDirective,
        WiIconComponent,
        WiMenuComponent,
        WiMenuItemDirective,
        WiMenuTriggerDirective,
      ],
    }),
  ],
  argTypes: {
    pageSize: { control: { type: 'number', min: 1, max: 20 } },
    showFilters: { control: 'boolean' },
    columnVisibility: { control: 'boolean' },
    showResultCount: { control: 'boolean' },
    compact: {
      options: ['auto', 'on', 'off'],
      mapping: {
        auto: null,
        on: true,
        off: false,
      },
      control: {
        type: 'inline-radio',
        labels: {
          auto: 'Auto',
          on: 'Compacto',
          off: 'Ancho',
        },
      },
      description:
        'Auto (null): según el ancho del contenedor y `showFrom` de cada columna. Compacto fuerza solo `always` en la fila; Ancho muestra todas. El chevron sale si hay columnas fuera de la fila.',
    },
    emptyMessage: { control: 'text' },
    columns: { table: { disable: true } },
    data: { table: { disable: true } },
    sortChange: {
      action: 'sortChange',
      table: { category: 'Events' },
      control: false,
    },
    pageChange: {
      action: 'pageChange',
      table: { category: 'Events' },
      control: false,
    },
    filtersChange: {
      action: 'filtersChange',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    columns: COLUMNS,
    data: ROWS,
    pageSize: 5,
    showFilters: true,
    columnVisibility: true,
    showResultCount: false,
    compact: null,
    emptyMessage: 'No hay datos',
    sortChange: fn(),
    pageChange: fn(),
    filtersChange: fn(),
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

/** API mínima: columnas + datos + paginación. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Estrecha el canvas: el chevron aparece cuando alguna columna no cumple su `showFrom`. Última posición y Nombre (`always`) se quedan; EID entra desde 768px (`md`); Disciplina desde 960px (default `compact`); Empresa desde 1024px (`lg`).',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="bg-background p-6 text-on-background">
        <wi-table
          class="w-full"
          [columns]="columns"
          [data]="data"
          [pageSize]="pageSize"
          [showFilters]="showFilters"
          [columnVisibility]="columnVisibility"
          [showResultCount]="showResultCount"
          [compact]="compact"
          [emptyMessage]="emptyMessage"
          trackBy="id"
          (sortChange)="sortChange($event)"
          (pageChange)="pageChange($event)"
          (filtersChange)="filtersChange($event)"
        />
      </div>
    `,
  }),
};

/** Sin fila de filtros ni menú de columnas (tabla “limpia”). */
export const Plain: Story = {
  name: 'Plain (sin filtros ni visibility)',
  args: {
    showFilters: false,
    columnVisibility: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="bg-background p-6 text-on-background">
        <wi-table
          class="w-full"
          [columns]="columns"
          [data]="data"
          [pageSize]="pageSize"
          [showFilters]="showFilters"
          [columnVisibility]="columnVisibility"
          [compact]="compact"
          trackBy="id"
          (sortChange)="sortChange($event)"
          (pageChange)="pageChange($event)"
        />
      </div>
    `,
  }),
};

/** Celda custom vía template. */
export const WithCellTemplate: Story = {
  name: 'With cell template',
  args: {
    showFilters: false,
    columnVisibility: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="bg-background p-6 text-on-background">
        <wi-table
          class="w-full"
          [columns]="columns"
          [data]="data"
          [pageSize]="pageSize"
          [showFilters]="showFilters"
          [columnVisibility]="columnVisibility"
          [compact]="compact"
          trackBy="id"
          (sortChange)="sortChange($event)"
          (pageChange)="pageChange($event)"
        >
          <ng-template [wiTableCell]="'name'" let-row>
            <span class="font-medium text-on-surface">{{ row.name }}</span>
          </ng-template>
          <ng-template [wiTableCell]="'discipline'" let-value="value">
            <span class="rounded-control-sm bg-surface-variant px-2 py-0.5 text-xs">{{ value }}</span>
          </ng-template>
        </wi-table>
      </div>
    `,
  }),
};

export const Empty: Story = {
  args: {
    data: [],
    showFilters: false,
    columnVisibility: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="bg-background p-6 text-on-background">
        <wi-table
          class="w-full"
          [columns]="columns"
          [data]="data"
          [emptyMessage]="emptyMessage"
          [showFilters]="showFilters"
          [columnVisibility]="columnVisibility"
          [compact]="compact"
        />
      </div>
    `,
  }),
};

/**
 * Composición típica de pantalla de resultados (no API nueva).
 * Summary + acciones de app + menú por fila.
 */
export const RecipeResultsToolbar: Story = {
  name: 'Recipe / Results toolbar',
  args: {
    showResultCount: true,
    resultCountTemplate: '{count} resultados',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Ejemplo de composición en la app: contador, acciones globales y menú de fila. Al estrechar el canvas (compact Auto) el chevron sale solo: las columnas cuyo `showFrom` no se cumple pasan a la tarjeta.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onRowAction: fn(),
    },
    template: `
      <div class="bg-background p-6 text-on-background">
        <wi-table
          class="w-full"
          [columns]="columns"
          [data]="data"
          [pageSize]="pageSize"
          [showFilters]="showFilters"
          [columnVisibility]="columnVisibility"
          [showResultCount]="showResultCount"
          [resultCountTemplate]="resultCountTemplate"
          [compact]="compact"
          trackBy="id"
          (sortChange)="sortChange($event)"
          (pageChange)="pageChange($event)"
          (filtersChange)="filtersChange($event)"
        >
          <div wiTableActions class="flex flex-wrap gap-2">
            <button wiButton type="button" variant="secondary" size="sm">Descargar Excel</button>
            <button wiButton type="button" size="sm">Mostrar mapa</button>
          </div>

          <ng-template wiTableRowActions let-row>
            <button
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-control text-on-surface outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
              [wiMenuTrigger]="rowMenu"
              [attr.aria-label]="'Acciones de ' + row.name"
            >
              <wi-icon name="ellipsis-vertical" />
            </button>
            <ng-template #rowMenu>
              <wi-menu>
                <button type="button" wiMenuItem (triggered)="onRowAction({ action: 'detail', row })">
                  Ver detalle
                </button>
                <button type="button" wiMenuItem (triggered)="onRowAction({ action: 'history', row })">
                  Histórico
                </button>
              </wi-menu>
            </ng-template>
          </ng-template>
        </wi-table>
      </div>
    `,
  }),
};

export const NarrowCompact: Story = {
  name: 'Narrow (columnas colapsadas)',
  parameters: {
    docs: {
      description: {
        story:
          '`[compact]="true"` fuerza solo columnas `always` en la fila (demo a 360px). En la app, Auto usa el ancho del contenedor y `showFrom`. Última posición y Nombre se quedan; el resto va a la tarjeta.',
      },
    },
  },
  args: {
    columnVisibility: false,
    pageSize: 4,
    compact: true,
  },
  render: (args) => ({
    props: {
      ...args,
      onRowAction: fn(),
    },
    template: `
      <div class="bg-background p-4 text-on-background">
        <div class="w-[360px] max-w-full rounded-control border border-outline-variant p-3">
          <wi-table
            class="w-full"
            [columns]="columns"
            [data]="data"
            [pageSize]="pageSize"
            [showFilters]="showFilters"
            [columnVisibility]="columnVisibility"
            [compact]="compact"
            trackBy="id"
            (pageChange)="pageChange($event)"
            (filtersChange)="filtersChange($event)"
          >
            <ng-template wiTableRowActions let-row>
              <button
                type="button"
                class="inline-flex size-8 items-center justify-center rounded-control text-on-surface outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
                [wiMenuTrigger]="rowMenu"
                [attr.aria-label]="'Acciones de ' + row.name"
              >
                <wi-icon name="ellipsis-vertical" />
              </button>
              <ng-template #rowMenu>
                <wi-menu>
                  <button type="button" wiMenuItem (triggered)="onRowAction({ action: 'detail', row })">
                    Ver detalle
                  </button>
                </wi-menu>
              </ng-template>
            </ng-template>
          </wi-table>
        </div>
      </div>
    `,
  }),
};
