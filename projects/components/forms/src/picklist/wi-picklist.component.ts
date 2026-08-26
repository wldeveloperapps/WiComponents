import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  Directive,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';

import { WiButtonComponent } from '@wiloc/ui/button';

import { WiListboxComponent } from '../listbox/wi-listbox.component';
import type { WiListboxItemContext } from '../listbox/wi-listbox.types';
import type {
  WiPicklistCompareWith,
  WiPicklistItemContext,
  WiPicklistSize,
} from './wi-picklist.types';

const ICON_SVG_CLASSES = 'size-4 shrink-0';

let nextPicklistId = 0;

/**
 * Marca un `ng-template` como plantilla de ítem del picklist (ambas listas).
 *
 * @example
 * ```html
 * <ng-template wiPicklistItem let-option let-value="value" let-selected="selected">...</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[wiPicklistItem]',
})
export class WiPicklistItemDirective {
  readonly template = inject(TemplateRef<WiPicklistItemContext>);
}

/**
 * Pick list del design system (`wi-picklist`).
 *
 * - Dos listbox (origen / asignados) y botones de transferencia.
 * - Ítem custom: `ng-template wiPicklistItem` (p. ej. un componente de la app).
 * - `options` es el universo; `value` son los valores asignados (form).
 * - Sin filtro, drag-and-drop ni reorder (la app puede filtrar `options`).
 * - `FormValueControl` + `ControlValueAccessor`.
 * - Textos (headers, empty, aria de botones) los provee la app.
 */
@Component({
  selector: 'wi-picklist',
  imports: [WiButtonComponent, WiListboxComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiPicklistComponent),
      multi: true,
    },
  ],
  host: {
    class: 'wi-picklist block w-full min-w-0',
    role: 'group',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'invalid() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.aria-disabled]': 'isDisabled() || null',
  },
  styles: `
    :host ::ng-deep .wi-listbox {
      display: flex;
      height: 100%;
      min-height: 15rem;
      flex-direction: column;
    }

    :host ::ng-deep .wi-listbox__list {
      min-height: var(--wi-picklist-list-min-height, 15rem);
      max-height: var(--wi-picklist-list-max-height, 28rem);
      flex: 1 1 auto;
    }
  `,
  template: `
    <div class="@container w-full min-w-0">
      <div
        class="wi-picklist__layout grid w-full min-w-0 grid-cols-1 gap-3 @min-[28rem]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] @min-[28rem]:items-stretch"
      >
        <div class="wi-picklist__source flex h-full min-h-0 w-full min-w-0 flex-col gap-1">
          @if (sourceHeader()) {
            <div
              class="wi-picklist__header truncate text-sm font-medium text-on-surface"
              [id]="sourceHeaderId()"
              [title]="sourceHeader()"
            >
              {{ sourceHeader() }}
            </div>
          }
          <wi-listbox
            class="min-h-0 min-w-0"
            multiple
            [id]="sourceListId()"
            [options]="sourceOptions()"
            [value]="sourceSelection()"
            (valueChange)="onSourceSelectionChange($event)"
            (touch)="markTouched()"
            [optionLabel]="optionLabel()"
            [optionValue]="optionValue()"
            [compareWith]="compareWith()"
            [size]="size()"
            [emptyText]="sourceEmptyText()"
            [disabled]="isDisabled()"
            [itemTemplate]="listboxItemTemplate()"
            [ariaLabel]="sourceHeader() ? null : sourceAriaLabel()"
            [ariaLabelledBy]="sourceHeader() ? sourceHeaderId() : null"
          />
        </div>

        <div
          class="wi-picklist__actions flex shrink-0 flex-row items-center justify-center gap-2 @min-[28rem]:flex-col @min-[28rem]:justify-center"
        >
          <wi-button
            class="wi-picklist__move-to-target rotate-90 @min-[28rem]:rotate-0"
            type="button"
            variant="outline"
            iconOnly
            [size]="size()"
            [disabled]="isMoveToTargetDisabled()"
            [ariaLabel]="moveToTargetLabel()"
            (click)="moveToTarget()"
          >
            <svg
              [class]="iconSvgClasses"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </wi-button>
          @if (showMoveAll()) {
            <wi-button
              class="wi-picklist__move-all-to-target rotate-90 @min-[28rem]:rotate-0"
              type="button"
              variant="outline"
              iconOnly
              [size]="size()"
              [disabled]="isMoveAllToTargetDisabled()"
              [ariaLabel]="moveAllToTargetLabel()"
              (click)="moveAllToTarget()"
            >
              <svg
                [class]="iconSvgClasses"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                />
              </svg>
            </wi-button>
          }
          @if (showMoveAll()) {
            <wi-button
              class="wi-picklist__move-all-to-source rotate-90 @min-[28rem]:rotate-0"
              type="button"
              variant="outline"
              iconOnly
              [size]="size()"
              [disabled]="isMoveAllToSourceDisabled()"
              [ariaLabel]="moveAllToSourceLabel()"
              (click)="moveAllToSource()"
            >
              <svg
                [class]="iconSvgClasses"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18.75 19.5 11.25 12l7.5-7.5m-6 15L3.75 12l7.5-7.5"
                />
              </svg>
            </wi-button>
          }
          <wi-button
            class="wi-picklist__move-to-source rotate-90 @min-[28rem]:rotate-0"
            type="button"
            variant="outline"
            iconOnly
            [size]="size()"
            [disabled]="isMoveToSourceDisabled()"
            [ariaLabel]="moveToSourceLabel()"
            (click)="moveToSource()"
          >
            <svg
              [class]="iconSvgClasses"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </wi-button>
        </div>

        <div class="wi-picklist__target flex h-full min-h-0 w-full min-w-0 flex-col gap-1">
          @if (targetHeader()) {
            <div
              class="wi-picklist__header truncate text-sm font-medium text-on-surface"
              [id]="targetHeaderId()"
              [title]="targetHeader()"
            >
              {{ targetHeader() }}
            </div>
          }
          <wi-listbox
            class="min-h-0 min-w-0"
            multiple
            [id]="targetListId()"
            [options]="targetOptions()"
            [value]="targetSelection()"
            (valueChange)="onTargetSelectionChange($event)"
            (touch)="markTouched()"
            [optionLabel]="optionLabel()"
            [optionValue]="optionValue()"
            [compareWith]="compareWith()"
            [size]="size()"
            [emptyText]="targetEmptyText()"
            [name]="name()"
            [disabled]="isDisabled()"
            [invalid]="invalid()"
            [required]="required()"
            [itemTemplate]="listboxItemTemplate()"
            [ariaLabel]="targetHeader() ? null : targetAriaLabel()"
            [ariaLabelledBy]="targetHeader() ? targetHeaderId() : null"
          />
        </div>
      </div>
    </div>
  `,
})
export class WiPicklistComponent implements ControlValueAccessor, FormValueControl<unknown[]> {
  /** Valores asignados (lista destino). Compatible con Signal Forms y two-way binding. */
  readonly value = model<unknown[]>([]);

  readonly options = input<readonly unknown[]>([]);
  readonly optionLabel = input<string | undefined>(undefined);
  readonly optionValue = input<string | undefined>(undefined);
  readonly compareWith = input<WiPicklistCompareWith>(Object.is);

  readonly size = input<WiPicklistSize>('md');
  readonly sourceHeader = input('');
  readonly targetHeader = input('');
  readonly sourceEmptyText = input('');
  readonly targetEmptyText = input('');
  readonly sourceAriaLabel = input<string | null>(null);
  readonly targetAriaLabel = input<string | null>(null);
  readonly moveToTargetLabel = input('');
  readonly moveAllToTargetLabel = input('');
  readonly moveToSourceLabel = input('');
  readonly moveAllToSourceLabel = input('');

  readonly id = input<string | undefined>(undefined);
  readonly name = input('');
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly showMoveAll = input(true, { transform: booleanAttribute });

  /** Template de ítem por input (alternativa a `ng-template wiPicklistItem`). */
  readonly itemTemplate = input<TemplateRef<WiPicklistItemContext> | undefined>(undefined);

  readonly touch = output<void>();

  private readonly itemTemplateDir = contentChild(WiPicklistItemDirective);

  private readonly generatedId = `wi-picklist-${++nextPicklistId}`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: unknown[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly iconSvgClasses = ICON_SVG_CLASSES;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly sourceHeaderId = computed(() => `${this.resolvedId()}-source-header`);
  protected readonly targetHeaderId = computed(() => `${this.resolvedId()}-target-header`);
  protected readonly sourceListId = computed(() => `${this.resolvedId()}-source`);
  protected readonly targetListId = computed(() => `${this.resolvedId()}-target`);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly resolvedItemTemplate = computed(
    () => this.itemTemplate() ?? this.itemTemplateDir()?.template,
  );

  /** `wi-listbox` espera `WiListboxItemContext`; la forma es compatible. */
  protected readonly listboxItemTemplate = computed(
    () => this.resolvedItemTemplate() as TemplateRef<WiListboxItemContext> | undefined,
  );

  protected readonly normalizedValue = computed((): unknown[] => {
    const current = this.value();
    return Array.isArray(current) ? current : [];
  });

  protected readonly sourceOptions = computed(() => {
    const assigned = this.normalizedValue();
    return this.options().filter(
      (option) => !assigned.some((item) => this.equals(this.resolveOptionValue(option), item)),
    );
  });

  protected readonly targetOptions = computed(() => {
    const options = this.options();
    return this.normalizedValue().map((item) => {
      const found = options.find((option) => this.equals(this.resolveOptionValue(option), item));
      return found ?? item;
    });
  });

  protected readonly sourceSelection = linkedSignal({
    source: this.sourceOptions,
    computation: (items, previous): unknown[] => {
      const prev = previous?.value ?? [];
      return prev.filter((selected) =>
        items.some((item) => this.equals(this.resolveOptionValue(item), selected)),
      );
    },
  });

  protected readonly targetSelection = linkedSignal({
    source: this.targetOptions,
    computation: (items, previous): unknown[] => {
      const prev = previous?.value ?? [];
      return prev.filter((selected) =>
        items.some((item) => this.equals(this.resolveOptionValue(item), selected)),
      );
    },
  });

  protected readonly isMoveToTargetDisabled = computed(
    () => this.isDisabled() || this.sourceSelection().length === 0,
  );

  protected readonly isMoveAllToTargetDisabled = computed(
    () => this.isDisabled() || this.sourceOptions().length === 0,
  );

  protected readonly isMoveToSourceDisabled = computed(
    () => this.isDisabled() || this.targetSelection().length === 0,
  );

  protected readonly isMoveAllToSourceDisabled = computed(
    () => this.isDisabled() || this.normalizedValue().length === 0,
  );

  writeValue(value: unknown): void {
    this.value.set(Array.isArray(value) ? [...value] : []);
  }

  registerOnChange(fn: (value: unknown[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected onSourceSelectionChange(next: unknown): void {
    this.sourceSelection.set(Array.isArray(next) ? next : []);
  }

  protected onTargetSelectionChange(next: unknown): void {
    this.targetSelection.set(Array.isArray(next) ? next : []);
  }

  protected moveToTarget(): void {
    if (this.isMoveToTargetDisabled()) {
      return;
    }
    this.commit(this.mergeValues(this.normalizedValue(), this.sourceSelection()));
    this.sourceSelection.set([]);
  }

  protected moveAllToTarget(): void {
    if (this.isMoveAllToTargetDisabled()) {
      return;
    }
    const toAdd = this.sourceOptions().map((option) => this.resolveOptionValue(option));
    this.commit(this.mergeValues(this.normalizedValue(), toAdd));
    this.sourceSelection.set([]);
  }

  protected moveToSource(): void {
    if (this.isMoveToSourceDisabled()) {
      return;
    }
    const selected = this.targetSelection();
    const next = this.normalizedValue().filter(
      (item) => !selected.some((value) => this.equals(item, value)),
    );
    this.commit(next);
    this.targetSelection.set([]);
  }

  protected moveAllToSource(): void {
    if (this.isMoveAllToSourceDisabled()) {
      return;
    }
    this.commit([]);
    this.targetSelection.set([]);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  private commit(next: unknown[]): void {
    this.value.set(next);
    this.onChange(next);
    this.markTouched();
  }

  private mergeValues(current: readonly unknown[], incoming: readonly unknown[]): unknown[] {
    const next = [...current];
    for (const item of incoming) {
      if (!next.some((value) => this.equals(value, item))) {
        next.push(item);
      }
    }
    return next;
  }

  private equals(left: unknown, right: unknown): boolean {
    return this.compareWith()(left, right);
  }

  private resolveOptionValue(option: unknown): unknown {
    const key = this.optionValue();
    if (!key || option === null || typeof option !== 'object') {
      return option;
    }
    return (option as Record<string, unknown>)[key];
  }
}
