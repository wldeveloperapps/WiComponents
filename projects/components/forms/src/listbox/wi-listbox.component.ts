import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  Directive,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { Listbox, Option } from '@angular/aria/listbox';

import type { WiListboxCompareWith, WiListboxItemContext, WiListboxSize } from './wi-listbox.types';

const LIST_BASE_CLASSES = [
  'wi-listbox__list',
  'flex',
  'w-full',
  'min-w-0',
  'max-h-60',
  'flex-col',
  'overflow-x-hidden',
  'overflow-y-auto',
  'rounded-control',
  'border',
  'border-outline',
  'bg-surface',
  'text-on-surface',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'aria-disabled:pointer-events-none',
  'aria-disabled:opacity-50',
  'aria-invalid:border-error',
  'aria-invalid:focus-visible:ring-error',
].join(' ');

const LIST_SIZE_CLASSES: Record<WiListboxSize, string> = {
  sm: 'p-0.5 text-sm',
  md: 'p-1 text-sm',
  lg: 'p-1.5 text-base',
};

const OPTION_BASE_CLASSES = [
  'wi-listbox__option',
  'group',
  'relative',
  'flex',
  'w-full',
  'min-w-0',
  'cursor-default',
  'items-center',
  'gap-2',
  'rounded-control',
  'outline-none',
  'select-none',
  'hover:bg-surface-variant',
  'data-[active=true]:bg-surface-variant',
  'aria-selected:bg-primary-container',
  'aria-selected:text-on-primary-container',
  'aria-disabled:pointer-events-none',
  'aria-disabled:opacity-50',
].join(' ');

const OPTION_SIZE_CLASSES: Record<WiListboxSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-2 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base',
};

const OPTION_CHECK_CLASSES = [
  'wi-listbox__check',
  'size-4',
  'shrink-0',
  'opacity-0',
  'group-aria-selected:opacity-100',
].join(' ');

let nextListboxId = 0;

/**
 * Marca un `ng-template` como plantilla de ítem del listbox.
 *
 * @example
 * ```html
 * <ng-template wiListboxItem let-option let-value="value" let-selected="selected">...</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[wiListboxItem]',
})
export class WiListboxItemDirective {
  readonly template = inject(TemplateRef<WiListboxItemContext>);
}

/**
 * Listbox del design system (`wi-listbox`).
 *
 * - Lista siempre visible (sin overlay).
 * - Single o multi vía `multiple` (estático; no cambiar en runtime).
 * - Sin filtro ni virtual scroll.
 * - `FormValueControl` + `ControlValueAccessor`.
 * - Label / hint / error quedan fuera (composición `wi-field` prevista).
 */
@Component({
  selector: 'wi-listbox',
  imports: [NgTemplateOutlet, Listbox, Option],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiListboxComponent),
      multi: true,
    },
  ],
  host: {
    class: 'wi-listbox block w-full min-w-0',
  },
  template: `
    <ul
      ngListbox
      [id]="resolvedId()"
      [class]="listClasses()"
      [value]="ariaValues()"
      [multi]="multiple()"
      [disabled]="isDisabled()"
      selectionMode="explicit"
      orientation="vertical"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-required]="required() || null"
      [attr.aria-invalid]="invalid() || null"
      [attr.name]="name() || null"
      (valueChange)="onAriaValueChange($event)"
      (focusout)="onFocusOut($event)"
    >
      @for (option of options(); track trackOption($index, option)) {
        <li
          ngOption
          [class]="optionClasses()"
          [value]="resolveOptionValue(option)"
          [label]="resolveOptionLabel(option)"
        >
          <span class="min-w-0 flex-1 truncate">
            @if (resolvedItemTemplate(); as itemTpl) {
              <ng-container *ngTemplateOutlet="itemTpl; context: itemContext(option)" />
            } @else {
              {{ resolveOptionLabel(option) }}
            }
          </span>
          <svg
            [class]="optionCheckClasses"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </li>
      } @empty {
        <li class="wi-listbox__empty px-2 py-1.5 text-on-surface-variant" aria-hidden="true">
          {{ emptyText() }}
        </li>
      }
    </ul>
  `,
})
export class WiListboxComponent implements ControlValueAccessor, FormValueControl<unknown> {
  /** Valor del control. Single: `T | null`. Multi: `T[]`. */
  readonly value = model<unknown>(null);

  readonly multiple = input(false, { transform: booleanAttribute });
  readonly options = input<readonly unknown[]>([]);
  readonly optionLabel = input<string | undefined>(undefined);
  readonly optionValue = input<string | undefined>(undefined);
  readonly compareWith = input<WiListboxCompareWith>(Object.is);

  readonly size = input<WiListboxSize>('md');
  readonly emptyText = input('');

  readonly id = input<string | undefined>(undefined);
  readonly name = input('');
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  /** Template de ítem por input (alternativa a `ng-template wiListboxItem`). */
  readonly itemTemplate = input<TemplateRef<WiListboxItemContext> | undefined>(undefined);

  /** Emite en blur / cambio de valor (Signal Forms: touched). */
  readonly touch = output<void>();

  private readonly itemTemplateDir = contentChild(WiListboxItemDirective);

  private readonly generatedId = `wi-listbox-${++nextListboxId}`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly optionCheckClasses = OPTION_CHECK_CLASSES;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly listClasses = computed(() =>
    [LIST_BASE_CLASSES, LIST_SIZE_CLASSES[this.size()]].join(' '),
  );

  protected readonly optionClasses = computed(() =>
    [OPTION_BASE_CLASSES, OPTION_SIZE_CLASSES[this.size()]].join(' '),
  );

  protected readonly resolvedItemTemplate = computed(
    () => this.itemTemplate() ?? this.itemTemplateDir()?.template,
  );

  /**
   * Valores para `@angular/aria` Listbox (siempre `V[]`).
   * Single: 0–1 elementos; multi: el array del form.
   */
  protected readonly ariaValues = computed((): unknown[] => {
    const current = this.value();
    if (this.multiple()) {
      return Array.isArray(current) ? [...current] : [];
    }
    if (current === null || current === undefined || current === '') {
      return [];
    }
    return [current];
  });

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.value.set(Array.isArray(value) ? value : []);
      return;
    }
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected onAriaValueChange(next: unknown[]): void {
    if (this.multiple()) {
      const normalized = Array.isArray(next) ? next : [];
      this.value.set(normalized);
      this.onChange(normalized);
    } else {
      const single = next.length > 0 ? next[0] : null;
      this.value.set(single);
      this.onChange(single);
    }
    this.markTouched();
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement | null;
    const related = event.relatedTarget as Node | null;
    if (host && related && host.contains(related)) {
      return;
    }
    this.markTouched();
  }

  protected resolveOptionValue(option: unknown): unknown {
    const key = this.optionValue();
    if (!key || option === null || typeof option !== 'object') {
      return option;
    }
    return (option as Record<string, unknown>)[key];
  }

  protected resolveOptionLabel(option: unknown): string {
    const key = this.optionLabel();
    if (!key || option === null || typeof option !== 'object') {
      return stringifyLabel(option);
    }
    return stringifyLabel((option as Record<string, unknown>)[key]);
  }

  protected trackOption(index: number, option: unknown): unknown {
    const value = this.resolveOptionValue(option);
    return value !== undefined && value !== null ? value : index;
  }

  protected isOptionSelected(option: unknown): boolean {
    const optionValue = this.resolveOptionValue(option);
    const current = this.value();
    if (this.multiple()) {
      const values = Array.isArray(current) ? current : [];
      return values.some((selected) => this.compareWith()(optionValue, selected));
    }
    return this.compareWith()(optionValue, current);
  }

  protected itemContext(option: unknown): WiListboxItemContext {
    const value = this.resolveOptionValue(option);
    return {
      $implicit: option,
      option,
      value,
      selected: this.isOptionSelected(option),
    };
  }

  private markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }
}

function stringifyLabel(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  return '';
}
