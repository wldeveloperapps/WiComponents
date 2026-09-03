import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { JsonPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fn } from 'storybook/test';

import { WiPicklistComponent, WiPicklistItemDirective } from '../public-api';

const fruitOptions = [
  'Apple',
  'Banana',
  'Blueberry',
  'Grapes',
  'Pineapple',
  'Strawberry',
  'Watermelon',
];

const memberOptions = [
  { id: 'ana', name: 'Ana López', role: 'Editor', site: 'Norte' },
  { id: 'bruno', name: 'Bruno Díaz', role: 'Viewer', site: 'Sur' },
  { id: 'carla', name: 'Carla Mendes', role: 'Admin', site: 'Este' },
  { id: 'diego', name: 'Diego Hart', role: 'Editor', site: 'Oeste' },
  { id: 'eva', name: 'Eva Navarro', role: 'Viewer', site: 'Centro' },
];

/**
 * Tarjeta de demo (como haría la app). No forma parte de `@wiloc/ui`.
 * El acordeón usa `stopPropagation` para no mezclar expandir con seleccionar.
 */
@Component({
  selector: 'sb-picklist-member-card',
  template: `
    <article
      class="w-full min-w-0 overflow-hidden rounded-control border border-outline-variant bg-surface text-on-surface"
    >
      <button
        class="flex w-full min-w-0 items-center justify-between gap-2 bg-primary-container px-2 py-1.5 text-left text-sm font-medium text-on-primary-container"
        type="button"
        [attr.aria-expanded]="open()"
        (click)="toggle($event)"
      >
        <span class="min-w-0 truncate">{{ member().name }}</span>
        <span class="shrink-0 text-xs" aria-hidden="true">{{ open() ? '▴' : '▾' }}</span>
      </button>
      @if (open()) {
        <dl class="grid grid-cols-1 gap-x-3 gap-y-1 p-2 text-xs text-on-surface sm:grid-cols-2">
          <div class="min-w-0">
            <dt class="text-on-surface-variant">Rol</dt>
            <dd class="truncate font-medium">{{ member().role }}</dd>
          </div>
          <div class="min-w-0">
            <dt class="text-on-surface-variant">Sitio</dt>
            <dd class="truncate font-medium">{{ member().site }}</dd>
          </div>
          <div class="min-w-0 sm:col-span-2">
            <dt class="text-on-surface-variant">Id</dt>
            <dd class="truncate font-medium">{{ member().id }}</dd>
          </div>
        </dl>
      }
    </article>
  `,
})
class SbPicklistMemberCard {
  readonly member = input.required<{ id: string; name: string; role: string; site: string }>();
  protected readonly open = signal(false);

  protected toggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.open.update((isOpen) => !isOpen);
  }
}

type WiPicklistStoryArgs = WiPicklistComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<WiPicklistStoryArgs> = {
  title: 'Forms/WiPicklist',
  component: WiPicklistComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dos listbox (disponibles / asignados) con transferencia. `options` es el universo; `value` son los asignados. Textos (`sourceHeader`, empty, aria de botones) los provee la app — ver Documentation/I18n. En contenedor estrecho (~320px) se apila y las flechas rotan (container query). Sin filtro, drag-and-drop ni reorder. Events: `valueChange`, `touch`.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        WiPicklistComponent,
        WiPicklistItemDirective,
        SbPicklistMemberCard,
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
    sourceHeader: { control: 'text' },
    targetHeader: { control: 'text' },
    sourceEmptyText: { control: 'text' },
    targetEmptyText: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    showMoveAll: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al cambiar los asignados',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite al interactuar o transferir (Signal Forms / touched)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    size: 'md',
    sourceHeader: 'Disponibles',
    targetHeader: 'Asignados',
    sourceEmptyText: 'Sin disponibles',
    targetEmptyText: 'Sin asignados',
    sourceAriaLabel: 'Disponibles',
    targetAriaLabel: 'Asignados',
    moveToTargetLabel: 'Mover seleccionados a asignados',
    moveAllToTargetLabel: 'Mover todos a asignados',
    moveToSourceLabel: 'Quitar seleccionados de asignados',
    moveAllToSourceLabel: 'Quitar todos de asignados',
    disabled: false,
    invalid: false,
    required: false,
    showMoveAll: true,
    ariaLabel: 'Asignación',
    valueChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiPicklistStoryArgs>;

const BINDINGS = `
  [size]="size"
  [sourceHeader]="sourceHeader"
  [targetHeader]="targetHeader"
  [sourceEmptyText]="sourceEmptyText"
  [targetEmptyText]="targetEmptyText"
  [sourceAriaLabel]="sourceAriaLabel"
  [targetAriaLabel]="targetAriaLabel"
  [moveToTargetLabel]="moveToTargetLabel"
  [moveAllToTargetLabel]="moveAllToTargetLabel"
  [moveToSourceLabel]="moveToSourceLabel"
  [moveAllToSourceLabel]="moveAllToSourceLabel"
  [disabled]="disabled"
  [invalid]="invalid"
  [required]="required"
  [showMoveAll]="showMoveAll"
  [ariaLabel]="ariaLabel"
  (touch)="touch()"
`;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: ['Banana'] as string[],
    },
    template: `
      <div class="w-full max-w-3xl min-w-0">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          ${BINDINGS}
        />
        <p class="mt-2 text-xs text-on-surface-variant">Asignados: {{ value | json }}</p>
      </div>
    `,
  }),
};

export const ObjectOptions: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: memberOptions,
      value: ['carla'] as string[],
    },
    template: `
      <div class="w-full min-w-0 max-w-3xl">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          optionLabel="name"
          optionValue="id"
          ${BINDINGS}
        />
        <p class="mt-2 text-xs text-on-surface-variant">Asignados: {{ value | json }}</p>
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
      <div class="flex w-full min-w-0 max-w-3xl flex-col gap-6">
        <wi-picklist
          size="sm"
          [options]="options"
          sourceHeader="Disponibles sm"
          targetHeader="Asignados sm"
          sourceEmptyText="Sin disponibles"
          targetEmptyText="Sin asignados"
          moveToTargetLabel="Mover a asignados"
          moveAllToTargetLabel="Mover todos"
          moveToSourceLabel="Quitar de asignados"
          moveAllToSourceLabel="Quitar todos"
          ariaLabel="Small"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <wi-picklist
          size="md"
          [options]="options"
          sourceHeader="Disponibles md"
          targetHeader="Asignados md"
          sourceEmptyText="Sin disponibles"
          targetEmptyText="Sin asignados"
          moveToTargetLabel="Mover a asignados"
          moveAllToTargetLabel="Mover todos"
          moveToSourceLabel="Quitar de asignados"
          moveAllToSourceLabel="Quitar todos"
          ariaLabel="Medium"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <wi-picklist
          size="lg"
          [options]="options"
          sourceHeader="Disponibles lg"
          targetHeader="Asignados lg"
          sourceEmptyText="Sin disponibles"
          targetEmptyText="Sin asignados"
          moveToTargetLabel="Mover a asignados"
          moveAllToTargetLabel="Mover todos"
          moveToSourceLabel="Quitar de asignados"
          moveAllToSourceLabel="Quitar todos"
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
      value: ['Apple'] as string[],
      disabled: true,
    },
    template: `
      <div class="w-full min-w-0 max-w-3xl">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          ${BINDINGS}
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
      value: [] as string[],
      invalid: true,
      required: true,
    },
    template: `
      <div class="w-full min-w-0 max-w-3xl">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          ${BINDINGS}
        />
        <p class="mt-2 text-sm text-error" role="alert">Asigna al menos un elemento.</p>
      </div>
    `,
  }),
};

export const WithoutMoveAll: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: ['Grapes'] as string[],
      showMoveAll: false,
    },
    template: `
      <div class="w-full min-w-0 max-w-3xl">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          ${BINDINGS}
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
      value: [] as string[],
    },
    template: `
      <div class="w-full min-w-0 max-w-3xl">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          ${BINDINGS}
        />
      </div>
    `,
  }),
};

export const CustomItem: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'La app proyecta su propio componente con `ng-template wiPicklistItem`. El picklist solo transfiere; layout, datos y acordeón viven en la app. Altura de lista: `--wi-picklist-list-max-height`.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      options: memberOptions,
      value: ['ana'] as string[],
    },
    template: `
      <div class="w-full min-w-0 max-w-4xl [--wi-picklist-list-max-height:28rem]">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          optionLabel="name"
          optionValue="id"
          ${BINDINGS}
        >
          <ng-template wiPicklistItem let-option>
            <sb-picklist-member-card [member]="option" />
          </ng-template>
        </wi-picklist>
      </div>
    `,
  }),
};

export const ReactiveForms: Story = {
  render: (args) => {
    const control = new FormControl<string[]>(['b']);
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
        <div class="w-full min-w-0 max-w-3xl">
          <wi-picklist
            [formControl]="control"
            [options]="options"
            optionLabel="name"
            optionValue="id"
            sourceHeader="Disponibles"
            targetHeader="Asignados"
            sourceEmptyText="Sin disponibles"
            targetEmptyText="Sin asignados"
            moveToTargetLabel="Mover a asignados"
            moveAllToTargetLabel="Mover todos"
            moveToSourceLabel="Quitar de asignados"
            moveAllToSourceLabel="Quitar todos"
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
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions.slice(0, 5),
      value: ['Grapes'] as string[],
    },
    template: `
      <div class="w-full min-w-0 max-w-3xl p-6">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          ${BINDINGS}
        />
      </div>
    `,
  }),
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A ~320px (ancho del propio contenedor, container query) las listas se apilan (disponibles → botones → asignados) y las flechas rotan 90°. A partir de `@md` (~28rem) quedan en fila con transferencia horizontal.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      options: fruitOptions,
      value: ['Banana'] as string[],
    },
    template: `
      <div class="w-[320px] min-w-0 max-w-full">
        <wi-picklist
          [options]="options"
          [value]="value"
          (valueChange)="value = $event; valueChange($event)"
          ${BINDINGS}
        />
      </div>
    `,
  }),
};
