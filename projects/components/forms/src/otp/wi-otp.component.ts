import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { BrnInputOtp, BrnInputOtpSlot } from '@spartan-ng/brain/input-otp';

import type { WiOtpAutocomplete, WiOtpInputMode, WiOtpSize } from './wi-otp.types';

const CONTROL_CLASSES = [
  'wi-otp__control',
  'flex',
  'min-w-0',
  'flex-wrap',
  'items-center',
  'gap-1.5',
].join(' ');

const SLOT_BASE_CLASSES = [
  'wi-otp__slot',
  'relative',
  'flex',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-control',
  'border',
  'bg-surface',
  'font-medium',
  'text-on-surface',
  'tabular-nums',
  'transition-colors',
  'data-[active=true]:z-10',
  'data-[active=true]:border-ring',
  'data-[active=true]:ring-2',
  'data-[active=true]:ring-ring',
  'data-[active=true]:ring-offset-2',
  'data-[active=true]:ring-offset-background',
].join(' ');

const SLOT_SIZE_CLASSES: Record<WiOtpSize, string> = {
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg',
};

const SLOT_VALID_CLASSES = 'border-outline';
const SLOT_INVALID_CLASSES =
  'border-error data-[active=true]:border-error data-[active=true]:ring-error';

let nextOtpId = 0;

/**
 * Código de un solo uso (`wi-otp`).
 *
 * - Casillas generadas según `length` (por defecto 6, login).
 * - Pegado con recorte de espacios/guiones; en `numeric`/`tel` solo dígitos.
 * - `FormValueControl` + `ControlValueAccessor`.
 * - Label, hint y error quedan fuera (composición `wi-field` prevista).
 */
@Component({
  selector: 'wi-otp',
  imports: [BrnInputOtp, BrnInputOtpSlot],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiOtpComponent),
      multi: true,
    },
  ],
  host: {
    class: 'wi-otp inline-flex min-w-0',
    '[class.pointer-events-none]': 'isDisabled()',
    '[class.opacity-50]': 'isDisabled()',
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    <brn-input-otp
      [class]="CONTROL_CLASSES"
      [maxLength]="resolvedLength()"
      [value]="value()"
      [disabled]="isDisabled()"
      [inputId]="resolvedId()"
      [inputAutocomplete]="autocomplete()"
      [inputMode]="inputMode()"
      [autofocus]="autofocus()"
      [transformPaste]="transformPaste"
      (valueChange)="onBrainValueChange($event)"
      (completed)="onBrainCompleted($event)"
    >
      @for (index of slotIndexes(); track index) {
        <brn-input-otp-slot [index]="index" [class]="slotClasses()">
          <span
            class="wi-otp__caret pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <span class="h-4 w-px bg-on-surface motion-safe:animate-pulse"></span>
          </span>
        </brn-input-otp-slot>
      }
    </brn-input-otp>
  `,
})
export class WiOtpComponent implements ControlValueAccessor, FormValueControl<string> {
  /** Valor del control (Signal Forms + two-way binding). */
  readonly value = model('');

  readonly length = input(6, { transform: numberAttribute });
  readonly size = input<WiOtpSize>('md');
  readonly inputMode = input<WiOtpInputMode>('numeric');
  readonly autocomplete = input<WiOtpAutocomplete>('one-time-code');
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string>('');

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly autofocus = input(false, { transform: booleanAttribute });

  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  /** Emite en blur para Signal Forms (`debounce('blur')`, touched). */
  readonly touch = output<void>();

  /** Emite cuando el valor alcanza `length` por interacción (teclado o pegado). */
  readonly completed = output<string>();

  protected readonly CONTROL_CLASSES = CONTROL_CLASSES;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly generatedId = `wi-otp-${++nextOtpId}`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly resolvedLength = computed(() => {
    const n = this.length();
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 6;
  });

  protected readonly slotIndexes = computed(() =>
    Array.from({ length: this.resolvedLength() }, (_, index) => index),
  );

  protected readonly slotClasses = computed(() =>
    [
      SLOT_BASE_CLASSES,
      SLOT_SIZE_CLASSES[this.size()],
      this.invalid() ? SLOT_INVALID_CLASSES : SLOT_VALID_CLASSES,
    ].join(' '),
  );

  constructor() {
    afterRenderEffect(() => {
      this.syncNativeInputA11y();
    });
  }

  protected readonly transformPaste = (text: string): string => this.sanitize(text);

  writeValue(value: string | null): void {
    this.value.set(this.sanitize(value ?? ''));
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

  protected onBrainValueChange(next: string): void {
    const sanitized = this.sanitize(next);
    this.value.set(sanitized);
    this.onChange(sanitized);
  }

  protected onBrainCompleted(next: string): void {
    const sanitized = this.sanitize(next);
    if (sanitized.length === this.resolvedLength()) {
      this.completed.emit(sanitized);
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.host.nativeElement.contains(next)) {
      return;
    }
    this.onTouched();
    this.touch.emit();
  }

  private sanitize(text: string): string {
    const stripped = text.replace(/[\s-]/g, '');
    const mode = this.inputMode();
    if (mode === 'numeric' || mode === 'tel') {
      return stripped.replace(/\D/g, '');
    }
    return stripped;
  }

  private syncNativeInputA11y(): void {
    const input = this.host.nativeElement.querySelector('input[data-slot="input-otp"]');
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    this.setOrRemoveAttr(input, 'aria-label', this.ariaLabel());
    this.setOrRemoveAttr(input, 'aria-labelledby', this.ariaLabelledBy());
    this.setOrRemoveAttr(input, 'aria-describedby', this.ariaDescribedBy());

    if (this.invalid()) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }

    if (this.required()) {
      input.setAttribute('aria-required', 'true');
      input.setAttribute('required', '');
    } else {
      input.removeAttribute('aria-required');
      input.removeAttribute('required');
    }

    const name = this.name();
    if (name) {
      input.setAttribute('name', name);
    } else {
      input.removeAttribute('name');
    }

    input.readOnly = this.readonly();
  }

  private setOrRemoveAttr(el: HTMLElement, attr: string, value: string | null): void {
    if (value) {
      el.setAttribute(attr, value);
    } else {
      el.removeAttribute(attr);
    }
  }
}
