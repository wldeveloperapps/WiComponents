/**
 * Registry seed for @wldeveloperapps/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiDatepickerRegistryEntry = {
  name: 'datepicker',
  selector: 'wi-datepicker',
  entryPoint: '@wldeveloperapps/ui/forms',
  status: 'experimental' as const,
  exports: [
    'WiDatepickerComponent',
    'WiDateRangeComponent',
    'provideWiCalendarI18n',
    'provideWiTimeZone',
    'injectWiTimeZoneId',
    'WiDatepickerSize',
    'WiWeekday',
    'WiDateDisabled',
    'WiFormatDate',
    'WiDisplayDateFormat',
    'WiCalendarI18n',
    'WiMonthLabels',
    'WiLocalDateString',
    'WiTimeZoneId',
    'WiZonedDateTimeParts',
    'toLocalDateString',
    'fromLocalDateString',
    'isLocalDateString',
    'formatWiDate',
    'formatWiDateRange',
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
      description:
        'Valor del control: un Date naive, no un ISO. Compatible con Signal Forms ([formField]) y two-way binding. provideWiTimeZone no reinterpreta este Date',
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
      description: 'Formateador del texto del trigger; tiene prioridad sobre displayFormat',
    },
    {
      name: 'displayFormat',
      type: 'WiDisplayDateFormat | undefined',
      default: undefined,
      description:
        'Patrón de display (YYYY, YY, MM, DD, HH, mm). Solo UI; no cambia el Date ni el payload',
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
      description: 'Etiqueta visible del grupo de hora (si showTime)',
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
        'Rango en un único input (models start/end). Ver entrada de catálogo date-range / wi_view("date-range").',
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
    'Plantilla i18n: inputs placeholder/clearLabel/calendarLabel/timeLabel/ariaLabel + provideWiCalendarI18n (months, weekdays, labelPrevious/Next, hourPlaceholder/minutePlaceholder/hourAriaLabel/minuteAriaLabel)',
    'Icono calendar debe registrarse con provideWiIcons',
    'Overlays: la app debe incluir CSS de CDK Overlay / Spartan popover. El calendario anclado sigue al trigger en scroll anidado; no hace falta cdkScrollable',
    'El control captura componentes de fecha/hora; no adivina TZ. provideWiTimeZone + helpers toLocalDateString / datepickerValueToUtcIso. Ver docs/datepicker-international.md',
  ],
  limits: [
    'El valor es un Date naive, no un ISO. displayFormat solo pinta el texto del trigger.',
    'provideWiTimeZone no reinterpreta ese Date. La app serializa con datepickerValueToUtcIso.',
    'No es un rango: un solo Date. El rango (start y end) es wi-date-range. El label no es un input.',
  ],
  requires: [
    'provideWiIcons con el glifo calendar.',
    'provideWiCalendarI18n (meses, días, anterior/siguiente).',
    'Con hora, provideWiTimeZone y datepickerValueToUtcIso en la app. El control no aplica la TZ solo.',
  ],
  example: {
    import: `import {
  WiDatepickerComponent,
  WiDateRangeComponent,
  provideWiCalendarI18n,
  provideWiTimeZone,
  toLocalDateString,
  fromLocalDateString,
  datepickerValueToUtcIso,
  utcIsoToDatepickerValue,
  requireTimeZoneId,
  type WiMonthLabels,
} from '@wldeveloperapps/ui/forms';
import { provideWiIcons } from '@wldeveloperapps/ui/icon';
import { calendarOutline } from '@wldeveloperapps/ui/icon/heroicons';

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
  hourPlaceholder: () => 'HH',
  minutePlaceholder: () => 'MM',
  hourAriaLabel: () => 'Hora',
  minuteAriaLabel: () => 'Minuto',
});
provideWiTimeZone(site.timeZoneId);

// Civil → API
const payloadDate = date ? toLocalDateString(date) : null;
// API → picker
date = payloadDate ? fromLocalDateString(payloadDate) : null;

// Con hora + TZ del site (IIoT)
const tz = requireTimeZoneId(site.timeZoneId);
const iso = dateTime ? datepickerValueToUtcIso(dateTime, tz) : null;
dateTime = iso ? utcIsoToDatepickerValue(iso, tz) : null;`,
    template: `<!-- Labels / i18n: siempre desde la app (no hay diccionario en @wldeveloperapps/ui) -->
<label for="hire-date">Fecha de alta</label>
<wi-datepicker
  id="hire-date"
  [(value)]="date"
  clearable
  displayFormat="DD/MM/YYYY"
  placeholder="Selecciona una fecha…"
  clearLabel="Limpiar"
  calendarLabel="Abrir calendario"
  ariaLabel="Fecha de alta"
/>

<!-- Con hora (mapear con timeZoneId del site/usuario) -->
<wi-datepicker
  [(value)]="dateTime"
  showTime
  displayFormat="DD/MM/YYYY HH:mm"
  timeLabel="Hora"
  placeholder="Fecha y hora…"
  ariaLabel="Fecha y hora"
/>

<!-- Rango (un input) -->
<wi-date-range
  [(start)]="from"
  [(end)]="to"
  clearable
  displayFormat="DD/MM/YYYY"
  placeholder="Selecciona un rango…"
  ariaLabel="Rango de fechas"
  calendarLabel="Abrir calendario de rango"
  clearLabel="Limpiar"
/>`,
  },
};
