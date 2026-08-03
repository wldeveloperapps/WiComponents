import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fn } from 'storybook/test';

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

type WiDatepickerStoryArgs = WiDatepickerComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
  /** WiDateRange: cambio del model `start`. */
  startChange: ReturnType<typeof fn>;
  /** WiDateRange: cambio del model `end`. */
  endChange: ReturnType<typeof fn>;
  /** WiDateRange: touch del picker de inicio. */
  startTouch: ReturnType<typeof fn>;
  /** WiDateRange: touch del picker de fin. */
  endTouch: ReturnType<typeof fn>;
};

const meta: Meta<WiDatepickerStoryArgs> = {
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
      ],
    },
    docs: {
      description: {
        component:
          'Selector de fecha (y hora opcional). Locale del calendario vía `provideWiCalendarI18n` (la app provee el copy; ver Documentation/I18n). Rango con `wi-date-range` (dos pickers). Requiere CSS de overlays CDK/Spartan e icono `calendar` registrado. El valor es un `Date` en hora local; no uses `toISOString()` / `json` para mostrar el día civil. Events: `valueChange`, `touch` (datepicker); `startChange` / `endChange`, `startTouch` / `endTouch` (date-range).',
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
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al cambiar el valor (wi-datepicker)',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite al cerrar el panel / touched (wi-datepicker)',
      table: { category: 'Events' },
      control: false,
    },
    startChange: {
      action: 'startChange',
      description: 'Se emite al cambiar la fecha de inicio (wi-date-range)',
      table: { category: 'Events' },
      control: false,
    },
    endChange: {
      action: 'endChange',
      description: 'Se emite al cambiar la fecha de fin (wi-date-range)',
      table: { category: 'Events' },
      control: false,
    },
    startTouch: {
      action: 'startTouch',
      description: 'Se emite al tocar el picker de inicio (wi-date-range)',
      table: { category: 'Events' },
      control: false,
    },
    endTouch: {
      action: 'endTouch',
      description: 'Se emite al tocar el picker de fin (wi-date-range)',
      table: { category: 'Events' },
      control: false,
    },
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
    valueChange: fn(),
    touch: fn(),
    startChange: fn(),
    endChange: fn(),
    startTouch: fn(),
    endTouch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiDatepickerStoryArgs>;

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
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
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
  render: (args) => ({
    props: {
      ...args,
      valueSm: null as Date | null,
      valueMd: null as Date | null,
      valueLg: null as Date | null,
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:20rem;">
        <wi-datepicker
          [value]="valueSm"
          (valueChange)="valueSm = $event; valueChange($event)"
          (touch)="touch()"
          size="sm"
          placeholder="sm"
          ariaLabel="Fecha sm"
        />
        <wi-datepicker
          [value]="valueMd"
          (valueChange)="valueMd = $event; valueChange($event)"
          (touch)="touch()"
          size="md"
          placeholder="md"
          ariaLabel="Fecha md"
        />
        <wi-datepicker
          [value]="valueLg"
          (valueChange)="valueLg = $event; valueChange($event)"
          (touch)="touch()"
          size="lg"
          placeholder="lg"
          ariaLabel="Fecha lg"
        />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: new Date(2026, 6, 15),
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          disabled
          ariaLabel="Fecha deshabilitada"
        />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: null as Date | null,
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
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
  render: (args) => ({
    props: {
      ...args,
      value: new Date(2026, 0, 10),
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          clearable
          clearLabel="Limpiar fecha"
          ariaLabel="Fecha"
        />
      </div>
    `,
  }),
};

export const WithTime: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: null as Date | null,
      formatLocalDateTime,
    },
    template: `
      <div style="width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
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
  render: (args) => ({
    props: {
      ...args,
      start: null as Date | null,
      end: null as Date | null,
      formatLocalDate,
    },
    template: `
      <div style="width:36rem;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (startTouch)="startTouch()"
          (endTouch)="endTouch()"
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
  render: (args) => ({
    props: {
      ...args,
      start: null as Date | null,
      end: null as Date | null,
    },
    template: `
      <div style="width:36rem;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (startTouch)="startTouch()"
          (endTouch)="endTouch()"
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
  render: (args) => ({
    props: {
      ...args,
      value: new Date(2026, 6, 20, 14, 30),
    },
    template: `
      <div style="padding:1.5rem;width:22rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
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
  render: (args) => ({
    props: {
      ...args,
      value: null as Date | null,
    },
    template: `
      <div style="width:20rem;display:flex;flex-direction:column;gap:0.75rem;">
        <p style="margin:0;font-size:0.875rem;opacity:0.75;">
          App-provided English copy (demo). Open the calendar to see month/weekday labels.
        </p>
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
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
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl<Date | null>(null),
      startControl: new FormControl<Date | null>(null),
      endControl: new FormControl<Date | null>(null),
      formatLocalDate,
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;width:36rem;">
        <wi-datepicker
          [formControl]="control"
          clearable
          placeholder="FormControl"
          ariaLabel="Fecha form"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <p style="font-size:0.875rem;opacity:0.7;">Valor: {{ formatLocalDate(control.value) }}</p>

        <div style="display:flex;gap:0.75rem;">
          <wi-datepicker
            class="min-w-0 flex-1"
            [formControl]="startControl"
            [max]="endControl.value ?? undefined"
            clearable
            placeholder="Inicio"
            ariaLabel="Inicio"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
          <wi-datepicker
            class="min-w-0 flex-1"
            [formControl]="endControl"
            [min]="startControl.value ?? undefined"
            clearable
            placeholder="Fin"
            ariaLabel="Fin"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
        </div>
      </div>
    `,
  }),
};
