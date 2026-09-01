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
    'WiTableRowActionsContext',
    'WiTableCellContext',
    'WiColumnVisibilityComponent',
    'WiDataPaginationComponent',
    'WiColumnDef',
    'WiColumnShowFrom',
    'WiColumnFilter',
    'WiColumnFilterOption',
    'WiColumnFilterType',
    'WiFilterOperator',
    'WiFiltersChangeEvent',
    'WiPageChangeEvent',
    'WiSortChangeEvent',
    'WiSortDirection',
    'WiSortState',
    'WiDataDisplayI18n',
    'provideWiDataDisplayI18n',
    'WI_DEFAULT_FILTER_OPERATORS',
    'WI_TABLE_COMPACT_BREAKPOINT',
    'WI_TABLE_SHOW_FROM_MIN_WIDTH',
    'wiProcessRows',
    'wiFilterRows',
    'wiSortRows',
    'wiPageRows',
    'wiPageWindow',
    'wiVisibleColumns',
    'wiDefaultVisibleColumnIds',
    'wiInlineColumns',
    'wiCollapseColumns',
    'wiColumnShowFrom',
    'wiColumnMinInlineWidth',
    'wiCompareValues',
    'wiFormatCellValue',
    'wiGetColumnFilter',
    'wiMatchFilter',
    'wiReadCellValue',
    'wiUpsertColumnFilter',
  ],
  inputs: [
    {
      name: 'columns',
      type: 'readonly WiColumnDef[]',
      default: 'required',
      description:
        'Definición declarativa (la app adapta metadatos). Campos: id, header, field?, sortable?, filterable?, filterType? (text|select), filterOptions?, filterPlaceholder?, visible?, showFrom? (always|sm|md|compact|lg; omitido = compact / 960px de contenedor). Agnóstica a producto',
    },
    {
      name: 'data',
      type: 'readonly T[]',
      default: 'required',
      description: 'Filas. Cliente = dataset completo; servidor = página actual',
    },
    {
      name: 'totalItems',
      type: 'number | null',
      default: 'null',
      description:
        'Si se define, modo servidor: no filter/sort/page local; data es la página actual. Reaccionar a filtersChange / sortChange / pageChange',
    },
    {
      name: 'visibleColumnIds',
      type: 'readonly string[] | null (model)',
      default: 'null',
      description: 'Ids visibles; null = column.visible !== false. Two-way: visibleColumnIdsChange',
    },
    {
      name: 'sort',
      type: 'WiSortState | null (model)',
      default: 'null',
      description: 'Ordenación { columnId, direction }. Two-way: sortChange',
    },
    {
      name: 'filters',
      type: 'readonly WiColumnFilter[] (model)',
      default: '[]',
      description:
        'Filtros { columnId, value, operator? }. operator default contains (text) / equals (select); none desactiva. Two-way: filtersChange',
    },
    {
      name: 'pageIndex',
      type: 'number (model)',
      default: 0,
      description: 'Página 0-based. Two-way: pageIndexChange',
    },
    {
      name: 'pageSize',
      type: 'number',
      default: 10,
      description: 'Filas por página (cliente y servidor)',
    },
    {
      name: 'showFilters',
      type: 'boolean',
      default: true,
      description: 'Fila de filtros bajo cabeceras',
    },
    {
      name: 'columnVisibility',
      type: 'boolean',
      default: true,
      description: 'Menú N de M columnas visibles. Oculto cuando hay columnas fuera de la fila',
    },
    {
      name: 'showResultCount',
      type: 'boolean',
      default: false,
      description: 'Muestra el recuento con resultCountTemplate ({count})',
    },
    {
      name: 'compact',
      type: 'boolean | null',
      default: 'null',
      description:
        'null = según ancho del contenedor y showFrom. true = solo always en la fila; false = todas en la fila. El chevron/tarjeta salen si hay columnas fuera de la fila',
    },
    {
      name: 'trackBy',
      type: 'string | ((row: T, index: number) => string | number) | null',
      default: 'null',
      description: 'Clave de fila: nombre de campo (p. ej. id) o función. Recomendado',
    },
    {
      name: 'filterOperators',
      type: 'readonly { value: WiFilterOperator; label: string }[] | undefined',
      default: 'undefined → provideWiDataDisplayI18n.filterOperators',
      description: 'Etiquetas del menú de operador por columna filterable',
    },
    {
      name: 'emptyMessage',
      type: 'string | undefined',
      default: 'undefined → i18n.emptyMessage',
      description: 'Texto cuando no hay filas (override de instancia)',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.tableAriaLabel',
      description: 'Nombre accesible del host (role=region)',
    },
    {
      name: 'paginationAriaLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.paginationAriaLabel',
      description: 'aria-label de la paginación',
    },
    {
      name: 'previousLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.previousLabel',
      description: 'Texto del botón anterior',
    },
    {
      name: 'nextLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.nextLabel',
      description: 'Texto del botón siguiente',
    },
    {
      name: 'filterPlaceholder',
      type: 'string | undefined',
      default: 'undefined → i18n.filterPlaceholder / column.filterPlaceholder',
      description: 'Placeholder de filtro texto si la columna no trae el suyo',
    },
    {
      name: 'selectPlaceholder',
      type: 'string | undefined',
      default: 'undefined → i18n.selectPlaceholder',
      description: 'Placeholder de filtro select',
    },
    {
      name: 'filterOperatorAriaLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.filterOperatorAriaLabel',
      description: 'aria-label del menú de operador de filtro',
    },
    {
      name: 'columnVisibilityLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.columnVisibilitySummary',
      description:
        'Plantilla del resumen N de M ({visible}/{total}). El campo i18n se llama columnVisibilitySummary',
    },
    {
      name: 'columnVisibilityMenuLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.columnVisibilityMenuLabel',
      description: 'Título del menú de visibilidad',
    },
    {
      name: 'columnVisibilityAriaLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.columnVisibilityAriaLabel',
      description: 'aria-label del trigger de visibilidad',
    },
    {
      name: 'resultCountTemplate',
      type: 'string | undefined',
      default: 'undefined → i18n.resultCountTemplate',
      description: 'Plantilla del recuento; {count} lo sustituye Wi',
    },
    {
      name: 'rowActionsHeader',
      type: 'string | undefined',
      default: 'undefined → i18n.rowActionsHeader',
      description: 'Cabecera de la columna de acciones por fila',
    },
    {
      name: 'expandColumnHeader',
      type: 'string | undefined',
      default: 'undefined → i18n.expandColumnHeader',
      description: 'Cabecera (sr-only) de la columna chevron',
    },
    {
      name: 'expandRowAriaLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.expandRowAriaLabel',
      description: 'aria-label para abrir la tarjeta de columnas colapsadas',
    },
    {
      name: 'collapseRowAriaLabel',
      type: 'string | undefined',
      default: 'undefined → i18n.collapseRowAriaLabel',
      description: 'aria-label para cerrar la tarjeta',
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
      name: 'visibleColumnIdsChange',
      type: 'readonly string[] | null',
      description: 'Output del model visibleColumnIds',
    },
    {
      name: 'pageIndexChange',
      type: 'number',
      description: 'Output del model pageIndex',
    },
    {
      name: 'pageChange',
      type: 'WiPageChangeEvent',
      description: 'Cambio de página { pageIndex, pageSize } (además de pageIndexChange)',
    },
  ],
  i18n: {
    provider: 'provideWiDataDisplayI18n',
    fields: [
      { name: 'emptyMessage', description: 'Sin filas', default: 'No data' },
      { name: 'tableAriaLabel', description: 'aria-label del host', default: 'Data table' },
      {
        name: 'paginationAriaLabel',
        description: 'aria-label de la paginación',
        default: 'Pagination',
      },
      { name: 'previousLabel', description: 'Botón anterior', default: 'Previous' },
      { name: 'nextLabel', description: 'Botón siguiente', default: 'Next' },
      {
        name: 'filterPlaceholder',
        description: 'Placeholder filtro texto',
        default: 'Type to search',
      },
      {
        name: 'selectPlaceholder',
        description: 'Placeholder filtro select',
        default: 'Select one',
      },
      {
        name: 'filterOperatorAriaLabel',
        description: 'aria-label del operador',
        default: 'Filter operator',
      },
      {
        name: 'filterAriaLabel',
        description: '(header) => aria del input de filtro; no hay input de instancia',
        default: 'Filter ${header}',
      },
      {
        name: 'columnVisibilitySummary',
        description: 'Plantilla {visible}/{total}; input override: columnVisibilityLabel',
        default: '{visible} of {total} columns visible',
      },
      {
        name: 'columnVisibilityMenuLabel',
        description: 'Título del menú de columnas',
        default: 'Columns',
      },
      {
        name: 'columnVisibilityAriaLabel',
        description: 'aria-label del trigger',
        default: 'Column visibility',
      },
      {
        name: 'resultCountTemplate',
        description: 'Plantilla {count}',
        default: '{count} results',
      },
      { name: 'rowActionsHeader', description: 'Cabecera de acciones', default: 'Actions' },
      {
        name: 'expandColumnHeader',
        description: 'Cabecera sr-only del chevron',
        default: 'More',
      },
      {
        name: 'expandRowAriaLabel',
        description: 'Abrir tarjeta de columnas colapsadas',
        default: 'Show hidden columns',
      },
      {
        name: 'collapseRowAriaLabel',
        description: 'Cerrar tarjeta',
        default: 'Hide extra columns',
      },
      {
        name: 'filterOperators',
        description: 'Etiquetas contains|notContains|startsWith|endsWith|equals|notEquals|none',
        default: 'WI_DEFAULT_FILTER_OPERATORS (EN)',
      },
    ],
    productCopy:
      'Cabeceras, placeholders de columna, opciones de select, filas y acciones: WiColumnDef + data + proyección (la app / i18n de pantalla)',
  },
  variants: [
    {
      name: 'showFrom',
      description:
        'Por columna: always (0) | sm (640) | md (768) | compact (960, default) | lg (1024). Corte = ancho del contenedor',
    },
  ],
  parts: [
    {
      selector: 'wi-table',
      description: 'Host; columns / data / models / compact / trackBy',
    },
    {
      selector: '[wiTableSummary]',
      description: 'Proyección a la izquierda del toolbar (contador custom, título…)',
    },
    {
      selector: '[wiTableActions]',
      description: 'Proyección a la derecha del toolbar (botones de app)',
    },
    {
      selector: 'ng-template[wiTableCell]',
      description:
        'Celda custom por columnId: [wiTableCell]="\'id\'" let-row let-value="value" (WiTableCellContext)',
    },
    {
      selector: 'ng-template[wiTableRowActions]',
      description: 'Columna leading de acciones: let-row (WiTableRowActionsContext)',
    },
  ],
  keyboard: [
    'Enter / Space en cabecera sortable (aria-sort)',
    'Enter / Space en chevron de fila (aria-expanded)',
    'Enter / Space en menús de filtro, operador y visibilidad',
    'Paginación por botones Anterior / Siguiente / número',
  ],
  a11yNotes:
    'Host role=region + aria-label (ariaLabel / tableAriaLabel). Tabla semántica con aria-sort. Filtros con aria-label por columna vía filterAriaLabel(header). Chevron cuando hay columnas fuera de la fila (showFrom vs ancho del contenedor) con expandRowAriaLabel / collapseRowAriaLabel. Visibilidad vía wi-menu, oculta en compacto. Labels de chrome: provideWiDataDisplayI18n (sin copy hardcodeado ES). Cabeceras y datos: solo la app.',
  example: {
    import: `import {
  WiTableComponent,
  WiTableCellDirective,
  WiTableRowActionsDirective,
  provideWiDataDisplayI18n,
  type WiColumnDef,
  type WiColumnFilter,
  type WiSortState,
} from '@wiloc/ui/data-display';

const columns: WiColumnDef[] = [
  {
    id: 'name',
    header: 'Nombre',
    field: 'name',
    sortable: true,
    filterable: true,
    showFrom: 'always',
  },
  { id: 'city', header: 'Ciudad', field: 'city', sortable: true, filterable: true },
  {
    id: 'status',
    header: 'Estado',
    field: 'status',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' },
    ],
  },
];

provideWiDataDisplayI18n({
  emptyMessage: () => 'No hay datos',
  tableAriaLabel: () => 'Tabla de datos',
  previousLabel: () => 'Anterior',
  nextLabel: () => 'Siguiente',
  filterAriaLabel: (header) => \`Filtrar \${header}\`,
  expandRowAriaLabel: () => 'Mostrar columnas ocultas',
  collapseRowAriaLabel: () => 'Ocultar columnas extra',
});`,
    template: `<wi-table
  [columns]="columns"
  [data]="rows"
  [(filters)]="filters"
  [(sort)]="sort"
  [(pageIndex)]="pageIndex"
  [pageSize]="10"
  showResultCount
  [ariaLabel]="tableAria"
  [emptyMessage]="tableEmpty"
  trackBy="id"
>
  <span wiTableSummary>Resultados</span>
  <div wiTableActions>…</div>
  <ng-template [wiTableCell]="'status'" let-value="value">{{ value }}</ng-template>
  <ng-template wiTableRowActions let-row>…</ng-template>
</wi-table>
<!-- compact null: showFrom vs ancho del contenedor. Ciudad/Estado van al panel bajo 960px (default compact). -->`,
  },
} as const;
