import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fn } from 'storybook/test';

import { provideWiIcons } from '../../icon/src/public-api';
import { WI_HEROICONS_CURATED } from '../../icon/heroicons/src/curated';
import { WiSelectComponent, WiSelectItemDirective, WiSelectSelectedDirective } from './public-api';

const fruitOptions = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'];

const siteOptions = [
  { id: 'north', name: 'North site' },
  { id: 'south', name: 'South site' },
  { id: 'east', name: 'East operations center with a very long label' },
];

type WiSelectStoryArgs = WiSelectComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<WiSelectStoryArgs> = {
  title: 'Forms/WiSelect',
  component: WiSelectComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Select single/multi sin búsqueda. En `multiple`, los valores se muestran como chips con aspa para quitarlos. Icono de trigger con input `icon` (nombre en `provideWiIcons`). Textos (`placeholder`, `emptyText`, `clearLabel`, `removeChipLabel`, `ariaLabel`) los provee la app — ver Documentation/I18n. Requiere CSS de overlays CDK/Spartan. Events: `valueChange`, `touch`.',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [provideWiIcons(WI_HEROICONS_CURATED)],
    }),
    moduleMetadata({
      imports: [
        WiSelectComponent,
        WiSelectItemDirective,
        WiSelectSelectedDirective,
        ReactiveFormsModule,
        JsonPipe,
      ],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    multiple: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    placeholder: { control: 'text' },
    emptyText: { control: 'text' },
    clearLabel: { control: 'text' },
    removeChipLabel: { control: 'text' },
    ariaLabel: { control: 'text' },
    icon: {
      control: 'text',
      description:
        'Nombre de cualquier icono registrado con provideWiIcons (p. ej. funnel, clock, calendar)',
    },
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al cambiar el valor',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite al cerrar el panel (Signal Forms / touched)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    size: 'md',
    multiple: false,
    clearable: false,
    disabled: false,
    invalid: false,
    required: false,
    placeholder: 'Selecciona…',
    emptyText: 'Sin opciones',
    clearLabel: 'Limpiar',
    removeChipLabel: 'Quitar',
    ariaLabel: 'Fruta',
    icon: '',
    valueChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiSelectStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: null as string | null,
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          [size]="size"
          [multiple]="multiple"
          [clearable]="clearable"
          [disabled]="disabled"
          [invalid]="invalid"
          [required]="required"
          [placeholder]="placeholder"
          [emptyText]="emptyText"
          [clearLabel]="clearLabel"
          [ariaLabel]="ariaLabel"
          [icon]="icon || undefined"
        />
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: ['Apple', 'Banana'] as string[],
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          multiple
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          placeholder="Selecciona frutas"
          ariaLabel="Frutas"
          clearable
          clearLabel="Limpiar"
          removeChipLabel="Quitar"
        />
      </div>
    `,
  }),
};

export const Objects: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: siteOptions,
      value: null as string | null,
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecciona un sitio"
          ariaLabel="Sitio"
          clearable
          clearLabel="Limpiar"
        />
      </div>
    `,
  }),
};

export const Clearable: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: 'Banana',
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          clearable
          clearLabel="Limpiar selección"
          ariaLabel="Fruta"
        />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: 'Apple',
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          disabled
          ariaLabel="Fruta"
        />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: null as string | null,
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          invalid
          required
          placeholder="Campo requerido"
          ariaLabel="Fruta"
        />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:0.75rem;width:20rem;">
        <wi-select size="sm" [options]="options" placeholder="Small" ariaLabel="Small" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-select size="md" [options]="options" placeholder="Medium" ariaLabel="Medium" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-select size="lg" [options]="options" placeholder="Large" ariaLabel="Large" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const LongLabels: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: siteOptions,
      value: 'east',
    },
    template: `
      <div style="width:16rem;">
        <wi-select
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          optionLabel="name"
          optionValue="id"
          ariaLabel="Sitio"
        />
      </div>
    `,
  }),
};

export const CustomTemplates: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: siteOptions,
      value: null as string | null,
    },
    template: `
      <div style="width:22rem;">
        <wi-select
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          optionLabel="name"
          optionValue="id"
          placeholder="Plantillas custom"
          ariaLabel="Sitio"
        >
          <ng-template wiSelectItem let-option>
            <span style="font-weight:600;">{{ option.id }}</span>
            <span style="opacity:0.7;margin-left:0.5rem;">{{ option.name }}</span>
          </ng-template>
          <ng-template wiSelectSelected let-value>
            Seleccionado: <strong>{{ value }}</strong>
          </ng-template>
        </wi-select>
      </div>
    `,
  }),
};

export const EmptyOptions: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="width:20rem;">
        <wi-select
          [options]="[]"
          placeholder="Sin datos"
          emptyText="No hay opciones disponibles"
          ariaLabel="Vacío"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
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
      options: fruitOptions,
      value: 'Grapes',
    },
    template: `
      <div style="width:20rem;padding:1.5rem;">
        <wi-select
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          clearable
          clearLabel="Limpiar"
          ariaLabel="Fruta"
        />
      </div>
    `,
  }),
};

export const ReactiveForms: Story = {
  render: (args) => {
    const control = new FormControl<string | null>(null);
    return {
      props: {
        ...args,
        control,
        options: siteOptions,
      },
      template: `
        <div style="width:20rem;display:flex;flex-direction:column;gap:0.75rem;">
          <wi-select
            [formControl]="control"
            [options]="options"
            optionLabel="name"
            optionValue="id"
            placeholder="Reactive Forms"
            ariaLabel="Sitio"
            clearable
            clearLabel="Limpiar"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
          <pre style="margin:0;font-size:0.75rem;">value: {{ control.value | json }}</pre>
        </div>
      `,
    };
  },
};
