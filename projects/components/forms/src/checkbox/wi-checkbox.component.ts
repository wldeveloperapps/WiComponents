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
import { BrnCheckbox } from '@spartan-ng/brain/checkbox';

import type { WiCheckboxSize } from './wi-checkbox.types';

const BASE_CLASSES = [
  'wi-checkbox__control',
  'peer',
  'shrink-0',
  'flex',
  'items-center',
  'justify-center',
  'rounded-control-sm',
  'border',
  'border-outline',
  'bg-surface',
  'text-on-primary',
  'transition-colors',
  'outline-none',
  'cursor-pointer',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'data-[state=checked]:border-primary',
  'data-[state=checked]:bg-primary',
  'data-[state=indeterminate]:border-primary',
  'data-[state=indeterminate]:bg-primary',
].join(' ');

const SIZE_CLASSES: Record<WiCheckboxSize, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

const INVALID_CLASSES = [
  'border-error',
  'focus-visible:ring-error',
  'data-[state=checked]:border-error',
  'data-[state=checked]:bg-error',
  'data-[state=indeterminate]:border-error',
  'data-[state=indeterminate]:bg-error',
].join(' ');

const INDICATOR_CLASSES = [
  'wi-checkbox__indicator',
  'flex',
  'items-center',
  'justify-center',
  'text-current',
  '[&_svg]:size-full',
].join(' ');

let nextCheckboxId = 0;

/**
 * Checkbox del design system (`wi-checkbox`).
 *
 * - Tokens semánticos y tamaños alineados con el resto de forms.
 * - `FormValueControl` para Signal Forms (`[formField]`).
 * - `ControlValueAccessor` para Reactive Forms / `ngModel`.
 * - Soporta estado `indeterminate` (p. ej. “seleccionar todo”).
 * - Label, hint y error quedan fuera (composición `wi-field` prevista).
 */
@Component({
  selector: 'wi-checkbox',
  imports: [BrnCheckbox],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    class: 'wi-checkbox contents',
  },
  template: `
    <brn-checkbox
      [id]="resolvedId()"
      [name]="name() || null"
      [class]="controlClasses()"
      [checked]="value()"
      [(indeterminate)]="indeterminate"
      [disabled]="isDisabled()"
      [required]="required()"
      [forceInvalid]="invalid()"
      [aria-label]="ariaLabel()"
      [aria-labelledby]="ariaLabelledBy()"
      [aria-describedby]="ariaDescribedBy()"
      (checkedChange)="onCheckedChange($event)"
      (touched)="onBrainTouched()"
    >
      @if (value() || indeterminate()) {
        <span [class]="indicatorClasses" aria-hidden="true">
          @if (indeterminate()) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          }
        </span>
      }
    </brn-checkbox>
  `,
})
export class WiCheckboxComponent implements ControlValueAccessor, FormValueControl<boolean> {
  /** Valor del control (Signal Forms + two-way binding). */
  readonly value = model(false);

  /**
   * Estado indeterminado (p. ej. “seleccionar todo” con selección parcial).
   * Al interactuar se limpia y el control pasa a checked.
   */
  readonly indeterminate = model(false);

  readonly size = input<WiCheckboxSize>('md');
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string>('');

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  /** Emite en blur / toggle para Signal Forms (`debounce('blur')`, touched). */
  readonly touch = output<void>();

  private readonly generatedId = `wi-checkbox-${++nextCheckboxId}`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly indicatorClasses = INDICATOR_CLASSES;

  protected readonly controlClasses = computed(() =>
    [BASE_CLASSES, SIZE_CLASSES[this.size()], this.invalid() ? INVALID_CLASSES : ''].join(' '),
  );

  writeValue(value: boolean | null): void {
    this.value.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected onCheckedChange(next: boolean): void {
    this.value.set(next);
    this.onChange(next);
  }

  protected onBrainTouched(): void {
    this.onTouched();
    this.touch.emit();
  }
}
