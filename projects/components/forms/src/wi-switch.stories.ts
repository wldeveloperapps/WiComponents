import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fn } from 'storybook/test';

import { WiSwitchComponent } from './public-api';

type WiSwitchStoryArgs = WiSwitchComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<WiSwitchStoryArgs> = {
  title: 'Forms/WiSwitch',
  component: WiSwitchComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interruptor booleano (toggle switch). `ariaLabel` / textos de label vía la app (ver Documentation/I18n). Compatible con Reactive Forms y Signal Forms. En viewport estrecho se apila con el label en una fila flex con wrap. Events: `valueChange`, `touch`.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiSwitchComponent, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al cambiar el valor',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite en blur / toggle (Signal Forms / touched)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    size: 'md',
    disabled: false,
    invalid: false,
    required: false,
    ariaLabel: 'Modo avión',
    valueChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiSwitchStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: false,
    },
    template: `
      <label class="flex min-w-0 max-w-xs items-center justify-between gap-3 text-sm text-on-surface">
        <span class="min-w-0">Modo avión</span>
        <wi-switch
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [size]="size"
          [disabled]="disabled"
          [invalid]="invalid"
          [required]="required"
          [ariaLabel]="ariaLabel"
        />
      </label>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-3">
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Small</span>
          <wi-switch size="sm" ariaLabel="Small" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Medium</span>
          <wi-switch size="md" ariaLabel="Medium" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Large</span>
          <wi-switch size="lg" ariaLabel="Large" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
      </div>
    `,
  }),
};

export const Checked: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: true,
    },
    template: `
      <label class="flex min-w-0 max-w-xs items-center justify-between gap-3 text-sm text-on-surface">
        <span>Notificaciones</span>
        <wi-switch
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          ariaLabel="Notificaciones"
        />
      </label>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-3">
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Deshabilitado (off)</span>
          <wi-switch disabled ariaLabel="Deshabilitado off" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Deshabilitado (on)</span>
          <wi-switch disabled [value]="true" ariaLabel="Deshabilitado on" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-2">
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Aceptar marketing</span>
          <wi-switch
            invalid
            required
            ariaLabel="Aceptar marketing"
            ariaDescribedBy="switch-error"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
        </label>
        <p id="switch-error" class="m-0 text-sm text-error" role="alert">
          Debes activar esta opción para continuar.
        </p>
      </div>
    `,
  }),
};

export const SettingsGroup: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fieldset class="m-0 flex min-w-0 max-w-xs flex-col gap-3 border-0 p-0">
        <legend class="mb-1 text-sm font-medium text-on-surface">Preferencias</legend>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span class="min-w-0">Email</span>
          <wi-switch ariaLabel="Email" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span class="min-w-0">SMS</span>
          <wi-switch [value]="true" ariaLabel="SMS" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span class="min-w-0">Push</span>
          <wi-switch ariaLabel="Push" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
      </fieldset>
    `,
  }),
};

export const WithReactiveForms: Story = {
  render: (args) => {
    const form = new FormGroup({
      alerts: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    });

    return {
      props: {
        ...args,
        form,
        submit: () => {
          form.controls.alerts.markAsTouched();
        },
      },
      template: `
        <form
          class="flex min-w-0 max-w-xs flex-col gap-3"
          [formGroup]="form"
          (ngSubmit)="submit()"
        >
          <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
            <span class="min-w-0">Alertas críticas</span>
            <wi-switch
              formControlName="alerts"
              required
              [invalid]="form.controls.alerts.invalid && form.controls.alerts.touched"
              ariaDescribedBy="alerts-error"
              (valueChange)="valueChange($event)"
              (touch)="touch()"
            />
          </label>
          @if (form.controls.alerts.invalid && form.controls.alerts.touched) {
            <p id="alerts-error" class="m-0 text-sm text-error" role="alert">
              Debes activar las alertas críticas.
            </p>
          }
          <button
            type="submit"
            class="self-start rounded-control bg-primary px-3 py-1.5 text-sm text-on-primary"
          >
            Guardar
          </button>
        </form>
      `,
    };
  },
};

export const ResponsiveNarrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprobar en viewport ~320–400px: label + switch en fila con wrap/`min-w-0`, sin overflow horizontal.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-[20rem] min-w-0">
        <label class="flex min-w-0 flex-wrap items-center justify-between gap-3 text-sm text-on-surface">
          <span class="min-w-0 flex-1">
            Recibir avisos de mantenimiento programado en horarios no laborables
          </span>
          <wi-switch
            ariaLabel="Avisos de mantenimiento"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
        </label>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-3 p-6">
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Default</span>
          <wi-switch ariaLabel="Default" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Checked</span>
          <wi-switch [value]="true" ariaLabel="Checked" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Invalid</span>
          <wi-switch invalid ariaLabel="Invalid" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-on-surface">
          <span>Disabled</span>
          <wi-switch disabled [value]="true" ariaLabel="Disabled" (valueChange)="valueChange($event)" (touch)="touch()" />
        </label>
      </div>
    `,
  }),
};
