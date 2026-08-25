import { booleanAttribute, Component, input, model, output } from '@angular/core';

import { WiDatepickerComponent } from './wi-datepicker.component';
import type {
  WiDateDisabled,
  WiDatepickerSize,
  WiFormatDate,
  WiWeekday,
} from './wi-datepicker.types';

/**
 * Rango de fechas compuesto por dos `wi-datepicker` (inicio / fin).
 *
 * No usa un calendar range de un solo panel: cablea `min`/`max` entre ambos.
 * Cada extremo es un model independiente (dos FormControls en la app).
 */
@Component({
  selector: 'wi-date-range',
  imports: [WiDatepickerComponent],
  host: {
    class: 'wi-date-range flex w-full flex-col gap-3 sm:flex-row sm:items-start',
  },
  template: `
    <wi-datepicker
      class="wi-date-range__start min-w-0 flex-1"
      [(value)]="start"
      [max]="end() ?? undefined"
      [min]="min()"
      [size]="size()"
      [showTime]="showTime()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [invalid]="startInvalid()"
      [required]="required()"
      [clearable]="clearable()"
      [dateDisabled]="dateDisabled()"
      [weekStartsOn]="weekStartsOn()"
      [formatDate]="formatDate()"
      [autoCloseOnSelect]="autoCloseOnSelect()"
      [placeholder]="startPlaceholder()"
      [clearLabel]="clearLabel()"
      [calendarLabel]="startCalendarLabel()"
      [timeLabel]="timeLabel()"
      [ariaLabel]="startAriaLabel()"
      [ariaDescribedBy]="startAriaDescribedBy()"
      [name]="startName()"
      [id]="startId()"
      (touch)="startTouch.emit()"
    />

    <wi-datepicker
      class="wi-date-range__end min-w-0 flex-1"
      [(value)]="end"
      [min]="start() ?? undefined"
      [max]="max()"
      [size]="size()"
      [showTime]="showTime()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [invalid]="endInvalid()"
      [required]="required()"
      [clearable]="clearable()"
      [dateDisabled]="dateDisabled()"
      [weekStartsOn]="weekStartsOn()"
      [formatDate]="formatDate()"
      [autoCloseOnSelect]="autoCloseOnSelect()"
      [placeholder]="endPlaceholder()"
      [clearLabel]="clearLabel()"
      [calendarLabel]="endCalendarLabel()"
      [timeLabel]="timeLabel()"
      [ariaLabel]="endAriaLabel()"
      [ariaDescribedBy]="endAriaDescribedBy()"
      [name]="endName()"
      [id]="endId()"
      (touch)="endTouch.emit()"
    />
  `,
})
export class WiDateRangeComponent {
  /** Fecha de inicio del rango. */
  readonly start = model<Date | null>(null);

  /** Fecha de fin del rango. */
  readonly end = model<Date | null>(null);

  readonly size = input<WiDatepickerSize>('md');
  readonly showTime = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly startInvalid = input(false, { transform: booleanAttribute });
  readonly endInvalid = input(false, { transform: booleanAttribute });

  readonly min = input<Date | undefined>(undefined);
  readonly max = input<Date | undefined>(undefined);
  readonly dateDisabled = input<WiDateDisabled>(() => false);
  readonly weekStartsOn = input<WiWeekday | undefined>(undefined);
  readonly formatDate = input<WiFormatDate | undefined>(undefined);
  readonly autoCloseOnSelect = input<boolean | undefined>(undefined);

  readonly startPlaceholder = input('');
  readonly endPlaceholder = input('');
  readonly clearLabel = input('Clear');
  readonly timeLabel = input('Time');
  readonly startCalendarLabel = input('Start date');
  readonly endCalendarLabel = input('End date');
  readonly startAriaLabel = input<string | null>(null);
  readonly endAriaLabel = input<string | null>(null);
  readonly startAriaDescribedBy = input<string | null>(null);
  readonly endAriaDescribedBy = input<string | null>(null);
  readonly startName = input('');
  readonly endName = input('');
  readonly startId = input<string | undefined>(undefined);
  readonly endId = input<string | undefined>(undefined);

  readonly startTouch = output<void>();
  readonly endTouch = output<void>();
}
