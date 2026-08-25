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
import { BrnSwitch, BrnSwitchThumb } from '@spartan-ng/brain/switch';

import type { WiSwitchSize } from './wi-switch.types';

const BASE_CLASSES = [
  'wi-switch__control',
  'peer',
  'inline-flex',
  'shrink-0',
  'cursor-pointer',
  'items-center',
  'rounded-full',
  'border-2',
  'border-transparent',
  'transition-colors',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'data-[state=checked]:bg-primary',
  'data-[state=unchecked]:bg-outline-variant',
].join(' ');

const SIZE_CLASSES: Record<WiSwitchSize, string> = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
  lg: 'h-6 w-11',
};

const INVALID_CLASSES = [
  'focus-visible:ring-error',
  'data-[state=checked]:bg-error',
  'data-[state=unchecked]:bg-error/30',
].join(' ');

const THUMB_BASE_CLASSES = [
  'wi-switch__thumb',
  'pointer-events-none',
  'block',
  'rounded-full',
  'bg-surface',
  'shadow-sm',
  'ring-0',
  'transition-transform',
  'data-[state=unchecked]:translate-x-0.5',
].join(' ');

const THUMB_SIZE_CLASSES: Record<WiSwitchSize, string> = {
  sm: 'size-3 data-[state=checked]:translate-x-3',
  md: 'size-4 data-[state=checked]:translate-x-4',
  lg: 'size-5 data-[state=checked]:translate-x-5',
};

let nextSwitchId = 0;

/**
 * Interruptor (toggle switch) del design system (`wi-switch`).
 *
 * - Tokens semánticos y tamaños alineados con el resto de forms.
 * - `FormValueControl` para Signal Forms (`[formField]`).
 * - `ControlValueAccessor` para Reactive Forms / `ngModel`.
 * - Label, hint y error quedan fuera (composición `wi-field` prevista).
 */
@Component({
  selector: 'wi-switch',
  imports: [BrnSwitch, BrnSwitchThumb],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiSwitchComponent),
      multi: true,
    },
  ],
  host: {
    class: 'wi-switch contents',
  },
  template: `
    <brn-switch
      [id]="resolvedId()"
      [name]="name() || null"
      [class]="controlClasses()"
      [checked]="value()"
      [disabled]="isDisabled()"
      [required]="required()"
      [aria-label]="ariaLabel()"
      [aria-labelledby]="ariaLabelledBy()"
      [aria-describedby]="ariaDescribedBy()"
      (checkedChange)="onCheckedChange($event)"
      (touched)="onBrainTouched()"
    >
      <brn-switch-thumb [class]="thumbClasses()" />
    </brn-switch>
  `,
})
export class WiSwitchComponent implements ControlValueAccessor, FormValueControl<boolean> {
  /** Valor del control (Signal Forms + two-way binding). */
  readonly value = model(false);

  readonly size = input<WiSwitchSize>('md');
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

  private readonly generatedId = `wi-switch-${++nextSwitchId}`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly controlClasses = computed(() =>
    [BASE_CLASSES, SIZE_CLASSES[this.size()], this.invalid() ? INVALID_CLASSES : ''].join(' '),
  );

  protected readonly thumbClasses = computed(() =>
    [THUMB_BASE_CLASSES, THUMB_SIZE_CLASSES[this.size()]].join(' '),
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
