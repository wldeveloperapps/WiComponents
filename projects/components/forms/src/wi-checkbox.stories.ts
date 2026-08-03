import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { WiCheckboxComponent } from './public-api';

const meta: Meta<WiCheckboxComponent> = {
  title: 'Forms/WiCheckbox',
  component: WiCheckboxComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Checkbox booleano con soporte indeterminate. `ariaLabel` / textos de label vía la app (ver Documentation/I18n). Compatible con Reactive Forms y Signal Forms. En viewport estrecho se apila con el label en una fila flex con wrap.',
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
  },
  args: {
    size: 'md',
    disabled: false,
    invalid: false,
    required: false,
    indeterminate: false,
    ariaLabel: 'Aceptar términos',
  },
};

export default meta;
type Story = StoryObj<WiCheckboxComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <label class="flex min-w-0 max-w-xs items-center gap-2 text-sm text-on-surface">
        <wi-checkbox
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
  render: () => ({
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-3">
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox size="sm" ariaLabel="Small" />
          <span>Small</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox size="md" ariaLabel="Medium" />
          <span>Medium</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox size="lg" ariaLabel="Large" />
          <span>Large</span>
        </label>
      </div>
    `,
  }),
};

export const Checked: Story = {
  render: () => ({
    template: `
      <label class="flex min-w-0 max-w-xs items-center gap-2 text-sm text-on-surface">
        <wi-checkbox [value]="true" ariaLabel="Activado" />
        <span>Activado</span>
      </label>
    `,
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    template: `
      <label class="flex min-w-0 max-w-xs items-center gap-2 text-sm text-on-surface">
        <wi-checkbox indeterminate ariaLabel="Selección parcial" />
        <span>Seleccionar todo (parcial)</span>
      </label>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-3">
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox disabled ariaLabel="Deshabilitado off" />
          <span>Deshabilitado (off)</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox disabled [value]="true" ariaLabel="Deshabilitado on" />
          <span>Deshabilitado (on)</span>
        </label>
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-2">
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox
            invalid
            required
            ariaLabel="Aceptar términos"
            ariaDescribedBy="checkbox-error"
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
  render: () => ({
    template: `
      <fieldset class="m-0 flex min-w-0 max-w-xs flex-col gap-2 border-0 p-0">
        <legend class="mb-1 text-sm font-medium text-on-surface">Canales</legend>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox ariaLabel="Email" />
          <span>Email</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox [value]="true" ariaLabel="SMS" />
          <span>SMS</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox ariaLabel="Push" />
          <span>Push</span>
        </label>
      </fieldset>
    `,
  }),
};

export const WithReactiveForms: Story = {
  render: () => {
    const form = new FormGroup({
      terms: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    });

    return {
      props: {
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
  render: () => ({
    template: `
      <div class="w-full max-w-[20rem] min-w-0">
        <label class="flex min-w-0 flex-wrap items-center gap-2 text-sm text-on-surface">
          <wi-checkbox ariaLabel="Newsletter" />
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
  render: () => ({
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-3 p-6">
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox ariaLabel="Default" />
          <span>Default</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox [value]="true" ariaLabel="Checked" />
          <span>Checked</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox indeterminate ariaLabel="Indeterminate" />
          <span>Indeterminate</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox invalid ariaLabel="Invalid" />
          <span>Invalid</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-on-surface">
          <wi-checkbox disabled [value]="true" ariaLabel="Disabled" />
          <span>Disabled</span>
        </label>
      </div>
    `,
  }),
};
