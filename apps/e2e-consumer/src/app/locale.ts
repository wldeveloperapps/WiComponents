import { computed, signal } from '@angular/core';
import type { WiCalendarI18n, WiMonthLabels } from '@wiloc/ui/forms';

export type AppLocale = 'es' | 'en';

export const appLocale = signal<AppLocale>('es');

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

interface UiMessages {
  subtitle: string;
  themeToLight: string;
  themeToDark: string;
  languageToEs: string;
  languageToEn: string;
  buttons: string;
  primary: string;
  secondary: string;
  delete: string;
  input: string;
  name: string;
  namePlaceholder: string;
  value: string;
  select: string;
  fruitPlaceholder: string;
  fruitAria: string;
  clear: string;
  datepicker: string;
  dateAria: string;
  openCalendar: string;
  fruits: readonly [string, string, string];
}

const MESSAGES: Record<AppLocale, UiMessages> = {
  es: {
    subtitle: 'Smoke del paquete empaquetado',
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro',
    languageToEs: 'Cambiar a español',
    languageToEn: 'Cambiar a inglés',
    buttons: 'Button',
    primary: 'Primario',
    secondary: 'Secundario',
    delete: 'Eliminar',
    input: 'Input',
    name: 'Nombre',
    namePlaceholder: 'Escribe un nombre',
    value: 'Valor',
    select: 'Select',
    fruitPlaceholder: 'Selecciona una fruta',
    fruitAria: 'Fruta',
    clear: 'Limpiar',
    datepicker: 'Datepicker',
    dateAria: 'Fecha',
    openCalendar: 'Abrir calendario',
    fruits: ['Manzana', 'Naranja', 'Plátano'],
  },
  en: {
    subtitle: 'Packaged library smoke test',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    languageToEs: 'Switch to Spanish',
    languageToEn: 'Switch to English',
    buttons: 'Button',
    primary: 'Primary',
    secondary: 'Secondary',
    delete: 'Delete',
    input: 'Input',
    name: 'Name',
    namePlaceholder: 'Type a name',
    value: 'Value',
    select: 'Select',
    fruitPlaceholder: 'Select a fruit',
    fruitAria: 'Fruit',
    clear: 'Clear',
    datepicker: 'Datepicker',
    dateAria: 'Date',
    openCalendar: 'Open calendar',
    fruits: ['Apple', 'Orange', 'Banana'],
  },
};

export const uiMessages = computed(() => MESSAGES[appLocale()]);

export function setAppLocale(locale: AppLocale): void {
  appLocale.set(locale);
}

export function toggleAppLocale(): void {
  setAppLocale(appLocale() === 'es' ? 'en' : 'es');
}

/** Config de calendario que lee el locale en cada llamada (cambio en runtime). */
export function createCalendarI18n(): Partial<WiCalendarI18n> {
  return {
    firstDayOfWeek: () => 1,
    months: () => (appLocale() === 'es' ? ES_MONTHS : EN_MONTHS),
    formatMonth: (month) => (appLocale() === 'es' ? ES_MONTHS : EN_MONTHS)[month],
    formatYear: (year) => String(year),
    formatHeader: (month, year) => {
      const months = appLocale() === 'es' ? ES_MONTHS : EN_MONTHS;
      return `${months[month]} ${year}`;
    },
    formatWeekdayName: (index) => {
      const days = appLocale() === 'es' ? ES_WEEKDAYS_SHORT : EN_WEEKDAYS_SHORT;
      return days[index % 7] ?? '';
    },
    labelWeekday: (index) => {
      const days = appLocale() === 'es' ? ES_WEEKDAYS_LONG : EN_WEEKDAYS_LONG;
      return days[index % 7] ?? '';
    },
    labelPrevious: () => (appLocale() === 'es' ? 'Mes anterior' : 'Previous month'),
    labelNext: () => (appLocale() === 'es' ? 'Mes siguiente' : 'Next month'),
  };
}
