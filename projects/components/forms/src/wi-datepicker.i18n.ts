import { type Provider } from '@angular/core';
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
 * Configuración de locale del calendario (inyectable desde la app).
 * No hardcodear copy de producto en la librería.
 */
export interface WiCalendarI18n {
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

/**
 * Provee i18n del calendario para `wi-datepicker` (y cualquier calendario Brain hijo).
 *
 * @example
 * ```ts
 * provideWiCalendarI18n({
 *   firstDayOfWeek: () => 1,
 *   labelPrevious: () => 'Mes anterior',
 *   labelNext: () => 'Mes siguiente',
 * })
 * ```
 */
export function provideWiCalendarI18n(configuration?: Partial<WiCalendarI18n>): Provider {
  return provideBrnCalendarI18n(configuration);
}
