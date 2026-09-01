import type { WiColumnDef, WiColumnFilter } from '../../data-display/src/table/wi-column.types';
import {
  wiCollapseColumns,
  wiDefaultVisibleColumnIds,
  wiFilterRows,
  wiFormatCellValue,
  wiInlineColumns,
  wiPageRows,
  wiPageWindow,
  wiProcessRows,
  wiReadCellValue,
  wiSortRows,
  wiUpsertColumnFilter,
  wiVisibleColumns,
} from '../../data-display/src/table/wi-data.utils';

describe('wi-data.utils', () => {
  const columns: WiColumnDef[] = [
    { id: 'name', header: 'Name', field: 'name', filterable: true },
    { id: 'age', header: 'Age', field: 'age', visible: false },
    { id: 'city', header: 'City', field: 'city', filterable: true },
  ];

  it('filters visible columns and respects visibleColumnIds', () => {
    expect(wiVisibleColumns(columns).map((c) => c.id)).toEqual(['name', 'city']);
    expect(wiVisibleColumns(columns, ['city']).map((c) => c.id)).toEqual(['city']);
    expect(wiDefaultVisibleColumnIds(columns)).toEqual(['name', 'city']);
  });

  it('reads and formats cell values', () => {
    expect(wiReadCellValue({ name: 'Ada' }, 'name')).toBe('Ada');
    expect(wiFormatCellValue(null)).toBe('');
    expect(wiFormatCellValue(3)).toBe('3');
  });

  it('filters, sorts and pages rows', () => {
    const rows = [
      { name: 'b', age: 2, city: 'Madrid' },
      { name: 'a', age: 1, city: 'Sevilla' },
      { name: 'ab', age: 3, city: 'Madrid' },
    ];
    const filters: WiColumnFilter[] = [{ columnId: 'city', value: 'Madrid', operator: 'equals' }];
    const filtered = wiFilterRows(rows, filters, columns);
    expect(filtered).toHaveLength(2);

    const sorted = wiSortRows(filtered, { columnId: 'name', direction: 'asc' }, columns);
    expect(sorted.map((row) => row.name)).toEqual(['ab', 'b']);
    expect(wiPageRows(sorted, 0, 1)).toHaveLength(1);

    const processed = wiProcessRows(rows, {
      columns,
      filters,
      sort: { columnId: 'name', direction: 'asc' },
      pageIndex: 0,
      pageSize: 1,
    });
    expect(processed.total).toBe(2);
    expect(processed.rows[0]?.name).toBe('ab');
  });

  it('splits inline vs collapse columns in compact mode', () => {
    const unmarked: WiColumnDef[] = [
      { id: 'name', header: 'Name', field: 'name' },
      { id: 'city', header: 'City', field: 'city' },
      { id: 'age', header: 'Age', field: 'age' },
    ];
    expect(wiInlineColumns(unmarked, true).map((c) => c.id)).toEqual(['name']);
    expect(wiCollapseColumns(unmarked, true).map((c) => c.id)).toEqual(['city', 'age']);

    const withAlways: WiColumnDef[] = [
      { id: 'name', header: 'Name', field: 'name', priority: 'always' },
      { id: 'city', header: 'City', field: 'city' },
      { id: 'age', header: 'Age', field: 'age', priority: 'always' },
    ];
    expect(wiInlineColumns(withAlways, true).map((c) => c.id)).toEqual(['name', 'age']);
    expect(wiCollapseColumns(withAlways, true).map((c) => c.id)).toEqual(['city']);
    expect(wiCollapseColumns(withAlways, false)).toEqual([]);
  });

  it('keeps the first column inline when every column is collapse', () => {
    const allCollapse: WiColumnDef[] = [
      { id: 'a', header: 'A', field: 'a', priority: 'collapse' },
      { id: 'b', header: 'B', field: 'b', priority: 'collapse' },
    ];
    expect(wiInlineColumns(allCollapse, true).map((c) => c.id)).toEqual(['a']);
    expect(wiCollapseColumns(allCollapse, true).map((c) => c.id)).toEqual(['b']);
  });

  it('upserts filters and builds page windows', () => {
    const next = wiUpsertColumnFilter([], {
      columnId: 'name',
      value: 'a',
      operator: 'contains',
    });
    expect(next).toEqual([{ columnId: 'name', value: 'a', operator: 'contains' }]);
    expect(wiPageWindow(0, 10, 5)).toEqual([0, 1, 2, 3, 4]);
    expect(wiPageWindow(8, 10, 5)).toEqual([5, 6, 7, 8, 9]);
  });
});
