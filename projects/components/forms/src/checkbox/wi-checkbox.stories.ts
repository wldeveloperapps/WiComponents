import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fn } from 'storybook/test';

import { WiCheckboxComponent } from '../public-api';

type WiCheckboxStoryArgs = WiCheckboxComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<WiCheckboxStoryArgs> = {
  title: 'Forms/WiCheckbox',
  component: WiCheckboxComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Checkbox booleano con soporte indeterminate. `ariaLabel` / textos de label vía la app (ver Documentation/I18n). Compatible con Reactive Forms y Signal Forms. En viewport estrecho se apila con el label en una fila flex con wrap. Events: `valueChange`, `touch`.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiCheckboxComponent, ReactiveFormsModule],
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
    indeterminate: { control: 'boolean' },
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
    indeterminate: false,
    ariaLabel: 'Aceptar términos',
    valueChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiCheckboxStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: false,
    },
    template: `
      <label class="flex min-w-0 max-w-xs items-center gap-2 text-sm text-on-surface">
        <wi-checkbox
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [size]="size"
          [disabled]="disabled"
          [invalid]="invalid"
          [required]="required"
          [indeterminate]="indeterminate"
          [ariaLabel]="ariaLabel"
        />
        <span class="min-w-0">Acepto los términos y condiciones</span>
      </label>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-3">
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox size="sm" ariaLabel="Small" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Small</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox size="md" ariaLabel="Medium" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Medium</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox size="lg" ariaLabel="Large" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Large</span>
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
      <label class="flex min-w-0 max-w-xs items-center gap-2 text-sm text-on-surface">
        <wi-checkbox
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          ariaLabel="Activado"
        />
        <span>Activado</span>
      </label>
    `,
  }),
};

export const Indeterminate: Story = {
  render: (args) => ({
    props: args,
    template: `
      <label class="flex min-w-0 max-w-xs items-center gap-2 text-sm text-on-surface">
        <wi-checkbox
          indeterminate
          ariaLabel="Selección parcial"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <span>Seleccionar todo (parcial)</span>
      </label>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-3">
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox disabled ariaLabel="Deshabilitado off" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Deshabilitado (off)</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox disabled [value]="true" ariaLabel="Deshabilitado on" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Deshabilitado (on)</span>
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
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox
            invalid
            required
            ariaLabel="Aceptar términos"
            ariaDescribedBy="checkbox-error"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
          <span>Acepto los términos</span>
        </label>
        <p id="checkbox-error" class="m-0 text-sm text-error" role="alert">
          Debes aceptar los términos para continuar.
        </p>
      </div>
    `,
  }),
};

export const Group: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fieldset class="m-0 flex min-w-0 max-w-xs flex-col gap-2 border-0 p-0">
        <legend class="mb-1 text-sm font-medium text-on-surface">Canales</legend>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox ariaLabel="Email" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Email</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox [value]="true" ariaLabel="SMS" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>SMS</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox ariaLabel="Push" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Push</span>
        </label>
      </fieldset>
    `,
  }),
};

export const WithReactiveForms: Story = {
  render: (args) => {
    const form = new FormGroup({
      terms: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    });

    return {
      props: {
        ...args,
        form,
        submit: () => {
          form.controls.terms.markAsTouched();
        },
      },
      template: `
        <form
          class="flex min-w-0 max-w-xs flex-col gap-3"
          [formGroup]="form"
          (ngSubmit)="submit()"
        >
          <label class="flex items-center gap-2 text-sm text-on-surface">
            <wi-checkbox
              formControlName="terms"
              required
              [invalid]="form.controls.terms.invalid && form.controls.terms.touched"
              ariaDescribedBy="terms-error"
              (valueChange)="valueChange($event)"
              (touch)="touch()"
            />
            <span>Acepto los términos</span>
          </label>
          @if (form.controls.terms.invalid && form.controls.terms.touched) {
            <p id="terms-error" class="m-0 text-sm text-error" role="alert">
              Debes aceptar los términos.
            </p>
          }
          <button
            type="submit"
            class="self-start rounded-control bg-primary px-3 py-1.5 text-sm text-on-primary"
          >
            Continuar
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
          'Comprobar en viewport ~320–400px: label + control en fila con wrap/`min-w-0`, sin overflow horizontal.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-[20rem] min-w-0">
        <label class="flex min-w-0 flex-wrap items-center gap-2 text-sm text-on-surface">
          <wi-checkbox
            ariaLabel="Newsletter"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
          <span class="min-w-0 flex-1">
            Quiero recibir novedades del producto y avisos de mantenimiento programado
          </span>
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
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox ariaLabel="Default" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Default</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox [value]="true" ariaLabel="Checked" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Checked</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox indeterminate ariaLabel="Indeterminate" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Indeterminate</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox invalid ariaLabel="Invalid" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Invalid</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox disabled [value]="true" ariaLabel="Disabled" (valueChange)="valueChange($event)" (touch)="touch()" />
          <span>Disabled</span>
        </label>
      </div>
    `,
  }),
};
