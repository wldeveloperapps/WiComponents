import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fn } from 'storybook/test';

import { WiInputComponent } from '../public-api';

type WiInputStoryArgs = WiInputComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const hideFromDocs = { table: { disable: true }, control: false } as const;

const hiddenInputInternals: Record<string, typeof hideFromDocs> = {
  cvaDisabled: hideFromDocs,
  onChange: hideFromDocs,
  onTouched: hideFromDocs,
  generatedId: hideFromDocs,
  revealed: hideFromDocs,
  toggleButtonClasses: hideFromDocs,
  resolvedId: hideFromDocs,
  isDisabled: hideFromDocs,
  showToggle: hideFromDocs,
  nativeType: hideFromDocs,
  toggleAriaLabel: hideFromDocs,
  classes: hideFromDocs,
  writeValue: hideFromDocs,
  registerOnChange: hideFromDocs,
  registerOnTouched: hideFromDocs,
  setDisabledState: hideFromDocs,
  togglePasswordVisibility: hideFromDocs,
  onNativeInput: hideFromDocs,
  onNativeBlur: hideFromDocs,
};

const meta: Meta<WiInputStoryArgs> = {
  title: 'Forms/WiInput',
  component: WiInputComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'value',
        'size',
        'type',
        'placeholder',
        'id',
        'name',
        'autocomplete',
        'ariaLabel',
        'ariaDescribedBy',
        'disabled',
        'readonly',
        'invalid',
        'required',
        'passwordToggle',
        'showPasswordLabel',
        'hidePasswordLabel',
      ],
    },
    docs: {
      description: {
        component:
          'Campo de texto. Con `type="password"` incluye botón de revelar/ocultar (`passwordToggle`, labels accesibles). `placeholder` / `ariaLabel` / hints vía la app (ver Documentation/I18n). Compatible con Reactive Forms y Signal Forms. Events: `valueChange`, `touch`. El autocompletado nativo se ancla al viewport (se despega en overflow interno); en shells con scroll usa `autocomplete="off"` (los filtros de `wi-table` ya lo hacen).',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiInputComponent, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    value: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
    },
    placeholder: { control: 'text' },
    id: { control: 'text' },
    name: { control: 'text' },
    ariaDescribedBy: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    passwordToggle: {
      control: 'boolean',
      description: 'Botón de revelar/ocultar cuando type="password"',
    },
    showPasswordLabel: {
      control: 'text',
      description: 'aria-label del botón cuando la contraseña está oculta',
    },
    hidePasswordLabel: {
      control: 'text',
      description: 'aria-label del botón cuando la contraseña está visible',
    },
    autocomplete: { control: 'text' },
    ariaLabel: { control: 'text' },
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al cambiar el valor',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite en blur (Signal Forms / touched)',
      table: { category: 'Events' },
      control: false,
    },
    ...hiddenInputInternals,
  },
  args: {
    value: '',
    size: 'md',
    type: 'text',
    placeholder: 'Escribe aquí…',
    id: '',
    name: '',
    autocomplete: '',
    ariaDescribedBy: '',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    passwordToggle: true,
    showPasswordLabel: 'Mostrar contraseña',
    hidePasswordLabel: 'Ocultar contraseña',
    ariaLabel: 'Nombre',
    valueChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiInputStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="width:20rem;">
        <wi-input
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [size]="size"
          [type]="type"
          [placeholder]="placeholder"
          [id]="id"
          [name]="name"
          [disabled]="disabled"
          [readonly]="readonly"
          [invalid]="invalid"
          [required]="required"
          [passwordToggle]="passwordToggle"
          [showPasswordLabel]="showPasswordLabel"
          [hidePasswordLabel]="hidePasswordLabel"
          [autocomplete]="autocomplete"
          [ariaLabel]="ariaLabel"
          [ariaDescribedBy]="ariaDescribedBy"
        />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;flex-direction:column;gap:0.75rem;width:20rem;">
        <wi-input size="sm" placeholder="Small" ariaLabel="Small" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-input size="md" placeholder="Medium" ariaLabel="Medium" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-input size="lg" placeholder="Large" ariaLabel="Large" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const Types: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;flex-direction:column;gap:0.75rem;width:20rem;">
        <wi-input type="text" placeholder="Texto" ariaLabel="Texto" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-input type="email" placeholder="correo@ejemplo.com" ariaLabel="Email" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-input type="password" placeholder="Contraseña" ariaLabel="Contraseña" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-input type="search" placeholder="Buscar…" ariaLabel="Buscar" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="width:20rem;">
        <wi-input disabled value="No editable" ariaLabel="Deshabilitado" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const Readonly: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="width:20rem;">
        <wi-input readonly value="Solo lectura" ariaLabel="Solo lectura" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: 'valor-invalido',
    },
    template: `
      <div style="width:20rem;">
        <wi-input
          invalid
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          ariaLabel="Campo inválido"
          ariaDescribedBy="hint-invalid"
        />
        <p id="hint-invalid" style="margin:0.5rem 0 0;font-size:0.875rem;color:var(--wi-color-error);">
          Introduce un valor válido.
        </p>
      </div>
    `,
  }),
};

export const WithReactiveForms: Story = {
  render: (args) => {
    const form = new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
    });

    return {
      props: {
        ...args,
        form,
        markTouched: () => {
          form.controls.email.markAsTouched();
        },
      },
      template: `
        <form [formGroup]="form" style="display:flex;flex-direction:column;gap:0.75rem;width:20rem;" (ngSubmit)="markTouched()">
          <label for="email-demo" style="font-size:0.875rem;">Email</label>
          <wi-input
            id="email-demo"
            type="email"
            formControlName="email"
            placeholder="correo@ejemplo.com"
            [invalid]="form.controls.email.invalid && form.controls.email.touched"
            [required]="true"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
          @if (form.controls.email.invalid && form.controls.email.touched) {
            <p style="margin:0;font-size:0.875rem;color:var(--wi-color-error);" role="alert">
              Introduce un email válido.
            </p>
          }
          <button type="submit" style="align-self:start;">Validar</button>
        </form>
      `,
    };
  },
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="wi-dark bg-background text-on-background" style="display:flex;flex-direction:column;gap:0.75rem;width:20rem;padding:1.5rem;">
        <wi-input placeholder="Default" ariaLabel="Default" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-input invalid placeholder="Invalid" ariaLabel="Invalid" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-input disabled value="Disabled" ariaLabel="Disabled" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};
