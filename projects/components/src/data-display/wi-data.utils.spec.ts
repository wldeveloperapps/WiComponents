import type { WiColumnDef, WiColumnFilter } from '../../data-display/src/table/wi-column.types';
import {
  wiDefaultVisibleColumnIds,
  wiFilterRows,
  wiFormatCellValue,
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
