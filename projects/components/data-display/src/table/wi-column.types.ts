/**
 * Definición declarativa de columna (contrato Wi).
 * La app (p. ej. adapters de metadatos) traduce su schema a este tipo.
 * La librería no conoce schemas de producto ni orígenes de datos.
 */
export interface WiColumnDef {
  /** Identificador estable de columna (sort, templates, visibility). */
  id: string;
  /** Texto de cabecera / etiqueta (i18n lo resuelve la app). */
  header: string;
  /**
   * Clave en la fila para el valor por defecto.
   * Si se omite, hace falta un template de celda o el valor queda vacío.
   */
  field?: string;
  /** Si la columna admite ordenación. */
  sortable?: boolean;
  /** Si muestra control de filtro en la fila de filtros. */
  filterable?: boolean;
  /** Tipo de control de filtro. Default `text` si `filterable`. */
  filterType?: WiColumnFilterType;
  /** Opciones para `filterType: 'select'`. */
  filterOptions?: readonly WiColumnFilterOption[];
  /** Placeholder del input de filtro (i18n desde la app). */
  filterPlaceholder?: string;
  /**
   * Visibilidad inicial. `false` oculta la columna
   * hasta que la app la reactive vía `visibleColumnIds`.
   */
  visible?: boolean;
  /**
   * Ancho mínimo del contenedor para mostrar la columna en la fila.
   * Omitido = `'compact'` (960px): por debajo va a la tarjeta.
   * `'always'` permanece en la fila a cualquier ancho.
   * Si ninguna columna entra en la fila, se deja la primera visible.
   */
  showFrom?: WiColumnShowFrom;
}

/**
 * Corte de visibilidad en fila (`showFrom`).
 * `sm` 640 · `md` 768 · `compact` 960 · `lg` 1024 (px, ancho del contenedor).
 */
export type WiColumnShowFrom = 'always' | 'sm' | 'md' | 'compact' | 'lg';

/** Ancho mínimo (px) para cada `showFrom` distinto de `always`. */
export const WI_TABLE_SHOW_FROM_MIN_WIDTH = {
  sm: 640,
  md: 768,
  compact: 960,
  lg: 1024,
} as const satisfies Record<Exclude<WiColumnShowFrom, 'always'>, number>;

/** Alias de `WI_TABLE_SHOW_FROM_MIN_WIDTH.compact`. */
export const WI_TABLE_COMPACT_BREAKPOINT = WI_TABLE_SHOW_FROM_MIN_WIDTH.compact;

export type WiColumnFilterType = 'text' | 'select';

export interface WiColumnFilterOption {
  label: string;
  value: string;
}

export type WiFilterOperator =
  'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'none';

export interface WiColumnFilter {
  columnId: string;
  value: string;
  /** Default: `contains` (text) / `equals` (select). `none` desactiva el filtro. */
  operator?: WiFilterOperator;
}

export type WiSortDirection = 'asc' | 'desc';

export interface WiSortState {
  columnId: string;
  direction: WiSortDirection;
}

export interface WiSortChangeEvent {
  columnId: string;
  /** `null` = sin ordenación. */
  direction: WiSortDirection | null;
}

export interface WiPageChangeEvent {
  pageIndex: number;
  pageSize: number;
}

export interface WiFiltersChangeEvent {
  filters: readonly WiColumnFilter[];
}

export interface WiTableCellContext<T = unknown> {
  $implicit: T;
  row: T;
  column: WiColumnDef;
  value: unknown;
}

/** Operadores de texto con etiquetas por defecto (la app puede sustituir en UI). */
export const WI_DEFAULT_FILTER_OPERATORS: readonly {
  value: WiFilterOperator;
  label: string;
}[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does not contain' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Does not equal' },
  { value: 'none', label: 'No filter' },
];
