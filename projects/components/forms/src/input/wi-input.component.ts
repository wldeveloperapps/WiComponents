import {
  booleanAttribute,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { WI_ICONS, WiIconComponent } from '@wldeveloperapps/ui/icon';
import {
  eyeOutline,
  eyeSlashOutline,
  eyeSlashSolid,
  eyeSolid,
} from '@wldeveloperapps/ui/icon/heroicons';

import type { WiInputSize, WiInputType } from './wi-input.types';

const BASE_CLASSES = [
  'flex',
  'w-full',
  'min-w-0',
  'rounded-control',
  'border',
  'border-outline-variant',
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

const TOGGLE_BUTTON_CLASSES = [
  'absolute',
  'right-1',
  'top-1/2',
  '-translate-y-1/2',
  'inline-flex',
  'size-8',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-control',
  'text-on-surface-variant',
  'transition-colors',
  'hover:bg-surface-variant',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
].join(' ');

const PASSWORD_TOGGLE_ICONS = {
  eye: { outline: eyeOutline, solid: eyeSolid },
  'eye-slash': { outline: eyeSlashOutline, solid: eyeSlashSolid },
};

let nextInputId = 0;

/**
 * Campo de texto del design system (`wi-input`).
 *
 * - Tokens semánticos y tamaños alineados con `wi-button`.
 * - `FormValueControl` para Signal Forms (`[formField]`).
 * - `ControlValueAccessor` para Reactive Forms / `ngModel`.
 * - `type="password"` incluye botón de revelar/ocultar (chrome del design system).
 * - Label, hint y error quedan fuera (composición `wi-field` prevista).
 */
@Component({
  selector: 'wi-input',
  imports: [WiIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiInputComponent),
      multi: true,
    },
    {
      provide: WI_ICONS,
      useValue: PASSWORD_TOGGLE_ICONS,
      multi: true,
    },
  ],
  host: {
    class: 'wi-input contents',
  },
  template: `
    <div class="relative w-full min-w-0">
      <input
        [attr.id]="resolvedId()"
        [attr.name]="name() || null"
        [attr.type]="nativeType()"
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
      @if (showToggle()) {
        <button
          type="button"
          [class]="toggleButtonClasses"
          [attr.aria-label]="toggleAriaLabel()"
          [attr.aria-pressed]="revealed()"
          [attr.aria-controls]="resolvedId()"
          (mousedown)="$event.preventDefault()"
          (click)="togglePasswordVisibility()"
        >
          <wi-icon [name]="revealed() ? 'eye-slash' : 'eye'" size="sm" />
        </button>
      }
    </div>
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
  /**
   * Autocompletado nativo del navegador. El desplegable nativo se ancla al viewport
   * y se despega si el campo está en un `overflow: auto`. En esos shells usar `'off'`.
   */
  readonly autocomplete = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  /** Muestra el botón de revelar/ocultar cuando `type="password"`. */
  readonly passwordToggle = input(true, { transform: booleanAttribute });
  /** Nombre accesible del botón cuando la contraseña está oculta. */
  readonly showPasswordLabel = input('Show password');
  /** Nombre accesible del botón cuando la contraseña está visible. */
  readonly hidePasswordLabel = input('Hide password');

  /** Emite en blur para Signal Forms (`debounce('blur')`, touched). */
  readonly touch = output<void>();

  private readonly generatedId = `wi-input-${++nextInputId}`;
  private readonly cvaDisabled = signal(false);
  protected readonly revealed = signal(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly toggleButtonClasses = TOGGLE_BUTTON_CLASSES;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly showToggle = computed(
    () => this.type() === 'password' && this.passwordToggle() && !this.isDisabled(),
  );

  protected readonly nativeType = computed(() =>
    this.showToggle() && this.revealed() ? 'text' : this.type(),
  );

  protected readonly toggleAriaLabel = computed(() =>
    this.revealed() ? this.hidePasswordLabel() : this.showPasswordLabel(),
  );

  protected readonly classes = computed(() =>
    [BASE_CLASSES, SIZE_CLASSES[this.size()], this.showToggle() ? 'pr-10' : '']
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    effect(() => {
      if (!this.showToggle()) {
        this.revealed.set(false);
      }
    });
  }

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

  protected togglePasswordVisibility(): void {
    this.revealed.update((current) => !current);
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
