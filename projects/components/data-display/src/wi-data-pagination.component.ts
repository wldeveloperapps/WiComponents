import { Component, computed, input, output } from '@angular/core';

import { wiPageWindow } from './wi-data.utils';

/**
 * Paginación numérica compartida (table / list).
 */
@Component({
  selector: 'wi-data-pagination',
  host: {
    class: 'wi-data-pagination flex flex-wrap items-center justify-center gap-1',
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `
    <button
      type="button"
      class="wi-data-pagination__btn inline-flex h-8 min-w-8 items-center justify-center rounded-control border border-outline-variant bg-surface px-2 text-sm outline-none hover:bg-surface-variant disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring"
      [disabled]="pageIndex() <= 0"
      [attr.aria-label]="previousLabel()"
      (click)="goTo(pageIndex() - 1)"
    >
      {{ previousLabel() }}
    </button>

    @for (page of pages(); track page) {
      <button
        type="button"
        class="wi-data-pagination__btn inline-flex h-8 min-w-8 items-center justify-center rounded-control border text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        [class.border-primary]="page === pageIndex()"
        [class.bg-primary]="page === pageIndex()"
        [class.text-on-primary]="page === pageIndex()"
        [class.border-outline-variant]="page !== pageIndex()"
        [class.bg-surface]="page !== pageIndex()"
        [class.hover:bg-surface-variant]="page !== pageIndex()"
        [attr.aria-current]="page === pageIndex() ? 'page' : null"
        (click)="goTo(page)"
      >
        {{ page + 1 }}
      </button>
    }

    <button
      type="button"
      class="wi-data-pagination__btn inline-flex h-8 min-w-8 items-center justify-center rounded-control border border-outline-variant bg-surface px-2 text-sm outline-none hover:bg-surface-variant disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring"
      [disabled]="pageIndex() >= totalPages() - 1"
      [attr.aria-label]="nextLabel()"
      (click)="goTo(pageIndex() + 1)"
    >
      {{ nextLabel() }}
    </button>
  `,
})
export class WiDataPaginationComponent {
  readonly pageIndex = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly maxButtons = input(5);
  readonly ariaLabel = input('Paginación');
  readonly previousLabel = input('Anterior');
  readonly nextLabel = input('Siguiente');

  readonly pageSelect = output<number>();

  readonly pages = computed(() =>
    wiPageWindow(this.pageIndex(), this.totalPages(), this.maxButtons()),
  );

  goTo(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.totalPages() - 1));
    if (clamped === this.pageIndex()) {
      return;
    }
    this.pageSelect.emit(clamped);
  }
}
