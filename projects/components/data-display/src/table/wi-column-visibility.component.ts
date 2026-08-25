import { booleanAttribute, Component, computed, input, model } from '@angular/core';

import {
  WiMenuComponent,
  WiMenuItemDirective,
  WiMenuLabelComponent,
  WiMenuTriggerDirective,
} from '@wiloc/ui/overlays';

import type { WiColumnDef } from './wi-column.types';
import { injectWiDataDisplayI18n } from '../wi-data-display.i18n';
import { wiDefaultVisibleColumnIds } from './wi-data.utils';

/**
 * Menú de visibilidad de columnas (`N de M columnas visibles`).
 * Labels vía `provideWiDataDisplayI18n` (override opcional por input).
 */
@Component({
  selector: 'wi-column-visibility',
  host: {
    class: 'wi-column-visibility inline-flex',
  },
  imports: [WiMenuComponent, WiMenuItemDirective, WiMenuLabelComponent, WiMenuTriggerDirective],
  template: `
    <button
      type="button"
      class="wi-column-visibility__trigger inline-flex h-control-sm items-center gap-2 rounded-control border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
      [wiMenuTrigger]="menu"
      [attr.aria-label]="resolvedAriaLabel()"
    >
      {{ summaryLabel() }}
    </button>

    <ng-template #menu>
      <wi-menu>
        <wi-menu-label>{{ resolvedMenuLabel() }}</wi-menu-label>
        @for (column of columns(); track column.id) {
          <button
            type="button"
            wiMenuItem
            class="justify-start gap-2"
            (triggered)="toggle(column.id)"
          >
            <span
              class="inline-flex size-4 items-center justify-center rounded-sm border border-outline"
              [class.bg-primary]="isVisible(column.id)"
              [class.border-primary]="isVisible(column.id)"
              [class.text-on-primary]="isVisible(column.id)"
              aria-hidden="true"
            >
              @if (isVisible(column.id)) {
                <svg viewBox="0 0 16 16" fill="currentColor" class="size-3">
                  <path
                    d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
                  />
                </svg>
              }
            </span>
            <span>{{ column.header }}</span>
          </button>
        }
      </wi-menu>
    </ng-template>
  `,
})
export class WiColumnVisibilityComponent {
  private readonly i18n = injectWiDataDisplayI18n();

  readonly columns = input.required<readonly WiColumnDef[]>();
  /** `null` = todas las columnas con `visible !== false`. */
  readonly visibleColumnIds = model<readonly string[] | null>(null);
  /** Override de `provideWiDataDisplayI18n`. */
  readonly menuLabel = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Plantilla: `{visible}` y `{total}`. Override de i18n. */
  readonly summaryTemplate = input<string | undefined>(undefined);
  readonly allowEmpty = input(false, { transform: booleanAttribute });

  private readonly effectiveIds = computed(() => {
    const ids = this.visibleColumnIds();
    if (ids == null) {
      return wiDefaultVisibleColumnIds(this.columns());
    }
    return [...ids];
  });

  protected readonly resolvedMenuLabel = computed(
    () => this.menuLabel() ?? this.i18n.columnVisibilityMenuLabel(),
  );
  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.i18n.columnVisibilityAriaLabel(),
  );

  readonly summaryLabel = computed(() => {
    const visible = this.effectiveIds().length;
    const total = this.columns().length;
    const template = this.summaryTemplate() ?? this.i18n.columnVisibilitySummary();
    return template.replace('{visible}', String(visible)).replace('{total}', String(total));
  });

  isVisible(columnId: string): boolean {
    return this.effectiveIds().includes(columnId);
  }

  toggle(columnId: string): void {
    const current = new Set(this.effectiveIds());
    if (current.has(columnId)) {
      if (!this.allowEmpty() && current.size <= 1) {
        return;
      }
      current.delete(columnId);
    } else {
      current.add(columnId);
    }
    const ordered = this.columns()
      .map((column) => column.id)
      .filter((id) => current.has(id));
    this.visibleColumnIds.set(ordered);
  }
}
