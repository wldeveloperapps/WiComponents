/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiDatepickerRegistryEntry = {
  name: 'datepicker',
  selector: 'wi-datepicker',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: [
    'WiDatepickerComponent',
    'WiDateRangeComponent',
    'provideWiCalendarI18n',
    'WiDatepickerSize',
    'WiWeekday',
    'WiDateDisabled',
    'WiFormatDate',
    'WiCalendarI18n',
    'WiMonthLabels',
    'WiLocalDateString',
    'WiTimeZoneId',
    'WiZonedDateTimeParts',
    'toLocalDateString',
    'fromLocalDateString',
    'isLocalDateString',
    'requireTimeZoneId',
    'datepickerValueToUtcIso',
    'datepickerValueToUtcDate',
    'utcIsoToDatepickerValue',
    'utcDateToDatepickerValue',
    'zonedPartsToUtcDate',
    'utcDateToZonedParts',
  ],
  inputs: [
    {
      name: 'value',
      type: 'Date | null (model)',
      default: 'null',
      description: 'Valor del control. Compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'showTime',
      type: 'boolean',
      default: false,
      description: 'Muestra selector de hora en el panel; el Date guarda fecha+hora',
    },
    {
      name: 'size',
      type: 'WiDatepickerSize',
      default: 'md',
      description: 'Tamaño: sm | md | lg',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Texto cuando no hay valor',
    },
    {
      name: 'min',
      type: 'Date | undefined',
      default: undefined,
      description: 'Fecha mínima seleccionable',
    },
    {
      name: 'max',
      type: 'Date | undefined',
      default: undefined,
      description: 'Fecha máxima seleccionable',
    },
    {
      name: 'dateDisabled',
      type: 'WiDateDisabled',
      default: '() => false',
      description: 'Predicado para deshabilitar días concretos',
    },
    {
      name: 'weekStartsOn',
      type: 'WiWeekday | undefined',
      default: undefined,
      description: 'Primer día de la semana (0=domingo); si se omite, usa i18n',
    },
    {
      name: 'formatDate',
      type: 'WiFormatDate | undefined',
      default: undefined,
      description: 'Formateador del texto del trigger; por defecto locale del runtime',
    },
    {
      name: 'autoCloseOnSelect',
      type: 'boolean | undefined',
      default: 'true si !showTime; false con showTime',
      description: 'Cierra el panel al elegir un día',
    },
    {
      name: 'clearable',
      type: 'boolean',
      default: false,
      description: 'Muestra botón para limpiar el valor',
    },
    {
      name: 'clearLabel',
      type: 'string',
      default: 'Clear',
      description: 'aria-label del botón clear (inyectable / i18n app)',
    },
    {
      name: 'calendarLabel',
      type: 'string',
      default: 'Open calendar',
      description: 'aria-label por defecto del trigger si no hay ariaLabel',
    },
    {
      name: 'timeLabel',
      type: 'string',
      default: 'Time',
      description: 'Etiqueta / aria-label del input de hora',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-datepicker-N)',
      description: 'id del trigger para asociar labels',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name del control / Signal Forms',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita el control',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: false,
      description: 'Solo lectura (no abre ni modifica)',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (aria-invalid + borde error)',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      description: 'Marca el campo como requerido',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible del trigger',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string | null',
      default: null,
      description: 'id de hint/error asociados',
    },
  ],
  outputs: [
    {
      name: 'touch',
      type: 'void',
      description: 'Emite al cerrar el panel (touched Signal Forms / CVA)',
    },
  ],
  variants: {
    size: ['sm', 'md', 'lg'],
  },
  related: [
    {
      name: 'date-range',
      selector: 'wi-date-range',
      description:
        'Layout de dos wi-datepicker (start/end) con min/max cruzados. Models start y end independientes; no es un calendar range de un solo panel.',
    },
  ],
  keyboard: [
    'Tab / Shift+Tab: foco en trigger y controles del panel',
    'Enter / Space: abre el calendario desde el trigger',
    'Escape: cierra el panel',
    'Flechas / Home / End / PageUp / PageDown: navegan días en la rejilla',
  ],
  a11yNotes: [
    'El trigger expone aria-haspopup=dialog y aria-expanded',
    'Días deshabilitados con aria-disabled',
    'Textos de navegación e i18n vía provideWiCalendarI18n (sin copy hardcodeado de producto)',
    'Plantilla i18n: inputs placeholder/clearLabel/calendarLabel/timeLabel/ariaLabel + provideWiCalendarI18n (months, weekdays, labelPrevious/Next)',
    'Icono calendar debe registrarse con provideWiIcons',
    'Overlays: la app debe incluir CSS de CDK Overlay / Spartan popover',
    'El control captura componentes de fecha/hora; no adivina TZ. Ver docs/datepicker-international.md y helpers toLocalDateString / datepickerValueToUtcIso',
  ],
  example: {
    import: `import {
  WiDatepickerComponent,
  WiDateRangeComponent,
  provideWiCalendarI18n,
  toLocalDateString,
  fromLocalDateString,
  datepickerValueToUtcIso,
  utcIsoToDatepickerValue,
  requireTimeZoneId,
  type WiMonthLabels,
} from '@wiloc/ui/forms';
import { provideWiIcons } from '@wiloc/ui/icon';
import { calendarOutline } from '@wiloc/ui/icon/heroicons';

const MONTHS: WiMonthLabels = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

provideWiIcons({ calendar: { outline: calendarOutline } });
provideWiCalendarI18n({
  firstDayOfWeek: () => 1,
  months: () => MONTHS,
  formatMonth: (m) => MONTHS[m],
  formatYear: (y) => String(y),
  formatHeader: (m, y) => \`\${MONTHS[m]} \${y}\`,
  formatWeekdayName: (i) => ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'][i % 7] ?? '',
  labelWeekday: (i) =>
    ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][i % 7] ?? '',
  labelPrevious: () => 'Mes anterior',
  labelNext: () => 'Mes siguiente',
});

// Civil → API
const payloadDate = date ? toLocalDateString(date) : null;
// API → picker
date = payloadDate ? fromLocalDateString(payloadDate) : null;

// Con hora + TZ del site (IIoT)
const tz = requireTimeZoneId(site.timeZoneId);
const iso = dateTime ? datepickerValueToUtcIso(dateTime, tz) : null;
dateTime = iso ? utcIsoToDatepickerValue(iso, tz) : null;`,
    template: `<!-- Labels / i18n: siempre desde la app (no hay diccionario en @wiloc/ui) -->
<label for="hire-date">Fecha de alta</label>
<wi-datepicker
  id="hire-date"
  [(value)]="date"
  clearable
  placeholder="Selecciona una fecha…"
  clearLabel="Limpiar"
  calendarLabel="Abrir calendario"
  ariaLabel="Fecha de alta"
/>

<!-- Con hora (mapear con timeZoneId del site/usuario) -->
<wi-datepicker
  [(value)]="dateTime"
  showTime
  timeLabel="Hora"
  placeholder="Fecha y hora…"
  ariaLabel="Fecha y hora"
/>

<!-- Rango -->
<wi-date-range
  [(start)]="from"
  [(end)]="to"
  clearable
  startPlaceholder="Desde…"
  endPlaceholder="Hasta…"
  startAriaLabel="Inicio"
  endAriaLabel="Fin"
  startCalendarLabel="Abrir fecha inicio"
  endCalendarLabel="Abrir fecha fin"
  clearLabel="Limpiar"
/>`,
  },
};
