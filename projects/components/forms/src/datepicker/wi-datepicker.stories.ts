import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fn } from 'storybook/test';

import { getDatepickerDemoCopy, type StorybookLocale } from '../../../.storybook/locale';
import { provideWiIcons } from '../../../icon/src/public-api';
import { WI_HEROICONS_CURATED } from '../../../icon/heroicons/src/curated';
import { WiDatepickerComponent } from './wi-datepicker.component';
import { datepickerValueToUtcIso, toLocalDateString } from './wi-date';
import { provideWiTimeZone } from './wi-datepicker.timezone';

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

function localeFromGlobals(globals: { locale?: string } | undefined): StorybookLocale {
  return globals?.locale === 'en' ? 'en' : 'es';
}

function datepickerCopy(globals: { locale?: string } | undefined) {
  return getDatepickerDemoCopy(localeFromGlobals(globals));
}

type WiDatepickerStoryArgs = WiDatepickerComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<WiDatepickerStoryArgs> = {
  title: 'Forms/WiDatepicker',
  component: WiDatepickerComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'value',
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
        'timeLabel',
        'ariaLabel',
        'ariaDescribedBy',
        'autoCloseOnSelect',
        'min',
        'max',
        'weekStartsOn',
        'id',
        'name',
      ],
    },
    docs: {
      description: {
        component:
          'Selector de fecha (y hora opcional). Locale vía `provideWiCalendarI18n`. Formato del trigger: `displayFormat` (tokens) o `formatDate` (callback; gana). TZ del site: `provideWiTimeZone` (no muta el Date naive). Rango en un input: ver **Forms/WiDateRange**. Events: `valueChange`, `touch`.',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [provideWiIcons(WI_HEROICONS_CURATED)],
    }),
    moduleMetadata({
      imports: [WiDatepickerComponent, ReactiveFormsModule],
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
    displayFormat: { control: 'text' },
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
    // Internos: no editables en Docs (evitan Set object → error)
    calendar: { table: { disable: true }, control: false },
    calendarI18n: { table: { disable: true }, control: false },
    cvaDisabled: { table: { disable: true }, control: false },
    dateAdapter: { table: { disable: true }, control: false },
    generatedId: { table: { disable: true }, control: false },
    hourInput: { table: { disable: true }, control: false },
    minuteInput: { table: { disable: true }, control: false },
    onChange: { table: { disable: true }, control: false },
    onTouched: { table: { disable: true }, control: false },
    popover: { table: { disable: true }, control: false },
    siteTimeZoneId: { table: { disable: true }, control: false },
    timeEditing: { table: { disable: true }, control: false },
    timeI18n: { table: { disable: true }, control: false },
    calendarDate: { table: { disable: true }, control: false },
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
    triggerClasses: { table: { disable: true }, control: false },
    dayButtonClasses: { table: { disable: true }, control: false },
    navButtonClasses: { table: { disable: true }, control: false },
    panelClasses: { table: { disable: true }, control: false },
    timeInputClasses: { table: { disable: true }, control: false },
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
  },
};

export default meta;
type Story = StoryObj<WiDatepickerStoryArgs>;

export const Default: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        placeholder: t.placeholder,
        clearLabel: t.clearLabel,
        calendarLabel: t.calendarLabel,
        timeLabel: t.timeLabel,
        ariaLabel: t.ariaLabel,
        value: null as Date | null,
        formatLocalDate,
        valuePrefix: t.valuePrefix,
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
          {{ valuePrefix }}: {{ formatLocalDate(value) }}
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
        valueSm: null as Date | null,
        valueMd: null as Date | null,
        valueLg: null as Date | null,
        ariaLabel: t.ariaLabel,
      },
      template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:20rem;">
        <wi-datepicker
          [value]="valueSm"
          (valueChange)="valueSm = $event; valueChange($event)"
          (touch)="touch()"
          size="sm"
          placeholder="sm"
          [ariaLabel]="ariaLabel + ' sm'"
        />
        <wi-datepicker
          [value]="valueMd"
          (valueChange)="valueMd = $event; valueChange($event)"
          (touch)="touch()"
          size="md"
          placeholder="md"
          [ariaLabel]="ariaLabel + ' md'"
        />
        <wi-datepicker
          [value]="valueLg"
          (valueChange)="valueLg = $event; valueChange($event)"
          (touch)="touch()"
          size="lg"
          placeholder="lg"
          [ariaLabel]="ariaLabel + ' lg'"
        />
      </div>
    `,
    };
  },
};

export const Disabled: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        value: new Date(2026, 6, 15),
        ariaLabel: t.ariaLabelDisabled,
      },
      template: `
      <div style="width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          disabled
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    };
  },
};

export const Invalid: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        value: null as Date | null,
        placeholder: t.requiredPlaceholder,
        ariaLabel: t.ariaLabelInvalid,
      },
      template: `
      <div style="width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          invalid
          required
          [placeholder]="placeholder"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    };
  },
};

export const Clearable: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        value: new Date(2026, 0, 10),
        clearLabel: t.clearLabelLong,
        ariaLabel: t.ariaLabel,
      },
      template: `
      <div style="width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          clearable
          [clearLabel]="clearLabel"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    };
  },
};

export const WithTime: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        value: null as Date | null,
        formatLocalDateTime,
        placeholder: t.placeholderDateTime,
        timeLabel: t.timeLabel,
        ariaLabel: t.ariaLabelDateTime,
        valuePrefix: t.valuePrefix,
      },
      template: `
      <div style="width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          showTime
          clearable
          [placeholder]="placeholder"
          [timeLabel]="timeLabel"
          [ariaLabel]="ariaLabel"
        />
        <p style="margin-top:0.75rem;font-size:0.875rem;opacity:0.7;">
          {{ valuePrefix }}: {{ formatLocalDateTime(value) }}
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
          'Mismo día civil con distintos `displayFormat`. Solo UI; serialización API = `toLocalDateString` → `YYYY-MM-DD`.',
      },
    },
  },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        value: new Date(2026, 8, 9),
        ariaLabel: t.ariaLabel,
        formatHint: t.formatHint,
        formatLocalDate,
      },
      template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:20rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          displayFormat="YYYY/MM/DD"
          [ariaLabel]="ariaLabel"
        />
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          displayFormat="DD/MM/YYYY"
          [ariaLabel]="ariaLabel"
        />
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          displayFormat="YYYY-MM-DD"
          [ariaLabel]="ariaLabel"
        />
        <p style="font-size:0.75rem;opacity:0.7;">
          {{ formatHint }} civil: {{ formatLocalDate(value) }}
        </p>
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
          '`provideWiTimeZone(\'America/Lima\')`. El texto del input no cambia; `datepickerValueToUtcIso` interpreta la pared de reloj en la TZ del site.',
      },
    },
  },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    const tz = 'America/Lima';
    return {
      props: {
        ...args,
        value: new Date(2026, 8, 9, 10, 0),
        ariaLabel: t.ariaLabelDateTime,
        timeLabel: t.timeLabel,
        tzHint: t.tzHint,
        tz,
        toUtc: (d: Date | null) => (d ? datepickerValueToUtcIso(d, tz) : '—'),
        formatLocalDateTime,
      },
      template: `
      <div style="width:22rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          showTime
          clearable
          displayFormat="DD/MM/YYYY HH:mm"
          [timeLabel]="timeLabel"
          [ariaLabel]="ariaLabel"
        />
        <p style="margin-top:0.75rem;font-size:0.8rem;opacity:0.75;">
          naive: {{ formatLocalDateTime(value) }}
        </p>
        <p style="font-size:0.8rem;opacity:0.75;">
          UTC ({{ tz }}): {{ toUtc(value) }}
        </p>
        <p style="font-size:0.75rem;opacity:0.65;">{{ tzHint }}</p>
      </div>
    `,
    };
  },
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        value: new Date(2026, 6, 20, 14, 30),
        ariaLabel: t.ariaLabelDark,
        placeholder: t.placeholderDateTime,
        timeLabel: t.timeLabel,
        clearLabel: t.clearLabel,
        calendarLabel: t.calendarLabel,
      },
      template: `
      <div style="padding:1.5rem;width:22rem;">
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          showTime
          clearable
          [placeholder]="placeholder"
          [timeLabel]="timeLabel"
          [clearLabel]="clearLabel"
          [calendarLabel]="calendarLabel"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    };
  },
};

/**
 * Fuerza locale EN vía toolbar globals (misma demo que el selector Locale).
 * Checklist completa: Documentation → I18n.
 */
export const LocaleAppProvided: Story = {
  name: 'Locale (EN)',
  globals: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Misma demo con **Locale → EN** en la toolbar (placeholder, labels y calendario). `@wldeveloperapps/ui` no trae diccionarios. Ver **Documentation / I18n**.',
      },
    },
  },
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        value: null as Date | null,
        placeholder: t.placeholder,
        clearLabel: t.clearLabel,
        calendarLabel: t.calendarLabel,
        timeLabel: t.timeLabel,
        ariaLabel: t.ariaLabel,
      },
      template: `
      <div style="width:20rem;display:flex;flex-direction:column;gap:0.75rem;">
        <p style="margin:0;font-size:0.875rem;opacity:0.75;">
          Toolbar Locale = EN. Placeholder and calendar labels follow the locale.
        </p>
        <wi-datepicker
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          clearable
          showTime
          [placeholder]="placeholder"
          [clearLabel]="clearLabel"
          [calendarLabel]="calendarLabel"
          [timeLabel]="timeLabel"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    };
  },
};

export const ReactiveForms: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        control: new FormControl<Date | null>(null),
        startControl: new FormControl<Date | null>(null),
        endControl: new FormControl<Date | null>(null),
        formatLocalDate,
        placeholder: t.placeholder,
        startPlaceholder: t.startPlaceholder,
        endPlaceholder: t.endPlaceholder,
        ariaLabel: t.ariaLabel,
        startAriaLabel: t.startAriaLabel,
        endAriaLabel: t.endAriaLabel,
        valuePrefix: t.valuePrefix,
      },
      template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;width:36rem;">
        <wi-datepicker
          [formControl]="control"
          clearable
          [placeholder]="placeholder"
          [ariaLabel]="ariaLabel"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <p style="font-size:0.875rem;opacity:0.7;">{{ valuePrefix }}: {{ formatLocalDate(control.value) }}</p>

        <div style="display:flex;gap:0.75rem;">
          <wi-datepicker
            class="min-w-0 flex-1"
            [formControl]="startControl"
            [max]="endControl.value ?? undefined"
            clearable
            [placeholder]="startPlaceholder"
            [ariaLabel]="startAriaLabel"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
          <wi-datepicker
            class="min-w-0 flex-1"
            [formControl]="endControl"
            [min]="startControl.value ?? undefined"
            clearable
            [placeholder]="endPlaceholder"
            [ariaLabel]="endAriaLabel"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
        </div>
      </div>
    `,
    };
  },
};
