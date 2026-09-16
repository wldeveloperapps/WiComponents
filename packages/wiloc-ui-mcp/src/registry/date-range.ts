/**
 * Registry seed for @wldeveloperapps/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiDateRangeRegistryEntry = {
  name: 'date-range',
  selector: 'wi-date-range',
  entryPoint: '@wldeveloperapps/ui/forms',
  status: 'experimental' as const,
  exports: [
    'WiDateRangeComponent',
    'WiDatepickerSize',
    'WiWeekday',
    'WiDateDisabled',
    'WiFormatDate',
    'WiDisplayDateFormat',
    'formatWiDate',
    'formatWiDateRange',
    'provideWiCalendarI18n',
    'provideWiTimeZone',
    'injectWiTimeZoneId',
    'toLocalDateString',
    'fromLocalDateString',
    'datepickerValueToUtcIso',
    'utcIsoToDatepickerValue',
    'requireTimeZoneId',
  ],
  inputs: [
    {
      name: 'start',
      type: 'Date | null (model)',
      default: 'null',
      description: 'Fecha de inicio del rango (two-way / Signal Forms)',
    },
    {
      name: 'end',
      type: 'Date | null (model)',
      default: 'null',
      description: 'Fecha de fin del rango (two-way / Signal Forms)',
    },
    {
      name: 'showTime',
      type: 'boolean',
      default: false,
      description: 'Dos grupos HH:MM (inicio/fin) en el panel; el Date guarda fecha+hora',
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
      description: 'Texto del trigger cuando no hay start ni end',
    },
    {
      name: 'displayFormat',
      type: 'WiDisplayDateFormat | undefined',
      default: undefined,
      description:
        'Patrón de display (YYYY, YY, MM, DD, HH, mm). Solo UI; no cambia los Dates ni el payload',
    },
    {
      name: 'formatDate',
      type: 'WiFormatDate | undefined',
      default: undefined,
      description: 'Formateador por extremo; tiene prioridad sobre displayFormat',
    },
    {
      name: 'min',
      type: 'Date | undefined',
      default: undefined,
      description: 'Fecha mínima seleccionable en el calendario',
    },
    {
      name: 'max',
      type: 'Date | undefined',
      default: undefined,
      description: 'Fecha máxima seleccionable en el calendario',
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
      name: 'autoCloseOnSelect',
      type: 'boolean | undefined',
      default: 'true si !showTime; false con showTime',
      description: 'Cierra el panel al completar start y end',
    },
    {
      name: 'clearable',
      type: 'boolean',
      default: false,
      description: 'Botón para limpiar start y end',
    },
    {
      name: 'clearLabel',
      type: 'string',
      default: 'Clear',
      description: 'aria-label del botón clear (i18n app)',
    },
    {
      name: 'calendarLabel',
      type: 'string',
      default: 'Open calendar',
      description: 'aria-label por defecto del trigger si no hay ariaLabel',
    },
    {
      name: 'startTimeLabel',
      type: 'string',
      default: 'Start',
      description: 'Etiqueta del grupo de hora de inicio (si showTime)',
    },
    {
      name: 'endTimeLabel',
      type: 'string',
      default: 'End',
      description: 'Etiqueta del grupo de hora de fin (si showTime)',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-date-range-N)',
      description: 'id del trigger para asociar labels',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name del control',
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
      description: 'Emite al cerrar el panel (touched)',
    },
  ],
  variants: {
    size: ['sm', 'md', 'lg'],
  },
  related: [
    {
      name: 'datepicker',
      selector: 'wi-datepicker',
      description: 'Fecha (o fecha+hora) en un único valor. Ver wi_view("datepicker").',
    },
  ],
  keyboard: [
    'Tab / Shift+Tab: foco en trigger y controles del panel',
    'Enter / Space: abre el calendario desde el trigger',
    'Escape: cierra el panel',
    'Flechas / Home / End / PageUp / PageDown: navegan días en la rejilla',
    'Primer clic en día = start; segundo = end (si el segundo es anterior, se reordenan)',
  ],
  a11yNotes: [
    'Un único trigger con aria-haspopup=dialog y aria-expanded',
    'Días de rango: data-range-start / data-range-end / data-range-middle',
    'Textos de navegación e i18n vía provideWiCalendarI18n',
    'Copy de producto (placeholder, ariaLabel, startTimeLabel, endTimeLabel) lo provee la app',
    'Icono calendar vía provideWiIcons',
    'Overlays: CSS de CDK Overlay / Spartan popover en la app',
    'Models start/end independientes; validar start ≤ end en la app/back',
    'displayFormat solo UI; civil → toLocalDateString; con hora → datepickerValueToUtcIso + provideWiTimeZone / timeZoneId',
    'Ver docs/datepicker-international.md y componente relacionado datepicker',
  ],
  example: {
    import: `import {
  WiDateRangeComponent,
  provideWiCalendarI18n,
  provideWiTimeZone,
  toLocalDateString,
  datepickerValueToUtcIso,
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
const fromPayload = from ? toLocalDateString(from) : null;
const toPayload = to ? toLocalDateString(to) : null;

// Con hora + TZ del site
const tz = requireTimeZoneId(site.timeZoneId);
const fromIso = from ? datepickerValueToUtcIso(from, tz) : null;
const toIso = to ? datepickerValueToUtcIso(to, tz) : null;`,
    template: `<label for="period">Periodo</label>
<wi-date-range
  id="period"
  [(start)]="from"
  [(end)]="to"
  clearable
  displayFormat="DD/MM/YYYY"
  placeholder="Selecciona un rango…"
  clearLabel="Limpiar"
  calendarLabel="Abrir calendario de rango"
  ariaLabel="Periodo"
/>

<!-- Con hora -->
<wi-date-range
  [(start)]="from"
  [(end)]="to"
  showTime
  displayFormat="DD/MM/YYYY HH:mm"
  startTimeLabel="Inicio"
  endTimeLabel="Fin"
  placeholder="Fecha y hora…"
  ariaLabel="Rango con hora"
/>`,
  },
};
