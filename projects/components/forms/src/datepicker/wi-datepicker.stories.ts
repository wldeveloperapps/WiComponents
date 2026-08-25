import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fn } from 'storybook/test';

import { getDatepickerDemoCopy, type StorybookLocale } from '../../../.storybook/locale';
import { provideWiIcons } from '../../../icon/src/public-api';
import { WI_HEROICONS_CURATED } from '../../../icon/heroicons/src/curated';
import { WiDatepickerComponent } from './wi-datepicker.component';
import { WiDateRangeComponent } from './wi-date-range.component';
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

function localeFromGlobals(globals: { locale?: string } | undefined): StorybookLocale {
  return globals?.locale === 'en' ? 'en' : 'es';
}

function datepickerCopy(globals: { locale?: string } | undefined) {
  return getDatepickerDemoCopy(localeFromGlobals(globals));
}

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
          'Selector de fecha (y hora opcional). Locale del calendario vía `provideWiCalendarI18n` (toolbar Locale de Storybook; ver Documentation/I18n). Rango con `wi-date-range` (dos pickers). Requiere CSS de overlays CDK/Spartan e icono `calendar` registrado. El valor es un `Date` en hora local; no uses `toISOString()` / `json` para mostrar el día civil. Events: `valueChange`, `touch` (datepicker); `startChange` / `endChange`, `startTouch` / `endTouch` (date-range).',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [provideWiIcons(WI_HEROICONS_CURATED)],
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

export const Range: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: null as Date | null,
        end: null as Date | null,
        formatLocalDate,
        startPlaceholder: t.startPlaceholder,
        endPlaceholder: t.endPlaceholder,
        startAriaLabel: t.startAriaLabel,
        endAriaLabel: t.endAriaLabel,
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
          [startPlaceholder]="startPlaceholder"
          [endPlaceholder]="endPlaceholder"
          [startAriaLabel]="startAriaLabel"
          [endAriaLabel]="endAriaLabel"
        />
        <p style="margin-top:0.75rem;font-size:0.875rem;opacity:0.7;">
          start: {{ formatLocalDate(start) }} — end: {{ formatLocalDate(end) }}
        </p>
      </div>
    `,
    };
  },
};

export const RangeWithTime: Story = {
  render: (args, { globals }) => {
    const t = datepickerCopy(globals);
    return {
      props: {
        ...args,
        start: null as Date | null,
        end: null as Date | null,
        startPlaceholder: t.startPlaceholder,
        endPlaceholder: t.endPlaceholder,
        startAriaLabel: t.startAriaLabel,
        endAriaLabel: t.endAriaLabel,
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
          [startPlaceholder]="startPlaceholder"
          [endPlaceholder]="endPlaceholder"
          [startAriaLabel]="startAriaLabel"
          [endAriaLabel]="endAriaLabel"
        />
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
          'Misma demo con **Locale → EN** en la toolbar (placeholder, labels y calendario). `@wiloc/ui` no trae diccionarios. Ver **Documentation / I18n**.',
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
