/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiTableRegistryEntry = {
  name: 'table',
  selector: 'wi-table',
  entryPoint: '@wiloc/ui/data-display',
  status: 'experimental' as const,
  exports: [
    'WiTableComponent',
    'WiTableCellDirective',
    'WiTableRowActionsDirective',
    'WiColumnVisibilityComponent',
    'WiDataPaginationComponent',
    'WiColumnDef',
    'WiColumnPriority',
    'WiColumnFilter',
    'WiSortState',
    'WiPageChangeEvent',
    'WiDataDisplayI18n',
    'provideWiDataDisplayI18n',
    'WI_DEFAULT_FILTER_OPERATORS',
    'WI_TABLE_COMPACT_BREAKPOINT',
    'wiProcessRows',
    'wiFilterRows',
    'wiSortRows',
    'wiPageRows',
    'wiVisibleColumns',
    'wiInlineColumns',
    'wiCollapseColumns',
    'wiColumnPriority',
  ],
  inputs: [
    {
      name: 'columns',
      type: 'readonly WiColumnDef[]',
      default: 'required',
      description:
        'Definición declarativa. priority omitido = collapse: en compacto va a la tarjeta y el chevron aparece si hay columnas extra. priority always = se queda en la fila. Agnóstica a metadatos; la app adapta',
    },
    {
      name: 'data',
      type: 'readonly T[]',
      default: 'required',
      description: 'Filas. Cliente = dataset; servidor = página actual',
    },
    {
      name: 'totalItems',
      type: 'number | null',
      default: 'null',
      description: 'Si se define, modo servidor (no filter/sort/page local)',
    },
    {
      name: 'filters',
      type: 'readonly WiColumnFilter[]',
      default: '[]',
      description: 'Estado de filtros (model)',
    },
    {
      name: 'visibleColumnIds',
      type: 'readonly string[] | null',
      default: 'null',
      description: 'Visibilidad de columnas (model); null = defaults',
    },
    {
      name: 'sort',
      type: 'WiSortState | null',
      default: 'null',
      description: 'Ordenación (model)',
    },
    {
      name: 'pageIndex',
      type: 'number',
      default: '0',
      description: 'Página 0-based (model)',
    },
    {
      name: 'columnVisibility',
      type: 'boolean',
      default: 'true',
      description: 'Muestra el menú N de M columnas visibles. Oculto en layout compacto',
    },
    {
      name: 'showFilters',
      type: 'boolean',
      default: 'true',
      description: 'Fila de filtros bajo cabeceras',
    },
    {
      name: 'compact',
      type: 'boolean | null',
      default: 'null',
      description:
        'null (default) = compacto automático si el contenedor < 960px (WI_TABLE_COMPACT_BREAKPOINT): sin scroll lateral ni menú de visibilidad. El chevron/tarjeta aparecen cuando hay columnas que no quedan en la fila (priority omitido = collapse). true/false fuerzan el modo (false = nunca chevron)',
    },
    {
      name: 'emptyMessage / previousLabel / …',
      type: 'string | undefined',
      default: 'undefined → provideWiDataDisplayI18n',
      description:
        'Overrides opcionales de chrome i18n (vacío, paginación, filtros, columnas). Preferir provideWiDataDisplayI18n a nivel app',
    },
  ],
  outputs: [
    {
      name: 'sortChange',
      type: 'WiSortState | null',
      description: 'Output del model sort',
    },
    {
      name: 'filtersChange',
      type: 'readonly WiColumnFilter[]',
      description: 'Output del model filters',
    },
    {
      name: 'pageChange',
      type: 'WiPageChangeEvent',
      description: 'Cambio de página',
    },
  ],
  variants: [],
  keyboard: ['Enter/Space en sort, expand de fila y menús; paginación por botones'],
  a11yNotes:
    'Chevron de fila en compacto cuando hay columnas fuera de la fila (priority default collapse) con aria-expanded y aria-label vía provideWiDataDisplayI18n.expandRowAriaLabel / collapseRowAriaLabel. Tabla semántica con aria-sort. Filtros con aria-label por columna. Visibilidad vía wi-menu (oculto en compacto). Labels de chrome: provideWiDataDisplayI18n (sin copy hardcodeado ES).',
  example: {
    import: `import {
  WiTableComponent,
  provideWiDataDisplayI18n,
  type WiColumnDef,
} from '@wiloc/ui/data-display';

const columns: WiColumnDef[] = [
  { id: 'name', header: 'Nombre', field: 'name', priority: 'always' },
  { id: 'email', header: 'Email', field: 'email' },
];

provideWiDataDisplayI18n({
  emptyMessage: () => 'No hay datos',
  previousLabel: () => 'Anterior',
  nextLabel: () => 'Siguiente',
  filterAriaLabel: (header) => \`Filtrar \${header}\`,
});`,
    template: `<wi-table [columns]="columns" [data]="rows" trackBy="id" [showResultCount]="true">
  <div wiTableActions>…</div>
  <ng-template wiTableRowActions let-row>…</ng-template>
</wi-table>
<!-- compact null = automático < 960px. Email va al panel (default collapse). Chevron sin [compact]="true". -->`,
  },
} as const;
