import { computed, signal } from '@angular/core';
import type { WiDataDisplayI18n } from '@wiloc/ui/data-display';
import type { WiCalendarI18n, WiMonthLabels } from '@wiloc/ui/forms';
import type { WiOverlaysI18n } from '@wiloc/ui/overlays';

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
  otp: string;
  otpLabel: string;
  otpAria: string;
  value: string;
  checkbox: string;
  terms: string;
  yes: string;
  no: string;
  switch: string;
  notifications: string;
  select: string;
  fruitPlaceholder: string;
  fruitAria: string;
  clear: string;
  listbox: string;
  roleAria: string;
  emptyRoles: string;
  picklist: string;
  picklistAria: string;
  picklistAvailable: string;
  picklistAssigned: string;
  picklistEmptyAvailable: string;
  picklistEmptyAssigned: string;
  picklistMoveToTarget: string;
  picklistMoveAllToTarget: string;
  picklistMoveToSource: string;
  picklistMoveAllToSource: string;
  datepicker: string;
  dateAria: string;
  openCalendar: string;
  fileUpload: string;
  chooseFile: string;
  noFileChosen: string;
  upload: string;
  fileAria: string;
  fileRejectType: string;
  fileRejectSize: string;
  fileUploaded: string;
  dialog: string;
  openDialog: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogBody: string;
  closeDialog: string;
  popover: string;
  openPopover: string;
  popoverTitle: string;
  popoverDescription: string;
  popoverBody: string;
  closePopover: string;
  tabs: string;
  tabUnmanaged: string;
  tabManaged: string;
  tabArchived: string;
  tabUnmanagedBody: string;
  tabManagedBody: string;
  tabArchivedBody: string;
  stepper: string;
  stepperAria: string;
  stepperNext: string;
  stepperBack: string;
  stepperDetails: string;
  stepperApps: string;
  stepperSummary: string;
  stepperDetailsBody: string;
  stepperAppsBody: string;
  stepperSummaryBody: string;
  table: string;
  tableAria: string;
  tableEmpty: string;
  tableSummary: string;
  tableColName: string;
  tableColCity: string;
  tableColStatus: string;
  tableFilterName: string;
  tableFilterCity: string;
  tableFilterStatus: string;
  fruits: readonly [string, string, string];
  roles: readonly [string, string, string];
  members: readonly { id: string; name: string }[];
  tableStatusOptions: readonly { label: string; value: string }[];
  tableRows: readonly { id: string; name: string; city: string; status: string }[];
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
    otp: 'OTP',
    otpLabel: 'Código de verificación',
    otpAria: 'Código de verificación',
    value: 'Valor',
    checkbox: 'Checkbox',
    terms: 'Acepto los términos y condiciones',
    yes: 'sí',
    no: 'no',
    switch: 'Switch',
    notifications: 'Notificaciones',
    select: 'Select',
    fruitPlaceholder: 'Selecciona una fruta',
    fruitAria: 'Fruta',
    clear: 'Limpiar',
    listbox: 'Listbox',
    roleAria: 'Rol',
    emptyRoles: 'Sin roles',
    picklist: 'Picklist',
    picklistAria: 'Miembros del grupo',
    picklistAvailable: 'Disponibles',
    picklistAssigned: 'Asignados',
    picklistEmptyAvailable: 'Sin disponibles',
    picklistEmptyAssigned: 'Sin asignados',
    picklistMoveToTarget: 'Mover a asignados',
    picklistMoveAllToTarget: 'Mover todos a asignados',
    picklistMoveToSource: 'Quitar de asignados',
    picklistMoveAllToSource: 'Quitar todos de asignados',
    datepicker: 'Datepicker',
    dateAria: 'Fecha',
    openCalendar: 'Abrir calendario',
    fileUpload: 'File upload',
    chooseFile: 'Elegir archivo',
    noFileChosen: 'Ningún archivo seleccionado',
    upload: 'Subir',
    fileAria: 'Archivo de importación',
    fileRejectType: 'Tipo de archivo no permitido (solo .xlsx / .csv).',
    fileRejectSize: 'El archivo supera el tamaño máximo (1 MiB).',
    fileUploaded: 'Subida simulada',
    dialog: 'Dialog',
    openDialog: 'Abrir dialog',
    dialogTitle: 'Editar sitio',
    dialogDescription: 'Los cambios se aplican al guardar.',
    dialogBody: 'Contenido de ejemplo del dialog en el smoke del paquete.',
    closeDialog: 'Cerrar',
    popover: 'Popover',
    openPopover: 'Abrir popover',
    popoverTitle: 'Detalles del sitio',
    popoverDescription: 'Contenido anclado al trigger.',
    popoverBody: 'Contenido de ejemplo del popover en el smoke del paquete.',
    closePopover: 'Cerrar',
    tabs: 'Tabs',
    tabUnmanaged: 'Alertas No Gestionadas',
    tabManaged: 'Alertas Gestionadas',
    tabArchived: 'Alertas Archivadas',
    tabUnmanagedBody: 'Lista de alertas no gestionadas',
    tabManagedBody: 'Lista de alertas gestionadas',
    tabArchivedBody: 'Lista de alertas archivadas',
    stepper: 'Stepper',
    stepperAria: 'Pasos de alta',
    stepperNext: 'Siguiente',
    stepperBack: 'Atrás',
    stepperDetails: 'Datos',
    stepperApps: 'Aplicaciones',
    stepperSummary: 'Resumen',
    stepperDetailsBody: 'Contenido del paso Datos',
    stepperAppsBody: 'Contenido del paso Aplicaciones',
    stepperSummaryBody: 'Contenido del paso Resumen',
    table: 'Table',
    tableAria: 'Sitios de ejemplo',
    tableEmpty: 'Sin sitios',
    tableSummary: 'Inventario smoke',
    tableColName: 'Nombre',
    tableColCity: 'Ciudad',
    tableColStatus: 'Estado',
    tableFilterName: 'Buscar nombre',
    tableFilterCity: 'Buscar ciudad',
    tableFilterStatus: 'Todos los estados',
    fruits: ['Manzana', 'Naranja', 'Plátano'],
    roles: ['Admin', 'Editor', 'Viewer'],
    members: [
      { id: 'ana', name: 'Ana' },
      { id: 'bruno', name: 'Bruno' },
      { id: 'carla', name: 'Carla' },
    ],
    tableStatusOptions: [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' },
    ],
    tableRows: [
      { id: '1', name: 'Norte', city: 'Madrid', status: 'active' },
      { id: '2', name: 'Sur', city: 'Sevilla', status: 'active' },
      { id: '3', name: 'Este', city: 'Valencia', status: 'inactive' },
      { id: '4', name: 'Oeste', city: 'A Coruña', status: 'active' },
      { id: '5', name: 'Centro', city: 'Madrid', status: 'inactive' },
      { id: '6', name: 'Puerto', city: 'Barcelona', status: 'active' },
      { id: '7', name: 'Almacén', city: 'Zaragoza', status: 'inactive' },
      { id: '8', name: 'Taller', city: 'Bilbao', status: 'active' },
    ],
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
    otp: 'OTP',
    otpLabel: 'Verification code',
    otpAria: 'Verification code',
    value: 'Value',
    checkbox: 'Checkbox',
    terms: 'I accept the terms and conditions',
    yes: 'yes',
    no: 'no',
    switch: 'Switch',
    notifications: 'Notifications',
    select: 'Select',
    fruitPlaceholder: 'Select a fruit',
    fruitAria: 'Fruit',
    clear: 'Clear',
    listbox: 'Listbox',
    roleAria: 'Role',
    emptyRoles: 'No roles',
    picklist: 'Picklist',
    picklistAria: 'Group members',
    picklistAvailable: 'Available',
    picklistAssigned: 'Assigned',
    picklistEmptyAvailable: 'None available',
    picklistEmptyAssigned: 'None assigned',
    picklistMoveToTarget: 'Move to assigned',
    picklistMoveAllToTarget: 'Move all to assigned',
    picklistMoveToSource: 'Remove from assigned',
    picklistMoveAllToSource: 'Remove all from assigned',
    datepicker: 'Datepicker',
    dateAria: 'Date',
    openCalendar: 'Open calendar',
    fileUpload: 'File upload',
    chooseFile: 'Choose file',
    noFileChosen: 'No file chosen',
    upload: 'Upload',
    fileAria: 'Import file',
    fileRejectType: 'File type not allowed (.xlsx / .csv only).',
    fileRejectSize: 'File exceeds the maximum size (1 MiB).',
    fileUploaded: 'Upload simulated',
    dialog: 'Dialog',
    openDialog: 'Open dialog',
    dialogTitle: 'Edit site',
    dialogDescription: 'Changes apply when you save.',
    dialogBody: 'Sample dialog content in the packaged library smoke test.',
    closeDialog: 'Close',
    popover: 'Popover',
    openPopover: 'Open popover',
    popoverTitle: 'Site details',
    popoverDescription: 'Content anchored to the trigger.',
    popoverBody: 'Sample popover content in the packaged library smoke test.',
    closePopover: 'Close',
    tabs: 'Tabs',
    tabUnmanaged: 'Unmanaged Alerts',
    tabManaged: 'Managed Alerts',
    tabArchived: 'Archived Alerts',
    tabUnmanagedBody: 'List of unmanaged alerts',
    tabManagedBody: 'List of managed alerts',
    tabArchivedBody: 'List of archived alerts',
    stepper: 'Stepper',
    stepperAria: 'Sign-up steps',
    stepperNext: 'Next',
    stepperBack: 'Back',
    stepperDetails: 'Details',
    stepperApps: 'Applications',
    stepperSummary: 'Summary',
    stepperDetailsBody: 'Details step content',
    stepperAppsBody: 'Applications step content',
    stepperSummaryBody: 'Summary step content',
    table: 'Table',
    tableAria: 'Sample sites',
    tableEmpty: 'No sites',
    tableSummary: 'Smoke inventory',
    tableColName: 'Name',
    tableColCity: 'City',
    tableColStatus: 'Status',
    tableFilterName: 'Search name',
    tableFilterCity: 'Search city',
    tableFilterStatus: 'All statuses',
    fruits: ['Apple', 'Orange', 'Banana'],
    roles: ['Admin', 'Editor', 'Viewer'],
    members: [
      { id: 'ana', name: 'Ana' },
      { id: 'bruno', name: 'Bruno' },
      { id: 'carla', name: 'Carla' },
    ],
    tableStatusOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    tableRows: [
      { id: '1', name: 'North', city: 'Madrid', status: 'active' },
      { id: '2', name: 'South', city: 'Seville', status: 'active' },
      { id: '3', name: 'East', city: 'Valencia', status: 'inactive' },
      { id: '4', name: 'West', city: 'A Coruña', status: 'active' },
      { id: '5', name: 'Central', city: 'Madrid', status: 'inactive' },
      { id: '6', name: 'Port', city: 'Barcelona', status: 'active' },
      { id: '7', name: 'Warehouse', city: 'Zaragoza', status: 'inactive' },
      { id: '8', name: 'Workshop', city: 'Bilbao', status: 'active' },
    ],
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
    hourPlaceholder: () => 'HH',
    minutePlaceholder: () => 'MM',
    hourAriaLabel: () => (appLocale() === 'es' ? 'Hora' : 'Hour'),
    minuteAriaLabel: () => (appLocale() === 'es' ? 'Minuto' : 'Minute'),
  };
}

/** Chrome i18n de tabla / paginación / columnas (lee locale en cada llamada). */
export function createDataDisplayI18n(): Partial<WiDataDisplayI18n> {
  const es = () => appLocale() === 'es';
  return {
    emptyMessage: () => (es() ? 'Sin sitios' : 'No sites'),
    tableAriaLabel: () => (es() ? 'Sitios de ejemplo' : 'Sample sites'),
    paginationAriaLabel: () => (es() ? 'Paginación' : 'Pagination'),
    previousLabel: () => (es() ? 'Anterior' : 'Previous'),
    nextLabel: () => (es() ? 'Siguiente' : 'Next'),
    filterPlaceholder: () => (es() ? 'Escribir para buscar' : 'Type to search'),
    selectPlaceholder: () => (es() ? 'Seleccionar uno' : 'Select one'),
    filterOperatorAriaLabel: () => (es() ? 'Operador de filtro' : 'Filter operator'),
    filterAriaLabel: (header) => (es() ? `Filtrar ${header}` : `Filter ${header}`),
    columnVisibilitySummary: () =>
      es() ? '{visible} de {total} columnas visibles' : '{visible} of {total} columns visible',
    columnVisibilityMenuLabel: () => (es() ? 'Columnas' : 'Columns'),
    columnVisibilityAriaLabel: () => (es() ? 'Visibilidad de columnas' : 'Column visibility'),
    resultCountTemplate: () => (es() ? '{count} resultados' : '{count} results'),
    rowActionsHeader: () => (es() ? 'Acciones' : 'Actions'),
    filterOperators: () =>
      es()
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

/** Chrome i18n de overlays (lee locale en cada llamada). */
export function createOverlaysI18n(): Partial<WiOverlaysI18n> {
  return {
    dialogCloseLabel: () => (appLocale() === 'es' ? 'Cerrar' : 'Close'),
    confirmCancelLabel: () => (appLocale() === 'es' ? 'Cancelar' : 'Cancel'),
    toastCloseLabel: () => (appLocale() === 'es' ? 'Cerrar notificación' : 'Close toast'),
    toastRegionLabel: () => (appLocale() === 'es' ? 'Notificaciones' : 'Notifications'),
  };
}
