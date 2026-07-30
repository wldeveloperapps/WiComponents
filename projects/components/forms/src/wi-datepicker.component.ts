import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  linkedSignal,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import {
  BrnCalendar,
  BrnCalendarCell,
  BrnCalendarCellButton,
  BrnCalendarGrid,
  BrnCalendarHeader,
  BrnCalendarNextButton,
  BrnCalendarPreviousButton,
  BrnCalendarWeek,
  BrnCalendarWeekday,
  injectBrnCalendarI18n,
} from '@spartan-ng/brain/calendar';
import { injectDateAdapter, provideNativeDateAdapter } from '@spartan-ng/brain/date-time';
import {
  BrnPopover,
  BrnPopoverContent,
  BrnPopoverTrigger,
  provideBrnPopoverConfig,
  provideBrnPopoverDefaultOptions,
} from '@spartan-ng/brain/popover';

import { WiIconComponent } from '@wiloc/ui/icon';
import type {
  WiDateDisabled,
  WiDatepickerSize,
  WiFormatDate,
  WiWeekday,
} from './wi-datepicker.types';

const TRIGGER_BASE_CLASSES = [
  'wi-datepicker__trigger',
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
  'data-[placeholder]:text-on-surface-variant',
].join(' ');

const TRIGGER_SIZE_CLASSES: Record<WiDatepickerSize, string> = {
  sm: 'h-control-sm px-3 text-sm',
  md: 'h-control-md px-3 text-sm',
  lg: 'h-control-lg px-4 text-base',
};

const PANEL_CLASSES = [
  'wi-datepicker__panel',
  'z-50',
  'w-fit',
  'overflow-hidden',
  'rounded-control',
  'border',
  'border-outline',
  'bg-surface',
  'text-on-surface',
  'shadow-md',
  'p-3',
].join(' ');

/** Variantes `data-[…=true]` alineadas con BrnCalendarCellButton / Helm. */
const DAY_BUTTON_CLASSES = [
  'wi-datepicker__day',
  'inline-flex',
  'size-8',
  'items-center',
  'justify-center',
  'rounded-control',
  'text-sm',
  'outline-none',
  'transition-colors',
  'hover:bg-surface-variant',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'data-[outside=true]:text-on-surface-variant',
  'data-[outside=true]:opacity-60',
  'data-[today=true]:border',
  'data-[today=true]:border-outline',
  'data-[selected-single=true]:bg-primary',
  'data-[selected-single=true]:text-on-primary',
  'data-[selected-single=true]:hover:bg-primary',
  'data-[disabled=true]:pointer-events-none',
  'data-[disabled=true]:opacity-40',
].join(' ');

const NAV_BUTTON_CLASSES = [
  'inline-flex',
  'size-8',
  'items-center',
  'justify-center',
  'rounded-control',
  'text-on-surface',
  'outline-none',
  'hover:bg-surface-variant',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'disabled:pointer-events-none',
  'disabled:opacity-40',
].join(' ');

const TIME_INPUT_CLASSES = [
  'wi-datepicker__time-input',
  'h-control-sm',
  'w-12',
  'rounded-control',
  'border',
  'border-outline',
  'bg-surface',
  'px-1',
  'text-center',
  'text-sm',
  'text-on-surface',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
].join(' ');

let nextDatepickerId = 0;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Selector de fecha del design system (`wi-datepicker`).
 *
 * - Valor `Date | null` con CVA + Signal Forms.
 * - Hora opcional vía `showTime` (selector en el panel).
 * - Locale del calendario vía `provideWiCalendarI18n`.
 * - Label / hint / error quedan fuera (composición `wi-field` prevista).
 */
@Component({
  selector: 'wi-datepicker',
  imports: [
    WiIconComponent,
    BrnPopover,
    BrnPopoverTrigger,
    BrnPopoverContent,
    BrnCalendar,
    BrnCalendarHeader,
    BrnCalendarPreviousButton,
    BrnCalendarNextButton,
    BrnCalendarGrid,
    BrnCalendarWeekday,
    BrnCalendarWeek,
    BrnCalendarCell,
    BrnCalendarCellButton,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WiDatepickerComponent),
      multi: true,
    },
    provideNativeDateAdapter(),
    provideBrnPopoverConfig({
      align: 'start',
      sideOffset: 4,
    }),
    provideBrnPopoverDefaultOptions({ role: 'dialog' }),
  ],
  host: {
    class: 'wi-datepicker block w-full',
  },
  template: `
    <div class="wi-datepicker__root relative w-full" brnPopover (closed)="onClosed()">
      <div class="relative w-full">
        <button
          type="button"
          brnPopoverTrigger
          [id]="resolvedId()"
          [class]="triggerClasses()"
          [disabled]="isDisabled() || readonly()"
          [attr.aria-label]="resolvedAriaLabel()"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-required]="required() || null"
          [attr.aria-invalid]="invalid() || null"
          [attr.aria-haspopup]="'dialog'"
          [attr.aria-expanded]="popoverState() === 'open' ? 'true' : 'false'"
          [attr.data-placeholder]="hasValue() ? null : ''"
          [attr.name]="name() || null"
        >
          <span class="min-w-0 flex-1 truncate text-left">
            @if (hasValue()) {
              {{ displayText() }}
            } @else {
              {{ placeholder() }}
            }
          </span>
          @if (!(clearable() && hasValue())) {
            <span
              class="wi-datepicker__trigger-icon inline-flex size-4 shrink-0 items-center justify-center opacity-60 [&_wi-icon]:size-4"
              aria-hidden="true"
            >
              <wi-icon name="calendar" />
            </span>
          }
        </button>

        @if (clearable() && hasValue()) {
          <button
            type="button"
            class="wi-datepicker__clear absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-control text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            [attr.aria-label]="clearLabel()"
            [disabled]="isDisabled() || readonly()"
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
        <div [class]="panelClasses" role="presentation">
          <div
            class="wi-datepicker__calendar"
            brnCalendar
            [date]="calendarDate()"
            [min]="min()"
            [max]="max()"
            [disabled]="isDisabled() || readonly()"
            [dateDisabled]="dateDisabled()"
            [weekStartsOn]="weekStartsOn()"
            [defaultFocusedDate]="focusedDate()"
            (dateChange)="onCalendarDateChange($event)"
          >
            <div class="mb-2 flex items-center justify-between gap-1">
              <button type="button" [class]="navButtonClasses" brnCalendarPreviousButton>
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
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div class="min-w-0 flex-1 text-center text-sm font-medium" brnCalendarHeader>
                {{ headerLabel() }}
              </div>

              <button type="button" [class]="navButtonClasses" brnCalendarNextButton>
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
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>

            <table class="w-full border-collapse" brnCalendarGrid>
              <thead>
                <tr>
                  <th
                    *brnCalendarWeekday="let weekday"
                    class="size-8 p-0 text-center text-xs font-normal text-on-surface-variant"
                    scope="col"
                  >
                    <span [attr.aria-label]="weekdayAriaLabel(weekday)">
                      {{ weekdayShort(weekday) }}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *brnCalendarWeek="let week">
                  @for (day of week; track trackDay(day)) {
                    <td class="p-0 text-center" brnCalendarCell>
                      <button
                        type="button"
                        [class]="dayButtonClasses"
                        brnCalendarCellButton
                        [date]="day"
                      >
                        {{ dayNumber(day) }}
                      </button>
                    </td>
                  }
                </tr>
              </tbody>
            </table>
          </div>

          @if (showTime()) {
            <div
              class="wi-datepicker__time mt-3 flex items-center gap-2 border-t border-outline pt-3"
            >
              <span class="text-sm text-on-surface-variant" [id]="timeInputId() + '-label'">
                {{ timeLabel() }}
              </span>
              <div
                class="wi-datepicker__time-fields flex items-center gap-1"
                role="group"
                [attr.aria-labelledby]="timeInputId() + '-label'"
              >
                <input
                  #hourInput
                  [id]="timeInputId() + '-hour'"
                  type="text"
                  inputmode="numeric"
                  maxlength="2"
                  placeholder="HH"
                  autocomplete="off"
                  [class]="timeInputClasses"
                  [disabled]="isDisabled() || readonly() || !hasValue()"
                  [attr.aria-label]="timeLabel() + ' (hora)'"
                  (focus)="onTimeFocus()"
                  (blur)="onTimeBlur()"
                  (keydown.enter)="onTimeEnter($event)"
                />
                <span class="text-sm text-on-surface-variant" aria-hidden="true">:</span>
                <input
                  #minuteInput
                  [id]="timeInputId() + '-minute'"
                  type="text"
                  inputmode="numeric"
                  maxlength="2"
                  placeholder="MM"
                  autocomplete="off"
                  [class]="timeInputClasses"
                  [disabled]="isDisabled() || readonly() || !hasValue()"
                  [attr.aria-label]="timeLabel() + ' (minuto)'"
                  (focus)="onTimeFocus()"
                  (blur)="onTimeBlur()"
                  (keydown.enter)="onTimeEnter($event)"
                />
              </div>
            </div>
          }
        </div>
      </ng-template>
    </div>
  `,
})
export class WiDatepickerComponent implements ControlValueAccessor, FormValueControl<Date | null> {
  private readonly dateAdapter = injectDateAdapter<Date>();
  private readonly calendarI18n = injectBrnCalendarI18n();
  private readonly popover = viewChild(BrnPopover);
  private readonly calendar = viewChild(BrnCalendar);
  private readonly hourInput = viewChild<ElementRef<HTMLInputElement>>('hourInput');
  private readonly minuteInput = viewChild<ElementRef<HTMLInputElement>>('minuteInput');

  /** Valor del control (Signal Forms + two-way binding). */
  readonly value = model<Date | null>(null);

  /** Evita reescribir los inputs de hora mientras el usuario escribe. */
  private readonly timeEditing = signal(false);

  constructor() {
    // El calendario vive en el portal del popover: el `model` `date` no siempre
    // recibe el one-way `[date]` al montar. Forzamos selección al abrir.
    // Importante: NO usar `setFocusedDate` aquí — enfoca la celda del día y
    // roba el foco de los inputs de hora.
    effect(() => {
      const cal = this.calendar();
      const selected = this.calendarDate();
      if (!cal || this.timeEditing()) {
        return;
      }
      untracked(() => {
        const current = cal.date();
        const same =
          current === selected ||
          (current != null && selected != null && this.dateAdapter.isSameDay(current, selected));
        if (!same) {
          cal.date.set(selected);
        }
        if (selected) {
          const focused = cal.focusedDate();
          if (!this.dateAdapter.isSameDay(focused, selected)) {
            cal.focusedDate.set(selected);
          }
        }
      });
    });

    // Sincroniza HH/MM solo cuando no se está editando.
    effect(() => {
      const current = this.value();
      const editing = this.timeEditing();
      const hourEl = this.hourInput()?.nativeElement;
      const minuteEl = this.minuteInput()?.nativeElement;
      if (!hourEl || !minuteEl || editing) {
        return;
      }
      const hours = current ? pad2(current.getHours()) : '';
      const minutes = current ? pad2(current.getMinutes()) : '';
      if (hourEl.value !== hours) {
        hourEl.value = hours;
      }
      if (minuteEl.value !== minutes) {
        minuteEl.value = minutes;
      }
    });
  }

  readonly size = input<WiDatepickerSize>('md');
  readonly placeholder = input('');
  readonly id = input<string | undefined>(undefined);
  readonly name = input('');
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly showTime = input(false, { transform: booleanAttribute });

  /**
   * Cierra el panel al seleccionar un día.
   * Por defecto: `true` si no hay hora; `false` con `showTime`.
   */
  readonly autoCloseOnSelect = input<boolean | undefined>(undefined);

  readonly min = input<Date | undefined>(undefined);
  readonly max = input<Date | undefined>(undefined);
  readonly dateDisabled = input<WiDateDisabled>(() => false);
  readonly weekStartsOn = input<WiWeekday | undefined>(undefined);
  readonly formatDate = input<WiFormatDate | undefined>(undefined);

  readonly clearLabel = input('Clear');
  readonly calendarLabel = input('Open calendar');
  readonly timeLabel = input('Time');

  /** Emite al cerrar el panel / touched (Signal Forms). */
  readonly touch = output<void>();

  private readonly generatedId = `wi-datepicker-${++nextDatepickerId}`;
  private readonly cvaDisabled = signal(false);

  private onChange: (value: Date | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly panelClasses = PANEL_CLASSES;
  protected readonly dayButtonClasses = DAY_BUTTON_CLASSES;
  protected readonly navButtonClasses = NAV_BUTTON_CLASSES;
  protected readonly timeInputClasses = TIME_INPUT_CLASSES;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly timeInputId = computed(() => `${this.resolvedId()}-time`);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly hasValue = computed(() => this.value() != null);
  protected readonly resolvedAriaLabel = computed(() => this.ariaLabel() ?? this.calendarLabel());

  protected readonly triggerClasses = computed(() =>
    [TRIGGER_BASE_CLASSES, TRIGGER_SIZE_CLASSES[this.size()]].join(' '),
  );

  protected readonly shouldAutoClose = computed(() => {
    const explicit = this.autoCloseOnSelect();
    if (explicit !== undefined) {
      return explicit;
    }
    return !this.showTime();
  });

  /**
   * Fecha del calendario Brain (writable). Se sincroniza con `value` y admite
   * escrituras locales al seleccionar / al deshacer el toggle de Brain.
   */
  protected readonly calendarDate = linkedSignal<Date | undefined>(() => {
    const current = this.value();
    return current ? this.dateAdapter.startOfDay(current) : undefined;
  });

  /** Mes / día enfocado al abrir el panel (selección actual o hoy). */
  protected readonly focusedDate = computed(() => this.calendarDate() ?? this.dateAdapter.now());

  protected readonly displayText = computed(() => {
    const current = this.value();
    if (!current) {
      return '';
    }
    const custom = this.formatDate();
    if (custom) {
      return custom(current);
    }
    if (this.showTime()) {
      return current.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return current.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  protected readonly headerLabel = computed(() => {
    const cal = this.calendar();
    if (!cal) {
      return '';
    }
    const focused = cal.focusedDate();
    return this.calendarI18n
      .config()
      .formatHeader(this.dateAdapter.getMonth(focused), this.dateAdapter.getYear(focused));
  });

  protected readonly popoverState = computed(() => this.popover()?.stateComputed() ?? 'closed');

  writeValue(value: Date | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected trackDay(day: Date): number {
    return this.dateAdapter.getTime(day);
  }

  protected dayNumber(day: Date): number {
    return this.dateAdapter.getDate(day);
  }

  protected weekdayShort(weekday: number): string {
    return this.calendarI18n.config().formatWeekdayName(weekday);
  }

  protected weekdayAriaLabel(weekday: number): string {
    return this.calendarI18n.config().labelWeekday(weekday);
  }

  protected onCalendarDateChange(date: Date | undefined): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    // Brain hace toggle: re-clicar el día seleccionado emite `undefined`.
    if (!date) {
      if (this.clearable()) {
        this.calendarDate.set(undefined);
        this.commit(null);
      } else {
        this.calendarDate.set(
          this.value() ? this.dateAdapter.startOfDay(this.value()!) : undefined,
        );
      }
      return;
    }

    let next = this.dateAdapter.startOfDay(date);
    if (this.showTime()) {
      const current = this.value();
      if (current) {
        next = new Date(next.getTime());
        next.setHours(current.getHours(), current.getMinutes(), current.getSeconds(), 0);
      }
    }

    this.calendarDate.set(next);

    // Evita cerrar el panel cuando el effect re-aplica la selección al abrir.
    const current = this.value();
    const alreadySelected =
      current != null &&
      this.dateAdapter.isSameDay(current, next) &&
      (!this.showTime() ||
        (current.getHours() === next.getHours() && current.getMinutes() === next.getMinutes()));
    if (alreadySelected) {
      return;
    }

    this.commit(next);

    if (this.shouldAutoClose()) {
      this.popover()?.close();
    }
  }

  protected onTimeFocus(): void {
    this.timeEditing.set(true);
  }

  protected onTimeBlur(): void {
    // Al pasar de hora → minuto el blur dispara antes del focus del otro campo.
    // Aplazamos el commit para no pisar la edición en curso.
    queueMicrotask(() => {
      const hourEl = this.hourInput()?.nativeElement;
      const minuteEl = this.minuteInput()?.nativeElement;
      const active = typeof document !== 'undefined' ? document.activeElement : null;
      if (active === hourEl || active === minuteEl) {
        return;
      }
      this.commitTimeFromInputs();
      this.timeEditing.set(false);
    });
  }

  /** Confirma la hora y cierra el panel. */
  protected onTimeEnter(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.commitTimeFromInputs();
    this.timeEditing.set(false);
    this.popover()?.close();
  }

  private commitTimeFromInputs(): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    const current = this.value();
    if (!current) {
      return;
    }

    const hourEl = this.hourInput()?.nativeElement;
    const minuteEl = this.minuteInput()?.nativeElement;
    if (!hourEl || !minuteEl) {
      return;
    }

    const hours = this.parseTimePart(hourEl.value, 23);
    const minutes = this.parseTimePart(minuteEl.value, 59);
    if (hours === null || minutes === null) {
      hourEl.value = pad2(current.getHours());
      minuteEl.value = pad2(current.getMinutes());
      return;
    }

    hourEl.value = pad2(hours);
    minuteEl.value = pad2(minutes);

    if (current.getHours() === hours && current.getMinutes() === minutes) {
      return;
    }

    const next = new Date(current.getTime());
    next.setHours(hours, minutes, 0, 0);
    this.commit(next);
  }

  private parseTimePart(raw: string, max: number): number | null {
    if (raw.trim() === '') {
      return null;
    }
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0 || value > max) {
      return null;
    }
    return value;
  }

  protected onClear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isDisabled() || this.readonly()) {
      return;
    }
    this.commit(null);
    this.markTouched();
  }

  protected onClosed(): void {
    this.markTouched();
  }

  private commit(next: Date | null): void {
    this.value.set(next);
    this.onChange(next);
  }

  private markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }
}
