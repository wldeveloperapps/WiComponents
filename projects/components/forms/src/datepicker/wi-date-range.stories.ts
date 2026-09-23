import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { getDatepickerDemoCopy, type StorybookLocale } from '../../../.storybook/locale';
import { provideWiIcons } from '../../../icon/src/public-api';
import { WI_HEROICONS_CURATED } from '../../../icon/heroicons/src/curated';
import { datepickerValueToUtcIso, toLocalDateString } from './wi-date';
import { WiDateRangeComponent } from './wi-date-range.component';
import { provideWiTimeZone } from './wi-datepicker.timezone';

/** Storybook `control: 'date'` puede devolver Date o timestamp. */
function toOptionalDate(value: unknown): Date | undefined {
  if (value == null || value === '') {
    return undefined;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  if (typeof value === 'number' || typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
}

function formatLocalDate(date: Date | null | undefined): string {
  return date ? toLocalDateString(date) : '—';
}

function formatLocalDateTime(date: Date | null | undefined): string {
  if (!date) {
    return '—';
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${toLocalDateString(date)} ${hours}:${minutes}`;
}

function localeFromGlobals(globals: { locale?: string } | undefined): StorybookLocale {
  return globals?.locale === 'en' ? 'en' : 'es';
}

function datepickerCopy(globals: { locale?: string } | undefined) {
  return getDatepickerDemoCopy(localeFromGlobals(globals));
}

type WiDateRangeStoryArgs = WiDateRangeComponent & {
  startChange: ReturnType<typeof fn>;
  endChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<WiDateRangeStoryArgs> = {
  title: 'Forms/WiDateRange',
  component: WiDateRangeComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'start',
        'end',
        'size',
        'showTime',
        'clearable',
        'disabled',
        'readonly',
        'invalid',
        'required',
        'displayFormat',
        'formatDate',
        'placeholder',
        'clearLabel',
        'calendarLabel',
        'startTimeLabel',
        'endTimeLabel',
        'ariaLabel',
        'ariaDescribedBy',
        'autoCloseOnSelect',
        'min',
        'max',
        'dateDisabled',
        'weekStartsOn',
        'id',
        'name',
      ],
    },
    docs: {
      description: {
        component:
          'Rango en **un único input** (trigger + calendario range). Primer clic = inicio, segundo = fin. `displayFormat` / `formatDate` controlan el texto del trigger (solo UI). TZ del site vía `provideWiTimeZone` (no mueve el Date naive). Con `showTime`, dos grupos HH:MM en el panel. Events: `startChange`, `endChange`, `touch`.',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [provideWiIcons(WI_HEROICONS_CURATED)],
    }),
    moduleMetadata({
      imports: [WiDateRangeComponent],
    }),
  ],
  argTypes: {
    start: {
      control: 'date',
      description: 'Inicio del rango (model)',
    },
    end: {
      control: 'date',
      description: 'Fin del rango (model)',
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    showTime: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    autoCloseOnSelect: { control: 'boolean' },
    weekStartsOn: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6],
    },
    displayFormat: { control: 'text' },
    formatDate: {
      control: false,
      description: 'Callback de formato del trigger (gana sobre `displayFormat`). No editable en Controls.',
    },
    dateDisabled: {
      control: false,
      description: 'Callback `(date) => boolean` para deshabilitar días. No editable en Controls.',
    },
    min: {
      control: 'date',
      description: 'Fecha mínima seleccionable',
    },
    max: {
      control: 'date',
      description: 'Fecha máxima seleccionable',
    },
    placeholder: { control: 'text' },
    clearLabel: { control: 'text' },
    calendarLabel: { control: 'text' },
    startTimeLabel: { control: 'text' },
    endTimeLabel: { control: 'text' },
    id: { control: 'text' },
    name: { control: 'text' },
    ariaLabel: { control: 'text' },
    ariaDescribedBy: { control: 'text' },
    startChange: {
      action: 'startChange',
      description: 'Cambia la fecha de inicio',
      table: { category: 'Events' },
      control: false,
    },
    endChange: {
      action: 'endChange',
      description: 'Cambia la fecha de fin',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Emite al cerrar el panel',
      table: { category: 'Events' },
      control: false,
    },
    // Internos: no editables en Docs (evitan Set object → error)
    calendar: { table: { disable: true }, control: false },
    calendarI18n: { table: { disable: true }, control: false },
    dateAdapter: { table: { disable: true }, control: false },
    generatedId: { table: { disable: true }, control: false },
    startHourInput: { table: { disable: true }, control: false },
    startMinuteInput: { table: { disable: true }, control: false },
    endHourInput: { table: { disable: true }, control: false },
    endMinuteInput: { table: { disable: true }, control: false },
    popover: { table: { disable: true }, control: false },
    siteTimeZoneId: { table: { disable: true }, control: false },
    timeEditing: { table: { disable: true }, control: false },
    timeI18n: { table: { disable: true }, control: false },
    calendarStart: { table: { disable: true }, control: false },
    calendarEnd: { table: { disable: true }, control: false },
    focusedDate: { table: { disable: true }, control: false },
    displayText: { table: { disable: true }, control: false },
    hasValue: { table: { disable: true }, control: false },
    headerLabel: { table: { disable: true }, control: false },
    isDisabled: { table: { disable: true }, control: false },
    popoverState: { table: { disable: true }, control: false },
    resolvedAriaLabel: { table: { disable: true }, control: false },
    resolvedId: { table: { disable: true }, control: false },
    shouldAutoClose: { table: { disable: true }, control: false },
    timeInputId: { table: { disable: true }, control: false },
    dayButtonClasses: { table: { disable: true }, control: false },
    navButtonClasses: { table: { disable: true }, control: false },
    panelClasses: { table: { disable: true }, control: false },
    timeInputClasses: { table: { disable: true }, control: false },
    triggerClasses: { table: { disable: true }, control: false },
  },
  args: {
    start: undefined,
    end: undefined,
    size: 'md',
    showTime: false,
    clearable: false,
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    autoCloseOnSelect: undefined,
    weekStartsOn: undefined,
    displayFormat: 'DD/MM/YYYY',
    placeholder: 'Selecciona un rango…',
    clearLabel: 'Limpiar',
    calendarLabel: 'Abrir calendario',
    startTimeLabel: 'Inicio',
    endTimeLabel: 'Fin',
    id: '',
    name: '',
    ariaLabel: 'Rango de fechas',
    ariaDescribedBy: '',
    min: undefined,
    max: undefined,
    startChange: fn(),
    endChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiDateRangeStoryArgs>;

export const Default: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: toOptionalDate(args.start) ?? null,
        end: toOptionalDate(args.end) ?? null,
        min: toOptionalDate(args.min),
        max: toOptionalDate(args.max),
        placeholder: t.rangePlaceholder,
        ariaLabel: t.rangeAriaLabel,
        calendarLabel: t.rangeCalendarLabel,
        clearLabel: t.clearLabel,
        formatLocalDate,
      },
      template: `
      <div style="width:22rem;min-width:0;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          [size]="size"
          [showTime]="showTime"
          [displayFormat]="displayFormat || undefined"
          [clearable]="clearable"
          [disabled]="disabled"
          [readonly]="readonly"
          [invalid]="invalid"
          [required]="required"
          [placeholder]="placeholder"
          [clearLabel]="clearLabel"
          [calendarLabel]="calendarLabel"
          [startTimeLabel]="startTimeLabel"
          [endTimeLabel]="endTimeLabel"
          [id]="id || undefined"
          [name]="name"
          [ariaLabel]="ariaLabel || null"
          [ariaDescribedBy]="ariaDescribedBy || null"
          [autoCloseOnSelect]="autoCloseOnSelect"
          [weekStartsOn]="weekStartsOn"
          [min]="min"
          [max]="max"
        />
        <p style="margin-top:0.75rem;font-size:0.875rem;opacity:0.7;">
          start: {{ formatLocalDate(start) }} — end: {{ formatLocalDate(end) }}
        </p>
      </div>
    `,
    };
  },
};

export const DisplayFormats: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mismo rango civil con distintos `displayFormat`. Solo afecta al texto del trigger; el payload sigue siendo `YYYY-MM-DD` vía helpers.',
      },
    },
  },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: new Date(2026, 8, 9),
        end: new Date(2026, 8, 16),
        ariaLabel: t.rangeAriaLabel,
        formatHint: t.formatHint,
      },
      template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:22rem;min-width:0;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          displayFormat="YYYY/MM/DD"
          [ariaLabel]="ariaLabel + ' YMD'"
        />
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          displayFormat="DD/MM/YYYY"
          [ariaLabel]="ariaLabel + ' DMY'"
        />
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          displayFormat="YYYY-MM-DD"
          [ariaLabel]="ariaLabel + ' ISO-like'"
        />
        <p style="font-size:0.75rem;opacity:0.7;">{{ formatHint }}</p>
      </div>
    `,
    };
  },
};

export const WithTime: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Con `showTime`, el panel muestra dos grupos HH:MM (inicio / fin). El panel no se cierra al completar el rango por defecto.',
      },
    },
  },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: new Date(2026, 8, 9, 9, 0),
        end: new Date(2026, 8, 16, 18, 30),
        placeholder: t.rangePlaceholder,
        ariaLabel: t.rangeAriaLabel,
        startTimeLabel: t.startTimeLabel,
        endTimeLabel: t.endTimeLabel,
        clearLabel: t.clearLabel,
        formatLocalDateTime,
      },
      template: `
      <div style="width:22rem;min-width:0;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          showTime
          clearable
          displayFormat="DD/MM/YYYY HH:mm"
          [placeholder]="placeholder"
          [startTimeLabel]="startTimeLabel"
          [endTimeLabel]="endTimeLabel"
          [clearLabel]="clearLabel"
          [ariaLabel]="ariaLabel"
        />
        <p style="margin-top:0.75rem;font-size:0.875rem;opacity:0.7;">
          {{ formatLocalDateTime(start) }} — {{ formatLocalDateTime(end) }}
        </p>
      </div>
    `,
    };
  },
};

export const Sizes: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: new Date(2026, 8, 9),
        end: new Date(2026, 8, 16),
        ariaLabel: t.rangeAriaLabel,
      },
      template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:22rem;min-width:0;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          size="sm"
          displayFormat="DD/MM/YYYY"
          [ariaLabel]="ariaLabel + ' sm'"
        />
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          size="md"
          displayFormat="DD/MM/YYYY"
          [ariaLabel]="ariaLabel + ' md'"
        />
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          size="lg"
          displayFormat="DD/MM/YYYY"
          [ariaLabel]="ariaLabel + ' lg'"
        />
      </div>
    `,
    };
  },
};

export const DisabledInvalidClearable: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: new Date(2026, 8, 9),
        end: new Date(2026, 8, 16),
        ariaLabel: t.rangeAriaLabel,
        clearLabel: t.clearLabel,
      },
      template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:22rem;min-width:0;">
        <wi-date-range
          [start]="start"
          [end]="end"
          disabled
          displayFormat="DD/MM/YYYY"
          [ariaLabel]="ariaLabel + ' disabled'"
        />
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          invalid
          required
          displayFormat="DD/MM/YYYY"
          [ariaLabel]="ariaLabel + ' invalid'"
        />
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          clearable
          displayFormat="DD/MM/YYYY"
          [clearLabel]="clearLabel"
          [ariaLabel]="ariaLabel + ' clearable'"
        />
      </div>
    `,
    };
  },
};

export const SiteTimeZone: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons(WI_HEROICONS_CURATED),
        provideWiTimeZone('America/Lima'),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Demo con `provideWiTimeZone(\'America/Lima\')`. El texto del input no se desplaza; al serializar con `datepickerValueToUtcIso` los componentes naive se interpretan en la TZ del site.',
      },
    },
  },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    const tz = 'America/Lima';
    return {
      props: {
        ...args,
        start: new Date(2026, 8, 9, 10, 0),
        end: new Date(2026, 8, 16, 18, 0),
        ariaLabel: t.rangeAriaLabel,
        startTimeLabel: t.startTimeLabel,
        endTimeLabel: t.endTimeLabel,
        tzHint: t.tzHint,
        tz,
        toUtc: (d: Date | null) => (d ? datepickerValueToUtcIso(d, tz) : '—'),
        formatLocalDateTime,
      },
      template: `
      <div style="width:24rem;min-width:0;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          showTime
          clearable
          displayFormat="DD/MM/YYYY HH:mm"
          [startTimeLabel]="startTimeLabel"
          [endTimeLabel]="endTimeLabel"
          [ariaLabel]="ariaLabel"
        />
        <p style="margin-top:0.75rem;font-size:0.8rem;opacity:0.75;">
          naive: {{ formatLocalDateTime(start) }} — {{ formatLocalDateTime(end) }}
        </p>
        <p style="font-size:0.8rem;opacity:0.75;">
          UTC ({{ tz }}): {{ toUtc(start) }} — {{ toUtc(end) }}
        </p>
        <p style="font-size:0.75rem;opacity:0.65;">{{ tzHint }}</p>
      </div>
    `,
    };
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: new Date(2026, 8, 9),
        end: new Date(2026, 8, 16),
        ariaLabel: t.rangeAriaLabel,
        clearLabel: t.clearLabel,
      },
      template: `
      <div class="wi-dark bg-background text-on-background" style="padding:1.5rem;width:22rem;min-width:0;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          clearable
          displayFormat="DD/MM/YYYY"
          [clearLabel]="clearLabel"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    };
  },
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Ancho ~320px: el trigger trunca con `min-w-0` sin overflow horizontal.',
      },
    },
    viewport: { defaultViewport: 'mobile1' },
  },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: new Date(2026, 8, 9),
        end: new Date(2026, 8, 16),
        ariaLabel: t.rangeAriaLabel,
      },
      template: `
      <div style="width:20rem;max-width:100%;min-width:0;">
        <wi-date-range
          [start]="start"
          (startChange)="start = $event; startChange($event)"
          [end]="end"
          (endChange)="end = $event; endChange($event)"
          (touch)="touch()"
          displayFormat="DD/MM/YYYY"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    };
  },
};
