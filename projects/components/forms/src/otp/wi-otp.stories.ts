import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fn } from 'storybook/test';

import { WiOtpComponent } from '../public-api';

type WiOtpStoryArgs = WiOtpComponent & {
  valueChange: ReturnType<typeof fn>;
  completed: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<WiOtpStoryArgs> = {
  title: 'Forms/WiOtp',
  component: WiOtpComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Código de un solo uso. `ariaLabel` / labels vía la app (ver Documentation/I18n). Compatible con Reactive Forms y Signal Forms. En ~320px las casillas hacen wrap. Events: `valueChange`, `completed`, `touch`.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiOtpComponent, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    length: { control: 'number' },
    inputMode: {
      control: 'select',
      options: ['numeric', 'text', 'tel'],
    },
    autocomplete: {
      control: 'select',
      options: ['one-time-code', 'off'],
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    autofocus: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al cambiar el valor',
      table: { category: 'Events' },
      control: false,
    },
    completed: {
      action: 'completed',
      description: 'Se emite al completar todos los caracteres',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite en blur (Signal Forms / touched)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    size: 'md',
    length: 6,
    inputMode: 'numeric',
    autocomplete: 'one-time-code',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    autofocus: false,
    ariaLabel: 'Código de verificación',
    valueChange: fn(),
    completed: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiOtpStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: '',
    },
    template: `
      <div class="flex min-w-0 max-w-sm flex-col gap-2">
        <label class="text-sm text-on-surface" [attr.for]="'otp-default'">Código de verificación</label>
        <wi-otp
          id="otp-default"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (completed)="completed($event)"
          (touch)="touch()"
          [length]="length"
          [size]="size"
          [inputMode]="inputMode"
          [autocomplete]="autocomplete"
          [disabled]="disabled"
          [readonly]="readonly"
          [invalid]="invalid"
          [required]="required"
          [ariaLabel]="ariaLabel"
        />
        <p class="text-xs text-on-surface-variant">Valor: {{ value || '—' }}</p>
      </div>
    `,
  }),
};

export const LengthFour: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: '',
    },
    template: `
      <div class="flex min-w-0 flex-col gap-2">
        <wi-otp
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (completed)="completed($event)"
          (touch)="touch()"
          [length]="4"
          [size]="size"
          ariaLabel="PIN de 4 dígitos"
        />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 flex-col gap-4">
        <wi-otp size="sm" ariaLabel="Small" (valueChange)="valueChange($event)" (completed)="completed($event)" (touch)="touch()" />
        <wi-otp size="md" ariaLabel="Medium" (valueChange)="valueChange($event)" (completed)="completed($event)" (touch)="touch()" />
        <wi-otp size="lg" ariaLabel="Large" (valueChange)="valueChange($event)" (completed)="completed($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const TextMode: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: '',
    },
    template: `
      <div class="flex min-w-0 flex-col gap-2">
        <wi-otp
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (completed)="completed($event)"
          (touch)="touch()"
          inputMode="text"
          [length]="6"
          ariaLabel="Código alfanumérico"
        />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-otp disabled value="123456" ariaLabel="Deshabilitado" (valueChange)="valueChange($event)" (completed)="completed($event)" (touch)="touch()" />
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: '000000',
    },
    template: `
      <div class="flex min-w-0 flex-col gap-2">
        <wi-otp
          invalid
          required
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (completed)="completed($event)"
          (touch)="touch()"
          ariaLabel="Código inválido"
          ariaDescribedBy="otp-error"
        />
        <p id="otp-error" class="text-sm text-error" role="alert">Código incorrecto. Inténtalo de nuevo.</p>
      </div>
    `,
  }),
};

export const WithReactiveForms: Story = {
  render: (args) => {
    const form = new FormGroup({
      code: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });

    return {
      props: {
        ...args,
        form,
        submit: () => {
          form.controls.code.markAsTouched();
        },
      },
      template: `
        <form class="flex min-w-0 max-w-sm flex-col gap-3" [formGroup]="form" (ngSubmit)="submit()">
          <label class="text-sm text-on-surface" for="otp-reactive">Código</label>
          <wi-otp
            id="otp-reactive"
            formControlName="code"
            required
            [invalid]="form.controls.code.invalid && form.controls.code.touched"
            ariaDescribedBy="otp-reactive-error"
            (valueChange)="valueChange($event)"
            (completed)="completed($event)"
            (touch)="touch()"
          />
          @if (form.controls.code.invalid && form.controls.code.touched) {
            <p id="otp-reactive-error" class="text-sm text-error" role="alert">
              Introduce los 6 dígitos.
            </p>
          }
          <button type="submit" class="self-start text-sm">Validar</button>
        </form>
      `,
    };
  },
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'En ~320px las casillas hacen wrap (`flex-wrap` + `min-w-0`). Comprobar con el viewport móvil del canvas.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      value: '',
    },
    template: `
      <div class="w-full min-w-0 max-w-[20rem]">
        <wi-otp
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (completed)="completed($event)"
          (touch)="touch()"
          [length]="8"
          ariaLabel="Código de 8 dígitos"
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
      value: '123',
    },
    template: `
      <div class="flex min-w-0 flex-col gap-4 rounded-control bg-background p-4 text-on-background">
        <wi-otp [value]="value" (valueChange)="value = $event; valueChange($event)" (completed)="completed($event)" (touch)="touch()" ariaLabel="Default" />
        <wi-otp invalid value="000000" (valueChange)="valueChange($event)" (completed)="completed($event)" (touch)="touch()" ariaLabel="Invalid" />
        <wi-otp disabled value="123456" (valueChange)="valueChange($event)" (completed)="completed($event)" (touch)="touch()" ariaLabel="Disabled" />
      </div>
    `,
  }),
};
