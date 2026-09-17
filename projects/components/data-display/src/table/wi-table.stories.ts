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
import {
  WiTableCellDirective,
  WiTableComponent,
  WiTableRowActionsDirective,
  type WiColumnDef,
} from '../public-api';

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
    showFrom: 'always',
  },
  {
    id: 'eid',
    header: 'EID / UID',
    field: 'eid',
    sortable: true,
    filterable: true,
    showFrom: 'md',
  },
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
  pageIndexChange: ReturnType<typeof fn>;
  visibleColumnIdsChange: ReturnType<typeof fn>;
};

const hideFromDocs = { table: { disable: true }, control: false } as const;

const hiddenTableInternals: Record<string, typeof hideFromDocs> = {
  i18n: hideFromDocs,
  host: hideFromDocs,
  destroyRef: hideFromDocs,
  containerWidth: hideFromDocs,
  cellDirs: hideFromDocs,
  rowActionDirs: hideFromDocs,
  cellTemplateMap: hideFromDocs,
  isClientMode: hideFromDocs,
  clientProcessed: hideFromDocs,
  expandedRowKeys: hideFromDocs,
  resolvedEmptyMessage: hideFromDocs,
  resolvedAriaLabel: hideFromDocs,
  resolvedFilterPlaceholder: hideFromDocs,
  resolvedSelectPlaceholder: hideFromDocs,
  resolvedSelectClearLabel: hideFromDocs,
  resolvedFilterOperatorAriaLabel: hideFromDocs,
  resolvedRowActionsHeader: hideFromDocs,
  resolvedExpandColumnHeader: hideFromDocs,
  resolvedExpandRowAriaLabel: hideFromDocs,
  resolvedCollapseRowAriaLabel: hideFromDocs,
  resolvedFilterOperators: hideFromDocs,
  displayColumns: hideFromDocs,
  effectiveWidth: hideFromDocs,
  inlineColumns: hideFromDocs,
  collapseColumns: hideFromDocs,
  showRowExpand: hideFromDocs,
  isCompact: hideFromDocs,
  rowActionsTemplate: hideFromDocs,
  displayRows: hideFromDocs,
  effectiveTotal: hideFromDocs,
  totalPages: hideFromDocs,
  showPagination: hideFromDocs,
  showFilterRow: hideFromDocs,
  resultCountLabel: hideFromDocs,
  colspan: hideFromDocs,
  hasRowActions: hideFromDocs,
  cellTemplate: hideFromDocs,
  cellText: hideFromDocs,
  cellContext: hideFromDocs,
  cellOutletContext: hideFromDocs,
  trackRow: hideFromDocs,
  isRowExpanded: hideFromDocs,
  toggleRowExpand: hideFromDocs,
  filterValue: hideFromDocs,
  filterSelectValue: hideFromDocs,
  filterAriaLabel: hideFromDocs,
  ariaSort: hideFromDocs,
  sortIcon: hideFromDocs,
  onSortClick: hideFromDocs,
  onFilterValue: hideFromDocs,
  onFilterSelectValue: hideFromDocs,
  onFilterOperator: hideFromDocs,
  applyFilters: hideFromDocs,
  goToPage: hideFromDocs,
};

const TABLE_TEMPLATE = `
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
      [filters]="filters"
      trackBy="id"
      (sortChange)="sortChange($event)"
      (pageChange)="pageChange($event)"
      (filtersChange)="filtersChange($event)"
      (pageIndexChange)="pageIndexChange($event)"
      (visibleColumnIdsChange)="visibleColumnIdsChange($event)"
    />
  </div>
`;

const meta: Meta<StoryArgs> = {
  title: 'Data display/WiTable',
  component: WiTableComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      include: [
        'columns',
        'data',
        'totalItems',
        'visibleColumnIds',
        'sort',
        'filters',
        'pageIndex',
        'pageSize',
        'showFilters',
        'columnVisibility',
        'showResultCount',
        'compact',
        'emptyMessage',
        'ariaLabel',
        'paginationAriaLabel',
        'previousLabel',
        'nextLabel',
        'filterPlaceholder',
        'selectPlaceholder',
        'selectClearLabel',
        'filterOperatorAriaLabel',
        'columnVisibilityLabel',
        'columnVisibilityMenuLabel',
        'columnVisibilityAriaLabel',
        'resultCountTemplate',
        'rowActionsHeader',
        'expandColumnHeader',
        'expandRowAriaLabel',
        'collapseRowAriaLabel',
        'trackBy',
        'filterOperators',
      ],
    },
    docs: {
      description: {
        component: `
Tabla declarativa del design system. La app pasa \`WiColumnDef\` + filas (p. ej. desde metadatos).

**Default** = API mínima. **Recipe /** = composición de producto (toolbar, menú de fila) — no son inputs nuevos.

Los filtros texto usan \`wi-input\` (\`size="sm"\`, \`type="search"\`). Los \`filterType: 'select'\` usan \`wi-select\` (\`size="sm"\`, clearable). Ver **Filter by select**. Placeholders y chrome reaccionan al toolbar Locale.

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
    ...hiddenTableInternals,
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
    ariaLabel: { control: 'text' },
    paginationAriaLabel: { control: 'text' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
    filterPlaceholder: { control: 'text' },
    selectPlaceholder: { control: 'text' },
    selectClearLabel: { control: 'text' },
    columns: { control: false },
    data: { control: false },
    totalItems: { control: 'number' },
    visibleColumnIds: { control: false },
    sort: { control: false },
    filters: { control: false },
    pageIndex: { control: { type: 'number', min: 0 } },
    trackBy: { control: false },
    filterOperators: { control: false },
    sortChange: {
      action: 'sortChange',
      description: 'Se emite al cambiar la ordenación (model sort)',
      table: { category: 'Events' },
      control: false,
    },
    pageChange: {
      action: 'pageChange',
      description: 'Se emite al cambiar de página { pageIndex, pageSize }',
      table: { category: 'Events' },
      control: false,
    },
    filtersChange: {
      action: 'filtersChange',
      description: 'Se emite al cambiar los filtros (model filters)',
      table: { category: 'Events' },
      control: false,
    },
    pageIndexChange: {
      action: 'pageIndexChange',
      description: 'Output del model pageIndex',
      table: { category: 'Events' },
      control: false,
    },
    visibleColumnIdsChange: {
      action: 'visibleColumnIdsChange',
      description: 'Output del model visibleColumnIds',
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
    filters: [],
    sortChange: fn(),
    pageChange: fn(),
    filtersChange: fn(),
    pageIndexChange: fn(),
    visibleColumnIdsChange: fn(),
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
          'Estrecha el canvas: el chevron aparece cuando alguna columna no cumple su `showFrom`. Última posición y Nombre (`always`) se quedan; EID entra desde 768px (`md`); Disciplina desde 960px (default `compact`); Empresa desde 1024px (`lg`). Filtros texto = `wi-input`; filtros select = `wi-select`.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: TABLE_TEMPLATE,
  }),
};

/** Filtro por `wi-select` ya aplicado (cliente). */
export const FilterBySelect: Story = {
  name: 'Filter by select',
  args: {
    compact: false,
    columnVisibility: false,
    pageSize: 8,
    showResultCount: true,
    filters: [{ columnId: 'discipline', value: 'CIVIL', operator: 'equals' }],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filtro `filterType: "select"` con `wi-select`. Arranca en Disciplina = Civil (3 filas). Cambia o limpia el select: `(filtersChange)` emite y la tabla filtra en cliente. Layout ancho (`compact=false`) para ver ambos selects (Disciplina y Empresa).',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: TABLE_TEMPLATE,
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
    template: TABLE_TEMPLATE,
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
          (filtersChange)="filtersChange($event)"
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
    template: TABLE_TEMPLATE,
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

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story: 'Misma API que Default sobre `.wi-dark`. Los `wi-select` de filtro heredan tokens.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: TABLE_TEMPLATE,
  }),
};
