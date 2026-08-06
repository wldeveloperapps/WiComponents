import { inject, InjectionToken, type Provider } from '@angular/core';
import { provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';

import type { WiWeekday } from './wi-datepicker.types';

/** Etiquetas de los 12 meses (índice 0 = enero). */
export type WiMonthLabels = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

/**
 * Formato i18n de los campos de hora del datepicker (Wi; no se pasa a Spartan).
 */
export interface WiDatepickerTimeI18n {
  hourPlaceholder: () => string;
  minutePlaceholder: () => string;
  hourAriaLabel: () => string;
  minuteAriaLabel: () => string;
}

/**
 * Configuración de locale del calendario (inyectable desde la app).
 * No hardcodear copy de producto en la librería.
 *
 * Incluye formato de hora/minuto (`showTime`); la parte de calendario se
 * reenvía a Spartan Brain y la de hora queda en un token Wi.
 */
export interface WiCalendarI18n extends WiDatepickerTimeI18n {
  formatWeekdayName: (index: number) => string;
  formatHeader: (month: number, year: number) => string;
  formatYear: (year: number) => string;
  formatMonth: (month: number) => string;
  labelPrevious: () => string;
  labelNext: () => string;
  labelWeekday: (index: number) => string;
  months: () => WiMonthLabels;
  years: (startYear?: number, endYear?: number) => number[];
  firstDayOfWeek: () => WiWeekday;
}

const defaultTimeI18n: WiDatepickerTimeI18n = {
  hourPlaceholder: () => 'HH',
  minutePlaceholder: () => 'MM',
  hourAriaLabel: () => 'Hour',
  minuteAriaLabel: () => 'Minute',
};

const WI_DATEPICKER_TIME_I18N = new InjectionToken<WiDatepickerTimeI18n>('WI_DATEPICKER_TIME_I18N');

/**
 * Provee i18n del calendario + formato de hora para `wi-datepicker`
 * (y cualquier calendario Brain hijo).
 *
 * @example
 * ```ts
 * provideWiCalendarI18n({
 *   firstDayOfWeek: () => 1,
 *   labelPrevious: () => 'Mes anterior',
 *   labelNext: () => 'Mes siguiente',
 *   hourPlaceholder: () => 'HH',
 *   minutePlaceholder: () => 'MM',
 *   hourAriaLabel: () => 'Hora',
 *   minuteAriaLabel: () => 'Minuto',
 * })
 * ```
 */
export function provideWiCalendarI18n(configuration?: Partial<WiCalendarI18n>): Provider[] {
  const { hourPlaceholder, minutePlaceholder, hourAriaLabel, minuteAriaLabel, ...calendarConfig } =
    configuration ?? {};

  return [
    provideBrnCalendarI18n(calendarConfig),
    {
      provide: WI_DATEPICKER_TIME_I18N,
      useValue: {
        hourPlaceholder: hourPlaceholder ?? defaultTimeI18n.hourPlaceholder,
        minutePlaceholder: minutePlaceholder ?? defaultTimeI18n.minutePlaceholder,
        hourAriaLabel: hourAriaLabel ?? defaultTimeI18n.hourAriaLabel,
        minuteAriaLabel: minuteAriaLabel ?? defaultTimeI18n.minuteAriaLabel,
      } satisfies WiDatepickerTimeI18n,
    },
  ];
}

/** @internal */
export function injectWiDatepickerTimeI18n(): WiDatepickerTimeI18n {
  return inject(WI_DATEPICKER_TIME_I18N, { optional: true }) ?? defaultTimeI18n;
}
