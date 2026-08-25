import {
  booleanAttribute,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';

import type { WiInputSize, WiInputType } from './wi-input.types';

const BASE_CLASSES = [
  'flex',
  'w-full',
  'min-w-0',
  'rounded-control',
  'border',
  'border-outline',
  'bg-surface',
  'text-on-surface',
  'placeholder:text-on-surface-variant',
  'transition-colors',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:pointer-events-none',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'read-only:bg-surface-variant',
  'aria-invalid:border-error',
  'aria-invalid:focus-visible:ring-error',
].join(' ');

const SIZE_CLASSES: Record<WiInputSize, string> = {
  sm: 'h-control-sm px-3 text-sm',
  md: 'h-control-md px-3 text-sm',
  lg: 'h-control-lg px-4 text-base',
};

let nextInputId = 0;

/**
 * Campo de texto del design system (`wi-input`).
 *
 * - Tokens semánticos y tamaños alineados con `wi-button`.
 * - `FormValueControl` para Signal Forms (`[formField]`).
 * - `ControlValueAccessor` para Reactive Forms / `ngModel`.
 * - Label, hint y error quedan fuera (composición `wi-field` prevista).
 */
@Component({
  selector: 'wi-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiInputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'wi-input contents',
  },
  template: `
    <input
      [attr.id]="resolvedId()"
      [attr.name]="name() || null"
      [attr.type]="type()"
      [attr.placeholder]="placeholder() || null"
      [attr.autocomplete]="autocomplete()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-invalid]="invalid() || null"
      [attr.aria-required]="required() || null"
      [attr.required]="required() || null"
      [class]="classes()"
      [value]="value()"
      [disabled]="isDisabled()"
      [readonly]="readonly()"
      (input)="onNativeInput($event)"
      (blur)="onNativeBlur()"
    />
  `,
})
export class WiInputComponent implements ControlValueAccessor, FormValueControl<string> {
  /** Valor del control (Signal Forms + two-way binding). */
  readonly value = model('');

  readonly size = input<WiInputSize>('md');
  readonly type = input<WiInputType>('text');
  readonly placeholder = input('');
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string>('');
  readonly autocomplete = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  /** Emite en blur para Signal Forms (`debounce('blur')`, touched). */
  readonly touch = output<void>();

  private readonly generatedId = `wi-input-${++nextInputId}`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly classes = computed(() => [BASE_CLASSES, SIZE_CLASSES[this.size()]].join(' '));

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected onNativeInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  protected onNativeBlur(): void {
    this.onTouched();
    this.touch.emit();
  }
}
