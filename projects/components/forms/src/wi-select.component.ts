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
import {
  BrnPopover,
  BrnPopoverContent,
  provideBrnPopoverConfig,
  provideBrnPopoverDefaultOptions,
} from '@spartan-ng/brain/popover';
import {
  BrnSelect,
  BrnSelectContent,
  BrnSelectItem,
  BrnSelectList,
  BrnSelectMultiple,
  BrnSelectTrigger,
} from '@spartan-ng/brain/select';

import type {
  WiSelectCompareWith,
  WiSelectItemContext,
  WiSelectSelectedContext,
  WiSelectSize,
} from './wi-select.types';
import { WiIconComponent } from '@wiloc/ui/icon';

const TRIGGER_BASE_CLASSES = [
  'wi-select__trigger',
  'flex',
  'w-full',
  'min-w-0',
  'items-center',
  'justify-between',
  'gap-2',
  'rounded-control',
  'border',
  'border-outline',
  'bg-surface',
  'text-on-surface',
  'transition-colors',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:pointer-events-none',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'aria-invalid:border-error',
  'aria-invalid:focus-visible:ring-error',
  'data-placeholder:text-on-surface-variant',
].join(' ');

const TRIGGER_SIZE_CLASSES: Record<WiSelectSize, string> = {
  sm: 'h-control-sm px-3 text-sm',
  md: 'h-control-md px-3 text-sm',
  lg: 'h-control-lg px-4 text-base',
};

const PANEL_CLASSES = [
  'wi-select__panel',
  'z-50',
  'max-h-60',
  'w-(--brn-select-width)',
  'min-w-(--brn-select-width)',
  'overflow-x-hidden',
  'overflow-y-auto',
  'rounded-control',
  'border',
  'border-outline',
  'bg-surface',
  'text-on-surface',
  'shadow-md',
].join(' ');

const OPTION_CLASSES = [
  'wi-select__option',
  'group',
  'relative',
  'flex',
  'w-full',
  'cursor-default',
  'items-center',
  'gap-2',
  'rounded-control',
  'px-2',
  'py-1.5',
  'text-sm',
  'outline-none',
  'select-none',
  'data-highlighted:bg-surface-variant',
  'data-disabled:pointer-events-none',
  'data-disabled:opacity-50',
].join(' ');

/** Check visible when Spartan sets `aria-selected="true"` on the option (`group`). */
const OPTION_CHECK_CLASSES = [
  'wi-select__check',
  'size-4',
  'shrink-0',
  'opacity-0',
  'group-aria-selected:opacity-100',
].join(' ');

let nextSelectId = 0;

/**
 * Marca un `ng-template` como plantilla de ítem del select.
 *
 * @example
 * ```html
 * <ng-template wiSelectItem let-option let-value="value">...</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[wiSelectItem]',
})
export class WiSelectItemDirective {
  readonly template = inject(TemplateRef<WiSelectItemContext>);
}

/**
 * Marca un `ng-template` como plantilla del valor seleccionado.
 *
 * @example
 * ```html
 * <ng-template wiSelectSelected let-value>...</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[wiSelectSelected]',
})
export class WiSelectSelectedDirective {
  readonly template = inject(TemplateRef<WiSelectSelectedContext>);
}

/**
 * Icono custom del trigger (escape hatch). Preferir el input `icon` con el nombre registrado.
 *
 * @example
 * ```html
 * <wi-select ...>
 *   <ng-template wiSelectTriggerIcon>
 *     <wi-icon name="funnel" />
 *   </ng-template>
 * </wi-select>
 * ```
 */
@Directive({
  selector: 'ng-template[wiSelectTriggerIcon]',
})
export class WiSelectTriggerIconDirective {
  readonly template = inject(TemplateRef<void>);
}

/**
 * Select del design system (`wi-select`).
 *
 * - Single o multi vía `multiple` (estático; no cambiar en runtime).
 * - Sin búsqueda (no combobox).
 * - Icono de trigger: input `icon` (nombre registrado en `provideWiIcons`) o template `wiSelectTriggerIcon`.
 * - `FormValueControl` + `ControlValueAccessor`.
 * - Label / hint / error quedan fuera (composición `wi-field` prevista).
 */
@Component({
  selector: 'wi-select',
  imports: [
    NgTemplateOutlet,
    WiIconComponent,
    BrnSelect,
    BrnSelectMultiple,
    BrnSelectTrigger,
    BrnSelectContent,
    BrnSelectList,
    BrnSelectItem,
    BrnPopover,
    BrnPopoverContent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiSelectComponent),
      multi: true,
    },
    provideBrnPopoverConfig({
      align: 'start',
      sideOffset: 4,
    }),
    provideBrnPopoverDefaultOptions({ role: null }),
  ],
  host: {
    class: 'wi-select block w-full',
  },
  template: `
    @if (!multiple()) {
      <div
        class="wi-select__root relative w-full"
        brnSelect
        brnPopover
        [disabled]="isDisabled()"
        [value]="value()"
        [itemToString]="itemToStringFn"
        [isItemEqualToValue]="compareWithFn"
        (valueChange)="onValueChange($event)"
        (closed)="onClosed()"
      >
        <div class="relative w-full">
          <button
            brnSelectTrigger
            [id]="resolvedId()"
            [forceInvalid]="invalid()"
            [class]="triggerClasses()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-describedby]="ariaDescribedBy()"
            [attr.aria-required]="required() || null"
            [attr.aria-invalid]="invalid() || null"
            [attr.name]="name() || null"
          >
            <span class="min-w-0 flex-1 truncate text-left">
              @if (hasSelection()) {
                @if (resolvedSelectedTemplate(); as selectedTpl) {
                  <ng-container *ngTemplateOutlet="selectedTpl; context: selectedContext()" />
                } @else {
                  {{ displayLabel() }}
                }
              } @else {
                {{ placeholder() }}
              }
            </span>
            @if (!(clearable() && hasSelection())) {
              @if (triggerIconTemplate(); as iconTpl) {
                <span
                  class="wi-select__trigger-icon inline-flex size-4 shrink-0 items-center justify-center opacity-60 [&_svg]:size-4"
                  aria-hidden="true"
                >
                  <ng-container *ngTemplateOutlet="iconTpl" />
                </span>
              } @else if (icon(); as iconName) {
                <span
                  class="wi-select__trigger-icon inline-flex size-4 shrink-0 items-center justify-center opacity-60 [&_svg]:size-4 [&_wi-icon]:size-4"
                  aria-hidden="true"
                >
                  <wi-icon [name]="iconName" />
                </span>
              } @else {
                <svg
                  class="wi-select__chevron size-4 shrink-0 opacity-60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              }
            }
          </button>
          @if (clearable() && hasSelection()) {
            <button
              type="button"
              class="wi-select__clear absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-control text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
              [attr.aria-label]="clearLabel()"
              [disabled]="isDisabled()"
              (click)="onClear($event)"
            >
              <svg
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          }
        </div>

        <ng-template brnPopoverContent>
          <div brnSelectContent [class]="panelClasses">
            <div brnSelectList class="wi-select__list flex flex-col p-1">
              @for (option of options(); track trackOption($index, option)) {
                <div [class]="optionClasses" brnSelectItem [value]="resolveOptionValue(option)">
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
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </div>
              } @empty {
                <div class="px-2 py-1.5 text-sm text-on-surface-variant">
                  {{ emptyText() }}
                </div>
              }
            </div>
          </div>
        </ng-template>
      </div>
    } @else {
      <div
        class="wi-select__root relative w-full"
        brnSelectMultiple
        brnPopover
        [disabled]="isDisabled()"
        [value]="multiValue()"
        [itemToString]="itemToStringFn"
        [isItemEqualToValue]="compareWithFn"
        (valueChange)="onMultiValueChange($event)"
        (closed)="onClosed()"
      >
        <div class="relative w-full">
          <button
            brnSelectTrigger
            [id]="resolvedId()"
            [forceInvalid]="invalid()"
            [class]="triggerClasses()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-describedby]="ariaDescribedBy()"
            [attr.aria-required]="required() || null"
            [attr.aria-invalid]="invalid() || null"
            [attr.name]="name() || null"
          >
            <span class="min-w-0 flex-1 truncate text-left">
              @if (hasSelection()) {
                @if (resolvedSelectedTemplate(); as selectedTpl) {
                  <ng-container *ngTemplateOutlet="selectedTpl; context: selectedContext()" />
                } @else {
                  {{ displayLabel() }}
                }
              } @else {
                {{ placeholder() }}
              }
            </span>
            @if (!(clearable() && hasSelection())) {
              @if (triggerIconTemplate(); as iconTpl) {
                <span
                  class="wi-select__trigger-icon inline-flex size-4 shrink-0 items-center justify-center opacity-60 [&_svg]:size-4"
                  aria-hidden="true"
                >
                  <ng-container *ngTemplateOutlet="iconTpl" />
                </span>
              } @else if (icon(); as iconName) {
                <span
                  class="wi-select__trigger-icon inline-flex size-4 shrink-0 items-center justify-center opacity-60 [&_svg]:size-4 [&_wi-icon]:size-4"
                  aria-hidden="true"
                >
                  <wi-icon [name]="iconName" />
                </span>
              } @else {
                <svg
                  class="wi-select__chevron size-4 shrink-0 opacity-60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              }
            }
          </button>
          @if (clearable() && hasSelection()) {
            <button
              type="button"
              class="wi-select__clear absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-control text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
              [attr.aria-label]="clearLabel()"
              [disabled]="isDisabled()"
              (click)="onClear($event)"
            >
              <svg
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          }
        </div>

        <ng-template brnPopoverContent>
          <div brnSelectContent [class]="panelClasses">
            <div brnSelectList class="wi-select__list flex flex-col p-1">
              @for (option of options(); track trackOption($index, option)) {
                <div [class]="optionClasses" brnSelectItem [value]="resolveOptionValue(option)">
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
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </div>
              } @empty {
                <div class="px-2 py-1.5 text-sm text-on-surface-variant">
                  {{ emptyText() }}
                </div>
              }
            </div>
          </div>
        </ng-template>
      </div>
    }
  `,
})
export class WiSelectComponent implements ControlValueAccessor, FormValueControl<unknown> {
  /** Valor del control. Single: `T | null`. Multi: `T[]`. */
  readonly value = model<unknown>(null);

  readonly multiple = input(false, { transform: booleanAttribute });
  readonly options = input<readonly unknown[]>([]);
  readonly optionLabel = input<string | undefined>(undefined);
  readonly optionValue = input<string | undefined>(undefined);
  readonly compareWith = input<WiSelectCompareWith>(Object.is);

  readonly size = input<WiSelectSize>('md');
  readonly placeholder = input('');
  readonly emptyText = input('');
  readonly clearLabel = input('Clear');
  readonly clearable = input(false, { transform: booleanAttribute });

  readonly id = input<string | undefined>(undefined);
  readonly name = input('');
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  /** Template de ítem por input (alternativa a `ng-template wiSelectItem`). */
  readonly itemTemplate = input<TemplateRef<WiSelectItemContext> | undefined>(undefined);
  /** Template de valor seleccionado por input (alternativa a `ng-template wiSelectSelected`). */
  readonly selectedTemplate = input<TemplateRef<WiSelectSelectedContext> | undefined>(undefined);
  /**
   * Nombre del icono registrado con `provideWiIcons` (sustituye al chevron).
   * Para contenido custom, usar `ng-template wiSelectTriggerIcon`.
   */
  readonly icon = input<string | undefined>(undefined);

  /** Emite al cerrar el panel (Signal Forms: touched / debounce blur). */
  readonly touch = output<void>();

  private readonly itemTemplateDir = contentChild(WiSelectItemDirective);
  private readonly selectedTemplateDir = contentChild(WiSelectSelectedDirective);
  private readonly triggerIconDir = contentChild(WiSelectTriggerIconDirective);

  private readonly generatedId = `wi-select-${++nextSelectId}`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly panelClasses = PANEL_CLASSES;
  protected readonly optionClasses = OPTION_CLASSES;
  protected readonly optionCheckClasses = OPTION_CHECK_CLASSES;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly triggerClasses = computed(() =>
    [TRIGGER_BASE_CLASSES, TRIGGER_SIZE_CLASSES[this.size()]].join(' '),
  );

  protected readonly resolvedItemTemplate = computed(
    () => this.itemTemplate() ?? this.itemTemplateDir()?.template,
  );

  protected readonly resolvedSelectedTemplate = computed(
    () => this.selectedTemplate() ?? this.selectedTemplateDir()?.template,
  );

  /** Template custom del icono de trigger (tiene prioridad sobre `icon`). */
  protected readonly triggerIconTemplate = computed(() => this.triggerIconDir()?.template);

  protected readonly multiValue = computed(() => {
    const current = this.value();
    return Array.isArray(current) ? current : [];
  });

  protected readonly hasSelection = computed(() => {
    const current = this.value();
    if (this.multiple()) {
      return Array.isArray(current) && current.length > 0;
    }
    return current !== null && current !== undefined && current !== '';
  });

  protected readonly displayLabel = computed(() => {
    const current = this.value();
    if (this.multiple()) {
      const values = Array.isArray(current) ? current : [];
      return values.map((item) => this.labelForFormValue(item)).join(', ');
    }
    return this.labelForFormValue(current);
  });

  protected readonly itemToStringFn = (formValue: unknown): string =>
    this.labelForFormValue(formValue);

  protected readonly compareWithFn: WiSelectCompareWith = (optionValue, selectedValue) =>
    this.compareWith()(optionValue, selectedValue);

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

  protected onValueChange(next: unknown): void {
    this.value.set(next ?? null);
    this.onChange(this.value());
  }

  protected onMultiValueChange(next: unknown): void {
    const normalized = Array.isArray(next) ? next : [];
    this.value.set(normalized);
    this.onChange(normalized);
  }

  protected onClosed(): void {
    this.onTouched();
    this.touch.emit();
  }

  protected onClear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isDisabled()) {
      return;
    }
    const next = this.multiple() ? [] : null;
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
    this.touch.emit();
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

  protected itemContext(option: unknown): WiSelectItemContext {
    const value = this.resolveOptionValue(option);
    return { $implicit: option, option, value };
  }

  protected selectedContext(): WiSelectSelectedContext {
    const value = this.value();
    return { $implicit: value, value };
  }

  private labelForFormValue(formValue: unknown): string {
    if (formValue === null || formValue === undefined) {
      return '';
    }
    const match = this.options().find((option) =>
      this.compareWith()(this.resolveOptionValue(option), formValue),
    );
    if (match !== undefined) {
      return this.resolveOptionLabel(match);
    }
    return stringifyLabel(formValue);
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
