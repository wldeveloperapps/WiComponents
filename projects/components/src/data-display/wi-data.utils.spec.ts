import type { WiColumnDef, WiColumnFilter } from '../../data-display/src/table/wi-column.types';
import {
  wiCollapseColumns,
  wiColumnMinInlineWidth,
  wiColumnShowFrom,
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

  it('resolves omitted showFrom as compact (960px)', () => {
    const column: WiColumnDef = { id: 'city', header: 'City', field: 'city' };
    expect(wiColumnShowFrom(column)).toBe('compact');
    expect(wiColumnMinInlineWidth(column)).toBe(960);
    expect(wiColumnMinInlineWidth({ id: 'n', header: 'N', showFrom: 'always' })).toBe(0);
    expect(wiColumnMinInlineWidth({ id: 's', header: 'S', showFrom: 'sm' })).toBe(640);
  });

  it('splits inline vs collapse columns by container width and showFrom', () => {
    const columns: WiColumnDef[] = [
      { id: 'always', header: 'A', field: 'a', showFrom: 'always' },
      { id: 'sm', header: 'S', field: 's', showFrom: 'sm' },
      { id: 'md', header: 'M', field: 'm', showFrom: 'md' },
      { id: 'compact', header: 'C', field: 'c' },
      { id: 'lg', header: 'L', field: 'l', showFrom: 'lg' },
    ];

    expect(wiInlineColumns(columns, 0).map((c) => c.id)).toEqual(['always']);
    expect(wiCollapseColumns(columns, 0).map((c) => c.id)).toEqual(['sm', 'md', 'compact', 'lg']);

    expect(wiInlineColumns(columns, 700).map((c) => c.id)).toEqual(['always', 'sm']);
    expect(wiInlineColumns(columns, 900).map((c) => c.id)).toEqual(['always', 'sm', 'md']);
    expect(wiInlineColumns(columns, 960).map((c) => c.id)).toEqual(['always', 'sm', 'md', 'compact']);
    expect(wiInlineColumns(columns, 1100).map((c) => c.id)).toEqual([
      'always',
      'sm',
      'md',
      'compact',
      'lg',
    ]);
    expect(wiCollapseColumns(columns, 1100)).toEqual([]);
  });

  it('keeps the first column inline when none meet the cutoff', () => {
    const allLate: WiColumnDef[] = [
      { id: 'a', header: 'A', field: 'a', showFrom: 'lg' },
      { id: 'b', header: 'B', field: 'b', showFrom: 'lg' },
    ];
    expect(wiInlineColumns(allLate, 0).map((c) => c.id)).toEqual(['a']);
    expect(wiCollapseColumns(allLate, 0).map((c) => c.id)).toEqual(['b']);
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
