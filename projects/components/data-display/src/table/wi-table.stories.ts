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
  actualizado: string;
  nombre: string;
  categoria: string;
  estado: string;
}

const COLUMNS: WiColumnDef[] = [
  {
    id: 'actualizado',
    header: 'Actualizado',
    field: 'actualizado',
    sortable: true,
    filterable: true,
    showFrom: 'always',
  },
  {
    id: 'id',
    header: 'Identificador',
    field: 'id',
    sortable: true,
    filterable: true,
    showFrom: 'md',
  },
  {
    id: 'nombre',
    header: 'Nombre',
    field: 'nombre',
    sortable: true,
    filterable: true,
    showFrom: 'always',
  },
  {
    id: 'categoria',
    header: 'Categoría',
    field: 'categoria',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Infraestructura', value: 'INFRA' },
      { label: 'Operaciones', value: 'OPS' },
      { label: 'Soporte', value: 'SUPPORT' },
    ],
  },
  {
    id: 'estado',
    header: 'Estado',
    field: 'estado',
    sortable: true,
    filterable: true,
    filterType: 'select',
    showFrom: 'lg',
    filterOptions: [
      { label: 'Activo', value: 'ACTIVE' },
      { label: 'Pendiente', value: 'PENDING' },
      { label: 'Cerrado', value: 'CLOSED' },
    ],
  },
];

const ROWS: DemoRow[] = [
  {
    id: 'REG-001',
    actualizado: '2026-08-01 06:41:40',
    nombre: 'Elemento alpha',
    categoria: 'OPS',
    estado: 'ACTIVE',
  },
  {
    id: 'REG-002',
    actualizado: '2026-08-01 06:40:12',
    nombre: 'Elemento beta',
    categoria: 'INFRA',
    estado: 'PENDING',
  },
  {
    id: 'REG-003',
    actualizado: '2026-08-01 06:38:55',
    nombre: 'Elemento gamma',
    categoria: 'SUPPORT',
    estado: 'CLOSED',
  },
  {
    id: 'REG-004',
    actualizado: '2026-08-01 06:35:01',
    nombre: 'Elemento delta',
    categoria: 'INFRA',
    estado: 'ACTIVE',
  },
  {
    id: 'REG-005',
    actualizado: '2026-08-01 06:30:22',
    nombre: 'Elemento épsilon',
    categoria: 'OPS',
    estado: 'PENDING',
  },
  {
    id: 'REG-006',
    actualizado: '2026-08-01 06:28:10',
    nombre: 'Elemento zeta',
    categoria: 'INFRA',
    estado: 'CLOSED',
  },
  {
    id: 'REG-007',
    actualizado: '2026-08-01 06:20:44',
    nombre: 'Elemento eta',
    categoria: 'OPS',
    estado: 'ACTIVE',
  },
  {
    id: 'REG-008',
    actualizado: '2026-08-01 06:15:03',
    nombre: 'Elemento theta',
    categoria: 'SUPPORT',
    estado: 'PENDING',
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
      [totalItems]="totalItems"
      [visibleColumnIds]="visibleColumnIds"
      [sort]="sort"
      [filters]="filters"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [showFilters]="showFilters"
      [columnVisibility]="columnVisibility"
      [showResultCount]="showResultCount"
      [compact]="compact"
      [emptyMessage]="emptyMessage"
      [ariaLabel]="ariaLabel"
      [paginationAriaLabel]="paginationAriaLabel"
      [previousLabel]="previousLabel"
      [nextLabel]="nextLabel"
      [filterPlaceholder]="filterPlaceholder"
      [selectPlaceholder]="selectPlaceholder"
      [selectClearLabel]="selectClearLabel"
      [filterOperatorAriaLabel]="filterOperatorAriaLabel"
      [columnVisibilityLabel]="columnVisibilityLabel"
      [columnVisibilityMenuLabel]="columnVisibilityMenuLabel"
      [columnVisibilityAriaLabel]="columnVisibilityAriaLabel"
      [resultCountTemplate]="resultCountTemplate"
      [rowActionsHeader]="rowActionsHeader"
      [expandColumnHeader]="expandColumnHeader"
      [expandRowAriaLabel]="expandRowAriaLabel"
      [collapseRowAriaLabel]="collapseRowAriaLabel"
      [filterOperators]="filterOperators"
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
- Las que no cumplen el corte van a una tarjeta con chevron. En esta demo: Actualizado y Nombre (\`always\`); Identificador (\`md\`); Categoría (omitido = \`compact\`); Estado (\`lg\`).
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
    filterOperatorAriaLabel: { control: 'text' },
    columnVisibilityLabel: { control: 'text' },
    columnVisibilityMenuLabel: { control: 'text' },
    columnVisibilityAriaLabel: { control: 'text' },
    resultCountTemplate: { control: 'text' },
    rowActionsHeader: { control: 'text' },
    expandColumnHeader: { control: 'text' },
    expandRowAriaLabel: { control: 'text' },
    collapseRowAriaLabel: { control: 'text' },
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
    totalItems: null,
    visibleColumnIds: null,
    sort: null,
    filters: [],
    pageIndex: 0,
    pageSize: 5,
    showFilters: true,
    columnVisibility: true,
    showResultCount: false,
    compact: null,
    emptyMessage: '',
    ariaLabel: '',
    paginationAriaLabel: '',
    previousLabel: '',
    nextLabel: '',
    filterPlaceholder: '',
    selectPlaceholder: '',
    selectClearLabel: '',
    filterOperatorAriaLabel: '',
    columnVisibilityLabel: '',
    columnVisibilityMenuLabel: '',
    columnVisibilityAriaLabel: '',
    resultCountTemplate: '',
    rowActionsHeader: '',
    expandColumnHeader: '',
    expandRowAriaLabel: '',
    collapseRowAriaLabel: '',
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
          'Estrecha el canvas: el chevron aparece cuando alguna columna no cumple su `showFrom`. Actualizado y Nombre (`always`) se quedan; Identificador entra desde 768px (`md`); Categoría desde 960px (default `compact`); Estado desde 1024px (`lg`). Filtros texto = `wi-input`; filtros select = `wi-select`.',
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
    filters: [{ columnId: 'categoria', value: 'INFRA', operator: 'equals' }],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filtro `filterType: "select"` con `wi-select`. Arranca en Categoría = Infraestructura (3 filas). Cambia o limpia el select: `(filtersChange)` emite y la tabla filtra en cliente. Layout ancho (`compact=false`) para ver ambos selects (Categoría y Estado).',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: TABLE_TEMPLATE,
  }),
};

/** Modo servidor: `totalItems` + página en `data`; la app reacciona a los events. */
export const ServerMode: Story = {
  name: 'Server mode',
  args: {
    data: ROWS.slice(0, 5),
    totalItems: ROWS.length,
    pageSize: 5,
    pageIndex: 0,
    showResultCount: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Con `[totalItems]` la tabla no filtra/ordena/pagina en cliente: `data` es solo la página actual. Aquí se muestra la primera página (5 de N). En la app, reacciona a `(filtersChange)` / `(sortChange)` / `(pageChange)` para pedir la página siguiente (ver Actions).',
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
          (pageIndexChange)="pageIndexChange($event)"
          (visibleColumnIdsChange)="visibleColumnIdsChange($event)"
        >
          <ng-template [wiTableCell]="'nombre'" let-row>
            <span class="font-medium text-on-surface">{{ row.nombre }}</span>
          </ng-template>
          <ng-template [wiTableCell]="'categoria'" let-value="value">
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
          (pageIndexChange)="pageIndexChange($event)"
          (visibleColumnIdsChange)="visibleColumnIdsChange($event)"
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
              [attr.aria-label]="'Acciones de ' + row.nombre"
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
          '`[compact]="true"` fuerza solo columnas `always` en la fila (demo a 360px). En la app, Auto usa el ancho del contenedor y `showFrom`. Actualizado y Nombre se quedan; el resto va a la tarjeta.',
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
            (sortChange)="sortChange($event)"
            (pageChange)="pageChange($event)"
            (filtersChange)="filtersChange($event)"
            (pageIndexChange)="pageIndexChange($event)"
            (visibleColumnIdsChange)="visibleColumnIdsChange($event)"
          >
            <ng-template wiTableRowActions let-row>
              <button
                type="button"
                class="inline-flex size-8 items-center justify-center rounded-control text-on-surface outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
                [wiMenuTrigger]="rowMenu"
                [attr.aria-label]="'Acciones de ' + row.nombre"
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
        story: 'Misma API que Default en tema oscuro. Los `wi-select` de filtro heredan tokens.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="wi-dark">
        ${TABLE_TEMPLATE}
      </div>
    `,
  }),
};
