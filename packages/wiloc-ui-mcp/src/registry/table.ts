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
    'WiColumnShowFrom',
    'WiColumnFilter',
    'WiSortState',
    'WiPageChangeEvent',
    'WiDataDisplayI18n',
    'provideWiDataDisplayI18n',
    'WI_DEFAULT_FILTER_OPERATORS',
    'WI_TABLE_COMPACT_BREAKPOINT',
    'WI_TABLE_SHOW_FROM_MIN_WIDTH',
    'wiProcessRows',
    'wiFilterRows',
    'wiSortRows',
    'wiPageRows',
    'wiVisibleColumns',
    'wiInlineColumns',
    'wiCollapseColumns',
    'wiColumnShowFrom',
    'wiColumnMinInlineWidth',
  ],
  inputs: [
    {
      name: 'columns',
      type: 'readonly WiColumnDef[]',
      default: 'required',
      description:
        'Definición declarativa. showFrom omitido = compact (960px de contenedor): por debajo va a la tarjeta. always se queda en la fila. sm 640 / md 768 / lg 1024. Agnóstica a metadatos; la app adapta',
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
        'null (default) = según el ancho del contenedor y showFrom de cada columna. El chevron/tarjeta aparecen cuando hay columnas fuera de la fila. true = solo always en la fila; false = todas en la fila',
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
    'Chevron de fila cuando hay columnas fuera de la fila (showFrom vs ancho del contenedor) con aria-expanded y aria-label vía provideWiDataDisplayI18n.expandRowAriaLabel / collapseRowAriaLabel. Tabla semántica con aria-sort. Filtros con aria-label por columna. Visibilidad vía wi-menu (oculto en compacto). Labels de chrome: provideWiDataDisplayI18n (sin copy hardcodeado ES).',
  example: {
    import: `import {
  WiTableComponent,
  provideWiDataDisplayI18n,
  type WiColumnDef,
} from '@wiloc/ui/data-display';

const columns: WiColumnDef[] = [
  { id: 'name', header: 'Nombre', field: 'name', showFrom: 'always' },
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
<!-- compact null = automático según ancho y showFrom. Email va al panel bajo 960px (default compact). -->`,
  },
} as const;
