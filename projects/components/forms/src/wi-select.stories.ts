import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideWiIcons } from '../../icon/src/public-api';
import { WI_HEROICONS_CURATED } from '../../icon/heroicons/src/curated';
import { WiSelectComponent, WiSelectItemDirective, WiSelectSelectedDirective } from './public-api';

const fruitOptions = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'];

const siteOptions = [
  { id: 'north', name: 'North site' },
  { id: 'south', name: 'South site' },
  { id: 'east', name: 'East operations center with a very long label' },
];

const meta: Meta<WiSelectComponent> = {
  title: 'Forms/WiSelect',
  component: WiSelectComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Select single/multi sin búsqueda. En `multiple`, los valores se muestran como chips con aspa para quitarlos. Icono de trigger con input `icon` (nombre en `provideWiIcons`). Textos (`placeholder`, `emptyText`, `clearLabel`, `removeChipLabel`, `ariaLabel`) los provee la app — ver Documentation/I18n. Requiere CSS de overlays CDK/Spartan.',
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
  },
};

export default meta;
type Story = StoryObj<WiSelectComponent>;

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
          [(value)]="value"
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
  render: () => ({
    props: {
      options: fruitOptions,
      value: ['Apple', 'Banana'] as string[],
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          multiple
          [(value)]="value"
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
  render: () => ({
    props: {
      options: siteOptions,
      value: null as string | null,
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [(value)]="value"
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
  render: () => ({
    props: {
      options: fruitOptions,
      value: 'Banana',
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [(value)]="value"
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
  render: () => ({
    props: {
      options: fruitOptions,
      value: 'Apple',
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [(value)]="value"
          [options]="options"
          disabled
          ariaLabel="Fruta"
        />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: () => ({
    props: {
      options: fruitOptions,
      value: null as string | null,
    },
    template: `
      <div style="width:20rem;">
        <wi-select
          [(value)]="value"
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
  render: () => ({
    props: { options: fruitOptions },
    template: `
      <div style="display:flex;flex-direction:column;gap:0.75rem;width:20rem;">
        <wi-select size="sm" [options]="options" placeholder="Small" ariaLabel="Small" />
        <wi-select size="md" [options]="options" placeholder="Medium" ariaLabel="Medium" />
        <wi-select size="lg" [options]="options" placeholder="Large" ariaLabel="Large" />
      </div>
    `,
  }),
};

export const LongLabels: Story = {
  render: () => ({
    props: {
      options: siteOptions,
      value: 'east',
    },
    template: `
      <div style="width:16rem;">
        <wi-select
          [(value)]="value"
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
  render: () => ({
    props: {
      options: siteOptions,
      value: null as string | null,
    },
    template: `
      <div style="width:22rem;">
        <wi-select
          [(value)]="value"
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
  render: () => ({
    template: `
      <div style="width:20rem;">
        <wi-select
          [options]="[]"
          placeholder="Sin datos"
          emptyText="No hay opciones disponibles"
          ariaLabel="Vacío"
        />
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  render: () => ({
    props: {
      options: fruitOptions,
      value: 'Grapes',
    },
    template: `
      <div class="wi-dark" style="width:20rem;padding:1.5rem;background:var(--wi-color-background);">
        <wi-select
          [(value)]="value"
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
  render: () => {
    const control = new FormControl<string | null>(null);
    return {
      props: {
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
          />
          <pre style="margin:0;font-size:0.75rem;">value: {{ control.value | json }}</pre>
        </div>
      `,
    };
  },
};
