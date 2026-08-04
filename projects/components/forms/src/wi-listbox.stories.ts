import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fn } from 'storybook/test';

import { WiListboxComponent, WiListboxItemDirective } from './public-api';

const fruitOptions = [
  'Apple',
  'Banana',
  'Blueberry',
  'Grapes',
  'Pineapple',
  'Strawberry',
  'Watermelon',
];

const siteOptions = [
  { id: 'north', name: 'North site' },
  { id: 'south', name: 'South site' },
  { id: 'east', name: 'East operations center with a very long label' },
];

type WiListboxStoryArgs = WiListboxComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<WiListboxStoryArgs> = {
  title: 'Forms/WiListbox',
  component: WiListboxComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Lista siempre visible (single/multi) sin overlay ni filtro. Textos (`emptyText`, `ariaLabel`) los provee la app — ver Documentation/I18n. Compatible con Reactive Forms y Signal Forms. Events: `valueChange`, `touch`.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiListboxComponent, WiListboxItemDirective, ReactiveFormsModule, JsonPipe],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    emptyText: { control: 'text' },
    ariaLabel: { control: 'text' },
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al cambiar el valor',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite en blur / cambio (Signal Forms / touched)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    size: 'md',
    multiple: false,
    disabled: false,
    invalid: false,
    required: false,
    emptyText: 'Sin opciones',
    ariaLabel: 'Fruta',
    valueChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiListboxStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: null as string | null,
    },
    template: `
      <div class="w-full max-w-xs min-w-0">
        <wi-listbox
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          [size]="size"
          [multiple]="multiple"
          [disabled]="disabled"
          [invalid]="invalid"
          [required]="required"
          [emptyText]="emptyText"
          [ariaLabel]="ariaLabel"
        />
        <p class="mt-2 text-xs text-on-surface-variant">Valor: {{ value | json }}</p>
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
      <div class="w-full max-w-xs min-w-0">
        <wi-listbox
          multiple
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          [size]="size"
          [disabled]="disabled"
          [invalid]="invalid"
          [emptyText]="emptyText"
          [ariaLabel]="ariaLabel"
        />
        <p class="mt-2 text-xs text-on-surface-variant">Valor: {{ value | json }}</p>
      </div>
    `,
  }),
};

export const ObjectOptions: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: siteOptions,
      value: 'south' as string | null,
    },
    template: `
      <div class="w-full max-w-xs min-w-0">
        <wi-listbox
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          optionLabel="name"
          optionValue="id"
          [size]="size"
          [disabled]="disabled"
          [invalid]="invalid"
          [emptyText]="emptyText"
          ariaLabel="Sitio"
        />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions.slice(0, 4),
    },
    template: `
      <div class="flex w-full max-w-3xl min-w-0 flex-col gap-4 sm:flex-row">
        <wi-listbox
          class="min-w-0 flex-1"
          size="sm"
          [options]="options"
          ariaLabel="Small"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <wi-listbox
          class="min-w-0 flex-1"
          size="md"
          [options]="options"
          ariaLabel="Medium"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <wi-listbox
          class="min-w-0 flex-1"
          size="lg"
          [options]="options"
          ariaLabel="Large"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions.slice(0, 4),
      value: 'Banana' as string | null,
    },
    template: `
      <div class="w-full max-w-xs min-w-0">
        <wi-listbox
          [value]="value"
          [options]="options"
          disabled
          ariaLabel="Deshabilitado"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions.slice(0, 4),
      value: null as string | null,
    },
    template: `
      <div class="w-full max-w-xs min-w-0">
        <wi-listbox
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          invalid
          required
          emptyText="Sin opciones"
          ariaLabel="Requerido"
        />
      </div>
    `,
  }),
};

export const Empty: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: [] as string[],
    },
    template: `
      <div class="w-full max-w-xs min-w-0">
        <wi-listbox
          [options]="options"
          emptyText="Sin opciones"
          ariaLabel="Vacío"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
      </div>
    `,
  }),
};

export const CustomItem: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: siteOptions,
      value: 'north' as string | null,
    },
    template: `
      <div class="w-full max-w-xs min-w-0">
        <wi-listbox
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          (touch)="touch()"
          [options]="options"
          optionLabel="name"
          optionValue="id"
          ariaLabel="Sitio custom"
        >
          <ng-template wiListboxItem let-option let-selected="selected">
            <span class="flex min-w-0 flex-col">
              <span class="truncate font-medium">{{ option.name }}</span>
              <span class="truncate text-xs text-on-surface-variant">{{ option.id }}{{ selected ? ' · seleccionado' : '' }}</span>
            </span>
          </ng-template>
        </wi-listbox>
      </div>
    `,
  }),
};

export const ReactiveForms: Story = {
  render: (args) => {
    const control = new FormControl<string | null>('b');
    return {
      props: {
        ...args,
        control,
        options: [
          { id: 'a', name: 'Alpha' },
          { id: 'b', name: 'Beta' },
          { id: 'c', name: 'Gamma' },
        ],
      },
      template: `
        <div class="w-full max-w-xs min-w-0">
          <wi-listbox
            [formControl]="control"
            [options]="options"
            optionLabel="name"
            optionValue="id"
            ariaLabel="Reactive"
            (touch)="touch()"
          />
          <p class="mt-2 text-xs text-on-surface-variant">Control: {{ control.value | json }}</p>
        </div>
      `,
    };
  },
};

export const DarkMode: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions.slice(0, 5),
      value: 'Grapes' as string | null,
    },
    template: `
      <div class="wi-dark rounded-control bg-background p-4 text-on-background">
        <div class="w-full max-w-xs min-w-0">
          <wi-listbox
            [value]="value"
            (valueChange)="value = $event; valueChange($event)"
            (touch)="touch()"
            [options]="options"
            ariaLabel="Dark"
          />
        </div>
      </div>
    `,
  }),
};
