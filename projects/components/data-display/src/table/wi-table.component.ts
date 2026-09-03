import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
} from '@angular/core';

import { WiMenuComponent, WiMenuItemDirective, WiMenuTriggerDirective } from '@wiloc/ui/overlays';

import type {
  WiColumnDef,
  WiColumnFilter,
  WiFilterOperator,
  WiPageChangeEvent,
  WiSortDirection,
  WiSortState,
  WiTableCellContext,
} from './wi-column.types';
import { WiColumnVisibilityComponent } from './wi-column-visibility.component';
import { injectWiDataDisplayI18n } from '../wi-data-display.i18n';
import { WiDataPaginationComponent } from './wi-data-pagination.component';
import {
  wiCollapseColumns,
  wiFormatCellValue,
  wiGetColumnFilter,
  wiInlineColumns,
  wiProcessRows,
  wiReadCellValue,
  wiUpsertColumnFilter,
  wiVisibleColumns,
} from './wi-data.utils';
import { WiTableCellDirective } from './wi-table-cell.directive';
import { WiTableRowActionsDirective } from './wi-table-row-actions.directive';

/**
 * Tabla de datos declarativa (`wi-table`).
 *
 * - Columnas vía `WiColumnDef` (agnóstico a metadatos de producto).
 * - Sort / filter / page: models + eventos; modo cliente si `totalItems` es `null`.
 * - Labels de chrome vía `provideWiDataDisplayI18n` (override opcional por input).
 * - Toolbar: `[wiTableSummary]`, visibilidad de columnas, `[wiTableActions]`.
 * - Celdas: `field` o `ng-template [wiTableCell]`; acciones: `wiTableRowActions`.
 * - Compacto: según ancho del contenedor y `showFrom` de cada columna (default `'compact'` / 960px);
 *   el resto va a una tarjeta por fila. `showFrom: 'always'` se queda en la fila. Sin menú de visibilidad.
 */
@Component({
  selector: 'wi-table',
  host: {
    class: 'wi-table block w-full min-w-0',
    role: 'region',
    '[class.wi-table--compact]': 'isCompact()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
  imports: [
    NgTemplateOutlet,
    WiColumnVisibilityComponent,
    WiDataPaginationComponent,
    WiMenuComponent,
    WiMenuItemDirective,
    WiMenuTriggerDirective,
  ],
  template: `
    <div
      class="wi-table__toolbar mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      <div class="wi-table__toolbar-start min-w-0 text-sm text-on-surface-variant">
        <ng-content select="[wiTableSummary]" />
        @if (showResultCount()) {
          <span>{{ resultCountLabel() }}</span>
        }
      </div>
      <div class="wi-table__toolbar-end flex flex-wrap items-center gap-2">
        @if (columnVisibility() && !isCompact()) {
          <wi-column-visibility
            [columns]="columns()"
            [(visibleColumnIds)]="visibleColumnIds"
            [summaryTemplate]="columnVisibilityLabel()"
            [menuLabel]="columnVisibilityMenuLabel()"
            [ariaLabel]="columnVisibilityAriaLabel()"
          />
        }
        <ng-content select="[wiTableActions]" />
      </div>
    </div>

    <div
      class="wi-table__scroll w-full min-w-0"
      [class.overflow-x-auto]="!isCompact()"
      [class.overflow-x-hidden]="isCompact()"
    >
      <table
        class="wi-table__table w-full border-collapse text-left text-sm text-on-surface"
        [class.table-fixed]="isCompact()"
      >
        <thead class="wi-table__head border-b border-outline-variant bg-surface-variant/40">
          <tr>
            @if (showRowExpand()) {
              <th scope="col" class="wi-table__th wi-table__th--expand w-10 px-2 py-2">
                <span
                  class="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
                  >{{ resolvedExpandColumnHeader() }}</span
                >
              </th>
            }
            @if (hasRowActions()) {
              <th scope="col" class="wi-table__th wi-table__th--actions w-32 px-2 py-2">
                <span
                  class="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
                  >{{ resolvedRowActionsHeader() }}</span
                >
              </th>
            }
            @for (column of inlineColumns(); track column.id) {
              <th
                scope="col"
                class="wi-table__th px-3 py-2 font-semibold"
                [class.min-w-0]="isCompact()"
                [class.overflow-hidden]="isCompact()"
                [class.align-top]="isCompact()"
                [class.whitespace-nowrap]="!isCompact()"
                [attr.aria-sort]="ariaSort(column)"
              >
                @if (column.sortable) {
                  <button
                    type="button"
                    class="wi-table__sort inline-flex max-w-full gap-1 rounded-control text-left outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    [class.items-center]="!isCompact()"
                    [class.items-start]="isCompact()"
                    (click)="onSortClick(column)"
                  >
                    <span
                      [class.truncate]="!isCompact()"
                      [class.whitespace-normal]="isCompact()"
                      [class.break-words]="isCompact()"
                      >{{ column.header }}</span
                    >
                    <span
                      class="wi-table__sort-icon inline-flex size-4 shrink-0"
                      aria-hidden="true"
                    >
                      @switch (sortIcon(column)) {
                        @case ('asc') {
                          <svg viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path
                              fill-rule="evenodd"
                              d="M10 3a.75.75 0 01.53.22l4.25 4.25a.75.75 0 11-1.06 1.06L10 4.81 6.28 8.53a.75.75 0 01-1.06-1.06l4.25-4.25A.75.75 0 0110 3z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        }
                        @case ('desc') {
                          <svg viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path
                              fill-rule="evenodd"
                              d="M10 17a.75.75 0 01-.53-.22l-4.25-4.25a.75.75 0 111.06-1.06L10 15.19l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25A.75.75 0 0110 17z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        }
                        @default {
                          <svg viewBox="0 0 20 20" fill="currentColor" class="size-4 opacity-50">
                            <path
                              d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06zM5.22 3.22a.75.75 0 011.06 0L10 6.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 4.28a.75.75 0 010-1.06z"
                            />
                          </svg>
                        }
                      }
                    </span>
                  </button>
                } @else {
                  <span
                    [class.truncate]="!isCompact()"
                    [class.whitespace-normal]="isCompact()"
                    [class.break-words]="isCompact()"
                    >{{ column.header }}</span
                  >
                }
              </th>
            }
          </tr>

          @if (showFilterRow()) {
            <tr class="wi-table__filters border-b border-outline-variant">
              @if (showRowExpand()) {
                <th class="px-2 py-1.5"></th>
              }
              @if (hasRowActions()) {
                <th class="px-2 py-1.5"></th>
              }
              @for (column of inlineColumns(); track column.id) {
                <th
                  class="wi-table__filter-cell px-2 py-1.5 font-normal"
                  [class.min-w-0]="isCompact()"
                  [class.overflow-hidden]="isCompact()"
                >
                  @if (column.filterable) {
                    <div
                      class="flex min-w-0 items-center gap-1"
                      [class.min-w-[8rem]]="!isCompact()"
                    >
                      @if (column.filterType === 'select') {
                        <select
                          class="wi-table__filter-select h-control-sm w-full min-w-0 rounded-control border border-outline-variant bg-surface px-2 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          [attr.aria-label]="filterAriaLabel(column)"
                          [value]="filterValue(column.id)"
                          (change)="onFilterValue(column, eventValue($event))"
                        >
                          <option value="">
                            {{ column.filterPlaceholder || resolvedSelectPlaceholder() }}
                          </option>
                          @for (option of column.filterOptions ?? []; track option.value) {
                            <option [value]="option.value">{{ option.label }}</option>
                          }
                        </select>
                      } @else {
                        <input
                          type="search"
                          class="wi-table__filter-input h-control-sm w-full min-w-0 rounded-control border border-outline-variant bg-surface px-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
                          [attr.aria-label]="filterAriaLabel(column)"
                          [placeholder]="column.filterPlaceholder || resolvedFilterPlaceholder()"
                          [value]="filterValue(column.id)"
                          (input)="onFilterValue(column, eventValue($event))"
                        />
                        <button
                          type="button"
                          class="inline-flex size-8 shrink-0 items-center justify-center rounded-control text-on-surface-variant outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
                          [wiMenuTrigger]="opMenu"
                          [attr.aria-label]="resolvedFilterOperatorAriaLabel()"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="size-4"
                            aria-hidden="true"
                          >
                            <path
                              d="M2.5 4.5a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H3.25a.75.75 0 01-.75-.75zM5 9.75A.75.75 0 015.75 9h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 9.75zM8 15a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 15z"
                            />
                          </svg>
                        </button>
                        <ng-template #opMenu>
                          <wi-menu>
                            @for (op of resolvedFilterOperators(); track op.value) {
                              <button
                                type="button"
                                wiMenuItem
                                (triggered)="onFilterOperator(column, op.value)"
                              >
                                {{ op.label }}
                              </button>
                            }
                          </wi-menu>
                        </ng-template>
                      }
                    </div>
                  }
                </th>
              }
            </tr>
          }
        </thead>
        <tbody class="wi-table__body">
          @for (
            row of displayRows();
            track trackRow(row, $index);
            let odd = $odd;
            let index = $index
          ) {
            <tr
              class="wi-table__row border-b border-outline-variant/60"
              [class.bg-surface-variant/20]="odd"
            >
              @if (showRowExpand()) {
                <td class="wi-table__td wi-table__td--expand px-2 py-2 align-middle">
                  <button
                    type="button"
                    class="wi-table__expand inline-flex size-8 items-center justify-center rounded-control text-on-surface outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
                    [attr.aria-expanded]="isRowExpanded(row, index)"
                    [attr.aria-label]="
                      isRowExpanded(row, index)
                        ? resolvedCollapseRowAriaLabel()
                        : resolvedExpandRowAriaLabel()
                    "
                    (click)="toggleRowExpand(row, index)"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="size-4 transition-transform"
                      [class.rotate-180]="isRowExpanded(row, index)"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              }
              @if (rowActionsTemplate(); as actionsTpl) {
                <td class="wi-table__td wi-table__td--actions w-32 px-2 py-2 align-middle whitespace-nowrap">
                  <ng-container
                    [ngTemplateOutlet]="actionsTpl"
                    [ngTemplateOutletContext]="{ $implicit: row, row: row }"
                  />
                </td>
              }
              @for (column of inlineColumns(); track column.id) {
                <td
                  class="wi-table__td px-3 py-2"
                  [class.min-w-0]="isCompact()"
                  [class.overflow-hidden]="isCompact()"
                  [class.align-top]="isCompact()"
                  [class.align-middle]="!isCompact()"
                >
                  <ng-container
                    [ngTemplateOutlet]="cellOutlet"
                    [ngTemplateOutletContext]="cellOutletContext(row, column, !isCompact())"
                  />
                </td>
              }
            </tr>
            @if (showRowExpand() && isRowExpanded(row, index)) {
              <tr class="wi-table__expand-row border-b border-outline-variant/60">
                <td class="wi-table__expand-cell px-3 py-3" [attr.colspan]="colspan()">
                  <div
                    class="wi-table__expand-card @container rounded-control-lg border border-outline-variant bg-surface p-4 text-on-surface shadow-sm"
                  >
                    <dl
                      class="wi-table__expand-list grid grid-cols-1 gap-x-8 gap-y-4 @min-[24rem]:grid-cols-2"
                    >
                      @for (column of collapseColumns(); track column.id) {
                        <div class="wi-table__expand-item min-w-0">
                          <dt class="text-xs font-medium text-on-surface-variant">
                            {{ column.header }}
                          </dt>
                          <dd class="mt-1 min-w-0 break-words text-sm font-medium text-on-surface">
                            <ng-container
                              [ngTemplateOutlet]="cellOutlet"
                              [ngTemplateOutletContext]="cellOutletContext(row, column, false)"
                            />
                          </dd>
                        </div>
                      }
                    </dl>
                  </div>
                </td>
              </tr>
            }
          } @empty {
            <tr>
              <td
                class="wi-table__empty px-3 py-6 text-center text-on-surface-variant"
                [attr.colspan]="colspan()"
              >
                {{ resolvedEmptyMessage() }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <ng-template #cellOutlet let-row="row" let-column="column" let-clamp="clamp">
      @if (cellTemplate(column.id); as template) {
        <div class="min-w-0" [class.overflow-hidden]="clamp !== false">
          <ng-container
            [ngTemplateOutlet]="template"
            [ngTemplateOutletContext]="cellContext(row, column)"
          />
        </div>
      } @else {
        <span
          class="block min-w-0"
          [class.truncate]="clamp !== false"
          [class.break-words]="clamp === false"
          >{{ cellText(row, column) }}</span
        >
      }
    </ng-template>

    @if (showPagination()) {
      <wi-data-pagination
        class="mt-3"
        [pageIndex]="pageIndex()"
        [totalPages]="totalPages()"
        [ariaLabel]="paginationAriaLabel()"
        [previousLabel]="previousLabel()"
        [nextLabel]="nextLabel()"
        (pageSelect)="goToPage($event)"
      />
    }
  `,
})
export class WiTableComponent<T = unknown> {
  private readonly i18n = injectWiDataDisplayI18n();
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly containerWidth = signal<number | null>(null);

  readonly columns = input.required<readonly WiColumnDef[]>();
  readonly data = input.required<readonly T[]>();
  /** Si se define, modo servidor: no filter/sort/page local; `data` es la página actual. */
  readonly totalItems = input<number | null>(null);
  readonly visibleColumnIds = model<readonly string[] | null>(null);
  readonly sort = model<WiSortState | null>(null);
  readonly filters = model<readonly WiColumnFilter[]>([]);
  readonly pageIndex = model(0);
  readonly pageSize = input(10);
  readonly showFilters = input(true, { transform: booleanAttribute });
  readonly columnVisibility = input(true, { transform: booleanAttribute });
  readonly showResultCount = input(false, { transform: booleanAttribute });
  /**
   * Fuerza el layout compacto.
   * `null` (default) = según ancho del contenedor y `showFrom` de cada columna.
   * `true` = solo columnas `always` en la fila; `false` = todas en la fila.
   */
  readonly compact = input<boolean | null>(null);

  /** Override de `provideWiDataDisplayI18n`. */
  readonly emptyMessage = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly paginationAriaLabel = input<string | undefined>(undefined);
  readonly previousLabel = input<string | undefined>(undefined);
  readonly nextLabel = input<string | undefined>(undefined);
  readonly filterPlaceholder = input<string | undefined>(undefined);
  readonly selectPlaceholder = input<string | undefined>(undefined);
  readonly filterOperatorAriaLabel = input<string | undefined>(undefined);
  readonly columnVisibilityLabel = input<string | undefined>(undefined);
  readonly columnVisibilityMenuLabel = input<string | undefined>(undefined);
  readonly columnVisibilityAriaLabel = input<string | undefined>(undefined);
  readonly resultCountTemplate = input<string | undefined>(undefined);
  readonly rowActionsHeader = input<string | undefined>(undefined);
  readonly expandColumnHeader = input<string | undefined>(undefined);
  readonly expandRowAriaLabel = input<string | undefined>(undefined);
  readonly collapseRowAriaLabel = input<string | undefined>(undefined);
  readonly trackBy = input<string | ((row: T, index: number) => string | number) | null>(null);
  readonly filterOperators = input<
    readonly { value: WiFilterOperator; label: string }[] | undefined
  >(undefined);

  readonly pageChange = output<WiPageChangeEvent>();

  private readonly cellDirs = contentChildren(WiTableCellDirective);
  private readonly rowActionDirs = contentChildren(WiTableRowActionsDirective);

  constructor() {
    afterNextRender(() => {
      const element = this.host.nativeElement;
      const applyWidth = (): void => {
        const width = element.clientWidth;
        if (width <= 0) {
          return;
        }
        this.containerWidth.set(width);
      };

      applyWidth();

      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      const observer = new ResizeObserver(() => applyWidth());
      observer.observe(element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected readonly resolvedEmptyMessage = computed(
    () => this.emptyMessage() ?? this.i18n.emptyMessage(),
  );
  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.i18n.tableAriaLabel(),
  );
  protected readonly resolvedFilterPlaceholder = computed(
    () => this.filterPlaceholder() ?? this.i18n.filterPlaceholder(),
  );
  protected readonly resolvedSelectPlaceholder = computed(
    () => this.selectPlaceholder() ?? this.i18n.selectPlaceholder(),
  );
  protected readonly resolvedFilterOperatorAriaLabel = computed(
    () => this.filterOperatorAriaLabel() ?? this.i18n.filterOperatorAriaLabel(),
  );
  protected readonly resolvedRowActionsHeader = computed(
    () => this.rowActionsHeader() ?? this.i18n.rowActionsHeader(),
  );
  protected readonly resolvedExpandColumnHeader = computed(
    () => this.expandColumnHeader() ?? this.i18n.expandColumnHeader(),
  );
  protected readonly resolvedExpandRowAriaLabel = computed(
    () => this.expandRowAriaLabel() ?? this.i18n.expandRowAriaLabel(),
  );
  protected readonly resolvedCollapseRowAriaLabel = computed(
    () => this.collapseRowAriaLabel() ?? this.i18n.collapseRowAriaLabel(),
  );
  protected readonly resolvedFilterOperators = computed(
    () => this.filterOperators() ?? this.i18n.filterOperators(),
  );

  readonly displayColumns = computed(() =>
    wiVisibleColumns(this.columns(), this.visibleColumnIds()),
  );

  /** Ancho efectivo: override `compact` o medida del contenedor (sin medir = escritorio). */
  readonly effectiveWidth = computed(() => {
    const forced = this.compact();
    if (forced === true) {
      return 0;
    }
    if (forced === false) {
      return Number.POSITIVE_INFINITY;
    }
    return this.containerWidth() ?? Number.POSITIVE_INFINITY;
  });

  readonly inlineColumns = computed(() =>
    wiInlineColumns(this.displayColumns(), this.effectiveWidth()),
  );

  readonly collapseColumns = computed(() =>
    wiCollapseColumns(this.displayColumns(), this.effectiveWidth()),
  );

  readonly showRowExpand = computed(() => this.collapseColumns().length > 0);

  readonly isCompact = computed(() => this.showRowExpand());

  readonly rowActionsTemplate = computed(() => this.rowActionDirs()[0]?.templateRef ?? null);

  private readonly cellTemplateMap = computed(() => {
    const map = new Map<string, WiTableCellDirective['templateRef']>();
    for (const directive of this.cellDirs()) {
      map.set(directive.wiTableCell(), directive.templateRef);
    }
    return map;
  });

  private readonly isClientMode = computed(() => this.totalItems() == null);

  private readonly clientProcessed = computed(() => {
    if (!this.isClientMode()) {
      return { rows: [...this.data()], total: this.totalItems() ?? this.data().length };
    }
    return wiProcessRows(this.data(), {
      columns: this.columns(),
      filters: this.filters(),
      sort: this.sort(),
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
    });
  });

  readonly displayRows = computed(() =>
    this.isClientMode() ? this.clientProcessed().rows : [...this.data()],
  );

  readonly effectiveTotal = computed(() =>
    this.isClientMode() ? this.clientProcessed().total : (this.totalItems() ?? this.data().length),
  );

  readonly totalPages = computed(() => {
    const size = this.pageSize();
    if (size <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.effectiveTotal() / size));
  });

  readonly showPagination = computed(() => this.effectiveTotal() > this.pageSize());

  readonly showFilterRow = computed(
    () => this.showFilters() && this.inlineColumns().some((column) => column.filterable),
  );

  readonly resultCountLabel = computed(() => {
    const template = this.resultCountTemplate() ?? this.i18n.resultCountTemplate();
    return template.replace('{count}', String(this.effectiveTotal()));
  });

  readonly colspan = computed(
    () =>
      this.inlineColumns().length +
        (this.hasRowActions() ? 1 : 0) +
        (this.showRowExpand() ? 1 : 0) || 1,
  );

  private readonly expandedRowKeys = linkedSignal({
    source: this.pageIndex,
    computation: () => new Set<string | number>(),
  });

  eventValue(event: Event): string {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
      return target.value;
    }
    return '';
  }

  hasRowActions(): boolean {
    return this.rowActionsTemplate() != null;
  }

  cellTemplate(columnId: string) {
    return this.cellTemplateMap().get(columnId) ?? null;
  }

  cellText(row: T, column: WiColumnDef): string {
    return wiFormatCellValue(wiReadCellValue(row, column.field));
  }

  cellContext(row: T, column: WiColumnDef): WiTableCellContext<T> {
    const value = wiReadCellValue(row, column.field);
    return { $implicit: row, row, column, value };
  }

  cellOutletContext(
    row: T,
    column: WiColumnDef,
    clamp: boolean,
  ): WiTableCellContext<T> & { clamp: boolean } {
    return { ...this.cellContext(row, column), clamp };
  }

  trackRow(row: T, index: number): string | number {
    const trackBy = this.trackBy();
    if (typeof trackBy === 'function') {
      return trackBy(row, index);
    }
    if (typeof trackBy === 'string' && row != null && typeof row === 'object') {
      const value = (row as Record<string, unknown>)[trackBy];
      if (typeof value === 'string' || typeof value === 'number') {
        return value;
      }
    }
    return index;
  }

  isRowExpanded(row: T, index: number): boolean {
    return this.expandedRowKeys().has(this.trackRow(row, index));
  }

  toggleRowExpand(row: T, index: number): void {
    const key = this.trackRow(row, index);
    const next = new Set(this.expandedRowKeys());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.expandedRowKeys.set(next);
  }

  filterValue(columnId: string): string {
    return wiGetColumnFilter(this.filters(), columnId)?.value ?? '';
  }

  filterAriaLabel(column: WiColumnDef): string {
    return this.i18n.filterAriaLabel(column.header);
  }

  ariaSort(column: WiColumnDef): 'ascending' | 'descending' | 'none' | null {
    if (!column.sortable) {
      return null;
    }
    const current = this.sort();
    if (current?.columnId !== column.id) {
      return 'none';
    }
    return current.direction === 'asc' ? 'ascending' : 'descending';
  }

  sortIcon(column: WiColumnDef): WiSortDirection | 'none' {
    const current = this.sort();
    if (current?.columnId !== column.id) {
      return 'none';
    }
    return current.direction;
  }

  onSortClick(column: WiColumnDef): void {
    if (!column.sortable) {
      return;
    }
    const current = this.sort();
    let next: WiSortState | null;
    if (current?.columnId !== column.id) {
      next = { columnId: column.id, direction: 'asc' };
    } else if (current.direction === 'asc') {
      next = { columnId: column.id, direction: 'desc' };
    } else {
      next = null;
    }
    this.sort.set(next);
  }

  onFilterValue(column: WiColumnDef, value: string): void {
    const existing = wiGetColumnFilter(this.filters(), column.id);
    const next = wiUpsertColumnFilter(this.filters(), {
      columnId: column.id,
      value,
      operator: existing?.operator ?? (column.filterType === 'select' ? 'equals' : 'contains'),
    });
    this.applyFilters(next);
  }

  onFilterOperator(column: WiColumnDef, operator: WiFilterOperator): void {
    const existing = wiGetColumnFilter(this.filters(), column.id);
    const next = wiUpsertColumnFilter(this.filters(), {
      columnId: column.id,
      value: existing?.value ?? '',
      operator,
    });
    this.applyFilters(next);
  }

  private applyFilters(next: WiColumnFilter[]): void {
    this.filters.set(next);
    if (this.pageIndex() !== 0) {
      this.pageIndex.set(0);
      this.pageChange.emit({ pageIndex: 0, pageSize: this.pageSize() });
    }
  }

  goToPage(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.totalPages() - 1));
    if (clamped === this.pageIndex()) {
      return;
    }
    this.pageIndex.set(clamped);
    this.pageChange.emit({ pageIndex: clamped, pageSize: this.pageSize() });
  }
}
