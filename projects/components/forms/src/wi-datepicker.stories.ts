import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideWiIcons } from '../../icon/src/public-api';
import { WI_HEROICONS_CURATED } from '../../icon/heroicons/src/curated';
import { WiDatepickerComponent } from './wi-datepicker.component';
import { WiDateRangeComponent } from './wi-date-range.component';
import { provideWiCalendarI18n, type WiMonthLabels } from './wi-datepicker.i18n';
import { toLocalDateString } from './wi-date';

/** Preview civil (helpers públicos; evitar `toISOString` / `json`). */
function formatLocalDate(date: Date | null | undefined): string {
  return date ? toLocalDateString(date) : '—';
}

/** Preview fecha+hora en getters locales del Date del picker. */
function formatLocalDateTime(date: Date | null | undefined): string {
  if (!date) {
    return '—';
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${toLocalDateString(date)} ${hours}:${minutes}`;
}

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

const EN_WEEKDAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
const EN_WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const meta: Meta<WiDatepickerComponent> = {
  title: 'Forms/WiDatepicker',
  component: WiDatepickerComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      exclude: [
        'calendarDate',
        'focusedDate',
        'displayText',
        'hasValue',
        'headerLabel',
        'isDisabled',
        'popoverState',
        'resolvedAriaLabel',
        'resolvedId',
        'shouldAutoClose',
        'timeInputId',
        'timeValue',
        'triggerClasses',
        'dayButtonClasses',
        'navButtonClasses',
        'panelClasses',
        'timeInputClasses',
        'touch',
      ],
    },
    docs: {
      description: {
        component:
          'Selector de fecha (y hora opcional). Locale del calendario vía `provideWiCalendarI18n` (la app provee el copy; ver Documentation/I18n). Rango con `wi-date-range` (dos pickers). Requiere CSS de overlays CDK/Spartan e icono `calendar` registrado. El valor es un `Date` en hora local; no uses `toISOString()` / `json` para mostrar el día civil.',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons(WI_HEROICONS_CURATED),
        provideWiCalendarI18n({
          firstDayOfWeek: () => 1,
          labelPrevious: () => 'Mes anterior',
          labelNext: () => 'Mes siguiente',
        }),
      ],
    }),
    moduleMetadata({
      imports: [WiDatepickerComponent, WiDateRangeComponent, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showTime: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    placeholder: { control: 'text' },
    clearLabel: { control: 'text' },
    calendarLabel: { control: 'text' },
    timeLabel: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  args: {
    size: 'md',
    showTime: false,
    clearable: false,
    disabled: false,
    invalid: false,
    required: false,
    placeholder: 'Selecciona una fecha…',
    clearLabel: 'Limpiar',
    calendarLabel: 'Abrir calendario',
    timeLabel: 'Hora',
    ariaLabel: 'Fecha',
  },
};

export default meta;
type Story = StoryObj<WiDatepickerComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: null as Date | null,
      formatLocalDate,
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker
          [(value)]="value"
          [size]="size"
          [showTime]="showTime"
          [clearable]="clearable"
          [disabled]="disabled"
          [invalid]="invalid"
          [required]="required"
          [placeholder]="placeholder"
          [clearLabel]="clearLabel"
          [calendarLabel]="calendarLabel"
          [timeLabel]="timeLabel"
          [ariaLabel]="ariaLabel"
        />
        <p style="margin-top:0.75rem;font-size:0.875rem;opacity:0.7;">
          Valor: {{ formatLocalDate(value) }}
        </p>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {
      valueSm: null as Date | null,
      valueMd: null as Date | null,
      valueLg: null as Date | null,
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:20rem;">
        <wi-datepicker [(value)]="valueSm" size="sm" placeholder="sm" ariaLabel="Fecha sm" />
        <wi-datepicker [(value)]="valueMd" size="md" placeholder="md" ariaLabel="Fecha md" />
        <wi-datepicker [(value)]="valueLg" size="lg" placeholder="lg" ariaLabel="Fecha lg" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    props: {
      value: new Date(2026, 6, 15),
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker [(value)]="value" disabled ariaLabel="Fecha deshabilitada" />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: () => ({
    props: {
      value: null as Date | null,
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker
          [(value)]="value"
          invalid
          required
          placeholder="Requerido"
          ariaLabel="Fecha inválida"
        />
      </div>
    `,
  }),
};

export const Clearable: Story = {
  render: () => ({
    props: {
      value: new Date(2026, 0, 10),
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker
          [(value)]="value"
          clearable
          clearLabel="Limpiar fecha"
          ariaLabel="Fecha"
        />
      </div>
    `,
  }),
};

export const WithTime: Story = {
  render: () => ({
    props: {
      value: null as Date | null,
      formatLocalDateTime,
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker
          [(value)]="value"
          showTime
          clearable
          placeholder="Fecha y hora…"
          timeLabel="Hora"
          ariaLabel="Fecha y hora"
        />
        <p style="margin-top:0.75rem;font-size:0.875rem;opacity:0.7;">
          Valor: {{ formatLocalDateTime(value) }}
        </p>
      </div>
    `,
  }),
};

export const Range: Story = {
  render: () => ({
    props: {
      start: null as Date | null,
      end: null as Date | null,
      formatLocalDate,
    },
    template: `
      <div style="width:36rem;">
        <wi-date-range
          [(start)]="start"
          [(end)]="end"
          clearable
          startPlaceholder="Desde…"
          endPlaceholder="Hasta…"
          startAriaLabel="Fecha inicio"
          endAriaLabel="Fecha fin"
        />
        <p style="margin-top:0.75rem;font-size:0.875rem;opacity:0.7;">
          start: {{ formatLocalDate(start) }} — end: {{ formatLocalDate(end) }}
        </p>
      </div>
    `,
  }),
};

export const RangeWithTime: Story = {
  render: () => ({
    props: {
      start: null as Date | null,
      end: null as Date | null,
    },
    template: `
      <div style="width:36rem;">
        <wi-date-range
          [(start)]="start"
          [(end)]="end"
          showTime
          clearable
          startPlaceholder="Desde…"
          endPlaceholder="Hasta…"
          startAriaLabel="Inicio"
          endAriaLabel="Fin"
        />
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: () => ({
    props: {
      value: new Date(2026, 6, 20, 14, 30),
    },
    template: `
      <div style="padding:1.5rem;width:22rem;">
        <wi-datepicker
          [(value)]="value"
          showTime
          clearable
          ariaLabel="Fecha dark"
        />
      </div>
    `,
  }),
};

/**
 * Ejemplo de copy en inglés provisto por la app (no es un locale de la librería).
 * Checklist completa: Documentation → I18n.
 */
export const LocaleAppProvided: Story = {
  name: 'Locale (app-provided)',
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons(WI_HEROICONS_CURATED),
        provideWiCalendarI18n({
          firstDayOfWeek: () => 0,
          months: () => EN_MONTHS,
          formatMonth: (month) => EN_MONTHS[month],
          formatYear: (year) => String(year),
          formatHeader: (month, year) => `${EN_MONTHS[month]} ${year}`,
          formatWeekdayName: (index) => EN_WEEKDAYS_SHORT[index % 7] ?? '',
          labelWeekday: (index) => EN_WEEKDAYS_LONG[index % 7] ?? '',
          labelPrevious: () => 'Previous month',
          labelNext: () => 'Next month',
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'La app inyecta labels y `provideWiCalendarI18n` (aquí en inglés). `@wiloc/ui` no trae diccionarios. Ver **Documentation / I18n**.',
      },
    },
  },
  render: () => ({
    props: {
      value: null as Date | null,
    },
    template: `
      <div style="width:20rem;display:flex;flex-direction:column;gap:0.75rem;">
        <p style="margin:0;font-size:0.875rem;opacity:0.75;">
          App-provided English copy (demo). Open the calendar to see month/weekday labels.
        </p>
        <wi-datepicker
          [(value)]="value"
          clearable
          showTime
          placeholder="Select a date…"
          clearLabel="Clear"
          calendarLabel="Open calendar"
          timeLabel="Time"
          ariaLabel="Date"
        />
      </div>
    `,
  }),
};

export const ReactiveForms: Story = {
  render: () => ({
    props: {
      control: new FormControl<Date | null>(null),
      startControl: new FormControl<Date | null>(null),
      endControl: new FormControl<Date | null>(null),
      formatLocalDate,
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;width:36rem;">
        <wi-datepicker [formControl]="control" clearable placeholder="FormControl" ariaLabel="Fecha form" />
        <p style="font-size:0.875rem;opacity:0.7;">Valor: {{ formatLocalDate(control.value) }}</p>

        <div style="display:flex;gap:0.75rem;">
          <wi-datepicker
            class="min-w-0 flex-1"
            [formControl]="startControl"
            [max]="endControl.value ?? undefined"
            clearable
            placeholder="Inicio"
            ariaLabel="Inicio"
          />
          <wi-datepicker
            class="min-w-0 flex-1"
            [formControl]="endControl"
            [min]="startControl.value ?? undefined"
            clearable
            placeholder="Fin"
            ariaLabel="Fin"
          />
        </div>
      </div>
    `,
  }),
};
