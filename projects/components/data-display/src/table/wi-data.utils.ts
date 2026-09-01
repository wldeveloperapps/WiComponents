import {
  WI_TABLE_SHOW_FROM_MIN_WIDTH,
  type WiColumnDef,
  type WiColumnFilter,
  type WiColumnShowFrom,
  type WiFilterOperator,
  type WiSortState,
} from './wi-column.types';

/** Columnas visibles (default `visible !== false`). */
export function wiVisibleColumns(
  columns: readonly WiColumnDef[],
  visibleColumnIds?: readonly string[] | null,
): WiColumnDef[] {
  if (visibleColumnIds == null) {
    return columns.filter((column) => column.visible !== false);
  }
  const allowed = new Set(visibleColumnIds);
  return columns.filter((column) => allowed.has(column.id) && column.visible !== false);
}

/** Ids visibles por defecto según `column.visible`. */
export function wiDefaultVisibleColumnIds(columns: readonly WiColumnDef[]): string[] {
  return columns.filter((column) => column.visible !== false).map((column) => column.id);
}

/** `showFrom` efectivo (`compact` si se omite). */
export function wiColumnShowFrom(column: WiColumnDef): WiColumnShowFrom {
  return column.showFrom ?? 'compact';
}

/** Ancho mínimo del contenedor para pintar la columna en la fila (`0` = always). */
export function wiColumnMinInlineWidth(column: WiColumnDef): number {
  const showFrom = wiColumnShowFrom(column);
  if (showFrom === 'always') {
    return 0;
  }
  return WI_TABLE_SHOW_FROM_MIN_WIDTH[showFrom];
}

/**
 * Columnas que permanecen en la fila a `containerWidth` px.
 * Si ninguna cumple el corte, se deja la primera visible.
 */
export function wiInlineColumns(
  columns: readonly WiColumnDef[],
  containerWidth: number,
): WiColumnDef[] {
  const inline = columns.filter((column) => containerWidth >= wiColumnMinInlineWidth(column));
  return inline.length > 0 ? inline : columns.slice(0, 1);
}

/** Columnas que van al panel expandible a `containerWidth` px. */
export function wiCollapseColumns(
  columns: readonly WiColumnDef[],
  containerWidth: number,
): WiColumnDef[] {
  const inlineIds = new Set(wiInlineColumns(columns, containerWidth).map((column) => column.id));
  return columns.filter((column) => !inlineIds.has(column.id));
}

export function wiReadCellValue(row: unknown, field: string | undefined): unknown {
  if (field == null || field === '' || row == null || typeof row !== 'object') {
    return undefined;
  }
  return (row as Record<string, unknown>)[field];
}

export function wiFormatCellValue(value: unknown): string {
  if (value == null) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return String(value);
}

export function wiCompareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return -1;
  }
  if (b == null) {
    return 1;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function defaultOperator(column: WiColumnDef): WiFilterOperator {
  return column.filterType === 'select' ? 'equals' : 'contains';
}

export function wiMatchFilter(
  cellValue: unknown,
  filter: WiColumnFilter,
  column: WiColumnDef,
): boolean {
  const operator = filter.operator ?? defaultOperator(column);
  if (operator === 'none') {
    return true;
  }
  const needle = filter.value.trim();
  if (needle === '' && column.filterType !== 'select') {
    return true;
  }
  const haystack = wiFormatCellValue(cellValue).toLocaleLowerCase();
  const target = needle.toLocaleLowerCase();

  switch (operator) {
    case 'contains':
      return haystack.includes(target);
    case 'notContains':
      return !haystack.includes(target);
    case 'startsWith':
      return haystack.startsWith(target);
    case 'endsWith':
      return haystack.endsWith(target);
    case 'equals':
      return haystack === target;
    case 'notEquals':
      return haystack !== target;
    default:
      return true;
  }
}

/** Filtrado en cliente. */
export function wiFilterRows<T>(
  rows: readonly T[],
  filters: readonly WiColumnFilter[] | null | undefined,
  columns: readonly WiColumnDef[],
): T[] {
  if (filters == null || filters.length === 0) {
    return [...rows];
  }
  const byId = new Map(columns.map((column) => [column.id, column]));
  return rows.filter((row) =>
    filters.every((filter) => {
      const column = byId.get(filter.columnId);
      if (!column?.filterable) {
        return true;
      }
      return wiMatchFilter(wiReadCellValue(row, column.field), filter, column);
    }),
  );
}

/** Ordenación en cliente (demos / datasets pequeños). */
export function wiSortRows<T>(
  rows: readonly T[],
  sort: WiSortState | null | undefined,
  columns: readonly WiColumnDef[],
): T[] {
  if (sort == null) {
    return [...rows];
  }
  const column = columns.find((item) => item.id === sort.columnId);
  if (column?.field == null) {
    return [...rows];
  }
  const direction = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort(
    (left, right) =>
      direction *
      wiCompareValues(wiReadCellValue(left, column.field), wiReadCellValue(right, column.field)),
  );
}

/** Paginación en cliente. */
export function wiPageRows<T>(rows: readonly T[], pageIndex: number, pageSize: number): T[] {
  if (pageSize <= 0) {
    return [...rows];
  }
  const safeIndex = Math.max(0, pageIndex);
  const start = safeIndex * pageSize;
  return rows.slice(start, start + pageSize);
}

/** Pipeline cliente: filter → sort → page. */
export function wiProcessRows<T>(
  rows: readonly T[],
  options: {
    columns: readonly WiColumnDef[];
    filters?: readonly WiColumnFilter[] | null;
    sort?: WiSortState | null;
    pageIndex: number;
    pageSize: number;
  },
): { rows: T[]; total: number } {
  const filtered = wiFilterRows(rows, options.filters, options.columns);
  const sorted = wiSortRows(filtered, options.sort, options.columns);
  return {
    total: sorted.length,
    rows: wiPageRows(sorted, options.pageIndex, options.pageSize),
  };
}

/** Ventana de índices de página (0-based) alrededor de la actual. */
export function wiPageWindow(pageIndex: number, totalPages: number, maxButtons = 5): number[] {
  if (totalPages <= 0) {
    return [0];
  }
  const size = Math.min(maxButtons, totalPages);
  let start = Math.max(0, pageIndex - Math.floor(size / 2));
  const end = Math.min(totalPages, start + size);
  start = Math.max(0, end - size);
  return Array.from({ length: end - start }, (_, offset) => start + offset);
}

export function wiGetColumnFilter(
  filters: readonly WiColumnFilter[] | null | undefined,
  columnId: string,
): WiColumnFilter | undefined {
  return filters?.find((filter) => filter.columnId === columnId);
}

export function wiUpsertColumnFilter(
  filters: readonly WiColumnFilter[] | null | undefined,
  next: WiColumnFilter,
): WiColumnFilter[] {
  const list = [...(filters ?? [])];
  const index = list.findIndex((filter) => filter.columnId === next.columnId);
  const isEmpty =
    next.operator === 'none' ||
    (next.value.trim() === '' && next.operator !== 'equals' && next.operator !== 'notEquals');

  if (isEmpty && (next.operator === 'none' || next.value.trim() === '')) {
    if (index >= 0) {
      list.splice(index, 1);
    }
    return list;
  }

  if (index >= 0) {
    list[index] = next;
  } else {
    list.push(next);
  }
  return list;
}
