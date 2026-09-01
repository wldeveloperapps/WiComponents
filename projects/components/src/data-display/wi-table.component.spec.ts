import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { WiColumnDef, WiSortState } from '../../data-display/src/table/wi-column.types';
import { WiTableCellDirective } from '../../data-display/src/table/wi-table-cell.directive';
import { WiTableComponent } from '../../data-display/src/table/wi-table.component';
import { WiTableRowActionsDirective } from '../../data-display/src/table/wi-table-row-actions.directive';

interface Row {
  id: string;
  name: string;
  score: number;
  company: string;
}

const COLUMNS: WiColumnDef[] = [
  { id: 'name', header: 'Nombre', field: 'name', sortable: true, filterable: true },
  {
    id: 'company',
    header: 'Empresa',
    field: 'company',
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Acme', value: 'Acme' },
      { label: 'Nova', value: 'Nova' },
    ],
  },
  { id: 'score', header: 'Puntos', field: 'score', sortable: true },
];

const ROWS: Row[] = [
  { id: '1', name: 'Zeta', score: 10, company: 'Acme' },
  { id: '2', name: 'Alpha', score: 30, company: 'Nova' },
  { id: '3', name: 'Beta', score: 20, company: 'Acme' },
  { id: '4', name: 'Gamma', score: 5, company: 'Nova' },
];

@Component({
  imports: [WiTableComponent, WiTableCellDirective, WiTableRowActionsDirective],
  template: `
    <wi-table
      [columns]="columns()"
      [data]="data()"
      [pageSize]="pageSize()"
      [totalItems]="totalItems()"
      [columnVisibility]="true"
      [showResultCount]="true"
      [compact]="compact()"
      [(sort)]="sort"
      [(pageIndex)]="pageIndex"
      trackBy="id"
      emptyMessage="Vacío"
      (sortChange)="lastSort = $event"
      (pageChange)="lastPage = $event"
      (filtersChange)="lastFilters = $event"
    >
      @if (useTemplate()) {
        <ng-template [wiTableCell]="'name'" let-row>
          <strong class="custom-name">{{ row.name }}</strong>
        </ng-template>
      }
      @if (withActions()) {
        <ng-template wiTableRowActions let-row>
          <span class="row-action">{{ row.id }}</span>
        </ng-template>
      }
    </wi-table>
  `,
})
class WiTableHostComponent {
  readonly columns = signal(COLUMNS);
  readonly data = signal(ROWS);
  readonly pageSize = signal(2);
  readonly totalItems = signal<number | null>(null);
  readonly useTemplate = signal(false);
  readonly withActions = signal(false);
  readonly compact = signal<boolean | null>(null);
  readonly sort = signal<WiSortState | null>(null);
  readonly pageIndex = signal(0);
  lastSort: unknown;
  lastPage: unknown;
  lastFilters: unknown;
}

describe('WiTableComponent', () => {
  let fixture: ComponentFixture<WiTableHostComponent>;
  let host: WiTableHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiTableHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiTableHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function table(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-table');
  }

  it('renders headers, filters, visibility and client-paged rows', () => {
    const el = table();
    expect(el.classList.contains('wi-table')).toBe(true);
    expect(el.querySelector('wi-column-visibility')).toBeTruthy();
    expect(el.querySelectorAll('.wi-table__filter-input, .wi-table__filter-select').length).toBe(2);
    expect(el.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('sorts client-side and emits sortChange', async () => {
    const button = table().querySelector('thead button.wi-table__sort') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.lastSort).toEqual({ columnId: 'name', direction: 'asc' });
    const cells = Array.from(table().querySelectorAll('tbody tr td:first-child')).map((node) =>
      node.textContent?.trim(),
    );
    expect(cells[0]).toBe('Alpha');
  });

  it('filters rows and resets page', async () => {
    const input = table().querySelector('.wi-table__filter-input') as HTMLInputElement;
    input.value = 'Alpha';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.lastFilters).toEqual([{ columnId: 'name', value: 'Alpha', operator: 'contains' }]);
    expect(table().querySelectorAll('tbody tr').length).toBe(1);
    expect(table().textContent).toContain('Alpha');
  });

  it('paginates with numbered buttons', async () => {
    const page2 = Array.from(table().querySelectorAll('wi-data-pagination button')).find(
      (btn) => btn.textContent?.trim() === '2',
    ) as HTMLButtonElement;
    page2.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.lastPage).toEqual({ pageIndex: 1, pageSize: 2 });
    expect(host.pageIndex()).toBe(1);
  });

  it('renders empty message', async () => {
    host.data.set([]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(table().querySelector('.wi-table__empty')?.textContent?.trim()).toBe('Vacío');
  });

  it('uses cell template and row actions', async () => {
    host.useTemplate.set(true);
    host.withActions.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(table().querySelector('.custom-name')).toBeTruthy();
    expect(table().querySelector('.row-action')).toBeTruthy();
  });

  it('does not client-page when totalItems is set', async () => {
    host.totalItems.set(100);
    host.data.set(ROWS);
    host.pageSize.set(2);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(table().querySelectorAll('tbody tr.wi-table__row').length).toBe(4);
  });

  it('shows a row expander in compact when extra columns have default collapse', async () => {
    host.compact.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = table();
    expect(el.querySelector('.wi-table__expand')).toBeTruthy();
    const grid = el.querySelector('.wi-table__table') as HTMLElement;
    expect(grid.textContent).toContain('Nombre');
    expect(grid.textContent).not.toContain('Empresa');
    expect(grid.textContent).not.toContain('Puntos');
  });

  it('does not render a row expander when compact is off', async () => {
    host.columns.set([
      ...COLUMNS,
      { id: 'extra', header: 'Extra', field: 'company', priority: 'collapse' },
    ]);
    host.compact.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(table().classList.contains('wi-table--compact')).toBe(false);
    expect(table().querySelector('.wi-table__expand')).toBeNull();
    expect(table().querySelector('wi-column-visibility')).toBeTruthy();
    expect(table().textContent).toContain('Extra');
  });

  it('collapses secondary columns into an expandable panel', async () => {
    host.columns.set([
      { id: 'name', header: 'Nombre', field: 'name', sortable: true, filterable: true },
      { id: 'company', header: 'Empresa', field: 'company', priority: 'collapse' },
      { id: 'score', header: 'Puntos', field: 'score', priority: 'collapse' },
    ]);
    host.compact.set(true);
    host.useTemplate.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = table();
    const grid = el.querySelector('.wi-table__table') as HTMLElement;
    expect(el.classList.contains('wi-table--compact')).toBe(true);
    expect(el.querySelector('.wi-table__table')?.classList.contains('table-fixed')).toBe(true);
    expect(el.querySelector('.wi-table__scroll')?.classList.contains('overflow-x-hidden')).toBe(
      true,
    );
    expect(el.querySelector('.wi-table__expand')).toBeTruthy();
    expect(grid.textContent).not.toContain('Empresa');
    expect(grid.textContent).not.toContain('Puntos');
    expect(el.querySelector('wi-column-visibility')).toBeNull();
    expect(grid.querySelector('thead .wi-table__th .truncate')).toBeNull();
    expect(grid.querySelector('tbody .wi-table__td.overflow-hidden')).toBeTruthy();

    const toggle = el.querySelector('.wi-table__expand') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Show hidden columns');
    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Hide extra columns');
    const panel = el.querySelector('.wi-table__expand-card');
    expect(panel).toBeTruthy();
    expect(panel?.textContent).toContain('Empresa');
    expect(panel?.textContent).toContain('Acme');
    expect(panel?.textContent).toContain('Puntos');
    expect(panel?.textContent).toContain('10');
    expect(el.querySelector('.custom-name')).toBeTruthy();
  });
});
