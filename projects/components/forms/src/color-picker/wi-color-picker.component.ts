import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import {
  BrnPopover,
  BrnPopoverContent,
  BrnPopoverTrigger,
  provideBrnPopoverConfig,
  provideBrnPopoverDefaultOptions,
} from '@spartan-ng/brain/popover';
import { applyWiConnectedOverlayPatch } from '@wldeveloperapps/ui/core';

import {
  clampHue,
  clampPercent,
  hexToHsv,
  hsvToHex,
  normalizeWiColor,
  stepSv,
  svFromPointer,
  type WiHsv,
} from './wi-color';
import type { WiColorPickerLabels, WiColorPickerSize } from './wi-color.types';

applyWiConnectedOverlayPatch();

const DEFAULT_HSV: WiHsv = { h: 0, s: 100, v: 100 };

const DEFAULT_LABELS = {
  dialog: 'Color',
  palette: 'Saturation and brightness',
  hue: 'Hue',
  hex: 'Hex',
  empty: 'None',
  eyedropper: 'Eyedropper',
} as const;

const TRIGGER_BASE_CLASSES = [
  'wi-color-picker__trigger',
  'flex',
  'w-full',
  'min-w-0',
  'items-center',
  'gap-2',
  'rounded-control',
  'border',
  'border-outline-variant',
  'bg-surface',
  'text-left',
  'text-on-surface',
  'transition-colors',
  'outline-none',
  'cursor-pointer',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:pointer-events-none',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'aria-invalid:border-error',
  'aria-invalid:focus-visible:ring-error',
  'data-[placeholder]:text-on-surface-variant',
].join(' ');

const TRIGGER_SIZE_CLASSES: Record<WiColorPickerSize, string> = {
  sm: 'h-control-sm px-3 text-sm',
  md: 'h-control-md px-3 text-sm',
  lg: 'h-control-lg px-4 text-base',
};

const SWATCH_SIZE_CLASSES: Record<WiColorPickerSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

const PANEL_CLASSES = [
  'wi-color-picker__panel',
  'z-50',
  'flex',
  'w-[min(16rem,calc(100vw-2rem))]',
  'max-w-full',
  'flex-col',
  'gap-3',
  'rounded-control',
  'border',
  'border-outline-variant',
  'bg-surface',
  'p-3',
  'text-on-surface',
  'shadow-md',
].join(' ');

const EYEDROPPER_BUTTON_CLASSES = [
  'wi-color-picker__eyedropper',
  'inline-flex',
  'h-control-sm',
  'aspect-square',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-control',
  'border',
  'border-outline-variant',
  'bg-surface',
  'text-on-surface',
  'outline-none',
  'cursor-pointer',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
].join(' ');

const HEX_INPUT_CLASSES = [
  'wi-color-picker__hex',
  'h-control-sm',
  'w-full',
  'min-w-0',
  'rounded-control',
  'border',
  'border-outline-variant',
  'bg-surface',
  'px-3',
  'font-mono',
  'text-sm',
  'text-on-surface',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'aria-invalid:border-error',
].join(' ');

let nextColorPickerId = 0;

/**
 * Selector de color libre (`wi-color-picker`).
 *
 * El valor es un hex opaco `#rrggbb`, no un id de acento y no un token.
 * No cambia con `.wi-dark`: el color elegido es un dato de la app.
 * Para la identidad de una entidad (claro y oscuro) usar `wi-accent-picker`.
 *
 * El cuentagotas usa `EyeDropper` del navegador. El botón no se pinta si
 * falta (Firefox, Safari). Cancelar no cambia el valor.
 */
@Component({
  selector: 'wi-color-picker',
  imports: [BrnPopover, BrnPopoverTrigger, BrnPopoverContent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiColorPickerComponent),
      multi: true,
    },
    provideBrnPopoverConfig({
      align: 'start',
      sideOffset: 4,
    }),
    provideBrnPopoverDefaultOptions({ role: 'dialog' }),
  ],
  host: {
    class: 'wi-color-picker block w-full min-w-0',
  },
  template: `
    <div class="wi-color-picker__root relative w-full min-w-0" brnPopover (closed)="onClosed()">
      <button
        #trigger
        type="button"
        brnPopoverTrigger
        [id]="resolvedId()"
        [class]="triggerClasses()"
        [disabled]="isDisabled()"
        [attr.aria-label]="triggerAriaLabel()"
        [attr.aria-labelledby]="labelledBy()"
        [attr.aria-describedby]="describedBy()"
        [attr.aria-required]="required() ? 'true' : null"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        aria-haspopup="dialog"
        [attr.aria-expanded]="popoverState() === 'open' ? 'true' : 'false'"
        [attr.aria-controls]="overlayId()"
        [attr.data-placeholder]="hasValue() ? null : ''"
      >
        <span
          [class]="swatchClasses()"
          aria-hidden="true"
          [style.background-color]="hasValue() ? value() : null"
        ></span>
        <span class="min-w-0 flex-1 truncate text-left font-mono">
          @if (hasValue()) {
            {{ value() }}
          } @else {
            {{ placeholder() }}
          }
        </span>
      </button>

      <ng-template brnPopoverContent>
        <div [class]="panelClasses">
          <h2 class="sr-only" [id]="dialogTitleId()">{{ labelsResolved().dialog }}</h2>

          <div
            class="wi-color-picker__palette relative h-36 w-full cursor-crosshair touch-none rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            role="slider"
            [attr.tabindex]="isDisabled() ? -1 : 0"
            [attr.aria-label]="labelsResolved().palette"
            aria-valuemin="0"
            aria-valuemax="100"
            [attr.aria-valuenow]="hsv().s"
            [attr.aria-valuetext]="paletteValueText()"
            [attr.aria-disabled]="isDisabled() ? 'true' : null"
            [style.background-color]="hueCss()"
            (pointerdown)="onPalettePointerDown($event)"
            (keydown)="onPaletteKeydown($event)"
          >
            @if (hasValue()) {
              <span
                class="wi-color-picker__thumb"
                [style.left.%]="hsv().s"
                [style.top.%]="100 - hsv().v"
              ></span>
            }
          </div>

          <input
            class="wi-color-picker__hue"
            type="range"
            min="0"
            max="359"
            step="1"
            [disabled]="isDisabled()"
            [attr.aria-label]="labelsResolved().hue"
            [attr.aria-valuetext]="paletteValueText()"
            [value]="hsv().h"
            (input)="onHueInput($event)"
          />

          <div class="flex min-w-0 items-end gap-2">
            <label class="flex min-w-0 flex-1 flex-col gap-1">
              <span class="text-xs text-on-surface-variant" [id]="hexLabelId()">
                {{ labelsResolved().hex }}
              </span>
              <input
                [class]="hexInputClasses"
                type="text"
                spellcheck="false"
                autocomplete="off"
                autocapitalize="off"
                [disabled]="isDisabled()"
                [attr.aria-labelledby]="hexLabelId()"
                [attr.aria-invalid]="invalid() ? 'true' : null"
                [value]="hexDraft()"
                (input)="onHexInput($event)"
                (blur)="onHexBlur($event)"
              />
            </label>
            @if (eyeDropperReady()) {
              <button
                type="button"
                [class]="eyedropperClasses"
                [disabled]="isDisabled() || picking()"
                [attr.aria-label]="labelsResolved().eyedropper"
                [attr.aria-busy]="picking() ? 'true' : null"
                (click)="onEyeDropper()"
              >
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 11.25 16.5 12.75l.354-.354a2.121 2.121 0 1 1 3-3L16.5 6.75 15 8.25m0 3-8.47 8.47a1.5 1.5 0 0 1-2.12 0l-.354-.353a1.5 1.5 0 0 1 0-2.122L12.75 9"
                  />
                </svg>
              </button>
            }
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: `
    .wi-color-picker__swatch--empty {
      background-color: var(--wi-color-surface);
      background-image:
        linear-gradient(45deg, var(--wi-color-outline-variant) 25%, transparent 25%),
        linear-gradient(-45deg, var(--wi-color-outline-variant) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--wi-color-outline-variant) 75%),
        linear-gradient(-45deg, transparent 75%, var(--wi-color-outline-variant) 75%);
      background-size: 8px 8px;
      background-position:
        0 0,
        0 4px,
        4px -4px,
        -4px 0;
    }

    /* Blanco y negro construyen el plano HSV. No son colores de tema. */
    .wi-color-picker__palette {
      background-image:
        linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent);
      touch-action: none;
    }

    .wi-color-picker__thumb {
      position: absolute;
      width: 0.75rem;
      height: 0.75rem;
      border: 2px solid #fff;
      border-radius: 9999px;
      box-shadow: 0 0 0 1px #000;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .wi-color-picker__hue {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 0.75rem;
      margin: 0;
      border-radius: 9999px;
      background: linear-gradient(
        to right,
        #ff0000,
        #ffff00,
        #00ff00,
        #00ffff,
        #0000ff,
        #ff00ff,
        #ff0000
      );
      cursor: pointer;
    }

    .wi-color-picker__hue:focus-visible {
      outline: 2px solid var(--wi-color-ring);
      outline-offset: 2px;
    }

    .wi-color-picker__hue:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .wi-color-picker__hue::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1rem;
      height: 1rem;
      border: 2px solid #fff;
      border-radius: 9999px;
      box-shadow: 0 0 0 1px #000;
      background: transparent;
    }

    .wi-color-picker__hue::-moz-range-thumb {
      width: 1rem;
      height: 1rem;
      border: 2px solid #fff;
      border-radius: 9999px;
      box-shadow: 0 0 0 1px #000;
      background: transparent;
    }

    .wi-color-picker__hue::-moz-range-track {
      height: 0.75rem;
      border: 0;
      background: transparent;
    }
  `,
})
export class WiColorPickerComponent
  implements ControlValueAccessor, FormValueControl<string | null>
{
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly popover = viewChild(BrnPopover);
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  /** Hex normalizado `#rrggbb`, o `null` si aún no hay color. */
  readonly value = model<string | null>(null);

  readonly size = input<WiColorPickerSize>('md');
  readonly id = input<string | undefined>(undefined);
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);
  readonly labels = input<WiColorPickerLabels>({});

  /** Emite al cerrar el panel (Signal Forms / touched). */
  readonly touch = output<void>();

  private readonly generatedId = `wi-color-picker-${++nextColorPickerId}`;
  private readonly cvaDisabled = signal(false);
  protected readonly hsv = signal<WiHsv>(DEFAULT_HSV);
  protected readonly hexDraft = signal('');
  /** El servidor y el primer render no consultan `EyeDropper` (hidratación). */
  protected readonly eyeDropperReady = signal(false);
  protected readonly picking = signal(false);
  private paletteDrag: AbortController | null = null;
  private alive = true;

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly panelClasses = PANEL_CLASSES;
  protected readonly hexInputClasses = HEX_INPUT_CLASSES;
  protected readonly eyedropperClasses = EYEDROPPER_BUTTON_CLASSES;

  protected readonly resolvedId = computed(() => {
    const id = this.id()?.trim();
    return id ? id : this.generatedId;
  });

  protected readonly dialogTitleId = computed(() => `${this.resolvedId()}-title`);
  protected readonly hexLabelId = computed(() => `${this.resolvedId()}-hex`);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly popoverState = computed(() => this.popover()?.stateComputed() ?? 'closed');

  protected readonly overlayId = computed(() =>
    this.popoverState() === 'open' ? (this.popover()?.id() ?? null) : null,
  );

  protected readonly labelledBy = computed(() => blankToNull(this.ariaLabelledBy()));
  protected readonly describedBy = computed(() => blankToNull(this.ariaDescribedBy()));

  protected readonly labelsResolved = computed(() => {
    const labels = this.labels();
    return {
      dialog: textOr(labels.dialog, DEFAULT_LABELS.dialog),
      palette: textOr(labels.palette, DEFAULT_LABELS.palette),
      hue: textOr(labels.hue, DEFAULT_LABELS.hue),
      hex: textOr(labels.hex, DEFAULT_LABELS.hex),
      empty: textOr(labels.empty, DEFAULT_LABELS.empty),
      eyedropper: textOr(labels.eyedropper, DEFAULT_LABELS.eyedropper),
    };
  });

  protected readonly triggerAriaLabel = computed(() => {
    if (this.labelledBy()) {
      return null;
    }
    return blankToNull(this.ariaLabel()) ?? this.labelsResolved().dialog;
  });

  protected readonly hasValue = computed(() => this.value() !== null);

  protected readonly triggerClasses = computed(() =>
    [TRIGGER_BASE_CLASSES, TRIGGER_SIZE_CLASSES[this.size()]].join(' '),
  );

  protected readonly swatchClasses = computed(() =>
    [
      'wi-color-picker__swatch shrink-0 rounded-control border border-outline-variant',
      SWATCH_SIZE_CLASSES[this.size()],
      this.hasValue() ? '' : 'wi-color-picker__swatch--empty',
    ].join(' '),
  );

  protected readonly hueCss = computed(() => `hsl(${this.hsv().h} 100% 50%)`);

  protected readonly paletteValueText = computed(() => this.value() ?? this.labelsResolved().empty);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.alive = false;
      this.paletteDrag?.abort();
    });

    afterNextRender(() => {
      this.eyeDropperReady.set(readEyeDropper() !== null);
    });

    effect(() => {
      const color = this.value();
      untracked(() => this.syncFromValue(color));
    });

    effect(() => {
      const open = this.popoverState() === 'open';
      const popover = this.popover();
      const titleId = this.dialogTitleId();
      if (!open || !popover) {
        return;
      }
      const id = popover.id();
      untracked(() => {
        const labelDialog = () => {
          this.document.getElementById(id)?.setAttribute('aria-labelledby', titleId);
        };
        labelDialog();
        queueMicrotask(labelDialog);
      });
    });
  }

  writeValue(value: string | null): void {
    this.value.set(typeof value === 'string' || value === null ? value : null);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  focus(options?: FocusOptions): void {
    this.triggerRef()?.nativeElement.focus(options);
  }

  protected onClosed(): void {
    this.onTouched();
    this.touch.emit();
  }

  protected onPalettePointerDown(event: PointerEvent): void {
    if (this.isDisabled() || event.button !== 0) {
      return;
    }
    const surface = event.currentTarget;
    if (!(surface instanceof HTMLElement)) {
      return;
    }

    this.paletteDrag?.abort();
    const drag = new AbortController();
    this.paletteDrag = drag;
    const paint = (ev: PointerEvent) => this.paintFromPointer(surface, ev);
    surface.addEventListener('pointermove', paint, { signal: drag.signal });
    surface.addEventListener('pointerup', () => drag.abort(), { signal: drag.signal });
    surface.addEventListener('pointercancel', () => drag.abort(), { signal: drag.signal });
    if (typeof surface.setPointerCapture === 'function') {
      try {
        surface.setPointerCapture(event.pointerId);
      } catch {
        // jsdom no implementa setPointerCapture.
      }
    }
    paint(event);
  }

  protected onPaletteKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }
    const next = stepSv(this.hsv(), event.key, event.shiftKey);
    if (!next) {
      return;
    }
    event.preventDefault();
    this.paint(next);
  }

  protected onHueInput(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    this.paint({ ...this.hsv(), h: Number(event.target.value) });
  }

  protected onHexInput(event: Event): void {
    const raw = event.target instanceof HTMLInputElement ? event.target.value : '';
    this.hexDraft.set(raw);
    const trimmed = raw.trim();
    const body = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
    if (/^[0-9a-f]{6}$/i.test(body)) {
      this.commitHex(trimmed);
    }
  }

  protected onHexBlur(event: FocusEvent): void {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    const raw = (input?.value ?? this.hexDraft()).trim();
    if (!raw) {
      this.clear();
      this.reflectHex(input, '');
      return;
    }
    const normalized = normalizeWiColor(raw);
    if (normalized) {
      this.commitHex(normalized);
      this.reflectHex(input, normalized);
      return;
    }
    this.reflectHex(input, this.value() ?? '');
  }

  private syncFromValue(color: string | null): void {
    const normalized = normalizeWiColor(color);
    if (color !== normalized) {
      this.value.set(normalized);
      this.onChange(normalized);
      return;
    }
    if (normalized && normalized !== hsvToHex(this.hsv())) {
      this.hsv.set(hexToHsv(normalized, this.hsv().h));
    }
    if (normalizeWiColor(this.hexDraft()) !== normalized) {
      this.hexDraft.set(normalized ?? '');
    }
  }

  private paintFromPointer(surface: HTMLElement, event: PointerEvent): void {
    const rect = surface.getBoundingClientRect();
    const next = svFromPointer(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height,
    );
    this.paint({ ...this.hsv(), ...next });
  }

  private paint(next: WiHsv): void {
    if (this.isDisabled()) {
      return;
    }
    const hsv = {
      h: clampHue(next.h),
      s: clampPercent(next.s),
      v: clampPercent(next.v),
    };
    const hex = hsvToHex(hsv);
    this.hsv.set(hsv);
    this.hexDraft.set(hex);
    if (this.value() === hex) {
      return;
    }
    this.value.set(hex);
    this.onChange(hex);
  }

  private commitHex(raw: string): void {
    const normalized = normalizeWiColor(raw);
    if (!normalized || this.isDisabled()) {
      return;
    }
    // El hex escrito se guarda tal cual. Pasarlo por HSV lo redondea.
    this.hsv.set(hexToHsv(normalized, this.hsv().h));
    this.hexDraft.set(normalized);
    if (this.value() === normalized) {
      return;
    }
    this.value.set(normalized);
    this.onChange(normalized);
  }

  protected onEyeDropper(): void {
    if (this.isDisabled() || this.picking()) {
      return;
    }
    const EyeDropper = readEyeDropper();
    if (!EyeDropper) {
      return;
    }
    this.picking.set(true);
    void new EyeDropper()
      .open()
      .then((result) => {
        if (this.alive && !this.isDisabled()) {
          this.commitHex(result.sRGBHex);
        }
      })
      .catch(() => {
        // Cancelar (Escape) o un fallo del navegador no cambian el valor.
      })
      .finally(() => {
        if (this.alive) {
          this.picking.set(false);
        }
      });
  }

  private reflectHex(input: HTMLInputElement | null, next: string): void {
    this.hexDraft.set(next);
    if (input && input.value !== next) {
      input.value = next;
    }
  }

  private clear(): void {
    if (this.isDisabled()) {
      return;
    }
    this.hexDraft.set('');
    if (this.value() === null) {
      return;
    }
    this.value.set(null);
    this.onChange(null);
  }
}

interface EyeDropperSample {
  sRGBHex: string;
}

type EyeDropperConstructor = new () => { open: () => Promise<EyeDropperSample> };

/** `null` en el servidor y en navegadores sin la API (Firefox, Safari). */
function readEyeDropper(): EyeDropperConstructor | null {
  const ctor = (globalThis as { EyeDropper?: EyeDropperConstructor }).EyeDropper;
  return typeof ctor === 'function' ? ctor : null;
}

function blankToNull(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function textOr(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}
