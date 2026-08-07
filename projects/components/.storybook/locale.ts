import { signal } from '@angular/core';

import type { WiDataDisplayI18n } from '../data-display/src/wi-data-display.i18n';
import type { WiCalendarI18n, WiMonthLabels } from '../forms/src/wi-datepicker.i18n';
import type { WiOverlaysI18n } from '../overlays/src/wi-overlays.i18n';

/** Locale de demo en Storybook (no es un diccionario de la librería). */
export type StorybookLocale = 'es' | 'en';

export const storybookLocale = signal<StorybookLocale>('es');

export function setStorybookLocale(locale: StorybookLocale): void {
  storybookLocale.set(locale);
}

const ES_MONTHS: WiMonthLabels = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const EN_MONTHS: WiMonthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ES_WEEKDAYS_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'] as const;
const EN_WEEKDAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

const ES_WEEKDAYS_LONG = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const;

const EN_WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const isEs = () => storybookLocale() === 'es';

/** Calendario / hora: lee `storybookLocale` en cada llamada. */
export function createStorybookCalendarI18n(): Partial<WiCalendarI18n> {
  return {
    firstDayOfWeek: () => 1,
    months: () => (isEs() ? ES_MONTHS : EN_MONTHS),
    formatMonth: (month) => (isEs() ? ES_MONTHS : EN_MONTHS)[month],
    formatYear: (year) => String(year),
    formatHeader: (month, year) => {
      const months = isEs() ? ES_MONTHS : EN_MONTHS;
      return `${months[month]} ${year}`;
    },
    formatWeekdayName: (index) => {
      const days = isEs() ? ES_WEEKDAYS_SHORT : EN_WEEKDAYS_SHORT;
      return days[index % 7] ?? '';
    },
    labelWeekday: (index) => {
      const days = isEs() ? ES_WEEKDAYS_LONG : EN_WEEKDAYS_LONG;
      return days[index % 7] ?? '';
    },
    labelPrevious: () => (isEs() ? 'Mes anterior' : 'Previous month'),
    labelNext: () => (isEs() ? 'Mes siguiente' : 'Next month'),
    hourPlaceholder: () => 'HH',
    minutePlaceholder: () => 'MM',
    hourAriaLabel: () => (isEs() ? 'Hora' : 'Hour'),
    minuteAriaLabel: () => (isEs() ? 'Minuto' : 'Minute'),
  };
}

/** Tabla / paginación / columnas: lee `storybookLocale` en cada llamada. */
export function createStorybookDataDisplayI18n(): Partial<WiDataDisplayI18n> {
  return {
    emptyMessage: () => (isEs() ? 'No hay datos' : 'No data'),
    tableAriaLabel: () => (isEs() ? 'Tabla de datos' : 'Data table'),
    paginationAriaLabel: () => (isEs() ? 'Paginación' : 'Pagination'),
    previousLabel: () => (isEs() ? 'Anterior' : 'Previous'),
    nextLabel: () => (isEs() ? 'Siguiente' : 'Next'),
    filterPlaceholder: () => (isEs() ? 'Escribir para buscar' : 'Type to search'),
    selectPlaceholder: () => (isEs() ? 'Seleccionar uno' : 'Select one'),
    filterOperatorAriaLabel: () => (isEs() ? 'Operador de filtro' : 'Filter operator'),
    filterAriaLabel: (header) => (isEs() ? `Filtrar ${header}` : `Filter ${header}`),
    columnVisibilitySummary: () =>
      isEs() ? '{visible} de {total} columnas visibles' : '{visible} of {total} columns visible',
    columnVisibilityMenuLabel: () => (isEs() ? 'Columnas' : 'Columns'),
    columnVisibilityAriaLabel: () => (isEs() ? 'Visibilidad de columnas' : 'Column visibility'),
    resultCountTemplate: () => (isEs() ? '{count} resultados' : '{count} results'),
    rowActionsHeader: () => (isEs() ? 'Acciones' : 'Actions'),
    filterOperators: () =>
      isEs()
        ? [
            { value: 'contains', label: 'Contiene' },
            { value: 'notContains', label: 'No contiene' },
            { value: 'startsWith', label: 'Empieza por' },
            { value: 'endsWith', label: 'Termina en' },
            { value: 'equals', label: 'Igual a' },
            { value: 'notEquals', label: 'Distinto de' },
            { value: 'none', label: 'Sin filtro' },
          ]
        : [
            { value: 'contains', label: 'Contains' },
            { value: 'notContains', label: 'Does not contain' },
            { value: 'startsWith', label: 'Starts with' },
            { value: 'endsWith', label: 'Ends with' },
            { value: 'equals', label: 'Equals' },
            { value: 'notEquals', label: 'Does not equal' },
            { value: 'none', label: 'No filter' },
          ],
  };
}

/** Overlays: lee `storybookLocale` en cada llamada. */
export function createStorybookOverlaysI18n(): Partial<WiOverlaysI18n> {
  return {
    dialogCloseLabel: () => (isEs() ? 'Cerrar' : 'Close'),
  };
}

/** Inputs de demo del datepicker (placeholder / labels); no van en el provider. */
export interface DatepickerDemoCopy {
  placeholder: string;
  placeholderDateTime: string;
  clearLabel: string;
  clearLabelLong: string;
  calendarLabel: string;
  timeLabel: string;
  ariaLabel: string;
  ariaLabelDisabled: string;
  ariaLabelInvalid: string;
  ariaLabelDateTime: string;
  ariaLabelDark: string;
  requiredPlaceholder: string;
  startPlaceholder: string;
  endPlaceholder: string;
  startAriaLabel: string;
  endAriaLabel: string;
  valuePrefix: string;
}

const DATEPICKER_COPY: Record<StorybookLocale, DatepickerDemoCopy> = {
  es: {
    placeholder: 'Selecciona una fecha…',
    placeholderDateTime: 'Fecha y hora…',
    clearLabel: 'Limpiar',
    clearLabelLong: 'Limpiar fecha',
    calendarLabel: 'Abrir calendario',
    timeLabel: 'Hora',
    ariaLabel: 'Fecha',
    ariaLabelDisabled: 'Fecha deshabilitada',
    ariaLabelInvalid: 'Fecha inválida',
    ariaLabelDateTime: 'Fecha y hora',
    ariaLabelDark: 'Fecha dark',
    requiredPlaceholder: 'Requerido',
    startPlaceholder: 'Desde…',
    endPlaceholder: 'Hasta…',
    startAriaLabel: 'Fecha inicio',
    endAriaLabel: 'Fecha fin',
    valuePrefix: 'Valor',
  },
  en: {
    placeholder: 'Select a date…',
    placeholderDateTime: 'Date and time…',
    clearLabel: 'Clear',
    clearLabelLong: 'Clear date',
    calendarLabel: 'Open calendar',
    timeLabel: 'Time',
    ariaLabel: 'Date',
    ariaLabelDisabled: 'Disabled date',
    ariaLabelInvalid: 'Invalid date',
    ariaLabelDateTime: 'Date and time',
    ariaLabelDark: 'Date dark',
    requiredPlaceholder: 'Required',
    startPlaceholder: 'From…',
    endPlaceholder: 'To…',
    startAriaLabel: 'Start date',
    endAriaLabel: 'End date',
    valuePrefix: 'Value',
  },
};

export function getDatepickerDemoCopy(
  locale: StorybookLocale = storybookLocale(),
): DatepickerDemoCopy {
  return DATEPICKER_COPY[locale];
}
