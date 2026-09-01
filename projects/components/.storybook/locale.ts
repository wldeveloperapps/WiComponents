import { signal } from '@angular/core';

import type { WiDataDisplayI18n } from '../data-display/src/wi-data-display.i18n';
import type { WiCalendarI18n, WiMonthLabels } from '../forms/src/datepicker/wi-datepicker.i18n';
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
    expandColumnHeader: () => (isEs() ? 'Más' : 'More'),
    expandRowAriaLabel: () => (isEs() ? 'Mostrar columnas ocultas' : 'Show hidden columns'),
    collapseRowAriaLabel: () => (isEs() ? 'Ocultar columnas extra' : 'Hide extra columns'),
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
    confirmCancelLabel: () => (isEs() ? 'Cancelar' : 'Cancel'),
    toastCloseLabel: () => (isEs() ? 'Cerrar notificación' : 'Close toast'),
    toastRegionLabel: () => (isEs() ? 'Notificaciones' : 'Notifications'),
  };
}

/** Copy de demo del toast (stories); no va en el provider — es producto. */
export interface ToastDemoCopy {
  showButton: string;
  eventCreated: string;
  defaultMessage: string;
  success: string;
  info: string;
  warning: string;
  error: string;
  loading: string;
  loadingDone: string;
  loadingButton: string;
  withActionButton: string;
  changesSaved: string;
  changesDescription: string;
  undo: string;
  undone: string;
  close: string;
  positionPrefix: string;
  stackedButton: string;
  first: string;
  second: string;
  third: string;
  fourth: string;
  promiseButton: string;
  promiseLoading: string;
  promiseSuccess: string;
  promiseError: string;
  lightTitle: string;
  lightDescription: string;
  lightButton: string;
  darkTitle: string;
  darkDescription: string;
  darkButton: string;
  docsNotice: string;
}

const TOAST_COPY: Record<StorybookLocale, ToastDemoCopy> = {
  es: {
    showButton: 'Mostrar toast (arriba derecha)',
    eventCreated: 'Evento creado',
    defaultMessage: 'Mensaje neutro',
    success: 'Guardado correctamente',
    info: 'Hay una actualización disponible',
    warning: 'Revisa los datos antes de continuar',
    error: 'No se pudo completar la operación',
    loading: 'Procesando…',
    loadingDone: 'Listo',
    loadingButton: 'Loading → success',
    withActionButton: 'Toast con acción',
    changesSaved: 'Cambios guardados',
    changesDescription: 'Puedes deshacer esta acción durante unos segundos.',
    undo: 'Deshacer',
    undone: 'Acción deshecha',
    close: 'Cerrar',
    positionPrefix: 'Posición',
    stackedButton: 'Mostrar 4 toasts',
    first: 'Primero',
    second: 'Segundo',
    third: 'Tercero',
    fourth: 'Cuarto',
    promiseButton: 'Ejecutar promesa',
    promiseLoading: 'Guardando…',
    promiseSuccess: 'Guardado',
    promiseError: 'Error al guardar',
    lightTitle: 'Tema claro',
    lightDescription: 'Toolbar Light + theme auto → tokens claros',
    lightButton: 'Toast light',
    darkTitle: 'Tema oscuro',
    darkDescription: 'Toolbar Dark + theme auto → .wi-dark',
    darkButton: 'Toast dark',
    docsNotice:
      'En Docs no se demuestran toasts en vivo: el preview de documentación está contenido y no refleja el anclaje al viewport. Abre cualquier historia en la pestaña Canvas (Default, Variants, Light/Dark mode, …) para probar posición y tema.',
  },
  en: {
    showButton: 'Show toast (top right)',
    eventCreated: 'Event created',
    defaultMessage: 'Neutral message',
    success: 'Saved successfully',
    info: 'An update is available',
    warning: 'Review the data before continuing',
    error: 'The operation could not be completed',
    loading: 'Processing…',
    loadingDone: 'Done',
    loadingButton: 'Loading → success',
    withActionButton: 'Toast with action',
    changesSaved: 'Changes saved',
    changesDescription: 'You can undo this action for a few seconds.',
    undo: 'Undo',
    undone: 'Action undone',
    close: 'Close',
    positionPrefix: 'Position',
    stackedButton: 'Show 4 toasts',
    first: 'First',
    second: 'Second',
    third: 'Third',
    fourth: 'Fourth',
    promiseButton: 'Run promise',
    promiseLoading: 'Saving…',
    promiseSuccess: 'Saved',
    promiseError: 'Failed to save',
    lightTitle: 'Light theme',
    lightDescription: 'Toolbar Light + theme auto → light tokens',
    lightButton: 'Toast light',
    darkTitle: 'Dark theme',
    darkDescription: 'Toolbar Dark + theme auto → .wi-dark',
    darkButton: 'Toast dark',
    docsNotice:
      'Docs does not run live toasts: the documentation preview is contained and does not reflect viewport anchoring. Open any story in the Canvas tab (Default, Variants, Light/Dark mode, …) to try position and theme.',
  },
};

export function getToastDemoCopy(locale: StorybookLocale = storybookLocale()): ToastDemoCopy {
  return TOAST_COPY[locale];
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

/** Copy de demo del speed dial (stories); no va en provider — es producto. */
export interface SpeedDialDemoCopy {
  ariaLabel: string;
  ariaLabelA: string;
  ariaLabelB: string;
  ariaLabelLeft: string;
  ariaLabelRight: string;
  ariaLabelUp: string;
  ariaLabelDown: string;
  hintClick: string;
  hintCards: string;
  lastActionPrefix: string;
  cardATitle: string;
  cardABody: string;
  cardBTitle: string;
  cardBBody: string;
  updatedLabel: string;
  actionsA: readonly { id: string; icon: string; label: string }[];
  actionsB: readonly { id: string; icon: string; label: string }[];
}

const SPEED_DIAL_COPY: Record<StorybookLocale, SpeedDialDemoCopy> = {
  es: {
    ariaLabel: 'Acciones',
    ariaLabelA: 'Acciones A',
    ariaLabelB: 'Acciones B',
    ariaLabelLeft: 'Acciones izquierda',
    ariaLabelRight: 'Acciones derecha',
    ariaLabelUp: 'Acciones arriba',
    ariaLabelDown: 'Acciones abajo',
    hintClick: 'Haz clic en los tres puntos para ver las acciones',
    hintCards: 'Clic en los tres puntos para abrir. Cada card pasa su propio items.',
    lastActionPrefix: 'Última acción',
    cardATitle: 'Card A (empieza abierta)',
    cardABody: '4 acciones definidas por la app.',
    cardBTitle: 'Card B (empieza cerrada)',
    cardBBody: 'Otro set de acciones (3).',
    updatedLabel: 'Actualizado',
    actionsA: [
      { id: 'history', icon: 'arrow-path', label: 'Historial' },
      { id: 'schedule', icon: 'calendar', label: 'Calendario' },
      { id: 'delete', icon: 'trash', label: 'Eliminar' },
      { id: 'dismiss', icon: 'x-mark', label: 'Cerrar' },
    ],
    actionsB: [
      { id: 'history', icon: 'arrow-path', label: 'Historial' },
      { id: 'compare', icon: 'squares-2x2', label: 'Comparar' },
      { id: 'dismiss', icon: 'x-mark', label: 'Cerrar' },
    ],
  },
  en: {
    ariaLabel: 'Actions',
    ariaLabelA: 'Actions A',
    ariaLabelB: 'Actions B',
    ariaLabelLeft: 'Left actions',
    ariaLabelRight: 'Right actions',
    ariaLabelUp: 'Up actions',
    ariaLabelDown: 'Down actions',
    hintClick: 'Click the three dots to see the actions',
    hintCards: 'Click the three dots to open. Each card passes its own items.',
    lastActionPrefix: 'Last action',
    cardATitle: 'Card A (starts open)',
    cardABody: '4 actions defined by the app.',
    cardBTitle: 'Card B (starts closed)',
    cardBBody: 'Another set of actions (3).',
    updatedLabel: 'Updated',
    actionsA: [
      { id: 'history', icon: 'arrow-path', label: 'History' },
      { id: 'schedule', icon: 'calendar', label: 'Calendar' },
      { id: 'delete', icon: 'trash', label: 'Delete' },
      { id: 'dismiss', icon: 'x-mark', label: 'Close' },
    ],
    actionsB: [
      { id: 'history', icon: 'arrow-path', label: 'History' },
      { id: 'compare', icon: 'squares-2x2', label: 'Compare' },
      { id: 'dismiss', icon: 'x-mark', label: 'Close' },
    ],
  },
};

export function getSpeedDialDemoCopy(
  locale: StorybookLocale = storybookLocale(),
): SpeedDialDemoCopy {
  return SPEED_DIAL_COPY[locale];
}

/** Copy de demo del stepper (stories); no va en la librería — lo aporta la app. */
export interface StepperDemoCopy {
  ariaLabel: string;
  next: string;
  back: string;
  hint: string;
  linearHint: string;
  longLabel: string;
  steps: readonly { id: string; icon: string; label: string; body: string }[];
}

const STEPPER_COPY: Record<StorybookLocale, StepperDemoCopy> = {
  es: {
    ariaLabel: 'Pasos',
    next: 'Siguiente',
    back: 'Atrás',
    hint: 'Label e icono los pasa la app en `steps`. Back / Next viven en el panel.',
    linearHint: 'Lineal: la nav no salta a pasos futuros. Siguiente sí avanza.',
    longLabel: 'Configuración avanzada de notificaciones y preferencias del espacio de trabajo',
    steps: [
      {
        id: 'details',
        icon: 'user',
        label: 'Datos',
        body: 'Contenido del paso Datos (lo aporta la app).',
      },
      {
        id: 'apps',
        icon: 'squares-2x2',
        label: 'Aplicaciones',
        body: 'Contenido del paso Aplicaciones (lo aporta la app).',
      },
      {
        id: 'perms',
        icon: 'key',
        label: 'Permisos',
        body: 'Contenido del paso Permisos (lo aporta la app).',
      },
      {
        id: 'summary',
        icon: 'list-bullet',
        label: 'Resumen',
        body: 'Contenido del paso Resumen (lo aporta la app).',
      },
    ],
  },
  en: {
    ariaLabel: 'Steps',
    next: 'Next',
    back: 'Back',
    hint: 'Label and icon come from the app via `steps`. Back / Next live in the panel.',
    linearHint: 'Linear: the nav cannot skip ahead. Next still advances.',
    longLabel: 'Advanced notification settings and workspace preferences',
    steps: [
      {
        id: 'details',
        icon: 'user',
        label: 'Details',
        body: 'Details step content (provided by the app).',
      },
      {
        id: 'apps',
        icon: 'squares-2x2',
        label: 'Applications',
        body: 'Applications step content (provided by the app).',
      },
      {
        id: 'perms',
        icon: 'key',
        label: 'Permissions',
        body: 'Permissions step content (provided by the app).',
      },
      {
        id: 'summary',
        icon: 'list-bullet',
        label: 'Summary',
        body: 'Summary step content (provided by the app).',
      },
    ],
  },
};

export function getStepperDemoCopy(locale: StorybookLocale = storybookLocale()): StepperDemoCopy {
  return STEPPER_COPY[locale];
}

/** Copy de demo del breadcrumb (stories); no va en la librería — lo aporta la app. */
export interface BreadcrumbDemoCopy {
  ariaLabel: string;
  home: string;
  section: string;
  current: string;
  longCurrent: string;
  extra: string;
}

const BREADCRUMB_COPY: Record<StorybookLocale, BreadcrumbDemoCopy> = {
  es: {
    ariaLabel: 'Migas de pan',
    home: 'Inicio',
    section: 'Administración',
    current: 'Gestión de usuarios',
    longCurrent: 'Configuración avanzada de notificaciones y preferencias del espacio de trabajo',
    extra: 'Detalle',
  },
  en: {
    ariaLabel: 'Breadcrumb',
    home: 'Home',
    section: 'Administration',
    current: 'User management',
    longCurrent: 'Advanced notification settings and workspace preferences',
    extra: 'Detail',
  },
};

export function getBreadcrumbDemoCopy(
  locale: StorybookLocale = storybookLocale(),
): BreadcrumbDemoCopy {
  return BREADCRUMB_COPY[locale];
}
