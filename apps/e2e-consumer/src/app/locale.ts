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
  card: string;
  cardDescription: string;
  buttons: string;
  primary: string;
  secondary: string;
  delete: string;
  input: string;
  name: string;
  namePlaceholder: string;
  value: string;
  checkbox: string;
  terms: string;
  yes: string;
  no: string;
  select: string;
  fruitPlaceholder: string;
  fruitAria: string;
  clear: string;
  datepicker: string;
  dateAria: string;
  openCalendar: string;
  dialog: string;
  openDialog: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogBody: string;
  closeDialog: string;
  fruits: readonly [string, string, string];
}

const MESSAGES: Record<AppLocale, UiMessages> = {
  es: {
    subtitle: 'Smoke del paquete empaquetado',
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro',
    languageToEs: 'Cambiar a español',
    languageToEn: 'Cambiar a inglés',
    card: 'Card',
    cardDescription: 'Contenedor de superficie para los controles de smoke.',
    buttons: 'Button',
    primary: 'Primario',
    secondary: 'Secundario',
    delete: 'Eliminar',
    input: 'Input',
    name: 'Nombre',
    namePlaceholder: 'Escribe un nombre',
    value: 'Valor',
    checkbox: 'Checkbox',
    terms: 'Acepto los términos y condiciones',
    yes: 'sí',
    no: 'no',
    select: 'Select',
    fruitPlaceholder: 'Selecciona una fruta',
    fruitAria: 'Fruta',
    clear: 'Limpiar',
    datepicker: 'Datepicker',
    dateAria: 'Fecha',
    openCalendar: 'Abrir calendario',
    dialog: 'Dialog',
    openDialog: 'Abrir dialog',
    dialogTitle: 'Editar sitio',
    dialogDescription: 'Los cambios se aplican al guardar.',
    dialogBody: 'Contenido de ejemplo del dialog en el smoke del paquete.',
    closeDialog: 'Cerrar',
    fruits: ['Manzana', 'Naranja', 'Plátano'],
  },
  en: {
    subtitle: 'Packaged library smoke test',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    languageToEs: 'Switch to Spanish',
    languageToEn: 'Switch to English',
    card: 'Card',
    cardDescription: 'Surface container for the smoke-test controls.',
    buttons: 'Button',
    primary: 'Primary',
    secondary: 'Secondary',
    delete: 'Delete',
    input: 'Input',
    name: 'Name',
    namePlaceholder: 'Type a name',
    value: 'Value',
    checkbox: 'Checkbox',
    terms: 'I accept the terms and conditions',
    yes: 'yes',
    no: 'no',
    select: 'Select',
    fruitPlaceholder: 'Select a fruit',
    fruitAria: 'Fruit',
    clear: 'Clear',
    datepicker: 'Datepicker',
    dateAria: 'Date',
    openCalendar: 'Open calendar',
    dialog: 'Dialog',
    openDialog: 'Open dialog',
    dialogTitle: 'Edit site',
    dialogDescription: 'Changes apply when you save.',
    dialogBody: 'Sample dialog content in the packaged library smoke test.',
    closeDialog: 'Close',
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
