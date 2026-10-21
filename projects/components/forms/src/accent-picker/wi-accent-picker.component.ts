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

import { wiAccentSwatchBackground } from './wi-accent.paint';
import {
  isWiAccent,
  WI_ACCENTS,
  type WiAccent,
  type WiAccentLabels,
  type WiAccentPickerSize,
} from './wi-accent.types';

const OPTION_CLASSES = 'wi-accent-picker__option relative inline-flex cursor-pointer';

const OPTION_DISABLED_CLASSES = 'cursor-not-allowed';

const SWATCH_BASE_CLASSES = [
  'wi-accent-picker__swatch',
  'block',
  'rounded-full',
  'border',
  'border-outline-variant',
  'peer-focus-visible:ring-2',
  'peer-focus-visible:ring-offset-2',
  'peer-focus-visible:ring-offset-background',
  'peer-checked:ring-2',
  'peer-checked:ring-offset-2',
  'peer-checked:ring-offset-background',
  'peer-disabled:opacity-40',
].join(' ');

const SWATCH_RING_CLASSES = 'peer-focus-visible:ring-ring peer-checked:ring-ring';

const SWATCH_RING_INVALID_CLASSES = 'peer-focus-visible:ring-error peer-checked:ring-error';

const SWATCH_SIZE_CLASSES: Record<WiAccentPickerSize, string> = {
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-10',
};

let nextAccentPickerId = 0;

/**
 * Selector de acento de entidad (`wi-accent-picker`).
 *
 * El valor es un id de `WI_ACCENTS`, no un color. Las muestras leen
 * `--wi-color-accent-*`, así que claro y oscuro los resuelve `.wi-dark`.
 * Para teñir un icono, usar `[wiAccent]` en el icono o en su pastilla.
 */
@Component({
  selector: 'wi-accent-picker',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiAccentPickerComponent),
      multi: true,
    },
  ],
  host: {
    class: 'wi-accent-picker flex w-fit max-w-full flex-wrap gap-2',
    role: 'radiogroup',
    '[attr.id]': 'resolvedId()',
    '[attr.aria-label]': 'groupAriaLabel()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
    '[attr.aria-required]': 'required() ? "true" : null',
    '[class.rounded-control]': 'invalid()',
    '[class.ring-2]': 'invalid()',
    '[class.ring-error]': 'invalid()',
    '[class.ring-offset-2]': 'invalid()',
    '[class.ring-offset-background]': 'invalid()',
  },
  template: `
    @for (accent of visibleAccents(); track accent) {
      <label [class]="optionClasses()">
        <input
          type="radio"
          class="peer sr-only"
          [id]="optionId(accent)"
          [name]="groupName()"
          [value]="accent"
          [checked]="value() === accent"
          [disabled]="isDisabled()"
          [required]="required()"
          [attr.aria-label]="labelFor(accent)"
          (change)="onSelect(accent)"
          (blur)="onOptionBlur($event)"
        />
        <span
          [class]="swatchClasses()"
          [style.background-color]="swatchBackground(accent)"
          [attr.title]="labelFor(accent)"
        ></span>
      </label>
    }
  `,
})
export class WiAccentPickerComponent
  implements ControlValueAccessor, FormValueControl<WiAccent | null>
{
  /** Id seleccionado. `null` si aún no hay elección. */
  readonly value = model<WiAccent | null>(null);

  /** Subconjunto de la paleta, en el orden que se muestra. Por defecto, todos. */
  readonly accents = input<readonly WiAccent[]>(WI_ACCENTS);

  /** Nombre accesible de cada muestra. Si falta, se usa el id. */
  readonly accentLabels = input<WiAccentLabels>({});

  readonly size = input<WiAccentPickerSize>('md');
  readonly id = input<string | undefined>(undefined);

  /**
   * `name` nativo del grupo de radios.
   * Vacío genera uno único. Si se informa, no lo reutilices en otro picker.
   */
  readonly name = input<string>('');

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  /** Emite al salir del grupo (Signal Forms / touched). */
  readonly touch = output<void>();

  private readonly generatedId = `wi-accent-picker-${++nextAccentPickerId}`;
  private readonly generatedName = `${this.generatedId}-group`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: WiAccent | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly groupName = computed(() => {
    const name = this.name().trim();
    return name ? name : this.generatedName;
  });

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly visibleAccents = computed(() => {
    const seen = new Set<WiAccent>();
    const result: WiAccent[] = [];
    for (const accent of this.accents()) {
      if (isWiAccent(accent) && !seen.has(accent)) {
        seen.add(accent);
        result.push(accent);
      }
    }
    return result;
  });

  protected readonly labelledBy = computed(() => blankToNull(this.ariaLabelledBy()));

  protected readonly describedBy = computed(() => blankToNull(this.ariaDescribedBy()));

  protected readonly groupAriaLabel = computed(() => {
    if (this.labelledBy()) {
      return null;
    }
    return blankToNull(this.ariaLabel());
  });

  protected readonly optionClasses = computed(() =>
    [OPTION_CLASSES, this.isDisabled() ? OPTION_DISABLED_CLASSES : ''].join(' '),
  );

  protected readonly swatchClasses = computed(() =>
    [
      SWATCH_BASE_CLASSES,
      SWATCH_SIZE_CLASSES[this.size()],
      this.invalid() ? SWATCH_RING_INVALID_CLASSES : SWATCH_RING_CLASSES,
    ].join(' '),
  );

  writeValue(value: WiAccent | null): void {
    this.value.set(isWiAccent(value) ? value : null);
  }

  registerOnChange(fn: (value: WiAccent | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected labelFor(accent: WiAccent): string {
    const custom = this.accentLabels()[accent]?.trim();
    return custom ? custom : accent;
  }

  protected swatchBackground(accent: WiAccent): string {
    return wiAccentSwatchBackground(accent);
  }

  protected optionId(accent: WiAccent): string {
    return `${this.resolvedId()}-${accent}`;
  }

  protected onSelect(accent: WiAccent): void {
    if (this.isDisabled() || !this.visibleAccents().includes(accent)) {
      return;
    }
    this.value.set(accent);
    this.onChange(accent);
  }

  protected onOptionBlur(event: FocusEvent): void {
    const next = event.relatedTarget;
    const current = event.currentTarget;
    if (current instanceof HTMLElement && next instanceof Node) {
      const group = current.closest('.wi-accent-picker');
      if (group?.contains(next)) {
        return;
      }
    }
    this.onTouched();
    this.touch.emit();
  }
}

function blankToNull(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
