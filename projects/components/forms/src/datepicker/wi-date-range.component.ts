import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  BrnCalendarCell,
  BrnCalendarCellButton,
  BrnCalendarGrid,
  BrnCalendarHeader,
  BrnCalendarNextButton,
  BrnCalendarPreviousButton,
  BrnCalendarRange,
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

import { WiIconComponent } from '@wldeveloperapps/ui/icon';
import { formatWiDateRange } from './wi-date';
import {
  WI_DATEPICKER_DAY_BUTTON_CLASSES,
  WI_DATEPICKER_NAV_BUTTON_CLASSES,
  WI_DATEPICKER_PANEL_CLASSES,
  WI_DATEPICKER_TIME_INPUT_CLASSES,
  WI_DATEPICKER_TRIGGER_BASE_CLASSES,
  WI_DATEPICKER_TRIGGER_SIZE_CLASSES,
} from './wi-datepicker.chrome';
import { injectWiDatepickerTimeI18n } from './wi-datepicker.i18n';
import { injectWiTimeZoneId } from './wi-datepicker.timezone';
import type {
  WiDateDisabled,
  WiDatepickerSize,
  WiDisplayDateFormat,
  WiFormatDate,
  WiWeekday,
} from './wi-datepicker.types';

const TRIGGER_BASE_CLASSES = `wi-date-range__trigger ${WI_DATEPICKER_TRIGGER_BASE_CLASSES}`;
const PANEL_CLASSES = `wi-date-range__panel ${WI_DATEPICKER_PANEL_CLASSES}`;
const DAY_BUTTON_CLASSES = `wi-date-range__day ${WI_DATEPICKER_DAY_BUTTON_CLASSES}`;
const NAV_BUTTON_CLASSES = WI_DATEPICKER_NAV_BUTTON_CLASSES;
const TIME_INPUT_CLASSES = `wi-date-range__time-input ${WI_DATEPICKER_TIME_INPUT_CLASSES}`;

let nextDateRangeId = 0;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Rango de fechas en un único input (trigger + calendario range).
 *
 * - Models `start` / `end` independientes.
 * - Calendario Brain range (interno; no se expone en la API pública).
 * - Hora opcional vía `showTime` (dos grupos HH:MM).
 * - Display: `formatDate` > `displayFormat` > locale del runtime.
 */
@Component({
  selector: 'wi-date-range',
  imports: [
    WiIconComponent,
    BrnPopover,
    BrnPopoverTrigger,
    BrnPopoverContent,
    BrnCalendarRange,
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
    provideNativeDateAdapter(),
    provideBrnPopoverConfig({
      align: 'start',
      sideOffset: 4,
    }),
    provideBrnPopoverDefaultOptions({ role: 'dialog' }),
  ],
  host: {
    class: 'wi-date-range block w-full',
  },
  template: `
    <div class="wi-date-range__root relative w-full" brnPopover (closed)="onClosed()">
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
              class="wi-date-range__trigger-icon inline-flex size-4 shrink-0 items-center justify-center opacity-60 [&_wi-icon]:size-4"
              aria-hidden="true"
            >
              <wi-icon name="calendar" />
            </span>
          }
        </button>

        @if (clearable() && hasValue()) {
          <button
            type="button"
            class="wi-date-range__clear absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-control text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
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
            class="wi-date-range__calendar"
            brnCalendarRange
            [startDate]="calendarStart()"
            (startDateChange)="onCalendarStartChange($event)"
            [endDate]="calendarEnd()"
            (endDateChange)="onCalendarEndChange($event)"
            [min]="min()"
            [max]="max()"
            [disabled]="isDisabled() || readonly()"
            [dateDisabled]="dateDisabled()"
            [weekStartsOn]="weekStartsOn()"
            [defaultFocusedDate]="focusedDate()"
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
              class="wi-date-range__time mt-3 flex flex-col gap-2 border-t border-outline-variant pt-3"
            >
              <div
                class="wi-date-range__time-start flex items-center gap-2"
                role="group"
                [attr.aria-labelledby]="timeInputId() + '-start-label'"
              >
                <span
                  class="min-w-16 text-sm text-on-surface-variant"
                  [id]="timeInputId() + '-start-label'"
                >
                  {{ startTimeLabel() }}
                </span>
                <div class="wi-date-range__time-fields flex items-center gap-1">
                  <input
                    #startHourInput
                    [id]="timeInputId() + '-start-hour'"
                    type="text"
                    inputmode="numeric"
                    maxlength="2"
                    [placeholder]="timeI18n.hourPlaceholder()"
                    autocomplete="off"
                    [class]="timeInputClasses"
                    [disabled]="isDisabled() || readonly() || !start()"
                    [attr.aria-label]="timeI18n.hourAriaLabel()"
                    (focus)="onTimeFocus()"
                    (blur)="onTimeBlur('start')"
                    (keydown.enter)="onTimeEnter($event, 'start')"
                  />
                  <span class="text-sm text-on-surface-variant" aria-hidden="true">:</span>
                  <input
                    #startMinuteInput
                    [id]="timeInputId() + '-start-minute'"
                    type="text"
                    inputmode="numeric"
                    maxlength="2"
                    [placeholder]="timeI18n.minutePlaceholder()"
                    autocomplete="off"
                    [class]="timeInputClasses"
                    [disabled]="isDisabled() || readonly() || !start()"
                    [attr.aria-label]="timeI18n.minuteAriaLabel()"
                    (focus)="onTimeFocus()"
                    (blur)="onTimeBlur('start')"
                    (keydown.enter)="onTimeEnter($event, 'start')"
                  />
                </div>
              </div>

              <div
                class="wi-date-range__time-end flex items-center gap-2"
                role="group"
                [attr.aria-labelledby]="timeInputId() + '-end-label'"
              >
                <span
                  class="min-w-16 text-sm text-on-surface-variant"
                  [id]="timeInputId() + '-end-label'"
                >
                  {{ endTimeLabel() }}
                </span>
                <div class="wi-date-range__time-fields flex items-center gap-1">
                  <input
                    #endHourInput
                    [id]="timeInputId() + '-end-hour'"
                    type="text"
                    inputmode="numeric"
                    maxlength="2"
                    [placeholder]="timeI18n.hourPlaceholder()"
                    autocomplete="off"
                    [class]="timeInputClasses"
                    [disabled]="isDisabled() || readonly() || !end()"
                    [attr.aria-label]="timeI18n.hourAriaLabel()"
                    (focus)="onTimeFocus()"
                    (blur)="onTimeBlur('end')"
                    (keydown.enter)="onTimeEnter($event, 'end')"
                  />
                  <span class="text-sm text-on-surface-variant" aria-hidden="true">:</span>
                  <input
                    #endMinuteInput
                    [id]="timeInputId() + '-end-minute'"
                    type="text"
                    inputmode="numeric"
                    maxlength="2"
                    [placeholder]="timeI18n.minutePlaceholder()"
                    autocomplete="off"
                    [class]="timeInputClasses"
                    [disabled]="isDisabled() || readonly() || !end()"
                    [attr.aria-label]="timeI18n.minuteAriaLabel()"
                    (focus)="onTimeFocus()"
                    (blur)="onTimeBlur('end')"
                    (keydown.enter)="onTimeEnter($event, 'end')"
                  />
                </div>
              </div>
            </div>
          }
        </div>
      </ng-template>
    </div>
  `,
})
export class WiDateRangeComponent {
  private readonly dateAdapter = injectDateAdapter<Date>();
  private readonly calendarI18n = injectBrnCalendarI18n();
  protected readonly timeI18n = injectWiDatepickerTimeI18n();
  /** TZ del site (provider); no muta los Dates naive del control. */
  protected readonly siteTimeZoneId = injectWiTimeZoneId();
  private readonly popover = viewChild(BrnPopover);
  private readonly calendar = viewChild(BrnCalendarRange);
  private readonly startHourInput = viewChild<ElementRef<HTMLInputElement>>('startHourInput');
  private readonly startMinuteInput = viewChild<ElementRef<HTMLInputElement>>('startMinuteInput');
  private readonly endHourInput = viewChild<ElementRef<HTMLInputElement>>('endHourInput');
  private readonly endMinuteInput = viewChild<ElementRef<HTMLInputElement>>('endMinuteInput');

  /** Fecha de inicio del rango. */
  readonly start = model<Date | null>(null);

  /** Fecha de fin del rango. */
  readonly end = model<Date | null>(null);

  private readonly timeEditing = signal(false);

  constructor() {
    // Sync HH/MM inputs when not editing.
    effect(() => {
      const start = this.start();
      const end = this.end();
      const editing = this.timeEditing();
      if (editing) {
        return;
      }
      this.writeTimeInputs('start', start);
      this.writeTimeInputs('end', end);
    });
  }

  readonly size = input<WiDatepickerSize>('md');
  readonly showTime = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  readonly min = input<Date | undefined>(undefined);
  readonly max = input<Date | undefined>(undefined);
  readonly dateDisabled = input<WiDateDisabled>(() => false);
  readonly weekStartsOn = input<WiWeekday | undefined>(undefined);
  readonly formatDate = input<WiFormatDate | undefined>(undefined);
  /** Patrón de display (`YYYY/MM/DD`, …). `formatDate` tiene prioridad si está definido. */
  readonly displayFormat = input<WiDisplayDateFormat | undefined>(undefined);

  /**
   * Cierra el panel al completar el rango.
   * Por defecto: `true` si no hay hora; `false` con `showTime`.
   */
  readonly autoCloseOnSelect = input<boolean | undefined>(undefined);

  readonly placeholder = input('');
  readonly clearLabel = input('Clear');
  readonly calendarLabel = input('Open calendar');
  readonly startTimeLabel = input('Start');
  readonly endTimeLabel = input('End');
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);
  readonly name = input('');
  readonly id = input<string | undefined>(undefined);

  /** Emite al cerrar el panel / touched. */
  readonly touch = output<void>();

  private readonly generatedId = `wi-date-range-${++nextDateRangeId}`;

  protected readonly panelClasses = PANEL_CLASSES;
  protected readonly dayButtonClasses = DAY_BUTTON_CLASSES;
  protected readonly navButtonClasses = NAV_BUTTON_CLASSES;
  protected readonly timeInputClasses = TIME_INPUT_CLASSES;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly timeInputId = computed(() => `${this.resolvedId()}-time`);
  protected readonly isDisabled = computed(() => this.disabled());
  protected readonly hasValue = computed(() => this.start() != null || this.end() != null);
  protected readonly resolvedAriaLabel = computed(() => this.ariaLabel() ?? this.calendarLabel());

  protected readonly triggerClasses = computed(() =>
    [TRIGGER_BASE_CLASSES, WI_DATEPICKER_TRIGGER_SIZE_CLASSES[this.size()]].join(' '),
  );

  protected readonly shouldAutoClose = computed(() => {
    const explicit = this.autoCloseOnSelect();
    if (explicit !== undefined) {
      return explicit;
    }
    return !this.showTime();
  });

  /** Día civil de inicio en el calendario Brain (writable). */
  protected readonly calendarStart = linkedSignal<Date | undefined>(() => {
    const current = this.start();
    return current ? this.dateAdapter.startOfDay(current) : undefined;
  });

  /** Día civil de fin en el calendario Brain (writable). */
  protected readonly calendarEnd = linkedSignal<Date | undefined>(() => {
    const current = this.end();
    return current ? this.dateAdapter.startOfDay(current) : undefined;
  });

  protected readonly focusedDate = computed(
    () => this.calendarStart() ?? this.calendarEnd() ?? this.dateAdapter.now(),
  );

  protected readonly displayText = computed(() => {
    const start = this.start();
    const end = this.end();
    if (!start && !end) {
      return '';
    }
    const custom = this.formatDate();
    if (custom) {
      if (start && end) {
        return `${custom(start)} - ${custom(end)}`;
      }
      return custom(start ?? end!);
    }
    const pattern = this.displayFormat();
    if (pattern) {
      return formatWiDateRange(start, end, pattern);
    }
    if (this.showTime()) {
      const fmt = (d: Date) =>
        d.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      if (start && end) {
        return `${fmt(start)} - ${fmt(end)}`;
      }
      return fmt(start ?? end!);
    }
    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    if (start && end) {
      return `${fmt(start)} - ${fmt(end)}`;
    }
    return fmt(start ?? end!);
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

  protected onCalendarStartChange(date: Date | undefined): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }
    this.calendarStart.set(date);
    const next = date ? this.mergeDayWithTime(date, this.start()) : null;
    if (!this.sameInstant(this.start(), next)) {
      this.start.set(next);
    }
    this.maybeAutoClose();
  }

  protected onCalendarEndChange(date: Date | undefined): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }
    this.calendarEnd.set(date);
    const next = date ? this.mergeDayWithTime(date, this.end()) : null;
    if (!this.sameInstant(this.end(), next)) {
      this.end.set(next);
    }
    this.maybeAutoClose();
  }

  private maybeAutoClose(): void {
    if (this.shouldAutoClose() && this.start() && this.end()) {
      this.popover()?.close();
    }
  }

  private mergeDayWithTime(day: Date, previous: Date | null): Date {
    let next = this.dateAdapter.startOfDay(day);
    if (this.showTime() && previous) {
      next = new Date(next.getTime());
      next.setHours(previous.getHours(), previous.getMinutes(), previous.getSeconds(), 0);
    }
    return next;
  }

  private sameInstant(a: Date | null, b: Date | null): boolean {
    if (a == null && b == null) {
      return true;
    }
    if (a == null || b == null) {
      return false;
    }
    return a.getTime() === b.getTime();
  }

  protected onTimeFocus(): void {
    this.timeEditing.set(true);
  }

  protected onTimeBlur(which: 'start' | 'end'): void {
    queueMicrotask(() => {
      const active = typeof document !== 'undefined' ? document.activeElement : null;
      const inputs = this.timeInputElements(which);
      if (active === inputs.hour || active === inputs.minute) {
        return;
      }
      // Also keep editing if focus moved to the other pair.
      const other = this.timeInputElements(which === 'start' ? 'end' : 'start');
      if (active === other.hour || active === other.minute) {
        return;
      }
      this.commitTimeFromInputs(which);
      this.timeEditing.set(false);
    });
  }

  protected onTimeEnter(event: Event, which: 'start' | 'end'): void {
    event.preventDefault();
    event.stopPropagation();
    this.commitTimeFromInputs(which);
    this.timeEditing.set(false);
    this.popover()?.close();
  }

  private timeInputElements(which: 'start' | 'end'): {
    hour: HTMLInputElement | undefined;
    minute: HTMLInputElement | undefined;
  } {
    if (which === 'start') {
      return {
        hour: this.startHourInput()?.nativeElement,
        minute: this.startMinuteInput()?.nativeElement,
      };
    }
    return {
      hour: this.endHourInput()?.nativeElement,
      minute: this.endMinuteInput()?.nativeElement,
    };
  }

  private writeTimeInputs(which: 'start' | 'end', current: Date | null): void {
    const { hour, minute } = this.timeInputElements(which);
    if (!hour || !minute) {
      return;
    }
    const hours = current ? pad2(current.getHours()) : '';
    const minutes = current ? pad2(current.getMinutes()) : '';
    if (hour.value !== hours) {
      hour.value = hours;
    }
    if (minute.value !== minutes) {
      minute.value = minutes;
    }
  }

  private commitTimeFromInputs(which: 'start' | 'end'): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }
    const current = which === 'start' ? this.start() : this.end();
    if (!current) {
      return;
    }
    const { hour, minute } = this.timeInputElements(which);
    if (!hour || !minute) {
      return;
    }
    const hours = this.parseTimePart(hour.value, 23);
    const minutes = this.parseTimePart(minute.value, 59);
    if (hours === null || minutes === null) {
      hour.value = pad2(current.getHours());
      minute.value = pad2(current.getMinutes());
      return;
    }
    hour.value = pad2(hours);
    minute.value = pad2(minutes);
    if (current.getHours() === hours && current.getMinutes() === minutes) {
      return;
    }
    const next = new Date(current.getTime());
    next.setHours(hours, minutes, 0, 0);
    if (which === 'start') {
      this.start.set(next);
    } else {
      this.end.set(next);
    }
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
    this.start.set(null);
    this.end.set(null);
    this.calendarStart.set(undefined);
    this.calendarEnd.set(undefined);
    this.markTouched();
  }

  protected onClosed(): void {
    this.markTouched();
  }

  private markTouched(): void {
    this.touch.emit();
  }
}
