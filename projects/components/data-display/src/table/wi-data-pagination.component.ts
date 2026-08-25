import { Component, computed, input, output } from '@angular/core';

import { injectWiDataDisplayI18n } from '../wi-data-display.i18n';
import { wiPageWindow } from './wi-data.utils';

/**
 * Paginación numérica compartida (table / list).
 * Labels vía `provideWiDataDisplayI18n` (override opcional por input).
 */
@Component({
  selector: 'wi-data-pagination',
  host: {
    class: 'wi-data-pagination flex flex-wrap items-center justify-center gap-1',
    role: 'navigation',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
  template: `
    <button
      type="button"
      class="wi-data-pagination__btn inline-flex h-8 min-w-8 items-center justify-center rounded-control border border-outline-variant bg-surface px-2 text-sm outline-none hover:bg-surface-variant disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring"
      [disabled]="pageIndex() <= 0"
      [attr.aria-label]="resolvedPreviousLabel()"
      (click)="goTo(pageIndex() - 1)"
    >
      {{ resolvedPreviousLabel() }}
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
      [attr.aria-label]="resolvedNextLabel()"
      (click)="goTo(pageIndex() + 1)"
    >
      {{ resolvedNextLabel() }}
    </button>
  `,
})
export class WiDataPaginationComponent {
  private readonly i18n = injectWiDataDisplayI18n();

  readonly pageIndex = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly maxButtons = input(5);
  /** Override de `provideWiDataDisplayI18n`. */
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly previousLabel = input<string | undefined>(undefined);
  readonly nextLabel = input<string | undefined>(undefined);

  readonly pageSelect = output<number>();

  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.i18n.paginationAriaLabel(),
  );
  protected readonly resolvedPreviousLabel = computed(
    () => this.previousLabel() ?? this.i18n.previousLabel(),
  );
  protected readonly resolvedNextLabel = computed(() => this.nextLabel() ?? this.i18n.nextLabel());

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
